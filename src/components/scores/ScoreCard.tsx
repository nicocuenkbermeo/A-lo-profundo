"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveIndicator } from "./LiveIndicator";
import { InningTracker } from "./InningTracker";
import type { Game } from "@/types/game";

interface ScoreCardProps {
  game: Game;
}

function StatusBadge({ status }: { status: Game["status"] }) {
  switch (status) {
    case "LIVE":
      return (
        <Badge variant="destructive" className="animate-pulse gap-1 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          En Vivo
        </Badge>
      );
    case "FINAL":
      return (
        <Badge variant="secondary" className="text-[10px]">
          Final
        </Badge>
      );
    case "SCHEDULED":
      return (
        <Badge className="bg-blue-500/20 text-blue-400 text-[10px] hover:bg-blue-500/30">
          Programado
        </Badge>
      );
    case "POSTPONED":
      return (
        <Badge variant="secondary" className="text-[10px]">
          Pospuesto
        </Badge>
      );
    default:
      return null;
  }
}

function TeamRow({
  abbreviation,
  name,
  color,
  score,
  isWinning,
}: {
  abbreviation: string;
  name: string;
  color: string;
  score: number;
  isWinning: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {abbreviation}
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            isWinning ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {name}
        </span>
      </div>
      <span
        className={cn(
          "font-mono text-xl tabular-nums",
          isWinning ? "font-bold text-amber-500" : "text-muted-foreground"
        )}
      >
        {score}
      </span>
    </div>
  );
}

export function ScoreCard({ game }: ScoreCardProps) {
  const isLive = game.status === "LIVE";
  const isFinal = game.status === "FINAL";
  const isScheduled = game.status === "SCHEDULED";

  const homeWinning = game.homeScore > game.awayScore;
  const awayWinning = game.awayScore > game.homeScore;

  const startDate = new Date(game.startTime);
  const timeString = startDate.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/scores/${game.id}`}>
      <Card className="bg-[#13131a] border-[#1e1e2e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <StatusBadge status={game.status} />
            {isScheduled && (
              <span className="text-xs text-muted-foreground">{timeString}</span>
            )}
          </div>

          <div className="space-y-2">
            <TeamRow
              abbreviation={game.awayTeam.abbreviation}
              name={game.awayTeam.name}
              color={game.awayTeam.primaryColor}
              score={game.awayScore}
              isWinning={isFinal ? awayWinning : isLive ? awayWinning : false}
            />
            <TeamRow
              abbreviation={game.homeTeam.abbreviation}
              name={game.homeTeam.name}
              color={game.homeTeam.primaryColor}
              score={game.homeScore}
              isWinning={isFinal ? homeWinning : isLive ? homeWinning : false}
            />
          </div>

          <div className="border-t border-[#1e1e2e] pt-2">
            {isLive && game.inning !== null && game.inningHalf !== null && (
              <div className="flex items-center justify-between">
                <InningTracker
                  inning={game.inning}
                  inningHalf={game.inningHalf}
                  outs={game.outs}
                />
                <LiveIndicator />
              </div>
            )}
            {isFinal && (
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] text-muted-foreground border-[#1e1e2e]">
                  Final
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {game.innings.length} innings
                </span>
              </div>
            )}
            {isScheduled && (
              <div className="text-xs text-muted-foreground">
                <span>{game.venue}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
