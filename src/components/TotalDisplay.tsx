import type { LessonResult } from "../engine/calculator.ts";

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
