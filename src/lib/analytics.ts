import { supabase } from "@/integrations/supabase/client";

/** Log a sign-in event. Call after successful login (password or OAuth). */
export async function logSignIn(userId: string, email: string | undefined) {
  try {
    await supabase.from("analytics_sign_ins").insert({
      user_id: userId,
      email: email ?? null,
    });
  } catch {
    // Non-blocking; ignore errors
  }
}

/** Log a search event. Call when user runs a search (e.g. match-listings). */
export async function logSearch(params: {
  userId: string | null;
  query: string;
  filters?: Record<string, unknown>;
  resultCount?: number;
  country?: string | null;
  region?: string | null;
}) {
  try {
    await supabase.from("analytics_searches").insert({
      user_id: params.userId ?? null,
      query: params.query,
      filters: (params.filters ?? {}) as any,
      result_count: params.resultCount ?? null,
      country: params.country ?? null,
      region: params.region ?? null,
    } as any);
  } catch {
    // Non-blocking
  }
}

/** Detect device type from User-Agent. */
export function getDeviceType(): "mobile" | "desktop" | "tablet" {
  if (typeof navigator === "undefined" || !navigator.userAgent) return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk|kindle/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

const VISITOR_ID_KEY = "adriken_visitor_id";

/** Get or create a persistent visitor id (localStorage). */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : "v_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

/** Log a page view. */
export async function logPageView(params: {
  userId: string | null;
  path: string;
  queryString?: string | null;
  referrer?: string | null;
  country?: string | null;
  visitorId?: string | null;
  device?: "mobile" | "desktop" | "tablet" | null;
  userAgent?: string | null;
}) {
  try {
    await supabase.from("analytics_page_views").insert({
      user_id: params.userId ?? null,
      path: params.path,
      query_string: params.queryString ?? null,
      referrer: params.referrer ?? null,
      country: params.country ?? null,
      visitor_id: params.visitorId ?? null,
      device: params.device ?? null,
      user_agent: params.userAgent ?? null,
    });
  } catch {
    // Non-blocking
  }
}

/** Log AI/prompt usage (e.g. match-listings). */
export async function logPromptUsage(params: {
  userId: string | null;
  promptType: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await supabase.from("analytics_prompt_usage").insert({
      user_id: params.userId ?? null,
      prompt_type: params.promptType,
      metadata: (params.metadata ?? {}) as any,
    } as any);
  } catch {
    // Non-blocking
  }
}
