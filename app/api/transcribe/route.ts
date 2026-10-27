import { NextResponse } from "next/server";
import { validateAudio } from "@/lib/audio/validate-audio";
import { getClientIp } from "@/lib/client-ip";
import {
  getConfig,
  getReplicateApiToken,
  limitDetails,
  type AppConfig,
} from "@/lib/config";
import { messageFor, statusFor, type PublicErrorCode } from "@/lib/errors";
import { hashClientKey, logEvent, safeErrorFields, warnIfIpTrustMissing } from "@/lib/logging";
import { beginAttempt, endAttempt, getRateLimitStore } from "@/lib/rate-limit";
import { mapTranscriptionError } from "@/lib/transcription-error";
import { transcribeAudio } from "@/lib/transcription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MULTIPART_OVERHEAD_BYTES = 64 * 1024;

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const config = getConfig();
  const limits = limitDetails(config);
  warnIfIpTrustMissing(config.trustedIpHeader);

  const apiKey = getReplicateApiToken();
  if (!apiKey) {
    logEvent({
      requestId,
      event: "config_error",
      code: "not_configured",
      message: "REPLICATE_API_TOKEN is missing",
    });
    return jsonError("not_configured", requestId, config);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > config.maxAudioBytes + MULTIPART_OVERHEAD_BYTES) {
    logEvent({
      requestId,
      event: "transcription_failed",
      code: "file_too_large",
      bytes: contentLength,
    });
    return jsonError("file_too_large", requestId, config);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch (error) {
    logEvent({
      requestId,
      event: "transcription_failed",
      code: "bad_request",
      ...safeErrorFields(error),
    });
    return jsonError("bad_request", requestId, config);
  }

  const uploaded = form.get("file");
  if (!(uploaded instanceof File)) {
    return jsonError(uploaded === null ? "empty_file" : "bad_request", requestId, config);
  }
  if (uploaded.size === 0) {
    return jsonError("empty_file", requestId, config);
  }
  if (uploaded.size > config.maxAudioBytes) {
    logEvent({
      requestId,
      event: "transcription_failed",
      code: "file_too_large",
      bytes: uploaded.size,
    });
    return jsonError("file_too_large", requestId, config);
  }

  const ipHash = hashClientKey(
    getClientIp(request, {
      trustedIpHeader: config.trustedIpHeader,
      trustedProxyCount: config.trustedProxyCount,
    }),
  );

  let audio: Buffer | null = null;
  let slotHeld = false;

  try {
    audio = Buffer.from(await uploaded.arrayBuffer());
    const validation = await validateAudio(
      {
        buffer: audio,
        fileName: uploaded.name,
        mimeType: uploaded.type,
        byteLength: uploaded.size,
      },
      {
        maxBytes: config.maxAudioBytes,
        maxDurationSeconds: config.maxDurationSeconds,
      },
    );

    if (!validation.ok) {
      logEvent({
        requestId,
        event: "transcription_failed",
        code: validation.code,
        bytes: audio.byteLength,
        ipHash,
      });
      return jsonError(validation.code, requestId, config);
    }

    const decision = beginAttempt(getRateLimitStore(), ipHash, {
      dailyLimit: config.dailyRequestLimit,
      maxConcurrent: config.maxConcurrent,
    });
    if (!decision.ok) {
      logEvent({
        requestId,
        event: "limit_reached",
        code: decision.code,
        bytes: audio.byteLength,
        durationSeconds: roundSeconds(validation.durationSeconds),
        ipHash,
      });
      return jsonError(decision.code, requestId, config);
    }
    slotHeld = true;

    logEvent({
      requestId,
      event: "transcription_started",
      bytes: audio.byteLength,
      durationSeconds: roundSeconds(validation.durationSeconds),
      model: config.model,
      ipHash,
    });

    const transcript = (
      await transcribeAudio({
        apiKey,
        model: config.model,
        timeoutMs: config.timeoutMs,
        buffer: audio,
        container: validation.container,
      })
    ).trim();

    if (!transcript) {
      logEvent({
        requestId,
        event: "transcription_failed",
        code: "no_speech",
        bytes: audio.byteLength,
        durationSeconds: roundSeconds(validation.durationSeconds),
        elapsedMs: Date.now() - startedAt,
        ipHash,
      });
      return jsonError("no_speech", requestId, config);
    }

    logEvent({
      requestId,
      event: "transcription_succeeded",
      bytes: audio.byteLength,
      durationSeconds: roundSeconds(validation.durationSeconds),
      elapsedMs: Date.now() - startedAt,
      ipHash,
    });

    return jsonResponse(
      { success: true, transcript, requestId },
      200,
    );
  } catch (error) {
    const code = mapTranscriptionError(error);
    logEvent({
      requestId,
      event: "transcription_failed",
      code,
      elapsedMs: Date.now() - startedAt,
      ipHash,
      ...safeErrorFields(error),
    });
    return jsonError(code, requestId, config);
  } finally {
    if (slotHeld) endAttempt(getRateLimitStore(), ipHash);
    audio?.fill(0);
  }
}

function jsonError(code: PublicErrorCode, requestId: string, config: AppConfig) {
  return jsonResponse(
    {
      success: false,
      error: messageFor(code, limitDetails(config)),
      code,
      requestId,
    },
    statusFor(code),
  );
}

function jsonResponse(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function roundSeconds(value: number) {
  return Math.round(value * 100) / 100;
}
