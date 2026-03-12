import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

function groupByDay(rows: { created_at: string }[], days = 90) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const map: Record<string, number> = {};
  rows.forEach((r) => {
    const d = r.created_at.slice(0, 10);
    if (d >= cutoff.toISOString().slice(0, 10)) map[d] = (map[d] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}

export default function AdminPageViews() {
  const { data: rows, isLoading, error } = useQuery({
    queryKey: ["admin", "page-views-all"],
    queryFn: async () => {
      const { data, error: e } = await supabase.from("analytics_page_views").select("path, created_at").order("created_at", { ascending: false });
      if (e) throw e;
      return data ?? [];
    },
  });

  const daily = useMemo(() => (rows ? groupByDay(rows) : []), [rows]);
  const total = rows?.length ?? 0;

  const byPath = useMemo(() => {
    if (!rows) return [];
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const p = r.path || "/";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [rows]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Page views</h1>
        <p className="text-muted-foreground mt-1">Total: {total}.</p>
      </div>
      <Card className="border-border/80 shadow-soft rounded-xl">
        <CardHeader>
          <CardTitle>Views per day (last 90 days)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-destructive text-sm">Failed to load.</p>}
          {!isLoading && !error && (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Date</th>
                    <th className="text-right py-2 font-semibold">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.length === 0 && <tr><td colSpan={2} className="py-4 text-muted-foreground">No data.</td></tr>}
                  {daily.map(([date, count]) => (
                    <tr key={date} className="border-b border-border/60">
                      <td className="py-2 pr-4">{date}</td>
                      <td className="text-right py-2">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="border-border/80 shadow-soft rounded-xl">
        <CardHeader>
          <CardTitle>Views by path (page details)</CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && !error && byPath.length > 0 && (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Path</th>
                    <th className="text-right py-2 pr-2 font-semibold">Views</th>
                    <th className="text-right py-2 font-semibold">Pct</th>
                  </tr>
                </thead>
                <tbody>
                  {byPath.map(([path, count]) => (
                    <tr key={path} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-mono text-xs truncate max-w-md" title={path}>{path}</td>
                      <td className="text-right py-2 pr-2">{count}</td>
                      <td className="text-right py-2">{total ? ((100 * count) / total).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && byPath.length === 0 && <p className="text-muted-foreground text-sm">No page view data yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
