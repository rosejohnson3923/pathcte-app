/**
 * Azure Storage Configuration for Web
 * ====================================
 * Client-side configuration that accesses Vite environment variables
 */

// Access environment variables directly so Vite can replace them at build time
export const AZURE_CONFIG = {
  storageUrl: import.meta.env.VITE_AZURE_STORAGE_URL || 'https://pathket.blob.core.windows.net',
  sasToken: import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN || '',
  containers: {
    pathkeys: import.meta.env.VITE_AZURE_CONTAINER_PATHKEYS || 'pathkeys',
    careers: import.meta.env.VITE_AZURE_CONTAINER_CAREERS || 'careers',
    avatars: import.meta.env.VITE_AZURE_CONTAINER_AVATARS || 'avatars',
    achievements: import.meta.env.VITE_AZURE_CONTAINER_ACHIEVEMENTS || 'achievements',
  },
};

// Config loaded successfully

/**
 * Build Azure Blob URL with SAS token
 */
export const buildAzureUrl = (container: string, blobName: string): string => {
  const baseUrl = `${AZURE_CONFIG.storageUrl}/${container}/${blobName}`;

  if (AZURE_CONFIG.sasToken) {
    return `${baseUrl}?${AZURE_CONFIG.sasToken}`;
  }

  return baseUrl;
};

/**
 * Ensure Azure URL has SAS token
 */
export const ensureAzureUrlHasSasToken = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;

  // If it's not an Azure Storage URL, return as-is
  if (!imageUrl.includes('pathket.blob.core.windows.net')) {
    return imageUrl;
  }

  // If it already has a SAS token, return as-is
  if (imageUrl.includes('?sv=') || imageUrl.includes('&sv=')) {
    return imageUrl;
  }

  // Extract the blob path and rebuild with SAS token
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
