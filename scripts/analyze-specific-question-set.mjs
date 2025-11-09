#!/usr/bin/env node
/**
 * Analyze specific question set for career_cluster NULL issue
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

async function analyzeSpecificQuestionSet() {
  const targetId = '1c1567d5-61d1-4c6c-9af0-380ed41fad17';

  console.log('🔍 Analyzing specific question set\n');
  console.log(`ID: ${targetId}\n`);
  console.log('='.repeat(80) + '\n');

  // Get the specific question set
  const { data: questionSet, error } = await supabase
    .from('question_sets')
    .select('*')
    .eq('id', targetId)
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!questionSet) {
    console.log('❌ Question set not found');
    return;
  }

  console.log('📋 Question Set Details:\n');
  console.log(`   Title: ${questionSet.title}`);
  console.log(`   Description: ${questionSet.description || 'NULL'}`);
  console.log(`   Subject: ${questionSet.subject || 'NULL'}`);
  console.log(`   Created: ${questionSet.created_at}`);
  console.log('');
  console.log('🎯 Key Fields:');
  console.log(`   career_id: ${questionSet.career_id || 'NULL'}`);
  console.log(`   career_sector: ${questionSet.career_sector || 'NULL'}`);
  console.log(`   career_cluster: ${questionSet.career_cluster || 'NULL'} ${!questionSet.career_cluster ? '⚠️' : '✅'}`);
  console.log(`   question_set_type: ${questionSet.question_set_type || 'NULL'}`);
  console.log('');

  // If career_id is set, check the careers table
  if (questionSet.career_id) {
    console.log('🔗 Checking linked career in careers table...\n');

    const { data: career, error: careerError } = await supabase
      .from('careers')
      .select('id, title, sector, industry, career_cluster')
      .eq('id', questionSet.career_id)
      .single();

    if (careerError) {
      console.error('   ❌ Error fetching career:', careerError);
    } else if (career) {
      console.log(`   Career Title: ${career.title}`);
      console.log(`   Career sector: ${career.sector || 'NULL'}`);
      console.log(`   Career industry: ${career.industry || 'NULL'}`);
      console.log(`   Career career_cluster: ${career.career_cluster || 'NULL'} ${!career.career_cluster ? '⚠️' : '✅'}`);
      console.log('');

      // Check if trigger should have populated it
      if (career.career_cluster && !questionSet.career_cluster) {
        console.log('   ❌ ISSUE FOUND:');
        console.log('      - careers.career_cluster IS populated');
        console.log('      - question_sets.career_cluster IS NULL');
        console.log('      - The trigger should have synced this!');
        console.log('');
        console.log('   🔧 This can be fixed by:');
        console.log('      1. Running the UPDATE from migration 048');
        console.log('      2. Or manually updating the question set');
      } else if (!career.career_cluster) {
        console.log('   ℹ️  Root Cause:');
        console.log('      - The career itself has NULL career_cluster');
        console.log('      - question_sets inherits NULL from careers table');
        console.log('      - Fix the career first, then question_sets will sync');
      } else {
        console.log('   ✅ Both are populated correctly');
      }
    }
  } else {
    console.log('ℹ️  This is a career_quest overview set (career_id = NULL)\n');
    console.log('   Expected behavior:');
    console.log('   - career_cluster SHOULD be populated for "Career Cluster Fundamentals" sets');
    console.log('   - career_cluster can be NULL for older sector-based sets');
    console.log('');

    if (!questionSet.career_cluster) {
      console.log('   ⚠️  This set is missing career_cluster');
      console.log('');
      console.log('   🔧 To fix:');
      console.log('      1. Determine which CTE Career Cluster this belongs to');
      console.log('      2. Manually set career_cluster field');
      console.log('      3. Or regenerate with proper career_cluster value');
    }
  }

  // Check all NULL career_cluster cases
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Checking ALL question sets with NULL career_cluster...\n');

  const { data: nullClusterSets, error: nullError } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_sector, career_cluster, question_set_type, created_at')
    .is('career_cluster', null)
    .order('created_at', { ascending: false });

  if (nullError) {
    console.error('❌ Error:', nullError);
  } else if (nullClusterSets) {
    console.log(`Found ${nullClusterSets.length} question sets with NULL career_cluster:\n`);

    // Group by career_id presence
    const withCareer = nullClusterSets.filter(s => s.career_id !== null);
    const withoutCareer = nullClusterSets.filter(s => s.career_id === null);

    console.log(`   With career_id (should inherit from careers): ${withCareer.length}`);
    console.log(`   Without career_id (overview sets): ${withoutCareer.length}`);
    console.log('');

    if (withCareer.length > 0) {
      console.log('   Sets with career_id but NULL career_cluster:');
      withCareer.slice(0, 10).forEach(s => {
        console.log(`   - ${s.title} (created: ${s.created_at})`);
      });
      if (withCareer.length > 10) {
        console.log(`   ... and ${withCareer.length - 10} more`);
      }
      console.log('');
    }

    if (withoutCareer.length > 0) {
      console.log('   Overview sets (career_id = NULL) with NULL career_cluster:');
      withoutCareer.slice(0, 10).forEach(s => {
        console.log(`   - ${s.title}`);
        console.log(`     career_sector: ${s.career_sector || 'NULL'}`);
        console.log(`     type: ${s.question_set_type || 'NULL'}`);
      });
      if (withoutCareer.length > 10) {
        console.log(`   ... and ${withoutCareer.length - 10} more`);
      }
    }
  }
}

analyzeSpecificQuestionSet().catch(console.error);
