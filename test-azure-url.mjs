/**
 * Test Azure URL SAS Token Appending
 * This tests that our ensureAzureUrlHasSasToken function works correctly
 */

// Simulate Vite environment variables
const VITE_ENV = {
  VITE_AZURE_STORAGE_URL: 'https://pathket.blob.core.windows.net',
  VITE_AZURE_STORAGE_SAS_TOKEN: 'sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-10-27T05:00:00Z&st=2025-10-27T05:00:00Z&spr=https&sig=7noNXMMaQ6mFod4DRudZJGWGs92fIObF7eqB52XkdU0%3D',
  VITE_AZURE_CONTAINER_PATHKEYS: 'pathkeys',
};

const AZURE_CONFIG = {
  storageUrl: VITE_ENV.VITE_AZURE_STORAGE_URL,
  sasToken: VITE_ENV.VITE_AZURE_STORAGE_SAS_TOKEN,
  containers: {
    pathkeys: VITE_ENV.VITE_AZURE_CONTAINER_PATHKEYS,
  },
};

const buildAzureUrl = (container, blobName) => {
  const baseUrl = `${AZURE_CONFIG.storageUrl}/${container}/${blobName}`;
  if (AZURE_CONFIG.sasToken) {
    return `${baseUrl}?${AZURE_CONFIG.sasToken}`;
  }
  return baseUrl;
};

const ensureAzureUrlHasSasToken = (imageUrl) => {
  if (!imageUrl) return null;

  if (!imageUrl.includes('pathket.blob.core.windows.net')) {
    return imageUrl;
  }

  if (imageUrl.includes('?sv=') || imageUrl.includes('&sv=')) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const container = pathParts[0];
      const blobName = pathParts.slice(1).join('/');
      return buildAzureUrl(container, blobName);
    }
  } catch (e) {
    console.error('Error parsing Azure URL:', e);
  }

  return imageUrl;
};

// Test cases
console.log('Testing Azure URL SAS Token Appending\n');

const testUrls = [
  'https://pathket.blob.core.windows.net/pathkeys/DEV-001.png',
  'https://pathket.blob.core.windows.net/pathkeys/SKILL-CODE.png',
  'https://pathket.blob.core.windows.net/pathkeys/IND-TECH.png',
  'https://pathket.blob.core.windows.net/pathkeys/DEV-001.png?sv=2024-11-04&ss=bfqt', // Already has token
  'https://example.com/image.png', // Non-Azure URL
  null, // Null URL
];

testUrls.forEach((url, i) => {
  console.log(`Test ${i + 1}: ${url || 'null'}`);
  const result = ensureAzureUrlHasSasToken(url);
  console.log(`Result: ${result || 'null'}`);
  console.log(`Has SAS token: ${result && result.includes('?sv=') ? 'YES ✓' : 'NO ✗'}`);
  console.log('---\n');
});
