import { describe, expect, test } from "bun:test";
import { calculateOutingParams } from "./outing.ts";
import { Week } from "./types.ts";

describe("calculateOutingParams", () => {
  test("returns zero gains (placeholder for support card effects)", () => {
    const result = calculateOutingParams(Week.WEEK_3);
    expect(result.vocal).toBe(0);
    expect(result.dance).toBe(0);
    expect(result.visual).toBe(0);
    expect(result.estimated).toBe(false);
  });

  test("any week returns zero gains", () => {
    const result = calculateOutingParams(Week.WEEK_13);
    expect(result.vocal).toBe(0);
    expect(result.dance).toBe(0);
    expect(result.visual).toBe(0);
  });
});
