export function isAllowedOrigin(origin, expectedOrigin) {
  if (!origin) {
    return true;
  }

  try {
    const candidate = new URL(origin);
    const expected = new URL(expectedOrigin);

    if (candidate.origin === expected.origin) {
      return true;
    }

    const isLocalHost = (host) => {
      const normalized = host.replace(/^www\./, "").replace(/^\[|\]$/g, "");
      return ["localhost", "127.0.0.1", "::1"].includes(normalized);
    };

    // Local development: allow any origin reaching a localhost API, and let
    // any origin through while SITE_URL is still pointed at localhost.
    // Production: only the exact configured origin is accepted.
    if (isLocalHost(candidate.hostname) || isLocalHost(expected.hostname)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}