-- Migration 042: Allow Teachers to Read All Tournaments
-- Purpose: Teachers need to view tournaments to join them with their classrooms

-- Drop old SELECT policy if it exists (we'll replace it)
DROP POLICY IF EXISTS tournaments_coordinator_all ON tournaments;

-- Allow coordinators full access to their own tournaments
CREATE POLICY tournaments_coordinator_all
  ON tournaments
  FOR ALL
  TO authenticated
  USING (auth.uid() = coordinator_id);

-- Allow all teachers to read all tournaments (for joining)
CREATE POLICY tournaments_teacher_read
  ON tournaments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.user_type = 'teacher'
    )
  );

COMMENT ON POLICY tournaments_teacher_read ON tournaments IS
'Allows any authenticated teacher to view tournaments so they can join with their classroom';
