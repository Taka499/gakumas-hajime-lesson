# 初LEGEND Lesson Parameter Calculator

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with `_docs/PLANS.md`.


## Purpose / Big Picture

After this implementation, users can open a web page, configure their Challenge P-Item selections and lesson choices, and instantly see how many Vocal, Dance, and Visual parameters they will gain from each of the five Legend Lessons in 学園アイドルマスター's 初LEGEND mode. Currently, players must manually calculate these values or reference static wiki tables that don't account for their specific P-Item loadout. This tool eliminates that friction.

To see it working: run `bun run dev`, open the local URL in a browser, select P-Items from the Slot 1 dropdown, choose which parameter (Vo/Da/Vi) to train for each Legend Lesson week, and observe the calculated parameter gains update in real-time.

This is Phase 1 of a larger vision to build a full 18-week Produce mode strategy advisor. The architecture established here (engine/UI separation, Vite build pipeline, Preact components) is designed to scale into that future without rewrites.


## Progress

- [x] (2026-02-13) Milestone 1: Project scaffolding (Vite, Preact, Tailwind v4, Bun runtime)
- [x] (2026-02-13) Milestone 2: Core calculation engine with unit tests (6 tests, all passing)
- [x] (2026-02-13) Milestone 3: User interface with Preact components (Slot1Selector, LessonRow, TotalDisplay)
- [x] (2026-02-13) Milestone 4: Integration and validation (build: 25KB JS + 11KB CSS gzipped to ~13KB total)
- [x] (2026-02-13) Milestone 5: GitHub Actions deployment configuration


## Surprises & Discoveries

- Observation: Vite v7.3.1 with @tailwindcss/vite v4.1.18 produces 11.48KB CSS (all Tailwind utilities used). Combined with Preact, total JS bundle is 25.47KB (10KB gzipped). Build time: ~128ms.
- Observation: Bun's `verbatimModuleSyntax` requires explicit `.ts`/`.tsx` extensions in imports within the test runner context. Consistent `.ts` extensions used throughout.


## Decision Log

- Decision: Use Bun as the JavaScript runtime (but NOT as the bundler).
  Rationale: Bun provides fast TypeScript execution and a fast test runner. However, Bun's bundler is less mature than Vite for plugin ecosystem, HMR, and CSS processing. Bun runs Vite, installs packages, and executes tests.
  Date/Author: 2025-01-31 / Initial plan, revised 2026-02-13

- Decision: Use Vite as the build tool and dev server.
  Rationale: Vite provides sub-second HMR during development, a mature plugin ecosystem (Preact, YAML imports, Tailwind), code-splitting, and a battle-tested production build via Rollup. This replaces Bun's built-in bundler from the original plan.
  Date/Author: 2026-02-13 / Architecture review

- Decision: Use Tailwind CSS v4 with Vite build integration (NOT the CDN).
  Rationale: The Tailwind CDN ships ~300KB to the browser at runtime and is marked "for development only" by the Tailwind team. Tailwind v4 with the `@tailwindcss/vite` plugin compiles at build time, producing only ~10KB of CSS (the classes actually used). This is a 30x improvement in CSS payload. Setup is minimal: one plugin in vite.config.ts and one CSS import.
  Date/Author: 2026-02-13 / Architecture review

- Decision: Use Preact for UI rendering instead of vanilla TypeScript DOM manipulation.
  Rationale: While the Phase 1 UI is simple enough for vanilla TS, this project aims to grow into a full 18-week strategy advisor with many interactive components. Preact is 3KB gzipped (virtually zero overhead), provides React-compatible API (vast ecosystem access via preact/compat), and JSX/TSX for declarative UI. Starting with Preact now avoids a costly rewrite at Phase 2-3. Preact Signals provide fine-grained reactivity ideal for a calculation tool where one input change should efficiently propagate through all derived values.
  Date/Author: 2026-02-13 / Architecture review

- Decision: Separate the calculation engine from the UI from day one.
  Rationale: The engine (`src/engine/`) contains pure TypeScript functions with ZERO DOM or UI imports. This enables: (a) unit testing without DOM setup, (b) future use in a Web Worker for the Phase 4 optimizer, (c) potential reuse in other tools. The UI (`src/components/`) imports from the engine but never the reverse.
  Date/Author: 2026-02-13 / Architecture review

- Decision: Deploy via GitHub Actions CI/CD instead of committing dist/ to the repo.
  Rationale: Committing build artifacts pollutes git history, risks forgetting to build, and provides no automated testing. GitHub Actions runs tests, builds, and deploys on every push to main. Total CI time: ~30-60 seconds.
  Date/Author: 2026-02-13 / Architecture review

- Decision: Slot 2/3 P-Items are out of scope for Phase 1.
  Rationale: Slot 2/3 items affect rival scores in exams, not lesson parameter gains directly. They add complexity without improving the core calculation accuracy for Phase 1's purpose (Legend Lesson parameter estimation). They will be modeled in Phase 2+ when exam scoring is in scope.
  Date/Author: 2026-02-13 / Architecture review

- Decision: HP/stamina tracking is out of scope entirely.
  Rationale: Per user direction, HP management adds complexity without sufficient value for the parameter calculation and strategy advisor goals.
  Date/Author: 2026-02-13 / User decision


## Outcomes & Retrospective

Phase 1 implementation complete (2026-02-13). All 5 milestones delivered:

- Scaffolding: Vite + Preact + Tailwind v4 + Bun runtime working correctly
- Engine: 2 core functions with 6 unit tests covering all base values, textbook effects, recorder effects, and total calculations
- UI: 3 components (Slot1Selector, LessonRow, TotalDisplay) with reactive state via Preact Signals
- Build: Production build produces optimized output (~13KB gzipped total)
- CI/CD: GitHub Actions workflow configured for test + build + deploy to Pages

Remaining for future phases: regular lessons (weeks 1/2/6/15), consultations, outings, Slot 2/3 item modeling, idol database, strategy optimizer.


## Context and Orientation

This is a greenfield project. The repository currently contains only:
- `idea.md` — original project concept
- `CLAUDE.md` — project conventions and instructions
- `_docs/PLANS.md` — ExecPlan formatting guidelines
- `_docs/GAME_MECHANICS.md` — comprehensive game mechanics reference
- `_docs/DATA_COLLECTION.md` — data collection tracking with verification status

### Key Terms

- **初LEGEND (Hatsu Legend)**: The highest difficulty mode in the "初" category of the game's Produce mode.
- **Legend Lesson**: Special lessons occurring at weeks 4, 7, 12, 14, and 16 that provide large parameter boosts.
- **Parameters (Vo/Da/Vi)**: Vocal, Dance, and Visual — the three stats that determine idol performance.
- **Challenge P-Items**: Equipment items that modify gameplay, equipped in three slots.
- **Selected Parameter**: The parameter type chosen for a lesson (receives the largest boost).
- **Non-Selected Parameters**: The two parameters not chosen (receive smaller boosts).
- **Engine**: The pure-TypeScript calculation layer (`src/engine/`) with zero DOM dependencies.
- **Vite**: A build tool that provides fast development server with HMR and optimized production builds.
- **Preact**: A 3KB React-compatible UI library that renders components declaratively using JSX.
- **Tailwind CSS v4**: A utility-first CSS framework; v4 compiles at build time via a Vite plugin, producing only the CSS classes actually used.

### Game Mechanics Summary (Self-Contained)

Five Legend Lessons occur during a Produce run. Each lesson has base parameter values assuming perfect clear:

    Week 4:  Selected +140, Others +55 each
    Week 7:  Selected +180, Others +60 each
    Week 12: Selected +260, Others +70 each
    Week 14: Selected +370, Others +90 each
    Week 16: Selected +570, Others +115 each

The parameter distribution works via a manual scoring system: the clear score is assigned entirely to the selected parameter, and any excess points beyond the clear score are divided equally (÷3) among all three parameters. Example for Week 4: clear score = 85, points from clear to perfect = 165, so 165÷3 = 55 per parameter. Selected gets 85+55 = 140, others get 55 each.

Challenge P-Items in Slot 1 modify lesson parameter gains:

    Textbook Items (one per parameter type):
    - Adds +8.5% parameter bonus to one stat type
    - Adds +10% to all lesson parameter gains
    - Rival score +15%

    Recorder Items (one per parameter type):
    - When owning 17+ skill cards, adds flat +15 to one stat
    - Activates up to 5 times
    - Rival score +8%

Slot 2 and Slot 3 items affect rival scores in exams (not lesson parameter gains) and are out of scope for Phase 1. See `_docs/DATA_COLLECTION.md` for full item catalog.

Each parameter caps at 2,800 (not enforced in Phase 1 but noted for future phases).


## Plan of Work

### Milestone 1: Project Scaffolding

Create the project structure with Vite, Preact, TypeScript, and Tailwind CSS v4. After this milestone, running `bun run dev` opens a browser showing a styled page with a heading and placeholder content. Running `bun test` executes without errors (no tests yet).

Files to create:
- `package.json` — dependencies (preact, vite, tailwindcss, etc.) and scripts
- `vite.config.ts` — Vite configuration with Preact and Tailwind plugins
- `tsconfig.json` — TypeScript compiler configuration for Preact JSX
- `src/main.tsx` — Preact app entry point
- `src/app.tsx` — root Preact component (placeholder)
- `src/index.css` — Tailwind CSS entry point
- `src/engine/` — directory for calculation logic (empty initially)
- `index.html` — Vite entry HTML
- `.gitignore` — ignore node_modules, dist, IDE files

### Milestone 2: Core Calculation Engine

Implement the parameter calculation logic in `src/engine/calculator.ts` with comprehensive unit tests in `src/engine/calculator.test.ts`. The engine directory has ZERO imports from any UI library, DOM API, or Preact. It is pure TypeScript with pure functions.

Data structures:
- `LessonWeek` enum: WEEK_4, WEEK_7, WEEK_12, WEEK_14, WEEK_16
- `ParameterType` enum: VOCAL, DANCE, VISUAL
- `Slot1Item` enum: NONE, VOCAL_TEXTBOOK, DANCE_TEXTBOOK, VISUAL_TEXTBOOK, VOICE_RECORDER, PORTABLE_SPEAKER, MAKEUP_MIRROR
- `LessonResult` interface: { vocal: number, dance: number, visual: number }

Core functions:
- `calculateLessonParams(week, selectedParam, slot1Item): LessonResult`
- `calculateTotalParams(lessonChoices, slot1Item): LessonResult`

Test file: `src/engine/calculator.test.ts`

### Milestone 3: User Interface

Build the interactive UI using Preact components in `src/components/`. The app state is managed via Preact Signals for reactive updates.

Components:
- `App` — root component, holds state signals
- `Slot1Selector` — dropdown for Slot 1 P-Item selection
- `LessonRow` — single Legend Lesson week with Vo/Da/Vi toggle buttons and result display
- `LessonList` — renders five LessonRow components
- `TotalDisplay` — shows sum of all lesson results for Vo/Da/Vi

Behavior: changing any input (P-Item dropdown or lesson parameter button) triggers recalculation via signals. All derived values update automatically without manual DOM manipulation.

### Milestone 4: Integration and Validation

Run all tests, verify the complete flow works in the browser, and test edge cases. Cross-browser check on Chrome, Firefox, and Safari.

### Milestone 5: GitHub Actions Deployment

Configure GitHub Actions to build and deploy to GitHub Pages on every push to main. The workflow installs Bun, runs tests, builds with Vite, and deploys the `dist/` directory.


## Concrete Steps

### Milestone 1: Project Scaffolding

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Initialize the project and install dependencies:

       bun init -y
       bun add preact @preact/signals
       bun add -D vite @preact/preset-vite tailwindcss @tailwindcss/vite

2. Create `vite.config.ts`:

       import { defineConfig } from "vite";
       import preact from "@preact/preset-vite";
       import tailwindcss from "@tailwindcss/vite";

       export default defineConfig({
         plugins: [preact(), tailwindcss()],
       });

3. Create `tsconfig.json`:

       {
         "compilerOptions": {
           "target": "ES2020",
           "module": "ESNext",
           "moduleResolution": "bundler",
           "strict": true,
           "esModuleInterop": true,
           "skipLibCheck": true,
           "jsx": "react-jsx",
           "jsxImportSource": "preact",
           "paths": {
             "react": ["./node_modules/preact/compat/"],
             "react-dom": ["./node_modules/preact/compat/"]
           }
         },
         "include": ["src/**/*"]
       }

4. Create directory structure:

       mkdir -p src/engine src/components

5. Create `src/index.css`:

       @import "tailwindcss";

6. Create `src/main.tsx`:

       import { render } from "preact";
       import { App } from "./app";
       import "./index.css";

       render(<App />, document.getElementById("app")!);

7. Create `src/app.tsx`:

       export function App() {
         return (
           <div class="max-w-2xl mx-auto">
             <h1 class="text-2xl font-bold mb-2">
               初LEGEND レッスンパラメータ計算機
             </h1>
             <p class="text-gray-600 mb-6">
               学園アイドルマスター
               初LEGENDモードのレッスンで得られるパラメータを計算します。
             </p>
             <p class="text-gray-400">Loading calculator...</p>
           </div>
         );
       }

8. Create `index.html`:

       <!DOCTYPE html>
       <html lang="ja">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>初LEGEND レッスン計算機</title>
       </head>
       <body class="bg-gray-100 min-h-screen p-4 md:p-8">
         <div id="app"></div>
         <script type="module" src="/src/main.tsx"></script>
       </body>
       </html>

9. Update `.gitignore`:

       node_modules/
       dist/
       *.log
       .DS_Store

10. Update `package.json` scripts (merge into whatever `bun init` generated):

        {
          "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview",
            "test": "bun test"
          }
        }

11. Create placeholder engine file `src/engine/calculator.ts`:

        // Parameter calculation logic — implemented in Milestone 2
        export {};

Validation: Run `bun run dev`. Vite's dev server starts (typically at http://localhost:5173). Open the URL in a browser. You should see the heading "初LEGEND レッスンパラメータ計算機" with the subtitle text, styled by Tailwind (gray background, centered content). Run `bun test` — should complete with 0 tests (no errors).


### Milestone 2: Core Calculation Engine

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Implement `src/engine/calculator.ts`:

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

2. Create `src/engine/calculator.test.ts`:

       import { describe, expect, test } from "bun:test";
       import {
         calculateLessonParams,
         calculateTotalParams,
         LessonWeek,
         ParameterType,
         Slot1Item,
       } from "./calculator";

       describe("calculateLessonParams", () => {
         test("Week 4 with no item, selecting Vocal", () => {
           const result = calculateLessonParams(
             LessonWeek.WEEK_4,
             ParameterType.VOCAL,
             Slot1Item.NONE,
           );
           expect(result.vocal).toBe(140);
           expect(result.dance).toBe(55);
           expect(result.visual).toBe(55);
         });

         test("Week 16 with no item, selecting Dance", () => {
           const result = calculateLessonParams(
             LessonWeek.WEEK_16,
             ParameterType.DANCE,
             Slot1Item.NONE,
           );
           expect(result.vocal).toBe(115);
           expect(result.dance).toBe(570);
           expect(result.visual).toBe(115);
         });

         test("Week 4 with Vocal Textbook, selecting Vocal", () => {
           const result = calculateLessonParams(
             LessonWeek.WEEK_4,
             ParameterType.VOCAL,
             Slot1Item.VOCAL_TEXTBOOK,
           );
           // Base: floor(140 * 1.1) = 154, then floor(154 * 1.085) = 167
           expect(result.vocal).toBe(167);
           // Base: floor(55 * 1.1) = 60
           expect(result.dance).toBe(60);
           expect(result.visual).toBe(60);
         });

         test("Week 4 with Voice Recorder, selecting Vocal", () => {
           const result = calculateLessonParams(
             LessonWeek.WEEK_4,
             ParameterType.VOCAL,
             Slot1Item.VOICE_RECORDER,
           );
           expect(result.vocal).toBe(155); // 140 + 15
           expect(result.dance).toBe(55);
           expect(result.visual).toBe(55);
         });

         test("Week 12 with Dance Textbook, selecting Visual", () => {
           const result = calculateLessonParams(
             LessonWeek.WEEK_12,
             ParameterType.VISUAL,
             Slot1Item.DANCE_TEXTBOOK,
           );
           // Selected Visual: floor(260 * 1.1) = 286
           expect(result.visual).toBe(286);
           // Non-selected Vocal: floor(70 * 1.1) = 77
           expect(result.vocal).toBe(77);
           // Non-selected Dance with textbook: floor(floor(70 * 1.1) * 1.085) = floor(77 * 1.085) = 83
           expect(result.dance).toBe(83);
         });
       });

       describe("calculateTotalParams", () => {
         test("All lessons selecting same param with no item", () => {
           const choices = [
             { week: LessonWeek.WEEK_4, selectedParam: ParameterType.VOCAL },
             { week: LessonWeek.WEEK_7, selectedParam: ParameterType.VOCAL },
             { week: LessonWeek.WEEK_12, selectedParam: ParameterType.VOCAL },
             { week: LessonWeek.WEEK_14, selectedParam: ParameterType.VOCAL },
             { week: LessonWeek.WEEK_16, selectedParam: ParameterType.VOCAL },
           ];
           const total = calculateTotalParams(choices, Slot1Item.NONE);
           // Vocal: 140 + 180 + 260 + 370 + 570 = 1520
           expect(total.vocal).toBe(1520);
           // Others: 55 + 60 + 70 + 90 + 115 = 390
           expect(total.dance).toBe(390);
           expect(total.visual).toBe(390);
         });
       });

Validation: Run `bun test` — all 6 tests should pass.


### Milestone 3: User Interface

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `src/components/Slot1Selector.tsx`:

       import { Slot1Item } from "../engine/calculator";

       interface Props {
         value: Slot1Item;
         onChange: (item: Slot1Item) => void;
       }

       export function Slot1Selector({ value, onChange }: Props) {
         return (
           <div class="bg-white rounded-lg shadow p-4 mb-6">
             <h2 class="text-lg font-semibold mb-3">チャレンジPアイテム (スロット1)</h2>
             <select
               class="w-full p-2 border rounded"
               value={value}
               onChange={(e) => onChange((e.target as HTMLSelectElement).value as Slot1Item)}
             >
               <option value="none">なし</option>
               <optgroup label="教科書シリーズ (+8.5%ボーナス, +10%レッスン)">
                 <option value="vocal_textbook">ボーカルの教科書</option>
                 <option value="dance_textbook">ダンスの教科書</option>
                 <option value="visual_textbook">ビジュアルの教科書</option>
               </optgroup>
               <optgroup label="レコーダーシリーズ (+15フラット)">
                 <option value="voice_recorder">ボイスレコーダー</option>
                 <option value="portable_speaker">ポータブルスピーカー</option>
                 <option value="makeup_mirror">メイクアップミラー</option>
               </optgroup>
             </select>
           </div>
         );
       }

2. Create `src/components/LessonRow.tsx`:

       import { ParameterType, type LessonResult } from "../engine/calculator";

       const PARAM_OPTIONS: Array<{ value: ParameterType; label: string }> = [
         { value: ParameterType.VOCAL, label: "Vo" },
         { value: ParameterType.DANCE, label: "Da" },
         { value: ParameterType.VISUAL, label: "Vi" },
       ];

       interface Props {
         weekNumber: number;
         selectedParam: ParameterType;
         result: LessonResult;
         onParamChange: (param: ParameterType) => void;
       }

       export function LessonRow({ weekNumber, selectedParam, result, onParamChange }: Props) {
         return (
           <div class="flex items-center gap-4 p-3 bg-gray-50 rounded">
             <div class="w-20 font-medium">{weekNumber}週目</div>
             <div class="flex gap-2">
               {PARAM_OPTIONS.map(({ value, label }) => (
                 <button
                   key={value}
                   class={`px-3 py-1 rounded text-sm transition-colors ${
                     selectedParam === value
                       ? "bg-indigo-600 text-white"
                       : "bg-gray-200 hover:bg-gray-300"
                   }`}
                   onClick={() => onParamChange(value)}
                 >
                   {label}
                 </button>
               ))}
             </div>
             <div class="flex-1 text-right text-sm">
               <span class="text-pink-600">Vo: {result.vocal}</span>
               {" / "}
               <span class="text-blue-600">Da: {result.dance}</span>
               {" / "}
               <span class="text-yellow-600">Vi: {result.visual}</span>
             </div>
           </div>
         );
       }

3. Create `src/components/TotalDisplay.tsx`:

       import type { LessonResult } from "../engine/calculator";

       interface Props {
         total: LessonResult;
       }

       export function TotalDisplay({ total }: Props) {
         return (
           <div class="bg-white rounded-lg shadow p-4">
             <h2 class="text-lg font-semibold mb-3">合計パラメータ</h2>
             <div class="grid grid-cols-3 gap-4 text-center">
               <div class="bg-pink-100 rounded p-3">
                 <div class="text-sm text-pink-600">Vocal</div>
                 <div class="text-2xl font-bold text-pink-700">{total.vocal}</div>
               </div>
               <div class="bg-blue-100 rounded p-3">
                 <div class="text-sm text-blue-600">Dance</div>
                 <div class="text-2xl font-bold text-blue-700">{total.dance}</div>
               </div>
               <div class="bg-yellow-100 rounded p-3">
                 <div class="text-sm text-yellow-600">Visual</div>
                 <div class="text-2xl font-bold text-yellow-700">{total.visual}</div>
               </div>
             </div>
           </div>
         );
       }

4. Update `src/app.tsx` to wire everything together:

       import { signal } from "@preact/signals";
       import {
         calculateLessonParams,
         calculateTotalParams,
         LessonWeek,
         ParameterType,
         Slot1Item,
       } from "./engine/calculator";
       import { Slot1Selector } from "./components/Slot1Selector";
       import { LessonRow } from "./components/LessonRow";
       import { TotalDisplay } from "./components/TotalDisplay";

       const LESSON_WEEKS = [
         LessonWeek.WEEK_4,
         LessonWeek.WEEK_7,
         LessonWeek.WEEK_12,
         LessonWeek.WEEK_14,
         LessonWeek.WEEK_16,
       ];

       const slot1Item = signal<Slot1Item>(Slot1Item.NONE);
       const lessonChoices = signal<ParameterType[]>([
         ParameterType.VOCAL,
         ParameterType.VOCAL,
         ParameterType.VOCAL,
         ParameterType.VOCAL,
         ParameterType.VOCAL,
       ]);

       export function App() {
         const choices = lessonChoices.value;
         const item = slot1Item.value;

         const lessonResults = LESSON_WEEKS.map((week, i) =>
           calculateLessonParams(week, choices[i], item),
         );

         const total = calculateTotalParams(
           LESSON_WEEKS.map((week, i) => ({ week, selectedParam: choices[i] })),
           item,
         );

         const handleParamChange = (index: number, param: ParameterType) => {
           const next = [...lessonChoices.value];
           next[index] = param;
           lessonChoices.value = next;
         };

         return (
           <div class="max-w-2xl mx-auto">
             <h1 class="text-2xl font-bold mb-2">
               初LEGEND レッスンパラメータ計算機
             </h1>
             <p class="text-gray-600 mb-6">
               学園アイドルマスター
               初LEGENDモードのレッスンで得られるパラメータを計算します。
             </p>

             <Slot1Selector
               value={item}
               onChange={(v) => { slot1Item.value = v; }}
             />

             <div class="bg-white rounded-lg shadow p-4 mb-6">
               <h2 class="text-lg font-semibold mb-3">レジェンドレッスン設定</h2>
               <div class="space-y-4">
                 {LESSON_WEEKS.map((week, i) => (
                   <LessonRow
                     key={week}
                     weekNumber={week}
                     selectedParam={choices[i]}
                     result={lessonResults[i]}
                     onParamChange={(param) => handleParamChange(i, param)}
                   />
                 ))}
               </div>
             </div>

             <TotalDisplay total={total} />

             <p class="text-center text-gray-500 text-sm mt-6">
               データ参照元:{" "}
               <a
                 href="https://wikiwiki.jp/gakumas/初LEGEND"
                 class="underline"
                 target="_blank"
                 rel="noopener"
               >
                 gakumas wiki
               </a>{" "}
               (非公式)
             </p>
           </div>
         );
       }

5. Build and verify:

       bun run build

Validation: Run `bun run dev` and open the browser. You should see:
- A dropdown for Slot 1 P-Item selection with grouped options
- Five rows for Legend Lessons (weeks 4, 7, 12, 14, 16) with Vo/Da/Vi buttons
- Color-coded parameter results per row updating as you click buttons or change the dropdown
- Total parameters displayed at the bottom with pink/blue/yellow cards
- The footer linking to the wiki source


### Milestone 4: Integration and Validation

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Run all tests:

       bun test

   Expected: All 6 tests pass.

2. Run the production build and preview:

       bun run build && bun run preview

3. Manual testing checklist:
   - Open the preview URL in browser
   - Verify default state shows all Vo selected with no P-Item
   - Expected totals without item: Vo 1520, Da 390, Vi 390
   - Select "ボーカルの教科書" — Vocal totals should increase
   - Click different parameter buttons — results should update instantly
   - Try each P-Item option and verify values match test expectations
   - Week 4 + Vocal Textbook + Vo selected → Vo: 167, Da: 60, Vi: 60

4. Cross-browser check:
   - Test in Chrome, Firefox, Safari if available
   - Verify responsive layout on mobile viewport (max-w-2xl should center on desktop, full-width on mobile)


### Milestone 5: GitHub Actions Deployment

Working directory: `/Users/ghensk/Developer/gakumas-hajime-lesson`

1. Create `.github/workflows/deploy.yml`:

       name: Deploy to GitHub Pages
       on:
         push:
           branches: [main]

       permissions:
         contents: read
         pages: write
         id-token: write

       concurrency:
         group: "pages"
         cancel-in-progress: false

       jobs:
         build-and-deploy:
           runs-on: ubuntu-latest
           environment:
             name: github-pages
             url: ${{ steps.deployment.outputs.page_url }}
           steps:
             - uses: actions/checkout@v4
             - uses: oven-sh/setup-bun@v2
             - run: bun install
             - run: bun test
             - run: bun run build
             - uses: actions/upload-pages-artifact@v3
               with:
                 path: dist
             - id: deployment
               uses: actions/deploy-pages@v4

2. After pushing to GitHub, enable Pages:
   - Go to repository Settings → Pages
   - Under "Source", select "GitHub Actions"

Validation: Push to the main branch. The GitHub Actions workflow should run, pass tests, build, and deploy. The site will be available at `https://<username>.github.io/<repo-name>/`.


## Validation and Acceptance

The implementation is complete when:

1. **Unit tests pass**: Running `bun test` shows all 6 tests passing.

2. **Dev server works**: Running `bun run dev` opens a working calculator at localhost.

3. **UI is functional**: The calculator allows:
   - Changing the Slot 1 P-Item selection updates all results
   - Clicking Vo/Da/Vi buttons for each lesson week updates that row's results
   - Total parameters at the bottom reflect the sum of all lesson results

4. **Calculations are correct**: With no P-Item and all lessons set to Vocal:
   - Vocal total = 140 + 180 + 260 + 370 + 570 = 1520
   - Dance total = 55 + 60 + 70 + 90 + 115 = 390
   - Visual total = 55 + 60 + 70 + 90 + 115 = 390

5. **P-Item effects work**: With Vocal Textbook and Week 4 Vocal:
   - Vocal = floor(floor(140 × 1.1) × 1.085) = floor(154 × 1.085) = 167
   - Dance = floor(55 × 1.1) = 60
   - Visual = floor(55 × 1.1) = 60

6. **Production build succeeds**: `bun run build` produces a `dist/` directory with optimized output.

7. **GitHub Actions deploys**: The workflow file is in place and ready for deployment once the repo is pushed.


## Idempotence and Recovery

All steps are idempotent:
- `bun install` can be run multiple times
- `bun run build` always produces fresh output
- `bun run dev` can be restarted freely
- File creation steps overwrite existing files

If something goes wrong:
- Delete `node_modules/` and run `bun install`
- Delete `dist/` and run `bun run build`
- For a complete reset, delete everything except `idea.md`, `CLAUDE.md`, and `_docs/`


## Artifacts and Notes

Expected test output:

    bun test v1.x.x

    src/engine/calculator.test.ts:
    ✓ calculateLessonParams > Week 4 with no item, selecting Vocal
    ✓ calculateLessonParams > Week 16 with no item, selecting Dance
    ✓ calculateLessonParams > Week 4 with Vocal Textbook, selecting Vocal
    ✓ calculateLessonParams > Week 4 with Voice Recorder, selecting Vocal
    ✓ calculateLessonParams > Week 12 with Dance Textbook, selecting Visual
    ✓ calculateTotalParams > All lessons selecting same param with no item

    6 pass


## Interfaces and Dependencies

### Dependencies

- **Bun** (runtime and test runner): v1.0 or later
- **Vite** (build tool and dev server): v6.x
- **Preact** (UI library): v10.x
- **@preact/signals** (reactive state): v1.x
- **@preact/preset-vite** (Vite plugin for Preact JSX): v2.x
- **Tailwind CSS** (utility CSS framework): v4.x
- **@tailwindcss/vite** (Vite plugin for Tailwind): v4.x

### File Structure

    gakumas-hajime-lesson/
    ├── .github/
    │   └── workflows/
    │       └── deploy.yml
    ├── .claude/
    │   └── commands/
    ├── _docs/
    │   ├── PLANS.md
    │   ├── GAME_MECHANICS.md
    │   ├── DATA_COLLECTION.md
    │   └── EXECPLAN_LESSON_CALCULATOR.md
    ├── src/
    │   ├── engine/
    │   │   ├── calculator.ts
    │   │   └── calculator.test.ts
    │   ├── components/
    │   │   ├── Slot1Selector.tsx
    │   │   ├── LessonRow.tsx
    │   │   └── TotalDisplay.tsx
    │   ├── app.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── package.json
    ├── idea.md
    ├── CLAUDE.md
    └── .gitignore

### Exported Interfaces (src/engine/calculator.ts)

    enum LessonWeek { WEEK_4 = 4, WEEK_7 = 7, WEEK_12 = 12, WEEK_14 = 14, WEEK_16 = 16 }
    enum ParameterType { VOCAL = "vocal", DANCE = "dance", VISUAL = "visual" }
    enum Slot1Item { NONE, VOCAL_TEXTBOOK, DANCE_TEXTBOOK, VISUAL_TEXTBOOK, VOICE_RECORDER, PORTABLE_SPEAKER, MAKEUP_MIRROR }
    interface LessonResult { vocal: number; dance: number; visual: number }

    function calculateLessonParams(week: LessonWeek, selectedParam: ParameterType, slot1Item: Slot1Item): LessonResult
    function calculateTotalParams(lessonChoices: Array<{week: LessonWeek, selectedParam: ParameterType}>, slot1Item: Slot1Item): LessonResult


---

Revision note (2026-02-13): Major revision from original plan. Replaced Bun bundler with Vite, Tailwind CDN with Tailwind v4 build, vanilla TypeScript DOM manipulation with Preact + Signals, and manual dist deployment with GitHub Actions CI/CD. Added engine/UI separation architecture. Added clarification that Slot 2/3 items affect rival exam scores (not lesson parameters) and HP tracking is out of scope. All sections updated to reflect the new toolchain and architecture. The calculation logic and test cases are unchanged from the original plan.
