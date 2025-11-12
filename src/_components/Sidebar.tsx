"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";

type SidebarProps = {
  collapsed?: boolean;
};

const navItems = [
  { label: "Filter", href: "/dashboard", icon: "🔎" },
  { label: "Prompt", href: "/prompt", icon: "📝" },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  return (
    <aside
      className={cn(
        "h-full bg-[#1F2430] text-white",
        "border-r border-white/10"
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col gap-4 px-3 py-6",
          collapsed && "px-2"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider text-white/50",
            collapsed && "text-center"
          )}
        >
          {!collapsed ? "Navigation" : "•"}
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href as any}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium outline-none transition",
                  "text-white/80 hover:text-white",
                  "hover:bg-white/10",
                  isActive && "bg-white/10 text-white",
                  "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-7 before:w-0.5 before:rounded-full before:bg-transparent",
                  isActive && "before:bg-[#2F6BFF]",
                  collapsed && "justify-center px-0"
                )}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer: tampil hanya jika login */}
        {isAuthenticated && (
          !collapsed ? (
            <div className="mt-auto">
              <button
                type="button"
                onClick={logout}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm text-white/90 hover:bg-white/15"
              >
                Logout
              </button>
              <div className="mt-2 text-[10px] text-white/40">
                © Lead Generator
              </div>
            </div>
          ) : (
            <div className="mt-auto flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/15"
                title="Logout"
                aria-label="Logout"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path d="M12 3v8" strokeLinecap="round" />
                  <path
                    d="M7.5 5.6A8 8 0 1 0 20 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="text-[10px] text-white/40">©</div>
            </div>
          )
        )}
      </div>
    </aside>
  );
}
