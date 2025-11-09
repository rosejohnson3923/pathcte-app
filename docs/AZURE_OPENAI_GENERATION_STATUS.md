# Azure OpenAI Content Generation - career_sector Status

## Summary

✅ **CONFIRMED**: Both pathfinity-app generation scripts **ARE including `career_sector`** in their JSON output.

## Scripts Analysis

### 1. generate-career-cluster-questions.mjs

**Location:** `/pathfinity-app/scripts/generate-career-cluster-questions.mjs`

**Status:** ✅ **career_sector IS included**

**Evidence:**
- **Line 39-101**: Templates define `career_sector` for each cluster
- **Line 264**: Output includes `career_sector: template.career_sector`
- **Line 288**: SQL generation includes career_sector column

**Template Examples:**
```javascript
{
  title: 'Arts, Audio/Video Technology & Communications',
  career_sector: 'Arts & Entertainment',  // ← Included
}
{
  title: 'Information Technology',
  career_sector: 'Technology',  // ← Included
}
```

**JSON Output Structure (line 258-273):**
```javascript
{
  career_cluster: template.title,
  career_id: null,  // NULL for career_quest overview sets
  title: `${template.title} - Career Cluster Fundamentals`,
  subject: template.career_sector,
  career_sector: template.career_sector,  // ✅ INCLUDED (line 264)
  question_set_type: 'career_quest',
  questions: [...],
  // ...
}
```

**Output Files:**
- JSON: `career-cluster-questions.json`
- SQL: `career-cluster-questions.sql`

---

### 2. generate-explore-careers-questions.mjs

**Location:** `/pathfinity-app/scripts/generate-explore-careers-questions.mjs`

**Status:** ✅ **career_sector IS included**

**Evidence:**
- **Line 239**: Output includes `career_sector: career.sector`
- **Line 288**: SQL generation includes career_sector column

**JSON Output Structure (line 234-248):**
```javascript
{
  career_id: career.id,  // NOT NULL for explore_careers sets
  title: `${career.title} - Career Exploration`,
  subject: career.sector,
  career_sector: career.sector,  // ✅ INCLUDED (line 239)
  question_set_type: 'career_quest',  // Note: Should be 'explore_careers'?
  questions: [...],
  // ...
}
```

**Output Files:**
- JSON: `explore-careers-questions.json`
- SQL: `explore-careers-questions.sql`

---

## Verification Checklist

### ✅ What's Working

1. **career_sector field is defined** in both generation scripts
2. **career_sector is included** in JSON output
3. **career_sector is included** in SQL output
4. **Templates have correct values** (Healthcare, Technology, Business, etc.)

### ⚠️ Minor Observation

**explore-careers script (line 243):**
```javascript
question_set_type: 'career_quest',  // Should this be 'explore_careers'?
```

Based on the database schema (migration 024), these might be better as:
- Cluster fundamentals → `question_set_type: 'career_quest'` ✅
- Career-specific → `question_set_type: 'explore_careers'` (currently 'career_quest')

However, looking at the database state, all question sets use 'career_quest' type, so this is consistent with actual usage.

---

## Import Compatibility

### pathcte.app/scripts/import-questions.mjs

**Line 42:** Reads `career_sector` from JSON
```javascript
career_sector: questionSetFields.career_sector,
```

✅ **COMPATIBLE** - The import script expects and will correctly handle `career_sector` from the generated JSON files.

---

## Workflow

```
Azure OpenAI (pathfinity-app)
  ↓
  generate-career-cluster-questions.mjs
  generate-explore-careers-questions.mjs
  ↓
  career-cluster-questions.json ← Contains career_sector ✅
  explore-careers-questions.json ← Contains career_sector ✅
  ↓
  pathcte.app/scripts/import-questions.mjs
  ↓
  Database (career_sector populated) ✅
```

---

## Conclusion

**NO CHANGES NEEDED** ✅

Both Azure OpenAI generation scripts in pathfinity-app are correctly including `career_sector` in their JSON output. The field is:
1. ✅ Defined in templates
2. ✅ Included in JSON output
3. ✅ Included in SQL output
4. ✅ Compatible with import script
5. ✅ Properly populated in database

The current implementation is working correctly for the `career_sector` field!

---

## Generated Files Locations

**pathfinity-app:**
- `career-cluster-questions.json` (line 277)
- `career-cluster-questions.sql` (line 284)
- `explore-careers-questions.json` (likely similar path)
- `explore-careers-questions.sql` (likely similar path)

**Import from pathcte.app:**
```javascript
// Line 138-139 in import-questions.mjs
join(__dirname, '../../pathfinity-app/career-cluster-questions.json')
join(__dirname, '../../pathfinity-app/explore-careers-questions.json')
```
