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

export default function AdminSignUps() {
  const { data: rows, isLoading, error } = useQuery({
    queryKey: ["admin", "signups-daily"],
    queryFn: async () => {
      const { data, error: e } = await supabase.from("profiles").select("created_at").order("created_at", { ascending: false });
      if (e) throw e;
      return data ?? [];
    },
  });

  const daily = rows ? groupByDay(rows) : [];
  const total = rows?.length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Sign-ups</h1>
        <p className="text-muted-foreground mt-1">New profiles per day. Total: <strong>{total}</strong>.</p>
      </div>
      <Card className="border-border/80 shadow-soft rounded-xl">
        <CardHeader>
          <CardTitle>Last 90 days</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-destructive text-sm">Failed to load.</p>}
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Date</th>
                    <th className="text-right py-2 font-semibold">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.length === 0 && (
                    <tr><td colSpan={2} className="py-4 text-muted-foreground">No data.</td></tr>
                  )}
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
    </div>
  );
}
