import { createHash } from "node:crypto";

type LogValue = string | number | boolean | null;

export function logEvent(fields: Record<string, LogValue>) {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      ...fields,
    }),
  );
}

export function hashClientKey(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

let warnedAboutIpHeader = false;

export function warnIfIpTrustMissing(trustedIpHeader: string) {
  if (warnedAboutIpHeader) return;
  if (process.env.NODE_ENV !== "production") return;
  if (trustedIpHeader.trim()) return;
  warnedAboutIpHeader = true;
  logEvent({
    event: "config_warning",
    message: "TRUSTED_IP_HEADER is empty. All visitors share one rate-limit bucket.",
  });
}

export function safeErrorFields(error: unknown) {
  const status = readStatus(error) ?? readResponseStatus(error);
  const code = readCode(error);
  const message = readMessage(error)
    .replace(/sk-[^\s]+/g, "[redacted]")
    .replace(/r8_[A-Za-z0-9_-]+/g, "[redacted]");
  return {
    errorName: error instanceof Error ? error.name : readName(error) || "Error",
    errorStatus: status,
    errorCode: code,
    errorMessage:
      status === 401 ||
      status === 403 ||
      code === "invalid_api_key" ||
      code === "invalid_api_token"
        ? "authentication failed"
        : message.slice(0, 240),
  };
}

function readName(error: unknown) {
  if (!error || typeof error !== "object" || !("name" in error)) return "";
  return typeof error.name === "string" ? error.name : "";
}

function readMessage(error: unknown) {
  if (!error || typeof error !== "object" || !("message" in error)) return "";
  return typeof error.message === "string" ? error.message : "";
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
