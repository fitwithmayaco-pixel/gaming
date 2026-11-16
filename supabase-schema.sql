-- ==============================================================================
-- 🌴 GRAND THEFT AUTO VI STORE - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard: https://supabase.com/dashboard/project/iebfqrlicydqvsnjxbac
-- 2. Click "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste ALL of this code below, and click "RUN" (green button).
-- 4. That's it! Your tables, policies, bucket, and initial demo e-book are ready.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES Table (User roles & authentication sync)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- TRIGGER: Auto-create a profile whenever someone signs up on the website
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. Create PRODUCTS Table (E-Books, Thumbnails, Stickers, Bundles)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ebook', 'thumbnail', 'sticker', 'bundle')),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2),
  image_url TEXT NOT NULL,
  preview_images TEXT[] DEFAULT '{}',
  gumroad_url TEXT NOT NULL,
  badge TEXT, -- e.g. 'EXCLUSIVE E-BOOK', 'BESTSELLER', 'NEW'
  features TEXT[] DEFAULT '{}', -- bullet point highlights
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies:
-- Anyone can view active products
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" 
  ON public.products FOR SELECT 
  USING (
    is_active = true 
    OR (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
  );

-- Only Admins can insert, update, or delete products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" 
  ON public.products FOR INSERT 
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" 
  ON public.products FOR UPDATE 
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" 
  ON public.products FOR DELETE 
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );


-- 4. Create STORAGE BUCKET for Thumbnails & Covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update and delete product images" ON storage.objects;
CREATE POLICY "Admins can update and delete product images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'product-images' AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );


-- 5. INSERT INITIAL DEMO PRODUCT (Single E-Book)
INSERT INTO public.products (
  title, 
  description, 
  category, 
  price, 
  original_price, 
  image_url, 
  gumroad_url, 
  badge, 
  features, 
  is_featured, 
  rating, 
  sales_count
) VALUES (
  'Grand Theft Auto VI: Official Vice City Master Walkthrough E-Book',
  'The definitive full-color digital strategy e-book detailing Vice City & Leonida district maps, underground heist tactics, vehicle tuning, Lucia & Jason mechanics, and secret weapon locations.',
  'ebook',
  19.99,
  39.99,
  '/images/gta6-cover1.jpeg',
  'https://gumroad.com',
  'EXCLUSIVE E-BOOK',
  ARRAY[
    '180+ Full-Color HD Illustrated Pages (PDF & ePub)',
    'Complete Leonida State Heist Blueprints & Satellite Maps',
    'Lucia & Jason Skill Tree, Combat & Weapon Guides',
    'Instant Download & Lifetime Free DLC Updates'
  ],
  true,
  5.0,
  1240
) ON CONFLICT DO NOTHING;


-- ==============================================================================
-- 👑 APNE ACCOUNT KO ADMIN KAISE BANAYEIN:
-- 1. Website par ja kar Sign Up karein: http://127.0.0.1:5173/auth
-- 2. Supabase SQL Editor me yeh command run karein (apna email replace karein):
--
--    UPDATE public.profiles 
--    SET role = 'admin' 
--    WHERE email = 'YOUR_EMAIL@HERE.COM';
--
-- 3. Website refresh karein, aapka Admin Panel unlock ho jaega!
-- ==============================================================================
