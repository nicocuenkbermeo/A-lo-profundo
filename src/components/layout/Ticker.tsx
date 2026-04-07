"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/types/game";

function gameToText(g: Game): string {
  const away = g.awayTeam.abbreviation;
  const home = g.homeTeam.abbreviation;
  if (g.status === "FINAL") return `${away} ${g.awayScore} - ${g.homeScore} ${home} FINAL`;
  if (g.status === "LIVE") {
    const arrow = g.inningHalf === "TOP" ? "▲" : "▼";
    return `${away} ${g.awayScore} - ${g.homeScore} ${home} ${arrow}${g.inning ?? "?"}`;
  }
  return `${away} vs ${home} ${g.startTime}`;
}

export function Ticker() {
  const [text, setText] = useState<string>("A LO PROFUNDO · Tu fuente de béisbol");
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/mlb", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        const games: Game[] = json.data ?? [];
        const live = games.filter((g) => g.status === "LIVE");
        const scheduled = games.filter((g) => g.status === "SCHEDULED").slice(0, 3);
        const finals = games.filter((g) => g.status === "FINAL").slice(0, 3);
        const relevant = [...live, ...scheduled, ...finals];

        if (relevant.length === 0) {
          setText("No hay partidos en vivo ahora · A LO PROFUNDO");
          setHasData(true);
          return;
        }
        setText(relevant.map(gameToText).join("   ·   "));
        setHasData(true);
      } catch {
        /* keep default text */
      }
    }
    load();
    const interval = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full h-8 bg-[#C41E3A] overflow-hidden flex items-center">
      <div className="relative z-10 shrink-0 bg-[#F5C842] text-[#3D2B1F] font-display text-xs font-bold uppercase tracking-wider px-3 h-full flex items-center">
        EN VIVO
      </div>
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div key={text} className={hasData ? "animate-ticker whitespace-nowrap" : "whitespace-nowrap px-4"}>
          <span className="font-display text-sm text-white px-4">{text}</span>
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
