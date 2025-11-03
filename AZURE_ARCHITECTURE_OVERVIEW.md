# PathCTE Azure Architecture - Complete Overview

**Last Updated:** November 2, 2025
**Status:** ✅ Storage Migrated | ⏳ Functions Ready for Deployment

---

## 🏗️ Azure Resources in Pathfinity Resource Group

All PathCTE Azure resources are co-located in **East US** region for optimal performance.

```
┌──────────────────────────────────────────────────────────────┐
│         AZURE PATHFINITY RESOURCE GROUP (EAST US)            │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  1. Azure AI Foundry Hub                               │  │
│  │     Name: Pathfinity-AI-Foundry                        │  │
│  │     Region: East US                                    │  │
│  │                                                         │  │
│  │     Models:                                            │  │
│  │     • gpt-4o (2024-11-20)                             │  │
│  │     • gpt-4                                           │  │
│  │     • gpt-35-turbo                                    │  │
│  │     • dall-e-3                                        │  │
│  │                                                         │  │
│  │     Purpose: Generate career content, pathkey         │  │
│  │              descriptions, quiz questions              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  2. Azure Storage Account                              │  │
│  │     Name: pathctestore                                 │  │
│  │     Region: East US                                    │  │
│  │     SKU: Standard_LRS                                  │  │
│  │     Endpoint: https://pathctestore.blob.core.windows.net│  │
│  │                                                         │  │
│  │     Containers:                                        │  │
│  │     📁 careers - Career images and videos             │  │
│  │     📁 pathkeys - Pathkey artwork (PNG/GIF)           │  │
│  │     📁 avatars - User profile pictures                │  │
│  │     📁 achievements - Achievement icons                │  │
│  │                                                         │  │
│  │     Purpose: Static asset storage for web app         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  3. Azure Functions (Durable Functions)                │  │
│  │     Name: pathcte-game-functions                       │  │
│  │     Region: East US                                    │  │
│  │     Runtime: Node.js 20                                │  │
│  │     Plan: Consumption                                  │  │
│  │                                                         │  │
│  │     Components:                                        │  │
│  │     🎮 Host Entity - Timer authority                  │  │
│  │     👤 Player Entities - Answer processing            │  │
│  │     🎯 Orchestrators - Game coordination              │  │
│  │     📡 HTTP Triggers - API endpoints                  │  │
│  │     ⚡ Activities - Database operations               │  │
│  │                                                         │  │
│  │     Storage: Uses pathctestore for durable state      │  │
│  │     Purpose: Real-time multiplayer game engine        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘

External Services (Outside Azure):
┌────────────────────────────────────┐
│  Supabase (PostgreSQL + Realtime)  │
│  • Game data persistence           │
│  • User authentication             │
│  • Real-time broadcasts            │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Netlify (Web Hosting)             │
│  • React SPA hosting               │
│  • CDN distribution                │
│  • Environment variables           │
└────────────────────────────────────┘
```

---

## 📦 Azure Storage - pathctestore

### What It Does

**Primary Purpose:** Stores all static assets (images, videos) for the PathCTE web application.

### Containers & Content

#### 1. **careers/** - Career images and multimedia
```
careers/
  ├── software-engineer/
  │   ├── main.jpg          # Main career image
  │   ├── thumb.jpg         # Thumbnail
  │   └── main.mp4          # (optional) Day-in-life video
  ├── nurse-practitioner/
  │   └── main.jpg
  └── data-scientist/
      └── main.jpg
```

**URL Format:**
```
https://pathctestore.blob.core.windows.net/careers/software-engineer/main.jpg?{SAS_TOKEN}
```

#### 2. **pathkeys/** - Pathkey collectible artwork
```
pathkeys/
  ├── pathCTE_ArtsCommunicationsAndMediaPathkey.svg
  ├── pathCTE_BusinessAndFinancePathkey.svg
  ├── pathCTE_EducationPathkey.svg
  ├── pathCTE_HealthSciencePathkey.svg
  └── ... (30+ pathkeys)
```

**URL Format:**
```
https://pathctestore.blob.core.windows.net/pathkeys/pathCTE_HealthSciencePathkey.svg?{SAS_TOKEN}
```

**Current Status:** ✅ All 30+ pathkeys migrated from Central US to East US

#### 3. **avatars/** - User profile pictures
```
avatars/
  ├── {user-id-1}.jpg
  ├── {user-id-2}.jpg
  └── default-avatar.png
```

#### 4. **achievements/** - Achievement/badge icons
```
achievements/
  ├── first-pathkey.png
  ├── career-explorer.png
  └── quiz-master.png
```

---

## 🔐 Security & Access Control

### SAS Tokens (Shared Access Signature)

**How it works:**
- Storage account uses SAS tokens for secure, time-limited access
- Tokens grant specific permissions (read, write, list, etc.)
- Tokens embedded in URLs: `?sv=2024-11-04&ss=bfqt&sp=...`

**Current Configuration:**
```bash
Expiration: October 27, 2027 (2 years)
Permissions: Read, List (for public assets)
Protocol: HTTPS only
Services: Blob storage
```

**Environment Variables:**
```bash
# Web App (.env.local)
VITE_AZURE_STORAGE_URL=https://pathctestore.blob.core.windows.net
VITE_AZURE_STORAGE_SAS_TOKEN=sv=2024-11-04&ss=bfqt&...
VITE_AZURE_STORAGE_ACCOUNT=pathctestore

# Netlify (Production)
Same variables configured in Netlify dashboard
```

### CORS Configuration

Allows web app to access blobs:
```
Allowed Origins:
  - https://pathcte.com
  - https://*.pathcte.com
  - http://localhost:5173

Allowed Methods: GET, HEAD, OPTIONS
Max Age: 3600 seconds
```

---

## 🎮 Azure Functions - Durable Functions

### What It Does

**Primary Purpose:** Manages stateful, serverless multiplayer game sessions with persistent timers and entity-based state management.

### Storage Role

**Durable Functions State Storage:**
- Uses **pathctestore** storage account for persisting entity state
- Stores orchestrator execution history
- Maintains entity checkpoints
- Enables recovery from failures

**Storage Tables Created Automatically:**
```
pathctestore/
  ├── Tables/
  │   ├── DurableFunctionsHubInstances  # Orchestrator instances
  │   ├── DurableFunctionsHubHistory    # Execution history
  │   └── DurableFunctionsHub*          # Various state tables
  └── Blobs/
      └── durablefunctions/              # Entity state blobs
```

### How Functions Use Storage

1. **Entity State Persistence**
   ```typescript
   // Host Entity state stored in pathctestore blob
   {
     "sessionId": "abc123",
     "currentQuestionIndex": 2,
     "currentQuestionStartedAt": "2025-11-02T...",
     "playersAnswered": ["player1", "player2"]
   }
   ```

2. **Orchestrator Checkpoints**
   - Each orchestrator step checkpointed to storage
   - Enables "replay" execution model
   - Ensures exactly-once execution semantics

3. **Connection String**
   ```json
   {
     "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=pathctestore;..."
   }
   ```

---

## 🔄 Data Flow - How It All Works Together

### Game Session Creation

```
1. Teacher creates game via React app
   ↓
2. React → Supabase: Insert game_sessions record
   ↓
3. React → Azure Functions: POST /api/game/initialize
   ↓
4. Azure Functions:
   - Create orchestrator instance
   - Initialize Host Entity (state → pathctestore)
   - Initialize Player Entities (state → pathctestore)
   ↓
5. State persisted in pathctestore blobs/tables
```

### Question Timer Flow

```
1. Teacher clicks "Start Question 1"
   ↓
2. React → Azure Functions: POST /api/game/startQuestion
   ↓
3. Host Entity (reads state from pathctestore):
   - Update: current_question_index = 0
   - Update: current_question_started_at = NOW
   - Update: current_question_time_limit = 30
   - Save state → pathctestore
   ↓
4. Activity: updateGameSession
   - Write to Supabase game_sessions table
   ↓
5. Activity: broadcastQuestionStarted
   - Supabase Realtime → All connected students
   ↓
6. Students see question and timer (synced from server)
```

### Answer Submission Flow

```
1. Student clicks answer
   ↓
2. React → Azure Functions: POST /api/game/submitAnswer
   ↓
3. submitAnswerOrchestrator:

   Step A: Host Entity validates timing
   - Load state from pathctestore
   - Check: now <= startedAt + timeLimit
   - Return validation result

   Step B: Player Entity processes answer
   - Load state from pathctestore
   - Calculate score + speed bonus
   - Update answer history
   - Save state → pathctestore

   Step C: Activities persist to Supabase
   - recordAnswer → game_answers table
   - updatePlayerScore → game_players table
   ↓
4. Return result to student UI
```

### Asset Loading Flow

```
1. Dashboard loads pathkey images
   ↓
2. React calls: getPathkeyImageUrl(pathkeyId)
   ↓
3. Utility generates URL:
   https://pathctestore.blob.core.windows.net/pathkeys/{id}.svg?{SAS_TOKEN}
   ↓
4. Browser requests image from Azure Storage
   ↓
5. Azure Storage validates SAS token
   ↓
6. Image returned to browser
   ↓
7. On error: Fallback to placeholder image
```

---

## 💰 Cost Breakdown

### Azure Storage - pathctestore

**Storage Costs:**
```
Images/Assets: ~500MB = $0.01/month
Durable Functions state: ~10GB = $0.18/month
──────────────────────────────────
Total Storage: ~$0.20/month
```

**Transaction Costs:**
```
Image reads (10K/month): ~$0.01
State reads/writes (100K/month): ~$0.40
──────────────────────────────────
Total Transactions: ~$0.40/month
```

**Bandwidth:**
```
First 100GB: FREE
Typical usage: ~20GB/month = FREE
```

**pathctestore Total: ~$0.60/month**

### Azure Functions (Consumption Plan)

```
Executions (100K/month):
  - Free tier: 1M executions/month
  - Cost: $0.00

Execution time (100K × 1 second avg):
  - Free tier: 400K GB-seconds/month
  - Used: ~100K GB-seconds
  - Cost: $0.00

──────────────────────────────────
Functions Total: FREE (within limits)
```

### Azure AI Foundry

```
GPT-4o API calls (1K/month):
  - $0.03 per 1K tokens (input)
  - $0.06 per 1K tokens (output)
  - Estimated: $5-10/month

DALL-E 3 (if used):
  - $0.04 per image
  - Minimal usage

──────────────────────────────────
AI Foundry Total: ~$5-10/month
```

### Grand Total

```
Storage:    $0.60/month
Functions:  FREE
AI Foundry: $5-10/month
──────────────────────────────────
TOTAL:      ~$6-11/month
```

**Significantly cheaper than multi-region setup (~$15-20/month)**

---

## 🚀 Migration History

### Phase 1: Central US → East US (Completed ✅)

**Old Setup:**
- Storage: `pathcte` (Central US)
- AI Foundry: `Pathfinity-AI-Foundry` (East US)
- **Problem:** Cross-region latency & data transfer costs

**Migration:**
```bash
1. Created pathctestore in East US
2. Migrated all pathkey SVGs (30+ files)
3. Updated database URLs:
   - pathkeys table: image_url field
   - careers table: image_url field
4. Updated environment variables:
   - Netlify production
   - Local .env files
5. Code updates:
   - azure-storage.ts config
   - image utility functions
```

**Result:** All services now in same region (East US)

### Phase 2: Durable Functions Setup (Completed ✅)

**Created:**
- Functions project structure
- Entities (Host, Player)
- Orchestrators
- Activities
- HTTP Triggers

**Database updates:**
- Added timer tracking fields to game_sessions
- Added connection tracking to game_players
- Created backward compatibility trigger

**Status:** ✅ Code ready, awaiting deployment

---

## ✅ Current Status

### What's Working

✅ **Azure Storage (pathctestore)**
- All pathkeys migrated
- All career images uploaded
- SAS tokens configured
- Web app loading images successfully
- Production: pathcte.com using East US storage

✅ **Azure AI Foundry**
- GPT-4o accessible
- Test script confirmed connectivity
- Ready for content generation

✅ **Durable Functions Code**
- TypeScript compilation successful
- All entities implemented
- All orchestrators created
- All activities defined
- HTTP triggers configured
- Database schema aligned

### What's Pending

⏳ **Azure Functions Deployment**
- Create Function App in Azure Portal
- Deploy built code to Azure
- Configure environment variables
- Test endpoints
- Integrate with React app

⏳ **Production Testing**
- End-to-end game flow testing
- Load testing (multiple concurrent games)
- Failover testing
- Timer accuracy validation

---

## 📚 Key Documentation Files

### Configuration
- `packages/functions/DURABLE_FUNCTIONS_OVERVIEW.md` - Functions architecture
- `docs/AZURE_STORAGE_SETUP.md` - Storage configuration guide
- `docs/AZURE_EASTUS_MIGRATION.md` - Migration guide
- `packages/functions/host.json` - Functions runtime config
- `packages/functions/local.settings.json` - Local development config

### Schema
- `database/migrations/033_add_durable_functions_fields.sql` - Database changes
- `packages/shared/src/types/database.types.ts` - TypeScript types

### Services
- `packages/shared/src/services/azure-storage.service.ts` - Storage operations
- `packages/shared/src/config/azure-storage.ts` - Storage config
- `packages/functions/src/` - All Durable Functions code

---

## 🎯 Next Steps

### 1. Deploy Azure Functions (Priority 1)

```bash
# Create Function App in Azure Portal or CLI
az functionapp create \
  --resource-group Pathfinity \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name pathcte-game-functions \
  --storage-account pathctestore

# Configure app settings
az functionapp config appsettings set \
  --name pathcte-game-functions \
  --resource-group Pathfinity \
  --settings \
    SUPABASE_URL="https://your-project.supabase.co" \
    SUPABASE_SERVICE_KEY="your-service-key"

# Deploy
cd packages/functions
npm run build
func azure functionapp publish pathcte-game-functions
```

### 2. Update React App to Call Azure Functions

```typescript
// Add to .env.local
VITE_AZURE_FUNCTIONS_URL=https://pathcte-game-functions.azurewebsites.net

// Update game.service.ts
const AZURE_FUNCTIONS_URL = import.meta.env.VITE_AZURE_FUNCTIONS_URL;

// Replace local answer validation with Azure Functions call
const result = await fetch(`${AZURE_FUNCTIONS_URL}/api/game/submitAnswer`, {
  method: 'POST',
  body: JSON.stringify({ playerId, sessionId, ... })
});
```

### 3. Test & Iterate

- Test multiplayer sessions
- Verify timer persistence
- Test late join scenarios
- Test disconnect/reconnect
- Load testing

---

## 🎓 Summary

**pathctestore** is PathCTE's Azure Storage account that:

1. **Stores static assets** (pathkeys, career images, avatars)
2. **Stores Durable Functions state** (orchestrators, entities)
3. **Co-located in East US** with AI Foundry for optimal performance
4. **Costs ~$0.60/month** for storage alone

**Azure Functions** use pathctestore to:
1. Persist game session state
2. Maintain timer authority
3. Ensure reliability across server restarts
4. Enable scalable multiplayer games

**Together they provide:**
- ✅ Fast asset delivery (images)
- ✅ Persistent game state
- ✅ Server-authoritative timers
- ✅ Scalable serverless compute
- ✅ Cost-effective infrastructure (~$6-11/month total)
