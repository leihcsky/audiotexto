export type RateLimitStore = {
  daily: Map<string, { day: string; count: number }>;
  inflight: Map<string, number>;
};

export type RateLimitOptions = {
  dailyLimit: number;
  maxConcurrent: number;
  now?: Date;
};

const globalStore = globalThis as unknown as { audioTextoRateLimit?: RateLimitStore };

export function createRateLimitStore(): RateLimitStore {
  return {
    daily: new Map(),
    inflight: new Map(),
  };
}

export function getRateLimitStore() {
  if (!globalStore.audioTextoRateLimit) {
    globalStore.audioTextoRateLimit = createRateLimitStore();
  }
  return globalStore.audioTextoRateLimit;
}

export function beginAttempt(store: RateLimitStore, key: string, options: RateLimitOptions) {
  const day = utcDay(options.now ?? new Date());
  pruneOldDays(store, day);

  const inflight = store.inflight.get(key) ?? 0;
  if (inflight >= options.maxConcurrent) {
    return { ok: false as const, code: "concurrent_limit" as const };
  }

  const current = store.daily.get(key);
  const count = current && current.day === day ? current.count : 0;
  if (count >= options.dailyLimit) {
    return { ok: false as const, code: "daily_limit" as const };
  }

  store.daily.set(key, { day, count: count + 1 });
  store.inflight.set(key, inflight + 1);
  return { ok: true as const };
}

export function endAttempt(store: RateLimitStore, key: string) {
  const inflight = store.inflight.get(key) ?? 0;
  if (inflight <= 1) store.inflight.delete(key);
  else store.inflight.set(key, inflight - 1);
}

function utcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

function pruneOldDays(store: RateLimitStore, day: string) {
  if (store.daily.size <= 5000) return;
  for (const [key, entry] of store.daily) {
    if (entry.day !== day) store.daily.delete(key);
  }
}
