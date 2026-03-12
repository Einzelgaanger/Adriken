-- Track when user completed onboarding (null = not completed, show onboarding flow)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN public.profiles.onboarding_completed_at IS 'When the user completed the onboarding flow; null means show onboarding.';
