-- Migration: Update all Azure Storage URLs from pathket to pathcte
-- Date: 2025-10-31
-- Description: Updates all blob storage URLs to use the new pathcte storage account

-- Update pathkeys image URLs
UPDATE pathkeys
SET image_url = REPLACE(image_url, 'pathket.blob.core.windows.net', 'pathcte.blob.core.windows.net')
WHERE image_url LIKE '%pathket.blob.core.windows.net%';

-- Update pathkeys animated image URLs
UPDATE pathkeys
SET image_url_animated = REPLACE(image_url_animated, 'pathket.blob.core.windows.net', 'pathcte.blob.core.windows.net')
WHERE image_url_animated LIKE '%pathket.blob.core.windows.net%';

-- Update market_items image URLs
UPDATE market_items
SET image_url = REPLACE(image_url, 'pathket.blob.core.windows.net', 'pathcte.blob.core.windows.net')
WHERE image_url LIKE '%pathket.blob.core.windows.net%';

-- Update questions image URLs
UPDATE questions
SET image_url = REPLACE(image_url, 'pathket.blob.core.windows.net', 'pathcte.blob.core.windows.net')
WHERE image_url LIKE '%pathket.blob.core.windows.net%';

-- Verify the updates
SELECT 'pathkeys' as table_name, COUNT(*) as updated_count
FROM pathkeys
WHERE image_url LIKE '%pathcte.blob.core.windows.net%'
UNION ALL
SELECT 'pathkeys_animated' as table_name, COUNT(*) as updated_count
FROM pathkeys
WHERE image_url_animated LIKE '%pathcte.blob.core.windows.net%'
UNION ALL
SELECT 'market_items' as table_name, COUNT(*) as updated_count
FROM market_items
WHERE image_url LIKE '%pathcte.blob.core.windows.net%'
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as updated_count
FROM questions
WHERE image_url LIKE '%pathcte.blob.core.windows.net%';
