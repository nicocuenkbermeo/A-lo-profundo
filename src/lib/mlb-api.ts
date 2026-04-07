// Real MLB Stats API integration
// Free, no API key required: https://statsapi.mlb.com
//
// All times are converted to Bogotá, Colombia timezone (America/Bogota, UTC-5).

import type { Game, GameStatus, InningHalf } from "@/types/game";

const MLB_API = "https://statsapi.mlb.com/api/v1";

// Mapping MLB API team abbreviations -> our local logo abbreviations
const TEAM_ABBR_MAP: Record<string, string> = {
  AZ: "ARI", ARI: "ARI",
  ATL: "ATL",
  BAL: "BAL",
  BOS: "BOS",
  CHC: "CHC",
  CWS: "CHW", CHW: "CHW",
  CIN: "CIN",
  CLE: "CLE",
  COL: "COL",
  DET: "DET",
  HOU: "HOU",
  KC: "KCR", KCR: "KCR",
  LAA: "LAA",
  LAD: "LAD",
  MIA: "MIA",
  MIL: "MIL",
  MIN: "MIN",
  NYM: "NYM",
  NYY: "NYY",
  OAK: "OAK", ATH: "OAK",
  PHI: "PHI",
  PIT: "PIT",
  SD: "SDP", SDP: "SDP",
  SEA: "SEA",
  SF: "SFG", SFG: "SFG",
  STL: "STL",
  TB: "TBR", TBR: "TBR",
  TEX: "TEX",
  TOR: "TOR",
  WSH: "WSH", WAS: "WSH",
};

// Team primary colors keyed by our local abbr
const TEAM_COLORS: Record<string, string> = {
  ARI: "#A71930", ATL: "#CE1141", BAL: "#DF4601", BOS: "#BD3039",
  CHC: "#0E3386", CHW: "#27251F", CIN: "#C6011F", CLE: "#00385D",
  COL: "#33006F", DET: "#0C2340", HOU: "#002D62", KCR: "#004687",
  LAA: "#BA0021", LAD: "#005A9C", MIA: "#00A3E0", MIL: "#12284B",
  MIN: "#002B5C", NYM: "#002D72", NYY: "#003087", OAK: "#003831",
  PHI: "#E81828", PIT: "#FDB827", SDP: "#2F241D", SEA: "#0C2C56",
  SFG: "#FD5A1E", STL: "#C41E3A", TBR: "#092C5C", TEX: "#003278",
  TOR: "#134A8E", WSH: "#AB0003",
};

function normalizeAbbr(abbr: string): string {
  return TEAM_ABBR_MAP[abbr?.toUpperCase()] ?? abbr?.toUpperCase() ?? "MLB";
}

// Convert UTC ISO timestamp to a human-readable Bogotá time string (e.g. "7:05 PM")
function toBogotaTime(isoUtc: string): string {
  try {
    const d = new Date(isoUtc);
    return d.toLocaleTimeString("es-CO", {
      timeZone: "America/Bogota",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();
  } catch {
    return "";
  }
}

// Get the current date in Bogotá timezone in YYYY-MM-DD format
export function todayInBogota(): string {
  const now = new Date();
  const bogota = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const y = bogota.getFullYear();
  const m = String(bogota.getMonth() + 1).padStart(2, "0");
  const d = String(bogota.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface MlbApiTeam {
  team: { id: number; name: string; abbreviation?: string };
  score?: number;
}

interface MlbApiGame {
  gamePk: number;
  gameDate: string;
  status: { abstractGameState: string; detailedState: string; statusCode: string };
  teams: { home: MlbApiTeam; away: MlbApiTeam };
  venue: { name: string };
  linescore?: {
    currentInning?: number;
    currentInningOrdinal?: string;
    inningHalf?: string;
    outs?: number;
  };
}

// Map MLB API status -> our local GameStatus
function mapStatus(mlbStatus: string): GameStatus {
  const s = mlbStatus.toLowerCase();
  if (s === "live") return "LIVE";
  if (s === "final") return "FINAL";
  if (s === "preview") return "SCHEDULED";
  return "SCHEDULED";
}

// MLB API team abbreviations don't always include the canonical short code,
// so we look them up by team id when needed.
const TEAM_ID_TO_ABBR: Record<number, string> = {
  108: "LAA", 109: "ARI", 110: "BAL", 111: "BOS", 112: "CHC",
  113: "CIN", 114: "CLE", 115: "COL", 116: "DET", 117: "HOU",
  118: "KCR", 119: "LAD", 120: "WSH", 121: "NYM", 133: "OAK",
  134: "PIT", 135: "SDP", 136: "SEA", 137: "SFG", 138: "STL",
  139: "TBR", 140: "TEX", 141: "TOR", 142: "MIN", 143: "PHI",
  144: "ATL", 145: "CHW", 146: "MIA", 147: "NYY", 158: "MIL",
};

function buildGame(g: MlbApiGame): Game {
  const homeAbbr = TEAM_ID_TO_ABBR[g.teams.home.team.id]
    ?? normalizeAbbr(g.teams.home.team.abbreviation ?? "");
  const awayAbbr = TEAM_ID_TO_ABBR[g.teams.away.team.id]
    ?? normalizeAbbr(g.teams.away.team.abbreviation ?? "");

  const inningHalfRaw = g.linescore?.inningHalf;
  let inningHalf: InningHalf | null = null;
  if (inningHalfRaw === "Top") inningHalf = "TOP";
  else if (inningHalfRaw === "Bottom") inningHalf = "BOTTOM";

  return {
    id: String(g.gamePk),
    externalId: String(g.gamePk),
    date: g.gameDate,
    status: mapStatus(g.status.abstractGameState),
    homeScore: g.teams.home.score ?? 0,
    awayScore: g.teams.away.score ?? 0,
    inning: g.linescore?.currentInning ?? null,
    inningHalf,
    outs: g.linescore?.outs ?? 0,
    startTime: toBogotaTime(g.gameDate),
    venue: g.venue.name,
    innings: [],
    homeTeam: {
      id: String(g.teams.home.team.id),
      name: g.teams.home.team.name.replace(/^.*?\s/, ""), // strip city for short name
      abbreviation: homeAbbr,
      city: g.teams.home.team.name.split(" ").slice(0, -1).join(" "),
      logoUrl: `/logos/${homeAbbr}.png`,
      primaryColor: TEAM_COLORS[homeAbbr] ?? "#0D2240",
      secondaryColor: "",
    },
    awayTeam: {
      id: String(g.teams.away.team.id),
      name: g.teams.away.team.name.replace(/^.*?\s/, ""),
      abbreviation: awayAbbr,
      city: g.teams.away.team.name.split(" ").slice(0, -1).join(" "),
      logoUrl: `/logos/${awayAbbr}.png`,
      primaryColor: TEAM_COLORS[awayAbbr] ?? "#0D2240",
      secondaryColor: "",
    },
  };
}

/**
 * Fetch MLB games for a given date (YYYY-MM-DD).
 * Defaults to today in Bogotá timezone.
 * Cached for 30 seconds (live data).
 */
export async function fetchMlbGames(date?: string): Promise<Game[]> {
  const d = date ?? todayInBogota();
  const url = `${MLB_API}/schedule?sportId=1&date=${d}&hydrate=linescore,team,venue`;

  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`MLB API error: ${res.status}`);
    const json = await res.json();
    const games: MlbApiGame[] = json.dates?.[0]?.games ?? [];
    return games.map(buildGame);
  } catch (err) {
    console.error("[mlb-api] Failed to fetch games:", err);
    return [];
  }
}

// Reverse map: our abbreviation -> MLB API team id
export const ABBR_TO_TEAM_ID: Record<string, number> = Object.fromEntries(
  Object.entries(TEAM_ID_TO_ABBR).map(([id, abbr]) => [abbr, Number(id)])
);

export function teamIdFromAbbr(abbr: string): number | null {
  return ABBR_TO_TEAM_ID[abbr.toUpperCase()] ?? null;
}

// Pretty team metadata for the team header pages
export const TEAM_META: Record<string, { name: string; city: string; league: "AL" | "NL"; division: "EAST" | "CENTRAL" | "WEST" }> = {
  ARI: { name: "Diamondbacks", city: "Arizona", league: "NL", division: "WEST" },
  ATL: { name: "Braves", city: "Atlanta", league: "NL", division: "EAST" },
  BAL: { name: "Orioles", city: "Baltimore", league: "AL", division: "EAST" },
  BOS: { name: "Red Sox", city: "Boston", league: "AL", division: "EAST" },
  CHC: { name: "Cubs", city: "Chicago", league: "NL", division: "CENTRAL" },
  CHW: { name: "White Sox", city: "Chicago", league: "AL", division: "CENTRAL" },
  CIN: { name: "Reds", city: "Cincinnati", league: "NL", division: "CENTRAL" },
  CLE: { name: "Guardians", city: "Cleveland", league: "AL", division: "CENTRAL" },
  COL: { name: "Rockies", city: "Colorado", league: "NL", division: "WEST" },
  DET: { name: "Tigers", city: "Detroit", league: "AL", division: "CENTRAL" },
  HOU: { name: "Astros", city: "Houston", league: "AL", division: "WEST" },
  KCR: { name: "Royals", city: "Kansas City", league: "AL", division: "CENTRAL" },
  LAA: { name: "Angels", city: "Los Angeles", league: "AL", division: "WEST" },
  LAD: { name: "Dodgers", city: "Los Angeles", league: "NL", division: "WEST" },
  MIA: { name: "Marlins", city: "Miami", league: "NL", division: "EAST" },
  MIL: { name: "Brewers", city: "Milwaukee", league: "NL", division: "CENTRAL" },
  MIN: { name: "Twins", city: "Minnesota", league: "AL", division: "CENTRAL" },
  NYM: { name: "Mets", city: "New York", league: "NL", division: "EAST" },
  NYY: { name: "Yankees", city: "New York", league: "AL", division: "EAST" },
  OAK: { name: "Athletics", city: "Oakland", league: "AL", division: "WEST" },
  PHI: { name: "Phillies", city: "Philadelphia", league: "NL", division: "EAST" },
  PIT: { name: "Pirates", city: "Pittsburgh", league: "NL", division: "CENTRAL" },
  SDP: { name: "Padres", city: "San Diego", league: "NL", division: "WEST" },
  SEA: { name: "Mariners", city: "Seattle", league: "AL", division: "WEST" },
  SFG: { name: "Giants", city: "San Francisco", league: "NL", division: "WEST" },
  STL: { name: "Cardinals", city: "St. Louis", league: "NL", division: "CENTRAL" },
  TBR: { name: "Rays", city: "Tampa Bay", league: "AL", division: "EAST" },
  TEX: { name: "Rangers", city: "Texas", league: "AL", division: "WEST" },
  TOR: { name: "Blue Jays", city: "Toronto", league: "AL", division: "EAST" },
  WSH: { name: "Nationals", city: "Washington", league: "NL", division: "EAST" },
};

/**
 * Fetch a team's schedule for a date range (defaults: last 30 days through next 7 days).
 * Returns games sorted newest first.
 */
export async function fetchTeamSchedule(teamId: number, daysBack = 30, daysForward = 7): Promise<Game[]> {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - daysBack);
  const end = new Date(today);
  end.setDate(today.getDate() + daysForward);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const url = `${MLB_API}/schedule?sportId=1&teamId=${teamId}&startDate=${fmt(start)}&endDate=${fmt(end)}&hydrate=linescore,team,venue`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`MLB API error: ${res.status}`);
    const json = await res.json();
    const dates: { games: MlbApiGame[] }[] = json.dates ?? [];
    const games = dates.flatMap((d) => d.games).map(buildGame);
    // Newest first
    return games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error("[mlb-api] Failed to fetch team schedule:", err);
    return [];
  }
}

/**
 * Compute a team's record from a list of games (only counts FINAL games).
 */
export function computeRecord(games: Game[], teamId: number): { wins: number; losses: number } {
  let wins = 0;
  let losses = 0;
  for (const g of games) {
    if (g.status !== "FINAL") continue;
    const isHome = Number(g.homeTeam.id) === teamId;
    const isAway = Number(g.awayTeam.id) === teamId;
    if (!isHome && !isAway) continue;
    const myScore = isHome ? g.homeScore : g.awayScore;
    const oppScore = isHome ? g.awayScore : g.homeScore;
    if (myScore > oppScore) wins++;
    else if (myScore < oppScore) losses++;
  }
  return { wins, losses };
}
