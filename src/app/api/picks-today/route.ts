// Public endpoint exposing today's high-confidence MLB picks
// for consumption by n8n / automation pipelines (e.g. @elpollo_apuestas).
//
// Filters:
// - Only non-pending predictions (pitcher data available)
// - Only `high` or `medium` confidence picks (the "green" ones)
// - Excludes live/final games (only Preview state = not yet started)
//
// Shape is optimized for downstream consumers that need to generate
// visual content: includes team abbreviations, names, MLB IDs (for logos),
// and the winning side with probability.

import { NextResponse } from "next/server";
import { buildPredictions } from "@/lib/mlb/features/predictions";

export const revalidate = 900; // 15 min

const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  ARI: { primary: "#A71930", secondary: "#E3D4AD" },
  ATL: { primary: "#CE1141", secondary: "#13274F" },
  BAL: { primary: "#DF4601", secondary: "#000000" },
  BOS: { primary: "#BD3039", secondary: "#0C2340" },
  CHC: { primary: "#0E3386", secondary: "#CC3433" },
  CHW: { primary: "#27251F", secondary: "#C4CED4" },
  CIN: { primary: "#C6011F", secondary: "#000000" },
  CLE: { primary: "#00385D", secondary: "#E50022" },
  COL: { primary: "#33006F", secondary: "#C4CED4" },
  DET: { primary: "#0C2340", secondary: "#FA4616" },
  HOU: { primary: "#002D62", secondary: "#EB6E1F" },
  KCR: { primary: "#004687", secondary: "#BD9B60" },
  LAA: { primary: "#BA0021", secondary: "#003263" },
  LAD: { primary: "#005A9C", secondary: "#EF3E42" },
  MIA: { primary: "#00A3E0", secondary: "#EF3340" },
  MIL: { primary: "#12284B", secondary: "#FFC52F" },
  MIN: { primary: "#002B5C", secondary: "#D31145" },
  NYM: { primary: "#002D72", secondary: "#FF5910" },
  NYY: { primary: "#003087", secondary: "#E4002C" },
  OAK: { primary: "#003831", secondary: "#EFB21E" },
  PHI: { primary: "#E81828", secondary: "#002D72" },
  PIT: { primary: "#FDB827", secondary: "#27251F" },
  SDP: { primary: "#2F241D", secondary: "#FFC425" },
  SEA: { primary: "#0C2C56", secondary: "#005C5C" },
  SFG: { primary: "#FD5A1E", secondary: "#27251F" },
  STL: { primary: "#C41E3A", secondary: "#0C2340" },
  TBR: { primary: "#092C5C", secondary: "#8FBCE6" },
  TEX: { primary: "#003278", secondary: "#C0111F" },
  TOR: { primary: "#134A8E", secondary: "#1D2D5C" },
  WSH: { primary: "#AB0003", secondary: "#14225A" },
};

export async function GET() {
  try {
    const report = await buildPredictions();

    const greenPicks = report.games
      .filter((g) => !g.pending && g.status === "Preview")
      .filter((g) => g.confidenceLevel === "high" || g.confidenceLevel === "medium")
      .sort((a, b) => b.prediction.confidence - a.prediction.confidence)
      .map((g) => {
        const winner = g.prediction.winner;
        const pickTeam = winner === "home" ? g.homeTeam : g.awayTeam;
        const fadeTeam = winner === "home" ? g.awayTeam : g.homeTeam;
        const colors = TEAM_COLORS[pickTeam.abbreviation] ?? {
          primary: "#0D2240",
          secondary: "#F5C842",
        };

        return {
          gamePk: g.gamePk,
          gameDate: g.gameDate,
          startTime: g.startTime,
          status: g.status,
          confidence: g.prediction.confidence,
          confidenceLevel: g.confidenceLevel,
          winProb: winner === "home" ? g.prediction.homeWinProb : g.prediction.awayWinProb,
          pick: {
            side: winner,
            teamId: pickTeam.id,
            abbr: pickTeam.abbreviation,
            name: pickTeam.name,
            colors,
          },
          fade: {
            teamId: fadeTeam.id,
            abbr: fadeTeam.abbreviation,
            name: fadeTeam.name,
          },
          pitchers: {
            home: g.homePitcher
              ? { id: g.homePitcher.id, name: g.homePitcher.name, era: g.homePitcher.era }
              : null,
            away: g.awayPitcher
              ? { id: g.awayPitcher.id, name: g.awayPitcher.name, era: g.awayPitcher.era }
              : null,
          },
          narrative: g.narrative,
          breakdown: g.breakdown,
        };
      });

    return NextResponse.json({
      success: true,
      date: report.date,
      generatedAt: report.generatedAt,
      totalGames: report.games.length,
      greenPicksCount: greenPicks.length,
      picks: greenPicks,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("[/api/picks-today] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to build picks" },
      { status: 500 },
    );
  }
}
