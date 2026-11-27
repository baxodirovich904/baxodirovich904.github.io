"use client";

import {
  Bell,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  Gauge,
  Home,
  Map,
  Route,
  Settings,
  Ticket,
  Timer,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ProfileCard } from "@/components/dashboard/profile-card";
import type { Session } from "@/lib/auth";
import { cn } from "@/lib/cn";

type NavItem = {
  label: string;
  icon: LucideIcon;
  group: string;
};

const navItems: NavItem[] = [
  { label: "Bosh sahifa", icon: Home, group: "ASOSIY" },
  { label: "Hisobot shakillantirish", icon: FileBarChart, group: "ASOSIY" },
  { label: "Tushum tahlili", icon: TrendingUp, group: "TAHLIL" },
  { label: "Kilometr tahlili", icon: Gauge, group: "TAHLIL" },
  { label: "Qatnov tahlili", icon: Ticket, group: "TAHLIL" },
  { label: "Yo'lovchi oqimi tahlili", icon: Users, group: "TAHLIL" },
  { label: "Tashuvchilar", icon: Building2, group: "JADVAL" },
  { label: "Yo'nalishlar", icon: Map, group: "JADVAL" },
  { label: "Kunlik jadval", icon: CalendarDays, group: "JADVAL" },
  { label: "Harakat jadvali", icon: Timer, group: "JADVAL" },
  { label: "Yo'nalish jadvali", icon: Route, group: "JADVAL" },
  { label: "Sozlamalar", icon: Settings, group: "TIZIM" },
  { label: "Bildirishnomalar", icon: Bell, group: "TIZIM" },
];

const groups = ["ASOSIY", "TAHLIL", "JADVAL", "TIZIM"];

export function Sidebar({
  open,
  collapsed,
  onToggle,
  activeSection,
  onSelect,
  session,
  onClose,
  onLogout,
}: {
  open: boolean;
  collapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSelect: (label: string) => void;
  session: Session;
  onClose: () => void;
  onLogout: () => void;
}) {
  const visibleGroups = groups.map((group) => ({
    group,
    items: navItems.filter((item) => item.group === group),
  }));

  return (
    <aside
      className={cn(
        "fixed bottom-2 left-2 top-2 z-50 flex flex-col overflow-hidden rounded-[28px] bg-white/[0.09] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-[width,transform] duration-500 ease-out",
        "sm:bottom-4 sm:left-4 sm:top-4",
        collapsed ? "w-[84px]" : "w-[288px]",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/25" />

      <div className="relative flex h-[72px] shrink-0 items-center gap-2 px-4">
        <p
          className={cn(
            "min-w-0 flex-1 truncate text-[15px] font-bold tracking-tight text-white transition-opacity duration-300",
            collapsed && "pointer-events-none opacity-0",
          )}
        >
          Bus Management
        </p>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Menyuni ochish" : "Menyuni yopish"}
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      <nav className="relative min-h-0 flex-1 overflow-hidden px-3 pb-2 pt-1">
        {visibleGroups.map(({ group, items }) => (
          <div key={group}>
            <p
              className={cn(
                "mb-1 mt-1 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 transition-opacity duration-300",
                collapsed && "pointer-events-none opacity-0",
              )}
            >
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = item.label === activeSection;

                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      onSelect(item.label);
                      onClose();
                    }}
                    className={cn(
                      "flex h-9 w-full items-center gap-3 rounded-2xl px-3 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                        : "text-white/75 hover:bg-white/[0.07] hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0",
                        isActive ? "text-white" : "text-white/70",
                      )}
                    />
                    <span
                      className={cn(
                        "truncate transition-opacity duration-300",
                        collapsed && "pointer-events-none opacity-0",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        className={cn(
          "relative shrink-0 px-3 transition-all duration-300 ease-out",
          collapsed ? "h-[76px] pb-2" : "h-[172px] pb-3",
        )}
      >
        <ProfileCard
          session={session}
          onLogout={onLogout}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
