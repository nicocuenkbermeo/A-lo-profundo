"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreCard } from "./ScoreCard";
import type { Game } from "@/types/game";

interface ScoreBoardProps {
  games: Game[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <Card className="bg-[#13131a] border-[#1e1e2e]">
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-20 bg-[#1e1e2e]" />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full bg-[#1e1e2e]" />
              <Skeleton className="h-4 w-24 bg-[#1e1e2e]" />
            </div>
            <Skeleton className="h-6 w-8 bg-[#1e1e2e]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full bg-[#1e1e2e]" />
              <Skeleton className="h-4 w-24 bg-[#1e1e2e]" />
            </div>
            <Skeleton className="h-6 w-8 bg-[#1e1e2e]" />
          </div>
        </div>
        <Skeleton className="h-4 w-full bg-[#1e1e2e]" />
      </CardContent>
    </Card>
  );
}

export function ScoreBoard({ games, loading = false }: ScoreBoardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No hay juegos programados para esta fecha
        </p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Selecciona otra fecha para ver resultados
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <ScoreCard key={game.id} game={game} />
      ))}
    </div>
  );
}
