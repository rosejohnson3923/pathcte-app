/**
 * Test Content Generation - Small Batch
 * ======================================
 * Generates questions for 2-3 question sets to verify the process works
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './packages/web/.env' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_KEY!
);

interface QuestionOption {
  text: string;
  is_correct: boolean;
}

interface GeneratedQuestion {
  question_text: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit_seconds: number;
  points: number;
}

interface QuestionSet {
  id: string;
  title: string;
  description: string;
  subject: string;
  career_sector: string;
  career_id: string | null;
  career_cluster: string | null;
  question_set_type: string;
}

interface ContentGap {
  questionSet: QuestionSet;
  current: { easy: number; medium: number; hard: number; total: number };
  needed: { easy: number; medium: number; hard: number; total: number };
}

async function analyzeContentGaps(): Promise<ContentGap[]> {
  console.log('📊 Analyzing content gaps...\n');

  // Get all question sets
  const { data: questionSets, error: setsError } = await supabase
    .from('question_sets')
    .select('*')
    .order('title');

  if (setsError) throw setsError;

  const gaps: ContentGap[] = [];

  for (const set of questionSets!) {
    // Get questions for this set
    const { data: questions } = await supabase
      .from('questions')
      .select('id, difficulty')
      .eq('question_set_id', set.id);

    const current = { easy: 0, medium: 0, hard: 0, total: questions?.length || 0 };

    questions?.forEach((q) => {
      const diff = q.difficulty as 'easy' | 'medium' | 'hard';
      if (diff in current) current[diff]++;
    });

    // Calculate what's needed to reach 10 of each difficulty
    const needed = {
      easy: Math.max(0, 10 - current.easy),
      medium: Math.max(0, 10 - current.medium),
      hard: Math.max(0, 10 - current.hard),
      total: 0
    };
    needed.total = needed.easy + needed.medium + needed.hard;

    // Only include if content is needed
    if (needed.total > 0) {
      gaps.push({
        questionSet: set,
        current,
        needed
      });
    }
  }

  return gaps;
}

async function generateQuestionsForGap(
  gap: ContentGap,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): Promise<GeneratedQuestion[]> {
  const { questionSet } = gap;

  console.log(`  🤖 Generating ${count} ${difficulty} questions...`);

  // Determine context based on question set type
  let context = '';
  if (questionSet.career_id) {
    context = `career-specific questions about the ${questionSet.title} profession`;
  } else if (questionSet.career_cluster) {
    context = `career cluster fundamentals questions about ${questionSet.title}`;
  } else {
    context = `industry fundamentals questions about ${questionSet.title}`;
  }

  const prompt = `Generate ${count} multiple-choice quiz questions for ${context}.

Requirements:
- Difficulty level: ${difficulty}
- Each question should have 4 answer options
- Exactly ONE option should be correct
- Questions should be educational and engaging
- Focus on: career paths, job responsibilities, required skills, education requirements, work environments, industry trends
- Avoid questions that are already common or repetitive
- Make questions specific and detailed

${difficulty === 'easy' ? '- Easy questions: Basic facts, definitions, simple concepts' : ''}
${difficulty === 'medium' ? '- Medium questions: Application of knowledge, scenarios, comparisons' : ''}
${difficulty === 'hard' ? '- Hard questions: Complex scenarios, analysis, advanced concepts' : ''}

Return ONLY a JSON object with a "questions" array:
{
  "questions": [
    {
      "question_text": "What is a key responsibility in this career?",
      "options": [
        {"text": "Correct answer", "is_correct": true},
        {"text": "Wrong answer 1", "is_correct": false},
        {"text": "Wrong answer 2", "is_correct": false},
        {"text": "Wrong answer 3", "is_correct": false}
      ],
      "difficulty": "${difficulty}",
      "time_limit_seconds": 30,
      "points": 10
    }
  ]
}

Generate ${count} questions now:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an educational content creator specializing in career education. You create accurate, engaging quiz questions at specified difficulty levels.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsed = JSON.parse(content);
    const questions = parsed.questions || [];

    console.log(`    ✅ Generated ${questions.length} ${difficulty} questions`);
    return questions;
  } catch (error) {
    console.error(`    ❌ Error generating ${difficulty} questions:`, error);
    return [];
  }
}

async function insertQuestions(
  questionSetId: string,
  questions: GeneratedQuestion[],
  startIndex: number
): Promise<void> {
  if (questions.length === 0) return;

  const questionsToInsert = questions.map((q, index) => ({
    question_set_id: questionSetId,
    question_text: q.question_text,
    question_type: 'multiple_choice',
    options: q.options,
    time_limit_seconds: q.time_limit_seconds || 30,
    points: q.points || 10,
    order_index: startIndex + index,
    difficulty: q.difficulty,
  }));

  const { error } = await supabase
    .from('questions')
    .insert(questionsToInsert);

  if (error) {
    console.error('    ❌ Error inserting questions:', error);
    throw error;
  }

  console.log(`    ✅ Inserted ${questions.length} questions`);
}

async function updateQuestionSetCount(questionSetId: string): Promise<void> {
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('question_set_id', questionSetId);

  await supabase
    .from('question_sets')
    .update({ total_questions: count || 0 })
    .eq('id', questionSetId);
}

async function fillGap(gap: ContentGap): Promise<void> {
  const { questionSet, current, needed } = gap;

  console.log(`\n📝 ${questionSet.title}`);
  console.log(`   Current: ${current.total} questions (${current.easy}E, ${current.medium}M, ${current.hard}H)`);
  console.log(`   Adding: ${needed.total} questions (${needed.easy}E, ${needed.medium}M, ${needed.hard}H)`);

  let currentIndex = current.total;
  const allGeneratedQuestions: GeneratedQuestion[] = [];

  // Generate Easy questions
  if (needed.easy > 0) {
    const easyQuestions = await generateQuestionsForGap(gap, 'easy', needed.easy);
    allGeneratedQuestions.push(...easyQuestions);
  }

  // Generate Medium questions
  if (needed.medium > 0) {
    const mediumQuestions = await generateQuestionsForGap(gap, 'medium', needed.medium);
    allGeneratedQuestions.push(...mediumQuestions);
  }

  // Generate Hard questions
  if (needed.hard > 0) {
    const hardQuestions = await generateQuestionsForGap(gap, 'hard', needed.hard);
    allGeneratedQuestions.push(...hardQuestions);
  }

  // Insert all questions
  if (allGeneratedQuestions.length > 0) {
    await insertQuestions(questionSet.id, allGeneratedQuestions, currentIndex);
    await updateQuestionSetCount(questionSet.id);
    console.log(`   ✨ Completed: ${questionSet.title}`);
  }

  // Small delay to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 2000));
}

async function main() {
  console.log('🧪 TEST RUN - Content Generation\n');
  console.log('Processing 3 question sets as a test\n');
  console.log('='.repeat(80) + '\n');

  try {
    // Analyze gaps
    const allGaps = await analyzeContentGaps();

    console.log(`Found ${allGaps.length} question sets needing content\n`);

    if (allGaps.length === 0) {
      console.log('✅ All question sets have sufficient content!');
      return;
    }

    // Select 3 diverse test sets: 1 Career, 1 Industry, 1 with the most need
    const careerGap = allGaps.find(g => g.questionSet.career_id !== null);
    const industryGap = allGaps.find(g => !g.questionSet.career_id && !g.questionSet.career_cluster);
    const worstGap = allGaps.sort((a, b) => b.needed.total - a.needed.total)[0];

    const testGaps = [careerGap, industryGap, worstGap].filter((g, i, arr) =>
      g && arr.findIndex(x => x?.questionSet.id === g.questionSet.id) === i
    ).slice(0, 3) as ContentGap[];

    console.log('📋 Test Sets Selected:\n');
    testGaps.forEach((gap, i) => {
      console.log(`${i + 1}. ${gap.questionSet.title} (${gap.questionSet.question_set_type})`);
      console.log(`   Need: ${gap.needed.total} questions (${gap.needed.easy}E, ${gap.needed.medium}M, ${gap.needed.hard}H)\n`);
    });

    const totalNeeded = testGaps.reduce((sum, gap) => sum + gap.needed.total, 0);
    console.log(`📊 Total questions to generate in test: ${totalNeeded}\n`);
    console.log('='.repeat(80));

    // Process each test gap
    let completed = 0;
    for (const gap of testGaps) {
      await fillGap(gap);
      completed++;
      console.log(`\n   Progress: ${completed}/${testGaps.length} sets completed`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Test run complete!');
    console.log(`\n✅ Processed ${testGaps.length} question sets`);
    console.log(`✅ Generated ${totalNeeded} new questions`);
    console.log('\n💡 If successful, run the full batch with:');
    console.log('   npx tsx scripts/fill-content-gaps.ts\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
