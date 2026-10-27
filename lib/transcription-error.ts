import type { PublicErrorCode } from "./errors";

export function mapTranscriptionError(error: unknown): PublicErrorCode {
  const name = readName(error);
  const status = readStatus(error) ?? readResponseStatus(error);
  const code = readCode(error);
  const message = readMessage(error).toLowerCase();

  if (
    name === "TimeoutError" ||
    name === "AbortError" ||
    name === "APIConnectionTimeoutError" ||
    name === "APIUserAbortError" ||
    code === "ETIMEDOUT" ||
    code === "ABORT_ERR" ||
    status === 408
  ) {
    return "timeout";
  }
  if (
    code === "insufficient_quota" ||
    status === 402 ||
    message.includes("insufficient credit") ||
    message.includes("payment required")
  ) {
    return "upstream_quota";
  }
  if (
    status === 401 ||
    status === 403 ||
    name === "AuthenticationError" ||
    code === "invalid_api_token" ||
    code === "invalid_api_key"
  ) {
    return "not_configured";
  }
  if (status === 429 || name === "RateLimitError" || code === "rate_limit") {
    return "upstream_rate_limit";
  }
  if (name === "BadRequestError" || status === 400 || status === 422) {
    return "unreadable_audio";
  }
  if (name === "APIConnectionError" || (status !== null && status >= 500)) {
    return "upstream_unavailable";
  }
  return "upstream_failed";
}

function readName(error: unknown) {
  if (!error || typeof error !== "object" || !("name" in error)) return "";
  return typeof error.name === "string" ? error.name : "";
}

function readStatus(error: unknown) {
  if (!error || typeof error !== "object" || !("status" in error)) return null;
  return typeof error.status === "number" ? error.status : null;
}

function readResponseStatus(error: unknown) {
  if (!error || typeof error !== "object" || !("response" in error)) return null;
  const response = error.response;
  if (!response || typeof response !== "object" || !("status" in response)) return null;
  return typeof response.status === "number" ? response.status : null;
}

function readCode(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return null;
  return typeof error.code === "string" ? error.code : null;
}

function readMessage(error: unknown) {
  if (!error || typeof error !== "object" || !("message" in error)) return "";
  return typeof error.message === "string" ? error.message : "";
}
