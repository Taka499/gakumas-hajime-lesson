# Phase 3: Character-Aware Strategy Advisor

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with `_docs/PLANS.md`. This plan builds upon Phase 1 (`_docs/EXECPLAN_LESSON_CALCULATOR.md`) and Phase 2 (`_docs/EXECPLAN_WEEKLY_PLANNER.md`). Phase 1 delivered a Legend Lesson parameter calculator with Vite + Preact + Tailwind v4. Phase 2 expanded it to cover all 18 weeks of a Produce run, including regular lessons, consultations, outings, skill card tracking, and exam scoring.


## Purpose / Big Picture

After this implementation, users can select a specific idol character from the game's 13-character roster, and the planner will automatically tailor its calculations and recommendations to that character. Instead of manually guessing which lesson parameters to focus on each week, users receive a strategy recommendation that accounts for the idol's type affinity, support card effects, and the 2,800 per-stat parameter cap. A "suggest plan" button generates a near-optimal 18-week plan for the selected idol and P-Item loadout, letting players quickly understand the best strategy before starting a Produce run.

To see it working: run `bun run dev`, open the browser, select an idol from a new dropdown at the top of the page (e.g. "花海咲季"), configure P-Items as before, then click "おすすめプランを生成" (Generate Recommended Plan). The planner auto-fills all 18 weeks with lesson parameter choices and activity selections optimized to maximize that idol's evaluation score. Users can then tweak individual weeks and see how changes affect the final score. The idol's type affinity, parameter growth bonuses, and cap-awareness are all visible in the UI.

This is Phase 3 of the project roadmap. Phase 1 established the build pipeline and Legend Lesson calculator. Phase 2 expanded to an 18-week planner with all activity types and exam scoring. Phase 3 adds character awareness and strategy optimization. The architecture (engine with zero DOM imports, Preact components consuming engine functions, Vite build) carries forward unchanged.


## Progress

- [ ] Milestone 1: Idol database and type system
- [ ] Milestone 2: Support card parameter model
- [ ] Milestone 3: Cap-aware parameter calculation
- [ ] Milestone 4: Strategy optimizer engine
- [ ] Milestone 5: Idol selector UI and strategy display
- [ ] Milestone 6: Integration, validation, and deployment


## Surprises & Discoveries

(No entries yet -- will be populated during implementation.)


## Decision Log

- Decision: Model idol data as a static TypeScript data file rather than YAML.
  Rationale: The idol database is small (13 characters, each with a handful of fields). YAML would require a build-time import plugin and adds complexity for minimal benefit. A TypeScript file with `as const` provides full type safety, IDE auto-completion, and zero build overhead. If the dataset grows significantly in future phases, migration to YAML is straightforward since the data structure is identical.
  Date/Author: 2026-02-13 / Phase 3 planning

- Decision: Use a greedy heuristic optimizer rather than brute-force search.
  Rationale: The search space for 18 weeks of choices is large. Each lesson week has 3 parameter choices, and flexible weeks (5, 13, 17) have 2-3 activity options, yielding roughly 3^9 x 2^3 = 157,464 combinations for lessons alone. While brute-force is technically feasible at this scale, a greedy heuristic (choose the parameter each week that yields the highest marginal evaluation score, accounting for the cap) is simpler to implement, runs in O(n) time, and produces near-optimal results because the lesson distribution formula strongly favors always picking the parameter with the most headroom below the 2,800 cap. The optimizer can be upgraded to brute-force later if needed, since the interface is the same.
  Date/Author: 2026-02-13 / Phase 3 planning

- Decision: Model support cards as flat parameter bonuses per activity type, not as individual card simulations.
  Rationale: Support cards in the game have complex conditional effects (impression thresholds, good-condition stacking, skill card triggers). Simulating these faithfully would require modeling the entire card-play engine, which is far beyond scope. Instead, we model support card "decks" as aggregate bonuses: a set of per-activity-type parameter modifiers (e.g., "consultation gives +11 Vi, +6 Da per occurrence") that approximate the net effect of a typical support card lineup. This is sufficient for strategy recommendations and matches the level of fidelity the planner already uses for consultation/outing values (estimated). Individual card simulation would be a Phase 4+ feature.
  Date/Author: 2026-02-13 / Phase 3 planning

- Decision: Include idol type affinity as a percentage bonus to the idol's primary parameter during lessons, not as a modifier to base values.
  Rationale: In the game, an idol's type (Vo/Da/Vi specialization) means their primary parameter grows slightly faster. Rather than modifying the base value tables (which are verified from the wiki and shared across all idols), we apply the affinity as a post-calculation multiplier. This keeps the base value tables clean and makes the affinity effect visible and adjustable in the UI.
  Date/Author: 2026-02-13 / Phase 3 planning

- Decision: HP/stamina tracking remains out of scope.
  Rationale: Consistent with Phase 1 and Phase 2 decisions (see their respective Decision Logs). User has explicitly directed that HP management is not in scope.
  Date/Author: 2026-02-13 / Phase 3 planning


## Outcomes & Retrospective

(No entries yet -- will be populated during and after implementation.)


## Context and Orientation

### Repository State After Phase 2

The project is a working web application deployed to GitHub Pages. It calculates parameter gains across an 18-week Produce run with support for all activity types, 3-slot P-Item configuration, skill card tracking, and exam scoring.

Key files in the engine (`src/engine/`):

- `types.ts` -- All shared types. Exports enums `ParameterType` (VOCAL, DANCE, VISUAL), `Week` (WEEK_1 through WEEK_18), `ActivityType` (LEGEND_LESSON, REGULAR_LESSON, CONSULTATION, OUTING, SPECIAL_TRAINING, MID_EXAM, FINAL_EXAM), `Slot1Item`, `Slot2Item`, `Slot3Item`. Exports interfaces `LessonResult` (vocal/dance/visual numbers), `WeekActivity` (week + activityType + optional selectedParam), `WeekResult` (gains + cumulative + skillCardCount + estimated flag), `ProducePlan` (slot1-3 items + weeks array).

- `constants.ts` -- All base value tables. `LEGEND_LESSON_VALUES` (verified), `REGULAR_LESSON_VALUES` (estimated), `CONSULTATION_VALUES` (estimated), `OUTING_VALUES` (estimated). Each value carries an `estimated: boolean` flag. Also exports `WEEK_SCHEDULE` describing the fixed activity schedule for all 18 weeks.

- `legend.ts` -- Legend Lesson calculation. Exports `applySlot1Effects(result, slot1Item, skillCardCount)` and `calculateLegendLessonParams(week, selectedParam, slot1Item, skillCardCount)`. The `applySlot1Effects` function is shared by regular lessons.

- `regular.ts` -- Regular lesson calculation using the same formula as legend lessons but with different base values.

- `consultation.ts` -- Consultation parameter calculation. Returns flat per-parameter gains (estimated).

- `outing.ts` -- Outing parameter calculation. Returns flat per-parameter gains (estimated).

- `skillcards.ts` -- Skill card count tracking. Tracks how many cards the player has accumulated, relevant for Recorder-type P-Item activation (requires 17+ cards).

- `exam.ts` -- Exam scoring. `calculateEvaluation(params, midExamScore, finalExamScore)` using the 2.1 coefficient. `checkPenalty(params, examMultiplier)` checks if any parameter falls below the penalty threshold.

- `planner.ts` -- The main orchestrator. `calculateProducePlan(plan: ProducePlan): WeekResult[]` processes all 18 weeks in order, dispatching to the appropriate activity calculator, tracking skill cards, and accumulating cumulative totals.

- `calculator.ts` -- Barrel file re-exporting everything from the above modules for convenient single-import access.

Key files in the UI (`src/components/`):

- `ItemConfigurator.tsx` -- Dropdowns for all 3 P-Item slots.
- `WeekCard.tsx` -- Renders one week with activity selector and parameter results.
- `WeekPlannerGrid.tsx` -- Renders all 18 WeekCards in a responsive grid.
- `SummaryPanel.tsx` -- Final parameter totals, evaluation score, and warnings.
- `CumulativeChart.tsx` -- SVG chart showing parameter progression across weeks.

State management: `src/app.tsx` uses Preact Signals to hold a `ProducePlan` signal. When any input changes (P-Item selection, week activity, parameter choice), the signal updates, `calculateProducePlan()` runs, and all derived values propagate reactively.

Build and test: `bun run dev` for development, `bun test` for engine tests (34 tests across 6 files), `bun run build` for production. GitHub Actions CI/CD deploys to Pages on push to main.

### Key Terms

Terms carried from prior phases (defined in `_docs/EXECPLAN_LESSON_CALCULATOR.md` and `_docs/EXECPLAN_WEEKLY_PLANNER.md`): Legend Lesson, Regular Lesson, Parameters (Vo/Da/Vi), Challenge P-Items, Selected/Non-Selected Parameter, Consultation, Outing, Special Training, Activity Grant, Skill Card Count, Exam Penalty, Parameter Cap (2,800), Barrel File, Engine, Vite, Preact.

New terms for Phase 3:

- **Idol**: A playable character in the game. Each idol has a name, a plan type (Sense or Logic), and a primary parameter affinity (Vo, Da, or Vi). There are currently 13 idols in the game.

- **Plan Type**: Each idol is either "Sense" or "Logic". This determines which skill card mechanics are available during produce. Sense idols work with "good condition" and "concentration" mechanics. Logic idols work with "motivation" and "good impression" mechanics. For the parameter calculator, plan type mainly affects which support card templates are relevant.

- **Parameter Affinity**: Each idol specializes in one of Vo/Da/Vi. During lessons, the idol gains a small bonus to their affinity parameter. This is modeled as a percentage multiplier (estimated at +3-5%) applied after the base lesson calculation.

- **Support Card**: Cards equipped before starting a Produce run. Each card provides passive bonuses during activities (lessons, consultations, outings). For Phase 3, we model these as aggregate parameter modifiers grouped into "support card presets" rather than simulating individual card effects.

- **Support Card Preset**: A named collection of per-activity-type parameter bonuses that approximates the net effect of a common support card loadout. Example: "Consultation-focused (相談軸)" preset adds extra parameter gains during consultation weeks.

- **Strategy Optimizer**: An engine function that takes an idol, P-Item loadout, and support card preset, then generates a recommended 18-week plan. It chooses lesson parameters and flexible-week activities to maximize the final evaluation score while respecting the 2,800 per-stat cap.

- **Greedy Heuristic**: The optimization algorithm. For each week in order, it picks the choice that maximizes the marginal increase in total evaluation score. "Marginal increase" means: simulate each possible choice for this week, compare the resulting cumulative parameters, and pick the one that contributes the most to the final evaluation while keeping all parameters below the 2,800 cap.

### Idol Database

The game has 13 producible idols. Data gathered from the wiki (wikiwiki.jp/gakumas):

    花海咲季 (Hanami Saki)    -- Sense -- Vi affinity -- Vo 100, Da 100, Vi 105 base
    月村手毬 (Tsukimura Temari) -- Logic -- Da affinity -- data TBD
    藤田ことね (Fujita Kotone)  -- Logic -- Vo affinity -- data TBD
    有村麻央 (Arimura Mao)     -- Logic -- Vi affinity -- data TBD
    葛城リーリヤ (Katsuragi Lilja) -- Sense -- Da affinity -- data TBD
    倉本千奈 (Kuramoto China)   -- Sense -- Vo affinity -- data TBD
    紫雲清夏 (Shiun Seika)      -- Sense -- Vi affinity -- data TBD
    篠澤広 (Shinozawa Hiro)    -- Logic -- Vo affinity -- data TBD
    十王星南 (Juo Sena)         -- Sense -- Da affinity -- data TBD
    花海佑芽 (Hanami Ume)       -- Logic -- Vi affinity -- data TBD
    姫崎莉波 (Himesaki Rina)    -- Logic -- Da affinity -- data TBD
    秦谷美鈴 (Hataya Misuzu)    -- Sense -- Vo affinity -- data TBD
    雨夜燕 (Amayo Tsubame)      -- Anomaly -- balanced -- data TBD

The base stat spread for 花海咲季 is Vo 100, Da 100, Vi 105 -- all SSR cards share this distribution regardless of card variant. This suggests the per-idol stat spread is consistent across rarities and serves as a type affinity indicator rather than an absolute growth rate.

Data collection status: Only 花海咲季's card stats are confirmed from the wiki. The remaining 12 idols' exact stat spreads need verification. The plan type (Sense/Logic/Anomaly) and primary affinity parameter are needed for each idol. These should be verified by reading individual character wiki pages during implementation (Milestone 1).


## Plan of Work

### Milestone 1: Idol Database and Type System

Add the idol data model to the engine. After this milestone, `bun test` passes all existing tests plus new tests that verify the idol database is complete and correctly typed. No UI changes yet.

Create a new file `src/engine/idols.ts` containing an `Idol` interface and a constant array of all 13 idols. Each idol has: an `id` (lowercase English identifier, e.g. `"saki"`), a `name` (Japanese display name), a `nameEn` (romanized name for accessibility), a `planType` ("sense" | "logic" | "anomaly"), an `affinityParam` (ParameterType indicating which parameter this idol specializes in), and an `affinityBonus` (a number like 0.03 meaning +3% bonus to the affinity parameter during lessons).

The `affinityBonus` values are estimated. The wiki shows 花海咲季 has a stat spread of Vo 100 / Da 100 / Vi 105, which is a 5% advantage on Visual. For Phase 3 we model this as a 5% lesson bonus to the affinity parameter. This needs in-game verification but is a reasonable starting point.

Add the `Idol` type and `IDOL_DATABASE` constant to the barrel file exports. Create `src/engine/idols.test.ts` with tests verifying all 13 idols are present, all have valid `affinityParam` values, and the database has no duplicate IDs.

Extend `ProducePlan` in `types.ts` to include an optional `idolId` field. When set, `calculateProducePlan()` applies the idol's affinity bonus to lesson calculations. When unset (backwards compatibility), behavior is identical to Phase 2.

### Milestone 2: Support Card Parameter Model

Add a support card preset system that modifies per-activity parameter gains. After this milestone, the planner can be configured with a support card preset and the resulting parameter gains reflect the preset's bonuses.

Create `src/engine/supportcards.ts` with a `SupportCardPreset` interface and several preset definitions. A preset contains:

- `id`: string identifier
- `name`: Japanese display name
- `nameEn`: English name
- `lessonBonus`: `LessonResult` (flat parameter additions per lesson)
- `consultationBonus`: `LessonResult` (flat parameter additions per consultation)
- `outingBonus`: `LessonResult` (flat parameter additions per outing)
- `examBonus`: number (percentage bonus to exam score)

Define at least 4 presets covering common strategies:

1. **Balanced (バランス)**: Small equal bonuses across all activities.
2. **Consultation-focused (相談軸)**: Large consultation bonuses, small lesson bonuses. Based on the wiki's "相談軸" strategy where consultation-type support cards maximize parameter gains during drink exchanges.
3. **Lesson-focused (レッスン軸)**: Large lesson bonuses, small consultation bonuses. For builds stacking lesson parameter gain cards.
4. **None (なし)**: Zero bonuses. For users who want raw calculations without support card assumptions.

The exact bonus values are estimates. Wiki data shows support cards can provide effects like "consultation selection Vi+11", "lesson end Vi+6", "outing completion Vo+15". A typical 6-card support deck provides 3-6 of these effects. The presets approximate the aggregate of a full deck.

Extend `ProducePlan` in `types.ts` to include an optional `supportPresetId` field. Modify `calculateProducePlan()` in `planner.ts` to look up the preset and add its bonuses to the appropriate activity calculations. The bonuses are additive: after calculating the base gains for a week (including P-Item effects), add the preset's per-activity bonus.

Create `src/engine/supportcards.test.ts` with tests verifying presets exist, that "none" preset has zero bonuses, and that applying a preset changes the output of `calculateProducePlan()`.

### Milestone 3: Cap-Aware Parameter Calculation

Make the planner enforce the 2,800 per-stat parameter cap. After this milestone, cumulative parameters never exceed 2,800 per stat, and the UI shows when a stat has been capped.

Modify `calculateProducePlan()` in `planner.ts`: after adding each week's gains to the cumulative totals, clamp each parameter to `PARAMETER_CAP` (2,800, already defined in `exam.ts`). Add a `capped` field to `WeekResult` in `types.ts`: a `LessonResult` of booleans indicating which parameters hit the cap this week.

Modify `calculateEvaluation()` in `exam.ts` (or add a wrapper) to accept capped parameters and compute the evaluation correctly: parameters used in the formula are capped at 2,800 each, so the maximum parameter contribution is 2,800 x 3 x 2.1 = 17,640.

Add tests in `planner.test.ts` verifying that when raw cumulative gains would exceed 2,800, the capped values stop at 2,800 and the `capped` flags are set correctly.

### Milestone 4: Strategy Optimizer Engine

Implement the greedy heuristic optimizer. After this milestone, calling `generateOptimalPlan(idolId, slot1, slot2, slot3, supportPresetId)` returns a `ProducePlan` with lesson parameters and flexible-week activities chosen to maximize the evaluation score.

Create `src/engine/optimizer.ts` with the following exported function:

    export function generateOptimalPlan(
      idolId: string,
      slot1Item: Slot1Item,
      slot2Item: Slot2Item,
      slot3Item: Slot3Item,
      supportPresetId: string,
    ): ProducePlan

The algorithm works week by week:

1. Start with the fixed schedule from `WEEK_SCHEDULE` in `constants.ts`.
2. For each week, determine the possible choices:
   - Fixed-activity weeks (exams, special training): no choice, use the fixed activity.
   - Lesson weeks (regular or legend): choose from VOCAL, DANCE, VISUAL for `selectedParam`.
   - Flexible weeks (5, 13, 17): choose from the allowed activities, and if a lesson is chosen, also pick selectedParam.
3. For each possible choice, simulate the full remaining plan (using the greedy heuristic for future weeks too) and compute the resulting total parameter set.
4. Pick the choice that yields the highest evaluation score, considering:
   - The 2,800 per-stat cap (investing more in a capped stat is wasteful).
   - The exam penalty threshold (if any stat would fall below the penalty line, prefer boosting it).
   - The idol's affinity bonus (the affinity parameter is slightly cheaper to raise).

A simpler version of step 3 (for performance): instead of simulating the full remaining plan at each decision point, use a local heuristic. At each lesson week, pick the parameter that is furthest from the 2,800 cap. If two parameters are equidistant, prefer the idol's affinity parameter (it gets a bonus so it's more efficient). For flexible weeks, prefer consultation over outing when available (consultations give higher estimated parameter gains).

Create `src/engine/optimizer.test.ts` with tests:
- Given no P-Items and no idol affinity, the optimizer should spread lessons roughly evenly to avoid the cap.
- Given a Vocal-affinity idol, the optimizer should lean towards Vocal but switch away once Vocal approaches the cap.
- The generated plan should produce a valid `ProducePlan` that `calculateProducePlan()` can process.
- The generated plan should have a higher evaluation score than a naive "all Vocal" plan for a balanced idol.

### Milestone 5: Idol Selector UI and Strategy Display

Add UI components for idol selection, support card preset selection, and the "generate plan" button. After this milestone, users can select an idol, pick a support preset, generate an optimal plan, and see it populated in the planner.

New components:

- `src/components/IdolSelector.tsx` -- A dropdown or card-style selector showing all 13 idols. Displays the idol's name, plan type badge (Sense/Logic/Anomaly), and affinity parameter icon. Selecting an idol updates the plan's `idolId`.

- `src/components/SupportPresetSelector.tsx` -- A dropdown for choosing a support card preset. Shows the preset name and a brief description of its bonuses.

- `src/components/StrategyPanel.tsx` -- A panel below the idol/preset selectors with:
  - A "おすすめプランを生成" (Generate Recommended Plan) button that calls `generateOptimalPlan()` and populates the planner.
  - A brief text summary of the recommended strategy (e.g., "Vocal-focused with 2 consultations, avoiding Vi cap").
  - An evaluation score comparison: "Recommended: 18,240 vs Current: 16,890".

Modify `src/app.tsx`:
- Add `idolId` and `supportPresetId` signals.
- Place IdolSelector and SupportPresetSelector above the ItemConfigurator.
- Add StrategyPanel between the selectors and the WeekPlannerGrid.
- When "generate plan" is clicked, call `generateOptimalPlan()`, then set the plan signal to the result. The existing WeekPlannerGrid re-renders with the new plan.
- Users can still manually override any week after generation; the plan signal is mutable.

Update SummaryPanel to show which idol is selected and whether affinity bonuses were applied.

### Milestone 6: Integration, Validation, and Deployment

Final integration testing, polish, and deployment. After this milestone, all tests pass, the full flow works end-to-end, and the site is deployed.

This milestone covers:
- Running all tests (`bun test`) and verifying 50+ tests pass.
- Manual testing of the full flow: select idol, configure P-Items, generate plan, modify weeks, verify evaluation score.
- Verify the production build (`bun run build`) succeeds and the bundle size remains reasonable.
- Push to main for GitHub Pages deployment.
- Update `_docs/DATA_COLLECTION.md` with any new data collected or verified during implementation.


## Concrete Steps

### Milestone 1: Idol Database and Type System

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/engine/idols.ts`:

       import { ParameterType } from "./types.ts";

       export interface Idol {
         id: string;
         name: string;
         nameEn: string;
         planType: "sense" | "logic" | "anomaly";
         affinityParam: ParameterType;
         affinityBonus: number;
       }

       export const IDOL_DATABASE: readonly Idol[] = [
         {
           id: "saki",
           name: "花海咲季",
           nameEn: "Hanami Saki",
           planType: "sense",
           affinityParam: ParameterType.VISUAL,
           affinityBonus: 0.05,
         },
         {
           id: "temari",
           name: "月村手毬",
           nameEn: "Tsukimura Temari",
           planType: "logic",
           affinityParam: ParameterType.DANCE,
           affinityBonus: 0.05,
         },
         // ... remaining 11 idols
       ] as const;

       export function getIdolById(id: string): Idol | undefined {
         return IDOL_DATABASE.find((idol) => idol.id === id);
       }

   The `affinityBonus` of 0.05 (5%) is based on the wiki data for 花海咲季 showing a stat spread of 100/100/105, where the primary stat is 5% higher. This is an estimate and will be marked as such.

   Populate all 13 idols with their plan types and affinity parameters. The plan types and affinities need to be verified from individual wiki character pages during implementation. As a starting point based on wiki research:

       saki:    sense,   Vi
       temari:  logic,   Da
       kotone:  logic,   Vo
       mao:     logic,   Vi
       lilja:   sense,   Da
       china:   sense,   Vo
       seika:   sense,   Vi
       hiro:    logic,   Vo
       sena:    sense,   Da
       ume:     logic,   Vi
       rina:    logic,   Da
       misuzu:  sense,   Vo
       tsubame: anomaly, balanced (affinityBonus: 0, affinityParam: VOCAL as placeholder)

   雨夜燕 (Tsubame) is an "Anomaly" type with a different mechanic (assertiveness/all-out). Her affinity is modeled as zero bonus since she does not specialize in one parameter.

2. Extend `ProducePlan` in `src/engine/types.ts` -- add an optional `idolId` field:

       export interface ProducePlan {
         slot1Item: Slot1Item;
         slot2Item: Slot2Item;
         slot3Item: Slot3Item;
         weeks: WeekActivity[];
         idolId?: string;
         supportPresetId?: string;
       }

3. Modify `calculateProducePlan()` in `src/engine/planner.ts` to apply the idol affinity bonus. After calculating base gains for any lesson week (legend or regular), if `plan.idolId` is set, look up the idol and multiply the affinity parameter's gain by `(1 + idol.affinityBonus)`, flooring the result.

       // Inside the LEGEND_LESSON and REGULAR_LESSON cases, after computing gains:
       if (idol) {
         gains[idol.affinityParam] = Math.floor(
           gains[idol.affinityParam] * (1 + idol.affinityBonus)
         );
       }

4. Update `src/engine/calculator.ts` barrel file to export idol types and functions:

       export { type Idol, IDOL_DATABASE, getIdolById } from "./idols.ts";

5. Create `src/engine/idols.test.ts`:

       import { describe, expect, test } from "bun:test";
       import { IDOL_DATABASE, getIdolById } from "./idols.ts";
       import { ParameterType } from "./types.ts";

       describe("IDOL_DATABASE", () => {
         test("contains exactly 13 idols", () => {
           expect(IDOL_DATABASE.length).toBe(13);
         });

         test("all idols have unique IDs", () => {
           const ids = IDOL_DATABASE.map((idol) => idol.id);
           expect(new Set(ids).size).toBe(ids.length);
         });

         test("all idols have valid affinity parameters", () => {
           const validParams = Object.values(ParameterType);
           for (const idol of IDOL_DATABASE) {
             expect(validParams).toContain(idol.affinityParam);
           }
         });

         test("all idols have valid plan types", () => {
           for (const idol of IDOL_DATABASE) {
             expect(["sense", "logic", "anomaly"]).toContain(idol.planType);
           }
         });

         test("getIdolById returns correct idol", () => {
           const saki = getIdolById("saki");
           expect(saki).toBeDefined();
           expect(saki!.name).toBe("花海咲季");
           expect(saki!.affinityParam).toBe(ParameterType.VISUAL);
         });

         test("getIdolById returns undefined for unknown id", () => {
           expect(getIdolById("nonexistent")).toBeUndefined();
         });
       });

6. Add planner integration test for idol affinity in `src/engine/planner.test.ts`:

       test("idol affinity bonus increases affinity parameter gains", () => {
         const basePlan = { /* plan without idolId, all Vocal, no items */ };
         const idolPlan = { ...basePlan, idolId: "saki" };  // saki has Vi affinity

         const baseResults = calculateProducePlan(basePlan);
         const idolResults = calculateProducePlan(idolPlan);

         // Saki's Visual gains should be higher due to affinity
         const baseFinalVi = baseResults[baseResults.length - 1].cumulative.visual;
         const idolFinalVi = idolResults[idolResults.length - 1].cumulative.visual;
         expect(idolFinalVi).toBeGreaterThan(baseFinalVi);
       });

Validation: `bun test` passes all existing 34 tests plus 7+ new idol tests. The app continues to work identically since `idolId` is optional.

### Milestone 2: Support Card Parameter Model

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/engine/supportcards.ts`:

       import type { LessonResult } from "./types.ts";

       export interface SupportCardPreset {
         id: string;
         name: string;
         nameEn: string;
         description: string;
         lessonBonus: LessonResult;
         consultationBonus: LessonResult;
         outingBonus: LessonResult;
         examBonus: number;
       }

       export const SUPPORT_PRESETS: readonly SupportCardPreset[] = [
         {
           id: "none",
           name: "なし",
           nameEn: "None",
           description: "サポートカードの効果を計算に含めません",
           lessonBonus: { vocal: 0, dance: 0, visual: 0 },
           consultationBonus: { vocal: 0, dance: 0, visual: 0 },
           outingBonus: { vocal: 0, dance: 0, visual: 0 },
           examBonus: 0,
         },
         {
           id: "balanced",
           name: "バランス",
           nameEn: "Balanced",
           description: "汎用的なサポートカード編成",
           lessonBonus: { vocal: 5, dance: 5, visual: 5 },
           consultationBonus: { vocal: 8, dance: 8, visual: 8 },
           outingBonus: { vocal: 5, dance: 5, visual: 5 },
           examBonus: 0,
         },
         {
           id: "consultation",
           name: "相談軸",
           nameEn: "Consultation-focused",
           description: "相談でのパラメータ獲得を重視した編成",
           lessonBonus: { vocal: 3, dance: 3, visual: 3 },
           consultationBonus: { vocal: 15, dance: 15, visual: 15 },
           outingBonus: { vocal: 3, dance: 3, visual: 3 },
           examBonus: 0,
         },
         {
           id: "lesson",
           name: "レッスン軸",
           nameEn: "Lesson-focused",
           description: "レッスンでのパラメータ獲得を重視した編成",
           lessonBonus: { vocal: 10, dance: 10, visual: 10 },
           consultationBonus: { vocal: 5, dance: 5, visual: 5 },
           outingBonus: { vocal: 3, dance: 3, visual: 3 },
           examBonus: 0,
         },
       ];

       export function getPresetById(id: string): SupportCardPreset | undefined {
         return SUPPORT_PRESETS.find((preset) => preset.id === id);
       }

   The bonus values are estimates. Wiki data shows individual support cards contributing effects like "consultation Vi+11" or "lesson end Da+6". A typical deck of 6 support cards stacks several of these. The preset values approximate the aggregate.

2. Modify `calculateProducePlan()` in `src/engine/planner.ts` to apply support card preset bonuses. After calculating gains for each week, look up the preset by `plan.supportPresetId` and add the appropriate bonus:

       // After computing gains for a week:
       if (preset) {
         let bonus: LessonResult = { vocal: 0, dance: 0, visual: 0 };
         switch (activity.activityType) {
           case ActivityType.LEGEND_LESSON:
           case ActivityType.REGULAR_LESSON:
             bonus = preset.lessonBonus;
             break;
           case ActivityType.CONSULTATION:
             bonus = preset.consultationBonus;
             break;
           case ActivityType.OUTING:
             bonus = preset.outingBonus;
             break;
         }
         gains.vocal += bonus.vocal;
         gains.dance += bonus.dance;
         gains.visual += bonus.visual;
       }

3. Update barrel file to export support card types.

4. Create `src/engine/supportcards.test.ts`:

       import { describe, expect, test } from "bun:test";
       import { SUPPORT_PRESETS, getPresetById } from "./supportcards.ts";

       describe("SUPPORT_PRESETS", () => {
         test("contains at least 4 presets", () => {
           expect(SUPPORT_PRESETS.length).toBeGreaterThanOrEqual(4);
         });

         test("none preset has zero bonuses", () => {
           const none = getPresetById("none")!;
           expect(none.lessonBonus.vocal).toBe(0);
           expect(none.consultationBonus.dance).toBe(0);
           expect(none.outingBonus.visual).toBe(0);
           expect(none.examBonus).toBe(0);
         });

         test("consultation preset has higher consultation bonus than lesson bonus", () => {
           const consult = getPresetById("consultation")!;
           expect(consult.consultationBonus.vocal)
             .toBeGreaterThan(consult.lessonBonus.vocal);
         });
       });

5. Add planner integration test for support presets in `planner.test.ts`:

       test("support card preset increases parameter gains", () => {
         const basePlan = { /* plan without supportPresetId */ };
         const presetPlan = { ...basePlan, supportPresetId: "consultation" };

         const baseResults = calculateProducePlan(basePlan);
         const presetResults = calculateProducePlan(presetPlan);

         const baseTotal = baseResults[baseResults.length - 1].cumulative;
         const presetTotal = presetResults[presetResults.length - 1].cumulative;

         expect(presetTotal.vocal).toBeGreaterThan(baseTotal.vocal);
       });

Validation: `bun test` passes all tests. The planner returns different (higher) parameter totals when a support preset is selected.

### Milestone 3: Cap-Aware Parameter Calculation

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Add `capped` field to `WeekResult` in `src/engine/types.ts`:

       export interface WeekResult {
         week: Week;
         activityType: ActivityType;
         gains: LessonResult;
         cumulative: LessonResult;
         skillCardCount: number;
         estimated: boolean;
         capped?: { vocal: boolean; dance: boolean; visual: boolean };
       }

2. Modify `calculateProducePlan()` in `src/engine/planner.ts` to clamp cumulative values:

       import { PARAMETER_CAP } from "./exam.ts";

       // After accumulating gains:
       cumulative.vocal += gains.vocal;
       cumulative.dance += gains.dance;
       cumulative.visual += gains.visual;

       const capped = {
         vocal: cumulative.vocal >= PARAMETER_CAP,
         dance: cumulative.dance >= PARAMETER_CAP,
         visual: cumulative.visual >= PARAMETER_CAP,
       };

       cumulative.vocal = Math.min(cumulative.vocal, PARAMETER_CAP);
       cumulative.dance = Math.min(cumulative.dance, PARAMETER_CAP);
       cumulative.visual = Math.min(cumulative.visual, PARAMETER_CAP);

       results.push({
         ...existingFields,
         capped,
       });

3. Add tests in `src/engine/planner.test.ts`:

       test("parameter cap at 2800 is enforced", () => {
         // Create a plan where all lessons train Vocal to exceed 2800
         const plan = createAllVocalPlan();  // helper with all weeks training Vocal
         plan.supportPresetId = "lesson";    // extra gains to push over cap

         const results = calculateProducePlan(plan);
         const final = results[results.length - 1];

         expect(final.cumulative.vocal).toBeLessThanOrEqual(2800);
         expect(final.capped!.vocal).toBe(true);
       });

Validation: `bun test` passes. Parameters never exceed 2,800 in cumulative results.

### Milestone 4: Strategy Optimizer Engine

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/engine/optimizer.ts`:

       import {
         type ProducePlan,
         type WeekActivity,
         ParameterType,
         ActivityType,
         type Slot1Item,
         type Slot2Item,
         type Slot3Item,
       } from "./types.ts";
       import { WEEK_SCHEDULE } from "./constants.ts";
       import { calculateProducePlan } from "./planner.ts";
       import { calculateEvaluation, PARAMETER_CAP } from "./exam.ts";
       import { getIdolById } from "./idols.ts";

       export function generateOptimalPlan(
         idolId: string,
         slot1Item: Slot1Item,
         slot2Item: Slot2Item,
         slot3Item: Slot3Item,
         supportPresetId: string,
       ): ProducePlan {
         const idol = getIdolById(idolId);
         const weeks: WeekActivity[] = [];
         const runningCumulative = { vocal: 0, dance: 0, visual: 0 };

         for (const entry of WEEK_SCHEDULE) {
           const { week, allowedActivities } = entry;

           // Fixed activities with no parameter choice
           if (
             allowedActivities.length === 1 &&
             !isLessonActivity(allowedActivities[0])
           ) {
             weeks.push({ week, activityType: allowedActivities[0] });
             continue;
           }

           // Find the best choice for this week
           let bestChoice: WeekActivity | null = null;
           let bestScore = -Infinity;

           for (const activity of allowedActivities) {
             const paramChoices = isLessonActivity(activity)
               ? [ParameterType.VOCAL, ParameterType.DANCE, ParameterType.VISUAL]
               : [undefined];

             for (const param of paramChoices) {
               const candidate: WeekActivity = {
                 week,
                 activityType: activity,
                 selectedParam: param,
               };

               // Simulate: build full plan with this choice and greedy for rest
               const trialPlan: ProducePlan = {
                 slot1Item, slot2Item, slot3Item,
                 weeks: [...weeks, candidate],
                 idolId,
                 supportPresetId,
               };

               // Evaluate using a heuristic score
               const trialResults = calculateProducePlan(trialPlan);
               const lastResult = trialResults[trialResults.length - 1];
               const { cumulative } = lastResult;

               // Score: sum of parameters, penalizing proximity to cap
               const score = evaluateChoice(cumulative, idol);
               if (score > bestScore) {
                 bestScore = score;
                 bestChoice = candidate;
               }
             }
           }

           weeks.push(bestChoice!);
         }

         return { slot1Item, slot2Item, slot3Item, weeks, idolId, supportPresetId };
       }

       function isLessonActivity(activity: ActivityType): boolean {
         return (
           activity === ActivityType.LEGEND_LESSON ||
           activity === ActivityType.REGULAR_LESSON
         );
       }

       function evaluateChoice(
         cumulative: { vocal: number; dance: number; visual: number },
         idol: ReturnType<typeof getIdolById>,
       ): number {
         // Maximize total parameters while avoiding waste (exceeding cap)
         const effective = {
           vocal: Math.min(cumulative.vocal, PARAMETER_CAP),
           dance: Math.min(cumulative.dance, PARAMETER_CAP),
           visual: Math.min(cumulative.visual, PARAMETER_CAP),
         };
         const total = effective.vocal + effective.dance + effective.visual;

         // Penalize imbalance (to avoid exam penalties)
         const min = Math.min(effective.vocal, effective.dance, effective.visual);
         const balanceBonus = min * 0.1;

         return total + balanceBonus;
       }

   The optimizer uses a week-by-week greedy approach. For each week with a choice, it tries all possible options, evaluates the resulting cumulative parameters using a scoring function that rewards high totals while penalizing waste (exceeding the 2,800 cap) and imbalance (low minimums that would trigger exam penalties). The time complexity is O(18 x 3 x 18) = O(972) calls to `calculateProducePlan` in the worst case, which runs in well under 100ms.

   The `evaluateChoice` function uses the effective (capped) parameter totals. This naturally discourages over-investing in a stat that is already near or at the cap, because additional gains to that stat would be clamped and not improve the score.

2. Update barrel file to export optimizer.

3. Create `src/engine/optimizer.test.ts`:

       import { describe, expect, test } from "bun:test";
       import { generateOptimalPlan } from "./optimizer.ts";
       import { calculateProducePlan } from "./planner.ts";
       import { Slot1Item, Slot2Item, Slot3Item, ParameterType } from "./types.ts";

       describe("generateOptimalPlan", () => {
         test("generates a valid ProducePlan with 18 weeks", () => {
           const plan = generateOptimalPlan(
             "saki",
             Slot1Item.NONE,
             Slot2Item.NONE,
             Slot3Item.NONE,
             "none",
           );
           expect(plan.weeks.length).toBe(18);
           expect(plan.idolId).toBe("saki");
         });

         test("generated plan is processable by calculateProducePlan", () => {
           const plan = generateOptimalPlan(
             "saki",
             Slot1Item.NONE,
             Slot2Item.NONE,
             Slot3Item.NONE,
             "none",
           );
           const results = calculateProducePlan(plan);
           expect(results.length).toBe(18);
         });

         test("optimizer plan scores higher than naive all-vocal plan", () => {
           const optimalPlan = generateOptimalPlan(
             "saki",
             Slot1Item.NONE,
             Slot2Item.NONE,
             Slot3Item.NONE,
             "none",
           );

           // Naive plan: all lessons train Vocal
           const naivePlan = createNaiveVocalPlan("saki");

           const optimalResults = calculateProducePlan(optimalPlan);
           const naiveResults = calculateProducePlan(naivePlan);

           const optimalFinal = optimalResults[optimalResults.length - 1].cumulative;
           const naiveFinal = naiveResults[naiveResults.length - 1].cumulative;

           const optimalTotal =
             optimalFinal.vocal + optimalFinal.dance + optimalFinal.visual;
           const naiveTotal =
             naiveFinal.vocal + naiveFinal.dance + naiveFinal.visual;

           expect(optimalTotal).toBeGreaterThanOrEqual(naiveTotal);
         });

         test("optimizer respects parameter cap", () => {
           const plan = generateOptimalPlan(
             "saki",
             Slot1Item.VOCAL_TEXTBOOK,
             Slot2Item.NONE,
             Slot3Item.NONE,
             "lesson",
           );
           const results = calculateProducePlan(plan);
           const final = results[results.length - 1].cumulative;
           expect(final.vocal).toBeLessThanOrEqual(2800);
           expect(final.dance).toBeLessThanOrEqual(2800);
           expect(final.visual).toBeLessThanOrEqual(2800);
         });
       });

Validation: `bun test` passes all tests. The optimizer produces plans that consistently score higher than naive single-parameter strategies.

### Milestone 5: Idol Selector UI and Strategy Display

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/components/IdolSelector.tsx` -- a dropdown showing all 13 idols with their plan type and affinity:

       import { IDOL_DATABASE, type Idol } from "../engine/idols.ts";

       interface Props {
         selectedId: string | undefined;
         onChange: (idolId: string | undefined) => void;
       }

       export function IdolSelector({ selectedId, onChange }: Props) {
         // Renders a select with optgroups by plan type (Sense / Logic / Anomaly)
         // Each option shows: name + affinity icon
         // A "なし" option for no idol selection
       }

   The component groups idols by plan type for easy navigation. Each option shows the Japanese name and a small indicator of the affinity parameter (Vo/Da/Vi).

2. Create `src/components/SupportPresetSelector.tsx` -- a dropdown for choosing a support card preset:

       import { SUPPORT_PRESETS } from "../engine/supportcards.ts";

       interface Props {
         selectedId: string;
         onChange: (presetId: string) => void;
       }

       export function SupportPresetSelector({ selectedId, onChange }: Props) {
         // Renders a select with preset options
         // Each option shows: name + brief description
       }

3. Create `src/components/StrategyPanel.tsx` -- the generate-plan button and strategy summary:

       import { generateOptimalPlan } from "../engine/optimizer.ts";

       interface Props {
         idolId: string | undefined;
         slot1Item: Slot1Item;
         slot2Item: Slot2Item;
         slot3Item: Slot3Item;
         supportPresetId: string;
         currentEvaluation: number;
         onPlanGenerated: (plan: ProducePlan) => void;
       }

       export function StrategyPanel(props: Props) {
         // "おすすめプランを生成" button
         // When clicked: calls generateOptimalPlan(), computes its evaluation,
         // shows comparison: "推奨: 18,240 / 現在: 16,890"
         // Calls onPlanGenerated to populate the planner
       }

4. Modify `src/app.tsx`:
   - Add `idolId` signal (initially `undefined`).
   - Add `supportPresetId` signal (initially `"none"`).
   - Place IdolSelector and SupportPresetSelector at the top.
   - Add StrategyPanel below selectors, above the planner grid.
   - Wire `onPlanGenerated` to update the plan signal.

5. Update `src/components/SummaryPanel.tsx` to show idol name and affinity info when an idol is selected.

6. Update `src/components/WeekCard.tsx` to show the `capped` indicator when a parameter hits 2,800.

Validation: `bun run dev` shows the full UI. Selecting an idol and clicking "generate plan" populates all 18 weeks. The evaluation score reflects the idol's affinity bonus and support preset effects. Manual overrides work after generation.

### Milestone 6: Integration, Validation, and Deployment

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Run all tests:

       bun test

   Expected: 50+ tests pass across 8+ test files.

2. Run the production build:

       bun run build

   Expected: Build succeeds. Bundle size should be under 50KB JS (Phase 2 was 36KB; adding idol data + optimizer adds ~10KB).

3. Manual testing checklist:
   - Open `bun run dev` in browser.
   - Verify the new IdolSelector dropdown appears with 13 idols grouped by plan type.
   - Select "花海咲季" -- SummaryPanel should show her name and Vi affinity.
   - Select "相談軸" support preset.
   - Click "おすすめプランを生成" -- all 18 weeks should populate with the optimizer's choices.
   - Verify evaluation score is displayed and is higher than a default all-Vocal plan.
   - Manually change one week's parameter choice -- evaluation score updates.
   - Verify no parameter exceeds 2,800 in the cumulative totals.
   - Test with no idol selected (backwards compatibility) -- app should work identically to Phase 2.

4. Push to main for GitHub Pages deployment.

5. Update `_docs/DATA_COLLECTION.md`:
   - Add idol database section with verification status for each idol's plan type and affinity.
   - Add support card preset section noting all values are estimates.
   - Update Phase 3 data gaps section.

Validation: All tests pass, production build succeeds, deployed site works end-to-end.


## Validation and Acceptance

The implementation is complete when:

1. **All tests pass**: `bun test` shows 50+ tests passing across 8+ test files (legend, regular, consultation, outing, planner, exam, idols, supportcards, optimizer).

2. **Idol selection works**: Selecting an idol changes the evaluation score. The affinity bonus is visible in per-week parameter gains (the affinity parameter gains slightly more than without an idol selected).

3. **Support presets work**: Changing the support preset changes parameter totals. The "none" preset produces the same results as Phase 2 (backwards compatibility).

4. **Parameter cap is enforced**: No cumulative parameter exceeds 2,800. The UI shows a visual indicator when a stat is capped.

5. **Optimizer produces good plans**: Clicking "generate plan" fills all 18 weeks. The generated plan has a higher evaluation score than a naive all-Vocal plan. The optimizer avoids over-investing in a single parameter that would hit the cap.

6. **Manual overrides work**: After generating a plan, users can change individual weeks. The evaluation score and cumulative totals update correctly.

7. **Backwards compatibility**: With no idol selected and "none" support preset, the app behaves identically to Phase 2.

8. **Production build succeeds**: `bun run build` produces optimized output under 50KB JS. GitHub Actions deploys successfully.


## Idempotence and Recovery

All steps are idempotent. Files can be recreated by following the plan from scratch. Each milestone is independently testable:

- After Milestone 1, the app works with idol data but no UI changes.
- After Milestone 2, support presets affect calculations but no UI changes.
- After Milestone 3, parameter cap is enforced in the engine.
- After Milestone 4, the optimizer produces plans but no UI to invoke it.
- After Milestone 5, the full UI is available.

Recovery from partial completion: the `idolId` and `supportPresetId` fields are optional in `ProducePlan`, so incomplete milestones cannot break existing functionality. If any milestone fails, the app reverts to Phase 2 behavior by omitting the optional fields.

Full reset: `rm -rf node_modules dist && bun install && bun test && bun run build`.


## Artifacts and Notes

Expected test output after all milestones:

    bun test v1.x.x

    src/engine/calculator.test.ts:
    ✓ calculateLessonParams > Week 4 with no item ...
    ... (6 existing tests)

    src/engine/regular.test.ts:
    ... (existing tests)

    src/engine/planner.test.ts:
    ✓ Full 18-week plan all Vocal no items ...
    ✓ idol affinity bonus increases affinity parameter gains
    ✓ support card preset increases parameter gains
    ✓ parameter cap at 2800 is enforced
    ... (existing + new tests)

    src/engine/idols.test.ts:
    ✓ contains exactly 13 idols
    ✓ all idols have unique IDs
    ✓ all idols have valid affinity parameters
    ✓ all idols have valid plan types
    ✓ getIdolById returns correct idol
    ✓ getIdolById returns undefined for unknown id

    src/engine/supportcards.test.ts:
    ✓ contains at least 4 presets
    ✓ none preset has zero bonuses
    ✓ consultation preset has higher consultation bonus ...

    src/engine/optimizer.test.ts:
    ✓ generates a valid ProducePlan with 18 weeks
    ✓ generated plan is processable by calculateProducePlan
    ✓ optimizer plan scores higher than naive all-vocal plan
    ✓ optimizer respects parameter cap

    50+ pass

Idol database data that needs verification during implementation:

    Idol             | Plan Type | Affinity | Status
    -----------------+-----------+----------+-----------
    花海咲季          | sense     | Vi       | Confirmed (wiki: 100/100/105)
    月村手毬          | logic     | Da       | Needs verification
    藤田ことね        | logic     | Vo       | Needs verification
    有村麻央          | logic     | Vi       | Needs verification
    葛城リーリヤ      | sense     | Da       | Needs verification
    倉本千奈          | sense     | Vo       | Needs verification
    紫雲清夏          | sense     | Vi       | Needs verification
    篠澤広            | logic     | Vo       | Needs verification
    十王星南          | sense     | Da       | Needs verification
    花海佑芽          | logic     | Vi       | Needs verification
    姫崎莉波          | logic     | Da       | Needs verification
    秦谷美鈴          | sense     | Vo       | Needs verification
    雨夜燕            | anomaly   | balanced | Needs verification


## Interfaces and Dependencies

### Dependencies

Same as Phase 2 (no new npm packages needed):
- Bun v1.0+, Vite v7.x, Preact v10.x, @preact/signals v1.x, Tailwind CSS v4.x

### New Exported Interfaces

In `src/engine/idols.ts`:

    interface Idol {
      id: string;
      name: string;
      nameEn: string;
      planType: "sense" | "logic" | "anomaly";
      affinityParam: ParameterType;
      affinityBonus: number;
    }

    const IDOL_DATABASE: readonly Idol[]
    function getIdolById(id: string): Idol | undefined

In `src/engine/supportcards.ts`:

    interface SupportCardPreset {
      id: string;
      name: string;
      nameEn: string;
      description: string;
      lessonBonus: LessonResult;
      consultationBonus: LessonResult;
      outingBonus: LessonResult;
      examBonus: number;
    }

    const SUPPORT_PRESETS: readonly SupportCardPreset[]
    function getPresetById(id: string): SupportCardPreset | undefined

In `src/engine/optimizer.ts`:

    function generateOptimalPlan(
      idolId: string,
      slot1Item: Slot1Item,
      slot2Item: Slot2Item,
      slot3Item: Slot3Item,
      supportPresetId: string,
    ): ProducePlan

Extended in `src/engine/types.ts`:

    interface ProducePlan {
      slot1Item: Slot1Item;
      slot2Item: Slot2Item;
      slot3Item: Slot3Item;
      weeks: WeekActivity[];
      idolId?: string;           // NEW in Phase 3
      supportPresetId?: string;  // NEW in Phase 3
    }

    interface WeekResult {
      week: Week;
      activityType: ActivityType;
      gains: LessonResult;
      cumulative: LessonResult;
      skillCardCount: number;
      estimated: boolean;
      capped?: { vocal: boolean; dance: boolean; visual: boolean };  // NEW in Phase 3
    }

### File Structure After Phase 3

    src/engine/
    ├── types.ts             (extended: idolId, supportPresetId, capped)
    ├── constants.ts         (unchanged)
    ├── legend.ts            (unchanged)
    ├── legend.test.ts
    ├── regular.ts           (unchanged)
    ├── regular.test.ts
    ├── consultation.ts      (unchanged)
    ├── consultation.test.ts
    ├── outing.ts            (unchanged)
    ├── outing.test.ts
    ├── skillcards.ts        (unchanged)
    ├── exam.ts              (unchanged)
    ├── exam.test.ts
    ├── planner.ts           (modified: idol affinity, support preset, cap)
    ├── planner.test.ts      (extended)
    ├── idols.ts             (NEW)
    ├── idols.test.ts        (NEW)
    ├── supportcards.ts      (NEW)
    ├── supportcards.test.ts (NEW)
    ├── optimizer.ts         (NEW)
    ├── optimizer.test.ts    (NEW)
    └── calculator.ts        (barrel file — extended exports)

    src/components/
    ├── IdolSelector.tsx            (NEW)
    ├── SupportPresetSelector.tsx   (NEW)
    ├── StrategyPanel.tsx           (NEW)
    ├── ItemConfigurator.tsx        (unchanged)
    ├── WeekCard.tsx                (modified: cap indicator)
    ├── WeekPlannerGrid.tsx         (unchanged)
    ├── CumulativeChart.tsx         (unchanged)
    └── SummaryPanel.tsx            (modified: idol info)


---

Revision note (2026-02-13): Initial creation of Phase 3 ExecPlan. Builds on completed Phase 1 (EXECPLAN_LESSON_CALCULATOR.md) and Phase 2 (EXECPLAN_WEEKLY_PLANNER.md). Scoped to 6 milestones covering idol database, support card presets, parameter cap enforcement, greedy strategy optimizer, idol selector UI, and integration. Uses estimated data for idol affinity bonuses and support card preset values. Idol database needs per-character verification from wiki. Greedy heuristic chosen over brute-force for simplicity; upgrade path exists if needed.
