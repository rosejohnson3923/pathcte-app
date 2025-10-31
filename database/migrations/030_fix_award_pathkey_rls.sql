-- ============================================
-- FIX: award_pathkey function RLS bypass
-- ============================================
-- The award_pathkey function was failing silently because
-- RLS policies were blocking INSERTs even with SECURITY DEFINER.
-- This migration adds explicit RLS bypass for the function.
-- ============================================

-- Drop existing function (required to change return type)
DROP FUNCTION IF EXISTS award_pathkey(UUID, UUID);

-- Recreate award_pathkey function with proper error handling and RLS bypass
CREATE FUNCTION award_pathkey(
  p_user_id UUID,
  p_pathkey_id UUID
)
RETURNS boolean AS $$
DECLARE
  v_row_count integer;
BEGIN
  -- Temporarily disable RLS for this transaction
  SET LOCAL row_security = off;

  -- Insert or update the pathkey
  INSERT INTO public.user_pathkeys (user_id, pathkey_id, quantity)
  VALUES (p_user_id, p_pathkey_id, 1)
  ON CONFLICT (user_id, pathkey_id)
  DO UPDATE SET
    quantity = public.user_pathkeys.quantity + 1,
    acquired_at = NOW();

  -- Verify the operation succeeded
  GET DIAGNOSTICS v_row_count = ROW_COUNT;

  IF v_row_count > 0 THEN
    RETURN true;
  ELSE
    RAISE EXCEPTION 'Failed to award pathkey % to user %', p_pathkey_id, p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update comment
COMMENT ON FUNCTION award_pathkey(UUID, UUID) IS 'Award a pathkey to a user with RLS bypass, incrementing quantity if already owned. Returns true on success.';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION award_pathkey TO authenticated;
