import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { countryLabel } from "@/lib/adminAnalytics";

const chartConfig = { visitors: { label: "Visitors", color: "hsl(217 91% 60%)" } };

export default function AdminRegional() {
  const searchesByCountry = useQuery({
    queryKey: ["admin", "regional-searches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_searches").select("country, region");
      if (error) throw error;
      const map: Record<string, number> = {};
      (data || []).forEach((r) => {
        const c = r.country || "(unknown)";
        map[c] = (map[c] || 0) + 1;
      });
      return Object.entries(map).sort((a, b) => b[1] - a[1]);
    },
  });

  const pageViewsByCountry = useQuery({
    queryKey: ["admin", "regional-pageviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_page_views").select("country");
      if (error) throw error;
      const map: Record<string, number> = {};
      (data || []).forEach((r) => {
        const c = r.country || "(unknown)";
        map[c] = (map[c] || 0) + 1;
      });
      return Object.entries(map).sort((a, b) => b[1] - a[1]);
    },
  });

  const countryChartData = useMemo(() => {
    const d = pageViewsByCountry.data ?? [];
    return d.slice(0, 15).map(([country, visitors]) => {
      const { name } = countryLabel(country);
      return { country: country === "(unknown)" ? "Unknown" : name, visitors };
    });
  }, [pageViewsByCountry.data]);

  const profilesByLocation = useQuery({
    queryKey: ["admin", "regional-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("location");
      if (error) throw error;
      const map: Record<string, number> = {};
      (data || []).forEach((r) => {
        const loc = (r.location || "").trim() || "(not set)";
        map[loc] = (map[loc] || 0) + 1;
      });
      return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 50);
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Regional analysis</h1>
        <p className="text-muted-foreground mt-1">Country/region from searches and page views; profile locations.</p>
      </div>

      <Card className="border-border/80 shadow-soft rounded-xl">
        <CardHeader>
          <CardTitle>Searches by country</CardTitle>
          <p className="text-sm text-muted-foreground">When country is recorded (optional field)</p>
        </CardHeader>
        <CardContent>
          {searchesByCountry.isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {searchesByCountry.error && <p className="text-destructive text-sm">Failed to load.</p>}
          {!searchesByCountry.isLoading && !searchesByCountry.error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Country</th>
                    <th className="text-right py-2 font-semibold">Searches</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchesByCountry.data?.length ?? 0) === 0 && (
                    <tr><td colSpan={2} className="py-4 text-muted-foreground">No country data yet. Country can be added to analytics later.</td></tr>
                  )}
                  {searchesByCountry.data?.map(([country, count]) => (
                    <tr key={country} className="border-b border-border/60">
                      <td className="py-2 pr-4">{country}</td>
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
          <CardTitle>Page views by country</CardTitle>
          <p className="text-sm text-muted-foreground">Top 15 countries (chart).</p>
        </CardHeader>
        <CardContent>
          {pageViewsByCountry.isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!pageViewsByCountry.isLoading && !pageViewsByCountry.error && countryChartData.length > 0 && (
            <div className="mb-6">
              <ChartContainer config={chartConfig} className="h-[240px] w-full">
                <BarChart data={countryChartData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="country" tickLine={false} axisLine={false} width={100} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
          {!pageViewsByCountry.isLoading && !pageViewsByCountry.error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Country</th>
                    <th className="text-right py-2 font-semibold">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {(pageViewsByCountry.data?.length ?? 0) === 0 && (
                    <tr><td colSpan={2} className="py-4 text-muted-foreground">No country data yet.</td></tr>
                  )}
                  {pageViewsByCountry.data?.map(([country, count]) => (
                    <tr key={country} className="border-b border-border/60">
                      <td className="py-2 pr-4">{country}</td>
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
          <CardTitle>Profile locations (top 50)</CardTitle>
          <p className="text-sm text-muted-foreground">From profiles.location</p>
        </CardHeader>
        <CardContent>
          {profilesByLocation.isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!profilesByLocation.isLoading && !profilesByLocation.error && (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Location</th>
                    <th className="text-right py-2 font-semibold">Profiles</th>
                  </tr>
                </thead>
                <tbody>
                  {profilesByLocation.data?.map(([loc, count]) => (
                    <tr key={loc} className="border-b border-border/60">
                      <td className="py-2 pr-4 truncate max-w-xs" title={loc}>{loc}</td>
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
