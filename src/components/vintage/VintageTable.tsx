import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface VintageTableProps {
  children: ReactNode;
  className?: string;
}

export default function VintageTable({ children, className }: VintageTableProps) {
  return (
    <div
      className={cn(
        "relative border-2 border-[#8B7355] overflow-hidden",
        className
      )}
    >
      {/* Corner ornaments */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#8B7355] pointer-events-none z-10" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#8B7355] pointer-events-none z-10" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#8B7355] pointer-events-none z-10" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#8B7355] pointer-events-none z-10" />

      <table
        className={cn(
          "w-full text-sm border-collapse",
          "[&_thead_tr]:bg-[#0D2240] [&_thead_th]:text-[#F5C842] [&_thead_th]:font-[family-name:var(--font-display)] [&_thead_th]:uppercase [&_thead_th]:tracking-wider [&_thead_th]:text-xs [&_thead_th]:px-3 [&_thead_th]:py-2 [&_thead_th]:text-left",
          "[&_tbody_tr]:bg-[#FDF6E3] [&_tbody_tr:nth-child(even)]:bg-[#F5E6C8]",
          "[&_tbody_tr:hover]:bg-[#EDD9B3] [&_tbody_tr]:transition-colors",
          "[&_tbody_td]:px-3 [&_tbody_td]:py-2 [&_tbody_td]:text-[#3D2B1F]",
          "[&_td[data-type=number]]:font-mono"
        )}
      >
        {children}
      </table>
    </div>
  );
}
