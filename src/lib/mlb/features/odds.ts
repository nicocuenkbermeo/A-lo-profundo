// Feature 10 — Comparador de Cuotas.
//
// Starts with mock data (Opción C), structured to switch to The Odds API
// (Opción A) when ready. The mock JSON lives in public/data/odds-mock.json.
//
// Bookmakers included (legal LatAm): Betano, Betsson, Rivalo, Codere,
// Caliente (MX), Bet365.

import { readFile } from "node:fs/promises";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export const BOOKMAKERS = [
  "Betano",
  "Betsson",
  "Rivalo",
  "Codere",
  "Caliente",
  "Bet365",
] as const;

export type Bookmaker = (typeof BOOKMAKERS)[number];

export interface GameOdds {
  gamePk: number;
  homeTeam: string;
  awayTeam: string;
  moneyline: {
    home: Partial<Record<Bookmaker, number>>;
    away: Partial<Record<Bookmaker, number>>;
  };
  runLine: {
    home: { line: number; odds: Partial<Record<Bookmaker, number>> };
    away: { line: number; odds: Partial<Record<Bookmaker, number>> };
  };
  total: {
    line: number;
    over: Partial<Record<Bookmaker, number>>;
    under: Partial<Record<Bookmaker, number>>;
  };
  bestOdds: {
    home: { bookmaker: Bookmaker; odds: number } | null;
    away: { bookmaker: Bookmaker; odds: number } | null;
  };
}

export interface OddsReport {
  date: string;
  source: "mock" | "the-odds-api";
  games: GameOdds[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findBest(
  oddsMap: Partial<Record<Bookmaker, number>>,
): { bookmaker: Bookmaker; odds: number } | null {
  let best: { bookmaker: Bookmaker; odds: number } | null = null;
  for (const [bk, odds] of Object.entries(oddsMap)) {
    if (odds != null && (best === null || odds > best.odds)) {
      best = { bookmaker: bk as Bookmaker, odds };
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Mock loader
// ---------------------------------------------------------------------------

interface RawMockOdds {
  gamePk: number;
  homeTeam: string;
  awayTeam: string;
  moneyline: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
  runLine: {
    home: { line: number; odds: Record<string, number> };
    away: { line: number; odds: Record<string, number> };
  };
  total: {
    line: number;
    over: Record<string, number>;
    under: Record<string, number>;
  };
}

async function loadMockOdds(): Promise<GameOdds[]> {
  const filePath = join(process.cwd(), "public", "data", "odds-mock.json");
  const raw = await readFile(filePath, "utf-8");
  const data: RawMockOdds[] = JSON.parse(raw);

  return data.map((g) => ({
    gamePk: g.gamePk,
    homeTeam: g.homeTeam,
    awayTeam: g.awayTeam,
    moneyline: {
      home: g.moneyline.home as Partial<Record<Bookmaker, number>>,
      away: g.moneyline.away as Partial<Record<Bookmaker, number>>,
    },
    runLine: {
      home: {
        line: g.runLine.home.line,
        odds: g.runLine.home.odds as Partial<Record<Bookmaker, number>>,
      },
      away: {
        line: g.runLine.away.line,
        odds: g.runLine.away.odds as Partial<Record<Bookmaker, number>>,
      },
    },
    total: {
      line: g.total.line,
      over: g.total.over as Partial<Record<Bookmaker, number>>,
      under: g.total.under as Partial<Record<Bookmaker, number>>,
    },
    bestOdds: {
      home: findBest(g.moneyline.home as Partial<Record<Bookmaker, number>>),
      away: findBest(g.moneyline.away as Partial<Record<Bookmaker, number>>),
    },
  }));
}

// ---------------------------------------------------------------------------
// Public builder
// ---------------------------------------------------------------------------

const BOGOTA_TZ = "America/Bogota";

function todayBogota(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function buildOddsReport(): Promise<OddsReport> {
  // TODO: switch to The Odds API when ready
  // if (process.env.ODDS_API_KEY) return fetchFromOddsApi();

  const games = await loadMockOdds();

  return {
    date: todayBogota(),
    source: "mock",
    games,
    generatedAt: new Date().toISOString(),
  };
}
