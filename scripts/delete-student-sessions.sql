-- Delete In-Progress Game Sessions for Student
-- =============================================
-- Deletes all game sessions that are in 'in_progress' status
-- for student@esposure.gg to provide a clean start for testing.

-- Delete game answers
DELETE FROM game_answers
WHERE game_session_id IN (
  SELECT gs.id
  FROM game_sessions gs
  JOIN profiles p ON gs.host_id = p.id
  WHERE p.email = 'student@esposure.gg'
    AND gs.status = 'in_progress'
);

-- Delete game players
DELETE FROM game_players
WHERE game_session_id IN (
  SELECT gs.id
  FROM game_sessions gs
  JOIN profiles p ON gs.host_id = p.id
  WHERE p.email = 'student@esposure.gg'
    AND gs.status = 'in_progress'
);

-- Delete game sessions
DELETE FROM game_sessions
WHERE id IN (
  SELECT gs.id
  FROM game_sessions gs
  JOIN profiles p ON gs.host_id = p.id
  WHERE p.email = 'student@esposure.gg'
    AND gs.status = 'in_progress'
);

-- Show count of remaining sessions
SELECT
  COUNT(*) as remaining_in_progress_sessions
FROM game_sessions gs
JOIN profiles p ON gs.host_id = p.id
WHERE p.email = 'student@esposure.gg'
  AND gs.status = 'in_progress';
