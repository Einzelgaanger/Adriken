/**
 * Admin analytics: compute visitors, sessions, bounce, duration, and breakdowns
 * from raw page_views. Session = same visitor, max 30min gap between views.
 */

const SESSION_GAP_MS = 30 * 60 * 1000;

export type PageViewRow = {
  id?: string;
  created_at: string;
  visitor_id: string | null;
  user_id: string | null;
  path: string | null;
  referrer: string | null;
  device: string | null;
  country: string | null;
};

function visitorKey(r: PageViewRow): string {
  if (r.visitor_id) return r.visitor_id;
  if (r.user_id) return "u_" + r.user_id;
  return "anon_" + r.id;
}

/** Group rows into sessions (same visitor, split by 30min gap). */
function toSessions(rows: PageViewRow[]): PageViewRow[][] {
  const byVisitor: Record<string, PageViewRow[]> = {};
  rows.forEach((r) => {
    const k = visitorKey(r);
    if (!byVisitor[k]) byVisitor[k] = [];
    byVisitor[k].push(r);
  });
  const sessions: PageViewRow[][] = [];
  Object.values(byVisitor).forEach((visitorRows) => {
    visitorRows.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    let session: PageViewRow[] = [];
    let lastTs = 0;
    visitorRows.forEach((r) => {
      const ts = new Date(r.created_at).getTime();
      if (session.length && ts - lastTs > SESSION_GAP_MS) {
        sessions.push(session);
        session = [];
      }
      session.push(r);
      lastTs = ts;
    });
    if (session.length) sessions.push(session);
  });
  return sessions;
}

export type TrafficMetrics = {
  visitors: number;
  pageviews: number;
  sessions: number;
  viewsPerVisit: number;
  avgVisitDurationMs: number;
  avgVisitDurationFormatted: string;
  bounceRatePct: number;
};

export function computeTrafficMetrics(rows: PageViewRow[]): TrafficMetrics {
  const visitors = new Set(rows.map(visitorKey).filter(Boolean)).size;
  const pageviews = rows.length;
  const sessions = toSessions(rows);
  const viewsPerVisit = sessions.length ? pageviews / sessions.length : 0;
  let totalDurationMs = 0;
  let durationCount = 0;
  sessions.forEach((sess) => {
    if (sess.length < 2) return;
    const first = new Date(sess[0].created_at).getTime();
    const last = new Date(sess[sess.length - 1].created_at).getTime();
    totalDurationMs += last - first;
    durationCount++;
  });
  const avgVisitDurationMs = durationCount ? totalDurationMs / durationCount : 0;
  const bounceCount = sessions.filter((s) => s.length === 1).length;
  const bounceRatePct = sessions.length ? (100 * bounceCount) / sessions.length : 0;
  const avgVisitDurationFormatted = formatDuration(avgVisitDurationMs);
  return {
    visitors,
    pageviews,
    sessions,
    viewsPerVisit: Math.round(viewsPerVisit * 100) / 100,
    avgVisitDurationMs,
    avgVisitDurationFormatted,
    bounceRatePct: Math.round(bounceRatePct * 10) / 10,
  };
}

function formatDuration(ms: number): string {
  if (ms < 1000) return ms + "ms";
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return sec + "s";
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  if (min < 60) return s ? `${min}m ${s}s` : `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Daily time series: date -> { visitors, pageviews } */
export function dailySeries(rows: PageViewRow[], days = 14): { date: string; visitors: number; pageviews: number }[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const byDate: Record<string, { visitors: Set<string>; pageviews: number }> = {};
  rows.forEach((r) => {
    const d = r.created_at.slice(0, 10);
    if (d < cutoff.toISOString().slice(0, 10)) return;
    if (!byDate[d]) byDate[d] = { visitors: new Set(), pageviews: 0 };
    byDate[d].visitors.add(visitorKey(r));
    byDate[d].pageviews++;
  });
  const dates = Object.keys(byDate).sort();
  return dates.map((date) => ({
    date,
    visitors: byDate[date].visitors.size,
    pageviews: byDate[date].pageviews,
  }));
}

/** Normalize referrer to source label (domain or "Direct"). */
export function referrerToSource(referrer: string | null): string {
  if (!referrer || !referrer.trim()) return "Direct";
  try {
    const u = new URL(referrer);
    const host = u.hostname.replace(/^www\./, "");
    const currentHost = typeof window !== "undefined" ? window.location?.hostname : null;
    if (!host || host === "localhost" || host === currentHost) return "Direct";
    return host;
  } catch {
    return "Direct";
  }
}

/** By source: source -> visitors (unique count) */
export function bySource(rows: PageViewRow[]): { source: string; visitors: number }[] {
  const bySourceMap: Record<string, Set<string>> = {};
  rows.forEach((r) => {
    const src = referrerToSource(r.referrer);
    if (!bySourceMap[src]) bySourceMap[src] = new Set();
    bySourceMap[src].add(visitorKey(r));
  });
  return Object.entries(bySourceMap)
    .map(([source, set]) => ({ source, visitors: set.size }))
    .sort((a, b) => b.visitors - a.visitors);
}

/** By page: path -> visitors */
export function byPage(rows: PageViewRow[]): { path: string; visitors: number }[] {
  const byPath: Record<string, Set<string>> = {};
  rows.forEach((r) => {
    const p = r.path || "/";
    if (!byPath[p]) byPath[p] = new Set();
    byPath[p].add(visitorKey(r));
  });
  return Object.entries(byPath)
    .map(([path, set]) => ({ path, visitors: set.size }))
    .sort((a, b) => b.visitors - a.visitors);
}

/** By country: code -> visitors */
export function byCountry(rows: PageViewRow[]): { country: string; visitors: number }[] {
  const byCountryMap: Record<string, Set<string>> = {};
  rows.forEach((r) => {
    const c = r.country?.trim() || "(unknown)";
    if (!byCountryMap[c]) byCountryMap[c] = new Set();
    byCountryMap[c].add(visitorKey(r));
  });
  return Object.entries(byCountryMap)
    .map(([country, set]) => ({ country, visitors: set.size }))
    .sort((a, b) => b.visitors - a.visitors);
}

/** By device: device -> unique visitors (pct of total visitors). */
export function byDevice(rows: PageViewRow[]): { device: string; visitors: number; pct: number }[] {
  const byDeviceMap: Record<string, Set<string>> = {};
  const allVisitors = new Set<string>();
  rows.forEach((r) => {
    const k = visitorKey(r);
    allVisitors.add(k);
    const d = r.device?.toLowerCase() || "unknown";
    const key = d === "mobile" ? "Mobile" : d === "desktop" ? "Desktop" : d === "tablet" ? "Tablet" : "Unknown";
    if (!byDeviceMap[key]) byDeviceMap[key] = new Set();
    byDeviceMap[key].add(k);
  });
  const total = allVisitors.size;
  return Object.entries(byDeviceMap)
    .map(([device, set]) => ({
      device,
      visitors: set.size,
      pct: total ? Math.round((100 * set.size) / total * 10) / 10 : 0,
    }))
    .sort((a, b) => b.visitors - a.visitors);
}

/** Country code to flag emoji (subset). */
const COUNTRY_FLAGS: Record<string, string> = {
  KE: "🇰🇪", US: "🇺🇸", IN: "🇮🇳", CN: "🇨🇳", NL: "🇳🇱", GB: "🇬🇧", UK: "🇬🇧",
  DE: "🇩🇪", FR: "🇫🇷", NG: "🇳🇬", ZA: "🇿🇦", EG: "🇪🇬", CA: "🇨🇦", AU: "🇦🇺",
  BR: "🇧🇷", MX: "🇲🇽", PK: "🇵🇰", BD: "🇧🇩", PH: "🇵🇭", TZ: "🇹🇿", UG: "🇺🇬",
};
const COUNTRY_NAMES: Record<string, string> = {
  KE: "Kenya", US: "United States", IN: "India", CN: "China", NL: "Netherlands",
  GB: "United Kingdom", UK: "United Kingdom", DE: "Germany", FR: "France",
  NG: "Nigeria", ZA: "South Africa", EG: "Egypt", CA: "Canada", AU: "Australia",
  BR: "Brazil", MX: "Mexico", PK: "Pakistan", BD: "Bangladesh", PH: "Philippines",
  TZ: "Tanzania", UG: "Uganda",
};

export function countryLabel(code: string): { flag: string; name: string } {
  const upper = (code || "").toUpperCase().slice(0, 2);
  return {
    flag: COUNTRY_FLAGS[upper] || "🌐",
    name: COUNTRY_NAMES[upper] || upper || "Unknown",
  };
}
