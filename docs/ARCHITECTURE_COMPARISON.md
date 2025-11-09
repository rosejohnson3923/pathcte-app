# Architecture Comparison: What We Wanted vs. What We Have

## WHAT WE WANTED (Question Pools Architecture)

### Database Structure
```
question_sets (3 rows only)
├─ id: 1, title: "Career Exploration"
├─ id: 2, title: "Industry Exploration"
└─ id: 3, title: "Cluster Exploration"

questions (3000 rows)
├─ id, question_text, options, difficulty, business_driver
├─ career_id (FK to careers table)
├─ career_cluster (e.g., "STEM", "Business & Finance")
└─ (NO question_set_id foreign key)

question_set_membership (3000 rows)
├─ Links questions to the 3 master sets
├─ Question about "Software Engineer" → linked to set #1 (Career Exploration)
├─ Question about "Technology Industry" → linked to set #2 (Industry Exploration)
└─ Question about "STEM" → linked to set #3 (Cluster Exploration)
```

### User Flow
1. User selects: Exploration Type = "Career"
2. UI filters: Show careers dropdown (populated from careers table)
3. User selects: "Software Engineer"
4. User selects: 20 questions
5. **Query:**
   ```sql
   SELECT q.* FROM questions q
   JOIN question_set_membership m ON q.id = m.question_id
   WHERE m.question_set_id = 1  -- Career Exploration
   AND q.career_id = 'software-engineer-uuid'
   ORDER BY RANDOM()
   LIMIT 20
   ```

### Benefits
- 3 question sets (clean, simple)
- Easy to add new careers/industries/clusters
- Questions can be filtered dynamically
- No duplication of question sets

---

## WHAT WE ACTUALLY HAVE (Traditional Architecture)

### Database Structure
```
question_sets (191 rows - with duplicates)
├─ id: uuid-1, title: "Software Engineer", career_id: xyz, total_questions: 24
├─ id: uuid-2, title: "Accountant", career_id: abc, total_questions: 24
├─ id: uuid-3, title: "Technology Industry", career_id: NULL, total_questions: 36
├─ id: uuid-4, title: "STEM Cluster", career_cluster: "STEM", total_questions: 60
└─ ... 187 more rows (including duplicates)

questions (3000 rows)
├─ id, question_text, options, difficulty, business_driver
├─ question_set_id (FK to question_sets)
└─ (NO career_id field, NO career_cluster field)

question_set_membership (3000 rows)
├─ Just mirrors the question_set_id relationship
├─ Redundant - doesn't add value
└─ 1:1 mapping (each question in only 1 set)
```

### User Flow
1. User selects: Exploration Type = "Career"
2. UI filters: Show question sets WHERE career_id IS NOT NULL
3. User selects: "Software Engineer" question set
4. User selects: 20 questions
5. **Query:**
   ```sql
   SELECT q.* FROM questions q
   WHERE q.question_set_id = 'software-engineer-set-uuid'
   ORDER BY RANDOM()
   LIMIT 20
   ```

### Current State
- 191 question sets (71 unique + 120 duplicates)
- Each career/industry/cluster has its own question set
- Questions are permanently tied to one set
- Membership table is redundant (just duplicates question_set_id)

---

## KEY DIFFERENCES

| Aspect | What We Wanted | What We Have |
|--------|---------------|--------------|
| **Question Sets** | 3 master sets | 191 individual sets |
| **Filtering** | Dynamic by metadata | By selecting a specific set |
| **Question Fields** | career_id, career_cluster | question_set_id only |
| **Membership Table** | Many-to-many enabled | Redundant 1:1 |
| **Add New Career** | Add rows to questions | Create new question set |
| **Duplicates** | N/A | 120 duplicate sets exist |

---

## RECOMMENDATION

Since questions are NOT designed to be shared across categories, and each topic has its own unique questions:

**Keep the Simple Architecture (Option 2)**
1. Remove the 120 duplicate question sets
2. Keep 71 unique question sets
3. Remove the redundant membership table OR keep it for future flexibility
4. Current UI already works with this model

This is **simpler, clearer, and matches your business logic** where each career/industry/cluster has distinct question content.
