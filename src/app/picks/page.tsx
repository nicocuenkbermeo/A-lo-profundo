import type { Metadata } from "next"
import { PicksPageClient } from "./picks-client"

export const metadata: Metadata = {
  title: "Picks",
  description: "Feed de picks de apuestas de beisbol MLB con analisis detallado.",
}

export default function PicksPage() {
  return <PicksPageClient />
}
