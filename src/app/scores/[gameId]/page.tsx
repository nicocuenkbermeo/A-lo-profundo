"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = use(params);
  const game = getMockGame(gameId);

  const homeWinning = game.homeScore > game.awayScore;
  const awayWinning = game.awayScore > game.homeScore;

  return (
    <div className="space-y-6">
      <Link href="/scores">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver a Scores
        </Button>
      </Link>

      {/* Game Header */}
      <Card className="bg-[#13131a] border-[#1e1e2e]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            {game.status === "LIVE" ? (
              <LiveIndicator />
            ) : game.status === "FINAL" ? (
              <Badge variant="secondary">Final</Badge>
            ) : (
              <Badge className="bg-blue-500/20 text-blue-400">Programado</Badge>
            )}
          </div>

          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: game.awayTeam.primaryColor }}
              >
                {game.awayTeam.abbreviation}
              </div>
              <span className="text-sm font-medium">{game.awayTeam.city}</span>
              <span className="text-xs text-muted-foreground">{game.awayTeam.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "font-mono text-4xl tabular-nums",
                  awayWinning ? "font-bold text-amber-500" : "text-muted-foreground"
                )}
              >
                {game.awayScore}
              </span>
              <span className="text-xl text-muted-foreground/40">-</span>
              <span
                className={cn(
                  "font-mono text-4xl tabular-nums",
                  homeWinning ? "font-bold text-amber-500" : "text-muted-foreground"
                )}
              >
                {game.homeScore}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: game.homeTeam.primaryColor }}
              >
                {game.homeTeam.abbreviation}
              </div>
              <span className="text-sm font-medium">{game.homeTeam.city}</span>
              <span className="text-xs text-muted-foreground">{game.homeTeam.name}</span>
            </div>
          </div>

          {game.status === "LIVE" && game.inning !== null && game.inningHalf !== null && (
            <div className="flex justify-center mt-4">
              <InningTracker inning={game.inning} inningHalf={game.inningHalf} outs={game.outs} />
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-3">{game.venue}</p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="boxscore">
        <TabsList className="bg-[#13131a] border border-[#1e1e2e] w-full justify-start">
          <TabsTrigger value="boxscore" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500">
            Box Score
          </TabsTrigger>
          <TabsTrigger value="linescore" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500">
            Linea por Inning
          </TabsTrigger>
          <TabsTrigger value="betting" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500">
            Lineas de Apuesta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boxscore">
          <Card className="bg-[#13131a] border-[#1e1e2e]">
            <CardHeader>
              <CardTitle className="text-base">Box Score</CardTitle>
            </CardHeader>
            <CardContent>
              <BoxScore game={game} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linescore">
          <Card className="bg-[#13131a] border-[#1e1e2e]">
            <CardHeader>
              <CardTitle className="text-base">Linea por Inning</CardTitle>
            </CardHeader>
            <CardContent>
              <BoxScore game={game} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="betting">
          <Card className="bg-[#13131a] border-[#1e1e2e]">
            <CardHeader>
              <CardTitle className="text-base">Lineas de Apuesta</CardTitle>
            </CardHeader>
            <CardContent>
              {game.lines && game.lines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1e1e2e]">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Fuente</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">ML {game.awayTeam.abbreviation}</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">ML {game.homeTeam.abbreviation}</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">RL {game.awayTeam.abbreviation}</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">RL {game.homeTeam.abbreviation}</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">Total</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">Over</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">Under</th>
                      </tr>
                    </thead>
                    <tbody>
                      {game.lines.map((line, idx) => (
                        <tr
                          key={line.id}
                          className={cn(
                            "border-b border-[#1e1e2e]/50",
                            idx % 2 === 0 ? "bg-[#13131a]/50" : "bg-[#0a0a0f]/50"
                          )}
                        >
                          <td className="px-3 py-2.5 font-medium">{line.source}</td>
                          <td className={cn("px-3 py-2.5 text-center font-mono", line.awayMoneyline < 0 ? "text-green-400" : "text-red-400")}>
                            {formatOdds(line.awayMoneyline)}
                          </td>
                          <td className={cn("px-3 py-2.5 text-center font-mono", line.homeMoneyline < 0 ? "text-green-400" : "text-red-400")}>
                            {formatOdds(line.homeMoneyline)}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">
                            +{line.runLineSpread} ({formatOdds(line.runLineAway)})
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">
                            -{line.runLineSpread} ({formatOdds(line.runLineHome)})
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-amber-500 font-semibold">
                            {line.totalLine}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">
                            {formatOdds(line.overOdds)}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">
                            {formatOdds(line.underOdds)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay lineas disponibles para este juego
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
