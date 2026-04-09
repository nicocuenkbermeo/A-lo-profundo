/**
 * One-shot migration: adds modelVersion "1.0" to all prediction history
 * entries that don't already have a modelVersion field.
 *
 * Usage: npx tsx scripts/migrate-predictions-version.ts
 *
 * This script works with the local public/data/predictions-history.json.
 * For Vercel Blob, run the equivalent migration via the admin API.
 */

import fs from "node:fs";
import path from "node:path";

const HISTORY_PATH = path.join(process.cwd(), "public", "data", "predictions-history.json");

interface Entry {
  gamePk: number;
  pick: string;
  pickSide: string;
  confidence: number;
  homeTeam: string;
  awayTeam: string;
  actualWinner: string | null;
  result: string;
  modelVersion?: string;
}

const raw = fs.readFileSync(HISTORY_PATH, "utf-8");
const history: Record<string, Entry[]> = JSON.parse(raw);

let migrated = 0;
for (const entries of Object.values(history)) {
  for (const entry of entries) {
    if (!entry.modelVersion) {
      entry.modelVersion = "1.0";
      migrated++;
    }
  }
}

fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), "utf-8");
console.log(`Migration complete. ${migrated} entries updated to modelVersion "1.0".`);
