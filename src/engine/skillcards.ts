import { ActivityType, type Week } from "./types.ts";

export interface SkillCardState {
  count: number;
}

// Players start with a base deck of skill cards
export const INITIAL_SKILL_CARD_COUNT = 7;

// Estimated skill card acquisitions per activity type.
// Regular lessons in weeks 1-2 tend to grant cards as part of early skill building.
// Outings grant 1 card (determined by Slot 2 item, but we only track count here).
// Legend Lessons and other activities don't directly grant cards.
const CARD_GAINS: Partial<Record<ActivityType, number>> = {
  [ActivityType.REGULAR_LESSON]: 2,
  [ActivityType.OUTING]: 1,
};

/**
 * Update skill card count after an activity.
 * Returns a new SkillCardState (immutable).
 */
export function updateSkillCards(
  state: SkillCardState,
  activityType: ActivityType,
  _week: Week,
): SkillCardState {
  const gain = CARD_GAINS[activityType] ?? 0;
  return { count: state.count + gain };
}
