import type { LessonResult } from "../engine/calculator.ts";

const PARAMETER_CAP = 2800;

interface Props {
  total: LessonResult;
  hasEstimatedData: boolean;
}

function CapWarning({ value, label }: { value: number; label: string }) {
  if (value >= PARAMETER_CAP) {
    return <div class="text-xs text-orange-500 mt-1">{label} キャップ到達</div>;
  }
  return null;
}

export function SummaryPanel({ total, hasEstimatedData }: Props) {
  const paramTotal = total.vocal + total.dance + total.visual;

  return (
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">合計パラメータ</h2>
        {hasEstimatedData && (
          <span class="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
            ⚠ 推定値を含む
          </span>
        )}
      </div>
      <div class="grid grid-cols-3 gap-4 text-center mb-4">
        <div class="bg-pink-100 rounded p-3">
          <div class="text-sm text-pink-600">Vocal</div>
          <div class="text-2xl font-bold text-pink-700">{total.vocal}</div>
          <CapWarning value={total.vocal} label="Vo" />
        </div>
        <div class="bg-blue-100 rounded p-3">
          <div class="text-sm text-blue-600">Dance</div>
          <div class="text-2xl font-bold text-blue-700">{total.dance}</div>
          <CapWarning value={total.dance} label="Da" />
        </div>
        <div class="bg-yellow-100 rounded p-3">
          <div class="text-sm text-yellow-600">Visual</div>
          <div class="text-2xl font-bold text-yellow-700">{total.visual}</div>
          <CapWarning value={total.visual} label="Vi" />
        </div>
      </div>
      <div class="text-center text-sm text-gray-500">
        パラメータ合計: <span class="font-semibold text-gray-700">{paramTotal}</span>
        <span class="ml-2">
          評価値 (×2.1): <span class="font-semibold text-gray-700">{Math.floor(paramTotal * 2.1)}</span>
        </span>
      </div>
    </div>
  );
}
