/**
 * Update Career Pathkey Images
 * =============================
 * Maps career pathkey images from Azure blob storage to careers table
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from packages/web
dotenv.config({ path: join(__dirname, '../packages/web/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Azure Blob Storage configuration
const AZURE_STORAGE_URL = 'https://pathctestore.blob.core.windows.net';
const PATHKEYS_CONTAINER = 'pathkeys';

/**
 * Build Azure blob URL
 */
function buildAzureUrl(blobName) {
  return `${AZURE_STORAGE_URL}/${PATHKEYS_CONTAINER}/${blobName}`;
}

/**
 * Get career image filename from career title
 * Images in Azure are named exactly as the career title with .png appended
 * Example: "Public Relations Specialist" -> "Public Relations Specialist.png"
 */
function getCareerImageFilename(career) {
  return `${career.title}.png`;
}

async function updateCareerPathkeyImages() {
  console.log('🔄 Fetching careers from database...\n');

  // Get all careers
  const { data: careers, error: careersError } = await supabase
    .from('careers')
    .select('id, title, pathkey_career_image')
    .order('title');

  if (careersError) {
    console.error('Error fetching careers:', careersError);
    process.exit(1);
  }

  console.log(`Found ${careers.length} careers\n`);
  console.log('📝 Mapping career images...\n');

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const career of careers) {
    const imageFilename = getCareerImageFilename(career);
    const imageUrl = buildAzureUrl(imageFilename);

    console.log(`\n${career.title}:`);
    console.log(`  Filename: ${imageFilename}`);
    console.log(`  URL: ${imageUrl}`);

    // Check if already set
    if (career.pathkey_career_image === imageUrl) {
      console.log(`  ⏭️  Already set, skipping`);
      skipped++;
      continue;
    }

    // Update the career with the pathkey image URL
    const { error: updateError } = await supabase
      .from('careers')
      .update({
        pathkey_career_image: imageUrl,
      })
      .eq('id', career.id);

    if (updateError) {
      console.log(`  ❌ Error updating: ${updateError.message}`);
      errors++;
    } else {
      console.log(`  ✅ Updated successfully`);
      updated++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`  ✅ Updated: ${updated}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📝 Total: ${careers.length}`);
  console.log('='.repeat(60));

  if (updated > 0) {
    console.log('\n💡 Note: Images use SAS token authentication from Azure Blob Storage');
    console.log('   Make sure your SAS token is configured in the frontend.');
  }
}

// Run the update
updateCareerPathkeyImages()
  .then(() => {
    console.log('\n✅ Career pathkey images update complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
