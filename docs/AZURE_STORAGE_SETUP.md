# Azure Storage Integration Guide

**Date:** October 27, 2025
**Status:** ✅ Service Created, Configuration Ready, Integration Complete

---

## Overview

Pathket uses **Azure Blob Storage** to host all images and media assets including:
- 🔑 Pathkey artwork (static and animated)
- 💼 Career images and videos
- 👤 User avatars
- 🏆 Achievement icons

---

## Azure Storage Account Configuration

### Account Details
- **Account Name:** `pathket`
- **Location:** Central US (with RA-GRS replication to East US 2)
- **Endpoint:** `https://pathket.blob.core.windows.net`
- **Performance Tier:** Standard
- **Replication:** Read-access geo-redundant storage (RA-GRS)

### Containers Created
The following blob containers have been created in Azure:

| Container Name | Purpose | Public Access |
|----------------|---------|---------------|
| `careers` | Career images, videos, and thumbnails | Blob (anonymous read) |
| `pathkeys` | Pathkey artwork (PNG/GIF) | Blob (anonymous read) |
| `avatars` | User profile avatars | Blob (anonymous read) |
| `achievements` | Achievement/badge icons | Blob (anonymous read) |

---

## Environment Variables Setup

Add the following to your `.env` file:

```bash
# Azure Blob Storage Configuration
VITE_AZURE_STORAGE_ACCOUNT=pathket
VITE_AZURE_STORAGE_URL=https://pathket.blob.core.windows.net
VITE_AZURE_STORAGE_SAS_TOKEN=your_sas_token_here

# Container Names
VITE_AZURE_CONTAINER_CAREERS=careers
VITE_AZURE_CONTAINER_PATHKEYS=pathkeys
VITE_AZURE_CONTAINER_AVATARS=avatars
VITE_AZURE_CONTAINER_ACHIEVEMENTS=achievements
```

### Generating a SAS Token

To generate a Shared Access Signature (SAS) token:

1. Navigate to Azure Portal → Storage Account → Shared access signature
2. Configure permissions:
   - **Allowed services:** Blob
   - **Allowed resource types:** Container, Object
   - **Allowed permissions:** Read, Write, Delete, List, Add, Create
3. Set expiration date (recommend 1 year)
4. Generate SAS token
5. Copy the **SAS token** (starts with `?sv=...`)
6. Add to `.env` file (without the `?` prefix)

---

## Code Architecture

### 1. Configuration (`packages/shared/src/config/azure-storage.ts`)

```typescript
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

export const getAzureStorageConfig = (): AzureStorageConfig;
export const buildAzureBlobUrl = (container: string, blobName: string, sasToken?: string): string;
```

### 2. Service Layer (`packages/shared/src/services/azure-storage.service.ts`)

The `AzureStorageService` provides methods for:

**Upload Operations:**
```typescript
uploadBlob(options: UploadOptions): Promise<UploadResult>
uploadCareerImage(careerCode: string, file: Blob | Buffer, contentType: string): Promise<UploadResult>
uploadPathkeyImage(pathkeyId: string, file: Blob | Buffer, contentType: string): Promise<UploadResult>
uploadAvatar(userId: string, file: Blob | Buffer, contentType: string): Promise<UploadResult>
uploadAchievementIcon(achievementId: string, file: Blob | Buffer, contentType: string): Promise<UploadResult>
```

**Download/List Operations:**
```typescript
downloadBlob(container: string, blobName: string): Promise<Blob>
listBlobs(options: ListBlobsOptions): Promise<BlobInfo[]>
getBlobProperties(container: string, blobName: string): Promise<BlobInfo>
deleteBlob(container: string, blobName: string): Promise<void>
blobExists(container: string, blobName: string): Promise<boolean>
```

**URL Generation:**
```typescript
getBlobUrl(container: string, blobName: string): string
```

### 3. Image Utilities (`packages/shared/src/utils/image.ts`)

Helper functions for generating image URLs:

```typescript
// Pathkey images
getPathkeyImageUrl(pathkeyId: string, format?: 'png' | 'jpg' | 'gif'): string
getPathkeyAnimatedUrl(pathkeyId: string): string

// Career images
getCareerImageUrl(careerCode: string, filename?: string): string
getCareerVideoUrl(careerCode: string, filename?: string): string

// User avatars
getAvatarUrl(userId: string, format?: 'jpg' | 'png'): string

// Achievements
getAchievementIconUrl(achievementId: string, format?: 'png' | 'svg'): string

// Placeholders
getPlaceholderImageUrl(type: 'pathkey' | 'career' | 'avatar' | 'achievement'): string
getImageWithFallback(imageUrl: string | null, fallbackType: string): string
```

---

## Usage Examples

### Display a Pathkey Image in React

```tsx
import { getPathkeyImageUrl, getPlaceholderImageUrl } from '@pathket/shared';

function PathkeyCard({ pathkeyId }: { pathkeyId: string }) {
  return (
    <img
      src={getPathkeyImageUrl(pathkeyId)}
      alt="Pathkey"
      onError={(e) => {
        e.currentTarget.src = getPlaceholderImageUrl('pathkey');
      }}
    />
  );
}
```

### Upload a Pathkey Image

```typescript
import { azureStorageService } from '@pathket/shared';

async function uploadPathkey(pathkeyId: string, imageFile: File) {
  const result = await azureStorageService.uploadPathkeyImage(
    pathkeyId,
    imageFile,
    imageFile.type
  );

  console.log('Uploaded to:', result.url);
  return result;
}
```

### Upload a Career Image with Progress

```typescript
import { azureStorageService } from '@pathket/shared';

async function uploadCareerImage(careerCode: string, file: File) {
  const result = await azureStorageService.uploadBlob({
    container: 'careers',
    blobName: `${careerCode}/main.jpg`,
    data: file,
    contentType: file.type,
    onProgress: (progress) => {
      console.log(`Upload progress: ${progress}%`);
    },
  });

  return result;
}
```

### List All Pathkeys in Storage

```typescript
import { azureStorageService } from '@pathket/shared';

async function listAllPathkeys() {
  const blobs = await azureStorageService.listBlobs({
    container: 'pathkeys',
    maxResults: 100,
  });

  blobs.forEach(blob => {
    console.log(`Pathkey: ${blob.name}, Size: ${blob.size} bytes`);
  });

  return blobs;
}
```

---

## File Naming Conventions

### Pathkeys
- **Static Image:** `{pathkey_id}.png` (e.g., `abc123.png`)
- **Animated Image:** `{pathkey_id}-animated.gif` (e.g., `abc123-animated.gif`)
- **Rarity variations:** `{pathkey_id}-{rarity}.png` (e.g., `abc123-legendary.png`)

### Careers
- **Main Image:** `{career_code}/main.jpg`
- **Video:** `{career_code}/main.mp4`
- **Thumbnail:** `{career_code}/thumb.jpg`
- **Gallery Images:** `{career_code}/gallery-{index}.jpg`

### Avatars
- **User Avatar:** `{user_id}.jpg` (e.g., `550e8400-e29b-41d4-a716-446655440000.jpg`)

### Achievements
- **Icon:** `{achievement_id}.png`

---

## Integration Status

### ✅ Completed

1. **Service Layer:** Full Azure Blob Storage service with upload/download/list operations
2. **Configuration:** Environment-based configuration with SAS token support
3. **Image Utilities:** Helper functions for generating URLs with fallbacks
4. **Dashboard Integration:** Pathkey images displayed in dashboard with Azure URLs
5. **Error Handling:** Automatic fallback to placeholder images on load failure
6. **Type Safety:** Full TypeScript support with interfaces and types

### ⏭️ Next Steps

1. **Seed Initial Data:**
   - Upload placeholder pathkey artwork
   - Upload career images for initial career catalog
   - Create default avatar set

2. **Admin Upload Tool:**
   - Build admin interface for uploading pathkey artwork
   - Bulk upload tool for career images
   - Image optimization pipeline

3. **CDN Integration (Optional):**
   - Configure Azure CDN for faster global delivery
   - Add cache headers for static assets

4. **Image Processing:**
   - Resize/optimize images on upload
   - Generate thumbnails automatically
   - Convert to WebP for better performance

---

## Security Considerations

### SAS Token Security
- ✅ SAS tokens are stored in environment variables (not in code)
- ✅ Use read-only SAS tokens for public containers
- ✅ Set appropriate expiration dates (recommend 1 year max)
- ⚠️ Rotate SAS tokens before expiration
- ⚠️ Never commit SAS tokens to version control

### Container Access Levels
- **Blob (anonymous read):** Users can read blobs if they know the URL
- **Container (anonymous read):** Users can list and read all blobs
- **Private:** Requires authentication (not used for public assets)

### CORS Configuration
If accessing from web browsers, configure CORS in Azure:
```
Allowed origins: https://app.pathket.com, http://localhost:5173
Allowed methods: GET, HEAD
Allowed headers: *
Max age: 3600
```

---

## Performance Optimization

### Recommendations

1. **Use CDN:** Configure Azure CDN for reduced latency
2. **Image Formats:** Use WebP with JPEG fallback for better compression
3. **Lazy Loading:** Implement lazy loading for images in lists
4. **Caching:** Set appropriate cache headers (max-age=31536000 for immutable assets)
5. **Responsive Images:** Serve different sizes based on device/viewport

### Example Sizes

**Pathkeys:**
- Thumbnail: 150x200px
- Card: 300x400px
- Detail: 600x800px

**Careers:**
- Thumbnail: 300x200px
- Hero: 1200x800px

**Avatars:**
- Small: 50x50px
- Medium: 150x150px
- Large: 400x400px

---

## Troubleshooting

### Issue: "Azure Storage SAS token is not configured"
**Solution:** Ensure `VITE_AZURE_STORAGE_SAS_TOKEN` is set in `.env` file

### Issue: Images not loading (403 Forbidden)
**Solution:**
- Check SAS token has not expired
- Verify container has "Blob" public access level
- Ensure SAS token has "Read" permission

### Issue: Images not loading (404 Not Found)
**Solution:**
- Verify the blob exists in the container
- Check file naming convention matches
- Use `azureStorageService.blobExists()` to verify

### Issue: CORS errors in browser
**Solution:**
- Configure CORS in Azure Storage Account settings
- Add your domain to allowed origins
- Ensure preflight requests (OPTIONS) are allowed

---

## Monitoring

### Azure Portal Metrics
Monitor these metrics in Azure Portal:
- **Total Requests:** Track API calls
- **Success Rate:** Monitor 2xx responses
- **Latency:** Track response times
- **Bandwidth:** Monitor data transfer
- **Storage Used:** Track blob storage consumption

### Application Insights (Optional)
Integrate Application Insights for:
- Upload success/failure rates
- Image load times
- Error tracking
- User behavior analytics

---

## Cost Estimation

### Storage Costs (Central US pricing)
- **Storage:** ~$0.018 per GB/month
- **Operations:** ~$0.004 per 10,000 read operations
- **Data Transfer:** First 100 GB free, then ~$0.087 per GB

### Example Monthly Cost
For a typical deployment with:
- 10 GB of images (pathkeys + careers + avatars)
- 1 million image requests
- 50 GB bandwidth

**Estimated Cost:** ~$5-10/month

---

## References

- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [Azure Storage SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob)
- [SAS Token Best Practices](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview)
- [Azure CDN Documentation](https://docs.microsoft.com/en-us/azure/cdn/)

---

## Summary

✅ **Azure Storage is fully integrated and ready to use!**

The infrastructure is in place for:
- Displaying pathkey images in the dashboard
- Uploading career images and videos
- Storing user avatars
- Managing achievement icons

Next priority is to **seed initial data** by uploading placeholder artwork for pathkeys and careers.
