"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/_components/Sidebar";
import { Topbar } from "@/_components/Topbar";
import { cn } from "@/lib/utils";

const TOPBAR_HEIGHT = 64; // px → sesuaikan kalau beda

export default function PagesLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E9ECF3]">
      {/* 1. TOPBAR FIXED DI PALING ATAS */}
      <div
        className="fixed inset-x-0 top-0 z-50"
        style={{ height: TOPBAR_HEIGHT }}
      >
        <Topbar />
      </div>

      {/* 2. SIDEBAR DESKTOP, MULAI DI BAWAH TOPBAR */}
      <aside
        className={cn(
          "fixed left-0 z-40 hidden h-[calc(100vh-64px)] border-r border-slate-200 bg-white transition-all duration-200 lg:block",
          isCollapsed ? "w-16" : "w-60"
        )}
        style={{ top: TOPBAR_HEIGHT }} // supaya tidak nutup topbar
      >
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-xs shadow-sm"
        >
          {isCollapsed ? "›" : "‹"}
        </button>

        <div className="h-full overflow-y-auto pt-4">
          <Sidebar collapsed={isCollapsed} />
        </div>
      </aside>

      {/* 3. SIDEBAR MOBILE (overlay) */}
      <aside
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity lg:hidden",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
      >
        <div
          className="h-full w-60 border-r border-slate-200 bg-white"
          style={{ paddingTop: TOPBAR_HEIGHT }}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar />
        </div>
      </aside>

      {/* 4. KONTEN UTAMA */}
      <main
        className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-12 lg:px-0"
        style={{ paddingTop: TOPBAR_HEIGHT + 24 }} // 64 topbar + 24 jarak
      >
        {/* tombol buka sidebar di mobile */}
        <div className="flex justify-end lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm"
          >
            Menu
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
