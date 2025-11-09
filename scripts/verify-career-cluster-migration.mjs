#!/usr/bin/env node
/**
 * Verify Career Cluster Migration 049
 * Checks what the migration will update
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

async function verifyMigration() {
  console.log('🔍 Verifying Migration 049 - Populate Missing Career Clusters\n');
  console.log('='.repeat(80) + '\n');

  // Get current state
  const { data: beforeSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_sector, career_cluster')
    .is('career_id', null)
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const nullCluster = beforeSets.filter(s => !s.career_cluster);
  const hasCluster = beforeSets.filter(s => s.career_cluster);

  console.log('📊 Current State (career_id = NULL sets):\n');
  console.log(`   Total: ${beforeSets.length}`);
  console.log(`   With career_cluster: ${hasCluster.length}`);
  console.log(`   Without career_cluster: ${nullCluster.length} ⚠️`);
  console.log('');

  if (nullCluster.length > 0) {
    console.log('📋 Sets that will be updated:\n');

    const mapping = {
      'Healthcare Careers Fundamentals': 'Health Science',
      'Technology & Engineering Basics': 'Information Technology',
      'Business & Finance Careers': 'Business Management & Administration',
      'Arts & Entertainment Careers': 'Arts, Audio/Video Technology & Communications',
      'Science & Research Careers': 'Science, Technology, Engineering & Mathematics',
      'Education & Teaching Careers': 'Education & Training',
      'Public Service & Law Careers': 'Law, Public Safety, Corrections & Security',
      'Agriculture & Environmental Careers': 'Agriculture, Food & Natural Resources',
      'Construction & Skilled Trades Careers': 'Architecture & Construction',
      'Hospitality & Service Industry Careers': 'Hospitality & Tourism',
    };

    let matchedCount = 0;
    let unmatchedCount = 0;

    nullCluster.forEach(set => {
      const proposedCluster = mapping[set.title];

      if (proposedCluster) {
        matchedCount++;
        console.log(`   ✅ "${set.title}"`);
        console.log(`      career_sector: ${set.career_sector}`);
        console.log(`      career_cluster: NULL → "${proposedCluster}"`);
        console.log('');
      } else {
        unmatchedCount++;
        console.log(`   ❌ "${set.title}"`);
        console.log(`      career_sector: ${set.career_sector}`);
        console.log(`      career_cluster: NULL → NO MAPPING!`);
        console.log('');
      }
    });

    console.log('='.repeat(80) + '\n');
    console.log('📈 Migration Impact:\n');
    console.log(`   Will update: ${matchedCount} question sets`);
    console.log(`   Won't update: ${unmatchedCount} question sets`);
    console.log('');

    if (unmatchedCount > 0) {
      console.log('   ⚠️  WARNING: Some sets don\'t match the migration mapping!');
      console.log('   Review the migration script and add missing titles.');
      console.log('');
    }
  }

  // Show what will remain NULL after migration
  console.log('='.repeat(80) + '\n');
  console.log('📋 Expected State After Migration:\n');

  const afterNullCluster = nullCluster.filter(s => {
    const mapping = {
      'Healthcare Careers Fundamentals': true,
      'Technology & Engineering Basics': true,
      'Business & Finance Careers': true,
      'Arts & Entertainment Careers': true,
      'Science & Research Careers': true,
      'Education & Teaching Careers': true,
      'Public Service & Law Careers': true,
      'Agriculture & Environmental Careers': true,
      'Construction & Skilled Trades Careers': true,
      'Hospitality & Service Industry Careers': true,
    };
    return !mapping[s.title];
  });

  console.log(`   Sets with career_cluster: ${hasCluster.length + nullCluster.length - afterNullCluster.length}`);
  console.log(`   Sets without career_cluster: ${afterNullCluster.length}`);
  console.log('');

  if (afterNullCluster.length === 0) {
    console.log('   ✅ All career_id = NULL sets will have career_cluster populated!');
  } else {
    console.log('   ⚠️  Some sets will still have NULL career_cluster:');
    afterNullCluster.forEach(s => {
      console.log(`      - ${s.title}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Migration verification complete!\n');

  if (unmatchedCount === 0 && afterNullCluster.length === 0) {
    console.log('💡 Safe to apply migration 049');
  } else {
    console.log('⚠️  Review warnings above before applying migration');
  }
}

verifyMigration().catch(console.error);
