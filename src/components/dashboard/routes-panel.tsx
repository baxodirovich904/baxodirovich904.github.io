"use client";

import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { routeStats } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

export function RoutesPanel() {
  const { t, formatNumber } = useLanguage();

  return (
    <section className="glass-card flex h-full flex-col rounded-2xl p-5">
      <div>
        <h2 className="font-display text-base font-bold tracking-tight text-white">
          {t.dash.routes}
        </h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {t.dash.routesSub}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {routeStats.map((route, index) => {
          const bar =
            route.occupancy >= 85
              ? "from-brand-500 to-accent-400"
              : route.occupancy >= 70
                ? "from-accent-500 to-brand-400"
                : "from-sand-500 to-sand-300";

          return (
            <div key={`${route.from}-${route.to}`} className="group">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 text-xs">
                  <span className="font-mono text-[10px] text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-slate-300">{route.from}</span>
                  <ArrowRight className="size-3 shrink-0 text-slate-600" />
                  <span className="truncate text-slate-300">{route.to}</span>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-slate-200">
                  {route.occupancy}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className={cn(
                    "bar-grow h-full rounded-full bg-gradient-to-r",
                    bar,
                  )}
                  style={
                    {
                      "--w": `${route.occupancy}%`,
                      animationDelay: `${index * 90}ms`,
                    } as CSSProperties
                  }
                />
              </div>

              <p className="mt-1.5 text-[10px] text-slate-600">
                {formatNumber(route.passengers)}{" "}
                {t.dash.tablePassengers.toLowerCase()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4 text-[10px] text-slate-600">
        <span>{t.dash.occupancy}</span>
        <span className="font-semibold text-slate-400">
          {formatNumber(92)}% {t.dash.today.toLowerCase()}
        </span>
      </div>
    </section>
  );
}
