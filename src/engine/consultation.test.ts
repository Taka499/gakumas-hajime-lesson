import { describe, expect, test } from "bun:test";
import { calculateConsultationParams } from "./consultation.ts";
import { Week } from "./types.ts";

describe("calculateConsultationParams", () => {
  test("returns zero gains (placeholder for support card effects)", () => {
    const result = calculateConsultationParams(Week.WEEK_5);
    expect(result.vocal).toBe(0);
    expect(result.dance).toBe(0);
    expect(result.visual).toBe(0);
    expect(result.estimated).toBe(false);
  });

  test("any week returns zero gains", () => {
    const result = calculateConsultationParams(Week.WEEK_17);
    expect(result.vocal).toBe(0);
    expect(result.dance).toBe(0);
    expect(result.visual).toBe(0);
  });
});
