"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MainPanel } from "@/components/dashboard/main-panel";
import { IntroCurtain } from "@/components/intro-curtain";
import { LoadingLabel } from "@/components/loading-label";
import { MobileDock } from "@/components/dashboard/mobile-dock";
import { MobileMainPanel } from "@/components/dashboard/mobile-main-panel";
import {
  clearSession,
  readSession,
  type Session,
} from "@/lib/auth";

export function DashboardScreen() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [section, setSection] = useState("Bosh sahifa");
  const [dockHeight, setDockHeight] = useState(60);
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = readSession();

      if (!stored) {
        router.replace("/");
        return;
      }

      setSession(stored);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [router]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        if (window.sessionStorage.getItem("bm-intro") === "1") {
          window.sessionStorage.removeItem("bm-intro");
          setIntro(true);
        }
      } catch {
        // Storage can be unavailable.
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleDockHeight = useCallback((height: number) => {
    setDockHeight(height);
  }, []);

  if (!session) {
    return (
      <div className="fixed inset-0 grid place-items-center">
        <div className="login-fon absolute inset-0" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative">
          <LoadingLabel />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0">
        <div className="login-fon absolute inset-0" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {intro && <IntroCurtain durationMs={2400} />}

      <Sidebar
        open
        session={session}
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        activeSection={section}
        onSelect={setSection}
        onClose={() => {}}
        onLogout={() => {
          clearSession();
          router.push("/");
        }}
      />

      <MainPanel collapsed={collapsed} />

      <MobileMainPanel bottom={dockHeight + 24} />

      <MobileDock
        session={session}
        activeSection={section}
        onSelect={setSection}
        onHeightChange={handleDockHeight}
        onLogout={() => {
          clearSession();
          router.push("/");
        }}
      />
    </>
  );
}
