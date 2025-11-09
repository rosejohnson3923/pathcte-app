/**
 * Test if pathkey images exist in Azure Blob Storage
 */

const STORAGE_URL = 'https://pathctestore.blob.core.windows.net';
const SAS_TOKEN = 'sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-11-01T05:00:00Z&st=2025-11-01T05:00:00Z&spr=https&sig=USDathlTZTiflOYmy2fsnpnpE45NG1vkSsy1U43qdNE%3D';

const images = [
  { name: 'Career Image (PR Specialist)', blob: 'pathkeys/pr-specialist.png' },
  { name: 'Lock Image', blob: 'pathkeys/Lock_gold_1.png' },
  { name: 'Key Image (Comm Key)', blob: 'pathkeys/Comm_key.png' }
];

console.log('🔍 Testing Azure Blob Storage Image URLs\n');
console.log('Storage Account: pathctestore');
console.log('Container: pathkeys');
console.log('SAS Token Expires: 2027-11-01\n');

for (const img of images) {
  const url = `${STORAGE_URL}/${img.blob}?${SAS_TOKEN}`;

  console.log(`\n📦 Testing: ${img.name}`);
  console.log(`URL: ${url.slice(0, 80)}...`);

  try {
    const response = await fetch(url, { method: 'HEAD' });

    if (response.ok) {
      console.log(`✅ Status: ${response.status} OK`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      console.log(`   Content-Length: ${response.headers.get('content-length')} bytes`);
    } else {
      console.log(`❌ Status: ${response.status} ${response.statusText}`);
      if (response.status === 404) {
        console.log(`   ⚠️  Image file does not exist in Azure Blob Storage`);
        console.log(`   📝 You need to upload: ${img.blob}`);
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

console.log('\n\n📋 Summary:');
console.log('━'.repeat(60));
console.log('If you see 404 errors, the component is working correctly.');
console.log('The "Image Pending" text indicates images need to be uploaded to Azure.');
console.log('\nSee docs/UPLOAD_PATHKEY_IMAGES.md for upload instructions.');
