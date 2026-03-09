
-- Allow anonymous (non-authenticated) users to insert reviews
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
CREATE POLICY "Anyone can create reviews"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Make reviewer_id nullable for anonymous reviews
ALTER TABLE public.reviews ALTER COLUMN reviewer_id DROP NOT NULL;
