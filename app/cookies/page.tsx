import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { getConfig } from "@/lib/config";
import { SITE_BRAND, SITE_DOMAIN, SITE_ORIGIN } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Aviso de cookies",
  description: `Información sobre cookies y tecnologías similares en ${SITE_BRAND} (${SITE_DOMAIN}).`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  const config = getConfig();
  const email = config.contactEmail;
  const analyticsOn = Boolean(config.gaMeasurementId);

  return (
    <LegalPage title="Aviso de cookies">
      <p>
        Este aviso explica cómo {SITE_BRAND} ({SITE_ORIGIN}) utiliza cookies y tecnologías
        similares. Complimenta la <Link href="/privacidad">política de privacidad</Link>.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que un sitio puede guardar en tu dispositivo. También
        pueden usarse tecnologías parecidas (almacenamiento local, píxeles, identificadores de
        sesión). Sirven para recordar preferencias, medir el uso del sitio o hacer que ciertas
        funciones funcionen.
      </p>

      <h2>2. Cómo usa cookies {SITE_BRAND}</h2>
      <p>
        La herramienta de transcripción <strong>no exige</strong> que aceptes cookies para subir un
        audio y obtener el texto. No usamos cookies propias para mantener una sesión de usuario ni
        para crear un perfil publicitario.
      </p>

      {analyticsOn ? (
        <>
          <h3>2.1. Cookies de analítica (terceros)</h3>
          <p>
            Este sitio tiene activado Google Analytics (identificador de medición configurado en el
            servidor). Google puede instalar cookies o usar identificadores similares para
            elaborar estadísticas agregadas de visitas y eventos (por ejemplo, iniciar una subida o
            completar una transcripción).
          </p>
          <p>
            No enviamos a Analytics el nombre del archivo, el contenido del audio ni el texto
            transcrito. El tratamiento por parte de Google se rige por su propia política y
            condiciones. Puedes limitar o bloquear cookies desde la configuración de tu navegador
            o, cuando esté disponible, desde las herramientas de exclusión de Google.
          </p>
        </>
      ) : (
        <>
          <h3>2.1. Analítica</h3>
          <p>
            En la configuración actual del sitio <strong>no</strong> se carga Google Analytics ni se
            instalan cookies de analítica. Si en el futuro se activa, actualizaremos este aviso y la
            política de privacidad.
          </p>
        </>
      )}

      <h3>2.2. Cookies técnicas del proveedor de infraestructura</h3>
      <p>
        El alojamiento, el CDN o el propio navegador pueden generar datos técnicos imprescindibles
        para la seguridad o la entrega de la página (por ejemplo, protección frente a abusos).
        Esas cookies, si existen, suelen ser estrictamente necesarias o de corta duración.
      </p>

      <h2>3. Base jurídica</h2>
      <p>
        Las cookies estrictamente necesarias para prestar un servicio solicitado por ti no
        requieren consentimiento bajo la normativa española y europea habitual. Las cookies de
        analítica no esenciales, cuando estén activas, se basan en el consentimiento o en otra
        base válida según la configuración concreta y la guía de la autoridad de control.
      </p>

      <h2>4. Cómo gestionar las cookies</h2>
      <p>
        Puedes borrar o bloquear cookies desde la configuración de tu navegador. Si bloqueas todas
        las cookies, es posible que algunas partes de sitios de terceros dejen de funcionar;{" "}
        {SITE_BRAND} debería seguir permitiendo la transcripción básica sin cookies de analítica.
      </p>

      <h2>5. Más información</h2>
      <p>
        Privacidad: <Link href="/privacidad">política de privacidad</Link>. Condiciones:{" "}
        <Link href="/terminos">términos del servicio</Link>. Contacto:{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  );
}
