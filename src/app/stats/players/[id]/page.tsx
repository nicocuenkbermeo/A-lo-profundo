import type { Metadata } from "next"
import { PlayerProfile } from "./player-profile"

const playerNames: Record<string, string> = {
  "judge-1": "Aaron Judge",
  "ohtani-1": "Shohei Ohtani",
  "soto-1": "Juan Soto",
  "skubal-1": "Tarik Skubal",
  "sale-1": "Chris Sale",
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const name = playerNames[id] ?? "Jugador"
  return {
    title: `${name} - Estadísticas`,
    description: `Perfil y estadísticas de ${name}`,
  }
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PlayerProfile playerId={id} />
}
