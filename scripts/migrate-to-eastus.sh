#!/bin/bash

###############################################################################
# PathCTE Azure Storage Migration: Central US → East US
# This script automates the migration to co-locate all resources in East US
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  PathCTE Azure Storage Migration to East US   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo

# Configuration
RESOURCE_GROUP="Pathfinity"
OLD_STORAGE_ACCOUNT="pathcte"
NEW_STORAGE_ACCOUNT="pathcteeastus"
LOCATION="eastus"
CONTAINERS=("careers" "pathkeys" "avatars" "achievements")

echo -e "${YELLOW}Configuration:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Old Storage: $OLD_STORAGE_ACCOUNT (Central US)"
echo "  New Storage: $NEW_STORAGE_ACCOUNT (East US)"
echo

# Step 1: Check if Azure CLI is installed
echo -e "${YELLOW}[1/9] Checking Azure CLI...${NC}"
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI not found. Please install it first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Azure CLI found${NC}"
echo

# Step 2: Login check
echo -e "${YELLOW}[2/9] Checking Azure login...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in. Opening browser for authentication...${NC}"
    az login
fi
SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${GREEN}✓ Logged in to: $SUBSCRIPTION${NC}"
echo

# Step 3: Create new storage account
echo -e "${YELLOW}[3/9] Creating new storage account in East US...${NC}"
if az storage account show --name $NEW_STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠ Storage account already exists. Skipping creation.${NC}"
else
    az storage account create \
      --name $NEW_STORAGE_ACCOUNT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --sku Standard_LRS \
      --kind StorageV2 \
      --access-tier Hot \
      --https-only true \
      --min-tls-version TLS1_2 \
      --allow-blob-public-access false

    echo -e "${GREEN}✓ Storage account created${NC}"
fi
echo

# Step 4: Enable CORS
echo -e "${YELLOW}[4/9] Configuring CORS...${NC}"
az storage cors add \
  --services b \
  --methods GET HEAD POST PUT DELETE OPTIONS \
  --origins https://pathcte.com https://*.pathcte.com http://localhost:5173 https://localhost:5173 \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 3600 \
  --account-name $NEW_STORAGE_ACCOUNT
echo -e "${GREEN}✓ CORS configured${NC}"
echo

# Step 5: Create containers
echo -e "${YELLOW}[5/9] Creating containers...${NC}"
for CONTAINER in "${CONTAINERS[@]}"; do
    echo "  Creating container: $CONTAINER"
    az storage container create \
      --name $CONTAINER \
      --account-name $NEW_STORAGE_ACCOUNT \
      --public-access off \
      --output none 2>/dev/null || echo "    (already exists)"
done
echo -e "${GREEN}✓ Containers created${NC}"
echo

# Step 6: Copy blobs (if any exist in old storage)
echo -e "${YELLOW}[6/9] Checking for existing blobs to copy...${NC}"

SOURCE_KEY=$(az storage account keys list \
  --account-name $OLD_STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query '[0].value' \
  --output tsv)

DEST_KEY=$(az storage account keys list \
  --account-name $NEW_STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query '[0].value' \
  --output tsv)

for CONTAINER in "${CONTAINERS[@]}"; do
    echo "  Checking container: $CONTAINER"

    # Check if container has blobs
    BLOB_COUNT=$(az storage blob list \
      --container-name $CONTAINER \
      --account-name $OLD_STORAGE_ACCOUNT \
      --account-key "$SOURCE_KEY" \
      --query "length([])" \
      --output tsv 2>/dev/null || echo "0")

    if [ "$BLOB_COUNT" -gt 0 ]; then
        echo "    Found $BLOB_COUNT blobs. Copying..."
        az storage blob copy start-batch \
          --source-account-name $OLD_STORAGE_ACCOUNT \
          --source-account-key "$SOURCE_KEY" \
          --source-container $CONTAINER \
          --destination-container $CONTAINER \
          --account-name $NEW_STORAGE_ACCOUNT \
          --account-key "$DEST_KEY"
        echo -e "${GREEN}    ✓ Copy started${NC}"
    else
        echo "    No blobs to copy"
    fi
done
echo

# Step 7: Generate SAS token
echo -e "${YELLOW}[7/9] Generating SAS token...${NC}"
EXPIRY_DATE=$(date -u -d "+2 years" '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null || date -u -v+2y '+%Y-%m-%dT%H:%M:%SZ')

SAS_TOKEN=$(az storage account generate-sas \
  --account-name $NEW_STORAGE_ACCOUNT \
  --services b \
  --resource-types sco \
  --permissions rl \
  --expiry $EXPIRY_DATE \
  --https-only \
  --output tsv)

echo -e "${GREEN}✓ SAS token generated${NC}"
echo "  Expiration: $EXPIRY_DATE"
echo

# Step 8: Save configuration
echo -e "${YELLOW}[8/9] Saving new configuration...${NC}"

CONFIG_FILE=".env.azure-eastus"
cat > $CONFIG_FILE << EOF
# PathCTE Azure Storage - East US Configuration
# Generated: $(date)

VITE_AZURE_STORAGE_ACCOUNT=$NEW_STORAGE_ACCOUNT
VITE_AZURE_STORAGE_URL=https://$NEW_STORAGE_ACCOUNT.blob.core.windows.net
VITE_AZURE_STORAGE_SAS_TOKEN=$SAS_TOKEN
VITE_AZURE_CONTAINER_CAREERS=careers
VITE_AZURE_CONTAINER_PATHKEYS=pathkeys
VITE_AZURE_CONTAINER_AVATARS=avatars
VITE_AZURE_CONTAINER_ACHIEVEMENTS=achievements
EOF

echo -e "${GREEN}✓ Configuration saved to: $CONFIG_FILE${NC}"
echo

# Step 9: Summary
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Migration Complete! ✓               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo
echo -e "${YELLOW}Next Steps:${NC}"
echo
echo "1. Update your local .env files:"
echo "   ${GREEN}cp .env.azure-eastus packages/web/.env.local${NC}"
echo
echo "2. Update code defaults in:"
echo "   - packages/shared/src/config/azure-storage.ts"
echo "   - packages/web/src/config/azure.ts"
echo
echo "3. Update Netlify environment variables:"
echo "   ${GREEN}netlify env:set VITE_AZURE_STORAGE_URL \"https://$NEW_STORAGE_ACCOUNT.blob.core.windows.net\"${NC}"
echo "   ${GREEN}netlify env:set VITE_AZURE_STORAGE_SAS_TOKEN \"$SAS_TOKEN\"${NC}"
echo "   ${GREEN}netlify env:set VITE_AZURE_STORAGE_ACCOUNT \"$NEW_STORAGE_ACCOUNT\"${NC}"
echo
echo "4. Test the new storage:"
echo "   ${GREEN}node test-azure-url.mjs${NC}"
echo
echo "5. Deploy and verify on pathcte.com"
echo
echo "6. After verification, delete old storage account:"
echo "   ${GREEN}az storage account delete --name $OLD_STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --yes${NC}"
echo
echo -e "${YELLOW}⚠ Important:${NC} Keep the old storage account until you've verified everything works!"
echo
echo -e "${GREEN}Storage account details:${NC}"
echo "  Name: $NEW_STORAGE_ACCOUNT"
echo "  Location: East US"
echo "  Endpoint: https://$NEW_STORAGE_ACCOUNT.blob.core.windows.net"
echo "  SAS Token: (saved in $CONFIG_FILE)"
echo

echo -e "${GREEN}✓ All done!${NC}"
