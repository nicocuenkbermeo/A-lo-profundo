// Feature 6 — Bullpen Fatigue Report.
//
// Uses the new MLB layer (src/lib/mlb/*). Does NOT touch src/lib/mlb-api.ts.
//
// High-level:
//   1. Pull the MLB schedule for the last 3 full calendar days (Bogotá).
//   2. Collect every FINAL gamePk in that window.
//   3. For each gamePk, pull the live feed in parallel.
//   4. For each team in each game, walk the boxscore players and aggregate,
//      per reliever, pitches thrown and distinct days of work.
//   5. Classify each reliever and each bullpen as green/yellow/red.

import { mlbFetch, MLB_TAGS } from "../client";
import { scheduleByDateRange, liveFeed } from "../endpoints";
import type { ScheduleResponse, LiveFeedResponse, BoxscorePlayer } from "../types";

// ---------------------------------------------------------------------------
// Team id -> local abbr mapping. Duplicated from src/lib/mlb-api.ts on
// purpose to keep the new layer independent of the legacy file.
// ---------------------------------------------------------------------------

const TEAM_ID_TO_ABBR: Record<number, string> = {
  108: "LAA", 109: "ARI", 110: "BAL", 111: "BOS", 112: "CHC",
  113: "CIN", 114: "CLE", 115: "COL", 116: "DET", 117: "HOU",
  118: "KCR", 119: "LAD", 120: "WSH", 121: "NYM", 133: "OAK",
  134: "PIT", 135: "SDP", 136: "SEA", 137: "SFG", 138: "STL",
  139: "TBR", 140: "TEX", 141: "TOR", 142: "MIN", 143: "PHI",
  144: "ATL", 145: "CHW", 146: "MIA", 147: "NYY", 158: "MIL",
};

// ---------------------------------------------------------------------------
// Types exposed to UI
// ---------------------------------------------------------------------------

export type BullpenStatus = "green" | "yellow" | "red";

export interface RelieverReport {
  personId: number;
  fullName: string;
  totalPitches: number;
  daysAppeared: number; // distinct calendar days (Bogotá) in the 3-day window
  status: BullpenStatus;
}

export interface TeamBullpenReport {
  teamId: number;
  teamName: string;
  abbreviation: string;
  status: BullpenStatus;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  relievers: RelieverReport[]; // sorted by totalPitches desc
}

export interface BullpenReport {
  windowStart: string; // YYYY-MM-DD
  windowEnd: string;   // YYYY-MM-DD
  teams: TeamBullpenReport[]; // 30 entries
  generatedAt: string; // ISO
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BOGOTA_TZ = "America/Bogota";

function toBogotaDate(isoUtc: string): string {
  // e.g. "2026-04-07"
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(isoUtc));
}

function todayInBogota(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function subtractDays(ymd: string, days: number): string {
  // ymd = "YYYY-MM-DD"; use UTC math to avoid DST drift.
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function classifyReliever(totalPitches: number, daysAppeared: number): BullpenStatus {
  if (totalPitches >= 40 || daysAppeared >= 3) return "red";
  if (totalPitches >= 25 || daysAppeared >= 2) return "yellow";
  return "green";
}

function classifyBullpen(counts: { red: number; yellow: number }): BullpenStatus {
  if (counts.red >= 3) return "red";
  if (counts.red + counts.yellow >= 3) return "yellow";
  return "green";
}

// Extract the pitches thrown by one player in this boxscore entry.
// Prefer `numberOfPitches`; fall back to estimating from outs * 4 if absent.
function pitchesFrom(player: BoxscorePlayer): number {
  const p = player.stats?.pitching;
  if (!p) return 0;
  if (typeof p.numberOfPitches === "number") return p.numberOfPitches;
  if (typeof p.outs === "number") return p.outs * 4; // rough fallback
  return 0;
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

interface Accum {
  personId: number;
  fullName: string;
  totalPitches: number;
  days: Set<string>;
}

/**
 * @param asOfDate — YYYY-MM-DD end of the 3-day window. Defaults to today (Bogotá).
 */
export async function buildBullpenReport(asOfDate?: string): Promise<BullpenReport> {
  const today = asOfDate ?? todayInBogota();
  const start = subtractDays(today, 3);
  const end = today;

  // 1. Pull schedule for the window. Single request, all teams.
  const schedule = await mlbFetch<ScheduleResponse>(
    scheduleByDateRange({ startDate: start, endDate: end }),
    {
      revalidate: 3600,
      tags: [MLB_TAGS.schedule, MLB_TAGS.bullpens],
      label: "schedule:bullpens-window",
    },
  );

  // 2. Collect FINAL gamePks.
  const gamePks: number[] = [];
  for (const day of schedule.dates ?? []) {
    for (const g of day.games ?? []) {
      if (g.status?.abstractGameState === "Final") gamePks.push(g.gamePk);
    }
  }

  // 3. Fetch live feeds in parallel. The rate limiter in client.ts caps us
  //    at ~10/sec so even 40-50 games stay under MLB's tolerance.
  const feeds = await Promise.allSettled(
    gamePks.map((pk) =>
      mlbFetch<LiveFeedResponse>(liveFeed(pk), {
        revalidate: 7200,
        tags: [MLB_TAGS.liveFeed, MLB_TAGS.bullpens],
        label: `liveFeed:${pk}`,
      }),
    ),
  );

  // 4. Aggregate per-team reliever usage.
  //    Key: `${teamId}:${personId}` -> Accum
  const byTeamReliever = new Map<string, Accum>();
  const teamIds = new Set<number>();
  const teamNames = new Map<number, string>();

  for (const result of feeds) {
    if (result.status !== "fulfilled") continue;
    const feed = result.value;
    const dateKey = toBogotaDate(feed.gameData.datetime.dateTime);

    for (const side of ["home", "away"] as const) {
      const teamBox = feed.liveData?.boxscore?.teams?.[side];
      if (!teamBox) continue;
      const teamId = feed.gameData.teams[side].id;
      teamIds.add(teamId);
      teamNames.set(teamId, feed.gameData.teams[side].name);

      const starterId = teamBox.pitchers?.[0];
      const pitcherIds = teamBox.pitchers ?? [];
      for (const pid of pitcherIds) {
        if (pid === starterId) continue; // exclude the starter (F6 tracks relievers only)
        const player = teamBox.players?.[`ID${pid}`];
        if (!player) continue;
        const pitches = pitchesFrom(player);
        if (pitches <= 0) continue;

        const key = `${teamId}:${pid}`;
        const existing = byTeamReliever.get(key);
        if (existing) {
          existing.totalPitches += pitches;
          existing.days.add(dateKey);
        } else {
          byTeamReliever.set(key, {
            personId: pid,
            fullName: player.person.fullName,
            totalPitches: pitches,
            days: new Set([dateKey]),
          });
        }
      }
    }
  }

  // 5. Build per-team reports. Always include all 30 franchises so the grid
  //    stays complete even if a team was off during the window.
  const ALL_TEAM_IDS = Object.keys(TEAM_ID_TO_ABBR).map(Number);
  for (const id of ALL_TEAM_IDS) teamIds.add(id);

  const teams: TeamBullpenReport[] = [];
  for (const teamId of teamIds) {
    const relievers: RelieverReport[] = [];
    for (const [key, acc] of byTeamReliever.entries()) {
      if (!key.startsWith(`${teamId}:`)) continue;
      relievers.push({
        personId: acc.personId,
        fullName: acc.fullName,
        totalPitches: acc.totalPitches,
        daysAppeared: acc.days.size,
        status: classifyReliever(acc.totalPitches, acc.days.size),
      });
    }
    relievers.sort((a, b) => b.totalPitches - a.totalPitches);

    const counts = { red: 0, yellow: 0, green: 0 };
    for (const r of relievers) counts[r.status]++;

    teams.push({
      teamId,
      teamName: teamNames.get(teamId) ?? TEAM_ID_TO_ABBR[teamId] ?? String(teamId),
      abbreviation: TEAM_ID_TO_ABBR[teamId] ?? "MLB",
      status: classifyBullpen(counts),
      redCount: counts.red,
      yellowCount: counts.yellow,
      greenCount: counts.green,
      relievers,
    });
  }

  // Stable sort: red first (most tired), then yellow, then green.
  const order: Record<BullpenStatus, number> = { red: 0, yellow: 1, green: 2 };
  teams.sort((a, b) => order[a.status] - order[b.status] || b.redCount - a.redCount);

  return {
    windowStart: start,
    windowEnd: end,
    teams,
    generatedAt: new Date().toISOString(),
  };
}
