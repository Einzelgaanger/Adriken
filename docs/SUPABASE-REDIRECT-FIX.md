# Fix "Redirect to /dashboard#" After Login

If users still land on `https://adriken.com/dashboard#` after Google sign-in (or email confirmation), the redirect is coming from **Supabase**, not the app. Fix it in the Supabase Dashboard:

## Steps

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard)** and open your project.
2. Open **Authentication** → **URL Configuration**.
3. Set **Site URL** to:
   ```
   https://adriken.com
   ```
   (Do not use `https://adriken.com/dashboard`.)
4. Under **Redirect URLs**, add (if not already there):
   - `https://adriken.com`
   - `https://adriken.com/`
   Remove `https://adriken.com/dashboard` if it is listed.
5. Save.

After this, new sign-ins and confirmations will redirect to the Find Services page (`/`) instead of `/dashboard`.
