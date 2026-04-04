"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface VintageTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function VintageTabs({ tabs, activeTab, onChange }: VintageTabsProps) {
  return (
    <div className="w-full">
      <div className="flex border-b-2 border-[#8B7355]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "px-5 py-2 font-[family-name:var(--font-display)] uppercase tracking-wider text-sm cursor-pointer",
                "transition-all duration-150 -mb-[2px] relative",
                isActive
                  ? "bg-[#FDF6E3] text-[#C41E3A] border-2 border-[#8B7355] border-b-[#FDF6E3] border-t-[#C41E3A] border-t-[3px] z-10"
                  : "bg-[#0D2240] text-[#8FBCE6] border border-[#8B7355] hover:bg-[#1A3A5C]"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
