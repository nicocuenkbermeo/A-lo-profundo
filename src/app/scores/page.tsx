"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DateSelector } from "@/components/scores/DateSelector";
import { ScoreCard } from "@/components/scores/ScoreCard";
import { getTodaysGames } from "@/lib/mock-mlb";
import type { Game } from "@/types/game";

// Simulate live updates: increment LIVE games' scores and outs occasionally
function simulateLiveTick(games: Game[]): Game[] {
  return games.map((g) => {
    if (g.status !== "LIVE") return g;
    // 25% chance a run scores, 60% chance outs/inning advance
    const newGame = { ...g };
    if (Math.random() < 0.25) {
      if (Math.random() > 0.5) newGame.homeScore = g.homeScore + 1;
      else newGame.awayScore = g.awayScore + 1;
    }
    if (Math.random() < 0.6) {
      const newOuts = (g.outs ?? 0) + 1;
      if (newOuts >= 3) {
        newGame.outs = 0;
        if (g.inningHalf === "TOP") {
          newGame.inningHalf = "BOTTOM";
        } else {
          newGame.inningHalf = "TOP";
          newGame.inning = (g.inning ?? 1) + 1;
        }
      } else {
        newGame.outs = newOuts;
      }
    }
    return newGame;
  });
}

export default function ScoresPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [games, setGames] = useState<Game[]>(() => getTodaysGames());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const isToday = useMemo(() => {
    const today = new Date();
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    );
  }, [selectedDate]);

  const refresh = useCallback(() => {
    if (!isToday) {
      // Past/future dates: same schedule but no live ticks
      setGames(getTodaysGames());
    } else {
      setGames((prev) => simulateLiveTick(prev));
    }
    setLastUpdate(new Date());
  }, [isToday]);

  // Auto-refresh every 15 seconds for live games
  useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [isToday, refresh]);

  // Reset when date changes
  useEffect(() => {
    setGames(getTodaysGames());
    setLastUpdate(new Date());
  }, [selectedDate]);

  const sortedGames = useMemo(() => {
    const order: Record<string, number> = { LIVE: 0, SCHEDULED: 1, FINAL: 2, POSTPONED: 3, CANCELLED: 4 };
    return [...games].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  }, [games]);

  const liveCount = games.filter((g) => g.status === "LIVE").length;
  const finalCount = games.filter((g) => g.status === "FINAL").length;
  const scheduledCount = games.filter((g) => g.status === "SCHEDULED").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842] tracking-wide">
          RESULTADOS MLB
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="h-px w-16 bg-[#8B7355]" />
          <span className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
            Major League Baseball · {games.length} partidos
          </span>
          <span className="h-px w-16 bg-[#8B7355]" />
        </div>
      </div>

      {/* Date selector */}
      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Status summary + refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 font-display text-xs uppercase tracking-wider text-[#3D2B1F]">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C41E3A] animate-pulse-live" />
            <span className="font-bold">{liveCount}</span> En Vivo
          </span>
          <span className="text-[#8B7355]">·</span>
          <span><span className="font-bold">{finalCount}</span> Finalizados</span>
          <span className="text-[#8B7355]">·</span>
          <span><span className="font-bold">{scheduledCount}</span> Programados</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#8B7355]">
            Actualizado {lastUpdate.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <button
            onClick={refresh}
            className="font-display text-[10px] uppercase tracking-wider bg-[#0D2240] text-[#F5C842] px-3 py-1.5 rounded-sm border border-[#8B7355] hover:bg-[#1A3A5C] transition-colors"
          >
            ↻ Actualizar
          </button>
        </div>
      </div>

      {/* Scoreboard - all games shown */}
      <div>
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355] mb-4">
          ━━ Todos los partidos ━━
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedGames.map((g) => (
            <ScoreCard key={g.id} game={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
