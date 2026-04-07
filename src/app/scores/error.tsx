"use client";

export default function ScoresError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <h2 className="font-heading text-2xl text-[#C41E3A]">⚠️ Error cargando los resultados</h2>
      <p className="font-display text-sm text-[#8B7355]">
        No pudimos obtener los datos de la MLB. Intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="font-display text-xs uppercase tracking-wider bg-[#0D2240] text-[#F5C842] px-4 py-2 rounded-sm border border-[#8B7355] hover:bg-[#1A3A5C] transition-colors"
      >
        ↻ Reintentar
      </button>
    </div>
  );
}
