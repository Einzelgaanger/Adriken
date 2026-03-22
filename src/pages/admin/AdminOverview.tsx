import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  LogIn,
  Search,
  FileText,
  Sparkles,
  Users,
  Eye,
  MousePointerClick,
  Timer,
  TrendingDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  computeTrafficMetrics,
  dailySeries,
  bySource,
  byPage,
  byCountry,
  byDevice,
  countryLabel,
  type PageViewRow,
} from "@/lib/adminAnalytics";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const PAGE_VIEWS_DAYS = 90;
const CHART_DAYS = 14;

function usePageViewsForAnalytics() {
  return useQuery({
    queryKey: ["admin", "page-views-analytics", PAGE_VIEWS_DAYS],
    queryFn: async () => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - PAGE_VIEWS_DAYS);
      const { data, error } = await supabase
        .from("analytics_page_views")
        .select("id, created_at, visitor_id, user_id, path, referrer, device, country")
        .gte("created_at", cutoff.toISOString())
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as PageViewRow[];
    },
  });
}

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
      let todayCount = 0, last7 = 0, last30 = 0;
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
      const { data, error } = await supabase.from(table as any).select(dateColumn);
      if (error) throw error;
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      let today = 0, last7 = 0, last30 = 0;
      ((data || []) as any[]).forEach((r: Record<string, string>) => {
        const d = r[dateColumn];
        if (d >= todayStart) today++;
        if (d >= sevenDaysAgo) last7++;
        if (d >= thirtyDaysAgo) last30++;
      });
      return { today, last7, last30, total: (data || []).length };
    },
  });
}

const chartConfig = {
  visitors: { label: "Visitors", color: "hsl(217 91% 60%)" },
  pageviews: { label: "Pageviews", color: "hsl(142 76% 36%)" },
};

export default function AdminOverview() {
  const { data: pageViewRows, isLoading: loadingPv, error: errorPv } = usePageViewsForAnalytics();
  const signUps = useSignUpsStats();
  const signIns = useSignInsStats();
  const searches = useCountStats("analytics_searches", "created_at");
  const pageViews = useCountStats("analytics_page_views", "created_at");
  const prompts = useCountStats("analytics_prompt_usage", "created_at");

  const metrics = useMemo(
    () => (pageViewRows?.length ? computeTrafficMetrics(pageViewRows) : null),
    [pageViewRows],
  );
  const series = useMemo(
    () => (pageViewRows?.length ? dailySeries(pageViewRows, CHART_DAYS) : []),
    [pageViewRows],
  );
  const sourceBreakdown = useMemo(() => (pageViewRows?.length ? bySource(pageViewRows) : []), [pageViewRows]);
  const pageBreakdown = useMemo(() => (pageViewRows?.length ? byPage(pageViewRows) : []), [pageViewRows]);
  const countryBreakdown = useMemo(() => (pageViewRows?.length ? byCountry(pageViewRows) : []), [pageViewRows]);
  const deviceBreakdown = useMemo(() => (pageViewRows?.length ? byDevice(pageViewRows) : []), [pageViewRows]);

  const trafficCards = [
    {
      title: "Visitors",
      value: metrics?.visitors ?? "—",
      sub: "unique",
      icon: Users,
    },
    {
      title: "Pageviews",
      value: metrics?.pageviews ?? "—",
      sub: "total views",
      icon: Eye,
    },
    {
      title: "Views Per Visit",
      value: metrics?.viewsPerVisit ?? "—",
      sub: "avg",
      icon: MousePointerClick,
    },
    {
      title: "Visit Duration",
      value: metrics?.avgVisitDurationFormatted ?? "—",
      sub: "avg",
      icon: Timer,
    },
    {
      title: "Bounce Rate",
      value: metrics != null ? `${metrics.bounceRatePct}%` : "—",
      sub: "single-page visits",
      icon: TrendingDown,
    },
  ];

  const cards = [
    { title: "Sign-ups", data: signUps.data, loading: signUps.isLoading, icon: UserPlus },
    { title: "Sign-ins", data: signIns.data, loading: signIns.isLoading, icon: LogIn },
    { title: "Searches", data: searches.data, loading: searches.isLoading, icon: Search },
    { title: "Page views", data: pageViews.data, loading: pageViews.isLoading, icon: FileText },
    { title: "Prompt / AI calls", data: prompts.data, loading: prompts.isLoading, icon: Sparkles },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Traffic, visitors, and behavior (last {PAGE_VIEWS_DAYS} days).</p>
      </div>

      {/* Top traffic metrics */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {trafficCards.map(({ title, value, sub, icon: Icon }) => (
          <Card key={title} className="border-border/80 shadow-soft rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loadingPv ? (
                <div className="h-10 w-8 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time series chart */}
      <Card className="border-border/80 shadow-soft rounded-xl">
        <CardHeader>
          <CardTitle>Visitors & pageviews (last {CHART_DAYS} days)</CardTitle>
          <p className="text-sm text-muted-foreground">Daily unique visitors and total pageviews.</p>
        </CardHeader>
        <CardContent>
          {loadingPv && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {errorPv && <p className="text-destructive text-sm py-4">Failed to load page view data.</p>}
          {!loadingPv && !errorPv && series.length > 0 && (
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`;
                  }}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="var(--color-visitors)"
                  fill="var(--color-visitors)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="pageviews"
                  stroke="var(--color-pageviews)"
                  fill="var(--color-pageviews)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
          {!loadingPv && !errorPv && series.length === 0 && (
            <p className="text-muted-foreground text-sm py-8 text-center">No data for the last {CHART_DAYS} days.</p>
          )}
        </CardContent>
      </Card>

      {/* Source, Page, Country, Device in 2x2 grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-border/80 shadow-soft rounded-xl">
          <CardHeader>
            <CardTitle className="text-base">Source</CardTitle>
            <p className="text-sm text-muted-foreground">Where visitors came from (referrer domain).</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Source</th>
                    <th className="text-right py-2 font-semibold">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-4 text-muted-foreground">
                        No referrer data yet.
                      </td>
                    </tr>
                  )}
                  {sourceBreakdown.map(({ source, visitors }) => (
                    <tr key={source} className="border-b border-border/60">
                      <td className="py-2 pr-4 truncate max-w-[200px]" title={source}>
                        {source}
                      </td>
                      <td className="text-right py-2 tabular-nums">{visitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-soft rounded-xl">
          <CardHeader>
            <CardTitle className="text-base">Page</CardTitle>
            <p className="text-sm text-muted-foreground">Visitors per path.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Page</th>
                    <th className="text-right py-2 font-semibold">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {pageBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-4 text-muted-foreground">
                        No page view data yet.
                      </td>
                    </tr>
                  )}
                  {pageBreakdown.map(({ path, visitors }) => (
                    <tr key={path} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-mono text-xs truncate max-w-[220px]" title={path}>
                        {path}
                      </td>
                      <td className="text-right py-2 tabular-nums">{visitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-soft rounded-xl">
          <CardHeader>
            <CardTitle className="text-base">Country</CardTitle>
            <p className="text-sm text-muted-foreground">Visitors by country (when available).</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Country</th>
                    <th className="text-right py-2 font-semibold">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {countryBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-4 text-muted-foreground">
                        No country data yet.
                      </td>
                    </tr>
                  )}
                  {countryBreakdown.map(({ country, visitors }) => {
                    const { flag, name } = countryLabel(country);
                    return (
                      <tr key={country} className="border-b border-border/60">
                        <td className="py-2 pr-4">
                          <span className="mr-2">{flag}</span>
                          {country === "(unknown)" ? "(unknown)" : name}
                        </td>
                        <td className="text-right py-2 tabular-nums">{visitors}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-soft rounded-xl">
          <CardHeader>
            <CardTitle className="text-base">Device</CardTitle>
            <p className="text-sm text-muted-foreground">Mobile vs desktop vs tablet.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Device</th>
                    <th className="text-right py-2 font-semibold">Visitors</th>
                    <th className="text-right py-2 font-semibold">%</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-muted-foreground">
                        No device data yet.
                      </td>
                    </tr>
                  )}
                  {deviceBreakdown.map(({ device, visitors, pct }) => (
                    <tr key={device} className="border-b border-border/60">
                      <td className="py-2 pr-4">{device}</td>
                      <td className="text-right py-2 tabular-nums">{visitors}</td>
                      <td className="text-right py-2 tabular-nums">{pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legacy metric cards */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Other metrics</h2>
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
                    <p>
                      <span className="text-muted-foreground">Today:</span> <strong>{data.today}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Last 7d:</span> <strong>{data.last7}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Last 30d:</span> <strong>{data.last30}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Total:</span> <strong>{data.total}</strong>
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">—</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
