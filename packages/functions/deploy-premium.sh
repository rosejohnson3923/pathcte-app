#!/bin/bash
set -e

echo "Deploying to Premium Function App..."
func azure functionapp publish pathcte-functions-premium

echo "Removing WEBSITE_RUN_FROM_PACKAGE setting..."
az functionapp config appsettings delete \
  --resource-group Pathfinity \
  --name pathcte-functions-premium \
  --setting-names WEBSITE_RUN_FROM_PACKAGE

echo "Restarting function app..."
az functionapp restart \
  --resource-group Pathfinity \
  --name pathcte-functions-premium

echo "Deployment complete! Waiting for app to start..."
sleep 10

echo "Testing endpoint..."
curl -X POST https://pathcte-functions-premium.azurewebsites.net/api/game/initialize \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","pathkeyId":"pk","players":[],"questionSetId":"qs"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "Premium function app deployed successfully!"
echo "URL: https://pathcte-functions-premium.azurewebsites.net"
