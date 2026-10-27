import type { LimitDetails } from "./errors";
import { DEFAULT_CONTACT_EMAIL } from "./legal";

export type AppConfig = {
  model: string;
  maxAudioSizeMb: number;
  maxAudioBytes: number;
  maxDurationSeconds: number;
  dailyRequestLimit: number;
  maxConcurrent: number;
  timeoutMs: number;
  trustedIpHeader: string;
  trustedProxyCount: number;
  siteUrl: string;
  gaMeasurementId: string;
  contactEmail: string;
  googleSiteVerification: string;
};

const REPLICATE_MAX_UPLOAD_MB = 100;

export function getConfig(): AppConfig {
  const maxAudioSizeMb = readPositiveInt("MAX_AUDIO_SIZE_MB", 25, REPLICATE_MAX_UPLOAD_MB);
  const maxDurationSeconds = readPositiveInt("MAX_AUDIO_DURATION_SECONDS", 600);
  return {
    model: readModel(),
    maxAudioSizeMb,
    maxAudioBytes: maxAudioSizeMb * 1024 * 1024,
    maxDurationSeconds,
    dailyRequestLimit: readPositiveInt("DAILY_REQUEST_LIMIT", 3),
    maxConcurrent: readPositiveInt("MAX_CONCURRENT_REQUESTS", 1),
    timeoutMs: readTimeout(),
    trustedIpHeader: readHeaderName("TRUSTED_IP_HEADER"),
    trustedProxyCount: readNonNegativeInt("TRUSTED_PROXY_COUNT", 0),
    siteUrl: readSiteUrl(),
    gaMeasurementId: readGaId(),
    contactEmail: readEmail("CONTACT_EMAIL", DEFAULT_CONTACT_EMAIL),
    googleSiteVerification: readVerificationToken(),
  };
}

export function getReplicateApiToken() {
  const key = process.env.REPLICATE_API_TOKEN?.trim() ?? "";
  return key.length > 0 ? key : null;
}

export function limitDetails(config: AppConfig): LimitDetails {
  return {
    maxSizeMb: config.maxAudioSizeMb,
    maxDurationSeconds: config.maxDurationSeconds,
    dailyRequestLimit: config.dailyRequestLimit,
  };
}

const DEFAULT_MODEL =
  "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c";

function readModel() {
  const value = process.env.REPLICATE_TRANSCRIPTION_MODEL?.trim() || DEFAULT_MODEL;
  if (!/^[a-zA-Z0-9._:/-]+$/.test(value)) return DEFAULT_MODEL;
  return value;
}

function readPositiveInt(name: string, fallback: number, max?: number) {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) return fallback;
  if (max !== undefined && value > max) return max;
  return value;
}

function readNonNegativeInt(name: string, fallback: number) {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) return fallback;
  return value;
}

function readTimeout() {
  const value = readPositiveInt("REPLICATE_TIMEOUT_MS", 120000);
  return value < 1000 ? 120000 : value;
}

function readHeaderName(name: string) {
  const value = process.env[name]?.trim().toLowerCase() ?? "";
  if (!/^[a-z0-9-]{1,64}$/.test(value)) return "";
  return value;
}

function readSiteUrl() {
  const raw = process.env.SITE_URL?.trim() || "https://voztexto.org";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "https://voztexto.org";
    return url.origin;
  } catch {
    return "https://voztexto.org";
  }
}

function readGaId() {
  const value = process.env.GA_MEASUREMENT_ID?.trim() ?? "";
  return /^G-[A-Z0-9]+$/.test(value) ? value : "";
}

function readEmail(name: string, fallback = "") {
  const value = process.env[name]?.trim() ?? "";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return value;
  return fallback;
}

function readVerificationToken() {
  const value = process.env.GOOGLE_SITE_VERIFICATION?.trim() ?? "";
  return /^[A-Za-z0-9_-]{8,128}$/.test(value) ? value : "";
}
