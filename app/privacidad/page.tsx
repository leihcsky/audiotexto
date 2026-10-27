import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { getConfig } from "@/lib/config";
import { SITE_BRAND, SITE_DOMAIN, SITE_ORIGIN } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Cómo trata ${SITE_BRAND} (${SITE_DOMAIN}) los archivos de audio, la transcripción y los datos técnicos de la visita.`,
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  const config = getConfig();
  const email = config.contactEmail;

  return (
    <LegalPage title="Política de privacidad">
      <p>
        Esta política describe cómo {SITE_BRAND} ({SITE_ORIGIN}) trata la información cuando usas
        el servicio de transcripción de audio a texto. Está redactada para ser clara y alineada con
        el Reglamento (UE) 2016/679 (RGPD) y la normativa española de protección de datos aplicable,
        en la medida en que te ofrezcamos el servicio desde o hacia el Espacio Económico Europeo.
      </p>
      <p>
        El uso del servicio implica que has leído esta política. Si no estás de acuerdo, no subas
        audio ni uses la herramienta.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de los datos descritos en esta política es el operador del
        sitio {SITE_BRAND}, accesible en {SITE_ORIGIN}.
      </p>
      <p>
        Para ejercer derechos o plantear dudas sobre privacidad:{" "}
        <a href={`mailto:${email}`}>{email}</a>. También puedes usar la página de{" "}
        <Link href="/contacto">contacto</Link>.
      </p>

      <h2>2. Qué datos tratamos</h2>
      <h3>2.1. Audio que subes</h3>
      <p>
        Cuando pulsas «Transcribir audio», el archivo sale de tu dispositivo y llega a nuestros
        servidores para procesarlo. La conversión a texto <strong>no</strong> se realiza solo dentro
        del navegador.
      </p>
      <p>
        El audio puede contener voz y, por tanto, datos biométricos o de carácter personal de las
        personas que hablan en la grabación. Solo debes subir archivos que tengas derecho a usar y
        para los que cuentes con la base jurídica adecuada (por ejemplo, tu propio audio o
        consentimiento / otra base válida respecto a terceros).
      </p>

      <h3>2.2. Texto transcrito</h3>
      <p>
        El resultado se muestra en tu navegador para que lo copies o lo descargues.{" "}
        {SITE_BRAND} no guarda la transcripción completa en una base de datos ni en los registros
        del servicio.
      </p>

      <h3>2.3. Datos técnicos y de seguridad</h3>
      <p>Para prestar el servicio, limitar abusos y diagnosticar errores podemos tratar:</p>
      <ul>
        <li>
          dirección IP de la solicitud (en los registros internos no se escribe en claro; se usa un
          identificador derivado);
        </li>
        <li>metadatos técnicos del archivo (tamaño, duración aproximada, tipo MIME);</li>
        <li>fecha/hora, tiempo de proceso y códigos de resultado o error;</li>
        <li>cabeceras técnicas habituales de la petición HTTP (por ejemplo, User-Agent).</li>
      </ul>
      <p>
        El contador diario de uso vive en la memoria del proceso del servidor (no en una base de
        datos persistente) y puede perderse si el servicio se reinicia.
      </p>

      <h3>2.4. Datos de contacto</h3>
      <p>
        Si nos escribes por correo, trataremos tu dirección de email y el contenido del mensaje
        únicamente para responderte.
      </p>

      <h2>3. Finalidades y bases jurídicas</h2>
      <ul>
        <li>
          <strong>Prestar la transcripción que solicitas</strong> (ejecución de medidas
          precontractuales / prestación del servicio a petición tuya; art. 6.1.b RGPD).
        </li>
        <li>
          <strong>Limitar abusos, proteger la infraestructura y registrar fallos técnicos</strong>{" "}
          (interés legítimo; art. 6.1.f RGPD), de forma proporcional y sin usar el contenido del
          audio para publicidad.
        </li>
        <li>
          <strong>Responder a consultas</strong> que nos envíes (interés legítimo o, cuando
          proceda, medidas precontractuales).
        </li>
        <li>
          <strong>Analítica de uso del sitio</strong>, solo si está activada (véase la sección de
          cookies y analítica). En ese caso la base puede ser el consentimiento o el interés
          legítimo según la configuración efectiva y la normativa aplicable.
        </li>
      </ul>
      <p>
        No vendemos tus datos. No usamos el audio ni el texto transcrito para entrenar modelos
        propios de {SITE_BRAND}.
      </p>

      <h2>4. Destinatarios y encargados del tratamiento</h2>
      <p>
        Para generar el texto, el audio se envía a un <strong>proveedor externo de reconocimiento
        automático del habla</strong> (API de transcripción). Ese proveedor trata el archivo como
        encargado (o subencargado) con la finalidad de devolver el texto de la solicitud. Puede
        tratar los datos en servidores situados fuera del Espacio Económico Europeo; cuando
        corresponda, las transferencias se apoyan en garantías adecuadas previstas por el RGPD
        (por ejemplo, cláusulas contractuales tipo u otras medidas equivalentes del proveedor).
      </p>
      <p>
        También pueden intervenir proveedores de alojamiento, red de entrega de contenido o
        infraestructura cloud necesarios para operar {SITE_DOMAIN}.
      </p>
      <p>
        Podremos comunicar datos si la ley nos obliga (requerimiento de autoridad competente) o
        para defender derechos frente a un abuso grave del servicio.
      </p>

      <h2>5. Plazos de conservación</h2>
      <ul>
        <li>
          <strong>Audio:</strong> se mantiene mientras dura la solicitud de transcripción y se
          descarta al terminar (éxito o error). No se archiva de forma permanente en{" "}
          {SITE_BRAND}.
        </li>
        <li>
          <strong>Texto:</strong> permanece en tu navegador hasta que lo copies, descargues o
          cierres/recargues la página; no lo almacenamos en el servidor.
        </li>
        <li>
          <strong>Registros técnicos / límite diario:</strong> el contador en memoria es efímero;
          los registros de diagnóstico se conservan el tiempo mínimo necesario para seguridad y
          operación (orientativamente, días o pocas semanas, salvo incidencia que exija un plazo
          mayor).
        </li>
        <li>
          <strong>Correos de contacto:</strong> el tiempo necesario para atender la consulta y, si
          procede, obligaciones legales.
        </li>
      </ul>
      <p>
        El proveedor de reconocimiento de voz puede aplicar sus propios plazos de retención
        técnicos; no controlamos por completo esa infraestructura, pero el envío se limita a la
        finalidad de transcribir la solicitud.
      </p>

      <h2>6. Cookies y tecnologías similares</h2>
      <p>
        El detalle está en el <Link href="/cookies">aviso de cookies</Link>. Resumen: el servicio
        de transcripción no requiere crear una cuenta ni instalar cookies propias esenciales para
        funcionar. Si se activa Google Analytics, pueden instalarse cookies de terceros según la
        configuración de Google.
      </p>
      {config.gaMeasurementId ? (
        <p>
          En este momento el sitio tiene configurada analítica (Google Analytics) para medir
          visitas y acciones agregadas (por ejemplo, iniciar una subida, completar una
          transcripción, copiar o descargar). No enviamos el nombre del archivo, el contenido del
          audio ni el texto transcrito a Analytics.
        </p>
      ) : (
        <p>
          En este momento el sitio <strong>no</strong> carga Google Analytics ni instala cookies de
          analítica.
        </p>
      )}

      <h2>7. Tus derechos</h2>
      <p>
        Cuando el RGPD resulte aplicable, puedes solicitar acceso, rectificación, supresión,
        limitación, oposición y, cuando proceda, portabilidad, así como retirar el consentimiento
        si el tratamiento se basaba en él.
      </p>
      <p>
        Como {SITE_BRAND} no mantiene cuentas de usuario ni guarda de forma permanente el audio ni
        la transcripción, en la práctica puede no haber un fichero identificable asociado a tu
        visita más allá de registros técnicos efímeros. Aun así, puedes escribirnos a{" "}
        <a href={`mailto:${email}`}>{email}</a> y te ayudaremos en la medida de lo posible.
      </p>
      <p>
        También puedes presentar una reclamación ante la autoridad de control competente. En
        España, la Agencia Española de Protección de Datos (AEPD):{" "}
        <a href="https://www.aepd.es" rel="noopener noreferrer" target="_blank">
          www.aepd.es
        </a>
        .
      </p>

      <h2>8. Menores</h2>
      <p>
        El servicio no está dirigido a menores de 14 años. Si eres padre, madre o tutor y crees
        que un menor nos ha enviado audio o datos, contacta con nosotros para que podamos
        valorarlo.
      </p>

      <h2>9. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas razonables (comunicación HTTPS, límites de tamaño y duración,
        control de concurrencia y de peticiones diarias, no persistencia del audio en el sitio).
        Ningún sistema es 100 % seguro; usa el servicio con archivos que estés dispuesto a enviar
        a un proveedor de transcripción en la nube.
      </p>

      <h2>10. Cambios</h2>
      <p>
        Podemos actualizar esta política para reflejar cambios del servicio o de la normativa. La
        fecha de «Última actualización» al inicio de la página indica la versión vigente. El uso
        continuado del sitio tras un cambio relevante implica que aceptas la nueva versión, sin
        perjuicio de los derechos que te reconozca la ley.
      </p>

      <h2>11. Más información</h2>
      <p>
        Condiciones de uso: <Link href="/terminos">Términos del servicio</Link>. Identificación del
        sitio: <Link href="/aviso-legal">Aviso legal</Link>. Cookies:{" "}
        <Link href="/cookies">Aviso de cookies</Link>.
      </p>
    </LegalPage>
  );
}
