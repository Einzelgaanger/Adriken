import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logPageView, getVisitorId, getDeviceType } from "@/lib/analytics";

const COUNTRY_CACHE_KEY = "adriken_geo_country";
const COUNTRY_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h

function getCachedCountry(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(COUNTRY_CACHE_KEY);
    if (!raw) return null;
    const { country, at } = JSON.parse(raw) as { country: string; at: number };
    if (Date.now() - at > COUNTRY_CACHE_MAX_AGE_MS) return null;
    return country || null;
  } catch {
    return null;
  }
}

function setCachedCountry(country: string) {
  try {
    sessionStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify({ country, at: Date.now() }));
  } catch {
    // ignore
  }
}

/** Fetch country once per session (free no-key API). */
function useCountry(): string | null {
  const [country, setCountry] = useState<string | null>(getCachedCountry);

  useEffect(() => {
    if (getCachedCountry()) return;
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const c = data?.country_code ?? data?.country_name ?? null;
        if (c) {
          setCountry(c);
          setCachedCountry(c);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return country;
}

/** Logs page views to analytics when the route changes. Skips admin route. */
export default function AnalyticsTracker() {
  const location = useLocation();
  const { user } = useAuth();
  const previousPathRef = useRef<string | null>(null);
  const country = useCountry();

  useEffect(() => {
    const path = location.pathname + location.search;
    if (path === previousPathRef.current) return;
    previousPathRef.current = path;

    if (path.startsWith("/weareadmins")) return;

    void logPageView({
      userId: user?.id ?? null,
      path: location.pathname,
      queryString: location.search || null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      country: country ?? null,
      visitorId: getVisitorId() || null,
      device: getDeviceType(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent || null : null,
    });
  }, [location.pathname, location.search, user?.id, country]);

  return null;
}
