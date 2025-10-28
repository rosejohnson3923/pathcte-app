# Quick Start: Seed Database

Get test data into your database in 5 minutes.

## Option 1: Supabase Dashboard (Easiest)

1. **Open Supabase SQL Editor**
   - Go to your Supabase project
   - Click "SQL Editor" in sidebar

2. **Create Teacher (First Time Only)**
   ```sql
   -- Create a test teacher account
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     created_at,
     updated_at,
     raw_app_meta_data,
     raw_user_meta_data,
     is_super_admin,
     confirmation_token,
     email_change,
     email_change_token_new,
     recovery_token
   ) VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'teacher@test.com',
     crypt('password123', gen_salt('bf')),
     NOW(),
     NOW(),
     NOW(),
     '{"provider":"email","providers":["email"]}',
     '{}',
     false,
     '',
     '',
     '',
     ''
   ) RETURNING id;

   -- Note the returned UUID, then create profile:
   INSERT INTO public.profiles (
     id,
     email,
     full_name,
     user_type,
     school_id
   ) VALUES (
     'PASTE_UUID_FROM_ABOVE_HERE',
     'teacher@test.com',
     'Test Teacher',
     'teacher',
     NULL
   );
   ```

3. **Run Seeds in Order**

   **First - Careers:**
   - Copy contents of `001_seed_careers.sql`
   - Paste in SQL Editor
   - Click "Run"
   - ✅ Should see: "8 rows affected"

   **Second - Pathkeys:**
   - Copy contents of `002_seed_pathkeys.sql`
   - Paste in SQL Editor
   - Click "Run"
   - ✅ Should see: "16 rows affected"

   **Third - Question Sets:**
   - Copy contents of `003_seed_question_sets.sql`
   - Paste in SQL Editor
   - Click "Run"
   - ✅ Should see: "3 question sets, 25 questions created"

4. **Verify**
   ```sql
   SELECT 'Careers' as type, COUNT(*) as count FROM careers
   UNION ALL
   SELECT 'Pathkeys', COUNT(*) FROM pathkeys
   UNION ALL
   SELECT 'Question Sets', COUNT(*) FROM question_sets
   UNION ALL
   SELECT 'Questions', COUNT(*) FROM questions;
   ```

   Expected:
   - Careers: 8
   - Pathkeys: 16
   - Question Sets: 3
   - Questions: 25

## Option 2: Command Line (psql)

```bash
# Navigate to seeds directory
cd database/seeds

# Connect to database
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Run master seed script
\i 000_run_all_seeds.sql
```

## Option 3: Supabase CLI

```bash
# Link to your project (first time only)
supabase link --project-ref your-project-ref

# Run seed script
supabase db execute -f database/seeds/000_run_all_seeds.sql
```

## Test Credentials

After seeding, you can login as:

**Teacher Account:**
- Email: `teacher@test.com`
- Password: `password123`

*Note: You'll need to create this in Supabase Auth first (see Option 1, Step 2)*

## What Gets Created?

### 8 Careers
- Software Developer
- Registered Nurse
- Marketing Manager
- Public Relations Specialist
- Civil Engineer
- Elementary School Teacher
- Physicist
- Administrative Assistant

### 16 Pathkeys
- 8 Career pathkeys (one per career)
- 4 Skill pathkeys (coding, problem-solving, communication, leadership)
- 3 Industry pathkeys (tech, healthcare, business)
- 1 Milestone pathkey (first victory)

### 3 Question Sets (25 total questions)
1. **Career Exploration Basics** - 10 questions (Easy)
2. **Healthcare Careers Quiz** - 8 questions (Medium)
3. **Technology & Innovation** - 7 questions (Hard)

## Next Steps

1. **Start Dev Server**
   ```bash
   cd packages/web
   npm run dev
   ```

2. **Test the Game**
   - Login as teacher
   - Go to `/host-game`
   - Create game with "Career Exploration Basics"
   - Open multiple tabs and join as students
   - Play through and verify everything works!

3. **See Full Testing Guide**
   - Check `/docs/TESTING_GUIDE.md` for comprehensive test scenarios

## Troubleshooting

### "Teacher not found" error

**Solution:** Create a teacher profile first (see Option 1, Step 2)

### Foreign key violations

**Solution:** Run seeds in order: Careers → Pathkeys → Questions

### Permission denied

**Solution:** Use Supabase SQL Editor (runs as service role) or disable RLS temporarily:

```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
-- run seeds
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

## Re-seeding

Want to reset? Just run the seeds again - they'll clean up old data and re-insert:

```bash
# In Supabase SQL Editor, run each seed file again
# Or via command line:
psql -f 001_seed_careers.sql
psql -f 002_seed_pathkeys.sql
psql -f 003_seed_question_sets.sql
```

## Clean Up

To remove all seed data:

```sql
-- Quick clean (specific seed data only)
DELETE FROM questions WHERE question_set_id IN (
  SELECT id FROM question_sets WHERE title LIKE 'Career%'
    OR title LIKE 'Healthcare%' OR title LIKE 'Technology%'
);
DELETE FROM question_sets WHERE title LIKE 'Career%'
  OR title LIKE 'Healthcare%' OR title LIKE 'Technology%';
DELETE FROM pathkeys WHERE key_code ~ '^(DEV|NURSE|MARKET|PR|CIVIL|TEACH|PHYS|ADMIN|SKILL|IND|MILE)-';
DELETE FROM careers WHERE onet_code IN ('15-1252.00', '29-1141.00', '11-2021.00', '27-3031.00', '17-2051.00', '25-2021.00', '19-2012.00', '43-6014.00');

-- Nuclear option (all data!)
TRUNCATE careers, pathkeys, question_sets, questions CASCADE;
```

---

**That's it!** You now have a fully seeded database ready for testing. 🎉

Try creating your first game at `/host-game`!
