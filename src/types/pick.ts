export type PickType = "MONEYLINE" | "RUNLINE" | "TOTAL" | "PROP" | "PARLAY";
export type PickResult = "PENDING" | "WIN" | "LOSS" | "PUSH" | "VOID";

export interface Pick {
  id: string;
  tipster: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
  game: {
    id: string;
    homeTeam: { abbreviation: string; name: string };
    awayTeam: { abbreviation: string; name: string };
    date: string;
    status: string;
  };
  pickType: PickType;
  selection: string;
  odds: number;
  stake: number;
  analysis: string;
  result: PickResult;
  profit: number;
  createdAt: string;
  resolvedAt: string | null;
}

export interface TipsterStats {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  currentStreak: number;
  bestStreak: number;
  totalPicks: number;
  wins: number;
  losses: number;
  pushes: number;
  winRate: number;
  roi: number;
  totalProfit: number;
  totalStaked: number;
}
