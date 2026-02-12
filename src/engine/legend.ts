import { type LessonResult, ParameterType, Slot1Item, type Week } from "./types.ts";
import { LEGEND_LESSON_VALUES } from "./constants.ts";

// Which parameter each Textbook boosts
const TEXTBOOK_PARAM: Partial<Record<Slot1Item, ParameterType>> = {
  [Slot1Item.VOCAL_TEXTBOOK]: ParameterType.VOCAL,
  [Slot1Item.DANCE_TEXTBOOK]: ParameterType.DANCE,
  [Slot1Item.VISUAL_TEXTBOOK]: ParameterType.VISUAL,
};

// Which parameter each Recorder boosts
const RECORDER_PARAM: Partial<Record<Slot1Item, ParameterType>> = {
  [Slot1Item.VOICE_RECORDER]: ParameterType.VOCAL,
  [Slot1Item.PORTABLE_SPEAKER]: ParameterType.DANCE,
  [Slot1Item.MAKEUP_MIRROR]: ParameterType.VISUAL,
};

/**
 * Apply Slot 1 item effects to a lesson result.
 * Textbook: +10% to all gains, then +8.5% to the textbook's stat (floor at each step).
 * Recorder: +15 flat to one stat when skillCardCount >= 17.
 *
 * Exported for reuse by regular lesson calculations.
 */
export function applySlot1Effects(
  result: LessonResult,
  slot1Item: Slot1Item,
  skillCardCount: number,
): LessonResult {
  const out = { ...result };

  const textbookParam = TEXTBOOK_PARAM[slot1Item];
  if (textbookParam !== undefined) {
    out.vocal = Math.floor(out.vocal * 1.1);
    out.dance = Math.floor(out.dance * 1.1);
    out.visual = Math.floor(out.visual * 1.1);
    out[textbookParam] = Math.floor(out[textbookParam] * 1.085);
  }

  const recorderParam = RECORDER_PARAM[slot1Item];
  if (recorderParam !== undefined && skillCardCount >= 17) {
    out[recorderParam] += 15;
  }

  return out;
}

/**
 * Calculate parameter gains for a single Legend Lesson.
 * skillCardCount defaults to 17 for backwards compatibility (Recorder always activates).
 */
export function calculateLegendLessonParams(
  week: Week,
  selectedParam: ParameterType,
  slot1Item: Slot1Item,
  skillCardCount = 17,
): LessonResult {
  const values = LEGEND_LESSON_VALUES[week];
  if (!values) {
    return { vocal: 0, dance: 0, visual: 0 };
  }

  const result: LessonResult = {
    vocal: values.nonSelected,
    dance: values.nonSelected,
    visual: values.nonSelected,
  };
  result[selectedParam] = values.selected;

  return applySlot1Effects(result, slot1Item, skillCardCount);
}
