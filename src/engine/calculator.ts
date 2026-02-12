export enum LessonWeek {
  WEEK_4 = 4,
  WEEK_7 = 7,
  WEEK_12 = 12,
  WEEK_14 = 14,
  WEEK_16 = 16,
}

export enum ParameterType {
  VOCAL = "vocal",
  DANCE = "dance",
  VISUAL = "visual",
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

export interface LessonResult {
  vocal: number;
  dance: number;
  visual: number;
}

// Base values: [selectedParam gain, nonSelectedParam gain]
// Source: https://wikiwiki.jp/gakumas/初LEGEND#g0767a81
const BASE_VALUES: Record<LessonWeek, [number, number]> = {
  [LessonWeek.WEEK_4]: [140, 55],
  [LessonWeek.WEEK_7]: [180, 60],
  [LessonWeek.WEEK_12]: [260, 70],
  [LessonWeek.WEEK_14]: [370, 90],
  [LessonWeek.WEEK_16]: [570, 115],
};

// Which parameter each Textbook/Recorder boosts
const TEXTBOOK_PARAM: Partial<Record<Slot1Item, ParameterType>> = {
  [Slot1Item.VOCAL_TEXTBOOK]: ParameterType.VOCAL,
  [Slot1Item.DANCE_TEXTBOOK]: ParameterType.DANCE,
  [Slot1Item.VISUAL_TEXTBOOK]: ParameterType.VISUAL,
};

const RECORDER_PARAM: Partial<Record<Slot1Item, ParameterType>> = {
  [Slot1Item.VOICE_RECORDER]: ParameterType.VOCAL,
  [Slot1Item.PORTABLE_SPEAKER]: ParameterType.DANCE,
  [Slot1Item.MAKEUP_MIRROR]: ParameterType.VISUAL,
};

export function calculateLessonParams(
  week: LessonWeek,
  selectedParam: ParameterType,
  slot1Item: Slot1Item,
): LessonResult {
  const [baseSelected, baseNonSelected] = BASE_VALUES[week];

  const result: LessonResult = {
    vocal: baseNonSelected,
    dance: baseNonSelected,
    visual: baseNonSelected,
  };
  result[selectedParam] = baseSelected;

  // Textbook: +10% to all lesson gains, then +8.5% to the textbook's stat
  const textbookParam = TEXTBOOK_PARAM[slot1Item];
  if (textbookParam !== undefined) {
    result.vocal = Math.floor(result.vocal * 1.1);
    result.dance = Math.floor(result.dance * 1.1);
    result.visual = Math.floor(result.visual * 1.1);
    result[textbookParam] = Math.floor(result[textbookParam] * 1.085);
  }

  // Recorder: flat +15 to one stat (assumes 17+ skill cards condition is met)
  const recorderParam = RECORDER_PARAM[slot1Item];
  if (recorderParam !== undefined) {
    result[recorderParam] += 15;
  }

  return result;
}

export function calculateTotalParams(
  lessonChoices: Array<{ week: LessonWeek; selectedParam: ParameterType }>,
  slot1Item: Slot1Item,
): LessonResult {
  const total: LessonResult = { vocal: 0, dance: 0, visual: 0 };

  for (const choice of lessonChoices) {
    const result = calculateLessonParams(choice.week, choice.selectedParam, slot1Item);
    total.vocal += result.vocal;
    total.dance += result.dance;
    total.visual += result.visual;
  }

  return total;
}
