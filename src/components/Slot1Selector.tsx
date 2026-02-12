import { Slot1Item } from "../engine/calculator.ts";

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
