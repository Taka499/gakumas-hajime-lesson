import { signal } from "@preact/signals";
import {
  ActivityType,
  calculateProducePlan,
  ParameterType,
  type ProducePlan,
  Slot1Item,
  Slot2Item,
  Slot3Item,
  Week,
  WEEK_SCHEDULE,
} from "./engine/calculator.ts";
import { ItemConfigurator } from "./components/ItemConfigurator.tsx";
import { WeekPlannerGrid } from "./components/WeekPlannerGrid.tsx";
import { SummaryPanel } from "./components/SummaryPanel.tsx";

// Build default plan: first allowed activity per week, all lessons default to Vocal
function buildDefaultPlan(): ProducePlan {
  return {
    slot1Item: Slot1Item.NONE,
    slot2Item: Slot2Item.NONE,
    slot3Item: Slot3Item.NONE,
    weeks: WEEK_SCHEDULE.map((entry) => {
      const activityType = entry.allowedActivities[0]!;
      const needsParam =
        activityType === ActivityType.LEGEND_LESSON ||
        activityType === ActivityType.REGULAR_LESSON;
      return {
        week: entry.week as Week,
        activityType,
        selectedParam: needsParam ? ParameterType.VOCAL : undefined,
      };
    }),
  };
}

const plan = signal<ProducePlan>(buildDefaultPlan());

export function App() {
  const currentPlan = plan.value;
  const results = calculateProducePlan(currentPlan);
  const lastResult = results[results.length - 1];
  const finalTotal = lastResult
    ? lastResult.cumulative
    : { vocal: 0, dance: 0, visual: 0 };
  const hasEstimatedData = results.some((r) => r.estimated);

  const updatePlan = (patch: Partial<ProducePlan>) => {
    plan.value = { ...plan.value, ...patch };
  };

  const handleActivityChange = (weekIndex: number, activity: ActivityType) => {
    const weeks = [...currentPlan.weeks];
    const needsParam =
      activity === ActivityType.LEGEND_LESSON ||
      activity === ActivityType.REGULAR_LESSON;
    weeks[weekIndex] = {
      ...weeks[weekIndex]!,
      activityType: activity,
      selectedParam: needsParam ? (weeks[weekIndex]!.selectedParam ?? ParameterType.VOCAL) : undefined,
    };
    updatePlan({ weeks });
  };

  const handleParamChange = (weekIndex: number, param: ParameterType) => {
    const weeks = [...currentPlan.weeks];
    weeks[weekIndex] = { ...weeks[weekIndex]!, selectedParam: param };
    updatePlan({ weeks });
  };

  return (
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold mb-2">
        初LEGEND プロデュース計画
      </h1>
      <p class="text-gray-600 mb-6">
        学園アイドルマスター 初LEGENDモードの18週プロデュースを計画し、パラメータを最適化します。
      </p>

      <ItemConfigurator
        slot1={currentPlan.slot1Item}
        slot2={currentPlan.slot2Item}
        slot3={currentPlan.slot3Item}
        onSlot1Change={(v) => updatePlan({ slot1Item: v })}
        onSlot2Change={(v) => updatePlan({ slot2Item: v })}
        onSlot3Change={(v) => updatePlan({ slot3Item: v })}
      />

      <WeekPlannerGrid
        weekActivities={currentPlan.weeks}
        results={results}
        onActivityChange={handleActivityChange}
        onParamChange={handleParamChange}
      />

      <SummaryPanel total={finalTotal} hasEstimatedData={hasEstimatedData} />

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
