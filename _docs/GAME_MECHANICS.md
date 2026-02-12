# 学園アイドルマスター (Gakuen Idol Master) - 初LEGEND Mode Mechanics

This document provides comprehensive reference material for understanding the parameter system and lesson mechanics in 学園アイドルマスター's 初LEGEND (Hatsu LEGEND) game mode. All information was gathered from the community wiki at wikiwiki.jp/gakumas (not an official source; data is compiled by players).

## Overview

学園アイドルマスター is an idol training game where players develop idols through a "Produce" mode spanning multiple weeks. The goal is to maximize three core parameters (Vocal, Dance, Visual) and achieve high scores in exams. The 初LEGEND mode is the highest difficulty tier within the "初" (Hatsu/Initial) category.

## Core Parameters

The game uses three fundamental parameters that determine an idol's performance:

- **Vocal (Vo)**: Singing ability
- **Dance (Da)**: Dancing ability
- **Visual (Vi)**: Appearance and stage presence

These parameters are accumulated throughout the Produce mode via lessons, consultations, and other activities. Higher parameters lead to better exam scores and overall stage power.

### Parameter Contribution to Stage Power

The Stage Overall Power (ステージ総合力) formula is:

```
Stage Power = (Vocal + Dance + Visual) × 3 + (Stamina × 24) + P-Item Value + Skill Card Total
```

Key points:
- Parameters are multiplied by 3 in the final calculation
- Stamina has a large multiplier (×24), making it highly valuable
- SSR P-Items contribute 180 points each; SR items contribute 135 points each

## 初LEGEND Mode Structure

### Weekly Schedule (18 Weeks Total)

| Week | Activity Type | Notes |
|------|---------------|-------|
| 1-2 | Lessons | Initial skill card acquisition |
| 3 | Outing | Activity support available |
| 4 | **Legend Lesson #1** | First major parameter boost |
| 5 | Outing/Consultation | Activity support available |
| 6 | Lesson | Enhanced parameters (+150) |
| 7 | **Legend Lesson #2** | Second major parameter boost |
| 8 | Consultation | Standard consultation |
| 9 | Special Training | First of 2 available slots |
| 10 | **Mid-Exam** | 70% HP recovery after completion |
| 11 | Outing | Activity support available |
| 12 | **Legend Lesson #3** | Third major parameter boost |
| 13 | Outing/Consultation | Activity support available |
| 14 | **Legend Lesson #4** | Fourth major parameter boost |
| 15 | Lesson | Highest parameters (+200) |
| 16 | **Legend Lesson #5** | Final and largest parameter boost |
| 17 | Consultation/Special Training | Final preparation |
| 18 | **Final Exam** | Maximum scoring potential |

### Activity Limits
- **Outings**: Maximum 4 times
- **Activity Grants**: Maximum 4 times
- **Consultations**: Maximum 4 times (highest value for parameter gains)
- **Special Training**: Maximum 2 times

## Legend Lesson Parameter System

Legend lessons are special lessons that occur at weeks 4, 7, 12, 14, and 16. They provide significantly higher parameter gains compared to regular lessons.

### Base Parameter Values

These values assume Challenge P-Item normal difficulty and perfect clear:

| Week | Selected Parameter | Non-Selected (each) | P-Points |
|------|-------------------|---------------------|----------|
| 4 | +140 | +55 | 80 |
| 7 | +180 | +60 | 80 |
| 12 | +260 | +70 | 80 |
| 14 | +370 | +90 | 80 |
| 16 | +570 | +115 | 80 |

### Parameter Distribution Formula

Legend lessons use a manual scoring system. The parameter distribution works as follows:

1. **Clear Score**: The baseline score needed to complete the lesson
2. **Perfect Score**: The maximum achievable score beyond the clear threshold
3. **Excess Points**: Points earned beyond the clear score

**Distribution Rules:**
- The **selected parameter** receives: Clear Score + (Excess Points ÷ 3)
- Each **non-selected parameter** receives: Excess Points ÷ 3

**Example (Week 4):**
- Clear Score: 85
- Points from clear to perfect: 165
- Excess divided by 3: 165 ÷ 3 = 55
- Selected parameter: 85 + 55 = **140**
- Other two parameters: 55 each

This system ensures that:
- The chosen lesson type always gains the most
- All three parameters still grow during every lesson
- Perfect clears maximize overall parameter gains

## Challenge P-Items (チャレンジPアイテム)

Challenge P-Items are special equipment that modify gameplay in 初LEGEND mode. Players can equip items in 3 slots.

### Slot 1: Rainbow Frame Items (Limit +20-30)

**Textbook Series** (Parameter Bonus Focus):

| Item | Effect | Lesson Bonus | Rival Score |
|------|--------|--------------|-------------|
| Vocal Textbook | Vo +8.5% bonus | +10% param gain at lesson start | +15% |
| Dance Textbook | Da +8.5% bonus | +10% param gain at lesson start | +15% |
| Visual Textbook | Vi +8.5% bonus | +10% param gain at lesson start | +15% |

**Recorder Series** (Skill Card Triggers):

| Item | Trigger Condition | Effect | Activations |
|------|-------------------|--------|-------------|
| Voice Recorder | Own 17+ skill cards | Vo +15 | 5 |
| Portable Speaker | Own 17+ skill cards | Da +15 | 5 |
| Makeup Mirror | Own 17+ skill cards | Vi +15 | 5 |

### Slot 2: Silver Frame Items (Limit +20-30)

These items trigger during outings or activity support, providing:
- Specific skill card type acquisition (Focus, Enthusiasm, Impression, Motivation, etc.)
- +5% parameter gain boost at audition start
- Status effects lasting 1-3 turns
- Rival score +5-15%
- Maximum 3 activations

**Strategic Note**: Slot 2 selection determines whether outings/support activities cause unwanted skill card accumulation, which can be problematic during contest-focused productions.

### Slot 3: Rainbow Frame Items (Limit +20-30)

Progression-based items that trigger every 2-3 skill card acquisitions:
- Stacked parameter bonuses: +3% to +8%
- Lesson/audition gain increases
- Rival score scaling: +3% to +8%

## Factors Affecting Parameter Gains

### 1. Lesson Selection
The chosen lesson type (Vo/Da/Vi) determines which parameter receives the primary boost.

### 2. Clear Performance
Achieving perfect clear maximizes the excess points that get distributed across all parameters.

### 3. Challenge P-Items
- Textbook items provide +8.5% parameter bonus to one stat plus +10% lesson gain
- Recorder items provide flat +15 to specific stats when conditions are met
- Slot 2/3 items provide additional percentage bonuses

### 4. Support Cards
- Consultation-focused cards are considered highest value for parameter growth
- "相談軸" (consultation axis) cards provide bonuses after drink exchanges
- Teacher cards like "きみは、自慢の生徒です" are nearly mandatory for stamina management

### 5. Evaluation Formula
The final evaluation uses:
```
Evaluation = (Parameter Total × 2.1) + Mid-Exam Score + Final-Exam Score
```

Note: The 2.1 coefficient is specific to 初LEGEND mode and differs from other difficulties.

## Exam System

### Mid-Exam (Week 10)
- Occurs at the midpoint of production
- Score caps around 200,000
- 70% HP recovery after completion

### Final Exam (Week 18)
- Maximum scoring potential
- Score caps around 2,000,000
- 70% HP recovery after completion

### Score Calculation

The score bonus formula:
```
Score Bonus = ceiling(rounddown(ceiling((Adjusted Status) × (Exam Standard Multiplier) × (1 - Penalty Total) + 100) × (1 + Support Bonus)))
```

A penalty triggers when any attribute drops below `8000 × (Exam Standard Multiplier) / 9`, reducing bonuses by up to 25%.

## Parameter Calculation Summary

To calculate expected parameter gains for a specific Legend Lesson:

1. **Start with base values** from the table above
2. **Apply Slot 1 Textbook bonus** if equipped: multiply selected parameter by 1.085
3. **Apply Slot 1 lesson bonus**: multiply all lesson gains by 1.10
4. **Apply Slot 2/3 bonuses** based on activation conditions
5. **Add flat bonuses** from Recorder-type items if conditions are met

## References

All information sourced from the community wiki (player-compiled data, not official):
- https://wikiwiki.jp/gakumas/初LEGEND
- https://wikiwiki.jp/gakumas/初LEGEND/チャレンジPアイテム
- https://wikiwiki.jp/gakumas/ステージ総合力算出
- https://wikiwiki.jp/gakumas/システム関連
