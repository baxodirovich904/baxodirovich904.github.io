"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import type { Session } from "@/lib/auth";
import { cn } from "@/lib/cn";

const DEFAULT_IMAGE = "/images/fon-bus.jpg";
const STORAGE_KEY = "bm-profile-image";

export function ProfileCard({
  session,
  onLogout,
  collapsed = false,
}: {
  session: Session;
  onLogout: () => void;
  collapsed?: boolean;
}) {
  const { t } = useLanguage();
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [glow, setGlow] = useState("rgba(214, 214, 214, 0.72)");
  const [tint, setTint] = useState("rgb(177, 177, 175)");
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = session.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved?.startsWith("data:image/")) {
          setImage(saved);
        }
      } catch {
        // Storage may be unavailable.
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const source = new window.Image();

    source.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 18;
        const context = canvas.getContext("2d");
        if (!context) {
          return;
        }

        context.drawImage(source, 0, 0, 32, 18);
        const pixels = context.getImageData(0, 9, 32, 9).data;
        let red = 0;
        let green = 0;
        let blue = 0;
        let count = 0;

        for (let index = 0; index < pixels.length; index += 4) {
          red += pixels[index];
          green += pixels[index + 1];
          blue += pixels[index + 2];
          count += 1;
        }

        const lighten = (value: number) =>
          Math.round(value * 0.45 + 255 * 0.55);
        const color = `${lighten(red / count)}, ${lighten(green / count)}, ${lighten(blue / count)}`;
        setGlow(`rgba(${color}, 0.72)`);
        setTint(`rgb(${color})`);
      } catch {
        // Keep the neutral glow for unreadable images.
      }
    };

    source.src = image;
  }, [image]);

  const storeImage = (dataUrl: string) => {
    setImage(dataUrl);
    try {
      window.localStorage.setItem(STORAGE_KEY, dataUrl);
    } catch {
      // Storage may be full or unavailable; the image still shows for this session.
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const source = new window.Image();
      source.onload = () => {
        const canvas = document.createElement("canvas");
        const width = 900;
        const height = 500;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          return;
        }

        const scale = Math.max(width / source.width, height / source.height);
        const drawWidth = source.width * scale;
        const drawHeight = source.height * scale;
        context.drawImage(
          source,
          (width - drawWidth) / 2,
          (height - drawHeight) / 2,
          drawWidth,
          drawHeight,
        );

        storeImage(canvas.toDataURL("image/jpeg", 0.82));
      };
      source.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const resetImage = () => {
    setImage(DEFAULT_IMAGE);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage may be unavailable.
    }
  };

  return (
    <div className="relative h-full w-full">
      <div
        className={cn(
          "group absolute inset-x-0 bottom-0 aspect-[1.8] overflow-hidden rounded-[24px] border border-white/10 bg-night-800/70 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-all duration-300 ease-out",
          collapsed
            ? "pointer-events-none scale-90 opacity-0"
            : "scale-100 opacity-100",
        )}
      >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-90"
      />

      {/* Dark veil keeps text readable on any image */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* Blurred lower haze tinted from the current image */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: `linear-gradient(to top, ${glow} 0%, transparent 72%)` }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 backdrop-blur-[4px] [mask-image:linear-gradient(to_top,#000,transparent)]" />

      <div className="absolute inset-x-3.5 top-3 flex items-center justify-between">
        <span className="font-display text-[10px] font-semibold uppercase tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
          Bus Management
        </span>

        <div className="flex items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
          {image !== DEFAULT_IMAGE && (
            <button
              type="button"
              onClick={resetImage}
              title="Asl rasmga qaytish"
              aria-label="Asl rasmga qaytish"
              className="grid size-6 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55"
            >
              <RotateCcw className="size-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            title="Rasmni o'zgartirish"
            aria-label="Rasmni o'zgartirish"
            className="grid size-6 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55"
          >
            <Camera className="size-3" />
          </button>
        </div>
      </div>

      <div className="absolute inset-x-3.5 bottom-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate whitespace-nowrap font-display text-[15px] font-bold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65)]">
            {session.name}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[10px] font-medium leading-snug text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
            {t.roles[session.role]}
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 rounded-full bg-black/45 px-3.5 py-2 text-[10px] font-semibold text-white backdrop-blur-md [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] transition hover:bg-black/65"
        >
          Chiqish
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      </div>

      <button
        type="button"
        onClick={onLogout}
        title="Chiqish"
        aria-label="Chiqish"
        style={{ backgroundColor: tint }}
        className={cn(
          "absolute bottom-0 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full border border-white/25 font-display text-xs font-extrabold text-night-950 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.9)] transition-all duration-300 ease-out",
          collapsed
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-50 opacity-0",
        )}
      >
        {initials}
      </button>
    </div>
  );
}
