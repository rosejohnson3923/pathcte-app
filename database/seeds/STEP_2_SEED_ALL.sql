-- ============================================
-- STEP 2: SEED ALL TEST DATA
-- ============================================
-- Run STEP_1_CREATE_TEACHER.sql FIRST!
-- This populates: 8 careers, 16 pathkeys, 3 question sets, 25 questions
-- ============================================

-- Verify teacher exists
DO $$
DECLARE
  teacher_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO teacher_count FROM public.profiles WHERE user_type = 'teacher';

  IF teacher_count = 0 THEN
    RAISE EXCEPTION '❌ No teacher found! Run STEP_1_CREATE_TEACHER.sql first!';
  END IF;

  RAISE NOTICE '✅ Teacher found. Starting seed process...';
END $$;

-- ============================================
-- PART 1: CAREERS (8 careers)
-- ============================================

DELETE FROM public.careers WHERE onet_code IN (
  '15-1252.00', '29-1141.00', '11-2021.00', '27-3031.00',
  '17-2051.00', '25-2021.00', '19-2012.00', '43-6014.00'
);

INSERT INTO public.careers (
  id, onet_code, title, description, industry, sector, career_cluster,
  education_level, certifications, skills, salary_min, salary_max, salary_median,
  growth_rate, job_outlook, tasks, work_environment, is_verified, content_last_updated
) VALUES
(gen_random_uuid(), '15-1252.00', 'Software Developer',
  'Design, develop, and test software applications and systems. Work with various programming languages to create solutions for users.',
  'Technology', 'Information Technology', 'Information Technology',
  ARRAY['Bachelor''s Degree', 'Associate''s Degree'],
  ARRAY['AWS Certified Developer', 'Microsoft Certified Professional'],
  '[{"name": "Programming", "level": 5}, {"name": "Problem Solving", "level": 5}, {"name": "Critical Thinking", "level": 4}, {"name": "Teamwork", "level": 4}]'::jsonb,
  70000, 150000, 110000, 22.0, 'Much faster than average',
  ARRAY['Write and test code for new applications', 'Debug and fix software issues', 'Collaborate with team members on projects', 'Document software specifications', 'Participate in code reviews'],
  'Typically work in offices or remotely. May work long hours when deadlines approach.', true, CURRENT_DATE),

(gen_random_uuid(), '29-1141.00', 'Registered Nurse',
  'Provide and coordinate patient care, educate patients about health conditions, and provide emotional support to patients and families.',
  'Healthcare', 'Healthcare', 'Health Science',
  ARRAY['Bachelor''s Degree', 'Associate''s Degree'],
  ARRAY['RN License', 'BLS Certification', 'ACLS Certification'],
  '[{"name": "Patient Care", "level": 5}, {"name": "Critical Thinking", "level": 5}, {"name": "Communication", "level": 5}, {"name": "Empathy", "level": 5}]'::jsonb,
  60000, 110000, 77600, 6.0, 'Faster than average',
  ARRAY['Assess patient conditions and record symptoms', 'Administer medications and treatments', 'Operate medical equipment', 'Educate patients about health management', 'Collaborate with doctors and healthcare team'],
  'Work in hospitals, clinics, nursing homes. May work nights, weekends, and holidays. Physically demanding.', true, CURRENT_DATE),

(gen_random_uuid(), '11-2021.00', 'Marketing Manager',
  'Plan, direct, and coordinate marketing policies and programs to create interest in products or services.',
  'Business', 'Business & Finance', 'Marketing',
  ARRAY['Bachelor''s Degree', 'Master''s Degree'],
  ARRAY['Google Analytics Certification', 'HubSpot Certification'],
  '[{"name": "Marketing Strategy", "level": 5}, {"name": "Communication", "level": 5}, {"name": "Data Analysis", "level": 4}, {"name": "Leadership", "level": 4}]'::jsonb,
  65000, 140000, 95000, 10.0, 'Average',
  ARRAY['Develop marketing strategies and campaigns', 'Analyze market trends and competitor activities', 'Manage marketing budget and resources', 'Lead marketing team and coordinate projects', 'Track campaign performance and ROI'],
  'Work in offices or remotely. May travel to meet clients or attend events.', true, CURRENT_DATE),

(gen_random_uuid(), '27-3031.00', 'Public Relations Specialist',
  'Create and maintain favorable public image for organization. Write press releases, plan events, and build relationships with media.',
  'Communications', 'Arts, Communications & Media', 'Marketing',
  ARRAY['Bachelor''s Degree'],
  ARRAY['APR (Accredited in Public Relations)'],
  '[{"name": "Writing", "level": 5}, {"name": "Communication", "level": 5}, {"name": "Media Relations", "level": 4}, {"name": "Crisis Management", "level": 4}]'::jsonb,
  45000, 95000, 62810, 8.0, 'Average',
  ARRAY['Write press releases and speeches', 'Plan publicity campaigns and events', 'Build relationships with media contacts', 'Monitor media coverage and public opinion', 'Respond to information requests'],
  'Work in offices, often with tight deadlines. May work evenings and weekends for events.', true, CURRENT_DATE),

(gen_random_uuid(), '17-2051.00', 'Civil Engineer',
  'Design, build, and maintain infrastructure projects like roads, bridges, buildings, and water supply systems.',
  'Engineering', 'Engineering & Architecture', 'Architecture & Construction',
  ARRAY['Bachelor''s Degree', 'Master''s Degree'],
  ARRAY['PE License', 'EIT Certification'],
  '[{"name": "Engineering Design", "level": 5}, {"name": "Problem Solving", "level": 5}, {"name": "Project Management", "level": 4}, {"name": "Technical Drawing", "level": 4}]'::jsonb,
  60000, 130000, 88000, 5.0, 'Average',
  ARRAY['Design infrastructure projects using CAD software', 'Analyze survey reports and construction materials', 'Manage project budgets and timelines', 'Inspect construction sites for compliance', 'Collaborate with architects and contractors'],
  'Split time between offices and construction sites. May work outdoors in various weather conditions.', true, CURRENT_DATE),

(gen_random_uuid(), '25-2021.00', 'Elementary School Teacher',
  'Teach academic and social skills to students in elementary grades. Create lesson plans and assess student progress.',
  'Education', 'Education & Training', 'Education & Training',
  ARRAY['Bachelor''s Degree', 'Master''s Degree'],
  ARRAY['Teaching License', 'ESL Certification'],
  '[{"name": "Teaching", "level": 5}, {"name": "Patience", "level": 5}, {"name": "Communication", "level": 5}, {"name": "Classroom Management", "level": 4}]'::jsonb,
  45000, 85000, 61000, 4.0, 'Average',
  ARRAY['Plan and deliver engaging lessons', 'Assess student learning and progress', 'Manage classroom behavior and environment', 'Communicate with parents and guardians', 'Participate in professional development'],
  'Work in schools during academic year. May need to work evenings and weekends for planning and grading.', true, CURRENT_DATE),

(gen_random_uuid(), '19-2012.00', 'Physicist',
  'Conduct research to understand physical phenomena. Develop theories and use experiments to test them.',
  'Science', 'Science, Technology & Mathematics', 'Science, Technology, Engineering & Mathematics',
  ARRAY['Doctoral Degree', 'Master''s Degree'],
  ARRAY['Professional Certifications in Specialization'],
  '[{"name": "Research", "level": 5}, {"name": "Mathematical Analysis", "level": 5}, {"name": "Critical Thinking", "level": 5}, {"name": "Data Analysis", "level": 5}]'::jsonb,
  70000, 170000, 129000, 8.0, 'Average',
  ARRAY['Conduct experiments and analyze results', 'Develop theories and mathematical models', 'Write research papers and present findings', 'Collaborate with other scientists', 'Apply for research grants'],
  'Work in laboratories, universities, or government agencies. May spend long hours on research.', true, CURRENT_DATE),

(gen_random_uuid(), '43-6014.00', 'Administrative Assistant',
  'Provide administrative support to executives and teams. Manage schedules, correspondence, and office operations.',
  'Business', 'Business & Finance', 'Business Management & Administration',
  ARRAY['High School Diploma', 'Associate''s Degree'],
  ARRAY['Microsoft Office Specialist', 'Certified Administrative Professional'],
  '[{"name": "Organization", "level": 5}, {"name": "Communication", "level": 4}, {"name": "Time Management", "level": 4}, {"name": "Computer Skills", "level": 4}]'::jsonb,
  35000, 60000, 45000, -7.0, 'Declining',
  ARRAY['Schedule appointments and manage calendars', 'Organize files and maintain records', 'Prepare documents and correspondence', 'Answer phones and greet visitors', 'Coordinate office operations'],
  'Work in offices with standard business hours. May work overtime during busy periods.', true, CURRENT_DATE);

SELECT '✅ Inserted ' || COUNT(*) || ' careers' as status FROM public.careers WHERE is_verified = true;

-- ============================================
-- PART 2: PATHKEYS (16 pathkeys)
-- ============================================

DO $$
DECLARE
  dev_id UUID; nurse_id UUID; market_id UUID; pr_id UUID;
  civil_id UUID; teach_id UUID; phys_id UUID; admin_id UUID;
BEGIN
  DELETE FROM public.pathkeys WHERE key_code ~ '^(DEV|NURSE|MARKET|PR|CIVIL|TEACH|PHYS|ADMIN|SKILL|IND|MILE)-';

  SELECT id INTO dev_id FROM public.careers WHERE onet_code = '15-1252.00';
  SELECT id INTO nurse_id FROM public.careers WHERE onet_code = '29-1141.00';
  SELECT id INTO market_id FROM public.careers WHERE onet_code = '11-2021.00';
  SELECT id INTO pr_id FROM public.careers WHERE onet_code = '27-3031.00';
  SELECT id INTO civil_id FROM public.careers WHERE onet_code = '17-2051.00';
  SELECT id INTO teach_id FROM public.careers WHERE onet_code = '25-2021.00';
  SELECT id INTO phys_id FROM public.careers WHERE onet_code = '19-2012.00';
  SELECT id INTO admin_id FROM public.careers WHERE onet_code = '43-6014.00';

  INSERT INTO public.pathkeys (key_code, name, description, rarity, key_type, career_id, image_url, color_primary, color_secondary, is_active, release_date, metadata) VALUES
  ('DEV-001', 'Code Master', 'Unlocked by mastering software development fundamentals', 'epic', 'career', dev_id, 'https://placehold.co/400x400/6366f1/ffffff?text=💻', '#6366f1', '#818cf8', true, CURRENT_DATE, '{"flavor_text": "The first step into the world of programming"}'::jsonb),
  ('NURSE-001', 'Caring Heart', 'Awarded to those who show dedication to healthcare', 'rare', 'career', nurse_id, 'https://placehold.co/400x400/ef4444/ffffff?text=❤️', '#ef4444', '#f87171', true, CURRENT_DATE, '{"flavor_text": "Compassion meets expertise"}'::jsonb),
  ('MARKET-001', 'Brand Builder', 'For strategic minds in marketing', 'uncommon', 'career', market_id, 'https://placehold.co/400x400/f59e0b/ffffff?text=📊', '#f59e0b', '#fbbf24', true, CURRENT_DATE, '{"flavor_text": "Create campaigns that resonate"}'::jsonb),
  ('PR-001', 'Voice of Change', 'Master of public perception', 'uncommon', 'career', pr_id, 'https://placehold.co/400x400/8b5cf6/ffffff?text=📢', '#8b5cf6', '#a78bfa', true, CURRENT_DATE, '{"flavor_text": "Shape the narrative"}'::jsonb),
  ('CIVIL-001', 'Foundation Layer', 'Build the infrastructure of tomorrow', 'rare', 'career', civil_id, 'https://placehold.co/400x400/06b6d4/ffffff?text=🏗️', '#06b6d4', '#22d3ee', true, CURRENT_DATE, '{"flavor_text": "Engineer the future"}'::jsonb),
  ('TEACH-001', 'Knowledge Keeper', 'Inspire the next generation', 'uncommon', 'career', teach_id, 'https://placehold.co/400x400/10b981/ffffff?text=📚', '#10b981', '#34d399', true, CURRENT_DATE, '{"flavor_text": "Every student is a new adventure"}'::jsonb),
  ('PHYS-001', 'Reality Bender', 'Unlock the secrets of the universe', 'legendary', 'career', phys_id, 'https://placehold.co/400x400/ec4899/ffffff?text=⚛️', '#ec4899', '#f472b6', true, CURRENT_DATE, '{"flavor_text": "Where science meets wonder"}'::jsonb),
  ('ADMIN-001', 'Office Ace', 'Keep everything running smoothly', 'common', 'career', admin_id, 'https://placehold.co/400x400/64748b/ffffff?text=📋', '#64748b', '#94a3b8', true, CURRENT_DATE, '{"flavor_text": "The backbone of every organization"}'::jsonb),

  ('SKILL-CODE', 'First Lines', 'Wrote your first lines of code', 'common', 'skill', NULL, 'https://placehold.co/400x400/3b82f6/ffffff?text=</>', '#3b82f6', '#60a5fa', true, CURRENT_DATE, '{"skill_category": "Programming"}'::jsonb),
  ('SKILL-PROB', 'Problem Solver', 'Master at finding creative solutions', 'uncommon', 'skill', NULL, 'https://placehold.co/400x400/14b8a6/ffffff?text=🧩', '#14b8a6', '#2dd4bf', true, CURRENT_DATE, '{"skill_category": "Critical Thinking"}'::jsonb),
  ('SKILL-COMM', 'Great Communicator', 'Express ideas clearly and effectively', 'uncommon', 'skill', NULL, 'https://placehold.co/400x400/f97316/ffffff?text=💬', '#f97316', '#fb923c', true, CURRENT_DATE, '{"skill_category": "Communication"}'::jsonb),
  ('SKILL-LEAD', 'Team Leader', 'Guide teams to success', 'rare', 'skill', NULL, 'https://placehold.co/400x400/84cc16/ffffff?text=👥', '#84cc16', '#a3e635', true, CURRENT_DATE, '{"skill_category": "Leadership"}'::jsonb),

  ('IND-TECH', 'Tech Pioneer', 'Exploring the technology industry', 'uncommon', 'industry', NULL, 'https://placehold.co/400x400/6366f1/ffffff?text=🚀', '#6366f1', '#818cf8', true, CURRENT_DATE, '{"industry": "Technology"}'::jsonb),
  ('IND-HEALTH', 'Healthcare Hero', 'Dedicated to helping others heal', 'rare', 'industry', NULL, 'https://placehold.co/400x400/dc2626/ffffff?text=⚕️', '#dc2626', '#ef4444', true, CURRENT_DATE, '{"industry": "Healthcare"}'::jsonb),
  ('IND-BIZ', 'Business Mogul', 'Building empires one deal at a time', 'uncommon', 'industry', NULL, 'https://placehold.co/400x400/0891b2/ffffff?text=💼', '#0891b2', '#06b6d4', true, CURRENT_DATE, '{"industry": "Business"}'::jsonb),

  ('MILE-FIRST', 'First Victory', 'Completed your first game', 'common', 'milestone', NULL, 'https://placehold.co/400x400/fbbf24/ffffff?text=🏆', '#fbbf24', '#fcd34d', true, CURRENT_DATE, '{"milestone_type": "first_game"}'::jsonb);
END $$;

SELECT '✅ Inserted ' || COUNT(*) || ' pathkeys' as status FROM public.pathkeys WHERE is_active = true;

-- ============================================
-- PART 3: QUESTION SETS & QUESTIONS
-- ============================================

DO $$
DECLARE
  teacher_id UUID;
  set1_id UUID; set2_id UUID; set3_id UUID;
BEGIN
  SELECT id INTO teacher_id FROM public.profiles WHERE user_type = 'teacher' LIMIT 1;

  DELETE FROM public.question_sets WHERE title IN ('Career Exploration Basics', 'Healthcare Careers Quiz', 'Technology & Innovation');

  -- Set 1: Career Exploration Basics (10 questions)
  INSERT INTO public.question_sets (id, creator_id, title, description, subject, grade_level, career_sector, tags, is_public, is_verified, total_questions, difficulty_level)
  VALUES (gen_random_uuid(), teacher_id, 'Career Exploration Basics', 'Introduction to various career paths and what they entail. Perfect for students exploring their options!',
  'Career Education', ARRAY[8,9,10,11,12], NULL, ARRAY['careers','exploration','general','beginner'], true, true, 10, 'easy') RETURNING id INTO set1_id;

  INSERT INTO public.questions (question_set_id, question_text, question_type, options, time_limit_seconds, points, order_index, difficulty) VALUES
  (set1_id, 'What does a Software Developer primarily do?', 'multiple_choice', '[{"text": "Design and write computer programs", "is_correct": true}, {"text": "Fix broken computers", "is_correct": false}, {"text": "Sell software products", "is_correct": false}, {"text": "Teach people how to use computers", "is_correct": false}]'::jsonb, 20, 10, 0, 'easy'),
  (set1_id, 'Which of these is a key skill for a Registered Nurse?', 'multiple_choice', '[{"text": "Patience and empathy", "is_correct": true}, {"text": "Advanced mathematics", "is_correct": false}, {"text": "Public speaking", "is_correct": false}, {"text": "Graphic design", "is_correct": false}]'::jsonb, 20, 10, 1, 'easy'),
  (set1_id, 'Marketing Managers typically need which type of degree?', 'multiple_choice', '[{"text": "Bachelor''s degree in Marketing or related field", "is_correct": true}, {"text": "High school diploma only", "is_correct": false}, {"text": "Medical degree", "is_correct": false}, {"text": "No formal education required", "is_correct": false}]'::jsonb, 25, 10, 2, 'easy'),
  (set1_id, 'What is the main responsibility of a Civil Engineer?', 'multiple_choice', '[{"text": "Design and oversee construction of infrastructure", "is_correct": true}, {"text": "Enforce traffic laws", "is_correct": false}, {"text": "Plan city budgets", "is_correct": false}, {"text": "Manage government offices", "is_correct": false}]'::jsonb, 25, 10, 3, 'easy'),
  (set1_id, 'Which career typically requires a teaching license?', 'multiple_choice', '[{"text": "Elementary School Teacher", "is_correct": true}, {"text": "Corporate Trainer", "is_correct": false}, {"text": "YouTube Educator", "is_correct": false}, {"text": "Private Tutor", "is_correct": false}]'::jsonb, 20, 10, 4, 'easy'),
  (set1_id, 'Public Relations Specialists primarily work to:', 'multiple_choice', '[{"text": "Maintain positive public image for organizations", "is_correct": true}, {"text": "Sell products directly to customers", "is_correct": false}, {"text": "Design company websites", "is_correct": false}, {"text": "Manage employee payroll", "is_correct": false}]'::jsonb, 25, 10, 5, 'easy'),
  (set1_id, 'Which industry is growing the fastest according to job outlook?', 'multiple_choice', '[{"text": "Technology/Software Development", "is_correct": true}, {"text": "Administrative Support", "is_correct": false}, {"text": "Manufacturing", "is_correct": false}, {"text": "Print Journalism", "is_correct": false}]'::jsonb, 25, 15, 6, 'medium'),
  (set1_id, 'What type of work environment do most Administrative Assistants work in?', 'multiple_choice', '[{"text": "Office settings with standard business hours", "is_correct": true}, {"text": "Outdoor construction sites", "is_correct": false}, {"text": "Hospital emergency rooms", "is_correct": false}, {"text": "Remote only, no office", "is_correct": false}]'::jsonb, 20, 10, 7, 'easy'),
  (set1_id, 'A career in Healthcare typically requires:', 'multiple_choice', '[{"text": "Strong interpersonal and patient care skills", "is_correct": true}, {"text": "Only technical medical knowledge", "is_correct": false}, {"text": "Business management expertise", "is_correct": false}, {"text": "Artistic ability", "is_correct": false}]'::jsonb, 20, 10, 8, 'easy'),
  (set1_id, 'Which statement about career education is TRUE?', 'multiple_choice', '[{"text": "Most careers require specific education and training", "is_correct": true}, {"text": "You can do any job without preparation", "is_correct": false}, {"text": "Career choices are final and cannot change", "is_correct": false}, {"text": "Salary is the only factor to consider", "is_correct": false}]'::jsonb, 25, 15, 9, 'medium');

  -- Set 2: Healthcare Careers Quiz (8 questions)
  INSERT INTO public.question_sets (id, creator_id, title, description, subject, grade_level, career_sector, tags, is_public, is_verified, total_questions, difficulty_level)
  VALUES (gen_random_uuid(), teacher_id, 'Healthcare Careers Quiz', 'Deep dive into healthcare professions, requirements, and working conditions.',
  'Career Education', ARRAY[9,10,11,12], 'Healthcare', ARRAY['healthcare','medical','nursing','intermediate'], true, true, 8, 'medium') RETURNING id INTO set2_id;

  INSERT INTO public.questions (question_set_id, question_text, question_type, options, time_limit_seconds, points, order_index, difficulty) VALUES
  (set2_id, 'What is the median salary for a Registered Nurse?', 'multiple_choice', '[{"text": "Around $77,600 per year", "is_correct": true}, {"text": "Around $35,000 per year", "is_correct": false}, {"text": "Around $150,000 per year", "is_correct": false}, {"text": "Around $50,000 per year", "is_correct": false}]'::jsonb, 30, 15, 0, 'medium'),
  (set2_id, 'What certification is required for all Registered Nurses?', 'multiple_choice', '[{"text": "RN License", "is_correct": true}, {"text": "CPR Certification only", "is_correct": false}, {"text": "Medical degree", "is_correct": false}, {"text": "No certification needed", "is_correct": false}]'::jsonb, 25, 10, 1, 'easy'),
  (set2_id, 'Nurses may need to work:', 'multiple_choice', '[{"text": "Nights, weekends, and holidays", "is_correct": true}, {"text": "Only Monday through Friday", "is_correct": false}, {"text": "Only during summer months", "is_correct": false}, {"text": "Part-time hours only", "is_correct": false}]'::jsonb, 25, 10, 2, 'easy'),
  (set2_id, 'Which skill is MOST important for healthcare professionals?', 'multiple_choice', '[{"text": "Critical thinking and problem-solving", "is_correct": true}, {"text": "Social media marketing", "is_correct": false}, {"text": "Computer programming", "is_correct": false}, {"text": "Foreign language fluency", "is_correct": false}]'::jsonb, 30, 15, 3, 'medium'),
  (set2_id, 'The job outlook for Registered Nurses is:', 'multiple_choice', '[{"text": "Faster than average (6% growth)", "is_correct": true}, {"text": "Declining rapidly", "is_correct": false}, {"text": "No growth expected", "is_correct": false}, {"text": "Slower than average", "is_correct": false}]'::jsonb, 30, 15, 4, 'medium'),
  (set2_id, 'What type of degree is typically required for RN positions?', 'multiple_choice', '[{"text": "Associate''s or Bachelor''s degree in Nursing", "is_correct": true}, {"text": "High school diploma", "is_correct": false}, {"text": "Doctoral degree", "is_correct": false}, {"text": "Master''s degree required", "is_correct": false}]'::jsonb, 25, 10, 5, 'easy'),
  (set2_id, 'Which is a primary responsibility of a Registered Nurse?', 'multiple_choice', '[{"text": "Assess patient conditions and provide care", "is_correct": true}, {"text": "Perform surgery", "is_correct": false}, {"text": "Prescribe all medications independently", "is_correct": false}, {"text": "Manage hospital finances", "is_correct": false}]'::jsonb, 25, 10, 6, 'easy'),
  (set2_id, 'Healthcare careers are described as:', 'multiple_choice', '[{"text": "Physically and emotionally demanding", "is_correct": true}, {"text": "Low-stress desk jobs", "is_correct": false}, {"text": "Requiring minimal training", "is_correct": false}, {"text": "Always working alone", "is_correct": false}]'::jsonb, 30, 15, 7, 'medium');

  -- Set 3: Technology & Innovation (7 questions)
  INSERT INTO public.question_sets (id, creator_id, title, description, subject, grade_level, career_sector, tags, is_public, is_verified, total_questions, difficulty_level)
  VALUES (gen_random_uuid(), teacher_id, 'Technology & Innovation', 'Explore tech careers including software development, physics, and engineering.',
  'STEM', ARRAY[10,11,12], 'Technology', ARRAY['technology','stem','engineering','advanced'], true, true, 7, 'hard') RETURNING id INTO set3_id;

  INSERT INTO public.questions (question_set_id, question_text, question_type, options, time_limit_seconds, points, order_index, difficulty) VALUES
  (set3_id, 'What is the projected job growth rate for Software Developers?', 'multiple_choice', '[{"text": "22% - Much faster than average", "is_correct": true}, {"text": "2% - Slower than average", "is_correct": false}, {"text": "No growth expected", "is_correct": false}, {"text": "10% - Average growth", "is_correct": false}]'::jsonb, 35, 20, 0, 'hard'),
  (set3_id, 'Which certification is valuable for Software Developers?', 'multiple_choice', '[{"text": "AWS Certified Developer", "is_correct": true}, {"text": "Real Estate License", "is_correct": false}, {"text": "CDL (Commercial Driver License)", "is_correct": false}, {"text": "Teaching Certificate", "is_correct": false}]'::jsonb, 30, 15, 1, 'medium'),
  (set3_id, 'What degree is typically required to become a Physicist?', 'multiple_choice', '[{"text": "Doctoral or Master''s degree", "is_correct": true}, {"text": "High school diploma", "is_correct": false}, {"text": "Associate''s degree", "is_correct": false}, {"text": "Bachelor''s degree is sufficient", "is_correct": false}]'::jsonb, 30, 15, 2, 'medium'),
  (set3_id, 'What is the median salary for a Physicist?', 'multiple_choice', '[{"text": "Around $129,000 per year", "is_correct": true}, {"text": "Around $45,000 per year", "is_correct": false}, {"text": "Around $75,000 per year", "is_correct": false}, {"text": "Around $200,000 per year", "is_correct": false}]'::jsonb, 35, 20, 3, 'hard'),
  (set3_id, 'Civil Engineers primarily use which type of software?', 'multiple_choice', '[{"text": "CAD (Computer-Aided Design)", "is_correct": true}, {"text": "Photo editing software", "is_correct": false}, {"text": "Accounting software", "is_correct": false}, {"text": "Video game engines", "is_correct": false}]'::jsonb, 30, 15, 4, 'medium'),
  (set3_id, 'What is a key responsibility of a Software Developer?', 'multiple_choice', '[{"text": "Write and test code for applications", "is_correct": true}, {"text": "Manage company finances", "is_correct": false}, {"text": "Design building structures", "is_correct": false}, {"text": "Treat patients", "is_correct": false}]'::jsonb, 25, 10, 5, 'easy'),
  (set3_id, 'Which field combines mathematics, science, and experimentation?', 'multiple_choice', '[{"text": "Physics", "is_correct": true}, {"text": "Marketing", "is_correct": false}, {"text": "Public Relations", "is_correct": false}, {"text": "Administrative Support", "is_correct": false}]'::jsonb, 25, 10, 6, 'easy');

  RAISE NOTICE '✅ Created 3 question sets';
  RAISE NOTICE 'Set 1 (ID: %): 10 questions', set1_id;
  RAISE NOTICE 'Set 2 (ID: %): 8 questions', set2_id;
  RAISE NOTICE 'Set 3 (ID: %): 7 questions', set3_id;
END $$;

-- ============================================
-- FINAL VERIFICATION
-- ============================================

SELECT
  'Careers' as item, COUNT(*) as count FROM public.careers WHERE is_verified = true
UNION ALL
SELECT 'Pathkeys', COUNT(*) FROM public.pathkeys WHERE is_active = true
UNION ALL
SELECT 'Question Sets', COUNT(*) FROM public.question_sets WHERE is_public = true
UNION ALL
SELECT 'Questions', COUNT(*) FROM public.questions;

-- ============================================
-- 🎉 SUCCESS!
-- ============================================
-- Expected results:
-- Careers: 8
-- Pathkeys: 16
-- Question Sets: 3
-- Questions: 25
--
-- You can now test the game system!
-- Login with: teacher@test.com / password123
-- ============================================
