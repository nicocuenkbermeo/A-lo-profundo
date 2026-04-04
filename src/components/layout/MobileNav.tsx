"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, BarChart3, Target, Flame, Menu } from "lucide-react";

const tabs = [
  { href: "/scores", label: "Scores", icon: Trophy },
  { href: "/estadisticas", label: "Stats", icon: BarChart3 },
  { href: "/picks", label: "Picks", icon: Target },
  { href: "/rachas", label: "Rachas", icon: Flame },
  { href: "/mas", label: "Mas", icon: Menu },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
