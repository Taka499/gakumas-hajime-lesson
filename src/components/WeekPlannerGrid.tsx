import { ActivityType, ParameterType, type WeekResult } from "../engine/calculator.ts";
import { WEEK_SCHEDULE } from "../engine/constants.ts";
import { WeekCard } from "./WeekCard.tsx";
import type { WeekActivity } from "../engine/types.ts";

interface Props {
  weekActivities: WeekActivity[];
  results: WeekResult[];
  onActivityChange: (weekIndex: number, activity: ActivityType) => void;
  onParamChange: (weekIndex: number, param: ParameterType) => void;
}

export function WeekPlannerGrid({ weekActivities, results, onActivityChange, onParamChange }: Props) {
  return (
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">18週プロデュース計画</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {WEEK_SCHEDULE.map((schedule, i) => (
          <WeekCard
            key={schedule.week}
            schedule={schedule}
            selectedActivity={weekActivities[i]!.activityType}
            selectedParam={weekActivities[i]!.selectedParam}
            result={results[i]!}
            onActivityChange={(activity) => onActivityChange(i, activity)}
            onParamChange={(param) => onParamChange(i, param)}
          />
        ))}
      </div>
    </div>
  );
}
