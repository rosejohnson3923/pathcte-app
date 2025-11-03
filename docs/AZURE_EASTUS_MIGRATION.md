# Azure Storage Migration: Central US → East US

**Date:** 2025-10-31
**Objective:** Co-locate all PathCTE Azure resources in East US for optimal performance

## Why East US?

- Azure AI Foundry (Pathfinity-AI-Foundry) is already in East US
- Lower latency between all services
- Simplified networking and architecture
- Better performance for real-time game features

## Current State

**Existing Storage (Central US):**
- Account: `pathcte`
- Location: Central US
- Endpoint: `https://pathcte.blob.core.windows.net`
- Containers: careers, pathkeys, avatars, achievements

**Target State (East US):**
- Account: `pathcteeastus` (new)
- Location: East US
- Endpoint: `https://pathcteeastus.blob.core.windows.net`
- Containers: careers, pathkeys, avatars, achievements

## Migration Steps

### Step 1: Create New Storage Account in East US

```bash
# Create new storage account in East US (same region as AI Foundry)
az storage account create \
  --name pathcteeastus \
  --resource-group Pathfinity \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2 \
  --access-tier Hot \
  --enable-hierarchical-namespace false \
  --https-only true \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false

# Enable CORS for web access (if needed)
az storage cors add \
  --services b \
  --methods GET HEAD POST PUT DELETE OPTIONS \
  --origins https://pathcte.com https://*.pathcte.com http://localhost:5173 \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 3600 \
  --account-name pathcteeastus

# Create containers
az storage container create --name careers --account-name pathcteeastus --public-access off
az storage container create --name pathkeys --account-name pathcteeastus --public-access off
az storage container create --name avatars --account-name pathcteeastus --public-access off
az storage container create --name achievements --account-name pathcteeastus --public-access off
```

### Step 2: Generate SAS Token for New Storage Account

```bash
# Generate SAS token with read permissions (1 year expiry)
az storage account generate-sas \
  --account-name pathcteeastus \
  --services b \
  --resource-types sco \
  --permissions rl \
  --expiry 2026-12-31T23:59:59Z \
  --https-only \
  --output tsv

# Save this token as VITE_AZURE_STORAGE_SAS_TOKEN in your .env file
```

### Step 3: Copy Existing Blobs (if any exist)

If you have existing assets in Central US that need to be preserved:

```bash
# Get source storage account key
SOURCE_KEY=$(az storage account keys list \
  --account-name pathcte \
  --resource-group Pathfinity \
  --query '[0].value' \
  --output tsv)

# Get destination storage account key
DEST_KEY=$(az storage account keys list \
  --account-name pathcteeastus \
  --resource-group Pathfinity \
  --query '[0].value' \
  --output tsv)

# Copy each container
for CONTAINER in careers pathkeys avatars achievements; do
  echo "Copying $CONTAINER..."
  az storage blob copy start-batch \
    --source-account-name pathcte \
    --source-account-key "$SOURCE_KEY" \
    --source-container $CONTAINER \
    --destination-container $CONTAINER \
    --account-name pathcteeastus \
    --account-key "$DEST_KEY"
done

# Check copy status
az storage blob list \
  --container-name pathkeys \
  --account-name pathcteeastus \
  --account-key "$DEST_KEY" \
  --query "[].{name:name, copyStatus:properties.copy.status}"
```

### Step 4: Update Environment Variables

**Local Development (.env files):**

```bash
# packages/web/.env.local
VITE_AZURE_STORAGE_URL=https://pathcteeastus.blob.core.windows.net
VITE_AZURE_STORAGE_SAS_TOKEN=<NEW_SAS_TOKEN>
VITE_AZURE_STORAGE_ACCOUNT=pathcteeastus
VITE_AZURE_CONTAINER_PATHKEYS=pathkeys
VITE_AZURE_CONTAINER_CAREERS=careers
VITE_AZURE_CONTAINER_AVATARS=avatars
VITE_AZURE_CONTAINER_ACHIEVEMENTS=achievements
```

**Netlify (Production):**

```bash
# Update via Netlify CLI or Dashboard
netlify env:set VITE_AZURE_STORAGE_URL "https://pathcteeastus.blob.core.windows.net"
netlify env:set VITE_AZURE_STORAGE_SAS_TOKEN "<NEW_SAS_TOKEN>"
netlify env:set VITE_AZURE_STORAGE_ACCOUNT "pathcteeastus"
```

Or via Netlify Dashboard:
- Go to Site settings → Environment variables
- Update all VITE_AZURE_* variables

### Step 5: Update Code References

**Files to Update:**

1. `/packages/shared/src/config/azure-storage.ts`
```typescript
export const getAzureStorageConfig = (): AzureStorageConfig => {
  const config: AzureStorageConfig = {
    accountName: getViteEnv('VITE_AZURE_STORAGE_ACCOUNT') || 'pathcteeastus', // CHANGED
    storageUrl: getViteEnv('VITE_AZURE_STORAGE_URL') || 'https://pathcteeastus.blob.core.windows.net', // CHANGED
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
```

2. `/packages/web/src/config/azure.ts`
```typescript
export const AZURE_CONFIG = {
  storageUrl: import.meta.env.VITE_AZURE_STORAGE_URL || 'https://pathcteeastus.blob.core.windows.net', // CHANGED
  sasToken: import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN || '',
  containers: {
    pathkeys: import.meta.env.VITE_AZURE_CONTAINER_PATHKEYS || 'pathkeys',
    careers: import.meta.env.VITE_AZURE_CONTAINER_CAREERS || 'careers',
    avatars: import.meta.env.VITE_AZURE_CONTAINER_AVATARS || 'avatars',
    achievements: import.meta.env.VITE_AZURE_CONTAINER_ACHIEVEMENTS || 'achievements',
  },
};
```

3. Update `ensureAzureUrlHasSasToken` function:
```typescript
export const ensureAzureUrlHasSasToken = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;

  // If it's not an Azure Storage URL, return as-is
  if (!imageUrl.includes('.blob.core.windows.net')) { // CHANGED - more generic check
    return imageUrl;
  }

  // Rest of function remains the same...
};
```

### Step 6: Update Database URLs (if any hardcoded URLs exist)

```sql
-- Check for any hardcoded Central US URLs in database
SELECT id, name, image_url
FROM pathkeys
WHERE image_url LIKE '%pathcte.blob.core.windows.net%';

SELECT id, title, image_url
FROM careers
WHERE image_url LIKE '%pathcte.blob.core.windows.net%';

-- If found, update them (run AFTER new storage is populated)
UPDATE pathkeys
SET image_url = REPLACE(image_url, 'pathcte.blob.core.windows.net', 'pathcteeastus.blob.core.windows.net')
WHERE image_url LIKE '%pathcte.blob.core.windows.net%';

UPDATE careers
SET image_url = REPLACE(image_url, 'pathcte.blob.core.windows.net', 'pathcteeastus.blob.core.windows.net')
WHERE image_url LIKE '%pathcte.blob.core.windows.net%';
```

### Step 7: Test New Storage

```bash
# Test from command line
curl "https://pathcteeastus.blob.core.windows.net/pathkeys/pathCTE_ArtsCommunicationsAndMediaPathkey.svg?<SAS_TOKEN>"

# Test in browser (use test-azure-url.mjs script)
node test-azure-url.mjs
```

### Step 8: Deploy Azure Functions to East US

```bash
# Create Azure Function App in East US
az functionapp create \
  --resource-group Pathfinity \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name pathcte-game-functions \
  --storage-account pathcteeastus \
  --assign-identity '[system]'

# Configure Function App settings
az functionapp config appsettings set \
  --name pathcte-game-functions \
  --resource-group Pathfinity \
  --settings \
    SUPABASE_URL="<your-supabase-url>" \
    SUPABASE_SERVICE_KEY="<your-service-key>" \
    AZURE_STORAGE_CONNECTION_STRING="<connection-string>" \
    AzureWebJobsStorage="<connection-string>" \
    AZURE_OPENAI_ENDPOINT="https://pathfinity-ai-foundry.openai.azure.com/" \
    AZURE_OPENAI_API_KEY="<your-key>"
```

### Step 9: Cleanup (After Verification)

**ONLY after confirming everything works with East US storage:**

```bash
# Delete old Central US storage account
az storage account delete \
  --name pathcte \
  --resource-group Pathfinity \
  --yes

# Or keep it for backup/historical purposes (charges will still apply)
```

## Updated Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│         AZURE PATHFINITY RESOURCE GROUP                 │
│                   EAST US (SINGLE REGION)               │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Azure AI Foundry                                  │ │
│  │  (Pathfinity-AI-Foundry)                          │ │
│  │  - GPT-4 Content Generation                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Azure Functions                                   │ │
│  │  (pathcte-game-functions)                         │ │
│  │  - Game Session Orchestrator                       │ │
│  │  - Host Entity (timer authority)                   │ │
│  │  - Player Entities (answer processing)             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Azure Storage                                     │ │
│  │  (pathcteeastus)                                  │ │
│  │  - Durable function state                          │ │
│  │  - Static assets (pathkeys, careers, etc.)        │ │
│  │  - Containers: careers, pathkeys, avatars,         │ │
│  │    achievements                                     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

All services co-located in East US for:
✅ Lowest latency
✅ Simplified networking
✅ Better performance
✅ Easier management
```

## Verification Checklist

- [ ] New storage account created in East US
- [ ] Containers created (careers, pathkeys, avatars, achievements)
- [ ] SAS token generated and saved
- [ ] Existing blobs copied (if any)
- [ ] Local .env files updated
- [ ] Netlify environment variables updated
- [ ] Code default values updated
- [ ] Database URLs updated (if applicable)
- [ ] Test asset loading in browser
- [ ] Deploy and test on pathcte.com
- [ ] Azure Functions app created in East US
- [ ] Function app settings configured
- [ ] Old storage account deleted or archived

## Rollback Plan

If issues arise:

1. Revert environment variables to old Central US URLs
2. Keep old `pathcte` storage account until fully verified
3. Code defaults can be updated via environment variables without code changes

## Cost Comparison

**Before (Multi-region):**
- Storage in Central US
- AI Foundry in East US
- Cross-region data transfer charges
- **Estimated:** $15-20/month

**After (Single region):**
- All services in East US
- No cross-region charges
- **Estimated:** $10-15/month

**Savings:** ~$5/month + better performance

## Timeline

- **Step 1-2** (Create storage & SAS): 15 minutes
- **Step 3** (Copy blobs): 5-10 minutes (depending on data size)
- **Step 4-5** (Update configs): 10 minutes
- **Step 6-7** (Database & testing): 15 minutes
- **Step 8** (Deploy functions): 10 minutes
- **Step 9** (Cleanup): 5 minutes

**Total:** ~1 hour for complete migration
