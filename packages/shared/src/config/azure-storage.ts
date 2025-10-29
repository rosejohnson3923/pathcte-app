/**
 * Azure Blob Storage Configuration
 * =================================
 * Configuration for Pathket Azure Storage Account
 *
 * Storage Account: pathket
 * Location: Central US (with RA-GRS replication to East US 2)
 * Endpoint: https://pathket.blob.core.windows.net
 */

export interface AzureStorageConfig {
  accountName: string;
  storageUrl: string;
  sasToken: string;
  containers: {
    careers: string;
    pathkeys: string;
    avatars: string;
    achievements: string;
  };
}

// Environment variable access helpers
// Works in both Node.js (scripts) and browser (Vite) environments
const getViteEnv = (key: string): string => {
  // Browser environment (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as any)[key] || '';
  }

  // Node.js environment (scripts)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }

  return '';
};

/**
 * Get Azure Storage configuration from environment variables
 */
export const getAzureStorageConfig = (): AzureStorageConfig => {
  const config: AzureStorageConfig = {
    accountName: getViteEnv('VITE_AZURE_STORAGE_ACCOUNT') || 'pathket',
    storageUrl: getViteEnv('VITE_AZURE_STORAGE_URL') || 'https://pathket.blob.core.windows.net',
    sasToken: getViteEnv('VITE_AZURE_STORAGE_SAS_TOKEN') || '',
    containers: {
      careers: getViteEnv('VITE_AZURE_CONTAINER_CAREERS') || 'careers',
      pathkeys: getViteEnv('VITE_AZURE_CONTAINER_PATHKEYS') || 'pathkeys',
      avatars: getViteEnv('VITE_AZURE_CONTAINER_AVATARS') || 'avatars',
      achievements: getViteEnv('VITE_AZURE_CONTAINER_ACHIEVEMENTS') || 'achievements',
    },
  };

  return config;
};

/**
 * Container names
 */
export const AZURE_CONTAINERS = {
  CAREERS: 'careers',
  PATHKEYS: 'pathkeys',
  AVATARS: 'avatars',
  ACHIEVEMENTS: 'achievements',
} as const;

/**
 * Build a full Azure Blob URL
 * @param container - Container name
 * @param blobName - Blob path/name
 * @param sasToken - Optional SAS token (defaults to config)
 */
export const buildAzureBlobUrl = (
  container: string,
  blobName: string,
  sasToken?: string
): string => {
  const config = getAzureStorageConfig();
  const token = sasToken || config.sasToken;
  const baseUrl = `${config.storageUrl}/${container}/${blobName}`;

  if (token) {
    return `${baseUrl}?${token}`;
  }

  return baseUrl;
};

/**
 * Extract blob name from a full Azure URL
 */
export const extractBlobName = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      // Format: /container/path/to/blob
      return pathParts.slice(1).join('/') || null;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Extract container name from a full Azure URL
 */
export const extractContainerName = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 1) {
      return pathParts[0] || null;
    }
    return null;
  } catch {
    return null;
  }
};

export default getAzureStorageConfig;
