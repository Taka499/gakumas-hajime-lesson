import type { LessonResult } from "./types.ts";

/** 初LEGEND mode evaluation coefficient */
export const EVALUATION_COEFFICIENT = 2.1;

/** Maximum value for each parameter */
export const PARAMETER_CAP = 2800;

/**
 * Calculate the evaluation score from parameter totals and exam scores.
 * Formula: (Parameter Total × 2.1) + Mid-Exam Score + Final-Exam Score
 * The 2.1 coefficient is specific to 初LEGEND mode.
 */
export function calculateEvaluation(
  params: LessonResult,
  midExamScore: number,
  finalExamScore: number,
): number {
  const paramTotal = params.vocal + params.dance + params.visual;
  return Math.floor(paramTotal * EVALUATION_COEFFICIENT) + midExamScore + finalExamScore;
}

/**
 * Check whether any parameter falls below the exam penalty threshold.
 * Penalty triggers when any attribute < 8000 × examMultiplier / 9,
 * reducing exam score bonuses by up to 25%.
 */
export function checkPenalty(
  params: LessonResult,
  examMultiplier: number,
): { hasPenalty: boolean; threshold: number; belowThreshold: string[] } {
  const threshold = Math.floor((8000 * examMultiplier) / 9);
  const belowThreshold: string[] = [];

  if (params.vocal < threshold) belowThreshold.push("Vocal");
  if (params.dance < threshold) belowThreshold.push("Dance");
  if (params.visual < threshold) belowThreshold.push("Visual");

  return {
    hasPenalty: belowThreshold.length > 0,
    threshold,
    belowThreshold,
  };
}
