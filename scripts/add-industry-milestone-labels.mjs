#!/usr/bin/env node
/**
 * Add Labels to Industry & Milestone Pathkeys
 * ============================================
 * Adds text labels to lock/lockbox pathkey images
 */

import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Pathkey mappings
const pathkeys = [
  {
    sourceFile: 'lockbox-blue.png',
    targetFile: 'IND-TECH.png',
    label: 'Tech Pioneer',
    color: '#6366f1', // Indigo
  },
  {
    sourceFile: 'lock-pink1.png',
    targetFile: 'IND-HEALTH.png',
    label: 'Healthcare Hero',
    color: '#dc2626', // Red
  },
  {
    sourceFile: 'lockbox-purple.png',
    targetFile: 'IND-BIZ.png',
    label: 'Business Mogul',
    color: '#0891b2', // Cyan
  },
  {
    sourceFile: 'lock-gold1.png',
    targetFile: 'MILE-FIRST.png',
    label: 'First Victory',
    color: '#fbbf24', // Amber/Gold
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
  console.log('║   Industry & Milestone Label Tool     ║');
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
    console.log('✅ All labels added successfully!');
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
