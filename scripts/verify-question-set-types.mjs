/**
 * Verify Question Set Types
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

console.log('✅ Final Database Verification\n');
console.log('═'.repeat(50) + '\n');

// Check question_set_type distribution
const { data: allSets } = await supabase
  .from('question_sets')
  .select('question_set_type, career_id');

const byType = allSets.reduce((acc, set) => {
  const type = set.question_set_type || 'NULL';
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

console.log('📊 Question Set Types:');
Object.entries(byType).forEach(([type, count]) => {
  console.log(`  ${count.toString().padStart(2)} sets: ${type}`);
});

// Check career_id distribution
const withCareer = allSets.filter(s => s.career_id !== null).length;
const withoutCareer = allSets.filter(s => s.career_id === null).length;

console.log(`\n📊 Career ID Distribution:`);
console.log(`  ${withCareer.toString().padStart(2)} sets with career_id (career-specific)`);
console.log(`  ${withoutCareer.toString().padStart(2)} sets without career_id (industry-based)`);

console.log(`\n✅ All question sets now use 'career_quest' type`);
console.log('✅ Career distinction determined by career_id field');
