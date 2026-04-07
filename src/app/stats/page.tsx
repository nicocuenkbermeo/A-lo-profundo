import type { Metadata } from "next";
import { StatsHub } from "./stats-hub";
import { fetchStandings, fetchLeaders } from "@/lib/mlb-api";

export const metadata: Metadata = {
  title: "Estadísticas",
  description: "Estadísticas completas de la MLB",
};

export const revalidate = 600;

export default async function StatsPage() {
  const [standings, leaders] = await Promise.all([
    fetchStandings(),
    fetchLeaders(),
  ]);
  return <StatsHub standings={standings} leaders={leaders} />;
}
