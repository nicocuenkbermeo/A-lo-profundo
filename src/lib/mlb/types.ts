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
  };
}
