# Azure Durable Functions - Quick Start Guide

## Prerequisites

1. **Node.js 20+** installed
2. **Azure Functions Core Tools v4** installed
3. **Azurite** storage emulator installed
4. **Supabase Service Role Key** configured

## Getting the Supabase Service Key

The Functions need the Supabase **service role key** (NOT the anon key) to perform database operations.

### Steps to Get the Key:

1. Go to [Supabase Dashboard - API Settings](https://supabase.com/dashboard/project/festwdkldwnpmqxrkiso/settings/api)
2. Scroll to **Project API keys** section
3. Copy the **`service_role`** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
4. Add it to `local.settings.json`:

```json
{
  "Values": {
    "SUPABASE_SERVICE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

⚠️ **Security Note**: The service role key bypasses Row Level Security. Keep it secret and never commit it to git.

## Running Local Tests

### Option 1: Automated Script (Recommended)

```bash
cd packages/functions

# This script will:
# - Check Azurite installation
# - Validate SUPABASE_SERVICE_KEY
# - Build TypeScript
# - Start Azurite emulator
# - Start Azure Functions runtime
./test-local.sh
```

### Option 2: Manual Steps

```bash
# Terminal 1: Start Azurite
azurite --silent --location /tmp/azurite

# Terminal 2: Build and start Functions
cd packages/functions
npm run build
npm start
```

## Testing Endpoints

Once the Functions are running, use the test script in a new terminal:

```bash
cd packages/functions
./test-endpoints.sh
```

This will test:
1. **Initialize Game** - Create session with 2 players, 2 questions
2. **Start Question** - Start question 1
3. **Get Timer State** - Verify timer is running
4. **Submit Answer** - Submit correct answer from player 1

## Expected Storage Structure

After first run, Azurite will create:

```
/tmp/azurite/
├── __azurite_db_blob__.json
├── __azurite_db_queue__.json
├── __azurite_db_table__.json
└── __blobstorage__/
```

Azure Storage Explorer can connect to `http://localhost:10000` to view:
- **Queues**: pathctegamehub-control-*, pathctegamehub-workitems
- **Tables**: DurableFunctionsHubInstances, DurableFunctionsHubHistory
- **Blobs**: Entity state storage

## Troubleshooting

### Error: "Missing SUPABASE_SERVICE_KEY"
- Add the service role key to `local.settings.json` (see above)

### Error: "Azurite not found"
```bash
npm install -g azurite
```

### Error: "Port 7071 already in use"
```bash
# Kill existing Functions process
pkill -f "func start"
```

### Error: TypeScript compilation errors
```bash
npm run build
# Check for any compilation errors
```

## Production Deployment

When ready to deploy to Azure:

```bash
# Deploy built code
npm run build
func azure functionapp publish pathcte-game-functions
```

Environment variables will be configured in Azure Portal:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `AzureWebJobsStorage` (connection string to pathctestore)

## Next Steps

1. ✅ Get SUPABASE_SERVICE_KEY from dashboard
2. ✅ Add key to local.settings.json
3. ✅ Run `./test-local.sh`
4. ✅ Run `./test-endpoints.sh` in another terminal
5. ✅ Verify all 4 tests pass
6. 🚀 Deploy to Azure when ready
