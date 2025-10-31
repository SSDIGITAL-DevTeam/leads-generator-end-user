"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ⬅️ tambahkan "outline" di sini
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const baseClasses =
  "inline-flex h-12 min-h-[3rem] items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-medium transition-colors duration-200 ease-in-out focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-brand-primary/60",
  secondary:
    "bg-white text-brand-primary border border-slate-200 hover:bg-slate-100",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent",
  // ⬅️ varian baru
  outline:
    "bg-transparent text-slate-800 border border-slate-300 hover:bg-slate-100"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      isLoading,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent"
          />
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export const buttonStyles = {
  base: baseClasses,
  variants: variantClasses
};
