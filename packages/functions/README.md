# PathCTE Azure Durable Functions

Game engine orchestration using Azure Durable Functions for reliable, stateful multiplayer game management.

## Architecture

### Durable Entities
- **HostEntity**: Timer authority and question progression control
- **PlayerEntity**: Answer processing and scoring

### Orchestrator
- **GameSessionOrchestrator**: Manages game lifecycle from creation to completion

### HTTP Triggers
- POST `/api/game/start` - Start game session
- POST `/api/game/submitAnswer` - Submit player answer
- POST `/api/game/advanceQuestion` - Advance to next question (manual mode)
- GET `/api/game/timerState/:sessionId` - Get current timer state for sync
- GET `/api/player/reconnect/:playerId` - Reconnect player and sync state

## Benefits

| Feature | Old (Client-side) | New (Durable Functions) |
|---------|-------------------|-------------------------|
| Timer persistence | Lost on refresh | Persists in Host Entity |
| Late joins | Out of sync | Entity provides current state |
| Disconnects | State lost | Entity preserves state |
| Race conditions | Frequent | Single-threaded entity prevents |
| Multi-client sync | Manual coordination | Host Entity is authority |
| Scalability | Limited | Serverless auto-scaling |

## Local Development

### Prerequisites
1. Node.js 18+
2. Azure Functions Core Tools v4
3. Azurite (Azure Storage Emulator)

### Setup
```bash
# Install dependencies
npm install

# Start Azurite (in separate terminal)
azurite

# Start functions locally
npm start
```

### Environment Variables
Copy `local.settings.json.example` and fill in:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key (for server-side operations)

## Deployment

Deploy to Azure:
```bash
# Build
npm run build

# Deploy (requires Azure CLI)
func azure functionapp publish pathcte-game-functions
```

## Project Structure
```
packages/functions/
├── src/
│   ├── entities/          # Durable entities
│   │   ├── HostEntity.ts
│   │   └── PlayerEntity.ts
│   ├── orchestrators/     # Orchestrators
│   │   └── GameSessionOrchestrator.ts
│   ├── activities/        # Activity functions
│   │   ├── loadQuestions.ts
│   │   ├── updateGameSession.ts
│   │   ├── broadcastQuestionStarted.ts
│   │   └── recordAnswer.ts
│   └── http/              # HTTP triggers
│       ├── startGame.ts
│       ├── submitAnswer.ts
│       ├── advanceQuestion.ts
│       └── getTimerState.ts
├── host.json
├── local.settings.json
└── package.json
```

## Testing

Test with the web client:
1. Start functions locally: `npm start` (runs on http://localhost:7071)
2. Update web client `VITE_FUNCTIONS_URL=http://localhost:7071`
3. Create a game and test timer persistence by refreshing browser

## Cost Estimation

Azure Functions Consumption Plan:
- Orchestrator executions: ~10 per game
- Entity operations: ~50-100 per game
- Storage transactions: ~500 per game

**Estimated cost:** ~$0.01-0.02 per game session
**Monthly (1000 games):** ~$10-20
