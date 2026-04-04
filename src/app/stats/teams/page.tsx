import type { Metadata } from "next"
import { TeamsStandings } from "./teams-standings"

export const metadata: Metadata = {
  title: "Equipos - Estadísticas",
  description: "Clasificación de equipos MLB",
}

export default function TeamsPage() {
  return <TeamsStandings />
}
