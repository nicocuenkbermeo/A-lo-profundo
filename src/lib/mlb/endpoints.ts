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
