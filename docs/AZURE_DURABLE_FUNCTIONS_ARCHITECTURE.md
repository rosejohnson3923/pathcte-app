# Azure Durable Functions Architecture for PathCTE Game Engine

**Version:** 1.0
**Date:** 2025-10-31
**Status:** Design Phase

## Overview

PathCTE's multiplayer game engine will use Azure Durable Functions to provide stateful, reliable game orchestration that persists across client disconnections and server restarts. This hybrid architecture combines Azure's serverless orchestration with Supabase's database and realtime capabilities.

## Architecture Principles

1. **Durable State**: Game state persists in Azure Storage, surviving restarts and failures
2. **Single-Threaded Entities**: Each Host and Player is a durable entity with guaranteed sequential execution
3. **Event-Driven**: Game progression driven by events (timer expiry, answer submission, etc.)
4. **Hybrid Data Layer**: Azure for orchestration state, Supabase for persistent game data
5. **Realtime Sync**: Azure Functions broadcast to Supabase Realtime for instant UI updates

## System Components

### 1. Orchestrator Function: Game Session Manager

**Purpose**: Manages entire game lifecycle from creation to completion

**State**:
```typescript
interface GameSessionState {
  sessionId: string;
  status: 'waiting' | 'active' | 'ended';
  hostEntityId: string;
  playerEntityIds: string[];
  createdAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
}
```

**Operations**:
- `createGameSession(params)` - Initialize game, spawn Host and Player entities
- `startGame()` - Transition from waiting to active, signal Host entity to start first question
- `endGame()` - Calculate final scores, award pathkeys, transition to ended
- `handlePlayerJoin(playerId)` - Spawn new Player entity, handle late join
- `handlePlayerLeave(playerId)` - Mark player as disconnected, maintain state

**Lifecycle**:
```typescript
export const gameSessionOrchestrator = orchestrator(function* (context) {
  const { sessionId, hostId, questionSetId, gameMode, settings } = context.df.getInput();

  // 1. Initialize game state
  const state: GameSessionState = {
    sessionId,
    status: 'waiting',
    hostEntityId: new EntityId("HostEntity", sessionId),
    playerEntityIds: [],
    createdAt: context.df.currentUtcDateTime,
    startedAt: null,
    endedAt: null
  };

  // 2. Create Host entity
  yield context.df.callEntity(state.hostEntityId, "initialize", {
    sessionId,
    questionSetId,
    progressionControl: settings.progressionControl,
    allowLateJoin: settings.allowLateJoin
  });

  // 3. Wait for players to join (in lobby)
  const playersReady = yield context.df.waitForExternalEvent("playersReady");

  // 4. Wait for host to start game
  yield context.df.waitForExternalEvent("startGame");
  state.status = 'active';
  state.startedAt = context.df.currentUtcDateTime;

  // 5. Signal Host entity to begin first question
  yield context.df.callEntity(state.hostEntityId, "startQuestion", 0);

  // 6. Monitor game progress
  const tasks = [];

  // Task 1: Wait for game completion
  tasks.push(context.df.waitForExternalEvent("gameEnded"));

  // Task 2: Handle player joins during game (if allowed)
  if (settings.allowLateJoin) {
    tasks.push(context.df.waitForExternalEvent("playerJoined"));
  }

  // Task 3: 2-hour timeout safety valve
  const timeout = context.df.createTimer(
    new Date(context.df.currentUtcDateTime.getTime() + 2 * 60 * 60 * 1000)
  );
  tasks.push(timeout);

  const winner = yield context.df.Task.any(tasks);

  // 7. Game ended - finalize
  state.status = 'ended';
  state.endedAt = context.df.currentUtcDateTime;

  // 8. Calculate placements and award pathkeys
  yield context.df.callActivity("finalizeGameResults", sessionId);

  // 9. Notify all clients via Supabase Realtime
  yield context.df.callActivity("broadcastGameEnded", sessionId);

  // 10. Cleanup entities (optional - state remains for replay/history)
  // yield context.df.callEntity(state.hostEntityId, "cleanup");

  return state;
});
```

---

### 2. Host Entity: Timer & Question Authority

**Purpose**: Single source of truth for current question, timer state, and progression

**State**:
```typescript
interface HostEntityState {
  sessionId: string;
  questionSetId: string;
  questions: Question[];

  currentQuestionIndex: number;
  currentQuestionStartedAt: Date | null;
  currentQuestionTimeLimit: number;

  progressionControl: 'manual' | 'auto';
  allowLateJoin: boolean;

  timerHandle: any | null; // Durable timer handle
  playersAnswered: Set<string>; // Track who answered current question
}
```

**Operations**:

#### `initialize(params)`
```typescript
context.df.dispatchOperation("initialize", function* (params) {
  // Load questions from Supabase
  const questions = yield context.df.callActivity("loadQuestions", params.questionSetId);

  state.sessionId = params.sessionId;
  state.questionSetId = params.questionSetId;
  state.questions = questions;
  state.currentQuestionIndex = -1;
  state.progressionControl = params.progressionControl;
  state.allowLateJoin = params.allowLateJoin;
  state.playersAnswered = new Set();
});
```

#### `startQuestion(questionIndex)`
```typescript
context.df.dispatchOperation("startQuestion", function* (questionIndex) {
  // Cancel existing timer if any
  if (state.timerHandle) {
    state.timerHandle.cancel();
  }

  // Update state
  state.currentQuestionIndex = questionIndex;
  state.currentQuestionStartedAt = context.df.currentUtcDateTime;
  state.currentQuestionTimeLimit = state.questions[questionIndex].time_limit_seconds;
  state.playersAnswered.clear();

  // Persist to Supabase for realtime sync
  yield context.df.callActivity("updateGameSession", {
    sessionId: state.sessionId,
    currentQuestionIndex: questionIndex,
    currentQuestionStartedAt: state.currentQuestionStartedAt,
    currentQuestionTimeLimit: state.currentQuestionTimeLimit
  });

  // Broadcast to all clients
  yield context.df.callActivity("broadcastQuestionStarted", {
    sessionId: state.sessionId,
    questionIndex,
    question: state.questions[questionIndex],
    startedAt: state.currentQuestionStartedAt,
    timeLimit: state.currentQuestionTimeLimit
  });

  // Schedule auto-advance timer if in auto mode
  if (state.progressionControl === 'auto') {
    const advanceAt = new Date(
      state.currentQuestionStartedAt.getTime() +
      state.currentQuestionTimeLimit * 1000
    );

    state.timerHandle = context.df.createTimer(advanceAt);
    yield state.timerHandle;

    // Timer expired - auto-advance
    console.log('[HostEntity] Timer expired, auto-advancing');
    yield context.df.callSelf("advanceQuestion");
  }
});
```

#### `advanceQuestion()`
```typescript
context.df.dispatchOperation("advanceQuestion", function* () {
  const nextIndex = state.currentQuestionIndex + 1;

  if (nextIndex < state.questions.length) {
    // Move to next question
    yield context.df.callSelf("startQuestion", nextIndex);
  } else {
    // Game complete - signal orchestrator
    yield context.df.signalEntity(
      new EntityId("GameSessionOrchestrator", state.sessionId),
      "gameEnded"
    );
  }
});
```

#### `validateAnswerTiming(playerId, submittedAt)`
```typescript
context.df.dispatchOperation("validateAnswerTiming", function* (playerId, submittedAt) {
  if (!state.currentQuestionStartedAt) {
    return { valid: false, reason: "Question not started" };
  }

  const elapsed = (submittedAt - state.currentQuestionStartedAt.getTime()) / 1000;
  const isValid = elapsed >= 0 && elapsed <= state.currentQuestionTimeLimit;

  if (isValid) {
    // Mark player as answered
    state.playersAnswered.add(playerId);

    // Broadcast updated answered count
    yield context.df.callActivity("broadcastPlayerAnswered", {
      sessionId: state.sessionId,
      playerId,
      answeredCount: state.playersAnswered.size
    });
  }

  return {
    valid: isValid,
    elapsed,
    timeLimit: state.currentQuestionTimeLimit,
    reason: isValid ? null : "Answer submitted after time limit"
  };
});
```

#### `getTimerState()`
```typescript
context.df.dispatchOperation("getTimerState", function* () {
  // For late joins - return current timer state
  if (!state.currentQuestionStartedAt) {
    return null;
  }

  return {
    questionIndex: state.currentQuestionIndex,
    question: state.questions[state.currentQuestionIndex],
    startedAt: state.currentQuestionStartedAt,
    timeLimit: state.currentQuestionTimeLimit,
    elapsed: (context.df.currentUtcDateTime.getTime() - state.currentQuestionStartedAt.getTime()) / 1000
  };
});
```

---

### 3. Player Entity: Answer Processing & Scoring

**Purpose**: Manages individual player state, processes answers, calculates scores

**State**:
```typescript
interface PlayerEntityState {
  playerId: string;
  sessionId: string;
  userId: string | null;
  displayName: string;

  score: number;
  correctAnswers: number;
  totalAnswers: number;
  answerHistory: AnswerRecord[];

  connectionStatus: 'active' | 'disconnected';
  lastSeenAt: Date;
  joinedAt: Date;
}

interface AnswerRecord {
  questionIndex: number;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  submittedAt: Date;
  timeElapsed: number;
  pointsEarned: number;
}
```

**Operations**:

#### `initialize(params)`
```typescript
context.df.dispatchOperation("initialize", function* (params) {
  state.playerId = params.playerId;
  state.sessionId = params.sessionId;
  state.userId = params.userId;
  state.displayName = params.displayName;
  state.score = 0;
  state.correctAnswers = 0;
  state.totalAnswers = 0;
  state.answerHistory = [];
  state.connectionStatus = 'active';
  state.joinedAt = context.df.currentUtcDateTime;
  state.lastSeenAt = context.df.currentUtcDateTime;
});
```

#### `submitAnswer(questionIndex, selectedOptionIndex, submittedAt)`
```typescript
context.df.dispatchOperation("submitAnswer", function* (questionIndex, selectedOptionIndex, submittedAt) {
  // 1. Validate timing with Host Entity
  const hostEntityId = new EntityId("HostEntity", state.sessionId);
  const validation = yield context.df.callEntity(
    hostEntityId,
    "validateAnswerTiming",
    state.playerId,
    submittedAt
  );

  if (!validation.valid) {
    return {
      success: false,
      reason: validation.reason
    };
  }

  // 2. Get question details from activity (or cache in entity)
  const question = yield context.df.callActivity("getQuestion", {
    sessionId: state.sessionId,
    questionIndex
  });

  // 3. Check correctness
  const isCorrect = question.options[selectedOptionIndex].is_correct;

  // 4. Calculate points (base points + speed bonus)
  const speedBonus = calculateSpeedBonus(
    validation.elapsed,
    validation.timeLimit,
    question.points
  );
  const pointsEarned = isCorrect ? question.points + speedBonus : 0;

  // 5. Update state
  state.score += pointsEarned;
  state.totalAnswers += 1;
  if (isCorrect) state.correctAnswers += 1;

  state.answerHistory.push({
    questionIndex,
    questionId: question.id,
    selectedOptionIndex,
    isCorrect,
    submittedAt: new Date(submittedAt),
    timeElapsed: validation.elapsed,
    pointsEarned
  });

  // 6. Persist to Supabase
  yield context.df.callActivity("recordAnswer", {
    playerId: state.playerId,
    sessionId: state.sessionId,
    questionId: question.id,
    selectedOptionIndex,
    isCorrect,
    timeElapsed: validation.elapsed,
    pointsEarned
  });

  // 7. Update player score in Supabase
  yield context.df.callActivity("updatePlayerScore", {
    playerId: state.playerId,
    score: state.score,
    correctAnswers: state.correctAnswers,
    totalAnswers: state.totalAnswers
  });

  return {
    success: true,
    isCorrect,
    pointsEarned,
    newScore: state.score
  };
});
```

#### `handleDisconnect()`
```typescript
context.df.dispatchOperation("handleDisconnect", function* () {
  state.connectionStatus = 'disconnected';
  state.lastSeenAt = context.df.currentUtcDateTime;

  // Persist disconnection
  yield context.df.callActivity("updatePlayerStatus", {
    playerId: state.playerId,
    status: 'disconnected'
  });

  console.log(`[PlayerEntity] Player ${state.displayName} disconnected`);
});
```

#### `handleReconnect()`
```typescript
context.df.dispatchOperation("handleReconnect", function* () {
  state.connectionStatus = 'active';
  state.lastSeenAt = context.df.currentUtcDateTime;

  // Persist reconnection
  yield context.df.callActivity("updatePlayerStatus", {
    playerId: state.playerId,
    status: 'active'
  });

  // Get current timer state from Host Entity for sync
  const hostEntityId = new EntityId("HostEntity", state.sessionId);
  const timerState = yield context.df.callEntity(hostEntityId, "getTimerState");

  console.log(`[PlayerEntity] Player ${state.displayName} reconnected`);

  return {
    playerState: state,
    timerState
  };
});
```

#### `getState()`
```typescript
context.df.dispatchOperation("getState", function* () {
  state.lastSeenAt = context.df.currentUtcDateTime;
  return state;
});
```

---

## Activity Functions

Activity functions handle external I/O operations (Supabase queries, broadcasts, etc.)

### `loadQuestions.ts`
```typescript
export const loadQuestions = async (questionSetId: string): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('question_set_id', questionSetId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
};
```

### `updateGameSession.ts`
```typescript
export const updateGameSession = async (params: {
  sessionId: string;
  currentQuestionIndex: number;
  currentQuestionStartedAt: Date;
  currentQuestionTimeLimit: number;
}) => {
  await supabase
    .from('game_sessions')
    .update({
      current_question_index: params.currentQuestionIndex,
      current_question_started_at: params.currentQuestionStartedAt.toISOString(),
      current_question_time_limit: params.currentQuestionTimeLimit
    })
    .eq('id', params.sessionId);
};
```

### `broadcastQuestionStarted.ts`
```typescript
export const broadcastQuestionStarted = async (params: {
  sessionId: string;
  questionIndex: number;
  question: Question;
  startedAt: Date;
  timeLimit: number;
}) => {
  await supabase.channel(`game:${params.sessionId}`)
    .send({
      type: 'broadcast',
      event: 'question_started',
      payload: params
    });
};
```

### `recordAnswer.ts`
```typescript
export const recordAnswer = async (params: {
  playerId: string;
  sessionId: string;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeElapsed: number;
  pointsEarned: number;
}) => {
  await supabase
    .from('player_answers')
    .insert({
      player_id: params.playerId,
      session_id: params.sessionId,
      question_id: params.questionId,
      selected_option_index: params.selectedOptionIndex,
      is_correct: params.isCorrect,
      time_elapsed_seconds: params.timeElapsed,
      points_earned: params.pointsEarned,
      answered_at: new Date()
    });
};
```

---

## HTTP Triggers

Client applications communicate with Azure Functions via HTTP endpoints

### `POST /api/game/start`
```typescript
export const startGame = async (req: HttpRequest, context: InvocationContext) => {
  const { sessionId } = await req.json();

  // Get orchestrator instance
  const client = df.getClient(context);

  // Raise external event to orchestrator
  await client.raiseEvent(sessionId, "startGame");

  return { success: true };
};
```

### `POST /api/game/submitAnswer`
```typescript
export const submitAnswer = async (req: HttpRequest, context: InvocationContext) => {
  const { playerId, sessionId, questionIndex, selectedOptionIndex } = await req.json();

  const client = df.getClient(context);
  const entityId = new EntityId("PlayerEntity", playerId);

  // Call Player Entity
  const result = await client.callEntity(
    entityId,
    "submitAnswer",
    questionIndex,
    selectedOptionIndex,
    Date.now()
  );

  return result;
};
```

### `POST /api/game/advanceQuestion`
```typescript
export const advanceQuestion = async (req: HttpRequest, context: InvocationContext) => {
  const { sessionId } = await req.json();

  const client = df.getClient(context);
  const hostEntityId = new EntityId("HostEntity", sessionId);

  // Call Host Entity to advance
  await client.callEntity(hostEntityId, "advanceQuestion");

  return { success: true };
};
```

### `GET /api/game/timerState/:sessionId`
```typescript
export const getTimerState = async (req: HttpRequest, context: InvocationContext) => {
  const sessionId = req.params.sessionId;

  const client = df.getClient(context);
  const hostEntityId = new EntityId("HostEntity", sessionId);

  const timerState = await client.callEntity(hostEntityId, "getTimerState");

  return timerState;
};
```

### `GET /api/player/reconnect/:playerId`
```typescript
export const reconnectPlayer = async (req: HttpRequest, context: InvocationContext) => {
  const playerId = req.params.playerId;

  const client = df.getClient(context);
  const playerEntityId = new EntityId("PlayerEntity", playerId);

  const state = await client.callEntity(playerEntityId, "handleReconnect");

  return state;
};
```

---

## Database Schema Updates

Add new columns to support agent-based architecture:

```sql
-- game_sessions table
ALTER TABLE game_sessions
ADD COLUMN current_question_started_at TIMESTAMPTZ,
ADD COLUMN current_question_time_limit INTEGER,
ADD COLUMN orchestrator_instance_id TEXT,
ADD COLUMN host_entity_id TEXT;

-- game_players table
ALTER TABLE game_players
ADD COLUMN player_entity_id TEXT,
ADD COLUMN connection_status TEXT DEFAULT 'active' CHECK (connection_status IN ('active', 'disconnected')),
ADD COLUMN last_seen_at TIMESTAMPTZ DEFAULT NOW();

-- player_answers table (if not exists)
CREATE TABLE IF NOT EXISTS player_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES game_players(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  selected_option_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_elapsed_seconds DECIMAL(5,2) NOT NULL,
  points_earned INTEGER NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_player_answers_player ON player_answers(player_id);
CREATE INDEX idx_player_answers_session ON player_answers(session_id);
```

---

## Client Integration

### Web Client Changes

**1. Start Game Flow**
```typescript
// Teacher clicks "Start Game"
const handleStartGame = async () => {
  // Call Azure Function
  const response = await fetch(`${AZURE_FUNCTIONS_URL}/api/game/start`, {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
    headers: { 'Content-Type': 'application/json' }
  });

  // UI will update via Supabase Realtime broadcast from Host Entity
};
```

**2. Submit Answer Flow**
```typescript
// Student clicks answer
const handleAnswerSubmit = async (selectedIndex: number) => {
  const response = await fetch(`${AZURE_FUNCTIONS_URL}/api/game/submitAnswer`, {
    method: 'POST',
    body: JSON.stringify({
      playerId: currentPlayer.id,
      sessionId,
      questionIndex: currentQuestionIndex,
      selectedOptionIndex: selectedIndex
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.json();

  if (result.success) {
    // Show feedback
    toast.success(`${result.isCorrect ? 'Correct!' : 'Incorrect'} +${result.pointsEarned} points`);
  }
};
```

**3. Timer Display (Late Join Sync)**
```typescript
// Calculate remaining time from server timestamp
useEffect(() => {
  const syncTimer = async () => {
    const response = await fetch(`${AZURE_FUNCTIONS_URL}/api/game/timerState/${sessionId}`);
    const timerState = await response.json();

    if (timerState) {
      const elapsed = timerState.elapsed;
      const remaining = Math.max(0, timerState.timeLimit - elapsed);
      setTimeRemaining(remaining);
    }
  };

  syncTimer();
  const interval = setInterval(syncTimer, 5000); // Re-sync every 5s
  return () => clearInterval(interval);
}, [sessionId]);
```

**4. Realtime Listeners (No Change)**
```typescript
// Continue using Supabase Realtime for instant UI updates
useEffect(() => {
  const channel = supabase.channel(`game:${sessionId}`)
    .on('broadcast', { event: 'question_started' }, (payload) => {
      // Update UI with new question
    })
    .on('broadcast', { event: 'player_answered' }, (payload) => {
      // Update player list
    })
    .subscribe();

  return () => channel.unsubscribe();
}, [sessionId]);
```

---

## Deployment Configuration

### `host.json`
```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": "PathCTEGameHub",
      "storageProvider": {
        "type": "azure_storage",
        "connectionStringName": "AzureWebJobsStorage"
      },
      "maxConcurrentActivityFunctions": 100,
      "maxConcurrentOrchestratorFunctions": 50
    }
  },
  "logging": {
    "logLevel": {
      "default": "Information",
      "Host": "Warning",
      "Function": "Information"
    }
  }
}
```

### `local.settings.json` (template)
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "SUPABASE_URL": "https://your-project.supabase.co",
    "SUPABASE_SERVICE_KEY": "your-service-key",
    "AZURE_STORAGE_CONNECTION_STRING": "your-connection-string"
  }
}
```

### Azure Configuration (Production)
```bash
# Resource Group: Pathfinity (existing)
# Location: Central US

# Create Function App
az functionapp create \
  --resource-group Pathfinity \
  --consumption-plan-location centralus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name pathcte-game-functions \
  --storage-account pathcte

# Configure app settings
az functionapp config appsettings set \
  --name pathcte-game-functions \
  --resource-group Pathfinity \
  --settings \
    SUPABASE_URL="your-supabase-url" \
    SUPABASE_SERVICE_KEY="your-service-key"
```

---

## Testing Strategy

### Unit Tests
- Test individual entity operations (submitAnswer, startQuestion, etc.)
- Mock external dependencies (Supabase, timers)

### Integration Tests
- Test full game flow: create → join → start → answer → end
- Test late join scenario
- Test disconnect/reconnect scenario
- Test auto vs manual progression

### Load Tests
- 50 concurrent games with 30 players each
- Measure entity response times
- Monitor Azure Storage throttling

---

## Edge Cases & Handling

### Late Join
1. Player calls `/api/player/join/{sessionId}` mid-game
2. Check `allow_late_join` flag
3. Spawn Player Entity
4. Call Host Entity `getTimerState()` to sync current question
5. Return full state to player UI

### Early Drop
1. Player disconnects (browser closed, network loss)
2. Supabase Realtime detects presence loss
3. Client calls `/api/player/disconnect/{playerId}`
4. Player Entity updates state, persists to DB
5. Player state remains in entity - can reconnect later

### Reconnect
1. Player returns to game page
2. Check if Player Entity exists for their ID
3. Call `/api/player/reconnect/{playerId}`
4. Entity returns full state + current timer state
5. UI syncs to current question

### All Players Disconnect
1. Host Entity continues running (durable state)
2. Timer continues in auto mode
3. Game can be resumed if players rejoin
4. Orchestrator timeout (2 hours) eventually cleans up

### Host Disconnects (Teacher leaves)
1. Host Entity continues managing game
2. Auto mode: game progresses automatically
3. Manual mode: game pauses, waiting for host to return
4. Students see "Waiting for teacher..." if manual mode

---

## Benefits Summary

| Issue | Old Architecture | New Architecture |
|-------|-----------------|------------------|
| Timer persistence | Lost on navigation | Persists in Host Entity |
| Late joins | Out of sync | Entity provides current state |
| Disconnects | State lost | Entity preserves state |
| Race conditions | Frequent | Single-threaded entity prevents |
| Multi-client sync | Manual coordination | Host Entity is authority |
| Scalability | Limited | Serverless auto-scaling |
| Reliability | Client-dependent | Durable, fault-tolerant |

---

## Cost Estimation

**Azure Functions Consumption Plan:**
- Orchestrator executions: ~10 per game
- Entity operations: ~50-100 per game (depending on player count)
- Storage transactions: ~500 per game

**Estimated cost per game:**
- ~$0.01 - $0.02 per game session
- Monthly (1000 games): ~$10-20

**Storage:**
- Entity state: ~10KB per game
- Monthly (1000 games): <1GB = $0.02

**Total estimated**: ~$10-25/month for 1000 games

---

## Next Steps

1. ✅ Design architecture (this document)
2. ⏳ Set up Azure Functions project structure
3. ⏳ Implement Orchestrator and entities
4. ⏳ Create HTTP triggers
5. ⏳ Update database schema
6. ⏳ Integrate with web client
7. ⏳ Deploy to Pathfinity resource group
8. ⏳ Test and iterate

---

## References

- [Azure Durable Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/durable/)
- [Durable Entities Guide](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-entities)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
