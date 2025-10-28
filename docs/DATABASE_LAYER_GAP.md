# Database & Data Layer - Gap Analysis
**Current Status:** 95% Complete
**Date:** October 27, 2025

---

## What We Have (95%)

### ✅ Generic CRUD Service (100%)
**File:** `packages/shared/src/services/supabase.service.ts`

**Methods Implemented:**
```typescript
✅ fetchOne()         - Fetch single record by ID
✅ fetchMany()        - Fetch multiple with filters/ordering/pagination
✅ insertOne()        - Insert single record
✅ insertMany()       - Insert multiple records
✅ updateOne()        - Update single record by ID
✅ updateMany()       - Update multiple with filters
✅ deleteOne()        - Delete single record by ID
✅ deleteMany()       - Delete multiple with filters
✅ count()            - Count records with filters
✅ search()           - Full-text search
✅ rpc()              - Call database functions
✅ subscribeToTable() - Real-time subscriptions
✅ unsubscribe()      - Unsubscribe from channels
```

### ✅ Database Schema (100%)
- 14 migrations successfully applied
- All tables with Row Level Security (RLS)
- Database functions (7 total)
- Database triggers (9 total)
- Complete TypeScript types

### ✅ React Query Hooks (100%)
**File:** `packages/web/src/hooks/useSupabase.ts`

```typescript
✅ useFetchOne()   - Query single record
✅ useFetchMany()  - Query multiple records
✅ useInsertOne()  - Mutation for insert
✅ useUpdateOne()  - Mutation for update
✅ useDeleteOne()  - Mutation for delete
✅ useCount()      - Query count
✅ useRPC()        - Call RPC functions
```

### ✅ Domain-Specific Hooks (80%)
```typescript
✅ useAuth()              - Authentication (auth.ts)
✅ usePathkeys()          - Pathkey queries (pathkeys.ts)
✅ useUserPathkeys()      - User collection
✅ useTokens()            - Token economy (tokens.ts)
✅ useGameSessions()      - Game sessions (gameSessions.ts)
✅ useUserGamePlayers()   - Player records
✅ useGameCount()         - Games played count
```

---

## What's Missing (5%)

### 1. ❌ Specialized Service Layers

#### Game Service (Not Created)
**Should Be:** `packages/shared/src/services/game.service.ts`

**Missing Methods:**
```typescript
// Game Session Management
createGameSession(hostId: string, questionSetId: string, settings: GameSettings): Promise<GameSession>
joinGame(gameCode: string, userId: string, displayName: string): Promise<GamePlayer>
startGame(sessionId: string): Promise<void>
endGame(sessionId: string): Promise<GameResults>
getActiveGames(): Promise<GameSession[]>

// Player Management
kickPlayer(sessionId: string, playerId: string): Promise<void>
updatePlayerStatus(playerId: string, isConnected: boolean): Promise<void>
getSessionPlayers(sessionId: string): Promise<GamePlayer[]>

// Game State
submitAnswer(playerId: string, questionId: string, answerIndex: number, timeTaken: number): Promise<void>
advanceToNextQuestion(sessionId: string): Promise<void>
calculateScores(sessionId: string): Promise<PlayerScore[]>
awardRewards(sessionId: string): Promise<void>

// Game Code
generateGameCode(): Promise<string>
validateGameCode(code: string): Promise<boolean>
findGameByCode(code: string): Promise<GameSession | null>
```

**Why It's Needed:**
- Complex game logic needs encapsulation
- Multiple operations need to be atomic
- Game state transitions need coordination
- Makes UI components simpler

**Estimated Time:** 3-4 hours

---

#### Career Service (Not Created)
**Should Be:** `packages/shared/src/services/career.service.ts`

**Missing Methods:**
```typescript
// Career Search & Discovery
searchCareers(query: string, filters?: CareerFilters): Promise<Career[]>
getCareersByIndustry(industry: string): Promise<Career[]>
getCareersByCluster(cluster: string): Promise<Career[]>
getPopularCareers(limit?: number): Promise<Career[]>
getRelatedCareers(careerId: string): Promise<Career[]>

// Career Details
getCareerWithPathkeys(careerId: string): Promise<CareerWithPathkeys>
getCareersByEducationLevel(level: string): Promise<Career[]>
getCareersBySalaryRange(min: number, max: number): Promise<Career[]>

// Career Analytics
trackCareerView(userId: string, careerId: string): Promise<void>
getCareerViewCount(careerId: string): Promise<number>
getUserExploredCareers(userId: string): Promise<Career[]>
```

**Why It's Needed:**
- Complex career filtering logic
- O*NET data processing
- Related career recommendations
- Search optimization

**Estimated Time:** 2-3 hours

---

#### Question Service (Not Created)
**Should Be:** `packages/shared/src/services/question.service.ts`

**Missing Methods:**
```typescript
// Question Set Management
createQuestionSet(data: CreateQuestionSetData): Promise<QuestionSet>
duplicateQuestionSet(setId: string, newTitle: string): Promise<QuestionSet>
publishQuestionSet(setId: string): Promise<void>
unpublishQuestionSet(setId: string): Promise<void>

// Question Management
addQuestionToSet(setId: string, question: CreateQuestionData): Promise<Question>
updateQuestionOrder(setId: string, questionIds: string[]): Promise<void>
deleteQuestionFromSet(setId: string, questionId: string): Promise<void>
validateQuestionSet(setId: string): Promise<ValidationResult>

// Discovery & Search
searchQuestionSets(query: string, filters?: QuestionSetFilters): Promise<QuestionSet[]>
getPublicQuestionSets(limit?: number): Promise<QuestionSet[]>
getQuestionSetsBySubject(subject: string): Promise<QuestionSet[]>
getQuestionSetsByGrade(grade: number): Promise<QuestionSet[]>

// Analytics
incrementPlayCount(setId: string): Promise<void>
updateAverageScore(setId: string, score: number): Promise<void>
trackQuestionSetUsage(setId: string, userId: string): Promise<void>
```

**Why It's Needed:**
- Complex question set operations
- Validation logic
- Order management
- Analytics tracking

**Estimated Time:** 3-4 hours

---

#### Pathkey Service (Partial)
**Should Be:** `packages/shared/src/services/pathkey.service.ts`

**Currently Have:** Basic hooks (usePathkeys, useUserPathkeys)

**Missing Methods:**
```typescript
// Collection Management
addPathkeyToCollection(userId: string, pathkeyId: string): Promise<UserPathkey>
removePathkeyFromCollection(userId: string, pathkeyId: string): Promise<void>
toggleFavorite(userId: string, pathkeyId: string): Promise<void>
getCollectionStats(userId: string): Promise<CollectionStats>

// Pathkey Discovery
getPathkeysByRarity(rarity: Rarity): Promise<Pathkey[]>
getPathkeysByType(type: PathkeyType): Promise<Pathkey[]>
getPathkeysByCareer(careerId: string): Promise<Pathkey[]>
getMissingPathkeys(userId: string): Promise<Pathkey[]>

// Rarity & Awards
calculatePathkeyRarity(pathkeyId: string): Promise<number>
awardPathkeyWithNotification(userId: string, pathkeyId: string): Promise<void>
checkForDuplicates(userId: string, pathkeyId: string): Promise<boolean>
```

**Why It's Needed:**
- Complex collection logic
- Rarity calculations
- Award notifications
- Duplicate handling

**Estimated Time:** 2-3 hours

---

#### Market Service (Not Created)
**Should Be:** `packages/shared/src/services/market.service.ts`

**Missing Methods:**
```typescript
// Market Listings
getAvailableKeyPacks(): Promise<MarketItem[]>
getKeyPackById(packId: string): Promise<MarketItem>
getFeaturedPacks(): Promise<MarketItem[]>

// Purchase Flow
purchaseKeyPack(userId: string, packId: string): Promise<Purchase>
validatePurchase(userId: string, packId: string): Promise<boolean>
openKeyPack(purchaseId: string): Promise<Pathkey[]>
recordTransaction(userId: string, packId: string, amount: number): Promise<void>

// Token Economy
awardTokens(userId: string, amount: number, reason: string): Promise<void>
spendTokens(userId: string, amount: number, reason: string): Promise<boolean>
getTokenBalance(userId: string): Promise<number>
getTransactionHistory(userId: string): Promise<Transaction[]>
```

**Why It's Needed:**
- Purchase validation
- Token transactions
- Pack opening logic
- Transaction history

**Estimated Time:** 2-3 hours

---

### 2. ❌ Real-time Service Integration

#### Real-time Service (Not Created)
**Should Be:** `packages/shared/src/services/realtime.service.ts`

**Missing Implementation:**
```typescript
class RealtimeService {
  // Game State Synchronization
  subscribeToGameSession(sessionId: string, callbacks: {
    onPlayerJoin: (player: GamePlayer) => void;
    onPlayerLeave: (playerId: string) => void;
    onQuestionChange: (question: Question) => void;
    onAnswerSubmitted: (playerId: string, isCorrect: boolean) => void;
    onScoreUpdate: (scores: PlayerScore[]) => void;
    onGameStateChange: (state: GameState) => void;
  }): RealtimeChannel;

  // Lobby Management
  subscribeToLobby(sessionId: string, callbacks: {
    onPlayerJoin: (player: GamePlayer) => void;
    onPlayerReady: (playerId: string) => void;
    onGameStart: () => void;
  }): RealtimeChannel;

  // Player Status
  broadcastPlayerStatus(sessionId: string, playerId: string, status: PlayerStatus): void;
  heartbeat(sessionId: string, playerId: string): void;

  // Clean up
  unsubscribeAll(): void;
  leaveGame(sessionId: string, playerId: string): void;
}
```

**Currently Have:**
- Basic `subscribeToTable()` in supabase.service.ts
- Generic subscription support

**What's Missing:**
- Game-specific channel management
- Typed event handlers
- Automatic reconnection logic
- Player heartbeat system
- Graceful cleanup

**Why It's Critical:**
- Required for live multiplayer
- Player synchronization
- Real-time leaderboard
- Lobby management

**Estimated Time:** 4-5 hours

---

### 3. ⚠️ Enhanced React Query Hooks

#### Missing Specialized Hooks
```typescript
// Question Set Hooks
❌ useQuestionSets()          - Not created
❌ useQuestionSet(id)         - Not created
❌ useCreateQuestionSet()     - Not created
❌ useUpdateQuestionSet()     - Not created
❌ useDeleteQuestionSet()     - Not created
❌ useQuestions(setId)        - Not created

// Career Hooks
❌ useCareers()               - Not created
❌ useCareer(id)              - Not created
❌ useCareerSearch(query)     - Not created
❌ useRelatedCareers(id)      - Not created

// Market Hooks
❌ useMarketItems()           - Not created
❌ usePurchaseKeyPack()       - Not created
❌ useOpenKeyPack()           - Not created
❌ useTransactionHistory()    - Not created

// Game Hooks (Enhanced)
❌ useCreateGame()            - Not created
❌ useJoinGame()              - Not created
❌ useLeaveGame()             - Not created
❌ useSubmitAnswer()          - Not created
❌ useGamePlayers(sessionId)  - Not created
```

**Why They're Needed:**
- UI components expect these hooks
- Type-safe data access
- Automatic caching and invalidation
- Loading/error state management

**Estimated Time:** 3-4 hours

---

## Summary: What's Needed for 100%

### Priority 1: Critical for MVP (8-10 hours)
1. **Game Service** (3-4 hrs) - Required for hosting/joining games
2. **Real-time Service** (4-5 hrs) - Required for live gameplay
3. **Game Hooks** (1 hr) - UI integration

### Priority 2: Important for MVP (7-9 hours)
4. **Question Service** (3-4 hrs) - Required for content creation
5. **Question Hooks** (1 hr) - UI integration
6. **Career Service** (2-3 hrs) - Better career exploration
7. **Career Hooks** (1 hr) - UI integration

### Priority 3: Nice to Have (5-7 hours)
8. **Pathkey Service** (2-3 hrs) - Enhanced collection management
9. **Market Service** (2-3 hrs) - Token economy
10. **Market Hooks** (1 hr) - UI integration

**Total Time to 100%:** 20-26 hours

---

## Recommended Implementation Order

### Phase 1: Game System (8-10 hours)
```
1. Create game.service.ts
   - createGameSession, joinGame, startGame
   - generateGameCode, findGameByCode
   - submitAnswer, calculateScores

2. Create realtime.service.ts
   - subscribeToGameSession
   - subscribeToLobby
   - broadcastPlayerStatus

3. Create game hooks
   - useCreateGame, useJoinGame
   - useGamePlayers, useSubmitAnswer
```

### Phase 2: Content Creation (4-5 hours)
```
4. Create question.service.ts
   - createQuestionSet, addQuestionToSet
   - searchQuestionSets, validateQuestionSet

5. Create question hooks
   - useQuestionSets, useQuestionSet
   - useCreateQuestionSet, useQuestions
```

### Phase 3: Career & Economy (5-6 hours)
```
6. Create career.service.ts
   - searchCareers, getRelatedCareers
   - getCareersByIndustry

7. Create career hooks
   - useCareers, useCareer, useCareerSearch

8. Create market.service.ts (if time)
   - purchaseKeyPack, openKeyPack

9. Create market hooks (if time)
   - useMarketItems, usePurchaseKeyPack
```

---

## Benefits of Completing to 100%

### Current State (95%)
- ✅ Can query any table
- ✅ Can perform CRUD operations
- ✅ Has real-time capability
- ❌ Complex operations require UI code
- ❌ No business logic encapsulation
- ❌ Repeated code across components

### At 100% Completion
- ✅ Business logic in services
- ✅ Simplified UI components
- ✅ Type-safe domain operations
- ✅ Easier testing
- ✅ Consistent error handling
- ✅ Better separation of concerns

---

## Decision Point

### Option A: Complete to 100% First
**Pros:**
- Clean architecture
- Easier UI development
- Better maintainability

**Cons:**
- 20-26 hours before UI work
- No visible progress

**Recommended If:** You value long-term code quality

### Option B: Build UI with Generic Service (Keep at 95%)
**Pros:**
- Start UI immediately
- Faster visible progress
- Can refactor later

**Cons:**
- More code in components
- Harder to maintain
- Repeated logic

**Recommended If:** You need MVP fast

### Option C: Hybrid Approach ⭐ **RECOMMENDED**
**Build services as you build UI:**

1. Start with UI using generic service
2. When UI gets complex, extract to specialized service
3. Build services for:
   - ✅ Game system (before game UI)
   - ✅ Real-time (before live features)
   - ⏭️ Question sets (when building editor)
   - ⏭️ Career search (when building career pages)

**Best of both worlds:**
- Immediate progress on UI
- Clean architecture where it matters
- Services justified by actual needs

---

## Conclusion

**Current Status:** 95% complete with excellent foundation

**The Missing 5%:**
- Specialized service layers for complex domains
- Enhanced real-time integration
- Domain-specific hooks

**Time to 100%:** 20-26 hours

**Recommendation:** Use **Hybrid Approach** (Option C)
- Build game service + real-time service first (8-10 hrs)
- Build UI for pathkeys and careers with generic service
- Add question service when building editor (4-5 hrs)
- Add career/market services as polish (5-6 hrs)

This gets you to MVP fastest while maintaining good architecture where it matters most (game system).
