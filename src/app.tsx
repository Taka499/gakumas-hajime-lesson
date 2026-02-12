import { effect, signal } from "@preact/signals";
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
import { CumulativeChart } from "./components/CumulativeChart.tsx";
import { SummaryPanel } from "./components/SummaryPanel.tsx";

// --- URL state encoding/decoding ---

const ACTIVITY_TO_CHAR: Record<ActivityType, string> = {
  [ActivityType.LEGEND_LESSON]: "l",
  [ActivityType.REGULAR_LESSON]: "r",
  [ActivityType.CONSULTATION]: "c",
  [ActivityType.OUTING]: "o",
  [ActivityType.ACTIVITY_GRANT]: "g",
  [ActivityType.SPECIAL_TRAINING]: "t",
  [ActivityType.MID_EXAM]: "m",
  [ActivityType.FINAL_EXAM]: "f",
};

const CHAR_TO_ACTIVITY: Record<string, ActivityType> = Object.fromEntries(
  Object.entries(ACTIVITY_TO_CHAR).map(([k, v]) => [v, k as ActivityType])
) as Record<string, ActivityType>;

const PARAM_TO_CHAR: Record<ParameterType, string> = {
  [ParameterType.VOCAL]: "v",
  [ParameterType.DANCE]: "d",
  [ParameterType.VISUAL]: "x",
};

const CHAR_TO_PARAM: Record<string, ParameterType> = Object.fromEntries(
  Object.entries(PARAM_TO_CHAR).map(([k, v]) => [v, k as ParameterType])
) as Record<string, ParameterType>;

function encodePlanToParams(p: ProducePlan): URLSearchParams {
  const params = new URLSearchParams();
  if (p.slot1Item !== Slot1Item.NONE) params.set("s1", p.slot1Item);
  if (p.slot2Item !== Slot2Item.NONE) params.set("s2", p.slot2Item);
  if (p.slot3Item !== Slot3Item.NONE) params.set("s3", p.slot3Item);

  // Encode weeks as two compact strings: activities + params
  let acts = "";
  let prms = "";
  for (const w of p.weeks) {
    acts += ACTIVITY_TO_CHAR[w.activityType] ?? "?";
    prms += w.selectedParam ? PARAM_TO_CHAR[w.selectedParam] : "-";
  }
  params.set("a", acts);
  params.set("p", prms);
  return params;
}

function decodePlanFromParams(params: URLSearchParams): ProducePlan | null {
  const acts = params.get("a");
  const prms = params.get("p");
  if (!acts || !prms || acts.length !== 18 || prms.length !== 18) return null;

  const slot1 = (params.get("s1") ?? Slot1Item.NONE) as Slot1Item;
  const slot2 = (params.get("s2") ?? Slot2Item.NONE) as Slot2Item;
  const slot3 = (params.get("s3") ?? Slot3Item.NONE) as Slot3Item;

  // Validate enum values
  if (!Object.values(Slot1Item).includes(slot1)) return null;
  if (!Object.values(Slot2Item).includes(slot2)) return null;
  if (!Object.values(Slot3Item).includes(slot3)) return null;

  const weeks = WEEK_SCHEDULE.map((entry, i) => {
    const actChar = acts[i]!;
    const paramChar = prms[i]!;
    const activityType = CHAR_TO_ACTIVITY[actChar];
    if (!activityType) return null;
    // Validate activity is allowed for this week
    if (!entry.allowedActivities.includes(activityType)) return null;
    const selectedParam = paramChar !== "-" ? CHAR_TO_PARAM[paramChar] : undefined;
    return {
      week: entry.week as Week,
      activityType,
      selectedParam,
    };
  });

  if (weeks.some((w) => w === null)) return null;

  return {
    slot1Item: slot1,
    slot2Item: slot2,
    slot3Item: slot3,
    weeks: weeks as ProducePlan["weeks"],
  };
}

// --- Default plan ---

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

function loadInitialPlan(): ProducePlan {
  const params = new URLSearchParams(window.location.search);
  if (params.has("a")) {
    const decoded = decodePlanFromParams(params);
    if (decoded) return decoded;
  }
  return buildDefaultPlan();
}

const plan = signal<ProducePlan>(loadInitialPlan());

// Sync plan changes to URL
effect(() => {
  const encoded = encodePlanToParams(plan.value);
  const url = `${window.location.pathname}?${encoded.toString()}`;
  history.replaceState(null, "", url);
});

// --- App ---

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
      <p class="text-gray-600 mb-6 text-sm leading-relaxed">
        学園アイドルマスター 初LEGENDモードの18週プロデュース計画ツールです。
        Pアイテムを選択し、各週のレッスンパラメータを設定すると、Vocal/Dance/Visualの累計獲得値を自動計算します。
        URLに設定が保存されるため、ブラウザのブックマークや共有リンクで計画を保存できます。
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

      <CumulativeChart results={results} />

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
