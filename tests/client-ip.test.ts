import assert from "node:assert/strict";
import test from "node:test";
import { getClientIp } from "../lib/client-ip";

test("ignores forwarded headers unless a trusted header is configured", () => {
  const headers = new Headers({ "x-forwarded-for": "1.2.3.4" });
  assert.equal(getClientIp({ headers }, { trustedIpHeader: "", trustedProxyCount: 1 }), "direct");
});

test("reads a single proxy-set address", () => {
  const headers = new Headers({ "x-real-ip": "203.0.113.8" });
  assert.equal(
    getClientIp({ headers }, { trustedIpHeader: "x-real-ip", trustedProxyCount: 0 }),
    "203.0.113.8",
  );
});

test("does not trust a client-supplied forwarded list without a proxy count", () => {
  const headers = new Headers({ "x-forwarded-for": "1.1.1.1, 203.0.113.8" });
  assert.equal(
    getClientIp({ headers }, { trustedIpHeader: "x-forwarded-for", trustedProxyCount: 0 }),
    "unknown",
  );
});

test("uses the hop added by the trusted proxy", () => {
  const headers = new Headers({ "x-forwarded-for": "1.1.1.1, 203.0.113.8" });
  assert.equal(
    getClientIp({ headers }, { trustedIpHeader: "x-forwarded-for", trustedProxyCount: 1 }),
    "203.0.113.8",
  );
});

test("rejects a comma-separated real-ip header", () => {
  const headers = new Headers({ "x-real-ip": "1.1.1.1, 203.0.113.8" });
  assert.equal(
    getClientIp({ headers }, { trustedIpHeader: "x-real-ip", trustedProxyCount: 0 }),
    "unknown",
  );
});
