-- ============================================
-- REGENERATE AZURE STORAGE URLS TO PATHCTESTORE
-- ============================================
-- Run this in Supabase SQL Editor to update all
-- Azure Storage URLs to pathctestore.blob.core.windows.net
-- (Fixes pathkeys and careers not showing after East US migration)
-- ============================================

-- Update pathkeys table - image_url
UPDATE public.pathkeys
SET image_url = REPLACE(image_url, 'pathcte.blob.core.windows.net', 'pathctestore.blob.core.windows.net')
WHERE image_url LIKE '%pathcte.blob.core.windows.net%';

-- Update pathkeys table - image_url_animated
UPDATE public.pathkeys
SET image_url_animated = REPLACE(image_url_animated, 'pathcte.blob.core.windows.net', 'pathctestore.blob.core.windows.net')
WHERE image_url_animated LIKE '%pathcte.blob.core.windows.net%';

-- Update careers table - video_url
UPDATE public.careers
SET video_url = REPLACE(video_url, 'pathcte.blob.core.windows.net', 'pathctestore.blob.core.windows.net')
WHERE video_url LIKE '%pathcte.blob.core.windows.net%';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the migration was successful

-- Check pathkeys - image_url
SELECT
  key_code,
  CASE
    WHEN image_url LIKE '%pathctestore.blob.core.windows.net%' THEN '✓ Migrated'
    WHEN image_url LIKE '%pathcte.blob.core.windows.net%' THEN '✗ Old URL'
    ELSE '⚠ Other'
  END as image_url_status,
  CASE
    WHEN image_url_animated LIKE '%pathctestore.blob.core.windows.net%' THEN '✓ Migrated'
    WHEN image_url_animated LIKE '%pathcte.blob.core.windows.net%' THEN '✗ Old URL'
    WHEN image_url_animated IS NULL THEN 'N/A'
    ELSE '⚠ Other'
  END as animated_url_status,
  image_url,
  image_url_animated
FROM public.pathkeys
ORDER BY key_code;

-- Check careers with video URLs
SELECT
  title,
  CASE
    WHEN video_url LIKE '%pathctestore.blob.core.windows.net%' THEN '✓ Migrated'
    WHEN video_url LIKE '%pathcte.blob.core.windows.net%' THEN '✗ Old URL'
    ELSE '⚠ Other/NULL'
  END as video_url_status,
  video_url
FROM public.careers
WHERE video_url IS NOT NULL
ORDER BY title;

-- Summary counts
SELECT
  'pathkeys (image_url)' as field,
  COUNT(*) FILTER (WHERE image_url LIKE '%pathctestore.blob.core.windows.net%') as migrated_count,
  COUNT(*) FILTER (WHERE image_url LIKE '%pathcte.blob.core.windows.net%') as old_url_count,
  COUNT(*) as total_count
FROM public.pathkeys
UNION ALL
SELECT
  'pathkeys (animated)' as field,
  COUNT(*) FILTER (WHERE image_url_animated LIKE '%pathctestore.blob.core.windows.net%') as migrated_count,
  COUNT(*) FILTER (WHERE image_url_animated LIKE '%pathcte.blob.core.windows.net%') as old_url_count,
  COUNT(*) FILTER (WHERE image_url_animated IS NOT NULL) as total_count
FROM public.pathkeys
UNION ALL
SELECT
  'careers (video_url)' as field,
  COUNT(*) FILTER (WHERE video_url LIKE '%pathctestore.blob.core.windows.net%') as migrated_count,
  COUNT(*) FILTER (WHERE video_url LIKE '%pathcte.blob.core.windows.net%') as old_url_count,
  COUNT(*) FILTER (WHERE video_url IS NOT NULL) as total_count
FROM public.careers;
