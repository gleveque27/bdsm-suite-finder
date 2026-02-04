-- Add new columns to motels table for enhanced motel registration
ALTER TABLE public.motels 
ADD COLUMN IF NOT EXISTS payment_methods text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operating_hours text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS suite_periods text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS services text[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN public.motels.payment_methods IS 'Accepted payment methods: credit_card, pix, crypto, cash';
COMMENT ON COLUMN public.motels.operating_hours IS 'Operating hours description';
COMMENT ON COLUMN public.motels.suite_periods IS 'Available suite rental periods: 2h, 4h, 12h, 24h, etc';
COMMENT ON COLUMN public.motels.services IS 'Services offered: breakfast, restaurant, frigobar, etc';