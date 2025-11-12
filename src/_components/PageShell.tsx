"use client";

import type { ReactNode } from "react";

import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";

export const PageShell = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen bg-[#E9ECF3]">
      <Topbar />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-12 pt-8 lg:flex-row lg:px-0">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
};
