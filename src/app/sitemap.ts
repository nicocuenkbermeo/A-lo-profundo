import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://aloprofundomlb.com";

const STATIC_PATHS: Array<{ path: string; priority: number; changeFrequency: "daily" | "hourly" | "weekly" | "monthly" }> = [
  { path: "/", priority: 1.0, changeFrequency: "hourly" },
  { path: "/tiktok", priority: 0.9, changeFrequency: "daily" },
  { path: "/scores", priority: 0.9, changeFrequency: "hourly" },
  { path: "/predicciones", priority: 0.9, changeFrequency: "daily" },
  { path: "/cuotas", priority: 0.8, changeFrequency: "hourly" },
  { path: "/value-bets", priority: 0.8, changeFrequency: "hourly" },
  { path: "/power-rankings", priority: 0.8, changeFrequency: "daily" },
  { path: "/stats", priority: 0.8, changeFrequency: "daily" },
  { path: "/stats/players", priority: 0.7, changeFrequency: "daily" },
  { path: "/stats/teams", priority: 0.7, changeFrequency: "daily" },
  { path: "/track-record", priority: 0.7, changeFrequency: "daily" },
  { path: "/diario", priority: 0.7, changeFrequency: "daily" },
  { path: "/duelos", priority: 0.7, changeFrequency: "daily" },
  { path: "/chase", priority: 0.6, changeFrequency: "daily" },
  { path: "/bullpens", priority: 0.6, changeFrequency: "daily" },
  { path: "/latinos", priority: 0.6, changeFrequency: "daily" },
  { path: "/trends", priority: 0.6, changeFrequency: "daily" },
  { path: "/momento-del-dia", priority: 0.6, changeFrequency: "daily" },
  { path: "/calculadora", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
