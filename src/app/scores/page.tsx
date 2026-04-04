"use client";

import { useState, useMemo } from "react";
import { DateSelector } from "@/components/scores/DateSelector";
import { ScoreBoard } from "@/components/scores/ScoreBoard";
import type { Game, GameInning } from "@/types/game";

function generateMockGames(date: Date): Game[] {
  const dateStr = date.toISOString().split("T")[0];
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  const isPast = date < today && !isToday;

  const teams = [
    { id: "nyy", name: "Yankees", abbreviation: "NYY", city: "New York", logoUrl: "", primaryColor: "#003087", secondaryColor: "#E4002C" },
    { id: "bos", name: "Red Sox", abbreviation: "BOS", city: "Boston", logoUrl: "", primaryColor: "#BD3039", secondaryColor: "#0C2340" },
    { id: "lad", name: "Dodgers", abbreviation: "LAD", city: "Los Angeles", logoUrl: "", primaryColor: "#005A9C", secondaryColor: "#EF3E42" },
    { id: "sfg", name: "Giants", abbreviation: "SF", city: "San Francisco", logoUrl: "", primaryColor: "#FD5A1E", secondaryColor: "#27251F" },
    { id: "hou", name: "Astros", abbreviation: "HOU", city: "Houston", logoUrl: "", primaryColor: "#002D62", secondaryColor: "#EB6E1F" },
    { id: "tex", name: "Rangers", abbreviation: "TEX", city: "Texas", logoUrl: "", primaryColor: "#003278", secondaryColor: "#C0111F" },
    { id: "atl", name: "Braves", abbreviation: "ATL", city: "Atlanta", logoUrl: "", primaryColor: "#CE1141", secondaryColor: "#13274F" },
    { id: "nym", name: "Mets", abbreviation: "NYM", city: "New York", logoUrl: "", primaryColor: "#002D72", secondaryColor: "#FF5910" },
    { id: "chc", name: "Cubs", abbreviation: "CHC", city: "Chicago", logoUrl: "", primaryColor: "#0E3386", secondaryColor: "#CC3433" },
    { id: "stl", name: "Cardinals", abbreviation: "STL", city: "St. Louis", logoUrl: "", primaryColor: "#C41E3A", secondaryColor: "#0C2340" },
  ];

  const matchups = [
    [0, 1], [2, 3], [4, 5], [6, 7], [8, 9],
  ];

  return matchups.map(([away, home], idx) => {
    const gameId = `${dateStr}-${idx}`;
    const innings: GameInning[] = [];
    let homeScore = 0;
    let awayScore = 0;

    const completedInnings = isPast ? 9 : isToday && idx < 2 ? Math.floor(Math.random() * 7) + 2 : 0;

    for (let i = 1; i <= completedInnings; i++) {
      const ar = Math.random() < 0.35 ? Math.floor(Math.random() * 3) + 1 : 0;
      const hr = Math.random() < 0.35 ? Math.floor(Math.random() * 3) + 1 : 0;
      awayScore += ar;
      homeScore += hr;
      innings.push({ inningNumber: i, awayRuns: ar, homeRuns: hr });
    }

    let status: Game["status"];
    let inning: number | null = null;
    let inningHalf: Game["inningHalf"] = null;
    let outs = 0;

    if (isPast || (isToday && idx >= 2 && idx < 4)) {
      status = "FINAL";
      if (innings.length === 0) {
        for (let i = 1; i <= 9; i++) {
          const ar = Math.random() < 0.35 ? Math.floor(Math.random() * 3) + 1 : 0;
          const hr = Math.random() < 0.35 ? Math.floor(Math.random() * 3) + 1 : 0;
          awayScore += ar;
          homeScore += hr;
          innings.push({ inningNumber: i, awayRuns: ar, homeRuns: hr });
        }
      }
    } else if (isToday && idx < 2) {
      status = "LIVE";
      inning = completedInnings + 1;
      inningHalf = Math.random() > 0.5 ? "TOP" : "BOTTOM";
      outs = Math.floor(Math.random() * 3);
    } else {
      status = "SCHEDULED";
    }

    const startHour = 13 + idx * 2;

    return {
      id: gameId,
      externalId: gameId,
      homeTeam: teams[home],
      awayTeam: teams[away],
      date: dateStr,
      status,
      homeScore,
      awayScore,
      inning,
      inningHalf,
      outs,
      startTime: `${dateStr}T${String(startHour).padStart(2, "0")}:10:00Z`,
      venue: "Stadium",
      innings,
      lines: [
        {
          id: `line-${gameId}`,
          source: "DraftKings",
          homeMoneyline: homeScore > awayScore ? -150 : 130,
          awayMoneyline: awayScore > homeScore ? -140 : 120,
          runLineSpread: 1.5,
          runLineHome: -110,
          runLineAway: -110,
          totalLine: 8.5,
          overOdds: -110,
          underOdds: -110,
        },
      ],
    };
  });
}

export default function ScoresPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const games = useMemo(() => generateMockGames(selectedDate), [selectedDate]);

  const sortedGames = useMemo(() => {
    const order: Record<string, number> = { LIVE: 0, SCHEDULED: 1, FINAL: 2, POSTPONED: 3, CANCELLED: 4 };
    return [...games].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  }, [games]);

  function handleDateChange(date: Date) {
    setLoading(true);
    setSelectedDate(date);
    // Simulate loading
    setTimeout(() => setLoading(false), 400);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scores</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resultados y juegos en vivo de la MLB
        </p>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />

      <ScoreBoard games={sortedGames} loading={loading} />
    </div>
  );
}
