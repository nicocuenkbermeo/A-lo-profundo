export type GameStatus = "SCHEDULED" | "LIVE" | "FINAL" | "POSTPONED" | "CANCELLED";
export type InningHalf = "TOP" | "BOTTOM";

export interface GameInning {
  inningNumber: number;
  homeRuns: number;
  awayRuns: number;
}

export interface GameTeam {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Game {
  id: string;
  externalId: string;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  date: string;
  status: GameStatus;
  homeScore: number;
  awayScore: number;
  inning: number | null;
  inningHalf: InningHalf | null;
  outs: number;
  startTime: string;
  venue: string;
  innings: GameInning[];
  lines?: BettingLine[];
}

export interface BettingLine {
  id: string;
  source: string;
  homeMoneyline: number;
  awayMoneyline: number;
  runLineSpread: number;
  runLineHome: number;
  runLineAway: number;
  totalLine: number;
  overOdds: number;
  underOdds: number;
}
