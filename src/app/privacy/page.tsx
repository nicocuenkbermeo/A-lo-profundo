import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de A lo Profundo: qué datos recopilamos, cómo los usamos y tus derechos.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          Política de Privacidad
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Cómo tratamos tus datos
        </p>
      </header>

      <section className="space-y-4 font-sans text-[#FDF6E3]/90 text-base leading-relaxed">
        <p>
          En <span className="font-bold text-[#F5C842]">A lo Profundo</span> respetamos tu
          privacidad. Este documento explica qué información recopilamos cuando visitas el
          sitio, cómo la usamos y qué derechos tienes sobre ella.
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">
          Información que recopilamos
        </h2>
        <p>
          Recopilamos dos tipos de información: (1) datos que tú nos das al registrarte o
          contactarnos (como tu correo electrónico), y (2) datos técnicos que se recogen
          automáticamente al navegar (dirección IP, tipo de navegador, páginas visitadas,
          tiempo en el sitio).
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">Cookies</h2>
        <p>
          Usamos cookies propias y de terceros para mejorar la experiencia, analizar el uso
          del sitio y personalizar contenido. Puedes deshabilitar las cookies desde la
          configuración de tu navegador, aunque esto puede afectar el funcionamiento del
          sitio.
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">
          Publicidad de terceros (Google AdSense)
        </h2>
        <p>
          A lo Profundo utiliza Google AdSense para mostrar publicidad. Google y sus socios
          usan cookies para publicar anuncios basados en tus visitas previas a este y otros
          sitios. Puedes desactivar la publicidad personalizada visitando la{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5C842] underline hover:opacity-80"
          >
            Configuración de anuncios de Google
          </a>
          . También puedes optar por no recibir cookies de terceros desde{" "}
          <a
            href="https://www.aboutads.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5C842] underline hover:opacity-80"
          >
            aboutads.info
          </a>
          .
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">
          Analítica
        </h2>
        <p>
          Usamos herramientas de analítica (como Google Analytics) para entender cómo se
          usa el sitio. Estas herramientas pueden recopilar datos anónimos sobre tu
          navegación.
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">
          Uso de la información
        </h2>
        <p>
          Los datos se usan exclusivamente para: (a) operar y mejorar el sitio, (b)
          responder tus consultas, (c) enviar comunicaciones relevantes si te has
          registrado, y (d) cumplir obligaciones legales. No vendemos tus datos personales
          a terceros.
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">
          Tus derechos
        </h2>
        <p>
          Tienes derecho a acceder, rectificar o eliminar tus datos, así como a oponerte a
          su tratamiento. Para ejercer estos derechos escríbenos a{" "}
          <a
            href="mailto:contacto@aloprofundomlb.com"
            className="text-[#F5C842] underline hover:opacity-80"
          >
            contacto@aloprofundomlb.com
          </a>
          .
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">
          Menores de edad
        </h2>
        <p>
          Este sitio incluye contenido informativo sobre apuestas deportivas y no está
          dirigido a menores de 18 años. Si eres menor de edad, no debes usar las
          funcionalidades relacionadas con pronósticos ni cuotas.
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#F5C842] pt-4">
          Cambios a esta política
        </h2>
        <p>
          Podemos actualizar esta política periódicamente. Los cambios se publicarán en
          esta misma página con la fecha de última actualización.
        </p>

        <p className="text-xs text-[#8B7355] pt-6">
          Última actualización: {new Date().getFullYear()}
        </p>
      </section>
    </div>
  );
}
