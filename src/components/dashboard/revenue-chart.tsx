"use client";

import { useId, useState } from "react";
import { useLanguage } from "@/lib/i18n/provider";
import { revenueSeries } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

type RangeKey = "daily" | "weekly" | "monthly";
type Point = [number, number];

function smoothPath(points: Point[]): string {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0][0]},${points[0][1]}`;
  }

  let path = `M ${points[0][0]},${points[0][1]}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(
      2,
    )},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }

  return path;
}

export function RevenueChart() {
  const { t, formatNumber } = useLanguage();
  const [range, setRange] = useState<RangeKey>("daily");
  const gradientSeed = useId().replace(/[^a-zA-Z0-9]/g, "");

  const data = revenueSeries[range];
  const labels =
    range === "daily"
      ? t.dash.days
      : range === "weekly"
        ? t.dash.weeks
        : t.dash.months;

  const values = data.values;
  const previous = data.previous;
  const max = Math.ceil(Math.max(...values, ...previous) / 4) * 4;

  const width = 660;
  const height = 260;
  const padX = 8;
  const padTop = 24;
  const padBottom = 34;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  const pointFor = (value: number, index: number): Point => [
    padX + (index / Math.max(values.length - 1, 1)) * innerW,
    padTop + (1 - value / max) * innerH,
  ];

  const currentPoints = values.map(pointFor);
  const previousPoints = previous.map(pointFor);

  const linePath = smoothPath(currentPoints);
  const previousPath = smoothPath(previousPoints);
  const lastPoint = currentPoints[currentPoints.length - 1];
  const firstPoint = currentPoints[0];

  const areaPath = `${linePath} L ${lastPoint[0]},${
    height - padBottom
  } L ${firstPoint[0]},${height - padBottom} Z`;

  const ranges: Array<{ key: RangeKey; label: string }> = [
    { key: "daily", label: t.dash.daily },
    { key: "weekly", label: t.dash.weekly },
    { key: "monthly", label: t.dash.monthly },
  ];

  return (
    <section className="glass-card relative overflow-hidden rounded-2xl p-5">
      <div className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-brand-500/[0.06] blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-white">
            {t.dash.revenue}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {t.dash.revenueSub}
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {ranges.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setRange(item.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[11px] font-semibold transition",
                range === item.key
                  ? "bg-brand-500/15 text-brand-300 shadow-[inset_0_0_0_1px_rgba(201,217,229,0.18)]"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-5 rounded-full bg-gradient-to-r from-brand-400 to-accent-400" />
          {t.dash.current}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 border-t border-dashed border-slate-500" />
          {t.dash.previous}
        </span>
        <span className="ml-auto font-medium text-slate-600">
          {formatNumber(max)} {t.dash.mln}
        </span>
      </div>

      <svg
        key={range}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        className="relative mt-1 max-w-[660px] overflow-visible"
        role="img"
        aria-label={t.dash.revenue}
      >
        <defs>
          <linearGradient
            id={`${gradientSeed}-area`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0" stopColor="#c9d9e5" stopOpacity="0.3" />
            <stop offset="1" stopColor="#c9d9e5" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={`${gradientSeed}-line`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0" stopColor="#e7eef4" />
            <stop offset="1" stopColor="#8fa9bc" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padTop + ratio * innerH;
          return (
            <line
              key={ratio}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="rgba(148,163,184,0.08)"
              strokeDasharray="3 6"
            />
          );
        })}

        <path
          d={areaPath}
          fill={`url(#${gradientSeed}-area)`}
          className="animate-fade-in"
        />

        <path
          d={previousPath}
          fill="none"
          stroke="rgba(148,163,184,0.32)"
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={linePath}
          fill="none"
          stroke={`url(#${gradientSeed}-line)`}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="chart-line"
        />

        {values.length <= 7 &&
          currentPoints.map(([cx, cy], index) => (
            <circle
              key={`dot-${index}`}
              cx={cx}
              cy={cy}
              r="3"
              fill="#06080a"
              stroke="#c9d9e5"
              strokeWidth="1.6"
            />
          ))}

        <circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r="8"
          fill="#8fa9bc"
          opacity="0.14"
        />
        <circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r="4"
          fill="#06080a"
          stroke="#b7ccda"
          strokeWidth="2"
        />

        {currentPoints.map(([cx, cy], index) => (
          <circle
            key={`hit-${index}`}
            cx={cx}
            cy={cy}
            r="12"
            fill="transparent"
          >
            <title>
              {`${labels[index]}: ${formatNumber(
                values[index],
                values[index] % 1 === 0 ? 0 : 1,
              )} ${t.dash.mln}`}
            </title>
          </circle>
        ))}
      </svg>

      <div className="relative flex justify-between gap-1 px-0.5 text-[9px] font-medium text-slate-600 sm:text-[10px]">
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className={cn(
              "flex-1 text-center",
              labels.length > 8 &&
                index % 2 === 1 &&
                "invisible sm:visible",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
