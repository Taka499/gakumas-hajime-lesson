import { describe, expect, test } from "bun:test";
import { calculateOutingParams } from "./outing.ts";
import { Week } from "./types.ts";

describe("calculateOutingParams", () => {
  test("Week 3 outing", () => {
    const result = calculateOutingParams(Week.WEEK_3);
    expect(result.vocal).toBe(25);
    expect(result.dance).toBe(25);
    expect(result.visual).toBe(25);
    expect(result.estimated).toBe(true);
  });

  test("Week 11 outing", () => {
    const result = calculateOutingParams(Week.WEEK_11);
    expect(result.vocal).toBe(50);
    expect(result.dance).toBe(50);
    expect(result.visual).toBe(50);
  });

  test("Week 13 outing", () => {
    const result = calculateOutingParams(Week.WEEK_13);
    expect(result.vocal).toBe(60);
    expect(result.dance).toBe(60);
    expect(result.visual).toBe(60);
  });

  test("Invalid week returns zeros", () => {
    const result = calculateOutingParams(Week.WEEK_7);
    expect(result.vocal).toBe(0);
    expect(result.estimated).toBe(true);
  });
});
