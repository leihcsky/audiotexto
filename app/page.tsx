import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqJsonLd } from "@/components/faq-json-ld";
import { TranscribeTool } from "@/components/transcribe-tool";
import { SUPPORTED_FORMAT_LABEL } from "@/lib/audio/types";
import { getConfig } from "@/lib/config";
import { formatDurationLimit } from "@/lib/errors";
import { getFaq } from "@/lib/faq";
import { HOME_DESCRIPTION, HOME_H1, HOME_INTRO, HOME_TITLE } from "@/lib/site-copy";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    locale: "es",
    type: "website",
  },
};

export default function HomePage() {
  const config = getConfig();
  const duration = formatDurationLimit(config.maxDurationSeconds);
  const daily =
    config.dailyRequestLimit === 1
      ? "1 transcripción"
      : `${config.dailyRequestLimit} transcripciones`;
  const faq = getFaq({
    maxSizeMb: config.maxAudioSizeMb,
    maxDurationSeconds: config.maxDurationSeconds,
    dailyRequestLimit: config.dailyRequestLimit,
  });

  return (
    <main>
      <FaqJsonLd items={faq} />

      <section className="mx-auto w-full max-w-3xl px-5 pb-12 pt-10 sm:pt-16">
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-6xl">{HOME_H1}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{HOME_INTRO}</p>
        <div className="mt-8 rounded-3xl border border-line bg-card p-4 sm:p-6">
          <TranscribeTool maxSizeMb={config.maxAudioSizeMb} />
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          Formatos admitidos: {SUPPORTED_FORMAT_LABEL}. Máximo {config.maxAudioSizeMb} MB y{" "}
          {duration}. Por ahora puedes empezar sin cuenta, con hasta {daily} al día.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          El audio se usa solo para generar la transcripción y no se guarda en este sitio.{" "}
          <Link
            href="/privacidad"
            className="underline decoration-line underline-offset-4 hover:text-ink"
          >
            Ver política de privacidad
          </Link>
          .
        </p>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-3xl px-5 py-14">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            Qué significa transcribir audio a texto
          </h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-muted">
            <p>
              Transcribir audio a texto es pasar una grabación a un documento escrito. En lugar de
              volver a escuchar la pista varias veces para tomar notas, subes el archivo y obtienes
              el contenido en texto para leerlo, editarlo o guardarlo.
            </p>
            <p>
              VozTexto está pensado para ese uso concreto: convertir audio a texto online, copiar el
              resultado o descargarlo en TXT. El idioma se detecta automáticamente, así que el texto
              sale en el mismo idioma de la grabación.
            </p>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-t border-line">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-14 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">
              Cómo transcribir audio a texto
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted">
              En tres pasos pasas audio a texto desde el navegador, sin instalar programas.
            </p>
          </div>
          <Step
            number="1"
            title="Sube el audio"
            text="Elige un archivo desde el móvil o la computadora, o arrástralo al recuadro."
            imageSrc="/illustrations/paso-subir.jpg"
            imageAlt="Ilustración de subir un archivo de audio"
          />
          <Step
            number="2"
            title="Transcribe el audio"
            text="Pulsa «Transcribir audio» y espera el resultado. Cuando termine, verás el texto en pantalla."
            imageSrc="/illustrations/paso-transcribir.jpg"
            imageAlt="Ilustración de convertir el audio en texto"
          />
          <Step
            number="3"
            title="Copia o descarga el texto"
            text="Revisa la transcripción, cópiala o guárdala como archivo TXT."
            imageSrc="/illustrations/paso-exportar.jpg"
            imageAlt="Ilustración de copiar o descargar el texto"
          />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-5 py-14">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            Para qué usar un transcriptor de audio a texto
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            Sirve cuando tienes voz grabada y necesitas el contenido por escrito, sin escribirlo a
            mano.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            <UseCase
              title="Notas de voz"
              text="Pasa a texto recordatorios, ideas o mensajes de voz que guardaste en el móvil."
              imageSrc="/illustrations/notas-de-voz.jpg"
              imageAlt="Persona pasando una nota de voz del móvil a texto en un cuaderno"
            />
            <UseCase
              title="Entrevistas"
              text="Convierte conversaciones grabadas en texto para resumirlas, citarlas o archivarlas."
              imageSrc="/illustrations/entrevistas.jpg"
              imageAlt="Entrevista grabada que se convierte en un documento de texto"
            />
            <UseCase
              title="Clases y reuniones"
              text="Obtén una base escrita de lo hablado en una clase, una reunión o una presentación."
              imageSrc="/illustrations/clases-reuniones.jpg"
              imageAlt="Escritorio con portátil y cuaderno tras una clase o reunión"
            />
            <UseCase
              title="Podcasts y grabaciones largas"
              text="Saca el texto de un episodio o de una grabación para buscar frases y reutilizar el contenido."
              imageSrc="/illustrations/podcasts.jpg"
              imageAlt="Mesa de podcast con auriculares, micrófono y transcripción en el portátil"
            />
          </ul>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-5 py-14">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            Por qué usar VozTexto para pasar audio a texto
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            <Benefit
              title="Online, sin instalar"
              text="Transcribe audio a texto desde el navegador, en el móvil o en la computadora."
            />
            <Benefit
              title="Resultado listo para usar"
              text="Cuando termina, puedes copiar el texto o descargarlo en TXT."
            />
            <Benefit
              title="Formatos comunes"
              text={`Acepta ${SUPPORTED_FORMAT_LABEL}, con un máximo de ${config.maxAudioSizeMb} MB y ${duration}.`}
            />
          </ul>
        </div>
      </section>

      <section id="preguntas" className="border-t border-line">
        <div className="mx-auto w-full max-w-3xl px-5 py-14">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Preguntas frecuentes</h2>
          <div className="mt-8 space-y-6">
            {faq.map((item) => (
              <article key={item.question}>
                <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
                <p className="mt-2 leading-7 text-muted">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({
  number,
  title,
  text,
  imageSrc,
  imageAlt,
}: {
  number: string;
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <article>
      <div className="relative mb-4 h-24 w-full max-w-[13rem] overflow-hidden rounded-2xl bg-[#ebe4d6] sm:h-28">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="208px"
          className="object-cover object-center"
        />
      </div>
      <p className="text-sm font-semibold text-pine">Paso {number}</p>
      <h3 className="mt-2 text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 leading-7 text-muted">{text}</p>
    </article>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <li className="rounded-3xl border border-line bg-card p-5">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 leading-7 text-muted">{text}</p>
    </li>
  );
}

function UseCase({
  title,
  text,
  imageSrc,
  imageAlt,
}: {
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <li className="use-case-card overflow-hidden rounded-3xl border border-line bg-card sm:flex sm:items-stretch">
      <div className="relative h-28 w-full shrink-0 overflow-hidden bg-[#ebe4d6] sm:h-auto sm:w-36 md:w-40">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className="object-cover object-center"
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted sm:text-base sm:leading-7">{text}</p>
      </div>
    </li>
  );
}
