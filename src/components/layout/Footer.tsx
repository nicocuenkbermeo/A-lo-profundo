import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="block bg-[#0D2240] border-t-[3px] border-[#8B7355] py-8 px-4">
      {/* Stitch divider */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="border-t-2 border-dashed border-[#C41E3A]/60" />
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <Image src="/logo.png" alt="A lo Profundo" width={140} height={140} className="drop-shadow-[3px_3px_0px_rgba(0,0,0,0.5)]" />
        <div>
          <span className="font-heading text-[#F5C842] text-2xl font-black tracking-tight">
            A LO{" "}
          </span>
          <span className="font-heading text-[#C41E3A] text-2xl font-black italic">
            PROFUNDO
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-center font-display text-[#8FBCE6] text-sm mb-6">
        ⚾ Tu fuente de béisbol profundo
      </p>

      {/* Links row */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8FBCE6] text-xs font-display">
        <span>© {new Date().getFullYear()} A lo Profundo · Medio editorial independiente</span>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Link href="/about" className="hover:text-[#FDF6E3] transition-colors">Sobre Nosotros</Link>
          <span className="text-[#8B7355]">|</span>
          <Link href="/metodologia" className="hover:text-[#FDF6E3] transition-colors">Metodología</Link>
          <span className="text-[#8B7355]">|</span>
          <Link href="/sabermetria" className="hover:text-[#FDF6E3] transition-colors">Sabermetría</Link>
          <span className="text-[#8B7355]">|</span>
          <Link href="/terms" className="hover:text-[#FDF6E3] transition-colors">Términos</Link>
          <span className="text-[#8B7355]">|</span>
          <Link href="/privacy" className="hover:text-[#FDF6E3] transition-colors">Privacidad</Link>
          <span className="text-[#8B7355]">|</span>
          <Link href="/contact" className="hover:text-[#FDF6E3] transition-colors">Contacto</Link>
        </div>
      </div>

      {/* Disclaimer de apuestas */}
      <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-[#8B7355]/30 text-center text-[#8FBCE6]/70 text-[11px] font-display leading-relaxed px-4">
        <p>A lo Profundo es un medio informativo. Las secciones relacionadas con cuotas y probabilidades son estadísticas y están dirigidas a mayores de 18 años. No promovemos ni facilitamos apuestas. Apostar dinero conlleva riesgo financiero y puede ser adictivo; juega responsablemente. A lo Profundo no está afiliado oficialmente con la MLB.</p>
      </div>
    </footer>
  );
}
