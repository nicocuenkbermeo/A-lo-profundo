// Feature 3 — Duelo del Día.
//
// Pipeline:
//   1. Get today's schedule with probablePitcher + lineups hydrated.
//   2. For each game that has both a probable pitcher AND a known lineup for
//      the opposing team, query vsPlayer for every batter vs the starter.
//   3. Score each matchup: min(AB, 20) * OPS — wants volume AND extremes.
//   4. Pick the "juiciest" matchup per game.
//
// vsPlayer calls: up to 9 batters × ~15 games = ~135 calls. The rate limiter
// handles this (10/s ≈ 14s worst case). Cached for 2h with ISR.

import { mlbFetch, MLB_TAGS } from "../client";
import { scheduleWithLineups, playerVsPlayer } from "../endpoints";
import { playerHeadshotUrl } from "../../i18n/translations";
import type {
  ScheduleWithLineupsResponse,
  ScheduleGameWithLineups,
  VsPlayerResponse,
} from "../types";

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

export type DuelAdvantage = "batter" | "pitcher" | "even";

export interface DuelMatchup {
  gameId: string;
  gameLabel: string; // "NYY @ BOS"
  gameTime: string;  // ISO UTC
  batterId: number;
  batterName: string;
  batterTeamAbbr: string;
  batterHeadshot: string;
  pitcherId: number;
  pitcherName: string;
  pitcherTeamAbbr: string;
  pitcherHeadshot: string;
  ab: number;
  hits: number;
  hr: number;
  strikeouts: number;
  avg: string;
  ops: string;
  opsNum: number;
  rbi: number;
  bb: number;
  juiciness: number; // min(AB,20) * OPS
  advantage: DuelAdvantage;
  narrative: string; // auto-generated 1-liner
}

export interface DuelsReport {
  date: string;
  duels: DuelMatchup[];
  stats: {
    gamesWithLineups: number;
    gamesSkipped: number;
    vsPlayerCalls: number;
    vsPlayerErrors: number;
  };
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayBogota(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function toBogotaTime(isoUtc: string): string {
  try {
    return new Date(isoUtc).toLocaleTimeString("es-CO", {
      timeZone: BOGOTA_TZ,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();
  } catch {
    return "";
  }
}

function abbrFor(teamId: number): string {
  return TEAM_ID_TO_ABBR[teamId] ?? "MLB";
}

function advantageFrom(ops: number): DuelAdvantage {
  if (ops >= 0.85) return "batter";
  if (ops <= 0.6) return "pitcher";
  return "even";
}

function narrativeFor(d: { batterName: string; pitcherName: string; ab: number; avg: string; hr: number; ops: string }): string {
  if (d.ab === 0) return `${d.batterName} se enfrenta por primera vez a ${d.pitcherName}.`;
  if (d.hr > 0) {
    return `${d.batterName} batea ${d.avg} con ${d.hr} HR en ${d.ab} turnos de por vida contra ${d.pitcherName}.`;
  }
  const opsNum = Number(d.ops);
  if (opsNum >= 0.85) {
    return `${d.batterName} lo tiene dominado: ${d.avg} de AVG y ${d.ops} de OPS en ${d.ab} AB contra ${d.pitcherName}.`;
  }
  if (opsNum <= 0.5) {
    return `${d.pitcherName} domina el matchup: ${d.batterName} batea solo ${d.avg} en ${d.ab} turnos.`;
  }
  return `${d.batterName} y ${d.pitcherName} están parejos: ${d.avg} de AVG en ${d.ab} turnos.`;
}

// ---------------------------------------------------------------------------
// Per-game duel finder
// ---------------------------------------------------------------------------

interface VsJob {
  batterId: number;
  batterName: string;
  batterTeamId: number;
  pitcherId: number;
  pitcherName: string;
  pitcherTeamId: number;
  gameId: string;
  gameLabel: string;
  gameTime: string;
}

async function findBestDuel(jobs: VsJob[]): Promise<{ duel: DuelMatchup | null; calls: number; errors: number }> {
  if (jobs.length === 0) return { duel: null, calls: 0, errors: 0 };

  const results = await Promise.allSettled(
    jobs.map((j) =>
      mlbFetch<VsPlayerResponse>(playerVsPlayer(j.batterId, j.pitcherId), {
        revalidate: 7200,
        tags: [MLB_TAGS.duelOfDay],
        label: `vs:${j.batterId}v${j.pitcherId}`,
      }).then((resp) => ({ job: j, resp })),
    ),
  );

  let best: DuelMatchup | null = null;
  let bestScore = -1;
  let errors = 0;

  for (const r of results) {
    if (r.status !== "fulfilled") { errors++; continue; }
    const { job, resp } = r.value;
    const split = resp.stats?.[0]?.splits?.[0]?.stat;
    if (!split) continue;

    const ab = split.atBats ?? 0;
    const hits = split.hits ?? 0;
    const hr = split.homeRuns ?? 0;
    const so = split.strikeOuts ?? 0;
    const avg = split.avg ?? ".000";
    const ops = split.ops ?? ".000";
    const rbi = split.rbi ?? 0;
    const bb = split.baseOnBalls ?? 0;
    const opsNum = Number(ops) || 0;
    const juiciness = Math.min(ab, 20) * opsNum;

    if (juiciness > bestScore) {
      bestScore = juiciness;
      best = {
        gameId: job.gameId,
        gameLabel: job.gameLabel,
        gameTime: job.gameTime,
        batterId: job.batterId,
        batterName: job.batterName,
        batterTeamAbbr: abbrFor(job.batterTeamId),
        batterHeadshot: playerHeadshotUrl(job.batterId),
        pitcherId: job.pitcherId,
        pitcherName: job.pitcherName,
        pitcherTeamAbbr: abbrFor(job.pitcherTeamId),
        pitcherHeadshot: playerHeadshotUrl(job.pitcherId),
        ab, hits, hr, strikeouts: so, avg, ops, opsNum, rbi, bb,
        juiciness,
        advantage: advantageFrom(opsNum),
        narrative: narrativeFor({ batterName: job.batterName, pitcherName: job.pitcherName, ab, avg, hr, ops }),
      };
    }
  }

  return { duel: best, calls: jobs.length, errors };
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

function buildJobsForGame(g: ScheduleGameWithLineups): VsJob[] {
  const jobs: VsJob[] = [];
  const gameId = String(g.gamePk);
  const awayAbbr = abbrFor(g.teams.away.team.id);
  const homeAbbr = abbrFor(g.teams.home.team.id);
  const gameLabel = `${awayAbbr} @ ${homeAbbr}`;
  const gameTime = g.gameDate;

  // Away batters vs home pitcher
  const homePitcher = g.teams.home.probablePitcher;
  const awayBatters = g.teams.away.lineups?.batters ?? [];
  if (homePitcher && awayBatters.length > 0) {
    for (const b of awayBatters.slice(0, 9)) {
      jobs.push({
        batterId: b.id,
        batterName: b.fullName,
        batterTeamId: g.teams.away.team.id,
        pitcherId: homePitcher.id,
        pitcherName: homePitcher.fullName,
        pitcherTeamId: g.teams.home.team.id,
        gameId, gameLabel, gameTime,
      });
    }
  }

  // Home batters vs away pitcher
  const awayPitcher = g.teams.away.probablePitcher;
  const homeBatters = g.teams.home.lineups?.batters ?? [];
  if (awayPitcher && homeBatters.length > 0) {
    for (const b of homeBatters.slice(0, 9)) {
      jobs.push({
        batterId: b.id,
        batterName: b.fullName,
        batterTeamId: g.teams.home.team.id,
        pitcherId: awayPitcher.id,
        pitcherName: awayPitcher.fullName,
        pitcherTeamId: g.teams.away.team.id,
        gameId, gameLabel, gameTime,
      });
    }
  }

  return jobs;
}

export async function buildDuelsReport(): Promise<DuelsReport> {
  const date = todayBogota();

  // 1. Schedule with lineups
  const schedule = await mlbFetch<ScheduleWithLineupsResponse>(scheduleWithLineups(date), {
    revalidate: 7200,
    tags: [MLB_TAGS.schedule, MLB_TAGS.duelOfDay],
    label: `schedule:duels:${date}`,
  });

  const games = schedule.dates?.[0]?.games ?? [];

  // 2. Build vsPlayer jobs per game
  let gamesWithLineups = 0;
  let gamesSkipped = 0;
  const jobsByGame = new Map<string, VsJob[]>();

  for (const g of games) {
    const jobs = buildJobsForGame(g);
    if (jobs.length === 0) {
      gamesSkipped++;
      continue;
    }
    gamesWithLineups++;
    jobsByGame.set(String(g.gamePk), jobs);
  }

  // 3. Find best duel per game, all games in parallel
  const entries = [...jobsByGame.entries()];
  const duelResults = await Promise.all(
    entries.map(([, jobs]) => findBestDuel(jobs)),
  );

  let totalCalls = 0;
  let totalErrors = 0;
  const duels: DuelMatchup[] = [];

  for (const r of duelResults) {
    totalCalls += r.calls;
    totalErrors += r.errors;
    if (r.duel) duels.push(r.duel);
  }

  // Sort by juiciness desc
  duels.sort((a, b) => b.juiciness - a.juiciness);

  return {
    date,
    duels,
    stats: {
      gamesWithLineups,
      gamesSkipped,
      vsPlayerCalls: totalCalls,
      vsPlayerErrors: totalErrors,
    },
    generatedAt: new Date().toISOString(),
  };
}
