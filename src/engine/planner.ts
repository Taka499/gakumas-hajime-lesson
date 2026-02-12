import {
  ActivityType,
  type LessonResult,
  type ProducePlan,
  type WeekResult,
} from "./types.ts";
import { calculateLegendLessonParams } from "./legend.ts";
import { calculateRegularLessonParams } from "./regular.ts";
import { calculateConsultationParams } from "./consultation.ts";
import { calculateOutingParams } from "./outing.ts";
import { INITIAL_SKILL_CARD_COUNT, updateSkillCards } from "./skillcards.ts";

/**
 * Calculate the full result of an 18-week Produce plan.
 * Processes weeks in order, tracking cumulative parameters and skill cards.
 * Each week's result includes the gains, running totals, and whether
 * any estimated data was used.
 */
export function calculateProducePlan(plan: ProducePlan): WeekResult[] {
  const results: WeekResult[] = [];
  const cumulative: LessonResult = { vocal: 0, dance: 0, visual: 0 };
  let skillCards = { count: INITIAL_SKILL_CARD_COUNT };

  for (const activity of plan.weeks) {
    let gains: LessonResult = { vocal: 0, dance: 0, visual: 0 };
    let estimated = false;

    switch (activity.activityType) {
      case ActivityType.LEGEND_LESSON: {
        if (activity.selectedParam) {
          gains = calculateLegendLessonParams(
            activity.week,
            activity.selectedParam,
            plan.slot1Item,
            skillCards.count,
          );
        }
        break;
      }
      case ActivityType.REGULAR_LESSON: {
        if (activity.selectedParam) {
          const result = calculateRegularLessonParams(
            activity.week,
            activity.selectedParam,
            plan.slot1Item,
            skillCards.count,
          );
          gains = { vocal: result.vocal, dance: result.dance, visual: result.visual };
          estimated = result.estimated;
        }
        break;
      }
      case ActivityType.CONSULTATION: {
        const result = calculateConsultationParams(activity.week);
        gains = { vocal: result.vocal, dance: result.dance, visual: result.visual };
        estimated = result.estimated;
        break;
      }
      case ActivityType.OUTING: {
        const result = calculateOutingParams(activity.week);
        gains = { vocal: result.vocal, dance: result.dance, visual: result.visual };
        estimated = result.estimated;
        break;
      }
      case ActivityType.SPECIAL_TRAINING:
      case ActivityType.MID_EXAM:
      case ActivityType.FINAL_EXAM:
        // No parameter gains for these activities
        break;
    }

    // Update skill card count after each activity
    skillCards = updateSkillCards(skillCards, activity.activityType, activity.week);

    cumulative.vocal += gains.vocal;
    cumulative.dance += gains.dance;
    cumulative.visual += gains.visual;

    results.push({
      week: activity.week,
      activityType: activity.activityType,
      gains,
      cumulative: { ...cumulative },
      skillCardCount: skillCards.count,
      estimated,
    });
  }

  return results;
}
