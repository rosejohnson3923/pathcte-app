# 🚨 NETLIFY ENVIRONMENT VARIABLES UPDATE REQUIRED

## Issue
Pathkeys and career images are not showing in production because Netlify environment variables need to be updated to point to the new `pathctestore` storage account.

## Root Cause
After migrating to East US (`pathctestore`), the Netlify deployment still has environment variables pointing to the old storage account or has an outdated/missing SAS token.

## Solution: Update Netlify Environment Variables

### Step 1: Login to Netlify
Go to: https://app.netlify.com

### Step 2: Navigate to Site Settings
1. Select your PathCTE site
2. Go to **Site settings** → **Environment variables**

### Step 3: Update These Variables

Set or update the following environment variables:

```bash
VITE_AZURE_STORAGE_ACCOUNT=pathctestore
VITE_AZURE_STORAGE_URL=https://pathctestore.blob.core.windows.net
VITE_AZURE_STORAGE_SAS_TOKEN=sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-11-01T05:00:00Z&st=2025-11-01T05:00:00Z&spr=https&sig=USDathlTZTiflOYmy2fsnpnpE45NG1vkSsy1U43qdNE%3D

VITE_AZURE_CONTAINER_CAREERS=careers
VITE_AZURE_CONTAINER_PATHKEYS=pathkeys
VITE_AZURE_CONTAINER_AVATARS=avatars
VITE_AZURE_CONTAINER_ACHIEVEMENTS=achievements
```

### Step 4: Redeploy
After updating environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

## Verification

After redeployment, verify images are loading:

1. Visit: https://pathcte.com
2. Check that pathkey images are visible
3. Check that career images/videos are visible
4. Open browser DevTools (F12) → Network tab
5. Verify image URLs point to `pathctestore.blob.core.windows.net`

### Test URLs (should work in browser after SAS token is appended):
```
https://pathctestore.blob.core.windows.net/pathkeys/DEV-001.png
https://pathctestore.blob.core.windows.net/careers/3D%20Artist.png
```

## Alternative: Use Netlify CLI

If you have Netlify CLI installed:

```bash
netlify env:set VITE_AZURE_STORAGE_ACCOUNT "pathctestore"
netlify env:set VITE_AZURE_STORAGE_URL "https://pathctestore.blob.core.windows.net"
netlify env:set VITE_AZURE_STORAGE_SAS_TOKEN "sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-11-01T05:00:00Z&st=2025-11-01T05:00:00Z&spr=https&sig=USDathlTZTiflOYmy2fsnpnpE45NG1vkSsy1U43qdNE%3D"

# Trigger rebuild
netlify deploy --prod
```

## What Was Already Done ✅
- ✅ Database URLs updated to `pathctestore.blob.core.windows.net`
- ✅ Code defaults updated to `pathctestore`
- ✅ Blobs migrated to `pathctestore` storage account
- ✅ SAS token generated and tested (working)

## What's Missing ❌
- ❌ Netlify environment variables not updated
- ❌ Production deployment using old storage account reference

## Notes
- The SAS token expires on **2027-11-01** (valid for ~2 years)
- Storage account is in **East US** region
- All blobs have been successfully migrated to `pathctestore`
- CORS is properly configured on the new storage account
