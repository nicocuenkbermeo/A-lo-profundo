import { cn } from "@/lib/utils";
import type { Game } from "@/types/game";

interface BoxScoreProps {
  game: Game;
  className?: string;
}

interface MockPlayer {
  name: string;
  ab: number;
  r: number;
  h: number;
  rbi: number;
  bb: number;
  so: number;
  avg: string;
}

function generateMockBatters(teamAbbr: string, score: number): MockPlayer[] {
  const lastNames: Record<string, string[]> = {
    NYY: ["Judge", "Soto", "Rizzo", "Stanton", "Torres", "Volpe", "LeMahieu", "Verdugo", "Wells"],
    BOS: ["Devers", "Yoshida", "Casas", "Duran", "Turner", "O'Neill", "Rafaela", "Criswell", "McGuire"],
    LAD: ["Ohtani", "Betts", "Freeman", "Hernandez", "Smith", "Lux", "Outman", "Rojas", "Taylor"],
    SF: ["Chapman", "Lee", "Yastrzemski", "Conforto", "Flores", "Estrada", "Wade", "Bailey", "Schmitt"],
    HOU: ["Alvarez", "Tucker", "Altuve", "Bregman", "Pena", "Diaz", "Meyers", "Dubón", "Caratini"],
    TEX: ["Seager", "Semien", "Garver", "Carter", "Lowe", "Garcia", "Jung", "Langford", "Heim"],
    ATL: ["Acuna", "Olson", "Riley", "Albies", "Harris", "Murphy", "Arcia", "d'Arnaud", "Rosario"],
    NYM: ["Lindor", "Alonso", "Nimmo", "McNeil", "Bader", "Marte", "Vientos", "Alvarez", "Narvaez"],
    CHC: ["Bellinger", "Busch", "Suzuki", "Swanson", "Happ", "Hoerner", "Morel", "Amaya", "Tauchman"],
    STL: ["Goldschmidt", "Arenado", "Contreras", "Carlson", "Edman", "Donovan", "Gorman", "Siani", "Herrera"],
  };

  const names = lastNames[teamAbbr] ?? ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9"];

  let runsLeft = score;
  return names.map((name, i) => {
    const ab = Math.floor(Math.random() * 2) + 3;
    const r = runsLeft > 0 && Math.random() < 0.35 ? 1 : 0;
    if (r) runsLeft--;
    const h = Math.min(ab, Math.floor(Math.random() * 3));
    const rbi = Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
    const bb = Math.random() < 0.2 ? 1 : 0;
    const so = Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
    const avg = (0.200 + Math.random() * 0.150).toFixed(3);
    return { name, ab, r, h, rbi, bb, so, avg };
  });
}

export function BoxScore({ game, className }: BoxScoreProps) {
  const awayBatters = generateMockBatters(game.awayTeam.abbreviation, game.awayScore);
  const homeBatters = generateMockBatters(game.homeTeam.abbreviation, game.homeScore);

  function renderTable(teamName: string, teamAbbr: string, batters: MockPlayer[]) {
    const totals = batters.reduce(
      (acc, p) => ({
        ab: acc.ab + p.ab,
        r: acc.r + p.r,
        h: acc.h + p.h,
        rbi: acc.rbi + p.rbi,
        bb: acc.bb + p.bb,
        so: acc.so + p.so,
      }),
      { ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0 }
    );

    return (
      <div className="overflow-x-auto">
        <div className="font-display text-xs uppercase tracking-[0.15em] text-[#8B7355] mb-2 px-1">
          {teamAbbr} — {teamName}
        </div>
        <table className="w-full min-w-[500px] text-sm">
          <thead>
            <tr className="bg-[#0D2240]">
              <th className="px-3 py-2 text-left font-display text-xs uppercase tracking-wider text-[#F5C842] w-32">
                Jugador
              </th>
              {["AB", "R", "H", "RBI", "BB", "SO", "AVG"].map((col) => (
                <th key={col} className="px-2 py-2 text-center font-display text-xs uppercase tracking-wider text-[#F5C842] w-12">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batters.map((p, idx) => (
              <tr
                key={p.name}
                className={cn(
                  idx % 2 === 0 ? "bg-[#FDF6E3]" : "bg-[#F5E6C8]"
                )}
              >
                <td className="px-3 py-1.5 text-left font-sans text-sm text-[#3D2B1F] font-semibold">
                  {p.name}
                </td>
                <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.ab}</td>
                <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.r}</td>
                <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.h}</td>
                <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.rbi}</td>
                <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.bb}</td>
                <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.so}</td>
                <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.avg}</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="bg-[#E8D5B5] border-t-2 border-[#8B7355]">
              <td className="px-3 py-2 text-left font-display text-xs uppercase tracking-wider text-[#3D2B1F]">
                Totales
              </td>
              <td className="px-2 py-2 text-center font-mono text-sm font-bold text-[#3D2B1F]">{totals.ab}</td>
              <td className="px-2 py-2 text-center font-mono text-sm font-bold text-[#C41E3A]">{totals.r}</td>
              <td className="px-2 py-2 text-center font-mono text-sm font-bold text-[#3D2B1F]">{totals.h}</td>
              <td className="px-2 py-2 text-center font-mono text-sm font-bold text-[#3D2B1F]">{totals.rbi}</td>
              <td className="px-2 py-2 text-center font-mono text-sm font-bold text-[#3D2B1F]">{totals.bb}</td>
              <td className="px-2 py-2 text-center font-mono text-sm font-bold text-[#3D2B1F]">{totals.so}</td>
              <td className="px-2 py-2 text-center font-mono text-sm text-[#8B7355]">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
        {renderTable(game.awayTeam.name, game.awayTeam.abbreviation, awayBatters)}
      </div>
      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
        {renderTable(game.homeTeam.name, game.homeTeam.abbreviation, homeBatters)}
      </div>
    </div>
  );
}
