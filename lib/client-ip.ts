export type ClientIpOptions = {
  trustedIpHeader: string;
  trustedProxyCount: number;
};

type HeaderSource = {
  headers: {
    get(name: string): string | null;
  };
};

export function getClientIp(request: HeaderSource, options: ClientIpOptions) {
  const headerName = options.trustedIpHeader.trim().toLowerCase();
  if (!headerName) return "direct";

  const raw = request.headers.get(headerName);
  if (!raw) return "unknown";

  const parts = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (headerName === "x-forwarded-for") {
    if (!Number.isInteger(options.trustedProxyCount) || options.trustedProxyCount <= 0) {
      return "unknown";
    }
    const index = parts.length - options.trustedProxyCount;
    if (index < 0) return "unknown";
    return normalizeIp(parts[index]) ?? "unknown";
  }

  if (parts.length !== 1) return "unknown";
  return normalizeIp(parts[0]) ?? "unknown";
}

function normalizeIp(value: string) {
  if (value.length === 0 || value.length > 64) return null;
  if (!/^[0-9a-fA-F:.]+$/.test(value)) return null;
  return value;
}
