-- =============================================
-- Supabase Setup Script
-- =============================================
-- This script creates the necessary database schema and storage buckets
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- =============================================
-- 1. Create 'posts' table (if not already exists)
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    keywords TEXT[],
    image_url TEXT,
    seo_score INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- =============================================
-- 2. Enable Row Level Security (RLS)
-- =============================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own posts" ON posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;

-- Users can view their own posts
CREATE POLICY "Users can view their own posts"
    ON posts FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own posts
CREATE POLICY "Users can create their own posts"
    ON posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
    ON posts FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
    ON posts FOR DELETE
    USING (auth.uid() = user_id);

-- Published posts are viewable by everyone (for public blog)
CREATE POLICY "Published posts are viewable by everyone"
    ON posts FOR SELECT
    USING (status = 'published');

-- =============================================
-- 3. Create Storage Bucket for Images
-- =============================================
-- Note: Storage buckets are created via Supabase Dashboard or via SQL
-- Go to: Storage > Create new bucket > Name: "post-images" > Public: Yes

-- If you want to create it via SQL (requires appropriate permissions):
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('post-images', 'post-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 4. Storage Policies for 'post-images' bucket
-- =============================================
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'post-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'post-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'post-images');

-- Allow public read access to all images
CREATE POLICY "Public can view images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'post-images');

-- =============================================
-- 5. Create function to auto-update 'updated_at'
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Setup Complete!
-- =============================================
-- Next steps:
-- 1. Go to Storage > Create bucket "post-images" with public access
-- 2. Update your .env.local with Supabase credentials
-- 3. Deploy to Vercel with environment variables
