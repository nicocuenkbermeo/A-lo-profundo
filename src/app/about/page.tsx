import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "A lo Profundo: tu fuente de béisbol profundo en español. Scores en vivo, estadísticas avanzadas y tendencias de la MLB.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">Sobre Nosotros</h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Béisbol profundo, en español
        </p>
      </header>

      <section className="space-y-4 font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
        <p>
          <span className="font-heading text-[#F5C842] font-bold">A lo Profundo</span> es un
          proyecto dedicado a quienes amamos el béisbol y lo queremos vivir con el detalle que
          merece. Cubrimos la MLB con scores en vivo, estadísticas avanzadas y tendencias, todo
          en español y con una estética vintage que rinde homenaje a la historia del deporte.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Nuestra misión</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
          Queremos ser la fuente de referencia para el fanático hispanohablante que busca más
          que un simple resultado: datos profundos, contexto y análisis. Cada pitch cuenta, y
          cada estadística tiene una historia detrás.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Contacto</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
          ¿Tienes comentarios, sugerencias o quieres colaborar? Escríbenos a través de nuestra{" "}
          <Link href="/contact" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">
            página de contacto
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
