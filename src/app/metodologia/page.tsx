import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra metodología: Pythagorean + ajustes contextuales | A lo Profundo",
  description:
    "Cómo calculamos las probabilidades de victoria en MLB: método Pythagorean de Bill James combinado con cuatro ajustes (localía, abridor, L10, bullpen).",
};

export default function MetodologiaPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">Metodología · Redacción A lo Profundo</p>
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">Cómo calculamos nuestras predicciones: Pythagorean + ajustes contextuales</h1>
        <p className="font-display text-sm text-[#8B7355]">Por El Pollo Apuestas · Actualizado el 17 de abril de 2026</p>
      </header>

      <section className="space-y-4 font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
        <p>Cada día publicamos probabilidades de victoria para los juegos de la MLB. No son adivinanzas, ni las saca un tuitero con buen ojo: salen de un modelo reproducible que publicamos abierto porque creemos que un fanático debería poder auditar al medio que consume. Este artículo explica, en español y sin florituras, qué hace nuestro modelo y —tan importante como eso— qué <span className="italic">no</span> hace.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">La base: Pythagorean de Bill James</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">El punto de partida es la famosa <span className="font-bold">Pythagorean Expectation</span> que Bill James propuso a finales de los setenta para estimar el porcentaje de victorias esperado de un equipo a partir de sus carreras anotadas (RS) y permitidas (RA). La fórmula clásica es:</p>
        <pre className="font-mono text-[#F5C842] bg-black/30 rounded p-4 overflow-x-auto text-sm">
          {`Win% = RS² / (RS² + RA²)`}
        </pre>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Con los años se popularizó el exponente 1.83 (Pythagenpat) en lugar de 2, porque ajusta mejor a MLB en contextos de run environment muy alto o muy bajo. Nosotros usamos esa variante. Con eso obtenemos dos Win% base: uno para el local y uno para el visitante.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Los cuatro ajustes contextuales</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Pythagorean es poderoso pero ciego al contexto del juego de hoy: no sabe quién abre, cómo viene el equipo la última semana ni si el bullpen está quemado. Por eso aplicamos cuatro ajustes sobre la probabilidad base del local:</p>
        <ol className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-decimal pl-5 space-y-3">
          <li><span className="font-bold">Ventaja de localía (+4%).</span> Histórica en MLB: los equipos de casa ganan alrededor del 54% de las veces. Aplicamos un bono fijo del 4% sobre la probabilidad del local.</li>
          <li><span className="font-bold">Diferencial de abridores (ERA).</span> Tomamos el ERA del año del abridor anunciado de cada equipo. La diferencia se convierte en un ajuste de probabilidad acotado (±15% máx.) con una función logística para que no explote en diferenciales muy grandes con muestras pequeñas.</li>
          <li><span className="font-bold">Forma reciente (L10).</span> Ponderamos récord en los últimos 10 juegos para capturar rachas calientes y frías. El efecto máximo es del ±6%. Es deliberadamente modesto: una racha de 10 juegos no te dice cómo rendirás en el 11.</li>
          <li><span className="font-bold">Fatiga del bullpen (bullpen fatigue).</span> Contamos cuántos relevistas han lanzado en los últimos tres días y qué cantidad de pitcheos acumulan. Si uno de los equipos tiene tres o más relevistas &quot;agotados&quot;, la probabilidad de ese equipo cae hasta un 3%.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Banderas de confianza</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">No todas las predicciones se publican con la misma seguridad. Marcamos cada una con una de tres etiquetas:</p>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li><span className="font-bold" style={{color: "#5FB35C"}}>Alta (&gt;65%):</span> el modelo se inclina con convicción por un lado.</li>
          <li><span className="font-bold" style={{color: "#E8A33C"}}>Media (55–65%):</span> ventaja clara pero no contundente.</li>
          <li><span className="font-bold" style={{color: "#B94A4A"}}>Baja (&lt;55%):</span> partido prácticamente de moneda al aire.</li>
        </ul>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Adicionalmente, en las primeras tres semanas de temporada añadimos la etiqueta <span className="italic">&quot;Temporada temprana&quot;</span> para recordar que Pythagorean con pocas muestras es inestable. Las probabilidades de abril deben leerse con pinzas.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Track record abierto</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Un modelo sin track record es un horóscopo. Publicamos cada predicción en el momento en que se genera, y cuando termina el juego, se marca acierto o error en nuestro <Link href="/track-record" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">Track Record</Link> público. Allí puedes ver la tasa de aciertos acumulada por banda de confianza, por mes y por temporada, sin filtros cosméticos.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Qué el modelo NO hace (y es importante)</h2>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li><span className="font-bold">No modela lesiones en tiempo real.</span> Si un jugador clave sale por IL durante la mañana del partido, el modelo todavía no lo sabe.</li>
          <li><span className="font-bold">No considera clima profundamente.</span> Vientos, humedad y temperatura afectan el juego y hoy no los usamos (lo estamos evaluando).</li>
          <li><span className="font-bold">No ajusta por park factors.</span> Un juego en Coors Field y uno en Oracle Park se tratan igual en términos de run environment. Futura mejora.</li>
          <li><span className="font-bold">No predice el resultado exacto (carreras).</span> Solo la probabilidad de victoria.</li>
          <li><span className="font-bold">No es una recomendación de apuesta.</span> Las probabilidades del modelo se comparan contra el mercado en nuestra sección de <Link href="/value-bets" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">probabilidad vs. mercado</Link>, pero eso es información, no consejo financiero.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Cómo evoluciona el modelo</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Esta es la versión 1. Ya tenemos en cola varias mejoras que queremos publicar con transparencia: weighting por calidad de oponente (SOS), park factors, mejor modelado de bullpen (no solo &quot;agotado sí/no&quot;, sino leverage), y eventualmente un componente basado en wOBA proyectado por alineación. Cada cambio quedará documentado aquí y en el commit público de nuestro repositorio en GitHub. Nada se cambia en la oscuridad.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">¿Por qué publicar la metodología?</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Porque los medios de béisbol en español llevan décadas regurgitando números sin explicar cómo se producen. Nuestra apuesta editorial es simple: el lector debe poder criticarnos. Si encuentras un error en la metodología, si te parece que un ajuste está mal calibrado o si tienes una idea mejor, escríbenos a <span className="font-bold">hola@aloprofundomlb.com</span>. Este modelo es un trabajo en progreso, no un oráculo.</p>
      </section>
    </article>
  );
}
