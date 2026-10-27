export const PUBLIC_ERROR_CODES = [
  "empty_file",
  "unsupported_format",
  "file_too_large",
  "duration_exceeded",
  "unreadable_audio",
  "no_speech",
  "timeout",
  "upstream_rate_limit",
  "upstream_quota",
  "upstream_unavailable",
  "daily_limit",
  "concurrent_limit",
  "not_configured",
  "bad_request",
  "upstream_failed",
] as const;

export type PublicErrorCode = (typeof PUBLIC_ERROR_CODES)[number];

export type LimitDetails = {
  maxSizeMb: number;
  maxDurationSeconds: number;
  dailyRequestLimit: number;
};

const MESSAGES: Record<PublicErrorCode, string> = {
  empty_file: "El archivo está vacío. Elige un audio que tenga contenido.",
  unsupported_format:
    "Este formato no es compatible. Usa MP3, WAV, M4A, MP4, MPEG, MPGA o WebM.",
  file_too_large: "El archivo supera el tamaño máximo permitido.",
  duration_exceeded: "El audio supera la duración máxima permitida.",
  unreadable_audio: "No se pudo leer el archivo de audio.",
  no_speech: "No se detectó voz clara en este audio.",
  timeout: "La transcripción está tardando demasiado. Prueba de nuevo en unos minutos.",
  upstream_rate_limit: "Ahora mismo hay mucha demanda. Vuelve a intentarlo más tarde.",
  upstream_quota: "El servicio de transcripción no está disponible por el momento.",
  upstream_unavailable:
    "El servicio de transcripción no está disponible ahora. Vuelve a intentarlo más tarde.",
  daily_limit: "Ya usaste el límite gratuito de hoy. Podrás volver a intentarlo mañana.",
  concurrent_limit: "Ya hay una transcripción en curso. Espera a que termine para enviar otra.",
  not_configured: "El servicio de transcripción no está disponible ahora mismo.",
  bad_request: "No se pudo procesar la solicitud. Elige el archivo e inténtalo de nuevo.",
  upstream_failed: "No se pudo transcribir el audio. Inténtalo de nuevo.",
};

export function formatDurationLimit(seconds: number) {
  if (seconds > 0 && seconds % 60 === 0) {
    const minutes = seconds / 60;
    return minutes === 1 ? "1 minuto" : `${minutes} minutos`;
  }
  return seconds === 1 ? "1 segundo" : `${seconds} segundos`;
}

export function messageFor(code: PublicErrorCode, limits?: LimitDetails) {
  if (code === "file_too_large" && limits) {
    return `El archivo supera el tamaño máximo de ${limits.maxSizeMb} MB.`;
  }
  if (code === "duration_exceeded" && limits) {
    return `El audio supera la duración máxima de ${formatDurationLimit(limits.maxDurationSeconds)}.`;
  }
  if (code === "daily_limit" && limits) {
    const count = limits.dailyRequestLimit;
    const noun = count === 1 ? "transcripción" : "transcripciones";
    return `Ya usaste el límite gratuito de ${count} ${noun} por día. Podrás volver a intentarlo mañana.`;
  }
  return MESSAGES[code];
}

export function statusFor(code: PublicErrorCode) {
  switch (code) {
    case "file_too_large":
      return 413;
    case "daily_limit":
    case "concurrent_limit":
    case "upstream_rate_limit":
      return 429;
    case "not_configured":
    case "upstream_quota":
    case "upstream_unavailable":
      return 503;
    case "timeout":
      return 504;
    case "no_speech":
      return 422;
    case "upstream_failed":
      return 502;
    default:
      return 400;
  }
}
