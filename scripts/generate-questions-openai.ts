/**
 * Generate Question Sets Using OpenAI
 * ===================================
 * This script uses OpenAI to generate realistic question sets and questions
 * for the Pathcte platform, then inserts them into Supabase.
 *
 * Usage:
 *   npm install openai dotenv
 *   npx tsx scripts/generate-questions-openai.ts
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
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Question set topics and themes
const QUESTION_SET_TEMPLATES = [
  {
    title: 'Healthcare Careers Fundamentals',
    description: 'Essential knowledge about careers in healthcare and medicine',
    subject: 'Healthcare',
    career_sector: 'Healthcare',
    grade_level: [9, 10, 11, 12],
    difficulty_level: 'medium' as const,
    tags: ['healthcare', 'medicine', 'nursing', 'medical'],
  },
  {
    title: 'Technology & Engineering Basics',
    description: 'Introduction to careers in technology, software, and engineering',
    subject: 'Technology',
    career_sector: 'Technology',
    grade_level: [9, 10, 11, 12],
    difficulty_level: 'medium' as const,
    tags: ['technology', 'engineering', 'software', 'computer science'],
  },
  {
    title: 'Business & Finance Careers',
    description: 'Explore careers in business, finance, and entrepreneurship',
    subject: 'Business',
    career_sector: 'Business',
    grade_level: [10, 11, 12],
    difficulty_level: 'medium' as const,
    tags: ['business', 'finance', 'accounting', 'management'],
  },
  {
    title: 'Creative Arts & Design',
    description: 'Careers in art, design, media, and creative industries',
    subject: 'Arts',
    career_sector: 'Arts & Entertainment',
    grade_level: [9, 10, 11, 12],
    difficulty_level: 'easy' as const,
    tags: ['art', 'design', 'creative', 'media'],
  },
  {
    title: 'Science & Research Careers',
    description: 'Careers in scientific research, laboratory work, and discovery',
    subject: 'Science',
    career_sector: 'Science',
    grade_level: [10, 11, 12],
    difficulty_level: 'hard' as const,
    tags: ['science', 'research', 'laboratory', 'biology', 'chemistry'],
  },
  {
    title: 'Education & Teaching',
    description: 'Explore careers in education, teaching, and training',
    subject: 'Education',
    career_sector: 'Education',
    grade_level: [9, 10, 11, 12],
    difficulty_level: 'easy' as const,
    tags: ['education', 'teaching', 'training', 'school'],
  },
  {
    title: 'Public Service & Law',
    description: 'Careers in law enforcement, legal services, and public safety',
    subject: 'Public Service',
    career_sector: 'Public Service',
    grade_level: [10, 11, 12],
    difficulty_level: 'medium' as const,
    tags: ['law', 'legal', 'public service', 'government'],
  },
  {
    title: 'Environmental & Agriculture',
    description: 'Careers in environmental science, conservation, and agriculture',
    subject: 'Environmental Science',
    career_sector: 'Agriculture',
    grade_level: [9, 10, 11, 12],
    difficulty_level: 'medium' as const,
    tags: ['environment', 'conservation', 'agriculture', 'sustainability'],
  },
];

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

async function generateQuestionsForSet(
  template: typeof QUESTION_SET_TEMPLATES[0],
  numQuestions: number = 10
): Promise<GeneratedQuestion[]> {
  console.log(`\n🤖 Generating ${numQuestions} questions for: ${template.title}`);

  const prompt = `Generate ${numQuestions} multiple-choice quiz questions about careers in ${template.subject}.

Requirements:
- Questions should be educational and appropriate for grades ${template.grade_level.join('-')}
- Focus on: career paths, job responsibilities, required skills, education requirements, work environments
- Difficulty level: ${template.difficulty_level}
- Each question should have 4 answer options
- Exactly ONE option should be correct
- Questions should be engaging and informative
- Avoid trick questions

Return ONLY a JSON array with this exact structure:
[
  {
    "question_text": "What is the primary responsibility of a nurse?",
    "options": [
      {"text": "Provide patient care and support", "is_correct": true},
      {"text": "Perform surgery", "is_correct": false},
      {"text": "Manage hospital finances", "is_correct": false},
      {"text": "Design medical equipment", "is_correct": false}
    ],
    "difficulty": "easy",
    "time_limit_seconds": 30,
    "points": 10
  }
]

Generate ${numQuestions} questions now:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an educational content creator specializing in career education for high school students. You create engaging, accurate quiz questions.',
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

    // Parse the response
    const parsed = JSON.parse(content);

    // Handle both array and object with questions array
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];

    console.log(`✅ Generated ${questions.length} questions`);
    return questions;
  } catch (error) {
    console.error('❌ Error generating questions:', error);
    throw error;
  }
}

async function insertQuestionSet(
  template: typeof QUESTION_SET_TEMPLATES[0],
  creatorId: string
): Promise<string> {
  console.log(`\n📝 Creating question set: ${template.title}`);

  const { data, error } = await supabase
    .from('question_sets')
    .insert({
      creator_id: creatorId,
      title: template.title,
      description: template.description,
      subject: template.subject,
      career_sector: template.career_sector,
      grade_level: template.grade_level,
      difficulty_level: template.difficulty_level,
      tags: template.tags,
      is_public: true,
      is_verified: true,
      total_questions: 0, // Will update after adding questions
    })
    .select('id')
    .single();

  if (error) {
    console.error('❌ Error creating question set:', error);
    throw error;
  }

  console.log(`✅ Question set created with ID: ${data.id}`);
  return data.id;
}

async function insertQuestions(
  questionSetId: string,
  questions: GeneratedQuestion[]
): Promise<void> {
  console.log(`\n📚 Inserting ${questions.length} questions...`);

  const questionsToInsert = questions.map((q, index) => ({
    question_set_id: questionSetId,
    question_text: q.question_text,
    question_type: 'multiple_choice',
    options: q.options,
    time_limit_seconds: q.time_limit_seconds || 30,
    points: q.points || 10,
    order_index: index,
    difficulty: q.difficulty,
  }));

  const { error } = await supabase
    .from('questions')
    .insert(questionsToInsert);

  if (error) {
    console.error('❌ Error inserting questions:', error);
    throw error;
  }

  // Update question set with total_questions count
  const { error: updateError } = await supabase
    .from('question_sets')
    .update({ total_questions: questions.length })
    .eq('id', questionSetId);

  if (updateError) {
    console.error('⚠️ Warning: Could not update question count:', updateError);
  }

  console.log(`✅ Successfully inserted ${questions.length} questions`);
}

async function getOrCreateTeacherUser(): Promise<string> {
  console.log('\n👤 Finding or creating teacher user...');

  // First, try to find an existing teacher
  const { data: existingTeacher } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_type', 'teacher')
    .limit(1)
    .single();

  if (existingTeacher) {
    console.log(`✅ Using existing teacher: ${existingTeacher.id}`);
    return existingTeacher.id;
  }

  console.log('⚠️ No teacher found. Please create a teacher account first.');
  console.log('   Go to /signup and create an account with user_type="teacher"');
  throw new Error('No teacher account found');
}

async function main() {
  console.log('🚀 Starting Question Generation Script\n');
  console.log('='.repeat(50));

  try {
    // Get teacher user ID
    const teacherId = await getOrCreateTeacherUser();

    // Generate and insert question sets
    for (const template of QUESTION_SET_TEMPLATES) {
      console.log('\n' + '='.repeat(50));

      // Generate questions using OpenAI
      const questions = await generateQuestionsForSet(template, 10);

      // Insert question set
      const questionSetId = await insertQuestionSet(template, teacherId);

      // Insert questions
      await insertQuestions(questionSetId, questions);

      console.log(`\n✨ Completed: ${template.title}`);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All question sets generated successfully!');
    console.log(`\nTotal question sets created: ${QUESTION_SET_TEMPLATES.length}`);
    console.log(`Total questions created: ${QUESTION_SET_TEMPLATES.length * 10}`);

  } catch (error) {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
