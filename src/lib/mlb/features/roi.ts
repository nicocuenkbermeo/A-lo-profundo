// Feature 9 — Tracking Histórico de ROI.
//
// Reads predictions history from Vercel Blob and computes:
//   - Total picks settled, win rate
//   - Theoretical ROI (using model confidence as implied odds + 5% margin)
//   - Current streak
//   - Breakdown by confidence level (high/medium/low)
//   - Monthly performance
//
// Edge case: if <20 picks settled, returns earlyState = true so the page
// shows "Construyendo historial" instead of misleading stats.

import { list } from "@vercel/blob";
import type { PredictionHistoryEntry } from "./predictions";

const BLOB_KEY = "predictions-history.json";
const MIN_PICKS_FOR_DISPLAY = 20;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface RoiByConfidence {
  level: "high" | "medium" | "low";
  label: string;
  picks: number;
  wins: number;
  winRate: number;
  roi: number;
}

export interface MonthlyPerformance {
  month: string; // "2026-04"
  label: string; // "Abril 2026"
  picks: number;
  wins: number;
  winRate: number;
  roi: number;
  cumulativeRoi: number;
}

export interface RoiReport {
  earlyState: boolean;
  totalPicks: number;
  settledPicks: number;
  wins: number;
  losses: number;
  winRate: number;
  theoreticalRoi: number;
  currentStreak: { type: "W" | "L"; count: number };
  byConfidence: RoiByConfidence[];
  monthly: MonthlyPerformance[];
  recentPicks: SettledPick[];
  bestMonth: MonthlyPerformance | null;
  generatedAt: string;
}

export interface SettledPick {
  date: string;
  gamePk: number;
  pick: string;
  confidence: number;
  homeTeam: string;
  awayTeam: string;
  actualWinner: string;
  result: "win" | "loss";
  profit: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeProfit(entry: PredictionHistoryEntry): number {
  const stake = 100;
  // Assumed odds from model confidence with 5% house margin
  const assumedDecimalOdds = 1 / entry.confidence - 0.05;
  if (entry.result === "win") {
    return stake * (Math.max(assumedDecimalOdds, 1.01) - 1);
  }
  return -stake;
}

function confidenceLevel(conf: number): "high" | "medium" | "low" {
  if (conf >= 0.65) return "high";
  if (conf >= 0.55) return "medium";
  return "low";
}

const CONFIDENCE_LABELS: Record<string, string> = {
  high: "Alta (>65%)",
  medium: "Media (55-65%)",
  low: "Baja (<55%)",
};

const MONTH_NAMES: Record<string, string> = {
  "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
  "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
  "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre",
};

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

export async function buildRoiReport(): Promise<RoiReport> {
  // Read history from Vercel Blob
  let history: Record<string, PredictionHistoryEntry[]> = {};
  try {
    const blobs = await list({ prefix: BLOB_KEY });
    if (blobs.blobs.length > 0) {
      const res = await fetch(blobs.blobs[0].url);
      history = await res.json();
    }
  } catch {
    // Empty history on error
  }

  // Flatten all settled entries
  const allSettled: Array<PredictionHistoryEntry & { date: string }> = [];
  for (const [date, entries] of Object.entries(history)) {
    for (const entry of entries) {
      if (entry.result === "win" || entry.result === "loss") {
        allSettled.push({ ...entry, date });
      }
    }
  }

  // Sort by date ascending
  allSettled.sort((a, b) => a.date.localeCompare(b.date));

  const totalPicks = Object.values(history).flat().length;
  const settledPicks = allSettled.length;
  const earlyState = settledPicks < MIN_PICKS_FOR_DISPLAY;

  const wins = allSettled.filter((e) => e.result === "win").length;
  const losses = settledPicks - wins;
  const winRate = settledPicks > 0 ? wins / settledPicks : 0;

  // ROI calculation
  const settledWithProfit: SettledPick[] = allSettled.map((e) => ({
    date: e.date,
    gamePk: e.gamePk,
    pick: e.pick,
    confidence: e.confidence,
    homeTeam: e.homeTeam,
    awayTeam: e.awayTeam,
    actualWinner: e.actualWinner ?? "",
    result: e.result as "win" | "loss",
    profit: computeProfit(e),
  }));

  const totalStake = settledPicks * 100;
  const totalProfit = settledWithProfit.reduce((sum, p) => sum + p.profit, 0);
  const theoreticalRoi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;

  // Current streak
  let streakType: "W" | "L" = "W";
  let streakCount = 0;
  for (let i = allSettled.length - 1; i >= 0; i--) {
    const r = allSettled[i].result === "win" ? "W" : "L";
    if (i === allSettled.length - 1) {
      streakType = r;
      streakCount = 1;
    } else if (r === streakType) {
      streakCount++;
    } else {
      break;
    }
  }

  // By confidence level
  const byConfMap = new Map<string, { picks: number; wins: number; profit: number }>();
  for (const level of ["high", "medium", "low"]) {
    byConfMap.set(level, { picks: 0, wins: 0, profit: 0 });
  }
  for (const p of settledWithProfit) {
    const level = confidenceLevel(p.confidence);
    const bucket = byConfMap.get(level)!;
    bucket.picks++;
    if (p.result === "win") bucket.wins++;
    bucket.profit += p.profit;
  }
  const byConfidence: RoiByConfidence[] = ["high", "medium", "low"].map((level) => {
    const b = byConfMap.get(level)!;
    return {
      level: level as "high" | "medium" | "low",
      label: CONFIDENCE_LABELS[level],
      picks: b.picks,
      wins: b.wins,
      winRate: b.picks > 0 ? b.wins / b.picks : 0,
      roi: b.picks > 0 ? (b.profit / (b.picks * 100)) * 100 : 0,
    };
  });

  // Monthly performance
  const monthMap = new Map<string, { picks: number; wins: number; profit: number }>();
  for (const p of settledWithProfit) {
    const month = p.date.slice(0, 7); // "2026-04"
    if (!monthMap.has(month)) monthMap.set(month, { picks: 0, wins: 0, profit: 0 });
    const b = monthMap.get(month)!;
    b.picks++;
    if (p.result === "win") b.wins++;
    b.profit += p.profit;
  }
  const months = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b));

  let cumProfit = 0;
  let cumStake = 0;
  const monthly: MonthlyPerformance[] = months.map(([month, b]) => {
    cumProfit += b.profit;
    cumStake += b.picks * 100;
    const [year, mm] = month.split("-");
    return {
      month,
      label: `${MONTH_NAMES[mm] ?? mm} ${year}`,
      picks: b.picks,
      wins: b.wins,
      winRate: b.picks > 0 ? b.wins / b.picks : 0,
      roi: b.picks > 0 ? (b.profit / (b.picks * 100)) * 100 : 0,
      cumulativeRoi: cumStake > 0 ? (cumProfit / cumStake) * 100 : 0,
    };
  });

  const bestMonth = monthly.length > 0
    ? monthly.reduce((best, m) => (m.roi > best.roi ? m : best), monthly[0])
    : null;

  // Recent picks (last 30, newest first)
  const recentPicks = settledWithProfit.slice(-30).reverse();

  return {
    earlyState,
    totalPicks,
    settledPicks,
    wins,
    losses,
    winRate,
    theoreticalRoi,
    currentStreak: { type: streakType, count: streakCount },
    byConfidence,
    monthly,
    recentPicks,
    bestMonth,
    generatedAt: new Date().toISOString(),
  };
}
