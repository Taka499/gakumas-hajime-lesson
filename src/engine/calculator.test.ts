import { describe, expect, test } from "bun:test";
import {
  calculateLessonParams,
  calculateTotalParams,
  LessonWeek,
  ParameterType,
  Slot1Item,
} from "./calculator.ts";

describe("calculateLessonParams", () => {
  test("Week 4 with no item, selecting Vocal", () => {
    const result = calculateLessonParams(
      LessonWeek.WEEK_4,
      ParameterType.VOCAL,
      Slot1Item.NONE,
    );
    expect(result.vocal).toBe(140);
    expect(result.dance).toBe(55);
    expect(result.visual).toBe(55);
  });

  test("Week 16 with no item, selecting Dance", () => {
    const result = calculateLessonParams(
      LessonWeek.WEEK_16,
      ParameterType.DANCE,
      Slot1Item.NONE,
    );
    expect(result.vocal).toBe(115);
    expect(result.dance).toBe(570);
    expect(result.visual).toBe(115);
  });

  test("Week 4 with Vocal Textbook, selecting Vocal", () => {
    const result = calculateLessonParams(
      LessonWeek.WEEK_4,
      ParameterType.VOCAL,
      Slot1Item.VOCAL_TEXTBOOK,
    );
    // Base: floor(140 * 1.1) = 154, then floor(154 * 1.085) = 167
    expect(result.vocal).toBe(167);
    // Base: floor(55 * 1.1) = 60
    expect(result.dance).toBe(60);
    expect(result.visual).toBe(60);
  });

  test("Week 4 with Voice Recorder, selecting Vocal", () => {
    const result = calculateLessonParams(
      LessonWeek.WEEK_4,
      ParameterType.VOCAL,
      Slot1Item.VOICE_RECORDER,
    );
    expect(result.vocal).toBe(155); // 140 + 15
    expect(result.dance).toBe(55);
    expect(result.visual).toBe(55);
  });

  test("Week 12 with Dance Textbook, selecting Visual", () => {
    const result = calculateLessonParams(
      LessonWeek.WEEK_12,
      ParameterType.VISUAL,
      Slot1Item.DANCE_TEXTBOOK,
    );
    // Selected Visual: floor(260 * 1.1) = 286
    expect(result.visual).toBe(286);
    // Non-selected Vocal: floor(70 * 1.1) = 77
    expect(result.vocal).toBe(77);
    // Non-selected Dance with textbook: floor(floor(70 * 1.1) * 1.085) = floor(77 * 1.085) = 83
    expect(result.dance).toBe(83);
  });
});

describe("calculateTotalParams", () => {
  test("All lessons selecting same param with no item", () => {
    const choices = [
      { week: LessonWeek.WEEK_4, selectedParam: ParameterType.VOCAL },
      { week: LessonWeek.WEEK_7, selectedParam: ParameterType.VOCAL },
      { week: LessonWeek.WEEK_12, selectedParam: ParameterType.VOCAL },
      { week: LessonWeek.WEEK_14, selectedParam: ParameterType.VOCAL },
      { week: LessonWeek.WEEK_16, selectedParam: ParameterType.VOCAL },
    ];
    const total = calculateTotalParams(choices, Slot1Item.NONE);
    // Vocal: 140 + 180 + 260 + 370 + 570 = 1520
    expect(total.vocal).toBe(1520);
    // Others: 55 + 60 + 70 + 90 + 115 = 390
    expect(total.dance).toBe(390);
    expect(total.visual).toBe(390);
  });
});
