-- =============================================
-- Supabase Setup Script for BDSM Suite Finder
-- =============================================
-- This script ensures all necessary tables, storage buckets, and policies are configured
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/cbmzormzzhbwfukbvatq/sql

-- =============================================
-- 1. Enable necessary extensions
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geolocation features

-- =============================================
-- 2. Create profiles table (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. Create motels table (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS motels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    website TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    tiktok TEXT,
    youtube TEXT,
    onlyfans TEXT,
    privacy_link TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    operating_hours TEXT,
    payment_methods TEXT[],
    services TEXT[],
    suite_periods TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial index for geolocation queries
CREATE INDEX IF NOT EXISTS idx_motels_location ON motels USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_motels_owner_id ON motels(owner_id);
CREATE INDEX IF NOT EXISTS idx_motels_city ON motels(city);
CREATE INDEX IF NOT EXISTS idx_motels_state ON motels(state);
CREATE INDEX IF NOT EXISTS idx_motels_is_active ON motels(is_active);
CREATE INDEX IF NOT EXISTS idx_motels_is_premium ON motels(is_premium);

-- =============================================
-- 4. Create motel_photos table (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS motel_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    motel_id UUID NOT NULL REFERENCES motels(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_motel_photos_motel_id ON motel_photos(motel_id);
CREATE INDEX IF NOT EXISTS idx_motel_photos_display_order ON motel_photos(display_order);

-- =============================================
-- 5. Enable Row Level Security (RLS)
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE motels ENABLE ROW LEVEL SECURITY;
ALTER TABLE motel_photos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 6. RLS Policies for profiles
-- =============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================
-- 7. RLS Policies for motels
-- =============================================
DROP POLICY IF EXISTS "Anyone can view active motels" ON motels;
DROP POLICY IF EXISTS "Users can view their own motels" ON motels;
DROP POLICY IF EXISTS "Users can create their own motels" ON motels;
DROP POLICY IF EXISTS "Users can update their own motels" ON motels;
DROP POLICY IF EXISTS "Users can delete their own motels" ON motels;

CREATE POLICY "Anyone can view active motels"
    ON motels FOR SELECT
    USING (is_active = true);

CREATE POLICY "Users can view their own motels"
    ON motels FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own motels"
    ON motels FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own motels"
    ON motels FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own motels"
    ON motels FOR DELETE
    USING (auth.uid() = owner_id);

-- =============================================
-- 8. RLS Policies for motel_photos
-- =============================================
DROP POLICY IF EXISTS "Anyone can view photos of active motels" ON motel_photos;
DROP POLICY IF EXISTS "Users can upload photos to their own motels" ON motel_photos;
DROP POLICY IF EXISTS "Users can delete photos from their own motels" ON motel_photos;

CREATE POLICY "Anyone can view photos of active motels"
    ON motel_photos FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM motels
            WHERE motels.id = motel_photos.motel_id
            AND motels.is_active = true
        )
    );

CREATE POLICY "Users can upload photos to their own motels"
    ON motel_photos FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM motels
            WHERE motels.id = motel_photos.motel_id
            AND motels.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete photos from their own motels"
    ON motel_photos FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM motels
            WHERE motels.id = motel_photos.motel_id
            AND motels.owner_id = auth.uid()
        )
    );

-- =============================================
-- 9. Storage Bucket for motel photos
-- =============================================
-- Note: Buckets are created via Supabase Dashboard or via SQL
-- Go to: Storage > Create new bucket > Name: "motel-photos" > Public: Yes

-- If bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'motel-photos',
    'motel-photos',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 10. Storage Policies for 'motel-photos' bucket
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can upload motel photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own motel photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own motel photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view motel photos" ON storage.objects;

CREATE POLICY "Authenticated users can upload motel photos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'motel-photos');

CREATE POLICY "Users can update their own motel photos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'motel-photos');

CREATE POLICY "Users can delete their own motel photos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'motel-photos');

CREATE POLICY "Public can view motel photos"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'motel-photos');

-- =============================================
-- 11. Functions for auto-updating 'updated_at'
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_motels_updated_at ON motels;
CREATE TRIGGER update_motels_updated_at
    BEFORE UPDATE ON motels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 12. Function to increment views count
-- =============================================
CREATE OR REPLACE FUNCTION increment_motel_views(motel_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE motels
    SET views_count = views_count + 1
    WHERE id = motel_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Setup Complete!
-- =============================================
-- Next steps:
-- 1. Verify the bucket "motel-photos" exists in Storage
-- 2. Update your .env with Supabase credentials
-- 3. Deploy to Vercel with environment variables
