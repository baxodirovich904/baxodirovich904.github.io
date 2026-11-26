"use client";

import { useEffect, useRef } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Menu,
  Plus,
  Search,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/provider";
import type { Session } from "@/lib/auth";

export function Topbar({
  session,
  onMenu,
  onSoon,
}: {
  session: Session;
  onMenu: () => void;
  onSoon: () => void;
}) {
  const { t, formatDate } = useLanguage();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const initials = session.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-night-950/65 backdrop-blur-2xl">
      <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Menu"
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden min-w-0 items-center gap-3 sm:flex">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Bus Management
            </p>
            <p className="truncate text-sm font-semibold text-slate-200">
              {t.nav.dashboard}
            </p>
          </div>
          <span className="h-8 w-px bg-white/[0.06]" />
          <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">
            <CalendarDays className="size-4 text-slate-600" />
            {formatDate(new Date())}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              ref={searchRef}
              type="search"
              placeholder={t.topbar.search}
              className="h-10 w-48 rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-12 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-brand-400/40 focus:ring-2 focus:ring-brand-500/10 xl:w-64"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
              Ctrl K
            </kbd>
          </div>

          <LanguageSwitcher compact />

          <button
            type="button"
            onClick={onSoon}
            aria-label={t.topbar.notifications}
            title={t.topbar.notifications}
            className="relative grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <Bell className="size-4.5" />
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-rose-400 ring-2 ring-night-950" />
          </button>

          <button
            type="button"
            onClick={onSoon}
            className="hidden h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-4 text-xs font-bold text-night-950 shadow-[0_10px_30px_-12px_rgba(201,217,229,0.55)] transition hover:brightness-110 sm:flex"
          >
            <Plus className="size-4" strokeWidth={2.6} />
            {t.topbar.newTrip}
          </button>

          <div className="ml-1 flex items-center gap-2">
            <div className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-bold text-night-950">
              {initials}
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-night-950 bg-brand-400" />
            </div>
            <ChevronDown className="hidden size-3.5 text-slate-600 sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
