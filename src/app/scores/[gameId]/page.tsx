"use client";

import { use, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BoxScore } from "@/components/scores/BoxScore";
import { LiveIndicator } from "@/components/scores/LiveIndicator";
import { InningTracker } from "@/components/scores/InningTracker";
import type { Game, GameInning, BettingLine } from "@/types/game";

function getMockGame(gameId: string): Game {
  const innings: GameInning[] = [];
  let homeScore = 0;
  let awayScore = 0;

  for (let i = 1; i <= 9; i++) {
    const ar = i === 3 ? 2 : i === 5 ? 1 : i === 7 ? 3 : 0;
    const hr = i === 1 ? 1 : i === 4 ? 2 : i === 6 ? 1 : i === 8 ? 2 : 0;
    awayScore += ar;
    homeScore += hr;
    innings.push({ inningNumber: i, awayRuns: ar, homeRuns: hr });
  }

  const lines: BettingLine[] = [
    {
      id: "dk-1",
      source: "DraftKings",
      homeMoneyline: -145,
      awayMoneyline: 125,
      runLineSpread: 1.5,
      runLineHome: -180,
      runLineAway: 155,
      totalLine: 8.5,
      overOdds: -110,
      underOdds: -105,
    },
    {
      id: "fd-1",
      source: "FanDuel",
      homeMoneyline: -140,
      awayMoneyline: 120,
      runLineSpread: 1.5,
      runLineHome: -175,
      runLineAway: 150,
      totalLine: 8.5,
      overOdds: -108,
      underOdds: -112,
    },
    {
      id: "mgm-1",
      source: "BetMGM",
      homeMoneyline: -150,
      awayMoneyline: 130,
      runLineSpread: 1.5,
      runLineHome: -185,
      runLineAway: 160,
      totalLine: 9,
      overOdds: -115,
      underOdds: -105,
    },
  ];

  return {
    id: gameId,
    externalId: gameId,
    homeTeam: {
      id: "nyy",
      name: "Yankees",
      abbreviation: "NYY",
      city: "New York",
      logoUrl: "",
      primaryColor: "#003087",
      secondaryColor: "#E4002C",
    },
    awayTeam: {
      id: "bos",
      name: "Red Sox",
      abbreviation: "BOS",
      city: "Boston",
      logoUrl: "",
      primaryColor: "#BD3039",
      secondaryColor: "#0C2340",
    },
    date: "2026-04-04",
    status: "FINAL",
    homeScore,
    awayScore,
    inning: null,
    inningHalf: null,
    outs: 0,
    startTime: "2026-04-04T19:10:00Z",
    venue: "Yankee Stadium",
    innings,
    lines,
  };
}

function formatOdds(odds: number) {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

type TabId = "boxscore" | "linescore" | "betting";

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = use(params);
  const game = getMockGame(gameId);
  const [activeTab, setActiveTab] = useState<TabId>("boxscore");

  const homeWinning = game.homeScore > game.awayScore;
  const awayWinning = game.awayScore > game.homeScore;

  const maxInnings = Math.max(9, game.innings.length);
  const inningNumbers = Array.from({ length: maxInnings }, (_, i) => i + 1);
  const awayRuns = game.innings.reduce((sum, inn) => sum + inn.awayRuns, 0);
  const homeRuns = game.innings.reduce((sum, inn) => sum + inn.homeRuns, 0);
  const awayHits = 9;
  const homeHits = 11;
  const awayErrors = 1;
  const homeErrors = 0;

  const tabs: { id: TabId; label: string }[] = [
    { id: "boxscore", label: "Box Score" },
    { id: "linescore", label: "Linea por Inning" },
    { id: "betting", label: "Lineas de Apuesta" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back link */}
      <Link
        href="/scores"
        className="inline-flex items-center gap-2 font-display text-sm text-[#8B7355] hover:text-[#C41E3A] transition-colors tracking-wider uppercase"
      >
        &#9664; Volver a Resultados
      </Link>

      {/* Hero card */}
      <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] rounded-sm shadow-[4px_4px_0px_#5C4A32] paper-texture corner-ornaments overflow-hidden">
        <div className="absolute bottom-[6px] left-[6px] w-5 h-5 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
        <div className="absolute bottom-[6px] right-[6px] w-5 h-5 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

        <div className="p-8">
          {/* Status */}
          <div className="flex items-center justify-center mb-6">
            {game.status === "LIVE" ? (
              <LiveIndicator />
            ) : game.status === "FINAL" ? (
              <span className="font-display text-sm uppercase tracking-[0.2em] text-[#3D2B1F] bg-[#E8D5B5] px-4 py-1 rounded-sm border border-[#8B7355]">
                Final
              </span>
            ) : (
              <span className="font-display text-sm uppercase tracking-[0.2em] text-[#0D2240] bg-[#8FBCE6]/20 px-4 py-1 rounded-sm border border-[#0D2240]">
                Programado
              </span>
            )}
          </div>

          {/* Matchup */}
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {/* Away team */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-sm font-bold text-white border-3 border-[#8B7355]"
                style={{ backgroundColor: game.awayTeam.primaryColor }}
              >
                {game.awayTeam.abbreviation}
              </div>
              <div className="text-center">
                <span className="font-sans text-sm font-semibold text-[#3D2B1F] block">
                  {game.awayTeam.city}
                </span>
                <span className="font-display text-xs text-[#8B7355] tracking-wider uppercase">
                  {game.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Scores */}
            <div className="flex items-center gap-6">
              <span
                className={cn(
                  "font-mono text-5xl tabular-nums",
                  awayWinning ? "font-bold text-[#C41E3A]" : "text-[#3D2B1F]/50"
                )}
              >
                {game.awayScore}
              </span>
              <span className="font-display text-2xl text-[#8B7355]">-</span>
              <span
                className={cn(
                  "font-mono text-5xl tabular-nums",
                  homeWinning ? "font-bold text-[#C41E3A]" : "text-[#3D2B1F]/50"
                )}
              >
                {game.homeScore}
              </span>
            </div>

            {/* Home team */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-sm font-bold text-white border-3 border-[#8B7355]"
                style={{ backgroundColor: game.homeTeam.primaryColor }}
              >
                {game.homeTeam.abbreviation}
              </div>
              <div className="text-center">
                <span className="font-sans text-sm font-semibold text-[#3D2B1F] block">
                  {game.homeTeam.city}
                </span>
                <span className="font-display text-xs text-[#8B7355] tracking-wider uppercase">
                  {game.homeTeam.name}
                </span>
              </div>
            </div>
          </div>

          {game.status === "LIVE" && game.inning !== null && game.inningHalf !== null && (
            <div className="flex justify-center mt-6">
              <InningTracker inning={game.inning} inningHalf={game.inningHalf} outs={game.outs} />
            </div>
          )}

          <p className="text-center font-display text-xs text-[#8B7355] mt-4 tracking-wider uppercase">
            {game.venue}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b-3 border-[#8B7355]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 font-display text-xs uppercase tracking-wider transition-colors border-2 border-b-0 rounded-t-sm -mb-[3px]",
                activeTab === tab.id
                  ? "bg-[#FDF6E3] text-[#F5C842] border-[#8B7355] font-bold"
                  : "bg-[#0D2240] text-[#8FBCE6] border-[#0D2240] hover:text-[#F5C842]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Box Score tab */}
          {activeTab === "boxscore" && (
            <BoxScore game={game} />
          )}

          {/* Linea por Inning tab */}
          {activeTab === "linescore" && (
            <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="bg-[#0D2240]">
                      <th className="px-3 py-2.5 text-left font-display text-xs uppercase tracking-wider text-[#F5C842] w-20">
                        Equipo
                      </th>
                      {inningNumbers.map((n) => (
                        <th key={n} className="px-2 py-2.5 text-center font-display text-xs text-[#F5C842] w-8">
                          {n}
                        </th>
                      ))}
                      <th className="px-2 py-2.5 text-center font-display text-xs font-bold text-[#C41E3A] w-10 border-l-2 border-[#8B7355]/30">
                        R
                      </th>
                      <th className="px-2 py-2.5 text-center font-display text-xs text-[#F5C842] w-10">
                        H
                      </th>
                      <th className="px-2 py-2.5 text-center font-display text-xs text-[#F5C842] w-10">
                        E
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-[#FDF6E3]">
                      <td className="px-3 py-2.5 font-sans font-bold text-sm text-[#3D2B1F]">
                        {game.awayTeam.abbreviation}
                      </td>
                      {inningNumbers.map((n) => {
                        const inn = game.innings.find((i) => i.inningNumber === n);
                        return (
                          <td key={n} className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">
                            {inn !== undefined ? inn.awayRuns : "-"}
                          </td>
                        );
                      })}
                      <td className="px-2 py-2.5 text-center font-mono text-sm font-bold text-[#C41E3A] border-l-2 border-[#8B7355]/30">
                        {awayRuns}
                      </td>
                      <td className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">
                        {awayHits}
                      </td>
                      <td className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">
                        {awayErrors}
                      </td>
                    </tr>
                    <tr className="bg-[#F5E6C8]">
                      <td className="px-3 py-2.5 font-sans font-bold text-sm text-[#3D2B1F]">
                        {game.homeTeam.abbreviation}
                      </td>
                      {inningNumbers.map((n) => {
                        const inn = game.innings.find((i) => i.inningNumber === n);
                        return (
                          <td key={n} className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">
                            {inn !== undefined ? inn.homeRuns : "-"}
                          </td>
                        );
                      })}
                      <td className="px-2 py-2.5 text-center font-mono text-sm font-bold text-[#C41E3A] border-l-2 border-[#8B7355]/30">
                        {homeRuns}
                      </td>
                      <td className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">
                        {homeHits}
                      </td>
                      <td className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">
                        {homeErrors}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Betting lines tab */}
          {activeTab === "betting" && (
            <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
              {game.lines && game.lines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="bg-[#0D2240]">
                        <th className="px-3 py-2.5 text-left font-display text-xs uppercase tracking-wider text-[#F5C842]">
                          Fuente
                        </th>
                        <th className="px-3 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[#F5C842]">
                          ML {game.awayTeam.abbreviation}
                        </th>
                        <th className="px-3 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[#F5C842]">
                          ML {game.homeTeam.abbreviation}
                        </th>
                        <th className="px-3 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[#F5C842]">
                          RL {game.awayTeam.abbreviation}
                        </th>
                        <th className="px-3 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[#F5C842]">
                          RL {game.homeTeam.abbreviation}
                        </th>
                        <th className="px-3 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[#F5C842]">
                          Total
                        </th>
                        <th className="px-3 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[#F5C842]">
                          Over
                        </th>
                        <th className="px-3 py-2.5 text-center font-display text-xs uppercase tracking-wider text-[#F5C842]">
                          Under
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {game.lines.map((line, idx) => (
                        <tr
                          key={line.id}
                          className={cn(
                            idx % 2 === 0 ? "bg-[#FDF6E3]" : "bg-[#F5E6C8]"
                          )}
                        >
                          <td className="px-3 py-2.5 font-sans font-semibold text-[#3D2B1F]">{line.source}</td>
                          <td className={cn("px-3 py-2.5 text-center font-mono", line.awayMoneyline < 0 ? "text-[#0D2240] font-bold" : "text-[#C41E3A]")}>
                            {formatOdds(line.awayMoneyline)}
                          </td>
                          <td className={cn("px-3 py-2.5 text-center font-mono", line.homeMoneyline < 0 ? "text-[#0D2240] font-bold" : "text-[#C41E3A]")}>
                            {formatOdds(line.homeMoneyline)}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-[#3D2B1F]">
                            +{line.runLineSpread} ({formatOdds(line.runLineAway)})
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-[#3D2B1F]">
                            -{line.runLineSpread} ({formatOdds(line.runLineHome)})
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-[#F5C842] bg-[#0D2240]/5">
                            {line.totalLine}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-[#3D2B1F]">
                            {formatOdds(line.overOdds)}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-[#3D2B1F]">
                            {formatOdds(line.underOdds)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <span className="font-display text-sm text-[#8B7355] tracking-wider uppercase">
                    No hay lineas disponibles para este juego
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
