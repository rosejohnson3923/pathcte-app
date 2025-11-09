# Content Generation Workflow Analysis

## Current Situation

### Scripts Overview

1. **test-content-generation.ts** (Line 41)
   - ✅ Reads `career_sector` from database
   - ✅ Uses it for generating AI context
   - ❌ Does NOT output JSON files
   - ✅ Inserts questions directly to database

2. **fill-content-gaps.ts** (Line 54)
   - ✅ Reads `career_sector` from database
   - ✅ Uses it for generating AI context
   - ❌ Does NOT output JSON files
   - ✅ Inserts questions directly to database

3. **import-questions.mjs** (Line 42)
   - ✅ Expects `career_sector` in JSON input
   - ✅ Preserves it when inserting to database
   - ℹ️  Reads from JSON files (currently missing)

## The Problem

**Current workflow:**
```
Database → AI Generation Scripts → Generate Questions → Insert to Database
```

**Expected workflow for JSON-based import:**
```
??? → Create JSON with question sets → import-questions.mjs → Database
```

The JSON source files referenced in import-questions.mjs don't exist:
- `../../pathfinity-app/career-cluster-questions.json`
- `../../pathfinity-app/explore-careers-questions.json`

## What's Missing

### ❌ No Export to JSON Script

There is **NO script** that:
1. Exports existing question sets from database to JSON format
2. Generates new question sets in JSON format for import
3. Creates JSON files with question sets for backup/transfer

### ✅ Database Fields Are Correct

The database and generation scripts properly handle `career_sector`:
- QuestionSet interface includes it (line 41, test-content-generation.ts)
- It's read from database
- It's used for AI context generation

## What Needs To Be Added

### Option 1: Export Script (Recommended)
Create a script to export question sets from database to JSON format:

```typescript
// scripts/export-question-sets-to-json.ts
// Exports question sets with all questions to JSON format
// Includes: career_sector, career_cluster, career_id, etc.
// Output: JSON files compatible with import-questions.mjs
```

This would:
- Read question sets from database
- Include ALL fields (career_sector, career_cluster, career_id, etc.)
- Format for import-questions.mjs compatibility
- Filter by question_set_type if needed

### Option 2: Modify Generation Scripts
Modify test-content-generation.ts and fill-content-gaps.ts to:
- Continue inserting to database (current behavior)
- ALSO output JSON files as backup
- Include career_sector in the JSON output

## Decision Needed

**Question for User:**
Do you want to:
1. Create an **export script** to dump existing question sets to JSON?
2. Create a **generation script** that outputs JSON (instead of direct DB insert)?
3. Both?

The export script would be most useful for:
- Backing up question sets
- Transferring between environments
- Creating seed data
- Generating training datasets
