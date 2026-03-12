const AUTH_CALLBACK_PATH = "/auth/callback";

const isSafeAppPath = (value: string) => value.startsWith("/") && !value.startsWith("//");

export const sanitizeNextPath = (nextPath?: string | null, fallback = "/dashboard") => {
  const normalized = nextPath?.trim();
  if (!normalized || !isSafeAppPath(normalized)) return fallback;
  return normalized;
};

const withOrigin = (path: string) => {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
};

export const buildAuthCallbackUrl = (nextPath = "/dashboard") => {
  const safeNext = sanitizeNextPath(nextPath);
  return withOrigin(`${AUTH_CALLBACK_PATH}?next=${encodeURIComponent(safeNext)}`);
};

export const buildRecoveryCallbackUrl = () =>
  buildAuthCallbackUrl("/reset-password?flow=recovery");
