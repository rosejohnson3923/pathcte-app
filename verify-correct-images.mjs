/**
 * Verify the correct pathkey images exist in Azure Blob Storage
 */

const STORAGE_URL = 'https://pathctestore.blob.core.windows.net';
const SAS_TOKEN = 'sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-11-01T05:00:00Z&st=2025-11-01T05:00:00Z&spr=https&sig=USDathlTZTiflOYmy2fsnpnpE45NG1vkSsy1U43qdNE%3D';

const images = [
  { name: 'Career Image (Section 1)', blob: 'pathkeys/PR-001.png', description: 'Public Relations pathkey' },
  { name: 'Lock Image (Section 2)', blob: 'pathkeys/MILE-FIRST.png', description: 'First Milestone pathkey' },
  { name: 'Key Image (Section 3)', blob: 'pathkeys/SKILL-CODE.png', description: 'Coding Skill pathkey' }
];

console.log('🔍 Verifying Correct Pathkey Images in Azure\n');
console.log('Storage Account: pathctestore');
console.log('Container: pathkeys\n');

let allFound = true;

for (const img of images) {
  const url = `${STORAGE_URL}/${img.blob}?${SAS_TOKEN}`;

  console.log(`📦 ${img.name}`);
  console.log(`   File: ${img.blob}`);
  console.log(`   Description: ${img.description}`);

  try {
    const response = await fetch(url, { method: 'HEAD' });

    if (response.ok) {
      const sizeKB = Math.round(parseInt(response.headers.get('content-length')) / 1024);
      console.log(`   ✅ Status: ${response.status} OK`);
      console.log(`   📁 Size: ${sizeKB} KB`);
      console.log(`   📷 Type: ${response.headers.get('content-type')}`);
    } else {
      console.log(`   ❌ Status: ${response.status} ${response.statusText}`);
      allFound = false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    allFound = false;
  }
  console.log('');
}

console.log('━'.repeat(60));
if (allFound) {
  console.log('✅ SUCCESS! All images found in Azure Blob Storage.');
  console.log('🎉 Refresh the test page to see the actual images load.');
  console.log('\nTest page: http://localhost:5173/test-pathkey-card');
} else {
  console.log('❌ Some images are missing. Please check the filenames.');
}
