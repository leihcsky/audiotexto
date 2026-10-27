import assert from "node:assert/strict";
import test from "node:test";
import { beginAttempt, createRateLimitStore, endAttempt } from "../lib/rate-limit";

const now = new Date("2026-10-26T12:00:00.000Z");

test("counts daily attempts and blocks the next one", () => {
  const store = createRateLimitStore();
  const options = { dailyLimit: 2, maxConcurrent: 1, now };

  assert.equal(beginAttempt(store, "ip", options).ok, true);
  endAttempt(store, "ip");
  assert.equal(beginAttempt(store, "ip", options).ok, true);
  endAttempt(store, "ip");

  const blocked = beginAttempt(store, "ip", options);
  assert.deepEqual(blocked, { ok: false, code: "daily_limit" });
});

test("blocks a second request while one is in flight", () => {
  const store = createRateLimitStore();
  const options = { dailyLimit: 3, maxConcurrent: 1, now };

  assert.equal(beginAttempt(store, "ip", options).ok, true);
  const blocked = beginAttempt(store, "ip", options);
  assert.deepEqual(blocked, { ok: false, code: "concurrent_limit" });
  endAttempt(store, "ip");
  assert.equal(beginAttempt(store, "ip", options).ok, true);
});

test("resets the counter on the next UTC day", () => {
  const store = createRateLimitStore();
  const options = { dailyLimit: 1, maxConcurrent: 1, now };
  assert.equal(beginAttempt(store, "ip", options).ok, true);
  endAttempt(store, "ip");

  const nextDay = beginAttempt(store, "ip", {
    ...options,
    now: new Date("2026-10-27T00:00:00.000Z"),
  });
  assert.equal(nextDay.ok, true);
});
