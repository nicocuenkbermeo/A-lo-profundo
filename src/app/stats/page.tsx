import type { Metadata } from "next"
import { StatsHub } from "./stats-hub"

export const metadata: Metadata = {
  title: "Estadísticas",
  description: "Estadísticas completas de la MLB",
}

export default function StatsPage() {
  return <StatsHub />
}
