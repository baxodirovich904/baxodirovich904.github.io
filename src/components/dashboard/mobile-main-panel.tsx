"use client";

import { cn } from "@/lib/cn";

export function MobileMainPanel({ bottom }: { bottom: number }) {
  return (
    <section
      aria-label="Asosiy oyna"
      className="fixed left-3 right-3 top-3 z-40 overflow-hidden rounded-[28px] bg-white/[0.09] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-[bottom] duration-500 ease-out lg:hidden"
      style={{ bottom }}
    >
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/25")} />
    </section>
  );
}
