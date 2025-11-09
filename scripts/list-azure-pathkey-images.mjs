/**
 * List Azure Pathkey Images
 * ==========================
 * Lists all images in the pathkeys container to understand naming convention
 */

const AZURE_STORAGE_URL = 'https://pathctestore.blob.core.windows.net';
const PATHKEYS_CONTAINER = 'pathkeys';
const SAS_TOKEN = 'sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-11-01T06:43:25Z&st=2024-11-08T22:43:25Z&spr=https&sig=h2YCwCu8W4WZ2B4v%2BfOTUe1%2FLCHAjWk%2FqGS3BxcuZN8%3D';

async function listAzureImages() {
  console.log('🔍 Fetching images from Azure Blob Storage...\n');
  console.log(`Container: ${PATHKEYS_CONTAINER}`);
  console.log(`URL: ${AZURE_STORAGE_URL}/${PATHKEYS_CONTAINER}\n`);

  try {
    // List blobs in container
    const url = `${AZURE_STORAGE_URL}/${PATHKEYS_CONTAINER}?${SAS_TOKEN}&restype=container&comp=list`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response:', text);
      process.exit(1);
    }

    const xmlText = await response.text();

    // Parse blob names from XML
    const blobMatches = xmlText.matchAll(/<Name>([^<]+)<\/Name>/g);
    const blobs = Array.from(blobMatches).map(match => match[1]);

    if (blobs.length === 0) {
      console.log('❌ No images found in container');
      process.exit(0);
    }

    console.log(`✅ Found ${blobs.length} images:\n`);
    console.log('='.repeat(80));

    // Group images by pattern
    const pngImages = blobs.filter(b => b.toLowerCase().endsWith('.png'));
    const otherFiles = blobs.filter(b => !b.toLowerCase().endsWith('.png'));

    if (pngImages.length > 0) {
      console.log('\n📸 PNG Images:');
      pngImages.sort().forEach((blob, index) => {
        console.log(`  ${String(index + 1).padStart(3, ' ')}. ${blob}`);
      });
    }

    if (otherFiles.length > 0) {
      console.log('\n📁 Other Files:');
      otherFiles.forEach((blob, index) => {
        console.log(`  ${String(index + 1).padStart(3, ' ')}. ${blob}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 Total: ${blobs.length} files (${pngImages.length} PNG images)`);

    // Try to detect naming pattern
    console.log('\n🔍 Analyzing naming patterns...\n');

    const patterns = {
      'Career codes (e.g., PR-001.png)': pngImages.filter(b => /^[A-Z]+-\d+\.png$/i.test(b)),
      'Hyphenated names (e.g., public-relations.png)': pngImages.filter(b => /^[a-z]+-[a-z-]+\.png$/i.test(b)),
      'Single words (e.g., nurse.png)': pngImages.filter(b => /^[a-z]+\.png$/i.test(b)),
      'Other patterns': pngImages.filter(b =>
        !/^[A-Z]+-\d+\.png$/i.test(b) &&
        !/^[a-z]+-[a-z-]+\.png$/i.test(b) &&
        !/^[a-z]+\.png$/i.test(b)
      ),
    };

    for (const [pattern, matches] of Object.entries(patterns)) {
      if (matches.length > 0) {
        console.log(`${pattern}: ${matches.length} files`);
        if (matches.length <= 5) {
          matches.forEach(m => console.log(`  - ${m}`));
        } else {
          matches.slice(0, 3).forEach(m => console.log(`  - ${m}`));
          console.log(`  ... and ${matches.length - 3} more`);
        }
        console.log('');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
listAzureImages()
  .then(() => {
    console.log('✅ Complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
