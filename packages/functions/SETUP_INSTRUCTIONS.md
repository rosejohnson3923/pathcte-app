# Azure Functions Local Testing - Setup Instructions

## Current Status

### ✅ Completed
- [x] Azurite storage emulator installed
- [x] Azure Functions Core Tools v4 installed
- [x] TypeScript code compiled successfully
- [x] SUPABASE_SERVICE_KEY configured in local.settings.json
- [x] Test scripts created (test-local.sh, test-endpoints.sh)

### ⏳ Pending - Requires User Action

**Install ICU Library (requires sudo):**

The Azure Functions Core Tools requires the `libicu` library to run. Please run this command in your WSL terminal:

```bash
sudo apt-get update && sudo apt-get install -y libicu-dev
```

This will prompt for your password. After installation, the Functions should start successfully.

---

## Why ICU is Needed

ICU (International Components for Unicode) provides:
- Globalization support
- Unicode handling
- Date/time formatting
- Number formatting

Azure Functions Core Tools (.NET-based) requires this library to run on Linux/WSL.

---

## After Installing ICU

Once you've installed the library, run the test script again:

```bash
cd /mnt/c/Users/rosej/Documents/Projects/pathcte.app/packages/functions
./test-local.sh
```

### Expected Successful Output:

```
======================================
PathCTE Durable Functions - Local Test
======================================

1. Checking Azurite...
✓ Azurite is installed

2. Checking local.settings.json...
✓ SUPABASE_SERVICE_KEY is configured

3. Building TypeScript...
✓ Build successful

4. Starting Azurite storage emulator...
✓ Azurite started (PID: xxxxx)

5. Starting Azure Functions...
Press Ctrl+C to stop the Functions runtime

======================================
Functions will be available at:
  http://localhost:7071/api/...
======================================


Azure Functions Core Tools
Core Tools Version:       4.x.x
Function Runtime Version: 4.x.x


Functions:

  game_advanceQuestion: [POST] http://localhost:7071/api/game/advanceQuestion

  game_initialize: [POST] http://localhost:7071/api/game/initialize

  game_startQuestion: [POST] http://localhost:7071/api/game/startQuestion

  game_submitAnswer: [POST] http://localhost:7071/api/game/submitAnswer

  game_timerState: [GET] http://localhost:7071/api/game/timerState/{id}

For detailed output, run func with --verbose flag.
[2025-11-02T12:00:00.000] Worker process started and initialized.
[2025-11-02T12:00:00.000] Host lock lease acquired by instance ID '...'
```

---

## Testing the Endpoints

Once the Functions are running, **open a NEW terminal** and run:

```bash
cd /mnt/c/Users/rosej/Documents/Projects/pathcte.app/packages/functions
./test-endpoints.sh
```

This will run 4 tests:
1. **Initialize Game** - Creates session with 2 players, 2 questions
2. **Start Question** - Starts question 1 and timer
3. **Get Timer State** - Retrieves current timer state
4. **Submit Answer** - Submits a correct answer

### Expected Test Output:

```
======================================
PathCTE Durable Functions - API Tests
======================================

Test 1: Initialize Game
POST http://localhost:7071/api/game/initialize

{
  "success": true,
  "sessionId": "test-session-001",
  "runtimeStatus": "Running"
}
✓ Game initialized successfully

Press Enter to continue to next test...

Test 2: Start Question
POST http://localhost:7071/api/game/startQuestion

{
  "success": true,
  "questionIndex": 0
}
✓ Question started successfully

... (continues for all tests)
```

---

## Verifying Storage State

After running tests, you can inspect the Azurite storage:

### Using Azure Storage Explorer

1. Download: https://azure.microsoft.com/en-us/products/storage/storage-explorer/
2. Connect to Local Emulator:
   - Account Name: devstoreaccount1
   - Connection String: `UseDevelopmentStorage=true`
3. Browse:
   - **Tables** → DurableFunctionsHubInstances (see orchestrator instances)
   - **Tables** → DurableFunctionsHubHistory (see execution history)
   - **Queues** → pathctegamehub-* (see durable functions queues)

### Using Command Line

```bash
# View Azurite tables
ls -la /tmp/azurite/

# Check Azurite logs
cat /tmp/azurite/__azurite_db_table__.json | jq '.'
```

---

## Troubleshooting

### Error: "libicu not found"
**Solution:** Run `sudo apt-get install -y libicu-dev`

### Error: "Port 7071 already in use"
**Solution:** Kill existing Functions:
```bash
pkill -f "func start"
```

### Error: "Azurite connection failed"
**Solution:** Restart Azurite:
```bash
pkill -f azurite
mkdir -p /tmp/azurite
azurite --silent --location /tmp/azurite &
```

### Error: "SUPABASE_SERVICE_KEY is not set"
**Solution:** Verify key in local.settings.json:
```bash
grep SUPABASE_SERVICE_KEY local.settings.json
```

### Functions not registering
**Solution:** Rebuild TypeScript:
```bash
npm run build
```

---

## What Happens During Tests

### 1. Initialize Game
- Creates `HostEntity` with session ID
- Creates 2 `PlayerEntity` instances
- Initializes game state in Azurite tables
- Returns orchestrator instance ID

### 2. Start Question
- Calls `HostEntity.startQuestion(0)`
- Updates `current_question_started_at` in database
- Broadcasts to Supabase Realtime channel
- Returns success

### 3. Get Timer State
- Calls `HostEntity.getTimerState()`
- Returns current question, start time, and elapsed time
- Used by late-join players to sync timer

### 4. Submit Answer
- Orchestrator validates timing with `HostEntity`
- `PlayerEntity` calculates score + speed bonus
- Records answer in `game_answers` table
- Updates score in `game_players` table
- Returns points earned

---

## Next Steps After Successful Tests

1. **Verify Database Changes:**
   ```bash
   # Check Supabase database to see:
   # - game_sessions.current_question_started_at updated
   # - game_answers table has new records
   # - game_players scores updated
   ```

2. **Test More Scenarios:**
   - Multiple concurrent games
   - Late join mid-game
   - Disconnect and reconnect
   - Auto vs manual progression

3. **Deploy to Azure:**
   ```bash
   # Create Function App (if not exists)
   az functionapp create \
     --resource-group Pathfinity \
     --consumption-plan-location eastus \
     --runtime node \
     --runtime-version 20 \
     --functions-version 4 \
     --name pathcte-game-functions \
     --storage-account pathctestore

   # Configure environment
   az functionapp config appsettings set \
     --name pathcte-game-functions \
     --resource-group Pathfinity \
     --settings \
       SUPABASE_URL="https://festwdkldwnpmqxrkiso.supabase.co" \
       SUPABASE_SERVICE_KEY="<your-key>"

   # Deploy
   npm run build
   func azure functionapp publish pathcte-game-functions
   ```

4. **Update Web App:**
   ```typescript
   // Add to packages/web/.env
   VITE_AZURE_FUNCTIONS_URL=https://pathcte-game-functions.azurewebsites.net

   // Update game.service.ts to call Azure Functions
   const result = await fetch(
     `${import.meta.env.VITE_AZURE_FUNCTIONS_URL}/api/game/submitAnswer`,
     { method: 'POST', body: JSON.stringify({...}) }
   );
   ```

---

## Summary

**Current Blocker:** Missing `libicu-dev` library

**Required Action:**
```bash
sudo apt-get update && sudo apt-get install -y libicu-dev
```

**After Installation:**
```bash
./test-local.sh        # Terminal 1: Start Functions
./test-endpoints.sh    # Terminal 2: Test APIs
```

**Everything else is ready to go!** ✅
