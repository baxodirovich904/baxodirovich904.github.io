"use client";

import {
  ArrowUpRight,
  Download,
  FileBarChart,
  Plus,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";

export function QuickActions({ onSoon }: { onSoon: () => void }) {
  const { t } = useLanguage();

  const actions: Array<{
    label: string;
    icon: LucideIcon;
    tone: string;
  }> = [
    {
      label: t.dash.addTrip,
      icon: Plus,
      tone: "border-brand-400/20 bg-brand-500/10 text-brand-300",
    },
    {
      label: t.dash.addDriver,
      icon: UserRound,
      tone: "border-accent-500/20 bg-accent-500/10 text-accent-400",
    },
    {
      label: t.dash.export,
      icon: Download,
      tone: "border-slate-400/20 bg-slate-500/10 text-slate-300",
    },
    {
      label: t.dash.report,
      icon: FileBarChart,
      tone: "border-sand-400/20 bg-sand-500/10 text-sand-300",
    },
  ];

  return (
    <section className="glass-card rounded-2xl p-5">
      <h2 className="font-display text-base font-bold tracking-tight text-white">
        {t.dash.quick}
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              onClick={onSoon}
              className="group flex flex-col items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-left transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.04]"
            >
              <span
                className={`grid size-8 place-items-center rounded-lg border ${action.tone}`}
              >
                <Icon className="size-4" />
              </span>
              <span className="flex w-full items-center justify-between gap-1 text-[11px] font-medium leading-snug text-slate-400 transition group-hover:text-slate-200">
                {action.label}
                <ArrowUpRight className="size-3.5 shrink-0 text-slate-600 transition group-hover:text-brand-300" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
