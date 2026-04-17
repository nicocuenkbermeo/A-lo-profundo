import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | A lo Profundo",
  description:
    "A lo Profundo es un proyecto editorial independiente de béisbol MLB en español: metodología, fuentes de datos, equipo y compromiso editorial.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">Sobre Nosotros</h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">Béisbol profundo, en español — desde Colombia</p>
      </header>
      <section className="space-y-4 font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
        <p><span className="font-heading text-[#F5C842] font-bold">A lo Profundo</span> es un proyecto editorial independiente dedicado a cubrir la Major League Baseball (MLB) en español, con un enfoque especial en el fanático hispanohablante que quiere ir más allá del marcador final. Desde Colombia, seguimos cada jornada de la temporada regular y la postemporada, combinando cobertura en tiempo real con análisis de datos, contexto histórico y una estética vintage que rinde homenaje a la tradición del béisbol.</p>
        <p>El sitio nació en 2026 con la convicción de que el béisbol merece una cobertura en español tan rigurosa como la que existe en inglés. Hoy ofrecemos scores en vivo, predicciones basadas en un modelo propio, estadísticas avanzadas, Power Rankings, seguimiento específico de peloteros latinos, reportes de fatiga de bullpens, duelos del día y recaps editoriales cada mañana.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Nuestra misión</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Queremos ser la fuente de referencia para el fanático hispanohablante que busca más que un simple resultado: datos profundos, contexto y análisis narrativo. Creemos que cada pitch cuenta, que cada estadística tiene una historia detrás, y que el béisbol se disfruta mejor cuando se entiende. Nuestro compromiso es traducir la complejidad del juego moderno —pitch clock, shifts limitados, bases grandes, sabermetría— a un lenguaje claro, en español, sin perder profundidad.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Metodología</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Nuestras predicciones parten del método <span className="italic">Pythagorean de Bill James</span>, calculado sobre carreras anotadas y permitidas del equipo local y visitante, y se ajustan con cuatro factores contextuales: ventaja de localía, diferencial de ERA de los abridores anunciados, forma reciente (L10) y fatiga acumulada del bullpen en los últimos tres días. Cada predicción en nuestro sitio incluye un desglose transparente del cálculo para que el lector pueda auditar los supuestos del modelo. Publicamos también nuestro <Link href="/track-record" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">track record</Link> completo: aciertos, errores y rendimiento histórico.</p>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Para las estadísticas avanzadas y Power Rankings combinamos récord puro con diferencial de carreras, forma en los últimos diez juegos y calidad de rivales. No vendemos picks, no hacemos pronósticos encubiertos y todo nuestro contenido es gratuito y abierto.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Fuentes de datos</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Todos los datos deportivos provienen de la <span className="font-bold">MLB Stats API</span> oficial (statsapi.mlb.com), consumida con límites de tasa propios (~10 req/seg) para no sobrecargar el servicio. Los datos se refrescan de forma dinámica durante el horario de juegos y se cachean entre jornadas. Los nombres, logos y marcas de los equipos pertenecen a sus respectivos propietarios; A lo Profundo no está afiliado oficialmente con la MLB ni con ninguna de sus franquicias.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Equipo editorial</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">El contenido editorial (recaps diarios, análisis de predicciones, reportes de bullpens y artículos de fondo) está firmado por <span className="font-bold">El Pollo Apuestas</span>, alias editorial del proyecto. Somos una redacción pequeña e independiente, sin patrocinadores deportivos ni casas de apuestas detrás. Si quieres colaborar como redactor, analista o ilustrador, escríbenos: siempre estamos buscando voces que amen el juego.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Compromiso editorial</h2>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li>Corregimos públicamente cualquier error de datos o interpretación.</li>
          <li>No publicamos contenido patrocinado disfrazado de análisis editorial.</li>
          <li>No promovemos ni facilitamos apuestas; nuestras secciones de cuotas son informativas.</li>
          <li>Los contenidos relacionados con apuestas están dirigidos exclusivamente a mayores de 18 años.</li>
          <li>Respetamos el copyright de la MLB y de los medios que citamos.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Contacto</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">¿Tienes comentarios, correcciones, sugerencias o quieres colaborar? Escríbenos a través de nuestra <Link href="/contact" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">página de contacto</Link> o directamente a <span className="font-bold">hola@aloprofundomlb.com</span>.</p>
      </section>
    </div>
  );
}
