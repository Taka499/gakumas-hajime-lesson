import { describe, expect, test } from "bun:test";
import { calculateRegularLessonParams } from "./regular.ts";
import { ParameterType, Slot1Item, Week } from "./types.ts";

describe("calculateRegularLessonParams", () => {
  test("Week 1 with no item, selecting Vocal", () => {
    const result = calculateRegularLessonParams(
      Week.WEEK_1,
      ParameterType.VOCAL,
      Slot1Item.NONE,
    );
    expect(result.vocal).toBe(70);
    expect(result.dance).toBe(23);
    expect(result.visual).toBe(23);
    expect(result.estimated).toBe(true);
  });

  test("Week 6 with no item, selecting Dance", () => {
    const result = calculateRegularLessonParams(
      Week.WEEK_6,
      ParameterType.DANCE,
      Slot1Item.NONE,
    );
    expect(result.vocal).toBe(45);
    expect(result.dance).toBe(150);
    expect(result.visual).toBe(45);
    expect(result.estimated).toBe(true);
  });

  test("Week 15 with Vocal Textbook, selecting Vocal", () => {
    const result = calculateRegularLessonParams(
      Week.WEEK_15,
      ParameterType.VOCAL,
      Slot1Item.VOCAL_TEXTBOOK,
    );
    // Base: floor(200 * 1.1) = 220, then floor(220 * 1.085) = 238
    expect(result.vocal).toBe(238);
    // Non-selected: floor(55 * 1.1) = 60
    expect(result.dance).toBe(60);
    expect(result.visual).toBe(60);
  });

  test("Week 2 with Voice Recorder, selecting Vocal, below 17 cards", () => {
    const result = calculateRegularLessonParams(
      Week.WEEK_2,
      ParameterType.VOCAL,
      Slot1Item.VOICE_RECORDER,
      10, // below 17 threshold
    );
    // No recorder bonus since skill cards < 17
    expect(result.vocal).toBe(70);
    expect(result.dance).toBe(23);
    expect(result.visual).toBe(23);
  });

  test("Week 2 with Voice Recorder, selecting Vocal, at 17 cards", () => {
    const result = calculateRegularLessonParams(
      Week.WEEK_2,
      ParameterType.VOCAL,
      Slot1Item.VOICE_RECORDER,
      17,
    );
    expect(result.vocal).toBe(85); // 70 + 15
  });

  test("Invalid week returns zeros", () => {
    const result = calculateRegularLessonParams(
      Week.WEEK_10, // exam week, no regular lesson data
      ParameterType.VOCAL,
      Slot1Item.NONE,
    );
    expect(result.vocal).toBe(0);
    expect(result.estimated).toBe(true);
  });
});
