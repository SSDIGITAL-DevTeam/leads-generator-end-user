"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import { useMemo } from "react";

export const Topbar = ({ className }: { className?: string }) => {
  const { isAuthenticated, user } = useAuth();

  const initials = useMemo(() => {
    const name = user?.name ?? "";
    if (!name) return "U";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
  }, [user?.name]);

  return (
    <header className={cn("bg-[#1F2430]", className)}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-white md:h-16 md:px-0">
        {/* kiri: logo + title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F6BFF] md:h-11 md:w-11">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path d="M12 11.5v6" strokeLinecap="round" />
              <path d="M8 9v8.5" strokeLinecap="round" />
              <path d="M16 7v10.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="leading-tight">
            <Link
              href={"/pages/dashboard" as any}
              className="text-sm font-semibold text-white md:text-base"
            >
              Lead Generator
            </Link>
            <p className="text-[10px] text-white/60 md:text-xs">
              Powerful Tool for Filtering B2B Leads
            </p>
          </div>
        </div>

        {/* kanan: user indicator (tanpa logout / dropdown) */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
              {initials}
            </div>
            <span className="max-w-[180px] truncate text-xs font-medium md:text-sm">
              {user?.name ?? "User"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-white/70 md:text-sm">
            <Link href="/login" className="font-medium text-white">
              Login
            </Link>
            <span className="hidden text-white/30 md:inline">|</span>
            <Link
              href="/register"
              className="hidden font-medium text-white/80 md:inline"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
