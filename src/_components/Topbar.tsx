"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/_components/ui/Button";
import { cn } from "@/lib/utils";

export const Topbar = ({ className }: { className?: string }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header
      className={cn(
        // full width bar, tanpa rounded
        "flex h-14 items-center justify-between bg-[#1F2430] px-4 text-white md:h-16 md:px-8",
        className
      )}
    >
      {/* kiri: logo + title */}
      <div className="flex items-center gap-3">
        {/* logo bulat biru */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F6BFF] md:h-11 md:w-11">
          {/* icon kecil, bisa kamu ganti svg kamu */}
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
            href="/"
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
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <>
            <div className="flex items-center gap-2">
              {/* icon user */}
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
              <span className="text-xs font-medium text-white md:text-sm">
                {user.name}
              </span>
            </div>
            {/* pakai Button yang sudah ada, tapi styling dibikin lebih kalem */}
            <Button
              variant="secondary"
              className="hidden h-8 rounded-md bg-white/5 px-3 text-xs text-white hover:bg-white/10 md:inline-flex"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-3 text-xs text-white/70 md:text-sm">
            <Link href="/login" className="font-medium text-white">
              Login
            </Link>
            <span className="hidden text-white/30 md:inline">
              |
            </span>
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
