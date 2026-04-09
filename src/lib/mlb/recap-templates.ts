// Deterministic recap text templates for Feature 7 — Lo Profundo del Día.
// All text is generated from data via templates. No LLM involved.

import { type MomentOfDay } from "./features/moment-of-day";

// ---------------------------------------------------------------------------
// Headline generators
// ---------------------------------------------------------------------------

const HEADLINE_TEMPLATES = [
  (games: number, mvp: string) => `${games} juegos, una jornada intensa: ${mvp} se roba el show`,
  (games: number, mvp: string) => `Resumen de ${games} partidos — ${mvp} protagoniza el momento del día`,
  (games: number, mvp: string) => `Noche de ${games} juegos en la MLB con ${mvp} como figura`,
  (games: number, mvp: string) => `${mvp} ilumina una jornada de ${games} partidos en las Mayores`,
  (games: number, mvp: string) => `Jornada completa: ${games} juegos y ${mvp} como protagonista`,
];

function hashNum(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
  return h >>> 0;
}

export function generateHeadline(date: string, gameCount: number, mvpName: string): string {
  const idx = hashNum(date) % HEADLINE_TEMPLATES.length;
  return HEADLINE_TEMPLATES[idx](gameCount, mvpName);
}

// ---------------------------------------------------------------------------
// MVP blurb
// ---------------------------------------------------------------------------

export function generateMvpBlurb(moment: MomentOfDay): string {
  const score = moment.scoreSource === "captivatingIndex"
    ? `índice de drama ${Math.round(moment.score)}/100`
    : `impacto WPA de ${moment.score.toFixed(2)}`;
  return `${moment.batterName} protagonizó la jugada más dramática de la jornada en el ${moment.gameLabel} (${moment.contextEs}), con un ${score}. ${moment.descriptionEn}`;
}

// ---------------------------------------------------------------------------
// Upset blurb
// ---------------------------------------------------------------------------

export function generateUpsetBlurb(winner: string, loser: string, score: string): string {
  return `La sorpresa del día: ${winner} venció a ${loser} con marcador ${score}.`;
}
