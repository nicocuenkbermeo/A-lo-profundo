import type { Metadata } from "next"
import { PlayersStats } from "./players-stats"

export const metadata: Metadata = {
  title: "Jugadores - Estadísticas",
  description: "Estadísticas de jugadores MLB",
}

export default function PlayersPage() {
  return <PlayersStats />
}
