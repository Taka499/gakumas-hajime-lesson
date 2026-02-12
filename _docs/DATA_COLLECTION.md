# Data Collection Tracking

This document tracks all game data needed for the 初LEGEND Lesson Parameter Calculator and future phases. Each data point is marked with its verification status.

Statuses: **Verified** (cross-checked against wiki), **Unverified** (single source), **Missing** (not yet collected), **N/A** (out of scope).


## Legend Lesson Base Values (Phase 1 — Verified)

These values assume Challenge P-Item normal difficulty and perfect clear.

| Week | Selected Parameter | Non-Selected (each) | P-Points |
|------|-------------------|---------------------|----------|
| 4    | +140              | +55                 | 80       |
| 7    | +180              | +60                 | 80       |
| 12   | +260              | +70                 | 80       |
| 14   | +370              | +90                 | 80       |
| 16   | +570              | +115                | 80       |

Source: https://wikiwiki.jp/gakumas/初LEGEND

### Distribution Formula (Verified)

The parameter distribution for Legend Lessons works as follows:

1. Each lesson has a **clear score** (baseline) and a **perfect score** (maximum).
2. **Excess points** = points earned beyond the clear score.
3. Selected parameter receives: clear score + (excess ÷ 3).
4. Each non-selected parameter receives: excess ÷ 3.

Example (Week 4): Clear score 85, points from clear to perfect 165, so 165÷3 = 55 per parameter. Selected = 85 + 55 = 140. Others = 55 each.


## Challenge P-Items — Slot 1 (Phase 1 — Verified)

Slot 1 items directly modify lesson parameter gains and are the primary focus of Phase 1.

### Textbook Series (教科書シリーズ)

| Item (JP)        | Item (EN)        | Stat  | Bonus    | Lesson Gain | Rival Score |
|------------------|------------------|-------|----------|-------------|-------------|
| ボーカルの教科書   | Vocal Textbook   | Vo    | +8.5%    | +10%        | +15%        |
| ダンスの教科書     | Dance Textbook   | Da    | +8.5%    | +10%        | +15%        |
| ビジュアルの教科書 | Visual Textbook  | Vi    | +8.5%    | +10%        | +15%        |

Effect: All lesson parameter gains are multiplied by 1.1, then the textbook's specific stat is further multiplied by 1.085. Math uses floor() at each step.

### Recorder Series (レコーダーシリーズ)

| Item (JP)            | Item (EN)          | Stat | Condition       | Bonus  | Activations | Rival Score |
|----------------------|--------------------|------|-----------------|--------|-------------|-------------|
| ボイスレコーダー       | Voice Recorder     | Vo   | 17+ skill cards | +15    | 5           | +8%         |
| ポータブルスピーカー   | Portable Speaker   | Da   | 17+ skill cards | +15    | 5           | +8%         |
| メイクアップミラー     | Makeup Mirror      | Vi   | 17+ skill cards | +15    | 5           | +8%         |

Effect: When you own 17 or more skill cards, adds a flat +15 to the specified stat per activation. Up to 5 activations.


## Challenge P-Items — Slot 2 (Phase 2+ — Cataloged)

Slot 2 items trigger during outings or activity support. They affect skill card acquisition, provide percentage buffs to rival exam scores, and grant status effects. They do NOT affect lesson parameter gains directly.

### Outing/Support Trigger Items

| Item (JP)                | Trigger              | Effect                                    | Activations | Rival Score |
|--------------------------|----------------------|-------------------------------------------|-------------|-------------|
| お守りストラップ           | Outing               | Acquire Focus skill card                  | 3           | +5%         |
| ハンドタオル              | Outing               | Acquire Enthusiasm skill card             | 3           | +5%         |
| シュシュ                  | Outing               | Acquire Impression skill card             | 3           | +5%         |
| マフラー                  | Outing               | Acquire Motivation skill card             | 3           | +5%         |
| フリルのハンカチ           | Outing               | Acquire Focus/Enthusiasm skill card       | 3           | +5%         |
| ポケットティッシュ         | Outing               | Acquire Focus/Impression skill card       | 3           | +5%         |
| ミニポーチ                | Outing               | Acquire Focus/Motivation skill card       | 3           | +5%         |
| リボンのヘアピン           | Outing               | Acquire Enthusiasm/Impression skill card  | 3           | +5%         |
| ネイルシール              | Outing               | Acquire Enthusiasm/Motivation skill card  | 3           | +5%         |
| 入浴剤                   | Outing               | Acquire Impression/Motivation skill card  | 3           | +5%         |
| ドリンクホルダー           | Activity Support     | +5% parameter gain at audition start      | 3           | +5%         |
| スクイーズ                | Activity Support     | Status effect: やる気+2 for 1 turn        | 3           | +5%         |
| レッスンウェア            | Activity Support     | +5% parameter gain at lesson start        | 3           | +5%         |

**Note**: "パラメータ上昇量増加" percentages on Slot 2/3 items refer to rival score buffs in exams, NOT to parameter gains from lessons. This is a critical distinction.


## Challenge P-Items — Slot 3 (Phase 2+ — Cataloged)

Slot 3 items are progression-based, triggering every 2-3 skill card acquisitions with stacking bonuses.

### Progression Items (Necktie/Ring Series)

| Item (JP)              | Trigger               | Effect per Activation         | Max Activations | Rival Score per |
|------------------------|-----------------------|-------------------------------|-----------------|-----------------|
| サテンのネクタイ         | Every 2 card acquires | +3% parameter gain (lesson)   | 5               | +3%             |
| シルクのネクタイ         | Every 2 card acquires | +5% parameter gain (lesson)   | 5               | +5%             |
| リネンのネクタイ         | Every 2 card acquires | +8% parameter gain (lesson)   | 5               | +8%             |
| 真鍮のリング            | Every 3 card acquires | +3% parameter gain (audition) | 5               | +3%             |
| 銀のリング              | Every 3 card acquires | +5% parameter gain (audition) | 5               | +5%             |
| 金のリング              | Every 3 card acquires | +8% parameter gain (audition) | 5               | +8%             |

**IMPORTANT**: The "パラメータ上昇量増加 +X%" value here means the rival's score multiplier in exams, not your own parameter gain from lessons. The actual effect on your parameters during lessons is a separate mechanic tied to the "lesson start" trigger.

**Status**: Items cataloged, exact interaction with Legend Lesson parameter formula needs verification in Phase 2.


## Regular Lesson Values (Phase 2 — Partially Collected)

Regular lessons occur at weeks 1, 2, 6, and 15. These contribute to overall parameter totals but are not the focus of Phase 1.

| Week | Selected Parameter | Non-Selected (each) | Notes                |
|------|-------------------|---------------------|----------------------|
| 1-2  | ~60-80            | ~20-30              | Unverified estimates |
| 6    | ~150              | ~40-50              | After +150 bonus     |
| 15   | ~200              | ~50-60              | After +200 bonus     |

**Status**: Missing — exact values need to be extracted from the wiki or measured in-game.


## Consultation Values (Phase 2 — Missing)

Consultations can occur at weeks 5, 8, 13, and 17. They are considered the highest-value activity for parameter growth.

Data needed:
- Base parameter gains per consultation by week
- Drink exchange bonus values
- Interaction with support cards (相談軸 cards)

**Status**: Missing — high priority for Phase 2.


## Outing Values (Phase 2 — Missing)

Outings occur at weeks 3, 5, 11, and 13. They provide parameter gains and trigger Slot 2 item effects.

Data needed:
- Base parameter gains per outing by week
- Parameter gain variation by outing type
- Interaction with Slot 2 items

**Status**: Missing — needed for Phase 2 weekly planner.


## Parameter Cap (Phase 3 — Verified)

Each parameter (Vo, Da, Vi) caps at **2,800**. This is relevant for the optimizer to know when further investment in a maxed stat becomes wasteful.

Source: Community wiki data.


## Exam Scoring (Phase 2+ — Partially Collected)

### Evaluation Formula (Verified)

    Evaluation = (Parameter Total × 2.1) + Mid-Exam Score + Final-Exam Score

The 2.1 coefficient is specific to 初LEGEND mode.

### Score Bonus Formula (Verified)

    Score Bonus = ceiling(rounddown(ceiling((Adjusted Status) × (Exam Standard Multiplier) × (1 - Penalty Total) + 100) × (1 + Support Bonus)))

### Penalty Threshold (Verified)

A penalty triggers when any attribute drops below `8000 × (Exam Standard Multiplier) / 9`, reducing bonuses by up to 25%.

### Stage Power Formula (Verified)

    Stage Power = (Vocal + Dance + Visual) × 3 + (Stamina × 24) + P-Item Value + Skill Card Total

Note: Stamina is tracked in this formula but HP management is out of scope per user decision.


## Data Gaps — Priority Order

### Phase 1 (Current) — No gaps
All data needed for Legend Lesson + Slot 1 item calculations is verified.

### Phase 2 (Next Priority)
1. Regular lesson base values for weeks 1, 2, 6, 15
2. Consultation parameter gains by week
3. Outing parameter gains by week
4. Slot 3 item interaction with Legend Lesson formula (do necktie "lesson" bonuses stack with textbook?)
5. Full idol database (base stats, growths, specializations)

### Phase 3 (Strategy Advisor)
1. Skill card database (all cards, effects, acquisition sources)
2. Support card database (effects, bonuses)
3. Detailed exam scoring data (rival AI behavior, scoring curves)
4. Optimal strategy paths per idol type


## Revision History

- 2026-02-13: Initial creation. Phase 1 data fully verified. Slot 2/3 items cataloged with critical correction about パラメータ上昇量増加 meaning rival score, not parameter gains.
