#!/usr/bin/env node
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

async function analyzeCareerClusterNull() {
  console.log('🔍 Analyzing career_cluster NULL condition...\n');

  // 1. Find question_sets where career_id is NOT NULL but career_cluster IS NULL
  const { data: nullClusters, error: nullError } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster, created_at')
    .not('career_id', 'is', null)
    .is('career_cluster', null);

  if (nullError) {
    console.error('❌ Error fetching question sets:', nullError);
    return;
  }

  console.log('\n📊 Question sets with career_id NOT NULL but career_cluster IS NULL:');
  console.log(`   Count: ${nullClusters?.length || 0}`);

  if (nullClusters && nullClusters.length > 0) {
    console.log('\n   Sample records:');
    nullClusters.slice(0, 5).forEach(qs => {
      console.log(`   - ${qs.title} (career_id: ${qs.career_id}, created_at: ${qs.created_at})`);
    });

    // 3. Check if those career_ids exist in careers table and have career_cluster
    const careerIds = [...new Set(nullClusters.map(qs => qs.career_id))];
    console.log(`\n🔗 Checking ${careerIds.length} unique career_ids in careers table...`);

    const { data: careers, error: careerError } = await supabase
      .from('careers')
      .select('id, title, career_cluster')
      .in('id', careerIds);

    if (careerError) {
      console.error('   ❌ Error fetching careers:', careerError);
    }

    if (careers) {
      console.log(`\n   Careers found: ${careers.length}`);

      const careersWithCluster = careers.filter(c => c.career_cluster);
      const careersWithoutCluster = careers.filter(c => !c.career_cluster);

      console.log(`   - Have career_cluster: ${careersWithCluster.length}`);
      console.log(`   - Missing career_cluster: ${careersWithoutCluster.length}`);

      if (careersWithoutCluster.length > 0) {
        console.log('\n   ❌ Careers missing career_cluster:');
        careersWithoutCluster.forEach(c => {
          console.log(`      - ${c.title} (id: ${c.id})`);
        });
      }

      if (careersWithCluster.length > 0) {
        console.log('\n   ✅ Careers WITH career_cluster (but question_sets still null):');
        careersWithCluster.forEach(c => {
          const affectedSets = nullClusters.filter(qs => qs.career_id === c.id);
          console.log(`      - ${c.title} → "${c.career_cluster}" (${affectedSets.length} question sets affected)`);
        });
      }
    } else {
      console.log('   ⚠️  No careers data returned');
    }
  }

  // 4. Check overall stats
  const { data: stats } = await supabase
    .from('question_sets')
    .select('career_id, career_cluster');

  if (stats) {
    const total = stats.length;
    const withCareerIdCount = stats.filter(s => s.career_id).length;
    const withCareerClusterCount = stats.filter(s => s.career_cluster).length;
    const withCareerIdButNoCluster = stats.filter(s => s.career_id && !s.career_cluster).length;

    console.log('\n📈 Overall Statistics:');
    console.log(`   Total question_sets: ${total}`);
    console.log(`   With career_id: ${withCareerIdCount}`);
    console.log(`   With career_cluster: ${withCareerClusterCount}`);
    console.log(`   With career_id but NO career_cluster: ${withCareerIdButNoCluster} ⚠️`);
  }

  // 5. Check if the column exists
  const { data: columns } = await supabase
    .from('question_sets')
    .select('*')
    .limit(1);

  if (columns && columns.length > 0) {
    console.log('\n🏗️  Schema check:');
    console.log(`   career_cluster column exists: ${Object.keys(columns[0]).includes('career_cluster') ? 'YES' : 'NO'}`);
  }
}

analyzeCareerClusterNull().catch(console.error);
