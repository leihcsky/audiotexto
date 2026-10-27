import Replicate from "replicate";
import type { Container } from "./audio/types";

const FILE_NAME: Record<Container, string> = {
  mpeg: "audio.mp3",
  wav: "audio.wav",
  mp4: "audio.m4a",
  webm: "audio.webm",
};

const FILE_TYPE: Record<Container, string> = {
  mpeg: "audio/mpeg",
  wav: "audio/wav",
  mp4: "audio/mp4",
  webm: "audio/webm",
};

export async function transcribeAudio(options: {
  apiKey: string;
  model: string;
  timeoutMs: number;
  buffer: Buffer;
  container: Container;
}) {
  const replicate = new Replicate({
    auth: options.apiKey,
  });
  const audioBytes = Uint8Array.from(options.buffer);
  const audio = new File([audioBytes], FILE_NAME[options.container], {
    type: FILE_TYPE[options.container],
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    // Community models require owner/name:version. Bare owner/name only works for official models.
    const model = (await resolveModelRef(replicate, options.model)) as `${string}/${string}:${string}`;
    // Default: auto-detect spoken language and keep the original language.
    // Whisper "translate" is a separate task that converts speech into English.
    const output = await replicate.run(model, {
      input: {
        audio,
        task: "transcribe",
        language: "None",
        timestamp: "chunk",
        batch_size: 24,
        diarise_audio: false,
      },
      signal: controller.signal,
    });
    return extractTranscript(output);
  } catch (error) {
    throw normalizeReplicateError(error);
  } finally {
    clearTimeout(timer);
  }
}

export async function resolveModelRef(replicate: Replicate, model: string) {
  const trimmed = model.trim();
  if (trimmed.includes(":")) return trimmed;

  const [owner, name] = trimmed.split("/");
  if (!owner || !name || trimmed.split("/").length !== 2) {
    throw Object.assign(new Error("Invalid Replicate model identifier"), {
      name: "ConfigError",
      status: 400,
      code: "invalid_model",
    });
  }

  const info = await replicate.models.get(owner, name);
  const versionId = info.latest_version?.id;
  if (!versionId) {
    throw Object.assign(new Error("Replicate model has no published version"), {
      name: "ConfigError",
      status: 404,
      code: "invalid_model",
    });
  }
  return `${owner}/${name}:${versionId}`;
}

export function extractTranscript(output: unknown) {
  if (typeof output === "string") return output.trim();
  if (!output || typeof output !== "object") return "";

  if ("text" in output && typeof output.text === "string") {
    return output.text.trim();
  }

  if ("transcription" in output && typeof output.transcription === "string") {
    return output.transcription.trim();
  }

  if ("chunks" in output && Array.isArray(output.chunks)) {
    return output.chunks
      .map((chunk) =>
        chunk && typeof chunk === "object" && "text" in chunk && typeof chunk.text === "string"
          ? chunk.text.trim()
          : "",
      )
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  return "";
}

function normalizeReplicateError(error: unknown) {
  if (isAbortError(error)) {
    return Object.assign(new Error("Transcription timed out"), {
      name: "TimeoutError",
      status: 408,
      code: "ETIMEDOUT",
    });
  }

  const status = readResponseStatus(error) ?? readStatus(error);
  const message = error instanceof Error ? error.message : "Replicate request failed";
  const code =
    status === 401 || status === 403
      ? "invalid_api_token"
      : status === 429
        ? "rate_limit"
        : status === 402
          ? "insufficient_quota"
          : undefined;

  return Object.assign(new Error(message), {
    name: error instanceof Error ? error.name : "ReplicateError",
    status,
    code,
    cause: error,
  });
}

function isAbortError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  if ("name" in error && error.name === "AbortError") return true;
  if ("code" in error && error.code === "ABORT_ERR") return true;
  return false;
}

function readResponseStatus(error: unknown) {
  if (!error || typeof error !== "object" || !("response" in error)) return null;
  const response = error.response;
  if (!response || typeof response !== "object" || !("status" in response)) return null;
  return typeof response.status === "number" ? response.status : null;
}

function readStatus(error: unknown) {
  if (!error || typeof error !== "object" || !("status" in error)) return null;
  return typeof error.status === "number" ? error.status : null;
}
