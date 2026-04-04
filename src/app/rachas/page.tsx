import type { Metadata } from "next"
import { RachasPageClient } from "./rachas-client"

export const metadata: Metadata = {
  title: "Rachas & Leaderboard",
  description: "Tabla de clasificacion de tipsters y rachas en fuego de MLB.",
}

export default function RachasPage() {
  return <RachasPageClient />
}
