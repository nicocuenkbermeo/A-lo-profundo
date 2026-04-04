import type { Game, GameTeam, BettingLine } from "@/types/game";
import type { Player, BattingStats, PitchingStats, TeamStandings } from "@/types/player";
import type { Pick, TipsterStats } from "@/types/pick";

// ---------------------------------------------------------------------------
// Helper team builder
// ---------------------------------------------------------------------------
function team(
  id: string,
  name: string,
  abbr: string,
  city: string,
  primary: string,
  secondary: string
): GameTeam {
  return {
    id,
    name,
    abbreviation: abbr,
    city,
    logoUrl: `/teams/${abbr.toLowerCase()}.svg`,
    primaryColor: primary,
    secondaryColor: secondary,
  };
}

const TEAMS = {
  NYY: team("t1", "Yankees", "NYY", "New York", "#003087", "#E4002C"),
  BOS: team("t2", "Red Sox", "BOS", "Boston", "#BD3039", "#0C2340"),
  LAD: team("t3", "Dodgers", "LAD", "Los Angeles", "#005A9C", "#EF3E42"),
  HOU: team("t4", "Astros", "HOU", "Houston", "#002D62", "#EB6E1F"),
  ATL: team("t5", "Braves", "ATL", "Atlanta", "#CE1141", "#13274F"),
  PHI: team("t6", "Phillies", "PHI", "Philadelphia", "#E81828", "#002D72"),
  SD: team("t7", "Padres", "SD", "San Diego", "#2F241D", "#FFC425"),
  BAL: team("t8", "Orioles", "BAL", "Baltimore", "#DF4601", "#27251F"),
  TB: team("t9", "Rays", "TB", "Tampa Bay", "#092C5C", "#8FBCE6"),
  MIN: team("t10", "Twins", "MIN", "Minnesota", "#002B5C", "#D31145"),
  SEA: team("t11", "Mariners", "SEA", "Seattle", "#0C2C56", "#005C5C"),
  TEX: team("t12", "Rangers", "TEX", "Texas", "#003278", "#C0111F"),
  CLE: team("t13", "Guardians", "CLE", "Cleveland", "#00385D", "#E50022"),
  MIL: team("t14", "Brewers", "MIL", "Milwaukee", "#FFC52F", "#12284B"),
  CHC: team("t15", "Cubs", "CHC", "Chicago", "#0E3386", "#CC3433"),
  SF: team("t16", "Giants", "SF", "San Francisco", "#FD5A1E", "#27251F"),
  AZ: team("t17", "Diamondbacks", "AZ", "Arizona", "#A71930", "#E3D4AD"),
  NYM: team("t18", "Mets", "NYM", "New York", "#002D72", "#FF5910"),
  TOR: team("t19", "Blue Jays", "TOR", "Toronto", "#134A8E", "#1D2D5C"),
  STL: team("t20", "Cardinals", "STL", "St. Louis", "#C41E3A", "#0C2340"),
  DET: team("t21", "Tigers", "DET", "Detroit", "#0C2340", "#FA4616"),
  KC: team("t22", "Royals", "KC", "Kansas City", "#004687", "#BD9B60"),
  CWS: team("t23", "White Sox", "CWS", "Chicago", "#27251F", "#C4CED4"),
  LAA: team("t24", "Angels", "LAA", "Los Angeles", "#BA0021", "#003263"),
  OAK: team("t25", "Athletics", "OAK", "Oakland", "#003831", "#EFB21E"),
  MIA: team("t26", "Marlins", "MIA", "Miami", "#00A3E0", "#EF3340"),
  WSH: team("t27", "Nationals", "WSH", "Washington", "#AB0003", "#14225A"),
  PIT: team("t28", "Pirates", "PIT", "Pittsburgh", "#27251F", "#FDB827"),
  CIN: team("t29", "Reds", "CIN", "Cincinnati", "#C6011F", "#27251F"),
  COL: team("t30", "Rockies", "COL", "Colorado", "#33006F", "#C4CED4"),
};

// ---------------------------------------------------------------------------
// Mock betting line
// ---------------------------------------------------------------------------
function mockLine(homeML: number, awayML: number, total: number): BettingLine {
  return {
    id: `bl-${Math.random().toString(36).slice(2, 8)}`,
    source: "DraftKings",
    homeMoneyline: homeML,
    awayMoneyline: awayML,
    runLineSpread: -1.5,
    runLineHome: homeML > 0 ? +145 : -130,
    runLineAway: awayML > 0 ? +145 : -130,
    totalLine: total,
    overOdds: -110,
    underOdds: -110,
  };
}

// ---------------------------------------------------------------------------
// GAMES
// ---------------------------------------------------------------------------
const MOCK_GAMES: Game[] = [
  {
    id: "g1", externalId: "mlb-2026-0404-001",
    homeTeam: TEAMS.NYY, awayTeam: TEAMS.BOS,
    date: "2026-04-04", status: "LIVE", homeScore: 4, awayScore: 3,
    inning: 6, inningHalf: "BOTTOM", outs: 1,
    startTime: "2026-04-04T17:05:00Z", venue: "Yankee Stadium",
    innings: [
      { inningNumber: 1, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 2, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 3, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 4, homeRuns: 1, awayRuns: 2 },
      { inningNumber: 5, homeRuns: 1, awayRuns: 0 },
    ],
    lines: [mockLine(-150, +130, 9)],
  },
  {
    id: "g2", externalId: "mlb-2026-0404-002",
    homeTeam: TEAMS.LAD, awayTeam: TEAMS.SF,
    date: "2026-04-04", status: "LIVE", homeScore: 2, awayScore: 2,
    inning: 4, inningHalf: "TOP", outs: 2,
    startTime: "2026-04-04T20:10:00Z", venue: "Dodger Stadium",
    innings: [
      { inningNumber: 1, homeRuns: 1, awayRuns: 0 },
      { inningNumber: 2, homeRuns: 0, awayRuns: 2 },
      { inningNumber: 3, homeRuns: 1, awayRuns: 0 },
    ],
    lines: [mockLine(-180, +155, 8.5)],
  },
  {
    id: "g3", externalId: "mlb-2026-0404-003",
    homeTeam: TEAMS.HOU, awayTeam: TEAMS.TEX,
    date: "2026-04-04", status: "LIVE", homeScore: 5, awayScore: 1,
    inning: 7, inningHalf: "TOP", outs: 0,
    startTime: "2026-04-04T18:10:00Z", venue: "Minute Maid Park",
    innings: [
      { inningNumber: 1, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 2, homeRuns: 3, awayRuns: 0 },
      { inningNumber: 3, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 4, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 5, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 6, homeRuns: 0, awayRuns: 0 },
    ],
    lines: [mockLine(-165, +140, 8)],
  },
  {
    id: "g4", externalId: "mlb-2026-0404-004",
    homeTeam: TEAMS.ATL, awayTeam: TEAMS.NYM,
    date: "2026-04-04", status: "FINAL", homeScore: 7, awayScore: 3,
    inning: 9, inningHalf: null, outs: 0,
    startTime: "2026-04-04T15:20:00Z", venue: "Truist Park",
    innings: [
      { inningNumber: 1, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 2, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 3, homeRuns: 1, awayRuns: 0 },
      { inningNumber: 4, homeRuns: 0, awayRuns: 2 },
      { inningNumber: 5, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 6, homeRuns: 3, awayRuns: 0 },
      { inningNumber: 7, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 8, homeRuns: 1, awayRuns: 0 },
      { inningNumber: 9, homeRuns: 0, awayRuns: 0 },
    ],
    lines: [mockLine(-140, +120, 9.5)],
  },
  {
    id: "g5", externalId: "mlb-2026-0404-005",
    homeTeam: TEAMS.PHI, awayTeam: TEAMS.MIA,
    date: "2026-04-04", status: "FINAL", homeScore: 3, awayScore: 2,
    inning: 9, inningHalf: null, outs: 0,
    startTime: "2026-04-04T15:05:00Z", venue: "Citizens Bank Park",
    innings: [
      { inningNumber: 1, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 2, homeRuns: 1, awayRuns: 0 },
      { inningNumber: 3, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 4, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 5, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 6, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 7, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 8, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 9, homeRuns: 0, awayRuns: 0 },
    ],
    lines: [mockLine(-200, +170, 8)],
  },
  {
    id: "g6", externalId: "mlb-2026-0404-006",
    homeTeam: TEAMS.SD, awayTeam: TEAMS.AZ,
    date: "2026-04-04", status: "SCHEDULED", homeScore: 0, awayScore: 0,
    inning: null, inningHalf: null, outs: 0,
    startTime: "2026-04-04T21:40:00Z", venue: "Petco Park",
    innings: [],
    lines: [mockLine(-135, +115, 8.5)],
  },
  {
    id: "g7", externalId: "mlb-2026-0404-007",
    homeTeam: TEAMS.BAL, awayTeam: TEAMS.TB,
    date: "2026-04-04", status: "FINAL", homeScore: 6, awayScore: 4,
    inning: 9, inningHalf: null, outs: 0,
    startTime: "2026-04-04T15:05:00Z", venue: "Camden Yards",
    innings: [
      { inningNumber: 1, homeRuns: 1, awayRuns: 0 },
      { inningNumber: 2, homeRuns: 0, awayRuns: 2 },
      { inningNumber: 3, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 4, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 5, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 6, homeRuns: 1, awayRuns: 0 },
      { inningNumber: 7, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 8, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 9, homeRuns: 0, awayRuns: 0 },
    ],
    lines: [mockLine(-125, +105, 9)],
  },
  {
    id: "g8", externalId: "mlb-2026-0404-008",
    homeTeam: TEAMS.MIN, awayTeam: TEAMS.CLE,
    date: "2026-04-04", status: "SCHEDULED", homeScore: 0, awayScore: 0,
    inning: null, inningHalf: null, outs: 0,
    startTime: "2026-04-04T19:10:00Z", venue: "Target Field",
    innings: [],
    lines: [mockLine(+110, -130, 7.5)],
  },
  {
    id: "g9", externalId: "mlb-2026-0404-009",
    homeTeam: TEAMS.SEA, awayTeam: TEAMS.LAA,
    date: "2026-04-04", status: "SCHEDULED", homeScore: 0, awayScore: 0,
    inning: null, inningHalf: null, outs: 0,
    startTime: "2026-04-04T21:40:00Z", venue: "T-Mobile Park",
    innings: [],
    lines: [mockLine(-145, +125, 7.5)],
  },
  {
    id: "g10", externalId: "mlb-2026-0404-010",
    homeTeam: TEAMS.MIL, awayTeam: TEAMS.CHC,
    date: "2026-04-04", status: "LIVE", homeScore: 1, awayScore: 3,
    inning: 3, inningHalf: "BOTTOM", outs: 1,
    startTime: "2026-04-04T18:40:00Z", venue: "American Family Field",
    innings: [
      { inningNumber: 1, homeRuns: 0, awayRuns: 2 },
      { inningNumber: 2, homeRuns: 1, awayRuns: 1 },
    ],
    lines: [mockLine(-120, +100, 8.5)],
  },
  {
    id: "g11", externalId: "mlb-2026-0404-011",
    homeTeam: TEAMS.STL, awayTeam: TEAMS.PIT,
    date: "2026-04-04", status: "FINAL", homeScore: 5, awayScore: 5,
    inning: 10, inningHalf: null, outs: 0,
    startTime: "2026-04-04T15:15:00Z", venue: "Busch Stadium",
    innings: [
      { inningNumber: 1, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 2, homeRuns: 1, awayRuns: 0 },
      { inningNumber: 3, homeRuns: 0, awayRuns: 2 },
      { inningNumber: 4, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 5, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 6, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 7, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 8, homeRuns: 0, awayRuns: 2 },
      { inningNumber: 9, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 10, homeRuns: 0, awayRuns: 0 },
    ],
    lines: [mockLine(-155, +135, 9)],
  },
  {
    id: "g12", externalId: "mlb-2026-0404-012",
    homeTeam: TEAMS.DET, awayTeam: TEAMS.KC,
    date: "2026-04-04", status: "SCHEDULED", homeScore: 0, awayScore: 0,
    inning: null, inningHalf: null, outs: 0,
    startTime: "2026-04-04T17:40:00Z", venue: "Comerica Park",
    innings: [],
    lines: [mockLine(+120, -140, 8)],
  },
  {
    id: "g13", externalId: "mlb-2026-0404-013",
    homeTeam: TEAMS.CIN, awayTeam: TEAMS.WSH,
    date: "2026-04-04", status: "FINAL", homeScore: 8, awayScore: 2,
    inning: 9, inningHalf: null, outs: 0,
    startTime: "2026-04-04T15:10:00Z", venue: "Great American Ball Park",
    innings: [
      { inningNumber: 1, homeRuns: 3, awayRuns: 0 },
      { inningNumber: 2, homeRuns: 0, awayRuns: 1 },
      { inningNumber: 3, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 4, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 5, homeRuns: 1, awayRuns: 1 },
      { inningNumber: 6, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 7, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 8, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 9, homeRuns: 0, awayRuns: 0 },
    ],
    lines: [mockLine(-110, -110, 9.5)],
  },
  {
    id: "g14", externalId: "mlb-2026-0404-014",
    homeTeam: TEAMS.TOR, awayTeam: TEAMS.CWS,
    date: "2026-04-04", status: "LIVE", homeScore: 6, awayScore: 0,
    inning: 5, inningHalf: "TOP", outs: 2,
    startTime: "2026-04-04T17:07:00Z", venue: "Rogers Centre",
    innings: [
      { inningNumber: 1, homeRuns: 2, awayRuns: 0 },
      { inningNumber: 2, homeRuns: 0, awayRuns: 0 },
      { inningNumber: 3, homeRuns: 1, awayRuns: 0 },
      { inningNumber: 4, homeRuns: 3, awayRuns: 0 },
    ],
    lines: [mockLine(-250, +210, 8.5)],
  },
  {
    id: "g15", externalId: "mlb-2026-0404-015",
    homeTeam: TEAMS.COL, awayTeam: TEAMS.OAK,
    date: "2026-04-04", status: "SCHEDULED", homeScore: 0, awayScore: 0,
    inning: null, inningHalf: null, outs: 0,
    startTime: "2026-04-04T20:40:00Z", venue: "Coors Field",
    innings: [],
    lines: [mockLine(-115, -105, 11)],
  },
];

// ---------------------------------------------------------------------------
// STANDINGS (all 30 teams, early-season realistic records)
// ---------------------------------------------------------------------------
const MOCK_STANDINGS: TeamStandings[] = [
  { id: "t3", name: "Dodgers", abbreviation: "LAD", primaryColor: "#005A9C", wins: 5, losses: 1, pct: 0.833, runsScored: 38, runsAllowed: 18, diff: 20, home: "3-0", away: "2-1", last10: "5-1", streak: "W4", league: "NL", division: "WEST" },
  { id: "t1", name: "Yankees", abbreviation: "NYY", primaryColor: "#003087", wins: 5, losses: 2, pct: 0.714, runsScored: 35, runsAllowed: 22, diff: 13, home: "3-1", away: "2-1", last10: "5-2", streak: "W2", league: "AL", division: "EAST" },
  { id: "t8", name: "Orioles", abbreviation: "BAL", primaryColor: "#DF4601", wins: 4, losses: 2, pct: 0.667, runsScored: 30, runsAllowed: 20, diff: 10, home: "2-1", away: "2-1", last10: "4-2", streak: "W1", league: "AL", division: "EAST" },
  { id: "t4", name: "Astros", abbreviation: "HOU", primaryColor: "#002D62", wins: 4, losses: 2, pct: 0.667, runsScored: 28, runsAllowed: 19, diff: 9, home: "3-0", away: "1-2", last10: "4-2", streak: "W3", league: "AL", division: "WEST" },
  { id: "t5", name: "Braves", abbreviation: "ATL", primaryColor: "#CE1141", wins: 4, losses: 2, pct: 0.667, runsScored: 33, runsAllowed: 21, diff: 12, home: "3-1", away: "1-1", last10: "4-2", streak: "W2", league: "NL", division: "EAST" },
  { id: "t6", name: "Phillies", abbreviation: "PHI", primaryColor: "#E81828", wins: 4, losses: 2, pct: 0.667, runsScored: 26, runsAllowed: 18, diff: 8, home: "2-1", away: "2-1", last10: "4-2", streak: "W1", league: "NL", division: "EAST" },
  { id: "t14", name: "Brewers", abbreviation: "MIL", primaryColor: "#FFC52F", wins: 4, losses: 3, pct: 0.571, runsScored: 29, runsAllowed: 25, diff: 4, home: "2-1", away: "2-2", last10: "4-3", streak: "L1", league: "NL", division: "CENTRAL" },
  { id: "t7", name: "Padres", abbreviation: "SD", primaryColor: "#2F241D", wins: 4, losses: 3, pct: 0.571, runsScored: 31, runsAllowed: 27, diff: 4, home: "3-1", away: "1-2", last10: "4-3", streak: "W1", league: "NL", division: "WEST" },
  { id: "t11", name: "Mariners", abbreviation: "SEA", primaryColor: "#0C2C56", wins: 3, losses: 3, pct: 0.500, runsScored: 22, runsAllowed: 20, diff: 2, home: "2-1", away: "1-2", last10: "3-3", streak: "L1", league: "AL", division: "WEST" },
  { id: "t13", name: "Guardians", abbreviation: "CLE", primaryColor: "#00385D", wins: 3, losses: 3, pct: 0.500, runsScored: 24, runsAllowed: 23, diff: 1, home: "2-1", away: "1-2", last10: "3-3", streak: "W1", league: "AL", division: "CENTRAL" },
  { id: "t10", name: "Twins", abbreviation: "MIN", primaryColor: "#002B5C", wins: 3, losses: 3, pct: 0.500, runsScored: 21, runsAllowed: 22, diff: -1, home: "2-1", away: "1-2", last10: "3-3", streak: "L2", league: "AL", division: "CENTRAL" },
  { id: "t2", name: "Red Sox", abbreviation: "BOS", primaryColor: "#BD3039", wins: 3, losses: 3, pct: 0.500, runsScored: 25, runsAllowed: 26, diff: -1, home: "2-1", away: "1-2", last10: "3-3", streak: "L1", league: "AL", division: "EAST" },
  { id: "t9", name: "Rays", abbreviation: "TB", primaryColor: "#092C5C", wins: 3, losses: 3, pct: 0.500, runsScored: 20, runsAllowed: 21, diff: -1, home: "1-2", away: "2-1", last10: "3-3", streak: "L1", league: "AL", division: "EAST" },
  { id: "t18", name: "Mets", abbreviation: "NYM", primaryColor: "#002D72", wins: 3, losses: 3, pct: 0.500, runsScored: 27, runsAllowed: 28, diff: -1, home: "1-2", away: "2-1", last10: "3-3", streak: "L2", league: "NL", division: "EAST" },
  { id: "t19", name: "Blue Jays", abbreviation: "TOR", primaryColor: "#134A8E", wins: 3, losses: 3, pct: 0.500, runsScored: 23, runsAllowed: 22, diff: 1, home: "2-1", away: "1-2", last10: "3-3", streak: "W1", league: "AL", division: "EAST" },
  { id: "t15", name: "Cubs", abbreviation: "CHC", primaryColor: "#0E3386", wins: 3, losses: 4, pct: 0.429, runsScored: 22, runsAllowed: 25, diff: -3, home: "2-1", away: "1-3", last10: "3-4", streak: "W1", league: "NL", division: "CENTRAL" },
  { id: "t12", name: "Rangers", abbreviation: "TEX", primaryColor: "#003278", wins: 3, losses: 4, pct: 0.429, runsScored: 24, runsAllowed: 28, diff: -4, home: "2-2", away: "1-2", last10: "3-4", streak: "L2", league: "AL", division: "WEST" },
  { id: "t16", name: "Giants", abbreviation: "SF", primaryColor: "#FD5A1E", wins: 3, losses: 4, pct: 0.429, runsScored: 20, runsAllowed: 24, diff: -4, home: "1-2", away: "2-2", last10: "3-4", streak: "L1", league: "NL", division: "WEST" },
  { id: "t20", name: "Cardinals", abbreviation: "STL", primaryColor: "#C41E3A", wins: 3, losses: 4, pct: 0.429, runsScored: 25, runsAllowed: 29, diff: -4, home: "2-2", away: "1-2", last10: "3-4", streak: "W1", league: "NL", division: "CENTRAL" },
  { id: "t22", name: "Royals", abbreviation: "KC", primaryColor: "#004687", wins: 3, losses: 4, pct: 0.429, runsScored: 19, runsAllowed: 22, diff: -3, home: "2-1", away: "1-3", last10: "3-4", streak: "L1", league: "AL", division: "CENTRAL" },
  { id: "t17", name: "Diamondbacks", abbreviation: "AZ", primaryColor: "#A71930", wins: 2, losses: 4, pct: 0.333, runsScored: 18, runsAllowed: 25, diff: -7, home: "1-2", away: "1-2", last10: "2-4", streak: "L3", league: "NL", division: "WEST" },
  { id: "t21", name: "Tigers", abbreviation: "DET", primaryColor: "#0C2340", wins: 2, losses: 4, pct: 0.333, runsScored: 16, runsAllowed: 23, diff: -7, home: "1-2", away: "1-2", last10: "2-4", streak: "L1", league: "AL", division: "CENTRAL" },
  { id: "t24", name: "Angels", abbreviation: "LAA", primaryColor: "#BA0021", wins: 2, losses: 4, pct: 0.333, runsScored: 17, runsAllowed: 24, diff: -7, home: "1-2", away: "1-2", last10: "2-4", streak: "L2", league: "AL", division: "WEST" },
  { id: "t26", name: "Marlins", abbreviation: "MIA", primaryColor: "#00A3E0", wins: 2, losses: 4, pct: 0.333, runsScored: 14, runsAllowed: 22, diff: -8, home: "1-2", away: "1-2", last10: "2-4", streak: "L1", league: "NL", division: "EAST" },
  { id: "t27", name: "Nationals", abbreviation: "WSH", primaryColor: "#AB0003", wins: 2, losses: 5, pct: 0.286, runsScored: 15, runsAllowed: 28, diff: -13, home: "1-3", away: "1-2", last10: "2-5", streak: "L3", league: "NL", division: "EAST" },
  { id: "t28", name: "Pirates", abbreviation: "PIT", primaryColor: "#27251F", wins: 2, losses: 4, pct: 0.333, runsScored: 18, runsAllowed: 26, diff: -8, home: "1-2", away: "1-2", last10: "2-4", streak: "W1", league: "NL", division: "CENTRAL" },
  { id: "t29", name: "Reds", abbreviation: "CIN", primaryColor: "#C6011F", wins: 3, losses: 3, pct: 0.500, runsScored: 26, runsAllowed: 24, diff: 2, home: "2-1", away: "1-2", last10: "3-3", streak: "W2", league: "NL", division: "CENTRAL" },
  { id: "t30", name: "Rockies", abbreviation: "COL", primaryColor: "#33006F", wins: 2, losses: 5, pct: 0.286, runsScored: 20, runsAllowed: 32, diff: -12, home: "1-3", away: "1-2", last10: "2-5", streak: "L2", league: "NL", division: "WEST" },
  { id: "t25", name: "Athletics", abbreviation: "OAK", primaryColor: "#003831", wins: 1, losses: 5, pct: 0.167, runsScored: 12, runsAllowed: 30, diff: -18, home: "1-2", away: "0-3", last10: "1-5", streak: "L4", league: "AL", division: "WEST" },
  { id: "t23", name: "White Sox", abbreviation: "CWS", primaryColor: "#27251F", wins: 1, losses: 6, pct: 0.143, runsScored: 10, runsAllowed: 35, diff: -25, home: "1-2", away: "0-4", last10: "1-6", streak: "L5", league: "AL", division: "CENTRAL" },
];

// ---------------------------------------------------------------------------
// PLAYERS
// ---------------------------------------------------------------------------
const MOCK_PLAYERS: (Player & { stats: BattingStats | PitchingStats })[] = [
  {
    id: "p1", externalId: "mlb-660271", firstName: "Aaron", lastName: "Judge",
    team: { id: "t1", name: "Yankees", abbreviation: "NYY", primaryColor: "#003087" },
    position: "RF", bats: "R", throws: "R", number: 99, photoUrl: null, isActive: true,
    stats: { gamesPlayed: 6, atBats: 24, runs: 7, hits: 10, doubles: 2, triples: 0, homeRuns: 3, rbi: 8, stolenBases: 0, walks: 4, strikeouts: 6, avg: 0.417, obp: 0.500, slg: 0.833, ops: 1.333, war: 1.2 } as BattingStats,
  },
  {
    id: "p2", externalId: "mlb-665742", firstName: "Shohei", lastName: "Ohtani",
    team: { id: "t3", name: "Dodgers", abbreviation: "LAD", primaryColor: "#005A9C" },
    position: "DH", bats: "L", throws: "R", number: 17, photoUrl: null, isActive: true,
    stats: { gamesPlayed: 6, atBats: 22, runs: 8, hits: 9, doubles: 1, triples: 0, homeRuns: 4, rbi: 10, stolenBases: 2, walks: 5, strikeouts: 5, avg: 0.409, obp: 0.519, slg: 0.909, ops: 1.428, war: 1.5 } as BattingStats,
  },
  {
    id: "p3", externalId: "mlb-592450", firstName: "Mookie", lastName: "Betts",
    team: { id: "t3", name: "Dodgers", abbreviation: "LAD", primaryColor: "#005A9C" },
    position: "SS", bats: "R", throws: "R", number: 50, photoUrl: null, isActive: true,
    stats: { gamesPlayed: 6, atBats: 25, runs: 6, hits: 8, doubles: 3, triples: 0, homeRuns: 2, rbi: 5, stolenBases: 1, walks: 3, strikeouts: 4, avg: 0.320, obp: 0.393, slg: 0.600, ops: 0.993, war: 0.9 } as BattingStats,
  },
  {
    id: "p4", externalId: "mlb-666969", firstName: "Gunnar", lastName: "Henderson",
    team: { id: "t8", name: "Orioles", abbreviation: "BAL", primaryColor: "#DF4601" },
    position: "SS", bats: "L", throws: "R", number: 2, photoUrl: null, isActive: true,
    stats: { gamesPlayed: 6, atBats: 23, runs: 5, hits: 8, doubles: 2, triples: 1, homeRuns: 2, rbi: 6, stolenBases: 1, walks: 3, strikeouts: 7, avg: 0.348, obp: 0.423, slg: 0.696, ops: 1.119, war: 0.8 } as BattingStats,
  },
  {
    id: "p5", externalId: "mlb-543037", firstName: "Freddie", lastName: "Freeman",
    team: { id: "t3", name: "Dodgers", abbreviation: "LAD", primaryColor: "#005A9C" },
    position: "1B", bats: "L", throws: "R", number: 5, photoUrl: null, isActive: true,
    stats: { gamesPlayed: 6, atBats: 24, runs: 4, hits: 8, doubles: 3, triples: 0, homeRuns: 1, rbi: 7, stolenBases: 0, walks: 4, strikeouts: 3, avg: 0.333, obp: 0.429, slg: 0.542, ops: 0.971, war: 0.7 } as BattingStats,
  },
  {
    id: "p6", externalId: "mlb-621566", firstName: "Yordan", lastName: "Alvarez",
    team: { id: "t4", name: "Astros", abbreviation: "HOU", primaryColor: "#002D62" },
    position: "DH", bats: "L", throws: "R", number: 44, photoUrl: null, isActive: true,
    stats: { gamesPlayed: 6, atBats: 22, runs: 5, hits: 7, doubles: 1, triples: 0, homeRuns: 3, rbi: 9, stolenBases: 0, walks: 5, strikeouts: 6, avg: 0.318, obp: 0.444, slg: 0.727, ops: 1.171, war: 0.9 } as BattingStats,
  },
  {
    id: "p7", externalId: "mlb-608331", firstName: "Ronald", lastName: "Acuna Jr.",
    team: { id: "t5", name: "Braves", abbreviation: "ATL", primaryColor: "#CE1141" },
    position: "RF", bats: "R", throws: "R", number: 13, photoUrl: null, isActive: true,
    stats: { gamesPlayed: 6, atBats: 25, runs: 6, hits: 9, doubles: 2, triples: 1, homeRuns: 2, rbi: 4, stolenBases: 3, walks: 2, strikeouts: 5, avg: 0.360, obp: 0.407, slg: 0.680, ops: 1.087, war: 1.0 } as BattingStats,
  },
  {
    id: "p8", externalId: "mlb-669257", firstName: "Bobby", lastName: "Witt Jr.",
    team: { id: "t22", name: "Royals", abbreviation: "KC", primaryColor: "#004687" },
    position: "SS", bats: "R", throws: "R", number: 7, photoUrl: null, isActive: true,
    stats: { gamesPlayed: 7, atBats: 30, runs: 5, hits: 11, doubles: 3, triples: 1, homeRuns: 1, rbi: 5, stolenBases: 4, walks: 2, strikeouts: 4, avg: 0.367, obp: 0.406, slg: 0.567, ops: 0.973, war: 0.8 } as BattingStats,
  },
  // Pitchers
  {
    id: "p9", externalId: "mlb-477132", firstName: "Gerrit", lastName: "Cole",
    team: { id: "t1", name: "Yankees", abbreviation: "NYY", primaryColor: "#003087" },
    position: "SP", bats: "R", throws: "R", number: 45, photoUrl: null, isActive: true,
    stats: { wins: 1, losses: 0, era: 2.25, games: 1, gamesStarted: 1, saves: 0, inningsPitched: 8, hits: 5, runs: 2, earnedRuns: 2, walks: 1, strikeouts: 10, whip: 0.75, kPer9: 11.25, fip: 2.80, war: 0.5 } as PitchingStats,
  },
  {
    id: "p10", externalId: "mlb-694973", firstName: "Paul", lastName: "Skenes",
    team: { id: "t28", name: "Pirates", abbreviation: "PIT", primaryColor: "#27251F" },
    position: "SP", bats: "R", throws: "R", number: 30, photoUrl: null, isActive: true,
    stats: { wins: 1, losses: 0, era: 1.50, games: 1, gamesStarted: 1, saves: 0, inningsPitched: 6, hits: 3, runs: 1, earnedRuns: 1, walks: 2, strikeouts: 9, whip: 0.83, kPer9: 13.50, fip: 2.10, war: 0.4 } as PitchingStats,
  },
  {
    id: "p11", externalId: "mlb-675911", firstName: "Spencer", lastName: "Strider",
    team: { id: "t5", name: "Braves", abbreviation: "ATL", primaryColor: "#CE1141" },
    position: "SP", bats: "R", throws: "R", number: 99, photoUrl: null, isActive: true,
    stats: { wins: 1, losses: 0, era: 1.80, games: 1, gamesStarted: 1, saves: 0, inningsPitched: 5, hits: 2, runs: 1, earnedRuns: 1, walks: 1, strikeouts: 8, whip: 0.60, kPer9: 14.40, fip: 1.95, war: 0.4 } as PitchingStats,
  },
  {
    id: "p12", externalId: "mlb-571945", firstName: "Corbin", lastName: "Burnes",
    team: { id: "t8", name: "Orioles", abbreviation: "BAL", primaryColor: "#DF4601" },
    position: "SP", bats: "R", throws: "R", number: 39, photoUrl: null, isActive: true,
    stats: { wins: 1, losses: 0, era: 2.57, games: 1, gamesStarted: 1, saves: 0, inningsPitched: 7, hits: 5, runs: 2, earnedRuns: 2, walks: 1, strikeouts: 8, whip: 0.86, kPer9: 10.29, fip: 2.65, war: 0.4 } as PitchingStats,
  },
];

// ---------------------------------------------------------------------------
// PICKS
// ---------------------------------------------------------------------------
const MOCK_PICKS: Pick[] = [
  {
    id: "pk1",
    tipster: { id: "u1", username: "deepdive_mlb", displayName: "DeepDive MLB", avatar: null },
    game: { id: "g1", homeTeam: { abbreviation: "NYY", name: "Yankees" }, awayTeam: { abbreviation: "BOS", name: "Red Sox" }, date: "2026-04-04", status: "LIVE" },
    pickType: "MONEYLINE", selection: "NYY ML", odds: -150, stake: 150, analysis: "Yankees at home with Cole on the mound against a struggling Boston lineup. NYY bats have been hot early in the season, and the bullpen has been lockdown.", result: "PENDING", profit: 0, createdAt: "2026-04-04T12:00:00Z", resolvedAt: null,
  },
  {
    id: "pk2",
    tipster: { id: "u1", username: "deepdive_mlb", displayName: "DeepDive MLB", avatar: null },
    game: { id: "g4", homeTeam: { abbreviation: "ATL", name: "Braves" }, awayTeam: { abbreviation: "NYM", name: "Mets" }, date: "2026-04-04", status: "FINAL" },
    pickType: "RUNLINE", selection: "ATL -1.5", odds: +120, stake: 100, analysis: "Braves lineup has been crushing it at home. Strider on the mound should keep the Mets quiet.", result: "WIN", profit: 120, createdAt: "2026-04-04T10:00:00Z", resolvedAt: "2026-04-04T18:30:00Z",
  },
  {
    id: "pk3",
    tipster: { id: "u2", username: "el_analista", displayName: "El Analista", avatar: null },
    game: { id: "g5", homeTeam: { abbreviation: "PHI", name: "Phillies" }, awayTeam: { abbreviation: "MIA", name: "Marlins" }, date: "2026-04-04", status: "FINAL" },
    pickType: "TOTAL", selection: "Under 8", odds: -110, stake: 110, analysis: "Both pitchers have been effective early. Marlins offense ranks bottom-5 in runs scored. Low-scoring affair expected.", result: "WIN", profit: 100, createdAt: "2026-04-04T09:30:00Z", resolvedAt: "2026-04-04T18:15:00Z",
  },
  {
    id: "pk4",
    tipster: { id: "u2", username: "el_analista", displayName: "El Analista", avatar: null },
    game: { id: "g7", homeTeam: { abbreviation: "BAL", name: "Orioles" }, awayTeam: { abbreviation: "TB", name: "Rays" }, date: "2026-04-04", status: "FINAL" },
    pickType: "MONEYLINE", selection: "BAL ML", odds: -125, stake: 125, analysis: "Orioles have owned the Rays at Camden Yards. Burnes on the mound gives Baltimore a huge edge.", result: "WIN", profit: 100, createdAt: "2026-04-04T10:00:00Z", resolvedAt: "2026-04-04T18:20:00Z",
  },
  {
    id: "pk5",
    tipster: { id: "u3", username: "sabermetrics_pro", displayName: "Sabermetrics Pro", avatar: null },
    game: { id: "g2", homeTeam: { abbreviation: "LAD", name: "Dodgers" }, awayTeam: { abbreviation: "SF", name: "Giants" }, date: "2026-04-04", status: "LIVE" },
    pickType: "MONEYLINE", selection: "LAD ML", odds: -180, stake: 180, analysis: "Dodgers are the best team in baseball and the Giants have been inconsistent. Ohtani has been on a tear at the plate.", result: "PENDING", profit: 0, createdAt: "2026-04-04T14:00:00Z", resolvedAt: null,
  },
  {
    id: "pk6",
    tipster: { id: "u3", username: "sabermetrics_pro", displayName: "Sabermetrics Pro", avatar: null },
    game: { id: "g13", homeTeam: { abbreviation: "CIN", name: "Reds" }, awayTeam: { abbreviation: "WSH", name: "Nationals" }, date: "2026-04-04", status: "FINAL" },
    pickType: "RUNLINE", selection: "CIN -1.5", odds: -115, stake: 115, analysis: "Reds bats have come alive. Nationals pitching has been terrible with a 5.80 team ERA. Easy cover.", result: "WIN", profit: 100, createdAt: "2026-04-04T09:00:00Z", resolvedAt: "2026-04-04T18:00:00Z",
  },
  {
    id: "pk7",
    tipster: { id: "u1", username: "deepdive_mlb", displayName: "DeepDive MLB", avatar: null },
    game: { id: "g3", homeTeam: { abbreviation: "HOU", name: "Astros" }, awayTeam: { abbreviation: "TEX", name: "Rangers" }, date: "2026-04-04", status: "LIVE" },
    pickType: "TOTAL", selection: "Under 8", odds: -110, stake: 110, analysis: "Strong pitching matchup. Both starters have sub-3 ERAs. Minute Maid Park plays neutral for totals.", result: "PENDING", profit: 0, createdAt: "2026-04-04T12:00:00Z", resolvedAt: null,
  },
  {
    id: "pk8",
    tipster: { id: "u2", username: "el_analista", displayName: "El Analista", avatar: null },
    game: { id: "g11", homeTeam: { abbreviation: "STL", name: "Cardinals" }, awayTeam: { abbreviation: "PIT", name: "Pirates" }, date: "2026-04-04", status: "FINAL" },
    pickType: "MONEYLINE", selection: "STL ML", odds: -155, stake: 155, analysis: "Cardinals at home, historically dominant vs Pirates. Busch Stadium advantage.", result: "PUSH", profit: 0, createdAt: "2026-04-04T09:00:00Z", resolvedAt: "2026-04-04T19:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// TIPSTER LEADERBOARD
// ---------------------------------------------------------------------------
const MOCK_TIPSTERS: TipsterStats[] = [
  { id: "u1", username: "deepdive_mlb", displayName: "DeepDive MLB", avatar: null, currentStreak: 2, bestStreak: 7, totalPicks: 142, wins: 85, losses: 52, pushes: 5, winRate: 62.0, roi: 11.3, totalProfit: 1604, totalStaked: 14200 },
  { id: "u2", username: "el_analista", displayName: "El Analista", avatar: null, currentStreak: 3, bestStreak: 9, totalPicks: 198, wins: 118, losses: 72, pushes: 8, winRate: 62.1, roi: 9.8, totalProfit: 1940, totalStaked: 19800 },
  { id: "u3", username: "sabermetrics_pro", displayName: "Sabermetrics Pro", avatar: null, currentStreak: 1, bestStreak: 6, totalPicks: 110, wins: 62, losses: 44, pushes: 4, winRate: 58.5, roi: 7.2, totalProfit: 792, totalStaked: 11000 },
  { id: "u4", username: "vegas_sharp", displayName: "Vegas Sharp", avatar: null, currentStreak: 0, bestStreak: 8, totalPicks: 230, wins: 130, losses: 92, pushes: 8, winRate: 58.6, roi: 6.5, totalProfit: 1495, totalStaked: 23000 },
  { id: "u5", username: "diamond_picks", displayName: "Diamond Picks", avatar: null, currentStreak: 4, bestStreak: 5, totalPicks: 88, wins: 52, losses: 33, pushes: 3, winRate: 61.2, roi: 8.9, totalProfit: 783, totalStaked: 8800 },
];

// ---------------------------------------------------------------------------
// PUBLIC API FUNCTIONS
// ---------------------------------------------------------------------------

function delay(ms = 200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getGames(date?: string, status?: string): Promise<Game[]> {
  await delay();
  let games = MOCK_GAMES;
  if (date) games = games.filter((g) => g.date === date);
  if (status) games = games.filter((g) => g.status === status);
  return games;
}

export async function getGameById(id: string): Promise<Game | null> {
  await delay();
  return MOCK_GAMES.find((g) => g.id === id) ?? null;
}

export async function getTeamStandings(league?: string, division?: string): Promise<TeamStandings[]> {
  await delay();
  let standings = MOCK_STANDINGS;
  if (league) standings = standings.filter((s) => s.league === league);
  if (division) standings = standings.filter((s) => s.division === division);
  return standings.sort((a, b) => b.pct - a.pct);
}

export async function getPlayers(filters?: {
  team?: string;
  position?: string;
  search?: string;
}): Promise<Player[]> {
  await delay();
  let players: Player[] = MOCK_PLAYERS;
  if (filters?.team) players = players.filter((p) => p.team.abbreviation === filters.team);
  if (filters?.position) players = players.filter((p) => p.position === filters.position);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    players = players.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q)
    );
  }
  return players;
}

export async function getPlayerById(
  id: string
): Promise<(Player & { stats: BattingStats | PitchingStats }) | null> {
  await delay();
  return MOCK_PLAYERS.find((p) => p.id === id) ?? null;
}

export async function getPicks(filters?: {
  tipster?: string;
  result?: string;
  pickType?: string;
}): Promise<Pick[]> {
  await delay();
  let picks = MOCK_PICKS;
  if (filters?.tipster) picks = picks.filter((p) => p.tipster.username === filters.tipster);
  if (filters?.result) picks = picks.filter((p) => p.result === filters.result);
  if (filters?.pickType) picks = picks.filter((p) => p.pickType === filters.pickType);
  return picks;
}

export async function getTipsterLeaderboard(): Promise<TipsterStats[]> {
  await delay();
  return MOCK_TIPSTERS.sort((a, b) => b.roi - a.roi);
}
