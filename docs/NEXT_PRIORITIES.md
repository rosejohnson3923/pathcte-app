# Recommended Next Priorities
**Date:** October 27, 2025
**Current Status:** 79% MVP Complete, Database Layer at 95%

---

## Strategic Decision: Build UI Now, Services As Needed ✅

### Why This Approach Makes Sense:

1. **Generic Service is Sufficient** - Our supabase.service.ts can handle 95% of data operations
2. **Faster Visible Progress** - Users can see and interact with features
3. **Extract Services When Needed** - When UI logic gets complex, refactor into services
4. **Validates Requirements** - Building UI reveals what services actually need
5. **Maintains Momentum** - Keeps development moving forward

---

## Immediate Next Steps (This Week)

### Priority 1: Pathkey Collection UI (8-10 hours) 🔑

**Why First:**
- Core value proposition of Pathcte
- Already have: Database ✅, Hooks ✅, Azure Images ✅
- Dashboard already shows count, just need detail views

**Components to Build:**
```
1. PathkeyCard.tsx (2-3 hrs)
   - Display pathkey image from Azure
   - Show rarity badge
   - Show quantity owned
   - Hover effects / animations

2. PathkeyGrid.tsx (2-3 hrs)
   - Grid layout for collection
   - Filter by rarity
   - Sort options (recent, rarity, alphabetical)
   - Empty state

3. PathkeyDetail.tsx (2-3 hrs)
   - Modal with full pathkey info
   - Career association
   - Acquisition date
   - Collection stats

4. CollectionPage.tsx (1-2 hrs)
   - Full collection view
   - Uses PathkeyGrid
   - Stats header
   - Navigation
```

**Data Needs:** ✅ Already covered by `useUserPathkeys()` hook

**Service Needs:** ❌ No specialized service needed yet (use generic hooks)

**Expected Outcome:**
- Students can view their pathkey collection
- See which pathkeys they own
- View pathkey details and rarity
- Track collection progress

---

### Priority 2: Career Exploration UI (10-12 hours) 💼

**Why Second:**
- Educational core of platform
- Already have: Database ✅, Career types ✅, Azure Images ✅
- Connects to pathkeys

**Components to Build:**
```
1. CareerCard.tsx (2-3 hrs)
   - Career image from Azure
   - Title, industry, salary range
   - Quick stats (growth rate, education)
   - Click to view details

2. CareerDetail.tsx (3-4 hrs)
   - Full career profile
   - Day in the life
   - Education requirements
   - Skills needed
   - Related careers
   - Associated pathkeys

3. CareersPage.tsx (3-4 hrs)
   - Browse all careers
   - Grid of CareerCards
   - Filter by industry/sector
   - Search functionality
   - Pagination

4. CareerSearch.tsx (2-3 hrs)
   - Search bar component
   - Filter chips
   - Sort options
   - Results count
```

**Data Needs:**
- `useFetchMany('careers')` - List careers
- `useFetchOne('careers', id)` - Get career details
- Add `useCareers()` hook wrapper (1 hour)

**Service Needs:** ⏭️ Build `career.service.ts` LATER when adding:
- Advanced search with ranking
- Related career recommendations
- Career pathways
- O*NET data enrichment

**Expected Outcome:**
- Students can explore careers
- View career details and requirements
- Search and filter careers
- See related pathkeys

---

### Priority 3: Basic Game Flow UI (15-18 hours) 🎮

**Why Third:**
- Most complex feature
- Needs real-time integration
- Should build services alongside this

**Components to Build:**

#### 3A. Join Game Flow (6-8 hrs)
```
1. JoinGamePage.tsx (2-3 hrs)
   - Enter 6-digit game code
   - Enter display name
   - Validation
   - Loading state

2. GameLobby.tsx (4-5 hrs)
   - Show game code
   - List of connected players
   - Player ready states
   - "Waiting for host to start" message
   - Leave game button
```

**Data Needs:**
- `useFetchOne('game_sessions')` by game_code
- `useFetchMany('game_players')` for session
- Real-time subscription for player joins

**Service Needs:** ✅ Build `game.service.ts` + `realtime.service.ts` NOW
- `joinGame(code, userId, displayName)`
- `subscribeToLobby(sessionId, callbacks)`
- `leaveGame(sessionId, playerId)`

#### 3B. Host Game Flow (5-6 hrs)
```
1. HostGamePage.tsx (3-4 hrs)
   - Select question set
   - Configure game settings
   - Generate game code
   - Navigate to lobby

2. HostControls.tsx (2-3 hrs)
   - Start game button
   - Kick player
   - End game
   - Settings panel
```

**Data Needs:**
- `useFetchMany('question_sets', { creator_id: userId })`
- Create game session
- Real-time subscription for players

**Service Needs:** ✅ Build alongside UI
- `createGameSession(hostId, questionSetId, settings)`
- `generateGameCode()`
- `startGame(sessionId)`

#### 3C. Basic Gameplay (4-6 hrs)
```
1. QuestionDisplay.tsx (2-3 hrs)
   - Show question text
   - Display image if present
   - Progress indicator (Q 1/10)

2. AnswerOptions.tsx (2-3 hrs)
   - Grid of answer buttons
   - Timer countdown
   - Submit answer
   - Correct/incorrect feedback
```

**Data Needs:**
- Questions from session's question set
- Submit answer to database
- Real-time score updates

**Service Needs:** ✅ Build alongside UI
- `submitAnswer(playerId, questionId, answerIndex, timeTaken)`
- `subscribeToGameSession(sessionId, callbacks)`

---

## Next Week Priorities

### Priority 4: Game Results & Leaderboard (6-8 hours)

```
1. Leaderboard.tsx (3-4 hrs)
   - Live rankings during game
   - Score updates
   - Position changes animation

2. GameResults.tsx (3-4 hrs)
   - Final leaderboard
   - Individual stats
   - Pathkeys earned
   - Tokens awarded
   - Share results
```

### Priority 5: Question Set Editor (15-18 hours)

**This is when we BUILD `question.service.ts`**

```
1. QuestionSetEditor.tsx (4-5 hrs)
   - Create/edit question set
   - Set metadata
   - Add questions

2. QuestionEditor.tsx (4-5 hrs)
   - Add question text
   - Add answer options
   - Mark correct answer
   - Set time limit and points

3. QuestionList.tsx (3-4 hrs)
   - View all questions in set
   - Reorder questions
   - Edit/delete questions

4. QuestionSetsPage.tsx (4-5 hrs)
   - List all question sets
   - Search and filter
   - Duplicate sets
   - Publish/unpublish
```

---

## Recommended Build Order (Next 2-3 Weeks)

### Week 1: Collections & Discovery
**Goal:** Students can see pathkeys and explore careers

```
Day 1-2: PathkeyCard + PathkeyGrid          (6-8 hrs)
Day 3:   PathkeyDetail + CollectionPage     (3-5 hrs)
Day 4-5: CareerCard + CareerDetail          (5-7 hrs)
Day 6-7: CareersPage + CareerSearch         (5-6 hrs)

Total: 19-26 hours
Outcome: ✅ Students can explore collections and careers
```

### Week 2: Game Foundation
**Goal:** Teachers can host, students can join games

```
Day 1:   Build game.service.ts              (3-4 hrs)
Day 2:   Build realtime.service.ts          (4-5 hrs)
Day 3-4: JoinGamePage + GameLobby           (6-8 hrs)
Day 5-6: HostGamePage + HostControls        (5-6 hrs)
Day 7:   Testing and polish                 (2-3 hrs)

Total: 20-26 hours
Outcome: ✅ Can host and join games (no gameplay yet)
```

### Week 3: Gameplay & Results
**Goal:** Complete end-to-end game experience

```
Day 1-2: QuestionDisplay + AnswerOptions    (4-6 hrs)
Day 3:   Game flow wiring                   (3-4 hrs)
Day 4:   Leaderboard component              (3-4 hrs)
Day 5:   GameResults component              (3-4 hrs)
Day 6-7: End-to-end testing and polish      (4-6 hrs)

Total: 17-24 hours
Outcome: ✅ Fully playable game from start to finish
```

### Week 4 (Optional): Content Creation
**Goal:** Teachers can create question sets

```
Day 1:   Build question.service.ts          (3-4 hrs)
Day 2-3: QuestionSetEditor                  (4-5 hrs)
Day 4-5: QuestionEditor                     (4-5 hrs)
Day 6:   QuestionSetsPage                   (4-5 hrs)
Day 7:   Testing and polish                 (2-3 hrs)

Total: 17-22 hours
Outcome: ✅ Teachers can create content
```

---

## Services Build Schedule

### Build Now (Before Game UI)
```
✅ game.service.ts          - Week 2, Day 1 (3-4 hrs)
✅ realtime.service.ts      - Week 2, Day 2 (4-5 hrs)
```

### Build Later (When Needed)
```
⏭️ question.service.ts      - Week 4, Day 1 (3-4 hrs)
⏭️ career.service.ts        - As polish/optimization
⏭️ pathkey.service.ts       - As polish/optimization
⏭️ market.service.ts        - Phase 2 enhancement
```

---

## What NOT to Build Yet

### ❌ Defer to Phase 2 (Post-MVP)
- Market system components
- Pack opening animations
- Advanced analytics
- Additional game modes
- Social features
- Achievement tracking
- Profile editing page
- Settings page
- Token transaction history
- Advanced pathkey features (trading, favorites)

### ❌ Defer to Phase 3 (Polish)
- Animations and transitions (beyond basic)
- Advanced search with AI
- Career recommendations
- Personalized dashboards
- Mobile app
- PWA features
- Offline mode
- Performance optimizations

---

## Success Metrics

### End of Week 1
- [ ] Students can view pathkey collection
- [ ] Students can explore careers
- [ ] Dashboard shows real data
- [ ] Images load from Azure

### End of Week 2
- [ ] Teachers can create game sessions
- [ ] Students can join with game code
- [ ] Lobby shows connected players
- [ ] Real-time player sync works

### End of Week 3
- [ ] Complete game playthrough works
- [ ] Questions display correctly
- [ ] Answers submit and score
- [ ] Leaderboard updates live
- [ ] Results show pathkeys earned

### End of Week 4 (Stretch Goal)
- [ ] Teachers can create question sets
- [ ] Teachers can add/edit questions
- [ ] Question sets can be published
- [ ] Students can play teacher-created content

---

## Resource Allocation

### Your Time Investment
- **Week 1:** 19-26 hours (UI development)
- **Week 2:** 20-26 hours (Services + UI)
- **Week 3:** 17-24 hours (Gameplay completion)
- **Week 4:** 17-22 hours (Content creation - optional)

**Total to Functional MVP:** 56-76 hours (2-3 weeks at 25-30 hrs/week)

### What You Get
- ✅ Students can view collections
- ✅ Students can explore careers
- ✅ Teachers can host games
- ✅ Students can join games
- ✅ Complete gameplay experience
- ✅ Real-time multiplayer
- ✅ Pathkeys awarded after games

### What You Don't Get (But Don't Need for MVP)
- ❌ Teachers creating content (can use pre-made sets)
- ❌ Market system (can award pathkeys directly)
- ❌ Advanced features (polish for later)

---

## Decision Framework

### Build This Component If:
1. ✅ Core to user flow (join game, play game)
2. ✅ High visibility (collection page, career page)
3. ✅ Required for testing (can't test game without UI)
4. ✅ Unblocks other features (lobby before gameplay)

### Defer This Component If:
1. ❌ Nice to have but not critical (animations, polish)
2. ❌ Can work around (use pre-made content vs. editor)
3. ❌ Low usage initially (settings page, profiles)
4. ❌ Optimization not blocker (can work without it)

---

## Conclusion

### ✅ Do This Instead of Database Work:

1. **Week 1:** Build Pathkey & Career UI using existing hooks
2. **Week 2:** Build Game + Realtime services, then Game UI
3. **Week 3:** Complete gameplay and results
4. **Week 4:** (Optional) Build Question Editor with service

### Why This Works Better:

**Pros:**
- ✅ Immediate visible progress
- ✅ Validates data layer works
- ✅ Reveals actual service needs
- ✅ Gets to playable MVP faster
- ✅ Can demo to users sooner

**The Missing 5% Database Work:**
- ⏭️ Build game + realtime services in Week 2
- ⏭️ Build question service in Week 4
- ⏭️ Build career/market services as polish later

**Time Saved:**
- Don't build services you don't need yet
- Don't build services until you know what they need
- Extract services from UI when logic gets complex

### 🎯 Bottom Line:

**Skip the remaining 5% database work.** You have everything you need to build UI. Build the 2 critical services (game + realtime) alongside the game UI in Week 2, and build other services only when you actually need them.

**Start tomorrow with:** PathkeyCard.tsx 🚀
