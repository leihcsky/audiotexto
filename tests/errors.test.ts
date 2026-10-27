import assert from "node:assert/strict";
import test from "node:test";
import { messageFor, PUBLIC_ERROR_CODES, statusFor } from "../lib/errors";
import { safeErrorFields } from "../lib/logging";
import { mapTranscriptionError } from "../lib/transcription-error";

const limits = { maxSizeMb: 25, maxDurationSeconds: 600, dailyRequestLimit: 3 };

test("every public error has a Spanish message and a status", () => {
  for (const code of PUBLIC_ERROR_CODES) {
    const message = messageFor(code, limits);
    assert.equal(typeof message, "string");
    assert.ok(message.length > 10);
    assert.equal(/sk-|r8_|stack|TypeError|at \//i.test(message), false);
    assert.equal(statusFor(code) >= 400, true);
  }
  assert.match(messageFor("duration_exceeded", limits), /10 minutos/);
  assert.match(messageFor("file_too_large", limits), /25 MB/);
  assert.match(messageFor("daily_limit", limits), /3 transcripciones por día/);
});

test("maps upstream failures without leaking a raw provider message", () => {
  assert.equal(mapTranscriptionError({ name: "TimeoutError", status: 408 }), "timeout");
  assert.equal(mapTranscriptionError({ name: "AbortError" }), "timeout");
  assert.equal(mapTranscriptionError({ name: "RateLimitError", status: 429 }), "upstream_rate_limit");
  assert.equal(
    mapTranscriptionError({ name: "Error", status: 402, code: "insufficient_quota" }),
    "upstream_quota",
  );
  assert.equal(
    mapTranscriptionError({ name: "ApiError", status: 401, code: "invalid_api_token" }),
    "not_configured",
  );
  assert.equal(mapTranscriptionError({ name: "BadRequestError", status: 400 }), "unreadable_audio");
  assert.equal(mapTranscriptionError({ name: "Error", status: 503 }), "upstream_unavailable");
  assert.equal(mapTranscriptionError(new Error("secret r8_test-token")), "upstream_failed");
});

test("does not keep API token fragments in log fields", () => {
  const fields = safeErrorFields(
    Object.assign(new Error("Unauthorized token r8_testtokenvalue"), {
      status: 401,
      code: "invalid_api_token",
    }),
  );
  assert.equal(fields.errorMessage, "authentication failed");
  assert.equal(JSON.stringify(fields).includes("r8_"), false);
  assert.equal(JSON.stringify(fields).includes("testtokenvalue"), false);
});
