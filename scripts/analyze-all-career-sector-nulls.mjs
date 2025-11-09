#!/usr/bin/env node
/**
 * Comprehensive Analysis: All NULL career_sector Cases
 * Checks both career_id = NULL and career_id != NULL scenarios
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

async function analyzeAllCareerSectorNulls() {
  console.log('🔍 Comprehensive career_sector NULL Analysis\n');
  console.log('='.repeat(80) + '\n');

  // Get ALL question_sets
  const { data: allSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_sector, career_cluster, question_set_type, subject, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📊 Total question_sets: ${allSets.length}\n`);

  // Scenario 1: career_id = NULL, career_sector = NULL
  const scenario1 = allSets.filter(q => q.career_id === null && q.career_sector === null);

  // Scenario 2: career_id = NULL, career_sector != NULL
  const scenario2 = allSets.filter(q => q.career_id === null && q.career_sector !== null);

  // Scenario 3: career_id != NULL, career_sector = NULL
  const scenario3 = allSets.filter(q => q.career_id !== null && q.career_sector === null);

  // Scenario 4: career_id != NULL, career_sector != NULL
  const scenario4 = allSets.filter(q => q.career_id !== null && q.career_sector !== null);

  console.log('📋 Data Distribution:\n');
  console.log(`1️⃣  career_id = NULL  + career_sector = NULL:     ${scenario1.length} sets`);
  console.log(`2️⃣  career_id = NULL  + career_sector != NULL:    ${scenario2.length} sets`);
  console.log(`3️⃣  career_id != NULL + career_sector = NULL:     ${scenario3.length} sets ⚠️`);
  console.log(`4️⃣  career_id != NULL + career_sector != NULL:    ${scenario4.length} sets`);

  // Detail Scenario 1: career_id = NULL, career_sector = NULL
  if (scenario1.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log(`\n❌ SCENARIO 1: career_id = NULL, career_sector = NULL (${scenario1.length} sets)\n`);
    console.log('These should have career_sector populated!\n');

    scenario1.forEach(q => {
      console.log(`   - "${q.title}"`);
      console.log(`     career_cluster: ${q.career_cluster || 'NULL'}`);
      console.log(`     question_set_type: ${q.question_set_type || 'NULL'}`);
      console.log(`     subject: ${q.subject || 'NULL'}`);
      console.log(`     created_at: ${q.created_at}`);
      console.log('');
    });
  }

  // Detail Scenario 3: career_id != NULL, career_sector = NULL
  if (scenario3.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log(`\n❌ SCENARIO 3: career_id != NULL, career_sector = NULL (${scenario3.length} sets)\n`);
    console.log('These career-specific sets are missing career_sector!\n');

    scenario3.forEach(q => {
      console.log(`   - "${q.title}"`);
      console.log(`     career_id: ${q.career_id}`);
      console.log(`     career_cluster: ${q.career_cluster || 'NULL'}`);
      console.log(`     question_set_type: ${q.question_set_type || 'NULL'}`);
      console.log(`     subject: ${q.subject || 'NULL'}`);
      console.log(`     created_at: ${q.created_at}`);
      console.log('');
    });

    // Check if we can get career_sector from the careers table
    console.log('🔗 Checking if we can derive career_sector from careers table...\n');

    const careerIds = scenario3.map(q => q.career_id);
    const { data: careers } = await supabase
      .from('careers')
      .select('id, title, sector, industry, career_cluster')
      .in('id', careerIds);

    if (careers) {
      console.log('   Careers table data:');
      careers.forEach(c => {
        const affectedSets = scenario3.filter(q => q.career_id === c.id);
        console.log(`   - ${c.title}`);
        console.log(`     sector: ${c.sector || 'NULL'}`);
        console.log(`     industry: ${c.industry || 'NULL'}`);
        console.log(`     career_cluster: ${c.career_cluster || 'NULL'}`);
        console.log(`     Affects ${affectedSets.length} question set(s)`);
        console.log('');
      });

      // Check if careers have sector values
      const careersWithSector = careers.filter(c => c.sector);
      const careersWithoutSector = careers.filter(c => !c.sector);

      console.log(`\n   Analysis:`);
      console.log(`   - Careers with sector: ${careersWithSector.length}`);
      console.log(`   - Careers without sector: ${careersWithoutSector.length}`);

      if (careersWithSector.length > 0) {
        console.log(`\n   ⚠️  careers.sector values don't map to question_sets.career_sector taxonomy!`);
        console.log(`   The taxonomies are different:`);
        console.log(`   - careers.sector: Industry-specific (e.g., "Esports Operations", "Technology")`);
        console.log(`   - question_sets.career_sector: Educational (e.g., "Healthcare", "Business")`);
      }
    }
  }

  // Summary of good scenarios
  if (scenario2.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ SCENARIO 2: career_id = NULL, career_sector != NULL (${scenario2.length} sets)\n`);
    console.log('These are correctly populated career_quest overview sets.\n');

    const uniqueSectors = [...new Set(scenario2.map(q => q.career_sector))];
    console.log(`   Unique career_sector values: ${uniqueSectors.join(', ')}`);
  }

  if (scenario4.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ SCENARIO 4: career_id != NULL, career_sector != NULL (${scenario4.length} sets)\n`);
    console.log('These career-specific sets have career_sector populated.\n');

    const uniqueSectors = [...new Set(scenario4.map(q => q.career_sector))];
    console.log(`   Unique career_sector values: ${uniqueSectors.join(', ')}`);
  }

  // Final Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📈 SUMMARY\n');

  const totalNullSectors = scenario1.length + scenario3.length;
  const totalPopulatedSectors = scenario2.length + scenario4.length;

  console.log(`Total with NULL career_sector: ${totalNullSectors}`);
  console.log(`  - career_id = NULL: ${scenario1.length}`);
  console.log(`  - career_id != NULL: ${scenario3.length}`);
  console.log('');
  console.log(`Total with populated career_sector: ${totalPopulatedSectors}`);
  console.log(`  - career_id = NULL: ${scenario2.length}`);
  console.log(`  - career_id != NULL: ${scenario4.length}`);

  if (totalNullSectors > 0) {
    console.log('\n⚠️  ACTION NEEDED: ' + totalNullSectors + ' question sets missing career_sector');
  } else {
    console.log('\n✅ No issues found - all question sets have career_sector populated!');
  }
}

analyzeAllCareerSectorNulls().catch(console.error);
