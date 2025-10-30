# Schema & AI Generation Alignment Documentation
## Pathket Question Sets, Questions, and Careers Data Model

**Created:** 2025-01-30
**Last Updated:** 2025-01-30
**Status:** MASTER REFERENCE DOCUMENT

---

## Table of Contents
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Data Flow & Relationships](#data-flow--relationships)
4. [Business Driver Implementation](#business-driver-implementation)
5. [AI Content Generation Requirements](#ai-content-generation-requirements)
6. [Current Gaps & Required Updates](#current-gaps--required-updates)

---

## Overview

This document defines the complete data model for Pathket's career education platform, including:
- Database schema for `careers`, `question_sets`, and `questions` tables
- Relationships between Industry, Sector, Career, and Business Drivers
- AI content generation requirements to match schema
- Filtering logic in the UI

### Key Concepts

**Two Game Modes:**
1. **Career Quest** (Multiplayer) - Sector/Industry-based question sets
2. **Explore Careers** (Solo) - Individual career-specific question sets

**Question Set Types:**
- `career_quest`: Multiplayer sector-based sets (e.g., "Healthcare Careers")
- `explore_careers`: Solo career-specific sets (e.g., "Registered Nurse - Career Exploration")
- `general`: General knowledge sets (future use)

---

## Database Schema

### 1. Careers Table

```sql
CREATE TABLE public.careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onet_code TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,

  -- CRITICAL FIELDS FOR FILTERING
  industry TEXT NOT NULL,      -- Gaming & Esports, Healthcare, etc.
  sector TEXT NOT NULL,         -- Arts & Entertainment, Technology, etc.
  career_cluster TEXT,          -- Career Cluster (optional)

  -- Requirements
  education_level TEXT[],
  certifications TEXT[],
  skills JSONB DEFAULT '[]'::jsonb,

  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_median INTEGER,
  salary_currency TEXT DEFAULT 'USD',

  -- Job Market
  growth_rate DECIMAL,
  job_outlook TEXT,
  employment_2023 INTEGER,
  employment_2033_projected INTEGER,

  -- Content
  day_in_life_text TEXT,
  video_url TEXT,
  tasks TEXT[],
  work_environment TEXT,

  -- Related
  related_careers UUID[],

  -- Metadata
  content_last_updated DATE,
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_careers_industry ON public.careers(industry);
CREATE INDEX idx_careers_sector ON public.careers(sector);
CREATE INDEX idx_careers_title ON public.careers(title);
```

**Key Relationships:**
- `industry`: Specific industry within a sector (e.g., "Gaming & Esports")
- `sector`: Broader category (e.g., "Arts & Entertainment")
- One sector contains multiple industries
- One industry contains multiple careers

**Example Data:**
```
Sector: Arts & Entertainment
  └─ Industry: Gaming & Esports
      ├─ Career: 3D Animator
      ├─ Career: Game Designer
      ├─ Career: Esports Commentator
      └─ Career: Game Developer
  └─ Industry: Film & Television
      ├─ Career: Film Director
      └─ Career: Cinematographer
```

---

### 2. Question Sets Table

```sql
CREATE TABLE public.question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,

  -- Classification
  subject TEXT NOT NULL,           -- "Healthcare", "Technology", etc.
  grade_level INTEGER[],           -- [9, 10, 11, 12]
  career_sector TEXT,              -- "Healthcare", "Technology", etc.
  tags TEXT[],

  -- CRITICAL: Question Set Type & Career Linking
  question_set_type TEXT CHECK (question_set_type IN ('career_quest', 'explore_careers', 'general')),
  career_id UUID REFERENCES public.careers(id) ON DELETE SET NULL,

  -- Status
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,

  -- Stats
  times_played INTEGER DEFAULT 0,
  average_score DECIMAL,
  total_questions INTEGER DEFAULT 0,

  -- Metadata
  thumbnail_url TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'mixed')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_question_sets_career_id ON public.question_sets(career_id);
CREATE INDEX idx_question_sets_type ON public.question_sets(question_set_type);
CREATE INDEX idx_question_sets_subject ON public.question_sets(subject);
CREATE INDEX idx_question_sets_sector ON public.question_sets(career_sector);
```

**Key Fields Explained:**

1. **`question_set_type`**
   - `career_quest`: Multiplayer sector/industry-based sets
     - NOT linked to specific career (`career_id = NULL`)
     - Broad topics like "Healthcare Careers Fundamentals"
   - `explore_careers`: Solo career-specific sets
     - LINKED to specific career (`career_id = UUID`)
     - Specific careers like "Registered Nurse - Career Exploration"
   - `general`: General knowledge (future use)

2. **`career_id`**
   - `NULL` for Career Quest sets (sector/industry-based)
   - `NOT NULL` for Explore Careers sets (career-specific)

3. **`subject`**
   - Broad subject category (e.g., "Healthcare", "Technology")
   - Maps to career sector for filtering

4. **`career_sector`**
   - Same as `subject` in most cases
   - Used for sector-based filtering

---

### 3. Questions Table

```sql
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id UUID NOT NULL REFERENCES public.question_sets(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false')),

  -- Options format: [{text: string, is_correct: boolean}, ...]
  options JSONB NOT NULL,

  -- Settings
  time_limit_seconds INTEGER DEFAULT 30,
  points INTEGER DEFAULT 10,

  -- Media
  image_url TEXT,

  -- CRITICAL: Business Driver Filtering
  business_driver TEXT CHECK (business_driver IN (
    'people',
    'product',
    'pricing',
    'process',
    'proceeds',
    'profits'
  )),

  -- Metadata
  order_index INTEGER DEFAULT 0,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_questions_question_set_id ON public.questions(question_set_id);
CREATE INDEX idx_questions_business_driver ON public.questions(business_driver);
```

**Business Driver (6 P's):**
- `people`: Human resources, team management, hiring, training
- `product`: Product/service development, quality, features
- `pricing`: Cost management, budgeting, pricing strategies
- `process`: Workflows, procedures, efficiency, operations
- `proceeds`: Revenue, sales, income generation
- `profits`: Financial performance, margins, profitability

**Purpose:** Allows filtering questions by business perspective for Career Quest multiplayer games

---

## Data Flow & Relationships

### Career Quest Mode (Multiplayer)

```
Teacher Hosts Game
  └─ Selects Exploration Type: INDUSTRY or CAREER or SUBJECT
      ├─ INDUSTRY Filter
      │   └─ Shows question_sets WHERE career_id IS NULL (broad sector sets)
      │       └─ Example: "Healthcare Careers Fundamentals"
      │
      ├─ CAREER Filter
      │   └─ Shows question_sets WHERE career_id IS NOT NULL (career-specific)
      │       └─ Example: "Registered Nurse - Career Exploration"
      │
      └─ SUBJECT Filter
          └─ Shows question_sets filtered by subject field
              └─ Example: subject = "Healthcare"

  └─ After selecting question_set, optionally filter by business_driver
      └─ Filters QUESTIONS within selected set by business_driver
          └─ Example: Show only "people" questions
```

**Key Implementation:**
- Exploration Type = Parent Filter (REQUIRED)
- Question Set = Child Filter (depends on Exploration Type)
- Business Driver = Question Filter (OPTIONAL, applied after set selection)

### Explore Careers Mode (Solo)

```
Student Selects Career
  └─ Finds question_set WHERE career_id = selected_career_id
      └─ Plays all questions in set (no business_driver filtering)
```

---

## Business Driver Implementation

### Database Level

**Migration:** `027_add_business_driver_to_questions.sql`

```sql
ALTER TABLE public.questions
ADD COLUMN business_driver TEXT
CHECK (business_driver IN ('people', 'product', 'pricing', 'process', 'proceeds', 'profits'));
```

### Application Level

**Filter Flow:**
1. User selects question set
2. System retrieves question set with settings: `{ businessDriver: 'people' }`
3. When loading questions, filter by business_driver:

```typescript
// In game.service.ts
const { questions } = await gameService.getGameQuestions(
  questionSetId,
  isHost,
  businessDriver  // 'people', 'product', etc., or null for all questions
);
```

**Query Logic:**
```typescript
let query = supabase
  .from('questions')
  .select('*')
  .eq('question_set_id', questionSetId)
  .order('order_index');

if (businessDriver) {
  query = query.eq('business_driver', businessDriver);
}
```

---

## AI Content Generation Requirements

### Current Scripts

1. **`generate-pathket-questions.mjs`**
   - Generates Career Quest (sector/industry-based) sets
   - **Does NOT currently generate business_driver**

2. **`generate-explore-careers-questions.mjs`**
   - Generates Explore Careers (career-specific) sets
   - **Does NOT currently generate business_driver**

### REQUIRED: Script Updates

Both scripts must be updated to:

#### 1. Generate Business Driver Tags

Each question MUST be tagged with appropriate business_driver:

```javascript
{
  "question_text": "You're a Registered Nurse and a patient's family member is upset about wait times. What do you do?",
  "business_driver": "people",  // ← REQUIRED
  "options": [...],
  "difficulty": "medium",
  "time_limit_seconds": 30,
  "points": 10
}
```

#### 2. Ensure Complete Coverage

For Career Quest sets, ensure questions cover ALL 6 P's:
- Minimum 2 questions per business_driver
- Balanced distribution across all 6 P's
- Clear alignment between question content and business_driver

#### 3. AI Prompt Updates

**Add to AI Prompts:**

```javascript
**CRITICAL: Business Driver Tagging**
EVERY question must be tagged with ONE of the 6 P's of Business & Career Success:

1. **people** - Questions about:
   - Team management, collaboration, communication
   - Hiring, training, employee relations
   - Leadership, delegation, mentoring
   - Customer/client/patient interactions
   - Interpersonal conflicts, teamwork

2. **product** - Questions about:
   - Product/service development, design
   - Quality control, testing, improvement
   - Features, functionality, user experience
   - Innovation, R&D, prototyping
   - Product lifecycle, maintenance

3. **pricing** - Questions about:
   - Cost estimation, budgeting
   - Pricing strategies, discounts
   - Resource allocation, cost control
   - Bid preparation, quotes
   - Financial planning, expense management

4. **process** - Questions about:
   - Workflows, procedures, protocols
   - Efficiency, optimization, automation
   - Safety procedures, compliance
   - Quality assurance, standards
   - Operations, logistics, scheduling

5. **proceeds** - Questions about:
   - Revenue generation, sales
   - Income streams, billing
   - Customer acquisition, retention
   - Marketing, promotion, outreach
   - Business development, growth

6. **profits** - Questions about:
   - Financial performance, margins
   - ROI, profitability analysis
   - Cost reduction, waste elimination
   - Resource optimization
   - Strategic financial decisions

Tag each question with the PRIMARY business driver it addresses.
```

---

## Current Gaps & Required Updates

### ❌ Gap 1: AI Scripts Don't Generate business_driver

**Current State:**
- `generate-pathket-questions.mjs` generates questions WITHOUT business_driver tags
- `generate-explore-careers-questions.mjs` generates questions WITHOUT business_driver tags

**Required Fix:**
1. Update AI prompts to include 6 P's framework
2. Ensure AI returns `business_driver` field for each question
3. Validate all questions have business_driver before inserting

**Priority:** HIGH - Required for Career Quest filtering to work properly

---

### ❌ Gap 2: Incomplete Industry/Sector Data

**Current State:**
- Careers table has industry and sector fields
- Not all careers have correct industry/sector values
- AI scripts don't validate against existing careers data

**Required Fix:**
1. Audit careers table for missing/incorrect industry/sector values
2. Ensure AI scripts pull industry/sector from careers table (not generate new ones)
3. Create master list of valid industries and sectors

**Priority:** MEDIUM - Needed for accurate filtering

---

### ❌ Gap 3: Question Set Type Consistency

**Current State:**
- Scripts generate question_set_type correctly
- But business_driver filtering only makes sense for career_quest type

**Required Fix:**
1. Only apply business_driver filtering to career_quest sets
2. Document that explore_careers sets use ALL questions (no filtering)
3. Update UI to hide business_driver filter for explore_careers

**Priority:** LOW - UI already handles this, but document it

---

## Action Plan

### Phase 1: Update AI Prompts ✅ READY TO IMPLEMENT

**Files to Update:**
1. `/pathfinity-app/scripts/generate-pathket-questions.mjs`
2. `/pathfinity-app/scripts/generate-explore-careers-questions.mjs`

**Changes:**
- Add 6 P's framework to system prompt
- Require business_driver field in response format
- Validate business_driver in parsed response
- Set default business_driver if missing (for backwards compatibility)

### Phase 2: Regenerate Question Sets

**Steps:**
1. Run updated scripts to generate new questions
2. Review AI-generated business_driver tags for accuracy
3. Import to database
4. Test filtering in UI

### Phase 3: Audit Existing Data

**Steps:**
1. Query questions WHERE business_driver IS NULL
2. Manually tag or regenerate
3. Validate industry/sector data in careers table
4. Document standard values

### Phase 4: Documentation

**Deliverables:**
- ✅ This master document
- Updated script README files
- UI filtering guide
- Teacher guide for business_driver selection

---

## Usage Examples

### Example 1: Career Quest - Healthcare with People Focus

```javascript
// Teacher selects:
explorationType: 'industry'
questionSet: 'Healthcare Careers Fundamentals' (career_id = NULL)
businessDriver: 'people'

// System queries:
SELECT * FROM questions
WHERE question_set_id = 'healthcare-set-uuid'
  AND business_driver = 'people'
ORDER BY order_index;

// Result: Only people-focused questions (patient interactions, teamwork, etc.)
```

### Example 2: Explore Careers - Registered Nurse

```javascript
// Student selects:
career: 'Registered Nurse'

// System queries:
SELECT qs.* FROM question_sets qs
WHERE qs.career_id = 'nurse-career-uuid'
  AND qs.question_set_type = 'explore_careers';

// Then loads ALL questions (no business_driver filtering)
SELECT * FROM questions
WHERE question_set_id = 'nurse-set-uuid'
ORDER BY order_index;
```

### Example 3: AI Generation with Business Drivers

**Prompt:**
```
Generate 10 questions about Healthcare Careers for grades 9-12.
Tag each question with the appropriate business_driver from the 6 P's.
```

**Expected Output:**
```json
{
  "questions": [
    {
      "question_text": "A hospital administrator needs to hire 5 new nurses. What's the first step?",
      "business_driver": "people",
      "options": [...]
    },
    {
      "question_text": "A medical device manufacturer wants to improve patient outcomes. What should they focus on?",
      "business_driver": "product",
      "options": [...]
    },
    {
      "question_text": "A clinic needs to determine pricing for a new service. What factors should they consider?",
      "business_driver": "pricing",
      "options": [...]
    }
  ]
}
```

---

## Validation Checklist

Use this checklist when generating or importing questions:

- [ ] Every question has `business_driver` field
- [ ] business_driver is one of: people, product, pricing, process, proceeds, profits
- [ ] Question content aligns with assigned business_driver
- [ ] Question set has correct `question_set_type`
- [ ] If `explore_careers`, has valid `career_id`
- [ ] If `career_quest`, has `career_id = NULL`
- [ ] Career record has `industry` and `sector` values
- [ ] Subject field matches career sector
- [ ] Total questions count is accurate

---

## Maintenance

**Review Frequency:** Monthly
**Owner:** Development Team
**Last Reviewed:** 2025-01-30

**Change Log:**
- 2025-01-30: Initial documentation created
- Document gaps in AI generation
- Define alignment requirements

**Next Steps:**
1. Update AI generation scripts with business_driver support
2. Regenerate question sets with proper tagging
3. Audit existing careers data
4. Create teacher guide for business_driver selection

---

## References

- **Database Migrations:**
  - `003_create_careers_table.sql` - Careers schema
  - `006_create_question_sets_table.sql` - Question sets schema
  - `007_create_questions_table.sql` - Questions schema
  - `024_add_career_fields_to_question_sets.sql` - Question set types
  - `027_add_business_driver_to_questions.sql` - Business driver support

- **AI Generation Scripts:**
  - `/pathfinity-app/scripts/generate-pathket-questions.mjs`
  - `/pathfinity-app/scripts/generate-explore-careers-questions.mjs`

- **UI Implementation:**
  - `/pathket.app/packages/web/src/pages/HostGamePage.tsx` - Filter hierarchy
  - `/pathket.app/packages/shared/src/services/game.service.ts` - Question loading

---

**END OF DOCUMENT**
