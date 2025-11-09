# Pathkey Award System - Complete Design Document

## Executive Summary

The Pathkey Award System allows students to progressively unlock three-part career pathkeys by demonstrating mastery across different dimensions:
1. **Career Mastery** (Top - Career Image)
2. **Industry/Cluster Mastery** (Bottom Left - Lock)
3. **Business Driver Mastery** (Bottom Right - Key)

Each pathkey is specific to ONE career. Students can unlock pathkeys for multiple careers independently.

---

## Visual Structure

```
┌─────────────────────┐
│   CAREER IMAGE      │  Section 1: Career Mastery
│   (Full Width)      │
├──────────┬──────────┤
│   LOCK   │   KEY    │  Section 2 & 3: Industry/Cluster + Business Drivers
│  (Left)  │  (Right) │
└──────────┴──────────┘
```

**Example Images:**
- Career: `pr-specialist.png`
- Lock: `Lock_gold_1.png`
- Key: `Comm_key.png`

---

## Section 1: Career Mastery (Career Image - Top)

### Award Criteria
- **Exploration Type:** `exploration_type = 'Career'`
- **Question Set:** Where `question_sets.career_id = [target_career_id]`
- **Achievement:** Finish in **Top 3** in any game mode (solo, multiplayer, tournament)
- **Difficulty:** Any (Easy, Medium, Hard)

### Unlock Logic
```sql
-- Award Section 1 when student finishes Top 3 in Career mode
WHERE game_session.exploration_type = 'Career'
  AND game_session.question_set_id IN (
    SELECT id FROM question_sets WHERE career_id = [target_career_id]
  )
  AND student_rank <= 3
```

### What It Unlocks
- ✅ Career Image (top section) visible
- 🔒 Lock (bottom left) still locked
- 🔒 Key (bottom right) still locked
- ✅ Prerequisite met for Sections 2 & 3

### Database Tracking
```sql
student_pathkeys (
  student_id UUID,
  career_id UUID,
  career_mastery_unlocked BOOLEAN DEFAULT false,
  career_mastery_unlocked_at TIMESTAMPTZ,
  ...
)
```

---

## Section 2: Industry OR Cluster Mastery (Lock - Bottom Left)

### Award Criteria (Two Paths - OR Condition)

Students can unlock Section 2 by completing **EITHER** Path A or Path B:

#### **Path A: Industry Mastery**
- **Exploration Type:** `exploration_type = 'Industry'`
- **Question Sets:** Where `question_sets.career_sector` matches the career's sector
- **Achievement:** Complete **3 question sets** with **90% accuracy**
- **Difficulty:** Any

**Matching Logic:**
```sql
-- Find the career's sector
SELECT career_sector FROM careers WHERE id = [target_career_id]
-- Example: "Marketing & Community"

-- Student must complete 3 Industry question sets where:
WHERE question_sets.career_id IS NULL
  AND question_sets.career_cluster IS NULL
  AND question_sets.career_sector = [career's career_sector]
  AND student_accuracy >= 0.90
```

#### **Path B: Cluster Mastery**
- **Exploration Type:** `exploration_type = 'Cluster'`
- **Question Sets:** Where `question_sets.career_cluster` matches the career's cluster
- **Achievement:** Complete **3 question sets** with **90% accuracy**
- **Difficulty:** Any

**Matching Logic:**
```sql
-- Find the career's cluster
SELECT career_cluster FROM careers WHERE id = [target_career_id]
-- Example: "Marketing"

-- Student must complete 3 Cluster question sets where:
WHERE question_sets.career_cluster IS NOT NULL
  AND question_sets.career_cluster = [career's career_cluster]
  AND student_accuracy >= 0.90
```

### Prerequisites
- ✅ Section 1 (Career Mastery) must be unlocked for this career

### What It Unlocks
- ✅ Lock image (bottom left) visible
- Career Image remains visible
- 🔒 Key (bottom right) still locked

### Database Tracking
```sql
student_pathkeys (
  ...
  industry_mastery_unlocked BOOLEAN DEFAULT false,
  industry_mastery_unlocked_at TIMESTAMPTZ,
  industry_mastery_via TEXT, -- 'industry' or 'cluster'
  cluster_mastery_unlocked BOOLEAN DEFAULT false,
  cluster_mastery_unlocked_at TIMESTAMPTZ,
  ...
)

-- Track progress toward 3 completions
student_pathkey_progress (
  student_id UUID,
  career_id UUID,
  mastery_type TEXT, -- 'industry', 'cluster', 'business_driver'
  question_set_id UUID,
  completed_at TIMESTAMPTZ,
  accuracy DECIMAL,
  ...
)
```

### Key Design Note
- Students can unlock via **EITHER** Industry or Cluster path
- Completing one path does NOT block the other
- Both paths can be tracked independently for completeness/achievements
- But only ONE needs to be completed to unlock the Lock section

---

## Section 3: Business Driver Mastery (Key - Bottom Right)

### Award Criteria
- **Exploration Type:** `exploration_type = 'Career'` **ONLY**
- **Question Sets:** Where `question_sets.career_id = [target_career_id]`
- **Achievement:** Complete **5 questions** in **each of 6 business drivers** with **90% accuracy per driver**
- **Difficulty:** Any
- **Tracking:** Historical accumulation in chunks of 5 questions

### Business Drivers (6 P's)
1. **People** - Team management, collaboration, communication, leadership
2. **Product** - Product/service development, innovation, quality, tools
3. **Pricing** - Budgeting, financial planning, cost analysis, compensation
4. **Process** - Workflows, procedures, protocols, safety, compliance
5. **Proceeds** - Revenue, career growth, market opportunities, advancement
6. **Profits** - Ethics, ROI, efficiency, strategic decisions, value creation

### Unlock Logic

**Per Business Driver:**
```sql
-- For EACH business driver, student must complete a chunk of 5 questions with 90% accuracy
-- Track in groups: 5 questions answered, calculate accuracy
-- If accuracy >= 90% (4.5/5 or better), mark that driver as complete

-- Example for "people" driver:
WHERE question_set.career_id = [target_career_id]
  AND questions.business_driver = 'people'
  AND COUNT(questions) >= 5
  AND (SUM(is_correct) / COUNT(*)) >= 0.90
```

**All Drivers Required:**
- Student must complete all 6 business drivers (6 chunks of 5 questions each)
- Each chunk must meet 90% accuracy independently
- Total: 30+ questions answered with 27+ correct (90% overall)

### Prerequisites
- ✅ Section 1 (Career Mastery) must be unlocked for this career
- ❌ Section 2 NOT required (students can unlock Section 3 independently)

### What It Unlocks
- ✅ Key image (bottom right) visible
- Career Image and Lock remain in their current state

### Database Tracking
```sql
student_pathkeys (
  ...
  business_driver_mastery_unlocked BOOLEAN DEFAULT false,
  business_driver_mastery_unlocked_at TIMESTAMPTZ,
  ...
)

-- Track progress for each business driver
student_business_driver_progress (
  id UUID PRIMARY KEY,
  student_id UUID,
  career_id UUID,
  business_driver TEXT, -- 'people', 'product', 'pricing', 'process', 'proceeds', 'profits'
  questions_completed INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  mastery_achieved BOOLEAN DEFAULT false,
  mastery_achieved_at TIMESTAMPTZ,

  -- Track individual chunks of 5
  current_chunk_questions INTEGER DEFAULT 0,
  current_chunk_correct INTEGER DEFAULT 0,

  CONSTRAINT check_business_driver CHECK (business_driver IN ('people', 'product', 'pricing', 'process', 'proceeds', 'profits'))
)
```

### Accumulation Logic

**When student answers a question:**
1. Check if question has `business_driver` populated
2. Check if question is from a career question set (`career_id` = target)
3. Add to student's current chunk for that business driver
4. When chunk reaches 5 questions:
   - Calculate accuracy: `correct / 5`
   - If >= 90% (4.5/5): Mark driver as mastery achieved
   - Reset chunk counters
5. When all 6 drivers achieve mastery: Unlock Section 3

---

## Data Model

### New Tables

#### `student_pathkeys`
Tracks overall pathkey unlock status for each student/career combination.

```sql
CREATE TABLE student_pathkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,

  -- Section 1: Career Mastery
  career_mastery_unlocked BOOLEAN DEFAULT false,
  career_mastery_unlocked_at TIMESTAMPTZ,
  career_mastery_game_session_id UUID REFERENCES game_sessions(id),

  -- Section 2: Industry OR Cluster Mastery
  industry_mastery_unlocked BOOLEAN DEFAULT false,
  industry_mastery_unlocked_at TIMESTAMPTZ,
  industry_mastery_via TEXT, -- 'industry' or 'cluster'

  cluster_mastery_unlocked BOOLEAN DEFAULT false,
  cluster_mastery_unlocked_at TIMESTAMPTZ,

  -- Section 3: Business Driver Mastery
  business_driver_mastery_unlocked BOOLEAN DEFAULT false,
  business_driver_mastery_unlocked_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  UNIQUE(student_id, career_id),

  CONSTRAINT check_industry_via CHECK (industry_mastery_via IN ('industry', 'cluster'))
);

-- Indexes
CREATE INDEX idx_student_pathkeys_student ON student_pathkeys(student_id);
CREATE INDEX idx_student_pathkeys_career ON student_pathkeys(career_id);
CREATE INDEX idx_student_pathkeys_unlocked ON student_pathkeys(student_id)
  WHERE career_mastery_unlocked = true;

-- Comments
COMMENT ON TABLE student_pathkeys IS 'Tracks student progress on unlocking career pathkeys (3 sections per career)';
COMMENT ON COLUMN student_pathkeys.industry_mastery_via IS 'How Section 2 was unlocked: industry or cluster path';
```

#### `student_pathkey_progress`
Tracks progress toward Section 2 (Industry/Cluster) completions.

```sql
CREATE TABLE student_pathkey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,

  -- What type of mastery this contributes to
  mastery_type TEXT NOT NULL, -- 'industry' or 'cluster'

  -- Which question set was completed
  question_set_id UUID NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
  game_session_id UUID REFERENCES game_sessions(id),

  -- Performance metrics
  questions_attempted INTEGER NOT NULL,
  questions_correct INTEGER NOT NULL,
  accuracy DECIMAL NOT NULL,

  -- Timestamp
  completed_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT check_mastery_type CHECK (mastery_type IN ('industry', 'cluster')),
  CONSTRAINT check_accuracy_range CHECK (accuracy >= 0 AND accuracy <= 1),

  -- Prevent duplicate tracking of same question set completion
  UNIQUE(student_id, career_id, mastery_type, question_set_id)
);

-- Indexes
CREATE INDEX idx_pathkey_progress_student ON student_pathkey_progress(student_id, career_id);
CREATE INDEX idx_pathkey_progress_type ON student_pathkey_progress(mastery_type);

-- Comments
COMMENT ON TABLE student_pathkey_progress IS 'Tracks question set completions toward Section 2 (Industry/Cluster) mastery';
```

#### `student_business_driver_progress`
Tracks progress toward Section 3 (Business Driver) mastery.

```sql
CREATE TABLE student_business_driver_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,

  -- Which business driver
  business_driver TEXT NOT NULL,

  -- Overall progress for this driver
  total_questions_attempted INTEGER DEFAULT 0,
  total_questions_correct INTEGER DEFAULT 0,
  mastery_achieved BOOLEAN DEFAULT false,
  mastery_achieved_at TIMESTAMPTZ,

  -- Current chunk tracking (resets after each successful chunk)
  current_chunk_questions INTEGER DEFAULT 0,
  current_chunk_correct INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT check_business_driver CHECK (business_driver IN ('people', 'product', 'pricing', 'process', 'proceeds', 'profits')),
  UNIQUE(student_id, career_id, business_driver)
);

-- Indexes
CREATE INDEX idx_business_driver_progress_student ON student_business_driver_progress(student_id, career_id);
CREATE INDEX idx_business_driver_progress_mastery ON student_business_driver_progress(business_driver, mastery_achieved);

-- Comments
COMMENT ON TABLE student_business_driver_progress IS 'Tracks question-by-question progress toward Business Driver mastery (Section 3)';
COMMENT ON COLUMN student_business_driver_progress.current_chunk_questions IS 'Questions in current 5-question chunk (resets after successful 90% chunk)';
```

---

## Implementation Flow

### Section 1: Career Mastery

**Trigger:** When game session ends

```javascript
// After game session completes
async function checkCareerMastery(studentId, gameSessionId) {
  const session = await getGameSession(gameSessionId);

  // Check if Career mode
  if (session.exploration_type !== 'career') return;

  // Check if Top 3 finish
  const rank = await getStudentRank(studentId, gameSessionId);
  if (rank > 3) return;

  // Get career_id from question set
  const questionSet = await getQuestionSet(session.question_set_id);
  if (!questionSet.career_id) return;

  // Award Career Mastery (Section 1)
  await upsertStudentPathkey(studentId, questionSet.career_id, {
    career_mastery_unlocked: true,
    career_mastery_unlocked_at: new Date(),
    career_mastery_game_session_id: gameSessionId
  });
}
```

### Section 2: Industry/Cluster Mastery

**Trigger:** When game session ends (for Industry or Cluster modes)

```javascript
// After game session completes
async function checkIndustryClusterMastery(studentId, gameSessionId) {
  const session = await getGameSession(gameSessionId);

  // Check if Industry or Cluster mode
  if (!['industry', 'cluster'].includes(session.exploration_type)) return;

  // Calculate accuracy
  const accuracy = calculateAccuracy(session);
  if (accuracy < 0.90) return;

  const questionSet = await getQuestionSet(session.question_set_id);

  // Determine mastery type and matching field
  const masteryType = session.exploration_type; // 'industry' or 'cluster'
  const matchingField = masteryType === 'industry'
    ? questionSet.career_sector
    : questionSet.career_cluster;

  if (!matchingField) return;

  // Find careers that match this sector/cluster
  const matchingCareers = await getCareersBy(
    masteryType === 'industry' ? 'career_sector' : 'career_cluster',
    matchingField
  );

  // For each matching career where student has Career Mastery
  for (const career of matchingCareers) {
    const pathkey = await getStudentPathkey(studentId, career.id);

    // Must have Career Mastery unlocked
    if (!pathkey?.career_mastery_unlocked) continue;

    // Track this completion
    await trackPathkeyProgress(studentId, career.id, masteryType, {
      question_set_id: session.question_set_id,
      game_session_id: gameSessionId,
      questions_attempted: session.total_questions,
      questions_correct: session.correct_answers,
      accuracy: accuracy
    });

    // Check if 3 completions reached
    const progressCount = await countPathkeyProgress(
      studentId,
      career.id,
      masteryType
    );

    if (progressCount >= 3) {
      // Award Industry/Cluster Mastery (Section 2)
      await updateStudentPathkey(studentId, career.id, {
        [`${masteryType}_mastery_unlocked`]: true,
        [`${masteryType}_mastery_unlocked_at`]: new Date(),
        ...(masteryType === 'industry' && { industry_mastery_via: 'industry' }),
        ...(masteryType === 'cluster' && { industry_mastery_via: 'cluster' })
      });
    }
  }
}
```

### Section 3: Business Driver Mastery

**Trigger:** After each question is answered (real-time tracking)

```javascript
// After student answers a question
async function trackBusinessDriverProgress(studentId, questionId, isCorrect) {
  const question = await getQuestion(questionId);

  // Must have business_driver
  if (!question.business_driver) return;

  const questionSet = await getQuestionSet(question.question_set_id);

  // Must be Career mode (career_id not null)
  if (!questionSet.career_id) return;

  // Check if student has Career Mastery for this career
  const pathkey = await getStudentPathkey(studentId, questionSet.career_id);
  if (!pathkey?.career_mastery_unlocked) return;

  // Get or create progress record for this business driver
  const progress = await getOrCreateBusinessDriverProgress(
    studentId,
    questionSet.career_id,
    question.business_driver
  );

  // Update current chunk
  progress.current_chunk_questions += 1;
  progress.current_chunk_correct += isCorrect ? 1 : 0;
  progress.total_questions_attempted += 1;
  progress.total_questions_correct += isCorrect ? 1 : 0;

  // Check if chunk of 5 is complete
  if (progress.current_chunk_questions >= 5) {
    const chunkAccuracy = progress.current_chunk_correct / 5;

    if (chunkAccuracy >= 0.90) {
      // Mark this driver as mastery achieved
      progress.mastery_achieved = true;
      progress.mastery_achieved_at = new Date();
    }

    // Reset chunk counters (whether successful or not)
    progress.current_chunk_questions = 0;
    progress.current_chunk_correct = 0;
  }

  await saveBusinessDriverProgress(progress);

  // Check if ALL 6 drivers have mastery
  const allDriversMastered = await checkAllDriversMastered(
    studentId,
    questionSet.career_id
  );

  if (allDriversMastered) {
    // Award Business Driver Mastery (Section 3)
    await updateStudentPathkey(studentId, questionSet.career_id, {
      business_driver_mastery_unlocked: true,
      business_driver_mastery_unlocked_at: new Date()
    });
  }
}
```

---

## Important Data Context

### Exploration Type Filters (useQuestionSets.ts)

**Industry:**
```javascript
// career_id IS NULL AND career_cluster IS NULL
if (set.career_id !== null) return false;
if (set.career_cluster !== null && set.career_cluster !== '') return false;
```

**Career:**
```javascript
// career_id IS NOT NULL
if (set.career_id === null) return false;
```

**Cluster:**
```javascript
// career_cluster IS NOT NULL
if (set.career_cluster === null || set.career_cluster === '') return false;
```

### Current Question Distribution

**After Rollback Migration 050:**
- **Industry:** 10 question sets, 240 questions
- **Career:** 50 question sets, 720 questions
- **Cluster:** 11 question sets, 40 questions (9 have 0 questions - need generation)

### Business Driver Field

**Verification Results:**
- **Career questions:** 83.3% have business_driver (600/720)
- **Industry questions:** 75% have business_driver (180/240)
- **Cluster questions:** 0% have business_driver (0/40)

**For Section 3:** Only Career questions count (career_id IS NOT NULL)

---

## Edge Cases & Considerations

### 1. Multiple Pathkey Progress
- Students can work on multiple career pathkeys simultaneously
- Each career's progress is tracked independently
- No limit on how many pathkeys a student can unlock

### 2. Section Unlock Order
- Section 1 is always the prerequisite for Sections 2 & 3
- Sections 2 & 3 are independent of each other
- Students can unlock Section 3 before Section 2 (or vice versa)

### 3. Incomplete Chunks (Section 3)
- If student answers 3 questions in a business driver chunk, then stops playing
- Current chunk progress is saved
- Next time they answer questions for that driver, continues from 3/5
- Only when chunk reaches 5 is accuracy evaluated

### 4. Failed Chunks (Section 3)
- If student completes 5 questions but accuracy < 90%
- Chunk counters reset to 0
- They must start a new chunk of 5 questions
- Total questions attempted/correct continue to accumulate (for statistics)

### 5. Career Sector/Cluster Mismatches
- Some careers may have `career_sector` or `career_cluster` = NULL
- If career has NULL sector: Industry path cannot be completed
- If career has NULL cluster: Cluster path cannot be completed
- This is acceptable - student must use the available path

### 6. Question Set Without business_driver
- 16.7% of Career questions don't have business_driver yet
- These questions don't count toward Section 3 progress
- Consider generating/populating business_driver for all Career questions

---

## Testing Checklist

### Section 1: Career Mastery
- [ ] Top 3 finish in Career mode unlocks Section 1
- [ ] 4th place or lower does NOT unlock
- [ ] Works in solo, multiplayer, and tournament modes
- [ ] Only applies to Career exploration type
- [ ] Pathkey record created with correct timestamps

### Section 2: Industry Path
- [ ] Complete 3 Industry question sets with 90% accuracy
- [ ] Matches on career_sector correctly
- [ ] Only unlocks for careers with Section 1 completed
- [ ] Tracks progress correctly (1/3, 2/3, 3/3)
- [ ] Accuracy < 90% does not count toward progress

### Section 2: Cluster Path
- [ ] Complete 3 Cluster question sets with 90% accuracy
- [ ] Matches on career_cluster correctly
- [ ] Only unlocks for careers with Section 1 completed
- [ ] Independent of Industry path
- [ ] Both paths can be completed for same career

### Section 3: Business Driver Mastery
- [ ] Only Career mode questions count
- [ ] Each business driver tracks independently
- [ ] Chunks of 5 questions with 90% accuracy
- [ ] Failed chunks reset counters
- [ ] Incomplete chunks save progress
- [ ] All 6 drivers must be completed
- [ ] Only unlocks for careers with Section 1 completed
- [ ] Section 2 NOT required

### Edge Cases
- [ ] Multiple careers can be worked on simultaneously
- [ ] Progress persists across sessions
- [ ] Works correctly with missing career_sector/cluster
- [ ] Handles questions without business_driver gracefully

---

## Next Steps

1. **Database Migrations**
   - Create `student_pathkeys` table
   - Create `student_pathkey_progress` table
   - Create `student_business_driver_progress` table
   - Add indexes and constraints

2. **Backend Implementation**
   - Game session completion hooks
   - Question answer tracking for business drivers
   - Progress calculation functions
   - Unlock detection and award logic

3. **Frontend UI**
   - Pathkey display component (3-section visual)
   - Progress indicators for each section
   - Career selection for pathkey tracking
   - Achievement notifications

4. **Data Quality**
   - Ensure all Career questions have business_driver populated
   - Verify career_sector and career_cluster coverage
   - Generate missing Cluster questions (9 empty sets)

5. **Documentation**
   - Update `HOW_TO_PLAY.md` with pathkey system
   - Create student-facing pathkey guide
   - Teacher dashboard for viewing student pathkeys

---

## References

- **Source Document:** `docs/Pathkey_Award_System.pdf`
- **Filter Logic:** `packages/web/src/hooks/useQuestionSets.ts` (lines 126-136)
- **Migration Context:** Migration 050 (rollback of 048 & 049)
- **Verification Script:** `scripts/verify-business-driver-field.mjs`
- **Content Analysis:** `scripts/analyze-content-by-exploration-type.mjs`

---

*Document Created: 2025-01-08*
*Last Updated: 2025-01-08*
