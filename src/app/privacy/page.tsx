import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | A lo Profundo",
  description:
    "Cómo recopilamos, usamos y protegemos tu información en A lo Profundo. Uso de cookies, Google AdSense, analítica y derechos del usuario.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">Política de Privacidad</h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">Última actualización: 17 de abril de 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">1. Responsable del tratamiento</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">A lo Profundo (aloprofundomlb.com) es un proyecto editorial independiente operado desde Colombia. Como responsable del tratamiento de datos personales, nos comprometemos a proteger tu privacidad y a tratar tus datos con transparencia. Para cualquier consulta sobre esta política, escríbenos a <span className="font-bold">hola@aloprofundomlb.com</span>.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">2. Qué datos recopilamos</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Cuando visitas A lo Profundo podemos recopilar, directa o a través de terceros, los siguientes datos:</p>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li><span className="font-bold">Datos técnicos de navegación:</span> dirección IP, tipo de navegador, sistema operativo, páginas visitadas, tiempo de permanencia, referente. Se usan de forma agregada para mejorar el sitio.</li>
          <li><span className="font-bold">Cookies propias y de terceros:</span> para sesión, preferencias y medición. Ver sección 4.</li>
          <li><span className="font-bold">Datos que nos envías voluntariamente:</span> si te comunicas por correo electrónico o te registras como usuario, guardamos los datos que nos proporcionas (nombre, email, mensaje).</li>
          <li><span className="font-bold">Datos de cuenta (opcional):</span> si creas una cuenta en el sitio, almacenamos tu email y preferencias mínimas para operar el servicio.</li>
        </ul>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">No recopilamos datos sensibles (salud, orientación sexual, origen racial, ideología) ni datos bancarios.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">3. Para qué usamos tus datos</h2>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li>Entregar y mantener el contenido y funcionalidades del sitio.</li>
          <li>Medir audiencia, identificar errores y optimizar el rendimiento.</li>
          <li>Mostrar publicidad contextual o personalizada a través de redes publicitarias como Google AdSense.</li>
          <li>Responder tus mensajes y consultas.</li>
          <li>Cumplir obligaciones legales cuando aplique.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">4. Cookies y tecnologías similares</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">El sitio utiliza cookies propias (esenciales para la sesión y preferencias) y cookies de terceros con fines analíticos y publicitarios. Entre los terceros que pueden instalar cookies se encuentran Google AdSense, Google Analytics y proveedores de infraestructura (como Vercel).</p>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Puedes configurar tu navegador para rechazar o borrar cookies en cualquier momento. Ten en cuenta que desactivar cookies puede afectar el funcionamiento de algunas funciones del sitio.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">5. Google AdSense</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Utilizamos Google AdSense para mostrar publicidad. AdSense y sus socios pueden usar cookies, identificadores de anuncios (como la cookie DART) y tecnologías similares para personalizar los anuncios que ves según tus intereses y tu historial de navegación en otros sitios.</p>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Puedes gestionar tus preferencias de publicidad personalizada de Google en <a className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors" href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>. Para conocer cómo Google utiliza la información de sitios que usan sus servicios, consulta <a className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>.</p>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">También puedes excluirte del uso de la cookie DART visitando la <a className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">página de configuración de anuncios de Google</a> o la <a className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors" href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer">página de inhabilitación de la iniciativa de publicidad en red</a>.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">6. Analítica</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Podemos usar servicios de analítica (como Google Analytics o Vercel Analytics) para entender cómo se usa el sitio. Estos servicios procesan datos agregados de navegación bajo sus propias políticas de privacidad.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">7. Compartir información con terceros</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">No vendemos tus datos personales. Compartimos información únicamente con:</p>
        <ul className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed list-disc pl-5 space-y-2">
          <li>Proveedores de infraestructura (Vercel, bases de datos) bajo acuerdos de confidencialidad.</li>
          <li>Redes publicitarias y analíticas (Google), conforme a las secciones 4 a 6.</li>
          <li>Autoridades competentes, cuando la ley lo exija.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">8. Transferencias internacionales</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Algunos proveedores están ubicados fuera de Colombia (principalmente Estados Unidos y Unión Europea). Al usar el sitio entiendes que tus datos pueden procesarse en esas jurisdicciones bajo las garantías contractuales y estándares técnicos aplicables.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">9. Tus derechos</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">De acuerdo con la Ley 1581 de 2012 de Protección de Datos Personales de Colombia y otras normas aplicables, tienes derecho a conocer, actualizar, rectificar, suprimir tus datos personales y a revocar la autorización cuando aplique. Puedes ejercer estos derechos escribiéndonos a <span className="font-bold">hola@aloprofundomlb.com</span>.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">10. Menores de edad</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Las secciones relacionadas con apuestas están dirigidas exclusivamente a mayores de 18 años. No recopilamos conscientemente datos de menores de edad. Si crees que un menor nos ha proporcionado datos, contáctanos para eliminarlos.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">11. Seguridad</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Aplicamos medidas técnicas y organizativas razonables para proteger tus datos (HTTPS, control de accesos, hashing de contraseñas cuando aplique). Ninguna medida es infalible, y te animamos a usar contraseñas robustas en los servicios que lo requieran.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">12. Cambios en esta política</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Podemos actualizar esta Política de Privacidad. Publicaremos la versión vigente en esta misma página, indicando la fecha de última actualización. Te recomendamos revisarla periódicamente.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">13. Contacto</h2>
        <p className="font-sans text-[#FDF6E3]/90 text-base leading-relaxed">Para cualquier duda o solicitud relacionada con tus datos, escríbenos a <span className="font-bold">hola@aloprofundomlb.com</span> o a través de la <Link href="/contact" className="text-[#F5C842] underline hover:text-[#FDF6E3] transition-colors">página de contacto</Link>.</p>
      </section>
    </div>
  );
}
