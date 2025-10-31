#!/usr/bin/env node
/**
 * Check Question Sets - Debug grade level filtering
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from packages/web directory
config({ path: join(__dirname, '../packages/web/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.error('URL:', supabaseUrl ? 'found' : 'missing');
  console.error('Key:', supabaseKey ? 'found' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuestionSets() {
  console.log('\n=== Checking ALL Question Sets ===\n');

  // Fetch all question sets
  const { data: sets, error } = await supabase
    .from('question_sets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching question sets:', error);
    return;
  }

  console.log(`Found ${sets.length} question set(s):\n`);

  for (const set of sets) {
    console.log(`ID: ${set.id}`);
    console.log(`Title: ${set.title}`);
    console.log(`Subject: ${set.subject}`);
    console.log(`Grade Levels: ${JSON.stringify(set.grade_level)}`);
    console.log(`Total Questions: ${set.total_questions}`);
    console.log(`Creator ID: ${set.creator_id}`);
    console.log(`Is Public: ${set.is_public}`);

    // Count actual questions
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('question_set_id', set.id);

    if (!countError) {
      console.log(`Actual Question Count: ${count}`);
    }

    console.log('\n---\n');
  }

  // Check if filtering by grade 6 works correctly
  console.log('\n=== Testing Grade 6 Filter ===\n');

  const grade6Sets = sets.filter((set) => {
    if (!set.grade_level || set.grade_level.length === 0) return true;
    return set.grade_level.includes(6);
  });

  console.log(`Question sets that include grade 6: ${grade6Sets.length}`);
  grade6Sets.forEach(set => {
    console.log(`  - ${set.title} (${set.total_questions} questions, grades: ${JSON.stringify(set.grade_level)})`);
  });
}

checkQuestionSets()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
