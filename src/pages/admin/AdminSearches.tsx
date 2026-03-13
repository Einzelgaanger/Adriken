import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const CHART_DAYS = 30;

function groupByDay(rows: { created_at: string }[], days = 90) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const map: Record<string, number> = {};
  rows.forEach((r) => {
    const d = r.created_at.slice(0, 10);
    if (d >= cutoff.toISOString().slice(0, 10)) map[d] = (map[d] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
}

const chartConfig = { searches: { label: "Searches", color: "hsl(142 76% 36%)" } };

export default function AdminSearches() {
  const { data: rows, isLoading, error } = useQuery({
    queryKey: ["admin", "searches-all"],
    queryFn: async () => {
      const res = await supabase.from("analytics_searches").select("query, created_at, result_count").order("created_at", { ascending: false });
      if (res.error) throw res.error;
      return res.data ?? [];
    },
  });

  const daily = useMemo(() => (rows ? groupByDay(rows, 90) : []), [rows]);
  const chartData = useMemo(() => daily.slice(-CHART_DAYS).map(([date, searches]) => ({ date, searches })), [daily]);
  const total = rows?.length ?? 0;

  const topicCounts = useMemo(() => {
    if (!rows) return [];
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const q = (r.query || "").trim().toLowerCase() || "(empty)";
      map[q] = (map[q] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 50);
  }, [rows]);

  const avgResultCount = useMemo(() => {
    if (!rows?.length) return null;
    const withCount = rows.filter((r) => r.result_count != null);
    if (withCount.length === 0) return null;
    return (withCount.reduce((s, r) => s + (r.result_count ?? 0), 0) / withCount.length).toFixed(1);
  }, [rows]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Searches</h1>
        <p className="text-muted-foreground mt-1">Total: {total}. Avg results: {avgResultCount ?? "-"}</p>
      </div>
      <Card className="border-border/80 shadow-soft rounded-xl">
        <CardHeader>
          <CardTitle>Searches per day (last {CHART_DAYS} days)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-destructive text-sm">Failed to load.</p>}
          {!isLoading && !error && chartData.length > 0 && (
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en", { day: "numeric", month: "short" })}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="searches" fill="var(--color-searches)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          {!isLoading && !error && chartData.length === 0 && <p className="text-muted-foreground text-sm py-4">No data for the last {CHART_DAYS} days.</p>}
        </CardContent>
      </Card>
      <Card className="border-border/80 shadow-soft rounded-xl">
        <CardHeader>
          <CardTitle>Top queries by frequency</CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && !error && topicCounts.length > 0 && (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Query</th>
                    <th className="text-right py-2 pr-2 font-semibold">Count</th>
                    <th className="text-right py-2 font-semibold">Pct</th>
                  </tr>
                </thead>
                <tbody>
                  {topicCounts.map(([query, count]) => (
                    <tr key={query} className="border-b border-border/60">
                      <td className="py-2 pr-4 truncate max-w-xs" title={query}>{query}</td>
                      <td className="text-right py-2 pr-2">{count}</td>
                      <td className="text-right py-2">{total ? ((100 * count) / total).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && topicCounts.length === 0 && <p className="text-muted-foreground text-sm">No search data yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
