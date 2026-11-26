"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

type Phase = "loading" | "reveal" | "done";

export function IntroCurtain({ duration = 1500 }: { duration?: number }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (phase === "loading") {
      const timer = window.setTimeout(() => setPhase("reveal"), duration);
      return () => window.clearTimeout(timer);
    }

    if (phase === "reveal") {
      const timer = window.setTimeout(() => setPhase("done"), 1120);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [duration, phase]);

  if (phase === "done") {
    return null;
  }

  const revealing = phase === "reveal";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t.common.loading}
      className={cn("intro-curtain", revealing && "intro-curtain-reveal")}
    >
      <div className="intro-halo pointer-events-none absolute size-[420px] rounded-full bg-brand-500/[0.14] blur-[110px]" />

      <div
        className={cn(
          "intro-content relative flex flex-col items-center px-6 text-center",
          revealing && "scale-95 opacity-0",
        )}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="intro-loader-video size-[280px] object-contain sm:size-[320px]"
        >
          <source src="/videos/zagruzka-loader.webm" type="video/webm" />
        </video>

        <p className="mt-1 font-display text-sm font-extrabold uppercase tracking-[0.32em] text-white">
          Bus Management
        </p>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
          {t.common.loading}
        </p>
      </div>
    </div>
  );
}
