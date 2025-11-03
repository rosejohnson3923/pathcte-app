# Azure Functions Migration History

## Overview

This document tracks the migration from Consumption to Premium plan to eliminate production cold start delays.

---

## Timeline

### 2025-11-03: Premium Plan Deployment

**Objective**: Eliminate 120-second cold start delays in production by migrating to Premium (EP1) plan.

**Status**: ✅ Complete

**Key Personnel**: Development Team

---

## Problem Statement

### Initial Issue
- **Environment**: Production (Consumption plan)
- **Symptom**: 120-second delays when initializing games
- **Root Cause**: Azure Functions cold starts on Consumption plan
- **Impact**: Unacceptable for live classroom games requiring real-time interaction
- **Note**: Development environment did NOT show these delays

### Business Requirements
- Eliminate cold start delays
- Maintain all 18 Durable Functions (HTTP, orchestrations, entities, activities)
- Enable zero-downtime migration
- Keep both plans running during transition for safe rollback

---

## Solution: Premium Plan Migration

### Resources Created

#### Premium App Service Plan
```
Name: pathcte-premium-plan
SKU: EP1 (ElasticPremium)
Region: East US
Cost: ~$146/month
Instances: 1-10 (auto-scale)
```

#### Premium Function App
```
Name: pathcte-functions-premium
URL: https://pathcte-functions-premium.azurewebsites.net
Runtime: Node.js 20
Functions Version: 4
Storage: pathctestore (shared with Consumption)
```

---

## Migration Steps Completed

### 1. Infrastructure Setup
- ✅ Created Premium App Service Plan (EP1)
- ✅ Created Premium Function App
- ✅ Configured CORS for pathcte.com
- ✅ Disabled Always On (required for Premium)

### 2. Configuration
- ✅ Set FUNCTIONS_WORKER_RUNTIME=node
- ✅ Set FUNCTIONS_EXTENSION_VERSION=~4
- ✅ Configured Azure Storage connection
- ✅ Configured Supabase credentials
- ✅ Set AzureWebJobsFeatureFlags=EnableWorkerIndexing
- ✅ Configured file share mounting (WEBSITE_CONTENTSHARE)
- ✅ Set unique Host ID: pathcte-functions-premium
- ✅ Set unique Durable Functions hub: PathCTEGameHubPremium

### 3. Deployment
- ✅ Built functions locally
- ✅ Deployed using ZIP method (not remote build)
- ✅ Removed WEBSITE_RUN_FROM_PACKAGE setting
- ✅ Verified all 18 functions discovered
- ✅ Created automated deployment script (deploy-premium.sh)

### 4. Testing & Verification
- ✅ Verified HTTP endpoints respond correctly
- ✅ Confirmed separate Durable Functions hubs in Azure Storage
- ✅ Verified no lock conflicts between Consumption and Premium
- ✅ Tested orchestrations and entities
- ✅ Confirmed <1 second response times (vs 120 seconds)

### 5. Documentation
- ✅ Created comprehensive deployment guide
- ✅ Created quick reference card
- ✅ Backed up all app settings
- ✅ Documented troubleshooting procedures
- ✅ Created automated deployment script

### 6. Production Cutover
- ✅ Updated Netlify environment variable to Premium URL
- ⏳ Monitoring production traffic (in progress)
- ⏳ Awaiting 24-48 hour stability period
- ⏳ Plan to decommission Consumption after confirmation

---

## Technical Challenges & Solutions

### Challenge 1: WEBSITE_RUN_FROM_PACKAGE Issue

**Problem**: `func azure functionapp publish` automatically creates `WEBSITE_RUN_FROM_PACKAGE` setting, which puts the app in read-only mode and causes 404 errors.

**Symptoms**:
- Functions discovered successfully
- All routes return 404
- No incoming HTTP requests in logs

**Solution**: Created `deploy-premium.sh` script that:
1. Deploys functions
2. Automatically removes WEBSITE_RUN_FROM_PACKAGE
3. Restarts the app
4. Tests the endpoint

**Files Modified**:
- `packages/functions/deploy-premium.sh` (new)

---

### Challenge 2: Durable Functions Hub Conflicts

**Problem**: Both Consumption and Premium apps initially shared the same Durable Functions hub name (`PathCTEGameHub`), causing storage lock conflicts.

**Symptoms**:
- Premium app logs showed references to Consumption lock blobs
- Unpredictable orchestration behavior
- Functions returning errors intermittently

**Root Cause**:
- Both apps using same `hubName` from host.json
- Competing for same storage locks
- Conflicting orchestration state

**Solution**: Set separate hub name for Premium via app setting:
```bash
AzureFunctionsJobHost__extensions__durableTask__hubName=PathCTEGameHubPremium
```

**Result**:
- Consumption: Uses PathCTEGameHub (History, Instances, Partitions tables)
- Premium: Uses PathCTEGameHubPremium (separate History, Instances, Partitions tables)
- No more conflicts

**Files Modified**: None (app setting only)

---

### Challenge 3: Always On Configuration

**Problem**: Always On was initially enabled on Premium plan, preventing functions from working.

**Symptoms**:
- Azure Portal showed diagnostic warning
- Functions discovered but not responding

**Diagnostic Message**:
```
"We detected that your function app is running on Premium plan (ElasticPremium).
Please make sure you have disabled the Always on setting."
```

**Solution**: Disabled Always On (required for Premium's pre-warmed instances)

**Command**:
```bash
az webapp config set \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --always-on false
```

---

### Challenge 4: File Deployment Issues

**Problem**: Initial attempts with remote build didn't deploy all files to wwwroot.

**Symptoms**:
- Only host.json in wwwroot
- 0 functions found
- Missing dist/ directory

**Solution**: Use local build + ZIP deployment instead of remote build

**Command**:
```bash
npm run build
func azure functionapp publish pathcte-functions-premium
```

---

### Challenge 5: Settings Accidentally Deleted

**Problem**: Used `az functionapp config appsettings delete` incorrectly, which deleted ALL settings instead of just WEBSITE_RUN_FROM_PACKAGE.

**Impact**: Function app stopped working until settings restored

**Solution**: Manually restored all settings from backup JSON file

**Prevention**:
1. Created backup files for both apps
2. Updated documentation to always backup before changes
3. deploy-premium.sh script uses correct delete syntax

**Files Created**:
- `docs/premium-settings-backup-*.json`
- `docs/consumption-settings-backup-*.json`

---

## Architecture Changes

### Storage Structure

#### Before Migration (Consumption Only)
```
Azure Storage: pathctestore
├── Containers
│   └── azure-webjobs-hosts
│       └── locks/pathcte-functions/host
└── Tables
    ├── PathCTEGameHubHistory
    ├── PathCTEGameHubInstances
    └── PathCTEGameHubPartitions
```

#### After Migration (Consumption + Premium)
```
Azure Storage: pathctestore
├── Containers
│   └── azure-webjobs-hosts
│       └── locks
│           ├── pathcte-functions/host          (Consumption)
│           └── pathcte-functions-premium/host  (Premium)
├── Tables
│   ├── PathCTEGameHubHistory                   (Consumption)
│   ├── PathCTEGameHubInstances                 (Consumption)
│   ├── PathCTEGameHubPartitions                (Consumption)
│   ├── PathCTEGameHubPremiumHistory            (Premium)
│   ├── PathCTEGameHubPremiumInstances          (Premium)
│   └── PathCTEGameHubPremiumPartitions         (Premium)
└── File Shares
    └── pathcte-functions-premiumd8eb927ba13d   (Premium only)
```

### Configuration Comparison

| Setting | Consumption | Premium |
|---------|-------------|---------|
| **Function App** | pathcte-functions | pathcte-functions-premium |
| **App Service Plan** | Consumption (Y1) | pathcte-premium-plan (EP1) |
| **Hub Name** | PathCTEGameHub | PathCTEGameHubPremium |
| **Host ID** | (auto-generated) | pathcte-functions-premium |
| **Always On** | N/A | false (required) |
| **WEBSITE_CONTENTSHARE** | Not needed | pathcte-functions-premiumd8eb927ba13d |
| **WEBSITE_RUN_FROM_PACKAGE** | OK to use | Must NOT exist |
| **Cold Start Time** | 90-120 seconds | <1 second |

---

## Rollback Plan

### Immediate Rollback (If Premium Fails)

**Steps**:
1. Update Netlify environment variable:
   ```
   VITE_AZURE_FUNCTIONS_URL=https://pathcte-functions.azurewebsites.net
   ```
2. Trigger Netlify redeploy
3. Verify Consumption plan is serving traffic

**Downtime**: 2-3 minutes (Netlify build time)

### Consumption Plan Status

**Current State**: Active and operational (backup)
- Still configured with all settings
- All 18 functions working
- Using PathCTEGameHub (original hub)
- Ready for immediate rollback if needed

**Decommission Plan**:
1. Monitor Premium for 24-48 hours in production
2. Verify no errors or performance issues
3. Stop Consumption plan (don't delete yet)
4. Monitor for 1 week
5. Delete Consumption plan and resources if no issues

---

## Performance Metrics

### Before Migration (Consumption)
- **Cold Start**: 90-120 seconds
- **Warm Request**: <1 second
- **Cost**: ~$5-20/month (variable)
- **Production Impact**: Unacceptable delays for live classroom games

### After Migration (Premium)
- **Cold Start**: <1 second (pre-warmed)
- **Warm Request**: <1 second
- **Cost**: ~$146/month (fixed)
- **Production Impact**: ✅ Eliminated delays

### Cost Analysis
- **Additional Cost**: ~$130-140/month
- **Benefit**: Eliminated 120-second delays
- **ROI**: Acceptable for production classroom use

---

## Files Created/Modified

### New Files
- `packages/functions/deploy-premium.sh` - Automated deployment script
- `docs/AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md` - Comprehensive guide
- `docs/QUICK_REFERENCE.md` - Quick troubleshooting reference
- `docs/MIGRATION_HISTORY.md` - This file
- `docs/premium-settings-backup-*.json` - Settings backup
- `docs/consumption-settings-backup-*.json` - Settings backup

### Modified Files
None (all changes were configuration-based)

### Configuration Files (Unchanged)
- `packages/functions/package.json` - Entry point: dist/index.js
- `packages/functions/host.json` - Default hub: PathCTEGameHub
- `packages/functions/tsconfig.json` - TypeScript config

---

## Lessons Learned

1. **Always disable Always On on Premium plans** - Required for pre-warmed instances
2. **WEBSITE_RUN_FROM_PACKAGE breaks Premium** - Must be removed after deployment
3. **Separate Durable Functions hubs are critical** - Prevents conflicts when sharing storage
4. **Remote build can fail silently** - Use local build + ZIP deployment for reliability
5. **Backup settings before changes** - Easy to accidentally delete all settings
6. **Test thoroughly before cutover** - Verify endpoints, hubs, and locks before switching traffic
7. **Deploy script prevents human error** - Automate the WEBSITE_RUN_FROM_PACKAGE cleanup

---

## Next Steps

### Immediate (Days 1-2)
- [x] Update Netlify to Premium URL
- [x] First production test completed successfully (2025-11-03)
  - Session ID: 0ac8b511-5004-484a-ac3e-faf86c2f08d9
  - 10 questions completed, student answered all correctly
  - Zero cold start delays
  - Perfect real-time synchronization
  - Pathkey awarded successfully
- [ ] Monitor Application Insights for errors
- [ ] Test with full classroom (multiple students)
- [ ] Verify auto-scaling under load
- [ ] Check cost metrics in Azure

### Short Term (Week 1)
- [ ] Conduct full classroom test with real students
- [ ] Monitor orchestration performance
- [ ] Verify Supabase integration working correctly
- [ ] Review Application Insights metrics
- [ ] Confirm stability and reliability

### Medium Term (Weeks 2-4)
- [ ] If stable, stop Consumption function app
- [ ] Monitor for 1 week while stopped
- [ ] If no issues, delete Consumption function app
- [ ] Consider deleting Consumption plan to save resources
- [ ] Update documentation with final architecture

### Long Term (Ongoing)
- [ ] Monitor monthly costs vs budget
- [ ] Optimize instance scaling if needed
- [ ] Review Application Insights for optimization opportunities
- [ ] Consider containerizing functions for even faster cold starts

---

## Support Resources

### Documentation
- Full Guide: `docs/AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md`
- Quick Reference: `docs/QUICK_REFERENCE.md`
- Migration History: `docs/MIGRATION_HISTORY.md` (this file)

### Azure Resources
- **Portal**: https://portal.azure.com
- **Resource Group**: Pathfinity
- **Application Insights**: b3973445-260a-4298-a5ad-46e2716e047d
- **Storage Account**: pathctestore

### External Services
- **Supabase**: https://supabase.com/dashboard/project/festwdkldwnpmqxrkiso
- **Netlify**: https://app.netlify.com

---

## Approval & Sign-off

**Migration Completed By**: Development Team
**Date**: 2025-11-03
**Status**: ✅ Deployed to Production
**Monitoring Period**: In Progress (24-48 hours)
**Final Approval**: Pending post-monitoring

---

## Change Log

| Date | Change | Author | Status |
|------|--------|--------|--------|
| 2025-11-03 | Premium plan deployed and tested | Dev Team | ✅ Complete |
| 2025-11-03 | Netlify updated to Premium URL | Dev Team | ✅ Complete |
| 2025-11-03 | Documentation created | Dev Team | ✅ Complete |
| 2025-11-03 | First production test successful | Dev Team | ✅ Complete |
| TBD | Full classroom test | Dev Team | ⏳ Pending |
| TBD | Decommission Consumption plan | Dev Team | ⏳ Pending |

---

**Document Version**: 1.0
**Last Updated**: 2025-11-03
**Next Review**: After 24-48 hour monitoring period
