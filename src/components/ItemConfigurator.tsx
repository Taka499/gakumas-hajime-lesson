import { Slot1Item, Slot2Item, Slot3Item } from "../engine/calculator.ts";

interface Props {
  slot1: Slot1Item;
  slot2: Slot2Item;
  slot3: Slot3Item;
  onSlot1Change: (item: Slot1Item) => void;
  onSlot2Change: (item: Slot2Item) => void;
  onSlot3Change: (item: Slot3Item) => void;
}

export function ItemConfigurator({
  slot1, slot2, slot3,
  onSlot1Change, onSlot2Change, onSlot3Change,
}: Props) {
  return (
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <h2 class="text-lg font-semibold mb-3">チャレンジPアイテム</h2>
      <div class="space-y-3">
        {/* Slot 1 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">スロット1</label>
          <select
            class="w-full p-2 border rounded text-sm"
            value={slot1}
            onChange={(e) => onSlot1Change((e.target as HTMLSelectElement).value as Slot1Item)}
          >
            <option value="none">なし</option>
            <optgroup label="教科書シリーズ (+8.5%ボーナス, +10%レッスン)">
              <option value="vocal_textbook">ボーカルの教科書</option>
              <option value="dance_textbook">ダンスの教科書</option>
              <option value="visual_textbook">ビジュアルの教科書</option>
            </optgroup>
            <optgroup label="レコーダーシリーズ (+15フラット, 17枚以上)">
              <option value="voice_recorder">ボイスレコーダー</option>
              <option value="portable_speaker">ポータブルスピーカー</option>
              <option value="makeup_mirror">メイクアップミラー</option>
            </optgroup>
          </select>
        </div>

        {/* Slot 2 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            スロット2 <span class="text-gray-400 font-normal">(ライバルスコア・スキルカード)</span>
          </label>
          <select
            class="w-full p-2 border rounded text-sm"
            value={slot2}
            onChange={(e) => onSlot2Change((e.target as HTMLSelectElement).value as Slot2Item)}
          >
            <option value="none">なし</option>
            <optgroup label="お出かけ時カード獲得">
              <option value="omamori_strap">お守りストラップ (集中)</option>
              <option value="hand_towel">ハンドタオル (好調)</option>
              <option value="scrunchie">シュシュ (好印象)</option>
              <option value="muffler">マフラー (やる気)</option>
              <option value="frill_handkerchief">フリルのハンカチ (集中/好調)</option>
              <option value="pocket_tissue">ポケットティッシュ (集中/好印象)</option>
              <option value="mini_pouch">ミニポーチ (集中/やる気)</option>
              <option value="ribbon_hairpin">リボンのヘアピン (好調/好印象)</option>
              <option value="nail_sticker">ネイルシール (好調/やる気)</option>
              <option value="bath_salt">入浴剤 (好印象/やる気)</option>
            </optgroup>
            <optgroup label="活動支援時効果">
              <option value="drink_holder">ドリンクホルダー (+5%試験)</option>
              <option value="squeeze">スクイーズ (やる気+2)</option>
              <option value="lesson_wear">レッスンウェア (+5%レッスン)</option>
            </optgroup>
          </select>
        </div>

        {/* Slot 3 */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            スロット3 <span class="text-gray-400 font-normal">(ライバルスコア)</span>
          </label>
          <select
            class="w-full p-2 border rounded text-sm"
            value={slot3}
            onChange={(e) => onSlot3Change((e.target as HTMLSelectElement).value as Slot3Item)}
          >
            <option value="none">なし</option>
            <optgroup label="ネクタイシリーズ (2枚獲得毎)">
              <option value="satin_necktie">サテンのネクタイ (+3%)</option>
              <option value="silk_necktie">シルクのネクタイ (+5%)</option>
              <option value="linen_necktie">リネンのネクタイ (+8%)</option>
            </optgroup>
            <optgroup label="リングシリーズ (3枚獲得毎)">
              <option value="brass_ring">真鍮のリング (+3%)</option>
              <option value="silver_ring">銀のリング (+5%)</option>
              <option value="gold_ring">金のリング (+8%)</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}
