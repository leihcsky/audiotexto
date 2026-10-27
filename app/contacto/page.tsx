import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con VozTexto si tienes dudas sobre el servicio o la privacidad.",
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  const config = getConfig();

  return (
    <LegalPage title="Contacto">
      <p>
        Si tienes una duda sobre el servicio, la privacidad o los límites de uso, puedes
        escribirnos.
      </p>
      {config.contactEmail ? (
        <p>
          Correo:{" "}
          <a
            href={`mailto:${config.contactEmail}`}
            className="underline decoration-line underline-offset-4"
          >
            {config.contactEmail}
          </a>
        </p>
      ) : (
        <p>La dirección de correo se publicará en esta página.</p>
      )}
    </LegalPage>
  );
}
