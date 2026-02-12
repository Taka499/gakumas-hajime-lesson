import { ActivityType, ParameterType, type WeekResult } from "../engine/calculator.ts";
import type { WeekScheduleEntry } from "../engine/constants.ts";

const PARAM_OPTIONS: Array<{ value: ParameterType; label: string }> = [
  { value: ParameterType.VOCAL, label: "Vo" },
  { value: ParameterType.DANCE, label: "Da" },
  { value: ParameterType.VISUAL, label: "Vi" },
];

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  [ActivityType.LEGEND_LESSON]: "Lレッスン",
  [ActivityType.REGULAR_LESSON]: "レッスン",
  [ActivityType.CONSULTATION]: "相談",
  [ActivityType.OUTING]: "お出かけ",
  [ActivityType.SPECIAL_TRAINING]: "特訓",
  [ActivityType.MID_EXAM]: "中間試験",
  [ActivityType.FINAL_EXAM]: "最終試験",
};

interface Props {
  schedule: WeekScheduleEntry;
  selectedActivity: ActivityType;
  selectedParam?: ParameterType;
  result: WeekResult;
  onActivityChange: (activity: ActivityType) => void;
  onParamChange: (param: ParameterType) => void;
}

function needsParamSelector(activity: ActivityType): boolean {
  return activity === ActivityType.LEGEND_LESSON || activity === ActivityType.REGULAR_LESSON;
}

export function WeekCard({
  schedule,
  selectedActivity,
  selectedParam,
  result,
  onActivityChange,
  onParamChange,
}: Props) {
  const hasMultipleActivities = schedule.allowedActivities.length > 1;

  return (
    <div
      class={`rounded-lg p-3 ${
        schedule.isLegend
          ? "bg-amber-50 border-2 border-amber-300"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Header */}
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-sm">{schedule.week}週目</span>
        {result.estimated && (
          <span class="text-xs text-orange-500" title="推定値を使用">⚠</span>
        )}
      </div>

      {/* Activity selector (for flexible weeks) */}
      {hasMultipleActivities ? (
        <select
          class="w-full p-1 border rounded text-xs mb-2"
          value={selectedActivity}
          onChange={(e) => onActivityChange((e.target as HTMLSelectElement).value as ActivityType)}
        >
          {schedule.allowedActivities.map((a) => (
            <option key={a} value={a}>{ACTIVITY_LABELS[a]}</option>
          ))}
        </select>
      ) : (
        <div class="text-xs text-gray-500 mb-2">{ACTIVITY_LABELS[selectedActivity]}</div>
      )}

      {/* Param selector (for lessons) */}
      {needsParamSelector(selectedActivity) && (
        <div class="flex gap-1 mb-2">
          {PARAM_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              class={`flex-1 px-1 py-0.5 rounded text-xs transition-colors ${
                selectedParam === value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => onParamChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Gains */}
      <div class="text-xs space-y-0.5">
        <div class="flex justify-between">
          <span class="text-pink-600">Vo</span>
          <span>
            {result.gains.vocal > 0 && <span class="text-green-600">+{result.gains.vocal}</span>}
            {result.gains.vocal === 0 && <span class="text-gray-300">—</span>}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-blue-600">Da</span>
          <span>
            {result.gains.dance > 0 && <span class="text-green-600">+{result.gains.dance}</span>}
            {result.gains.dance === 0 && <span class="text-gray-300">—</span>}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-yellow-600">Vi</span>
          <span>
            {result.gains.visual > 0 && <span class="text-green-600">+{result.gains.visual}</span>}
            {result.gains.visual === 0 && <span class="text-gray-300">—</span>}
          </span>
        </div>
      </div>

      {/* Cumulative (small) */}
      <div class="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
        累計: {result.cumulative.vocal}/{result.cumulative.dance}/{result.cumulative.visual}
      </div>
    </div>
  );
}
