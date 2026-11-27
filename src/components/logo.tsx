"use client";

import { useLanguage } from "@/lib/i18n/provider";
import { HoverWords } from "@/components/hover-words";
import { cn } from "@/lib/cn";

export function Logo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const { t } = useLanguage();

  return (
    <div className={cn("flex min-w-0 items-center", className)}>
      <div className="min-w-0">
        <p className="font-display text-[17px] font-extrabold leading-tight tracking-tight text-white">
          <HoverWords text="Bus" />{" "}
          <span className="text-brand-400">
            <HoverWords text="Management" />
          </span>
        </p>
        {!compact && (
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
            <HoverWords text={t.common.tagline} />
          </p>
        )}
      </div>
    </div>
  );
}
