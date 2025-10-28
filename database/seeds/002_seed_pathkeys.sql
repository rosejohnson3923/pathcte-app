-- Seed Data: Pathkeys
-- Description: Sample pathkey collectibles for testing the game system

-- Clean existing data (for re-seeding)
DELETE FROM public.pathkeys WHERE key_code IN (
  'DEV-001', 'NURSE-001', 'MARKET-001', 'PR-001',
  'CIVIL-001', 'TEACH-001', 'PHYS-001', 'ADMIN-001',
  'SKILL-CODE', 'SKILL-PROB', 'SKILL-COMM', 'SKILL-LEAD',
  'IND-TECH', 'IND-HEALTH', 'IND-BIZ', 'MILE-FIRST'
);

-- Get career IDs for linking
DO $$
DECLARE
  dev_career_id UUID;
  nurse_career_id UUID;
  market_career_id UUID;
  pr_career_id UUID;
  civil_career_id UUID;
  teach_career_id UUID;
  phys_career_id UUID;
  admin_career_id UUID;
BEGIN
  -- Get career IDs
  SELECT id INTO dev_career_id FROM public.careers WHERE onet_code = '15-1252.00';
  SELECT id INTO nurse_career_id FROM public.careers WHERE onet_code = '29-1141.00';
  SELECT id INTO market_career_id FROM public.careers WHERE onet_code = '11-2021.00';
  SELECT id INTO pr_career_id FROM public.careers WHERE onet_code = '27-3031.00';
  SELECT id INTO civil_career_id FROM public.careers WHERE onet_code = '17-2051.00';
  SELECT id INTO teach_career_id FROM public.careers WHERE onet_code = '25-2021.00';
  SELECT id INTO phys_career_id FROM public.careers WHERE onet_code = '19-2012.00';
  SELECT id INTO admin_career_id FROM public.careers WHERE onet_code = '43-6014.00';

  -- Insert Career Pathkeys
  INSERT INTO public.pathkeys (
    key_code,
    name,
    description,
    rarity,
    key_type,
    career_id,
    image_url,
    color_primary,
    color_secondary,
    is_active,
    release_date,
    metadata
  ) VALUES
  (
    'DEV-001',
    'Code Master',
    'Unlocked by mastering software development fundamentals',
    'epic',
    'career',
    dev_career_id,
    'https://placehold.co/400x400/6366f1/ffffff?text=💻',
    '#6366f1',
    '#818cf8',
    true,
    CURRENT_DATE,
    '{"flavor_text": "The first step into the world of programming"}'::jsonb
  ),
  (
    'NURSE-001',
    'Caring Heart',
    'Awarded to those who show dedication to healthcare',
    'rare',
    'career',
    nurse_career_id,
    'https://placehold.co/400x400/ef4444/ffffff?text=❤️',
    '#ef4444',
    '#f87171',
    true,
    CURRENT_DATE,
    '{"flavor_text": "Compassion meets expertise"}'::jsonb
  ),
  (
    'MARKET-001',
    'Brand Builder',
    'For strategic minds in marketing',
    'uncommon',
    'career',
    market_career_id,
    'https://placehold.co/400x400/f59e0b/ffffff?text=📊',
    '#f59e0b',
    '#fbbf24',
    true,
    CURRENT_DATE,
    '{"flavor_text": "Create campaigns that resonate"}'::jsonb
  ),
  (
    'PR-001',
    'Voice of Change',
    'Master of public perception',
    'uncommon',
    'career',
    pr_career_id,
    'https://placehold.co/400x400/8b5cf6/ffffff?text=📢',
    '#8b5cf6',
    '#a78bfa',
    true,
    CURRENT_DATE,
    '{"flavor_text": "Shape the narrative"}'::jsonb
  ),
  (
    'CIVIL-001',
    'Foundation Layer',
    'Build the infrastructure of tomorrow',
    'rare',
    'career',
    civil_career_id,
    'https://placehold.co/400x400/06b6d4/ffffff?text=🏗️',
    '#06b6d4',
    '#22d3ee',
    true,
    CURRENT_DATE,
    '{"flavor_text": "Engineer the future"}'::jsonb
  ),
  (
    'TEACH-001',
    'Knowledge Keeper',
    'Inspire the next generation',
    'uncommon',
    'career',
    teach_career_id,
    'https://placehold.co/400x400/10b981/ffffff?text=📚',
    '#10b981',
    '#34d399',
    true,
    CURRENT_DATE,
    '{"flavor_text": "Every student is a new adventure"}'::jsonb
  ),
  (
    'PHYS-001',
    'Reality Bender',
    'Unlock the secrets of the universe',
    'legendary',
    'career',
    phys_career_id,
    'https://placehold.co/400x400/ec4899/ffffff?text=⚛️',
    '#ec4899',
    '#f472b6',
    true,
    CURRENT_DATE,
    '{"flavor_text": "Where science meets wonder"}'::jsonb
  ),
  (
    'ADMIN-001',
    'Office Ace',
    'Keep everything running smoothly',
    'common',
    'career',
    admin_career_id,
    'https://placehold.co/400x400/64748b/ffffff?text=📋',
    '#64748b',
    '#94a3b8',
    true,
    CURRENT_DATE,
    '{"flavor_text": "The backbone of every organization"}'::jsonb
  );

  -- Insert Skill Pathkeys (not tied to specific careers)
  INSERT INTO public.pathkeys (
    key_code,
    name,
    description,
    rarity,
    key_type,
    career_id,
    image_url,
    color_primary,
    color_secondary,
    is_active,
    release_date,
    metadata
  ) VALUES
  (
    'SKILL-CODE',
    'First Lines',
    'Wrote your first lines of code',
    'common',
    'skill',
    NULL,
    'https://placehold.co/400x400/3b82f6/ffffff?text=</>',
    '#3b82f6',
    '#60a5fa',
    true,
    CURRENT_DATE,
    '{"skill_category": "Programming", "flavor_text": "Hello, World!"}'::jsonb
  ),
  (
    'SKILL-PROB',
    'Problem Solver',
    'Master at finding creative solutions',
    'uncommon',
    'skill',
    NULL,
    'https://placehold.co/400x400/14b8a6/ffffff?text=🧩',
    '#14b8a6',
    '#2dd4bf',
    true,
    CURRENT_DATE,
    '{"skill_category": "Critical Thinking", "flavor_text": "Every problem has a solution"}'::jsonb
  ),
  (
    'SKILL-COMM',
    'Great Communicator',
    'Express ideas clearly and effectively',
    'uncommon',
    'skill',
    NULL,
    'https://placehold.co/400x400/f97316/ffffff?text=💬',
    '#f97316',
    '#fb923c',
    true,
    CURRENT_DATE,
    '{"skill_category": "Communication", "flavor_text": "Words that inspire"}'::jsonb
  ),
  (
    'SKILL-LEAD',
    'Team Leader',
    'Guide teams to success',
    'rare',
    'skill',
    NULL,
    'https://placehold.co/400x400/84cc16/ffffff?text=👥',
    '#84cc16',
    '#a3e635',
    true,
    CURRENT_DATE,
    '{"skill_category": "Leadership", "flavor_text": "Lead by example"}'::jsonb
  );

  -- Insert Industry Pathkeys
  INSERT INTO public.pathkeys (
    key_code,
    name,
    description,
    rarity,
    key_type,
    career_id,
    image_url,
    color_primary,
    color_secondary,
    is_active,
    release_date,
    metadata
  ) VALUES
  (
    'IND-TECH',
    'Tech Pioneer',
    'Exploring the technology industry',
    'uncommon',
    'industry',
    NULL,
    'https://placehold.co/400x400/6366f1/ffffff?text=🚀',
    '#6366f1',
    '#818cf8',
    true,
    CURRENT_DATE,
    '{"industry": "Technology", "flavor_text": "Innovation never stops"}'::jsonb
  ),
  (
    'IND-HEALTH',
    'Healthcare Hero',
    'Dedicated to helping others heal',
    'rare',
    'industry',
    NULL,
    'https://placehold.co/400x400/dc2626/ffffff?text=⚕️',
    '#dc2626',
    '#ef4444',
    true,
    CURRENT_DATE,
    '{"industry": "Healthcare", "flavor_text": "Caring for humanity"}'::jsonb
  ),
  (
    'IND-BIZ',
    'Business Mogul',
    'Building empires one deal at a time',
    'uncommon',
    'industry',
    NULL,
    'https://placehold.co/400x400/0891b2/ffffff?text=💼',
    '#0891b2',
    '#06b6d4',
    true,
    CURRENT_DATE,
    '{"industry": "Business", "flavor_text": "Where strategy meets success"}'::jsonb
  );

  -- Insert Milestone Pathkeys
  INSERT INTO public.pathkeys (
    key_code,
    name,
    description,
    rarity,
    key_type,
    career_id,
    image_url,
    color_primary,
    color_secondary,
    is_active,
    release_date,
    metadata
  ) VALUES
  (
    'MILE-FIRST',
    'First Victory',
    'Completed your first game',
    'common',
    'milestone',
    NULL,
    'https://placehold.co/400x400/fbbf24/ffffff?text=🏆',
    '#fbbf24',
    '#fcd34d',
    true,
    CURRENT_DATE,
    '{"milestone_type": "first_game", "flavor_text": "The journey begins"}'::jsonb
  );

END $$;

-- Update stats
SELECT
  key_type,
  rarity,
  COUNT(*) as count
FROM public.pathkeys
WHERE is_active = true
GROUP BY key_type, rarity
ORDER BY key_type, rarity;

SELECT COUNT(*) as total_pathkeys_seeded FROM public.pathkeys WHERE is_active = true;
