"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-base text-slate-700 shadow-sm shadow-slate-100 transition duration-200 ease-in-out",
            "focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/60 focus:ring-offset-1",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 9l4 4 4-4"
            />
          </svg>
        </span>
      </div>
    );
  }
);

Select.displayName = "Select";
