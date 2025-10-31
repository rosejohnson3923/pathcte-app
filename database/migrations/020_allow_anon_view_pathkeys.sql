-- Migration: Allow scripts to access pathkeys
-- Description: Add RLS policies for anon role to view/update pathkeys (needed for maintenance scripts)

-- Add policy for anonymous users to view active pathkeys
CREATE POLICY "Pathkeys viewable by anonymous users"
  ON public.pathkeys FOR SELECT
  TO anon
  USING (is_active = true);

-- Add policy for scripts to update pathkeys (for URL updates, etc.)
-- Note: This is intentionally permissive for maintenance scripts
-- In production, consider using service_role key instead
CREATE POLICY "Pathkeys updatable by scripts"
  ON public.pathkeys FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Comments
COMMENT ON POLICY "Pathkeys viewable by anonymous users" ON public.pathkeys
IS 'Allow anonymous users to view active pathkeys for public browsing and scripts';

COMMENT ON POLICY "Pathkeys updatable by scripts" ON public.pathkeys
IS 'Allow maintenance scripts to update pathkeys using anon key';
