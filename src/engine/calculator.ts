// Barrel file — re-exports for backwards compatibility with Phase 1
// and single import point for Phase 2 consumers.

export {
  ParameterType,
  Slot1Item,
  Slot2Item,
  Slot3Item,
  ActivityType,
  Week,
  type LessonResult,
  type WeekActivity,
  type WeekResult,
  type ProducePlan,
} from "./types.ts";

export {
  type BaseValue,
  type ConsultationValue,
  type OutingValue,
  type WeekScheduleEntry,
  LEGEND_LESSON_VALUES,
  REGULAR_LESSON_VALUES,
  CONSULTATION_VALUES,
  OUTING_VALUES,
  WEEK_SCHEDULE,
} from "./constants.ts";

export { calculateLegendLessonParams, applySlot1Effects } from "./legend.ts";
export { calculateRegularLessonParams } from "./regular.ts";
export { calculateConsultationParams } from "./consultation.ts";
export { calculateOutingParams } from "./outing.ts";
export { calculateProducePlan } from "./planner.ts";
export {
  type SkillCardState,
  INITIAL_SKILL_CARD_COUNT,
  updateSkillCards,
} from "./skillcards.ts";

// Phase 1 backwards compatibility alias
export { calculateLegendLessonParams as calculateLessonParams } from "./legend.ts";

// LessonWeek alias for Phase 1 test compatibility
import { Week } from "./types.ts";
export const LessonWeek = {
  WEEK_4: Week.WEEK_4,
  WEEK_7: Week.WEEK_7,
  WEEK_12: Week.WEEK_12,
  WEEK_14: Week.WEEK_14,
  WEEK_16: Week.WEEK_16,
} as const;

// calculateTotalParams — Phase 1 convenience wrapper, kept for backwards compat
import { type LessonResult, type ParameterType, type Slot1Item } from "./types.ts";
import { calculateLegendLessonParams } from "./legend.ts";

export function calculateTotalParams(
  lessonChoices: Array<{ week: Week; selectedParam: ParameterType }>,
  slot1Item: Slot1Item,
): LessonResult {
  const total: LessonResult = { vocal: 0, dance: 0, visual: 0 };
  for (const choice of lessonChoices) {
    const result = calculateLegendLessonParams(choice.week, choice.selectedParam, slot1Item);
    total.vocal += result.vocal;
    total.dance += result.dance;
    total.visual += result.visual;
  }
  return total;
}
