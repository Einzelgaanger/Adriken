
-- Drop the existing restrictive INSERT policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;

CREATE POLICY "Anyone can create reviews"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
