"use client";

import { ScoreCard } from "./ScoreCard";
import type { Game } from "@/types/game";

interface ScoreBoardProps {
  games: Game[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] rounded-sm shadow-[4px_4px_0px_#5C4A32] p-4 space-y-3 animate-pulse">
      <div className="h-5 w-20 bg-[#8B7355]/20 rounded-sm" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#8B7355]/20" />
          <div className="h-4 w-28 bg-[#8B7355]/20 rounded-sm" />
        </div>
        <div className="h-7 w-8 bg-[#8B7355]/20 rounded-sm" />
      </div>
      <div className="border-t-2 border-dashed border-[#C41E3A]/20" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#8B7355]/20" />
          <div className="h-4 w-28 bg-[#8B7355]/20 rounded-sm" />
        </div>
        <div className="h-7 w-8 bg-[#8B7355]/20 rounded-sm" />
      </div>
      <div className="border-t-2 border-[#8B7355]/20 pt-2">
        <div className="h-4 w-full bg-[#8B7355]/10 rounded-sm" />
      </div>
    </div>
  );
}

export function ScoreBoard({ games, loading = false }: ScoreBoardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-[#FDF6E3] border-[3px] border-[#8B7355] rounded-sm shadow-[4px_4px_0px_#5C4A32] paper-texture">
        <span className="text-5xl mb-4">&#9918;</span>
        <p className="font-heading text-xl text-[#3D2B1F]">
          No hay juegos programados
        </p>
        <p className="font-display text-sm text-[#8B7355] mt-2 tracking-wide">
          Selecciona otra fecha para ver resultados
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <ScoreCard key={game.id} game={game} />
      ))}
    </div>
  );
}
