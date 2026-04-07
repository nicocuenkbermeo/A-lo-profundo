"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/types/game";

type TickerState = "loading" | "ready" | "empty" | "error";

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
  const [state, setState] = useState<TickerState>("loading");
  const [text, setText] = useState<string>("Cargando partidos…");

  useEffect(() => {
    let cancelled = false;

    // Safety net: if the fetch takes more than 5s we move out of loading state.
    const loadingTimeout = setTimeout(() => {
      if (!cancelled) {
        setState((prev) => (prev === "loading" ? "error" : prev));
      }
    }, 5000);

    async function load() {
      try {
        const res = await fetch("/api/mlb", { cache: "no-store" });
        if (cancelled) return;
        if (!res.ok) {
          setState("error");
          return;
        }
        const json = await res.json();
        if (cancelled) return;
        const games: Game[] = json.data ?? [];
        const live = games.filter((g) => g.status === "LIVE");
        const scheduled = games.filter((g) => g.status === "SCHEDULED").slice(0, 3);
        const finals = games.filter((g) => g.status === "FINAL").slice(0, 3);
        const relevant = [...live, ...scheduled, ...finals];

        if (relevant.length === 0) {
          setText("No hay partidos en vivo ahora mismo");
          setState("empty");
          return;
        }

        setText(relevant.map(gameToText).join("   ·   "));
        setState("ready");
      } catch (err) {
        if (cancelled) return;
        console.error("[Ticker] Failed to load games:", err);
        setState("error");
      }
    }

    load();
    const interval = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearTimeout(loadingTimeout);
      clearInterval(interval);
    };
  }, []);

  // Hide the ticker entirely on fetch error so it never stays stuck.
  if (state === "error") return null;

  const displayText = state === "loading" ? "Cargando partidos…" : text;
  const animate = state === "ready";

  return (
    <div className="relative w-full h-8 bg-[#C41E3A] overflow-hidden flex items-center">
      <div className="relative z-10 shrink-0 bg-[#F5C842] text-[#3D2B1F] font-display text-xs font-bold uppercase tracking-wider px-3 h-full flex items-center">
        EN VIVO
      </div>
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div
          key={displayText}
          className={animate ? "animate-ticker whitespace-nowrap" : "whitespace-nowrap px-4"}
        >
          <span className="font-display text-sm text-white px-4">{displayText}</span>
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
