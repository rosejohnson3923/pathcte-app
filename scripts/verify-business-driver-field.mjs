#!/usr/bin/env node
/**
 * Verify business_driver field is only populated for career-specific questions
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

async function verifyBusinessDriver() {
  console.log('🔍 Verifying business_driver Field Population\n');
  console.log('='.repeat(80) + '\n');

  // Get all questions with their question_set info
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, question_set_id, business_driver');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Get all question sets
  const { data: questionSets } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster');

  const questionSetMap = new Map(questionSets?.map(qs => [qs.id, qs]) || []);

  // Categorize questions
  const withBusinessDriver = questions.filter(q => q.business_driver);
  const withoutBusinessDriver = questions.filter(q => !q.business_driver);

  console.log('📊 Overall Statistics:\n');
  console.log(`   Total Questions: ${questions.length}`);
  console.log(`   With business_driver: ${withBusinessDriver.length}`);
  console.log(`   Without business_driver: ${withoutBusinessDriver.length}`);
  console.log('');

  // Check business_driver by exploration type
  const careerQuestions = questions.filter(q => {
    const qs = questionSetMap.get(q.question_set_id);
    return qs && qs.career_id !== null;
  });

  const industryQuestions = questions.filter(q => {
    const qs = questionSetMap.get(q.question_set_id);
    return qs && qs.career_id === null && (qs.career_cluster === null || qs.career_cluster === '');
  });

  const clusterQuestions = questions.filter(q => {
    const qs = questionSetMap.get(q.question_set_id);
    return qs && qs.career_cluster !== null && qs.career_cluster !== '';
  });

  console.log('='.repeat(80) + '\n');
  console.log('📋 By Exploration Type:\n');

  // Career questions
  const careerWithDriver = careerQuestions.filter(q => q.business_driver).length;
  const careerWithoutDriver = careerQuestions.filter(q => !q.business_driver).length;

  console.log('👤 CAREER (career_id IS NOT NULL):');
  console.log(`   Total Questions: ${careerQuestions.length}`);
  console.log(`   With business_driver: ${careerWithDriver} (${((careerWithDriver/careerQuestions.length)*100).toFixed(1)}%)`);
  console.log(`   Without business_driver: ${careerWithoutDriver} (${((careerWithoutDriver/careerQuestions.length)*100).toFixed(1)}%)`);
  console.log('');

  // Industry questions
  const industryWithDriver = industryQuestions.filter(q => q.business_driver).length;
  const industryWithoutDriver = industryQuestions.filter(q => !q.business_driver).length;

  console.log('🏢 INDUSTRY (career_id = NULL, career_cluster = NULL):');
  console.log(`   Total Questions: ${industryQuestions.length}`);
  console.log(`   With business_driver: ${industryWithDriver} (${industryQuestions.length > 0 ? ((industryWithDriver/industryQuestions.length)*100).toFixed(1) : '0'}%)`);
  console.log(`   Without business_driver: ${industryWithoutDriver} (${industryQuestions.length > 0 ? ((industryWithoutDriver/industryQuestions.length)*100).toFixed(1) : '0'}%)`);
  console.log('');

  // Cluster questions
  const clusterWithDriver = clusterQuestions.filter(q => q.business_driver).length;
  const clusterWithoutDriver = clusterQuestions.filter(q => !q.business_driver).length;

  console.log('🎓 CLUSTER (career_cluster IS NOT NULL):');
  console.log(`   Total Questions: ${clusterQuestions.length}`);
  console.log(`   With business_driver: ${clusterWithDriver} (${clusterQuestions.length > 0 ? ((clusterWithDriver/clusterQuestions.length)*100).toFixed(1) : '0'}%)`);
  console.log(`   Without business_driver: ${clusterWithoutDriver} (${clusterQuestions.length > 0 ? ((clusterWithoutDriver/clusterQuestions.length)*100).toFixed(1) : '0'}%)`);
  console.log('');

  console.log('='.repeat(80) + '\n');
  console.log('🎯 CONCLUSION:\n');

  if (careerWithDriver === careerQuestions.length && industryWithDriver === 0 && clusterWithDriver === 0) {
    console.log('   ✅ CONFIRMED: business_driver is ONLY populated for Career questions (career_id IS NOT NULL)');
    console.log('   ✅ Industry and Cluster questions have NO business_driver');
  } else if (careerWithDriver > 0 && (industryWithDriver > 0 || clusterWithDriver > 0)) {
    console.log('   ⚠️  WARNING: business_driver is populated in non-Career question sets!');
    console.log('   This may need to be addressed.');
  } else if (careerWithoutDriver > 0) {
    console.log('   ⚠️  WARNING: Some Career questions are missing business_driver!');
    console.log(`   ${careerWithoutDriver} career questions need business_driver populated.`);
  } else {
    console.log('   ℹ️  Mixed results - review needed.');
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('\n✅ Verification Complete!\n');
}

verifyBusinessDriver().catch(console.error);
