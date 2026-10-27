import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { getConfig } from "@/lib/config";
import { SITE_BRAND, SITE_DOMAIN, SITE_ORIGIN } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: `Información legal e identificación del sitio ${SITE_BRAND} (${SITE_DOMAIN}).`,
  alternates: { canonical: "/aviso-legal" },
};

export default function LegalNoticePage() {
  const config = getConfig();
  const email = config.contactEmail;

  return (
    <LegalPage title="Aviso legal">
      <p>
        Este aviso legal regula el acceso y uso del sitio web {SITE_BRAND}, publicado en el dominio{" "}
        {SITE_DOMAIN} ({SITE_ORIGIN}), de conformidad con la normativa española aplicable a
        servicios de la sociedad de la información.
      </p>

      <h2>1. Datos identificativos</h2>
      <ul>
        <li>
          <strong>Nombre comercial / servicio:</strong> {SITE_BRAND}
        </li>
        <li>
          <strong>Sitio web:</strong> {SITE_ORIGIN}
        </li>
        <li>
          <strong>Correo de contacto:</strong> <a href={`mailto:${email}`}>{email}</a>
        </li>
      </ul>
      <p>
        Si el operador actúa como persona física o jurídica con domicilio y datos registrales
        obligatorios adicionales, esos datos se facilitarán o actualizarán en esta página o
        mediante respuesta al correo de contacto cuando la ley lo exija.
      </p>

      <h2>2. Objeto</h2>
      <p>
        {SITE_BRAND} pone a disposición de los usuarios una herramienta online para transcribir
        audio a texto, con los límites y condiciones publicados en el propio sitio.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El uso del sitio implica la aceptación de los{" "}
        <Link href="/terminos">términos del servicio</Link> y de la{" "}
        <Link href="/privacidad">política de privacidad</Link>. El usuario se compromete a hacer un
        uso lícito, diligente y conforme a la buena fe.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Los contenidos propios del sitio (textos institucionales, diseño, logotipo, código) están
        protegidos. Queda prohibida su reproducción, distribución o comunicación pública no
        autorizada, salvo lo permitido por ley o con licencia expresa.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        {SITE_BRAND} procura mantener la información actualizada y el servicio operativo, pero no
        puede garantizar la ausencia total de errores, interrupciones o inexactitudes en las
        transcripciones automáticas. El usuario es responsable del uso que haga de los resultados.
      </p>
      <p>
        No nos responsabilizamos de daños derivados del uso indebido del sitio, de la calidad del
        audio aportado por el usuario ni de incidencias ajenas a nuestro control razonable
        (proveedores de red, fuerza mayor, etc.).
      </p>

      <h2>6. Enlaces</h2>
      <p>
        Los enlaces a sitios de terceros se ofrecen para facilitar la información. {SITE_BRAND} no
        controla esos sitios y no asume responsabilidad por sus contenidos o políticas.
      </p>

      <h2>7. Protección de datos</h2>
      <p>
        El tratamiento de datos personales se describe en la{" "}
        <Link href="/privacidad">política de privacidad</Link> y en el{" "}
        <Link href="/cookies">aviso de cookies</Link>.
      </p>

      <h2>8. Legislación aplicable</h2>
      <p>
        Este aviso se rige por la legislación española. Para cualquier controversia, las partes se
        someten a los juzgados y tribunales competentes según la normativa aplicable, con especial
        atención a los derechos de los consumidores cuando proceda.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para cualquier cuestión legal o de identificación del servicio:{" "}
        <a href={`mailto:${email}`}>{email}</a> · <Link href="/contacto">Formulario / página de
        contacto</Link>
        .
      </p>
    </LegalPage>
  );
}
