-- Pathcte Question Sets and Questions
-- Generated: 2025-10-28T19:47:02.070Z
-- Teacher ID: 0ae5001d-41f0-4969-86a9-96d8dc478a28

-- Question Set: Introduction to Healthcare Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_1
  '0ae5001d-41f0-4969-86a9-96d8dc478a28'
  'Introduction to Healthcare Careers',
  'Learn about different jobs in hospitals, clinics, and healthcare',
  'Healthcare',
  'Healthcare',
  ARRAY[6, 7, 8],
  'easy',
  ARRAY['healthcare', 'medicine', 'doctor', 'nurse', 'middle school'],
  true,
  true,
  10
) RETURNING id INTO set_1;

-- Question 1: Which healthcare professional focuses on diagnosin...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'Which healthcare professional focuses on diagnosing and treating illnesses in patients?',
  'multiple_choice',
  '[{"text":"Doctor","is_correct":true},{"text":"Pharmacist","is_correct":false},{"text":"Physical Therapist","is_correct":false},{"text":"Medical Assistant","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What is the main job of a nurse?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'What is the main job of a nurse?',
  'multiple_choice',
  '[{"text":"Teaching exercise routines","is_correct":false},{"text":"Helping patients manage daily tasks","is_correct":false},{"text":"Providing care and support to patients","is_correct":true},{"text":"Performing surgeries","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: What level of education is typically required to b...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'What level of education is typically required to become a pharmacist?',
  'multiple_choice',
  '[{"text":"High school diploma","is_correct":false},{"text":"Doctoral degree (Pharm.D.)","is_correct":true},{"text":"Associate degree","is_correct":false},{"text":"Master's degree","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: Which of these is MOST important for a healthcare ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'Which of these is MOST important for a healthcare worker to have?',
  'multiple_choice',
  '[{"text":"Good communication skills","is_correct":true},{"text":"Expert cooking skills","is_correct":false},{"text":"Knowledge of computer programming","is_correct":false},{"text":"Artistic talent","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: Which healthcare professional designs exercise pla...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'Which healthcare professional designs exercise plans to help patients recover from injuries?',
  'multiple_choice',
  '[{"text":"Physical Therapist","is_correct":true},{"text":"Nurse","is_correct":false},{"text":"Nutritionist","is_correct":false},{"text":"Pharmacist","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: What is one common work environment for a medical ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'What is one common work environment for a medical laboratory technician?',
  'multiple_choice',
  '[{"text":"Operating room","is_correct":false},{"text":"Laboratory","is_correct":true},{"text":"Pharmacy","is_correct":false},{"text":"Ambulance","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: Which healthcare career involves helping patients ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'Which healthcare career involves helping patients with their diet and nutrition?',
  'multiple_choice',
  '[{"text":"Nutritionist or Dietitian","is_correct":true},{"text":"Surgeon","is_correct":false},{"text":"Medical Assistant","is_correct":false},{"text":"Radiologist","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: Which healthcare professional uses X-rays, MRIs, o...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'Which healthcare professional uses X-rays, MRIs, or CT scans to diagnose diseases?',
  'multiple_choice',
  '[{"text":"Radiologic Technologist","is_correct":true},{"text":"Pharmacist","is_correct":false},{"text":"Nurse Practitioner","is_correct":false},{"text":"Nutritionist","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: What is the job of an EMT (Emergency Medical Techn...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'What is the job of an EMT (Emergency Medical Technician)?',
  'multiple_choice',
  '[{"text":"To provide emergency medical care to patients","is_correct":true},{"text":"To assist surgeons during operations","is_correct":false},{"text":"To prescribe medications to patients","is_correct":false},{"text":"To develop fitness plans","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: What is one key responsibility of a dentist?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_1,
  'What is one key responsibility of a dentist?',
  'multiple_choice',
  '[{"text":"Caring for patients' teeth and gums","is_correct":true},{"text":"Diagnosing heart diseases","is_correct":false},{"text":"Treating mental health conditions","is_correct":false},{"text":"Preparing and dispensing medications","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Exploring Technology Jobs
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_2
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Exploring Technology Jobs',
  'Discover careers working with computers, apps, and technology',
  'Technology',
  'Technology',
  ARRAY[6, 7, 8],
  'easy',
  ARRAY['technology', 'computers', 'programming', 'middle school'],
  true,
  true,
  10
) RETURNING id INTO set_2;

-- Question 1: What is the main responsibility of a software deve...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'What is the main responsibility of a software developer?',
  'multiple_choice',
  '[{"text":"Designing and creating computer programs or apps","is_correct":true},{"text":"Maintaining computer hardware like keyboards","is_correct":false},{"text":"Teaching people how to use computers","is_correct":false},{"text":"Monitoring internet speeds all day","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: Which skill is MOST important for a cybersecurity ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'Which skill is MOST important for a cybersecurity specialist?',
  'multiple_choice',
  '[{"text":"Protecting digital information from hackers","is_correct":true},{"text":"Writing books about technology","is_correct":false},{"text":"Repairing broken phones and computers","is_correct":false},{"text":"Creating video content for marketing","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: Which of these careers focuses on designing websit...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'Which of these careers focuses on designing websites?',
  'multiple_choice',
  '[{"text":"Web Developer","is_correct":true},{"text":"Data Analyst","is_correct":false},{"text":"Computer Technician","is_correct":false},{"text":"Network Engineer","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: What kind of education is typically needed to beco...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'What kind of education is typically needed to become an IT support specialist?',
  'multiple_choice',
  '[{"text":"A certification or associate degree in information technology","is_correct":true},{"text":"A master's degree in physics","is_correct":false},{"text":"A degree in biology","is_correct":false},{"text":"No education is needed","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: What does a game designer do?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'What does a game designer do?',
  'multiple_choice',
  '[{"text":"Creates the storyline, characters, and gameplay for video games","is_correct":true},{"text":"Repairs broken computer screens","is_correct":false},{"text":"Manages a team of engineers","is_correct":false},{"text":"Writes emails for a company","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: Which skill is especially important for a data ana...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'Which skill is especially important for a data analyst?',
  'multiple_choice',
  '[{"text":"Analyzing large sets of numbers and data","is_correct":true},{"text":"Knowing how to bake cakes","is_correct":false},{"text":"Repairing broken wires","is_correct":false},{"text":"Filming movies","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: Which technology career involves designing compute...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'Which technology career involves designing computer networks for communication?',
  'multiple_choice',
  '[{"text":"Network Engineer","is_correct":true},{"text":"Graphic Designer","is_correct":false},{"text":"Software Tester","is_correct":false},{"text":"Game Developer","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: Where does a technology career in robotics enginee...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'Where does a technology career in robotics engineering typically work?',
  'multiple_choice',
  '[{"text":"Designing and building robots","is_correct":true},{"text":"Selling computer software","is_correct":false},{"text":"Repairing mobile devices","is_correct":false},{"text":"Teaching math in schools","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: What is one main responsibility of an IT project m...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'What is one main responsibility of an IT project manager?',
  'multiple_choice',
  '[{"text":"Planning and organizing technology projects","is_correct":true},{"text":"Coding computer games","is_correct":false},{"text":"Fixing internet connection issues","is_correct":false},{"text":"Testing new software updates","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: Which programming language is popular for web deve...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_2,
  'Which programming language is popular for web development?',
  'multiple_choice',
  '[{"text":"JavaScript","is_correct":true},{"text":"Spanish","is_correct":false},{"text":"Photoshop","is_correct":false},{"text":"Excel","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Creative Careers for Artists
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_3
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Creative Careers for Artists',
  'Careers for people who love art, music, and being creative',
  'Arts',
  'Arts & Entertainment',
  ARRAY[6, 7, 8],
  'easy',
  ARRAY['art', 'creative', 'design', 'music', 'middle school'],
  true,
  true,
  10
) RETURNING id INTO set_3;

-- Question 1: Which of these is a common job for a graphic desig...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'Which of these is a common job for a graphic designer?',
  'multiple_choice',
  '[{"text":"Creating logos and website designs","is_correct":true},{"text":"Building computer hardware","is_correct":false},{"text":"Diagnosing medical conditions","is_correct":false},{"text":"Managing construction sites","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What is a key skill needed for a career as a paint...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'What is a key skill needed for a career as a painter?',
  'multiple_choice',
  '[{"text":"Knowledge of color theory","is_correct":true},{"text":"Understanding advanced mathematics","is_correct":false},{"text":"Ability to code software programs","is_correct":false},{"text":"Expertise in cooking techniques","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: What type of education is typically required to be...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'What type of education is typically required to become an architect?',
  'multiple_choice',
  '[{"text":"A degree in architecture","is_correct":true},{"text":"A degree in biology","is_correct":false},{"text":"A degree in culinary arts","is_correct":false},{"text":"A degree in journalism","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: Which of these careers involves working with actor...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'Which of these careers involves working with actors to create live performances?',
  'multiple_choice',
  '[{"text":"Theater director","is_correct":true},{"text":"Interior designer","is_correct":false},{"text":"Fashion model","is_correct":false},{"text":"Photographer","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: What is one responsibility of a museum curator?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'What is one responsibility of a museum curator?',
  'multiple_choice',
  '[{"text":"Organizing and displaying art collections","is_correct":true},{"text":"Editing movie scripts","is_correct":false},{"text":"Directing television shows","is_correct":false},{"text":"Teaching dance classes","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: Which industry do animators usually work in?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'Which industry do animators usually work in?',
  'multiple_choice',
  '[{"text":"Film and video game production","is_correct":true},{"text":"Healthcare and medicine","is_correct":false},{"text":"Law and legal services","is_correct":false},{"text":"Retail and sales","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: What is a key responsibility of an art teacher?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'What is a key responsibility of an art teacher?',
  'multiple_choice',
  '[{"text":"Teaching students creative techniques","is_correct":true},{"text":"Writing music scores for movies","is_correct":false},{"text":"Editing books for publication","is_correct":false},{"text":"Designing clothing patterns","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: Which career involves designing clothing and acces...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'Which career involves designing clothing and accessories?',
  'multiple_choice',
  '[{"text":"Fashion designer","is_correct":true},{"text":"Sound engineer","is_correct":false},{"text":"Set builder","is_correct":false},{"text":"Painter","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: What is one skill that is important for a photogra...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'What is one skill that is important for a photographer?',
  'multiple_choice',
  '[{"text":"Ability to use a camera and related equipment","is_correct":true},{"text":"Knowledge of computer coding languages","is_correct":false},{"text":"Skill in preparing meals","is_correct":false},{"text":"Expertise in legal contracts","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: Where do most musicians perform their work?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_3,
  'Where do most musicians perform their work?',
  'multiple_choice',
  '[{"text":"In concert halls and recording studios","is_correct":true},{"text":"In research laboratories","is_correct":false},{"text":"In office buildings","is_correct":false},{"text":"At construction sites","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Careers Helping Others
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_4
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Careers Helping Others',
  'Jobs focused on helping people and making a difference',
  'Public Service',
  'Public Service',
  ARRAY[6, 7, 8],
  'easy',
  ARRAY['helping', 'community', 'service', 'middle school'],
  true,
  true,
  10
) RETURNING id INTO set_4;

-- Question 1: Which of the following is a career in public servi...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'Which of the following is a career in public service?',
  'multiple_choice',
  '[{"text":"Firefighter","is_correct":true},{"text":"Software Developer","is_correct":false},{"text":"Chef","is_correct":false},{"text":"Architect","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What is the primary responsibility of a police off...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'What is the primary responsibility of a police officer?',
  'multiple_choice',
  '[{"text":"Maintaining public safety and enforcing laws","is_correct":true},{"text":"Designing buildings and infrastructure","is_correct":false},{"text":"Teaching students in schools","is_correct":false},{"text":"Selling goods in stores","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: What skill is MOST important for a social worker?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'What skill is MOST important for a social worker?',
  'multiple_choice',
  '[{"text":"Empathy and communication","is_correct":true},{"text":"Mathematics and programming","is_correct":false},{"text":"Cooking and baking","is_correct":false},{"text":"Physical fitness and agility","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: Which of the following careers typically requires ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'Which of the following careers typically requires a law degree?',
  'multiple_choice',
  '[{"text":"Attorney","is_correct":true},{"text":"Paramedic","is_correct":false},{"text":"Teacher","is_correct":false},{"text":"Electrician","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: Which public service career involves responding to...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'Which public service career involves responding to medical emergencies?',
  'multiple_choice',
  '[{"text":"Paramedic","is_correct":true},{"text":"Librarian","is_correct":false},{"text":"Firefighter","is_correct":false},{"text":"Postal Worker","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: What educational requirement is typically needed t...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'What educational requirement is typically needed to become a teacher?',
  'multiple_choice',
  '[{"text":"A bachelor's degree in education or a related field","is_correct":true},{"text":"No education requirements","is_correct":false},{"text":"A medical degree","is_correct":false},{"text":"A degree in engineering","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: Which government career focuses on delivering mail...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'Which government career focuses on delivering mail and packages?',
  'multiple_choice',
  '[{"text":"Postal Worker","is_correct":true},{"text":"Fire Marshal","is_correct":false},{"text":"City Planner","is_correct":false},{"text":"Paramedic","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: What does a public health official typically work ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'What does a public health official typically work to improve?',
  'multiple_choice',
  '[{"text":"The health and well-being of communities","is_correct":true},{"text":"The design of houses and buildings","is_correct":false},{"text":"The sale of technology products","is_correct":false},{"text":"The creation of art and music","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: What work environment does a firefighter most comm...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'What work environment does a firefighter most commonly work in?',
  'multiple_choice',
  '[{"text":"Fire stations and emergency scenes","is_correct":true},{"text":"Hospitals and clinics","is_correct":false},{"text":"Libraries and schools","is_correct":false},{"text":"Corporate offices","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: What skill is most important for a 911 emergency d...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_4,
  'What skill is most important for a 911 emergency dispatcher?',
  'multiple_choice',
  '[{"text":"Quick decision-making and communication","is_correct":true},{"text":"Artistic talent and creativity","is_correct":false},{"text":"Physical strength and endurance","is_correct":false},{"text":"Programming and coding","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Building Things: Construction & Trades
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_5
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Building Things: Construction & Trades',
  'Careers where you work with your hands and build things',
  'Skilled Trades',
  'Construction',
  ARRAY[6, 7, 8],
  'easy',
  ARRAY['construction', 'trades', 'building', 'middle school'],
  true,
  true,
  10
) RETURNING id INTO set_5;

-- Question 1: Which skilled trade involves installing and repair...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'Which skilled trade involves installing and repairing pipes for water systems in homes and buildings?',
  'multiple_choice',
  '[{"text":"Electrician","is_correct":false},{"text":"Plumber","is_correct":true},{"text":"Carpenter","is_correct":false},{"text":"Welder","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What is the main tool an electrician uses to test ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'What is the main tool an electrician uses to test electrical circuits?',
  'multiple_choice',
  '[{"text":"Wrench","is_correct":false},{"text":"Multimeter","is_correct":true},{"text":"Hammer","is_correct":false},{"text":"Saw","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: Which skilled trade often works with blueprints to...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'Which skilled trade often works with blueprints to build wooden structures or furniture?',
  'multiple_choice',
  '[{"text":"Carpenter","is_correct":true},{"text":"Plumber","is_correct":false},{"text":"Electrician","is_correct":false},{"text":"Mechanic","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: What is one requirement for starting most skilled ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'What is one requirement for starting most skilled trade careers?',
  'multiple_choice',
  '[{"text":"A bachelor's degree in science","is_correct":false},{"text":"Apprenticeship or on-the-job training","is_correct":true},{"text":"Owning a business","is_correct":false},{"text":"Passing a government exam","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: Which trade is responsible for creating strong met...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'Which trade is responsible for creating strong metal frameworks and structures using heat and specialized tools?',
  'multiple_choice',
  '[{"text":"Plumbing","is_correct":false},{"text":"Electrical work","is_correct":false},{"text":"Welding","is_correct":true},{"text":"Carpentry","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: What is a common skill needed for a successful car...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'What is a common skill needed for a successful career in most skilled trades?',
  'multiple_choice',
  '[{"text":"Knowledge of computer programming languages","is_correct":false},{"text":"Good problem-solving and critical thinking skills","is_correct":true},{"text":"Strong management skills","is_correct":false},{"text":"Public speaking abilities","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: Which skilled tradesperson works with engines, bra...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'Which skilled tradesperson works with engines, brakes, and other parts to repair cars and trucks?',
  'multiple_choice',
  '[{"text":"Carpenter","is_correct":false},{"text":"Mechanic","is_correct":true},{"text":"Plumber","is_correct":false},{"text":"Electrician","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: What type of work environment is common for constr...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'What type of work environment is common for construction workers?',
  'multiple_choice',
  '[{"text":"Office cubicles","is_correct":false},{"text":"Outdoor job sites","is_correct":true},{"text":"Laboratories","is_correct":false},{"text":"Retail stores","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: Which skilled trade often works with heating, vent...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'Which skilled trade often works with heating, ventilation, and air conditioning systems (HVAC)?',
  'multiple_choice',
  '[{"text":"Electrician","is_correct":false},{"text":"HVAC Technician","is_correct":true},{"text":"Carpenter","is_correct":false},{"text":"Welder","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: Why are skilled trade careers important to society...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_5,
  'Why are skilled trade careers important to society?',
  'multiple_choice',
  '[{"text":"They require fewer years of education","is_correct":false},{"text":"They provide essential services that keep communities running","is_correct":true},{"text":"They involve working in offices","is_correct":false},{"text":"They are easy jobs to learn","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Science Careers for Curious Minds
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_6
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Science Careers for Curious Minds',
  'Jobs for people who love science and discovering new things',
  'Science',
  'Science',
  ARRAY[6, 7, 8],
  'easy',
  ARRAY['science', 'discovery', 'research', 'middle school'],
  true,
  true,
  10
) RETURNING id INTO set_6;

-- Question 1: Which of the following careers involves studying t...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'Which of the following careers involves studying the stars, planets, and other objects in space?',
  'multiple_choice',
  '[{"text":"Astronomer","is_correct":true},{"text":"Marine Biologist","is_correct":false},{"text":"Geologist","is_correct":false},{"text":"Meteorologist","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What is the main responsibility of a forensic scie...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'What is the main responsibility of a forensic scientist?',
  'multiple_choice',
  '[{"text":"Analyzing evidence from crime scenes","is_correct":true},{"text":"Designing medical equipment","is_correct":false},{"text":"Studying the ocean environment","is_correct":false},{"text":"Exploring distant planets","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: What degree is typically required to become a doct...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'What degree is typically required to become a doctor?',
  'multiple_choice',
  '[{"text":"Medical Degree (MD)","is_correct":true},{"text":"Bachelor's Degree in Fine Arts","is_correct":false},{"text":"Engineering Degree","is_correct":false},{"text":"Law Degree","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: Which skill is most important for a scientist work...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'Which skill is most important for a scientist working in a laboratory?',
  'multiple_choice',
  '[{"text":"Attention to detail","is_correct":true},{"text":"Public speaking","is_correct":false},{"text":"Artistic ability","is_correct":false},{"text":"Knowledge of foreign languages","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: What type of scientist studies the Earth's structu...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'What type of scientist studies the Earth''s structure and minerals?',
  'multiple_choice',
  '[{"text":"Geologist","is_correct":true},{"text":"Astronomer","is_correct":false},{"text":"Biologist","is_correct":false},{"text":"Pharmacist","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: Which science career focuses on creating new medic...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'Which science career focuses on creating new medicines to treat diseases?',
  'multiple_choice',
  '[{"text":"Pharmacologist","is_correct":true},{"text":"Zoologist","is_correct":false},{"text":"Botanist","is_correct":false},{"text":"Meteorologist","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: What is the primary work environment for a marine ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'What is the primary work environment for a marine biologist?',
  'multiple_choice',
  '[{"text":"Oceans and coastal areas","is_correct":true},{"text":"Hospitals","is_correct":false},{"text":"Space stations","is_correct":false},{"text":"Deserts","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: A meteorologist is a scientist who studies which o...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'A meteorologist is a scientist who studies which of the following?',
  'multiple_choice',
  '[{"text":"Weather and climate","is_correct":true},{"text":"Rocks and minerals","is_correct":false},{"text":"Human anatomy","is_correct":false},{"text":"Animal behavior","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: Which of the following is an example of a job in e...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'Which of the following is an example of a job in environmental science?',
  'multiple_choice',
  '[{"text":"Ecologist","is_correct":true},{"text":"Astronaut","is_correct":false},{"text":"Software Engineer","is_correct":false},{"text":"Chef","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: Which of these skills would be most useful for a d...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_6,
  'Which of these skills would be most useful for a data scientist?',
  'multiple_choice',
  '[{"text":"Mathematics and computer programming","is_correct":true},{"text":"Carpentry","is_correct":false},{"text":"Painting","is_correct":false},{"text":"Singing","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Business & Money Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_7
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Business & Money Careers',
  'Learn about jobs in stores, banks, and businesses',
  'Business',
  'Business',
  ARRAY[6, 7, 8],
  'easy',
  ARRAY['business', 'money', 'entrepreneur', 'middle school'],
  true,
  true,
  10
) RETURNING id INTO set_7;

-- Question 1: Which of the following is a common responsibility ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'Which of the following is a common responsibility of a Marketing Manager?',
  'multiple_choice',
  '[{"text":"Creating advertisements for products and services","is_correct":true},{"text":"Repairing office equipment","is_correct":false},{"text":"Managing company finances","is_correct":false},{"text":"Serving food to customers","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What is the main role of an Accountant?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'What is the main role of an Accountant?',
  'multiple_choice',
  '[{"text":"Keeping track of a company's financial records","is_correct":true},{"text":"Designing websites for businesses","is_correct":false},{"text":"Selling products directly to customers","is_correct":false},{"text":"Managing employee schedules","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: Which skill is most important for someone working ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'Which skill is most important for someone working in Customer Service?',
  'multiple_choice',
  '[{"text":"Communication skills","is_correct":true},{"text":"Coding skills","is_correct":false},{"text":"Physical strength","is_correct":false},{"text":"Artistic talent","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: Which of the following careers involves analyzing ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'Which of the following careers involves analyzing data to help businesses make decisions?',
  'multiple_choice',
  '[{"text":"Business Analyst","is_correct":true},{"text":"Fashion Designer","is_correct":false},{"text":"Chef","is_correct":false},{"text":"Pilot","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: What is one common work environment for someone in...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'What is one common work environment for someone in Sales?',
  'multiple_choice',
  '[{"text":"Retail stores or offices","is_correct":true},{"text":"Hospitals","is_correct":false},{"text":"Construction sites","is_correct":false},{"text":"Airports","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: What level of education is typically required to b...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'What level of education is typically required to become a Human Resources Manager?',
  'multiple_choice',
  '[{"text":"Bachelor's degree","is_correct":true},{"text":"High school diploma","is_correct":false},{"text":"Doctorate degree","is_correct":false},{"text":"No formal education","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: Which characteristic is important for an Entrepren...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'Which characteristic is important for an Entrepreneur?',
  'multiple_choice',
  '[{"text":"Creativity and problem-solving","is_correct":true},{"text":"Ability to perform surgery","is_correct":false},{"text":"Knowledge of farming techniques","is_correct":false},{"text":"Expertise in astronomy","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: What is the main focus of someone working in Finan...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'What is the main focus of someone working in Finance?',
  'multiple_choice',
  '[{"text":"Managing money and investments","is_correct":true},{"text":"Cooking meals for customers","is_correct":false},{"text":"Creating art for advertisements","is_correct":false},{"text":"Building houses","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: Which business career involves buying and selling ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'Which business career involves buying and selling goods between companies?',
  'multiple_choice',
  '[{"text":"Supply Chain Manager","is_correct":true},{"text":"Veterinarian","is_correct":false},{"text":"Musician","is_correct":false},{"text":"Teacher","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: Which skill is helpful for a person working as a P...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_7,
  'Which skill is helpful for a person working as a Project Manager?',
  'multiple_choice',
  '[{"text":"Leadership and organization","is_correct":true},{"text":"Playing musical instruments","is_correct":false},{"text":"Studying animal behavior","is_correct":false},{"text":"Designing clothes","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Working with Animals & Nature
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_8
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Working with Animals & Nature',
  'Careers for people who love animals and the environment',
  'Environmental Science',
  'Agriculture',
  ARRAY[6, 7, 8],
  'easy',
  ARRAY['animals', 'nature', 'environment', 'middle school'],
  true,
  true,
  10
) RETURNING id INTO set_8;

-- Question 1: Which of the following is a job you can have with ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'Which of the following is a job you can have with a career in Environmental Science?',
  'multiple_choice',
  '[{"text":"Environmental Consultant","is_correct":true},{"text":"Video Game Developer","is_correct":false},{"text":"Chef","is_correct":false},{"text":"Fashion Designer","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What skill is MOST important for an Environmental ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'What skill is MOST important for an Environmental Scientist?',
  'multiple_choice',
  '[{"text":"Understanding ecosystems and data analysis","is_correct":true},{"text":"Cooking gourmet dishes","is_correct":false},{"text":"Designing clothing trends","is_correct":false},{"text":"Performing on stage","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: Where might an Environmental Scientist work?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'Where might an Environmental Scientist work?',
  'multiple_choice',
  '[{"text":"In a laboratory or outdoors in nature","is_correct":true},{"text":"In a fashion studio","is_correct":false},{"text":"On a movie set","is_correct":false},{"text":"In a restaurant kitchen","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: What level of education is typically required for ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'What level of education is typically required for most Environmental Science careers?',
  'multiple_choice',
  '[{"text":"A bachelor's degree in Environmental Science or related fields","is_correct":true},{"text":"A high school diploma","is_correct":false},{"text":"No education required","is_correct":false},{"text":"A degree in fashion design","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: Which of the following tasks might an Environmenta...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'Which of the following tasks might an Environmental Engineer perform?',
  'multiple_choice',
  '[{"text":"Design systems to clean water and reduce pollution","is_correct":true},{"text":"Paint murals for public buildings","is_correct":false},{"text":"Manage a restaurant kitchen","is_correct":false},{"text":"Plan celebrity events","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: What industries might employ Environmental Scienti...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'What industries might employ Environmental Scientists?',
  'multiple_choice',
  '[{"text":"Energy, agriculture, and waste management","is_correct":true},{"text":"Movie production and acting","is_correct":false},{"text":"Fashion and clothing design","is_correct":false},{"text":"Cosmetics and hairstyles","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: What is the role of a Conservation Scientist?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'What is the role of a Conservation Scientist?',
  'multiple_choice',
  '[{"text":"To manage natural resources like forests and protect wildlife","is_correct":true},{"text":"To write books about science fiction","is_correct":false},{"text":"To design roller coasters","is_correct":false},{"text":"To direct TV shows","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: Which of these is an important responsibility of a...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'Which of these is an important responsibility of a Climate Change Analyst?',
  'multiple_choice',
  '[{"text":"Studying data to understand global warming trends","is_correct":true},{"text":"Cooking meals for nature enthusiasts","is_correct":false},{"text":"Directing fashion shows","is_correct":false},{"text":"Writing movie scripts","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: Which skill is helpful for careers in Environmenta...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'Which skill is helpful for careers in Environmental Science?',
  'multiple_choice',
  '[{"text":"Critical thinking and problem-solving","is_correct":true},{"text":"Acting and performing","is_correct":false},{"text":"Mixing music tracks","is_correct":false},{"text":"Painting landscapes","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: What does a Wildlife Biologist study?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_8,
  'What does a Wildlife Biologist study?',
  'multiple_choice',
  '[{"text":"Animal behavior and their natural habitats","is_correct":true},{"text":"The design of skyscrapers","is_correct":false},{"text":"How to cook desserts","is_correct":false},{"text":"The history of ancient civilizations","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Healthcare Careers Fundamentals
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_9
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Healthcare Careers Fundamentals',
  'Essential knowledge about careers in healthcare and medicine',
  'Healthcare',
  'Healthcare',
  ARRAY[9, 10, 11, 12],
  'medium',
  ARRAY['healthcare', 'medicine', 'nursing', 'medical'],
  true,
  true,
  10
) RETURNING id INTO set_9;

-- Question 1: Which healthcare career typically involves diagnos...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'Which healthcare career typically involves diagnosing illnesses, prescribing treatments, and performing surgeries?',
  'multiple_choice',
  '[{"text":"Physical Therapist","is_correct":false},{"text":"Nurse Practitioner","is_correct":false},{"text":"Physician/Doctor","is_correct":true},{"text":"Radiologic Technologist","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium'
);

-- Question 2: What is the minimum educational requirement to bec...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'What is the minimum educational requirement to become a registered nurse (RN) in the United States?',
  'multiple_choice',
  '[{"text":"High School Diploma","is_correct":false},{"text":"Associate's Degree in Nursing (ADN)","is_correct":true},{"text":"Bachelor's Degree in Medicine","is_correct":false},{"text":"Master's Degree in Healthcare Administration","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium'
);

-- Question 3: Which healthcare career specializes in helping pat...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'Which healthcare career specializes in helping patients improve their ability to perform daily activities after illness or injury?',
  'multiple_choice',
  '[{"text":"Pharmacist","is_correct":false},{"text":"Occupational Therapist","is_correct":true},{"text":"Dentist","is_correct":false},{"text":"Medical Laboratory Technician","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium'
);

-- Question 4: What skill is essential for healthcare professiona...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'What skill is essential for healthcare professionals to communicate effectively with patients, families, and colleagues?',
  'multiple_choice',
  '[{"text":"Programming skills","is_correct":false},{"text":"Critical thinking","is_correct":false},{"text":"Communication skills","is_correct":true},{"text":"Time management","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium'
);

-- Question 5: Which healthcare career focuses on using X-rays, M...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'Which healthcare career focuses on using X-rays, MRI machines, and other imaging tools to diagnose illnesses?',
  'multiple_choice',
  '[{"text":"Radiologic Technologist","is_correct":true},{"text":"Phlebotomist","is_correct":false},{"text":"Physician Assistant","is_correct":false},{"text":"Physical Therapist","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium'
);

-- Question 6: To become a pharmacist, which degree is required b...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'To become a pharmacist, which degree is required before obtaining licensure?',
  'multiple_choice',
  '[{"text":"Bachelor's Degree in Chemistry","is_correct":false},{"text":"Doctor of Pharmacy (Pharm.D.)","is_correct":true},{"text":"Master's Degree in Biology","is_correct":false},{"text":"Associate's Degree in Healthcare","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium'
);

-- Question 7: Which healthcare career involves creating personal...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'Which healthcare career involves creating personalized meal plans and educating patients about proper nutrition?',
  'multiple_choice',
  '[{"text":"Medical Assistant","is_correct":false},{"text":"Dietitian/Nutritionist","is_correct":true},{"text":"Occupational Therapist","is_correct":false},{"text":"Pharmacist","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium'
);

-- Question 8: What type of work environment is common for emerge...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'What type of work environment is common for emergency medical technicians (EMTs)?',
  'multiple_choice',
  '[{"text":"Pharmacy","is_correct":false},{"text":"Hospital laboratories","is_correct":false},{"text":"Ambulances and emergency scenes","is_correct":true},{"text":"Physical therapy clinics","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium'
);

-- Question 9: Which healthcare profession focuses on analyzing b...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'Which healthcare profession focuses on analyzing blood samples and other bodily fluids to help diagnose diseases?',
  'multiple_choice',
  '[{"text":"Medical Laboratory Technician","is_correct":true},{"text":"Radiologic Technologist","is_correct":false},{"text":"Occupational Therapist","is_correct":false},{"text":"Pharmacist","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium'
);

-- Question 10: What is a primary responsibility of a physical the...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_9,
  'What is a primary responsibility of a physical therapist?',
  'multiple_choice',
  '[{"text":"Administering medications","is_correct":false},{"text":"Helping patients regain mobility and manage pain","is_correct":true},{"text":"Performing diagnostic imaging","is_correct":false},{"text":"Creating nutrition plans","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium'
);


-- Question Set: Technology & Engineering Basics
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_10
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Technology & Engineering Basics',
  'Introduction to careers in technology, software, and engineering',
  'Technology',
  'Technology',
  ARRAY[9, 10, 11, 12],
  'medium',
  ARRAY['technology', 'engineering', 'software', 'computer science'],
  true,
  true,
  10
) RETURNING id INTO set_10;

-- Question 1: Which of the following is a primary responsibility...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'Which of the following is a primary responsibility of a software developer?',
  'multiple_choice',
  '[{"text":"Managing a team of sales associates","is_correct":false},{"text":"Writing and testing code for applications or systems","is_correct":true},{"text":"Overseeing construction projects","is_correct":false},{"text":"Monitoring patient health in hospitals","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium'
);

-- Question 2: What level of education is typically required to b...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'What level of education is typically required to become a cybersecurity analyst?',
  'multiple_choice',
  '[{"text":"High school diploma","is_correct":false},{"text":"Associate's degree","is_correct":false},{"text":"Bachelor's degree in cybersecurity or related field","is_correct":true},{"text":"Doctorate degree","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium'
);

-- Question 3: Which of these skills is most important for a data...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'Which of these skills is most important for a data analyst?',
  'multiple_choice',
  '[{"text":"Graphic design","is_correct":false},{"text":"Understanding data visualization tools","is_correct":true},{"text":"Managing social media accounts","is_correct":false},{"text":"Operating heavy machinery","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium'
);

-- Question 4: In the field of artificial intelligence (AI), what...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'In the field of artificial intelligence (AI), what is a machine learning engineer most likely to do?',
  'multiple_choice',
  '[{"text":"Design and build AI models to solve specific problems","is_correct":true},{"text":"Install and repair computer hardware","is_correct":false},{"text":"Maintain corporate social media accounts","is_correct":false},{"text":"Write marketing content for technology companies","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium'
);

-- Question 5: Which industry employs the highest number of cloud...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'Which industry employs the highest number of cloud computing specialists?',
  'multiple_choice',
  '[{"text":"Healthcare","is_correct":false},{"text":"Retail","is_correct":false},{"text":"Information technology","is_correct":true},{"text":"Manufacturing","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium'
);

-- Question 6: What is the main role of a UX (User Experience) de...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'What is the main role of a UX (User Experience) designer?',
  'multiple_choice',
  '[{"text":"Developing software using programming languages","is_correct":false},{"text":"Creating designs that improve user interaction with websites or apps","is_correct":true},{"text":"Installing hardware in offices","is_correct":false},{"text":"Conducting cybersecurity audits","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium'
);

-- Question 7: Which programming language is often used in web de...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'Which programming language is often used in web development?',
  'multiple_choice',
  '[{"text":"Python","is_correct":false},{"text":"JavaScript","is_correct":true},{"text":"C#","is_correct":false},{"text":"Swift","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium'
);

-- Question 8: Which of the following skills is essential for a n...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'Which of the following skills is essential for a network administrator?',
  'multiple_choice',
  '[{"text":"Knowledge of network security protocols","is_correct":true},{"text":"Proficiency in Photoshop","is_correct":false},{"text":"Experience in public speaking","is_correct":false},{"text":"Understanding of medical terminology","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium'
);

-- Question 9: What type of work environment is common for IT sup...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'What type of work environment is common for IT support specialists?',
  'multiple_choice',
  '[{"text":"Construction sites","is_correct":false},{"text":"Office settings or remote environments","is_correct":true},{"text":"Factories with heavy machinery","is_correct":false},{"text":"Outdoor parks and recreation centers","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium'
);

-- Question 10: Which of these is a common career path for someone...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_10,
  'Which of these is a common career path for someone skilled in coding and programming?',
  'multiple_choice',
  '[{"text":"Wildlife conservationist","is_correct":false},{"text":"Software engineer","is_correct":true},{"text":"Real estate agent","is_correct":false},{"text":"Fashion designer","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium'
);


-- Question Set: Business & Finance Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_11
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Business & Finance Careers',
  'Explore careers in business, finance, and entrepreneurship',
  'Business',
  'Business',
  ARRAY[10, 11, 12],
  'medium',
  ARRAY['business', 'finance', 'accounting', 'management'],
  true,
  true,
  10
) RETURNING id INTO set_11;

-- Question 1: Which of the following is a primary responsibility...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'Which of the following is a primary responsibility of a Marketing Manager?',
  'multiple_choice',
  '[{"text":"Developing advertising campaigns","is_correct":true},{"text":"Maintaining company financial records","is_correct":false},{"text":"Supervising IT infrastructure","is_correct":false},{"text":"Managing product inventory","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium'
);

-- Question 2: What is the minimum education requirement for most...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'What is the minimum education requirement for most entry-level Accountant positions?',
  'multiple_choice',
  '[{"text":"Bachelor's degree in Accounting or Finance","is_correct":true},{"text":"High school diploma","is_correct":false},{"text":"Master's degree in Business Administration","is_correct":false},{"text":"PhD in Economics","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium'
);

-- Question 3: Which career involves analyzing market trends to h...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'Which career involves analyzing market trends to help companies make financial decisions?',
  'multiple_choice',
  '[{"text":"Financial Analyst","is_correct":true},{"text":"Human Resources Specialist","is_correct":false},{"text":"Sales Representative","is_correct":false},{"text":"Project Manager","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium'
);

-- Question 4: What skill is most essential for someone pursuing ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'What skill is most essential for someone pursuing a career in Supply Chain Management?',
  'multiple_choice',
  '[{"text":"Organizational and problem-solving skills","is_correct":true},{"text":"Graphic design skills","is_correct":false},{"text":"Medical knowledge","is_correct":false},{"text":"Artistic creativity","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium'
);

-- Question 5: Which business industry focuses on buying, selling...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'Which business industry focuses on buying, selling, and renting properties?',
  'multiple_choice',
  '[{"text":"Real Estate","is_correct":true},{"text":"Manufacturing","is_correct":false},{"text":"Retail","is_correct":false},{"text":"Hospitality","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium'
);

-- Question 6: What is the primary role of a Human Resources Spec...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'What is the primary role of a Human Resources Specialist?',
  'multiple_choice',
  '[{"text":"Recruiting and managing employee relations","is_correct":true},{"text":"Designing marketing strategies","is_correct":false},{"text":"Developing software applications","is_correct":false},{"text":"Planning financial investments","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium'
);

-- Question 7: Which career in business is focused on managing bu...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'Which career in business is focused on managing budgets, forecasting revenue, and planning for future expenses?',
  'multiple_choice',
  '[{"text":"Budget Analyst","is_correct":true},{"text":"Product Manager","is_correct":false},{"text":"Event Coordinator","is_correct":false},{"text":"Customer Service Representative","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium'
);

-- Question 8: What work environment is most common for a Financi...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'What work environment is most common for a Financial Advisor?',
  'multiple_choice',
  '[{"text":"Office setting with client meetings","is_correct":true},{"text":"Outdoor construction sites","is_correct":false},{"text":"Laboratory research facilities","is_correct":false},{"text":"Hospital emergency rooms","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium'
);

-- Question 9: Which skill is critical for success in Sales caree...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'Which skill is critical for success in Sales careers?',
  'multiple_choice',
  '[{"text":"Strong communication and negotiation skills","is_correct":true},{"text":"Programming and coding expertise","is_correct":false},{"text":"Knowledge of medical procedures","is_correct":false},{"text":"Ability to create art and illustrations","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium'
);

-- Question 10: What is typically required to advance into leaders...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_11,
  'What is typically required to advance into leadership roles in business, such as a Director or Vice President?',
  'multiple_choice',
  '[{"text":"Years of experience and often a Master's degree, such as an MBA","is_correct":true},{"text":"A certification in graphic design","is_correct":false},{"text":"A vocational training certificate","is_correct":false},{"text":"PhD in Biology","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium'
);


-- Question Set: Creative Arts & Design
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_12
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Creative Arts & Design',
  'Careers in art, design, media, and creative industries',
  'Arts',
  'Arts & Entertainment',
  ARRAY[9, 10, 11, 12],
  'easy',
  ARRAY['art', 'design', 'creative', 'media'],
  true,
  true,
  10
) RETURNING id INTO set_12;

-- Question 1: What is the primary role of a graphic designer?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'What is the primary role of a graphic designer?',
  'multiple_choice',
  '[{"text":"To create visual concepts for branding and communication","is_correct":true},{"text":"To direct live performances on stage","is_correct":false},{"text":"To teach art history in schools","is_correct":false},{"text":"To compose music for movies","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: Which of the following skills is MOST important fo...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'Which of the following skills is MOST important for a successful photographer?',
  'multiple_choice',
  '[{"text":"Understanding composition and lighting","is_correct":true},{"text":"Advanced coding skills","is_correct":false},{"text":"Mathematical problem-solving","is_correct":false},{"text":"Public speaking","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: What level of education is typically required to b...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'What level of education is typically required to become an art teacher in a high school?',
  'multiple_choice',
  '[{"text":"A bachelor's degree in art and a teaching credential","is_correct":true},{"text":"A high school diploma","is_correct":false},{"text":"A master's degree in fine arts","is_correct":false},{"text":"No formal education is required","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: Which career involves creating costumes for theate...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'Which career involves creating costumes for theater, film, or television productions?',
  'multiple_choice',
  '[{"text":"Costume designer","is_correct":true},{"text":"Set decorator","is_correct":false},{"text":"Makeup artist","is_correct":false},{"text":"Art director","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: What is a common work environment for a fine artis...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'What is a common work environment for a fine artist?',
  'multiple_choice',
  '[{"text":"A studio","is_correct":true},{"text":"A courtroom","is_correct":false},{"text":"A hospital","is_correct":false},{"text":"A laboratory","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: Which skill is essential for a career in animation...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'Which skill is essential for a career in animation?',
  'multiple_choice',
  '[{"text":"Proficiency in digital drawing and motion software","is_correct":true},{"text":"Knowledge of culinary arts","is_correct":false},{"text":"Fluency in multiple languages","is_correct":false},{"text":"Expertise in medical terminology","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: Which arts career involves planning and overseeing...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'Which arts career involves planning and overseeing the artistic elements in a movie, commercial, or video game?',
  'multiple_choice',
  '[{"text":"Art director","is_correct":true},{"text":"Screenwriter","is_correct":false},{"text":"Sound engineer","is_correct":false},{"text":"Producer","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: Which industry employs the most makeup artists?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'Which industry employs the most makeup artists?',
  'multiple_choice',
  '[{"text":"Film, TV, and theater","is_correct":true},{"text":"Automotive repair","is_correct":false},{"text":"Construction","is_correct":false},{"text":"Real estate","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: What is a key responsibility of a museum curator?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'What is a key responsibility of a museum curator?',
  'multiple_choice',
  '[{"text":"Managing art collections and organizing exhibitions","is_correct":true},{"text":"Performing musical compositions","is_correct":false},{"text":"Editing video content","is_correct":false},{"text":"Teaching acting techniques","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: Which of the following is a key skill for a succes...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_12,
  'Which of the following is a key skill for a successful writer or author?',
  'multiple_choice',
  '[{"text":"Strong storytelling and communication skills","is_correct":true},{"text":"Advanced knowledge of accounting systems","is_correct":false},{"text":"Ability to repair machinery","is_correct":false},{"text":"Skill in playing musical instruments","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Science & Research Careers
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_13
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Science & Research Careers',
  'Careers in scientific research, laboratory work, and discovery',
  'Science',
  'Science',
  ARRAY[10, 11, 12],
  'hard',
  ARRAY['science', 'research', 'laboratory', 'biology', 'chemistry'],
  true,
  true,
  10
) RETURNING id INTO set_13;

-- Question 1: Which of the following tasks is a primary responsi...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'Which of the following tasks is a primary responsibility of an environmental scientist?',
  'multiple_choice',
  '[{"text":"Designing new pharmaceuticals","is_correct":false},{"text":"Studying and addressing pollution and its effects","is_correct":true},{"text":"Conducting research on space exploration","is_correct":false},{"text":"Developing software for climate modeling","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'hard'
);

-- Question 2: What level of education is typically required to b...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'What level of education is typically required to become a microbiologist?',
  'multiple_choice',
  '[{"text":"High school diploma","is_correct":false},{"text":"Associate's degree in biology","is_correct":false},{"text":"Bachelor's degree in microbiology or related science","is_correct":true},{"text":"Doctorate in chemistry","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'hard'
);

-- Question 3: Which skill is most important for a forensic scien...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'Which skill is most important for a forensic scientist analyzing evidence in criminal cases?',
  'multiple_choice',
  '[{"text":"Programming expertise","is_correct":false},{"text":"Attention to detail","is_correct":true},{"text":"Sales and marketing experience","is_correct":false},{"text":"Knowledge of astronomy","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'hard'
);

-- Question 4: What type of work environment is most common for m...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'What type of work environment is most common for marine biologists?',
  'multiple_choice',
  '[{"text":"Corporate office setting","is_correct":false},{"text":"Laboratories and field research in aquatic environments","is_correct":true},{"text":"Factories manufacturing marine equipment","is_correct":false},{"text":"Astronomy observatories","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'hard'
);

-- Question 5: Which industry employs astronomers to study celest...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'Which industry employs astronomers to study celestial phenomena?',
  'multiple_choice',
  '[{"text":"Oil and gas industry","is_correct":false},{"text":"Education and research organizations","is_correct":true},{"text":"Medical diagnostics","is_correct":false},{"text":"Agriculture","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'hard'
);

-- Question 6: What is the primary focus of a biomedical engineer...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'What is the primary focus of a biomedical engineer’s work?',
  'multiple_choice',
  '[{"text":"Development of medical devices and technologies","is_correct":true},{"text":"Investigating environmental hazards","is_correct":false},{"text":"Studying human genetics","is_correct":false},{"text":"Analyzing fossil records","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'hard'
);

-- Question 7: Which of the following is a required skill for a d...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'Which of the following is a required skill for a data scientist working in a scientific research organization?',
  'multiple_choice',
  '[{"text":"Expertise in welding techniques","is_correct":false},{"text":"Knowledge of machine learning and statistical analysis","is_correct":true},{"text":"Skill in physical fitness training","is_correct":false},{"text":"Ability to navigate ships","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'hard'
);

-- Question 8: Which career involves studying the impact of clima...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'Which career involves studying the impact of climate change on ecosystems?',
  'multiple_choice',
  '[{"text":"Astrophysicist","is_correct":false},{"text":"Ecologist","is_correct":true},{"text":"Pharmacologist","is_correct":false},{"text":"Geophysicist","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'hard'
);

-- Question 9: What type of degree is typically required for a ca...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'What type of degree is typically required for a career in genetic counseling?',
  'multiple_choice',
  '[{"text":"Bachelor’s degree in psychology","is_correct":false},{"text":"Master’s degree in genetic counseling or a related field","is_correct":true},{"text":"Ph.D. in genetics","is_correct":false},{"text":"Diploma in healthcare management","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'hard'
);

-- Question 10: Which of the following industries commonly employs...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_13,
  'Which of the following industries commonly employs materials scientists?',
  'multiple_choice',
  '[{"text":"Cosmetics and beauty industry","is_correct":false},{"text":"Aerospace and automotive industries","is_correct":true},{"text":"Retail management","is_correct":false},{"text":"Real estate development","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'hard'
);


-- Question Set: Education & Teaching
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_14
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Education & Teaching',
  'Explore careers in education, teaching, and training',
  'Education',
  'Education',
  ARRAY[9, 10, 11, 12],
  'easy',
  ARRAY['education', 'teaching', 'training', 'school'],
  true,
  true,
  10
) RETURNING id INTO set_14;

-- Question 1: What is the primary responsibility of a classroom ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'What is the primary responsibility of a classroom teacher?',
  'multiple_choice',
  '[{"text":"Planning and delivering lessons to students","is_correct":true},{"text":"Managing the school's budget","is_correct":false},{"text":"Creating new educational policies","is_correct":false},{"text":"Supervising school maintenance staff","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: Which degree is typically required to become a hig...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'Which degree is typically required to become a high school teacher?',
  'multiple_choice',
  '[{"text":"Bachelor's degree in Education or a related subject","is_correct":true},{"text":"Doctorate in Education","is_correct":false},{"text":"Associate degree in any subject","is_correct":false},{"text":"High school diploma","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: What skill is MOST important for a school counselo...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'What skill is MOST important for a school counselor to have?',
  'multiple_choice',
  '[{"text":"Strong communication and empathy","is_correct":true},{"text":"Expertise in physical education","is_correct":false},{"text":"Advanced knowledge of algebra","is_correct":false},{"text":"Proficiency in graphic design","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: What is the primary role of a school principal?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'What is the primary role of a school principal?',
  'multiple_choice',
  '[{"text":"Overseeing the operations and academics of the entire school","is_correct":true},{"text":"Teaching a specific grade or subject","is_correct":false},{"text":"Developing lesson plans for all teachers","is_correct":false},{"text":"Coaching the school's sports teams","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: What type of work environment do most librarians w...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'What type of work environment do most librarians work in?',
  'multiple_choice',
  '[{"text":"Libraries, schools, and educational institutions","is_correct":true},{"text":"Outdoor sports fields","is_correct":false},{"text":"Construction sites","is_correct":false},{"text":"Hospital emergency rooms","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: Which education professional works with students w...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'Which education professional works with students who have learning disabilities or special needs?',
  'multiple_choice',
  '[{"text":"Special education teacher","is_correct":true},{"text":"Physical education teacher","is_correct":false},{"text":"Librarian","is_correct":false},{"text":"School administrator","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: What skill is MOST essential for an early childhoo...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'What skill is MOST essential for an early childhood educator?',
  'multiple_choice',
  '[{"text":"Patience and creativity","is_correct":true},{"text":"Expertise in advanced calculus","is_correct":false},{"text":"Experience with business management","is_correct":false},{"text":"Fluency in multiple languages","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: Which career involves designing courses and materi...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'Which career involves designing courses and materials used to train teachers or employees?',
  'multiple_choice',
  '[{"text":"Instructional designer","is_correct":true},{"text":"School counselor","is_correct":false},{"text":"Physical education teacher","is_correct":false},{"text":"Library assistant","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: What is the primary job of a tutor?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'What is the primary job of a tutor?',
  'multiple_choice',
  '[{"text":"Providing one-on-one academic assistance to students","is_correct":true},{"text":"Managing the school’s cafeteria staff","is_correct":false},{"text":"Supervising recess activities","is_correct":false},{"text":"Developing state education budgets","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: Which career in education typically requires a mas...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_14,
  'Which career in education typically requires a master’s or doctoral degree?',
  'multiple_choice',
  '[{"text":"University professor","is_correct":true},{"text":"High school teacher","is_correct":false},{"text":"Librarian","is_correct":false},{"text":"Teacher's aide","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Public Service & Law
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_15
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Public Service & Law',
  'Careers in law enforcement, legal services, and public safety',
  'Public Service',
  'Public Service',
  ARRAY[10, 11, 12],
  'medium',
  ARRAY['law', 'legal', 'public service', 'government'],
  true,
  true,
  10
) RETURNING id INTO set_15;

-- Question 1: Which of the following careers is considered a Pub...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'Which of the following careers is considered a Public Service role?',
  'multiple_choice',
  '[{"text":"Firefighter","is_correct":true},{"text":"Software Developer","is_correct":false},{"text":"Fashion Designer","is_correct":false},{"text":"Mechanical Engineer","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium'
);

-- Question 2: What is one primary responsibility of a social wor...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'What is one primary responsibility of a social worker in public service?',
  'multiple_choice',
  '[{"text":"Helping individuals access community resources","is_correct":true},{"text":"Managing corporate finances","is_correct":false},{"text":"Designing marketing campaigns","is_correct":false},{"text":"Developing computer software","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium'
);

-- Question 3: Which skill is essential for a career in law enfor...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'Which skill is essential for a career in law enforcement?',
  'multiple_choice',
  '[{"text":"Strong interpersonal communication","is_correct":true},{"text":"Proficiency in graphic design software","is_correct":false},{"text":"Knowledge of accounting principles","is_correct":false},{"text":"Expertise in machine learning","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium'
);

-- Question 4: Which career in public service typically requires ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'Which career in public service typically requires a law degree?',
  'multiple_choice',
  '[{"text":"Prosecutor","is_correct":true},{"text":"Paramedic","is_correct":false},{"text":"Park Ranger","is_correct":false},{"text":"Urban Planner","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium'
);

-- Question 5: What type of work environment would a city planner...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'What type of work environment would a city planner most likely work in?',
  'multiple_choice',
  '[{"text":"An office setting, with occasional field visits","is_correct":true},{"text":"A hospital emergency room","is_correct":false},{"text":"A courtroom","is_correct":false},{"text":"A fire station","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium'
);

-- Question 6: Which of these careers in public service involves ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'Which of these careers in public service involves educating the public about health and wellness?',
  'multiple_choice',
  '[{"text":"Public Health Educator","is_correct":true},{"text":"Police Officer","is_correct":false},{"text":"Civil Engineer","is_correct":false},{"text":"Attorney","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium'
);

-- Question 7: Which degree is commonly required for a career as ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'Which degree is commonly required for a career as a public school teacher?',
  'multiple_choice',
  '[{"text":"Bachelor's degree in Education","is_correct":true},{"text":"Associate's degree in Health Sciences","is_correct":false},{"text":"Master's degree in Business Administration","is_correct":false},{"text":"Doctorate in Engineering","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium'
);

-- Question 8: What is one key responsibility of an emergency med...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'What is one key responsibility of an emergency medical technician (EMT)?',
  'multiple_choice',
  '[{"text":"Providing immediate medical care to patients in emergencies","is_correct":true},{"text":"Creating government policies","is_correct":false},{"text":"Developing city infrastructure plans","is_correct":false},{"text":"Handling legal disputes in court","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium'
);

-- Question 9: Which career in Public Service focuses on protecti...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'Which career in Public Service focuses on protecting and preserving natural resources?',
  'multiple_choice',
  '[{"text":"Park Ranger","is_correct":true},{"text":"Police Officer","is_correct":false},{"text":"Fire Marshal","is_correct":false},{"text":"Paramedic","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium'
);

-- Question 10: What skill is especially important for someone pur...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_15,
  'What skill is especially important for someone pursuing a career as a public administrator?',
  'multiple_choice',
  '[{"text":"Leadership and organizational management","is_correct":true},{"text":"Advanced coding expertise","is_correct":false},{"text":"Artistic creativity","is_correct":false},{"text":"Knowledge of physics principles","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium'
);


-- Question Set: Environmental & Agriculture
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_16
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Environmental & Agriculture',
  'Careers in environmental science, conservation, and agriculture',
  'Environmental Science',
  'Agriculture',
  ARRAY[9, 10, 11, 12],
  'medium',
  ARRAY['environment', 'conservation', 'agriculture', 'sustainability'],
  true,
  true,
  10
) RETURNING id INTO set_16;

-- Question 1: Which of the following is a primary responsibility...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'Which of the following is a primary responsibility of an Environmental Scientist?',
  'multiple_choice',
  '[{"text":"Developing marketing campaigns for green products","is_correct":false},{"text":"Studying air, water, and soil quality to assess environmental health","is_correct":true},{"text":"Designing buildings for energy efficiency","is_correct":false},{"text":"Managing finances for renewable energy companies","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium'
);

-- Question 2: Which degree is most commonly required for careers...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'Which degree is most commonly required for careers in Environmental Science?',
  'multiple_choice',
  '[{"text":"Bachelor's in Environmental Science or a related field","is_correct":true},{"text":"Bachelor's in Business Administration","is_correct":false},{"text":"Bachelor's in Communications","is_correct":false},{"text":"Bachelor's in Mechanical Engineering","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium'
);

-- Question 3: What type of work environment is most common for a...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'What type of work environment is most common for an Environmental Science Technician?',
  'multiple_choice',
  '[{"text":"Office setting only","is_correct":false},{"text":"Outdoor fieldwork and laboratory settings","is_correct":true},{"text":"Retail stores","is_correct":false},{"text":"Factories and warehouses","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium'
);

-- Question 4: Which skill is essential for careers in Environmen...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'Which skill is essential for careers in Environmental Science?',
  'multiple_choice',
  '[{"text":"Graphic design and video editing","is_correct":false},{"text":"Data analysis and critical thinking","is_correct":true},{"text":"Sales and customer service","is_correct":false},{"text":"Cooking and food preparation","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium'
);

-- Question 5: Which of the following careers involves studying e...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'Which of the following careers involves studying ecosystems and biodiversity?',
  'multiple_choice',
  '[{"text":"Environmental Lawyer","is_correct":false},{"text":"Ecologist","is_correct":true},{"text":"Sustainability Consultant","is_correct":false},{"text":"Solar Panel Technician","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium'
);

-- Question 6: What does an Environmental Engineer primarily focu...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'What does an Environmental Engineer primarily focus on?',
  'multiple_choice',
  '[{"text":"Designing and implementing solutions to environmental challenges","is_correct":true},{"text":"Selling eco-friendly products","is_correct":false},{"text":"Managing environmental policies for corporations","is_correct":false},{"text":"Providing legal advice on environmental laws","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium'
);

-- Question 7: Which career in Environmental Science focuses on e...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'Which career in Environmental Science focuses on enforcing laws to protect natural resources?',
  'multiple_choice',
  '[{"text":"Environmental Policy Analyst","is_correct":false},{"text":"Environmental Lawyer","is_correct":true},{"text":"Wildlife Biologist","is_correct":false},{"text":"Environmental Educator","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium'
);

-- Question 8: Which of the following industries employs Environm...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'Which of the following industries employs Environmental Scientists to assess environmental impact?',
  'multiple_choice',
  '[{"text":"Oil and gas","is_correct":true},{"text":"Fashion design","is_correct":false},{"text":"Video game development","is_correct":false},{"text":"Banking and finance","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium'
);

-- Question 9: What is a Sustainability Consultant's main role?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'What is a Sustainability Consultant''s main role?',
  'multiple_choice',
  '[{"text":"Helping organizations minimize their environmental impact","is_correct":true},{"text":"Teaching environmental science in schools","is_correct":false},{"text":"Conducting wildlife surveys","is_correct":false},{"text":"Installing solar panels","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium'
);

-- Question 10: Which of the following tasks would a Wildlife Biol...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_16,
  'Which of the following tasks would a Wildlife Biologist most likely perform?',
  'multiple_choice',
  '[{"text":"Developing renewable energy solutions","is_correct":false},{"text":"Monitoring animal populations and habitats","is_correct":true},{"text":"Analyzing water quality","is_correct":false},{"text":"Creating environmental legislation","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium'
);


-- Question Set: Skilled Trades & Construction
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_17
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Skilled Trades & Construction',
  'Careers in construction, electrical work, plumbing, and skilled trades',
  'Skilled Trades',
  'Construction',
  ARRAY[9, 10, 11, 12],
  'easy',
  ARRAY['trades', 'construction', 'electrician', 'plumber'],
  true,
  true,
  10
) RETURNING id INTO set_17;

-- Question 1: Which of the following is an example of a skilled ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'Which of the following is an example of a skilled trade career?',
  'multiple_choice',
  '[{"text":"Electrician","is_correct":true},{"text":"Software Developer","is_correct":false},{"text":"Doctor","is_correct":false},{"text":"Accountant","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What is a key responsibility of a plumber?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'What is a key responsibility of a plumber?',
  'multiple_choice',
  '[{"text":"Installing and repairing pipes and water systems","is_correct":true},{"text":"Designing blueprints for buildings","is_correct":false},{"text":"Testing electrical systems","is_correct":false},{"text":"Painting and decorating homes","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: Which skilled trade involves working with metal to...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'Which skilled trade involves working with metal to create tools, parts, or structures?',
  'multiple_choice',
  '[{"text":"Welder","is_correct":true},{"text":"Carpenter","is_correct":false},{"text":"Plumber","is_correct":false},{"text":"Electrician","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: What type of education is typically required to st...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'What type of education is typically required to start a career in most skilled trades?',
  'multiple_choice',
  '[{"text":"Apprenticeship or trade school training","is_correct":true},{"text":"Master’s degree","is_correct":false},{"text":"Doctorate degree","is_correct":false},{"text":"Self-learning only","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: What is the primary work environment for a carpent...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'What is the primary work environment for a carpenter?',
  'multiple_choice',
  '[{"text":"Construction sites and workshops","is_correct":true},{"text":"Office buildings","is_correct":false},{"text":"Hospitals","is_correct":false},{"text":"Retail stores","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: Which skill is most important for an automotive te...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'Which skill is most important for an automotive technician?',
  'multiple_choice',
  '[{"text":"Problem-solving skills","is_correct":true},{"text":"Advanced math skills","is_correct":false},{"text":"Cooking skills","is_correct":false},{"text":"Public speaking skills","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: Which skilled trade professional is responsible fo...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'Which skilled trade professional is responsible for building and repairing wooden structures?',
  'multiple_choice',
  '[{"text":"Carpenter","is_correct":true},{"text":"Plumber","is_correct":false},{"text":"Welder","is_correct":false},{"text":"Electrician","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: What industry do HVAC technicians work in?...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'What industry do HVAC technicians work in?',
  'multiple_choice',
  '[{"text":"Heating, ventilation, and air conditioning","is_correct":true},{"text":"Construction","is_correct":false},{"text":"Automotive repair","is_correct":false},{"text":"Technology","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: Which of the following tools is commonly used by e...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'Which of the following tools is commonly used by electricians?',
  'multiple_choice',
  '[{"text":"Voltage tester","is_correct":true},{"text":"Welding torch","is_correct":false},{"text":"Paint roller","is_correct":false},{"text":"Hammer","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: What is one advantage of pursuing a career in the ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_17,
  'What is one advantage of pursuing a career in the skilled trades?',
  'multiple_choice',
  '[{"text":"High demand for skilled workers","is_correct":true},{"text":"No physical work involved","is_correct":false},{"text":"Requires no training","is_correct":false},{"text":"Limited job opportunities","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);


-- Question Set: Hospitality & Service Industry
INSERT INTO question_sets (
  id, creator_id, title, description, subject, career_sector,
  grade_level, difficulty_level, tags, is_public, is_verified, total_questions
) VALUES (
  gen_random_uuid(), -- set_18
  '0ae5001d-41f0-4969-86a9-96d8dc478a28', -- Replace with actual teacher ID
  'Hospitality & Service Industry',
  'Careers in hospitality, food service, tourism, and customer service',
  'Hospitality',
  'Hospitality',
  ARRAY[9, 10, 11, 12],
  'easy',
  ARRAY['hospitality', 'service', 'tourism', 'culinary'],
  true,
  true,
  10
) RETURNING id INTO set_18;

-- Question 1: Which of the following is a common job responsibil...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'Which of the following is a common job responsibility of a hotel front desk clerk?',
  'multiple_choice',
  '[{"text":"Checking guests in and out of their rooms","is_correct":true},{"text":"Preparing meals in the kitchen","is_correct":false},{"text":"Planning group travel itineraries","is_correct":false},{"text":"Organizing wedding receptions","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'easy'
);

-- Question 2: What is the primary role of a concierge in the hos...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'What is the primary role of a concierge in the hospitality industry?',
  'multiple_choice',
  '[{"text":"Assisting guests with booking services and activities","is_correct":true},{"text":"Cleaning and maintaining guest rooms","is_correct":false},{"text":"Managing payroll and staffing schedules","is_correct":false},{"text":"Overseeing kitchen operations","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'easy'
);

-- Question 3: What type of education is typically required to be...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'What type of education is typically required to become a certified chef in the hospitality industry?',
  'multiple_choice',
  '[{"text":"Culinary school or related training program","is_correct":true},{"text":"A degree in mechanical engineering","is_correct":false},{"text":"A high school diploma with no further training","is_correct":false},{"text":"A certification in IT or programming","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy'
);

-- Question 4: Which skill is MOST important for someone working ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'Which skill is MOST important for someone working as an event planner in hospitality?',
  'multiple_choice',
  '[{"text":"Strong organizational and communication skills","is_correct":true},{"text":"Ability to repair electrical equipment","is_correct":false},{"text":"Advanced knowledge of computer coding","is_correct":false},{"text":"Extensive physical strength","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'easy'
);

-- Question 5: Which of the following careers is NOT typically co...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'Which of the following careers is NOT typically considered part of the hospitality industry?',
  'multiple_choice',
  '[{"text":"Software Developer","is_correct":true},{"text":"Hotel Manager","is_correct":false},{"text":"Travel Agent","is_correct":false},{"text":"Catering Coordinator","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'easy'
);

-- Question 6: What is one of the primary responsibilities of a r...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'What is one of the primary responsibilities of a restaurant manager?',
  'multiple_choice',
  '[{"text":"Overseeing staff and ensuring customer satisfaction","is_correct":true},{"text":"Designing hotel blueprints","is_correct":false},{"text":"Driving customers to their destination","is_correct":false},{"text":"Installing kitchen appliances","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'easy'
);

-- Question 7: What work environment is most typical for a travel...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'What work environment is most typical for a travel agent?',
  'multiple_choice',
  '[{"text":"An office or online setting","is_correct":true},{"text":"A hospital or clinic","is_correct":false},{"text":"A construction site","is_correct":false},{"text":"A manufacturing factory","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'easy'
);

-- Question 8: Which of the following is an example of a career i...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'Which of the following is an example of a career in the hospitality industry?',
  'multiple_choice',
  '[{"text":"Resort Activities Director","is_correct":true},{"text":"Civil Engineer","is_correct":false},{"text":"Pharmacist","is_correct":false},{"text":"Graphic Designer","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy'
);

-- Question 9: What is an important skill for someone working in ...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'What is an important skill for someone working in customer service in hospitality?',
  'multiple_choice',
  '[{"text":"Patience and a positive attitude with guests","is_correct":true},{"text":"Advanced knowledge of accounting principles","is_correct":false},{"text":"Proficiency in medical terminology","is_correct":false},{"text":"Expertise in coding and software development","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'easy'
);

-- Question 10: Which hospitality career involves assisting guests...
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty
) VALUES (
  set_18,
  'Which hospitality career involves assisting guests with bookings, transportation, and entertainment recommendations?',
  'multiple_choice',
  '[{"text":"Concierge","is_correct":true},{"text":"Chef","is_correct":false},{"text":"Room Attendant","is_correct":false},{"text":"Security Guard","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'easy'
);

