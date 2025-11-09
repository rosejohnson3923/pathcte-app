-- Migration: Create Pathkey Award System Tables
-- Description: Tables for tracking student progress toward earning pathkeys
--
-- Three progressive sections:
--   1. Career Mastery (unlock career image) - Top 3 in career mode
--   2. Industry/Cluster Mastery (unlock lock) - 3 sets with 90% accuracy
--   3. Business Driver Mastery (unlock key) - 5 questions per driver with 90% accuracy
--
-- Design documented in: docs/PATHKEY_AWARD_SYSTEM_DESIGN.md

BEGIN;

-- ============================================================================
-- Table 1: student_pathkeys
-- ============================================================================
-- Main tracking table for pathkey unlocks per student per career
-- Each row represents one pathkey (one career for one student)

CREATE TABLE IF NOT EXISTS student_pathkeys (
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,

  -- Section 1: Career Mastery (unlock career image)
  career_mastery_unlocked BOOLEAN DEFAULT false,
  career_mastery_unlocked_at TIMESTAMP WITH TIME ZONE,

  -- Section 2: Industry/Cluster Mastery (unlock lock)
  -- Student can unlock via EITHER industry OR cluster path
  industry_mastery_unlocked BOOLEAN DEFAULT false,
  industry_mastery_via TEXT CHECK (industry_mastery_via IN ('industry', 'cluster')),
  industry_mastery_unlocked_at TIMESTAMP WITH TIME ZONE,

  -- Alternative: Cluster path (kept for clarity)
  cluster_mastery_unlocked BOOLEAN DEFAULT false,
  cluster_mastery_unlocked_at TIMESTAMP WITH TIME ZONE,

  -- Section 3: Business Driver Mastery (unlock key)
  business_driver_mastery_unlocked BOOLEAN DEFAULT false,
  business_driver_mastery_unlocked_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  PRIMARY KEY (student_id, career_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_student_pathkeys_student ON student_pathkeys(student_id);
CREATE INDEX idx_student_pathkeys_career ON student_pathkeys(career_id);
CREATE INDEX idx_student_pathkeys_career_mastery ON student_pathkeys(student_id, career_mastery_unlocked);

-- ============================================================================
-- Table 2: student_pathkey_progress
-- ============================================================================
-- Tracks progress toward Section 2 (Industry/Cluster Mastery)
-- Records each question set completed with 90%+ accuracy

CREATE TABLE IF NOT EXISTS student_pathkey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,

  -- Which path: 'industry' or 'cluster'
  mastery_type TEXT NOT NULL CHECK (mastery_type IN ('industry', 'cluster')),

  -- Which question set was completed
  question_set_id UUID NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,

  -- What accuracy was achieved
  accuracy NUMERIC(5,2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),

  -- When it was completed
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: Only count each question set once per student per career per path
  UNIQUE (student_id, career_id, mastery_type, question_set_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_pathkey_progress_student_career ON student_pathkey_progress(student_id, career_id);
CREATE INDEX idx_pathkey_progress_mastery_type ON student_pathkey_progress(student_id, career_id, mastery_type);
CREATE INDEX idx_pathkey_progress_accuracy ON student_pathkey_progress(student_id, career_id, mastery_type, accuracy);

-- ============================================================================
-- Table 3: student_business_driver_progress
-- ============================================================================
-- Tracks progress toward Section 3 (Business Driver Mastery)
-- Accumulates questions in chunks of 5 with 90% accuracy per driver

CREATE TABLE IF NOT EXISTS student_business_driver_progress (
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  business_driver TEXT NOT NULL CHECK (business_driver IN ('people', 'product', 'pricing', 'process', 'proceeds', 'profits')),

  -- Current chunk tracking (resets after chunk completes or fails)
  current_chunk_questions INTEGER DEFAULT 0 CHECK (current_chunk_questions >= 0 AND current_chunk_questions <= 5),
  current_chunk_correct INTEGER DEFAULT 0 CHECK (current_chunk_correct >= 0 AND current_chunk_correct <= 5),

  -- Historical tracking
  mastery_achieved BOOLEAN DEFAULT false,
  mastery_achieved_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  PRIMARY KEY (student_id, career_id, business_driver)
);

-- Indexes for efficient queries
CREATE INDEX idx_business_driver_progress_student_career ON student_business_driver_progress(student_id, career_id);
CREATE INDEX idx_business_driver_progress_mastery ON student_business_driver_progress(student_id, career_id, mastery_achieved);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all three tables
ALTER TABLE student_pathkeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_pathkey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_business_driver_progress ENABLE ROW LEVEL SECURITY;

-- student_pathkeys policies
CREATE POLICY student_pathkeys_select ON student_pathkeys
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  );

CREATE POLICY student_pathkeys_insert ON student_pathkeys
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY student_pathkeys_update ON student_pathkeys
  FOR UPDATE
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- student_pathkey_progress policies
CREATE POLICY pathkey_progress_select ON student_pathkey_progress
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  );

CREATE POLICY pathkey_progress_insert ON student_pathkey_progress
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- student_business_driver_progress policies
CREATE POLICY business_driver_progress_select ON student_business_driver_progress
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  );

CREATE POLICY business_driver_progress_insert ON student_business_driver_progress
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY business_driver_progress_update ON student_business_driver_progress
  FOR UPDATE
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- ============================================================================
-- Triggers
-- ============================================================================

-- Update updated_at timestamp on student_pathkeys
CREATE OR REPLACE FUNCTION update_pathkey_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_student_pathkeys_timestamp
  BEFORE UPDATE ON student_pathkeys
  FOR EACH ROW
  EXECUTE FUNCTION update_pathkey_timestamp();

-- Update last_updated timestamp on student_business_driver_progress
CREATE TRIGGER update_business_driver_progress_timestamp
  BEFORE UPDATE ON student_business_driver_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_pathkey_timestamp();

-- ============================================================================
-- Verification
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Pathkey tables created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables:';
  RAISE NOTICE '  - student_pathkeys (main tracking)';
  RAISE NOTICE '  - student_pathkey_progress (Section 2 tracking)';
  RAISE NOTICE '  - student_business_driver_progress (Section 3 tracking)';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS Policies:';
  RAISE NOTICE '  - Students can view/modify their own records';
  RAISE NOTICE '  - Teachers/Admins can view all student records';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready to implement pathkey award logic!';
END $$;

COMMIT;
