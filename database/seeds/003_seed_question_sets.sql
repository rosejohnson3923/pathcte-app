-- Seed Data: Question Sets and Questions
-- Description: Sample question sets with questions for testing the game system

-- Note: This script requires a creator_id (teacher profile)
-- You'll need to replace 'YOUR_TEACHER_UUID_HERE' with an actual teacher profile UUID
-- Or create one using: SELECT id FROM public.profiles WHERE user_type = 'teacher' LIMIT 1;

-- Clean existing data (for re-seeding)
DO $$
DECLARE
  test_teacher_id UUID;
  set1_id UUID;
  set2_id UUID;
  set3_id UUID;
BEGIN
  -- Try to get an existing teacher, or use a placeholder
  -- In production, you'd want to create a test teacher account first
  SELECT id INTO test_teacher_id FROM public.profiles WHERE user_type = 'teacher' LIMIT 1;

  -- If no teacher exists, create a placeholder UUID (you'll need to update this)
  IF test_teacher_id IS NULL THEN
    -- Use a well-known test UUID - you should replace this with a real teacher ID
    test_teacher_id := '00000000-0000-0000-0000-000000000001'::uuid;
    RAISE NOTICE 'No teacher found. Using placeholder UUID: %. You need to update this!', test_teacher_id;
  END IF;

  -- Delete existing test question sets
  DELETE FROM public.question_sets
  WHERE title IN (
    'Career Exploration Basics',
    'Healthcare Careers Quiz',
    'Technology & Innovation'
  );

  -- Insert Question Set 1: Career Exploration Basics (General)
  INSERT INTO public.question_sets (
    id,
    creator_id,
    title,
    description,
    subject,
    grade_level,
    career_sector,
    tags,
    is_public,
    is_verified,
    total_questions,
    difficulty_level
  ) VALUES (
    gen_random_uuid(),
    test_teacher_id,
    'Career Exploration Basics',
    'Introduction to various career paths and what they entail. Perfect for students exploring their options!',
    'Career Education',
    ARRAY[8, 9, 10, 11, 12],
    NULL,
    ARRAY['careers', 'exploration', 'general', 'beginner'],
    true,
    true,
    10,
    'easy'
  ) RETURNING id INTO set1_id;

  -- Questions for Set 1: Career Exploration Basics
  INSERT INTO public.questions (
    question_set_id,
    question_text,
    question_type,
    options,
    time_limit_seconds,
    points,
    order_index,
    difficulty
  ) VALUES
  (
    set1_id,
    'What does a Software Developer primarily do?',
    'multiple_choice',
    '[
      {"text": "Design and write computer programs", "is_correct": true},
      {"text": "Fix broken computers", "is_correct": false},
      {"text": "Sell software products", "is_correct": false},
      {"text": "Teach people how to use computers", "is_correct": false}
    ]'::jsonb,
    20,
    10,
    0,
    'easy'
  ),
  (
    set1_id,
    'Which of these is a key skill for a Registered Nurse?',
    'multiple_choice',
    '[
      {"text": "Patience and empathy", "is_correct": true},
      {"text": "Advanced mathematics", "is_correct": false},
      {"text": "Public speaking", "is_correct": false},
      {"text": "Graphic design", "is_correct": false}
    ]'::jsonb,
    20,
    10,
    1,
    'easy'
  ),
  (
    set1_id,
    'Marketing Managers typically need which type of degree?',
    'multiple_choice',
    '[
      {"text": "Bachelor''s degree in Marketing or related field", "is_correct": true},
      {"text": "High school diploma only", "is_correct": false},
      {"text": "Medical degree", "is_correct": false},
      {"text": "No formal education required", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    2,
    'easy'
  ),
  (
    set1_id,
    'What is the main responsibility of a Civil Engineer?',
    'multiple_choice',
    '[
      {"text": "Design and oversee construction of infrastructure", "is_correct": true},
      {"text": "Enforce traffic laws", "is_correct": false},
      {"text": "Plan city budgets", "is_correct": false},
      {"text": "Manage government offices", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    3,
    'easy'
  ),
  (
    set1_id,
    'Which career typically requires a teaching license?',
    'multiple_choice',
    '[
      {"text": "Elementary School Teacher", "is_correct": true},
      {"text": "Corporate Trainer", "is_correct": false},
      {"text": "YouTube Educator", "is_correct": false},
      {"text": "Private Tutor", "is_correct": false}
    ]'::jsonb,
    20,
    10,
    4,
    'easy'
  ),
  (
    set1_id,
    'Public Relations Specialists primarily work to:',
    'multiple_choice',
    '[
      {"text": "Maintain positive public image for organizations", "is_correct": true},
      {"text": "Sell products directly to customers", "is_correct": false},
      {"text": "Design company websites", "is_correct": false},
      {"text": "Manage employee payroll", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    5,
    'easy'
  ),
  (
    set1_id,
    'Which industry is growing the fastest according to job outlook?',
    'multiple_choice',
    '[
      {"text": "Technology/Software Development", "is_correct": true},
      {"text": "Administrative Support", "is_correct": false},
      {"text": "Manufacturing", "is_correct": false},
      {"text": "Print Journalism", "is_correct": false}
    ]'::jsonb,
    25,
    15,
    6,
    'medium'
  ),
  (
    set1_id,
    'What type of work environment do most Administrative Assistants work in?',
    'multiple_choice',
    '[
      {"text": "Office settings with standard business hours", "is_correct": true},
      {"text": "Outdoor construction sites", "is_correct": false},
      {"text": "Hospital emergency rooms", "is_correct": false},
      {"text": "Remote only, no office", "is_correct": false}
    ]'::jsonb,
    20,
    10,
    7,
    'easy'
  ),
  (
    set1_id,
    'A career in Healthcare typically requires:',
    'multiple_choice',
    '[
      {"text": "Strong interpersonal and patient care skills", "is_correct": true},
      {"text": "Only technical medical knowledge", "is_correct": false},
      {"text": "Business management expertise", "is_correct": false},
      {"text": "Artistic ability", "is_correct": false}
    ]'::jsonb,
    20,
    10,
    8,
    'easy'
  ),
  (
    set1_id,
    'Which statement about career education is TRUE?',
    'multiple_choice',
    '[
      {"text": "Most careers require specific education and training", "is_correct": true},
      {"text": "You can do any job without preparation", "is_correct": false},
      {"text": "Career choices are final and cannot change", "is_correct": false},
      {"text": "Salary is the only factor to consider", "is_correct": false}
    ]'::jsonb,
    25,
    15,
    9,
    'medium'
  );

  -- Insert Question Set 2: Healthcare Careers
  INSERT INTO public.question_sets (
    id,
    creator_id,
    title,
    description,
    subject,
    grade_level,
    career_sector,
    tags,
    is_public,
    is_verified,
    total_questions,
    difficulty_level
  ) VALUES (
    gen_random_uuid(),
    test_teacher_id,
    'Healthcare Careers Quiz',
    'Deep dive into healthcare professions, requirements, and working conditions.',
    'Career Education',
    ARRAY[9, 10, 11, 12],
    'Healthcare',
    ARRAY['healthcare', 'medical', 'nursing', 'intermediate'],
    true,
    true,
    8,
    'medium'
  ) RETURNING id INTO set2_id;

  -- Questions for Set 2: Healthcare Careers
  INSERT INTO public.questions (
    question_set_id,
    question_text,
    question_type,
    options,
    time_limit_seconds,
    points,
    order_index,
    difficulty
  ) VALUES
  (
    set2_id,
    'What is the median salary for a Registered Nurse?',
    'multiple_choice',
    '[
      {"text": "Around $77,600 per year", "is_correct": true},
      {"text": "Around $35,000 per year", "is_correct": false},
      {"text": "Around $150,000 per year", "is_correct": false},
      {"text": "Around $50,000 per year", "is_correct": false}
    ]'::jsonb,
    30,
    15,
    0,
    'medium'
  ),
  (
    set2_id,
    'What certification is required for all Registered Nurses?',
    'multiple_choice',
    '[
      {"text": "RN License", "is_correct": true},
      {"text": "CPR Certification only", "is_correct": false},
      {"text": "Medical degree", "is_correct": false},
      {"text": "No certification needed", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    1,
    'easy'
  ),
  (
    set2_id,
    'Nurses may need to work:',
    'multiple_choice',
    '[
      {"text": "Nights, weekends, and holidays", "is_correct": true},
      {"text": "Only Monday through Friday", "is_correct": false},
      {"text": "Only during summer months", "is_correct": false},
      {"text": "Part-time hours only", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    2,
    'easy'
  ),
  (
    set2_id,
    'Which skill is MOST important for healthcare professionals?',
    'multiple_choice',
    '[
      {"text": "Critical thinking and problem-solving", "is_correct": true},
      {"text": "Social media marketing", "is_correct": false},
      {"text": "Computer programming", "is_correct": false},
      {"text": "Foreign language fluency", "is_correct": false}
    ]'::jsonb,
    30,
    15,
    3,
    'medium'
  ),
  (
    set2_id,
    'The job outlook for Registered Nurses is:',
    'multiple_choice',
    '[
      {"text": "Faster than average (6% growth)", "is_correct": true},
      {"text": "Declining rapidly", "is_correct": false},
      {"text": "No growth expected", "is_correct": false},
      {"text": "Slower than average", "is_correct": false}
    ]'::jsonb,
    30,
    15,
    4,
    'medium'
  ),
  (
    set2_id,
    'What type of degree is typically required for RN positions?',
    'multiple_choice',
    '[
      {"text": "Associate''s or Bachelor''s degree in Nursing", "is_correct": true},
      {"text": "High school diploma", "is_correct": false},
      {"text": "Doctoral degree", "is_correct": false},
      {"text": "Master''s degree required", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    5,
    'easy'
  ),
  (
    set2_id,
    'Which is a primary responsibility of a Registered Nurse?',
    'multiple_choice',
    '[
      {"text": "Assess patient conditions and provide care", "is_correct": true},
      {"text": "Perform surgery", "is_correct": false},
      {"text": "Prescribe all medications independently", "is_correct": false},
      {"text": "Manage hospital finances", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    6,
    'easy'
  ),
  (
    set2_id,
    'Healthcare careers are described as:',
    'multiple_choice',
    '[
      {"text": "Physically and emotionally demanding", "is_correct": true},
      {"text": "Low-stress desk jobs", "is_correct": false},
      {"text": "Requiring minimal training", "is_correct": false},
      {"text": "Always working alone", "is_correct": false}
    ]'::jsonb,
    30,
    15,
    7,
    'medium'
  );

  -- Insert Question Set 3: Technology & Innovation
  INSERT INTO public.question_sets (
    id,
    creator_id,
    title,
    description,
    subject,
    grade_level,
    career_sector,
    tags,
    is_public,
    is_verified,
    total_questions,
    difficulty_level
  ) VALUES (
    gen_random_uuid(),
    test_teacher_id,
    'Technology & Innovation',
    'Explore tech careers including software development, physics, and engineering.',
    'STEM',
    ARRAY[10, 11, 12],
    'Technology',
    ARRAY['technology', 'stem', 'engineering', 'advanced'],
    true,
    true,
    7,
    'hard'
  ) RETURNING id INTO set3_id;

  -- Questions for Set 3: Technology & Innovation
  INSERT INTO public.questions (
    question_set_id,
    question_text,
    question_type,
    options,
    time_limit_seconds,
    points,
    order_index,
    difficulty
  ) VALUES
  (
    set3_id,
    'What is the projected job growth rate for Software Developers?',
    'multiple_choice',
    '[
      {"text": "22% - Much faster than average", "is_correct": true},
      {"text": "2% - Slower than average", "is_correct": false},
      {"text": "No growth expected", "is_correct": false},
      {"text": "10% - Average growth", "is_correct": false}
    ]'::jsonb,
    35,
    20,
    0,
    'hard'
  ),
  (
    set3_id,
    'Which certification is valuable for Software Developers?',
    'multiple_choice',
    '[
      {"text": "AWS Certified Developer", "is_correct": true},
      {"text": "Real Estate License", "is_correct": false},
      {"text": "CDL (Commercial Driver License)", "is_correct": false},
      {"text": "Teaching Certificate", "is_correct": false}
    ]'::jsonb,
    30,
    15,
    1,
    'medium'
  ),
  (
    set3_id,
    'What degree is typically required to become a Physicist?',
    'multiple_choice',
    '[
      {"text": "Doctoral or Master''s degree", "is_correct": true},
      {"text": "High school diploma", "is_correct": false},
      {"text": "Associate''s degree", "is_correct": false},
      {"text": "Bachelor''s degree is sufficient", "is_correct": false}
    ]'::jsonb,
    30,
    15,
    2,
    'medium'
  ),
  (
    set3_id,
    'What is the median salary for a Physicist?',
    'multiple_choice',
    '[
      {"text": "Around $129,000 per year", "is_correct": true},
      {"text": "Around $45,000 per year", "is_correct": false},
      {"text": "Around $75,000 per year", "is_correct": false},
      {"text": "Around $200,000 per year", "is_correct": false}
    ]'::jsonb,
    35,
    20,
    3,
    'hard'
  ),
  (
    set3_id,
    'Civil Engineers primarily use which type of software?',
    'multiple_choice',
    '[
      {"text": "CAD (Computer-Aided Design)", "is_correct": true},
      {"text": "Photo editing software", "is_correct": false},
      {"text": "Accounting software", "is_correct": false},
      {"text": "Video game engines", "is_correct": false}
    ]'::jsonb,
    30,
    15,
    4,
    'medium'
  ),
  (
    set3_id,
    'What is a key responsibility of a Software Developer?',
    'multiple_choice',
    '[
      {"text": "Write and test code for applications", "is_correct": true},
      {"text": "Manage company finances", "is_correct": false},
      {"text": "Design building structures", "is_correct": false},
      {"text": "Treat patients", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    5,
    'easy'
  ),
  (
    set3_id,
    'Which field combines mathematics, science, and experimentation?',
    'multiple_choice',
    '[
      {"text": "Physics", "is_correct": true},
      {"text": "Marketing", "is_correct": false},
      {"text": "Public Relations", "is_correct": false},
      {"text": "Administrative Support", "is_correct": false}
    ]'::jsonb,
    25,
    10,
    6,
    'easy'
  );

  RAISE NOTICE 'Successfully created 3 question sets with 25 total questions';
  RAISE NOTICE 'Set 1: % (10 questions)', set1_id;
  RAISE NOTICE 'Set 2: % (8 questions)', set2_id;
  RAISE NOTICE 'Set 3: % (7 questions)', set3_id;

END $$;

-- Verify seeded data
SELECT
  qs.id,
  qs.title,
  qs.difficulty_level,
  qs.total_questions,
  COUNT(q.id) as actual_question_count
FROM public.question_sets qs
LEFT JOIN public.questions q ON q.question_set_id = qs.id
WHERE qs.is_public = true AND qs.is_verified = true
GROUP BY qs.id, qs.title, qs.difficulty_level, qs.total_questions
ORDER BY qs.title;
