import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, LogIn, Search, FileText, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function useSignUpsStats() {
  return useQuery({
    queryKey: ["admin", "signups-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("created_at");
      if (error) throw error;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      let todayCount = 0;
      let last7 = 0;
      let last30 = 0;
      (data || []).forEach((r) => {
        const d = r.created_at;
        if (d >= today) todayCount++;
        if (d >= sevenDaysAgo) last7++;
        if (d >= thirtyDaysAgo) last30++;
      });
      return { today: todayCount, last7, last30, total: (data || []).length };
    },
  });
}

function useSignInsStats() {
  return useQuery({
    queryKey: ["admin", "signins-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_sign_ins").select("signed_at");
      if (error) throw error;
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      let today = 0, last7 = 0, last30 = 0;
      (data || []).forEach((r) => {
        if (r.signed_at >= todayStart) today++;
        if (r.signed_at >= sevenDaysAgo) last7++;
        if (r.signed_at >= thirtyDaysAgo) last30++;
      });
      return { today, last7, last30, total: (data || []).length };
    },
  });
}

function useCountStats(table: string, dateColumn: string) {
  return useQuery({
    queryKey: ["admin", "count-stats", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select(dateColumn);
      if (error) throw error;
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      let today = 0, last7 = 0, last30 = 0;
      (data || []).forEach((r: Record<string, string>) => {
        const d = r[dateColumn];
        if (d >= todayStart) today++;
        if (d >= sevenDaysAgo) last7++;
        if (d >= thirtyDaysAgo) last30++;
      });
      return { today, last7, last30, total: (data || []).length };
    },
  });
}

export default function AdminOverview() {
  const signUps = useSignUpsStats();
  const signIns = useSignInsStats();
  const searches = useCountStats("analytics_searches", "created_at");
  const pageViews = useCountStats("analytics_page_views", "created_at");
  const prompts = useCountStats("analytics_prompt_usage", "created_at");

  const cards = [
    { title: "Sign-ups", data: signUps.data, loading: signUps.isLoading, icon: UserPlus },
    { title: "Sign-ins", data: signIns.data, loading: signIns.isLoading, icon: LogIn },
    { title: "Searches", data: searches.data, loading: searches.isLoading, icon: Search },
    { title: "Page views", data: pageViews.data, loading: pageViews.isLoading, icon: FileText },
    { title: "Prompt / AI calls", data: prompts.data, loading: prompts.isLoading, icon: Sparkles },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Key metrics at a glance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ title, data, loading, icon: Icon }) => (
          <Card key={title} className="border-border/80 shadow-soft rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="h-16 flex items-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : data ? (
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Today:</span> <strong>{data.today}</strong></p>
                  <p><span className="text-muted-foreground">Last 7d:</span> <strong>{data.last7}</strong></p>
                  <p><span className="text-muted-foreground">Last 30d:</span> <strong>{data.last30}</strong></p>
                  <p><span className="text-muted-foreground">Total:</span> <strong>{data.total}</strong></p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">—</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
