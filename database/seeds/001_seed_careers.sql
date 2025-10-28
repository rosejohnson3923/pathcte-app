-- Seed Data: Careers
-- Description: Sample career data for testing the game system

-- Clean existing data (for re-seeding)
DELETE FROM public.careers WHERE onet_code IN (
  '15-1252.00', '29-1141.00', '11-2021.00', '27-3031.00',
  '17-2051.00', '25-2021.00', '19-2012.00', '43-6014.00'
);

-- Insert sample careers
INSERT INTO public.careers (
  id,
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
  growth_rate,
  job_outlook,
  tasks,
  work_environment,
  is_verified,
  content_last_updated
) VALUES
(
  gen_random_uuid(),
  '15-1252.00',
  'Software Developer',
  'Design, develop, and test software applications and systems. Work with various programming languages to create solutions for users.',
  'Technology',
  'Information Technology',
  'Information Technology',
  ARRAY['Bachelor''s Degree', 'Associate''s Degree'],
  ARRAY['AWS Certified Developer', 'Microsoft Certified Professional'],
  '[
    {"name": "Programming", "level": 5},
    {"name": "Problem Solving", "level": 5},
    {"name": "Critical Thinking", "level": 4},
    {"name": "Teamwork", "level": 4}
  ]'::jsonb,
  70000,
  150000,
  110000,
  22.0,
  'Much faster than average',
  ARRAY[
    'Write and test code for new applications',
    'Debug and fix software issues',
    'Collaborate with team members on projects',
    'Document software specifications',
    'Participate in code reviews'
  ],
  'Typically work in offices or remotely. May work long hours when deadlines approach.',
  true,
  CURRENT_DATE
),
(
  gen_random_uuid(),
  '29-1141.00',
  'Registered Nurse',
  'Provide and coordinate patient care, educate patients about health conditions, and provide emotional support to patients and families.',
  'Healthcare',
  'Healthcare',
  'Health Science',
  ARRAY['Bachelor''s Degree', 'Associate''s Degree'],
  ARRAY['RN License', 'BLS Certification', 'ACLS Certification'],
  '[
    {"name": "Patient Care", "level": 5},
    {"name": "Critical Thinking", "level": 5},
    {"name": "Communication", "level": 5},
    {"name": "Empathy", "level": 5}
  ]'::jsonb,
  60000,
  110000,
  77600,
  6.0,
  'Faster than average',
  ARRAY[
    'Assess patient conditions and record symptoms',
    'Administer medications and treatments',
    'Operate medical equipment',
    'Educate patients about health management',
    'Collaborate with doctors and healthcare team'
  ],
  'Work in hospitals, clinics, nursing homes. May work nights, weekends, and holidays. Physically demanding.',
  true,
  CURRENT_DATE
),
(
  gen_random_uuid(),
  '11-2021.00',
  'Marketing Manager',
  'Plan, direct, and coordinate marketing policies and programs to create interest in products or services.',
  'Business',
  'Business & Finance',
  'Marketing',
  ARRAY['Bachelor''s Degree', 'Master''s Degree'],
  ARRAY['Google Analytics Certification', 'HubSpot Certification'],
  '[
    {"name": "Marketing Strategy", "level": 5},
    {"name": "Communication", "level": 5},
    {"name": "Data Analysis", "level": 4},
    {"name": "Leadership", "level": 4}
  ]'::jsonb,
  65000,
  140000,
  95000,
  10.0,
  'Average',
  ARRAY[
    'Develop marketing strategies and campaigns',
    'Analyze market trends and competitor activities',
    'Manage marketing budget and resources',
    'Lead marketing team and coordinate projects',
    'Track campaign performance and ROI'
  ],
  'Work in offices or remotely. May travel to meet clients or attend events.',
  true,
  CURRENT_DATE
),
(
  gen_random_uuid(),
  '27-3031.00',
  'Public Relations Specialist',
  'Create and maintain favorable public image for organization. Write press releases, plan events, and build relationships with media.',
  'Communications',
  'Arts, Communications & Media',
  'Marketing',
  ARRAY['Bachelor''s Degree'],
  ARRAY['APR (Accredited in Public Relations)'],
  '[
    {"name": "Writing", "level": 5},
    {"name": "Communication", "level": 5},
    {"name": "Media Relations", "level": 4},
    {"name": "Crisis Management", "level": 4}
  ]'::jsonb,
  45000,
  95000,
  62810,
  8.0,
  'Average',
  ARRAY[
    'Write press releases and speeches',
    'Plan publicity campaigns and events',
    'Build relationships with media contacts',
    'Monitor media coverage and public opinion',
    'Respond to information requests'
  ],
  'Work in offices, often with tight deadlines. May work evenings and weekends for events.',
  true,
  CURRENT_DATE
),
(
  gen_random_uuid(),
  '17-2051.00',
  'Civil Engineer',
  'Design, build, and maintain infrastructure projects like roads, bridges, buildings, and water supply systems.',
  'Engineering',
  'Engineering & Architecture',
  'Architecture & Construction',
  ARRAY['Bachelor''s Degree', 'Master''s Degree'],
  ARRAY['PE License', 'EIT Certification'],
  '[
    {"name": "Engineering Design", "level": 5},
    {"name": "Problem Solving", "level": 5},
    {"name": "Project Management", "level": 4},
    {"name": "Technical Drawing", "level": 4}
  ]'::jsonb,
  60000,
  130000,
  88000,
  5.0,
  'Average',
  ARRAY[
    'Design infrastructure projects using CAD software',
    'Analyze survey reports and construction materials',
    'Manage project budgets and timelines',
    'Inspect construction sites for compliance',
    'Collaborate with architects and contractors'
  ],
  'Split time between offices and construction sites. May work outdoors in various weather conditions.',
  true,
  CURRENT_DATE
),
(
  gen_random_uuid(),
  '25-2021.00',
  'Elementary School Teacher',
  'Teach academic and social skills to students in elementary grades. Create lesson plans and assess student progress.',
  'Education',
  'Education & Training',
  'Education & Training',
  ARRAY['Bachelor''s Degree', 'Master''s Degree'],
  ARRAY['Teaching License', 'ESL Certification'],
  '[
    {"name": "Teaching", "level": 5},
    {"name": "Patience", "level": 5},
    {"name": "Communication", "level": 5},
    {"name": "Classroom Management", "level": 4}
  ]'::jsonb,
  45000,
  85000,
  61000,
  4.0,
  'Average',
  ARRAY[
    'Plan and deliver engaging lessons',
    'Assess student learning and progress',
    'Manage classroom behavior and environment',
    'Communicate with parents and guardians',
    'Participate in professional development'
  ],
  'Work in schools during academic year. May need to work evenings and weekends for planning and grading.',
  true,
  CURRENT_DATE
),
(
  gen_random_uuid(),
  '19-2012.00',
  'Physicist',
  'Conduct research to understand physical phenomena. Develop theories and use experiments to test them.',
  'Science',
  'Science, Technology & Mathematics',
  'Science, Technology, Engineering & Mathematics',
  ARRAY['Doctoral Degree', 'Master''s Degree'],
  ARRAY['Professional Certifications in Specialization'],
  '[
    {"name": "Research", "level": 5},
    {"name": "Mathematical Analysis", "level": 5},
    {"name": "Critical Thinking", "level": 5},
    {"name": "Data Analysis", "level": 5}
  ]'::jsonb,
  70000,
  170000,
  129000,
  8.0,
  'Average',
  ARRAY[
    'Conduct experiments and analyze results',
    'Develop theories and mathematical models',
    'Write research papers and present findings',
    'Collaborate with other scientists',
    'Apply for research grants'
  ],
  'Work in laboratories, universities, or government agencies. May spend long hours on research.',
  true,
  CURRENT_DATE
),
(
  gen_random_uuid(),
  '43-6014.00',
  'Administrative Assistant',
  'Provide administrative support to executives and teams. Manage schedules, correspondence, and office operations.',
  'Business',
  'Business & Finance',
  'Business Management & Administration',
  ARRAY['High School Diploma', 'Associate''s Degree'],
  ARRAY['Microsoft Office Specialist', 'Certified Administrative Professional'],
  '[
    {"name": "Organization", "level": 5},
    {"name": "Communication", "level": 4},
    {"name": "Time Management", "level": 4},
    {"name": "Computer Skills", "level": 4}
  ]'::jsonb,
  35000,
  60000,
  45000,
  -7.0,
  'Declining',
  ARRAY[
    'Schedule appointments and manage calendars',
    'Organize files and maintain records',
    'Prepare documents and correspondence',
    'Answer phones and greet visitors',
    'Coordinate office operations'
  ],
  'Work in offices with standard business hours. May work overtime during busy periods.',
  true,
  CURRENT_DATE
);

-- Update stats
SELECT COUNT(*) as careers_seeded FROM public.careers WHERE is_verified = true;
