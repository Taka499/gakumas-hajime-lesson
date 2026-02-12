import { type LessonResult, type Week } from "./types.ts";

/**
 * Calculate parameter gains for an outing.
 * Base gains are 0 — actual gains come from support card effects (future feature).
 */
export function calculateOutingParams(
  _week: Week,
): LessonResult & { estimated: boolean } {
  return { vocal: 0, dance: 0, visual: 0, estimated: false };
}
