"use client";

import { cn } from "@/lib/utils";

const scores = [
  "⚾ NYY 5 - BOS 3 (FINAL)",
  "⚾ LAD 2 - SFG 1 (5th)",
  "⚾ HOU vs TEX 7:10 PM",
  "⚾ ATL 7 - PHI 4 (FINAL)",
  "⚾ SD 3 - ARI 3 (7th)",
  "⚾ CHC vs STL 8:15 PM",
  "⚾ MIN 6 - CLE 2 (FINAL)",
  "⚾ SEA vs OAK 9:40 PM",
];

const tickerText = scores.join(" • ") + " • ";

export function Ticker() {
  return (
    <div className={cn("relative w-full h-8 bg-[#C41E3A] overflow-hidden flex items-center")}>
      {/* EN VIVO label */}
      <div className="relative z-10 shrink-0 bg-[#F5C842] text-[#3D2B1F] font-display text-xs font-bold uppercase tracking-wider px-3 h-full flex items-center">
        EN VIVO
      </div>

      {/* Scrolling scores */}
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div className="animate-ticker flex whitespace-nowrap">
          <span className="font-display text-sm text-white px-4">{tickerText}</span>
          <span className="font-display text-sm text-white px-4">{tickerText}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
