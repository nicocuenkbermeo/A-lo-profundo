import Link from "next/link";

export function Footer() {
  return (
    <footer className="hidden lg:block bg-[#0D2240] border-t-[3px] border-[#8B7355] py-8 px-4">
      {/* Stitch divider */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="border-t-2 border-dashed border-[#C41E3A]/60" />
      </div>

      {/* Logo */}
      <div className="text-center mb-2">
        <span className="font-heading text-[#F5C842] text-2xl font-bold tracking-tight">
          A LO{" "}
        </span>
        <span className="font-heading text-[#C41E3A] text-2xl font-bold italic">
          PROFUNDO
        </span>
      </div>

      {/* Tagline */}
      <p className="text-center font-display text-[#8FBCE6] text-sm mb-6">
        ⚾ Tu fuente de béisbol profundo
      </p>

      {/* Bottom row */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[#8FBCE6] text-xs font-display">
        <span>© 2024 A lo Profundo</span>
        <div className="flex items-center gap-3">
          <Link href="/about" className="hover:text-[#FDF6E3] transition-colors">
            Sobre Nosotros
          </Link>
          <span className="text-[#8B7355]">|</span>
          <Link href="/terms" className="hover:text-[#FDF6E3] transition-colors">
            Términos
          </Link>
          <span className="text-[#8B7355]">|</span>
          <Link href="/contact" className="hover:text-[#FDF6E3] transition-colors">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
