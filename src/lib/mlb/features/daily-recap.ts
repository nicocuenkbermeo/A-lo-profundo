// Feature 7 — Lo Profundo del Día (Daily Recap).
//
// Aggregates F1 (moment), F3 (duels), F5 (streaks), F6 (bullpens in red)
// plus schedule results from yesterday and today's matchups.
// All text is deterministic via recap-templates.ts.

import { mlbFetch, MLB_TAGS } from "../client";
import { scheduleByDate } from "../endpoints";
import { generateHeadline, generateMvpBlurb, generateUpsetBlurb } from "../recap-templates";
import { buildMomentOfDay, type MomentOfDayReport } from "./moment-of-day";
import { buildDuelsReport, type DuelsReport } from "./duel-of-day";
import { buildChaseReport, type ChaseReport } from "./chase";
import { buildBullpenReport, type BullpenReport } from "./bullpens";
import type { ScheduleResponse } from "../types";

const BOGOTA_TZ = "America/Bogota";

const TEAM_ID_TO_ABBR: Record<number, string> = {
  108: "LAA", 109: "ARI", 110: "BAL", 111: "BOS", 112: "CHC",
  113: "CIN", 114: "CLE", 115: "COL", 116: "DET", 117: "HOU",
  118: "KCR", 119: "LAD", 120: "WSH", 121: "NYM", 133: "OAK",
  134: "PIT", 135: "SDP", 136: "SEA", 137: "SFG", 138: "STL",
  139: "TBR", 140: "TEX", 141: "TOR", 142: "MIN", 143: "PHI",
  144: "ATL", 145: "CHW", 146: "MIA", 147: "NYY", 158: "MIL",
};

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface GameResult {
  gameId: string;
  awayAbbr: string;
  homeAbbr: string;
  awayName: string;
  homeName: string;
  awayScore: number;
  homeScore: number;
}

export interface DailyRecap {
  date: string;          // yesterday (YYYY-MM-DD)
  today: string;         // today (YYYY-MM-DD)
  headline: string;
  results: GameResult[];  // all final games from yesterday
  mvp: MomentOfDayReport;
  upsetBlurb: string | null;
  duelsToday: DuelsReport;
  chase: ChaseReport;
  bullpens: BullpenReport;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayBogota(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TZ, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

function subtractDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - days);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

/**
 * @param date — the "yesterday" date to recap. Defaults to yesterday (Bogotá).
 */
export async function buildDailyRecap(date?: string): Promise<DailyRecap> {
  const yesterday = date ?? subtractDays(todayBogota(), 1);
  const today = date ? (() => {
    const [y, m, d] = yesterday.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + 1);
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
  })() : todayBogota();

  // Parallel: F1 moment (yesterday), F3 duels (today), F5 chase, F6 bullpens (today), schedule yesterday
  const [mvp, duelsToday, chase, bullpens, scheduleYesterday] = await Promise.all([
    buildMomentOfDay(yesterday).catch((err) => {
      console.error("[recap] moment failed", err);
      return null;
    }),
    buildDuelsReport(today).catch((err) => {
      console.error("[recap] duels failed", err);
      return null;
    }),
    buildChaseReport().catch((err) => {
      console.error("[recap] chase failed", err);
      return null;
    }),
    buildBullpenReport(today).catch((err) => {
      console.error("[recap] bullpens failed", err);
      return null;
    }),
    mlbFetch<ScheduleResponse>(scheduleByDate(yesterday, "linescore,team"), {
      revalidate: 86400,
      tags: [MLB_TAGS.schedule, MLB_TAGS.dailyRecap],
      label: `schedule:recap:${yesterday}`,
    }).catch(() => null),
  ]);

  // Build results table from yesterday's schedule
  const results: GameResult[] = [];
  for (const day of scheduleYesterday?.dates ?? []) {
    for (const g of day.games ?? []) {
      if (g.status?.abstractGameState !== "Final") continue;
      results.push({
        gameId: String(g.gamePk),
        awayAbbr: TEAM_ID_TO_ABBR[g.teams.away.team.id] ?? "MLB",
        homeAbbr: TEAM_ID_TO_ABBR[g.teams.home.team.id] ?? "MLB",
        awayName: g.teams.away.team.name,
        homeName: g.teams.home.team.name,
        awayScore: g.teams.away.score ?? 0,
        homeScore: g.teams.home.score ?? 0,
      });
    }
  }

  // Headline
  const mvpName = mvp?.moment?.batterName ?? "la MLB";
  const headline = generateHeadline(yesterday, results.length, mvpName);

  // Upset detection: game where the "worse" team won (by name position — simplistic).
  // We don't have records here, so just pick the game with the biggest score margin
  // where the away team won (road upsets feel more dramatic).
  let upsetBlurb: string | null = null;
  const awayWins = results.filter((r) => r.awayScore > r.homeScore);
  if (awayWins.length > 0) {
    const biggest = awayWins.reduce((a, b) =>
      (b.awayScore - b.homeScore) > (a.awayScore - a.homeScore) ? b : a,
    );
    upsetBlurb = generateUpsetBlurb(
      biggest.awayName,
      biggest.homeName,
      `${biggest.awayScore}-${biggest.homeScore}`,
    );
  }

  // Fallback empty reports
  const emptyMvp: MomentOfDayReport = {
    date: yesterday,
    moment: null,
    stats: { gamesAnalyzed: 0, gamesSkippedNonFinal: 0, playsConsidered: 0, playsDiscardedTrivial: 0 },
  };
  const emptyDuels: DuelsReport = {
    date: today,
    duels: [],
    stats: { gamesWithLineups: 0, gamesSkipped: 0, vsPlayerCalls: 0, vsPlayerErrors: 0 },
    generatedAt: new Date().toISOString(),
  };
  const emptyChase: ChaseReport = {
    season: new Date().getFullYear(),
    projectionsAvailable: false,
    projections: { hr50: [], sb50: [], wins20: [], avg300: [] },
    streaks: { hitStreak: [], obStreak: [], scorelessStreak: [] },
    generatedAt: new Date().toISOString(),
  };
  const emptyBullpens: BullpenReport = {
    windowStart: "", windowEnd: "", teams: [], generatedAt: new Date().toISOString(),
  };

  return {
    date: yesterday,
    today,
    headline,
    results,
    mvp: mvp ?? emptyMvp,
    upsetBlurb,
    duelsToday: duelsToday ?? emptyDuels,
    chase: chase ?? emptyChase,
    bullpens: bullpens ?? emptyBullpens,
    generatedAt: new Date().toISOString(),
  };
}
