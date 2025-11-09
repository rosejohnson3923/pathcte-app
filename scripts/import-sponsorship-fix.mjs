/**
 * Import Sponsorship Coordinator questions (fix for failed import)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../packages/web/.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

console.log('📥 Importing Sponsorship Coordinator questions...');

// Get the question set ID
const { data: questionSet } = await supabase
  .from('question_sets')
  .select('id')
  .eq('title', 'Sponsorship Coordinator - Career Exploration')
  .single();

if (!questionSet) {
  console.error('❌ Question set not found');
  process.exit(1);
}

// Load the fixed JSON
const data = JSON.parse(readFileSync(join(__dirname, '../../pathfinity-app/explore-careers-questions.json'), 'utf-8'));
const sponsorship = data.find(d => d.title.includes('Sponsorship Coordinator'));

// Insert questions
const questionsToInsert = sponsorship.questions.map((q, index) => ({
  question_set_id: questionSet.id,
  question_text: q.question_text,
  question_type: 'multiple_choice',
  options: q.options,
  time_limit_seconds: q.time_limit_seconds || 30,
  points: q.points || 10,
  order_index: index,
  difficulty: q.difficulty || 'medium',
  business_driver: q.business_driver || null,
}));

const { error } = await supabase.from('questions').insert(questionsToInsert);

if (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('✅ Inserted 12 questions for Sponsorship Coordinator');

// Show final summary
const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true });
console.log(`📊 Total questions in database: ${count}`);
