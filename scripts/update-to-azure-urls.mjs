/**
 * Update Pathkey Image URLs to Azure Storage
 * ===========================================
 * Replaces placeholder.co URLs with actual Azure Storage URLs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://festwdkldwnpmqxrkiso.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlc3R3ZGtsZHducG1xeHJraXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjczOTgsImV4cCI6MjA3NzEwMzM5OH0.6DPT5zAwGfPGDLcuV8kTq0TKntyh93Ee57oQY3hHZJA'
);

const AZURE_STORAGE_URL = 'https://pathcte.blob.core.windows.net';
const CONTAINER = 'pathkeys';

// Map of pathkey key_codes to their Azure blob filenames
const pathkeyUpdates = [
  // Career Pathkeys (8)
  { key_code: 'DEV-001', filename: 'DEV-001.png' },
  { key_code: 'NURSE-001', filename: 'NURSE-001.png' },
  { key_code: 'MARKET-001', filename: 'MARKET-001.png' },
  { key_code: 'PR-001', filename: 'PR-001.png' },
  { key_code: 'CIVIL-001', filename: 'CIVIL-001.png' },
  { key_code: 'TEACH-001', filename: 'TEACH-001.png' },
  { key_code: 'PHYS-001', filename: 'PHYS-001.png' },
  { key_code: 'ADMIN-001', filename: 'ADMIN-001.png' },

  // Skill Pathkeys (4)
  { key_code: 'SKILL-CODE', filename: 'SKILL-CODE.png' },
  { key_code: 'SKILL-PROB', filename: 'SKILL-PROB.png' },
  { key_code: 'SKILL-COMM', filename: 'SKILL-COMM.png' },
  { key_code: 'SKILL-LEAD', filename: 'SKILL-LEAD.png' },

  // Industry Pathkeys (3)
  { key_code: 'IND-TECH', filename: 'IND-TECH.png' },
  { key_code: 'IND-HEALTH', filename: 'IND-HEALTH.png' },
  { key_code: 'IND-BIZ', filename: 'IND-BIZ.png' },

  // Milestone Pathkey (1)
  { key_code: 'MILE-FIRST', filename: 'MILE-FIRST.png' },
];

console.log('Updating pathkey image URLs to Azure Storage...\n');

let successCount = 0;
let failCount = 0;

for (const { key_code, filename } of pathkeyUpdates) {
  // Build Azure URL (without SAS token - will be added client-side)
  const azureUrl = `${AZURE_STORAGE_URL}/${CONTAINER}/${filename}`;

  console.log(`Updating ${key_code}...`);
  console.log(`  URL: ${azureUrl}`);

  const { data, error } = await supabase
    .from('pathkeys')
    .update({ image_url: azureUrl })
    .eq('key_code', key_code)
    .select();

  if (error) {
    console.error(`  ❌ Error: ${error.message}`);
    failCount++;
  } else if (data && data.length > 0) {
    console.log(`  ✅ Updated successfully`);
    successCount++;
  } else {
    console.log(`  ⚠️  No record found with key_code: ${key_code}`);
    failCount++;
  }

  console.log('');
}

console.log('\n======================');
console.log('Update Summary');
console.log('======================');
console.log(`✅ Success: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${pathkeyUpdates.length}`);
