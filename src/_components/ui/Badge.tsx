"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const TONES = {
  brand: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
  neutral: "bg-slate-100 text-slate-600 border border-slate-200",
} as const satisfies Record<Tone, string>;

export const Badge = ({
  className,
  children,
  tone = "brand",
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        TONES[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
