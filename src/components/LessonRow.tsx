import { ParameterType, type LessonResult } from "../engine/calculator.ts";

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
