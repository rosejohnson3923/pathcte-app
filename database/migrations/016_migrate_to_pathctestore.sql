-- ============================================
-- MIGRATE AZURE STORAGE URLS TO PATHCTESTORE
-- ============================================
-- Run this in Supabase SQL Editor to update all
-- Azure Storage URLs from pathcte to pathctestore
-- (East US migration for co-location with Azure AI Foundry)
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

-- Update market_items table - image_url (if exists)
UPDATE public.market_items
SET image_url = REPLACE(image_url, 'pathcte.blob.core.windows.net', 'pathctestore.blob.core.windows.net')
WHERE image_url LIKE '%pathcte.blob.core.windows.net%';

-- Update questions table - image_url (if exists)
UPDATE public.questions
SET image_url = REPLACE(image_url, 'pathcte.blob.core.windows.net', 'pathctestore.blob.core.windows.net')
WHERE image_url LIKE '%pathcte.blob.core.windows.net%';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the migration was successful

-- Check pathkeys
SELECT key_code,
       CASE
         WHEN image_url LIKE '%pathctestore.blob.core.windows.net%' THEN '✓ Migrated'
         WHEN image_url LIKE '%pathcte.blob.core.windows.net%' THEN '✗ Old URL'
         ELSE '⚠ Other'
       END as image_url_status,
       image_url
FROM public.pathkeys
ORDER BY key_code;

-- Check careers with video URLs
SELECT title,
       CASE
         WHEN video_url LIKE '%pathctestore.blob.core.windows.net%' THEN '✓ Migrated'
         WHEN video_url LIKE '%pathcte.blob.core.windows.net%' THEN '✗ Old URL'
         ELSE '⚠ Other/NULL'
       END as video_url_status,
       video_url
FROM public.careers
WHERE video_url IS NOT NULL
ORDER BY title;

-- Check market items with image URLs
SELECT name,
       CASE
         WHEN image_url LIKE '%pathctestore.blob.core.windows.net%' THEN '✓ Migrated'
         WHEN image_url LIKE '%pathcte.blob.core.windows.net%' THEN '✗ Old URL'
         ELSE '⚠ Other/NULL'
       END as image_url_status,
       image_url
FROM public.market_items
WHERE image_url IS NOT NULL
ORDER BY name;

-- Summary counts
SELECT
  'pathkeys' as table_name,
  COUNT(*) FILTER (WHERE image_url LIKE '%pathctestore.blob.core.windows.net%') as migrated_count,
  COUNT(*) FILTER (WHERE image_url LIKE '%pathcte.blob.core.windows.net%') as old_url_count,
  COUNT(*) as total_count
FROM public.pathkeys
UNION ALL
SELECT
  'careers' as table_name,
  COUNT(*) FILTER (WHERE video_url LIKE '%pathctestore.blob.core.windows.net%') as migrated_count,
  COUNT(*) FILTER (WHERE video_url LIKE '%pathcte.blob.core.windows.net%') as old_url_count,
  COUNT(*) as total_count
FROM public.careers
UNION ALL
SELECT
  'market_items' as table_name,
  COUNT(*) FILTER (WHERE image_url LIKE '%pathctestore.blob.core.windows.net%') as migrated_count,
  COUNT(*) FILTER (WHERE image_url LIKE '%pathcte.blob.core.windows.net%') as old_url_count,
  COUNT(*) as total_count
FROM public.market_items
UNION ALL
SELECT
  'questions' as table_name,
  COUNT(*) FILTER (WHERE image_url LIKE '%pathctestore.blob.core.windows.net%') as migrated_count,
  COUNT(*) FILTER (WHERE image_url LIKE '%pathcte.blob.core.windows.net%') as old_url_count,
  COUNT(*) as total_count
FROM public.questions;
