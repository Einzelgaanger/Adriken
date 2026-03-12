-- Add optional company/personal website URL to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS website_url text DEFAULT NULL;

COMMENT ON COLUMN public.profiles.website_url IS 'Optional company or personal website URL shown on provider profile';
