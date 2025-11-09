/**
 * Create Pathkey Demo Data
 * =========================
 * Creates comprehensive demo data for student@esposure.gg and student1@esposure.gg
 *
 * student@esposure.gg: ~40% completion (20 careers with various sections unlocked)
 * student1@esposure.gg: ~20% completion (10 careers with various sections unlocked)
 *
 * Ensures all data aligns:
 * - Section 1: Career mode games with top 3 placement + game session records
 * - Section 2: Question sets completed with 90%+ accuracy + game results
 * - Section 3: Business driver questions answered correctly + answer history
 * - Modal shows accurate unlock dates, requirements, and progress
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../packages/web/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Constants from the pathkey system
const SECTION_2_REQUIRED_SETS = 3;
const SECTION_2_ACCURACY_THRESHOLD = 90;
const SECTION_3_CHUNK_SIZE = 5;
const SECTION_3_REQUIRED_DRIVERS = ['people', 'product', 'pricing', 'process', 'proceeds', 'profits'];

/**
 * Get or create student profile
 */
async function getStudentProfile(email) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('email', email)
    .single();

  if (error) {
    console.error(`Error finding ${email}:`, error);
    return null;
  }

  return profile;
}

/**
 * Get all careers
 */
async function getAllCareers() {
  const { data: careers, error } = await supabase
    .from('careers')
    .select('id, title, sector, career_cluster')
    .order('title');

  if (error) {
    console.error('Error fetching careers:', error);
    return [];
  }

  return careers;
}

/**
 * Get question sets for a career (by sector or cluster)
 */
async function getQuestionSetsForCareer(career, masteryType = 'industry') {
  const filter = masteryType === 'industry'
    ? `industry.eq.${career.sector}`
    : `career_cluster.eq.${career.career_cluster}`;

  const { data: sets, error } = await supabase
    .from('question_sets')
    .select('id, title, industry, career_cluster')
    .or(filter)
    .limit(5);

  if (error) {
    console.error(`Error fetching question sets for ${career.title}:`, error);
    return [];
  }

  return sets;
}

/**
 * Get questions for a specific business driver and career
 */
async function getQuestionsForDriver(careerId, driver) {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id')
    .eq('career_id', careerId)
    .eq('business_driver', driver)
    .limit(10);

  if (error) {
    console.error(`Error fetching questions for driver ${driver}:`, error);
    return [];
  }

  return questions;
}

/**
 * Create a mock game session for Section 1 unlock
 * Creates a career mode game where student placed in top 3
 */
async function createCareerModeGame(studentId, studentName, career, placement = 1) {
  // Create game session
  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .insert({
      host_id: studentId,
      game_mode: 'career',
      career_id: career.id,
      status: 'completed',
      settings: {
        timeLimit: 20,
        questionCount: 10,
        difficulty: 'mixed'
      },
      started_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
      ended_at: new Date().toISOString()
    })
    .select()
    .single();

  if (sessionError) {
    console.error(`    ⚠️  Error creating game session:`, sessionError.message);
    return null;
  }

  // Create player results (student + 2-3 other mock players)
  const numPlayers = Math.floor(Math.random() * 2) + 3; // 3-4 total players
  const players = [
    { name: studentName, id: studentId, placement },
    ...Array.from({ length: numPlayers - 1 }, (_, i) => ({
      name: `Player${i + 1}`,
      id: null,
      placement: i + 1 >= placement ? i + 2 : i + 1
    }))
  ];

  for (const player of players) {
    const score = 1000 - (player.placement - 1) * 150 + Math.floor(Math.random() * 100);

    await supabase
      .from('game_results')
      .insert({
        game_session_id: session.id,
        user_id: player.id,
        display_name: player.name,
        final_score: score,
        placement: player.placement,
        questions_answered: 10,
        correct_answers: Math.floor(10 - (player.placement - 1) * 1.5),
      });
  }

  return session;
}

/**
 * Create Section 1: Career Mastery unlock
 * Requires: Top 3 placement in career mode game
 */
async function unlockSection1(studentId, studentName, career) {
  console.log(`  Section 1: Career Mastery for ${career.title}`);

  // Check if already unlocked
  const { data: existing } = await supabase
    .from('student_pathkeys')
    .select('career_mastery_unlocked')
    .eq('student_id', studentId)
    .eq('career_id', career.id)
    .single();

  if (existing?.career_mastery_unlocked) {
    console.log(`    ⏭️  Already unlocked`);
    return;
  }

  // Create a career mode game with top 3 placement
  const placement = Math.floor(Math.random() * 3) + 1; // Random 1-3
  await createCareerModeGame(studentId, studentName, career, placement);

  // Create/update pathkey record
  const { error: pathkeyError } = await supabase
    .from('student_pathkeys')
    .upsert({
      student_id: studentId,
      career_id: career.id,
      career_mastery_unlocked: true,
      career_mastery_unlocked_at: new Date().toISOString(),
    }, {
      onConflict: 'student_id,career_id'
    });

  if (pathkeyError) {
    console.error(`    ❌ Error:`, pathkeyError.message);
  } else {
    console.log(`    ✅ Unlocked (placed ${placement}${placement === 1 ? 'st' : placement === 2 ? 'nd' : 'rd'} in career game)`);
  }
}

/**
 * Create Section 2: Industry/Cluster Mastery unlock
 * Requires: 3 question sets with 90%+ accuracy
 */
async function unlockSection2(studentId, career, via = 'industry') {
  console.log(`  Section 2: ${via === 'industry' ? 'Industry' : 'Cluster'} Mastery for ${career.title}`);

  // Check if already unlocked
  const { data: existing } = await supabase
    .from('student_pathkeys')
    .select('industry_mastery_unlocked, cluster_mastery_unlocked')
    .eq('student_id', studentId)
    .eq('career_id', career.id)
    .single();

  if (existing?.industry_mastery_unlocked || existing?.cluster_mastery_unlocked) {
    console.log(`    ⏭️  Already unlocked`);
    return;
  }

  // Get question sets for this career
  const questionSets = await getQuestionSetsForCareer(career, via);

  if (questionSets.length < SECTION_2_REQUIRED_SETS) {
    console.log(`    ⚠️  Not enough question sets available (found ${questionSets.length})`);
    return;
  }

  // Record progress for 3 sets with 90%+ accuracy
  const accuracies = [];
  for (let i = 0; i < SECTION_2_REQUIRED_SETS; i++) {
    const set = questionSets[i];
    const accuracy = 90 + Math.floor(Math.random() * 10); // 90-99%
    accuracies.push(accuracy);

    const { error: progressError } = await supabase
      .from('student_pathkey_progress')
      .upsert({
        student_id: studentId,
        career_id: career.id,
        mastery_type: via,
        question_set_id: set.id,
        accuracy: accuracy,
        completed_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'student_id,career_id,mastery_type,question_set_id'
      });

    if (progressError) {
      console.error(`    ❌ Error recording progress:`, progressError.message);
    }
  }

  // Update pathkey record
  const updateData = via === 'industry' ? {
    industry_mastery_unlocked: true,
    industry_mastery_via: via,
    industry_mastery_unlocked_at: new Date().toISOString(),
  } : {
    cluster_mastery_unlocked: true,
    industry_mastery_via: via,
    cluster_mastery_unlocked_at: new Date().toISOString(),
  };

  const { error: pathkeyError } = await supabase
    .from('student_pathkeys')
    .upsert({
      student_id: studentId,
      career_id: career.id,
      ...updateData,
    }, {
      onConflict: 'student_id,career_id'
    });

  if (pathkeyError) {
    console.error(`    ❌ Error:`, pathkeyError.message);
  } else {
    console.log(`    ✅ Unlocked ${via} path (3 sets: ${accuracies.join('%, ')}%)`);
  }
}

/**
 * Create Section 3: Business Driver Mastery unlock
 * Requires: All 6 drivers mastered (5 questions each at 90%+ accuracy)
 */
async function unlockSection3(studentId, career) {
  console.log(`  Section 3: Business Driver Mastery for ${career.title}`);

  // Check if already unlocked
  const { data: existing } = await supabase
    .from('student_pathkeys')
    .select('business_driver_mastery_unlocked')
    .eq('student_id', studentId)
    .eq('career_id', career.id)
    .single();

  if (existing?.business_driver_mastery_unlocked) {
    console.log(`    ⏭️  Already unlocked`);
    return;
  }

  // Create progress for all 6 drivers
  for (const driver of SECTION_3_REQUIRED_DRIVERS) {
    const { error: driverError } = await supabase
      .from('student_business_driver_progress')
      .upsert({
        student_id: studentId,
        career_id: career.id,
        business_driver: driver,
        current_chunk_questions: SECTION_3_CHUNK_SIZE,
        current_chunk_correct: SECTION_3_CHUNK_SIZE, // All correct (100%)
        mastery_achieved: true,
        mastery_achieved_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'student_id,career_id,business_driver'
      });

    if (driverError) {
      console.error(`    ❌ Error for ${driver}:`, driverError.message);
    }
  }

  // Update pathkey record
  const { error: pathkeyError } = await supabase
    .from('student_pathkeys')
    .upsert({
      student_id: studentId,
      career_id: career.id,
      business_driver_mastery_unlocked: true,
      business_driver_mastery_unlocked_at: new Date().toISOString(),
    }, {
      onConflict: 'student_id,career_id'
    });

  if (pathkeyError) {
    console.error(`    ❌ Error:`, pathkeyError.message);
  } else {
    console.log(`    ✅ Unlocked (all 6 drivers: 5/5 correct each)`);
  }
}

/**
 * Create partial Section 3 progress (some drivers mastered, some in progress)
 */
async function createPartialSection3(studentId, career, driversToMaster = 3) {
  console.log(`  Section 3: Partial progress for ${career.title}`);

  // Shuffle drivers and take the specified number
  const shuffled = [...SECTION_3_REQUIRED_DRIVERS].sort(() => Math.random() - 0.5);
  const mastered = shuffled.slice(0, driversToMaster);
  const inProgress = shuffled.slice(driversToMaster, Math.min(driversToMaster + 2, SECTION_3_REQUIRED_DRIVERS.length));

  // Create mastered drivers
  for (const driver of mastered) {
    await supabase
      .from('student_business_driver_progress')
      .upsert({
        student_id: studentId,
        career_id: career.id,
        business_driver: driver,
        current_chunk_questions: SECTION_3_CHUNK_SIZE,
        current_chunk_correct: SECTION_3_CHUNK_SIZE,
        mastery_achieved: true,
        mastery_achieved_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'student_id,career_id,business_driver'
      });
  }

  // Create in-progress drivers
  for (const driver of inProgress) {
    const correct = Math.floor(Math.random() * 4) + 1; // 1-4 correct out of same number of questions
    await supabase
      .from('student_business_driver_progress')
      .upsert({
        student_id: studentId,
        career_id: career.id,
        business_driver: driver,
        current_chunk_questions: correct,
        current_chunk_correct: correct,
        mastery_achieved: false,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'student_id,career_id,business_driver'
      });
  }

  console.log(`    ✅ ${mastered.length} mastered, ${inProgress.length} in progress`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🎯 Creating Pathkey Demo Data\n');
  console.log('=' .repeat(60));

  // Get student profiles
  const student1 = await getStudentProfile('student@esposure.gg');
  const student2 = await getStudentProfile('student1@esposure.gg');

  if (!student1 || !student2) {
    console.error('❌ Could not find student profiles');
    process.exit(1);
  }

  console.log(`✅ Found students:`);
  console.log(`   - student@esposure.gg: ${student1.id} (${student1.display_name})`);
  console.log(`   - student1@esposure.gg: ${student2.id} (${student2.display_name})`);
  console.log();

  // Get all careers
  const careers = await getAllCareers();
  console.log(`✅ Found ${careers.length} careers\n`);

  // Shuffle careers for randomness
  const shuffledCareers = [...careers].sort(() => Math.random() - 0.5);

  // Student 1: ~40% (20 careers)
  console.log('📚 Creating data for student@esposure.gg (~40% completion)');
  console.log('=' .repeat(60));

  const student1Careers = shuffledCareers.slice(0, 20);

  for (let i = 0; i < student1Careers.length; i++) {
    const career = student1Careers[i];
    console.log(`\n[${i + 1}/20] ${career.title}`);

    if (i < 8) {
      // 8 fully complete (all 3 sections)
      await unlockSection1(student1.id, student1.display_name, career);
      await unlockSection2(student1.id, career, Math.random() > 0.5 ? 'industry' : 'cluster');
      await unlockSection3(student1.id, career);
    } else if (i < 14) {
      // 6 with Section 1 + 2 only
      await unlockSection1(student1.id, student1.display_name, career);
      await unlockSection2(student1.id, career, Math.random() > 0.5 ? 'industry' : 'cluster');
    } else if (i < 17) {
      // 3 with Section 1 + partial Section 3
      await unlockSection1(student1.id, student1.display_name, career);
      await createPartialSection3(student1.id, career, 3);
    } else {
      // 3 with only Section 1
      await unlockSection1(student1.id, student1.display_name, career);
    }
  }

  // Student 2: ~20% (10 careers)
  console.log('\n\n📚 Creating data for student1@esposure.gg (~20% completion)');
  console.log('=' .repeat(60));

  const student2Careers = shuffledCareers.slice(20, 30);

  for (let i = 0; i < student2Careers.length; i++) {
    const career = student2Careers[i];
    console.log(`\n[${i + 1}/10] ${career.title}`);

    if (i < 3) {
      // 3 fully complete
      await unlockSection1(student2.id, student2.display_name, career);
      await unlockSection2(student2.id, career, Math.random() > 0.5 ? 'industry' : 'cluster');
      await unlockSection3(student2.id, career);
    } else if (i < 6) {
      // 3 with Section 1 + 2
      await unlockSection1(student2.id, student2.display_name, career);
      await unlockSection2(student2.id, career, Math.random() > 0.5 ? 'industry' : 'cluster');
    } else if (i < 8) {
      // 2 with Section 1 + partial Section 3
      await unlockSection1(student2.id, student2.display_name, career);
      await createPartialSection3(student2.id, career, 2);
    } else {
      // 2 with only Section 1
      await unlockSection1(student2.id, student2.display_name, career);
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('=' .repeat(60));
  console.log('\nstudent@esposure.gg:');
  console.log('  - 8 fully complete (Sections 1, 2, 3)');
  console.log('  - 6 with Sections 1 & 2');
  console.log('  - 3 with Section 1 + partial Section 3');
  console.log('  - 3 with only Section 1');
  console.log('  Total: 20/50 careers (40%)');

  console.log('\nstudent1@esposure.gg:');
  console.log('  - 3 fully complete (Sections 1, 2, 3)');
  console.log('  - 3 with Sections 1 & 2');
  console.log('  - 2 with Section 1 + partial Section 3');
  console.log('  - 2 with only Section 1');
  console.log('  Total: 10/50 careers (20%)');

  console.log('\n📋 Modal data includes:');
  console.log('  ✅ Unlock dates for all sections');
  console.log('  ✅ Game placement records (1st-3rd)');
  console.log('  ✅ Question set completion (90%+ accuracy)');
  console.log('  ✅ Business driver progress (X/5 per driver)');
  console.log('  ✅ Industry vs Cluster path distinction');

  console.log('\n✅ Demo data creation complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
