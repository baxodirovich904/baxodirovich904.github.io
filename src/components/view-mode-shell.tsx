"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/cn";

type Mode = "desktop" | "phone";

const STORAGE_KEY = "bm-view-mode";

export function ViewModeShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [embedded, setEmbedded] = useState(false);
  const [mode, setMode] = useState<Mode>("desktop");
  const [path, setPath] = useState("/");
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const inFrame = window.self !== window.top;
      setEmbedded(inFrame);
      setPath(window.location.pathname);

      if (!inFrame) {
        try {
          const saved = window.localStorage.getItem(STORAGE_KEY);
          if (saved === "phone" || saved === "desktop") {
            setMode(saved);
          }
        } catch {
          // Storage may be unavailable.
        }
      }

      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const changeMode = (next: Mode) => {
    setMode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable.
    }

    if (next === "desktop") {
      window.location.assign(path);
    }
  };

  const readFramePath = () => {
    try {
      const framePath = frameRef.current?.contentWindow?.location.pathname;
      if (framePath) {
        setPath(framePath);
      }
    } catch {
      // Cross-origin navigation: keep the current path.
    }
  };

  if (!mounted || embedded) {
    return <>{children}</>;
  }

  if (mode === "desktop") {
    return (
      <>
        {children}
        <button
          type="button"
          onClick={() => {
            setPath(window.location.pathname);
            changeMode("phone");
          }}
          className="fixed bottom-4 right-4 z-[150] inline-flex size-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-night-800/85 text-[11px] font-semibold text-slate-300 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-brand-400/40 hover:text-brand-300 sm:bottom-6 sm:right-6 sm:size-auto sm:px-3.5 sm:py-2"
          title="Telefon ko'rinishini ochish"
          aria-label="Telefon ko'rinishini ochish"
        >
          <Smartphone className="size-4" />
          <span className="hidden sm:inline">Telefon ko&apos;rinishi</span>
        </button>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] grid place-items-center bg-night-950 p-3 sm:p-6">
      <div className="absolute left-4 top-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:left-8 sm:top-6">
        <Smartphone className="size-4" />
        Telefon ko&apos;rinishi · 390 × 844
      </div>

      <button
        type="button"
        onClick={() => changeMode("desktop")}
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-[11px] font-semibold text-slate-300 transition hover:border-brand-400/40 hover:text-brand-300 sm:right-8 sm:top-6"
        title="Kompyuter ko'rinishiga qaytish"
      >
        <Monitor className="size-4" />
        Kompyuter ko&apos;rinishi
      </button>

      <div
        className={cn(
          "relative h-[844px] max-h-[calc(100dvh-24px)] w-[390px] max-w-full overflow-hidden rounded-[36px] border-[8px] border-night-700 bg-night-950",
          "shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]",
        )}
      >
        <iframe
          ref={frameRef}
          title="Telefon ko'rinishi"
          src={path}
          onLoad={readFramePath}
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
