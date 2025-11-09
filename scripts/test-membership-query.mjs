/**
 * Test Question Set Membership Query
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

console.log('🧪 Testing New Membership Query Structure\n');

// Get first question set
const { data: sets } = await supabase
  .from('question_sets')
  .select('id, title')
  .limit(1)
  .single();

console.log(`Testing with: ${sets.title}\n`);

// Test the new join query (matches game.service.ts)
const { data: membershipData, error } = await supabase
  .from('question_set_membership')
  .select(`
    order_index,
    questions (*)
  `)
  .eq('question_set_id', sets.id)
  .order('order_index', { ascending: true });

if (error) {
  console.error('❌ Query error:', error);
  process.exit(1);
}

const questions = membershipData?.map(m => m.questions);

console.log(`✅ Query successful!`);
console.log(`  - Returned ${questions.length} questions`);
console.log(`  - First question: ${questions[0].question_text.substring(0, 60)}...`);
console.log(`  - Business driver: ${questions[0].business_driver}`);
console.log(`\n✅ game.service.ts query will work correctly!`);
