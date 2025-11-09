/**
 * Set All Question Sets to Mixed Difficulty
 * ==========================================
 * All question sets contain mixed difficulty questions, so set them all to 'mixed'
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

async function main() {
  console.log('🔧 Setting all question sets to difficulty_level = "mixed"\n');

  const { error } = await supabase
    .from('question_sets')
    .update({ difficulty_level: 'mixed' })
    .not('id', 'is', null);

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  const { count } = await supabase
    .from('question_sets')
    .select('*', { count: 'exact', head: true })
    .eq('difficulty_level', 'mixed');

  console.log(`✅ Updated ${count} question sets to difficulty_level = "mixed"`);
  console.log('\nNext step: Update the filter hook to query questions table for difficulty\n');
}

main().catch(console.error);
