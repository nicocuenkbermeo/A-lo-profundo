// Feature 1 — Momento del Día.
//
// Pipeline:
//   1. Compute "yesterday" in Bogotá.
//   2. Get the schedule for that date (single call).
//   3. Keep FINAL games only. Fetch live feeds in parallel.
//   4. For each game, walk allPlays with a triviality filter and pick the
//      most dramatic play (primary signal: about.captivatingIndex;
//      fallback: "WPA-ish" heuristic based on run change in late innings).
//   5. Pick the single best play across all games.
//
// Triviality filter: a play qualifies only if
//     isScoringPlay === true
//   OR
//     inning >= 7 AND |homeScore - awayScore| <= 2
// This matches the PROMPT.md rule and keeps wild-pitch-no-score type plays
// out of the running even if MLB rates them highly.

import { mlbFetch, MLB_TAGS } from "../client";
import { scheduleByDate, liveFeed } from "../endpoints";
import type {
  ScheduleResponse,
  LiveFeedResponse,
  Play,
} from "../types";
import { translatePlayContext, playerHeadshotUrl } from "../../i18n/translations";

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

export type MomentScoreSource = "captivatingIndex" | "wpaHeuristic";

export interface MomentOfDay {
  date: string; // YYYY-MM-DD (Bogotá, "yesterday")
  gameId: string;
  gameLabel: string; // "NYY @ BOS"
  homeAbbr: string;
  awayAbbr: string;
  inning: number;
  halfInning: "top" | "bottom" | string;
  contextEs: string; // "Cierre del 9°, 2 outs, corredores en las esquinas"
  descriptionEn: string; // raw play description from MLB
  batterId: number | null;
  batterName: string;
  batterHeadshot: string;
  pitcherId: number | null;
  pitcherName: string;
  pitcherHeadshot: string;
  scoreBefore: { home: number; away: number };
  scoreAfter: { home: number; away: number };
  score: number; // the numeric score we ranked on
  scoreSource: MomentScoreSource;
  generatedAt: string;
}

export interface MomentOfDayReport {
  date: string;
  moment: MomentOfDay | null;
  stats: {
    gamesAnalyzed: number;
    gamesSkippedNonFinal: number;
    playsConsidered: number;
    playsDiscardedTrivial: number;
  };
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function todayBogota(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function yesterdayBogota(): string {
  const t = todayBogota();
  const [y, m, d] = t.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Triviality filter + scoring
// ---------------------------------------------------------------------------

function isRelevantPlay(p: Play): boolean {
  if (p.about.isScoringPlay) return true;
  const inning = p.about.inning ?? 0;
  const hs = p.about.homeScore ?? 0;
  const as = p.about.awayScore ?? 0;
  return inning >= 7 && Math.abs(hs - as) <= 2;
}

interface ScoredPlay {
  play: Play;
  score: number;
  source: MomentScoreSource;
}

/**
 * Score every play in a game and return the best qualifying one. Uses
 * captivatingIndex as the primary signal; if no play in the game has a
 * non-zero captivatingIndex, falls back to a WPA-ish heuristic.
 */
function bestPlayInGame(plays: Play[]): {
  best: ScoredPlay | null;
  considered: number;
  discarded: number;
} {
  let considered = 0;
  let discarded = 0;

  const relevant: Play[] = [];
  for (const p of plays) {
    if (!isRelevantPlay(p)) {
      discarded++;
      continue;
    }
    considered++;
    relevant.push(p);
  }

  if (relevant.length === 0) return { best: null, considered, discarded };

  // Primary: captivatingIndex
  const captivatingMax = relevant.reduce(
    (acc, p) => Math.max(acc, p.about.captivatingIndex ?? 0),
    0,
  );

  if (captivatingMax > 0) {
    const bestPlay = relevant.reduce((acc, p) =>
      (p.about.captivatingIndex ?? 0) > (acc.about.captivatingIndex ?? 0) ? p : acc,
    );
    return {
      best: {
        play: bestPlay,
        score: bestPlay.about.captivatingIndex ?? 0,
        source: "captivatingIndex",
      },
      considered,
      discarded,
    };
  }

  // Fallback: WPA-ish. Score = runChange * lateInningWeight.
  // Uses result.home/awayScore (post-play) vs about.home/awayScore (pre-play).
  let bestWpa: ScoredPlay | null = null;
  for (const p of plays) {
    if (!isRelevantPlay(p)) continue;
    const preHome = p.about.homeScore ?? 0;
    const preAway = p.about.awayScore ?? 0;
    const postHome = p.result.homeScore ?? preHome;
    const postAway = p.result.awayScore ?? preAway;
    const runChange = Math.abs((postHome - postAway) - (preHome - preAway));
    const inning = p.about.inning ?? 1;
    const lateWeight = 1 + Math.max(0, inning - 6) * 0.25; // 7th=1.25, 8th=1.5, 9th=1.75...
    const score = runChange * lateWeight;
    if (score > 0 && (!bestWpa || score > bestWpa.score)) {
      bestWpa = { play: p, score, source: "wpaHeuristic" };
    }
  }

  return { best: bestWpa, considered, discarded };
}

// ---------------------------------------------------------------------------
// Runners / outs resolver — best-effort
// ---------------------------------------------------------------------------

// For "pre-play state" we look at the previous play's post state. Feed/live
// plays have `matchup.postOnX` describing runners at the END of the play.
function preStateFor(plays: Play[], idx: number): {
  runners: { first?: unknown; second?: unknown; third?: unknown };
  outs: number;
} {
  if (idx === 0) return { runners: {}, outs: 0 };
  const prev = plays[idx - 1];
  // If the previous play ended the inning, the inning is reset.
  const sameInning =
    prev.about.inning === plays[idx].about.inning &&
    prev.about.halfInning === plays[idx].about.halfInning;
  if (!sameInning) return { runners: {}, outs: 0 };
  return {
    runners: {
      first: prev.matchup?.postOnFirst,
      second: prev.matchup?.postOnSecond,
      third: prev.matchup?.postOnThird,
    },
    outs: prev.count?.outs ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

/**
 * @param date — YYYY-MM-DD to analyze. Defaults to yesterday (Bogotá).
 */
export async function buildMomentOfDay(date?: string): Promise<MomentOfDayReport> {
  date = date ?? yesterdayBogota();

  // 1. Schedule
  const schedule = await mlbFetch<ScheduleResponse>(scheduleByDate(date), {
    revalidate: 6 * 3600,
    tags: [MLB_TAGS.schedule, MLB_TAGS.momentOfDay],
    label: `schedule:${date}`,
  });

  const games = schedule.dates?.[0]?.games ?? [];
  const finalGames = games.filter((g) => g.status?.abstractGameState === "Final");
  const skippedNonFinal = games.length - finalGames.length;

  // 2. Live feeds in parallel
  const feeds = await Promise.allSettled(
    finalGames.map((g) =>
      mlbFetch<LiveFeedResponse>(liveFeed(g.gamePk), {
        revalidate: 6 * 3600,
        tags: [MLB_TAGS.liveFeed, MLB_TAGS.momentOfDay],
        label: `liveFeed:${g.gamePk}`,
      }),
    ),
  );

  // 3. Pick best play per game, and overall best
  let bestOverall: { feed: LiveFeedResponse; play: Play; idx: number; score: number; source: MomentScoreSource } | null = null;
  let playsConsidered = 0;
  let playsDiscardedTrivial = 0;
  let analyzed = 0;

  for (const r of feeds) {
    if (r.status !== "fulfilled") continue;
    const feed = r.value;
    const plays = feed.liveData?.plays?.allPlays ?? [];
    if (plays.length === 0) continue;
    analyzed++;

    const { best, considered, discarded } = bestPlayInGame(plays);
    playsConsidered += considered;
    playsDiscardedTrivial += discarded;
    if (!best) continue;

    const idx = plays.indexOf(best.play);
    if (!bestOverall || best.score > bestOverall.score) {
      bestOverall = { feed, play: best.play, idx, score: best.score, source: best.source };
    }
  }

  if (!bestOverall) {
    return {
      date,
      moment: null,
      stats: {
        gamesAnalyzed: analyzed,
        gamesSkippedNonFinal: skippedNonFinal,
        playsConsidered,
        playsDiscardedTrivial,
      },
    };
  }

  // 4. Build the display payload
  const { feed, play, idx, score, source } = bestOverall;
  const allPlays = feed.liveData?.plays?.allPlays ?? [];
  const pre = preStateFor(allPlays, idx);

  const homeTeam = feed.gameData.teams.home;
  const awayTeam = feed.gameData.teams.away;
  const homeAbbr = TEAM_ID_TO_ABBR[homeTeam.id] ?? "MLB";
  const awayAbbr = TEAM_ID_TO_ABBR[awayTeam.id] ?? "MLB";

  const contextEs = translatePlayContext({
    halfInning: play.about.halfInning,
    inning: play.about.inning,
    outs: pre.outs,
    runners: pre.runners,
  });

  // MLB feed convention:
  //   play.about.homeScore/awayScore → marcador AL INICIO del at-bat
  //   play.result.homeScore/awayScore → marcador AL FINAL del at-bat
  const scoreBefore = {
    home: play.about.homeScore ?? 0,
    away: play.about.awayScore ?? 0,
  };
  const scoreAfter = {
    home: play.result.homeScore ?? play.about.homeScore ?? 0,
    away: play.result.awayScore ?? play.about.awayScore ?? 0,
  };

  const batterId = play.matchup.batter?.id ?? null;
  const pitcherId = play.matchup.pitcher?.id ?? null;

  const moment: MomentOfDay = {
    date,
    gameId: String(feed.gameData.game.pk),
    gameLabel: `${awayAbbr} @ ${homeAbbr}`,
    homeAbbr,
    awayAbbr,
    inning: play.about.inning,
    halfInning: play.about.halfInning,
    contextEs,
    descriptionEn: play.result.description,
    batterId,
    batterName: play.matchup.batter?.fullName ?? "",
    batterHeadshot: playerHeadshotUrl(batterId),
    pitcherId,
    pitcherName: play.matchup.pitcher?.fullName ?? "",
    pitcherHeadshot: playerHeadshotUrl(pitcherId),
    scoreBefore,
    scoreAfter,
    score,
    scoreSource: source,
    generatedAt: new Date().toISOString(),
  };

  return {
    date,
    moment,
    stats: {
      gamesAnalyzed: analyzed,
      gamesSkippedNonFinal: skippedNonFinal,
      playsConsidered,
      playsDiscardedTrivial,
    },
  };
}
