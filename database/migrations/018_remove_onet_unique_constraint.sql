-- Migration: Remove UNIQUE constraint from onet_code
-- Description: Allow multiple careers without O*NET codes (gaming/esports careers)

-- Drop the unique constraint on onet_code
ALTER TABLE public.careers DROP CONSTRAINT IF EXISTS careers_onet_code_key;

-- Comment
COMMENT ON COLUMN public.careers.onet_code IS 'O*NET code (optional) - not required for gaming/esports careers';
