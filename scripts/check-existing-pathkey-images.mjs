/**
 * Check Existing Pathkey Images
 * ==============================
 * Check what pathkey images are already set in the database
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkExistingImages() {
  console.log('🔍 Checking existing pathkey images in database...\n');

  const { data: careers, error } = await supabase
    .from('careers')
    .select('id, title, pathkey_image_url, pathkey_career_image, pathkey_lock_image, pathkey_key_image')
    .eq('is_active', true)
    .order('title');

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log(`Found ${careers.length} active careers\n`);

  // Check which have pathkey images set
  const withCareerImage = careers.filter(c => c.pathkey_career_image);
  const withLockImage = careers.filter(c => c.pathkey_lock_image);
  const withKeyImage = careers.filter(c => c.pathkey_key_image);
  const withPathkeyImageUrl = careers.filter(c => c.pathkey_image_url);

  console.log('📊 Summary:');
  console.log(`  Careers with pathkey_career_image: ${withCareerImage.length}`);
  console.log(`  Careers with pathkey_lock_image: ${withLockImage.length}`);
  console.log(`  Careers with pathkey_key_image: ${withKeyImage.length}`);
  console.log(`  Careers with pathkey_image_url (old): ${withPathkeyImageUrl.length}`);
  console.log('');

  if (withCareerImage.length > 0) {
    console.log('✅ Careers with career images:');
    withCareerImage.slice(0, 5).forEach(c => {
      console.log(`  - ${c.title}`);
      console.log(`    ${c.pathkey_career_image}`);
    });
    if (withCareerImage.length > 5) {
      console.log(`  ... and ${withCareerImage.length - 5} more`);
    }
    console.log('');
  }

  if (withPathkeyImageUrl.length > 0) {
    console.log('📸 Sample pathkey_image_url patterns (for reference):');
    withPathkeyImageUrl.slice(0, 10).forEach(c => {
      const match = c.pathkey_image_url?.match(/([^/]+)$/);
      const filename = match ? match[1] : 'unknown';
      console.log(`  ${c.title.padEnd(40)} → ${filename}`);
    });
    if (withPathkeyImageUrl.length > 10) {
      console.log(`  ... and ${withPathkeyImageUrl.length - 10} more`);
    }
  }
}

checkExistingImages()
  .then(() => {
    console.log('\n✅ Complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
