# Azure Functions Quick Reference Card

## URLs

| Environment | URL |
|-------------|-----|
| **Consumption** | https://pathcte-functions.azurewebsites.net |
| **Premium** | https://pathcte-functions-premium.azurewebsites.net |

## Common Issues & Quick Fixes

### 🔴 Functions return 404

```bash
# Fix: Remove WEBSITE_RUN_FROM_PACKAGE
az functionapp config appsettings delete \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --setting-names WEBSITE_RUN_FROM_PACKAGE

az functionapp restart --resource-group Pathfinity --name pathcte-functions-premium
```

### 🔴 0 Functions Found

```bash
# Fix: Enable Worker Indexing
az functionapp config appsettings set \
  --resource-group Pathfinity \
  --name <app-name> \
  --settings "AzureWebJobsFeatureFlags=EnableWorkerIndexing"
```

### 🔴 Always On Warning (Premium)

```bash
# Fix: Disable Always On
az webapp config set \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --always-on false
```

### 🔴 Lock Conflicts Between Apps

```bash
# Fix: Set separate hub for Premium
az functionapp config appsettings set \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --settings "AzureFunctionsJobHost__extensions__durableTask__hubName=PathCTEGameHubPremium"
```

## Deployment

### Deploy to Premium (Recommended)

```bash
cd packages/functions
./deploy-premium.sh
```

### Deploy to Consumption

```bash
cd packages/functions
func azure functionapp publish pathcte-functions
```

## Rollback to Consumption

**In Netlify Dashboard:**
```
VITE_AZURE_FUNCTIONS_URL=https://pathcte-functions.azurewebsites.net
```

Then trigger redeploy.

## Verification

```bash
# Test endpoint
curl -X POST https://<app-name>.azurewebsites.net/api/game/initialize \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","pathkeyId":"pk","players":[],"questionSetId":"qs"}'

# Expected: {"success":false,"error":"Missing required fields"} (HTTP 400)
# This means the function is working!

# List all functions (should show 18)
func azure functionapp list-functions <app-name>

# Check for problematic settings
az functionapp config appsettings list \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --query "[?name=='WEBSITE_RUN_FROM_PACKAGE']"

# Should return empty! If it shows a value, delete it.
```

## Critical Configuration Differences

| Setting | Consumption | Premium |
|---------|-------------|---------|
| Hub Name | PathCTEGameHub | PathCTEGameHubPremium |
| Always On | N/A | **Must be false** |
| WEBSITE_RUN_FROM_PACKAGE | OK | **Must NOT exist** |
| WEBSITE_CONTENTSHARE | Not needed | Required |
| Host ID | Auto | pathcte-functions-premium |

## Restore Settings from Backup

```bash
# Find latest backup
ls -lt docs/*settings-backup*.json | head -1

# Restore (after deleting app and recreating, or fixing corruption)
az functionapp config appsettings set \
  --resource-group Pathfinity \
  --name <app-name> \
  --settings @docs/premium-settings-backup-YYYYMMDD.json
```

## Monitor Logs

```bash
# Stream live logs
az webapp log tail --resource-group Pathfinity --name <app-name>

# Or view in Azure Portal:
# Resource Group > Pathfinity > <app-name> > Log stream
```

## Key Files

- **Deployment Script**: `packages/functions/deploy-premium.sh`
- **Full Guide**: `docs/AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md`
- **Settings Backups**: `docs/*settings-backup*.json`
- **Entry Point**: `packages/functions/dist/index.js`
- **Configuration**: `packages/functions/host.json`

## When Things Go Wrong

1. **Check settings** - Ensure no WEBSITE_RUN_FROM_PACKAGE on Premium
2. **Check Always On** - Must be false on Premium
3. **Check logs** - `az webapp log tail`
4. **Verify deployment** - `func azure functionapp list-functions`
5. **Test endpoint** - curl test (should return 400 validation error)
6. **Check hub separation** - Verify separate storage tables exist
7. **Rollback if needed** - Switch Netlify back to Consumption

## Emergency: Complete Reset of Premium

```bash
# 1. Switch Netlify to Consumption
# 2. Delete Premium app
az functionapp delete --resource-group Pathfinity --name pathcte-functions-premium

# 3. Recreate
az functionapp create \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --plan pathcte-premium-plan \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --storage-account pathctestore

# 4. Restore settings from backup
az functionapp config appsettings set \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --settings @docs/premium-settings-backup-YYYYMMDD.json

# 5. Disable Always On
az webapp config set \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --always-on false

# 6. Deploy
cd packages/functions && ./deploy-premium.sh
```

---

**For detailed information, see**: `docs/AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md`
