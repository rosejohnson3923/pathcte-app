-- Migration: Create user_purchases table
-- Description: Track user purchases from the marketplace

CREATE TABLE IF NOT EXISTS public.user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  market_item_id UUID NOT NULL REFERENCES public.market_items(id) ON DELETE RESTRICT,

  tokens_spent INTEGER NOT NULL CHECK (tokens_spent > 0),
  items_received JSONB DEFAULT '[]'::jsonb,

  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON public.user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_market_item_id ON public.user_purchases(market_item_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_purchased_at ON public.user_purchases(purchased_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_purchased_at ON public.user_purchases(user_id, purchased_at DESC);

-- Enable Row Level Security
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own purchases"
  ON public.user_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON public.user_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.user_purchases IS 'User purchase history from marketplace';
COMMENT ON COLUMN public.user_purchases.tokens_spent IS 'Amount of tokens spent on purchase';
COMMENT ON COLUMN public.user_purchases.items_received IS 'JSON array of items received from purchase';
