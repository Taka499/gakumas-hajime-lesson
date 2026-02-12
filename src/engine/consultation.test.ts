import { describe, expect, test } from "bun:test";
import { calculateConsultationParams } from "./consultation.ts";
import { Week } from "./types.ts";

describe("calculateConsultationParams", () => {
  test("Week 5 consultation", () => {
    const result = calculateConsultationParams(Week.WEEK_5);
    expect(result.vocal).toBe(40);
    expect(result.dance).toBe(40);
    expect(result.visual).toBe(40);
    expect(result.estimated).toBe(true);
  });

  test("Week 8 consultation", () => {
    const result = calculateConsultationParams(Week.WEEK_8);
    expect(result.vocal).toBe(55);
    expect(result.dance).toBe(55);
    expect(result.visual).toBe(55);
  });

  test("Week 17 consultation", () => {
    const result = calculateConsultationParams(Week.WEEK_17);
    expect(result.vocal).toBe(90);
    expect(result.dance).toBe(90);
    expect(result.visual).toBe(90);
  });

  test("Invalid week returns zeros", () => {
    const result = calculateConsultationParams(Week.WEEK_4);
    expect(result.vocal).toBe(0);
    expect(result.estimated).toBe(true);
  });
});
