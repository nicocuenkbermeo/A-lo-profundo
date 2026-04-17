import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | A lo Profundo",
  description:
    "Términos de uso, limitación de responsabilidad, propiedad intelectual, edad mínima y ley aplicable del sitio A lo Profundo.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">Términos y Condiciones</h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">Última actualización: 17 de abril de 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">1. Aceptación de los términos</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Al acceder, navegar o utilizar cualquier sección del sitio <span className="font-bold">aloprofundomlb.com</span> (en adelante, &quot;el sitio&quot; o &quot;A lo Profundo&quot;), usted declara haber leído, entendido y aceptado íntegramente los presentes Términos y Condiciones, así como nuestra <Link href="/privacy" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">Política de Privacidad</Link>. Si no está de acuerdo con alguna de estas disposiciones, por favor abstenerse de usar el sitio.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">2. Naturaleza del servicio</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">A lo Profundo es un medio editorial y divulgativo sobre la Major League Baseball (MLB). El sitio ofrece información deportiva, estadística, editorial y analítica con fines exclusivamente informativos y de entretenimiento. No somos un operador de apuestas, no intermediamos operaciones de juego ni vendemos picks pagos.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">3. Exactitud de la información</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">La información deportiva (resultados, estadísticas, alineaciones, abridores y cuotas) proviene de fuentes públicas y de la MLB Stats API oficial. Pese a que realizamos esfuerzos razonables por mantenerla actualizada, no garantizamos la exactitud, completitud ni disponibilidad continua de los datos. El sitio puede contener errores, retrasos o imprecisiones, y el usuario acepta utilizar la información bajo su propia responsabilidad.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">4. Contenido de predicciones y cuotas</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Las secciones de predicciones, value bets, cuotas y calculadora de parlays son <span className="font-bold">exclusivamente informativas y estadísticas</span>. No constituyen recomendación de apuesta, asesoría financiera, ni garantía alguna de resultado. Los modelos matemáticos publicados (Pythagorean, ajustes por abridor, forma reciente, fatiga de bullpen) son simplificaciones de la realidad y sus probabilidades pueden diferir significativamente del resultado deportivo.</p>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Apostar dinero conlleva riesgo financiero real y puede ser adictivo. Si siente que su relación con el juego se está volviendo problemática, busque ayuda profesional. En Colombia puede contactar a <span className="font-bold">Coljuegos</span> y a líneas de juego responsable locales.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">5. Edad mínima</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">El contenido relacionado con apuestas deportivas, cuotas, value bets y parlays está dirigido exclusivamente a personas <span className="font-bold">mayores de 18 años</span>. Si eres menor de edad, por favor no utilices dichas secciones. La verificación última de edad corresponde al usuario.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">6. Propiedad intelectual</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Los nombres, logos, uniformes, marcas registradas, escudos y material audiovisual de la MLB, de sus 30 franquicias, de sus ligas afiliadas y de sus jugadores pertenecen a sus respectivos propietarios. A lo Profundo no está afiliado oficialmente con la MLB ni con ninguna de sus franquicias. El diseño, textos editoriales originales, estructura del sitio, modelos estadísticos y código fuente son propiedad de A lo Profundo y están protegidos por derechos de autor.</p>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Se permite la cita razonable de nuestros contenidos editoriales con atribución clara y enlace a la fuente. La reproducción total, sistemática o comercial requiere autorización escrita previa.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">7. Limitación de responsabilidad</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">En la máxima medida permitida por la ley, A lo Profundo, sus redactores y colaboradores no serán responsables por daños directos, indirectos, incidentales, consecuentes o punitivos derivados del uso o imposibilidad de uso del sitio, incluyendo pérdidas económicas asociadas a decisiones de apuestas o financieras tomadas con base en la información publicada.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">8. Publicidad y terceros</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">El sitio puede mostrar publicidad servida por Google AdSense y otras redes publicitarias. Estos servicios pueden utilizar cookies y tecnologías similares para personalizar anuncios, conforme a sus propias políticas. Para más detalle, consulte nuestra <Link href="/privacy" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">Política de Privacidad</Link>.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">9. Modificaciones</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios serán efectivos desde su publicación en esta página, indicándose la fecha de última actualización al inicio. El uso continuado del sitio implica aceptación de las modificaciones.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">10. Ley aplicable y jurisdicción</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Estos Términos se rigen por las leyes de la República de Colombia. Cualquier controversia derivada de su aplicación o interpretación será resuelta por los jueces y tribunales competentes del domicilio del operador del sitio, salvo que la ley imponga un fuero distinto de orden público.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">11. Contacto</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Para cualquier consulta sobre estos Términos, escríbenos a <span className="font-bold">hola@aloprofundomlb.com</span> o a través de la <Link href="/contact" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">página de contacto</Link>.</p>
      </section>
    </div>
  );
}
