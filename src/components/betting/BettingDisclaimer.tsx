export function BettingDisclaimer() {
  return (
    <aside
      role="note"
      className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 mt-8"
    >
      <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355] mb-1">
        Aviso legal
      </p>
      <p className="font-sans text-xs text-[#3D2B1F] leading-relaxed">
        A Lo Profundo no promueve ni facilita apuestas. El contenido es
        informativo y estadístico. Apostar conlleva riesgo financiero. Si la
        situación lo amerita, busca ayuda:{" "}
        <a
          href="https://www.ncpgambling.org/help-treatment/national-helpline-1-800-522-4700/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#C41E3A] hover:text-[#0D2240]"
        >
          Juego Responsable
        </a>
        .
      </p>
    </aside>
  );
}
