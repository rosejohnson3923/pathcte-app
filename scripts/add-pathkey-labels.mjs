#!/usr/bin/env node
/**
 * Add Labels to Pathkey Images
 * =============================
 * Adds text labels to pathkey images that were generated without them
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Pathkey mappings
const pathkeys = [
  {
    sourceFile: 'skill-key.png',
    targetFile: 'SKILL-CODE.png',
    label: 'First Lines',
    color: '#3b82f6', // Blue
  },
  {
    sourceFile: 'problem-key.png',
    targetFile: 'SKILL-PROB.png',
    label: 'Problem Solver',
    color: '#14b8a6', // Teal
  },
  {
    sourceFile: 'comm-key.png',
    targetFile: 'SKILL-COMM.png',
    label: 'Great Communicator',
    color: '#f97316', // Orange
  },
  {
    sourceFile: 'lead-key.png',
    targetFile: 'SKILL-LEAD.png',
    label: 'Team Leader',
    color: '#84cc16', // Lime
  },
];

const SOURCE_DIR = join(ROOT_DIR, 'public', 'assets');
const TARGET_DIR = join(ROOT_DIR, 'assets', 'pathkeys');

/**
 * Add text label to image
 */
async function addLabel(pathkey) {
  const sourcePath = join(SOURCE_DIR, pathkey.sourceFile);
  const targetPath = join(TARGET_DIR, pathkey.targetFile);

  console.log(`\nProcessing: ${pathkey.sourceFile}`);
  console.log(`  Label: "${pathkey.label}"`);
  console.log(`  Output: ${pathkey.targetFile}`);

  try {
    // Get image metadata
    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    console.log(`  Dimensions: ${width}x${height}px`);

    // Create SVG text overlay
    // Position at bottom of image with some padding
    const fontSize = Math.floor(width * 0.08); // 8% of image width
    const textY = height - fontSize - 20; // 20px from bottom
    const textX = width / 2; // Center horizontally

    const svgText = `
      <svg width="${width}" height="${height}">
        <defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&amp;display=swap');
            .title {
              fill: white;
              font-size: ${fontSize}px;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-weight: 700;
              text-anchor: middle;
              paint-order: stroke;
              stroke: rgba(0, 0, 0, 0.5);
              stroke-width: ${fontSize * 0.08}px;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
          </style>
        </defs>
        <text x="${textX}" y="${textY}" class="title">${pathkey.label}</text>
      </svg>
    `;

    // Composite the text onto the image
    await image
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toFile(targetPath);

    console.log(`  ✅ Saved: ${targetPath}`);
    return { success: true };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Pathkey Label Addition Tool         ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Target: ${TARGET_DIR}\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const pathkey of pathkeys) {
    const result = await addLabel(pathkey);
    if (result.success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log('\n' + '═'.repeat(40));
  console.log('\n📊 Summary:');
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed: ${failureCount}`);
  console.log('');

  if (failureCount === 0) {
    console.log('✅ All pathkey labels added successfully!');
    console.log('   Ready to upload to Azure Storage.\n');
  } else {
    console.log('⚠️  Some pathkeys failed. Please check errors above.\n');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
