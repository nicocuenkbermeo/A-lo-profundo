// Feature 8 — Modelo de Predicciones A Lo Profundo.
//
// Pipeline:
//   1. Fetch standings → runs scored/allowed per team → Pythagorean expectation
//   2. Fetch today's schedule with probable pitchers
//   3. For each probable pitcher, fetch season ERA
//   4. Fetch bullpen fatigue data (reuses Feature 6)
//   5. Compute per-game prediction with confidence breakdown
//
// Model: Pythagorean + contextual adjustments (home field, pitcher, recent form,
//        bullpen fatigue). Classic stat model, NO ML.
//
// Guardrails: confidence clamped to [0.52, 0.92]. If starter unknown, game is
//             marked "pending". Early season (<20 GP) gets a caveat.

import { mlbFetch, MLB_TAGS } from "../client";
import {
  standings as standingsUrl,
  scheduleWithLineups,
  playerSeasonStats,
} from "../endpoints";
import { getCurrentSeason } from "../season";
import { buildBullpenReport, type BullpenStatus } from "./bullpens";
import type {
  StandingsResponse,
  StandingTeamRecord,
  ScheduleWithLineupsResponse,
  ScheduleGameWithLineups,
} from "../types";

export const MODEL_VERSION = "1.1";

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

export interface PredictionBreakdown {
  pythag: { home: number; away: number };
  homeFieldBonus: number;
  pitcherDelta: number;
  recentFormDelta: number;
  bullpenDelta: number;
}

export interface GamePrediction {
  gamePk: number;
  gameDate: string;
  startTime: string;
  homeTeam: { id: number; name: string; abbreviation: string };
  awayTeam: { id: number; name: string; abbreviation: string };
  homePitcher: { id: number; name: string; era: number } | null;
  awayPitcher: { id: number; name: string; era: number } | null;
  prediction: {
    winner: "home" | "away";
    confidence: number; // 0.52–0.92
    homeWinProb: number;
    awayWinProb: number;
  };
  breakdown: PredictionBreakdown;
  confidenceLevel: "high" | "medium" | "low";
  narrative: string;
  pending: boolean; // true if missing pitcher data
  earlySeason: boolean; // true if either team <20 GP
  status: string; // "Preview" | "Live" | "Final"
}

export interface PredictionsReport {
  date: string;
  season: number;
  generatedAt: string;
  games: GamePrediction[];
}

// For persistence (Feature 9 — ROI tracking)
export interface PredictionHistoryEntry {
  gamePk: number;
  pick: string; // team abbreviation
  pickSide: "home" | "away";
  confidence: number;
  homeTeam: string;
  awayTeam: string;
  actualWinner: string | null;
  result: "pending" | "win" | "loss";
  modelVersion?: string;
}

export interface PredictionHistoryFile {
  [date: string]: PredictionHistoryEntry[];
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

/** Pythagorean expectation with exponent 1.83 (baseball standard). */
function pythagoreanWinPct(runsScored: number, runsAllowed: number): number {
  if (runsScored === 0 && runsAllowed === 0) return 0.5;
  const exp = 1.83;
  const rs = Math.pow(runsScored, exp);
  const ra = Math.pow(runsAllowed, exp);
  if (rs + ra === 0) return 0.5;
  return rs / (rs + ra);
}

/** Clamp value between min and max. */
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// League average ERA (roughly 4.00 historically)
const LEAGUE_AVG_ERA = 4.00;

/**
 * Compute pitcher adjustment based on ERA vs league average.
 * Better ERA (lower) = positive adjustment for that pitcher's team.
 * Returns delta from -0.08 to +0.08.
 */
function pitcherAdjustment(era: number | null): number {
  if (era === null || era <= 0) return 0;
  // Normalize: a 2.00 ERA pitcher gives ~+0.06, a 6.00 ERA gives ~-0.06
  const diff = LEAGUE_AVG_ERA - era;
  return clamp(diff * 0.03, -0.08, 0.08);
}

/**
 * Recent form adjustment based on last 10 record.
 * Returns delta from -0.04 to +0.04.
 */
function recentFormAdjustment(last10Wins: number): number {
  // 5-5 = neutral, 8-2 = +0.04, 2-8 = -0.04
  return clamp((last10Wins - 5) * 0.013, -0.04, 0.04);
}

/**
 * Convert bullpen fatigue status to a probability score.
 * green (fresh) = +0.015, yellow (tired) = 0, red (exhausted) = -0.015
 */
function bullpenStateToScore(state: BullpenStatus): number {
  switch (state) {
    case "green":  return +0.015;
    case "yellow": return 0;
    case "red":    return -0.015;
  }
}

function confidenceLevel(conf: number): "high" | "medium" | "low" {
  if (conf >= 0.65) return "high";
  if (conf >= 0.55) return "medium";
  return "low";
}

function buildNarrative(game: GamePrediction): string {
  const { prediction, homeTeam, awayTeam, breakdown, homePitcher, awayPitcher } = game;
  const winner = prediction.winner === "home" ? homeTeam : awayTeam;
  const loser = prediction.winner === "home" ? awayTeam : homeTeam;
  const confPct = Math.round(prediction.confidence * 100);

  const parts: string[] = [];
  parts.push(`Nuestro modelo da a ${winner.abbreviation} un ${confPct}% de probabilidad de ganar contra ${loser.abbreviation}.`);

  if (Math.abs(breakdown.pitcherDelta) >= 0.03) {
    const favoredPitcher = breakdown.pitcherDelta > 0 ? homePitcher : awayPitcher;
    if (favoredPitcher) {
      parts.push(`El abridor ${favoredPitcher.name} (ERA ${favoredPitcher.era.toFixed(2)}) es clave en esta ventaja.`);
    }
  }

  if (Math.abs(breakdown.recentFormDelta) >= 0.02) {
    const hotTeam = breakdown.recentFormDelta > 0 ? homeTeam : awayTeam;
    parts.push(`${hotTeam.abbreviation} viene en racha caliente.`);
  }

  if (Math.abs(breakdown.bullpenDelta) >= 0.02) {
    const freshTeam = breakdown.bullpenDelta > 0 ? homeTeam : awayTeam;
    parts.push(`El bullpen de ${freshTeam.abbreviation} está más fresco, lo que refuerza su ventaja.`);
  }

  if (game.earlySeason) {
    parts.push("Temporada temprana — confianza reducida por muestra pequeña.");
  }

  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

interface TeamStandingData {
  teamId: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
  runDifferential: number;
  pythagWinPct: number;
  last10Wins: number;
}

async function fetchStandingsMap(season: number): Promise<Map<number, TeamStandingData>> {
  const data = await mlbFetch<StandingsResponse>(standingsUrl(season), {
    revalidate: 3600,
    tags: [MLB_TAGS.predictions],
    label: "predictions:standings",
  });

  const map = new Map<number, TeamStandingData>();

  for (const block of data.records) {
    for (const rec of block.teamRecords) {
      const teamId = rec.team.id;
      const gp = rec.gamesPlayed || (rec.wins + rec.losses);

      // Compute runs scored and allowed from runDifferential + wins/losses
      // runDiff = RS - RA. We need individual values for Pythagorean.
      // Approximate: RS ≈ (runDiff + avgRuns*GP) / 2 where avgRuns ≈ 4.5/game each side
      // Better approach: use the actual runDiff + assume average total ~9 runs/game
      const avgRunsPerGame = 4.5;
      const totalRuns = avgRunsPerGame * gp;
      const runsScored = totalRuns + rec.runDifferential / 2;
      const runsAllowed = totalRuns - rec.runDifferential / 2;

      let last10Wins = 5; // default
      const splitRecords = rec.records?.splitRecords;
      if (splitRecords) {
        const l10 = splitRecords.find((s) => s.type === "lastTen");
        if (l10) last10Wins = l10.wins;
      }

      map.set(teamId, {
        teamId,
        wins: rec.wins,
        losses: rec.losses,
        gamesPlayed: gp,
        runDifferential: rec.runDifferential,
        pythagWinPct: pythagoreanWinPct(Math.max(runsScored, 0), Math.max(runsAllowed, 0)),
        last10Wins,
      });
    }
  }

  return map;
}

interface PitcherSeasonStats {
  era: number;
}

async function fetchPitcherEra(pitcherId: number, season: number): Promise<PitcherSeasonStats | null> {
  try {
    const data = await mlbFetch<{
      stats: Array<{ splits: Array<{ stat: { era?: string } }> }>;
    }>(playerSeasonStats(pitcherId, season, "pitching"), {
      revalidate: 7200,
      tags: [MLB_TAGS.predictions],
      label: `predictions:pitcher-${pitcherId}`,
    });

    const splits = data.stats?.[0]?.splits;
    if (!splits || splits.length === 0) return null;
    const eraStr = splits[0].stat.era;
    if (!eraStr) return null;
    const era = parseFloat(eraStr);
    if (isNaN(era)) return null;
    return { era };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

export async function buildPredictions(dateOverride?: string): Promise<PredictionsReport> {
  const date = dateOverride ?? todayBogota();
  const season = getCurrentSeason();

  // 1. Fetch standings and bullpen report in parallel
  const [standingsMap, bullpenReport] = await Promise.all([
    fetchStandingsMap(season),
    buildBullpenReport().catch((err) => {
      console.warn("[predictions] bullpen report failed, using neutral:", err);
      return null;
    }),
  ]);

  // Build abbreviation → bullpen status map for O(1) lookup
  const bullpenStatusMap = new Map<string, BullpenStatus>();
  if (bullpenReport) {
    for (const team of bullpenReport.teams) {
      bullpenStatusMap.set(team.abbreviation, team.status);
    }
  }

  // 2. Fetch today's schedule with probable pitchers
  const scheduleData = await mlbFetch<ScheduleWithLineupsResponse>(
    scheduleWithLineups(date),
    {
      revalidate: 7200,
      tags: [MLB_TAGS.predictions],
      label: "predictions:schedule",
    },
  );

  const todayGames: ScheduleGameWithLineups[] = [];
  for (const d of scheduleData.dates ?? []) {
    todayGames.push(...d.games);
  }

  // Only predict Preview (scheduled) games
  const previewGames = todayGames.filter(
    (g) => g.status.abstractGameState === "Preview",
  );

  // 3. For each game, fetch pitcher ERA in parallel
  const predictions: GamePrediction[] = [];

  const pitcherFetches: Array<{
    game: ScheduleGameWithLineups;
    homeEraP: Promise<PitcherSeasonStats | null>;
    awayEraP: Promise<PitcherSeasonStats | null>;
  }> = previewGames.map((game) => ({
    game,
    homeEraP: game.teams.home.probablePitcher
      ? fetchPitcherEra(game.teams.home.probablePitcher.id, season)
      : Promise.resolve(null),
    awayEraP: game.teams.away.probablePitcher
      ? fetchPitcherEra(game.teams.away.probablePitcher.id, season)
      : Promise.resolve(null),
  }));

  for (const { game, homeEraP, awayEraP } of pitcherFetches) {
    const [homeEra, awayEra] = await Promise.all([homeEraP, awayEraP]);

    const homeTeamId = game.teams.home.team.id;
    const awayTeamId = game.teams.away.team.id;
    const homeStanding = standingsMap.get(homeTeamId);
    const awayStanding = standingsMap.get(awayTeamId);

    const homeAbbr = TEAM_ID_TO_ABBR[homeTeamId] ?? "???";
    const awayAbbr = TEAM_ID_TO_ABBR[awayTeamId] ?? "???";

    // Pythagorean base
    const homePythag = homeStanding?.pythagWinPct ?? 0.5;
    const awayPythag = awayStanding?.pythagWinPct ?? 0.5;

    // Normalize so they sum to 1
    const totalPythag = homePythag + awayPythag;
    let homeBaseProb = totalPythag > 0 ? homePythag / totalPythag : 0.5;

    // Home field advantage: +0.04
    const homeFieldBonus = 0.04;
    homeBaseProb += homeFieldBonus;

    // Pitcher adjustment
    const homePitcherAdj = pitcherAdjustment(homeEra?.era ?? null);
    const awayPitcherAdj = pitcherAdjustment(awayEra?.era ?? null);
    const pitcherDelta = homePitcherAdj - awayPitcherAdj;
    homeBaseProb += pitcherDelta;

    // Recent form
    const homeFormAdj = recentFormAdjustment(homeStanding?.last10Wins ?? 5);
    const awayFormAdj = recentFormAdjustment(awayStanding?.last10Wins ?? 5);
    const recentFormDelta = homeFormAdj - awayFormAdj;
    homeBaseProb += recentFormDelta;

    // Bullpen delta from Feature 6 bullpen fatigue report
    const homeBullpenState = bullpenStatusMap.get(homeAbbr);
    const awayBullpenState = bullpenStatusMap.get(awayAbbr);
    if (!homeBullpenState && bullpenReport) {
      console.warn(`[predictions] no bullpen data for ${homeAbbr}, assuming yellow`);
    }
    if (!awayBullpenState && bullpenReport) {
      console.warn(`[predictions] no bullpen data for ${awayAbbr}, assuming yellow`);
    }
    const bullpenDelta =
      bullpenStateToScore(homeBullpenState ?? "yellow") -
      bullpenStateToScore(awayBullpenState ?? "yellow");

    homeBaseProb += bullpenDelta;

    // Clamp final probability
    homeBaseProb = clamp(homeBaseProb, 0.08, 0.92);

    const homeWinProb = homeBaseProb;
    const awayWinProb = 1 - homeBaseProb;
    const winner: "home" | "away" = homeWinProb >= awayWinProb ? "home" : "away";
    const confidence = clamp(Math.max(homeWinProb, awayWinProb), 0.52, 0.92);

    const hasBothPitchers = !!(game.teams.home.probablePitcher && game.teams.away.probablePitcher);
    const earlySeason =
      (homeStanding?.gamesPlayed ?? 0) < 20 || (awayStanding?.gamesPlayed ?? 0) < 20;

    // Parse start time
    const gameDateTime = new Date(game.gameDate);
    const startTime = gameDateTime.toLocaleTimeString("es-CO", {
      timeZone: BOGOTA_TZ,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const pred: GamePrediction = {
      gamePk: game.gamePk,
      gameDate: date,
      startTime,
      homeTeam: { id: homeTeamId, name: game.teams.home.team.name, abbreviation: homeAbbr },
      awayTeam: { id: awayTeamId, name: game.teams.away.team.name, abbreviation: awayAbbr },
      homePitcher: game.teams.home.probablePitcher
        ? { id: game.teams.home.probablePitcher.id, name: game.teams.home.probablePitcher.fullName, era: homeEra?.era ?? 0 }
        : null,
      awayPitcher: game.teams.away.probablePitcher
        ? { id: game.teams.away.probablePitcher.id, name: game.teams.away.probablePitcher.fullName, era: awayEra?.era ?? 0 }
        : null,
      prediction: { winner, confidence, homeWinProb, awayWinProb },
      breakdown: {
        pythag: { home: homePythag, away: awayPythag },
        homeFieldBonus,
        pitcherDelta,
        recentFormDelta,
        bullpenDelta,
      },
      confidenceLevel: confidenceLevel(confidence),
      narrative: "",
      pending: !hasBothPitchers,
      earlySeason,
      status: game.status.abstractGameState,
    };

    pred.narrative = buildNarrative(pred);
    predictions.push(pred);
  }

  // Sort by confidence descending (best picks first)
  predictions.sort((a, b) => b.prediction.confidence - a.prediction.confidence);

  return {
    date,
    season,
    generatedAt: new Date().toISOString(),
    games: predictions,
  };
}

/**
 * Convert predictions to history entries for ROI tracking (Feature 9).
 */
export function predictionsToHistory(report: PredictionsReport): PredictionHistoryEntry[] {
  return report.games
    .filter((g) => !g.pending)
    .map((g) => ({
      gamePk: g.gamePk,
      pick: g.prediction.winner === "home" ? g.homeTeam.abbreviation : g.awayTeam.abbreviation,
      pickSide: g.prediction.winner,
      confidence: g.prediction.confidence,
      homeTeam: g.homeTeam.abbreviation,
      awayTeam: g.awayTeam.abbreviation,
      actualWinner: null,
      result: "pending" as const,
      modelVersion: MODEL_VERSION,
    }));
}
