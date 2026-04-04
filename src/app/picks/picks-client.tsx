"use client"

import { useState } from "react"
import Link from "next/link"
import { PickCard, type Pick } from "@/components/picks/PickCard"
import { PickFilters } from "@/components/picks/PickFilters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const mockPicks: Pick[] = [
  {
    id: "1",
    tipster: { name: "Carlos Rivera", initials: "CR", streak: 7 },
    game: { away: "NYY", home: "BOS", date: "Abr 4" },
    pickType: "MONEYLINE",
    selection: "Yankees ML",
    odds: "-135",
    stake: 4,
    analysis: "Los Yankees llegan con Gerrit Cole en la loma, quien tiene un ERA de 2.15 en sus ultimas 5 salidas contra Boston. Los Red Sox alinean a un bullpen cansado tras la serie con Toronto. Espero que Cole domine las primeras 6 entradas y el bullpen cierre sin problemas.",
    result: "WIN",
    profit: 2.96,
    timestamp: "Hace 2h",
  },
  {
    id: "2",
    tipster: { name: "Maria Lopez", initials: "ML", streak: 4 },
    game: { away: "LAD", home: "SF", date: "Abr 4" },
    pickType: "RUNLINE",
    selection: "Dodgers -1.5",
    odds: "+110",
    stake: 3,
    analysis: "Los Dodgers tienen un lineup devastador contra zurdos. El abridor de los Giants ha permitido un OPS de .890 en su ultimo mes. La diferencia de talento es clara y espero una victoria holgada de Los Angeles.",
    result: "WIN",
    profit: 3.30,
    timestamp: "Hace 3h",
  },
  {
    id: "3",
    tipster: { name: "Diego Martinez", initials: "DM", streak: 0 },
    game: { away: "HOU", home: "TEX", date: "Abr 4" },
    pickType: "TOTAL",
    selection: "Over 8.5",
    odds: "-110",
    stake: 2,
    analysis: "Ambos abridores vienen con ERAs arriba de 4.50 y los bullpens estan gastados. El viento sopla hacia afuera en Arlington. Proyecto un juego de muchas carreras en esta rivalidad texana siempre ofensiva.",
    result: "LOSS",
    profit: -2.20,
    timestamp: "Hace 4h",
  },
  {
    id: "4",
    tipster: { name: "Carlos Rivera", initials: "CR", streak: 7 },
    game: { away: "ATL", home: "NYM", date: "Abr 4" },
    pickType: "MONEYLINE",
    selection: "Braves ML",
    odds: "-120",
    stake: 3,
    analysis: "Atlanta con Spencer Strider tiene una clara ventaja en pitcheo. Los Mets siguen sin encontrar consistencia ofensiva. El pitcheo de los Braves deberia ser suficiente para llevarse esta serie en Citi Field.",
    result: "PENDING",
    profit: 0,
    timestamp: "Hace 5h",
  },
  {
    id: "5",
    tipster: { name: "Ana Gutierrez", initials: "AG", streak: 2 },
    game: { away: "CHC", home: "MIL", date: "Abr 3" },
    pickType: "PROP",
    selection: "Contreras 2+ hits",
    odds: "+180",
    stake: 1,
    analysis: "Willson Contreras batea .380 contra zurdos esta temporada y el abridor de Milwaukee es zurdo. Ademas lleva hits en sus ultimos 8 juegos consecutivos. Buen value en esta prop para un bateador en racha.",
    result: "WIN",
    profit: 1.80,
    timestamp: "Hace 1d",
  },
  {
    id: "6",
    tipster: { name: "Maria Lopez", initials: "ML", streak: 4 },
    game: { away: "SD", home: "ARI", date: "Abr 3" },
    pickType: "MONEYLINE",
    selection: "Padres ML",
    odds: "+105",
    stake: 3,
    analysis: "Yu Darvish ha sido dominante en sus ultimas presentaciones con un WHIP de 0.95. Arizona batea para .220 como equipo en la ultima semana. Me gusta el value de los Padres como visitantes aqui.",
    result: "WIN",
    profit: 3.15,
    timestamp: "Hace 1d",
  },
  {
    id: "7",
    tipster: { name: "Roberto Sanchez", initials: "RS", streak: 0 },
    game: { away: "MIN", home: "CLE", date: "Abr 3" },
    pickType: "RUNLINE",
    selection: "Guardians -1.5",
    odds: "+140",
    stake: 2,
    analysis: "Cleveland en casa ha ganado sus ultimos 6 juegos por 2+ carreras. Shane Bieber tiene un ERA de 1.89 en Progressive Field este mes. Minnesota llega sin su lineup completo por lesiones.",
    result: "PUSH",
    profit: 0,
    timestamp: "Hace 1d",
  },
  {
    id: "8",
    tipster: { name: "Diego Martinez", initials: "DM", streak: 0 },
    game: { away: "PHI", home: "WSH", date: "Abr 3" },
    pickType: "TOTAL",
    selection: "Under 7.5",
    odds: "-105",
    stake: 4,
    analysis: "Zack Wheeler contra MacKenzie Gore es un duelo de pitcheo de elite. Ambos equipos han generado pocas carreras en sus ultimos enfrentamientos. Espero un juego cerrado y de bajo puntaje en DC.",
    result: "WIN",
    profit: 3.81,
    timestamp: "Hace 2d",
  },
  {
    id: "9",
    tipster: { name: "Ana Gutierrez", initials: "AG", streak: 2 },
    game: { away: "SEA", home: "OAK", date: "Abr 2" },
    pickType: "MONEYLINE",
    selection: "Mariners ML",
    odds: "-165",
    stake: 5,
    analysis: "Seattle es simplemente un equipo superior en todos los aspectos. Oakland tiene el peor record en casa de la liga y su pitcheo ha sido terrible. George Kirby en la loma sella este pick con confianza maxima.",
    result: "WIN",
    profit: 3.03,
    timestamp: "Hace 2d",
  },
  {
    id: "10",
    tipster: { name: "Carlos Rivera", initials: "CR", streak: 7 },
    game: { away: "TB", home: "BAL", date: "Abr 2" },
    pickType: "MONEYLINE",
    selection: "Orioles ML",
    odds: "-140",
    stake: 4,
    analysis: "Baltimore en casa ha sido practicamente imbatible. Los Rays viajan cansados despues de una serie de 4 juegos. Grayson Rodriguez tiene un ERA de 2.40 en Camden Yards y los bates de los O's estan calientes.",
    result: "WIN",
    profit: 2.86,
    timestamp: "Hace 3d",
  },
  {
    id: "11",
    tipster: { name: "Maria Lopez", initials: "ML", streak: 4 },
    game: { away: "CIN", home: "STL", date: "Abr 2" },
    pickType: "TOTAL",
    selection: "Over 9",
    odds: "-115",
    stake: 2,
    analysis: "La rivalidad de la NL Central siempre produce muchas carreras. Ambos abridores tienen ERAs por encima de 4.00 y los bullpens han sido inconsistentes. Busch Stadium con clima calido favorece la ofensiva.",
    result: "LOSS",
    profit: -2.30,
    timestamp: "Hace 3d",
  },
  {
    id: "12",
    tipster: { name: "Roberto Sanchez", initials: "RS", streak: 0 },
    game: { away: "DET", home: "KC", date: "Abr 1" },
    pickType: "RUNLINE",
    selection: "Royals -1.5",
    odds: "+135",
    stake: 2,
    analysis: "Kansas City viene arrasando en casa con 5 victorias seguidas. Detroit tiene un lineup debil contra diestros y el abridor de los Royals ha estado en racha. Me gusta el value del run line aqui.",
    result: "LOSS",
    profit: -2.00,
    timestamp: "Hace 4d",
  },
  {
    id: "13",
    tipster: { name: "Diego Martinez", initials: "DM", streak: 0 },
    game: { away: "MIA", home: "PIT", date: "Abr 1" },
    pickType: "MONEYLINE",
    selection: "Pirates ML",
    odds: "-125",
    stake: 3,
    analysis: "Pittsburgh ha jugado bien en casa ultimamente y Paul Skenes esta dominando. Miami viene de una serie brutal contra los Dodgers y sus bates estan frios. Me voy con los locales en este matchup.",
    result: "WIN",
    profit: 2.40,
    timestamp: "Hace 4d",
  },
  {
    id: "14",
    tipster: { name: "Ana Gutierrez", initials: "AG", streak: 2 },
    game: { away: "COL", home: "LAA", date: "Abr 1" },
    pickType: "PROP",
    selection: "Ohtani 1+ HR",
    odds: "+200",
    stake: 2,
    analysis: "Shohei en modo MVP contra un pitcheo de Colorado que permite la mayor cantidad de jonrones en la liga. El Coors Effect inverso no aplica en Anaheim pero Ohtani batea .400 contra este staff.",
    result: "VOID",
    profit: 0,
    timestamp: "Hace 5d",
  },
  {
    id: "15",
    tipster: { name: "Carlos Rivera", initials: "CR", streak: 7 },
    game: { away: "TOR", home: "CHW", date: "Mar 31" },
    pickType: "MONEYLINE",
    selection: "Blue Jays ML",
    odds: "-180",
    stake: 5,
    analysis: "Toronto con Kevin Gausman es un favorito claro contra los White Sox que tienen el peor record de la liga. Chicago no ha ganado en sus ultimos 9 juegos y su ofensiva es la peor del beisbol.",
    result: "WIN",
    profit: 2.78,
    timestamp: "Hace 5d",
  },
]

export function PicksPageClient() {
  const [visibleCount, setVisibleCount] = useState(8)
  const visible = mockPicks.slice(0, visibleCount)

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Picks</h1>
        <Link href="/picks/new">
          <Button size="sm">
            <Plus className="mr-1.5 size-4" />
            Nuevo Pick
          </Button>
        </Link>
      </div>

      <PickFilters />

      <div className="space-y-4">
        {visible.map((pick) => (
          <Link key={pick.id} href={`/picks/${pick.id}`} className="block">
            <PickCard pick={pick} />
          </Link>
        ))}
      </div>

      {visibleCount < mockPicks.length && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + 8)}>
            Cargar mas
          </Button>
        </div>
      )}
    </div>
  )
}
