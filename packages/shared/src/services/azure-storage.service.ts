/**
 * Azure Blob Storage Service
 * ===========================
 * Service for uploading/downloading files from Azure Blob Storage
 *
 * Platform-agnostic: Works in web and mobile
 */

import { BlobServiceClient, ContainerClient, BlobClient } from '@azure/storage-blob';
import { getAzureStorageConfig, buildAzureBlobUrl, AZURE_CONTAINERS } from '../config/azure-storage';

export interface UploadOptions {
  container: string;
  blobName: string;
  data: Blob | Buffer | ArrayBuffer;
  contentType?: string;
  metadata?: Record<string, string>;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  url: string;
  blobName: string;
  container: string;
  etag: string;
}

export interface ListBlobsOptions {
  container: string;
  prefix?: string;
  maxResults?: number;
}

export interface BlobInfo {
  name: string;
  url: string;
  size: number;
  contentType?: string;
  lastModified: Date;
  metadata?: Record<string, string>;
}

class AzureStorageService {
  private blobServiceClient: BlobServiceClient | null = null;

  /**
   * Initialize the Blob Service Client
   */
  private initializeClient(): BlobServiceClient {
    if (this.blobServiceClient) {
      return this.blobServiceClient;
    }

    const config = getAzureStorageConfig();

    if (!config.sasToken) {
      throw new Error('Azure Storage SAS token is not configured');
    }

    // Create service client with SAS token
    const sasUrl = `${config.storageUrl}?${config.sasToken}`;
    this.blobServiceClient = new BlobServiceClient(sasUrl);

    return this.blobServiceClient;
  }

  /**
   * Get container client
   */
  private getContainerClient(containerName: string): ContainerClient {
    const serviceClient = this.initializeClient();
    return serviceClient.getContainerClient(containerName);
  }

  /**
   * Get blob client
   */
  private getBlobClient(containerName: string, blobName: string): BlobClient {
    const containerClient = this.getContainerClient(containerName);
    return containerClient.getBlobClient(blobName);
  }

  /**
   * Upload a file to Azure Blob Storage
   */
  async uploadBlob(options: UploadOptions): Promise<UploadResult> {
    const { container, blobName, data, contentType, metadata, onProgress } = options;

    try {
      const blockBlobClient = this.getBlobClient(container, blobName).getBlockBlobClient();

      // Upload with options
      const uploadResponse = await blockBlobClient.uploadData(data as any, {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
        metadata,
        onProgress: onProgress
          ? (progressEvent) => {
              const progress = progressEvent.loadedBytes / (data as any).size;
              onProgress(Math.round(progress * 100));
            }
          : undefined,
      });

      const url = buildAzureBlobUrl(container, blobName);

      return {
        url,
        blobName,
        container,
        etag: uploadResponse.etag || '',
      };
    } catch (error) {
      console.error('Error uploading blob:', error);
      throw new Error(`Failed to upload blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download a blob from Azure Blob Storage
   */
  async downloadBlob(container: string, blobName: string): Promise<Blob> {
    try {
      const blobClient = this.getBlobClient(container, blobName);
      const downloadResponse = await blobClient.download();

      if (!downloadResponse.blobBody) {
        throw new Error('No blob body in response');
      }

      return downloadResponse.blobBody;
    } catch (error) {
      console.error('Error downloading blob:', error);
      throw new Error(`Failed to download blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a blob from Azure Blob Storage
   */
  async deleteBlob(container: string, blobName: string): Promise<void> {
    try {
      const blobClient = this.getBlobClient(container, blobName);
      await blobClient.delete();
    } catch (error) {
      console.error('Error deleting blob:', error);
      throw new Error(`Failed to delete blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if a blob exists
   */
  async blobExists(container: string, blobName: string): Promise<boolean> {
    try {
      const blobClient = this.getBlobClient(container, blobName);
      return await blobClient.exists();
    } catch (error) {
      console.error('Error checking blob existence:', error);
      return false;
    }
  }

  /**
   * List blobs in a container
   */
  async listBlobs(options: ListBlobsOptions): Promise<BlobInfo[]> {
    const { container, prefix, maxResults } = options;

    try {
      const containerClient = this.getContainerClient(container);
      const blobs: BlobInfo[] = [];

      const iterator = containerClient.listBlobsFlat({
        prefix,
      });

      let count = 0;
      for await (const blob of iterator) {
        if (maxResults && count >= maxResults) break;

        blobs.push({
          name: blob.name,
          url: buildAzureBlobUrl(container, blob.name),
          size: blob.properties.contentLength || 0,
          contentType: blob.properties.contentType,
          lastModified: blob.properties.lastModified || new Date(),
          metadata: blob.metadata,
        });

        count++;
      }

      return blobs;
    } catch (error) {
      console.error('Error listing blobs:', error);
      throw new Error(`Failed to list blobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get blob properties/metadata
   */
  async getBlobProperties(container: string, blobName: string): Promise<BlobInfo> {
    try {
      const blobClient = this.getBlobClient(container, blobName);
      const properties = await blobClient.getProperties();

      return {
        name: blobName,
        url: buildAzureBlobUrl(container, blobName),
        size: properties.contentLength || 0,
        contentType: properties.contentType,
        lastModified: properties.lastModified || new Date(),
        metadata: properties.metadata,
      };
    } catch (error) {
      console.error('Error getting blob properties:', error);
      throw new Error(`Failed to get blob properties: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a public URL for a blob
   */
  getBlobUrl(container: string, blobName: string): string {
    return buildAzureBlobUrl(container, blobName);
  }

  /**
   * Upload a career image
   */
  async uploadCareerImage(
    careerCode: string,
    file: Blob | Buffer,
    contentType: string
  ): Promise<UploadResult> {
    const blobName = `${careerCode}/main.${contentType.split('/')[1] || 'jpg'}`;
    return this.uploadBlob({
      container: AZURE_CONTAINERS.CAREERS,
      blobName,
      data: file,
      contentType,
    });
  }

  /**
   * Upload a pathkey image
   */
  async uploadPathkeyImage(
    pathkeyId: string,
    file: Blob | Buffer,
    contentType: string
  ): Promise<UploadResult> {
    const extension = contentType.split('/')[1] || 'png';
    const blobName = `${pathkeyId}.${extension}`;
    return this.uploadBlob({
      container: AZURE_CONTAINERS.PATHKEYS,
      blobName,
      data: file,
      contentType,
    });
  }

  /**
   * Upload a user avatar
   */
  async uploadAvatar(userId: string, file: Blob | Buffer, contentType: string): Promise<UploadResult> {
    const extension = contentType.split('/')[1] || 'jpg';
    const blobName = `${userId}.${extension}`;
    return this.uploadBlob({
      container: AZURE_CONTAINERS.AVATARS,
      blobName,
      data: file,
      contentType,
    });
  }

  /**
   * Upload an achievement icon
   */
  async uploadAchievementIcon(
    achievementId: string,
    file: Blob | Buffer,
    contentType: string
  ): Promise<UploadResult> {
    const extension = contentType.split('/')[1] || 'png';
    const blobName = `${achievementId}.${extension}`;
    return this.uploadBlob({
      container: AZURE_CONTAINERS.ACHIEVEMENTS,
      blobName,
      data: file,
      contentType,
    });
  }
}

// Export singleton instance
export const azureStorageService = new AzureStorageService();

// Export class for testing
export { AzureStorageService };
