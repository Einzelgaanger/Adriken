-- Add visitor_id, device, user_agent to analytics_page_views for detailed analytics
-- visitor_id: stable client id (e.g. localStorage) for unique visitors and sessions
-- device: mobile | desktop | tablet
-- user_agent: raw string for debugging (optional)
alter table public.analytics_page_views
  add column if not exists visitor_id text,
  add column if not exists device text,
  add column if not exists user_agent text;

create index if not exists idx_analytics_page_views_visitor_id on public.analytics_page_views (visitor_id);
create index if not exists idx_analytics_page_views_device on public.analytics_page_views (device);
create index if not exists idx_analytics_page_views_referrer on public.analytics_page_views (referrer);

comment on column public.analytics_page_views.visitor_id is 'Client-generated stable id for unique visitor/session metrics';
comment on column public.analytics_page_views.device is 'Device type: mobile, desktop, or tablet';
comment on column public.analytics_page_views.user_agent is 'Raw User-Agent string';
