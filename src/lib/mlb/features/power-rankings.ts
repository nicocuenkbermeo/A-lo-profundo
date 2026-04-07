// Feature 4 — Power Rankings A Lo Profundo.
//
// Pipeline:
//   1. Pull current standings → W/L, runDiff, streak, last 10 per team.
//   2. For each team, pull hitting & pitching byDateRange for the last 15 days
//      (Bogotá). 60 parallel fetches, rate-limited by the client.
//   3. Compute a Power Score per team (see formula below) and rank 1..30.
//   4. Load history from public/data/power-rankings-history.json. If the
//      previous week's snapshot exists, compute movement ▲▼. Otherwise "—".
//   5. Build a narrative sentence per team using templates.ts (deterministic).
//
// Division-by-zero handling: if gamesPlayed === 0, the runDiff term is 0.

import fs from "node:fs/promises";
import path from "node:path";

import { mlbFetch, MLB_TAGS } from "../client";
import { standings as standingsUrl, teamStatsByDateRange } from "../endpoints";
import { getCurrentSeason } from "../season";
import { narrativeFor } from "../templates";
import type {
  StandingsResponse,
  StandingTeamRecord,
  TeamStatsResponse,
} from "../types";

const BOGOTA_TZ = "America/Bogota";

// Local copy to keep this layer independent.
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

export type Movement = "up" | "down" | "same" | "new";

export interface PowerRankingRow {
  rank: number;
  teamId: number;
  teamName: string;
  abbreviation: string;
  wins: number;
  losses: number;
  record: string; // "24-14"
  gamesPlayed: number;
  runDifferential: number;
  winPct: number;
  last10: string; // "7-3"
  last10Wins: number;
  streakCode: string;
  ops15: number;
  era15: number;
  powerScore: number;
  previousRank: number | null;
  movement: Movement;
  movementDelta: number; // positive = up, negative = down, 0 = same/new
  narrative: string;
}

export interface PowerRankingsReport {
  season: number;
  weekStart: string;   // YYYY-MM-DD (Monday of the current week, Bogotá)
  generatedAt: string; // ISO
  rankings: PowerRankingRow[];
}

// Shape of public/data/power-rankings-history.json
interface HistoryFile {
  snapshots: Array<{
    weekStart: string;
    season: number;
    rankings: Array<{ teamId: number; rank: number; powerScore: number }>;
  }>;
}

// ---------------------------------------------------------------------------
// Date helpers (Bogotá)
// ---------------------------------------------------------------------------

function todayBogota(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function subtractDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - days);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

// Monday of the current ISO week, in Bogotá.
function mondayOfThisWeek(): string {
  const today = todayBogota();
  const [y, m, d] = today.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = dt.getUTCDay(); // 0=Sun..6=Sat
  const diff = dow === 0 ? -6 : 1 - dow; // roll back to Mon
  dt.setUTCDate(dt.getUTCDate() + diff);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// History loader
// ---------------------------------------------------------------------------

const HISTORY_PATH = path.join(process.cwd(), "public", "data", "power-rankings-history.json");

async function loadHistory(): Promise<HistoryFile> {
  try {
    const raw = await fs.readFile(HISTORY_PATH, "utf8");
    const parsed = JSON.parse(raw) as HistoryFile;
    if (!parsed?.snapshots || !Array.isArray(parsed.snapshots)) {
      return { snapshots: [] };
    }
    return parsed;
  } catch {
    return { snapshots: [] };
  }
}

function lastSnapshotBefore(history: HistoryFile, weekStart: string) {
  const sorted = [...history.snapshots].sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1));
  const prev = sorted.reverse().find((s) => s.weekStart < weekStart);
  return prev ?? null;
}

// ---------------------------------------------------------------------------
// Standings helpers
// ---------------------------------------------------------------------------

function last10FromRecord(rec: StandingTeamRecord): { wins: number; losses: number } {
  const split = rec.records?.splitRecords?.find((s) => s.type === "lastTen");
  if (split) return { wins: split.wins, losses: split.losses };
  return { wins: 0, losses: 0 };
}

function streakBonus(code: string | undefined): number {
  if (!code) return 0;
  const match = /^([WL])(\d+)$/.exec(code);
  if (!match) return 0;
  const n = Number(match[2]);
  if (match[1] === "W" && n >= 5) return 3;
  if (match[1] === "L" && n >= 5) return -3;
  return 0;
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export async function buildPowerRankings(): Promise<PowerRankingsReport> {
  const season = getCurrentSeason();
  const weekStart = mondayOfThisWeek();
  const today = todayBogota();
  const rangeStart = subtractDays(today, 15);

  // 1. Standings (one call).
  const standings = await mlbFetch<StandingsResponse>(standingsUrl(season), {
    revalidate: 3600,
    tags: [MLB_TAGS.powerRankings],
    label: "standings:power-rankings",
  });

  const allTeams: StandingTeamRecord[] = [];
  for (const block of standings.records ?? []) {
    for (const tr of block.teamRecords ?? []) allTeams.push(tr);
  }

  // 2. Recent team stats, 60 calls in parallel (rate-limited to 10/s).
  const statsJobs = allTeams.flatMap((tr) => [
    mlbFetch<TeamStatsResponse>(
      teamStatsByDateRange({
        teamId: tr.team.id,
        season,
        group: "hitting",
        startDate: rangeStart,
        endDate: today,
      }),
      {
        revalidate: 3600,
        tags: [MLB_TAGS.powerRankings],
        label: `teamStats:hit:${tr.team.id}`,
      },
    ).then((resp) => ({ teamId: tr.team.id, group: "hitting" as const, resp })),
    mlbFetch<TeamStatsResponse>(
      teamStatsByDateRange({
        teamId: tr.team.id,
        season,
        group: "pitching",
        startDate: rangeStart,
        endDate: today,
      }),
      {
        revalidate: 3600,
        tags: [MLB_TAGS.powerRankings],
        label: `teamStats:pit:${tr.team.id}`,
      },
    ).then((resp) => ({ teamId: tr.team.id, group: "pitching" as const, resp })),
  ]);

  const statsResults = await Promise.allSettled(statsJobs);

  const opsByTeam = new Map<number, number>();
  const eraByTeam = new Map<number, number>();

  for (const r of statsResults) {
    if (r.status !== "fulfilled") continue;
    const { teamId, group, resp } = r.value;
    const split = resp.stats?.[0]?.splits?.[0]?.stat;
    if (!split) continue;
    if (group === "hitting") {
      const ops = Number(split.ops ?? 0);
      if (Number.isFinite(ops)) opsByTeam.set(teamId, ops);
    } else {
      const era = Number(split.era ?? 0);
      if (Number.isFinite(era)) eraByTeam.set(teamId, era);
    }
  }

  // 3. Compute Power Score.
  //
  //    PowerScore =
  //      winPct * 30
  //      + (runDiff / gamesPlayed) * 10       [skipped if gp == 0]
  //      + last10Wins * 2
  //      + ops15 * 15
  //      - era15 * 3
  //      + streakBonus                        [+3 if W5+, -3 if L5+]
  //
  //    Adjustment notes:
  //      - Baseline formula taken from PROMPT.md.
  //      - If ops15 or era15 are missing (early season / no recent games),
  //        we default them to neutral values (.720 OPS, 4.30 ERA) so the
  //        team isn't punished for lack of sample.
  const NEUTRAL_OPS = 0.72;
  const NEUTRAL_ERA = 4.3;

  const computed = allTeams.map((tr) => {
    const gp = tr.gamesPlayed ?? tr.wins + tr.losses;
    const winPct = Number(tr.winningPercentage ?? 0);
    const runDiff = tr.runDifferential ?? 0;
    const last10 = last10FromRecord(tr);
    const ops15 = opsByTeam.get(tr.team.id) ?? NEUTRAL_OPS;
    const era15 = eraByTeam.get(tr.team.id) ?? NEUTRAL_ERA;
    const streakCode = tr.streak?.streakCode ?? "";

    const runDiffTerm = gp > 0 ? (runDiff / gp) * 10 : 0;

    const powerScore =
      winPct * 30 +
      runDiffTerm +
      last10.wins * 2 +
      ops15 * 15 -
      era15 * 3 +
      streakBonus(streakCode);

    return {
      teamId: tr.team.id,
      teamName: tr.team.name,
      abbreviation: TEAM_ID_TO_ABBR[tr.team.id] ?? "MLB",
      wins: tr.wins,
      losses: tr.losses,
      gamesPlayed: gp,
      runDifferential: runDiff,
      winPct,
      last10Wins: last10.wins,
      last10: `${last10.wins}-${last10.losses}`,
      streakCode,
      ops15,
      era15,
      powerScore,
    };
  });

  computed.sort((a, b) => b.powerScore - a.powerScore);

  // 4. Movement vs previous snapshot.
  const history = await loadHistory();
  const prevSnap = lastSnapshotBefore(history, weekStart);
  const prevRankMap = new Map<number, number>();
  if (prevSnap) {
    for (const r of prevSnap.rankings) prevRankMap.set(r.teamId, r.rank);
  }

  // 5. Build final rows with narrative.
  const rankings: PowerRankingRow[] = computed.map((c, idx) => {
    const rank = idx + 1;
    const previousRank = prevRankMap.get(c.teamId) ?? null;
    const movementDelta = previousRank == null ? 0 : previousRank - rank; // +up / -down
    const movement: Movement =
      previousRank == null ? "new" : movementDelta > 0 ? "up" : movementDelta < 0 ? "down" : "same";

    const narrative = narrativeFor({
      teamId: c.teamId,
      teamName: c.teamName,
      weekStart,
      movement: movementDelta,
      record: `${c.wins}-${c.losses}`,
      last10: c.last10,
      ops: c.ops15,
      era: c.era15,
      streakCode: c.streakCode,
    });

    return {
      rank,
      teamId: c.teamId,
      teamName: c.teamName,
      abbreviation: c.abbreviation,
      wins: c.wins,
      losses: c.losses,
      record: `${c.wins}-${c.losses}`,
      gamesPlayed: c.gamesPlayed,
      runDifferential: c.runDifferential,
      winPct: c.winPct,
      last10: c.last10,
      last10Wins: c.last10Wins,
      streakCode: c.streakCode,
      ops15: c.ops15,
      era15: c.era15,
      powerScore: c.powerScore,
      previousRank,
      movement,
      movementDelta,
      narrative,
    };
  });

  return {
    season,
    weekStart,
    generatedAt: new Date().toISOString(),
    rankings,
  };
}

// Export for the admin snapshot endpoint.
export function rankingsToSnapshot(report: PowerRankingsReport) {
  return {
    weekStart: report.weekStart,
    season: report.season,
    rankings: report.rankings.map((r) => ({
      teamId: r.teamId,
      rank: r.rank,
      powerScore: Number(r.powerScore.toFixed(3)),
    })),
  };
}
