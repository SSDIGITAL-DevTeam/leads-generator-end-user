"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/useAuth";
import { cn } from "@/lib/utils";

export const Topbar = ({ className }: { className?: string }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Tutup dropdown kalau klik di luar area
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        // full width background
        "bg-[#1F2430]",
        className
      )}
    >
      {/* container biar sejajar dengan konten */}
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

        {/* kanan: user / auth */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {isAuthenticated && user ? (
            <>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 md:text-sm"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 20.25a8 8 0 0 1 16 0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>{user.name}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={cn(
                    "h-4 w-4 transition-transform",
                    open ? "rotate-180" : "rotate-0"
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 top-full z-30 mt-2 w-40 overflow-hidden rounded-md border border-white/10 bg-[#2A2F3B] shadow-lg">
                  <div className="flex flex-col py-1 text-sm text-white/90">
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="px-4 py-2 text-left hover:bg-white/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
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
      </div>
    </header>
  );
};
