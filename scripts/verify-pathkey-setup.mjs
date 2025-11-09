#!/usr/bin/env node
/**
 * Verify Pathkey Award System Setup
 * ==================================
 * Checks that migrations 053 & 054 applied correctly
 * Verifies PR Specialist test career has all required data
 *
 * Reference: docs/PATHKEY_IMPLEMENTATION_NOTES.md
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

async function verifyPathkeySetup() {
  console.log('🔍 Verifying Pathkey Award System Setup\n');
  console.log('='.repeat(80) + '\n');

  // =========================================================================
  // Check Tables Exist
  // =========================================================================
  console.log('📋 Checking Tables...\n');

  const tables = ['student_pathkeys', 'student_pathkey_progress', 'student_business_driver_progress'];
  let allTablesExist = true;

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);

    if (error && error.code === '42P01') {
      console.log(`   ❌ Table ${table} does NOT exist`);
      allTablesExist = false;
    } else if (error) {
      console.log(`   ⚠️  Error checking ${table}: ${error.message}`);
    } else {
      console.log(`   ✅ Table ${table} exists`);
    }
  }

  console.log('');

  if (!allTablesExist) {
    console.log('❌ Some tables are missing. Run migrations 053 first.\n');
    return;
  }

  // =========================================================================
  // Check PR Specialist Career
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('👤 Checking PR Specialist Test Career...\n');

  const { data: prCareer, error: prError } = await supabase
    .from('careers')
    .select('id, title, sector, career_cluster, pathkey_career_image, pathkey_lock_image, pathkey_key_image, pathkey_images_complete')
    .eq('title', 'Public Relations Specialist')
    .single();

  if (prError || !prCareer) {
    console.log('   ❌ PR Specialist career not found\n');
    return;
  }

  console.log(`   ✅ Career Found: "${prCareer.title}"`);
  console.log(`   ID: ${prCareer.id}`);
  console.log(`   Sector: ${prCareer.sector || 'NULL'}`);
  console.log(`   Career Cluster: ${prCareer.career_cluster || 'NULL'}`);
  console.log('');
  console.log('   Images:');
  console.log(`     Career: ${prCareer.pathkey_career_image || 'NOT SET'}`);
  console.log(`     Lock: ${prCareer.pathkey_lock_image || 'NOT SET'}`);
  console.log(`     Key: ${prCareer.pathkey_key_image || 'NOT SET'}`);
  console.log(`     Complete: ${prCareer.pathkey_images_complete ? '✅ YES' : '❌ NO'}`);
  console.log('');

  // =========================================================================
  // Check PR Specialist Question Sets
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('📚 Checking PR Specialist Question Sets...\n');

  const { data: careerQuestionSets, error: qsError } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_sector, career_cluster')
    .eq('career_id', prCareer.id);

  if (qsError) {
    console.log(`   ❌ Error: ${qsError.message}\n`);
  } else if (!careerQuestionSets || careerQuestionSets.length === 0) {
    console.log('   ⚠️  No career-specific question sets found for PR Specialist\n');
    console.log('   You will need career question sets to test Section 1 & 3\n');
  } else {
    console.log(`   ✅ Found ${careerQuestionSets.length} career-specific question set(s):\n`);
    for (const qs of careerQuestionSets) {
      console.log(`      - "${qs.title}" (${qs.id.substring(0, 8)}...)`);
    }
    console.log('');
  }

  // =========================================================================
  // Check Business Driver Population
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('🎯 Checking Business Driver Data...\n');

  if (careerQuestionSets && careerQuestionSets.length > 0) {
    const questionSetIds = careerQuestionSets.map(qs => qs.id);

    const { data: businessDrivers, error: bdError } = await supabase
      .from('questions')
      .select('business_driver')
      .in('question_set_id', questionSetIds)
      .not('business_driver', 'is', null);

    if (bdError) {
      console.log(`   ❌ Error: ${bdError.message}\n`);
    } else if (!businessDrivers || businessDrivers.length === 0) {
      console.log('   ⚠️  No questions with business_driver found\n');
      console.log('   You will need business_driver populated to test Section 3\n');
    } else {
      // Count by driver
      const driverCounts = {};
      businessDrivers.forEach(q => {
        driverCounts[q.business_driver] = (driverCounts[q.business_driver] || 0) + 1;
      });

      console.log(`   ✅ Found ${businessDrivers.length} questions with business_driver:\n`);
      Object.entries(driverCounts).sort().forEach(([driver, count]) => {
        console.log(`      ${driver}: ${count} questions`);
      });
      console.log('');

      // Check if all 6 drivers present
      const requiredDrivers = ['people', 'product', 'pricing', 'process', 'proceeds', 'profits'];
      const missingDrivers = requiredDrivers.filter(d => !driverCounts[d]);

      if (missingDrivers.length > 0) {
        console.log(`   ⚠️  Missing business drivers: ${missingDrivers.join(', ')}\n`);
      } else {
        console.log('   ✅ All 6 business drivers present!\n');
      }
    }
  }

  // =========================================================================
  // Check Industry Question Sets
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('🏢 Checking Industry Question Sets (for Section 2)...\n');

  const { data: industryQuestionSets, error: indError } = await supabase
    .from('question_sets')
    .select('id, title, career_sector, career_cluster')
    .is('career_id', null)
    .eq('career_sector', prCareer.sector);

  if (indError) {
    console.log(`   ❌ Error: ${indError.message}\n`);
  } else if (!industryQuestionSets || industryQuestionSets.length === 0) {
    console.log(`   ⚠️  No Industry question sets found for sector: ${prCareer.sector}\n`);
    console.log('   You will need at least 3 to test Section 2 (Industry Path)\n');
  } else {
    console.log(`   ✅ Found ${industryQuestionSets.length} Industry question set(s) matching "${prCareer.sector}":\n`);
    industryQuestionSets.slice(0, 5).forEach(qs => {
      console.log(`      - "${qs.title}"`);
    });
    if (industryQuestionSets.length > 5) {
      console.log(`      ... and ${industryQuestionSets.length - 5} more`);
    }
    console.log('');
  }

  // =========================================================================
  // Check Cluster Question Sets
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('🎓 Checking Cluster Question Sets (for Section 2)...\n');

  const { data: clusterQuestionSets, error: clusError } = await supabase
    .from('question_sets')
    .select('id, title, career_sector, career_cluster')
    .eq('career_cluster', prCareer.career_cluster)
    .is('career_id', null);

  if (clusError) {
    console.log(`   ❌ Error: ${clusError.message}\n`);
  } else if (!clusterQuestionSets || clusterQuestionSets.length === 0) {
    console.log(`   ⚠️  No Cluster question sets found for cluster: ${prCareer.career_cluster}\n`);
    console.log('   You will need at least 3 to test Section 2 (Cluster Path)\n');
  } else {
    console.log(`   ✅ Found ${clusterQuestionSets.length} Cluster question set(s) matching "${prCareer.career_cluster}":\n`);
    clusterQuestionSets.slice(0, 5).forEach(qs => {
      console.log(`      - "${qs.title}"`);
    });
    if (clusterQuestionSets.length > 5) {
      console.log(`      ... and ${clusterQuestionSets.length - 5} more`);
    }
    console.log('');
  }

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('='.repeat(80) + '\n');
  console.log('📊 SETUP SUMMARY\n');

  const readyChecks = [];

  if (allTablesExist) {
    readyChecks.push('✅ Database tables created');
  } else {
    readyChecks.push('❌ Database tables missing');
  }

  if (prCareer && prCareer.pathkey_images_complete) {
    readyChecks.push('✅ PR Specialist has complete image set');
  } else {
    readyChecks.push('⚠️  PR Specialist images not configured');
  }

  if (careerQuestionSets && careerQuestionSets.length > 0) {
    readyChecks.push('✅ Career question sets exist');
  } else {
    readyChecks.push('❌ Career question sets missing');
  }

  if (industryQuestionSets && industryQuestionSets.length >= 3) {
    readyChecks.push('✅ Sufficient Industry question sets (Section 2)');
  } else {
    readyChecks.push('⚠️  Need more Industry question sets');
  }

  if (clusterQuestionSets && clusterQuestionSets.length >= 3) {
    readyChecks.push('✅ Sufficient Cluster question sets (Section 2)');
  } else {
    readyChecks.push('⚠️  Need more Cluster question sets');
  }

  readyChecks.forEach(check => console.log(`   ${check}`));
  console.log('');

  console.log('='.repeat(80));
  console.log('\n✅ Verification Complete!\n');
}

verifyPathkeySetup().catch(console.error);
