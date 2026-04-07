// Centralized mock MLB data for the entire app.
// 15 games per day, mix of LIVE / FINAL / SCHEDULED.
// All 30 teams represented across the schedule.

import type { Game } from "@/types/game";

const baseTeam = { id: "", externalId: "", logoUrl: "", secondaryColor: "" } as const;

const TEAMS: Record<string, { id: string; name: string; abbreviation: string; city: string; primaryColor: string }> = {
  NYY: { id: "nyy", name: "Yankees", abbreviation: "NYY", city: "New York", primaryColor: "#003087" },
  BOS: { id: "bos", name: "Red Sox", abbreviation: "BOS", city: "Boston", primaryColor: "#BD3039" },
  BAL: { id: "bal", name: "Orioles", abbreviation: "BAL", city: "Baltimore", primaryColor: "#DF4601" },
  TBR: { id: "tbr", name: "Rays", abbreviation: "TBR", city: "Tampa Bay", primaryColor: "#092C5C" },
  TOR: { id: "tor", name: "Blue Jays", abbreviation: "TOR", city: "Toronto", primaryColor: "#134A8E" },
  CLE: { id: "cle", name: "Guardians", abbreviation: "CLE", city: "Cleveland", primaryColor: "#00385D" },
  CHW: { id: "chw", name: "White Sox", abbreviation: "CHW", city: "Chicago", primaryColor: "#27251F" },
  DET: { id: "det", name: "Tigers", abbreviation: "DET", city: "Detroit", primaryColor: "#0C2340" },
  KCR: { id: "kcr", name: "Royals", abbreviation: "KCR", city: "Kansas City", primaryColor: "#004687" },
  MIN: { id: "min", name: "Twins", abbreviation: "MIN", city: "Minnesota", primaryColor: "#002B5C" },
  HOU: { id: "hou", name: "Astros", abbreviation: "HOU", city: "Houston", primaryColor: "#002D62" },
  LAA: { id: "laa", name: "Angels", abbreviation: "LAA", city: "Los Angeles", primaryColor: "#BA0021" },
  OAK: { id: "oak", name: "Athletics", abbreviation: "OAK", city: "Oakland", primaryColor: "#003831" },
  SEA: { id: "sea", name: "Mariners", abbreviation: "SEA", city: "Seattle", primaryColor: "#0C2C56" },
  TEX: { id: "tex", name: "Rangers", abbreviation: "TEX", city: "Texas", primaryColor: "#003278" },
  ATL: { id: "atl", name: "Braves", abbreviation: "ATL", city: "Atlanta", primaryColor: "#CE1141" },
  MIA: { id: "mia", name: "Marlins", abbreviation: "MIA", city: "Miami", primaryColor: "#00A3E0" },
  NYM: { id: "nym", name: "Mets", abbreviation: "NYM", city: "New York", primaryColor: "#002D72" },
  PHI: { id: "phi", name: "Phillies", abbreviation: "PHI", city: "Philadelphia", primaryColor: "#E81828" },
  WSH: { id: "wsh", name: "Nationals", abbreviation: "WSH", city: "Washington", primaryColor: "#AB0003" },
  CHC: { id: "chc", name: "Cubs", abbreviation: "CHC", city: "Chicago", primaryColor: "#0E3386" },
  CIN: { id: "cin", name: "Reds", abbreviation: "CIN", city: "Cincinnati", primaryColor: "#C6011F" },
  MIL: { id: "mil", name: "Brewers", abbreviation: "MIL", city: "Milwaukee", primaryColor: "#12284B" },
  PIT: { id: "pit", name: "Pirates", abbreviation: "PIT", city: "Pittsburgh", primaryColor: "#FDB827" },
  STL: { id: "stl", name: "Cardinals", abbreviation: "STL", city: "St. Louis", primaryColor: "#C41E3A" },
  ARI: { id: "ari", name: "D-backs", abbreviation: "ARI", city: "Arizona", primaryColor: "#A71930" },
  COL: { id: "col", name: "Rockies", abbreviation: "COL", city: "Colorado", primaryColor: "#33006F" },
  LAD: { id: "lad", name: "Dodgers", abbreviation: "LAD", city: "Los Angeles", primaryColor: "#005A9C" },
  SDP: { id: "sdp", name: "Padres", abbreviation: "SDP", city: "San Diego", primaryColor: "#2F241D" },
  SFG: { id: "sfg", name: "Giants", abbreviation: "SFG", city: "San Francisco", primaryColor: "#FD5A1E" },
};

function team(abbr: string) {
  return { ...baseTeam, ...TEAMS[abbr] };
}

interface GameInput {
  away: string;
  home: string;
  status: "LIVE" | "FINAL" | "SCHEDULED";
  awayScore?: number;
  homeScore?: number;
  inning?: number;
  inningHalf?: "TOP" | "BOTTOM";
  outs?: number;
  startTime: string;
  venue: string;
}

// 15 games covering all 30 MLB teams (each team plays once)
const SCHEDULE: GameInput[] = [
  // LIVE GAMES
  { away: "NYY", home: "BOS", status: "LIVE", awayScore: 4, homeScore: 2, inning: 6, inningHalf: "TOP", outs: 1, startTime: "1:05 PM", venue: "Fenway Park" },
  { away: "ATL", home: "NYM", status: "LIVE", awayScore: 3, homeScore: 1, inning: 4, inningHalf: "BOTTOM", outs: 2, startTime: "1:10 PM", venue: "Citi Field" },
  { away: "LAD", home: "SFG", status: "LIVE", awayScore: 5, homeScore: 5, inning: 8, inningHalf: "TOP", outs: 0, startTime: "3:45 PM", venue: "Oracle Park" },
  { away: "CHC", home: "MIL", status: "LIVE", awayScore: 2, homeScore: 4, inning: 7, inningHalf: "BOTTOM", outs: 1, startTime: "2:40 PM", venue: "American Family Field" },
  { away: "HOU", home: "TEX", status: "LIVE", awayScore: 1, homeScore: 0, inning: 3, inningHalf: "TOP", outs: 2, startTime: "4:10 PM", venue: "Globe Life Field" },

  // FINAL GAMES (earlier today)
  { away: "TOR", home: "BAL", status: "FINAL", awayScore: 3, homeScore: 7, inning: 9, startTime: "12:35 PM", venue: "Camden Yards" },
  { away: "DET", home: "CLE", status: "FINAL", awayScore: 2, homeScore: 5, inning: 9, startTime: "12:10 PM", venue: "Progressive Field" },
  { away: "TBR", home: "MIN", status: "FINAL", awayScore: 6, homeScore: 4, inning: 9, startTime: "12:40 PM", venue: "Target Field" },
  { away: "CHW", home: "KCR", status: "FINAL", awayScore: 1, homeScore: 8, inning: 9, startTime: "1:10 PM", venue: "Kauffman Stadium" },
  { away: "STL", home: "CIN", status: "FINAL", awayScore: 4, homeScore: 3, inning: 10, startTime: "12:35 PM", venue: "Great American Ball Park" },

  // SCHEDULED GAMES (tonight)
  { away: "PHI", home: "WSH", status: "SCHEDULED", startTime: "7:05 PM", venue: "Nationals Park" },
  { away: "MIA", home: "PIT", status: "SCHEDULED", startTime: "7:10 PM", venue: "PNC Park" },
  { away: "SEA", home: "OAK", status: "SCHEDULED", startTime: "9:40 PM", venue: "Oakland Coliseum" },
  { away: "LAA", home: "ARI", status: "SCHEDULED", startTime: "9:40 PM", venue: "Chase Field" },
  { away: "COL", home: "SDP", status: "SCHEDULED", startTime: "9:40 PM", venue: "Petco Park" },
];

export function getTodaysGames(): Game[] {
  const today = new Date().toISOString().split("T")[0];
  return SCHEDULE.map((g, i) => ({
    id: `mlb-${i + 1}`,
    externalId: `mlb-${i + 1}`,
    homeTeam: team(g.home),
    awayTeam: team(g.away),
    date: today,
    status: g.status,
    homeScore: g.homeScore ?? 0,
    awayScore: g.awayScore ?? 0,
    inning: g.inning ?? null,
    inningHalf: g.inningHalf ?? null,
    outs: g.outs ?? 0,
    startTime: g.startTime,
    venue: g.venue,
    innings: [],
  }));
}

export function getGameById(id: string): Game | null {
  return getTodaysGames().find((g) => g.id === id) ?? null;
}
