import { detectContainer } from "./detect-container";
import type { Container } from "./types";
import type { PublicErrorCode } from "../errors";

const EXTENSIONS: Record<string, Container> = {
  mp3: "mpeg",
  mpeg: "mpeg",
  mpga: "mpeg",
  wav: "wav",
  wave: "wav",
  m4a: "mp4",
  mp4: "mp4",
  webm: "webm",
};

const MIME_TYPES: Record<Container, string[]> = {
  mpeg: ["audio/mpeg", "audio/mp3"],
  wav: ["audio/wav", "audio/wave", "audio/x-wav"],
  mp4: ["audio/mp4", "audio/x-m4a", "audio/m4a", "video/mp4"],
  webm: ["audio/webm", "video/webm"],
};

const GENERIC_MIME = new Set(["", "application/octet-stream", "binary/octet-stream"]);

export type AudioValidation =
  | { ok: true; container: Container; durationSeconds: number }
  | { ok: false; code: PublicErrorCode };

export async function validateAudio(
  input: {
    buffer: Uint8Array;
    fileName: string;
    mimeType: string;
    byteLength: number;
  },
  limits: { maxBytes: number; maxDurationSeconds: number },
): Promise<AudioValidation> {
  const byteLength = input.buffer.byteLength;
  if (byteLength === 0 || input.byteLength === 0) {
    return { ok: false, code: "empty_file" };
  }
  if (byteLength > limits.maxBytes || input.byteLength > limits.maxBytes) {
    return { ok: false, code: "file_too_large" };
  }

  const container = detectContainer(input.buffer);
  if (!container) return { ok: false, code: "unsupported_format" };
  if (!extensionMatches(input.fileName, container)) {
    return { ok: false, code: "unsupported_format" };
  }
  if (!mimeMatches(input.mimeType, container)) {
    return { ok: false, code: "unsupported_format" };
  }

  const durationSeconds = await readDurationSeconds(input.buffer, container);
  if (durationSeconds === null) return { ok: false, code: "unreadable_audio" };
  if (durationSeconds > limits.maxDurationSeconds) {
    return { ok: false, code: "duration_exceeded" };
  }

  return { ok: true, container, durationSeconds };
}

function extensionMatches(fileName: string, container: Container) {
  const extension = extensionOf(fileName);
  if (!extension) return true;
  return EXTENSIONS[extension] === container;
}

function extensionOf(fileName: string) {
  const base = fileName.split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return null;
  return base.slice(dot + 1).toLowerCase();
}

function mimeMatches(mimeType: string, container: Container) {
  const mime = mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (GENERIC_MIME.has(mime)) return true;
  return MIME_TYPES[container].includes(mime);
}

async function readDurationSeconds(buffer: Uint8Array, container: Container) {
  try {
    const { parseBuffer } = await import("music-metadata");
    const metadata = await parseBuffer(
      buffer,
      { mimeType: mimeFor(container), size: buffer.byteLength },
      { duration: true },
    );
    const duration = metadata.format.duration;
    if (typeof duration !== "number" || !Number.isFinite(duration) || duration <= 0) {
      return null;
    }
    return duration;
  } catch {
    return null;
  }
}

function mimeFor(container: Container) {
  if (container === "mpeg") return "audio/mpeg";
  if (container === "wav") return "audio/wav";
  if (container === "mp4") return "audio/mp4";
  return "audio/webm";
}
