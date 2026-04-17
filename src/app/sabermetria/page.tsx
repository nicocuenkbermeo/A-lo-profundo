import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diccionario de sabermetría en español | A lo Profundo",
  description:
    "Qué significan AVG, OBP, SLG, OPS, OPS+, wRC+, WAR, FIP, BABIP, WHIP y otras siglas de la estadística avanzada del béisbol, explicadas claro en español.",
};

export default function SabermetriaPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">Guía · Estadística avanzada</p>
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">Diccionario de sabermetría en español</h1>
        <p className="font-display text-sm text-[#8B7355]">Por El Pollo Apuestas · Publicado el 17 de abril de 2026</p>
      </header>

      <section className="space-y-4 font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
        <p>El béisbol moderno está lleno de siglas. Prender una transmisión y escuchar &quot;tiene un wRC+ de 145 con un BABIP de .340 sostenido por un buen LD%&quot; es como escuchar a un piloto hablando en código. Esta guía traduce las métricas más usadas a español claro, sin diluir el contenido. La ordenamos por familia: bateo, pitcheo, valor total y banderas rojas.</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Bateo</h2>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">AVG · Promedio de bateo</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Hits dividido entre turnos oficiales. La métrica clásica. Problema: no distingue entre un sencillo y un grand slam, y ignora las bases por bolas. Sirve para situar, pero no para decidir.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">OBP · Porcentaje de embasado</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Cuántas veces el bateador llega a base (hit + BB + HBP) sobre sus apariciones. Una .350 es muy buena; una .400 es élite. Mide disciplina.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">SLG · Slugging</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Total de bases dividido entre turnos oficiales. Mide potencia: un doble pesa 2, un triple 3, un jonrón 4. .500 en SLG es excelente.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">OPS · On-base + Slugging</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">OBP + SLG. Métrica popular porque combina disciplina y potencia en un solo número. .800 es buen bateador; &gt;.900 es All-Star; &gt;1.000 es MVP.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">OPS+ y wRC+</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Versiones ajustadas por park factor y liga donde 100 es el promedio de MLB. Un wRC+ de 140 significa 40% mejor que el promedio de la liga. Es la métrica &quot;limpia&quot; para comparar a un bateador de Coors Field con uno de Oakland.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">ISO · Isolated Power</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">SLG - AVG. Aísla la potencia pura (extra bases por turno). .200 es buena potencia; &gt;.250 es de temer.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">BABIP · Batting Average on Balls In Play</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Promedio cuando la pelota se pone en juego (excluye K y HR). El promedio histórico es .300. Si un bateador tiene un BABIP muy por encima o por debajo, suele ser señal de suerte o mala suerte y una regresión probable.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Pitcheo</h2>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">ERA · Earned Run Average</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Carreras limpias por cada 9 entradas. Clásico. 3.00 es excelente, &lt;2.00 es cercano a histórico, &gt;5.00 empieza a doler.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">WHIP · Walks + Hits por Inning</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Cuántos corredores embasa por entrada. 1.00 es elite, 1.30 es de liga, 1.50 es problemático.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">FIP y xFIP</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">&quot;ERA limpio&quot;: el ERA que tendría el pitcher si solo contaran las cosas que controla (K, BB, HBP, HR), retirando suerte defensiva y del BABIP. Si ERA y FIP divergen mucho, alguno de los dos va a regresar al otro.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">K/9, BB/9, K/BB</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Ponches por 9 entradas, bases por bolas por 9, y la relación entre ambos. Un K/BB superior a 4 es dominante.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">CSW% · Called Strikes + Whiffs</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Porcentaje de pitcheos que terminan en strike cantado o swing errado. Mide efectividad del stuff. &gt;30% es élite.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Valor total</h2>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#FDF6E3]">WAR · Wins Above Replacement</h3>
          <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Cuántas victorias aporta un jugador por encima del promedio de un &quot;reemplazante&quot; de cuadruple A (AAA-MLB). Combina bateo, defensa, corrido de bases (para posición) o rendimiento de lanzador (para pitchers). 2 WAR es titular sólido, 5 WAR All-Star, 8+ WAR MVP.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Banderas rojas a vigilar</h2>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li><span className="font-bold">BABIP extremo:</span> &gt;.350 o &lt;.250 mantenido más de un mes suele corregir.</li>
          <li><span className="font-bold">LOB% muy alto (&gt;80%):</span> un pitcher está dejando demasiados corredores en base — ERA bajará de forma artificial.</li>
          <li><span className="font-bold">HR/FB inusual:</span> por encima del 15% o por debajo del 8% para un abridor normalmente indica suerte.</li>
          <li><span className="font-bold">Hard Hit% alto con resultados pobres:</span> el bateador está conectando duro y no le están cayendo; casi siempre es buena señal para comprarlo.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">Cómo lo usamos en A lo Profundo</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">En nuestras predicciones priorizamos ERA (con conciencia de su volatilidad temprana), L10 y fatiga del bullpen. En nuestro <Link href="/latinos" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">Latino Tracker</Link> mostramos AVG, OPS y jonrones porque son las métricas más narrativas para el lector casual, pero internamente vigilamos BABIP y wRC+ para detectar rachas sostenibles vs. espejismos. Si tienes sugerencias de métricas que quieras ver incorporadas, escríbenos a <span className="font-bold">hola@aloprofundomlb.com</span>.</p>
      </section>
    </article>
  );
}
