import type { WeekResult } from "../engine/calculator.ts";

const PARAMETER_CAP = 2800;

// Chart layout constants
const PADDING = { top: 16, right: 16, bottom: 28, left: 40 };
const CHART_HEIGHT = 200;

interface Props {
  results: WeekResult[];
}

const LINES = [
  { key: "vocal" as const, color: "#db2777", label: "Vo" },
  { key: "dance" as const, color: "#2563eb", label: "Da" },
  { key: "visual" as const, color: "#ca8a04", label: "Vi" },
];

export function CumulativeChart({ results }: Props) {
  if (results.length === 0) return null;

  const maxValue = Math.max(
    PARAMETER_CAP,
    ...results.flatMap((r) => [
      r.cumulative.vocal,
      r.cumulative.dance,
      r.cumulative.visual,
    ]),
  );

  // Round Y max up to nearest 500 for clean gridlines
  const yMax = Math.ceil(maxValue / 500) * 500;
  const weeks = results.map((r) => r.week as number);
  const xMin = weeks[0]!;
  const xMax = weeks[weeks.length - 1]!;

  // Use a viewBox so the SVG scales responsively
  const viewBoxWidth = 600;
  const plotW = viewBoxWidth - PADDING.left - PADDING.right;
  const plotH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const xScale = (week: number) =>
    PADDING.left + ((week - xMin) / (xMax - xMin)) * plotW;
  const yScale = (value: number) =>
    PADDING.top + plotH - (value / yMax) * plotH;

  // Build polyline points for each parameter
  const polylines = LINES.map(({ key, color, label }) => {
    const points = results
      .map((r) => `${xScale(r.week as number)},${yScale(r.cumulative[key])}`)
      .join(" ");
    return { key, color, label, points };
  });

  // Y axis gridlines (every 500)
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += 500) {
    yTicks.push(v);
  }

  // Cap line y position
  const capY = yScale(PARAMETER_CAP);

  return (
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold">パラメータ推移</h2>
        <div class="flex gap-3 text-xs">
          {LINES.map(({ color, label }) => (
            <span key={label} class="flex items-center gap-1">
              <span
                class="inline-block w-3 h-0.5"
                style={{ backgroundColor: color }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${CHART_HEIGHT}`}
        class="w-full"
        style={{ height: "200px" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y gridlines */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={PADDING.left}
              y1={yScale(v)}
              x2={viewBoxWidth - PADDING.right}
              y2={yScale(v)}
              stroke="#e5e7eb"
              stroke-width="0.5"
            />
            <text
              x={PADDING.left - 4}
              y={yScale(v) + 3}
              text-anchor="end"
              fill="#9ca3af"
              font-size="8"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Cap dashed line */}
        <line
          x1={PADDING.left}
          y1={capY}
          x2={viewBoxWidth - PADDING.right}
          y2={capY}
          stroke="#f97316"
          stroke-width="1"
          stroke-dasharray="4 3"
        />
        <text
          x={viewBoxWidth - PADDING.right + 2}
          y={capY + 3}
          fill="#f97316"
          font-size="7"
        >
          CAP
        </text>

        {/* X axis labels */}
        {results.map((r) => {
          const week = r.week as number;
          return (
            <text
              key={week}
              x={xScale(week)}
              y={CHART_HEIGHT - 4}
              text-anchor="middle"
              fill="#9ca3af"
              font-size="7"
            >
              {week}
            </text>
          );
        })}

        {/* Data lines */}
        {polylines.map(({ key, color, points }) => (
          <polyline
            key={key}
            points={points}
            fill="none"
            stroke={color}
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        ))}

        {/* Data points */}
        {polylines.map(({ key, color }) =>
          results.map((r) => (
            <circle
              key={`${key}-${r.week}`}
              cx={xScale(r.week as number)}
              cy={yScale(r.cumulative[key])}
              r="2.5"
              fill={color}
            />
          )),
        )}
      </svg>
    </div>
  );
}
