// Shared save-predictions logic — takes today's predictions and persists
// them to Vercel Blob for later settling and ROI tracking.
//
// Idempotent: if predictions for today already exist, skips duplicates.

import { buildPredictions, predictionsToHistory, type PredictionHistoryEntry } from "./predictions";
import { readHistory, writeHistory } from "./settle";

export interface SaveResult {
  date: string;
  totalGames: number;
  predictionsSaved: number;
  predictionsSkipped: number;
  errors: number;
}

export async function saveTodaysPredictions(): Promise<SaveResult> {
  const report = await buildPredictions();
  const newEntries = predictionsToHistory(report);
  const history = await readHistory();

  const date = report.date;
  const existing = history[date] ?? [];
  const existingGamePks = new Set(existing.map((e) => e.gamePk));

  let saved = 0;
  let skipped = 0;

  for (const entry of newEntries) {
    if (existingGamePks.has(entry.gamePk)) {
      skipped++;
    } else {
      existing.push(entry);
      saved++;
    }
  }

  history[date] = existing;
  await writeHistory(history);

  return {
    date,
    totalGames: report.games.length,
    predictionsSaved: saved,
    predictionsSkipped: skipped,
    errors: 0,
  };
}
