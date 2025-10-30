# Pathte Security - Deployment Checklist

## ✅ Before You Test (REQUIRED)

### Run Database Migration
**File**: `database/migrations/SECURITY_FIX_RESTRICT_PLAYER_UPDATES.sql`

```sql
-- Copy and run this in Supabase SQL Editor:
-- It prevents players from modifying their scores/tokens
```

**How to run:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `SECURITY_FIX_RESTRICT_PLAYER_UPDATES.sql`
3. Click "Run"
4. Verify output shows policy was created

### Verify Fixes Are Active

Test these in browser DevTools:

#### ✅ Test 1: Answer keys not exposed
```javascript
// In browser console after questions load:
console.log(questions[0].options);
// Should NOT see "is_correct" field
```

#### ✅ Test 2: Fast timing rejected
```javascript
// Try to submit with impossibly fast time:
await gameService.submitAnswer({
  timeTakenMs: 1,  // Should be rejected
  // ... other params
});
// Should get error: "Invalid timing: answer too fast"
```

#### ✅ Test 3: Duplicate answers prevented
```javascript
// Try to submit same answer twice:
await gameService.submitAnswer(params);  // First time succeeds
await gameService.submitAnswer(params);  // Second time fails
// Should get error: "Answer already submitted"
```

#### ✅ Test 4: Score modification blocked
```javascript
// Try to modify your score directly:
await supabase
  .from('game_players')
  .update({ score: 999999 })
  .eq('id', yourPlayerId);
// Should fail with RLS policy violation
```

---

## 🧪 Testing Scenarios

### As a Student (Trying to Cheat):

**Scenario 1: Speed hack**
- Open DevTools → Console
- Try: `localStorage.setItem('speedHack', 'true')`
- Submit answer claiming 1ms response time
- ✅ Expected: Answer rejected, no points awarded

**Scenario 2: Answer key**
- Open DevTools → Network tab
- Inspect question response
- ✅ Expected: No `is_correct` field visible in any option

**Scenario 3: Score manipulation**
- Open DevTools → Application → Supabase client
- Try to update `game_players` score field
- ✅ Expected: Permission denied (RLS policy violation)

**Scenario 4: Double submission**
- Answer a question
- Quickly click submit again before server responds
- ✅ Expected: Second submission rejected

### As a Teacher (Normal Use):

**Scenario 5: Normal gameplay**
- Create game with 5 questions
- Student joins and answers normally
- ✅ Expected: All features work, scores calculated correctly

**Scenario 6: Speed bonus**
- Student answers very quickly but reasonably (500ms)
- ✅ Expected: Speed bonus awarded appropriately

---

## 🚨 Known Limitations After Priority 1 Fixes

These attacks are **still possible** (will be fixed in Priority 2):

1. **Auto-answer bots** - AI can solve questions
   - *Mitigation*: Priority 2 (behavioral detection)

2. **Multi-account farming** - Unlimited guest accounts
   - *Mitigation*: Priority 2 (CAPTCHA, rate limiting)

3. **Question bank extraction** - Recording questions over time
   - *Mitigation*: Priority 3 (question rotation)

4. **CSWSH attacks** - WebSocket hijacking
   - *Mitigation*: Priority 2 (origin validation)

---

## 📋 Pre-Launch Checklist (Production)

Before launching to students:

### Database
- [ ] Migration `SECURITY_FIX_RESTRICT_PLAYER_UPDATES.sql` applied
- [ ] RLS policies verified active on all tables
- [ ] Database constraints in place (CHECK, UNIQUE)
- [ ] Audit logging table created (Priority 3)

### Application
- [ ] Answer keys removed from client responses (verify in Network tab)
- [ ] Timing validation active (test with DevTools)
- [ ] Duplicate prevention active (test rapid submissions)
- [ ] Error messages don't expose internal details

### Infrastructure
- [ ] HTTPS enabled (Supabase provides this)
- [ ] Environment variables secured (not in Git)
- [ ] Anon key has appropriate RLS restrictions
- [ ] Service role key never exposed to client

### Testing
- [ ] Penetration testing completed
- [ ] All Priority 1 tests pass (see above)
- [ ] Normal gameplay tested with real users
- [ ] Performance under load tested

### Documentation
- [ ] Security fixes documented
- [ ] Incident response plan created
- [ ] Team trained on secure coding practices

---

## 🔐 Priority 2 Implementation (This Week)

After Priority 1 testing is complete, implement:

1. **Rate limiting** (30 min)
   - Max 50 answers/minute per player
   - Max 10 requests/second per player

2. **WebSocket origin validation** (20 min)
   - Only allow `pathcte.app` origin
   - Reject unknown origins

3. **Behavioral bot detection** (1 hour)
   - Track response patterns
   - Flag suspicious accounts

4. **CAPTCHA for guests** (45 min)
   - Add hCaptcha/reCAPTCHA
   - Only for guest joins

**Total Priority 2 time**: ~2.5 hours

---

## 📞 Security Contacts

**Report vulnerabilities to:**
- GitHub: Private security advisory
- Email: security@pathcte.app (if configured)

**Do NOT:**
- Post vulnerabilities publicly
- Share exploits with students
- Test exploits on production without permission

---

## 📝 Quick Commands

### Check if migration was applied:
```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'game_players'
AND policyname = 'Players can only update connection status';
```

### Verify answer keys not in response:
```sql
-- This should return questions with options,
-- but game.service.ts sanitizes them before sending to client
SELECT id, question_text, options
FROM questions
WHERE question_set_id = 'your-set-id'
LIMIT 1;
```

### Check for duplicate answers:
```sql
SELECT player_id, question_id, COUNT(*)
FROM game_answers
GROUP BY player_id, question_id
HAVING COUNT(*) > 1;
-- Should return 0 rows after fix
```

---

**Last Updated**: October 29, 2025
**Next Review**: After Priority 1 testing complete
