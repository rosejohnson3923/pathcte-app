-- ============================================
-- UPDATE PATHKEY IMAGE URLS TO AZURE STORAGE
-- ============================================
-- Run this in Supabase SQL Editor to update all
-- pathkey image URLs from placeholder.co to Azure Storage
-- ============================================

-- Update Career Pathkeys (8)
UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/DEV-001.png'
WHERE key_code = 'DEV-001';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/NURSE-001.png'
WHERE key_code = 'NURSE-001';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/MARKET-001.png'
WHERE key_code = 'MARKET-001';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/PR-001.png'
WHERE key_code = 'PR-001';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/CIVIL-001.png'
WHERE key_code = 'CIVIL-001';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/TEACH-001.png'
WHERE key_code = 'TEACH-001';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/PHYS-001.png'
WHERE key_code = 'PHYS-001';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/ADMIN-001.png'
WHERE key_code = 'ADMIN-001';

-- Update Skill Pathkeys (4)
UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/SKILL-CODE.png'
WHERE key_code = 'SKILL-CODE';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/SKILL-PROB.png'
WHERE key_code = 'SKILL-PROB';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/SKILL-COMM.png'
WHERE key_code = 'SKILL-COMM';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/SKILL-LEAD.png'
WHERE key_code = 'SKILL-LEAD';

-- Update Industry Pathkeys (3)
UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/IND-TECH.png'
WHERE key_code = 'IND-TECH';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/IND-HEALTH.png'
WHERE key_code = 'IND-HEALTH';

UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/IND-BIZ.png'
WHERE key_code = 'IND-BIZ';

-- Update Milestone Pathkey (1)
UPDATE public.pathkeys
SET image_url = 'https://pathket.blob.core.windows.net/pathkeys/MILE-FIRST.png'
WHERE key_code = 'MILE-FIRST';

-- Verify the updates
SELECT key_code, name, image_url
FROM public.pathkeys
ORDER BY key_code;
