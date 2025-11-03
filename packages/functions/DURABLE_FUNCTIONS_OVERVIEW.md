# Azure Durable Functions - Game Engine Architecture

## 🎯 Overview

The PathCTE game engine uses **Azure Durable Functions v3** to manage real-time multiplayer game sessions with persistent state. This provides:

- ✅ **Server-side timer authority** - No client-side timer manipulation
- ✅ **Persistent game state** - Survives server restarts
- ✅ **Automatic answer validation** - Server validates timing and correctness
- ✅ **Scalable multiplayer** - Handles many concurrent games

---

## 🏗️ Architecture Components

### 1. **Entities** (Persistent State)

**Host Entity** - One per game session
- Tracks current question and timer state
- Validates answer timing (prevents late submissions)
- Controls question progression (auto or manual)
- Stores: `current_question_index`, `current_question_started_at`, `current_question_time_limit`

**Player Entity** - One per player
- Manages individual player score and answer history
- Calculates points including speed bonuses
- Tracks connection status
- Stores: `score`, `correct_answers`, `total_answers`, `answer_history`

### 2. **Orchestrators** (Coordination Logic)

**initializeGameOrchestrator**
- Sets up Host Entity with game configuration
- Initializes all Player Entities in parallel
- Called when game is created

**submitAnswerOrchestrator**
- Validates timing with Host Entity
- Updates Player Entity with answer and score
- Runs atomically to prevent race conditions

**callHostEntity / callPlayerEntity**
- Generic wrappers for entity operations
- Used by HTTP triggers for simple operations

### 3. **Activities** (External Operations)

**broadcastQuestionStarted**
- Updates `game_sessions` table with current question info
- Broadcasts to Supabase Realtime channel for live updates

**recordAnswer**
- Inserts into `game_answers` table
- Permanent record of all player answers

**updatePlayerScore**
- Updates `game_players` table with latest score
- Broadcasts score update to player's channel

**updatePlayerStatus**
- Updates `connection_status` and `last_seen_at`
- Database trigger keeps `is_connected` in sync

**broadcastGameEnded**
- Marks session as completed
- Broadcasts final results

### 4. **HTTP Triggers** (API Endpoints)

```
POST /api/game/initialize        - Create new game session
POST /api/game/startQuestion     - Start a specific question
POST /api/game/advanceQuestion   - Move to next question
POST /api/game/submitAnswer      - Submit player answer
GET  /api/game/timerState/{id}   - Get current timer state
```

---

## 🔄 How It Works - Question Flow

### Starting a Question

```
1. Teacher clicks "Start Question 1"
   ↓
2. HTTP Trigger: POST /api/game/startQuestion
   ↓
3. Orchestrator calls Host Entity
   ↓
4. Host Entity updates state:
   - current_question_index = 0
   - current_question_started_at = NOW
   - current_question_time_limit = 30
   ↓
5. Activity: broadcastQuestionStarted
   - Updates game_sessions table
   - Broadcasts to Supabase Realtime
   ↓
6. Students receive question and timer starts
```

### Submitting an Answer

```
1. Student selects answer
   ↓
2. HTTP Trigger: POST /api/game/submitAnswer
   ↓
3. submitAnswerOrchestrator runs:

   Step 1: Call Host Entity.validateAnswerTiming
   - Checks: submittedAt <= startedAt + timeLimit
   - Returns: { valid: true/false, elapsed: seconds }

   Step 2: Call Player Entity.submitAnswer
   - If valid: Calculate score with speed bonus
   - If invalid: Reject with reason
   - Update player state atomically
   ↓
4. Activities run (if valid):
   - recordAnswer (writes to game_answers)
   - updatePlayerScore (updates game_players)
   ↓
5. Return result to student
   - isCorrect: boolean
   - pointsEarned: number
   - speedBonus: number
```

---

## 🗃️ Database Schema Integration

### Tables Used

**game_sessions**
```sql
id, game_code, host_id, question_set_id
status, started_at, ended_at

-- Timer tracking (Durable Functions)
current_question_index          INTEGER
current_question_started_at     TIMESTAMPTZ
current_question_time_limit     INTEGER
```

**game_players**
```sql
id, game_session_id, user_id, display_name
score, correct_answers, total_answers

-- Connection tracking (Durable Functions)
is_connected           BOOLEAN    -- Legacy field
connection_status      TEXT       -- 'active' | 'disconnected' (new)
last_seen_at          TIMESTAMPTZ -- Activity tracking (new)
```

**game_answers**
```sql
id, player_id, game_session_id, question_id
selected_option_index, is_correct
time_taken_ms, points_earned, answered_at
```

### Backward Compatibility

✅ **Database trigger automatically syncs fields:**
- When `connection_status = 'active'` → sets `is_connected = true`
- When `connection_status = 'disconnected'` → sets `is_connected = false`

✅ **Existing game.service.ts continues using:**
- `is_connected` boolean (unchanged)
- `game_answers` table (unchanged)
- `time_taken_ms` field (unchanged)

---

## 🎮 Game Modes Support

### Multiplayer Mode
```typescript
progressionControl: 'manual'  // Teacher clicks to advance
allowLateJoin: true           // Students can join mid-game
```

### Solo Mode (Career Quest)
```typescript
progressionControl: 'auto'    // Auto-advance after timer
allowLateJoin: false          // No joining once started
sessionType: 'solo'
```

---

## 🔒 Security Features

1. **Server-side timer validation**
   - Host Entity is single source of truth
   - Client cannot manipulate timer or submit late

2. **Atomic score updates**
   - Player Entity ensures consistent state
   - No race conditions in scoring

3. **Answer key protection**
   - Questions sent to students WITHOUT `is_correct` flags
   - Server validates correctness from database

4. **RLS policies**
   - Existing Supabase Row Level Security unchanged
   - Activities use service role key

---

## 📊 Speed Bonus Calculation

```typescript
// Up to 20% bonus for fast answers
speedBonus = basePoints * 0.2 * (1 - elapsed/timeLimit)

Example:
- Question: 100 points, 30 second timer
- Answer in 5 seconds:
  speedRatio = 1 - (5/30) = 0.833
  speedBonus = 100 * 0.2 * 0.833 = 16.6 points
  total = 116 points

- Answer in 29 seconds:
  speedRatio = 1 - (29/30) = 0.033
  speedBonus = 100 * 0.2 * 0.033 = 0.6 points
  total = 100 points
```

---

## 🚀 Deployment Requirements

### Environment Variables (local.settings.json)
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "SUPABASE_URL": "https://your-project.supabase.co",
    "SUPABASE_SERVICE_KEY": "your-service-role-key"
  }
}
```

### Azure Resources Needed
- ✅ Azure Functions App (Node.js 20)
- ✅ Azure Storage Account (for Durable Functions state)
- ✅ Supabase Database (already configured)

---

## 🧪 Testing Locally

### 1. Install Azure Functions Core Tools
```bash
npm install -g azure-functions-core-tools@4
```

### 2. Start Azurite (Storage Emulator)
```bash
# Install if needed
npm install -g azurite

# Run in separate terminal
azurite --silent --location /tmp/azurite --debug /tmp/azurite-debug.log
```

### 3. Run Functions Locally
```bash
cd packages/functions
npm run build
npm start
```

### 4. Test Endpoints
```bash
# Initialize game
curl -X POST http://localhost:7071/api/game/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-id",
    "questionSetId": "test-qset-id",
    "questions": [...],
    "progressionControl": "manual",
    "allowLateJoin": false,
    "players": [
      {
        "id": "player-1",
        "userId": "user-1",
        "displayName": "Test Player"
      }
    ]
  }'
```

---

## 📝 Migration Summary

**Database Changes:**
- ✅ Added 4 new fields (2 to game_sessions, 2 to game_players)
- ✅ Created sync trigger for backward compatibility
- ✅ Zero impact on existing code

**Code Changes:**
- ✅ Fixed Activities to use correct table names
- ✅ Fixed field name mappings (time_taken_ms, game_session_id)
- ✅ Updated TypeScript types
- ✅ All builds passing

**Status:** Ready for local testing!
