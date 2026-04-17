import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | A lo Profundo",
  description:
    "Escríbenos: redacción, correcciones, colaboraciones y preguntas generales sobre A lo Profundo, medio editorial de MLB en español.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">Contacto</h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">Escríbenos cuando quieras</p>
      </header>

      <section className="space-y-3 font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
        <p>¿Tienes un comentario, una corrección de datos, una idea editorial o quieres colaborar con A lo Profundo? Nos encantaría escucharte. Somos una redacción pequeña, pero leemos absolutamente todo lo que nos llega.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Correo directo</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed"><span className="font-bold">hola@aloprofundomlb.com</span><br/>Respondemos en un plazo aproximado de 2 a 5 días hábiles.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">¿Sobre qué podemos hablar?</h2>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li><span className="font-bold">Correcciones editoriales:</span> si encuentras un dato erróneo (ERA, alineación, resultado), escríbenos con el enlace al artículo o sección y la fuente correcta. Publicamos las correcciones rápido.</li>
          <li><span className="font-bold">Propuestas de colaboración:</span> redactores, analistas estadísticos, ilustradores con gusto por el vintage, cronistas con cobertura local de ligas latinoamericanas.</li>
          <li><span className="font-bold">Prensa y medios:</span> entrevistas, podcasts, citas para reportajes. Intentamos responder a todo.</li>
          <li><span className="font-bold">Consultas legales y de uso:</span> permisos de reproducción de contenido, uso de datos y similares.</li>
          <li><span className="font-bold">Publicidad y patrocinios editoriales:</span> si tu marca encaja con nuestra línea editorial (y no vende apuestas), escríbenos.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Lo que no tratamos por este canal</h2>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li>Consultas de apuestas individuales o picks pagos. No vendemos picks y no damos recomendaciones personalizadas de apuesta.</li>
          <li>Pedidos de predicciones a la medida. Todas nuestras predicciones son públicas y gratuitas en la sección correspondiente.</li>
          <li>Consultas sobre resultados de casas de apuestas u operadores externos; contacta directamente a tu operador.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Operador del sitio</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">A lo Profundo es un proyecto editorial independiente operado desde Colombia. Para temas legales, protección de datos y correspondencia formal, por favor usa el correo principal.</p>
      </section>
    </div>
  );
}
