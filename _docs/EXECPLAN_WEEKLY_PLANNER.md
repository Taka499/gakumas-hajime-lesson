# 初LEGEND 18-Week Produce Planner (Phase 2)

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with `_docs/PLANS.md`. This plan builds upon Phase 1 (see `_docs/EXECPLAN_LESSON_CALCULATOR.md`), which delivered a Legend Lesson parameter calculator with Vite + Preact + Tailwind v4.


## Purpose / Big Picture

After this implementation, users can plan an entire 18-week 初LEGEND Produce run from start to finish. For each week, they choose what activity to perform (lesson type, consultation, outing, etc.) and see how their Vocal, Dance, and Visual parameters accumulate over time. A cumulative parameter chart shows progression, warns when approaching the 2,800 cap per stat, and flags exam penalty thresholds. This replaces the Phase 1 calculator's narrow "5 Legend Lessons only" view with the complete Produce experience.

To see it working: run `bun run dev`, open the browser, configure all 3 P-Item slots, then step through each of the 18 weeks choosing activities. Parameter totals update in real-time as you make choices. The final summary shows total parameters, the expected evaluation score, and whether your plan triggers any exam penalties.

This is Phase 2 of the project roadmap. Phase 1 established the build pipeline, engine/UI separation, and Legend Lesson calculator. Phase 2 expands the engine to cover all activity types and replaces the UI with a full weekly planner. The architecture (engine with zero DOM imports, Preact components consuming engine functions, Vite build) carries forward unchanged.


## Progress

- [ ] Milestone 1: Engine modularization and type system expansion
- [ ] Milestone 2: Regular lesson and activity calculations
- [ ] Milestone 3: Slot 2/3 P-Item modeling (skill card tracking + rival score)
- [ ] Milestone 4: 18-week planner UI
- [ ] Milestone 5: Cumulative display, exam scoring preview, and polish


## Surprises & Discoveries

(None yet — to be updated during implementation)


## Decision Log

- Decision: Modularize the engine into separate files per activity type rather than keeping one calculator.ts.
  Rationale: Phase 1's single `calculator.ts` at 100 lines was manageable, but Phase 2 adds regular lessons, consultations, outings, exams, and skill card tracking. Without modularization, the file would grow to 400+ lines with mixed concerns. Separate files (`legend.ts`, `regular.ts`, `types.ts`, `constants.ts`) allow focused testing and easier review. The main `calculator.ts` becomes a re-export barrel file for backwards compatibility.
  Date/Author: 2026-02-13

- Decision: Use estimated values for data gaps and mark them visibly in both engine and UI.
  Rationale: Consultation and outing parameter gains are not fully documented on the wiki. Blocking implementation until perfect data exists would halt progress indefinitely. Instead, we use reasonable estimates (based on surrounding data patterns), mark them with an `estimated` flag in the data constants, and display a visual indicator in the UI. Players can mentally adjust or report corrections. The data constants file makes it trivial to update values later without touching calculation logic.
  Date/Author: 2026-02-13

- Decision: Keep `calculateLessonParams()` signature unchanged; add new functions alongside it.
  Rationale: Phase 1 consumers (tests, components) depend on `calculateLessonParams(week, selectedParam, slot1Item)`. Rather than changing this to a generic `calculateActivityParams()` that takes different arguments per type, we add new functions (`calculateRegularLessonParams()`, `calculateConsultationParams()`, `calculateOutingParams()`) and a new dispatcher (`calculateWeekResult()`) that calls the appropriate function based on activity type. This preserves all existing tests without modification.
  Date/Author: 2026-02-13

- Decision: Defer exam scoring to Milestone 5 (not a blocker for the planner).
  Rationale: The core value is parameter planning across 18 weeks. Exam scoring depends on additional data (exam standard multiplier, support card bonuses) that adds complexity. The planner is fully useful without exam scores — users primarily care about parameter totals. Exam scoring is additive and can land as the final milestone.
  Date/Author: 2026-02-13

- Decision: Model Slot 2/3 items for their actual effects: skill card acquisition (Slot 2) and rival score modifiers (both).
  Rationale: Slot 2/3 items do NOT affect lesson parameter gains (this was a critical correction from Phase 1 research). However, they matter for Phase 2 because: (a) Slot 2 determines which skill cards you acquire during outings, which affects whether Recorder items (Slot 1) activate (17+ card threshold), and (b) both Slot 2/3 affect rival exam scores, relevant for exam scoring in Milestone 5. Modeling these as a separate tracking system (not mixed into parameter calculation) keeps the architecture clean.
  Date/Author: 2026-02-13

- Decision: HP/stamina remains out of scope.
  Rationale: Per user direction from Phase 1 (recorded in EXECPLAN_LESSON_CALCULATOR.md Decision Log).
  Date/Author: 2026-02-13


## Outcomes & Retrospective

(To be completed after implementation)


## Context and Orientation

### Repository State After Phase 1

The project is a working web application deployed to GitHub Pages. Key paths:

- `src/engine/calculator.ts` — Legend Lesson calculation engine (100 lines). Exports `calculateLessonParams()` and `calculateTotalParams()` with enums `LessonWeek`, `ParameterType`, `Slot1Item` and interface `LessonResult`.
- `src/engine/calculator.test.ts` — 6 unit tests covering base values, textbook effects, recorder effects, total calculations.
- `src/app.tsx` — Root Preact component with two signals (`slot1Item`, `lessonChoices`), renders Slot1Selector, 5 LessonRows, and TotalDisplay.
- `src/components/Slot1Selector.tsx` — Dropdown for Slot 1 P-Item.
- `src/components/LessonRow.tsx` — Single lesson week with Vo/Da/Vi buttons and results.
- `src/components/TotalDisplay.tsx` — Sum of all lesson results in colored cards.
- `src/main.tsx` — Preact render entry point.
- `src/index.css` — Tailwind CSS entry (`@import "tailwindcss"`).
- `index.html` — Vite entry HTML.
- `vite.config.ts` — Vite + Preact + Tailwind plugins, base path for GitHub Pages.
- `_docs/DATA_COLLECTION.md` — Verified data catalog with gap tracking.
- `_docs/GAME_MECHANICS.md` — Full game mechanics reference.
- `.github/workflows/deploy.yml` — CI/CD: test → build → deploy to Pages.

Build: `bun run dev` for development, `bun test` for tests, `bun run build` for production.

### Key Terms

Terms carried from Phase 1 (see `_docs/EXECPLAN_LESSON_CALCULATOR.md` for full definitions): Legend Lesson, Parameters (Vo/Da/Vi), Challenge P-Items, Selected/Non-Selected Parameter, Engine, Vite, Preact.

New terms for Phase 2:

- **Regular Lesson**: Standard lessons at weeks 1, 2, 6, and 15. Same distribution formula as Legend Lessons but with lower base values.
- **Consultation (相談)**: Activity at weeks 5, 8, 13, 17. Considered the highest-value activity for parameter growth. Involves a "drink exchange" mechanic that provides bonus parameters.
- **Outing (お出かけ)**: Activity at weeks 3, 5, 11, 13. Provides parameter gains and triggers Slot 2 item effects (skill card acquisition).
- **Special Training (特訓)**: Available at weeks 9 and 17. Provides skill card upgrades. No direct parameter gain.
- **Activity Grant (活動支援)**: Support actions available up to 4 times. Triggers Slot 2 item effects.
- **Skill Card Count**: The number of skill cards you own. Relevant because Recorder-type Slot 1 items activate only when you own 17 or more cards.
- **Exam Penalty**: When any single parameter falls below `8000 × (Exam Standard Multiplier) / 9`, a penalty reduces exam score bonuses by up to 25%.
- **Parameter Cap**: Each stat (Vo, Da, Vi) maxes at 2,800.
- **Barrel File**: A TypeScript file that re-exports items from multiple other files, providing a single import point.

### 18-Week Schedule

This is the fixed schedule for 初LEGEND mode. The activity type per week is fixed by the game; the user's choice is which parameter to train (for lessons) or which activity variant (for flexible weeks).

    Week 1:  Regular Lesson — initial skill card acquisition
    Week 2:  Regular Lesson — initial skill card acquisition
    Week 3:  Outing — activity support available
    Week 4:  LEGEND Lesson #1 — first major parameter boost
    Week 5:  Outing OR Consultation — activity support available
    Week 6:  Regular Lesson — enhanced parameters (+150 bonus)
    Week 7:  LEGEND Lesson #2 — second major parameter boost
    Week 8:  Consultation — standard consultation
    Week 9:  Special Training — first of 2 available slots
    Week 10: MID-EXAM — 70% HP recovery after (HP out of scope)
    Week 11: Outing — activity support available
    Week 12: LEGEND Lesson #3 — third major parameter boost
    Week 13: Outing OR Consultation — activity support available
    Week 14: LEGEND Lesson #4 — fourth major parameter boost
    Week 15: Regular Lesson — highest regular params (+200 bonus)
    Week 16: LEGEND Lesson #5 — final and largest parameter boost
    Week 17: Consultation OR Special Training — final preparation
    Week 18: FINAL EXAM — maximum scoring potential

Activity limits: Outings max 4, Consultations max 4, Activity Grants max 4, Special Training max 2.


## Plan of Work

### Milestone 1: Engine Modularization and Type System

Split the single `calculator.ts` into focused modules and expand the type system to represent all 18 weeks. After this milestone, all Phase 1 tests still pass, the app still works identically, and new type definitions are in place for Phase 2 features.

Create these new files in `src/engine/`:

- `types.ts` — All shared types and enums. Move `LessonWeek`, `ParameterType`, `Slot1Item`, `LessonResult` here. Add new types: `ActivityType` enum (LEGEND_LESSON, REGULAR_LESSON, CONSULTATION, OUTING, SPECIAL_TRAINING, EXAM), `Week` enum (WEEK_1 through WEEK_18), `Slot2Item` enum, `Slot3Item` enum, `WeekActivity` interface (describes what happens in one week), `ProducePlan` interface (full 18-week plan), `WeekResult` interface (parameter gains + metadata for one week).
- `constants.ts` — All base value tables. Move `BASE_VALUES` here. Add regular lesson base values, consultation estimates, outing estimates. Each value entry carries an `estimated: boolean` flag so the UI can indicate unverified data.
- `legend.ts` — Move Legend Lesson calculation logic here. Export `calculateLegendLessonParams()`.
- `calculator.ts` — Becomes a barrel file. Re-exports everything from `types.ts`, `constants.ts`, `legend.ts`. Phase 1 imports like `import { calculateLessonParams } from "./engine/calculator.ts"` continue to work because the barrel re-exports `calculateLegendLessonParams` as `calculateLessonParams`.

Test migration: Update `calculator.test.ts` imports to verify the barrel file works. No test logic changes.

### Milestone 2: Regular Lesson and Activity Calculations

Add calculation functions for regular lessons, consultations, and outings. After this milestone, `bun test` passes 20+ tests covering all activity types.

New files:
- `src/engine/regular.ts` — `calculateRegularLessonParams(week, selectedParam, slot1Item)`. Same formula as Legend Lessons but uses the regular lesson base values from constants.
- `src/engine/consultation.ts` — `calculateConsultationParams(week)`. Returns parameter gains for a consultation. For now, returns estimated values from constants (marked as estimated). The consultation formula is simpler: flat gains per week, no selected/non-selected distinction (all three stats gain equally, with a bonus to the highest).
- `src/engine/outing.ts` — `calculateOutingParams(week)`. Returns parameter gains for an outing. Estimated values.
- `src/engine/planner.ts` — `calculateProducePlan(plan: ProducePlan): WeekResult[]`. The main Phase 2 function. Takes a full 18-week plan and returns results per week including cumulative totals. Calls the appropriate activity-specific function per week.

Test files:
- `src/engine/regular.test.ts` — Tests for regular lessons with and without P-Items.
- `src/engine/consultation.test.ts` — Tests for consultation gains.
- `src/engine/outing.test.ts` — Tests for outing gains.
- `src/engine/planner.test.ts` — Integration tests: full 18-week plan scenarios.

### Milestone 3: Slot 2/3 and Skill Card Tracking

Model Slot 2/3 P-Items and their effects. This is needed because Slot 2 items control skill card acquisition during outings, and Recorder-type Slot 1 items require 17+ skill cards to activate. After this milestone, the planner correctly tracks skill card count per week and conditionally applies Recorder bonuses.

New/modified files:
- `src/engine/skillcards.ts` — `SkillCardState` interface (count, types acquired). `updateSkillCards(state, week, activityType, slot2Item): SkillCardState` function. Tracks how many cards you have per week based on activities taken.
- `src/engine/legend.ts` — Modify `calculateLegendLessonParams` to accept optional `skillCardCount` parameter. When a Recorder item is equipped and `skillCardCount < 17`, the +15 flat bonus does not apply.
- `src/engine/planner.ts` — Wire skill card tracking into the week-by-week calculation loop. Each week's result depends on the skill card count accumulated from prior weeks.

Test additions:
- Tests for skill card tracking across a full plan.
- Tests for Recorder item conditional activation (below 17 cards = no bonus, at/above 17 = bonus applies).

### Milestone 4: 18-Week Planner UI

Replace the current 5-lesson UI with a full 18-week planner. After this milestone, the app displays all 18 weeks with appropriate activity selectors, cumulative parameter display, and P-Item configuration for all 3 slots.

Component changes:

- `src/components/WeekCard.tsx` (NEW) — Renders one week. Shows week number, activity type label, activity selector (Vo/Da/Vi buttons for lessons, or a label for fixed activities like exams), and parameter gains. Visually distinguishes Legend Lessons (bold/highlighted) from regular activities.
- `src/components/WeekPlannerGrid.tsx` (NEW) — Renders 18 WeekCards in a responsive grid (3 columns on desktop, 1 on mobile). Groups weeks visually: early phase (1-5), mid phase (6-10), late phase (11-18).
- `src/components/ItemConfigurator.tsx` (NEW) — Replaces Slot1Selector. Contains dropdowns for all 3 P-Item slots. Slot 2 and Slot 3 dropdowns with Japanese item names and effect descriptions.
- `src/components/CumulativeChart.tsx` (NEW) — Simple bar or line visualization showing parameter accumulation across 18 weeks. Uses inline SVG or CSS bars (no charting library needed). Highlights the 2,800 cap line.
- `src/components/SummaryPanel.tsx` (NEW) — Replaces TotalDisplay. Shows final parameter totals, estimated evaluation score, and warnings (cap reached, penalty threshold).
- `src/app.tsx` — Rewrite state management. Replace two signals with a single `ProducePlan` signal. Wire all new components.

The old components (`LessonRow.tsx`, `Slot1Selector.tsx`, `TotalDisplay.tsx`) are removed after the new components are integrated.

### Milestone 5: Exam Scoring, Polish, and Deployment

Add exam score projections and final polish. After this milestone, the planner shows estimated mid-exam and final-exam scores, warns about penalties, and deploys cleanly.

New files:
- `src/engine/exam.ts` — `calculateExamScore(params, examType)`. Implements the evaluation formula: `(Parameter Total × 2.1) + Mid-Exam Score + Final-Exam Score`. Calculates penalty if any stat is below threshold.
- `src/engine/exam.test.ts` — Tests for exam scoring, penalty triggering, edge cases.

UI additions:
- Exam weeks (10, 18) in the planner grid show projected scores.
- Penalty warnings appear if any parameter is too low.
- "Estimated data" indicators on weeks using unverified values.
- Final evaluation score displayed prominently in SummaryPanel.


## Concrete Steps

### Milestone 1: Engine Modularization and Type System

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/engine/types.ts` with all type definitions:

       export enum ParameterType {
         VOCAL = "vocal",
         DANCE = "dance",
         VISUAL = "visual",
       }

       export enum Week {
         WEEK_1 = 1, WEEK_2 = 2, WEEK_3 = 3, WEEK_4 = 4,
         WEEK_5 = 5, WEEK_6 = 6, WEEK_7 = 7, WEEK_8 = 8,
         WEEK_9 = 9, WEEK_10 = 10, WEEK_11 = 11, WEEK_12 = 12,
         WEEK_13 = 13, WEEK_14 = 14, WEEK_15 = 15, WEEK_16 = 16,
         WEEK_17 = 17, WEEK_18 = 18,
       }

       export enum ActivityType {
         LEGEND_LESSON = "legend_lesson",
         REGULAR_LESSON = "regular_lesson",
         CONSULTATION = "consultation",
         OUTING = "outing",
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
         selectedParam?: ParameterType;  // for lessons only
       }

       export interface WeekResult {
         week: Week;
         activityType: ActivityType;
         gains: LessonResult;
         cumulative: LessonResult;
         skillCardCount: number;
         estimated: boolean;  // true if any data used was estimated
       }

       export interface ProducePlan {
         slot1Item: Slot1Item;
         slot2Item: Slot2Item;
         slot3Item: Slot3Item;
         weeks: WeekActivity[];
       }

2. Create `src/engine/constants.ts` with all base value tables:

       import { Week } from "./types.ts";

       export interface BaseValue {
         selected: number;
         nonSelected: number;
         estimated: boolean;
       }

       // Legend Lesson base values (verified from wiki)
       export const LEGEND_LESSON_VALUES: Partial<Record<Week, BaseValue>> = {
         [Week.WEEK_4]:  { selected: 140, nonSelected: 55,  estimated: false },
         [Week.WEEK_7]:  { selected: 180, nonSelected: 60,  estimated: false },
         [Week.WEEK_12]: { selected: 260, nonSelected: 70,  estimated: false },
         [Week.WEEK_14]: { selected: 370, nonSelected: 90,  estimated: false },
         [Week.WEEK_16]: { selected: 570, nonSelected: 115, estimated: false },
       };

       // Regular Lesson base values (estimated — need wiki verification)
       export const REGULAR_LESSON_VALUES: Partial<Record<Week, BaseValue>> = {
         [Week.WEEK_1]:  { selected: 70,  nonSelected: 23,  estimated: true },
         [Week.WEEK_2]:  { selected: 70,  nonSelected: 23,  estimated: true },
         [Week.WEEK_6]:  { selected: 150, nonSelected: 45,  estimated: true },
         [Week.WEEK_15]: { selected: 200, nonSelected: 55,  estimated: true },
       };

       // Consultation gains per week (estimated — formula unclear)
       // Consultations give roughly equal gains to all 3 parameters
       export interface ConsultationValue {
         perParam: number;
         estimated: boolean;
       }

       export const CONSULTATION_VALUES: Partial<Record<Week, ConsultationValue>> = {
         [Week.WEEK_5]:  { perParam: 40,  estimated: true },
         [Week.WEEK_8]:  { perParam: 55,  estimated: true },
         [Week.WEEK_13]: { perParam: 75,  estimated: true },
         [Week.WEEK_17]: { perParam: 90,  estimated: true },
       };

       // Outing gains per week (estimated)
       export interface OutingValue {
         perParam: number;
         estimated: boolean;
       }

       export const OUTING_VALUES: Partial<Record<Week, OutingValue>> = {
         [Week.WEEK_3]:  { perParam: 25, estimated: true },
         [Week.WEEK_5]:  { perParam: 30, estimated: true },
         [Week.WEEK_11]: { perParam: 50, estimated: true },
         [Week.WEEK_13]: { perParam: 60, estimated: true },
       };

       // Fixed schedule: what activity is available each week
       // Weeks with multiple options list the alternatives
       import { ActivityType } from "./types.ts";

       export interface WeekScheduleEntry {
         week: Week;
         allowedActivities: ActivityType[];
         isLegend: boolean;
       }

       export const WEEK_SCHEDULE: WeekScheduleEntry[] = [
         { week: Week.WEEK_1,  allowedActivities: [ActivityType.REGULAR_LESSON],  isLegend: false },
         { week: Week.WEEK_2,  allowedActivities: [ActivityType.REGULAR_LESSON],  isLegend: false },
         { week: Week.WEEK_3,  allowedActivities: [ActivityType.OUTING],          isLegend: false },
         { week: Week.WEEK_4,  allowedActivities: [ActivityType.LEGEND_LESSON],   isLegend: true  },
         { week: Week.WEEK_5,  allowedActivities: [ActivityType.OUTING, ActivityType.CONSULTATION], isLegend: false },
         { week: Week.WEEK_6,  allowedActivities: [ActivityType.REGULAR_LESSON],  isLegend: false },
         { week: Week.WEEK_7,  allowedActivities: [ActivityType.LEGEND_LESSON],   isLegend: true  },
         { week: Week.WEEK_8,  allowedActivities: [ActivityType.CONSULTATION],    isLegend: false },
         { week: Week.WEEK_9,  allowedActivities: [ActivityType.SPECIAL_TRAINING], isLegend: false },
         { week: Week.WEEK_10, allowedActivities: [ActivityType.MID_EXAM],        isLegend: false },
         { week: Week.WEEK_11, allowedActivities: [ActivityType.OUTING],          isLegend: false },
         { week: Week.WEEK_12, allowedActivities: [ActivityType.LEGEND_LESSON],   isLegend: true  },
         { week: Week.WEEK_13, allowedActivities: [ActivityType.OUTING, ActivityType.CONSULTATION], isLegend: false },
         { week: Week.WEEK_14, allowedActivities: [ActivityType.LEGEND_LESSON],   isLegend: true  },
         { week: Week.WEEK_15, allowedActivities: [ActivityType.REGULAR_LESSON],  isLegend: false },
         { week: Week.WEEK_16, allowedActivities: [ActivityType.LEGEND_LESSON],   isLegend: true  },
         { week: Week.WEEK_17, allowedActivities: [ActivityType.CONSULTATION, ActivityType.SPECIAL_TRAINING], isLegend: false },
         { week: Week.WEEK_18, allowedActivities: [ActivityType.FINAL_EXAM],      isLegend: false },
       ];

3. Create `src/engine/legend.ts` — Move Legend Lesson logic from `calculator.ts`:

       import { type LessonResult, type ParameterType, type Slot1Item, Week } from "./types.ts";
       import { LEGEND_LESSON_VALUES } from "./constants.ts";

       // Same Textbook/Recorder lookup tables and calculateLegendLessonParams logic
       // as current calculator.ts, but using imports from types.ts and constants.ts.
       // Export: calculateLegendLessonParams(week, selectedParam, slot1Item, skillCardCount?)

   The function signature adds an optional `skillCardCount` parameter (defaults to `17` for backwards compatibility, meaning Recorder items always activate unless explicitly told otherwise). This is used in Milestone 3.

4. Update `src/engine/calculator.ts` to a barrel file:

       // Barrel file — re-exports for backwards compatibility with Phase 1
       export { ParameterType, Slot1Item, type LessonResult } from "./types.ts";
       export { calculateLegendLessonParams as calculateLessonParams } from "./legend.ts";

       // Re-export new Phase 2 types
       export * from "./types.ts";
       export * from "./constants.ts";

       // calculateTotalParams stays here as a convenience wrapper
       import { calculateLegendLessonParams } from "./legend.ts";
       import { type LessonResult, type ParameterType, type Slot1Item, Week } from "./types.ts";

       // Keep LessonWeek as alias for backwards compatibility
       export const LessonWeek = {
         WEEK_4: Week.WEEK_4,
         WEEK_7: Week.WEEK_7,
         WEEK_12: Week.WEEK_12,
         WEEK_14: Week.WEEK_14,
         WEEK_16: Week.WEEK_16,
       } as const;

       export function calculateTotalParams(
         lessonChoices: Array<{ week: Week; selectedParam: ParameterType }>,
         slot1Item: Slot1Item,
       ): LessonResult {
         const total: LessonResult = { vocal: 0, dance: 0, visual: 0 };
         for (const choice of lessonChoices) {
           const result = calculateLegendLessonParams(choice.week, choice.selectedParam, slot1Item);
           total.vocal += result.vocal;
           total.dance += result.dance;
           total.visual += result.visual;
         }
         return total;
       }

5. Verify existing tests pass unchanged:

       bun test

   Expected: All 6 Phase 1 tests pass. The barrel re-exports ensure `import { calculateLessonParams, LessonWeek, ParameterType, Slot1Item } from "./calculator.ts"` still resolves correctly.

### Milestone 2: Regular Lesson and Activity Calculations

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/engine/regular.ts`:

       import { type LessonResult, type ParameterType, type Slot1Item, type Week } from "./types.ts";
       import { REGULAR_LESSON_VALUES } from "./constants.ts";

       // Same formula as Legend Lessons but uses REGULAR_LESSON_VALUES.
       // Export: calculateRegularLessonParams(week, selectedParam, slot1Item)

2. Create `src/engine/consultation.ts`:

       import { type LessonResult, type Week } from "./types.ts";
       import { CONSULTATION_VALUES } from "./constants.ts";

       export function calculateConsultationParams(week: Week): LessonResult & { estimated: boolean } {
         const value = CONSULTATION_VALUES[week];
         if (!value) return { vocal: 0, dance: 0, visual: 0, estimated: true };
         return {
           vocal: value.perParam,
           dance: value.perParam,
           visual: value.perParam,
           estimated: value.estimated,
         };
       }

3. Create `src/engine/outing.ts`:

       import { type LessonResult, type Week } from "./types.ts";
       import { OUTING_VALUES } from "./constants.ts";

       export function calculateOutingParams(week: Week): LessonResult & { estimated: boolean } {
         const value = OUTING_VALUES[week];
         if (!value) return { vocal: 0, dance: 0, visual: 0, estimated: true };
         return {
           vocal: value.perParam,
           dance: value.perParam,
           visual: value.perParam,
           estimated: value.estimated,
         };
       }

4. Create `src/engine/planner.ts` — the main Phase 2 orchestrator:

       import {
         type ProducePlan, type WeekResult, type LessonResult,
         ActivityType, type Week,
       } from "./types.ts";
       import { calculateLegendLessonParams } from "./legend.ts";
       import { calculateRegularLessonParams } from "./regular.ts";
       import { calculateConsultationParams } from "./consultation.ts";
       import { calculateOutingParams } from "./outing.ts";

       export function calculateProducePlan(plan: ProducePlan): WeekResult[] {
         const results: WeekResult[] = [];
         const cumulative: LessonResult = { vocal: 0, dance: 0, visual: 0 };
         let skillCardCount = 0;

         for (const weekActivity of plan.weeks) {
           let gains: LessonResult = { vocal: 0, dance: 0, visual: 0 };
           let estimated = false;

           switch (weekActivity.activityType) {
             case ActivityType.LEGEND_LESSON:
               // call calculateLegendLessonParams with skillCardCount
               break;
             case ActivityType.REGULAR_LESSON:
               // call calculateRegularLessonParams
               break;
             case ActivityType.CONSULTATION:
               // call calculateConsultationParams
               break;
             case ActivityType.OUTING:
               // call calculateOutingParams; increment skillCardCount
               break;
             case ActivityType.SPECIAL_TRAINING:
             case ActivityType.MID_EXAM:
             case ActivityType.FINAL_EXAM:
               // no parameter gains
               break;
           }

           cumulative.vocal += gains.vocal;
           cumulative.dance += gains.dance;
           cumulative.visual += gains.visual;

           results.push({
             week: weekActivity.week,
             activityType: weekActivity.activityType,
             gains,
             cumulative: { ...cumulative },
             skillCardCount,
             estimated,
           });
         }

         return results;
       }

   The switch statement dispatches to the correct calculation function per activity type and accumulates results.

5. Create test files with comprehensive coverage:

       src/engine/regular.test.ts       — Regular lesson with/without P-Items (6+ tests)
       src/engine/consultation.test.ts  — Consultation gains (4+ tests)
       src/engine/outing.test.ts        — Outing gains (4+ tests)
       src/engine/planner.test.ts       — Full 18-week scenarios (4+ tests)

6. Update barrel file `calculator.ts` to re-export new functions.

Validation: `bun test` passes 20+ tests (6 legacy + 18+ new).

### Milestone 3: Slot 2/3 and Skill Card Tracking

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/engine/skillcards.ts`:

       export interface SkillCardState {
         count: number;
       }

       // Initial state: players start with some skill cards from deck building
       export const INITIAL_SKILL_CARD_COUNT = 7;

       // Each outing typically grants 1 skill card (via Slot 2 item)
       // Each regular lesson in weeks 1-2 grants 1-2 skill cards
       // These are estimates; exact values depend on lesson performance
       export function updateSkillCards(
         state: SkillCardState,
         activityType: ActivityType,
         week: Week,
       ): SkillCardState {
         // Implementation based on activity type
       }

2. Modify `src/engine/legend.ts` — make Recorder activation conditional on `skillCardCount >= 17`.

3. Wire into `planner.ts` — track `SkillCardState` through the week loop, pass count to legend/regular lesson functions.

4. Add tests for Recorder conditional activation and skill card progression.

Validation: `bun test` passes all tests including new skill card scenarios.

### Milestone 4: 18-Week Planner UI

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/components/WeekCard.tsx` — renders one week with activity selector and results.

2. Create `src/components/WeekPlannerGrid.tsx` — renders 18 WeekCards in responsive grid.

3. Create `src/components/ItemConfigurator.tsx` — 3 dropdowns for Slot 1/2/3 items.

4. Create `src/components/CumulativeChart.tsx` — simple CSS bar chart showing parameter progression.

5. Create `src/components/SummaryPanel.tsx` — final totals, warnings, evaluation score.

6. Rewrite `src/app.tsx`:
   - Replace two signals with single `ProducePlan` signal
   - Initialize with default plan (all lessons → Vocal, no items)
   - Wire `calculateProducePlan()` to produce all `WeekResult[]`
   - Render new component tree

7. Remove old components: `LessonRow.tsx`, `Slot1Selector.tsx`, `TotalDisplay.tsx`.

Validation: `bun run dev` shows full 18-week planner. Changing any week's activity or P-Item selection updates all downstream results. Build succeeds with `bun run build`.

### Milestone 5: Exam Scoring, Polish, and Deployment

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/engine/exam.ts`:

       import { type LessonResult } from "./types.ts";

       export const EVALUATION_COEFFICIENT = 2.1;  // 初LEGEND specific
       export const PARAMETER_CAP = 2800;

       export function calculateEvaluation(
         params: LessonResult,
         midExamScore: number,
         finalExamScore: number,
       ): number {
         const paramTotal = params.vocal + params.dance + params.visual;
         return (paramTotal * EVALUATION_COEFFICIENT) + midExamScore + finalExamScore;
       }

       export function checkPenalty(params: LessonResult, examMultiplier: number): boolean {
         const threshold = (8000 * examMultiplier) / 9;
         return params.vocal < threshold || params.dance < threshold || params.visual < threshold;
       }

2. Create `src/engine/exam.test.ts` — tests for evaluation formula and penalty check.

3. Update UI: exam weeks show projected scores, SummaryPanel shows evaluation.

4. Add "estimated data" visual indicators (small warning icon) on weeks using unverified values.

5. Verify full build and deploy:

       bun test && bun run build

6. Push to main for GitHub Pages deployment.

Validation: All tests pass. The deployed site shows a full 18-week planner with exam scores and data confidence indicators.


## Validation and Acceptance

The implementation is complete when:

1. **All tests pass**: `bun test` shows 30+ tests passing across 6+ test files.

2. **18-week planner works**: Running `bun run dev` shows a planner with all 18 weeks. Each week has the correct activity type and appropriate selector.

3. **Parameter accumulation is correct**: With no P-Items and all lessons set to Vocal:
   - Week 4 cumulative includes Legend Lesson gains (140 Vo, 55 Da, 55 Vi) plus all prior regular lesson gains
   - Week 16 cumulative shows the sum of all 18 weeks of activities
   - Final totals match manual calculation

4. **Flexible weeks work**: Weeks 5, 13, 17 allow choosing between multiple activity types. Switching between Outing and Consultation updates downstream totals.

5. **P-Item configuration works**: All 3 slots are selectable. Slot 1 affects lesson calculations. Slot 2/3 display effects but don't modify lesson parameter gains.

6. **Estimated data is marked**: Weeks using unverified data show a visual indicator.

7. **Exam scoring shows**: Week 10 and 18 display projected scores. Penalty warnings appear when parameters are unbalanced.

8. **Production build succeeds**: `bun run build` produces optimized output. GitHub Actions deploys.


## Idempotence and Recovery

All steps are idempotent. Files can be recreated by following the plan from scratch. If the engine modularization causes import issues, the fix is always: ensure the barrel file (`calculator.ts`) correctly re-exports all symbols that Phase 1 code depends on.

Recovery from partial completion: Each milestone is independently functional. After Milestone 1, the app works identically to Phase 1. After Milestone 2, the engine has new functions but the UI hasn't changed (old UI still works). Milestone 4 is the breaking change (UI replacement), so it should be completed in one push.

Full reset: `rm -rf node_modules dist && bun install && bun test && bun run build`.


## Artifacts and Notes

Expected test output after all milestones:

    bun test v1.x.x

    src/engine/calculator.test.ts:
    ✓ calculateLessonParams > Week 4 with no item, selecting Vocal
    ✓ calculateLessonParams > Week 16 with no item, selecting Dance
    ✓ calculateLessonParams > Week 4 with Vocal Textbook, selecting Vocal
    ✓ calculateLessonParams > Week 4 with Voice Recorder, selecting Vocal
    ✓ calculateLessonParams > Week 12 with Dance Textbook, selecting Visual
    ✓ calculateTotalParams > All lessons selecting same param with no item

    src/engine/regular.test.ts:
    ✓ Regular lesson base values ...
    ✓ Regular lesson with textbook ...
    ...

    src/engine/planner.test.ts:
    ✓ Full 18-week plan all Vocal no items ...
    ✓ Mixed plan with consultations ...
    ...

    30+ pass


## Interfaces and Dependencies

### Dependencies

Same as Phase 1 (no new npm packages needed):
- Bun v1.0+, Vite v7.x, Preact v10.x, @preact/signals v1.x, Tailwind CSS v4.x

### New Exported Interfaces (src/engine/types.ts)

    enum Week { WEEK_1 = 1 ... WEEK_18 = 18 }
    enum ActivityType { LEGEND_LESSON, REGULAR_LESSON, CONSULTATION, OUTING, SPECIAL_TRAINING, MID_EXAM, FINAL_EXAM }
    enum Slot2Item { NONE, OMAMORI_STRAP, HAND_TOWEL, ... }
    enum Slot3Item { NONE, SATIN_NECKTIE, SILK_NECKTIE, ... }
    interface WeekActivity { week, activityType, selectedParam? }
    interface WeekResult { week, activityType, gains, cumulative, skillCardCount, estimated }
    interface ProducePlan { slot1Item, slot2Item, slot3Item, weeks }

### New Exported Functions

    calculateLegendLessonParams(week, selectedParam, slot1Item, skillCardCount?): LessonResult
    calculateRegularLessonParams(week, selectedParam, slot1Item): LessonResult
    calculateConsultationParams(week): LessonResult & { estimated }
    calculateOutingParams(week): LessonResult & { estimated }
    calculateProducePlan(plan: ProducePlan): WeekResult[]
    calculateEvaluation(params, midExamScore, finalExamScore): number
    checkPenalty(params, examMultiplier): boolean

### File Structure After Phase 2

    src/engine/
    ├── types.ts
    ├── constants.ts
    ├── legend.ts
    ├── legend.test.ts (migrated from calculator.test.ts)
    ├── regular.ts
    ├── regular.test.ts
    ├── consultation.ts
    ├── consultation.test.ts
    ├── outing.ts
    ├── outing.test.ts
    ├── skillcards.ts
    ├── exam.ts
    ├── exam.test.ts
    ├── planner.ts
    ├── planner.test.ts
    └── calculator.ts (barrel file — backwards compatibility)

    src/components/
    ├── WeekCard.tsx
    ├── WeekPlannerGrid.tsx
    ├── ItemConfigurator.tsx
    ├── CumulativeChart.tsx
    └── SummaryPanel.tsx


---

Revision note (2026-02-13): Initial creation of Phase 2 ExecPlan. Builds on completed Phase 1 (EXECPLAN_LESSON_CALCULATOR.md). Scoped to 5 milestones covering engine modularization, all activity types, skill card tracking, 18-week planner UI, and exam scoring. Estimated data values used where wiki data is unavailable, with visual indicators in UI.
