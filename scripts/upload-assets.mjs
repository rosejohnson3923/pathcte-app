#!/usr/bin/env node
/**
 * Upload Assets to Azure Storage
 * ================================
 * Uploads pathkey images and career images to Azure Blob Storage
 *
 * Usage:
 *   node scripts/upload-assets.mjs
 *   node scripts/upload-assets.mjs --dry-run (test without uploading)
 *   node scripts/upload-assets.mjs --pathkeys-only
 *   node scripts/upload-assets.mjs --careers-only
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { BlobServiceClient } from '@azure/storage-blob';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Load environment variables from root or packages/web
const rootEnv = join(ROOT_DIR, '.env');
const webEnv = join(ROOT_DIR, 'packages', 'web', '.env');
if (existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else if (existsSync(webEnv)) {
  dotenv.config({ path: webEnv });
} else {
  console.warn('⚠️  No .env file found. Trying process.env...');
}

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const pathkeysOnly = args.includes('--pathkeys-only');
const careersOnly = args.includes('--careers-only');

// Configuration
const AZURE_STORAGE_URL = process.env.VITE_AZURE_STORAGE_URL || 'https://pathket.blob.core.windows.net';
const AZURE_SAS_TOKEN = process.env.VITE_AZURE_STORAGE_SAS_TOKEN;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Needs service role for updates

// Validate environment
if (!AZURE_SAS_TOKEN) {
  console.error('❌ Error: VITE_AZURE_STORAGE_SAS_TOKEN not found in environment');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('⚠️  Warning: Supabase credentials not found. Will upload files but not update database.');
}

// Initialize clients
const blobServiceClient = new BlobServiceClient(`${AZURE_STORAGE_URL}?${AZURE_SAS_TOKEN}`);
const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

// Asset directories
const PATHKEYS_DIR = join(ROOT_DIR, 'assets', 'pathkeys');
const CAREERS_DIR = join(ROOT_DIR, 'assets', 'careers');

// Results tracking
const results = {
  pathkeys: { uploaded: 0, failed: 0, skipped: 0 },
  careers: { uploaded: 0, failed: 0, skipped: 0 },
};

/**
 * Upload a file to Azure Blob Storage
 */
async function uploadBlob(containerName, blobName, filePath, contentType) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Check if blob already exists
    const exists = await blockBlobClient.exists();
    if (exists && !isDryRun) {
      console.log(`  ⏭️  Skipped (already exists): ${blobName}`);
      return { success: true, skipped: true };
    }

    if (isDryRun) {
      console.log(`  🔍 [DRY RUN] Would upload: ${blobName}`);
      return { success: true, dryRun: true };
    }

    // Upload the file
    const fileContent = readFileSync(filePath);
    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: contentType,
      },
    };

    await blockBlobClient.upload(fileContent, fileContent.length, uploadOptions);

    const url = blockBlobClient.url;
    console.log(`  ✅ Uploaded: ${blobName}`);
    return { success: true, url, blobName };
  } catch (error) {
    console.error(`  ❌ Failed: ${blobName} - ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Update pathkey image URL in database
 */
async function updatePathkeyUrl(keyCode, imageUrl) {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('pathkeys')
      .update({ image_url: imageUrl })
      .eq('key_code', keyCode);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`  ⚠️  Database update failed for ${keyCode}: ${error.message}`);
    return false;
  }
}

/**
 * Update career image URL in database
 */
async function updateCareerUrl(onetCode, imageUrl) {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('careers')
      .update({ image_url: imageUrl })
      .eq('onet_code', onetCode);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`  ⚠️  Database update failed for ${onetCode}: ${error.message}`);
    return false;
  }
}

/**
 * Upload all pathkey images
 */
async function uploadPathkeys() {
  console.log('\n📦 Uploading Pathkey Images...\n');

  if (!existsSync(PATHKEYS_DIR)) {
    console.log(`⚠️  Directory not found: ${PATHKEYS_DIR}`);
    console.log('   Create assets/pathkeys/ and add your pathkey images there.');
    return;
  }

  const files = readdirSync(PATHKEYS_DIR).filter(f =>
    f.endsWith('.png') || f.endsWith('.gif') || f.endsWith('.jpg')
  );

  if (files.length === 0) {
    console.log('⚠️  No image files found in assets/pathkeys/');
    return;
  }

  console.log(`Found ${files.length} pathkey images\n`);

  for (const file of files) {
    const filePath = join(PATHKEYS_DIR, file);
    const keyCode = basename(file, extname(file)); // e.g., "DEV-001" from "DEV-001.png"
    const contentType = file.endsWith('.png') ? 'image/png' :
                       file.endsWith('.gif') ? 'image/gif' : 'image/jpeg';

    console.log(`Uploading ${file} (${keyCode})...`);
    const result = await uploadBlob('pathkeys', file, filePath, contentType);

    if (result.success && !result.dryRun && !result.skipped) {
      results.pathkeys.uploaded++;

      // Update database with new URL
      if (supabase && !isDryRun) {
        const imageUrl = `${AZURE_STORAGE_URL}/pathkeys/${file}`;
        const updated = await updatePathkeyUrl(keyCode, imageUrl);
        if (updated) {
          console.log(`  💾 Database updated for ${keyCode}`);
        }
      }
    } else if (result.skipped) {
      results.pathkeys.skipped++;
    } else if (!result.success) {
      results.pathkeys.failed++;
    }
  }
}

/**
 * Upload all career images
 */
async function uploadCareers() {
  console.log('\n📦 Uploading Career Images...\n');

  if (!existsSync(CAREERS_DIR)) {
    console.log(`⚠️  Directory not found: ${CAREERS_DIR}`);
    console.log('   Create assets/careers/ with subdirectories for each career.');
    return;
  }

  const careerDirs = readdirSync(CAREERS_DIR).filter(f => {
    const fullPath = join(CAREERS_DIR, f);
    return statSync(fullPath).isDirectory();
  });

  if (careerDirs.length === 0) {
    console.log('⚠️  No career directories found in assets/careers/');
    return;
  }

  console.log(`Found ${careerDirs.length} career directories\n`);

  // Map of career directory names to O*NET codes
  const CAREER_ONET_MAP = {
    'software-developer': '15-1252.00',
    'registered-nurse': '29-1141.00',
    'marketing-manager': '11-2021.00',
    'pr-specialist': '27-3031.00',
    'civil-engineer': '17-2051.00',
    'elementary-teacher': '25-2021.00',
    'physicist': '19-2012.00',
    'admin-assistant': '43-6014.00',
  };

  for (const careerDir of careerDirs) {
    console.log(`\nCareer: ${careerDir}`);
    const careerPath = join(CAREERS_DIR, careerDir);
    const files = readdirSync(careerPath).filter(f =>
      f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.mp4')
    );

    if (files.length === 0) {
      console.log(`  ⚠️  No files found in ${careerDir}/`);
      continue;
    }

    for (const file of files) {
      const filePath = join(careerPath, file);
      const blobName = `${careerDir}/${file}`; // e.g., "software-developer/main.jpg"
      const contentType = file.endsWith('.mp4') ? 'video/mp4' :
                         file.endsWith('.png') ? 'image/png' : 'image/jpeg';

      console.log(`  Uploading ${file}...`);
      const result = await uploadBlob('careers', blobName, filePath, contentType);

      if (result.success && !result.dryRun && !result.skipped) {
        results.careers.uploaded++;

        // Update database with new URL (only for main images)
        if (file === 'main.jpg' || file === 'main.jpeg' || file === 'main.png') {
          if (supabase && !isDryRun) {
            const onetCode = CAREER_ONET_MAP[careerDir];
            if (onetCode) {
              const imageUrl = `${AZURE_STORAGE_URL}/careers/${blobName}`;
              const updated = await updateCareerUrl(onetCode, imageUrl);
              if (updated) {
                console.log(`  💾 Database updated for ${careerDir}`);
              }
            } else {
              console.log(`  ⚠️  No O*NET mapping found for ${careerDir}`);
            }
          }
        }
      } else if (result.skipped) {
        results.careers.skipped++;
      } else if (!result.success) {
        results.careers.failed++;
      }
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Azure Storage Asset Upload Tool     ║');
  console.log('╚════════════════════════════════════════╝');

  if (isDryRun) {
    console.log('\n🔍 DRY RUN MODE - No files will be uploaded\n');
  }

  if (!careersOnly) {
    await uploadPathkeys();
  }

  if (!pathkeysOnly) {
    await uploadCareers();
  }

  // Print summary
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║            Upload Summary              ║');
  console.log('╚════════════════════════════════════════╝\n');

  if (!careersOnly) {
    console.log('Pathkeys:');
    console.log(`  ✅ Uploaded: ${results.pathkeys.uploaded}`);
    console.log(`  ⏭️  Skipped:  ${results.pathkeys.skipped}`);
    console.log(`  ❌ Failed:   ${results.pathkeys.failed}`);
  }

  if (!pathkeysOnly) {
    console.log('\nCareers:');
    console.log(`  ✅ Uploaded: ${results.careers.uploaded}`);
    console.log(`  ⏭️  Skipped:  ${results.careers.skipped}`);
    console.log(`  ❌ Failed:   ${results.careers.failed}`);
  }

  const totalUploaded = results.pathkeys.uploaded + results.careers.uploaded;
  const totalFailed = results.pathkeys.failed + results.careers.failed;

  console.log('\n' + '═'.repeat(40));
  if (isDryRun) {
    console.log('\n✅ Dry run completed successfully!');
    console.log('   Run without --dry-run to perform actual upload.');
  } else if (totalFailed === 0) {
    console.log(`\n✅ Upload completed! ${totalUploaded} files uploaded.`);
  } else {
    console.log(`\n⚠️  Upload completed with ${totalFailed} failures.`);
  }
  console.log('');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
