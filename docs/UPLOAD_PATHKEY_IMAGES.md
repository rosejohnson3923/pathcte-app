# Uploading Pathkey Images to Azure Blob Storage

## Issue Summary

The Career Pathkey Card component is working correctly with SAS token authentication, but the actual image files haven't been uploaded to Azure Blob Storage yet. This causes placeholder icons to be displayed instead of the actual images.

## What's Working ✅

- ✅ Component correctly adds SAS tokens to image URLs
- ✅ Azure Blob Storage container "pathkeys" exists
- ✅ SAS token is valid and has read permissions
- ✅ Fallback placeholders display correctly when images don't load

## Current Status ✅

The test page now uses existing pathkey images from the `pathkeys` container:
- `PR-001.png` (Career image - Public Relations pathkey)
- `MILE-FIRST.png` (Lock image - First Milestone pathkey)
- `SKILL-CODE.png` (Key image - Coding Skill pathkey)

These images already exist in Azure and are loading correctly.

## Method 1: Azure Portal (Web Interface)

### Steps:

1. **Open Azure Portal**
   - Navigate to https://portal.azure.com
   - Sign in with your Azure account

2. **Find Storage Account**
   - Search for "pathctestore" in the top search bar
   - Click on the storage account

3. **Navigate to Container**
   - In the left menu, click "Containers" under "Data storage"
   - Click on the "pathkeys" container

4. **Upload Images**
   - Click the "Upload" button at the top
   - Click "Browse for files"
   - Select your three image files:
     - pr-specialist.png
     - Lock_gold_1.png
     - Comm_key.png
   - Click "Upload"

5. **Verify Upload**
   - The files should appear in the container list
   - Note: The files will NOT be publicly accessible (this is correct - they use SAS tokens)

## Method 2: Azure CLI

### Prerequisites:
```bash
# Install Azure CLI if not already installed
# Windows: https://aka.ms/installazurecliwindows
# Mac: brew install azure-cli
# Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login
```

### Upload Commands:

```bash
# Set variables
STORAGE_ACCOUNT="pathctestore"
CONTAINER="pathkeys"

# Upload each image
az storage blob upload \
  --account-name $STORAGE_ACCOUNT \
  --container-name $CONTAINER \
  --name pr-specialist.png \
  --file /path/to/pr-specialist.png \
  --auth-mode login

az storage blob upload \
  --account-name $STORAGE_ACCOUNT \
  --container-name $CONTAINER \
  --name Lock_gold_1.png \
  --file /path/to/Lock_gold_1.png \
  --auth-mode login

az storage blob upload \
  --account-name $STORAGE_ACCOUNT \
  --container-name $CONTAINER \
  --name Comm_key.png \
  --file /path/to/Comm_key.png \
  --auth-mode login
```

### Verify Upload:

```bash
# List files in container
az storage blob list \
  --account-name pathctestore \
  --container-name pathkeys \
  --auth-mode login \
  --output table
```

## Method 3: Azure Storage Explorer (Desktop App)

### Steps:

1. **Download Azure Storage Explorer**
   - https://azure.microsoft.com/en-us/features/storage-explorer/
   - Install and launch the application

2. **Connect to Storage Account**
   - Click "Connect" in the left panel
   - Select "Storage account or service"
   - Choose "Account name and key"
   - Enter:
     - Display name: PathCTE Storage
     - Account name: pathctestore
     - Account key: [Get from Azure Portal → Storage Account → Access Keys]

3. **Navigate to Container**
   - Expand "Storage Accounts" → "pathctestore" → "Blob Containers"
   - Click on "pathkeys"

4. **Upload Images**
   - Click "Upload" button in the toolbar
   - Select "Upload Files"
   - Browse and select your three images
   - Click "Upload"

5. **Verify**
   - The images should appear in the file list

## Method 4: PowerShell (Windows)

```powershell
# Install Azure PowerShell module if needed
Install-Module -Name Az -AllowClobber -Scope CurrentUser

# Connect to Azure
Connect-AzAccount

# Set context
$storageAccount = Get-AzStorageAccount -ResourceGroupName "YourResourceGroup" -Name "pathctestore"
$ctx = $storageAccount.Context

# Upload images
Set-AzStorageBlobContent -File "C:\path\to\pr-specialist.png" `
  -Container "pathkeys" `
  -Blob "pr-specialist.png" `
  -Context $ctx

Set-AzStorageBlobContent -File "C:\path\to\Lock_gold_1.png" `
  -Container "pathkeys" `
  -Blob "Lock_gold_1.png" `
  -Context $ctx

Set-AzStorageBlobContent -File "C:\path\to\Comm_key.png" `
  -Container "pathkeys" `
  -Blob "Comm_key.png" `
  -Context $ctx

# Verify
Get-AzStorageBlob -Container "pathkeys" -Context $ctx | Select-Object Name
```

## After Upload - Testing

### 1. Verify Images Load

Test the images with SAS token:

```bash
# The URLs should return 200 OK and image data
curl -I "https://pathctestore.blob.core.windows.net/pathkeys/pr-specialist.png?<YOUR_SAS_TOKEN>"
```

### 2. Test Component

1. Refresh the test page: http://localhost:5173/test-pathkey-card
2. Switch to "Complete" scenario
3. The three sections should now display the actual images instead of placeholder icons

### 3. Verify in Browser DevTools

Open browser DevTools (F12) → Network tab:
- Refresh the page
- Filter by "png" or "Lock"
- Check that the requests return 200 status
- Verify the images load correctly

## Image Specifications

### Recommended Image Specs:

**Career Image (pr-specialist.png):**
- Aspect ratio: 16:9 (landscape)
- Recommended size: 1920×1080 or 1280×720
- Format: PNG with transparency OR JPG
- Shows the professional in action

**Lock Image (Lock_gold_1.png):**
- Aspect ratio: 16:9 (landscape)
- Recommended size: 1920×1080 or 1280×720
- Format: PNG with transparency preferred
- Gold/amber colored lock design

**Key Image (Comm_key.png):**
- Aspect ratio: 16:9 (landscape)
- Recommended size: 1920×1080 or 1280×720
- Format: PNG with transparency preferred
- Communication/Marketing themed key design

### File Size:
- Try to keep each image under 500KB
- Optimize for web (compress without losing quality)
- PNG for graphics with transparency
- JPG for photographic images

## Troubleshooting

### "ContainerNotFound" Error
- **Cause:** Container doesn't exist
- **Fix:** Create the container first using Azure Portal or CLI

### "BlobNotFound" Error
- **Cause:** Image file doesn't exist (current issue)
- **Fix:** Upload the images using one of the methods above

### "Public access is not permitted"
- **Cause:** Trying to access without SAS token
- **Status:** This is CORRECT - the component automatically adds SAS tokens

### Images Still Not Loading After Upload
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** the page (Ctrl+F5)
3. **Check SAS token expiration:** Token expires 2027-11-01
4. **Verify CORS settings** in Azure Storage Account:
   - Azure Portal → Storage Account → Settings → Resource sharing (CORS)
   - Add rule: Allowed origins: `http://localhost:5173,http://localhost:5174`

### CORS Configuration (if needed)

If images load when testing directly but fail in the browser:

```bash
az storage cors add \
  --services b \
  --methods GET HEAD \
  --origins "http://localhost:5173" "http://localhost:5174" "https://yourdomain.com" \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 3600 \
  --account-name pathctestore
```

## Next Steps After Images Are Uploaded

1. ✅ Verify test page displays images correctly
2. Create images for remaining 49 careers
3. Update database with image references
4. Test with real student pathkey data
5. Integrate into Collection page

---

**Storage Account:** pathctestore
**Container:** pathkeys
**SAS Token Expires:** 2027-11-01
**Current Status:** Container exists, images need to be uploaded
