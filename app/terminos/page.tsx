import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { SUPPORTED_FORMAT_LABEL } from "@/lib/audio/types";
import { getConfig } from "@/lib/config";
import { formatDurationLimit } from "@/lib/errors";
import { SITE_BRAND, SITE_DOMAIN, SITE_ORIGIN } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos del servicio",
  description: `Condiciones de uso de ${SITE_BRAND} (${SITE_DOMAIN}) para transcribir audio a texto online.`,
  alternates: { canonical: "/terminos" },
};

export default function TermsPage() {
  const config = getConfig();
  const duration = formatDurationLimit(config.maxDurationSeconds);
  const email = config.contactEmail;
  const dailyLabel =
    config.dailyRequestLimit === 1
      ? "1 transcripción"
      : `${config.dailyRequestLimit} transcripciones`;

  return (
    <LegalPage title="Términos del servicio">
      <p>
        Estos términos regulan el acceso y uso de {SITE_BRAND}, disponible en {SITE_ORIGIN}. Al
        usar el sitio o enviar un archivo para transcribir, aceptas estas condiciones y la{" "}
        <Link href="/privacidad">política de privacidad</Link>. Si no estás de acuerdo, no utilices
        el servicio.
      </p>

      <h2>1. Descripción del servicio</h2>
      <p>
        {SITE_BRAND} ofrece una herramienta online para convertir audio a texto. La versión actual
        se puede usar sin crear una cuenta. El idioma de la grabación se detecta de forma
        automática cuando la tecnología lo permite.
      </p>
      <p>
        El servicio está pensado para archivos de audio. El soporte oficial de formatos es:{" "}
        {SUPPORTED_FORMAT_LABEL}. Subir vídeo u otros tipos de archivo no está garantizado y puede
        fallar o ser rechazado.
      </p>

      <h2>2. Límites actuales</h2>
      <p>Salvo que indiquemos otra cosa en la interfaz, aplican estos límites:</p>
      <ul>
        <li>tamaño máximo del archivo: {config.maxAudioSizeMb} MB;</li>
        <li>duración máxima: {duration};</li>
        <li>
          uso diario sin cuenta: hasta {dailyLabel} por dirección IP (o identificador equivalente
          usado para antiabuso);
        </li>
        <li>concurrencia limitada para proteger la disponibilidad del servicio.</li>
      </ul>
      <p>
        Estos límites pueden cambiar en cualquier momento para controlar costes, abusos o la
        calidad del servicio. Podemos denegar, ralentizar o interrumpir peticiones que los
        superen o que pongan en riesgo la plataforma.
      </p>

      <h2>3. Tu responsabilidad sobre el contenido</h2>
      <p>Garantizas y te comprometes a que:</p>
      <ul>
        <li>
          tienes derecho a subir el audio y a solicitar su transcripción (titularidad, licencia o
          autorización suficiente);
        </li>
        <li>
          si el audio incluye voces de terceros, cuentas con base legítima para tratarlas y
          enviarlas a un servicio de reconocimiento de voz en la nube;
        </li>
        <li>
          no subirás contenido ilegal, que infrinja derechos de terceros, que contenga malware o
          que pretenda eludir los límites técnicos del servicio;
        </li>
        <li>
          no usarás {SITE_BRAND} para hostigar, suplantar, espiar de forma ilícita ni para
          cualquier fin contrario a la ley.
        </li>
      </ul>
      <p>
        Eres el único responsable del uso que hagas del texto generado (publicación, decisiones
        profesionales, uso comercial, etc.).
      </p>

      <h2>4. Naturaleza automática de la transcripción</h2>
      <p>
        El texto es el resultado de un sistema automático de reconocimiento del habla. Puede
        contener errores, omisiones, confusiones de homófonos, puntuación incorrecta o fallos con
        acentos, ruido, solapamientos o vocabulario especializado.
      </p>
      <p>
        Debes revisar el resultado antes de usarlo en contextos en los que la exactitud importe
        (contratos, salud, educación, periodismo, procedimientos legales, etc.). {SITE_BRAND} no
        garantiza que la transcripción sea completa, exacta ni apta para un fin concreto.
      </p>

      <h2>5. Propiedad intelectual</h2>
      <p>
        La marca {SITE_BRAND}, el diseño del sitio, el código y los textos propios del servicio
        pertenecen a sus titulares y están protegidos por la normativa aplicable. No puedes
        copiar, enmarcar ni explotar el sitio de forma que sugiera afiliación o autorización que
        no exista.
      </p>
      <p>
        Respecto al audio que subes y al texto resultante: en la medida en que la ley lo permita,
        conservas los derechos que ya tuvieras sobre tu contenido. Al usar el servicio nos
        concedes una licencia limitada, no exclusiva y revocable, solo para procesar el archivo
        con el fin de devolverte la transcripción.
      </p>

      <h2>6. Disponibilidad y cambios del servicio</h2>
      <p>
        El servicio se ofrece «tal cual» y «según disponibilidad». Puede haber interrupciones por
        mantenimiento, fallos del proveedor de transcripción, límites de cuota, errores de red o
        causas de fuerza mayor. No garantizamos un tiempo de actividad concreto ni un plazo de
        respuesta fijo.
      </p>
      <p>
        Podemos modificar, suspender o discontinuar funciones, límites o el acceso sin cuenta,
        con o sin previo aviso, cuando sea razonable para operar el producto.
      </p>

      <h2>7. Exclusión y limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley aplicable, {SITE_BRAND} y sus operadores no serán
        responsables de daños indirectos, lucro cesante, pérdida de datos, daño reputacional ni
        decisiones tomadas basándose en una transcripción incorrecta.
      </p>
      <p>
        Nada en estos términos excluye responsabilidad que no pueda limitarse por ley (por
        ejemplo, dolo o negligencia grave cuando la normativa lo impida).
      </p>

      <h2>8. Privacidad</h2>
      <p>
        El tratamiento del audio y de los datos técnicos se describe en la{" "}
        <Link href="/privacidad">política de privacidad</Link> y en el{" "}
        <Link href="/cookies">aviso de cookies</Link>. Al usar el servicio aceptas ese
        tratamiento en los términos allí indicados.
      </p>

      <h2>9. Enlaces y terceros</h2>
      <p>
        El sitio puede enlazar a recursos externos (por ejemplo, la AEPD). No controlamos esos
        sitios ni sus políticas. El uso de servicios de terceros (incluido el proveedor de
        reconocimiento de voz) se rige también por sus propias condiciones.
      </p>

      <h2>10. Ley aplicable y reclamaciones</h2>
      <p>
        Estos términos se interpretan conforme a la legislación española y, cuando resulte de
        aplicación, al Derecho de la Unión Europea, sin perjuicio de normas imperativas de
        protección al consumidor que te correspondan por tu residencia.
      </p>
      <p>
        Para dudas o reclamaciones relacionadas con el servicio:{" "}
        <a href={`mailto:${email}`}>{email}</a> o la página de <Link href="/contacto">contacto</Link>
        .
      </p>

      <h2>11. Contacto e identificación</h2>
      <p>
        Más datos de identificación del sitio en el <Link href="/aviso-legal">aviso legal</Link>.
        Dominio principal: {SITE_DOMAIN}.
      </p>
    </LegalPage>
  );
}
