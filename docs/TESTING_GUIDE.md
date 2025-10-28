# Testing Guide: Pathket Game System

Quick reference for testing the live multiplayer game system.

## Prerequisites

1. **Database Setup**
   - All migrations applied
   - Seed data loaded (see `/database/seeds/README.md`)
   - At least one teacher account created

2. **Development Server**
   ```bash
   cd packages/web
   npm run dev
   ```

3. **Supabase Local/Remote**
   - Supabase project running
   - Environment variables configured
   - Real-time subscriptions enabled

## Test Scenarios

### 1. Complete Game Flow (Happy Path)

**Objective:** Test the entire game from creation to completion

**Steps:**

1. **Create Teacher Account (if needed)**
   - Navigate to `/signup`
   - Sign up with user_type = 'teacher'
   - Or use existing teacher account

2. **Host a Game**
   - Login as teacher
   - Navigate to `/host-game`
   - Select question set: "Career Exploration Basics"
   - Configure settings:
     - Game mode: Career Quest
     - Max players: 30
     - Public: ✓
     - Allow late join: ✗
   - Click "Create Game"
   - **Expected:** Game code displayed (e.g., "XYZ123")

3. **Join as Multiple Students**
   - Open 3-4 incognito/different browser windows
   - Navigate to `/join-game`
   - Enter game code
   - Enter display names: "Student 1", "Student 2", etc.
   - **Expected:** Each joins lobby successfully

4. **Verify Lobby**
   - Check all players appear in real-time
   - Host sees crown indicator
   - Player count updates
   - Game code is copyable
   - **Expected:** All players visible, host controls available

5. **Start Game**
   - Host clicks "Start Game"
   - **Expected:** All players transition to first question

6. **Answer Questions**
   - Each student answers questions
   - Vary answer times (test speed bonus)
   - Mix correct/incorrect answers
   - **Expected:**
     - Timer counts down
     - Correct/incorrect feedback shows
     - Leaderboard updates in real-time
     - Points calculated correctly

7. **Host Controls**
   - After all answer, host clicks "Next Question"
   - Repeat for all 10 questions
   - **Expected:** Questions advance smoothly

8. **View Results**
   - After last question, game ends
   - **Expected:**
     - Final leaderboard displays
     - Personal stats shown for each player
     - Tokens awarded (check amounts)
     - Top 3 receive pathkeys
     - "Return Home" works

### 2. Real-Time Features

**Objective:** Verify real-time synchronization works

**Test Cases:**

- [ ] **Player Join Events**
  - Join game after others already joined
  - Verify appears instantly in all browsers

- [ ] **Score Updates**
  - Submit answer in one browser
  - Check leaderboard updates in other browsers
  - Verify order changes correctly

- [ ] **Game State Changes**
  - Host starts game
  - All players see transition immediately

- [ ] **Connection Status**
  - Close one browser tab
  - Verify player shows as "disconnected" (if implemented)
  - Rejoin and verify reconnects

### 3. Scoring System

**Objective:** Verify scoring calculations are correct

**Test Scenarios:**

1. **Base Points**
   - Answer correctly with full time remaining
   - **Expected:** Full question points (10-20 points)

2. **Speed Bonus**
   - Answer very quickly (within 5 seconds)
   - **Expected:** Base points + significant speed bonus (up to 50% more)

3. **Slow Answer**
   - Answer just before timer expires
   - **Expected:** Base points + minimal speed bonus

4. **Incorrect Answer**
   - Answer incorrectly
   - **Expected:** 0 points

5. **Leaderboard Tiebreaker**
   - Create tie scenario (same score)
   - **Expected:** Breaks tie by correct answers, then join time

### 4. Rewards System

**Objective:** Verify token and pathkey awards work

**Test Cases:**

- [ ] **Participation Tokens**
  - Complete game with 0 score
  - **Expected:** 10 base tokens awarded

- [ ] **Score Tokens**
  - Score 100 points
  - **Expected:** 10 base + 10 from score = 20 tokens

- [ ] **Placement Bonuses**
  - Finish 1st place
  - **Expected:** Base + score + 50 placement = significant total

  - Finish 2nd place
  - **Expected:** Base + score + 30 placement

  - Finish 3rd place
  - **Expected:** Base + score + 20 placement

- [ ] **Pathkey Awards**
  - Finish in top 3 with registered account
  - **Expected:** Random pathkey awarded
  - Check user_pathkeys table for entry

### 5. Edge Cases

**Objective:** Test error handling and edge scenarios

**Test Cases:**

- [ ] **Full Game**
  - Set max_players to 3
  - Join with 3 players
  - Try to join with 4th player
  - **Expected:** "Game is full" error

- [ ] **Game Already Started**
  - Join game after it started (if late join disabled)
  - **Expected:** "Game has already started" error

- [ ] **Invalid Game Code**
  - Enter nonexistent code "XXXXXX"
  - **Expected:** "Game not found" error

- [ ] **Timer Expiration**
  - Let timer run out without answering
  - **Expected:** Auto-submits or moves to next question

- [ ] **Duplicate Answer**
  - Try to answer same question twice
  - **Expected:** Prevented (hasAnswered check)

- [ ] **Host Leaves**
  - Host closes browser
  - **Expected:** Game continues? Or error? (Define behavior)

- [ ] **Network Disconnect**
  - Disconnect network mid-game
  - Reconnect
  - **Expected:** Rejoins with Supabase reconnection

### 6. UI/UX Testing

**Objective:** Verify visual design and user experience

**Check:**

- [ ] Responsive design on mobile/tablet
- [ ] Loading states show correctly
- [ ] Error messages are user-friendly
- [ ] Empty states display when no data
- [ ] Icons and colors are correct
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Copy game code button works
- [ ] Animations are smooth (if any)

### 7. Question Sets

**Objective:** Test different question sets work

**Test Each Set:**

- [ ] **Career Exploration Basics** (10 questions, Easy)
  - All questions display correctly
  - Answer options work
  - Timer appropriate for difficulty

- [ ] **Healthcare Careers Quiz** (8 questions, Medium)
  - Questions more challenging
  - Timer adjusted for difficulty

- [ ] **Technology & Innovation** (7 questions, Hard)
  - Advanced questions
  - Longer timer for harder questions

### 8. Performance Testing

**Objective:** Test system under load (manual)

**Scenarios:**

- [ ] **Many Players**
  - Join with 10+ players (if possible)
  - Check real-time performance
  - Verify no lag in updates

- [ ] **Rapid Actions**
  - Answer questions very quickly
  - Switch between questions rapidly
  - Check for race conditions

- [ ] **Long Session**
  - Leave game running for extended period
  - Check for memory leaks
  - Verify reconnection works

## Known Issues

Document any issues found during testing:

- Issue 1: [Description]
- Issue 2: [Description]
- etc.

## Performance Metrics

Track these during testing:

- **Page Load Time:** < 2 seconds
- **Real-time Latency:** < 500ms for updates
- **Question Transition:** Instant
- **Score Update:** < 1 second

## Browser Compatibility

Test on:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Testing Checklist Summary

### Pre-Game
- [ ] Teacher can create game
- [ ] Game code generates uniquely
- [ ] Settings are applied correctly

### Lobby
- [ ] Students can join with code
- [ ] Real-time player list updates
- [ ] Host can start game
- [ ] Players can leave

### Gameplay
- [ ] Questions display correctly
- [ ] Timer works accurately
- [ ] Answer submission succeeds
- [ ] Feedback is immediate
- [ ] Leaderboard updates live
- [ ] Host can advance questions

### Post-Game
- [ ] Results display correctly
- [ ] Tokens awarded accurately
- [ ] Pathkeys awarded to top 3
- [ ] Can return to dashboard

### Real-Time
- [ ] Join events propagate
- [ ] Score updates broadcast
- [ ] State changes sync
- [ ] Reconnection works

### Edge Cases
- [ ] Full game handling
- [ ] Invalid codes handled
- [ ] Network issues recovered
- [ ] Timer expiration works

## Reporting Bugs

When reporting bugs, include:

1. **Steps to Reproduce**
2. **Expected Behavior**
3. **Actual Behavior**
4. **Browser/Device**
5. **Screenshots/Logs**
6. **Data State** (which question set, how many players, etc.)

## Test Data Reset

To reset test data between test runs:

```sql
-- Delete game sessions
DELETE FROM game_sessions WHERE created_at > NOW() - INTERVAL '1 day';

-- Delete game players
DELETE FROM game_players WHERE joined_at > NOW() - INTERVAL '1 day';

-- Delete game answers
DELETE FROM game_answers WHERE created_at > NOW() - INTERVAL '1 day';

-- Reset user pathkeys (optional)
DELETE FROM user_pathkeys WHERE earned_at > NOW() - INTERVAL '1 day';
```

Or use Supabase dashboard to truncate test data.

---

**Ready to test?** Start with Scenario 1 (Complete Game Flow) and work through the checklist! 🧪✅
