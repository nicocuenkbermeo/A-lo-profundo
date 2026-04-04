import type { PickResult } from "@/types/pick";

/**
 * Calculate the current winning streak from an array of results (most recent first).
 * PUSH does not break the streak, only WIN continues it.
 * PENDING results are skipped.
 */
export function calculateCurrentStreak(results: PickResult[]): number {
  let streak = 0;
  for (const r of results) {
    if (r === "PENDING" || r === "VOID") continue;
    if (r === "PUSH") continue;
    if (r === "WIN") {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Calculate the best (longest) winning streak from an array of results (most recent first).
 * PUSH does not break the streak.
 */
export function calculateBestStreak(results: PickResult[]): number {
  let best = 0;
  let current = 0;
  for (const r of results) {
    if (r === "PENDING" || r === "VOID") continue;
    if (r === "PUSH") continue;
    if (r === "WIN") {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }
  return best;
}
