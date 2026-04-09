// MLB Stats API types.
//
// Convention: only type what we actually consume. The real API payloads are
// enormous and mostly irrelevant. For exploratory access, use `MLBRaw`.
//
// When a new feature needs new fields, extend the interfaces below — do NOT
// widen existing ones with optional "kitchen sink" fields.

/** Escape hatch for responses we haven't typed yet. */
export type MLBRaw = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Schedule (used by Feature 6 to find the last N games per team)
// ---------------------------------------------------------------------------

export interface ScheduleTeam {
  team: { id: number; name: string };
  score?: number;
  isWinner?: boolean;
}

export interface ScheduleGame {
  gamePk: number;
  gameDate: string; // ISO UTC
  status: {
    abstractGameState: "Preview" | "Live" | "Final" | string;
    detailedState: string;
    statusCode: string;
  };
  teams: {
    home: ScheduleTeam;
    away: ScheduleTeam;
  };
}

export interface ScheduleDate {
  date: string; // YYYY-MM-DD
  games: ScheduleGame[];
}

export interface ScheduleResponse {
  dates: ScheduleDate[];
}

// ---------------------------------------------------------------------------
// Live feed — pitching boxscore subset (used by Feature 6)
// ---------------------------------------------------------------------------
//
// We only need to know, for every pitcher in a game:
//   - who they are
//   - whether they started or relieved
//   - how many pitches they threw
//
// Everything else in liveData.boxscore is deliberately omitted.

export interface BoxscorePitchingStats {
  /** Total pitches thrown in this game. May be missing for very old games. */
  numberOfPitches?: number;
  /** Outs recorded × 1 — useful as a fallback when numberOfPitches is absent. */
  outs?: number;
  /** "0.1", "1.2", etc. */
  inningsPitched?: string;
}

export interface BoxscorePlayer {
  person: { id: number; fullName: string };
  position?: { abbreviation?: string; code?: string };
  /** Only present for players who appeared in this game. */
  stats?: {
    pitching?: BoxscorePitchingStats;
  };
  /** Season totals, useful as context. */
  seasonStats?: {
    pitching?: BoxscorePitchingStats;
  };
}

export interface BoxscoreTeam {
  team: { id: number; name: string };
  /** Map keyed as "ID<playerId>". */
  players: Record<string, BoxscorePlayer>;
  /** Numeric player ids that appeared as pitchers (starter first). */
  pitchers: number[];
}

// ---------------------------------------------------------------------------
// Standings (used by Feature 4 — Power Rankings)
// ---------------------------------------------------------------------------

export interface StandingSplitRecord {
  wins: number;
  losses: number;
  /** e.g. "lastTen", "home", "away". */
  type: string;
}

export interface StandingTeamRecord {
  team: { id: number; name: string };
  wins: number;
  losses: number;
  gamesPlayed: number;
  winningPercentage: string; // "0.612"
  runDifferential: number;
  streak?: { streakType: "wins" | "losses"; streakNumber: number; streakCode: string };
  records?: {
    splitRecords?: StandingSplitRecord[];
  };
}

export interface StandingsRecordsBlock {
  league: { id: number };
  division: { id: number };
  teamRecords: StandingTeamRecord[];
}

export interface StandingsResponse {
  records: StandingsRecordsBlock[];
}

// ---------------------------------------------------------------------------
// Team stats by date range (hitting / pitching) — Feature 4
// ---------------------------------------------------------------------------

export interface TeamStatsSplit {
  stat: {
    ops?: string; // "0.785"
    era?: string; // "3.42"
    avg?: string;
    obp?: string;
    slg?: string;
  };
  team?: { id: number };
}

export interface TeamStatsGroup {
  group: { displayName: string };
  splits: TeamStatsSplit[];
}

export interface TeamStatsResponse {
  stats: TeamStatsGroup[];
}

// ---------------------------------------------------------------------------
// Schedule with lineups (used by Feature 3 — Duelo del Día)
// ---------------------------------------------------------------------------

export interface ProbablePitcher {
  id: number;
  fullName: string;
}

export interface LineupPlayer {
  id: number;
  fullName: string;
}

export interface ScheduleGameWithLineups {
  gamePk: number;
  gameDate: string;
  status: { abstractGameState: string; detailedState: string; statusCode: string };
  teams: {
    home: {
      team: { id: number; name: string };
      probablePitcher?: ProbablePitcher;
      lineups?: { batters?: LineupPlayer[] };
    };
    away: {
      team: { id: number; name: string };
      probablePitcher?: ProbablePitcher;
      lineups?: { batters?: LineupPlayer[] };
    };
  };
}

export interface ScheduleWithLineupsResponse {
  dates: Array<{ date: string; games: ScheduleGameWithLineups[] }>;
}

// ---------------------------------------------------------------------------
// Batter vs Pitcher (used by Feature 3)
// ---------------------------------------------------------------------------

export interface VsPlayerSplit {
  stat: {
    atBats?: number;
    hits?: number;
    homeRuns?: number;
    strikeOuts?: number;
    avg?: string;
    ops?: string;
    rbi?: number;
    baseOnBalls?: number;
  };
  player?: { id: number; fullName: string };
}

export interface VsPlayerResponse {
  stats: Array<{
    group: { displayName: string };
    splits: VsPlayerSplit[];
  }>;
}

// ---------------------------------------------------------------------------
// Play-by-play (used by Feature 1 — Momento del Día, and later F3 + F7)
// ---------------------------------------------------------------------------

export interface PlayAbout {
  atBatIndex: number;
  halfInning: "top" | "bottom";
  isTopInning?: boolean;
  inning: number;
  isScoringPlay?: boolean;
  hasOut?: boolean;
  /** MLB-calculated drama metric, 0–100. Undefined for old games. */
  captivatingIndex?: number;
  homeScore?: number;
  awayScore?: number;
}

export interface PlayResult {
  type?: string;
  event?: string;
  eventType?: string;
  description: string;
  rbi?: number;
  awayScore?: number;
  homeScore?: number;
}

export interface PlayMatchup {
  batter?: { id: number; fullName: string };
  pitcher?: { id: number; fullName: string };
  postOnFirst?: { id: number; fullName: string };
  postOnSecond?: { id: number; fullName: string };
  postOnThird?: { id: number; fullName: string };
}

export interface PlayCount {
  balls?: number;
  strikes?: number;
  outs?: number;
}

export interface Play {
  about: PlayAbout;
  result: PlayResult;
  matchup: PlayMatchup;
  count?: PlayCount;
}

export interface LiveFeedResponse {
  gameData: {
    game: { pk: number };
    datetime: { dateTime: string };
    status: { abstractGameState: string; detailedState: string };
    teams: {
      home: { id: number; name: string };
      away: { id: number; name: string };
    };
  };
  liveData: {
    boxscore: {
      teams: {
        home: BoxscoreTeam;
        away: BoxscoreTeam;
      };
    };
    plays?: {
      allPlays?: Play[];
    };
  };
}
