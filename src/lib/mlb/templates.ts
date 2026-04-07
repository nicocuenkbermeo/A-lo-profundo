// Deterministic narrative templates for auto-generated text.
//
// Rules:
//   - Never use an LLM. All text comes from these arrays.
//   - At least 5 variants per scenario so weekly snapshots don't read robotic.
//   - Selection is a deterministic hash of (teamId + weekStart) so the same
//     team on the same week always gets the same copy, but different teams
//     look varied.

export interface RankingNarrativeInput {
  teamId: number;
  teamName: string;
  weekStart: string; // YYYY-MM-DD
  movement: number; // positive = climbed, negative = dropped, 0 = same
  record: string; // "24-14"
  last10: string; // "7-3"
  ops: number; // 0.742
  era: number; // 3.18
  streakCode?: string; // "W3", "L2"
}

// ----- Variant pools ---------------------------------------------------------

const UP_TEMPLATES: ((i: RankingNarrativeInput) => string)[] = [
  (i) => `Los ${i.teamName} suben ${Math.abs(i.movement)} puesto${Math.abs(i.movement) === 1 ? "" : "s"} esta semana con récord reciente de ${i.last10} y OPS de equipo en ${i.ops.toFixed(3)}.`,
  (i) => `Semana sólida para ${i.teamName}: trepan ${Math.abs(i.movement)} lugar${Math.abs(i.movement) === 1 ? "" : "es"} en el ranking gracias a una rotación con ERA de ${i.era.toFixed(2)}.`,
  (i) => `${i.teamName} escalan ${Math.abs(i.movement)} posición${Math.abs(i.movement) === 1 ? "" : "es"}. Los números recientes (${i.last10} en últimos 10, OPS ${i.ops.toFixed(3)}) avalan el salto.`,
  (i) => `Movimiento al alza para ${i.teamName} (+${Math.abs(i.movement)}). Van ${i.last10} en su tramo corto y la ofensiva responde con ${i.ops.toFixed(3)} de OPS.`,
  (i) => `${i.teamName} ganan terreno: suben ${Math.abs(i.movement)} y mantienen la presión con récord general ${i.record}.`,
];

const DOWN_TEMPLATES: ((i: RankingNarrativeInput) => string)[] = [
  (i) => `Los ${i.teamName} caen ${Math.abs(i.movement)} puesto${Math.abs(i.movement) === 1 ? "" : "s"} tras un tramo irregular (${i.last10} en últimos 10).`,
  (i) => `Semana para olvidar de ${i.teamName}: bajan ${Math.abs(i.movement)} lugar${Math.abs(i.movement) === 1 ? "" : "es"} con la rotación marcando ERA de ${i.era.toFixed(2)}.`,
  (i) => `${i.teamName} retroceden ${Math.abs(i.movement)} posición${Math.abs(i.movement) === 1 ? "" : "es"}. El OPS del equipo (${i.ops.toFixed(3)}) refleja el bache ofensivo.`,
  (i) => `Bajón para ${i.teamName} en el ranking (-${Math.abs(i.movement)}). Récord general ${i.record} y un tramo reciente que no suma.`,
  (i) => `${i.teamName} ceden ${Math.abs(i.movement)} lugar${Math.abs(i.movement) === 1 ? "" : "es"} esta semana. Necesitan volver a la senda del pitcheo dominante.`,
];

const SAME_TEMPLATES: ((i: RankingNarrativeInput) => string)[] = [
  (i) => `${i.teamName} se mantienen firmes con récord ${i.record}. OPS de equipo ${i.ops.toFixed(3)}, ERA reciente ${i.era.toFixed(2)}.`,
  (i) => `Semana de estabilidad para ${i.teamName}: sin movimiento en el ranking, ${i.last10} en los últimos 10.`,
  (i) => `Los ${i.teamName} sostienen su puesto. Los números recientes (OPS ${i.ops.toFixed(3)}) siguen respaldando la posición.`,
  (i) => `${i.teamName} repiten posición. Récord general ${i.record} y un bullpen que por ahora mantiene la línea.`,
  (i) => `Sin cambios para ${i.teamName} esta semana. ERA de rotación ${i.era.toFixed(2)} mantiene la competitividad.`,
];

// ----- Hashing ---------------------------------------------------------------

// FNV-1a 32-bit — tiny, stable, no deps. Good enough for variant selection.
function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function narrativeFor(input: RankingNarrativeInput): string {
  const pool =
    input.movement > 0 ? UP_TEMPLATES : input.movement < 0 ? DOWN_TEMPLATES : SAME_TEMPLATES;
  const key = `${input.teamId}-${input.weekStart}-${input.movement >= 0 ? "up" : "dn"}`;
  const idx = hashStr(key) % pool.length;
  return pool[idx](input);
}
