-- Update Pathkey Image URLs to Azure Storage
-- =============================================
-- Updates pathkey image_url fields to point to Azure Blob Storage
-- Run after uploading pathkey images to Azure

-- Update Career Pathkeys (8)
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/DEV-001.png' WHERE key_code = 'DEV-001';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/NURSE-001.png' WHERE key_code = 'NURSE-001';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/MARKET-001.png' WHERE key_code = 'MARKET-001';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/PR-001.png' WHERE key_code = 'PR-001';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/CIVIL-001.png' WHERE key_code = 'CIVIL-001';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/TEACH-001.png' WHERE key_code = 'TEACH-001';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/PHYS-001.png' WHERE key_code = 'PHYS-001';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/ADMIN-001.png' WHERE key_code = 'ADMIN-001';

-- Update Skill Pathkeys (4)
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/SKILL-CODE.png' WHERE key_code = 'SKILL-CODE';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/SKILL-PROB.png' WHERE key_code = 'SKILL-PROB';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/SKILL-COMM.png' WHERE key_code = 'SKILL-COMM';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/SKILL-LEAD.png' WHERE key_code = 'SKILL-LEAD';

-- Industry Pathkeys (3) - keep placeholders until images are created
-- UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/IND-TECH.png' WHERE key_code = 'IND-TECH';
-- UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/IND-HEALTH.png' WHERE key_code = 'IND-HEALTH';
-- UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/IND-BIZ.png' WHERE key_code = 'IND-BIZ';

-- Milestone Pathkeys (1) - keep placeholder until image is created
-- UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/MILE-FIRST.png' WHERE key_code = 'MILE-FIRST';

-- Verify updates
SELECT
  key_code,
  name,
  image_url,
  CASE
    WHEN image_url LIKE '%pathcte.blob.core.windows.net%' THEN '✅ Azure'
    WHEN image_url LIKE '%placehold%' THEN '⏭️ Placeholder'
    ELSE '❌ Unknown'
  END as status
FROM pathkeys
ORDER BY key_type, rarity, name;

-- Summary
SELECT
  CASE
    WHEN image_url LIKE '%pathcte.blob.core.windows.net%' THEN 'Azure Storage'
    WHEN image_url LIKE '%placehold%' THEN 'Placeholder'
    ELSE 'Other'
  END as url_type,
  COUNT(*) as count
FROM pathkeys
GROUP BY url_type;
