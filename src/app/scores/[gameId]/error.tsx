"use client";

import Link from "next/link";

export default function GameError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <h2 className="font-heading text-2xl text-[#C41E3A]">⚠️ Partido no disponible</h2>
      <p className="font-display text-sm text-[#8B7355]">
        No pudimos cargar este partido desde la MLB.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="font-display text-xs uppercase tracking-wider bg-[#0D2240] text-[#F5C842] px-4 py-2 rounded-sm border border-[#8B7355] hover:bg-[#1A3A5C] transition-colors"
        >
          ↻ Reintentar
        </button>
        <Link
          href="/scores"
          className="font-display text-xs uppercase tracking-wider bg-[#C41E3A] text-white px-4 py-2 rounded-sm border border-[#8B0000] hover:opacity-90 transition-colors"
        >
          Volver a Scores
        </Link>
      </div>
    </div>
  );
}
