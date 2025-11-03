# PathCTE Documentation

This directory contains technical documentation for the PathCTE application, with a focus on Azure Functions deployment and troubleshooting.

## Quick Start

**Need to fix something quickly?** → See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Deploying functions?** → See [AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md](AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md)

**Understanding the migration?** → See [MIGRATION_HISTORY.md](MIGRATION_HISTORY.md)

---

## Document Index

### Core Documentation

#### [AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md](AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md)
**Purpose**: Comprehensive deployment and troubleshooting guide for both Consumption and Premium plans.

**Use When**:
- Deploying to Azure Functions
- Troubleshooting function issues
- Setting up a new function app
- Understanding configuration differences

**Contents**:
- Deployment comparison
- Complete setup instructions for both plans
- Known issues and solutions
- Rollback procedures
- Verification steps
- Monitoring guide

---

#### [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
**Purpose**: Fast reference card for common issues and fixes.

**Use When**:
- Need a quick fix for a known issue
- Want common commands without reading full guide
- Need deployment URLs
- Emergency troubleshooting

**Contents**:
- Common issues & quick fixes
- Deployment commands
- Rollback procedure
- Verification commands
- Critical configuration differences

---

#### [MIGRATION_HISTORY.md](MIGRATION_HISTORY.md)
**Purpose**: Historical record of the Consumption to Premium migration.

**Use When**:
- Understanding why Premium was chosen
- Learning about technical challenges encountered
- Reviewing lessons learned
- Onboarding new team members

**Contents**:
- Timeline of migration
- Problem statement and solution
- Technical challenges and how they were solved
- Architecture changes
- Performance metrics
- Next steps and sign-off

---

### Architecture Documentation

#### [AZURE_DURABLE_FUNCTIONS_ARCHITECTURE.md](AZURE_DURABLE_FUNCTIONS_ARCHITECTURE.md)
**Purpose**: Detailed architecture of the Durable Functions implementation.

**Contents**:
- Game orchestration flow
- Entity design (Host and Player)
- HTTP triggers
- Activity functions
- State management

---

#### [AZURE_EASTUS_MIGRATION.md](AZURE_EASTUS_MIGRATION.md)
**Purpose**: Documentation of migration from West US to East US region.

**Contents**:
- Storage account migration
- Region change rationale
- Steps completed

---

#### [AZURE_AI_FOUNDRY_INTEGRATION.md](AZURE_AI_FOUNDRY_INTEGRATION.md)
**Purpose**: Azure AI Foundry integration documentation.

**Contents**:
- AI capabilities integration
- Configuration details
- Usage guidelines

---

### Configuration Backups

#### Settings Backup Files
- `premium-settings-backup-YYYYMMDD.json` - Premium function app settings
- `consumption-settings-backup-YYYYMMDD.json` - Consumption function app settings

**Use When**:
- Restoring accidentally deleted settings
- Setting up a new function app
- Auditing configuration changes

**Restore Command**:
```bash
az functionapp config appsettings set \
  --resource-group Pathfinity \
  --name <app-name> \
  --settings @docs/premium-settings-backup-YYYYMMDD.json
```

---

### Research Notes

#### [Azure_Foundry_Pathfinity.txt](Azure_Foundry_Pathfinity.txt)
Research notes on Azure AI Foundry integration with PathCTE.

#### [Research_Azure_Container_Merge.txt](Research_Azure_Container_Merge.txt)
Research notes on Azure Container Apps as potential alternative architecture.

---

## Common Scenarios

### Scenario 1: Functions returning 404

1. Open [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. Find "🔴 Functions return 404"
3. Run the fix command
4. If issue persists, see [AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md](AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md) → "Known Issues" → "Issue 1"

### Scenario 2: Deploying new code to Premium

1. Navigate to `packages/functions`
2. Run `./deploy-premium.sh`
3. If issues occur, see [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for verification commands

### Scenario 3: Need to rollback to Consumption

1. Open [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. Find "Rollback to Consumption"
3. Update Netlify environment variable
4. Trigger redeploy

### Scenario 4: Premium functions stopped working

1. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common issues
2. Verify no WEBSITE_RUN_FROM_PACKAGE setting exists
3. Verify Always On is disabled
4. Check logs: `az webapp log tail --resource-group Pathfinity --name pathcte-functions-premium`
5. If still stuck, consult [AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md](AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md)

### Scenario 5: Setting up a new team member

1. Have them read [MIGRATION_HISTORY.md](MIGRATION_HISTORY.md) for context
2. Then [AZURE_DURABLE_FUNCTIONS_ARCHITECTURE.md](AZURE_DURABLE_FUNCTIONS_ARCHITECTURE.md) for architecture
3. Bookmark [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for daily use
4. Keep [AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md](AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md) handy for deep troubleshooting

---

## Document Maintenance

### Updating Documentation

When making changes to Azure Functions configuration:

1. **Update the main guide** if configuration or procedures change
2. **Update quick reference** if adding common issues/fixes
3. **Add to migration history** if making architectural changes
4. **Backup settings** after major configuration changes:
   ```bash
   az functionapp config appsettings list \
     --resource-group Pathfinity \
     --name pathcte-functions-premium \
     > docs/premium-settings-backup-$(date +%Y%m%d).json
   ```

### Document Versions

- **AZURE_FUNCTIONS_DEPLOYMENT_GUIDE.md**: v1.0 (2025-11-03)
- **QUICK_REFERENCE.md**: v1.0 (2025-11-03)
- **MIGRATION_HISTORY.md**: v1.0 (2025-11-03)

Update version numbers when making substantial changes.

---

## Key Contacts & Resources

### Azure Resources
- **Portal**: https://portal.azure.com
- **Resource Group**: Pathfinity
- **Storage Account**: pathctestore
- **Application Insights ID**: b3973445-260a-4298-a5ad-46e2716e047d

### Function Apps
- **Consumption**: https://pathcte-functions.azurewebsites.net
- **Premium**: https://pathcte-functions-premium.azurewebsites.net

### External Services
- **Supabase**: https://supabase.com/dashboard/project/festwdkldwnpmqxrkiso
- **Netlify**: https://app.netlify.com

---

## Contributing

When adding new documentation:

1. Add it to this README under the appropriate section
2. Include purpose, use cases, and key contents
3. Link to it from other relevant documents
4. Update the "Last Updated" date
5. Consider if it affects quick reference or deployment guide

---

**Last Updated**: 2025-11-03
