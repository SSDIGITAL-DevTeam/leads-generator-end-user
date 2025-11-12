"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed?: boolean;
};

const navItems = [
  {
    label: "Filter",
    href: "/dashboard",
    icon: "🔎",
  },
  {
    label: "Prompt",
    href: "/prompt", 
    icon: "📝",
  },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col gap-4 px-3 py-6", collapsed && "px-2")}>
      {/* header / title */}
      <div className={cn("text-xs font-semibold text-slate-400", collapsed && "text-center")}>
        {!collapsed ? "NAVIGATION" : "•"}
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[#EEF3FF] text-slate-900"
                  : "text-slate-500 hover:bg-slate-50",
                collapsed && "justify-center px-0"
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
