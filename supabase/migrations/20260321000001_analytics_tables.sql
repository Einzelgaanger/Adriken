-- Analytics: sign-ins (logged from app on each login)
create table if not exists public.analytics_sign_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  signed_at timestamptz not null default now()
);

create index if not exists idx_analytics_sign_ins_signed_at on public.analytics_sign_ins (signed_at);
create index if not exists idx_analytics_sign_ins_user_id on public.analytics_sign_ins (user_id);

alter table public.analytics_sign_ins enable row level security;

create policy "Authenticated users can insert own sign-in"
  on public.analytics_sign_ins for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Only admins can read sign-ins"
  on public.analytics_sign_ins for select
  using (public.is_admin());

-- Analytics: searches (logged when user runs a search)
create table if not exists public.analytics_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  query text not null,
  filters jsonb default '{}',
  result_count int,
  created_at timestamptz not null default now(),
  country text,
  region text
);

create index if not exists idx_analytics_searches_created_at on public.analytics_searches (created_at);
create index if not exists idx_analytics_searches_query on public.analytics_searches (query);
create index if not exists idx_analytics_searches_user_id on public.analytics_searches (user_id);

alter table public.analytics_searches enable row level security;

create policy "Anyone can insert search event"
  on public.analytics_searches for insert
  with check (true);

create policy "Only admins can read searches"
  on public.analytics_searches for select
  using (public.is_admin());

-- Analytics: page views
create table if not exists public.analytics_page_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  path text not null,
  query_string text,
  referrer text,
  created_at timestamptz not null default now(),
  country text
);

create index if not exists idx_analytics_page_views_created_at on public.analytics_page_views (created_at);
create index if not exists idx_analytics_page_views_path on public.analytics_page_views (path);
create index if not exists idx_analytics_page_views_user_id on public.analytics_page_views (user_id);

alter table public.analytics_page_views enable row level security;

create policy "Anyone can insert page view"
  on public.analytics_page_views for insert
  with check (true);

create policy "Only admins can read page views"
  on public.analytics_page_views for select
  using (public.is_admin());

-- Analytics: prompt / AI usage (e.g. match-listings)
create table if not exists public.analytics_prompt_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  prompt_type text not null,
  created_at timestamptz not null default now(),
  metadata jsonb default '{}'
);

create index if not exists idx_analytics_prompt_usage_created_at on public.analytics_prompt_usage (created_at);
create index if not exists idx_analytics_prompt_usage_type on public.analytics_prompt_usage (prompt_type);
create index if not exists idx_analytics_prompt_usage_user_id on public.analytics_prompt_usage (user_id);

alter table public.analytics_prompt_usage enable row level security;

create policy "Anyone can insert prompt usage"
  on public.analytics_prompt_usage for insert
  with check (true);

create policy "Only admins can read prompt usage"
  on public.analytics_prompt_usage for select
  using (public.is_admin());
