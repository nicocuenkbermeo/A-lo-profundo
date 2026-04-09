// Feature 5 — Chase for History.
//
// Two categories of content:
//
// A. PROJECTION TRACKERS (only shown when team gamesPlayed >= 40):
//    - 50 HR: projected 45+
//    - 50 SB: projected 45+
//    - 20 W:  projected 17+
//    - .300 AVG: current ≥ .295 AND ≥ 100 PA
//
// B. ACTIVE STREAKS (shown from day 1):
//    - Hit streak: 10+ games
//    - On-base streak: 20+ games
//    - Scoreless innings streak (pitchers): 15+ IP
//
// Projections use stat * (162 / gamesPlayed).

import { mlbFetch, MLB_TAGS } from "../client";
import { statsLeaders, playerGameLog, pitcherGameLog } from "../endpoints";
import { getCurrentSeason } from "../season";
import { playerHeadshotUrl, CHASE_LABELS } from "../../i18n/translations";
import type {
  StatsLeadersResponse,
  GameLogResponse,
  GameLogSplit,
} from "../types";

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

export interface ProjectionCandidate {
  personId: number;
  fullName: string;
  teamAbbr: string;
  headshot: string;
  currentValue: number;
  projected: number;
  milestone: number;
  progressPct: number;       // currentValue / milestone
  projectedPct: number;      // projected / milestone (can exceed 100)
  gamesPlayed: number;
  label: string;             // "Camino a 50 HR"
  statLabel: string;         // "HR", "SB", "W", "AVG"
}

export interface ActiveStreak {
  personId: number;
  fullName: string;
  teamAbbr: string;
  headshot: string;
  streakLength: number;
  unit: string;              // "juegos", "innings"
  label: string;             // "Racha de juegos con hit"
  startDate: string;         // YYYY-MM-DD
}

export interface ChaseReport {
  season: number;
  projectionsAvailable: boolean; // false if <40 GP
  projections: {
    hr50: ProjectionCandidate[];
    sb50: ProjectionCandidate[];
    wins20: ProjectionCandidate[];
    avg300: ProjectionCandidate[];
  };
  streaks: {
    hitStreak: ActiveStreak[];
    obStreak: ActiveStreak[];
    scorelessStreak: ActiveStreak[];
  };
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Leader fetching
// ---------------------------------------------------------------------------

async function fetchLeaderboard(category: string, statGroup: "hitting" | "pitching", season: number, limit = 20) {
  const resp = await mlbFetch<StatsLeadersResponse>(
    statsLeaders({ category, season, statGroup, limit }),
    { revalidate: 7200, tags: [MLB_TAGS.chase], label: `leaders:${category}` },
  );
  return resp.leagueLeaders?.[0]?.leaders ?? [];
}

// ---------------------------------------------------------------------------
// Projection helpers
// ---------------------------------------------------------------------------

function project(current: number, gamesPlayed: number): number {
  if (gamesPlayed <= 0) return 0;
  return current * (162 / gamesPlayed);
}

// ---------------------------------------------------------------------------
// Streak detection from game log
// ---------------------------------------------------------------------------

function detectHitStreak(splits: GameLogSplit[]): { length: number; startDate: string } {
  // Walk from most recent backwards. A game without an AB (rest day, walk-only, etc.) does
  // NOT break the streak, it just pauses it. An 0-for-X day with atBats > 0 breaks it.
  let count = 0;
  let startDate = "";
  const sorted = [...splits].sort((a, b) => (a.date > b.date ? -1 : 1));
  for (const s of sorted) {
    const ab = s.stat.atBats ?? 0;
    const h = s.stat.hits ?? 0;
    if (ab === 0) continue; // no AB that day — doesn't break the streak
    if (h > 0) {
      count++;
      startDate = s.date;
    } else {
      break; // 0-for-X breaks it
    }
  }
  return { length: count, startDate };
}

function detectOnBaseStreak(splits: GameLogSplit[]): { length: number; startDate: string } {
  // On-base = hit OR walk OR HBP. A game where the player has PA but never reaches base breaks it.
  let count = 0;
  let startDate = "";
  const sorted = [...splits].sort((a, b) => (a.date > b.date ? -1 : 1));
  for (const s of sorted) {
    const pa = s.stat.plateAppearances ?? (s.stat.atBats ?? 0) + (s.stat.baseOnBalls ?? 0) + (s.stat.hitByPitch ?? 0) + (s.stat.sacFlies ?? 0);
    if (pa === 0) continue;
    const h = s.stat.hits ?? 0;
    const bb = s.stat.baseOnBalls ?? 0;
    const hbp = s.stat.hitByPitch ?? 0;
    if (h + bb + hbp > 0) {
      count++;
      startDate = s.date;
    } else {
      break;
    }
  }
  return { length: count, startDate };
}

function detectScorelessStreak(splits: GameLogSplit[]): { length: number; startDate: string } {
  // Walk from most recent. Count consecutive innings with 0 earned runs.
  // inningsPitched "6.0" → 6 outs=18, "6.1" → 19, "6.2" → 20. We accumulate IP as a float.
  let totalIP = 0;
  let startDate = "";
  const sorted = [...splits].sort((a, b) => (a.date > b.date ? -1 : 1));
  for (const s of sorted) {
    const er = s.stat.earnedRuns ?? 0;
    const ipStr = s.stat.inningsPitched ?? "0";
    if (er > 0) break;
    // Parse "6.2" → 6 + 2/3
    const parts = ipStr.split(".");
    const whole = Number(parts[0]) || 0;
    const frac = Number(parts[1] ?? 0);
    totalIP += whole + frac / 3;
    startDate = s.date;
  }
  return { length: Math.round(totalIP * 10) / 10, startDate };
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

const MIN_GAMES_FOR_PROJECTIONS = 40;

/**
 * @param options.season — override season (default: auto).
 */
export async function buildChaseReport(options?: { season?: number }): Promise<ChaseReport> {
  const season = options?.season ?? getCurrentSeason();

  // 1. Fetch leaderboards in parallel
  const [hrLeaders, sbLeaders, avgLeaders, winsLeaders] = await Promise.all([
    fetchLeaderboard("homeRuns", "hitting", season, 20),
    fetchLeaderboard("stolenBases", "hitting", season, 20),
    fetchLeaderboard("battingAverage", "hitting", season, 30),
    fetchLeaderboard("wins", "pitching", season, 15),
  ]);

  // Determine if projections are available by checking gamesPlayed of the #1 HR leader.
  // The MLB leaders endpoint doesn't directly give gamesPlayed, so we infer from gameLog below.
  // For now, check if the season has started by seeing if any leaders exist.

  // 2. Build projection candidates + identify streak candidates.
  // We need gameLogs for:
  //   a) all HR/SB/AVG/W leaders to compute projections + gamesPlayed
  //   b) top AVG leaders for PA check
  //   c) top hitters for streak detection
  // To reduce calls, we deduplicate player IDs.

  const playerIdSet = new Set<number>();
  const pitcherIdSet = new Set<number>();

  const hrCandidates = hrLeaders.map((l) => ({ ...l, numVal: Number(l.value) || 0 }));
  const sbCandidates = sbLeaders.map((l) => ({ ...l, numVal: Number(l.value) || 0 }));
  const avgCandidates = avgLeaders.map((l) => ({ ...l, numVal: parseFloat(l.value) || 0 }));
  const winCandidates = winsLeaders.map((l) => ({ ...l, numVal: Number(l.value) || 0 }));

  for (const c of [...hrCandidates, ...sbCandidates, ...avgCandidates]) playerIdSet.add(c.person.id);
  for (const c of winCandidates) pitcherIdSet.add(c.person.id);
  // Also add top 15 HR leaders for hit/OB streak detection
  for (const l of hrLeaders.slice(0, 15)) playerIdSet.add(l.person.id);
  for (const l of avgLeaders.slice(0, 15)) playerIdSet.add(l.person.id);

  // 3. Fetch gameLogs in parallel
  const hitterLogJobs = [...playerIdSet].map((id) =>
    mlbFetch<GameLogResponse>(playerGameLog(id, season), {
      revalidate: 7200, tags: [MLB_TAGS.chase], label: `gameLog:hit:${id}`,
    }).then((resp) => ({ id, splits: resp.stats?.[0]?.splits ?? [] }))
      .catch(() => ({ id, splits: [] as GameLogSplit[] })),
  );

  const pitcherLogJobs = [...pitcherIdSet].map((id) =>
    mlbFetch<GameLogResponse>(pitcherGameLog(id, season), {
      revalidate: 7200, tags: [MLB_TAGS.chase], label: `gameLog:pit:${id}`,
    }).then((resp) => ({ id, splits: resp.stats?.[0]?.splits ?? [] }))
      .catch(() => ({ id, splits: [] as GameLogSplit[] })),
  );

  const [hitterLogs, pitcherLogs] = await Promise.all([
    Promise.all(hitterLogJobs),
    Promise.all(pitcherLogJobs),
  ]);

  const hitterLogMap = new Map(hitterLogs.map((l) => [l.id, l.splits]));
  const pitcherLogMap = new Map(pitcherLogs.map((l) => [l.id, l.splits]));

  // 4. Compute gamesPlayed from logs
  function gamesPlayedFor(id: number): number {
    return hitterLogMap.get(id)?.length ?? 0;
  }

  function pitcherGamesPlayedFor(id: number): number {
    return pitcherLogMap.get(id)?.length ?? 0;
  }

  // Team GP proxy: use the top HR leader's GP
  const topGP = hrCandidates.length > 0 ? gamesPlayedFor(hrCandidates[0].person.id) : 0;
  const projectionsAvailable = topGP >= MIN_GAMES_FOR_PROJECTIONS;

  // 5. Build projection lists (only if >= 40 GP)
  const hr50: ProjectionCandidate[] = [];
  const sb50: ProjectionCandidate[] = [];
  const wins20: ProjectionCandidate[] = [];
  const avg300: ProjectionCandidate[] = [];

  if (projectionsAvailable) {
    for (const c of hrCandidates) {
      const gp = gamesPlayedFor(c.person.id);
      if (gp < 20) continue;
      const proj = project(c.numVal, gp);
      if (proj >= 45) {
        hr50.push(makeProjection(c, gp, proj, 50, CHASE_LABELS.hr50, "HR"));
      }
    }
    hr50.sort((a, b) => b.projected - a.projected);

    for (const c of sbCandidates) {
      const gp = gamesPlayedFor(c.person.id);
      if (gp < 20) continue;
      const proj = project(c.numVal, gp);
      if (proj >= 45) {
        sb50.push(makeProjection(c, gp, proj, 50, CHASE_LABELS.sb50, "SB"));
      }
    }
    sb50.sort((a, b) => b.projected - a.projected);

    for (const c of winCandidates) {
      const gp = pitcherGamesPlayedFor(c.person.id);
      if (gp < 5) continue;
      const proj = project(c.numVal, gp);
      if (proj >= 17) {
        wins20.push(makeProjection(c, gp, proj, 20, CHASE_LABELS.wins20, "W"));
      }
    }
    wins20.sort((a, b) => b.projected - a.projected);

    for (const c of avgCandidates) {
      if (c.numVal < 0.295) continue;
      const gp = gamesPlayedFor(c.person.id);
      // PA check: sum from game log
      const pa = (hitterLogMap.get(c.person.id) ?? []).reduce(
        (sum, s) => sum + (s.stat.plateAppearances ?? (s.stat.atBats ?? 0) + (s.stat.baseOnBalls ?? 0) + (s.stat.hitByPitch ?? 0) + (s.stat.sacFlies ?? 0)),
        0,
      );
      if (pa < 100) continue;
      avg300.push({
        personId: c.person.id,
        fullName: c.person.fullName,
        teamAbbr: TEAM_ID_TO_ABBR[c.team?.id ?? 0] ?? "MLB",
        headshot: playerHeadshotUrl(c.person.id),
        currentValue: c.numVal,
        projected: c.numVal, // AVG doesn't project linearly well; show current
        milestone: 0.3,
        progressPct: c.numVal / 0.3,
        projectedPct: c.numVal / 0.3,
        gamesPlayed: gp,
        label: CHASE_LABELS.avg300,
        statLabel: "AVG",
      });
    }
    avg300.sort((a, b) => b.currentValue - a.currentValue);
  }

  // 6. Active streaks (always shown)
  const hitStreakList: ActiveStreak[] = [];
  const obStreakList: ActiveStreak[] = [];
  const scorelessList: ActiveStreak[] = [];

  for (const [id, splits] of hitterLogMap) {
    if (splits.length === 0) continue;
    const leader = [...hrCandidates, ...avgCandidates].find((c) => c.person.id === id);
    if (!leader) continue;

    const hs = detectHitStreak(splits);
    if (hs.length >= 10) {
      hitStreakList.push({
        personId: id,
        fullName: leader.person.fullName,
        teamAbbr: TEAM_ID_TO_ABBR[leader.team?.id ?? 0] ?? "MLB",
        headshot: playerHeadshotUrl(id),
        streakLength: hs.length,
        unit: "juegos",
        label: CHASE_LABELS.hitStreak,
        startDate: hs.startDate,
      });
    }

    const ob = detectOnBaseStreak(splits);
    if (ob.length >= 20) {
      obStreakList.push({
        personId: id,
        fullName: leader.person.fullName,
        teamAbbr: TEAM_ID_TO_ABBR[leader.team?.id ?? 0] ?? "MLB",
        headshot: playerHeadshotUrl(id),
        streakLength: ob.length,
        unit: "juegos",
        label: CHASE_LABELS.obStreak,
        startDate: ob.startDate,
      });
    }
  }

  for (const [id, splits] of pitcherLogMap) {
    if (splits.length === 0) continue;
    const leader = winCandidates.find((c) => c.person.id === id);
    if (!leader) continue;

    const ss = detectScorelessStreak(splits);
    if (ss.length >= 15) {
      scorelessList.push({
        personId: id,
        fullName: leader.person.fullName,
        teamAbbr: TEAM_ID_TO_ABBR[leader.team?.id ?? 0] ?? "MLB",
        headshot: playerHeadshotUrl(id),
        streakLength: ss.length,
        unit: "innings",
        label: CHASE_LABELS.scorelessStreak,
        startDate: ss.startDate,
      });
    }
  }

  hitStreakList.sort((a, b) => b.streakLength - a.streakLength);
  obStreakList.sort((a, b) => b.streakLength - a.streakLength);
  scorelessList.sort((a, b) => b.streakLength - a.streakLength);

  return {
    season,
    projectionsAvailable,
    projections: { hr50, sb50, wins20, avg300 },
    streaks: { hitStreak: hitStreakList, obStreak: obStreakList, scorelessStreak: scorelessList },
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProjection(
  c: { person: { id: number; fullName: string }; team?: { id: number }; numVal: number },
  gp: number,
  proj: number,
  milestone: number,
  label: string,
  statLabel: string,
): ProjectionCandidate {
  return {
    personId: c.person.id,
    fullName: c.person.fullName,
    teamAbbr: TEAM_ID_TO_ABBR[c.team?.id ?? 0] ?? "MLB",
    headshot: playerHeadshotUrl(c.person.id),
    currentValue: c.numVal,
    projected: Math.round(proj),
    milestone,
    progressPct: c.numVal / milestone,
    projectedPct: proj / milestone,
    gamesPlayed: gp,
    label,
    statLabel,
  };
}
