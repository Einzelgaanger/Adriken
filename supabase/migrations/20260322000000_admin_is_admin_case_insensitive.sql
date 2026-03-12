-- Make admin check case-insensitive so JWT email casing (e.g. from OAuth) doesn't block access
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_allowed_emails
    where lower(trim(email)) = lower(trim(coalesce(auth.jwt()->>'email', '')))
  );
$$;
