-- Profiles table for users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Motels table
CREATE TABLE public.motels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    website TEXT,
    instagram TEXT,
    facebook TEXT,
    twitter TEXT,
    tiktok TEXT,
    youtube TEXT,
    onlyfans TEXT,
    privacy_link TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_premium BOOLEAN DEFAULT false NOT NULL,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on motels
ALTER TABLE public.motels ENABLE ROW LEVEL SECURITY;

-- Motels policies - everyone can view active motels
CREATE POLICY "Anyone can view active motels"
ON public.motels FOR SELECT
USING (is_active = true);

-- Owners can manage their own motels
CREATE POLICY "Owners can insert their own motels"
ON public.motels FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own motels"
ON public.motels FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own motels"
ON public.motels FOR DELETE
USING (auth.uid() = owner_id);

-- Motel photos table
CREATE TABLE public.motel_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    motel_id UUID REFERENCES public.motels(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on motel_photos
ALTER TABLE public.motel_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view photos of active motels
CREATE POLICY "Anyone can view motel photos"
ON public.motel_photos FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.motels 
    WHERE motels.id = motel_photos.motel_id AND motels.is_active = true
));

-- Owners can manage photos of their motels
CREATE POLICY "Owners can insert photos"
ON public.motel_photos FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.motels 
    WHERE motels.id = motel_photos.motel_id AND motels.owner_id = auth.uid()
));

CREATE POLICY "Owners can update photos"
ON public.motel_photos FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.motels 
    WHERE motels.id = motel_photos.motel_id AND motels.owner_id = auth.uid()
));

CREATE POLICY "Owners can delete photos"
ON public.motel_photos FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.motels 
    WHERE motels.id = motel_photos.motel_id AND motels.owner_id = auth.uid()
));

-- Subscriptions table for premium
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    motel_id UUID REFERENCES public.motels(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'active', 'cancelled', 'expired')),
    payment_method TEXT CHECK (payment_method IN ('credit_card', 'boleto', 'pix')),
    amount_cents INTEGER DEFAULT 20000 NOT NULL,
    external_id TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Owners can view their subscriptions
CREATE POLICY "Owners can view their subscriptions"
ON public.subscriptions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.motels 
    WHERE motels.id = subscriptions.motel_id AND motels.owner_id = auth.uid()
));

CREATE POLICY "Owners can insert subscriptions"
ON public.subscriptions FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.motels 
    WHERE motels.id = subscriptions.motel_id AND motels.owner_id = auth.uid()
));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_motels_updated_at
BEFORE UPDATE ON public.motels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment views
CREATE OR REPLACE FUNCTION public.increment_motel_views(motel_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.motels SET views_count = views_count + 1 WHERE id = motel_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create storage bucket for motel photos
INSERT INTO storage.buckets (id, name, public) VALUES ('motel-photos', 'motel-photos', true);

-- Storage policies
CREATE POLICY "Anyone can view motel photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'motel-photos');

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'motel-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'motel-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'motel-photos' AND auth.uid()::text = (storage.foldername(name))[1]);