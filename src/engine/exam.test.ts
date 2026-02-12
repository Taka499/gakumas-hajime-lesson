import { describe, expect, test } from "bun:test";
import { calculateEvaluation, checkPenalty } from "./exam.ts";

describe("calculateEvaluation", () => {
  test("Basic evaluation with zero exam scores", () => {
    const params = { vocal: 1000, dance: 1000, visual: 1000 };
    const result = calculateEvaluation(params, 0, 0);
    // 3000 × 2.1 = 6300
    expect(result).toBe(6300);
  });

  test("Evaluation with exam scores", () => {
    const params = { vocal: 2000, dance: 1500, visual: 1800 };
    const result = calculateEvaluation(params, 150000, 1500000);
    // 5300 × 2.1 = 11130 + 150000 + 1500000 = 1661130
    expect(result).toBe(1661130);
  });

  test("Evaluation with realistic Phase 2 totals", () => {
    const params = { vocal: 2300, dance: 800, visual: 800 };
    const result = calculateEvaluation(params, 0, 0);
    // 3900 × 2.1 = 8190
    expect(result).toBe(8190);
  });
});

describe("checkPenalty", () => {
  test("No penalty when all params above threshold", () => {
    const params = { vocal: 2000, dance: 2000, visual: 2000 };
    const result = checkPenalty(params, 1.0);
    // threshold = floor(8000 * 1.0 / 9) = 888
    expect(result.hasPenalty).toBe(false);
    expect(result.belowThreshold).toEqual([]);
    expect(result.threshold).toBe(888);
  });

  test("Penalty when one param below threshold", () => {
    const params = { vocal: 2000, dance: 500, visual: 2000 };
    const result = checkPenalty(params, 1.0);
    expect(result.hasPenalty).toBe(true);
    expect(result.belowThreshold).toEqual(["Dance"]);
  });

  test("Multiple params below threshold", () => {
    const params = { vocal: 100, dance: 100, visual: 100 };
    const result = checkPenalty(params, 1.0);
    expect(result.hasPenalty).toBe(true);
    expect(result.belowThreshold).toEqual(["Vocal", "Dance", "Visual"]);
  });

  test("Threshold scales with exam multiplier", () => {
    const params = { vocal: 1000, dance: 1000, visual: 1000 };
    const result = checkPenalty(params, 2.0);
    // threshold = floor(8000 * 2.0 / 9) = 1777
    expect(result.threshold).toBe(1777);
    expect(result.hasPenalty).toBe(true);
  });
});
