-- ============================================
-- CREATE: Secure function to end game and update player stats
-- ============================================
-- This function calculates placements and awards rewards
-- while bypassing the player validation trigger
-- ============================================

-- Create secure function to update player placement
CREATE OR REPLACE FUNCTION update_player_placement(
  p_player_id UUID,
  p_placement INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  -- Set bypass flag so trigger allows placement updates
  PERFORM set_config('app.bypass_player_validation', 'true', true);

  -- Update player placement
  UPDATE game_players
  SET placement = p_placement
  WHERE id = p_player_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create secure function to award player rewards
CREATE OR REPLACE FUNCTION award_player_rewards(
  p_player_id UUID,
  p_tokens_earned INTEGER,
  p_pathkeys_earned UUID[]
) RETURNS BOOLEAN AS $$
BEGIN
  -- Set bypass flag so trigger allows reward updates
  PERFORM set_config('app.bypass_player_validation', 'true', true);

  -- Update player rewards
  UPDATE game_players
  SET
    tokens_earned = COALESCE(p_tokens_earned, tokens_earned),
    pathkeys_earned = COALESCE(p_pathkeys_earned, pathkeys_earned)
  WHERE id = p_player_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_player_placement TO authenticated;
GRANT EXECUTE ON FUNCTION award_player_rewards TO authenticated;

-- Add comments
COMMENT ON FUNCTION update_player_placement IS
'Securely update player placement at end of game. Runs with elevated privileges and bypasses player validation trigger.';

COMMENT ON FUNCTION award_player_rewards IS
'Securely award tokens and pathkeys to player. Runs with elevated privileges and bypasses player validation trigger.';
