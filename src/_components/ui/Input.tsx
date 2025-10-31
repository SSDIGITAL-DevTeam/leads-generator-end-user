"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", leftIcon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-100 transition duration-200 ease-in-out",
          "focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/60 focus-within:ring-offset-1",
          className
        )}
      >
        {leftIcon && (
          <span className="pointer-events-none pl-4 text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full rounded-xl border-0 bg-transparent px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none",
            leftIcon ? "pl-2" : ""
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
