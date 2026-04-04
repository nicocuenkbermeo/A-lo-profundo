import type { PickResult } from "@/types/pick";

export function calculateRecord(results: PickResult[]): {
  wins: number;
  losses: number;
  pushes: number;
} {
  let wins = 0;
  let losses = 0;
  let pushes = 0;
  for (const r of results) {
    if (r === "WIN") wins++;
    else if (r === "LOSS") losses++;
    else if (r === "PUSH") pushes++;
  }
  return { wins, losses, pushes };
}

/**
 * Win rate as a percentage (0-100). Pushes excluded from denominator.
 */
export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Number(((wins / total) * 100).toFixed(1));
}

/**
 * Return on investment as a percentage.
 */
export function calculateROI(totalProfit: number, totalStaked: number): number {
  if (totalStaked === 0) return 0;
  return Number(((totalProfit / totalStaked) * 100).toFixed(1));
}
