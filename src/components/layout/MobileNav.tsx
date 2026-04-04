"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/scores", icon: "⚾", label: "Scores" },
  { href: "/stats", icon: "📊", label: "Stats" },
  { href: "/picks", icon: "🎯", label: "Picks" },
  { href: "/rachas", icon: "🔥", label: "Rachas" },
  { href: "/trends", icon: "📈", label: "Más" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full bg-[#0D2240] border-t-2 border-[#8B7355] lg:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 min-w-0 px-1 transition-colors",
                isActive ? "text-[#F5C842]" : "text-[#8FBCE6]"
              )}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="font-display uppercase text-[10px] tracking-wider leading-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
