import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logPageView } from "@/lib/analytics";

/** Logs page views to analytics when the route changes. Skips admin route. */
export default function AnalyticsTracker() {
  const location = useLocation();
  const { user } = useAuth();
  const previousPathRef = useRef<string | null>(null);

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
    });
  }, [location.pathname, location.search, user?.id]);

  return null;
}
