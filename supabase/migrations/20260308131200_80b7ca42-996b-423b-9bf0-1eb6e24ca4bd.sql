
-- Add unique constraint on profiles.user_id so it can be referenced as FK
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Drop existing listings_user_id_fkey (points to auth.users) and recreate pointing to profiles
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_user_id_fkey;
ALTER TABLE public.listings
  ADD CONSTRAINT listings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Drop existing bookings FKs if any and recreate
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_provider_id_fkey;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_provider_id_fkey
  FOREIGN KEY (provider_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_seeker_id_fkey;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_seeker_id_fkey
  FOREIGN KEY (seeker_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_listing_id_fkey;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_listing_id_fkey
  FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;
