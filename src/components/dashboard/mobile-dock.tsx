"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Home,
  Settings,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { navItems } from "@/components/dashboard/sidebar";
import type { Session } from "@/lib/auth";
import { cn } from "@/lib/cn";

const groupLinks: Array<{ key: string; label: string; icon: LucideIcon }> = [
  { key: "ASOSIY", label: "Asosiy", icon: Home },
  { key: "TAHLIL", label: "Tahlil", icon: TrendingUp },
  { key: "JADVAL", label: "Jadval", icon: CalendarDays },
  { key: "TIZIM", label: "Tizim", icon: Settings },
];

const mobileLabels: Record<string, string> = {
  "Kilometr tahlili": "KM tahlili",
};

export function MobileDock({
  session,
  activeSection,
  onSelect,
  onLogout,
  onExpandedChange,
}: {
  session: Session;
  activeSection: string;
  onSelect: (label: string) => void;
  onLogout: () => void;
  onExpandedChange: (expanded: boolean) => void;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const expanded = openGroup !== null || profileOpen;
  const initials = session.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    onExpandedChange(expanded);
  }, [expanded, onExpandedChange]);

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-3 z-50 overflow-hidden rounded-[28px] bg-white/[0.09] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-[max-height] duration-500 ease-out lg:hidden",
        expanded ? "max-h-[460px]" : "max-h-[68px]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/25" />

      {openGroup && (
        <div className="relative px-3 pt-3">
          <p className="px-2 pb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
            {groupLinks.find((item) => item.key === openGroup)?.label}
          </p>
          <div className="space-y-0.5">
            {navItems
              .filter((item) => item.group === openGroup)
              .map((item) => {
                const Icon = item.icon;
                const isActive = item.label === activeSection;
                const label = mobileLabels[item.label] ?? item.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      onSelect(item.label);
                      setOpenGroup(null);
                    }}
                    className={cn(
                      "flex h-10 w-full items-center gap-3 rounded-2xl px-3 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                        : "text-white/75 hover:bg-white/[0.07] hover:text-white",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="relative h-[150px] px-3 pt-3">
          <ProfileCard session={session} onLogout={onLogout} />
        </div>
      )}

      <div className="relative flex h-[68px] items-center gap-1 px-2">
        {groupLinks.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            aria-expanded={openGroup === key}
            onClick={() => {
              setProfileOpen(false);
              setOpenGroup((value) => (value === key ? null : key));
            }}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[9px] font-medium transition-colors",
              openGroup === key
                ? "bg-white/[0.12] text-white"
                : "text-white/70 hover:bg-white/[0.07]",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="w-full truncate text-center">{label}</span>
          </button>
        ))}

        <button
          type="button"
          aria-label="Profil"
          aria-expanded={profileOpen}
          onClick={() => {
            setOpenGroup(null);
            setProfileOpen((value) => !value);
          }}
          className="grid size-12 shrink-0 place-items-center rounded-[24px] bg-white/15 font-display text-xs font-extrabold text-white shadow-[0_10px_30px_-14px_rgba(0,0,0,0.9)] transition hover:bg-white/25"
        >
          {initials}
        </button>
      </div>
    </div>
  );
}
