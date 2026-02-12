import { signal } from "@preact/signals";
import {
  calculateLessonParams,
  calculateTotalParams,
  LessonWeek,
  ParameterType,
  Slot1Item,
} from "./engine/calculator.ts";
import { Slot1Selector } from "./components/Slot1Selector.tsx";
import { LessonRow } from "./components/LessonRow.tsx";
import { TotalDisplay } from "./components/TotalDisplay.tsx";

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
    calculateLessonParams(week, choices[i]!, item),
  );

  const total = calculateTotalParams(
    LESSON_WEEKS.map((week, i) => ({ week, selectedParam: choices[i]! })),
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
              selectedParam={choices[i]!}
              result={lessonResults[i]!}
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
