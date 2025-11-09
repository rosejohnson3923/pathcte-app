-- Pathcte Question Sets and Questions
-- Generated: 2025-11-06T00:29:16.651Z
-- Replace 07951691-658a-4808-b2f8-c497c067edfa with actual teacher UUID

-- Question Set: Healthcare Careers Fundamentals
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_1
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Healthcare Careers Fundamentals',
  'Essential knowledge about careers in healthcare and medicine',
  'Healthcare',
  'Healthcare',
  ARRAY[],
  'medium',
  ARRAY['healthcare', 'medicine', 'nursing', 'medical'],
  true,
  true,
  18
) RETURNING id INTO set_1;

-- Question 1: What is a critical interpersonal skill for a nurse... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What is a critical interpersonal skill for a nurse to effectively communicate with patients and their families?',
  'multiple_choice',
  '[{"text":"Empathy","is_correct":true},{"text":"Mathematics","is_correct":false},{"text":"Graphic Design","is_correct":false},{"text":"Mechanical Skills","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: Which healthcare professional is most likely to le... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'Which healthcare professional is most likely to lead a team of technicians and assistants in a hospital?',
  'multiple_choice',
  '[{"text":"Physician","is_correct":true},{"text":"Paramedic","is_correct":false},{"text":"Phlebotomist","is_correct":false},{"text":"Medical Coder","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: What role does mentoring play in healthcare career... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What role does mentoring play in healthcare careers?',
  'multiple_choice',
  '[{"text":"It helps develop the next generation of skilled professionals.","is_correct":true},{"text":"It reduces patient wait times.","is_correct":false},{"text":"It eliminates the need for certifications.","is_correct":false},{"text":"It increases hospital funding.","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: What technological tool is commonly used by radiol... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What technological tool is commonly used by radiologists to diagnose patients?',
  'multiple_choice',
  '[{"text":"MRI machine","is_correct":true},{"text":"Stethoscope","is_correct":false},{"text":"Blood pressure monitor","is_correct":false},{"text":"Surgical scalpel","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: Which healthcare career focuses on designing prost... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'Which healthcare career focuses on designing prosthetics to assist people with mobility?',
  'multiple_choice',
  '[{"text":"Prosthetist","is_correct":true},{"text":"Pharmacist","is_correct":false},{"text":"Physical Therapist","is_correct":false},{"text":"Occupational Therapist","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: What innovation is a major focus in biotechnology ... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What innovation is a major focus in biotechnology careers within healthcare?',
  'multiple_choice',
  '[{"text":"Developing new medications","is_correct":true},{"text":"Expanding hospital parking lots","is_correct":false},{"text":"Improving cafeteria food options","is_correct":false},{"text":"Designing hospital uniforms","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: What is an average annual salary for a registered ... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What is an average annual salary for a registered nurse in the United States?',
  'multiple_choice',
  '[{"text":"$75,000","is_correct":true},{"text":"$30,000","is_correct":false},{"text":"$150,000","is_correct":false},{"text":"$25,000","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: Which financial skill is important for a hospital ... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'Which financial skill is important for a hospital administrator''s role?',
  'multiple_choice',
  '[{"text":"Budget Management","is_correct":true},{"text":"Performing Surgeries","is_correct":false},{"text":"Graphic Design","is_correct":false},{"text":"Data Entry","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: Why is cost estimation important in the medical de... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'Why is cost estimation important in the medical device manufacturing process?',
  'multiple_choice',
  '[{"text":"To ensure products are affordable for hospitals and patients.","is_correct":true},{"text":"To reduce the number of patients treated per day.","is_correct":false},{"text":"To eliminate the need for quality inspections.","is_correct":false},{"text":"To improve patient handwriting.","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: What is a key process healthcare workers must foll... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What is a key process healthcare workers must follow to prevent infections?',
  'multiple_choice',
  '[{"text":"Washing hands regularly","is_correct":true},{"text":"Skipping certifications","is_correct":false},{"text":"Avoiding patient charts","is_correct":false},{"text":"Using outdated equipment","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: Before performing surgery, what must a surgeon alw... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'Before performing surgery, what must a surgeon always verify?',
  'multiple_choice',
  '[{"text":"The patient's identity and surgical site","is_correct":true},{"text":"The hospital's parking situation","is_correct":false},{"text":"The weather forecast","is_correct":false},{"text":"The cafeteria menu","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: Which of the following is part of a physical thera... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'Which of the following is part of a physical therapist''s routine workflow?',
  'multiple_choice',
  '[{"text":"Developing personalized exercise plans","is_correct":true},{"text":"Prescribing medication","is_correct":false},{"text":"Performing surgeries","is_correct":false},{"text":"Transcribing medical records","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: Which healthcare job field is expected to grow sig... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'Which healthcare job field is expected to grow significantly due to an aging population?',
  'multiple_choice',
  '[{"text":"Home Health Aide","is_correct":true},{"text":"Astronaut","is_correct":false},{"text":"Graphic Designer","is_correct":false},{"text":"Chef","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: What is the expected job growth rate for nurse pra... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What is the expected job growth rate for nurse practitioners in the next decade?',
  'multiple_choice',
  '[{"text":"45%","is_correct":true},{"text":"10%","is_correct":false},{"text":"5%","is_correct":false},{"text":"2%","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: What makes healthcare a stable career choice?... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What makes healthcare a stable career choice?',
  'multiple_choice',
  '[{"text":"High demand for medical professionals","is_correct":true},{"text":"Short work hours","is_correct":false},{"text":"Lack of training requirements","is_correct":false},{"text":"Decreasing patient needs","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: How can a hospital reduce costs while improving pa... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'How can a hospital reduce costs while improving patient care?',
  'multiple_choice',
  '[{"text":"Investing in efficient medical equipment","is_correct":true},{"text":"Hiring fewer staff","is_correct":false},{"text":"Increasing patient fees unnecessarily","is_correct":false},{"text":"Reducing sanitation efforts","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: What is a cost-effective way for a clinic to manag... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'What is a cost-effective way for a clinic to manage patient records?',
  'multiple_choice',
  '[{"text":"Using electronic health record systems","is_correct":true},{"text":"Relying only on paper files","is_correct":false},{"text":"Discontinuing record-keeping","is_correct":false},{"text":"Outsourcing patient care","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: Nurse practitioners often choose to specialize in ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_1,
  'Nurse practitioners often choose to specialize in high-demand fields like geriatrics. Why might this be a good financial decision?',
  'multiple_choice',
  '[{"text":"It allows them to command higher salaries.","is_correct":true},{"text":"It reduces the need for certifications.","is_correct":false},{"text":"It eliminates patient interaction.","is_correct":false},{"text":"It improves hospital parking access.","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Technology & Engineering Basics
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_2
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Technology & Engineering Basics',
  'Introduction to careers in technology, software, and engineering',
  'Technology',
  'Technology',
  ARRAY[],
  'medium',
  ARRAY['technology', 'engineering', 'software', 'computer_science'],
  true,
  true,
  18
) RETURNING id INTO set_2;

-- Question 1: Which interpersonal skill is most important for so... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'Which interpersonal skill is most important for software engineers working in large teams?',
  'multiple_choice',
  '[{"text":"Effective communication","is_correct":true},{"text":"Individual coding speed","is_correct":false},{"text":"Advanced mathematics ability","is_correct":false},{"text":"Strong negotiation skills","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: How could a tech manager improve collaboration bet... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'How could a tech manager improve collaboration between team members working on a project?',
  'multiple_choice',
  '[{"text":"Organize daily stand-up meetings","is_correct":true},{"text":"Assign all tasks to one person","is_correct":false},{"text":"Focus only on individual contributions","is_correct":false},{"text":"Avoid providing project feedback","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: What is an important trait for mentors in technolo... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is an important trait for mentors in technology careers?',
  'multiple_choice',
  '[{"text":"Ability to share knowledge effectively","is_correct":true},{"text":"Focus on their own career growth","is_correct":false},{"text":"Avoid mentoring junior employees","is_correct":false},{"text":"Ignore teamwork and collaboration","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: What is one key responsibility of a product manage... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is one key responsibility of a product manager in the technology sector?',
  'multiple_choice',
  '[{"text":"Defining the features of the product","is_correct":true},{"text":"Writing code for the application","is_correct":false},{"text":"Handling the company's finances","is_correct":false},{"text":"Managing payroll for the team","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: Which programming language is commonly used to dev... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'Which programming language is commonly used to develop web applications?',
  'multiple_choice',
  '[{"text":"JavaScript","is_correct":true},{"text":"C++","is_correct":false},{"text":"Python","is_correct":false},{"text":"Assembly Language","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: What does testing and debugging ensure about a sof... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What does testing and debugging ensure about a software product?',
  'multiple_choice',
  '[{"text":"The product runs without errors","is_correct":true},{"text":"The product looks visually appealing","is_correct":false},{"text":"The product is priced lower than competitors","is_correct":false},{"text":"The product is marketed successfully","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: Which of the following factors can influence the s... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'Which of the following factors can influence the salary of a cybersecurity analyst?',
  'multiple_choice',
  '[{"text":"Experience and certifications","is_correct":true},{"text":"The color of their office space","is_correct":false},{"text":"Their ability to write novels","is_correct":false},{"text":"The type of keyboard they use","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: What is important to consider when preparing a bud... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is important to consider when preparing a budget for a software development project?',
  'multiple_choice',
  '[{"text":"The cost of labor and tools","is_correct":true},{"text":"The number of office plants","is_correct":false},{"text":"The availability of social media accounts","is_correct":false},{"text":"The cost of gym memberships for employees","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: What is a common pricing strategy for technology p... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is a common pricing strategy for technology products?',
  'multiple_choice',
  '[{"text":"Freemium model","is_correct":true},{"text":"Guessing the price","is_correct":false},{"text":"Flat rate for all products and services","is_correct":false},{"text":"Ignoring competitors’ prices","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: Which of the following is a best practice in softw... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'Which of the following is a best practice in software development processes?',
  'multiple_choice',
  '[{"text":"Using version control systems","is_correct":true},{"text":"Writing code without documentation","is_correct":false},{"text":"Avoiding team collaboration","is_correct":false},{"text":"Skipping software testing","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: What is the purpose of Agile methodology in techno... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is the purpose of Agile methodology in technology careers?',
  'multiple_choice',
  '[{"text":"To promote flexibility and efficiency in workflows","is_correct":true},{"text":"To avoid team communication","is_correct":false},{"text":"To ignore customer feedback","is_correct":false},{"text":"To increase the length of projects","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: Why is compliance with cybersecurity protocols ess... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'Why is compliance with cybersecurity protocols essential in technology jobs?',
  'multiple_choice',
  '[{"text":"To protect sensitive data and systems","is_correct":true},{"text":"To increase product prices","is_correct":false},{"text":"To avoid teamwork","is_correct":false},{"text":"To decrease revenue","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: What is a growing revenue source in the technology... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is a growing revenue source in the technology industry?',
  'multiple_choice',
  '[{"text":"Cloud computing services","is_correct":true},{"text":"Outdated software sales","is_correct":false},{"text":"Paper-based filing systems","is_correct":false},{"text":"Manual data entry services","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: Which career in technology has the highest project... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'Which career in technology has the highest projected job growth over the next 10 years?',
  'multiple_choice',
  '[{"text":"Software developer","is_correct":true},{"text":"Fax machine technician","is_correct":false},{"text":"DVD player repair specialist","is_correct":false},{"text":"Pager system engineer","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: What is an important factor for career advancement... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is an important factor for career advancement in the technology industry?',
  'multiple_choice',
  '[{"text":"Continuous learning of new skills","is_correct":true},{"text":"Avoiding certifications or training opportunities","is_correct":false},{"text":"Reducing communication with colleagues","is_correct":false},{"text":"Focusing only on hardware repairs","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: What is one strategy for improving the ROI of a te... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is one strategy for improving the ROI of a technology project?',
  'multiple_choice',
  '[{"text":"Optimizing resource allocation","is_correct":true},{"text":"Increasing unnecessary expenses","is_correct":false},{"text":"Ignoring project deadlines","is_correct":false},{"text":"Avoiding client feedback","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: How can technology professionals create financial ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'How can technology professionals create financial value in their jobs?',
  'multiple_choice',
  '[{"text":"By developing innovative and efficient solutions","is_correct":true},{"text":"By ignoring customer needs","is_correct":false},{"text":"By delaying project deliveries","is_correct":false},{"text":"By increasing waste production","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: What is a common way to reduce waste in technology... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_2,
  'What is a common way to reduce waste in technology projects?',
  'multiple_choice',
  '[{"text":"Implementing lean development practices","is_correct":true},{"text":"Avoiding documentation","is_correct":false},{"text":"Using outdated equipment","is_correct":false},{"text":"Hiring unqualified employees","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Business & Finance Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_3
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Business & Finance Careers',
  'Explore careers in business, finance, and entrepreneurship',
  'Business',
  'Business',
  ARRAY[],
  'medium',
  ARRAY['business', 'finance', 'accounting', 'management'],
  true,
  true,
  18
) RETURNING id INTO set_3;

-- Question 1: What is a key responsibility of a human resources ... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What is a key responsibility of a human resources (HR) manager in a business organization?',
  'multiple_choice',
  '[{"text":"Developing advertising campaigns","is_correct":false},{"text":"Managing employee relations and recruitment","is_correct":true},{"text":"Analyzing financial statements","is_correct":false},{"text":"Designing new product prototypes","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: What skill is most important for a team leader in ... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What skill is most important for a team leader in a business environment?',
  'multiple_choice',
  '[{"text":"Effective communication and collaboration","is_correct":true},{"text":"Advanced coding knowledge","is_correct":false},{"text":"Graphic design expertise","is_correct":false},{"text":"Physical stamina and endurance","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: Which career involves mentoring employees and ensu... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'Which career involves mentoring employees and ensuring they achieve professional growth?',
  'multiple_choice',
  '[{"text":"Marketing Specialist","is_correct":false},{"text":"Operations Manager","is_correct":false},{"text":"Leadership Coach","is_correct":true},{"text":"Data Analyst","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: Which professional is responsible for overseeing t... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'Which professional is responsible for overseeing the development of new products in a business?',
  'multiple_choice',
  '[{"text":"Financial Advisor","is_correct":false},{"text":"Product Manager","is_correct":true},{"text":"Sales Representative","is_correct":false},{"text":"Customer Support Specialist","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: Which skill is critical for a business professiona... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'Which skill is critical for a business professional working on product design?',
  'multiple_choice',
  '[{"text":"Creativity and attention to detail","is_correct":true},{"text":"Public speaking skills","is_correct":false},{"text":"Networking and relationship building","is_correct":false},{"text":"Physical strength","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: What is the primary focus of a quality assurance s... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What is the primary focus of a quality assurance specialist in a business?',
  'multiple_choice',
  '[{"text":"Ensuring customer satisfaction","is_correct":false},{"text":"Monitoring product quality and standards","is_correct":true},{"text":"Managing a sales team","is_correct":false},{"text":"Negotiating contracts","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: What is the goal of pricing strategies in a busine... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What is the goal of pricing strategies in a business career like a pricing analyst?',
  'multiple_choice',
  '[{"text":"Maximizing revenue and competitiveness","is_correct":true},{"text":"Developing new products","is_correct":false},{"text":"Creating marketing campaigns","is_correct":false},{"text":"Improving employee satisfaction","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: What does a business budget typically include?... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What does a business budget typically include?',
  'multiple_choice',
  '[{"text":"Estimated expenses and income projections","is_correct":true},{"text":"Employee training schedules","is_correct":false},{"text":"Marketing slogans","is_correct":false},{"text":"Office layouts","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: Which business career involves analyzing salary tr... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'Which business career involves analyzing salary trends to recommend competitive pay scales?',
  'multiple_choice',
  '[{"text":"HR Compensation Analyst","is_correct":true},{"text":"Marketing Coordinator","is_correct":false},{"text":"Financial Planner","is_correct":false},{"text":"Customer Service Representative","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: What is a core responsibility of an operations man... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What is a core responsibility of an operations manager in a business?',
  'multiple_choice',
  '[{"text":"Ensuring workflows and procedures run smoothly","is_correct":true},{"text":"Recruiting and hiring employees","is_correct":false},{"text":"Creating advertising strategies","is_correct":false},{"text":"Designing new products","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: What does efficiency in business processes help ac... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What does efficiency in business processes help achieve?',
  'multiple_choice',
  '[{"text":"Higher productivity and reduced costs","is_correct":true},{"text":"Enhanced product design","is_correct":false},{"text":"Improved employee uniforms","is_correct":false},{"text":"Better branding slogans","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: Which business task involves ensuring safety proto... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'Which business task involves ensuring safety protocols are followed in every step of production?',
  'multiple_choice',
  '[{"text":"Safety Compliance Officer","is_correct":true},{"text":"Marketing Specialist","is_correct":false},{"text":"HR Assistant","is_correct":false},{"text":"Sales Representative","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: Which business career focuses on generating revenu... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'Which business career focuses on generating revenue through sales or partnerships?',
  'multiple_choice',
  '[{"text":"Sales Executive","is_correct":true},{"text":"Graphic Designer","is_correct":false},{"text":"Human Resources Manager","is_correct":false},{"text":"Product Tester","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: What is a primary factor to consider when choosing... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What is a primary factor to consider when choosing a career with high employment growth potential?',
  'multiple_choice',
  '[{"text":"Market demand for the profession","is_correct":true},{"text":"Office location","is_correct":false},{"text":"Personal interest in the company name","is_correct":false},{"text":"Uniform requirements","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: What type of career advancement options are common... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What type of career advancement options are common in business careers?',
  'multiple_choice',
  '[{"text":"Promotions to higher roles like manager or director","is_correct":true},{"text":"Switching to unrelated industries","is_correct":false},{"text":"Learning how to cook professionally","is_correct":false},{"text":"Traveling overseas","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: Which business role focuses on increasing profits ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'Which business role focuses on increasing profits by reducing waste and optimizing resources?',
  'multiple_choice',
  '[{"text":"Operations Analyst","is_correct":true},{"text":"Social Media Manager","is_correct":false},{"text":"Customer Service Agent","is_correct":false},{"text":"Event Coordinator","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: What is the key to measuring return on investment ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'What is the key to measuring return on investment (ROI) in business careers?',
  'multiple_choice',
  '[{"text":"Analyzing the financial benefits versus costs","is_correct":true},{"text":"Counting the number of employees hired","is_correct":false},{"text":"Setting up office decor","is_correct":false},{"text":"Designing logos","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: Which strategic career decision can lead to greate... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_3,
  'Which strategic career decision can lead to greater financial success in business?',
  'multiple_choice',
  '[{"text":"Pursuing advanced degrees or certifications","is_correct":true},{"text":"Choosing jobs based on uniform color","is_correct":false},{"text":"Avoiding teamwork opportunities","is_correct":false},{"text":"Ignoring professional development","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Arts & Entertainment Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_4
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Arts & Entertainment Careers',
  'Careers in art, design, media, and creative industries',
  'Arts & Entertainment',
  'Arts & Entertainment',
  ARRAY[],
  'medium',
  ARRAY['art', 'design', 'creative', 'media', 'entertainment'],
  true,
  true,
  18
) RETURNING id INTO set_4;

-- Question 1: In collaborative projects, such as film or theater... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'In collaborative projects, such as film or theater, which role is typically responsible for managing and coordinating all team members to ensure the project stays on schedule?',
  'multiple_choice',
  '[{"text":"Director","is_correct":true},{"text":"Actor","is_correct":false},{"text":"Set Designer","is_correct":false},{"text":"Composer","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: Which skill is most important when working with a ... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'Which skill is most important when working with a team on a live performance, such as a concert or stage play?',
  'multiple_choice',
  '[{"text":"Communication","is_correct":true},{"text":"Mathematical ability","is_correct":false},{"text":"Technical drawing","is_correct":false},{"text":"Data analysis","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: A costume designer must collaborate closely with w... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'A costume designer must collaborate closely with which team members to ensure their designs align with the production''s vision?',
  'multiple_choice',
  '[{"text":"Directors and actors","is_correct":true},{"text":"Sound engineers","is_correct":false},{"text":"Stunt coordinators","is_correct":false},{"text":"Camerapersons","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: Which tool is most commonly used by graphic design... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'Which tool is most commonly used by graphic designers to create digital art for entertainment projects?',
  'multiple_choice',
  '[{"text":"Adobe Photoshop","is_correct":true},{"text":"Microsoft Word","is_correct":false},{"text":"AutoCAD","is_correct":false},{"text":"GarageBand","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: In the field of video game design, what does the t... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'In the field of video game design, what does the term ''game mechanics'' refer to?',
  'multiple_choice',
  '[{"text":"Rules and systems of gameplay","is_correct":true},{"text":"Soundtrack composition","is_correct":false},{"text":"Character voice acting","is_correct":false},{"text":"Marketing campaigns","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: What is the primary deliverable of a scriptwriter ... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'What is the primary deliverable of a scriptwriter working in the film industry?',
  'multiple_choice',
  '[{"text":"A screenplay","is_correct":true},{"text":"A storyboard","is_correct":false},{"text":"A stage cue sheet","is_correct":false},{"text":"A lighting plan","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: What is an important factor in determining an arti... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'What is an important factor in determining an artist''s pricing for commissioned work?',
  'multiple_choice',
  '[{"text":"The time and materials required to complete the piece","is_correct":true},{"text":"The artist's favorite color","is_correct":false},{"text":"The location of the client","is_correct":false},{"text":"The time of year","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: What is a common way for freelance photographers t... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'What is a common way for freelance photographers to determine their pricing structure?',
  'multiple_choice',
  '[{"text":"Charging per hour or per project","is_correct":true},{"text":"Allowing clients to decide the price","is_correct":false},{"text":"Pricing all projects equally","is_correct":false},{"text":"Basing the price on the competition's fees","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: What is a key budgeting consideration for producin... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'What is a key budgeting consideration for producing an independent film?',
  'multiple_choice',
  '[{"text":"The cost of hiring cast and crew","is_correct":true},{"text":"The number of awards the film might win","is_correct":false},{"text":"The popularity of the lead actor","is_correct":false},{"text":"The film's runtime in minutes","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: What is the first step in the book publishing proc... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'What is the first step in the book publishing process for a writer?',
  'multiple_choice',
  '[{"text":"Submitting a manuscript to a publisher","is_correct":true},{"text":"Hiring a publicist","is_correct":false},{"text":"Designing a book cover","is_correct":false},{"text":"Filming a promotional video","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: Which of the following describes a key step in the... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'Which of the following describes a key step in the video editing process?',
  'multiple_choice',
  '[{"text":"Cutting and rearranging video clips","is_correct":true},{"text":"Writing dialogue for characters","is_correct":false},{"text":"Recording background music","is_correct":false},{"text":"Painting set backdrops","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: What is a storyboard used for in the filmmaking pr... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'What is a storyboard used for in the filmmaking process?',
  'multiple_choice',
  '[{"text":"Planning camera shots and sequences","is_correct":true},{"text":"Writing detailed dialogue","is_correct":false},{"text":"Building set pieces","is_correct":false},{"text":"Promoting the film","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: Which Arts & Entertainment career is projected to ... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'Which Arts & Entertainment career is projected to grow significantly due to the demand for digital media content?',
  'multiple_choice',
  '[{"text":"Multimedia artist","is_correct":true},{"text":"Traditional painter","is_correct":false},{"text":"Art curator","is_correct":false},{"text":"Orchestra conductor","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: Which factor is most likely to influence the job o... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'Which factor is most likely to influence the job outlook for animators in the entertainment industry?',
  'multiple_choice',
  '[{"text":"Increased demand for 3D and CGI content","is_correct":true},{"text":"Availability of oil paints","is_correct":false},{"text":"Popularity of live theater","is_correct":false},{"text":"Decrease in video game production","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: What is a common income source for performing arti... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'What is a common income source for performing artists besides ticket sales?',
  'multiple_choice',
  '[{"text":"Merchandise sales","is_correct":true},{"text":"Investing in real estate","is_correct":false},{"text":"Teaching science courses","is_correct":false},{"text":"Running a restaurant","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: How can a filmmaker reduce production costs while ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'How can a filmmaker reduce production costs while maintaining quality?',
  'multiple_choice',
  '[{"text":"Using local resources and locations","is_correct":true},{"text":"Hiring the most expensive actors","is_correct":false},{"text":"Extending the filming schedule","is_correct":false},{"text":"Filming in another country without research","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: What is one way a musician can maximize financial ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'What is one way a musician can maximize financial returns from their work?',
  'multiple_choice',
  '[{"text":"Releasing their music on multiple streaming platforms","is_correct":true},{"text":"Limiting their music to one country","is_correct":false},{"text":"Avoiding live performances","is_correct":false},{"text":"Only recording in analog formats","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: Which strategic decision could help a visual artis... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_4,
  'Which strategic decision could help a visual artist increase profits from their work?',
  'multiple_choice',
  '[{"text":"Selling limited-edition prints of their artwork","is_correct":true},{"text":"Giving away all their work for free","is_correct":false},{"text":"Only exhibiting their art privately","is_correct":false},{"text":"Stopping commissions entirely","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Science & Research Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_5
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Science & Research Careers',
  'Careers in scientific research, laboratory work, and discovery',
  'Science',
  'Science',
  ARRAY[],
  'medium',
  ARRAY['science', 'research', 'laboratory', 'biology', 'chemistry'],
  true,
  true,
  18
) RETURNING id INTO set_5;

-- Question 1: Which skill is most important for a scientist work... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Which skill is most important for a scientist working in a research team?',
  'multiple_choice',
  '[{"text":"Collaboration and communication","is_correct":true},{"text":"Independent decision-making","is_correct":false},{"text":"Physical stamina","is_correct":false},{"text":"Artistic creativity","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: Which of the following is an example of effective ... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Which of the following is an example of effective communication for a healthcare scientist working with patients?',
  'multiple_choice',
  '[{"text":"Explaining complex terms clearly in simple language","is_correct":true},{"text":"Sharing research results without interpretation","is_correct":false},{"text":"Avoiding patient questions to save time","is_correct":false},{"text":"Using technical jargon to appear more knowledgeable","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: Why is mentoring important for junior scientists i... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Why is mentoring important for junior scientists in a laboratory setting?',
  'multiple_choice',
  '[{"text":"It helps them learn best practices and develop their skills.","is_correct":true},{"text":"It reduces the workload for senior scientists.","is_correct":false},{"text":"It eliminates the need for formal training programs.","is_correct":false},{"text":"Mentors can complete junior scientists' tasks for them.","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: What is a primary responsibility of a product deve... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'What is a primary responsibility of a product development scientist?',
  'multiple_choice',
  '[{"text":"Designing and creating new products based on customer needs","is_correct":true},{"text":"Managing the company’s financial accounts","is_correct":false},{"text":"Performing administrative duties","is_correct":false},{"text":"Organizing team-building exercises","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: Which tool is commonly used by forensic scientists... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Which tool is commonly used by forensic scientists to analyze DNA evidence?',
  'multiple_choice',
  '[{"text":"PCR machine (Polymerase Chain Reaction)","is_correct":true},{"text":"Electron microscope","is_correct":false},{"text":"Spectrophotometer","is_correct":false},{"text":"Telescope","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: What does innovation in pharmaceutical research of... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'What does innovation in pharmaceutical research often focus on?',
  'multiple_choice',
  '[{"text":"Developing new drugs to treat diseases","is_correct":true},{"text":"Creating new marketing strategies","is_correct":false},{"text":"Improving employee satisfaction","is_correct":false},{"text":"Enhancing manufacturing automation software","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: Why is budgeting important for science projects?... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Why is budgeting important for science projects?',
  'multiple_choice',
  '[{"text":"To ensure resources are allocated effectively","is_correct":true},{"text":"To increase the number of team members","is_correct":false},{"text":"To avoid purchasing unnecessary equipment","is_correct":false},{"text":"To improve communication within the team","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: Which of the following is a typical salary range f... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Which of the following is a typical salary range for an entry-level environmental scientist in the United States?',
  'multiple_choice',
  '[{"text":"$45,000 - $65,000 per year","is_correct":true},{"text":"$20,000 - $30,000 per year","is_correct":false},{"text":"$80,000 - $100,000 per year","is_correct":false},{"text":"$100,000 - $150,000 per year","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: When applying for a research grant, scientists mus... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'When applying for a research grant, scientists must often provide which of the following?',
  'multiple_choice',
  '[{"text":"A detailed budget of how funds will be used","is_correct":true},{"text":"A list of employees working under them","is_correct":false},{"text":"A detailed client satisfaction report","is_correct":false},{"text":"A marketing report for the project","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: Which is an example of a daily task for a microbio... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Which is an example of a daily task for a microbiologist in a lab?',
  'multiple_choice',
  '[{"text":"Analyzing the growth of bacteria cultures","is_correct":true},{"text":"Negotiating employee benefits","is_correct":false},{"text":"Writing a financial report","is_correct":false},{"text":"Designing marketing materials","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: Why are safety protocols essential in chemical lab... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Why are safety protocols essential in chemical laboratories?',
  'multiple_choice',
  '[{"text":"To prevent accidents and ensure safe handling of chemicals","is_correct":true},{"text":"To reduce the cost of experiments","is_correct":false},{"text":"To increase team productivity","is_correct":false},{"text":"To improve communication skills","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: Which of the following represents a standard pract... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Which of the following represents a standard practice for maintaining accurate scientific data?',
  'multiple_choice',
  '[{"text":"Keeping detailed and organized lab notebooks","is_correct":true},{"text":"Storing data only in verbal form","is_correct":false},{"text":"Sharing data before verifying it","is_correct":false},{"text":"Using outdated equipment","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: Which factor is expected to drive the demand for r... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Which factor is expected to drive the demand for renewable energy scientists in the future?',
  'multiple_choice',
  '[{"text":"The increasing need for sustainable energy solutions","is_correct":true},{"text":"A decline in interest in environmental science","is_correct":false},{"text":"A decrease in global energy needs","is_correct":false},{"text":"The oversaturation of renewable energy jobs","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: What is one reason why careers in data science are... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'What is one reason why careers in data science are growing rapidly?',
  'multiple_choice',
  '[{"text":"The increasing reliance on data for decision-making","is_correct":true},{"text":"A decline in technology usage","is_correct":false},{"text":"Decreasing demand for data analysis","is_correct":false},{"text":"A lack of career opportunities in STEM","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: Which of the following describes a career advancem... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Which of the following describes a career advancement opportunity for a medical researcher?',
  'multiple_choice',
  '[{"text":"Becoming a lead investigator on clinical trials","is_correct":true},{"text":"Switching to a non-STEM career","is_correct":false},{"text":"Reducing the number of hours worked","is_correct":false},{"text":"Avoiding industry conferences","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: How can environmental scientists create value for ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'How can environmental scientists create value for their organizations?',
  'multiple_choice',
  '[{"text":"By designing cost-effective solutions to environmental challenges","is_correct":true},{"text":"By reducing energy efficiency","is_correct":false},{"text":"By focusing solely on academic research","is_correct":false},{"text":"By avoiding collaboration with other teams","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: Why is it important for scientists to optimize the... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'Why is it important for scientists to optimize the use of laboratory resources?',
  'multiple_choice',
  '[{"text":"To reduce costs and improve overall efficiency","is_correct":true},{"text":"To increase employee salaries","is_correct":false},{"text":"To eliminate the need for safety equipment","is_correct":false},{"text":"To create more paperwork","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: What strategic decision can a biotechnologist make... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_5,
  'What strategic decision can a biotechnologist make to increase their earning potential?',
  'multiple_choice',
  '[{"text":"Pursuing an advanced degree in biotechnology or a related field","is_correct":true},{"text":"Avoiding networking opportunities","is_correct":false},{"text":"Focusing only on tasks outside of their job description","is_correct":false},{"text":"Working fewer hours to save energy","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Education & Teaching Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_6
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Education & Teaching Careers',
  'Explore careers in education, teaching, and training',
  'Education',
  'Education',
  ARRAY[],
  'medium',
  ARRAY['education', 'teaching', 'training', 'school'],
  true,
  true,
  18
) RETURNING id INTO set_6;

-- Question 1: Which skill is most important for a teacher to eff... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'Which skill is most important for a teacher to effectively collaborate with colleagues and administrators?',
  'multiple_choice',
  '[{"text":"Time management","is_correct":false},{"text":"Interpersonal communication","is_correct":true},{"text":"Creativity","is_correct":false},{"text":"Technical skills","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: What is an essential leadership quality for a prin... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What is an essential leadership quality for a principal managing a team of educators?',
  'multiple_choice',
  '[{"text":"Conflict resolution skills","is_correct":true},{"text":"Physical stamina","is_correct":false},{"text":"Advanced computer programming","is_correct":false},{"text":"Artistic talent","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: Mentoring student teachers requires which key trai... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'Mentoring student teachers requires which key trait?',
  'multiple_choice',
  '[{"text":"Ability to multitask","is_correct":false},{"text":"Strong mentoring and guidance skills","is_correct":true},{"text":"Physical strength","is_correct":false},{"text":"Knowledge of marketing strategies","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: Which technology is commonly used to enhance class... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'Which technology is commonly used to enhance classroom teaching?',
  'multiple_choice',
  '[{"text":"Interactive whiteboards","is_correct":true},{"text":"Video game consoles","is_correct":false},{"text":"Mobile payment systems","is_correct":false},{"text":"Industrial machinery","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: What is a primary responsibility of curriculum des... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What is a primary responsibility of curriculum designers in education?',
  'multiple_choice',
  '[{"text":"Creating engaging lesson plans and materials","is_correct":true},{"text":"Recruiting new educators","is_correct":false},{"text":"Establishing salary budgets","is_correct":false},{"text":"Organizing school fundraisers","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: Which feature of online learning platforms has imp... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'Which feature of online learning platforms has improved remote education?',
  'multiple_choice',
  '[{"text":"Video conferencing and interactive quizzes","is_correct":true},{"text":"Physical books and paper worksheets","is_correct":false},{"text":"Traditional chalkboards","is_correct":false},{"text":"Outdoor teaching spaces","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: What is the average starting salary for a first-ye... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What is the average starting salary for a first-year teacher in the United States?',
  'multiple_choice',
  '[{"text":"Around $40,000-$45,000 per year","is_correct":true},{"text":"Around $20,000 per year","is_correct":false},{"text":"Around $60,000 per year","is_correct":false},{"text":"Around $90,000 per year","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: Which of the following is a factor that influences... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'Which of the following is a factor that influences a teacher''s salary?',
  'multiple_choice',
  '[{"text":"Location and years of experience","is_correct":true},{"text":"The number of students in the classroom","is_correct":false},{"text":"Choice of subject taught","is_correct":false},{"text":"Availability of chalkboards","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: Grant funding for schools is typically used for wh... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'Grant funding for schools is typically used for which of the following?',
  'multiple_choice',
  '[{"text":"Professional development for teachers","is_correct":true},{"text":"Increasing teacher salaries","is_correct":false},{"text":"Paying student fees","is_correct":false},{"text":"Building theme parks","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: What is one of the key daily responsibilities of a... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What is one of the key daily responsibilities of a kindergarten teacher?',
  'multiple_choice',
  '[{"text":"Planning and leading engaging learning activities","is_correct":true},{"text":"Developing software applications","is_correct":false},{"text":"Managing school budgets","is_correct":false},{"text":"Hiring school staff","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: What is a best practice for grading student assign... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What is a best practice for grading student assignments efficiently?',
  'multiple_choice',
  '[{"text":"Using standardized rubrics and feedback templates","is_correct":true},{"text":"Grading assignments randomly","is_correct":false},{"text":"Skipping feedback entirely","is_correct":false},{"text":"Delegating grading tasks to students","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: Which safety protocol is critical for educators du... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'Which safety protocol is critical for educators during field trips?',
  'multiple_choice',
  '[{"text":"Ensuring proper student-to-chaperone ratios","is_correct":true},{"text":"Allowing students to plan their own routes","is_correct":false},{"text":"Providing minimal supervision","is_correct":false},{"text":"Arriving late to the destination","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: What is the projected job growth for kindergarten ... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What is the projected job growth for kindergarten through high school teaching positions over the next decade?',
  'multiple_choice',
  '[{"text":"Stable or slightly increasing growth","is_correct":true},{"text":"Rapid decline","is_correct":false},{"text":"Extreme growth over 50%","is_correct":false},{"text":"No growth expected","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: What is one way an educator can advance their care... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What is one way an educator can advance their career?',
  'multiple_choice',
  '[{"text":"Earn a graduate degree in education","is_correct":true},{"text":"Work fewer hours","is_correct":false},{"text":"Avoid professional development opportunities","is_correct":false},{"text":"Skip classroom management training","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: What type of certification is often required for t... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What type of certification is often required for teachers to secure employment?',
  'multiple_choice',
  '[{"text":"State-issued teaching certification","is_correct":true},{"text":"Driver's license","is_correct":false},{"text":"Medical license","is_correct":false},{"text":"Real estate license","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: Which strategic decision can help a teacher increa... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'Which strategic decision can help a teacher increase their salary over time?',
  'multiple_choice',
  '[{"text":"Pursuing advanced teaching certifications or degrees","is_correct":true},{"text":"Teaching fewer classes per year","is_correct":false},{"text":"Avoiding professional development activities","is_correct":false},{"text":"Skipping extra-curricular involvement","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: How can schools optimize resources to reduce costs... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'How can schools optimize resources to reduce costs while maintaining quality education?',
  'multiple_choice',
  '[{"text":"Investing in shared technology resources","is_correct":true},{"text":"Reducing the number of teachers","is_correct":false},{"text":"Eliminating teacher training programs","is_correct":false},{"text":"Increasing class sizes indefinitely","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: What career decision can maximize a teacher’s fina... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_6,
  'What career decision can maximize a teacher’s financial ROI over time?',
  'multiple_choice',
  '[{"text":"Specializing in high-demand subjects like STEM","is_correct":true},{"text":"Teaching only part-time","is_correct":false},{"text":"Avoiding leadership roles","is_correct":false},{"text":"Taking unpaid leaves","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Public Service & Law Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_7
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Public Service & Law Careers',
  'Careers in law enforcement, legal services, and public safety',
  'Public Service',
  'Public Service',
  ARRAY[],
  'medium',
  ARRAY['law', 'legal', 'public_service', 'government'],
  true,
  true,
  18
) RETURNING id INTO set_7;

-- Question 1: Which skill is most important when managing a team... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'Which skill is most important when managing a team in public service roles like community management or public health?',
  'multiple_choice',
  '[{"text":"Effective communication","is_correct":true},{"text":"Advanced coding","is_correct":false},{"text":"Graphic design","is_correct":false},{"text":"Physical fitness","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: A social worker needs strong collaboration skills ... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'A social worker needs strong collaboration skills to work effectively with which of the following groups?',
  'multiple_choice',
  '[{"text":"Clients, colleagues, and support networks","is_correct":true},{"text":"Graphic designers and IT specialists","is_correct":false},{"text":"Lawyers and accountants only","is_correct":false},{"text":"Retail customers","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: A firefighter must often provide guidance to junio... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'A firefighter must often provide guidance to junior team members. Which leadership quality is MOST valuable in this role?',
  'multiple_choice',
  '[{"text":"Mentoring and patience","is_correct":true},{"text":"Technical expertise alone","is_correct":false},{"text":"Strict discipline without feedback","is_correct":false},{"text":"Time management","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: Which technology is commonly used by public health... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'Which technology is commonly used by public health officials to track the spread of diseases?',
  'multiple_choice',
  '[{"text":"Geographic Information Systems (GIS)","is_correct":true},{"text":"Video editing software","is_correct":false},{"text":"AutoCAD for design","is_correct":false},{"text":"Customer relationship management tools","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: What is a key feature of the tools used by forensi... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'What is a key feature of the tools used by forensic scientists in criminal investigations?',
  'multiple_choice',
  '[{"text":"High precision and accuracy","is_correct":true},{"text":"Portability for fieldwork","is_correct":false},{"text":"Aesthetic design","is_correct":false},{"text":"Durability for outdoor use","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: Which of the following is an essential component o... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'Which of the following is an essential component of public infrastructure designed by civil engineers working in public service?',
  'multiple_choice',
  '[{"text":"Roads and bridges","is_correct":true},{"text":"Home appliances","is_correct":false},{"text":"Retail websites","is_correct":false},{"text":"Marketing campaigns","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: Which factor is most important for determining the... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'Which factor is most important for determining the salary of an entry-level police officer in a city?',
  'multiple_choice',
  '[{"text":"Cost of living in the city","is_correct":true},{"text":"Availability of new recruits","is_correct":false},{"text":"Number of fire stations in the area","is_correct":false},{"text":"The officer's height","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: One of the biggest challenges in budgeting for pub... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'One of the biggest challenges in budgeting for public services is:',
  'multiple_choice',
  '[{"text":"Ensuring resources are allocated to meet community needs","is_correct":true},{"text":"Balancing staff schedules","is_correct":false},{"text":"Training for advanced technical skills","is_correct":false},{"text":"Finding new clients for the organization","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: What is an important step when estimating the cost... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'What is an important step when estimating the costs of a new public park project?',
  'multiple_choice',
  '[{"text":"Calculating materials and labor costs","is_correct":true},{"text":"Choosing a park mascot","is_correct":false},{"text":"Hiring a social worker","is_correct":false},{"text":"Posting the project on social media","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: Which of these is a key protocol for a paramedic r... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'Which of these is a key protocol for a paramedic responding to an emergency call?',
  'multiple_choice',
  '[{"text":"Assessing the scene for safety before intervening","is_correct":true},{"text":"Administering CPR without checking for a pulse","is_correct":false},{"text":"Focusing on property damage before treating victims","is_correct":false},{"text":"Ignoring patient records","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: What is a key daily task for a librarian working i... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'What is a key daily task for a librarian working in a public library?',
  'multiple_choice',
  '[{"text":"Organizing and cataloging books","is_correct":true},{"text":"Designing book covers","is_correct":false},{"text":"Conducting traffic audits","is_correct":false},{"text":"Performing emergency surgeries","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: What is a common best practice for teachers in pub... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'What is a common best practice for teachers in public schools?',
  'multiple_choice',
  '[{"text":"Developing lesson plans tailored to student needs","is_correct":true},{"text":"Ignoring student feedback on assignments","is_correct":false},{"text":"Skipping parent-teacher conferences","is_correct":false},{"text":"Focusing only on standardized tests","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: Which public service career is projected to have i... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'Which public service career is projected to have increased demand due to an aging population?',
  'multiple_choice',
  '[{"text":"Home health aides","is_correct":true},{"text":"Game designers","is_correct":false},{"text":"Pet groomers","is_correct":false},{"text":"Photographers","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: Which public service role is expected to remain es... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'Which public service role is expected to remain essential due to the ongoing need for public safety?',
  'multiple_choice',
  '[{"text":"Police officers","is_correct":true},{"text":"Movie directors","is_correct":false},{"text":"Fashion designers","is_correct":false},{"text":"Writers","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: What is one reason why careers in renewable energy... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'What is one reason why careers in renewable energy engineering are growing in demand within public service?',
  'multiple_choice',
  '[{"text":"Increased focus on sustainable infrastructure","is_correct":true},{"text":"Declining interest in environmental issues","is_correct":false},{"text":"Fewer jobs in technology","is_correct":false},{"text":"Decreased government funding","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: How can public service professionals create financ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'How can public service professionals create financial value for their organization?',
  'multiple_choice',
  '[{"text":"Improving the efficiency of operations","is_correct":true},{"text":"Reducing the number of employees","is_correct":false},{"text":"Eliminating all training programs","is_correct":false},{"text":"Cutting safety measures","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: What is one way a public transportation manager ca... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'What is one way a public transportation manager can maximize the value of their service?',
  'multiple_choice',
  '[{"text":"Minimizing delays and improving scheduling","is_correct":true},{"text":"Reducing maintenance on vehicles","is_correct":false},{"text":"Limiting the number of available buses","is_correct":false},{"text":"Focusing only on high-income neighborhoods","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: Which of the following actions can help a nonprofi... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_7,
  'Which of the following actions can help a nonprofit manager secure funding for programs?',
  'multiple_choice',
  '[{"text":"Writing strong grant proposals","is_correct":true},{"text":"Avoiding partnerships with other organizations","is_correct":false},{"text":"Cutting employee salaries","is_correct":false},{"text":"Not advertising programs","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Agriculture & Environmental Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_8
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Agriculture & Environmental Careers',
  'Careers in environmental science, conservation, and agriculture',
  'Agriculture',
  'Agriculture',
  ARRAY[],
  'medium',
  ARRAY['agriculture', 'environment', 'conservation', 'sustainability'],
  true,
  true,
  18
) RETURNING id INTO set_8;

-- Question 1: Which skill is most important for a farm manager t... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'Which skill is most important for a farm manager to foster teamwork among farm workers?',
  'multiple_choice',
  '[{"text":"Effective communication","is_correct":true},{"text":"Technical knowledge","is_correct":false},{"text":"Physical strength","is_correct":false},{"text":"Sales ability","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: In agriculture, what is a key responsibility of an... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'In agriculture, what is a key responsibility of an agronomist when working with farmers?',
  'multiple_choice',
  '[{"text":"Providing advice on crop management","is_correct":true},{"text":"Designing new farming equipment","is_correct":false},{"text":"Analyzing financial markets","is_correct":false},{"text":"Developing urban landscaping plans","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: Which interpersonal skill is essential for a lives... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'Which interpersonal skill is essential for a livestock veterinarian who interacts with clients daily?',
  'multiple_choice',
  '[{"text":"Empathy","is_correct":true},{"text":"Mathematical skills","is_correct":false},{"text":"Physical endurance","is_correct":false},{"text":"Programming abilities","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: Which innovation has improved the quality of agric... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'Which innovation has improved the quality of agricultural products like fruits and vegetables during transport?',
  'multiple_choice',
  '[{"text":"Cold storage technology","is_correct":true},{"text":"Solar panels","is_correct":false},{"text":"Crop rotation methods","is_correct":false},{"text":"Genetic modification","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: What is the purpose of precision agriculture techn... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'What is the purpose of precision agriculture technology?',
  'multiple_choice',
  '[{"text":"To increase productivity and reduce waste","is_correct":true},{"text":"To improve communication on farms","is_correct":false},{"text":"To train new farmers","is_correct":false},{"text":"To increase the size of farm machinery","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: Which agricultural product is commonly processed t... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'Which agricultural product is commonly processed to ensure its safety and quality before being sold?',
  'multiple_choice',
  '[{"text":"Milk","is_correct":true},{"text":"Corn seeds","is_correct":false},{"text":"Wheat stalks","is_correct":false},{"text":"Raw cotton","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: What is one pricing strategy farmers use to set co... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'What is one pricing strategy farmers use to set competitive rates for produce at local markets?',
  'multiple_choice',
  '[{"text":"Researching local market demand and prices","is_correct":true},{"text":"Selling only online","is_correct":false},{"text":"Ignoring competitors and setting fixed rates","is_correct":false},{"text":"Pricing products based solely on production costs","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: In agriculture, what factor influences the salary ... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'In agriculture, what factor influences the salary range of farm equipment operators?',
  'multiple_choice',
  '[{"text":"Level of experience and machinery operated","is_correct":true},{"text":"The number of crops harvested annually","is_correct":false},{"text":"The size of the farm","is_correct":false},{"text":"How long the operator can work without breaks","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: Which cost factor is most important for farmers wh... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'Which cost factor is most important for farmers when budgeting for irrigation systems?',
  'multiple_choice',
  '[{"text":"Water usage and energy costs","is_correct":true},{"text":"Farm soil type","is_correct":false},{"text":"Number of workers available","is_correct":false},{"text":"Weather report accuracy","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: What is a common safety procedure for pesticide ap... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'What is a common safety procedure for pesticide application on farms?',
  'multiple_choice',
  '[{"text":"Wearing protective gear","is_correct":true},{"text":"Applying pesticides during the rainy season","is_correct":false},{"text":"Avoiding the use of any machinery","is_correct":false},{"text":"Using pesticides without labels","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: What is the primary goal of crop rotation in farmi... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'What is the primary goal of crop rotation in farming processes?',
  'multiple_choice',
  '[{"text":"Improving soil health and reducing pests","is_correct":true},{"text":"Maximizing the speed of harvest","is_correct":false},{"text":"Increasing water usage","is_correct":false},{"text":"Reducing the need for fertilizers","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: What procedure ensures compliance with regulations... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'What procedure ensures compliance with regulations for organic farming?',
  'multiple_choice',
  '[{"text":"Avoiding synthetic fertilizers and pesticides","is_correct":true},{"text":"Using genetically modified crops","is_correct":false},{"text":"Planting crops in the same fields every year","is_correct":false},{"text":"Automating all farm operations","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: What income-generating activity is common for farm... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'What income-generating activity is common for farmers during the off-season?',
  'multiple_choice',
  '[{"text":"Selling preserved or processed foods","is_correct":true},{"text":"Growing summer-ready crops","is_correct":false},{"text":"Purchasing new equipment","is_correct":false},{"text":"Rotating crop fields","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: Why are jobs in sustainable agriculture expected t... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'Why are jobs in sustainable agriculture expected to grow in the coming years?',
  'multiple_choice',
  '[{"text":"Increased global focus on environmental conservation","is_correct":true},{"text":"Decreased demand for organic products","is_correct":false},{"text":"Outdated farming methods are preferred","is_correct":false},{"text":"Reduction in population growth worldwide","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: What factor contributes to high job stability for ... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'What factor contributes to high job stability for agricultural scientists?',
  'multiple_choice',
  '[{"text":"Continual need for research on food production","is_correct":true},{"text":"Low demand for agricultural education","is_correct":false},{"text":"Declining interest in sustainable farming practices","is_correct":false},{"text":"Reduced government funding for agricultural research","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: Which strategic decision often leads to higher pro... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'Which strategic decision often leads to higher profits in agricultural businesses?',
  'multiple_choice',
  '[{"text":"Investing in high-yield crop varieties","is_correct":true},{"text":"Reducing the workforce","is_correct":false},{"text":"Planting fewer crops","is_correct":false},{"text":"Avoiding innovation in farming methods","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: What is a cost-saving measure for large-scale farm... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'What is a cost-saving measure for large-scale farming operations?',
  'multiple_choice',
  '[{"text":"Investing in automated equipment","is_correct":true},{"text":"Using less fertilizer","is_correct":false},{"text":"Hiring more workers than needed","is_correct":false},{"text":"Reducing the size of farmland","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: How can farmers maximize profit when selling produ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_8,
  'How can farmers maximize profit when selling produce directly to customers?',
  'multiple_choice',
  '[{"text":"Eliminating middlemen to reduce costs","is_correct":true},{"text":"Using less water and fertilizer","is_correct":false},{"text":"Avoiding local markets","is_correct":false},{"text":"Lowering crop quality","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Construction & Skilled Trades Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_9
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Construction & Skilled Trades Careers',
  'Careers in construction, electrical work, plumbing, and skilled trades',
  'Construction',
  'Construction',
  ARRAY[],
  'medium',
  ARRAY['construction', 'trades', 'electrician', 'plumber', 'skilled_trades'],
  true,
  true,
  18
) RETURNING id INTO set_9;

-- Question 1: Which skill is essential for a construction manage... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Which skill is essential for a construction manager to effectively lead a team?',
  'multiple_choice',
  '[{"text":"Technical drawing skills","is_correct":false},{"text":"Effective communication skills","is_correct":true},{"text":"Advanced math skills","is_correct":false},{"text":"Physical strength","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: Why is teamwork important on a construction site?... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Why is teamwork important on a construction site?',
  'multiple_choice',
  '[{"text":"It increases project deadlines.","is_correct":false},{"text":"It ensures safety and efficiency during construction projects.","is_correct":true},{"text":"It allows workers to skip training.","is_correct":false},{"text":"It eliminates the need for supervision.","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: What is the primary role of a construction foreman... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'What is the primary role of a construction foreman in managing employees?',
  'multiple_choice',
  '[{"text":"Designing new construction tools","is_correct":false},{"text":"Overseeing the work and ensuring safety compliance","is_correct":true},{"text":"Calculating budgets","is_correct":false},{"text":"Negotiating with vendors","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: Which tool is commonly used for measuring angles i... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Which tool is commonly used for measuring angles in construction projects?',
  'multiple_choice',
  '[{"text":"Protractor","is_correct":true},{"text":"Trowel","is_correct":false},{"text":"Level","is_correct":false},{"text":"Hammer","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: What is the main purpose of using computer-aided d... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'What is the main purpose of using computer-aided design (CAD) software in construction?',
  'multiple_choice',
  '[{"text":"To improve efficiency in budgeting","is_correct":false},{"text":"To create precise blueprints and designs","is_correct":true},{"text":"To enhance client communication","is_correct":false},{"text":"To handle payroll for employees","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: What innovation has significantly improved constru... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'What innovation has significantly improved construction safety measures?',
  'multiple_choice',
  '[{"text":"Advanced power tools","is_correct":false},{"text":"Personal protective equipment (PPE)","is_correct":true},{"text":"Budget tracking software","is_correct":false},{"text":"Smartphones","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: What factor is most critical when estimating the c... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'What factor is most critical when estimating the cost of a construction project?',
  'multiple_choice',
  '[{"text":"The size of the construction team","is_correct":false},{"text":"The cost of materials and labor","is_correct":true},{"text":"The number of training sessions for employees","is_correct":false},{"text":"The type of safety equipment used","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: Which pricing strategy is most commonly used in co... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Which pricing strategy is most commonly used in construction bidding?',
  'multiple_choice',
  '[{"text":"Fixed pricing","is_correct":true},{"text":"Hourly pricing","is_correct":false},{"text":"Dynamic pricing","is_correct":false},{"text":"Discount pricing","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: Why is it important for construction managers to c... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Why is it important for construction managers to create a detailed budget?',
  'multiple_choice',
  '[{"text":"To speed up project timelines","is_correct":false},{"text":"To ensure project costs stay within financial limits","is_correct":true},{"text":"To eliminate the need for subcontractors","is_correct":false},{"text":"To minimize the use of advanced safety equipment","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: What is the first step in the construction process... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'What is the first step in the construction process when building a structure?',
  'multiple_choice',
  '[{"text":"Laying down the flooring","is_correct":false},{"text":"Site preparation and clearing","is_correct":true},{"text":"Installing windows","is_correct":false},{"text":"Painting walls","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: Which safety protocol is mandatory on all construc... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Which safety protocol is mandatory on all construction sites?',
  'multiple_choice',
  '[{"text":"Wearing high-visibility clothing and hard hats","is_correct":true},{"text":"Using smartphones during work hours","is_correct":false},{"text":"Allowing open flames near materials","is_correct":false},{"text":"Skipping safety inspections","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: Why is workflow optimization essential in construc... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Why is workflow optimization essential in construction projects?',
  'multiple_choice',
  '[{"text":"To reduce delays and improve efficiency","is_correct":true},{"text":"To hire more subcontractors","is_correct":false},{"text":"To avoid using safety equipment","is_correct":false},{"text":"To increase the cost of the project","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: What is the job growth outlook for construction la... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'What is the job growth outlook for construction laborers over the next 10 years?',
  'multiple_choice',
  '[{"text":"Expected to decline","is_correct":false},{"text":"Expected to grow by 4-5%","is_correct":true},{"text":"Expected to remain stagnant","is_correct":false},{"text":"Expected to grow by 20%","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: Which career path in construction offers the most ... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Which career path in construction offers the most opportunities for promotion?',
  'multiple_choice',
  '[{"text":"Electrician","is_correct":false},{"text":"Construction management","is_correct":true},{"text":"Painter","is_correct":false},{"text":"Roofer","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: Why is market demand for construction careers expe... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'Why is market demand for construction careers expected to grow?',
  'multiple_choice',
  '[{"text":"Advances in technology","is_correct":false},{"text":"Increased need for infrastructure development","is_correct":true},{"text":"Reduction in construction costs","is_correct":false},{"text":"Decrease in urban populations","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: How can construction professionals help reduce pro... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'How can construction professionals help reduce project costs and improve profits?',
  'multiple_choice',
  '[{"text":"Using low-quality materials","is_correct":false},{"text":"Minimizing waste and using resources efficiently","is_correct":true},{"text":"Hiring fewer employees","is_correct":false},{"text":"Skipping safety inspections","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: What is the financial benefit of choosing energy-e... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'What is the financial benefit of choosing energy-efficient designs in construction?',
  'multiple_choice',
  '[{"text":"Decreases the initial cost of a project","is_correct":false},{"text":"Reduces long-term utility expenses for clients","is_correct":true},{"text":"Eliminates the need for inspections","is_correct":false},{"text":"Allows for higher labor costs","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: What strategic decision can help construction work... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_9,
  'What strategic decision can help construction workers maximize career earnings?',
  'multiple_choice',
  '[{"text":"Specializing in high-demand fields like green building","is_correct":true},{"text":"Skipping technical certifications","is_correct":false},{"text":"Working only on small projects","is_correct":false},{"text":"Avoiding leadership roles","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);


-- Question Set: Hospitality & Service Industry Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_10
  '07951691-658a-4808-b2f8-c497c067edfa', -- Replace with actual teacher ID
  'Hospitality & Service Industry Careers',
  'Careers in hospitality, food service, tourism, and customer service',
  'Hospitality',
  'Hospitality',
  ARRAY[],
  'medium',
  ARRAY['hospitality', 'service', 'tourism', 'culinary', 'customer_service'],
  true,
  true,
  18
) RETURNING id INTO set_10;

-- Question 1: Which skill is essential for a hotel manager to ef... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'Which skill is essential for a hotel manager to effectively lead their team?',
  'multiple_choice',
  '[{"text":"Excellent communication skills","is_correct":true},{"text":"Advanced cooking techniques","is_correct":false},{"text":"Proficiency in graphic design","is_correct":false},{"text":"Expertise in coding languages","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
);

-- Question 2: What is the primary goal when training new hospita... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What is the primary goal when training new hospitality staff?',
  'multiple_choice',
  '[{"text":"To ensure customer satisfaction and proper service delivery","is_correct":true},{"text":"To teach them advanced accounting skills","is_correct":false},{"text":"To prepare them for a career in IT","is_correct":false},{"text":"To familiarize them with marketing strategies","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
);

-- Question 3: How should hospitality employees handle customer c... [people]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'How should hospitality employees handle customer complaints?',
  'multiple_choice',
  '[{"text":"Listen actively and resolve issues promptly","is_correct":true},{"text":"Ignore the complaint and focus on other customers","is_correct":false},{"text":"Refer customers to online forums for solutions","is_correct":false},{"text":"Offer them a free vacation package immediately","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'people'
);

-- Question 4: What is critical to ensuring the quality of a hote... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What is critical to ensuring the quality of a hotel''s room service menu?',
  'multiple_choice',
  '[{"text":"Using fresh ingredients and maintaining consistent presentation","is_correct":true},{"text":"Offering only budget-priced items","is_correct":false},{"text":"Including a variety of international dishes","is_correct":false},{"text":"Providing free delivery for all orders","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
);

-- Question 5: Which of the following tools is most commonly used... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'Which of the following tools is most commonly used by event planners in the hospitality industry?',
  'multiple_choice',
  '[{"text":"Event management software","is_correct":true},{"text":"3D animation tools","is_correct":false},{"text":"Social media scheduling apps","is_correct":false},{"text":"Stock trading platforms","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'product'
);

-- Question 6: What innovation has significantly improved hotel c... [product]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What innovation has significantly improved hotel check-in experiences?',
  'multiple_choice',
  '[{"text":"Mobile check-in and digital room keys","is_correct":true},{"text":"Automated voice assistants for room cleaning","is_correct":false},{"text":"Advanced robotics in restaurants","is_correct":false},{"text":"Virtual reality travel brochures","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'product'
);

-- Question 7: What is an important factor in determining pricing... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What is an important factor in determining pricing for hotel rooms?',
  'multiple_choice',
  '[{"text":"Location and seasonal demand","is_correct":true},{"text":"The hotel's choice of logo design","is_correct":false},{"text":"Guest preferences for music playlists","is_correct":false},{"text":"The height of the hotel building","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'pricing'
);

-- Question 8: Which role in hospitality involves budgeting and p... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'Which role in hospitality involves budgeting and pricing event packages?',
  'multiple_choice',
  '[{"text":"Event coordinator","is_correct":true},{"text":"Concierge","is_correct":false},{"text":"Front desk receptionist","is_correct":false},{"text":"Housekeeping supervisor","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'pricing'
);

-- Question 9: How should a restaurant manager set prices for men... [pricing]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'How should a restaurant manager set prices for menu items?',
  'multiple_choice',
  '[{"text":"By considering ingredient costs and competitor pricing","is_correct":true},{"text":"By basing it solely on customer feedback","is_correct":false},{"text":"By using random values for each dish","is_correct":false},{"text":"By avoiding expensive ingredients entirely","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'pricing'
);

-- Question 10: Which protocol is crucial for ensuring guest safet... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'Which protocol is crucial for ensuring guest safety in a hotel?',
  'multiple_choice',
  '[{"text":"Following emergency evacuation procedures","is_correct":true},{"text":"Hiring staff only from local areas","is_correct":false},{"text":"Providing free Wi-Fi access","is_correct":false},{"text":"Decorating rooms with seasonal themes","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'process'
);

-- Question 11: What is an example of an efficient workflow in a r... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What is an example of an efficient workflow in a restaurant kitchen?',
  'multiple_choice',
  '[{"text":"Designating specific stations for food preparation tasks","is_correct":true},{"text":"Having chefs cook all meals at the same time","is_correct":false},{"text":"Keeping all ingredients stored on the floor","is_correct":false},{"text":"Using only handwritten orders","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'process'
);

-- Question 12: What is a best practice for managing check-ins at ... [process]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What is a best practice for managing check-ins at a busy hotel front desk?',
  'multiple_choice',
  '[{"text":"Implementing digital systems to reduce wait times","is_correct":true},{"text":"Scheduling all guests to arrive at the same time","is_correct":false},{"text":"Accepting only cash payments","is_correct":false},{"text":"Avoiding guest interactions during peak hours","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'process'
);

-- Question 13: What is a potential income stream for five-star ho... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What is a potential income stream for five-star hotels beyond room bookings?',
  'multiple_choice',
  '[{"text":"Hosting corporate events and conferences","is_correct":true},{"text":"Launching a travel blog","is_correct":false},{"text":"Promoting local tourism websites","is_correct":false},{"text":"Selling uniforms to other hotels","is_correct":false}]'::jsonb,
  30,
  10,
  12,
  'medium',
  'proceeds'
);

-- Question 14: Which hospitality career is projected to grow with... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'Which hospitality career is projected to grow with the increase in global travel?',
  'multiple_choice',
  '[{"text":"Travel agents and tour guides","is_correct":true},{"text":"Software developers","is_correct":false},{"text":"Automobile mechanics","is_correct":false},{"text":"Fashion designers","is_correct":false}]'::jsonb,
  30,
  10,
  13,
  'medium',
  'proceeds'
);

-- Question 15: What benefit can a hospitality employee expect as ... [proceeds]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What benefit can a hospitality employee expect as they advance in their career?',
  'multiple_choice',
  '[{"text":"Higher salaries and access to management positions","is_correct":true},{"text":"A guaranteed role in IT projects","is_correct":false},{"text":"Ownership of the property they work in","is_correct":false},{"text":"Reduced working hours and no more tasks","is_correct":false}]'::jsonb,
  30,
  10,
  14,
  'medium',
  'proceeds'
);

-- Question 16: How can a hotel optimize its profits during off-pe... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'How can a hotel optimize its profits during off-peak seasons?',
  'multiple_choice',
  '[{"text":"Offer special discounts and packages","is_correct":true},{"text":"Close all amenities during these periods","is_correct":false},{"text":"Focus only on business travelers","is_correct":false},{"text":"Restrict room availability","is_correct":false}]'::jsonb,
  30,
  10,
  15,
  'medium',
  'profits'
);

-- Question 17: What strategy can restaurants use to reduce waste ... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'What strategy can restaurants use to reduce waste and improve financial performance?',
  'multiple_choice',
  '[{"text":"Track inventory and implement portion control","is_correct":true},{"text":"Serve only vegan meals","is_correct":false},{"text":"Increase menu prices drastically","is_correct":false},{"text":"Host daily food-eating contests","is_correct":false}]'::jsonb,
  30,
  10,
  16,
  'medium',
  'profits'
);

-- Question 18: Which career decision can maximize financial succe... [profits]
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) VALUES (
  set_10,
  'Which career decision can maximize financial success in hospitality?',
  'multiple_choice',
  '[{"text":"Specializing in luxury hospitality services","is_correct":true},{"text":"Focusing solely on entry-level positions","is_correct":false},{"text":"Avoiding further education or certifications","is_correct":false},{"text":"Changing jobs every 3 months","is_correct":false}]'::jsonb,
  30,
  10,
  17,
  'medium',
  'profits'
);

