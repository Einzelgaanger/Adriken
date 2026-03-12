-- Admin access: only these emails can access /weareadmins (checked in app + optional RLS helper)
create table if not exists public.admin_allowed_emails (
  email text primary key
);

-- Seed the two admin emails
insert into public.admin_allowed_emails (email) values
  ('binfred.ke@gmail.com'),
  ('adriankenadams@gmail.com')
on conflict (email) do nothing;

-- Function to check if current user's email is in the allowed list (for RLS).
-- Uses auth.jwt() so it runs in the context of the requesting user.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_allowed_emails
    where email = coalesce(auth.jwt()->>'email', '')
  );
$$;

-- RLS: no direct client access; is_admin() reads via SECURITY DEFINER.
alter table public.admin_allowed_emails enable row level security;

-- RPC for client: returns whether current user is an admin (without exposing the email list).
create or replace function public.get_my_admin_status()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.is_admin();
$$;

-- No insert/update/delete on admin_allowed_emails from client; manage via migrations or service role if needed.
