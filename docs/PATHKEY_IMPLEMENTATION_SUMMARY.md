# Pathkey Award System - Implementation Summary

**Status:** Backend implementation complete, ready for testing

**Date:** 2025-01-08

## Overview

The Pathkey Award System is now fully implemented in the backend with database migrations and business logic complete. The system tracks student progress across three progressive sections:

1. **Section 1: Career Mastery** (Career Image) - Top 3 finish in Career mode
2. **Section 2: Industry/Cluster Mastery** (Lock) - 3 question sets with 90% accuracy
3. **Section 3: Business Driver Mastery** (Key) - 5 questions per driver with 90% accuracy

## Files Created

### Database Migrations

**`database/migrations/053_create_pathkey_tables.sql`**
- Creates three tracking tables:
  - `student_pathkeys` - Main pathkey status per student per career
  - `student_pathkey_progress` - Section 2 progress tracking
  - `student_business_driver_progress` - Section 3 chunk-based tracking
- Implements Row Level Security (RLS) policies
- Includes automatic timestamp triggers
- **Status:** Ready to apply

**`database/migrations/054_add_pathkey_images_to_careers.sql`**
- Adds image tracking columns to `careers` table:
  - `pathkey_career_image` (Azure Blob Storage filename)
  - `pathkey_lock_image` (Azure Blob Storage filename)
  - `pathkey_key_image` (Azure Blob Storage filename)
  - `pathkey_images_complete` (boolean flag)
- Populates PR Specialist test career with image references
- **Status:** Ready to apply

### Backend Services

**`packages/shared/src/services/pathkey.service.ts`**
- Complete pathkey award logic for all three sections
- Key functions:
  - `processGameEndPathkeys()` - Called after game ends
  - `processBusinessDriverProgress()` - Called after each answer
  - `awardCareerMastery()` - Section 1 unlock
  - `trackIndustryProgress()` - Section 2 (Industry path)
  - `trackClusterProgress()` - Section 2 (Cluster path)
  - `checkBusinessDriverCompletion()` - Section 3 completion check
  - `getPathkeyProgress()` - Query student progress
  - `getStudentPathkeys()` - Query all student pathkeys
- **Status:** Implemented and exported

**`packages/shared/src/services/game.service.ts`** (Modified)
- Integrated pathkey service into game flow
- Calls `pathkeyService.processGameEndPathkeys()` after rewards (line 352)
- Calls `pathkeyService.processBusinessDriverProgress()` after each answer (line 600)
- **Status:** Integrated

**`packages/shared/src/index.ts`** (Modified)
- Added export for `pathkey.service.ts` (line 26)
- **Status:** Updated

### Testing & Verification Scripts

**`scripts/verify-pathkey-setup.mjs`**
- Verifies database tables exist
- Checks PR Specialist career configuration
- Validates question sets availability
- Checks business driver data
- **Usage:** `node scripts/verify-pathkey-setup.mjs`

**`scripts/test-pathkey-flow.mjs`**
- Interactive testing for all three sections
- Shows real-time progress for a student
- Displays requirements and next steps
- **Usage:** `node scripts/test-pathkey-flow.mjs <student_email>`

### Documentation

**`docs/PATHKEY_AWARD_SYSTEM_DESIGN.md`**
- Comprehensive design specification (500+ lines)
- Complete logic for all sections
- Database schema
- Implementation pseudocode
- **Status:** Complete reference document

**`docs/PATHKEY_IMPLEMENTATION_NOTES.md`**
- PR Specialist test career strategy
- Image handling (Azure Blob Storage)
- Data verification queries
- Testing checklist
- **Status:** Testing guide

## How It Works

### Section 1: Career Mastery (Career Image)

**Trigger:** Game ends with student in Top 3 placement

**Logic:**
1. `game.service.ts` calls `pathkeyService.processGameEndPathkeys()` after `endGame()` (line 352)
2. Checks `exploration_type === 'career'` and `placement <= 3`
3. Requires 3+ total players (1+ in development mode)
4. Awards career mastery via `awardCareerMastery()`
5. Updates `student_pathkeys.career_mastery_unlocked = true`

**Database:**
```sql
-- Check if student earned Section 1
SELECT career_mastery_unlocked, career_mastery_unlocked_at
FROM student_pathkeys
WHERE student_id = $1 AND career_id = $2;
```

### Section 2: Industry/Cluster Mastery (Lock)

**Trigger:** Game ends with 90%+ accuracy in Industry or Cluster mode

**Prerequisite:** Must have Section 1 unlocked for at least one career

**Logic:**
1. After game ends, checks if `accuracy >= 90%`
2. Identifies question set type (Industry or Cluster)
3. Calls `trackIndustryProgress()` or `trackClusterProgress()`
4. Inserts record into `student_pathkey_progress`
5. Checks if student has 3+ completed sets
6. Awards mastery when threshold reached

**Database:**
```sql
-- Check Industry path progress
SELECT COUNT(*) FROM student_pathkey_progress
WHERE student_id = $1
  AND career_id = $2
  AND mastery_type = 'industry'
  AND accuracy >= 90;

-- Check if unlocked
SELECT industry_mastery_unlocked, cluster_mastery_unlocked
FROM student_pathkeys
WHERE student_id = $1 AND career_id = $2;
```

### Section 3: Business Driver Mastery (Key)

**Trigger:** After each answer to a Career mode question with business_driver

**Logic:**
1. `game.service.ts` calls `pathkeyService.processBusinessDriverProgress()` after `submitAnswer()` (line 600)
2. Checks if question has `business_driver` field and `career_id`
3. Tracks progress in chunks of 5 questions
4. If chunk completes with 90%+ accuracy → mark driver as mastered
5. If chunk fails → reset counter
6. When all 6 drivers mastered → unlock Section 3

**Database:**
```sql
-- Check driver progress
SELECT business_driver, mastery_achieved,
       current_chunk_questions, current_chunk_correct
FROM student_business_driver_progress
WHERE student_id = $1 AND career_id = $2;

-- Check if all drivers complete
SELECT business_driver_mastery_unlocked
FROM student_pathkeys
WHERE student_id = $1 AND career_id = $2;
```

## Testing Procedure

### 1. Apply Migrations

```bash
# Apply migrations 053 and 054
# (Use your migration tool - Supabase Dashboard or SQL client)

# Verify setup
node scripts/verify-pathkey-setup.mjs
```

Expected output:
- ✅ All tables created
- ✅ PR Specialist configured with images
- ✅ Career question sets exist
- ✅ Industry/Cluster question sets available

### 2. Test Section 1 (Career Mastery)

```bash
# 1. Create or identify test student account
# 2. Start a Career mode game with PR Specialist question set
# 3. Play and finish in Top 3 (requires 3+ players in production)
# 4. Check result:

node scripts/test-pathkey-flow.mjs test-student@pathcte.com
```

Expected:
- ✅ Section 1: Career Mastery UNLOCKED

### 3. Test Section 2 (Industry/Cluster Path)

```bash
# After Section 1 is unlocked:

# 1. Play 3 Industry question sets matching PR Specialist's sector
#    (or 3 Cluster question sets matching PR Specialist's cluster)
# 2. Achieve 90%+ accuracy in each
# 3. Check result:

node scripts/test-pathkey-flow.mjs test-student@pathcte.com
```

Expected:
- Industry Path: 3/3 question sets completed
- ✅ Section 2: Industry Mastery UNLOCKED

### 4. Test Section 3 (Business Driver Mastery)

```bash
# After Section 1 is unlocked:

# 1. Play Career mode games with PR Specialist
# 2. Answer 5 consecutive questions per business driver with 90%+ accuracy
# 3. Repeat for all 6 drivers: people, product, pricing, process, proceeds, profits
# 4. Check result:

node scripts/test-pathkey-flow.mjs test-student@pathcte.com
```

Expected:
- All 6 business drivers: ✅ MASTERED
- ✅ Section 3: Business Driver Mastery (KEY) UNLOCKED

### 5. Complete Pathkey Verification

When all three sections are complete:

```bash
node scripts/test-pathkey-flow.mjs test-student@pathcte.com
```

Expected:
```
📊 PATHKEY SUMMARY

   Section 1 (Career Image): ✅ UNLOCKED
   Section 2 (Lock): ✅ UNLOCKED
   Section 3 (Key): ✅ UNLOCKED

   🎉 COMPLETE PATHKEY EARNED! 🎉
```

## Configuration

### Development vs Production

**Development Mode** (`NODE_ENV !== 'production'`):
- Section 1 awards with 1+ players (easier testing)
- Business driver tracking active

**Production Mode** (`NODE_ENV === 'production'`):
- Section 1 requires 3+ players (competitive integrity)
- Business driver tracking active

Configuration in:
- `packages/shared/src/services/game.service.ts:21`
- `packages/shared/src/services/pathkey.service.ts:17`

### Accuracy Thresholds

**Section 2:** 90% accuracy threshold
- Defined in: `pathkey.service.ts:20`
- `SECTION_2_ACCURACY_THRESHOLD = 90`

**Section 3:** 90% accuracy threshold, 5-question chunks
- Defined in: `pathkey.service.ts:23-24`
- `SECTION_3_CHUNK_SIZE = 5`
- `SECTION_3_ACCURACY_THRESHOLD = 90`

### Required Question Sets

**Section 2:** 3 question sets required
- Defined in: `pathkey.service.ts:19`
- `SECTION_2_REQUIRED_SETS = 3`

**Section 3:** 6 business drivers required
- Defined in: `pathkey.service.ts:25`
- `SECTION_3_REQUIRED_DRIVERS = ['people', 'product', 'pricing', 'process', 'proceeds', 'profits']`

## Image Storage

All pathkey images are stored in **Azure Blob Storage** container: `pathctestore`

Image references in `careers` table:
- `pathkey_career_image` - e.g., "pr-specialist.png"
- `pathkey_lock_image` - e.g., "Lock_gold_1.png"
- `pathkey_key_image` - e.g., "Comm_key.png"

Frontend will need to construct URLs:
```typescript
const careerImageUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/pathctestore/${career.pathkey_career_image}`;
```

## Next Steps

### 1. Apply Migrations
- Run migrations 053 and 054 in Supabase
- Verify with `verify-pathkey-setup.mjs`

### 2. Test Backend Logic
- Create test student account
- Run through all three sections
- Verify progress tracking with `test-pathkey-flow.mjs`

### 3. Build Frontend UI
- Create PathkeyDisplay component
- Show three sections with unlock status
- Load images from Azure Blob Storage
- Display progress bars/indicators

### 4. Update HOW_TO_PLAY.md
- Add pathkey system documentation
- Explain earning criteria
- Show progression examples

### 5. Create Additional Career Images
- Design images for remaining 49 careers
- Upload to Azure Blob Storage
- Update `careers` table image references

## Known Limitations

1. **Guest Players:** Pathkey tracking only works for registered users (requires `user_id`)
2. **Career Images:** Only PR Specialist has complete image set currently
3. **Section 2 Prerequisite:** Students must unlock Section 1 before Section 2 progress counts
4. **Business Driver Coverage:** Not all questions have `business_driver` populated yet

## Support & Troubleshooting

### Common Issues

**Issue: "No pathkeys available to award"**
- This refers to OLD pathkey system (legacy code)
- NEW pathkey system works independently
- Can be safely ignored

**Issue: Section 2 not progressing**
- Check if student has Section 1 unlocked
- Verify accuracy >= 90%
- Confirm question set matches career sector/cluster

**Issue: Business driver chunk resets**
- Chunk failed to meet 90% accuracy
- This is expected behavior
- Student needs to retry with better accuracy

### Debug Queries

Check student's complete pathkey status:
```sql
SELECT sp.*, c.title as career_title
FROM student_pathkeys sp
JOIN careers c ON sp.career_id = c.id
WHERE sp.student_id = '[student_id]';
```

Check Section 2 progress:
```sql
SELECT * FROM student_pathkey_progress
WHERE student_id = '[student_id]'
ORDER BY completed_at DESC;
```

Check Section 3 progress:
```sql
SELECT * FROM student_business_driver_progress
WHERE student_id = '[student_id]'
ORDER BY last_updated DESC;
```

---

**Implementation Date:** 2025-01-08
**Reference Docs:**
- `docs/PATHKEY_AWARD_SYSTEM_DESIGN.md` - Complete design specification
- `docs/PATHKEY_IMPLEMENTATION_NOTES.md` - Testing strategy
- `docs/Pathkey_Award_System.pdf` - Original requirements
