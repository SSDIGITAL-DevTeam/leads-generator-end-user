"use client";

import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "brand" | "neutral";
}

export const Badge = ({ className, children, tone = "brand", ...props }: BadgeProps) => {
  const tones: Record<BadgeProps["tone"], string> = {
    brand: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
    neutral: "bg-slate-100 text-slate-600 border border-slate-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
