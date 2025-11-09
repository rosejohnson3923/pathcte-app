#!/usr/bin/env node
/**
 * Content Distribution by Exploration Type (Correct Filters)
 * ============================================================
 * Uses the EXACT filter logic from useQuestionSets.ts:
 *
 * - Industry: career_id IS NULL AND career_cluster IS NULL
 * - Career: career_id IS NOT NULL
 * - Cluster: career_cluster IS NOT NULL (regardless of career_id)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../packages/web/.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function analyzeByExplorationType() {
  console.log('📊 Content Distribution by Exploration Type\n');
  console.log('Using EXACT filter logic from useQuestionSets.ts (lines 126-136)\n');
  console.log('='.repeat(80) + '\n');

  // Get all question sets
  const { data: questionSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_sector, career_cluster, question_set_type, total_questions')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Get actual question counts from questions table
  const { data: allQuestions } = await supabase
    .from('questions')
    .select('id, question_set_id');

  const questionCountMap = {};
  if (allQuestions) {
    allQuestions.forEach(q => {
      questionCountMap[q.question_set_id] = (questionCountMap[q.question_set_id] || 0) + 1;
    });
  }

  // Enrich question sets with actual question counts
  questionSets.forEach(qs => {
    qs.actual_question_count = questionCountMap[qs.id] || 0;
  });

  // Apply EXACT filter logic from useQuestionSets.ts
  const industryQuestionSets = questionSets.filter(set => {
    // Industry: career_id IS NULL AND career_cluster IS NULL
    return set.career_id === null && (set.career_cluster === null || set.career_cluster === '');
  });

  const careerQuestionSets = questionSets.filter(set => {
    // Career: career_id IS NOT NULL
    return set.career_id !== null;
  });

  const clusterQuestionSets = questionSets.filter(set => {
    // Cluster: career_cluster IS NOT NULL (regardless of career_id)
    return set.career_cluster !== null && set.career_cluster !== '';
  });

  // Calculate question counts
  const industryQuestions = industryQuestionSets.reduce((sum, qs) => sum + qs.actual_question_count, 0);
  const careerQuestions = careerQuestionSets.reduce((sum, qs) => sum + qs.actual_question_count, 0);
  const clusterQuestions = clusterQuestionSets.reduce((sum, qs) => sum + qs.actual_question_count, 0);

  const totalQuestions = questionSets.reduce((sum, qs) => sum + qs.actual_question_count, 0);

  // 1. OVERALL SUMMARY
  console.log('📈 OVERALL SUMMARY\n');
  console.log(`   Total Question Sets: ${questionSets.length}`);
  console.log(`   Total Questions: ${totalQuestions}`);
  console.log('');

  // 2. EXPLORATION TYPE BREAKDOWN
  console.log('='.repeat(80));
  console.log('\n🎯 EXPLORATION TYPE BREAKDOWN\n');

  console.log('📋 Filter Criteria (from useQuestionSets.ts lines 126-136):\n');
  console.log('   Industry: career_id IS NULL AND career_cluster IS NULL');
  console.log('   Career:   career_id IS NOT NULL');
  console.log('   Cluster:  career_cluster IS NOT NULL\n');

  console.log('='.repeat(80) + '\n');

  // INDUSTRY
  console.log('🏢 INDUSTRY (career_id = NULL AND career_cluster = NULL)\n');
  console.log(`   Question Sets: ${industryQuestionSets.length}`);
  console.log(`   Total Questions: ${industryQuestions}`);
  console.log(`   Avg Questions/Set: ${industryQuestionSets.length > 0 ? (industryQuestions / industryQuestionSets.length).toFixed(1) : '0'}`);
  console.log('');

  if (industryQuestionSets.length > 0) {
    console.log('   Sets:');
    industryQuestionSets.forEach(qs => {
      console.log(`   - "${qs.title}"`);
      console.log(`     career_sector: ${qs.career_sector || 'NULL'}`);
      console.log(`     Questions: ${qs.actual_question_count}`);
      console.log('');
    });
  } else {
    console.log('   ℹ️  No question sets match Industry criteria\n');
  }

  // CAREER
  console.log('='.repeat(80) + '\n');
  console.log('👤 CAREER (career_id IS NOT NULL)\n');
  console.log(`   Question Sets: ${careerQuestionSets.length}`);
  console.log(`   Total Questions: ${careerQuestions}`);
  console.log(`   Avg Questions/Set: ${careerQuestionSets.length > 0 ? (careerQuestions / careerQuestionSets.length).toFixed(1) : '0'}`);
  console.log('');

  if (careerQuestionSets.length > 0) {
    // Group by career_sector
    const bySector = {};
    careerQuestionSets.forEach(qs => {
      const sector = qs.career_sector || 'Unknown';
      if (!bySector[sector]) {
        bySector[sector] = [];
      }
      bySector[sector].push(qs);
    });

    console.log('   Breakdown by Sector:\n');
    Object.entries(bySector).sort((a, b) => a[0].localeCompare(b[0])).forEach(([sector, sets]) => {
      const sectorQuestions = sets.reduce((sum, qs) => sum + qs.actual_question_count, 0);
      console.log(`   📁 ${sector}: ${sets.length} sets, ${sectorQuestions} questions`);

      // Show first 3 as examples
      sets.slice(0, 3).forEach(qs => {
        console.log(`      - "${qs.title}": ${qs.actual_question_count} questions`);
      });
      if (sets.length > 3) {
        console.log(`      ... and ${sets.length - 3} more`);
      }
      console.log('');
    });
  }

  // CLUSTER
  console.log('='.repeat(80) + '\n');
  console.log('🎓 CLUSTER (career_cluster IS NOT NULL)\n');
  console.log(`   Question Sets: ${clusterQuestionSets.length}`);
  console.log(`   Total Questions: ${clusterQuestions}`);
  console.log(`   Avg Questions/Set: ${clusterQuestionSets.length > 0 ? (clusterQuestions / clusterQuestionSets.length).toFixed(1) : '0'}`);
  console.log('');

  if (clusterQuestionSets.length > 0) {
    // Group by career_cluster
    const byCluster = {};
    clusterQuestionSets.forEach(qs => {
      const cluster = qs.career_cluster;
      if (!byCluster[cluster]) {
        byCluster[cluster] = { withCareer: [], withoutCareer: [] };
      }
      if (qs.career_id) {
        byCluster[cluster].withCareer.push(qs);
      } else {
        byCluster[cluster].withoutCareer.push(qs);
      }
    });

    console.log('   Breakdown by Career Cluster:\n');
    Object.entries(byCluster)
      .sort((a, b) => {
        const aTotal = a[1].withCareer.length + a[1].withoutCareer.length;
        const bTotal = b[1].withCareer.length + b[1].withoutCareer.length;
        return bTotal - aTotal;
      })
      .forEach(([cluster, data]) => {
        const totalSets = data.withCareer.length + data.withoutCareer.length;
        const totalQs = [...data.withCareer, ...data.withoutCareer].reduce((sum, qs) => sum + qs.actual_question_count, 0);

        console.log(`   📚 ${cluster}`);
        console.log(`      Total: ${totalSets} sets, ${totalQs} questions`);

        if (data.withoutCareer.length > 0) {
          const clusterQs = data.withoutCareer.reduce((sum, qs) => sum + qs.actual_question_count, 0);
          console.log(`      - Cluster Sets (career_id = NULL): ${data.withoutCareer.length} sets, ${clusterQs} questions`);
          data.withoutCareer.forEach(qs => {
            console.log(`        • "${qs.title}": ${qs.actual_question_count} questions`);
          });
        }

        if (data.withCareer.length > 0) {
          const careerQs = data.withCareer.reduce((sum, qs) => sum + qs.actual_question_count, 0);
          console.log(`      - Career Sets (career_id != NULL): ${data.withCareer.length} sets, ${careerQs} questions`);
          data.withCareer.slice(0, 3).forEach(qs => {
            console.log(`        • "${qs.title}": ${qs.actual_question_count} questions`);
          });
          if (data.withCareer.length > 3) {
            console.log(`        ... and ${data.withCareer.length - 3} more`);
          }
        }
        console.log('');
      });
  }

  // 3. OVERLAP ANALYSIS
  console.log('='.repeat(80) + '\n');
  console.log('🔍 OVERLAP ANALYSIS\n');

  // Sets that appear in multiple categories
  const inClusterAndCareer = clusterQuestionSets.filter(qs => qs.career_id !== null).length;

  console.log(`   Sets in BOTH Cluster AND Career: ${inClusterAndCareer}`);
  console.log(`   (Career-specific sets with career_cluster populated)\n`);

  console.log('   Category Distribution:');
  console.log(`   - Industry only: ${industryQuestionSets.length}`);
  console.log(`   - Career only (no cluster): ${careerQuestionSets.filter(qs => !qs.career_cluster).length}`);
  console.log(`   - Cluster only (no career_id): ${clusterQuestionSets.filter(qs => !qs.career_id).length}`);
  console.log(`   - Both Career & Cluster: ${inClusterAndCareer}`);
  console.log('');

  // 4. CONTENT GAPS
  console.log('='.repeat(80) + '\n');
  console.log('💡 CONTENT GAPS & OPPORTUNITIES\n');

  // Find sets with 0 questions
  const emptySets = questionSets.filter(qs => qs.actual_question_count === 0);
  if (emptySets.length > 0) {
    console.log(`   ⚠️  ${emptySets.length} question sets have 0 questions:\n`);
    emptySets.forEach(qs => {
      let category = 'Unknown';
      if (qs.career_id === null && (qs.career_cluster === null || qs.career_cluster === '')) {
        category = 'Industry';
      } else if (qs.career_id !== null) {
        category = 'Career';
      } else if (qs.career_cluster) {
        category = 'Cluster';
      }
      console.log(`   - "${qs.title}" [${category}]`);
    });
    console.log('');
  }

  console.log('='.repeat(80));
  console.log('\n✅ Analysis Complete!\n');
}

analyzeByExplorationType().catch(console.error);
