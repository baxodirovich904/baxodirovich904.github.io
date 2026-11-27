"use client";

import { useRef, type MouseEvent } from "react";
import { cn } from "@/lib/cn";

export function HoverWords({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const clear = () => {
    ref.current
      ?.querySelectorAll("[data-word]")
      .forEach((word) => word.classList.remove("word-near"));
  };

  const onMove = (event: MouseEvent<HTMLSpanElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    ref.current?.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
      const rect = word.getBoundingClientRect();
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      word.classList.toggle("word-near", Math.hypot(dx, dy) < 24);
    });
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={clear}
      className={className}
    >
      {text.split(/(\s+)/).map((part, index) =>
        /^\s+$/.test(part) ? (
          part
        ) : (
          <span
            key={`${index}-${part}`}
            data-word
            className={cn("hover-word", wordClassName)}
          >
            {part}
          </span>
        ),
      )}
    </span>
  );
}
