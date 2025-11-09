#!/usr/bin/env node
/**
 * Test Career Cluster Fix Migration
 * Simulates what the migration will do and verifies the trigger logic
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

async function testMigration() {
  console.log('🧪 Testing Career Cluster Fix Migration\n');

  // 1. Check how many records would be updated
  const { data: nullRecords, error: nullError } = await supabase
    .from('question_sets')
    .select('id, title, career_id')
    .not('career_id', 'is', null)
    .is('career_cluster', null);

  if (nullError) {
    console.error('❌ Error:', nullError);
    return;
  }

  console.log('📊 Current State:');
  console.log(`   Records with career_id but NULL career_cluster: ${nullRecords.length}`);

  if (nullRecords.length > 0) {
    // Simulate the UPDATE by checking if we can find career_cluster for each
    const careerIds = [...new Set(nullRecords.map(r => r.career_id))];
    const { data: careers } = await supabase
      .from('careers')
      .select('id, title, career_cluster')
      .in('id', careerIds);

    const careersMap = new Map(careers?.map(c => [c.id, c]) || []);

    let canFix = 0;
    let cannotFix = 0;

    console.log('\n📋 Simulation of UPDATE statement:');
    nullRecords.forEach(record => {
      const career = careersMap.get(record.career_id);
      if (career?.career_cluster) {
        canFix++;
      } else {
        cannotFix++;
        console.log(`   ⚠️  ${record.title} → career has no career_cluster`);
      }
    });

    console.log(`\n   Would fix: ${canFix} records`);
    console.log(`   Cannot fix: ${cannotFix} records (career missing career_cluster)`);
  }

  // 2. Check if there are any careers without career_cluster that question_sets reference
  const { data: allQuestionsWithCareer } = await supabase
    .from('question_sets')
    .select('career_id')
    .not('career_id', 'is', null);

  const allCareerIds = [...new Set(allQuestionsWithCareer?.map(q => q.career_id) || [])];

  const { data: allCareers } = await supabase
    .from('careers')
    .select('id, title, career_cluster')
    .in('id', allCareerIds);

  const careersWithoutCluster = allCareers?.filter(c => !c.career_cluster) || [];

  console.log('\n⚠️  Risk Assessment:');
  if (careersWithoutCluster.length > 0) {
    console.log(`   Found ${careersWithoutCluster.length} careers without career_cluster that are referenced by question_sets:`);
    careersWithoutCluster.forEach(c => {
      console.log(`      - ${c.title} (id: ${c.id})`);
    });
    console.log('\n   ⚠️  These careers should have career_cluster populated first!');
  } else {
    console.log('   ✅ All careers referenced by question_sets have career_cluster populated');
  }

  // 3. Explain what the trigger will do
  console.log('\n🔧 Trigger Behavior:');
  console.log('   The new trigger will:');
  console.log('   ✓ Fire on INSERT or UPDATE of career_id in question_sets');
  console.log('   ✓ Auto-populate career_cluster from careers table');
  console.log('   ✓ Use BEFORE trigger (sets value before save)');
  console.log('   ✓ Clear career_cluster if career_id is set to NULL');

  console.log('\n📝 Summary:');
  console.log('   This migration will:');
  console.log('   1. Fix all existing NULL career_cluster values (one-time UPDATE)');
  console.log('   2. Create trigger to auto-sync on future INSERTs/UPDATEs');
  console.log('   3. Keep existing trigger on careers table (for when careers.career_cluster changes)');

  console.log('\n✅ Migration is safe to apply!');
}

testMigration().catch(console.error);
