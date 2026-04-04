export const MLB_TEAMS = [
  { abbreviation: "NYY", name: "Yankees", city: "New York", league: "AL", division: "EAST", primaryColor: "#003087", secondaryColor: "#C4CED4" },
  { abbreviation: "BOS", name: "Red Sox", city: "Boston", league: "AL", division: "EAST", primaryColor: "#BD3039", secondaryColor: "#0C2340" },
  { abbreviation: "BAL", name: "Orioles", city: "Baltimore", league: "AL", division: "EAST", primaryColor: "#DF4601", secondaryColor: "#27251F" },
  { abbreviation: "TBR", name: "Rays", city: "Tampa Bay", league: "AL", division: "EAST", primaryColor: "#092C5C", secondaryColor: "#8FBCE6" },
  { abbreviation: "TOR", name: "Blue Jays", city: "Toronto", league: "AL", division: "EAST", primaryColor: "#134A8E", secondaryColor: "#E8291C" },
  { abbreviation: "CLE", name: "Guardians", city: "Cleveland", league: "AL", division: "CENTRAL", primaryColor: "#00385D", secondaryColor: "#E31937" },
  { abbreviation: "CHW", name: "White Sox", city: "Chicago", league: "AL", division: "CENTRAL", primaryColor: "#27251F", secondaryColor: "#C4CED4" },
  { abbreviation: "DET", name: "Tigers", city: "Detroit", league: "AL", division: "CENTRAL", primaryColor: "#0C2340", secondaryColor: "#FA4616" },
  { abbreviation: "KCR", name: "Royals", city: "Kansas City", league: "AL", division: "CENTRAL", primaryColor: "#004687", secondaryColor: "#BD9B60" },
  { abbreviation: "MIN", name: "Twins", city: "Minnesota", league: "AL", division: "CENTRAL", primaryColor: "#002B5C", secondaryColor: "#D31145" },
  { abbreviation: "HOU", name: "Astros", city: "Houston", league: "AL", division: "WEST", primaryColor: "#002D62", secondaryColor: "#EB6E1F" },
  { abbreviation: "LAA", name: "Angels", city: "Los Angeles", league: "AL", division: "WEST", primaryColor: "#BA0021", secondaryColor: "#003263" },
  { abbreviation: "OAK", name: "Athletics", city: "Oakland", league: "AL", division: "WEST", primaryColor: "#003831", secondaryColor: "#EFB21E" },
  { abbreviation: "SEA", name: "Mariners", city: "Seattle", league: "AL", division: "WEST", primaryColor: "#0C2C56", secondaryColor: "#005C5C" },
  { abbreviation: "TEX", name: "Rangers", city: "Texas", league: "AL", division: "WEST", primaryColor: "#003278", secondaryColor: "#C0111F" },
  { abbreviation: "ATL", name: "Braves", city: "Atlanta", league: "NL", division: "EAST", primaryColor: "#CE1141", secondaryColor: "#13274F" },
  { abbreviation: "MIA", name: "Marlins", city: "Miami", league: "NL", division: "EAST", primaryColor: "#00A3E0", secondaryColor: "#EF3340" },
  { abbreviation: "NYM", name: "Mets", city: "New York", league: "NL", division: "EAST", primaryColor: "#002D72", secondaryColor: "#FF5910" },
  { abbreviation: "PHI", name: "Phillies", city: "Philadelphia", league: "NL", division: "EAST", primaryColor: "#E81828", secondaryColor: "#002D72" },
  { abbreviation: "WSH", name: "Nationals", city: "Washington", league: "NL", division: "EAST", primaryColor: "#AB0003", secondaryColor: "#14225A" },
  { abbreviation: "CHC", name: "Cubs", city: "Chicago", league: "NL", division: "CENTRAL", primaryColor: "#0E3386", secondaryColor: "#CC3433" },
  { abbreviation: "CIN", name: "Reds", city: "Cincinnati", league: "NL", division: "CENTRAL", primaryColor: "#C6011F", secondaryColor: "#000000" },
  { abbreviation: "MIL", name: "Brewers", city: "Milwaukee", league: "NL", division: "CENTRAL", primaryColor: "#12284B", secondaryColor: "#FFC52F" },
  { abbreviation: "PIT", name: "Pirates", city: "Pittsburgh", league: "NL", division: "CENTRAL", primaryColor: "#27251F", secondaryColor: "#FDB827" },
  { abbreviation: "STL", name: "Cardinals", city: "St. Louis", league: "NL", division: "CENTRAL", primaryColor: "#C41E3A", secondaryColor: "#0C2340" },
  { abbreviation: "ARI", name: "Diamondbacks", city: "Arizona", league: "NL", division: "WEST", primaryColor: "#A71930", secondaryColor: "#E3D4AD" },
  { abbreviation: "COL", name: "Rockies", city: "Colorado", league: "NL", division: "WEST", primaryColor: "#33006F", secondaryColor: "#C4CED4" },
  { abbreviation: "LAD", name: "Dodgers", city: "Los Angeles", league: "NL", division: "WEST", primaryColor: "#005A9C", secondaryColor: "#EF3E42" },
  { abbreviation: "SDP", name: "Padres", city: "San Diego", league: "NL", division: "WEST", primaryColor: "#2F241D", secondaryColor: "#FFC425" },
  { abbreviation: "SFG", name: "Giants", city: "San Francisco", league: "NL", division: "WEST", primaryColor: "#FD5A1E", secondaryColor: "#27251F" },
] as const;

export type MLBTeam = (typeof MLB_TEAMS)[number];

export const TIPSTER_NAMES = [
  { username: "el_profeta", displayName: "El Profeta", emoji: "\u{1F52E}" },
  { username: "batflip_king", displayName: "BatFlip King", emoji: "\u{1F451}" },
  { username: "sabermetrics_joe", displayName: "Sabermetrics Joe", emoji: "\u{1F9EE}" },
  { username: "la_maquina", displayName: "La M\u00e1quina", emoji: "\u2699\uFE0F" },
  { username: "el_zurdo", displayName: "El Zurdo", emoji: "\u{1FAF2}" },
] as const;

export const PICK_TYPES = [
  { value: "MONEYLINE", label: "Moneyline" },
  { value: "RUNLINE", label: "Run Line" },
  { value: "TOTAL", label: "Over/Under" },
  { value: "PROP", label: "Prop Bet" },
  { value: "PARLAY", label: "Parlay" },
] as const;

export const RESULT_COLORS: Record<string, string> = {
  WIN: "#22c55e",
  LOSS: "#ef4444",
  PUSH: "#eab308",
  PENDING: "#6b7280",
  VOID: "#9ca3af",
};

export const POSITIONS = [
  { value: "C", label: "Catcher" },
  { value: "1B", label: "First Base" },
  { value: "2B", label: "Second Base" },
  { value: "3B", label: "Third Base" },
  { value: "SS", label: "Shortstop" },
  { value: "LF", label: "Left Field" },
  { value: "CF", label: "Center Field" },
  { value: "RF", label: "Right Field" },
  { value: "DH", label: "Designated Hitter" },
  { value: "SP", label: "Starting Pitcher" },
  { value: "RP", label: "Relief Pitcher" },
  { value: "CL", label: "Closer" },
] as const;

export const DIVISIONS: Record<string, { league: string; division: string; label: string }> = {
  AL_EAST: { league: "AL", division: "EAST", label: "AL East" },
  AL_CENTRAL: { league: "AL", division: "CENTRAL", label: "AL Central" },
  AL_WEST: { league: "AL", division: "WEST", label: "AL West" },
  NL_EAST: { league: "NL", division: "EAST", label: "NL East" },
  NL_CENTRAL: { league: "NL", division: "CENTRAL", label: "NL Central" },
  NL_WEST: { league: "NL", division: "WEST", label: "NL West" },
};
