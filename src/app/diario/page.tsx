import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Lo Profundo del Día",
  description: "Recaps diarios automáticos de la jornada MLB: resultados, MVP, duelos, rachas y bullpens.",
};

function subtractDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - days);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function todayBogota(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

function formatDateEs(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-CO", {
    timeZone: "America/Bogota", weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function DiarioIndexPage() {
  const today = todayBogota();
  const dates: string[] = [];
  for (let i = 1; i <= 7; i++) dates.push(subtractDays(today, i));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          LO PROFUNDO DEL DÍA 📰
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Recaps diarios automáticos · Últimos 7 días
        </p>
      </header>

      <ul className="space-y-3">
        {dates.map((d) => (
          <li key={d}>
            <Link
              href={`/diario/${d}`}
              className="block bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm px-5 py-4 hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#5C4A32] transition-all"
            >
              <p className="font-heading text-lg font-bold text-[#3D2B1F]">{formatDateEs(d)}</p>
              <p className="font-display text-xs text-[#8B7355] mt-1">{d}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
