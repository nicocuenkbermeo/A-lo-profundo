// Shared settle logic — used by both /api/admin/settle-predictions and
// /api/cron/settle-predictions.

import { put, list } from "@vercel/blob";
import type { PredictionHistoryFile } from "./predictions";

const MLB_API = "https://statsapi.mlb.com/api/v1";
const BLOB_KEY = "predictions-history.json";

const TEAM_ID_TO_ABBR: Record<number, string> = {
  108: "LAA", 109: "ARI", 110: "BAL", 111: "BOS", 112: "CHC",
  113: "CIN", 114: "CLE", 115: "COL", 116: "DET", 117: "HOU",
  118: "KCR", 119: "LAD", 120: "WSH", 121: "NYM", 133: "OAK",
  134: "PIT", 135: "SDP", 136: "SEA", 137: "SFG", 138: "STL",
  139: "TBR", 140: "TEX", 141: "TOR", 142: "MIN", 143: "PHI",
  144: "ATL", 145: "CHW", 146: "MIA", 147: "NYY", 158: "MIL",
};

export interface SettleResult {
  totalChecked: number;
  settled: number;
  stillPending: number;
  errors: number;
}

export async function readHistory(): Promise<PredictionHistoryFile> {
  try {
    const blobs = await list({ prefix: BLOB_KEY });
    if (blobs.blobs.length === 0) return {};
    const res = await fetch(blobs.blobs[0].url);
    return (await res.json()) as PredictionHistoryFile;
  } catch {
    return {};
  }
}

export async function writeHistory(history: PredictionHistoryFile): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(history, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function settlePendingPredictions(): Promise<SettleResult> {
  const history = await readHistory();
  const todayStr = new Date().toISOString().slice(0, 10);
  let totalChecked = 0;
  let settled = 0;
  let stillPending = 0;
  let errors = 0;

  for (const [date, entries] of Object.entries(history)) {
    if (date >= todayStr) continue;

    const pendingEntries = entries.filter((e) => e.result === "pending");
    if (pendingEntries.length === 0) continue;
    totalChecked += pendingEntries.length;

    try {
      const schedRes = await fetch(
        `${MLB_API}/schedule?sportId=1&date=${date}&hydrate=linescore,team`,
      );
      if (!schedRes.ok) {
        errors++;
        stillPending += pendingEntries.length;
        continue;
      }
      const schedData = await schedRes.json();
      const games: Array<{
        gamePk: number;
        status: { abstractGameState: string };
        teams: {
          home: { team: { id: number }; score?: number };
          away: { team: { id: number }; score?: number };
        };
      }> = (schedData.dates ?? []).flatMap(
        (d: { games: unknown[] }) => d.games,
      );

      for (const entry of pendingEntries) {
        const game = games.find((g) => g.gamePk === entry.gamePk);
        if (!game || game.status.abstractGameState !== "Final") {
          stillPending++;
          continue;
        }

        const homeScore = game.teams.home.score ?? 0;
        const awayScore = game.teams.away.score ?? 0;
        const winnerAbbr =
          homeScore > awayScore
            ? TEAM_ID_TO_ABBR[game.teams.home.team.id] ?? ""
            : TEAM_ID_TO_ABBR[game.teams.away.team.id] ?? "";

        entry.actualWinner = winnerAbbr;
        entry.result = entry.pick === winnerAbbr ? "win" : "loss";
        settled++;
      }
    } catch {
      errors++;
      stillPending += pendingEntries.length;
    }
  }

  await writeHistory(history);

  return { totalChecked, settled, stillPending, errors };
}
