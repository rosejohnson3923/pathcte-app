/**
 * useQuestionSets Hook
 * =====================
 * Question set management for teachers
 */

import { useFetchMany, useFetchOne, useInsertOne, useUpdateOne, useDeleteOne } from './useSupabase';
import { useAuth } from './useAuth';
import type { QuestionSet, Question } from '@pathket/shared';

/**
 * Fetch all question sets (public + user's own)
 */
export const useQuestionSets = () => {
  const { user } = useAuth();

  return useFetchMany<QuestionSet>('question_sets', undefined, {
    enabled: !!user,
    select: (data) => {
      // Filter to show only public sets OR sets created by the current user
      if (!user) return [];
      return data.filter((set) => set.is_public || set.creator_id === user.id);
    },
  });
};

/**
 * Fetch question sets created by the current user
 */
export const useMyQuestionSets = () => {
  const { user } = useAuth();

  return useFetchMany<QuestionSet>('question_sets', user ? { creator_id: user.id } : undefined, {
    enabled: !!user,
  });
};

/**
 * Fetch public question sets
 */
export const usePublicQuestionSets = () => {
  return useFetchMany<QuestionSet>('question_sets', { is_public: true });
};

/**
 * Fetch a specific question set by ID
 */
export const useQuestionSet = (questionSetId: string | undefined) => {
  return useFetchOne<QuestionSet>('question_sets', questionSetId);
};

/**
 * Fetch questions for a specific question set
 */
export const useQuestions = (questionSetId: string | undefined) => {
  return useFetchMany<Question>(
    'questions',
    questionSetId ? { question_set_id: questionSetId } : undefined,
    {
      enabled: !!questionSetId,
      select: (data) => {
        // Sort by order_index
        return [...data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      },
    }
  );
};

/**
 * Create a new question set
 */
export const useCreateQuestionSet = () => {
  return useInsertOne<QuestionSet>('question_sets');
};

/**
 * Update a question set
 */
export const useUpdateQuestionSet = () => {
  return useUpdateOne<QuestionSet>('question_sets');
};

/**
 * Delete a question set
 */
export const useDeleteQuestionSet = () => {
  return useDeleteOne('question_sets');
};

/**
 * Create a new question
 */
export const useCreateQuestion = () => {
  return useInsertOne<Question>('questions');
};

/**
 * Update a question
 */
export const useUpdateQuestion = () => {
  return useUpdateOne<Question>('questions');
};

/**
 * Delete a question
 */
export const useDeleteQuestion = () => {
  return useDeleteOne('questions');
};

/**
 * Filter question sets by criteria
 */
export const useFilteredQuestionSets = (filters: {
  subject?: string;
  grade_level?: number;
  career_sector?: string;
  difficulty?: string;
  search?: string;
  exploration_type?: 'all' | 'industry' | 'career' | 'subject';
}) => {
  const { data, ...rest } = useQuestionSets();

  const filteredData = data?.filter((set) => {
    // Exploration Type filter
    if (filters.exploration_type && filters.exploration_type !== 'all') {
      if (filters.exploration_type === 'industry') {
        // Industry: career_id IS NULL
        if (set.career_id !== null) return false;
      } else if (filters.exploration_type === 'career') {
        // Career: career_id IS NOT NULL
        if (set.career_id === null) return false;
      } else if (filters.exploration_type === 'subject') {
        // Subject filter handled below
        // Allow both career_id NULL and NOT NULL, just filter by subject
      }
    }

    // Subject filter (only applies when exploration_type is 'subject' or not set)
    if (filters.subject && set.subject !== filters.subject) return false;

    // Grade level filter
    if (filters.grade_level && set.grade_level && !set.grade_level.includes(filters.grade_level)) {
      return false;
    }

    // Career sector filter
    if (filters.career_sector && set.career_sector !== filters.career_sector) return false;

    // Difficulty filter
    if (filters.difficulty && set.difficulty_level !== filters.difficulty) return false;

    // Search filter (title or description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = set.title.toLowerCase().includes(searchLower);
      const descMatch = set.description?.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch) return false;
    }

    // Note: business_driver is NOT filtered here
    // It's stored in game session settings and applied when loading questions

    return true;
  });

  return {
    ...rest,
    data: filteredData,
  };
};
