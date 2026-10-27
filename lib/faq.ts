import { formatDurationLimit, type LimitDetails } from "./errors";
import { SUPPORTED_FORMAT_LABEL } from "./audio/types";

export function getFaq(limits: LimitDetails) {
  const duration = formatDurationLimit(limits.maxDurationSeconds);
  const daily = limits.dailyRequestLimit;
  const dailyLabel = daily === 1 ? "1 transcripción" : `${daily} transcripciones`;

  return [
    {
      question: "¿Qué es transcribir audio a texto?",
      answer:
        "Es convertir lo que se oye en una grabación en un texto escrito. Con VozTexto subes el archivo y obtienes la transcripción para copiarla o descargarla.",
    },
    {
      question: "¿Cómo transcribir un audio a texto?",
      answer:
        "Sube el archivo o arrástralo al recuadro, pulsa «Transcribir audio» y espera el resultado. Después puedes copiar el texto o descargarlo en TXT.",
    },
    {
      question: "¿Qué formatos de audio se pueden transcribir?",
      answer: `Puedes usar ${SUPPORTED_FORMAT_LABEL}. El archivo puede pesar hasta ${limits.maxSizeMb} MB y durar como máximo ${duration}.`,
    },
    {
      question: "¿Puedo transcribir notas de voz de WhatsApp u otras apps?",
      answer:
        "Sí, si puedes exportar o guardar la nota de voz como archivo de audio compatible. Luego súbela aquí igual que cualquier otra grabación.",
    },
    {
      question: "¿Hay límites de uso?",
      answer: `Sí. Ahora mismo puedes hacer hasta ${dailyLabel} al día sin crear una cuenta. El límite se reinicia cada día y puede cambiar según la disponibilidad del servicio.`,
    },
    {
      question: "¿Cuánto tarda la transcripción?",
      answer:
        "Depende de lo que dure el audio y de la carga del servicio. Un archivo corto suele estar listo en unos segundos o en pocos minutos.",
    },
    {
      question: "¿En qué idioma sale el texto?",
      answer:
        "Sale en el mismo idioma del audio. Detectamos el idioma automáticamente y no traducimos el contenido a otro idioma.",
    },
    {
      question: "¿Puedo descargar el texto transcrito?",
      answer:
        "Sí. Con «Descargar TXT» guardas un archivo de texto que conserva tildes, eñes y demás caracteres del español.",
    },
    {
      question: "¿Qué ocurre con el archivo de audio que subo?",
      answer:
        "El audio se usa solo para generar la transcripción. Cuando termina la solicitud, no lo guardamos en este sitio, ni aunque haya un error. Tampoco guardamos el texto completo.",
    },
  ];
}
