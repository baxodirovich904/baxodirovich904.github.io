"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

const WORD_MS = 1500;
const REVEAL_MS = 720;

type Phase = "loading" | "reveal" | "done";

export function IntroCurtain() {
  const { t } = useLanguage();
  const words = t.common.loadingSteps;
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (phase === "loading") {
      const timer = window.setTimeout(
        () => setPhase("reveal"),
        words.length * WORD_MS,
      );
      return () => window.clearTimeout(timer);
    }

    if (phase === "reveal") {
      const timer = window.setTimeout(() => setPhase("done"), REVEAL_MS);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [phase, words.length]);

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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="login-fon absolute inset-0" />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[8px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_16%_14%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_84%_86%,rgba(205,200,192,0.05),transparent_55%)]" />
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "intro-content relative grid place-items-center px-6",
          revealing && "scale-95 opacity-0",
        )}
      >
        {words.map((word, index) => (
          <span
            key={word}
            className="intro-word col-start-1 row-start-1 whitespace-nowrap text-[15px] font-medium tracking-[0.03em] text-white sm:text-[17px]"
            style={{
              animationDelay: `${index * WORD_MS}ms`,
              animationDuration: `${words.length * WORD_MS}ms`,
            }}
          >
            <span className="intro-word-shine">{word}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
