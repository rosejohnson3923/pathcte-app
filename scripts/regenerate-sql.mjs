/**
 * Regenerate SQL from JSON with proper CTE syntax
 */
import fs from 'fs/promises';

const teacherId = '0ae5001d-41f0-4969-86a9-96d8dc478a28';

async function generateSQL() {
  // Read the JSON file
  const jsonContent = await fs.readFile('pathcte-questions.json', 'utf-8');
  const questionSets = JSON.parse(jsonContent);

  const sql = [];

  sql.push('-- Pathcte Question Sets and Questions');
  sql.push('-- Generated: ' + new Date().toISOString());
  sql.push('-- Teacher ID: ' + teacherId);
  sql.push('-- Run this entire script in Supabase SQL Editor');
  sql.push('');
  sql.push('BEGIN;');
  sql.push('');

  questionSets.forEach((set, setIndex) => {
    sql.push(`-- ============================================`);
    sql.push(`-- Question Set ${setIndex + 1}: ${set.title}`);
    sql.push(`-- ============================================`);
    sql.push('');

    // Insert question set with CTE to capture the ID
    sql.push(`WITH new_set AS (`);
    sql.push(`  INSERT INTO question_sets (`);
    sql.push(`    creator_id, title, description, subject, career_sector,`);
    sql.push(`    grade_level, difficulty_level, tags, is_public, is_verified, total_questions`);
    sql.push(`  ) VALUES (`);
    sql.push(`    '${teacherId}',`);
    sql.push(`    '${set.title.replace(/'/g, "''")}',`);
    sql.push(`    '${set.description.replace(/'/g, "''")}',`);
    sql.push(`    '${set.subject}',`);
    sql.push(`    '${set.career_sector}',`);
    sql.push(`    ARRAY[${set.grade_level.join(', ')}],`);
    sql.push(`    '${set.difficulty_level}',`);
    sql.push(`    ARRAY['${set.tags.join("', '")}'],`);
    sql.push(`    true, true, ${set.total_questions}`);
    sql.push(`  ) RETURNING id`);
    sql.push(`)`);

    // Insert all questions for this set
    sql.push(`INSERT INTO questions (`);
    sql.push(`  question_set_id, question_text, question_type, options,`);
    sql.push(`  time_limit_seconds, points, order_index, difficulty`);
    sql.push(`)`);
    sql.push(`SELECT`);
    sql.push(`  new_set.id,`);
    sql.push(`  question_data.question_text,`);
    sql.push(`  question_data.question_type,`);
    sql.push(`  question_data.options,`);
    sql.push(`  question_data.time_limit_seconds,`);
    sql.push(`  question_data.points,`);
    sql.push(`  question_data.order_index,`);
    sql.push(`  question_data.difficulty`);
    sql.push(`FROM new_set, (`);
    sql.push(`  VALUES`);

    // Add all questions as VALUES
    set.questions.forEach((q, qIndex) => {
      const isLast = qIndex === set.questions.length - 1;
      const optionsJson = JSON.stringify(q.options).replace(/'/g, "''");
      const questionText = q.question_text.replace(/'/g, "''");

      sql.push(`    (`);
      sql.push(`      '${questionText}',`);
      sql.push(`      'multiple_choice',`);
      sql.push(`      '${optionsJson}'::jsonb,`);
      sql.push(`      ${q.time_limit_seconds || 30},`);
      sql.push(`      ${q.points || 10},`);
      sql.push(`      ${q.order_index},`);
      sql.push(`      '${q.difficulty}'`);
      sql.push(`    )${isLast ? '' : ','}`);
    });

    sql.push(`) AS question_data(`);
    sql.push(`  question_text, question_type, options, time_limit_seconds,`);
    sql.push(`  points, order_index, difficulty`);
    sql.push(`);`);
    sql.push('');
  });

  sql.push('COMMIT;');

  // Write the SQL file
  await fs.writeFile('pathcte-questions-runnable.sql', sql.join('\n'));

  console.log('✅ Generated pathcte-questions-runnable.sql');
  console.log('   This script can be run all at once in Supabase SQL Editor!');
}

generateSQL().catch(console.error);
