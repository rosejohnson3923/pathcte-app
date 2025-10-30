# Pathcte Database Migrations

This directory contains SQL migration files for the Pathcte database schema using Supabase PostgreSQL.

## Migration Order

Migrations should be applied in numerical order:

1. **001_create_schools_table.sql** - School organizations
2. **002_create_profiles_table.sql** - User profiles (extends auth.users)
3. **003_create_careers_table.sql** - Career information database
4. **004_create_pathkeys_table.sql** - Collectible pathkeys
5. **005_create_user_pathkeys_table.sql** - User pathkey ownership
6. **006_create_question_sets_table.sql** - Teacher-created question collections
7. **007_create_questions_table.sql** - Individual questions
8. **008_create_game_sessions_table.sql** - Multiplayer game sessions
9. **009_create_game_players_table.sql** - Players in game sessions
10. **010_create_market_items_table.sql** - Marketplace items
11. **011_create_user_purchases_table.sql** - Purchase history
12. **012_create_analytics_events_table.sql** - Event tracking
13. **013_create_database_functions.sql** - Utility functions
14. **014_create_database_triggers.sql** - Automated triggers

## Applying Migrations

### Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push

# Or apply individual migration
psql -h db.your-project.supabase.co -U postgres -d postgres -f 001_create_schools_table.sql
```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file content
4. Run the SQL in order

### Using psql

```bash
# Connect to your database
psql postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres

# Run migrations in order
\i 001_create_schools_table.sql
\i 002_create_profiles_table.sql
# ... etc
```

## Schema Overview

### Core Tables

- **profiles** - User accounts (student, teacher, parent)
- **schools** - School organizations
- **careers** - Career information from O*NET
- **pathkeys** - Collectible digital items
- **user_pathkeys** - User's pathkey collection

### Educational Content

- **question_sets** - Teacher-created question collections
- **questions** - Individual questions with options

### Gameplay

- **game_sessions** - Multiplayer game instances
- **game_players** - Players in games with scores

### Economy

- **market_items** - Items available for purchase
- **user_purchases** - Purchase transaction history

### Analytics

- **analytics_events** - User action tracking

## Row Level Security (RLS)

All tables have Row Level Security enabled with appropriate policies:

- **profiles**: Users can only view/update their own profile
- **question_sets**: Public sets visible to all, private sets only to creator
- **questions**: Accessible based on parent question set permissions
- **game_sessions**: Visible to host and participating players
- **user_pathkeys**: Users can only view their own collection
- **user_purchases**: Users can only view their own purchases

## Database Functions

### Game Functions
- `generate_game_code()` - Generate unique 6-character game codes
- `calculate_player_placement(game_session_id)` - Calculate final rankings

### Reward Functions
- `award_pathkey(user_id, pathkey_id)` - Award a pathkey to user
- `award_tokens(user_id, amount)` - Award tokens to user
- `spend_tokens(user_id, amount)` - Deduct tokens from user

### Utility Functions
- `update_question_set_stats(question_set_id, score)` - Update set statistics
- `check_purchase_limit(user_id, item_id)` - Check if purchase is allowed

## Database Triggers

### Automatic Timestamps
- `update_updated_at()` - Auto-update `updated_at` on all table updates

### Data Integrity
- `update_question_set_count()` - Keep question count synchronized
- `update_game_session_player_count()` - Keep player count synchronized
- `create_profile_for_new_user()` - Auto-create profile on user signup

### Game Logic
- `validate_game_session_status()` - Enforce valid status transitions
- `award_game_rewards()` - Distribute rewards when game completes

## Indexes

All tables include strategic indexes for:
- Foreign key relationships
- Frequently queried columns
- Full-text search (on title/name fields)
- Sorting and filtering operations

## Constraints

Tables include check constraints for:
- Enum-like text fields (status, types, etc)
- Numeric ranges (tokens >= 0, scores >= 0)
- Date logic (start < end)
- Username validation patterns

## Notes

- All timestamps use `TIMESTAMPTZ` (timestamp with timezone)
- All IDs use `UUID` with `gen_random_uuid()` default
- JSONB is used for flexible metadata and settings
- Arrays are used for tags, related items, and multi-select fields

## Environment Variables Required

Ensure these are set in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Rollback

To rollback migrations, drop tables in reverse order:

```sql
-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- ... other triggers

-- Drop functions
DROP FUNCTION IF EXISTS generate_game_code();
-- ... other functions

-- Drop tables in reverse order
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.user_purchases CASCADE;
-- ... etc
```

## Testing

After applying migrations, verify:

```sql
-- Check all tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check functions exist
SELECT proname FROM pg_proc WHERE proname LIKE '%pathkey%' OR proname LIKE '%token%';

-- Check triggers exist
SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE tgname LIKE '%update%';
```

## Support

For issues with migrations, check:
1. Supabase project logs
2. PostgreSQL error messages
3. RLS policy conflicts
4. Foreign key constraint violations
