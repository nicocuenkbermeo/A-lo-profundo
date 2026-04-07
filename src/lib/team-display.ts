// Centralized team display-name helper.
//
// Guarantees that a team name is never rendered with the city duplicated,
// regardless of whether the upstream data source provides:
//   - the full name only (e.g. "Kansas City Royals")
//   - a separate `city` + `name` pair (e.g. city="Kansas City", name="Royals")
//   - both populated (full name plus city, which historically caused
//     "Kansas City City Royals" style duplication).

import { TEAM_META } from "./mlb-api";

export interface DisplayableTeam {
  name?: string | null;
  city?: string | null;
  abbreviation?: string | null;
}

/**
 * Return a clean team display name such as "Kansas City Royals" without
 * duplicating the city prefix. Falls back to TEAM_META if the input is
 * missing fields. Safe to use in any JSX that renders a team label.
 */
export function getTeamDisplayName(team: DisplayableTeam | null | undefined): string {
  if (!team) return "";

  const rawName = (team.name ?? "").trim();
  const rawCity = (team.city ?? "").trim();
  const abbr = (team.abbreviation ?? "").toUpperCase();

  // If name already looks like a full "City Nickname" (e.g. "Kansas City Royals"),
  // return it as-is without prepending city again.
  if (rawName && rawCity && rawName.toLowerCase().startsWith(rawCity.toLowerCase())) {
    return rawName;
  }

  // If we have both city and a short nickname (e.g. city="Kansas City", name="Royals"),
  // concatenate them.
  if (rawName && rawCity) {
    return `${rawCity} ${rawName}`;
  }

  // Only a name — trust it.
  if (rawName) return rawName;

  // No name. Fall back to TEAM_META by abbreviation.
  const meta = abbr ? TEAM_META[abbr] : undefined;
  if (meta) return `${meta.city} ${meta.name}`;

  return abbr || "";
}
