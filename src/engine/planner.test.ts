import { describe, expect, test } from "bun:test";
import { calculateProducePlan } from "./planner.ts";
import {
  ActivityType,
  ParameterType,
  type ProducePlan,
  Slot1Item,
  Slot2Item,
  Slot3Item,
  Week,
} from "./types.ts";
import { INITIAL_SKILL_CARD_COUNT } from "./skillcards.ts";

function makeDefaultPlan(overrides?: Partial<ProducePlan>): ProducePlan {
  return {
    slot1Item: Slot1Item.NONE,
    slot2Item: Slot2Item.NONE,
    slot3Item: Slot3Item.NONE,
    weeks: [
      { week: Week.WEEK_1, activityType: ActivityType.REGULAR_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_2, activityType: ActivityType.REGULAR_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_3, activityType: ActivityType.OUTING },
      { week: Week.WEEK_4, activityType: ActivityType.LEGEND_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_5, activityType: ActivityType.CONSULTATION },
      { week: Week.WEEK_6, activityType: ActivityType.REGULAR_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_7, activityType: ActivityType.LEGEND_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_8, activityType: ActivityType.CONSULTATION },
      { week: Week.WEEK_9, activityType: ActivityType.SPECIAL_TRAINING },
      { week: Week.WEEK_10, activityType: ActivityType.MID_EXAM },
      { week: Week.WEEK_11, activityType: ActivityType.OUTING },
      { week: Week.WEEK_12, activityType: ActivityType.LEGEND_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_13, activityType: ActivityType.CONSULTATION },
      { week: Week.WEEK_14, activityType: ActivityType.LEGEND_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_15, activityType: ActivityType.REGULAR_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_16, activityType: ActivityType.LEGEND_LESSON, selectedParam: ParameterType.VOCAL },
      { week: Week.WEEK_17, activityType: ActivityType.CONSULTATION },
      { week: Week.WEEK_18, activityType: ActivityType.FINAL_EXAM },
    ],
    ...overrides,
  };
}

describe("calculateProducePlan", () => {
  test("Returns 18 results for a full plan", () => {
    const results = calculateProducePlan(makeDefaultPlan());
    expect(results.length).toBe(18);
  });

  test("Cumulative totals increase monotonically", () => {
    const results = calculateProducePlan(makeDefaultPlan());
    for (let i = 1; i < results.length; i++) {
      expect(results[i]!.cumulative.vocal).toBeGreaterThanOrEqual(results[i - 1]!.cumulative.vocal);
      expect(results[i]!.cumulative.dance).toBeGreaterThanOrEqual(results[i - 1]!.cumulative.dance);
      expect(results[i]!.cumulative.visual).toBeGreaterThanOrEqual(results[i - 1]!.cumulative.visual);
    }
  });

  test("Legend Lesson gains match Phase 1 values (all Vocal, no item)", () => {
    const results = calculateProducePlan(makeDefaultPlan());
    // Week 4 (index 3) is the first Legend Lesson
    const week4 = results[3]!;
    expect(week4.gains.vocal).toBe(140);
    expect(week4.gains.dance).toBe(55);
    expect(week4.gains.visual).toBe(55);

    // Week 16 (index 15) is the last Legend Lesson
    const week16 = results[15]!;
    expect(week16.gains.vocal).toBe(570);
    expect(week16.gains.dance).toBe(115);
    expect(week16.gains.visual).toBe(115);
  });

  test("Skill card count tracks across weeks", () => {
    const results = calculateProducePlan(makeDefaultPlan());
    // Start: 7 (INITIAL_SKILL_CARD_COUNT)
    // Week 1 regular lesson: +2 = 9
    expect(results[0]!.skillCardCount).toBe(INITIAL_SKILL_CARD_COUNT + 2);
    // Week 2 regular lesson: +2 = 11
    expect(results[1]!.skillCardCount).toBe(INITIAL_SKILL_CARD_COUNT + 4);
    // Week 3 outing: +1 = 12
    expect(results[2]!.skillCardCount).toBe(INITIAL_SKILL_CARD_COUNT + 5);
    // Week 4 legend lesson: +0 = 12
    expect(results[3]!.skillCardCount).toBe(INITIAL_SKILL_CARD_COUNT + 5);
  });

  test("Special training, exams produce zero gains", () => {
    const results = calculateProducePlan(makeDefaultPlan());
    // Week 9 = special training (index 8)
    expect(results[8]!.gains.vocal).toBe(0);
    expect(results[8]!.gains.dance).toBe(0);
    // Week 10 = mid exam (index 9)
    expect(results[9]!.gains.vocal).toBe(0);
    // Week 18 = final exam (index 17)
    expect(results[17]!.gains.vocal).toBe(0);
  });

  test("Recorder bonus depends on skill card count in plan", () => {
    const plan = makeDefaultPlan({ slot1Item: Slot1Item.VOICE_RECORDER });
    const results = calculateProducePlan(plan);

    // By week 4 (index 3): skill cards = 7 + 2 + 2 + 1 = 12 (before this week's activity)
    // Recorder needs 17, so NO bonus at week 4
    // Wait — skillCards is updated AFTER gains are calculated for the current week?
    // Actually in our planner, updateSkillCards runs after the calculation.
    // At week 4, skillCards.count is still 12 (from weeks 1-3).
    // So week 4 legend lesson should NOT get +15.
    expect(results[3]!.gains.vocal).toBe(140); // no +15

    // By week 16 (index 15): accumulated more cards from outings, regular lessons
    // 7 + 2(w1) + 2(w2) + 1(w3) + 0(w4) + 0(w5) + 2(w6) + 0(w7) + 0(w8) + 0(w9) + 0(w10) + 1(w11) + 0(w12) + 0(w13) + 0(w14) + 2(w15) = 17
    // At week 16 (index 15), skillCards.count should be 17 from weeks 1-15
    // So week 16 SHOULD get +15
    expect(results[15]!.gains.vocal).toBe(585); // 570 + 15
  });

  test("Final cumulative matches sum of all gains", () => {
    const results = calculateProducePlan(makeDefaultPlan());
    let totalVo = 0;
    let totalDa = 0;
    let totalVi = 0;
    for (const r of results) {
      totalVo += r.gains.vocal;
      totalDa += r.gains.dance;
      totalVi += r.gains.visual;
    }
    const last = results[results.length - 1]!;
    expect(last.cumulative.vocal).toBe(totalVo);
    expect(last.cumulative.dance).toBe(totalDa);
    expect(last.cumulative.visual).toBe(totalVi);
  });
});
