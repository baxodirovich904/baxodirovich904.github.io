"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { trips, type TripStatus } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

const statusStyles: Record<TripStatus, { badge: string; dot: string }> = {
  approved: {
    badge: "bg-brand-500/10 text-brand-300 ring-brand-500/20",
    dot: "bg-brand-400",
  },
  pending: {
    badge: "bg-sand-500/10 text-sand-300 ring-sand-500/20",
    dot: "bg-sand-400",
  },
  rejected: {
    badge: "bg-rose-500/10 text-rose-300 ring-rose-500/20",
    dot: "bg-rose-400",
  },
};

const avatarTones = [
  "from-brand-400 to-accent-500",
  "from-accent-400 to-brand-500",
  "from-slate-400 to-slate-600",
  "from-sand-400 to-sand-600",
  "from-brand-300 to-slate-500",
  "from-sand-300 to-accent-500",
];

export function TripsTable({ onSoon }: { onSoon: () => void }) {
  const { t, formatNumber } = useLanguage();

  return (
    <section className="glass-card overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-white">
            {t.dash.trips}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {t.dash.tripsSub}
          </p>
        </div>
        <button
          type="button"
          onClick={onSoon}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-medium text-slate-400 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-brand-300"
        >
          {t.dash.viewAll}
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left 2xl:min-w-[880px]">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.12em] text-slate-600">
              <th className="px-5 py-3 font-semibold">
                {t.dash.tableRoute}
              </th>
              <th className="px-4 py-3 font-semibold">
                {t.dash.tableTime}
              </th>
              <th className="hidden px-4 py-3 font-semibold 2xl:table-cell">
                {t.dash.tableBus}
              </th>
              <th className="hidden px-4 py-3 font-semibold 2xl:table-cell">
                {t.dash.tableDriver}
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                {t.dash.tablePassengers}
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                {t.dash.tableRevenue}
              </th>
              <th className="px-5 py-3 text-right font-semibold">
                {t.dash.tableStatus}
              </th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, index) => {
              const status = statusStyles[trip.status];
              const initials = trip.driver
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <tr
                  key={trip.id}
                  className="border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3.5">
                    <p className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-slate-200">
                      {trip.from}
                      <ArrowRight className="size-3 text-slate-600" />
                      {trip.to}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-slate-600">
                      {trip.id}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="font-mono text-xs text-slate-300">
                      {trip.time}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3.5 2xl:table-cell">
                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-slate-400">
                      {trip.bus}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3.5 2xl:table-cell">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[9px] font-bold text-night-950",
                          avatarTones[index % avatarTones.length],
                        )}
                      >
                        {initials}
                      </span>
                      <span className="whitespace-nowrap text-xs text-slate-300">
                        {trip.driver}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-center">
                    <span className="text-xs font-semibold text-slate-200">
                      {trip.passengers}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      /{trip.capacity}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <span className="text-xs font-semibold text-white">
                      {formatNumber(trip.revenue)}
                    </span>
                    <span className="ml-1 text-[9px] text-slate-600">
                      {t.common.currency}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset",
                        status.badge,
                      )}
                    >
                      <span
                        className={cn("size-1.5 rounded-full", status.dot)}
                      />
                      {t.status[trip.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
