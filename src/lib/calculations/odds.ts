/**
 * Convert American odds to decimal odds.
 * Positive American: decimal = (odds / 100) + 1
 * Negative American: decimal = (100 / |odds|) + 1
 */
export function americanToDecimal(odds: number): number {
  if (odds > 0) {
    return odds / 100 + 1;
  }
  return 100 / Math.abs(odds) + 1;
}

/**
 * Convert decimal odds to American odds.
 * If decimal >= 2.0: American = (decimal - 1) * 100
 * If decimal < 2.0: American = -100 / (decimal - 1)
 */
export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2.0) {
    return Math.round((decimal - 1) * 100);
  }
  return Math.round(-100 / (decimal - 1));
}

/**
 * Convert American odds to implied probability (0-1).
 * Positive: prob = 100 / (odds + 100)
 * Negative: prob = |odds| / (|odds| + 100)
 */
export function americanToImpliedProbability(odds: number): number {
  if (odds > 0) {
    return 100 / (odds + 100);
  }
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

/**
 * Calculate profit from a bet.
 * Returns positive profit on win, negative stake on loss.
 */
export function calculateProfit(odds: number, stake: number, won: boolean): number {
  if (!won) return -stake;
  const decimal = americanToDecimal(odds);
  return Number(((decimal - 1) * stake).toFixed(2));
}
