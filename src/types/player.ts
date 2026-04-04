export type Position = "C" | "1B" | "2B" | "3B" | "SS" | "LF" | "CF" | "RF" | "DH" | "SP" | "RP" | "CL";
export type BatSide = "L" | "R" | "S";
export type ThrowHand = "L" | "R";

export interface Player {
  id: string;
  externalId: string;
  firstName: string;
  lastName: string;
  team: { id: string; name: string; abbreviation: string; primaryColor: string };
  position: string;
  bats: BatSide;
  throws: ThrowHand;
  number: number;
  photoUrl: string | null;
  isActive: boolean;
}

export interface BattingStats {
  gamesPlayed: number;
  atBats: number;
  runs: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  stolenBases: number;
  walks: number;
  strikeouts: number;
  avg: number;
  obp: number;
  slg: number;
  ops: number;
  war: number;
}

export interface PitchingStats {
  wins: number;
  losses: number;
  era: number;
  games: number;
  gamesStarted: number;
  saves: number;
  inningsPitched: number;
  hits: number;
  runs: number;
  earnedRuns: number;
  walks: number;
  strikeouts: number;
  whip: number;
  kPer9: number;
  fip: number;
  war: number;
}

export interface TeamStandings {
  id: string;
  name: string;
  abbreviation: string;
  primaryColor: string;
  wins: number;
  losses: number;
  pct: number;
  runsScored: number;
  runsAllowed: number;
  diff: number;
  home: string;
  away: string;
  last10: string;
  streak: string;
  league: string;
  division: string;
}
