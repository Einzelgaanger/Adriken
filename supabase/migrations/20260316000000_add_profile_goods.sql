-- Goods (items/products) under profile: name, price, description, location, media (all optional).
-- Used for search and shown on provider profile (e.g. realtors with goods in different places).
CREATE TABLE public.profile_goods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT,
  price NUMERIC,
  description TEXT,
  location TEXT,
  media_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_goods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profile goods are viewable by everyone" ON public.profile_goods FOR SELECT USING (true);
CREATE POLICY "Users can insert their own goods" ON public.profile_goods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goods" ON public.profile_goods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goods" ON public.profile_goods FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_profile_goods_updated_at BEFORE UPDATE ON public.profile_goods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_profile_goods_user ON public.profile_goods(user_id);

COMMENT ON TABLE public.profile_goods IS 'Optional goods/items per profile (name, price, description, location, media). Searchable and shown on provider page.';
