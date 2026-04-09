// Spanish translations and helpers for MLB domain text.
//
// Shared by Feature 1 (Momento del Día), Feature 3 (Duelo del Día) and
// Feature 7 (Lo Profundo del Día). Add new maps here instead of scattering
// inline translations across feature files.

// ---------------------------------------------------------------------------
// Countries (used by Feature 2 — Latino Tracker)
// ---------------------------------------------------------------------------

export interface CountryEntry {
  code: string; // ISO-ish short code we use internally
  spanish: string;
  flag: string; // emoji
}

export const COUNTRIES_ES: Record<string, CountryEntry> = {
  "Dominican Republic": { code: "dom", spanish: "República Dominicana", flag: "🇩🇴" },
  Venezuela: { code: "ven", spanish: "Venezuela", flag: "🇻🇪" },
  Cuba: { code: "cub", spanish: "Cuba", flag: "🇨🇺" },
  Mexico: { code: "mex", spanish: "México", flag: "🇲🇽" },
  Colombia: { code: "col", spanish: "Colombia", flag: "🇨🇴" },
  "Puerto Rico": { code: "pur", spanish: "Puerto Rico", flag: "🇵🇷" },
  Panama: { code: "pan", spanish: "Panamá", flag: "🇵🇦" },
  Nicaragua: { code: "nic", spanish: "Nicaragua", flag: "🇳🇮" },
};

// ---------------------------------------------------------------------------
// Positions
// ---------------------------------------------------------------------------

export const POSITIONS_ES: Record<string, string> = {
  "Starting Pitcher": "Abridor",
  "Relief Pitcher": "Relevista",
  Pitcher: "Pitcher",
  Catcher: "Receptor",
  "First Baseman": "Primera base",
  "Second Baseman": "Segunda base",
  "Third Baseman": "Tercera base",
  Shortstop: "Campocorto",
  "Left Fielder": "Jardinero izquierdo",
  "Center Fielder": "Jardinero central",
  "Right Fielder": "Jardinero derecho",
  "Designated Hitter": "Bateador designado",
  Outfielder: "Jardinero",
  Infielder: "Infielder",
};

// ---------------------------------------------------------------------------
// Play context helpers
// ---------------------------------------------------------------------------

function ordinalEs(n: number): string {
  return `${n}°`;
}

/** "top" / "bottom" → "Alta" / "Cierre" */
export function translateHalfInning(half: "top" | "bottom" | string): string {
  if (half === "bottom") return "Cierre";
  return "Alta";
}

/** outs 0/1/2 → "sin outs" / "1 out" / "2 outs" */
export function translateOuts(outs?: number | null): string {
  if (outs == null) return "";
  if (outs === 0) return "sin outs";
  if (outs === 1) return "1 out";
  return `${outs} outs`;
}

/**
 * Describe runners on base from a play's post-state map.
 * We accept the three `postOn*` fields (which after a play contain the
 * runners who ended on that base, or undefined if empty). The caller should
 * pass the PREVIOUS play's state when it wants the pre-play situation.
 */
export function translateRunners(state: {
  first?: unknown;
  second?: unknown;
  third?: unknown;
}): string {
  const occ = [!!state.first, !!state.second, !!state.third] as const;
  const count = occ.filter(Boolean).length;
  if (count === 0) return "bases limpias";
  if (count === 3) return "bases llenas";
  if (occ[0] && occ[2]) return "corredores en las esquinas";
  if (occ[1] && occ[2]) return "corredores en segunda y tercera";
  if (occ[0] && occ[1]) return "corredores en primera y segunda";
  if (occ[0]) return "corredor en primera";
  if (occ[1]) return "corredor en segunda";
  if (occ[2]) return "corredor en tercera";
  return "";
}

/**
 * Full context line like "Cierre del 9°, 2 outs, corredores en las esquinas".
 * Any missing piece is omitted gracefully.
 */
export function translatePlayContext(input: {
  halfInning: "top" | "bottom" | string;
  inning: number;
  outs?: number | null;
  runners?: { first?: unknown; second?: unknown; third?: unknown };
}): string {
  const parts: string[] = [];
  parts.push(`${translateHalfInning(input.halfInning)} del ${ordinalEs(input.inning)}`);
  const outsText = translateOuts(input.outs);
  if (outsText) parts.push(outsText);
  if (input.runners) {
    const runnersText = translateRunners(input.runners);
    if (runnersText) parts.push(runnersText);
  }
  return parts.join(", ");
}

// ---------------------------------------------------------------------------
// Chase for History — milestone labels (Feature 5, reused by F7)
// ---------------------------------------------------------------------------

export const CHASE_LABELS = {
  hr50: "Camino a 50 HR",
  sb50: "Camino a 50 bases robadas",
  wins20: "Camino a 20 victorias",
  avg300: "Persecución de .300",
  hitStreak: "Racha de juegos con hit",
  obStreak: "Racha de juegos embasándose",
  scorelessStreak: "Innings en blanco consecutivos",
} as const;

export const CHASE_EARLY_SEASON_MSG =
  "Las proyecciones se activan a partir del juego 40 de la temporada. Las rachas activas sí se muestran desde el día 1.";

// ---------------------------------------------------------------------------
// Player photo URL helper
// ---------------------------------------------------------------------------

/**
 * Standard MLB headshot. The path 404s to a neutral silhouette if the id is
 * unknown, but we still return a placeholder locally so the UI never breaks.
 */
export function playerHeadshotUrl(personId: number | null | undefined, size = 180): string {
  if (!personId) return "/logos/MLB.png"; // fallback — ships with the repo
  return `https://img.mlbstatic.com/mlb-photos/image/upload/w_${size},q_100/v1/people/${personId}/headshot/67/current`;
}
