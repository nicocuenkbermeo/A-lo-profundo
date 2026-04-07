interface ResponsibleGamingNoticeProps {
  className?: string;
}

export function ResponsibleGamingNotice({ className = "" }: ResponsibleGamingNoticeProps) {
  return (
    <div
      role="note"
      aria-label="Aviso de juego responsable"
      className={
        "flex items-start gap-3 bg-[#FFF8D6] border-2 border-[#C9A227] rounded-sm p-4 text-[#3D2B1F] " +
        className
      }
    >
      <span aria-hidden="true" className="text-xl leading-none shrink-0">
        ⚠️
      </span>
      <p className="font-sans text-xs leading-relaxed">
        Información con fines estadísticos e informativos. No es una recomendación de
        apuesta. El juego puede ser adictivo. Si tú o alguien que conoces tiene un problema
        con el juego, busca ayuda profesional. Solo para mayores de 18 años.
      </p>
    </div>
  );
}
