#!/usr/bin/env node
/**
 * Comprehensive Content Distribution Analysis
 * ============================================
 * Counts question_sets and questions by:
 * - Industry Overview (career_id = NULL)
 * - Career-Specific (career_id != NULL)
 * - Career Cluster
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

async function analyzeContentDistribution() {
  console.log('📊 Content Distribution Analysis\n');
  console.log('='.repeat(80) + '\n');

  // Get all question sets with question counts
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

  // 1. OVERALL SUMMARY
  console.log('📈 OVERALL SUMMARY\n');

  const totalSets = questionSets.length;
  const totalQuestions = questionSets.reduce((sum, qs) => sum + qs.actual_question_count, 0);

  console.log(`   Total Question Sets: ${totalSets}`);
  console.log(`   Total Questions: ${totalQuestions}`);
  console.log(`   Average Questions per Set: ${(totalQuestions / totalSets).toFixed(1)}`);
  console.log('');

  // 2. INDUSTRY vs CAREER BREAKDOWN
  console.log('='.repeat(80));
  console.log('\n🏢 INDUSTRY OVERVIEW vs CAREER-SPECIFIC BREAKDOWN\n');

  const industryOverview = questionSets.filter(qs => qs.career_id === null);
  const careerSpecific = questionSets.filter(qs => qs.career_id !== null);

  const industryQuestions = industryOverview.reduce((sum, qs) => sum + qs.actual_question_count, 0);
  const careerQuestions = careerSpecific.reduce((sum, qs) => sum + qs.actual_question_count, 0);

  console.log('📋 Industry Overview (career_id = NULL):');
  console.log(`   Question Sets: ${industryOverview.length}`);
  console.log(`   Total Questions: ${industryQuestions}`);
  console.log(`   Avg Questions/Set: ${(industryQuestions / industryOverview.length).toFixed(1)}`);
  console.log('');

  console.log('🎯 Career-Specific (career_id != NULL):');
  console.log(`   Question Sets: ${careerSpecific.length}`);
  console.log(`   Total Questions: ${careerQuestions}`);
  console.log(`   Avg Questions/Set: ${(careerQuestions / careerSpecific.length).toFixed(1)}`);
  console.log('');

  // 3. INDUSTRY OVERVIEW DETAIL
  console.log('='.repeat(80));
  console.log('\n🏢 INDUSTRY OVERVIEW SETS - DETAILED BREAKDOWN\n');

  // Group by career_sector
  const bySector = {};
  industryOverview.forEach(qs => {
    const sector = qs.career_sector || 'Unknown';
    if (!bySector[sector]) {
      bySector[sector] = [];
    }
    bySector[sector].push(qs);
  });

  Object.entries(bySector).sort((a, b) => a[0].localeCompare(b[0])).forEach(([sector, sets]) => {
    const sectorQuestions = sets.reduce((sum, qs) => sum + qs.actual_question_count, 0);
    console.log(`📁 ${sector}`);
    console.log(`   Sets: ${sets.length} | Questions: ${sectorQuestions}`);

    sets.forEach(qs => {
      console.log(`   - "${qs.title}": ${qs.actual_question_count} questions`);
      if (qs.career_cluster) {
        console.log(`     Cluster: ${qs.career_cluster}`);
      }
    });
    console.log('');
  });

  // 4. CAREER-SPECIFIC DETAIL
  console.log('='.repeat(80));
  console.log('\n🎯 CAREER-SPECIFIC SETS - SUMMARY BY SECTOR\n');

  // Group career-specific by career_sector
  const careerBySector = {};
  careerSpecific.forEach(qs => {
    const sector = qs.career_sector || 'Unknown';
    if (!careerBySector[sector]) {
      careerBySector[sector] = [];
    }
    careerBySector[sector].push(qs);
  });

  Object.entries(careerBySector).sort((a, b) => a[0].localeCompare(b[0])).forEach(([sector, sets]) => {
    const sectorQuestions = sets.reduce((sum, qs) => sum + qs.actual_question_count, 0);
    console.log(`📁 ${sector}`);
    console.log(`   Career Sets: ${sets.length} | Questions: ${sectorQuestions} | Avg: ${(sectorQuestions / sets.length).toFixed(1)}`);

    // Show first 3 as examples
    sets.slice(0, 3).forEach(qs => {
      console.log(`   - "${qs.title}": ${qs.actual_question_count} questions`);
    });
    if (sets.length > 3) {
      console.log(`   ... and ${sets.length - 3} more careers`);
    }
    console.log('');
  });

  // 5. CAREER CLUSTER BREAKDOWN
  console.log('='.repeat(80));
  console.log('\n🎓 CAREER CLUSTER BREAKDOWN\n');

  // Group ALL sets by career_cluster
  const byCluster = {};
  questionSets.forEach(qs => {
    const cluster = qs.career_cluster || 'No Cluster';
    if (!byCluster[cluster]) {
      byCluster[cluster] = { sets: [], questions: 0 };
    }
    byCluster[cluster].sets.push(qs);
    byCluster[cluster].questions += qs.actual_question_count;
  });

  console.log('Distribution across CTE Career Clusters:\n');

  Object.entries(byCluster)
    .sort((a, b) => b[1].questions - a[1].questions) // Sort by question count desc
    .forEach(([cluster, data]) => {
      console.log(`📚 ${cluster}`);
      console.log(`   Question Sets: ${data.sets.length}`);
      console.log(`   Total Questions: ${data.questions}`);
      console.log(`   Avg Questions/Set: ${(data.questions / data.sets.length).toFixed(1)}`);

      // Show breakdown by type
      const industryCount = data.sets.filter(s => !s.career_id).length;
      const careerCount = data.sets.filter(s => s.career_id).length;

      if (industryCount > 0 && careerCount > 0) {
        console.log(`   - Industry Overview: ${industryCount} sets`);
        console.log(`   - Career-Specific: ${careerCount} sets`);
      } else if (industryCount > 0) {
        console.log(`   - All Industry Overview`);
      } else if (careerCount > 0) {
        console.log(`   - All Career-Specific`);
      }
      console.log('');
    });

  // 6. QUESTION SET TYPE BREAKDOWN
  console.log('='.repeat(80));
  console.log('\n🎮 QUESTION SET TYPE BREAKDOWN\n');

  const byType = {};
  questionSets.forEach(qs => {
    const type = qs.question_set_type || 'No Type';
    if (!byType[type]) {
      byType[type] = { sets: [], questions: 0 };
    }
    byType[type].sets.push(qs);
    byType[type].questions += qs.actual_question_count;
  });

  Object.entries(byType).forEach(([type, data]) => {
    console.log(`🎯 ${type}`);
    console.log(`   Question Sets: ${data.sets.length}`);
    console.log(`   Total Questions: ${data.questions}`);
    console.log(`   Avg Questions/Set: ${(data.questions / data.sets.length).toFixed(1)}`);
    console.log('');
  });

  // 7. CONTENT GAPS/OPPORTUNITIES
  console.log('='.repeat(80));
  console.log('\n💡 CONTENT INSIGHTS\n');

  // Find sets with low question counts
  const lowContent = questionSets.filter(qs => qs.actual_question_count < 10);
  if (lowContent.length > 0) {
    console.log(`⚠️  ${lowContent.length} question sets have fewer than 10 questions:`);
    lowContent.slice(0, 5).forEach(qs => {
      console.log(`   - "${qs.title}": ${qs.actual_question_count} questions`);
    });
    if (lowContent.length > 5) {
      console.log(`   ... and ${lowContent.length - 5} more`);
    }
    console.log('');
  }

  // Find clusters with no content
  const officialClusters = [
    'Agriculture, Food & Natural Resources',
    'Architecture & Construction',
    'Arts, Audio/Video Technology & Communications',
    'Business Management & Administration',
    'Education & Training',
    'Finance',
    'Government & Public Administration',
    'Health Science',
    'Hospitality & Tourism',
    'Human Services',
    'Information Technology',
    'Law, Public Safety, Corrections & Security',
    'Leadership',
    'Manufacturing',
    'Marketing',
    'Science, Technology, Engineering & Mathematics',
    'Transportation, Distribution & Logistics',
  ];

  const clustersWithContent = Object.keys(byCluster).filter(c => c !== 'No Cluster');
  const missingClusters = officialClusters.filter(c => !clustersWithContent.includes(c));

  if (missingClusters.length > 0) {
    console.log(`📋 Career Clusters with NO content yet (${missingClusters.length}):`);
    missingClusters.forEach(cluster => {
      console.log(`   - ${cluster}`);
    });
    console.log('');
  }

  console.log('='.repeat(80));
  console.log('\n✅ Analysis Complete!\n');
}

analyzeContentDistribution().catch(console.error);
