# Azure Functions Deployment & Troubleshooting Guide

## Overview

PathCTE uses Azure Durable Functions for game orchestration. This guide covers both Consumption and Premium plan deployments, their differences, and troubleshooting procedures.

## Table of Contents

- [Deployment Comparison](#deployment-comparison)
- [Consumption Plan Setup](#consumption-plan-setup)
- [Premium Plan Setup](#premium-plan-setup)
- [Configuration Differences](#configuration-differences)
- [Known Issues & Solutions](#known-issues--solutions)
- [Deployment Procedures](#deployment-procedures)
- [Rollback Procedures](#rollback-procedures)
- [Verification & Testing](#verification--testing)
- [Monitoring](#monitoring)

---

## Deployment Comparison

| Feature | Consumption Plan | Premium Plan (EP1) |
|---------|------------------|-------------------|
| **Name** | pathcte-functions | pathcte-functions-premium |
| **URL** | pathcte-functions.azurewebsites.net | pathcte-functions-premium.azurewebsites.net |
| **Cost** | Pay-per-execution (~$5-20/mo) | Fixed ~$146/month |
| **Cold Start** | 90-120 seconds | <1 second (pre-warmed) |
| **Always On** | Not available | Must be DISABLED |
| **Hub Name** | PathCTEGameHub | PathCTEGameHubPremium |
| **Host ID** | (auto-generated) | pathcte-functions-premium |
| **Use Case** | Development/Testing | Production |

---

## Consumption Plan Setup

### Resource Details
```
Name: pathcte-functions
Resource Group: Pathfinity
Region: East US
Runtime: Node.js 20
Plan: Consumption (Y1)
```

### App Settings
```bash
FUNCTIONS_WORKER_RUNTIME=node
FUNCTIONS_EXTENSION_VERSION=~4
AzureWebJobsStorage=<pathctestore-connection-string>
APPLICATIONINSIGHTS_CONNECTION_STRING=<app-insights-connection>
SUPABASE_URL=https://festwdkldwnpmqxrkiso.supabase.co
SUPABASE_SERVICE_KEY=<supabase-service-key>
AzureWebJobsFeatureFlags=EnableWorkerIndexing
```

### Deployment Command
```bash
cd /mnt/c/Users/rosej/Documents/Projects/pathcte.app/packages/functions
func azure functionapp publish pathcte-functions
```

### Durable Functions Hub
- **Hub Name**: `PathCTEGameHub` (from host.json)
- **Storage Tables**:
  - PathCTEGameHubHistory
  - PathCTEGameHubInstances
  - PathCTEGameHubPartitions
- **Lock Blob**: `azure-webjobs-hosts/locks/pathcte-functions/host`

---

## Premium Plan Setup

### Resource Details
```
Name: pathcte-functions-premium
Resource Group: Pathfinity
Region: East US
Runtime: Node.js 20
Plan: pathcte-premium-plan (EP1)
SKU: ElasticPremium
Instances: 1-10 (auto-scale)
```

### App Settings
```bash
FUNCTIONS_WORKER_RUNTIME=node
FUNCTIONS_EXTENSION_VERSION=~4
AzureWebJobsStorage=<pathctestore-connection-string>
WEBSITE_CONTENTAZUREFILECONNECTIONSTRING=<pathctestore-connection-string>
WEBSITE_CONTENTSHARE=pathcte-functions-premiumd8eb927ba13d
APPLICATIONINSIGHTS_CONNECTION_STRING=<app-insights-connection>
SUPABASE_URL=https://festwdkldwnpmqxrkiso.supabase.co
SUPABASE_SERVICE_KEY=<supabase-service-key>
AzureWebJobsFeatureFlags=EnableWorkerIndexing
WEBSITE_MOUNT_ENABLED=1
AzureFunctionsJobHost__id=pathcte-functions-premium
AzureFunctionsJobHost__extensions__durableTask__hubName=PathCTEGameHubPremium
```

### CRITICAL: Always On Must Be Disabled
```bash
az webapp config set \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --always-on false
```

**Why**: Premium plans use pre-warmed instances. Always On conflicts with this and prevents functions from working.

### Deployment Command
```bash
cd /mnt/c/Users/rosej/Documents/Projects/pathcte.app/packages/functions
./deploy-premium.sh
```

Or manually:
```bash
func azure functionapp publish pathcte-functions-premium

# CRITICAL: Remove WEBSITE_RUN_FROM_PACKAGE after deployment
az functionapp config appsettings delete \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --setting-names WEBSITE_RUN_FROM_PACKAGE

az functionapp restart \
  --resource-group Pathfinity \
  --name pathcte-functions-premium
```

### Durable Functions Hub
- **Hub Name**: `PathCTEGameHubPremium` (overridden via app setting)
- **Storage Tables**:
  - PathCTEGameHubPremiumHistory
  - PathCTEGameHubPremiumInstances
  - PathCTEGameHubPremiumPartitions
- **Lock Blob**: `azure-webjobs-hosts/locks/pathcte-functions-premium/host`

---

## Configuration Differences

### 1. Durable Functions Hub Separation

**Why Needed**: Both apps use the same Azure Storage account. Without separate hubs, they compete for the same storage locks, causing conflicts.

**Implementation**:
- Consumption: Uses `PathCTEGameHub` from host.json
- Premium: Overrides to `PathCTEGameHubPremium` via app setting

**App Setting Override**:
```bash
AzureFunctionsJobHost__extensions__durableTask__hubName=PathCTEGameHubPremium
```

This creates separate:
- Storage tables for orchestration state
- Lock blobs for coordination
- Instance tracking

### 2. Host ID Configuration

**Why Needed**: Distinguishes instances in Application Insights and storage locks.

**Implementation**:
```bash
# Premium only (Consumption auto-generates)
AzureFunctionsJobHost__id=pathcte-functions-premium
```

### 3. File Share Configuration

**Why Needed**: Premium plans require persistent storage for function files.

**Implementation** (Premium only):
```bash
WEBSITE_CONTENTAZUREFILECONNECTIONSTRING=<storage-connection>
WEBSITE_CONTENTSHARE=pathcte-functions-premiumd8eb927ba13d
WEBSITE_MOUNT_ENABLED=1
```

### 4. Package Mode vs File Mode

**Consumption**: Can use `WEBSITE_RUN_FROM_PACKAGE` (read-only, faster cold starts)
**Premium**: Must NOT use `WEBSITE_RUN_FROM_PACKAGE` (causes 404 errors)

---

## Known Issues & Solutions

### Issue 1: Functions Return 404 After Deployment

**Symptoms**:
- `func azure functionapp list-functions` shows all functions
- All HTTP requests return 404
- No requests appear in logs

**Root Cause**: `WEBSITE_RUN_FROM_PACKAGE` setting puts app in read-only mode

**Solution**:
```bash
az functionapp config appsettings delete \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --setting-names WEBSITE_RUN_FROM_PACKAGE

az functionapp restart \
  --resource-group Pathfinity \
  --name pathcte-functions-premium
```

**Prevention**: Use `deploy-premium.sh` script which handles this automatically

### Issue 2: "0 Functions Found" After Deployment

**Symptoms**:
- Functions don't appear in Azure Portal
- List functions shows empty
- Logs show "0 functions found"

**Possible Causes**:

#### A. Missing Worker Indexing Flag
**Solution**:
```bash
az functionapp config appsettings set \
  --resource-group Pathfinity \
  --name <function-app-name> \
  --settings "AzureWebJobsFeatureFlags=EnableWorkerIndexing"
```

#### B. Files Not Deployed to wwwroot
**Check**:
```bash
# List files on consumption plan (Linux)
# Files should be in /home/site/wwwroot/dist/
```

**Solution**: Verify package.json `main` field points to correct entry:
```json
{
  "main": "dist/index.js"
}
```

#### C. Incorrect Entry Point
**Check**: Ensure `dist/index.js` imports all HTTP triggers:
```javascript
// dist/index.js must import HTTP triggers as side effects
require("./http/submitAnswer");
require("./http/startQuestion");
// etc...
```

### Issue 3: Always On Enabled on Premium Plan

**Symptoms**:
- Functions discovered but not working
- Azure Portal shows warning about Always On

**Diagnostic**:
```
"We detected that your function app is running on Premium plan (ElasticPremium).
Please make sure you have disabled the Always on setting."
```

**Solution**:
```bash
az webapp config set \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --always-on false

az functionapp restart \
  --resource-group Pathfinity \
  --name pathcte-functions-premium
```

### Issue 4: Lock Conflicts Between Consumption and Premium

**Symptoms**:
- Premium logs show references to `pathcte-functions` lock blob
- Functions behave unpredictably
- Orchestrations fail randomly

**Root Cause**: Both apps using same Durable Functions hub name

**Solution**: Set separate hub name for Premium (see Configuration Differences #1)

**Verification**:
```bash
# Check storage for separate hubs
az storage table list \
  --account-name pathctestore \
  --account-key <key> \
  --query "[?contains(name, 'PathCTE')].name"

# Should show:
# - PathCTEGameHubHistory
# - PathCTEGameHubInstances
# - PathCTEGameHubPartitions
# - PathCTEGameHubPremiumHistory
# - PathCTEGameHubPremiumInstances
# - PathCTEGameHubPremiumPartitions
```

### Issue 5: Remote Build Fails or Files Missing

**Symptoms**:
- Deployment succeeds but files not in wwwroot
- Only host.json present
- Build errors during remote build

**Solution**: Use local build + ZIP deployment instead:
```bash
# Build locally first
npm run build

# Deploy without remote build
func azure functionapp publish <app-name>
# (no --build remote flag)
```

### Issue 6: Application Settings Accidentally Deleted

**Symptoms**:
- Functions stop working after configuration change
- Missing environment variables

**Prevention**: Always backup settings before changes:
```bash
az functionapp config appsettings list \
  --resource-group Pathfinity \
  --name <app-name> \
  > backup-settings-$(date +%Y%m%d-%H%M%S).json
```

**Recovery**: Use consumption-settings.json or backup to restore:
```bash
# Restore all settings (adjust values as needed)
az functionapp config appsettings set \
  --resource-group Pathfinity \
  --name <app-name> \
  --settings @backup-settings.json
```

---

## Deployment Procedures

### Deploy to Consumption Plan

```bash
# 1. Navigate to functions directory
cd /mnt/c/Users/rosej/Documents/Projects/pathcte.app/packages/functions

# 2. Build locally
npm run build

# 3. Deploy
func azure functionapp publish pathcte-functions

# 4. Verify
curl https://pathcte-functions.azurewebsites.net/api/game/initialize
```

### Deploy to Premium Plan

```bash
# 1. Navigate to functions directory
cd /mnt/c/Users/rosej/Documents/Projects/pathcte.app/packages/functions

# 2. Build locally
npm run build

# 3. Deploy using script (handles WEBSITE_RUN_FROM_PACKAGE cleanup)
./deploy-premium.sh

# OR deploy manually:
func azure functionapp publish pathcte-functions-premium

az functionapp config appsettings delete \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --setting-names WEBSITE_RUN_FROM_PACKAGE

az functionapp restart \
  --resource-group Pathfinity \
  --name pathcte-functions-premium

# 4. Verify
curl https://pathcte-functions-premium.azurewebsites.net/api/game/initialize
```

---

## Rollback Procedures

### Quick Rollback (Netlify Only)

**Scenario**: Premium has issues, need immediate rollback

**Steps**:
1. Update Netlify environment variable:
   ```
   VITE_AZURE_FUNCTIONS_URL=https://pathcte-functions.azurewebsites.net
   ```

2. Trigger Netlify redeploy (or wait for automatic deploy)

3. Verify site is using Consumption plan

**Downtime**: ~2-3 minutes (Netlify build time)

### Full Rollback (If Premium Plan Needs Fixing)

**Scenario**: Premium plan has configuration issues requiring extensive debugging

**Steps**:
1. Switch Netlify to Consumption (see above)

2. Stop Premium plan to prevent resource usage:
   ```bash
   az functionapp stop \
     --resource-group Pathfinity \
     --name pathcte-functions-premium
   ```

3. Debug Premium configuration offline

4. Restart when ready:
   ```bash
   az functionapp start \
     --resource-group Pathfinity \
     --name pathcte-functions-premium
   ```

### Redeploy from Scratch

**Scenario**: Premium plan is completely broken, need clean slate

**Steps**:
1. Switch Netlify to Consumption

2. Delete Premium function app (keeps plan):
   ```bash
   az functionapp delete \
     --resource-group Pathfinity \
     --name pathcte-functions-premium
   ```

3. Recreate function app:
   ```bash
   az functionapp create \
     --resource-group Pathfinity \
     --name pathcte-functions-premium \
     --plan pathcte-premium-plan \
     --runtime node \
     --runtime-version 20 \
     --functions-version 4 \
     --storage-account pathctestore
   ```

4. Apply all app settings (see Premium Plan Setup section)

5. Deploy code using `deploy-premium.sh`

---

## Verification & Testing

### Check Function Discovery

```bash
# List all functions
func azure functionapp list-functions <app-name>

# Should show 18 functions:
# - advanceQuestion (HTTP)
# - getTimerState (HTTP)
# - initializeGame (HTTP)
# - startQuestion (HTTP)
# - submitAnswer (HTTP)
# - advanceQuestionOrchestrator (Orchestration)
# - initializeGameOrchestrator (Orchestration)
# - callHostEntity (Orchestration)
# - callPlayerEntity (Orchestration)
# - HostEntity (Entity)
# - PlayerEntity (Entity)
# - broadcastGameEnded (Activity)
# - broadcastQuestionStarted (Activity)
# - generatePlayerNotifications (Activity)
# - notifyPlayerResponse (Activity)
# - notifyPlayerResponseError (Activity)
# - processPlayerAnswer (Activity)
# - updateQuestionDeadline (Activity)
```

### Test HTTP Endpoints

```bash
# Test initialize (should return 400 validation error with test data)
curl -X POST https://<app-name>.azurewebsites.net/api/game/initialize \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","pathkeyId":"pk","players":[],"questionSetId":"qs"}'

# Expected: {"success":false,"error":"Missing required fields"}
# Status: 400 (means function is working, just validating input)
```

### Verify Separate Durable Functions Hubs

```bash
# List storage tables
az storage table list \
  --account-name pathctestore \
  --account-key <key> \
  --query "[?contains(name, 'PathCTE')].name" \
  -o table

# Should show separate tables for each hub:
# PathCTEGameHubHistory          (Consumption)
# PathCTEGameHubInstances        (Consumption)
# PathCTEGameHubPartitions       (Consumption)
# PathCTEGameHubPremiumHistory   (Premium)
# PathCTEGameHubPremiumInstances (Premium)
# PathCTEGameHubPremiumPartitions(Premium)
```

### Check Lock Blobs

```bash
# List host lock blobs
az storage blob list \
  --account-name pathctestore \
  --account-key <key> \
  --container-name azure-webjobs-hosts \
  --prefix "locks/" \
  --query "[].name" \
  -o table

# Should show separate locks:
# locks/pathcte-functions/host         (Consumption)
# locks/pathcte-functions-premium/host (Premium)
```

### Verify App Settings

```bash
# Check critical settings
az functionapp config appsettings list \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --query "[?name=='WEBSITE_RUN_FROM_PACKAGE' || name=='AzureFunctionsJobHost__extensions__durableTask__hubName' || name=='AzureFunctionsJobHost__id']" \
  -o table

# Expected:
# - WEBSITE_RUN_FROM_PACKAGE: (should NOT exist)
# - hubName: PathCTEGameHubPremium
# - id: pathcte-functions-premium
```

### Check Always On Status

```bash
az functionapp config show \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --query "alwaysOn" \
  -o tsv

# Expected: false
```

---

## Monitoring

### Application Insights

**URL**: https://portal.azure.com → Resource Group: Pathfinity → Application Insights

**Key Metrics**:
- Server response time (Premium should be <1s, Consumption 90-120s on cold start)
- Failed requests
- Dependency calls (Supabase, Azure Storage)
- Custom events for game sessions

**Useful Queries**:
```kusto
// Failed requests in last hour
requests
| where timestamp > ago(1h)
| where success == false
| project timestamp, name, resultCode, duration

// Cold start times
traces
| where message contains "Host started"
| extend hostStartTime = timestamp
| project hostStartTime, cloud_RoleName

// Durable Functions orchestrations
customEvents
| where name contains "Orchestrator"
| project timestamp, name, customDimensions
```

### Live Logs

```bash
# Stream logs from Premium
az webapp log tail \
  --resource-group Pathfinity \
  --name pathcte-functions-premium

# Stream logs from Consumption
az webapp log tail \
  --resource-group Pathfinity \
  --name pathcte-functions
```

### Cost Monitoring

```bash
# Check current month costs
az consumption usage list \
  --query "[?contains(instanceName, 'pathcte')]" \
  --output table
```

**Expected Costs**:
- Consumption: $5-20/month (depends on usage)
- Premium EP1: ~$146/month (fixed)

---

## Appendix: Complete App Settings Reference

### Consumption Plan Settings
```bash
APPLICATIONINSIGHTS_CONNECTION_STRING=<app-insights-connection-string>
AzureWebJobsFeatureFlags=EnableWorkerIndexing
AzureWebJobsStorage=<azure-storage-connection-string>
FUNCTIONS_EXTENSION_VERSION=~4
FUNCTIONS_WORKER_RUNTIME=node
SUPABASE_SERVICE_KEY=<supabase-service-key>
SUPABASE_URL=https://festwdkldwnpmqxrkiso.supabase.co
```

### Premium Plan Settings
```bash
APPLICATIONINSIGHTS_CONNECTION_STRING=<app-insights-connection-string>
AzureFunctionsJobHost__extensions__durableTask__hubName=PathCTEGameHubPremium
AzureFunctionsJobHost__id=pathcte-functions-premium
AzureWebJobsFeatureFlags=EnableWorkerIndexing
AzureWebJobsStorage=<azure-storage-connection-string>
FUNCTIONS_EXTENSION_VERSION=~4
FUNCTIONS_WORKER_RUNTIME=node
SUPABASE_SERVICE_KEY=<supabase-service-key>
SUPABASE_URL=https://festwdkldwnpmqxrkiso.supabase.co
WEBSITE_CONTENTAZUREFILECONNECTIONSTRING=<azure-storage-connection-string>
WEBSITE_CONTENTSHARE=pathcte-functions-premiumd8eb927ba13d
WEBSITE_MOUNT_ENABLED=1
```

### Settings That Should NOT Exist
```bash
# These settings cause issues if present on Premium:
WEBSITE_RUN_FROM_PACKAGE  # Causes 404 errors
SCM_DO_BUILD_DURING_DEPLOYMENT  # Not needed with local build
```

---

## Quick Reference Commands

```bash
# Deploy to Consumption
cd packages/functions && func azure functionapp publish pathcte-functions

# Deploy to Premium
cd packages/functions && ./deploy-premium.sh

# Switch Netlify to Consumption
# Set: VITE_AZURE_FUNCTIONS_URL=https://pathcte-functions.azurewebsites.net

# Switch Netlify to Premium
# Set: VITE_AZURE_FUNCTIONS_URL=https://pathcte-functions-premium.azurewebsites.net

# List functions
func azure functionapp list-functions <app-name>

# View logs
az webapp log tail --resource-group Pathfinity --name <app-name>

# Restart app
az functionapp restart --resource-group Pathfinity --name <app-name>

# Check Always On status
az functionapp config show --resource-group Pathfinity --name <app-name> --query "alwaysOn"

# Verify no WEBSITE_RUN_FROM_PACKAGE
az functionapp config appsettings list --resource-group Pathfinity --name <app-name> --query "[?name=='WEBSITE_RUN_FROM_PACKAGE']"
```

---

## Emergency Contacts & Resources

- **Azure Portal**: https://portal.azure.com
- **Resource Group**: Pathfinity
- **Storage Account**: pathctestore (East US)
- **Application Insights**: b3973445-260a-4298-a5ad-46e2716e047d
- **Supabase Dashboard**: https://supabase.com/dashboard/project/festwdkldwnpmqxrkiso
- **Netlify Dashboard**: https://app.netlify.com

---

**Document Version**: 1.0
**Last Updated**: 2025-11-03
**Maintained By**: Development Team
