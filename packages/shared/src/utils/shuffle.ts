/**
 * Shuffle Utilities
 * ==================
 * Deterministic shuffling for consistent randomization across all clients
 */

import type { QuestionOption } from '../types/database.types';

/**
 * Extended QuestionOption with original index tracking
 */
export interface ShuffledOption extends QuestionOption {
  originalIndex: number;
}

/**
 * Simple seeded random number generator (LCG algorithm)
 * Returns a pseudo-random number between 0 and 1
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2147483647;
    return state / 2147483647;
  };
}

/**
 * Create a numeric seed from a string (question ID)
 */
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Shuffle an array using Fisher-Yates algorithm with a seeded RNG
 * This ensures the same shuffle for all clients viewing the same question
 *
 * @param array - Array to shuffle
 * @param seed - Seed for deterministic shuffling (use question.id)
 * @returns Shuffled array (new array, doesn't modify original)
 */
export function seededShuffle<T>(array: T[], seed: string | number): T[] {
  const shuffled = [...array];
  const numericSeed = typeof seed === 'string' ? stringToSeed(seed) : seed;
  const random = seededRandom(numericSeed);

  // Fisher-Yates shuffle with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Shuffle question options while tracking original indices
 * This is critical for submitting answers with the correct database index
 *
 * @param options - Original question options from database
 * @param questionId - Question ID to use as shuffle seed
 * @returns Shuffled options with originalIndex property
 */
export function shuffleQuestionOptions(
  options: QuestionOption[],
  questionId: string
): ShuffledOption[] {
  // Add original indices
  const optionsWithIndices: ShuffledOption[] = options.map((opt, index) => ({
    ...opt,
    originalIndex: index,
  }));

  // Shuffle using question ID as seed
  return seededShuffle(optionsWithIndices, questionId);
}
