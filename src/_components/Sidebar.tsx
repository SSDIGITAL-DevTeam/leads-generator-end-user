"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed?: boolean;
};

const navItems = [
  { label: "Filter", href: "/dashboard", icon: "🔎" },
  { label: "Prompt", href: "/prompt", icon: "📝" },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        // warna & tone sama dengan topbar
        "h-full bg-[#1F2430] text-white",
        // sedikit border agar kontras dengan konten
        "border-r border-white/10"
      )}
    >
      <div className={cn("flex h-full flex-col gap-4 px-3 py-6", collapsed && "px-2")}>
        {/* header / title */}
        <div
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider text-white/50",
            collapsed && "text-center"
          )}
        >
          {!collapsed ? "Navigation" : "•"}
        </div>

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

        {/* footer kecil (optional) */}
        {!collapsed && (
          <div className="mt-auto text-[10px] text-white/40">© Lead Generator</div>
        )}
      </div>
    </aside>
  );
}
