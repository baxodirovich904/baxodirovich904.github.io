"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/cn";

const locales: Array<{ code: Locale; label: string; native: string }> = [
  { code: "uz", label: "UZ", native: "O'zbekcha" },
  { code: "ru", label: "RU", native: "Русский" },
  { code: "en", label: "EN", native: "English" },
  { code: "kaa", label: "QQ", native: "Qaraqalpaqsha" },
];

export function LanguageSwitcher({
  compact = false,
  align = "right",
  className,
  glass = false,
}: {
  compact?: boolean;
  align?: "left" | "right";
  className?: string;
  glass?: boolean;
}) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = locales.find((item) => item.code === locale) ?? locales[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition",
          "hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50",
          compact ? "h-10 px-3 text-xs font-semibold" : "h-11 px-3.5 text-sm",
        )}
      >
        <Globe2 className="size-4 text-slate-500 transition group-hover:text-brand-400" />
        <span>{compact ? active.label : active.native}</span>
        <ChevronDown
          className={cn(
            "size-3.5 text-slate-500 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language"
          className={cn(
            "absolute z-50 mt-2 w-52 origin-top overflow-hidden rounded-2xl p-1.5 animate-scale-in",
            glass
              ? "glass-menu"
              : "border border-white/10 bg-night-800/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {locales.map((item) => {
            const isActive = item.code === locale;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setLocale(item.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                  isActive
                    ? "bg-brand-500/10 text-brand-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-lg border text-[10px] font-bold",
                    isActive
                      ? "border-brand-400/30 bg-brand-500/15 text-brand-300"
                      : "border-white/10 bg-white/5 text-slate-500",
                  )}
                >
                  {item.label}
                </span>
                <span className="flex-1">{item.native}</span>
                {isActive && <Check className="size-4 text-brand-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
