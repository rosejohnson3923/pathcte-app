#!/usr/bin/env node
/**
 * Update Pathkey URLs in Database
 * =================================
 * Updates pathkey image URLs to point to Azure Storage
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Load environment variables
const rootEnv = join(ROOT_DIR, '.env');
const webEnv = join(ROOT_DIR, 'packages', 'web', '.env');
if (existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else if (existsSync(webEnv)) {
  dotenv.config({ path: webEnv });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AZURE_BASE_URL = 'https://pathcte.blob.core.windows.net/pathkeys';

// Pathkey mappings
const updates = [
  // Career Pathkeys
  { key_code: 'DEV-001', filename: 'DEV-001.png' },
  { key_code: 'NURSE-001', filename: 'NURSE-001.png' },
  { key_code: 'MARKET-001', filename: 'MARKET-001.png' },
  { key_code: 'PR-001', filename: 'PR-001.png' },
  { key_code: 'CIVIL-001', filename: 'CIVIL-001.png' },
  { key_code: 'TEACH-001', filename: 'TEACH-001.png' },
  { key_code: 'PHYS-001', filename: 'PHYS-001.png' },
  { key_code: 'ADMIN-001', filename: 'ADMIN-001.png' },
  // Skill Pathkeys
  { key_code: 'SKILL-CODE', filename: 'SKILL-CODE.png' },
  { key_code: 'SKILL-PROB', filename: 'SKILL-PROB.png' },
  { key_code: 'SKILL-COMM', filename: 'SKILL-COMM.png' },
  { key_code: 'SKILL-LEAD', filename: 'SKILL-LEAD.png' },
  // Industry Pathkeys
  { key_code: 'IND-TECH', filename: 'IND-TECH.png' },
  { key_code: 'IND-HEALTH', filename: 'IND-HEALTH.png' },
  { key_code: 'IND-BIZ', filename: 'IND-BIZ.png' },
  // Milestone Pathkeys
  { key_code: 'MILE-FIRST', filename: 'MILE-FIRST.png' },
];

async function updatePathkeyUrl(keyCode, filename) {
  const imageUrl = `${AZURE_BASE_URL}/${filename}`;

  try {
    const { error } = await supabase
      .from('pathkeys')
      .update({ image_url: imageUrl })
      .eq('key_code', keyCode);

    if (error) throw error;

    console.log(`  ✅ ${keyCode}: ${filename}`);
    return { success: true };
  } catch (error) {
    console.error(`  ❌ ${keyCode}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Update Pathkey URLs in Database     ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Azure Base: ${AZURE_BASE_URL}\n`);

  console.log('Updating pathkey URLs...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const update of updates) {
    const result = await updatePathkeyUrl(update.key_code, update.filename);
    if (result.success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log('\n' + '═'.repeat(40));
  console.log('\n📊 Summary:');
  console.log(`  ✅ Updated: ${successCount}`);
  console.log(`  ❌ Failed: ${failureCount}`);
  console.log('');

  // Verify updates
  console.log('Verifying updates...\n');
  const { data, error } = await supabase
    .from('pathkeys')
    .select('key_code, name, image_url')
    .in('key_code', updates.map(u => u.key_code));

  if (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }

  data.forEach(pathkey => {
    const isAzure = pathkey.image_url.includes('pathcte.blob.core.windows.net');
    const icon = isAzure ? '✅' : '⚠️';
    console.log(`  ${icon} ${pathkey.key_code}: ${pathkey.name}`);
  });

  console.log('');

  if (failureCount === 0) {
    console.log('✅ All pathkey URLs updated successfully!');
    console.log('   Images are now served from Azure Storage.\n');
  } else {
    console.log('⚠️  Some updates failed. Check errors above.\n');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
