#!/usr/bin/env node
/**
 * Analyze career_sector population when career_id is NULL
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

async function analyzeCareerSectorNull() {
  console.log('🔍 Analyzing career_sector when career_id is NULL...\n');

  // 1. Get all question_sets where career_id IS NULL
  const { data: nullCareerIdSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_sector, career_cluster, question_set_type, subject, created_at')
    .is('career_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📊 Question sets where career_id IS NULL:');
  console.log(`   Total: ${nullCareerIdSets.length}`);

  const withSector = nullCareerIdSets.filter(q => q.career_sector);
  const withoutSector = nullCareerIdSets.filter(q => !q.career_sector);

  console.log(`   - Have career_sector: ${withSector.length}`);
  console.log(`   - Missing career_sector: ${withoutSector.length}`);

  if (withSector.length > 0) {
    console.log('\n✅ Question sets WITH career_sector (no career_id):');
    withSector.forEach(q => {
      console.log(`   - "${q.title}"`);
      console.log(`     career_sector: "${q.career_sector}"`);
      console.log(`     career_cluster: ${q.career_cluster || 'NULL'}`);
      console.log(`     question_set_type: ${q.question_set_type || 'NULL'}`);
      console.log(`     subject: ${q.subject || 'NULL'}`);
      console.log(`     created_at: ${q.created_at}`);
      console.log('');
    });
  }

  if (withoutSector.length > 0) {
    console.log('\n❌ Question sets WITHOUT career_sector (no career_id):');
    withoutSector.forEach(q => {
      console.log(`   - "${q.title}"`);
      console.log(`     career_cluster: ${q.career_cluster || 'NULL'}`);
      console.log(`     question_set_type: ${q.question_set_type || 'NULL'}`);
      console.log(`     subject: ${q.subject || 'NULL'}`);
      console.log(`     created_at: ${q.created_at}`);
      console.log('');
    });
  }

  // 2. Check if there's a pattern in the data
  console.log('📈 Patterns:');

  // Group by question_set_type
  const typeGroups = {};
  nullCareerIdSets.forEach(q => {
    const type = q.question_set_type || 'NULL';
    if (!typeGroups[type]) {
      typeGroups[type] = { withSector: 0, withoutSector: 0 };
    }
    if (q.career_sector) {
      typeGroups[type].withSector++;
    } else {
      typeGroups[type].withoutSector++;
    }
  });

  console.log('\n   By question_set_type:');
  Object.entries(typeGroups).forEach(([type, counts]) => {
    console.log(`   - ${type}:`);
    console.log(`     With career_sector: ${counts.withSector}`);
    console.log(`     Without career_sector: ${counts.withoutSector}`);
  });

  // 3. Check unique sector values
  const uniqueSectors = [...new Set(withSector.map(q => q.career_sector))];
  console.log(`\n   Unique career_sector values (${uniqueSectors.length}):`);
  uniqueSectors.forEach(sector => {
    const count = withSector.filter(q => q.career_sector === sector).length;
    console.log(`   - "${sector}" (${count} sets)`);
  });

  // 4. Check if career_sector matches any industry/sector from careers table
  if (uniqueSectors.length > 0) {
    console.log('\n🔗 Checking if career_sector values exist in careers table...');

    const { data: careersCheck } = await supabase
      .from('careers')
      .select('sector, industry')
      .limit(100);

    if (careersCheck && careersCheck.length > 0) {
      const careerSectors = [...new Set(careersCheck.map(c => c.sector).filter(Boolean))];
      const careerIndustries = [...new Set(careersCheck.map(c => c.industry).filter(Boolean))];

      console.log('\n   Careers table sectors:', careerSectors.slice(0, 10));
      console.log('   Careers table industries:', careerIndustries.slice(0, 10));

      console.log('\n   Comparison:');
      uniqueSectors.forEach(sector => {
        const inSectors = careerSectors.includes(sector);
        const inIndustries = careerIndustries.includes(sector);
        console.log(`   - "${sector}": ${inSectors ? '✅ matches careers.sector' : inIndustries ? '✅ matches careers.industry' : '❌ no match in careers table'}`);
      });
    }
  }
}

analyzeCareerSectorNull().catch(console.error);
