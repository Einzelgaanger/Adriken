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

export default function AdminPrompts() {
  const { data: rows, isLoading, error } = useQuery({
    queryKey: ["admin", "prompts-all"],
    queryFn: async () => {
      const { data, error: e } = await supabase.from("analytics_prompt_usage").select("prompt_type, created_at").order("created_at", { ascending: false });
      if (e) throw e;
      return data ?? [];
    },
  });

  const daily = useMemo(() => (rows ? groupByDay(rows) : []), [rows]);
  const total = rows?.length ?? 0;

  const byType = useMemo(() => {
    if (!rows) return [];
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const t = r.prompt_type || "unknown";
      map[t] = (map[t] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [rows]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Prompts / AI usage</h1>
        <p className="text-muted-foreground mt-1">Match-listings and other AI calls. Total: <strong>{total}</strong>.</p>
      </div>
      <Card className="border-border/80 shadow-soft rounded-xl">
        <CardHeader>
          <CardTitle>Usage per day (last 90 days) — rates</CardTitle>
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
          <CardTitle>By prompt type</CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && !error && byType.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Type</th>
                    <th className="text-right py-2 pr-2 font-semibold">Count</th>
                    <th className="text-right py-2 font-semibold">%</th>
                  </tr>
                </thead>
                <tbody>
                  {byType.map(([type, count]) => (
                    <tr key={type} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-mono">{type}</td>
                      <td className="text-right py-2 pr-2">{count}</td>
                      <td className="text-right py-2">{total ? ((100 * count) / total).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && byType.length === 0 && <p className="text-muted-foreground text-sm">No prompt data yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
