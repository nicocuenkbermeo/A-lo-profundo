"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/game";

function gameToText(g: Game): string {
  const away = g.awayTeam.abbreviation;
  const home = g.homeTeam.abbreviation;
  if (g.status === "FINAL") return `⚾ ${away} ${g.awayScore} - ${g.homeScore} ${home} (FINAL)`;
  if (g.status === "LIVE") {
    const arrow = g.inningHalf === "TOP" ? "▲" : "▼";
    return `⚾ ${away} ${g.awayScore} - ${g.homeScore} ${home} (${arrow}${g.inning ?? "?"})`;
  }
  return `⚾ ${away} vs ${home} ${g.startTime}`;
}

export function Ticker() {
  const [text, setText] = useState<string>("⚾ Cargando partidos en vivo... ");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/mlb", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        const games: Game[] = json.data ?? [];
        if (games.length === 0) {
          setText("⚾ No hay partidos programados hoy • ");
          return;
        }
        setText(games.map(gameToText).join(" • ") + " • ");
      } catch {
        if (!cancelled) setText("⚾ A LO PROFUNDO • Tu fuente de béisbol • ");
      }
    }
    load();
    const interval = setInterval(load, 60000); // refresh ticker every minute
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={cn("relative w-full h-8 bg-[#C41E3A] overflow-hidden flex items-center")}>
      <div className="relative z-10 shrink-0 bg-[#F5C842] text-[#3D2B1F] font-display text-xs font-bold uppercase tracking-wider px-3 h-full flex items-center">
        EN VIVO
      </div>
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div className="animate-ticker flex whitespace-nowrap">
          <span className="font-display text-sm text-white px-4">{text}</span>
          <span className="font-display text-sm text-white px-4">{text}</span>
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 45s linear infinite;
        }
      `}</style>
    </div>
  );
}
