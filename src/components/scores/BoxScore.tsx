import { cn } from "@/lib/utils";
import type { Game } from "@/types/game";

interface BoxScoreProps {
  game: Game;
  className?: string;
}

export function BoxScore({ game, className }: BoxScoreProps) {
  const maxInnings = Math.max(9, game.innings.length);
  const inningNumbers = Array.from({ length: maxInnings }, (_, i) => i + 1);

  const awayRuns = game.innings.reduce((sum, inn) => sum + inn.awayRuns, 0);
  const homeRuns = game.innings.reduce((sum, inn) => sum + inn.homeRuns, 0);

  // Mock H and E since the type doesn't include them
  const awayHits = Math.floor(Math.random() * 8) + 3;
  const homeHits = Math.floor(Math.random() * 8) + 3;
  const awayErrors = Math.floor(Math.random() * 3);
  const homeErrors = Math.floor(Math.random() * 3);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[500px] text-sm">
        <thead>
          <tr className="border-b border-[#1e1e2e]">
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-24">
              Equipo
            </th>
            {inningNumbers.map((n) => (
              <th
                key={n}
                className="px-2 py-2 text-center font-mono text-xs text-muted-foreground w-8"
              >
                {n}
              </th>
            ))}
            <th className="px-2 py-2 text-center font-mono text-xs font-bold text-amber-500 w-10 border-l border-[#1e1e2e]">
              R
            </th>
            <th className="px-2 py-2 text-center font-mono text-xs text-muted-foreground w-10">
              H
            </th>
            <th className="px-2 py-2 text-center font-mono text-xs text-muted-foreground w-10">
              E
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[#1e1e2e]/50 bg-[#13131a]/50">
            <td className="px-3 py-2.5 text-left font-semibold text-sm">
              {game.awayTeam.abbreviation}
            </td>
            {inningNumbers.map((n) => {
              const inning = game.innings.find((i) => i.inningNumber === n);
              return (
                <td
                  key={n}
                  className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground"
                >
                  {inning !== undefined ? inning.awayRuns : "-"}
                </td>
              );
            })}
            <td className="px-2 py-2.5 text-center font-mono text-sm font-bold text-amber-500 border-l border-[#1e1e2e]">
              {awayRuns}
            </td>
            <td className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground">
              {awayHits}
            </td>
            <td className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground">
              {awayErrors}
            </td>
          </tr>
          <tr className="bg-[#0a0a0f]/50">
            <td className="px-3 py-2.5 text-left font-semibold text-sm">
              {game.homeTeam.abbreviation}
            </td>
            {inningNumbers.map((n) => {
              const inning = game.innings.find((i) => i.inningNumber === n);
              return (
                <td
                  key={n}
                  className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground"
                >
                  {inning !== undefined ? inning.homeRuns : "-"}
                </td>
              );
            })}
            <td className="px-2 py-2.5 text-center font-mono text-sm font-bold text-amber-500 border-l border-[#1e1e2e]">
              {homeRuns}
            </td>
            <td className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground">
              {homeHits}
            </td>
            <td className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground">
              {homeErrors}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
