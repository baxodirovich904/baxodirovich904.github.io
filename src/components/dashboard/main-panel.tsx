"use client";

import { cn } from "@/lib/cn";

export function MainPanel({ collapsed }: { collapsed: boolean }) {
  return (
    <section
      aria-label="Asosiy oyna"
      className={cn(
        "fixed bottom-4 right-4 top-4 z-40 hidden overflow-hidden rounded-[28px] bg-white/[0.09] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-[left] duration-500 ease-out lg:block",
        collapsed ? "left-[44px]" : "left-[320px]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/25" />
    </section>
  );
}
