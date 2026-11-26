"use client";

import { useEffect, useId, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

export type StatTone = "ice" | "steel" | "slate" | "sand";

const toneStyles: Record<
  StatTone,
  { icon: string; glow: string; spark: string }
> = {
  ice: {
    icon: "border-brand-400/20 bg-brand-500/10 text-brand-300",
    glow: "bg-brand-500/10",
    spark: "text-brand-400",
  },
  steel: {
    icon: "border-accent-500/20 bg-accent-500/10 text-accent-400",
    glow: "bg-accent-500/10",
    spark: "text-accent-400",
  },
  slate: {
    icon: "border-slate-400/20 bg-slate-500/10 text-slate-300",
    glow: "bg-slate-500/10",
    spark: "text-slate-400",
  },
  sand: {
    icon: "border-sand-400/20 bg-sand-500/10 text-sand-300",
    glow: "bg-sand-500/10",
    spark: "text-sand-400",
  },
};

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function Sparkline({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  const gradientId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const width = 88;
  const height = 34;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width;
    const y = height - 4 - ((value - min) / range) * (height - 8);
    return [x, y] as const;
  });

  const line = points
    .map(
      ([x, y], index) =>
        `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`,
    )
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      fill="none"
      className={cn("h-8 w-20 shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="chart-line"
      />
      <circle cx={last[0]} cy={last[1]} r="2.2" fill="currentColor" />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  decimals = 0,
  suffix,
  trendLabel,
  positive = true,
  sub,
  icon: Icon,
  tone,
  spark,
  delay = 0,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  trendLabel: string;
  positive?: boolean;
  sub: string;
  icon: LucideIcon;
  tone: StatTone;
  spark: number[];
  delay?: number;
}) {
  const { formatNumber } = useLanguage();
  const display = useCountUp(value);
  const styles = toneStyles[tone];

  return (
    <div
      className="glass-card animate-fade-up group relative overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-12 size-32 rounded-full blur-2xl transition duration-500 group-hover:scale-125",
          styles.glow,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            "grid size-10 place-items-center rounded-xl border",
            styles.icon,
          )}
        >
          <Icon className="size-5" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold",
            positive
              ? "bg-brand-500/10 text-brand-300"
              : "bg-rose-500/10 text-rose-300",
          )}
        >
          {positive ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {trendLabel}
        </span>
      </div>

      <p className="relative mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <div className="relative mt-1.5 flex items-end justify-between gap-3">
        <p className="font-display text-[26px] font-bold leading-none text-white">
          {formatNumber(display, decimals)}
          {suffix && (
            <span className="ml-1.5 whitespace-nowrap text-[11px] font-medium text-slate-500">
              {suffix}
            </span>
          )}
        </p>
        <Sparkline data={spark} className={styles.spark} />
      </div>

      <p className="relative mt-2 text-[11px] text-slate-500">{sub}</p>
    </div>
  );
}
