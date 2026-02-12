import { type LessonResult, type ParameterType, type Slot1Item, type Week } from "./types.ts";
import { REGULAR_LESSON_VALUES } from "./constants.ts";
import { applySlot1Effects } from "./legend.ts";

/**
 * Calculate parameter gains for a regular lesson.
 * Same distribution formula as Legend Lessons but with lower base values.
 * Returns { estimated: true } when the base values are unverified.
 */
export function calculateRegularLessonParams(
  week: Week,
  selectedParam: ParameterType,
  slot1Item: Slot1Item,
  skillCardCount = 17,
): LessonResult & { estimated: boolean } {
  const values = REGULAR_LESSON_VALUES[week];
  if (!values) {
    return { vocal: 0, dance: 0, visual: 0, estimated: true };
  }

  const result: LessonResult = {
    vocal: values.nonSelected,
    dance: values.nonSelected,
    visual: values.nonSelected,
  };
  result[selectedParam] = values.selected;

  return {
    ...applySlot1Effects(result, slot1Item, skillCardCount),
    estimated: values.estimated,
  };
}
