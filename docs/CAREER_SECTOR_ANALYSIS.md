# Career Sector Analysis - Question Sets with NULL career_id

## Summary

When `career_id` is NULL in question_sets, the `career_sector` field is being populated through **two different sources**:

1. **Manual UI Entry** (QuestionSetEditorModal.tsx)
2. **JSON Import Script** (import-questions.mjs)

## Current State

### Data Overview
- **21 question sets** have `career_id = NULL`
- **All 21 have career_sector populated** ✅
- **All 21 are type `career_quest`** (sector-based question sets)

### The 21 Question Sets

#### Newer Sets (11) - Created 2025-11-06 14:52:xx
These are "Career Cluster Fundamentals" sets with both career_sector AND career_cluster:
- Science, Technology, Engineering & Mathematics - Career Cluster Fundamentals
- Marketing - Career Cluster Fundamentals
- Leadership - Career Cluster Fundamentals
- Law, Public Safety, Corrections & Security - Career Cluster Fundamentals
- Information Technology - Career Cluster Fundamentals
- Hospitality & Tourism - Career Cluster Fundamentals
- Health Science - Career Cluster Fundamentals
- Finance - Career Cluster Fundamentals
- Education & Training - Career Cluster Fundamentals
- Business Management & Administration - Career Cluster Fundamentals
- Arts, Audio/Video Technology & Communications - Career Cluster Fundamentals

#### Older Sets (10) - Created 2025-11-06 12:52:xx
These are broader sector sets with career_sector but NULL career_cluster:
- Hospitality & Service Industry Careers
- Construction & Skilled Trades Careers
- Agriculture & Environmental Careers
- Public Service & Law Careers
- Education & Teaching Careers
- Science & Research Careers
- Arts & Entertainment Careers
- Business & Finance Careers
- Technology & Engineering Basics
- Healthcare Careers Fundamentals

## How career_sector Gets Populated

### 1. Manual UI Entry (QuestionSetEditorModal.tsx:36-47)

Teachers can select from a hardcoded dropdown when creating question sets:

```typescript
const CAREER_SECTORS = [
  'Healthcare',
  'Technology',
  'Business',
  'Arts & Entertainment',
  'Science',
  'Education',
  'Public Service',
  'Agriculture',
  'Construction',
  'Hospitality',
];
```

The field is **optional** - teachers can leave it blank or select one.

### 2. JSON Import Script (import-questions.mjs:42)

Bulk imports read `career_sector` directly from JSON files:

```javascript
career_sector: questionSetFields.career_sector,
```

The script imports from JSON files like:
- `career-cluster-questions.json` (Career Cluster Fundamentals)
- `explore-careers-questions.json` (Career-specific questions)

## Design Intent

Based on migration 024_add_career_fields_to_question_sets.sql:

### career_quest Type (career_id = NULL)
- **Purpose**: Broad sector/industry-based question sets for multiplayer games
- **Uses**: `career_sector` field (e.g., "Healthcare", "Technology")
- **career_cluster**: May or may not be populated (newer sets have it)
- **Example**: "Healthcare Careers Fundamentals"

### explore_careers Type (career_id = NOT NULL)
- **Purpose**: Career-specific question sets for solo exploration
- **Uses**: `career_id` field (links to specific career)
- **career_cluster**: Auto-synced from careers table via trigger
- **Example**: "Photographer" (linked to specific career UUID)

## Taxonomy Mismatch

The `career_sector` values in question_sets do NOT match the `sector` field in the careers table:

### Question Sets career_sector values:
- Science, Business, Public Service, Technology, Hospitality
- Healthcare, Education, Arts & Entertainment, Construction, Agriculture

### Careers table sector values (sample):
- Esports Operations, Health & Wellness, Creative & Media
- Technology, Broadcast & Production, Marketing & Community
- Business & Finance, Operations & Events

**Only "Technology" matches** between the two!

This is by design - `career_sector` is a high-level educational taxonomy, while `careers.sector` is more specific to the esports/gaming industry context of the current career data.

## Database Triggers

### No Automatic Population
There are **NO triggers** that auto-populate `career_sector`:
- It must be manually entered via UI
- Or provided in JSON import data

### Related Triggers
1. `sync_career_cluster_on_question_set` (migration 048)
   - Syncs `career_cluster` from careers table when `career_id` changes

2. `update_career_cluster` (migration 045)
   - Syncs `career_cluster` to question_sets when careers.career_cluster updates

## Conclusion

All 21 question sets with `career_id = NULL` have `career_sector` populated because:

1. **They were imported from JSON files** that included career_sector values
2. The import script (import-questions.mjs) preserves the career_sector from the source JSON
3. These are intentionally broad "career_quest" type sets meant for sector-based gameplay

There is **no missing data or sync issue** with career_sector - it's working as designed! ✅
