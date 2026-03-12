-- Keep listing.rating and listing.review_count in sync with the reviews table.
-- Run after INSERT, UPDATE, or DELETE on reviews.

CREATE OR REPLACE FUNCTION public.sync_listing_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lid UUID;
  avg_rating NUMERIC;
  cnt INTEGER;
BEGIN
  -- Determine which listing_id to recalc (OLD for DELETE/UPDATE, NEW for INSERT/UPDATE)
  IF TG_OP = 'DELETE' THEN
    lid := OLD.listing_id;
  ELSE
    lid := NEW.listing_id;
  END IF;

  SELECT COALESCE(AVG(rating), 0), COUNT(*)
  INTO avg_rating, cnt
  FROM public.reviews
  WHERE listing_id = lid;

  UPDATE public.listings
  SET rating = ROUND(avg_rating::numeric, 2),
      review_count = cnt,
      updated_at = now()
  WHERE id = lid;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS sync_listing_rating_trigger ON public.reviews;
CREATE TRIGGER sync_listing_rating_trigger
  AFTER INSERT OR UPDATE OF rating OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_listing_rating();

-- Backfill: set rating and review_count for all listings that have reviews
UPDATE public.listings l
SET
  rating = r.avg_rating,
  review_count = r.cnt,
  updated_at = now()
FROM (
  SELECT listing_id, ROUND(AVG(rating)::numeric, 2) AS avg_rating, COUNT(*)::integer AS cnt
  FROM public.reviews
  GROUP BY listing_id
) r
WHERE l.id = r.listing_id;
