#!/usr/bin/env node
/**
 * Test Pathkey Award Flow
 * =======================
 * Interactive testing for the three-section pathkey award system
 *
 * Usage:
 *   node scripts/test-pathkey-flow.mjs [student_email]
 *
 * Reference: docs/PATHKEY_AWARD_SYSTEM_DESIGN.md
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

async function testPathkeyFlow() {
  console.log('🔍 Pathkey Award System - Test Flow\n');
  console.log('='.repeat(80) + '\n');

  const studentEmail = process.argv[2] || 'test-student@pathcte.com';

  // =========================================================================
  // Setup: Find or create test student
  // =========================================================================
  console.log('📋 Step 1: Finding Test Student...\n');

  const { data: student, error: studentError } = await supabase
    .from('profiles')
    .select('id, email, display_name')
    .eq('email', studentEmail)
    .single();

  if (studentError || !student) {
    console.log(`   ❌ Student not found: ${studentEmail}`);
    console.log('   Create a student account first or provide a different email.');
    console.log('\n   Usage: node scripts/test-pathkey-flow.mjs <student_email>\n');
    return;
  }

  console.log(`   ✅ Found student: ${student.display_name} (${student.email})`);
  console.log(`   Student ID: ${student.id}\n`);

  // =========================================================================
  // Setup: Find PR Specialist career
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('📋 Step 2: Finding PR Specialist Career...\n');

  const { data: career, error: careerError } = await supabase
    .from('careers')
    .select('*')
    .eq('title', 'Public Relations Specialist')
    .single();

  if (careerError || !career) {
    console.log('   ❌ PR Specialist career not found\n');
    return;
  }

  console.log(`   ✅ Found: ${career.title}`);
  console.log(`   Career ID: ${career.id}`);
  console.log(`   Sector: ${career.sector}`);
  console.log(`   Cluster: ${career.career_cluster}\n`);

  // =========================================================================
  // Test Section 1: Career Mastery
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('🎯 TEST SECTION 1: Career Mastery\n');
  console.log('   Requirement: Finish Top 3 in Career mode\n');

  const { data: existingMastery } = await supabase
    .from('student_pathkeys')
    .select('career_mastery_unlocked')
    .eq('student_id', student.id)
    .eq('career_id', career.id)
    .single();

  if (existingMastery?.career_mastery_unlocked) {
    console.log('   ✅ Career Mastery ALREADY UNLOCKED\n');
  } else {
    console.log('   ❌ Career Mastery NOT YET UNLOCKED\n');
    console.log('   To unlock:');
    console.log('   1. Play a Career mode game with PR Specialist question set');
    console.log('   2. Finish in Top 3 (with 3+ total players in production)\n');
  }

  // =========================================================================
  // Test Section 2: Industry/Cluster Mastery
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('🔒 TEST SECTION 2: Industry/Cluster Mastery\n');
  console.log('   Requirement: Complete 3 question sets with 90% accuracy\n');
  console.log('   Prerequisite: Must have Career Mastery unlocked first\n');

  if (!existingMastery?.career_mastery_unlocked) {
    console.log('   ⏸️  Cannot test Section 2 - Career Mastery required first\n');
  } else {
    // Check industry progress
    const { data: industryProgress } = await supabase
      .from('student_pathkey_progress')
      .select('*')
      .eq('student_id', student.id)
      .eq('career_id', career.id)
      .eq('mastery_type', 'industry')
      .gte('accuracy', 90);

    const industryCount = industryProgress?.length || 0;

    // Check cluster progress
    const { data: clusterProgress } = await supabase
      .from('student_pathkey_progress')
      .select('*')
      .eq('student_id', student.id)
      .eq('career_id', career.id)
      .eq('mastery_type', 'cluster')
      .gte('accuracy', 90);

    const clusterCount = clusterProgress?.length || 0;

    console.log(`   Industry Path: ${industryCount}/3 question sets completed`);
    console.log(`   Cluster Path: ${clusterCount}/3 question sets completed\n`);

    const { data: pathkey } = await supabase
      .from('student_pathkeys')
      .select('industry_mastery_unlocked, cluster_mastery_unlocked')
      .eq('student_id', student.id)
      .eq('career_id', career.id)
      .single();

    if (pathkey?.industry_mastery_unlocked || pathkey?.cluster_mastery_unlocked) {
      console.log('   ✅ Section 2 UNLOCKED\n');
    } else {
      console.log('   ❌ Section 2 NOT YET UNLOCKED\n');
      console.log('   To unlock (choose ONE path):');
      console.log(`   Industry: Complete ${3 - industryCount} more "${career.sector}" question sets with 90% accuracy`);
      console.log(`   Cluster: Complete ${3 - clusterCount} more "${career.career_cluster}" question sets with 90% accuracy\n`);
    }

    // Show available question sets
    console.log('   Available Industry Question Sets:\n');
    const { data: industrySets } = await supabase
      .from('question_sets')
      .select('id, title')
      .is('career_id', null)
      .eq('career_sector', career.sector)
      .limit(5);

    if (industrySets && industrySets.length > 0) {
      industrySets.forEach(qs => console.log(`      - ${qs.title}`));
    } else {
      console.log('      (None available)');
    }
    console.log('');

    console.log('   Available Cluster Question Sets:\n');
    const { data: clusterSets } = await supabase
      .from('question_sets')
      .select('id, title')
      .is('career_id', null)
      .eq('career_cluster', career.career_cluster)
      .limit(5);

    if (clusterSets && clusterSets.length > 0) {
      clusterSets.forEach(qs => console.log(`      - ${qs.title}`));
    } else {
      console.log('      (None available)');
    }
    console.log('');
  }

  // =========================================================================
  // Test Section 3: Business Driver Mastery
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('🔑 TEST SECTION 3: Business Driver Mastery\n');
  console.log('   Requirement: Answer 5 questions per business driver with 90% accuracy\n');
  console.log('   Must complete all 6 drivers: people, product, pricing, process, proceeds, profits\n');

  const { data: driverProgress } = await supabase
    .from('student_business_driver_progress')
    .select('*')
    .eq('student_id', student.id)
    .eq('career_id', career.id);

  if (!driverProgress || driverProgress.length === 0) {
    console.log('   ❌ No Business Driver progress yet\n');
    console.log('   To unlock:');
    console.log('   1. Play Career mode games with PR Specialist');
    console.log('   2. Answer questions correctly (tracked in chunks of 5)\n');
  } else {
    console.log('   Progress by Business Driver:\n');

    const requiredDrivers = ['people', 'product', 'pricing', 'process', 'proceeds', 'profits'];
    let completedCount = 0;

    requiredDrivers.forEach(driver => {
      const progress = driverProgress.find(d => d.business_driver === driver);

      if (!progress) {
        console.log(`      ${driver}: Not started (0/5 chunk progress)`);
      } else if (progress.mastery_achieved) {
        console.log(`      ${driver}: ✅ MASTERED`);
        completedCount++;
      } else {
        console.log(`      ${driver}: In progress (${progress.current_chunk_questions}/5 questions, ${progress.current_chunk_correct} correct)`);
      }
    });

    console.log('');

    const { data: pathkey } = await supabase
      .from('student_pathkeys')
      .select('business_driver_mastery_unlocked')
      .eq('student_id', student.id)
      .eq('career_id', career.id)
      .single();

    if (pathkey?.business_driver_mastery_unlocked) {
      console.log('   ✅ Section 3 (KEY) UNLOCKED - All 6 drivers mastered!\n');
    } else {
      console.log(`   ⏳ In Progress: ${completedCount}/6 drivers mastered\n`);
      console.log('   Keep playing Career mode to complete remaining drivers!\n');
    }
  }

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('📊 PATHKEY SUMMARY\n');

  const { data: finalPathkey } = await supabase
    .from('student_pathkeys')
    .select('*')
    .eq('student_id', student.id)
    .eq('career_id', career.id)
    .single();

  const section1 = finalPathkey?.career_mastery_unlocked ? '✅' : '❌';
  const section2 = finalPathkey?.industry_mastery_unlocked || finalPathkey?.cluster_mastery_unlocked ? '✅' : '❌';
  const section3 = finalPathkey?.business_driver_mastery_unlocked ? '✅' : '❌';

  console.log(`   Section 1 (Career Image): ${section1} ${finalPathkey?.career_mastery_unlocked ? 'UNLOCKED' : 'Locked'}`);
  console.log(`   Section 2 (Lock): ${section2} ${finalPathkey?.industry_mastery_unlocked || finalPathkey?.cluster_mastery_unlocked ? 'UNLOCKED' : 'Locked'}`);
  console.log(`   Section 3 (Key): ${section3} ${finalPathkey?.business_driver_mastery_unlocked ? 'UNLOCKED' : 'Locked'}\n`);

  if (section1 === '✅' && section2 === '✅' && section3 === '✅') {
    console.log('   🎉 COMPLETE PATHKEY EARNED! 🎉\n');
  } else {
    console.log('   Keep playing to unlock all three sections!\n');
  }

  console.log('='.repeat(80));
  console.log('\n✅ Test Complete!\n');
}

testPathkeyFlow().catch(console.error);
