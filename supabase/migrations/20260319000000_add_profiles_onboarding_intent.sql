-- What the user said they want to do during onboarding: goods, service, or friends.
-- Used to tailor onboarding (e.g. don't push goods upload for "friends").
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_intent text DEFAULT NULL;

COMMENT ON COLUMN public.profiles.onboarding_intent IS 'Onboarding choice: goods, service, or friends. Used to tailor onboarding flow.';
