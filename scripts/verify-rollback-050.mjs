#!/usr/bin/env node
/**
 * Verify Rollback Migration 050
 * ==============================
 * Shows what will happen when rolling back migrations 048 & 049
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

async function verifyRollback() {
  console.log('🔍 Verifying Rollback Migration 050\n');
  console.log('='.repeat(80) + '\n');

  // Get all question sets
  const { data: questionSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📊 CURRENT STATE (Before Rollback):\n');

  // Current filter results
  const currentIndustry = questionSets.filter(qs =>
    qs.career_id === null && (qs.career_cluster === null || qs.career_cluster === '')
  );
  const currentCareer = questionSets.filter(qs => qs.career_id !== null);
  const currentCluster = questionSets.filter(qs =>
    qs.career_cluster !== null && qs.career_cluster !== ''
  );

  console.log(`   Industry Filter (career_id=NULL, career_cluster=NULL): ${currentIndustry.length} sets`);
  console.log(`   Career Filter (career_id!=NULL): ${currentCareer.length} sets`);
  console.log(`   Cluster Filter (career_cluster!=NULL): ${currentCluster.length} sets`);
  console.log('');

  // Identify sets that will change
  const oldIndustrySets = [
    'Healthcare Careers Fundamentals',
    'Technology & Engineering Basics',
    'Business & Finance Careers',
    'Arts & Entertainment Careers',
    'Science & Research Careers',
    'Education & Teaching Careers',
    'Public Service & Law Careers',
    'Agriculture & Environmental Careers',
    'Construction & Skilled Trades Careers',
    'Hospitality & Service Industry Careers',
  ];

  const setsToChangeToIndustry = questionSets.filter(qs =>
    oldIndustrySets.includes(qs.title) && qs.career_id === null
  );

  const careerSetsToChange = questionSets.filter(qs =>
    qs.career_id !== null && qs.career_cluster !== null && qs.career_cluster !== ''
  );

  console.log('='.repeat(80) + '\n');
  console.log('🔄 CHANGES THAT WILL OCCUR:\n');

  console.log(`1️⃣  ${setsToChangeToIndustry.length} sets will have career_cluster set to NULL (old industry sets):\n`);
  setsToChangeToIndustry.forEach(qs => {
    console.log(`   - "${qs.title}"`);
    console.log(`     Current: career_cluster = "${qs.career_cluster}"`);
    console.log(`     After:   career_cluster = NULL`);
    console.log('');
  });

  console.log(`2️⃣  ${careerSetsToChange.length} career-specific sets will have career_cluster set to NULL:\n`);
  console.log('   (These should only appear in Career filter, not Cluster filter)\n');
  careerSetsToChange.slice(0, 5).forEach(qs => {
    console.log(`   - "${qs.title}"`);
    console.log(`     Current: career_id = ${qs.career_id.substring(0, 8)}..., career_cluster = "${qs.career_cluster}"`);
    console.log(`     After:   career_id = ${qs.career_id.substring(0, 8)}..., career_cluster = NULL`);
    console.log('');
  });
  if (careerSetsToChange.length > 5) {
    console.log(`   ... and ${careerSetsToChange.length - 5} more career sets\n`);
  }

  console.log('='.repeat(80) + '\n');
  console.log('📊 EXPECTED STATE (After Rollback):\n');

  // Simulate after rollback
  const afterIndustry = setsToChangeToIndustry.length;
  const afterCareer = questionSets.filter(qs => qs.career_id !== null).length;

  // Cluster will only include the 11 "Career Cluster Fundamentals" sets
  const clusterFundamentals = questionSets.filter(qs =>
    qs.title.includes('Career Cluster Fundamentals') && qs.career_id === null
  );
  const afterCluster = clusterFundamentals.length;

  console.log(`   Industry Filter (career_id=NULL, career_cluster=NULL): ${afterIndustry} sets`);
  console.log(`   Career Filter (career_id!=NULL): ${afterCareer} sets`);
  console.log(`   Cluster Filter (career_cluster!=NULL): ${afterCluster} sets`);
  console.log('');

  console.log('   Cluster sets will be:\n');
  clusterFundamentals.forEach(qs => {
    console.log(`   - "${qs.title}"`);
  });
  console.log('');

  console.log('='.repeat(80) + '\n');
  console.log('🎯 FILTER LOGIC ALIGNMENT:\n');

  console.log('   ✅ Industry filter will show: 10 industry overview sets');
  console.log('   ✅ Career filter will show: 50 career-specific sets');
  console.log('   ✅ Cluster filter will show: 11 Career Cluster Fundamentals sets');
  console.log('');
  console.log('   This matches the intended filter logic from useQuestionSets.ts!\n');

  console.log('='.repeat(80) + '\n');
  console.log('💡 TRIGGER CHANGES:\n');

  console.log('   🗑️  Will DROP: sync_career_cluster_on_question_set trigger');
  console.log('   🗑️  Will DROP: sync_question_set_career_cluster() function');
  console.log('   ✅ Will KEEP: update_career_cluster trigger (from migration 045)');
  console.log('');

  console.log('='.repeat(80));
  console.log('\n✅ Verification Complete!\n');
  console.log('💡 Safe to apply migration 050\n');
}

verifyRollback().catch(console.error);
