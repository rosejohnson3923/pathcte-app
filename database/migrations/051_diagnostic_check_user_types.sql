-- ============================================
-- DIAGNOSTIC: Check User Type Values
-- ============================================
-- Run this FIRST to see what user_type values exist
-- This will help us understand what needs to be fixed
-- ============================================

-- Show distribution of all user_type values
SELECT user_type, COUNT(*) as count
FROM profiles
GROUP BY user_type
ORDER BY count DESC;

-- Show any users with unexpected user_type values
SELECT id, email, user_type, created_at
FROM profiles
WHERE user_type NOT IN ('student', 'teacher', 'parent', 'admin')
ORDER BY created_at DESC;

-- Show specifically the sysadmin user
SELECT id, email, user_type, created_at, settings
FROM profiles
WHERE email ILIKE '%sysadmin%' OR user_type ILIKE '%admin%';
