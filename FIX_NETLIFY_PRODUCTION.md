# 🚨 URGENT: Fix Netlify Production Variables

## Problem Identified
Your Netlify **Production** environment variables are still pointing to the **OLD** storage account `pathcte` instead of the **NEW** `pathctestore` storage account.

## Current (WRONG) Values in Production:
- ❌ `VITE_AZURE_STORAGE_ACCOUNT` = `pathcte`
- ❌ `VITE_AZURE_STORAGE_URL` = `https://pathcte.blob.core.windows.net`

## Required Changes

### Go to Netlify Dashboard:
1. https://app.netlify.com
2. Select your PathCTE site
3. Go to: **Site settings** → **Environment variables**

### Update These TWO Variables for Production:

#### 1. VITE_AZURE_STORAGE_ACCOUNT
- Click the **edit icon** (pencil) next to `VITE_AZURE_STORAGE_ACCOUNT`
- Change Production value from: `pathcte`
- Change to: **`pathctestore`**
- Click **Save**

#### 2. VITE_AZURE_STORAGE_URL
- Click the **edit icon** (pencil) next to `VITE_AZURE_STORAGE_URL`
- Change Production value from: `https://pathcte.blob.core.windows.net`
- Change to: **`https://pathctestore.blob.core.windows.net`**
- Click **Save**

### 3. Trigger Redeploy
After updating both variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete (~2-3 minutes)

## Why This Fixes The Issue

Your database has the correct URLs (pointing to `pathctestore`), but when the app tries to append the SAS token using the configuration, it's using:
- `VITE_AZURE_STORAGE_URL` to build the base URL
- This is currently `https://pathcte.blob.core.windows.net` (old account)
- It needs to be `https://pathctestore.blob.core.windows.net` (new account)

The old `pathcte` storage account no longer has the files (or might not even exist), so images fail to load.

## Verification After Deploy

1. Visit: https://pathcte.com
2. Open browser DevTools (F12) → **Network** tab
3. Look for image requests
4. They should point to: `https://pathctestore.blob.core.windows.net/...`
5. Images should now load! ✅

## Quick Reference

**Old Storage (WRONG):** `pathcte.blob.core.windows.net`
**New Storage (CORRECT):** `pathctestore.blob.core.windows.net`
