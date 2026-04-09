import type { Metadata } from "next";
import { buildRoiReport, type RoiByConfidence, type SettledPick } from "@/lib/mlb/features/roi";
import { BettingDisclaimer } from "@/components/betting/BettingDisclaimer";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "Track Record — Historial de Picks MLB — A Lo Profundo",
  description:
    "Historial público y transparente de nuestras predicciones MLB. ROI teórico, porcentaje de aciertos y desglose por confianza.",
  keywords: [
    "track record MLB",
    "historial picks béisbol",
    "ROI apuestas MLB",
    "pronósticos béisbol resultados",
  ],
};

export default async function TrackRecordPage() {
  let report;
  try {
    report = await buildRoiReport();
  } catch (err) {
    console.error("[track-record] failed", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Track Record</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">
          Datos temporalmente no disponibles. Intenta de nuevo en unos minutos.
        </p>
      </div>
    );
  }

  if (report.earlyState) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 space-y-6">
        <header>
          <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
            TRACK RECORD
          </h1>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355] mt-2">
            Historial público de predicciones
          </p>
        </header>
        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-10 text-center space-y-3">
          <p className="font-heading text-2xl text-[#3D2B1F]">
            Construyendo historial
          </p>
          <p className="font-sans text-sm text-[#8B7355]">
            Necesitamos al menos 20 picks resueltos para mostrar estadísticas
            confiables. Actualmente tenemos {report.settledPicks} de 20.
          </p>
          <div className="w-full max-w-xs mx-auto bg-[#8B7355]/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-[#F5C842] h-full rounded-full transition-all"
              style={{ width: `${Math.min((report.settledPicks / 20) * 100, 100)}%` }}
            />
          </div>
          <p className="font-mono text-xs text-[#8B7355]">
            {report.settledPicks}/20 picks resueltos
          </p>
        </div>
        <BettingDisclaimer />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          TRACK RECORD
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Historial público de predicciones · Transparencia total
        </p>
      </header>

      {/* Hero stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatHero label="Total Picks" value={String(report.settledPicks)} />
        <StatHero
          label="Aciertos"
          value={`${Math.round(report.winRate * 100)}%`}
          sub={`${report.wins}G - ${report.losses}P`}
        />
        <StatHero
          label="ROI Teórico"
          value={`${report.theoreticalRoi >= 0 ? "+" : ""}${report.theoreticalRoi.toFixed(1)}%`}
          highlight={report.theoreticalRoi >= 0}
        />
      </div>

      {/* Streak + best month */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4">
          <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
            Racha actual
          </p>
          <p className="font-mono text-2xl font-bold text-[#0D2240] mt-1">
            {report.currentStreak.count}{report.currentStreak.type}
          </p>
        </div>
        {report.bestMonth && (
          <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4">
            <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
              Mejor mes
            </p>
            <p className="font-mono text-lg font-bold text-[#2E7D32] mt-1">
              +{report.bestMonth.roi.toFixed(1)}%
            </p>
            <p className="font-sans text-xs text-[#8B7355]">{report.bestMonth.label}</p>
          </div>
        )}
      </div>

      {/* By confidence */}
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold text-[#F5C842]">
          RENDIMIENTO POR CONFIANZA
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {report.byConfidence.map((bc) => (
            <ConfidenceCard key={bc.level} data={bc} />
          ))}
        </div>
      </section>

      {/* Recent picks table */}
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold text-[#F5C842]">
          ÚLTIMOS {report.recentPicks.length} PICKS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
            <thead>
              <tr className="bg-[#0D2240] text-[#F5C842]">
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">
                  Juego
                </th>
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">
                  Pick
                </th>
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">
                  Conf.
                </th>
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody>
              {report.recentPicks.map((pick) => (
                <PickRow key={`${pick.date}-${pick.gamePk}`} pick={pick} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ROI disclaimer */}
      <div className="bg-[#FDF6E3]/50 border-2 border-dashed border-[#8B7355] rounded-sm p-4">
        <p className="font-sans text-xs text-[#8B7355] leading-relaxed">
          ROI calculado sobre cuotas teóricas (1/confianza - 5% margen).
          El rendimiento pasado no garantiza resultados futuros.
          Contenido informativo únicamente.
        </p>
      </div>

      <BettingDisclaimer />
    </div>
  );
}

function StatHero({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 text-center">
      <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
        {label}
      </p>
      <p
        className={`font-mono text-2xl sm:text-3xl font-bold mt-1 ${
          highlight ? "text-[#2E7D32]" : "text-[#0D2240]"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="font-sans text-xs text-[#8B7355] mt-0.5">{sub}</p>
      )}
    </div>
  );
}

function ConfidenceCard({ data }: { data: RoiByConfidence }) {
  const colorMap = {
    high: "border-[#2E7D32]",
    medium: "border-[#F5C842]",
    low: "border-[#8B7355]",
  };
  return (
    <div
      className={`bg-[#FDF6E3] border-[3px] ${colorMap[data.level]} shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4`}
    >
      <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
        {data.label}
      </p>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between font-mono text-xs">
          <span className="text-[#8B7355]">Picks</span>
          <span className="text-[#3D2B1F] font-bold">{data.picks}</span>
        </div>
        <div className="flex justify-between font-mono text-xs">
          <span className="text-[#8B7355]">Aciertos</span>
          <span className="text-[#3D2B1F] font-bold">
            {data.picks > 0 ? `${Math.round(data.winRate * 100)}%` : "—"}
          </span>
        </div>
        <div className="flex justify-between font-mono text-xs">
          <span className="text-[#8B7355]">ROI</span>
          <span
            className={`font-bold ${data.roi >= 0 ? "text-[#2E7D32]" : "text-[#C41E3A]"}`}
          >
            {data.picks > 0
              ? `${data.roi >= 0 ? "+" : ""}${data.roi.toFixed(1)}%`
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

function PickRow({ pick }: { pick: SettledPick }) {
  const isWin = pick.result === "win";
  return (
    <tr className="border-b border-[#8B7355]/20 hover:bg-[#F5E6C8] transition-colors">
      <td className="px-3 py-2 font-mono text-xs text-[#8B7355]">{pick.date}</td>
      <td className="px-3 py-2 font-sans text-sm text-[#3D2B1F]">
        {pick.awayTeam} @ {pick.homeTeam}
      </td>
      <td className="px-3 py-2 text-center font-mono text-xs font-bold text-[#0D2240]">
        {pick.pick}
      </td>
      <td className="px-3 py-2 text-center font-mono text-xs text-[#8B7355]">
        {Math.round(pick.confidence * 100)}%
      </td>
      <td className="px-3 py-2 text-center">
        <span
          className={`inline-block px-2 py-0.5 rounded-sm font-display text-[10px] font-bold uppercase tracking-wider text-white ${
            isWin ? "bg-[#2E7D32]" : "bg-[#C41E3A]"
          }`}
        >
          {isWin ? "W" : "L"}
        </span>
      </td>
    </tr>
  );
}
