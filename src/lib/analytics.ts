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
      filters: params.filters ?? {},
      result_count: params.resultCount ?? null,
      country: params.country ?? null,
      region: params.region ?? null,
    });
  } catch {
    // Non-blocking
  }
}

/** Log a page view. */
export async function logPageView(params: {
  userId: string | null;
  path: string;
  queryString?: string | null;
  referrer?: string | null;
  country?: string | null;
}) {
  try {
    await supabase.from("analytics_page_views").insert({
      user_id: params.userId ?? null,
      path: params.path,
      query_string: params.queryString ?? null,
      referrer: params.referrer ?? null,
      country: params.country ?? null,
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
      metadata: params.metadata ?? {},
    });
  } catch {
    // Non-blocking
  }
}
