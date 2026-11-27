"use client";

import { useLanguage } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

export function LoadingLabel({ className }: { className?: string }) {
  const { t } = useLanguage();

  return (
    <span
      className={cn(
        "loading-pulse text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500",
        className,
      )}
    >
      <span className="intro-word-shine">{t.common.loading}</span>
    </span>
  );
}
