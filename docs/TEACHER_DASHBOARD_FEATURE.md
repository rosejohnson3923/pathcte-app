# Teacher Dashboard Feature

## Overview

The Teacher Dashboard is a comprehensive classroom analytics and pathkey management system that helps teachers:

1. **Track Student Progress** - Monitor individual student pathkey progress across all three sections (Career, Industry/Cluster, Business Driver)
2. **Identify Popular Content** - See which careers, industries, and business drivers students are most interested in
3. **Get Smart Recommendations** - Receive question set suggestions that help the most students unlock pathkeys
4. **Identify Students Needing Help** - Automatically flag students with low accuracy, stuck progress, or inactivity

## User Scenario

**Teacher:** teacher@esposure.gg
**Context:** Hosts many games with students in classroom setting. Both teacher-hosted and student-hosted games award pathkeys for career, industry, and business drivers.

**Problem:** After a month, randomly choosing question sets isn't helping students who need specific sets to complete pathkey awards. No visibility into which careers/industries/business drivers are popular.

**Solution:** Teacher Dashboard provides:
- Student-level pathkey progress tracking
- Classroom-wide analytics on popular content
- Smart question set recommendations
- Students needing help identification

---

## Architecture

### New Files Created

#### 1. Teacher Analytics Service
**Location:** `packages/shared/src/services/teacher-analytics.service.ts`

**Purpose:** Backend service that analyzes student pathkey progress and generates recommendations

**Key Methods:**
- `getTeacherStudents(teacherId)` - Gets all students in teacher's school
- `getStudentPathkeyProgress(teacherId)` - Detailed progress for each student
- `getClassroomAnalytics(teacherId)` - Aggregate classroom statistics
- `getQuestionSetRecommendations(teacherId)` - Smart recommendations

**Exports:**
```typescript
export interface StudentPathkeyProgress {
  student_id: string;
  student_email: string;
  student_name: string;
  total_pathkeys: number;
  careers_in_progress: CareerProgress[];
  completed_careers: number;
  most_played_career: string | null;
  most_played_industry: string | null;
  weakest_business_driver: BusinessDriver | null;
}

export interface ClassroomAnalytics {
  total_students: number;
  total_games_played: number;
  total_pathkeys_awarded: number;
  most_popular_careers: PopularityMetric[];
  most_popular_industries: PopularityMetric[];
  weakest_business_drivers: BusinessDriverMetric[];
  students_needing_help: StudentNeedingHelp[];
  most_active_students: StudentActivity[];
}

export interface QuestionSetRecommendation {
  question_set_id: string;
  title: string;
  career_sector: string | null;
  career_cluster: string | null;
  reason: string;
  benefit_student_count: number;
  benefit_students: string[];
}
```

#### 2. Teacher Dashboard Page
**Location:** `packages/web/src/pages/TeacherDashboardPage.tsx`

**Purpose:** React component displaying all teacher analytics

**Features:**
- Quick stats cards (Total Students, Pathkeys Awarded, Students Needing Help)
- Recommended question sets with student benefit counts
- Popular careers and industries with accuracy ratings
- Business drivers needing practice
- Students needing help alerts
- Expandable student progress details

#### 3. Route Configuration
**Modified:** `packages/web/src/App.tsx`

**Changes:**
- Imported `TeacherDashboardPage`
- Added route: `/teacher` (protected, requires teacher role)

#### 4. Sidebar Navigation
**Modified:** `packages/web/src/components/layout/Sidebar.tsx`

**Changes:**
- Added "Teacher Dashboard" link in Teaching Tools section
- Icon: GraduationCap
- Positioned first in teacher section for easy access

---

## Features in Detail

### 1. Student Pathkey Progress Tracking

**What it shows:**
- Each student's total completed pathkeys
- Careers in progress for each student
- Progress on all three pathkey sections:
  - ✅ Career Mastery (unlocked/not unlocked)
  - 🔓 Industry/Cluster Mastery (unlocked/progress count)
  - 🔑 Business Driver Mastery (unlocked/drivers completed)
- Most played career and industry per student
- Weakest business driver per student

**How it works:**
1. Queries `student_pathkeys` table for all students in teacher's school
2. Joins with `careers` table to get career details
3. Queries `game_players` and `game_sessions` to determine most played content
4. Queries `student_business_driver_progress` to identify weak areas

### 2. Classroom Analytics

**Popular Careers:**
- Shows top 5 careers by play count
- Displays number of students who played each career
- Shows average accuracy percentage
- Color-coded badges: Green (≥70%), Yellow (50-69%), Red (<50%)

**Popular Industries:**
- Shows top 5 industries by play count
- Displays number of students who played each industry
- Shows average accuracy percentage
- Same color-coding as careers

**Weakest Business Drivers:**
- Shows all 6 business drivers sorted by average accuracy
- Displays how many students are struggling (<70% accuracy, not mastered)
- Shows total attempts across classroom
- Helps teacher identify which drivers need more practice

### 3. Question Set Recommendations

**Recommendation Logic:**

**Industry Mastery Recommendations:**
- Identifies students who haven't unlocked Industry Mastery for specific sectors
- Groups students by sector they're working on
- Recommends industry overview question sets (career_id = NULL)
- Shows how many students would benefit from each set

**Example:**
```
"Healthcare Careers Fundamentals - Real-World Scenarios"
Reason: "Helps 8 students unlock Industry Mastery for Healthcare careers"
Benefit: 8 students [Alice, Bob, Charlie, ...]
```

**Business Driver Recommendations:**
- Identifies students struggling with specific business drivers (<70% accuracy)
- Groups students by weak driver
- Recommends sets targeting those drivers (future enhancement)

### 4. Students Needing Help

**Three types of alerts:**

**Low Accuracy:**
- Triggers when: ≥5 games played AND overall accuracy <60%
- Shows: `"Overall accuracy: 54.2% across 12 games"`

**Stuck Progress:**
- Triggers when: ≥10 games played AND 0 pathkeys earned
- Shows: `"Played 15 games but hasn't earned any pathkeys"`

**No Activity:**
- Triggers when: No games played in last 14 days
- Shows: `"No activity for 18 days"`

---

## Data Sources

### Database Tables Used

1. **`profiles`** - Student and teacher information
   - `id`, `email`, `display_name`, `school_id`, `user_type`

2. **`student_pathkeys`** - Core pathkey progress tracking
   - `student_id`, `career_id`
   - `career_mastery_unlocked`, `career_mastery_unlocked_at`
   - `industry_mastery_unlocked`, `industry_mastery_unlocked_at`
   - `business_driver_mastery_unlocked`, `business_driver_mastery_unlocked_at`

3. **`student_business_driver_progress`** - Business driver tracking
   - `student_id`, `career_id`, `business_driver`
   - `current_chunk_questions`, `current_chunk_correct`
   - `mastery_achieved`, `mastery_achieved_at`

4. **`student_pathkey_progress`** - Industry/cluster progress tracking
   - `student_id`, `career_id`, `mastery_type`
   - `question_set_id`, `accuracy`

5. **`game_players`** - Game participation data
   - `user_id`, `game_session_id`
   - `score`, `correct_answers`, `total_answers`
   - `joined_at`, `pathkeys_earned`

6. **`game_sessions`** - Game details
   - `id`, `question_set_id`, `exploration_type`

7. **`question_sets`** - Question set metadata
   - `id`, `title`, `career_id`, `career_sector`, `career_cluster`

8. **`careers`** - Career information
   - `id`, `title`, `sector`

---

## Usage Instructions

### For Teachers

1. **Access Dashboard:**
   - Log in as teacher (user_type = 'teacher')
   - Click "Teacher Dashboard" in sidebar
   - Or navigate to `/teacher`

2. **View Quick Stats:**
   - See total students, pathkeys awarded, students needing help at a glance

3. **Use Recommendations:**
   - Check "Recommended Question Sets" section
   - Each recommendation shows:
     - Question set title
     - Why it's recommended
     - How many students benefit
     - Which students benefit
   - Host games using these sets for maximum pathkey unlocking

4. **Monitor Popular Content:**
   - See which careers/industries students are interested in
   - Use accuracy percentages to gauge difficulty
   - Consider hosting more games in popular areas

5. **Identify Weak Areas:**
   - Check "Business Drivers Needing Practice" section
   - Focus classroom activities on weak drivers
   - Look for patterns across students

6. **Help Struggling Students:**
   - Review "Students Needing Help" section
   - Three categories: Low Accuracy, Stuck Progress, No Activity
   - Reach out to students individually or adjust curriculum

7. **Dive into Student Details:**
   - Expand individual students in "Student Pathkey Progress"
   - See all careers they're working on
   - Check which pathkey sections are unlocked
   - Identify their most played content and weakest areas

---

## Future Enhancements

### Phase 1 (Current Implementation)
- ✅ Student pathkey progress tracking
- ✅ Popular content analytics
- ✅ Industry mastery recommendations
- ✅ Students needing help identification

### Phase 2 (Planned)
- 🔮 Business driver-specific question set recommendations
- 🔮 Class-level pathkey goals and tracking
- 🔮 Student grouping by progress level
- 🔮 Export analytics to CSV/PDF
- 🔮 Email notifications for students needing help
- 🔮 Automated question set scheduling

### Phase 3 (Planned)
- 🔮 Individual student progress reports
- 🔮 Parent access to student progress
- 🔮 District-level analytics (for admin)
- 🔮 Career pathway recommendations
- 🔮 Integration with LMS (Canvas, Google Classroom)

---

## Testing Notes

### Manual Testing Steps

1. **Setup Test Data:**
   - Create teacher account: teacher@esposure.gg
   - Create 10+ student accounts in same school
   - Have students play various games (career and industry)
   - Ensure some students have pathkey progress

2. **Test Dashboard Load:**
   - Log in as teacher
   - Navigate to /teacher
   - Verify all sections load without errors
   - Check console for any errors

3. **Test Recommendations:**
   - Verify recommendations show up if students need industry mastery
   - Click through to verify question set details
   - Confirm student names and counts are accurate

4. **Test Popular Content:**
   - Play games in specific careers/industries
   - Refresh dashboard
   - Verify popularity counts update
   - Check accuracy percentages

5. **Test Student Progress:**
   - Expand student details
   - Verify career progress is accurate
   - Check pathkey section indicators (✅/❌/🔓/🔑)
   - Confirm most played and weakest areas

6. **Test Alerts:**
   - Create students with low accuracy
   - Create students with many games but no pathkeys
   - Create inactive students (no plays in 14+ days)
   - Verify all alerts show correctly

---

## Performance Considerations

### Current Limitations

**Query Performance:**
- Service performs multiple sequential queries per student
- Could be slow with 50+ students
- No caching implemented yet

**Optimization Strategies:**

1. **Database Views:**
   ```sql
   CREATE VIEW classroom_student_progress AS
   SELECT
     sp.*,
     c.title as career_title,
     c.sector as career_sector,
     COUNT(DISTINCT sbdp.business_driver) FILTER (WHERE sbdp.mastery_achieved) as drivers_completed
   FROM student_pathkeys sp
   JOIN careers c ON sp.career_id = c.id
   LEFT JOIN student_business_driver_progress sbdp ON sp.student_id = sbdp.student_id AND sp.career_id = sbdp.career_id
   GROUP BY sp.id, c.id;
   ```

2. **Caching:**
   - Cache analytics data for 5 minutes
   - Only recalculate on demand (refresh button)
   - Use React Query's `staleTime` option

3. **Pagination:**
   - For classrooms with 50+ students
   - Load top 20 students by default
   - "Load More" button for additional students

4. **Background Jobs:**
   - Pre-calculate analytics nightly
   - Store in `classroom_analytics` table
   - Dashboard loads pre-calculated data

---

## Security Considerations

### Access Control

**Route Protection:**
- `/teacher` route requires `user_type = 'teacher'`
- Enforced by `ProtectedRoute` component with `requireRole="teacher"`

**Data Filtering:**
- Teachers can only see students in their school
- Filtered by matching `school_id`
- No cross-school data access

**Service-Level Protection:**
- `teacherAnalyticsService` filters by `school_id`
- All queries use teacher's school as base filter
- No raw student data exposed

### Row-Level Security (RLS)

**Required Policies:**
```sql
-- Teachers can read students in their school
CREATE POLICY teacher_read_students ON profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles
      WHERE user_type = 'teacher'
      AND school_id = profiles.school_id
    )
  );

-- Teachers can read student pathkey data for their school
CREATE POLICY teacher_read_student_pathkeys ON student_pathkeys
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM profiles
      WHERE school_id IN (
        SELECT school_id FROM profiles WHERE id = auth.uid()
      )
    )
  );
```

---

## Troubleshooting

### Common Issues

**1. Dashboard shows 0 students**
- Check teacher's `school_id` is set
- Verify students have matching `school_id`
- Check console for query errors

**2. Recommendations not showing**
- Students need in-progress pathkeys
- Students must have NOT unlocked industry mastery
- Try playing more industry games

**3. Accuracy percentages seem wrong**
- Check if games were actually completed
- Verify `correct_answers` and `total_answers` in `game_players`
- Ensure business driver tracking is working

**4. Students Needing Help not appearing**
- Check thresholds:
  - Low accuracy: ≥5 games AND <60% accuracy
  - Stuck progress: ≥10 games AND 0 pathkeys
  - No activity: >14 days since last game
- Verify student has played games

**5. Performance is slow**
- Check number of students (>50 may be slow)
- Enable React Query devtools to see query times
- Consider implementing caching

---

## API Reference

### TeacherAnalyticsService

```typescript
class TeacherAnalyticsService {
  /**
   * Get all students for a teacher (by school)
   * @param teacherId - UUID of teacher
   * @returns Array of student UUIDs
   */
  async getTeacherStudents(teacherId: string): Promise<string[]>

  /**
   * Get detailed pathkey progress for all students
   * @param teacherId - UUID of teacher
   * @returns Array of StudentPathkeyProgress objects
   */
  async getStudentPathkeyProgress(teacherId: string): Promise<StudentPathkeyProgress[]>

  /**
   * Get classroom-wide analytics
   * @param teacherId - UUID of teacher
   * @returns ClassroomAnalytics object with all stats
   */
  async getClassroomAnalytics(teacherId: string): Promise<ClassroomAnalytics>

  /**
   * Get recommended question sets
   * @param teacherId - UUID of teacher
   * @returns Array of QuestionSetRecommendation objects
   */
  async getQuestionSetRecommendations(teacherId: string): Promise<QuestionSetRecommendation[]>
}
```

---

## Summary

The Teacher Dashboard provides comprehensive classroom analytics and pathkey management, solving the core problem of random question set selection by providing data-driven recommendations. Teachers can now:

1. **See the full picture** of student pathkey progress
2. **Identify popular content** to understand student interests
3. **Get smart recommendations** to help students unlock pathkeys efficiently
4. **Spot struggling students** before they fall too far behind

This feature directly addresses the user scenario where teachers need visibility and tools to manage balanced pathkey awards across their classroom.
