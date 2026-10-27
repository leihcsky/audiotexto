export const ANALYTICS_EVENTS = [
  "upload_started",
  "transcription_started",
  "transcription_succeeded",
  "transcription_failed",
  "transcript_copied",
  "transcript_downloaded",
  "limit_reached",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event);
}
