import { type LessonResult, type Week } from "./types.ts";
import { OUTING_VALUES } from "./constants.ts";

/**
 * Calculate parameter gains for an outing.
 * Outings give roughly equal gains to all 3 parameters.
 * All current values are estimated.
 */
export function calculateOutingParams(
  week: Week,
): LessonResult & { estimated: boolean } {
  const value = OUTING_VALUES[week];
  if (!value) {
    return { vocal: 0, dance: 0, visual: 0, estimated: true };
  }
  return {
    vocal: value.perParam,
    dance: value.perParam,
    visual: value.perParam,
    estimated: value.estimated,
  };
}
