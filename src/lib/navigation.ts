// Centralized navigation structure.
// All routes and categories defined here — components consume this.

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  isNew: boolean;
}

export interface NavCategory {
  key: string;
  label: string;
  items: NavItem[];
}

const FEATURE_LAUNCH_DATE = new Date("2026-04-09");
const NEW_BADGE_DURATION_DAYS = 14;

export function isNewFeature(): boolean {
  const now = new Date();
  const diff = now.getTime() - FEATURE_LAUNCH_DATE.getTime();
  return diff < NEW_BADGE_DURATION_DAYS * 24 * 60 * 60 * 1000;
}

const _new = isNewFeature();

export const NAV_CATEGORIES: NavCategory[] = [
  {
    key: "en-vivo",
    label: "En Vivo",
    items: [
      { href: "/scores", label: "Scores", icon: "⚾", isNew: false },
      { href: "/momento-del-dia", label: "Momento del Día", icon: "🎬", isNew: _new },
    ],
  },
  {
    key: "analisis",
    label: "Análisis",
    items: [
      { href: "/stats", label: "Estadísticas", icon: "📊", isNew: false },
      { href: "/power-rankings", label: "Power Rankings", icon: "🏆", isNew: _new },
      { href: "/chase", label: "Chase for History", icon: "🎯", isNew: _new },
      { href: "/bullpens", label: "Bullpens", icon: "💪", isNew: _new },
      { href: "/duelos", label: "Duelos del Día", icon: "⚔️", isNew: _new },
      { href: "/diario", label: "Recap Diario", icon: "📰", isNew: _new },
      { href: "/trends", label: "Tendencias", icon: "📈", isNew: false },
    ],
  },
  {
    key: "apuestas",
    label: "Apuestas",
    items: [
      { href: "/predicciones", label: "Predicciones", icon: "🎯", isNew: _new },
      { href: "/track-record", label: "Track Record", icon: "📊", isNew: _new },
      { href: "/cuotas", label: "Cuotas", icon: "💰", isNew: _new },
      { href: "/value-bets", label: "Value Bets", icon: "⚡", isNew: _new },
      { href: "/calculadora", label: "Calculadora Parlays", icon: "🧮", isNew: _new },
    ],
  },
];

export const STANDALONE_LINKS: NavItem[] = [
  { href: "/latinos", label: "Latinos", icon: "🌎", isNew: _new },
];

/** Flat list of ALL nav items for search/validation. */
export function allNavItems(): NavItem[] {
  const items: NavItem[] = [];
  for (const cat of NAV_CATEGORIES) {
    items.push(...cat.items);
  }
  items.push(...STANDALONE_LINKS);
  return items;
}
