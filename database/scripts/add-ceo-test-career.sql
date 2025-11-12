-- ============================================
-- Add CEO Test Career with 10 Questions
-- ============================================
-- For testing Question Review feature
-- Run this in Supabase SQL Editor while logged in as a teacher
-- ============================================

-- Step 1: Insert CEO Career
INSERT INTO public.careers (
  onet_code,
  title,
  description,
  industry,
  sector,
  career_cluster,
  education_level,
  certifications,
  skills,
  salary_min,
  salary_max,
  salary_median,
  salary_currency,
  growth_rate,
  job_outlook,
  employment_2023,
  employment_2033_projected,
  day_in_life_text,
  video_url,
  tasks,
  work_environment,
  related_careers,
  content_last_updated,
  is_verified,
  metadata,
  pathkey_career_image,
  pathkey_lock_image,
  pathkey_key_image,
  pathkey_images_complete
) VALUES (
  '11-1011.00',
  'Chief Executive Officer (CEO)',
  'Determine and formulate policies and provide overall direction of companies or private and public sector organizations within guidelines set up by a board of directors or similar governing body. Plan, direct, or coordinate operational activities at the highest level of management with the help of subordinate executives and staff managers.',
  'Business',
  'Management',
  'Business Management and Administration',
  ARRAY['Bachelor''s Degree', 'Master''s Degree', 'MBA'],
  ARRAY['PMP Certification', 'Six Sigma Black Belt', 'Executive Leadership Certificate'],
  '[
    {"name": "Leadership", "level": 5},
    {"name": "Strategic Planning", "level": 5},
    {"name": "Decision Making", "level": 5},
    {"name": "Communication", "level": 5},
    {"name": "Financial Management", "level": 4},
    {"name": "Problem Solving", "level": 5},
    {"name": "Team Building", "level": 4}
  ]'::jsonb,
  150000,
  500000,
  280000,
  'USD',
  4.0,
  'As fast as average - Competition for top positions is intense',
  200000,
  210000,
  'CEOs start their day reviewing financial reports and key metrics. They attend board meetings, make strategic decisions about company direction, meet with department heads to align goals, participate in investor calls, and represent the company at industry events. The role requires constant communication with stakeholders, quick decision-making under pressure, and balancing short-term operational needs with long-term strategic vision.',
  null,
  ARRAY[
    'Direct and coordinate organization activities',
    'Establish and implement departmental policies, goals, objectives, and procedures',
    'Review financial statements, sales and activity reports, and other performance data',
    'Confer with board members, executives, and staff members to discuss issues and coordinate activities',
    'Analyze operations to evaluate performance and determine areas requiring cost reduction',
    'Direct and coordinate organization''s financial and budget activities',
    'Appoint department heads and managers',
    'Negotiate or approve contracts and agreements with suppliers, customers, and other parties',
    'Preside over or serve on board of directors, management committees, or other governing boards'
  ],
  'Work in offices and attend meetings frequently. May travel to other locations for meetings or to oversee operations. Work schedules are often long and irregular, including evenings and weekends. High-stress environment with significant responsibility.',
  null,
  CURRENT_DATE,
  true,
  '{}'::jsonb,
  'https://pathctestore.blob.core.windows.net/pathkeys/CEO.png',
  null,
  null,
  false
);

-- Get the CEO career ID for use in question set
DO $$
DECLARE
  v_career_id UUID;
  v_question_set_id UUID;
  v_creator_id UUID;
BEGIN
  -- Get CEO career ID
  SELECT id INTO v_career_id
  FROM public.careers
  WHERE onet_code = '11-1011.00';

  -- Get current user as creator (must be logged in as teacher)
  v_creator_id := auth.uid();

  -- If no auth.uid() (running as postgres/admin), use any teacher account
  IF v_creator_id IS NULL THEN
    SELECT id INTO v_creator_id
    FROM public.profiles
    WHERE user_type = 'teacher'
    LIMIT 1;

    IF v_creator_id IS NULL THEN
      RAISE EXCEPTION 'No teacher user found in database. Please create a teacher account first.';
    END IF;

    RAISE NOTICE 'Using teacher account: % as creator', v_creator_id;
  END IF;

  -- Step 2: Create Question Set for CEO
  INSERT INTO public.question_sets (
    creator_id,
    title,
    description,
    subject,
    career_id,
    question_set_type,
    career_sector,
    tags,
    is_public,
    is_verified,
    difficulty_level,
    total_questions
  ) VALUES (
    v_creator_id,
    'CEO - Career Explorer Test',
    'Quick 10-question test set for CEO career - perfect for testing Question Review feature',
    'Business Leadership',
    v_career_id,
    'explore_careers',
    'Business',
    ARRAY['CEO', 'Leadership', 'Management', 'Executive', 'Test'],
    true,
    true,
    'medium',
    10
  )
  RETURNING id INTO v_question_set_id;

  -- Step 3: Insert 10 Test Questions
  INSERT INTO public.questions (
    question_set_id,
    question_text,
    question_type,
    options,
    time_limit_seconds,
    order_index,
    difficulty,
    business_driver
  ) VALUES
  -- Question 1
  (
    v_question_set_id,
    'What is the primary role of a CEO in an organization?',
    'multiple_choice',
    '[
      {"text": "Managing day-to-day operations", "is_correct": false},
      {"text": "Setting overall company strategy and vision", "is_correct": true},
      {"text": "Handling customer service issues", "is_correct": false},
      {"text": "Performing technical work", "is_correct": false}
    ]'::jsonb,
    20,
    0,
    'easy',
    'process'
  ),
  -- Question 2
  (
    v_question_set_id,
    'Which skill is MOST critical for effective CEO leadership?',
    'multiple_choice',
    '[
      {"text": "Technical coding abilities", "is_correct": false},
      {"text": "Strategic decision-making", "is_correct": true},
      {"text": "Graphic design", "is_correct": false},
      {"text": "Social media posting", "is_correct": false}
    ]'::jsonb,
    20,
    1,
    'easy',
    'process'
  ),
  -- Question 3
  (
    v_question_set_id,
    'What does ROI stand for in business?',
    'multiple_choice',
    '[
      {"text": "Return on Investment", "is_correct": true},
      {"text": "Rate of Interest", "is_correct": false},
      {"text": "Revenue over Income", "is_correct": false},
      {"text": "Retail Operations Index", "is_correct": false}
    ]'::jsonb,
    20,
    2,
    'easy',
    'profits'
  ),
  -- Question 4
  (
    v_question_set_id,
    'Who does a CEO typically report to?',
    'multiple_choice',
    '[
      {"text": "Customers", "is_correct": false},
      {"text": "Employees", "is_correct": false},
      {"text": "Board of Directors", "is_correct": true},
      {"text": "Marketing team", "is_correct": false}
    ]'::jsonb,
    20,
    3,
    'medium',
    'people'
  ),
  -- Question 5
  (
    v_question_set_id,
    'What is a key component of corporate governance?',
    'multiple_choice',
    '[
      {"text": "Social media presence", "is_correct": false},
      {"text": "Office decoration", "is_correct": false},
      {"text": "Transparency and accountability", "is_correct": true},
      {"text": "Casual dress code", "is_correct": false}
    ]'::jsonb,
    20,
    4,
    'medium',
    'process'
  ),
  -- Question 6
  (
    v_question_set_id,
    'Which financial statement shows a company''s profitability?',
    'multiple_choice',
    '[
      {"text": "Balance Sheet", "is_correct": false},
      {"text": "Income Statement", "is_correct": true},
      {"text": "Cash Flow Statement", "is_correct": false},
      {"text": "Employee Directory", "is_correct": false}
    ]'::jsonb,
    20,
    5,
    'medium',
    'profits'
  ),
  -- Question 7
  (
    v_question_set_id,
    'What does a CEO do during a merger and acquisition?',
    'multiple_choice',
    '[
      {"text": "Ignores the process completely", "is_correct": false},
      {"text": "Leads due diligence and negotiation", "is_correct": true},
      {"text": "Only signs papers", "is_correct": false},
      {"text": "Lets junior staff handle everything", "is_correct": false}
    ]'::jsonb,
    20,
    6,
    'hard',
    'process'
  ),
  -- Question 8
  (
    v_question_set_id,
    'What is stakeholder management?',
    'multiple_choice',
    '[
      {"text": "Only caring about shareholders", "is_correct": false},
      {"text": "Balancing needs of all parties affected by business", "is_correct": true},
      {"text": "Ignoring customer feedback", "is_correct": false},
      {"text": "Managing office supplies", "is_correct": false}
    ]'::jsonb,
    20,
    7,
    'medium',
    'people'
  ),
  -- Question 9
  (
    v_question_set_id,
    'What is organizational culture?',
    'multiple_choice',
    '[
      {"text": "The office building design", "is_correct": false},
      {"text": "Shared values, beliefs, and practices", "is_correct": true},
      {"text": "Company logo and colors", "is_correct": false},
      {"text": "The employee handbook", "is_correct": false}
    ]'::jsonb,
    20,
    8,
    'medium',
    'people'
  ),
  -- Question 10
  (
    v_question_set_id,
    'Why is crisis management important for CEOs?',
    'multiple_choice',
    '[
      {"text": "It is not important", "is_correct": false},
      {"text": "To protect company reputation and operations", "is_correct": true},
      {"text": "Only for public relations", "is_correct": false},
      {"text": "To avoid doing regular work", "is_correct": false}
    ]'::jsonb,
    20,
    9,
    'hard',
    'process'
  );

  -- Output success message
  RAISE NOTICE 'Successfully created CEO career and 10-question test set!';
  RAISE NOTICE 'Career ID: %', v_career_id;
  RAISE NOTICE 'Question Set ID: %', v_question_set_id;
  RAISE NOTICE 'You can now test with this career in Explore Careers!';
END $$;

-- Verify the data
SELECT
  c.title as career,
  qs.title as question_set,
  COUNT(q.id) as question_count
FROM careers c
LEFT JOIN question_sets qs ON qs.career_id = c.id
LEFT JOIN questions q ON q.question_set_id = qs.id
WHERE c.onet_code = '11-1011.00'
GROUP BY c.title, qs.title;
