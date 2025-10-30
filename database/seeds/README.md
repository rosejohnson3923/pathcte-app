# Database Seed Data

This directory contains SQL scripts to populate the Pathcte database with test data for development and testing.

## Contents

### Seed Files

1. **001_seed_careers.sql** - Creates 8 sample careers across various industries
   - Software Developer (Technology)
   - Registered Nurse (Healthcare)
   - Marketing Manager (Business)
   - Public Relations Specialist (Communications)
   - Civil Engineer (Engineering)
   - Elementary School Teacher (Education)
   - Physicist (Science)
   - Administrative Assistant (Business)

2. **002_seed_pathkeys.sql** - Creates 16 pathkey collectibles
   - 8 Career pathkeys (one for each career)
   - 4 Skill pathkeys (general skills)
   - 3 Industry pathkeys (Tech, Healthcare, Business)
   - 1 Milestone pathkey (First Victory)

3. **003_seed_question_sets.sql** - Creates 3 question sets with 25 total questions
   - **Career Exploration Basics** (10 questions, Easy)
   - **Healthcare Careers Quiz** (8 questions, Medium)
   - **Technology & Innovation** (7 questions, Hard)

4. **000_run_all_seeds.sql** - Master script that runs all seeds in order

## Prerequisites

Before running the seed scripts, you need:

1. **A Supabase project** with all migrations applied
2. **A teacher profile** created in the database

### Creating a Teacher Profile

If you don't have a teacher profile yet, run this SQL:

```sql
-- First, create an auth user in Supabase Auth Dashboard
-- Then link it to a profile:

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  user_type,
  school_id
) VALUES (
  'YOUR_AUTH_USER_UUID_HERE',  -- Replace with actual auth.users.id
  'teacher@test.com',
  'Test Teacher',
  'teacher',
  NULL
);
```

Or create through the application signup flow.

## Usage

### Option 1: Run All Seeds (Recommended)

Using Supabase CLI or psql:

```bash
cd database/seeds
psql -d your_database -f 000_run_all_seeds.sql
```

Or using Supabase SQL Editor:
- Copy the contents of `000_run_all_seeds.sql`
- Paste into Supabase SQL Editor
- Execute

### Option 2: Run Individual Seed Files

Execute each file in order:

```bash
psql -d your_database -f 001_seed_careers.sql
psql -d your_database -f 002_seed_pathkeys.sql
psql -d your_database -f 003_seed_question_sets.sql
```

### Option 3: Using Supabase Dashboard

1. Open Supabase SQL Editor
2. Copy contents of each seed file
3. Execute in order (001 → 002 → 003)

## Important Notes

### Teacher UUID Configuration

**IMPORTANT:** The question sets script uses a placeholder teacher UUID. You must update it:

1. Open `003_seed_question_sets.sql`
2. Find this line:
   ```sql
   test_teacher_id := '00000000-0000-0000-0000-000000000001'::uuid;
   ```
3. Replace with your actual teacher profile UUID, or let it auto-detect:
   ```sql
   SELECT id INTO test_teacher_id FROM public.profiles WHERE user_type = 'teacher' LIMIT 1;
   ```

### Re-seeding

All seed scripts are designed to be re-runnable. They will:
- Delete existing seed data based on specific identifiers
- Re-insert fresh data
- Maintain referential integrity

To re-seed, simply run the scripts again.

### RLS (Row Level Security)

The seed scripts respect RLS policies. If you encounter permission errors:
- Run as a database admin/service role
- Or temporarily disable RLS for seeding:
  ```sql
  ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
  -- Run seeds
  ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
  ```

## Verification

After seeding, verify the data:

```sql
-- Check careers
SELECT COUNT(*) as careers FROM public.careers WHERE is_verified = true;

-- Check pathkeys
SELECT COUNT(*) as pathkeys FROM public.pathkeys WHERE is_active = true;

-- Check question sets
SELECT
  title,
  total_questions,
  difficulty_level
FROM public.question_sets
WHERE is_public = true AND is_verified = true;

-- Check questions
SELECT
  qs.title as set_name,
  COUNT(q.id) as question_count
FROM public.question_sets qs
LEFT JOIN public.questions q ON q.question_set_id = qs.id
GROUP BY qs.title;
```

Expected results:
- **8 careers**
- **16 pathkeys**
- **3 question sets**
- **25 questions total** (10 + 8 + 7)

## Testing the Game System

Once seeded, you can test the game:

1. **Host a Game:**
   - Navigate to `/host-game`
   - Select "Career Exploration Basics" question set
   - Create game and get a 6-character code

2. **Join as Students:**
   - Open `/join-game` in multiple browsers/tabs
   - Enter the game code
   - Join with different display names

3. **Play Through:**
   - Host starts the game
   - Answer questions (test speed bonus!)
   - Check leaderboard updates in real-time
   - View results and rewards

4. **Verify Rewards:**
   - Check that tokens were awarded
   - Top 3 players should receive pathkeys
   - View in user profiles

## Customization

To add your own test data:

1. **More Careers:** Add entries to `001_seed_careers.sql`
2. **More Pathkeys:** Add entries to `002_seed_pathkeys.sql`
3. **More Questions:** Create new question sets in `003_seed_question_sets.sql`

Follow the existing format and data structure.

## Troubleshooting

### "No teacher found" Warning

If you see this warning:
```
No teacher found. Using placeholder UUID: 00000000-0000-0000-0000-000000000001. You need to update this!
```

**Solution:** Create a teacher profile first (see Prerequisites section)

### Foreign Key Violations

If you get foreign key errors:
- Ensure migrations are applied: `supabase db push`
- Check that teacher profile exists
- Run seeds in order (careers → pathkeys → question sets)

### RLS Permission Denied

If you get "permission denied" errors:
- Run as service role user
- Or use Supabase dashboard (runs as service role)
- Check that RLS policies allow insert for your role

### Duplicate Key Violations

If you get "duplicate key" errors:
- The scripts should handle this, but if not:
- Run the DELETE statements manually first
- Or drop and recreate the tables (loses all data!)

## Clean Up

To remove all seed data:

```sql
-- Remove test questions and sets
DELETE FROM public.questions WHERE question_set_id IN (
  SELECT id FROM public.question_sets WHERE title IN (
    'Career Exploration Basics',
    'Healthcare Careers Quiz',
    'Technology & Innovation'
  )
);

DELETE FROM public.question_sets WHERE title IN (
  'Career Exploration Basics',
  'Healthcare Careers Quiz',
  'Technology & Innovation'
);

-- Remove test pathkeys
DELETE FROM public.pathkeys WHERE key_code LIKE 'DEV-%'
  OR key_code LIKE 'SKILL-%'
  OR key_code LIKE 'IND-%'
  OR key_code LIKE 'MILE-%';

-- Remove test careers
DELETE FROM public.careers WHERE onet_code IN (
  '15-1252.00', '29-1141.00', '11-2021.00', '27-3031.00',
  '17-2051.00', '25-2021.00', '19-2012.00', '43-6014.00'
);
```

## Support

If you encounter issues:
1. Check the Supabase logs for detailed error messages
2. Verify all migrations are applied
3. Ensure you have proper permissions
4. Review the RLS policies

---

**Ready to test?** Run `000_run_all_seeds.sql` and start playing! 🎮🚀
