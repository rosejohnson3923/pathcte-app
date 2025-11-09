IMPORTANT NOTE ABOUT SQL FILES
================================

The SQL files in this directory (explore-careers-questions.sql and pathcte-questions.sql) 
use PL/pgSQL syntax (variables with RETURNING INTO) which does NOT work when pasted 
directly into Supabase SQL Editor.

RECOMMENDED IMPORT METHOD:
--------------------------
Use the JSON import script instead:

  cd /mnt/c/Users/rosej/Documents/Projects/pathcte.app
  node scripts/import-questions.mjs

This script reads the JSON files from pathfinity-app and imports them using the Supabase client,
which is much more reliable than running SQL directly.

SOURCE OF TRUTH:
----------------
- /pathfinity-app/pathket-questions.json (industry questions)
- /pathfinity-app/explore-careers-questions.json (career questions)

CURRENT STATUS:
---------------
All 780 questions have been successfully imported to the database:
- 60 question sets (10 industry + 50 careers)
- Perfect business_driver distribution (130 questions per P)
- All questions verified and working

