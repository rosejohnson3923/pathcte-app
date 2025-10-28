-- Migration: Create market_items table
-- Description: Items available for purchase in the marketplace

CREATE TABLE IF NOT EXISTS public.market_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  item_type TEXT NOT NULL CHECK (item_type IN ('key_pack', 'profile_item', 'power_up', 'special')),
  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  token_cost INTEGER NOT NULL CHECK (token_cost > 0),

  -- Contents (for key packs - array of pathkey IDs or item data)
  contents JSONB DEFAULT '[]'::jsonb,

  -- Visual
  image_url TEXT,

  -- Availability
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  available_from DATE,
  available_until DATE,

  -- Limits
  purchase_limit INTEGER CHECK (purchase_limit > 0), -- NULL = unlimited

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure availability date logic
  CONSTRAINT valid_availability_dates CHECK (
    (available_from IS NULL AND available_until IS NULL) OR
    (available_from IS NOT NULL AND available_until IS NULL) OR
    (available_from IS NOT NULL AND available_until IS NOT NULL AND available_until >= available_from)
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_market_items_item_type ON public.market_items(item_type);
CREATE INDEX IF NOT EXISTS idx_market_items_is_available ON public.market_items(is_available);
CREATE INDEX IF NOT EXISTS idx_market_items_is_featured ON public.market_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_market_items_token_cost ON public.market_items(token_cost);

-- Enable Row Level Security
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Available market items viewable by all authenticated users"
  ON public.market_items FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Comments
COMMENT ON TABLE public.market_items IS 'Items available for purchase with tokens';
COMMENT ON COLUMN public.market_items.item_type IS 'Type: key_pack, profile_item, power_up, special';
COMMENT ON COLUMN public.market_items.contents IS 'JSON array of items included (for packs)';
COMMENT ON COLUMN public.market_items.purchase_limit IS 'Max purchases per user (NULL = unlimited)';
