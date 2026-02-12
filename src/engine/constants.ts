import { ActivityType, Week } from "./types.ts";

export interface BaseValue {
  selected: number;
  nonSelected: number;
  estimated: boolean;
}

// Legend Lesson base values (verified from wiki)
export const LEGEND_LESSON_VALUES: Partial<Record<Week, BaseValue>> = {
  [Week.WEEK_4]: { selected: 140, nonSelected: 55, estimated: false },
  [Week.WEEK_7]: { selected: 180, nonSelected: 60, estimated: false },
  [Week.WEEK_12]: { selected: 260, nonSelected: 70, estimated: false },
  [Week.WEEK_14]: { selected: 370, nonSelected: 90, estimated: false },
  [Week.WEEK_16]: { selected: 570, nonSelected: 115, estimated: false },
};

// Regular Lesson base values (verified from wiki)
// In 初LEGEND, regular lessons grant gains only to the selected parameter.
// Non-selected parameters receive 0.
export const REGULAR_LESSON_VALUES: Partial<Record<Week, BaseValue>> = {
  [Week.WEEK_1]: { selected: 100, nonSelected: 0, estimated: false },
  [Week.WEEK_2]: { selected: 100, nonSelected: 0, estimated: false },
  [Week.WEEK_6]: { selected: 150, nonSelected: 0, estimated: false },
  [Week.WEEK_15]: { selected: 200, nonSelected: 0, estimated: false },
};

// Consultation gains per week (estimated — formula unclear)
// Consultations give roughly equal gains to all 3 parameters
export interface ConsultationValue {
  perParam: number;
  estimated: boolean;
}

export const CONSULTATION_VALUES: Partial<Record<Week, ConsultationValue>> = {
  [Week.WEEK_5]: { perParam: 40, estimated: true },
  [Week.WEEK_8]: { perParam: 55, estimated: true },
  [Week.WEEK_13]: { perParam: 75, estimated: true },
  [Week.WEEK_17]: { perParam: 90, estimated: true },
};

// Outing gains per week (estimated)
export interface OutingValue {
  perParam: number;
  estimated: boolean;
}

export const OUTING_VALUES: Partial<Record<Week, OutingValue>> = {
  [Week.WEEK_3]: { perParam: 25, estimated: true },
  [Week.WEEK_5]: { perParam: 30, estimated: true },
  [Week.WEEK_11]: { perParam: 50, estimated: true },
  [Week.WEEK_13]: { perParam: 60, estimated: true },
};

// Fixed schedule: what activity is available each week
export interface WeekScheduleEntry {
  week: Week;
  allowedActivities: ActivityType[];
  isLegend: boolean;
}

export const WEEK_SCHEDULE: WeekScheduleEntry[] = [
  { week: Week.WEEK_1, allowedActivities: [ActivityType.REGULAR_LESSON], isLegend: false },
  { week: Week.WEEK_2, allowedActivities: [ActivityType.REGULAR_LESSON], isLegend: false },
  { week: Week.WEEK_3, allowedActivities: [ActivityType.OUTING], isLegend: false },
  { week: Week.WEEK_4, allowedActivities: [ActivityType.LEGEND_LESSON], isLegend: true },
  { week: Week.WEEK_5, allowedActivities: [ActivityType.OUTING, ActivityType.CONSULTATION], isLegend: false },
  { week: Week.WEEK_6, allowedActivities: [ActivityType.REGULAR_LESSON], isLegend: false },
  { week: Week.WEEK_7, allowedActivities: [ActivityType.LEGEND_LESSON], isLegend: true },
  { week: Week.WEEK_8, allowedActivities: [ActivityType.CONSULTATION], isLegend: false },
  { week: Week.WEEK_9, allowedActivities: [ActivityType.SPECIAL_TRAINING], isLegend: false },
  { week: Week.WEEK_10, allowedActivities: [ActivityType.MID_EXAM], isLegend: false },
  { week: Week.WEEK_11, allowedActivities: [ActivityType.OUTING], isLegend: false },
  { week: Week.WEEK_12, allowedActivities: [ActivityType.LEGEND_LESSON], isLegend: true },
  { week: Week.WEEK_13, allowedActivities: [ActivityType.OUTING, ActivityType.CONSULTATION], isLegend: false },
  { week: Week.WEEK_14, allowedActivities: [ActivityType.LEGEND_LESSON], isLegend: true },
  { week: Week.WEEK_15, allowedActivities: [ActivityType.REGULAR_LESSON], isLegend: false },
  { week: Week.WEEK_16, allowedActivities: [ActivityType.LEGEND_LESSON], isLegend: true },
  { week: Week.WEEK_17, allowedActivities: [ActivityType.CONSULTATION, ActivityType.SPECIAL_TRAINING], isLegend: false },
  { week: Week.WEEK_18, allowedActivities: [ActivityType.FINAL_EXAM], isLegend: false },
];
