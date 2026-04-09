// All MLB Stats API endpoint constructors live here.
// Never hardcode an MLB URL anywhere else in the app.
//
// Docs: https://statsapi.mlb.com/docs/ (and the unofficial community docs at
// https://github.com/toddrob99/MLB-StatsAPI/wiki/Endpoints).

export const MLB_API_V1 = "https://statsapi.mlb.com/api/v1";
export const MLB_API_V1_1 = "https://statsapi.mlb.com/api/v1.1";

/** Schedule for a date range, optionally filtered by team. */
export function scheduleByDateRange(params: {
  startDate: string;
  endDate: string;
  teamId?: number;
  /** Hydrations are comma-separated, e.g. "linescore,team,venue". */
  hydrate?: string;
}): string {
  const url = new URL(`${MLB_API_V1}/schedule`);
  url.searchParams.set("sportId", "1");
  url.searchParams.set("startDate", params.startDate);
  url.searchParams.set("endDate", params.endDate);
  if (params.teamId) url.searchParams.set("teamId", String(params.teamId));
  if (params.hydrate) url.searchParams.set("hydrate", params.hydrate);
  return url.toString();
}

/** Schedule for a single date (used when we don't need a range). */
export function scheduleByDate(date: string, hydrate?: string): string {
  const url = new URL(`${MLB_API_V1}/schedule`);
  url.searchParams.set("sportId", "1");
  url.searchParams.set("date", date);
  if (hydrate) url.searchParams.set("hydrate", hydrate);
  return url.toString();
}

/** Live feed for one game. Includes boxscore, linescore, plays. */
export function liveFeed(gamePk: number | string): string {
  return `${MLB_API_V1_1}/game/${gamePk}/feed/live`;
}

/** League-wide standings for a season. */
export function standings(season: number): string {
  const url = new URL(`${MLB_API_V1}/standings`);
  url.searchParams.set("leagueId", "103,104");
  url.searchParams.set("season", String(season));
  url.searchParams.set("standingsTypes", "regularSeason");
  url.searchParams.set("hydrate", "team,record(splitRecords)");
  return url.toString();
}

/** Schedule with probable pitchers and lineups (used by Feature 3). */
export function scheduleWithLineups(date: string): string {
  return scheduleByDate(date, "probablePitcher,lineups,team");
}

/** Batter vs pitcher career head-to-head stats. */
export function playerVsPlayer(batterId: number, pitcherId: number): string {
  const url = new URL(`${MLB_API_V1}/people/${batterId}/stats`);
  url.searchParams.set("stats", "vsPlayer");
  url.searchParams.set("opposingPlayerId", String(pitcherId));
  url.searchParams.set("group", "hitting");
  return url.toString();
}

/** Team stats by date range — used for recent OPS / ERA windows. */
export function teamStatsByDateRange(params: {
  teamId: number;
  season: number;
  group: "hitting" | "pitching";
  startDate: string;
  endDate: string;
}): string {
  const url = new URL(`${MLB_API_V1}/teams/${params.teamId}/stats`);
  url.searchParams.set("stats", "byDateRange");
  url.searchParams.set("season", String(params.season));
  url.searchParams.set("group", params.group);
  url.searchParams.set("startDate", params.startDate);
  url.searchParams.set("endDate", params.endDate);
  url.searchParams.set("sportId", "1");
  return url.toString();
}
