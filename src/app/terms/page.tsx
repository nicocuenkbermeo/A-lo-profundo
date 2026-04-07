import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de A lo Profundo.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          Términos y Condiciones
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Uso del sitio
        </p>
      </header>

      <section className="space-y-4 font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
        <p>
          Al acceder y usar <span className="font-bold text-[#F5C842]">A lo Profundo</span>,
          aceptas estos términos. El contenido se ofrece con fines informativos y estadísticos.
          La información deportiva proviene de fuentes públicas y puede contener imprecisiones.
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">
          Uso de la información
        </h2>
        <p>
          No garantizamos la exactitud o disponibilidad continua de los datos. El contenido
          relacionado con apuestas es exclusivamente informativo y no constituye una
          recomendación de apuesta ni asesoría financiera.
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">Propiedad</h2>
        <p>
          Los nombres, logos y marcas de equipos pertenecen a sus respectivos propietarios.
          A lo Profundo no está afiliado oficialmente con la MLB ni con ninguna de sus
          franquicias.
        </p>

        <p className="text-xs text-[#8B7355] pt-6">
          Última actualización: {new Date().getFullYear()}
        </p>
      </section>
    </div>
  );
}
