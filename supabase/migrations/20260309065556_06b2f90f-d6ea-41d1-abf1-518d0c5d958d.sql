
-- Add social/contact fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tiktok text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facebook text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_public text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_images text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_videos text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_consent boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_date timestamptz;

-- Storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolios', 'portfolios', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certifications', 'certifications', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for avatars
CREATE POLICY "Users can upload own avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'portfolios', 'certifications'));
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage RLS policies for portfolios
CREATE POLICY "Users can upload own portfolios" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolios' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own portfolios" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolios' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own portfolios" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolios' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage RLS policies for certifications
CREATE POLICY "Users can upload own certifications" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'certifications' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own certifications" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'certifications' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own certifications" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'certifications' AND (storage.foldername(name))[1] = auth.uid()::text);
