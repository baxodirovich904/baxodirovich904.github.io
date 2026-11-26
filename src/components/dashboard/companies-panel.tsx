"use client";

import { useLanguage } from "@/lib/i18n/provider";
import { companies } from "@/lib/demo-data";

const radius = 54;
const circumference = 2 * Math.PI * radius;

export function CompaniesPanel() {
  const { t, formatNumber } = useLanguage();
  const total = companies.reduce((sum, company) => sum + company.revenue, 0);

  const segments = companies.map((company, index) => {
    const length = (company.share / 100) * circumference;
    const offset = companies
      .slice(0, index)
      .reduce(
        (sum, previous) =>
          sum + (previous.share / 100) * circumference,
        0,
      );

    return { ...company, length, offset };
  });

  return (
    <section className="glass-card rounded-2xl p-5">
      <div>
        <h2 className="font-display text-base font-bold tracking-tight text-white">
          {t.dash.companies}
        </h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {t.dash.companiesSub}
        </p>
      </div>

      <div className="relative mx-auto mt-5 grid size-40 place-items-center">
        <svg viewBox="0 0 140 140" className="size-40 -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.08)"
            strokeWidth="12"
          />
          {segments.map((segment) => (
            <circle
              key={segment.name}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="12"
              strokeDasharray={`${Math.max(
                segment.length - 2.5,
                0,
              )} ${circumference}`}
              strokeDashoffset={-segment.offset}
              strokeLinecap="round"
            >
              <title>{`${segment.name}: ${segment.share}%`}</title>
            </circle>
          ))}
        </svg>

        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-2xl font-bold leading-none text-white">
              {formatNumber(total)}
            </p>
            <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
              {t.dash.mln}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {companies.map((company) => (
          <div key={company.name} className="flex items-start gap-2.5">
            <span
              className="mt-1 size-2 shrink-0 rounded-full"
              style={{ backgroundColor: company.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-slate-300">{company.name}</p>
              <p className="text-[10px] text-slate-600">
                {formatNumber(company.revenue)} {t.dash.mln}
              </p>
            </div>
            <span className="shrink-0 text-[11px] font-bold text-slate-300">
              {company.share}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
