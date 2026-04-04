"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { LiveIndicator } from "./LiveIndicator";
import { InningTracker } from "./InningTracker";
import type { Game } from "@/types/game";

interface ScoreCardProps {
  game: Game;
}

function TeamBadge({ abbreviation, color }: { abbreviation: string; color: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white border-2 border-[#8B7355]"
      style={{ backgroundColor: color }}
    >
      {abbreviation}
    </div>
  );
}

function StatusTag({ status }: { status: Game["status"] }) {
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C41E3A] text-white text-[10px] font-display uppercase tracking-wider rounded-sm animate-pulse-live">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        En Vivo
      </span>
    );
  }
  if (status === "FINAL") {
    return (
      <span className="inline-flex px-2.5 py-1 bg-[#3D2B1F] text-[#FDF6E3] text-[10px] font-display uppercase tracking-wider rounded-sm">
        Final
      </span>
    );
  }
  if (status === "SCHEDULED") {
    return (
      <span className="inline-flex px-2.5 py-1 border-2 border-[#0D2240] text-[#0D2240] text-[10px] font-display uppercase tracking-wider rounded-sm">
        Programado
      </span>
    );
  }
  if (status === "POSTPONED") {
    return (
      <span className="inline-flex px-2.5 py-1 bg-[#8B7355] text-[#FDF6E3] text-[10px] font-display uppercase tracking-wider rounded-sm">
        Pospuesto
      </span>
    );
  }
  return null;
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
    <Link href={`/scores/${game.id}`} className="block group">
      <div
        className={cn(
          "relative bg-[#FDF6E3] border-[3px] border-[#8B7355] rounded-sm",
          "shadow-[4px_4px_0px_#5C4A32]",
          "transition-all duration-200 cursor-pointer",
          "group-hover:-translate-y-[2px] group-hover:shadow-[6px_6px_0px_#5C4A32]",
          "paper-texture corner-ornaments"
        )}
      >
        {/* Bottom corner ornaments (via extra divs since ::before/after used by corner-ornaments) */}
        <div className="absolute bottom-[6px] left-[6px] w-5 h-5 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
        <div className="absolute bottom-[6px] right-[6px] w-5 h-5 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

        <div className="p-4 space-y-3">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <StatusTag status={game.status} />
            {isScheduled && (
              <span className="font-mono text-xs text-[#0D2240]">{timeString}</span>
            )}
          </div>

          {/* Away team row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TeamBadge abbreviation={game.awayTeam.abbreviation} color={game.awayTeam.primaryColor} />
              <span className={cn(
                "font-sans text-sm",
                awayWinning && (isLive || isFinal) ? "font-bold text-[#3D2B1F]" : "text-[#3D2B1F]/70"
              )}>
                {game.awayTeam.city} {game.awayTeam.name}
              </span>
            </div>
            {!isScheduled && (
              <span className={cn(
                "font-mono text-2xl font-bold tabular-nums",
                awayWinning && (isLive || isFinal) ? "text-[#C41E3A]" : "text-[#3D2B1F]/60"
              )}>
                {game.awayScore}
              </span>
            )}
          </div>

          {/* Stitch separator */}
          <div className="border-t-2 border-dashed border-[#C41E3A]/40 my-1" />

          {/* Home team row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TeamBadge abbreviation={game.homeTeam.abbreviation} color={game.homeTeam.primaryColor} />
              <span className={cn(
                "font-sans text-sm",
                homeWinning && (isLive || isFinal) ? "font-bold text-[#3D2B1F]" : "text-[#3D2B1F]/70"
              )}>
                {game.homeTeam.city} {game.homeTeam.name}
              </span>
            </div>
            {!isScheduled && (
              <span className={cn(
                "font-mono text-2xl font-bold tabular-nums",
                homeWinning && (isLive || isFinal) ? "text-[#C41E3A]" : "text-[#3D2B1F]/60"
              )}>
                {game.homeScore}
              </span>
            )}
          </div>

          {/* Bottom section */}
          <div className="border-t-2 border-[#8B7355]/30 pt-2">
            {isLive && game.inning !== null && game.inningHalf !== null && (
              <div className="flex items-center justify-between bg-[#FDF6E3] rounded-sm px-2 py-1">
                <InningTracker inning={game.inning} inningHalf={game.inningHalf} outs={game.outs} />
                <LiveIndicator />
              </div>
            )}
            {isFinal && (
              <div className="flex items-center justify-center gap-3">
                <span className="h-px flex-1 bg-[#8B7355]/30" />
                <span className="font-display text-xs uppercase tracking-[0.2em] text-[#3D2B1F]">
                  FINAL
                </span>
                <span className="h-px flex-1 bg-[#8B7355]/30" />
              </div>
            )}
            {isScheduled && (
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-sm text-[#0D2240]">{timeString}</span>
                <span className="font-display text-xs text-[#8B7355]">vs</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
