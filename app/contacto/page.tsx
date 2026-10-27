import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { getConfig } from "@/lib/config";
import { SITE_BRAND, SITE_DOMAIN, SITE_ORIGIN } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Contacta con ${SITE_BRAND} (${SITE_DOMAIN}) sobre el servicio, privacidad o límites de uso.`,
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  const config = getConfig();
  const email = config.contactEmail;

  return (
    <LegalPage title="Contacto">
      <p>
        Si tienes una duda sobre {SITE_BRAND}, la transcripción de audio, los límites de uso, la
        privacidad o estos textos legales, escríbenos.
      </p>

      <h2>Correo</h2>
      <p>
        <a href={`mailto:${email}?subject=${encodeURIComponent(`Consulta ${SITE_BRAND}`)}`}>
          {email}
        </a>
      </p>
      <p className="text-muted">
        Sitio: {SITE_ORIGIN}. Intentamos responder en un plazo razonable; el tiempo puede variar
        según el volumen de mensajes.
      </p>

      <h2>Temas habituales</h2>
      <ul>
        <li>funcionamiento de la herramienta y formatos admitidos;</li>
        <li>límites diarios o de tamaño/duración;</li>
        <li>privacidad, cookies y ejercicio de derechos;</li>
        <li>avisos sobre errores o abusos del servicio.</li>
      </ul>

      <h2>Documentos relacionados</h2>
      <ul>
        <li>
          <Link href="/privacidad">Política de privacidad</Link>
        </li>
        <li>
          <Link href="/terminos">Términos del servicio</Link>
        </li>
        <li>
          <Link href="/cookies">Aviso de cookies</Link>
        </li>
        <li>
          <Link href="/aviso-legal">Aviso legal</Link>
        </li>
      </ul>
    </LegalPage>
  );
}
