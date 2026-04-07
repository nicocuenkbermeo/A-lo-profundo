import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ponte en contacto con el equipo de A lo Profundo.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">Contacto</h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Escríbenos cuando quieras
        </p>
      </header>

      <section className="space-y-4 font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
        <p>
          ¿Tienes un comentario, una corrección, una idea o quieres colaborar con{" "}
          <span className="font-bold text-[#F5C842]">A lo Profundo</span>? Nos encantaría
          escucharte.
        </p>

        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-6 text-[#3D2B1F]">
          <p className="font-display text-xs uppercase tracking-wider text-[#8B7355] mb-2">
            Correo electrónico
          </p>
          <p className="font-mono text-lg font-bold">hola@aloprofundomlb.com</p>
        </div>

        <p className="text-sm text-[#FDF6E3]/70">
          Respondemos en un plazo aproximado de 2 a 5 días hábiles.
        </p>
      </section>
    </div>
  );
}
