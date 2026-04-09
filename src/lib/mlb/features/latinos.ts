// Feature 2 — Latino Tracker.
//
// Pipeline:
//   1. Fetch all active players for the season → filter by birthCountry.
//   2. For the top ~50 hitters and ~30 pitchers (by career at-bats/IP to avoid
//      bench players flooding the list), fetch byDateRange stats for 7 days.
//   3. Build ranked lists: top 10 batters by OPS (min 10 AB), top 10 pitchers
//      by ERA (min 5 IP).
//   4. Detect rookies (mlbDebutDate in current season year).
//   5. Group rankings by country.
//
// Call budget: 1 allPlayers + ~80 byDateRange = ~81 calls. Rate limiter OK.

import { mlbFetch, MLB_TAGS } from "../client";
import { allPlayers, playerStatsByDateRange } from "../endpoints";
import { getCurrentSeason } from "../season";
import { playerHeadshotUrl, COUNTRIES_ES, type CountryEntry } from "../../i18n/translations";
import type { AllPlayersResponse, PlayerBioEntry, PlayerDateRangeResponse } from "../types";

const BOGOTA_TZ = "America/Bogota";

const TEAM_ID_TO_ABBR: Record<number, string> = {
  108: "LAA", 109: "ARI", 110: "BAL", 111: "BOS", 112: "CHC",
  113: "CIN", 114: "CLE", 115: "COL", 116: "DET", 117: "HOU",
  118: "KCR", 119: "LAD", 120: "WSH", 121: "NYM", 133: "OAK",
  134: "PIT", 135: "SDP", 136: "SEA", 137: "SFG", 138: "STL",
  139: "TBR", 140: "TEX", 141: "TOR", 142: "MIN", 143: "PHI",
  144: "ATL", 145: "CHW", 146: "MIA", 147: "NYY", 158: "MIL",
};

const LATIN_COUNTRIES = new Set(Object.keys(COUNTRIES_ES));

const PITCHING_POSITIONS = new Set(["P", "SP", "RP", "CL"]);

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface LatinoBatter {
  personId: number;
  fullName: string;
  teamAbbr: string;
  headshot: string;
  country: CountryEntry;
  position: string;
  isRookie: boolean;
  gamesPlayed: number;
  ab: number;
  hits: number;
  hr: number;
  rbi: number;
  sb: number;
  avg: string;
  obp: string;
  slg: string;
  ops: string;
  opsNum: number;
}

export interface LatinoPitcher {
  personId: number;
  fullName: string;
  teamAbbr: string;
  headshot: string;
  country: CountryEntry;
  position: string;
  isRookie: boolean;
  gamesPlayed: number;
  ip: string;
  era: string;
  eraNum: number;
  whip: string;
  wins: number;
  losses: number;
  so: number;
}

export interface LatinoReport {
  season: number;
  window: string; // "7", "15", "30"
  windowStart: string;
  windowEnd: string;
  batters: LatinoBatter[];
  pitchers: LatinoPitcher[];
  rookieBatters: LatinoBatter[];
  rookiePitchers: LatinoPitcher[];
  byCountry: Record<string, { batters: LatinoBatter[]; pitchers: LatinoPitcher[] }>;
  stats: { totalLatinos: number; hittersFetched: number; pitchersFetched: number };
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

function isRookie(p: PlayerBioEntry, season: number): boolean {
  if (!p.mlbDebutDate) return false;
  return p.mlbDebutDate.startsWith(String(season));
}

function abbrFor(teamId: number | undefined): string {
  return TEAM_ID_TO_ABBR[teamId ?? 0] ?? "MLB";
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

/**
 * @param options.windowDays — 7, 15, or 30. Default 7.
 * @param options.season — override season.
 * @param options.asOfDate — end date of the window.
 */
export async function buildLatinoReport(options?: {
  windowDays?: number;
  season?: number;
  asOfDate?: string;
}): Promise<LatinoReport> {
  const season = options?.season ?? getCurrentSeason();
  const windowDays = options?.windowDays ?? 7;
  const end = options?.asOfDate ?? todayBogota();
  const start = subtractDays(end, windowDays);

  // 1. All players
  const roster = await mlbFetch<AllPlayersResponse>(allPlayers(season), {
    revalidate: 86400, // roster rarely changes
    tags: [MLB_TAGS.latinos],
    label: "allPlayers",
  });

  const allLatinos = (roster.people ?? []).filter(
    (p) => p.active !== false && p.birthCountry && LATIN_COUNTRIES.has(p.birthCountry),
  );

  // Split into hitters / pitchers
  const latinHitters = allLatinos.filter((p) => !PITCHING_POSITIONS.has(p.primaryPosition?.code ?? ""));
  const latinPitchers = allLatinos.filter((p) => PITCHING_POSITIONS.has(p.primaryPosition?.code ?? ""));

  // Limit to a reasonable number to avoid >200 API calls
  const hittersToFetch = latinHitters.slice(0, 80);
  const pitchersToFetch = latinPitchers.slice(0, 50);

  // 2. Fetch byDateRange stats in parallel
  const hitterJobs = hittersToFetch.map((p) =>
    mlbFetch<PlayerDateRangeResponse>(
      playerStatsByDateRange({ personId: p.id, group: "hitting", startDate: start, endDate: end, season }),
      { revalidate: 10800, tags: [MLB_TAGS.latinos], label: `latino:hit:${p.id}` },
    ).then((resp) => ({ player: p, stat: resp.stats?.[0]?.splits?.[0]?.stat }))
      .catch(() => ({ player: p, stat: undefined as undefined })),
  );

  const pitcherJobs = pitchersToFetch.map((p) =>
    mlbFetch<PlayerDateRangeResponse>(
      playerStatsByDateRange({ personId: p.id, group: "pitching", startDate: start, endDate: end, season }),
      { revalidate: 10800, tags: [MLB_TAGS.latinos], label: `latino:pit:${p.id}` },
    ).then((resp) => ({ player: p, stat: resp.stats?.[0]?.splits?.[0]?.stat }))
      .catch(() => ({ player: p, stat: undefined as undefined })),
  );

  const [hitterResults, pitcherResults] = await Promise.all([
    Promise.all(hitterJobs),
    Promise.all(pitcherJobs),
  ]);

  // 3. Build batter list (min 10 AB)
  const batters: LatinoBatter[] = [];
  for (const { player, stat } of hitterResults) {
    if (!stat) continue;
    const ab = stat.atBats ?? 0;
    if (ab < 10) continue;
    const opsNum = parseFloat(stat.ops ?? "0") || 0;
    const country = COUNTRIES_ES[player.birthCountry!];
    if (!country) continue;

    batters.push({
      personId: player.id,
      fullName: player.fullName,
      teamAbbr: abbrFor(player.currentTeam?.id),
      headshot: playerHeadshotUrl(player.id),
      country,
      position: player.primaryPosition?.abbreviation ?? "",
      isRookie: isRookie(player, season),
      gamesPlayed: stat.gamesPlayed ?? 0,
      ab,
      hits: stat.hits ?? 0,
      hr: stat.homeRuns ?? 0,
      rbi: stat.rbi ?? 0,
      sb: stat.stolenBases ?? 0,
      avg: stat.avg ?? ".000",
      obp: stat.obp ?? ".000",
      slg: stat.slg ?? ".000",
      ops: stat.ops ?? ".000",
      opsNum,
    });
  }
  batters.sort((a, b) => b.opsNum - a.opsNum);

  // 4. Build pitcher list (min 3 IP)
  const pitchers: LatinoPitcher[] = [];
  for (const { player, stat } of pitcherResults) {
    if (!stat) continue;
    const ipStr = stat.inningsPitched ?? "0";
    const ipParts = ipStr.split(".");
    const ipNum = (Number(ipParts[0]) || 0) + (Number(ipParts[1] ?? 0)) / 3;
    if (ipNum < 3) continue;
    const eraNum = parseFloat(stat.era ?? "99") || 99;
    const country = COUNTRIES_ES[player.birthCountry!];
    if (!country) continue;

    pitchers.push({
      personId: player.id,
      fullName: player.fullName,
      teamAbbr: abbrFor(player.currentTeam?.id),
      headshot: playerHeadshotUrl(player.id),
      country,
      position: player.primaryPosition?.abbreviation ?? "",
      isRookie: isRookie(player, season),
      gamesPlayed: stat.gamesPlayed ?? 0,
      ip: ipStr,
      era: stat.era ?? "0.00",
      eraNum,
      whip: stat.whip ?? "0.00",
      wins: stat.wins ?? 0,
      losses: stat.losses ?? 0,
      so: stat.strikeouts ?? stat.strikeOuts ?? 0,
    });
  }
  pitchers.sort((a, b) => a.eraNum - b.eraNum);

  // 5. Rookies
  const rookieBatters = batters.filter((b) => b.isRookie);
  const rookiePitchers = pitchers.filter((p) => p.isRookie);

  // 6. By country
  const byCountry: Record<string, { batters: LatinoBatter[]; pitchers: LatinoPitcher[] }> = {};
  for (const entry of Object.values(COUNTRIES_ES)) {
    const cb = batters.filter((b) => b.country.code === entry.code).slice(0, 10);
    const cp = pitchers.filter((p) => p.country.code === entry.code).slice(0, 5);
    if (cb.length + cp.length > 0) {
      byCountry[entry.code] = { batters: cb, pitchers: cp };
    }
  }

  return {
    season,
    window: String(windowDays),
    windowStart: start,
    windowEnd: end,
    batters: batters.slice(0, 10),
    pitchers: pitchers.slice(0, 10),
    rookieBatters: rookieBatters.slice(0, 10),
    rookiePitchers: rookiePitchers.slice(0, 5),
    byCountry,
    stats: {
      totalLatinos: allLatinos.length,
      hittersFetched: hittersToFetch.length,
      pitchersFetched: pitchersToFetch.length,
    },
    generatedAt: new Date().toISOString(),
  };
}
