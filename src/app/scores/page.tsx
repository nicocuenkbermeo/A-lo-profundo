"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DateSelector } from "@/components/scores/DateSelector";
import { ScoreCard } from "@/components/scores/ScoreCard";
import { AdSlot } from "@/components/ads/AdSlot";
import type { Game } from "@/types/game";

function dateToYmd(date: Date): string {
  // Convert a JS Date to a Bogotá-localized YYYY-MM-DD
  const bogota = new Date(date.toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const y = bogota.getFullYear();
  const m = String(bogota.getMonth() + 1).padStart(2, "0");
  const d = String(bogota.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ScoresPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const ymd = useMemo(() => dateToYmd(selectedDate), [selectedDate]);

  const fetchGames = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`/api/mlb?date=${ymd}`, { cache: "no-store" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Error al obtener datos");
      setGames(json.data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los partidos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [ymd]);

  // Initial fetch + on date change
  useEffect(() => {
    setLoading(true);
    fetchGames();
  }, [fetchGames]);

  // Auto-refresh every 30 seconds for live games
  const hasLive = games.some((g) => g.status === "LIVE");
  useEffect(() => {
    if (!hasLive) return;
    const interval = setInterval(fetchGames, 30000);
    return () => clearInterval(interval);
  }, [hasLive, fetchGames]);

  const sortedGames = useMemo(() => {
    const order: Record<string, number> = { LIVE: 0, SCHEDULED: 1, FINAL: 2, POSTPONED: 3, CANCELLED: 4 };
    return [...games].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  }, [games]);

  const liveCount = games.filter((g) => g.status === "LIVE").length;
  const finalCount = games.filter((g) => g.status === "FINAL").length;
  const scheduledCount = games.filter((g) => g.status === "SCHEDULED").length;

  const updatedTime = lastUpdate.toLocaleTimeString("es-CO", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

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
            Datos en vivo · Hora Bogotá (UTC-5)
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
            Actualizado {updatedTime}
          </span>
          <button
            onClick={fetchGames}
            disabled={loading}
            className="font-display text-[10px] uppercase tracking-wider bg-[#0D2240] text-[#F5C842] px-3 py-1.5 rounded-sm border border-[#8B7355] hover:bg-[#1A3A5C] transition-colors disabled:opacity-50"
          >
            {loading ? "Cargando..." : "↻ Actualizar"}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[#FDF6E3] border-[3px] border-[#C41E3A] rounded-sm px-4 py-6 text-center">
          <p className="font-heading text-lg text-[#C41E3A]">⚠️ {error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && games.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && games.length === 0 && !error && (
        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm px-4 py-12 text-center">
          <p className="font-heading text-2xl text-[#3D2B1F]">⚾ No hay partidos programados</p>
          <p className="font-display text-xs uppercase tracking-wider text-[#8B7355] mt-2">
            La MLB no tiene juegos para esta fecha
          </p>
        </div>
      )}

      {/* Top banner ad */}
      <AdSlot slot="3333333333" format="horizontal" label="Publicidad" />

      {/* Scoreboard */}
      {sortedGames.length > 0 && (
        <div>
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355] mb-4">
            ━━ Todos los partidos del día ━━
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedGames.map((g, i) => {
              const items = [<ScoreCard key={g.id} game={g} />];
              if ((i + 1) % 6 === 0 && i < sortedGames.length - 1) {
                items.push(
                  <div key={`ad-${i}`} className="sm:col-span-2 lg:col-span-3">
                    <AdSlot slot="4444444444" format="horizontal" label="Publicidad" />
                  </div>
                );
              }
              return items;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
