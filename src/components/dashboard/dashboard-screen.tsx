"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MainPanel } from "@/components/dashboard/main-panel";
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

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0">
        <div className="login-fon absolute inset-0" />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[8px]" />
      </div>

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
    </>
  );
}
