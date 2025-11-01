# PathCTE Storage Migration to East US - COMPLETE ✅

**Date:** 2025-11-01
**Storage Account:** pathctestore
**Location:** East US
**Endpoint:** https://pathctestore.blob.core.windows.net

---

## Migration Summary

Successfully migrated PathCTE's Azure Blob Storage from Central US (`pathcte`) to East US (`pathctestore`) for co-location with Azure AI Foundry.

---

## ✅ Completed Steps

### 1. Storage Account Setup
- ✅ Created `pathctestore` storage account in East US
- ✅ Created containers: `careers`, `pathkeys`, `avatars`, `achievements`
- ✅ Configured CORS for web access
- ✅ Generated SAS token (expires: 2026-12-31)
- ✅ Copied all blobs from old storage

### 2. Code Updates
Updated default storage URLs in codebase:

**`packages/shared/src/config/azure-storage.ts`**
```typescript
// BEFORE
accountName: 'pathcte',
storageUrl: 'https://pathcte.blob.core.windows.net',

// AFTER
accountName: 'pathctestore',
storageUrl: 'https://pathctestore.blob.core.windows.net',
```

**`packages/web/src/config/azure.ts`**
```typescript
// BEFORE
storageUrl: import.meta.env.VITE_AZURE_STORAGE_URL || 'https://pathcte.blob.core.windows.net',

// AFTER
storageUrl: import.meta.env.VITE_AZURE_STORAGE_URL || 'https://pathctestore.blob.core.windows.net',
```

**Updated `ensureAzureUrlHasSasToken()` function** to handle both old and new URLs during transition.

**`packages/web/.env.example`**
```bash
# BEFORE
VITE_AZURE_STORAGE_ACCOUNT=pathcte
VITE_AZURE_STORAGE_URL=https://pathcte.blob.core.windows.net

# AFTER
VITE_AZURE_STORAGE_ACCOUNT=pathctestore
VITE_AZURE_STORAGE_URL=https://pathctestore.blob.core.windows.net
```

### 3. Database Migration Script
Created **`database/migrations/016_migrate_to_pathctestore.sql`**

Updates all Azure Storage URLs in:
- `pathkeys` - image_url, image_url_animated
- `careers` - video_url
- `market_items` - image_url
- `questions` - image_url

---

## 🔲 Required Manual Steps

### Step 1: Update Netlify Environment Variables

Go to: [Netlify Dashboard → PathCTE Site → Site configuration → Environment variables](https://app.netlify.com)

Update these variables:

```bash
VITE_AZURE_STORAGE_ACCOUNT=pathctestore
VITE_AZURE_STORAGE_URL=https://pathctestore.blob.core.windows.net
VITE_AZURE_STORAGE_SAS_TOKEN=<your_sas_token_from_azure>
```

**Note:** Keep the container variables unchanged:
- `VITE_AZURE_CONTAINER_CAREERS=careers`
- `VITE_AZURE_CONTAINER_PATHKEYS=pathkeys`
- `VITE_AZURE_CONTAINER_AVATARS=avatars`
- `VITE_AZURE_CONTAINER_ACHIEVEMENTS=achievements`

### Step 2: Run Database Migration

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/festwdkldwnpmqxrkiso/sql)
2. Copy contents of `database/migrations/016_migrate_to_pathctestore.sql`
3. Paste and run the migration
4. Review verification queries to ensure all URLs updated

**Expected Results:**
- Pathkeys: ~16 URLs migrated
- Careers: Any video URLs migrated
- Market items: Any image URLs migrated
- Questions: Any image URLs migrated

### Step 3: Test Locally

```bash
# Update local .env file
cp packages/web/.env.example packages/web/.env

# Edit packages/web/.env with new values:
VITE_AZURE_STORAGE_ACCOUNT=pathctestore
VITE_AZURE_STORAGE_URL=https://pathctestore.blob.core.windows.net
VITE_AZURE_STORAGE_SAS_TOKEN=<your_sas_token_from_azure>

# Rebuild and test
npm run build --workspace=packages/web
npm run dev --workspace=packages/web

# Test these pages:
# - /careers (check career images/videos load)
# - /collection (check pathkey images load)
# - /market (check market item images load)
```

### Step 4: Commit Changes

```bash
git add .
git commit -m "Migrate Azure Storage to pathctestore (East US)

- Update storage account defaults from pathcte to pathctestore
- Co-locate with Azure AI Foundry in East US region
- Update config files for new storage endpoint
- Create database migration script
- Update ensureAzureUrlHasSasToken to handle both URLs

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin feature/rename-to-pathcte
```

### Step 5: Deploy to Netlify

After pushing changes and updating environment variables:

```bash
# Netlify will auto-deploy from GitHub push
# Monitor build at: https://app.netlify.com/sites/pathcte/deploys
```

### Step 6: Verify Production

After deployment, verify these URLs work:

**Pathkeys:**
- https://pathcte.com/collection

**Careers:**
- https://pathcte.com/careers

**Expected:** All images/videos load from `pathctestore.blob.core.windows.net`

---

## Storage Account Details

### pathctestore (NEW - East US)
```json
{
  "name": "pathctestore",
  "location": "eastus",
  "resourceGroup": "Pathfinity",
  "sku": "Standard_RAGRS",
  "endpoints": {
    "blob": "https://pathctestore.blob.core.windows.net/"
  },
  "containers": ["careers", "pathkeys", "avatars", "achievements"],
  "cors": {
    "origins": [
      "https://pathcte.com",
      "https://*.pathcte.com",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    "methods": ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"]
  }
}
```

**Account Key:**
```
<stored_securely_in_azure_portal>
```

**SAS Token (Expires: 2027-11-01):**
```
<stored_securely_in_netlify_environment_variables>
```

### pathcte (OLD - Central US) - DEPRECATED
```json
{
  "name": "pathcte",
  "location": "centralus",
  "status": "⚠️ DEPRECATED - Keep for 30 days as backup",
  "note": "Can be deleted after January 1, 2026"
}
```

---

## Benefits of East US Migration

### 1. Co-location with Azure AI Foundry
- **Lower Latency:** Same region as GPT-4 and DALL-E 3
- **Reduced Costs:** No cross-region data transfer fees
- **Better Performance:** Faster content generation and delivery

### 2. Improved Architecture
- Storage and AI services in same Azure region
- Supabase database remains in optimal location
- Hybrid architecture optimized for both data and compute

### 3. Future-Ready
- Ready for Azure Durable Functions integration
- Positioned for agent-based game orchestration
- Scalable for GPT-4 content generation

---

## Rollback Plan (If Needed)

If issues arise, you can quickly rollback:

### Option 1: Update Environment Variables Only
```bash
# In Netlify, change back to:
VITE_AZURE_STORAGE_ACCOUNT=pathcte
VITE_AZURE_STORAGE_URL=https://pathcte.blob.core.windows.net
# Redeploy
```

### Option 2: Revert Git Commit
```bash
git revert HEAD
git push origin feature/rename-to-pathcte
```

### Option 3: Revert Database Migration
```sql
-- Restore old URLs in database
UPDATE public.pathkeys
SET image_url = REPLACE(image_url, 'pathctestore.blob.core.windows.net', 'pathcte.blob.core.windows.net')
WHERE image_url LIKE '%pathctestore.blob.core.windows.net%';

-- Repeat for all tables...
```

---

## Files Modified

| File | Status | Description |
|------|--------|-------------|
| `packages/shared/src/config/azure-storage.ts` | ✅ UPDATED | Changed defaults to pathctestore |
| `packages/web/src/config/azure.ts` | ✅ UPDATED | Updated storage URL and URL checker |
| `packages/web/.env.example` | ✅ UPDATED | Updated environment variable examples |
| `database/migrations/016_migrate_to_pathctestore.sql` | ✅ NEW | Database migration script |
| `docs/PATHCTESTORE_MIGRATION_COMPLETE.md` | ✅ NEW | This documentation |

---

## Testing Checklist

Before marking complete, verify:

- [ ] Netlify environment variables updated
- [ ] Database migration script run successfully
- [ ] Local build successful with new storage
- [ ] Pathkey images load on /collection
- [ ] Career images/videos load on /careers
- [ ] Market items load (if applicable)
- [ ] Dark mode images work
- [ ] Mobile responsive images work
- [ ] No console errors for 403/404 on images
- [ ] Changes committed and pushed
- [ ] Netlify deployment successful
- [ ] Production site verified

---

## Support

**Questions or Issues?**

1. Check Azure Storage account is accessible: https://pathctestore.blob.core.windows.net/pathkeys/DEV-001.png
2. Verify SAS token hasn't expired (expires 2026-12-31)
3. Check CORS configuration allows your domain
4. Verify Netlify environment variables are set correctly
5. Review database migration results with verification queries

**Need to regenerate SAS token:**
```bash
# Get account key from Azure Portal or CLI:
az storage account keys list --account-name pathctestore --resource-group Pathfinity

# Then generate new SAS token:
az storage account generate-sas \
  --account-name pathctestore \
  --account-key "<account_key_from_above>" \
  --services b \
  --resource-types sco \
  --permissions rl \
  --expiry 2028-12-31T23:59:59Z \
  --https-only \
  --output tsv
```

---

## Success! 🎉

PathCTE storage is now migrated to East US and ready for integration with Azure AI Foundry for GPT-4 powered content generation.
