# Pathkey Award System - Implementation Notes

## Test Career: Public Relations Specialist

For initial development and testing, we're using **Public Relations Specialist** as the reference career since it has all three image components ready.

### Available Images

**Career:** `pr-specialist.png`
**Lock:** `Lock_gold_1.png`
**Key:** `Comm_key.png`

### PR Specialist Data

To verify we have the right data to test with:

```sql
-- Find Public Relations Specialist career
SELECT id, title, career_sector, career_cluster
FROM careers
WHERE title ILIKE '%public%relation%specialist%';

-- Expected results:
-- career_sector: "Marketing & Community" (or similar)
-- career_cluster: "Marketing" (or similar)
```

### Test Scenarios

#### Section 1: Career Mastery
- Play career-specific question set for PR Specialist
- Finish in Top 3
- Verify career image unlocks

#### Section 2A: Industry Path
- Find Industry question sets matching PR Specialist's career_sector
- Complete 3 with 90% accuracy
- Verify lock unlocks

#### Section 2B: Cluster Path
- Find Cluster question sets matching PR Specialist's career_cluster
- Complete 3 with 90% accuracy
- Verify lock unlocks (alternative path)

#### Section 3: Business Driver Mastery
- Play PR Specialist career questions
- Answer 5 questions per business driver with 90% accuracy
- Track all 6 drivers (people, product, pricing, process, proceeds, profits)
- Verify key unlocks

## Image Placeholder Strategy

For careers without complete image sets yet:

### Option 1: Generic Placeholders
- **Career Image:** Generic silhouette or "?" icon
- **Lock:** Generic lock icon (grayscale)
- **Key:** Generic key icon (grayscale)
- Show "Image coming soon" message

### Option 2: Locked Until Images Ready
- Hide pathkey completely for careers without images
- Show message: "Pathkey available soon"
- Only PR Specialist visible initially

### Option 3: Partial Display (Recommended)
- Show pathkey frame with sections
- Unlocked sections show placeholder + "Image pending"
- Locked sections show standard lock/key icons
- System tracks progress behind the scenes
- When images added, they appear automatically

## Database Image References

Add image path fields to track what's available:

```sql
ALTER TABLE careers
ADD COLUMN pathkey_career_image TEXT,
ADD COLUMN pathkey_lock_image TEXT,
ADD COLUMN pathkey_key_image TEXT,
ADD COLUMN pathkey_images_complete BOOLEAN DEFAULT false;

-- For PR Specialist
UPDATE careers
SET pathkey_career_image = 'pr-specialist.png',
    pathkey_lock_image = 'Lock_gold_1.png',
    pathkey_key_image = 'Comm_key.png',
    pathkey_images_complete = true
WHERE title = 'Public Relations Specialist';
```

## Frontend Implementation Notes

### Pathkey Component Props
```typescript
interface PathkeyProps {
  careerId: string;
  studentId: string;
  careerImage?: string;  // Optional - shows placeholder if null
  lockImage?: string;    // Optional - shows placeholder if null
  keyImage?: string;     // Optional - shows placeholder if null
  careerMasteryUnlocked: boolean;
  industryMasteryUnlocked: boolean;
  businessDriverMasteryUnlocked: boolean;
}
```

### Image Loading Strategy
```typescript
// Use placeholder if image not available
const careerImageSrc = career.pathkey_career_image
  ? `/images/pathkeys/${career.pathkey_career_image}`
  : '/images/pathkeys/placeholder-career.png';
```

## Testing Checklist - PR Specialist

### Prerequisites
- [ ] Verify PR Specialist career exists in database
- [ ] Verify PR Specialist has career question sets (career_id not null)
- [ ] Verify Industry question sets exist for PR Specialist's sector
- [ ] Verify Cluster question sets exist for PR Specialist's cluster
- [ ] Verify PR Specialist questions have business_driver populated
- [ ] Upload three image files to appropriate directory

### Section 1 Test
- [ ] Create test student account
- [ ] Play PR Specialist career question set
- [ ] Achieve Top 3 finish
- [ ] Verify `student_pathkeys.career_mastery_unlocked = true`
- [ ] Verify career image displays in UI

### Section 2 Test (Industry Path)
- [ ] Identify matching Industry question sets
- [ ] Complete 1st set with 90% accuracy
- [ ] Verify progress tracked (1/3)
- [ ] Complete 2nd set with 90% accuracy
- [ ] Verify progress tracked (2/3)
- [ ] Complete 3rd set with 90% accuracy
- [ ] Verify `industry_mastery_unlocked = true`
- [ ] Verify lock image displays in UI

### Section 2 Test (Cluster Path)
- [ ] Create new test student (or test on different career)
- [ ] Identify matching Cluster question sets
- [ ] Complete 3 sets with 90% accuracy
- [ ] Verify `cluster_mastery_unlocked = true`
- [ ] Verify both paths work independently

### Section 3 Test
- [ ] Play PR Specialist career questions
- [ ] Complete 5 "people" questions with 90% accuracy
- [ ] Verify people driver marked complete
- [ ] Repeat for remaining 5 drivers
- [ ] Verify `business_driver_mastery_unlocked = true`
- [ ] Verify key image displays in UI

### Edge Cases
- [ ] Test with <90% accuracy (should not count)
- [ ] Test incomplete chunks (should persist)
- [ ] Test failed chunks (should reset)
- [ ] Test without Section 1 unlocked (should not award)

## Data Verification Queries

### Check PR Specialist Setup
```sql
-- Career exists
SELECT * FROM careers WHERE title ILIKE '%public%relation%';

-- Career question sets exist
SELECT qs.id, qs.title, qs.career_id, COUNT(q.id) as question_count
FROM question_sets qs
LEFT JOIN questions q ON q.question_set_id = qs.id
WHERE qs.career_id = (SELECT id FROM careers WHERE title ILIKE '%public%relation%')
GROUP BY qs.id, qs.title, qs.career_id;

-- Business drivers populated
SELECT DISTINCT q.business_driver, COUNT(*) as count
FROM questions q
JOIN question_sets qs ON q.question_set_id = qs.id
WHERE qs.career_id = (SELECT id FROM careers WHERE title ILIKE '%public%relation%')
GROUP BY q.business_driver;

-- Industry question sets
SELECT qs.id, qs.title, qs.career_sector, COUNT(q.id) as question_count
FROM question_sets qs
LEFT JOIN questions q ON q.question_set_id = qs.id
WHERE qs.career_id IS NULL
  AND qs.career_cluster IS NULL
  AND qs.career_sector = (
    SELECT career_sector FROM careers WHERE title ILIKE '%public%relation%'
  )
GROUP BY qs.id, qs.title, qs.career_sector;

-- Cluster question sets
SELECT qs.id, qs.title, qs.career_cluster, COUNT(q.id) as question_count
FROM question_sets qs
LEFT JOIN questions q ON q.question_set_id = qs.id
WHERE qs.career_cluster = (
    SELECT career_cluster FROM careers WHERE title ILIKE '%public%relation%'
  )
GROUP BY qs.id, qs.title, qs.career_cluster;
```

## Future Image Creation

As new career images are created:

1. Add files to image directory: `/public/images/pathkeys/`
2. Update career record:
   ```sql
   UPDATE careers
   SET pathkey_career_image = 'career-name.png',
       pathkey_lock_image = 'Lock_color_variant.png',
       pathkey_key_image = 'ClusterName_key.png',
       pathkey_images_complete = true
   WHERE id = '[career_id]';
   ```
3. Images automatically appear for students who have unlocked sections

## Notes

- System tracks all pathkey progress regardless of image availability
- Students earn unlocks even if images aren't ready yet
- When images are added later, students see them immediately
- No need to retroactively award pathkeys - progress is already tracked
- PR Specialist serves as proof-of-concept for full system

---

*Document Created: 2025-01-08*
