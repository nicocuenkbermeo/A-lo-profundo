// Feature 11 — Alertas de Value Bets.
//
// Cruza el modelo de predicciones (F8) con las cuotas del mercado (F10).
// Una "value bet" existe cuando la probabilidad del modelo es mayor que
// la probabilidad implícita del mercado por al menos 5%.
//
// edge = modelProb - impliedProbMarket
// Es value si edge > 0.05

import { buildPredictions, type GamePrediction } from "./predictions";
import { buildOddsReport, type GameOdds } from "./odds";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ValueBet {
  gamePk: number;
  homeTeam: string;
  awayTeam: string;
  valueSide: "home" | "away";
  valueTeam: string;
  modelProb: number;
  marketImpliedProb: number;
  bestOdds: number;
  bestBookmaker: string;
  edge: number; // modelProb - marketImpliedProb
  edgeLevel: "high" | "medium"; // high >10%, medium 5-10%
  confidence: number;
  homePitcher: string | null;
  awayPitcher: string | null;
}

export interface ValueBetsReport {
  date: string;
  valueBets: ValueBet[];
  totalGamesAnalyzed: number;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export async function buildValueBets(): Promise<ValueBetsReport> {
  const [predictions, odds] = await Promise.all([
    buildPredictions(),
    buildOddsReport(),
  ]);

  const oddsMap = new Map<number, GameOdds>();
  for (const g of odds.games) {
    oddsMap.set(g.gamePk, g);
  }

  const valueBets: ValueBet[] = [];

  for (const pred of predictions.games) {
    if (pred.pending) continue;

    const gameOdds = oddsMap.get(pred.gamePk);
    if (!gameOdds) continue;

    // Check home side
    const homeBest = gameOdds.bestOdds.home;
    if (homeBest && homeBest.odds > 1) {
      const marketImplied = 1 / homeBest.odds;
      const edge = pred.prediction.homeWinProb - marketImplied;
      if (edge > 0.05) {
        valueBets.push({
          gamePk: pred.gamePk,
          homeTeam: pred.homeTeam.abbreviation,
          awayTeam: pred.awayTeam.abbreviation,
          valueSide: "home",
          valueTeam: pred.homeTeam.abbreviation,
          modelProb: pred.prediction.homeWinProb,
          marketImpliedProb: marketImplied,
          bestOdds: homeBest.odds,
          bestBookmaker: homeBest.bookmaker,
          edge,
          edgeLevel: edge > 0.10 ? "high" : "medium",
          confidence: pred.prediction.confidence,
          homePitcher: pred.homePitcher?.name ?? null,
          awayPitcher: pred.awayPitcher?.name ?? null,
        });
      }
    }

    // Check away side
    const awayBest = gameOdds.bestOdds.away;
    if (awayBest && awayBest.odds > 1) {
      const marketImplied = 1 / awayBest.odds;
      const edge = pred.prediction.awayWinProb - marketImplied;
      if (edge > 0.05) {
        valueBets.push({
          gamePk: pred.gamePk,
          homeTeam: pred.homeTeam.abbreviation,
          awayTeam: pred.awayTeam.abbreviation,
          valueSide: "away",
          valueTeam: pred.awayTeam.abbreviation,
          modelProb: pred.prediction.awayWinProb,
          marketImpliedProb: marketImplied,
          bestOdds: awayBest.odds,
          bestBookmaker: awayBest.bookmaker,
          edge,
          edgeLevel: edge > 0.10 ? "high" : "medium",
          confidence: pred.prediction.confidence,
          homePitcher: pred.homePitcher?.name ?? null,
          awayPitcher: pred.awayPitcher?.name ?? null,
        });
      }
    }
  }

  // Sort by edge descending
  valueBets.sort((a, b) => b.edge - a.edge);

  return {
    date: predictions.date,
    valueBets,
    totalGamesAnalyzed: predictions.games.length,
    generatedAt: new Date().toISOString(),
  };
}
