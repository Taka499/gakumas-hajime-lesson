export enum ParameterType {
  VOCAL = "vocal",
  DANCE = "dance",
  VISUAL = "visual",
}

export enum Week {
  WEEK_1 = 1,
  WEEK_2 = 2,
  WEEK_3 = 3,
  WEEK_4 = 4,
  WEEK_5 = 5,
  WEEK_6 = 6,
  WEEK_7 = 7,
  WEEK_8 = 8,
  WEEK_9 = 9,
  WEEK_10 = 10,
  WEEK_11 = 11,
  WEEK_12 = 12,
  WEEK_13 = 13,
  WEEK_14 = 14,
  WEEK_15 = 15,
  WEEK_16 = 16,
  WEEK_17 = 17,
  WEEK_18 = 18,
}

export enum ActivityType {
  LEGEND_LESSON = "legend_lesson",
  REGULAR_LESSON = "regular_lesson",
  CONSULTATION = "consultation",
  OUTING = "outing",
  ACTIVITY_GRANT = "activity_grant",
  SPECIAL_TRAINING = "special_training",
  MID_EXAM = "mid_exam",
  FINAL_EXAM = "final_exam",
}

export enum Slot1Item {
  NONE = "none",
  VOCAL_TEXTBOOK = "vocal_textbook",
  DANCE_TEXTBOOK = "dance_textbook",
  VISUAL_TEXTBOOK = "visual_textbook",
  VOICE_RECORDER = "voice_recorder",
  PORTABLE_SPEAKER = "portable_speaker",
  MAKEUP_MIRROR = "makeup_mirror",
}

export enum Slot2Item {
  NONE = "none",
  OMAMORI_STRAP = "omamori_strap",
  HAND_TOWEL = "hand_towel",
  SCRUNCHIE = "scrunchie",
  MUFFLER = "muffler",
  FRILL_HANDKERCHIEF = "frill_handkerchief",
  POCKET_TISSUE = "pocket_tissue",
  MINI_POUCH = "mini_pouch",
  RIBBON_HAIRPIN = "ribbon_hairpin",
  NAIL_STICKER = "nail_sticker",
  BATH_SALT = "bath_salt",
  DRINK_HOLDER = "drink_holder",
  SQUEEZE = "squeeze",
  LESSON_WEAR = "lesson_wear",
}

export enum Slot3Item {
  NONE = "none",
  SATIN_NECKTIE = "satin_necktie",
  SILK_NECKTIE = "silk_necktie",
  LINEN_NECKTIE = "linen_necktie",
  BRASS_RING = "brass_ring",
  SILVER_RING = "silver_ring",
  GOLD_RING = "gold_ring",
}

export interface LessonResult {
  vocal: number;
  dance: number;
  visual: number;
}

export interface WeekActivity {
  week: Week;
  activityType: ActivityType;
  selectedParam?: ParameterType;
}

export interface WeekResult {
  week: Week;
  activityType: ActivityType;
  gains: LessonResult;
  cumulative: LessonResult;
  skillCardCount: number;
  estimated: boolean;
}

export interface ProducePlan {
  slot1Item: Slot1Item;
  slot2Item: Slot2Item;
  slot3Item: Slot3Item;
  weeks: WeekActivity[];
}
