-- Multiple onboarding choices: goods, service, friends (any combination).
-- Replaces single onboarding_intent; we keep onboarding_intent for backward compatibility and backfill.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_intents text[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.onboarding_intents IS 'Onboarding choices: array of goods, service, friends. Used to tailor onboarding flow.';

-- Backfill: copy single onboarding_intent into array where set
UPDATE public.profiles
SET onboarding_intents = ARRAY[onboarding_intent]
WHERE onboarding_intent IS NOT NULL AND onboarding_intent != ''
  AND (onboarding_intents IS NULL OR onboarding_intents = '{}');
