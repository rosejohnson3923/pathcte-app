/**
 * Host Entity - Timer Authority & Question Progression Control
 *
 * This entity is the single source of truth for:
 * - Current question state
 * - Timer state and expiration
 * - Question progression (auto or manual)
 * - Player answer tracking
 */

import * as df from 'durable-functions';
import { EntityHandler, EntityContext } from 'durable-functions';

export interface Question {
  id: string;
  question_text: string;
  options: Array<{
    text: string;
    is_correct: boolean;
  }>;
  time_limit_seconds: number;
  points: number;
}

export interface HostEntityState {
  sessionId: string;
  questionSetId: string;
  questions: Question[];

  currentQuestionIndex: number;
  currentQuestionStartedAt: string | null; // ISO string for JSON serialization
  currentQuestionTimeLimit: number;

  progressionControl: 'manual' | 'auto';
  allowLateJoin: boolean;

  playersAnswered: string[]; // Changed from Set to array for JSON serialization
  totalPlayers: number;
}

const hostEntity: EntityHandler<HostEntityState> = function (
  context: EntityContext<HostEntityState>
): void {
  const state = context.df.getState(() => ({
    sessionId: '',
    questionSetId: '',
    questions: [],
    currentQuestionIndex: -1,
    currentQuestionStartedAt: null,
    currentQuestionTimeLimit: 0,
    progressionControl: 'manual' as const,
    allowLateJoin: false,
    playersAnswered: [],
    totalPlayers: 0,
  }))!;

  switch (context.df.operationName) {
    case 'initialize': {
      const params = context.df.getInput() as {
        sessionId: string;
        questionSetId: string;
        questions: Question[];
        progressionControl: 'manual' | 'auto';
        allowLateJoin: boolean;
        totalPlayers: number;
      };

      state.sessionId = params.sessionId;
      state.questionSetId = params.questionSetId;
      state.questions = params.questions;
      state.progressionControl = params.progressionControl;
      state.allowLateJoin = params.allowLateJoin;
      state.totalPlayers = params.totalPlayers;
      state.currentQuestionIndex = -1;
      state.playersAnswered = [];

      context.df.setState(state);

      context.log(`[HostEntity] Initialized for session ${params.sessionId} with ${params.questions.length} questions`);

      context.df.return({ success: true });
      break;
    }

    case 'startQuestion': {
      const questionIndex = context.df.getInput() as number;

      if (questionIndex < 0 || questionIndex >= state.questions.length) {
        context.df.return({ success: false, error: 'Invalid question index' });
        break;
      }

      const question = state.questions[questionIndex];

      // Update state
      state.currentQuestionIndex = questionIndex;
      state.currentQuestionStartedAt = new Date().toISOString();
      state.currentQuestionTimeLimit = question.time_limit_seconds;
      state.playersAnswered = [];

      context.df.setState(state);

      context.log(`[HostEntity] Starting question ${questionIndex + 1}/${state.questions.length}`);

      // Signal activity to update Supabase and broadcast
      // Note: Can't call activities from entities directly - orchestrator should handle this
      // For now, return data and let HTTP trigger call the activity

      context.df.return({
        success: true,
        questionIndex,
        question,
        startedAt: state.currentQuestionStartedAt,
        timeLimit: state.currentQuestionTimeLimit,
      });
      break;
    }

    case 'advanceQuestion': {
      const nextIndex = state.currentQuestionIndex + 1;

      if (nextIndex < state.questions.length) {
        context.log(`[HostEntity] Advancing to question ${nextIndex + 1}/${state.questions.length}`);

        // Update to next question
        const question = state.questions[nextIndex];
        state.currentQuestionIndex = nextIndex;
        state.currentQuestionStartedAt = new Date().toISOString();
        state.currentQuestionTimeLimit = question.time_limit_seconds;
        state.playersAnswered = [];

        context.df.setState(state);

        context.df.return({
          success: true,
          nextIndex,
          question,
          hasMore: true,
          startedAt: state.currentQuestionStartedAt,
          timeLimit: state.currentQuestionTimeLimit,
        });
      } else {
        // Game complete
        context.log(`[HostEntity] All questions complete, ending game`);

        context.df.return({ success: true, hasMore: false });
      }
      break;
    }

    case 'validateAnswerTiming': {
      const params = context.df.getInput() as {
        playerId: string;
        submittedAt: string; // ISO timestamp
      };

      if (!state.currentQuestionStartedAt) {
        context.df.return({ valid: false, reason: 'Question not started' });
        break;
      }

      const submittedDate = new Date(params.submittedAt);
      const startedDate = new Date(state.currentQuestionStartedAt);
      const elapsed = (submittedDate.getTime() - startedDate.getTime()) / 1000;
      const isValid = elapsed >= 0 && elapsed <= state.currentQuestionTimeLimit;

      if (isValid && !state.playersAnswered.includes(params.playerId)) {
        // Mark player as answered
        state.playersAnswered.push(params.playerId);
        context.df.setState(state);

        context.log(
          `[HostEntity] Player ${params.playerId} answered (${state.playersAnswered.length}/${state.totalPlayers})`
        );
      }

      context.df.return({
        valid: isValid,
        elapsed,
        timeLimit: state.currentQuestionTimeLimit,
        reason: isValid ? null : 'Answer submitted after time limit',
        answeredCount: state.playersAnswered.length,
        totalPlayers: state.totalPlayers,
      });
      break;
    }

    case 'getTimerState': {
      if (!state.currentQuestionStartedAt || state.currentQuestionIndex < 0) {
        context.df.return(null);
        break;
      }

      const now = new Date();
      const startedDate = new Date(state.currentQuestionStartedAt);
      const elapsed = (now.getTime() - startedDate.getTime()) / 1000;
      const remaining = Math.max(0, state.currentQuestionTimeLimit - elapsed);

      context.df.return({
        questionIndex: state.currentQuestionIndex,
        question: state.questions[state.currentQuestionIndex],
        startedAt: state.currentQuestionStartedAt,
        timeLimit: state.currentQuestionTimeLimit,
        elapsed,
        remaining,
        answeredCount: state.playersAnswered.length,
        totalPlayers: state.totalPlayers,
      });
      break;
    }

    case 'getState': {
      context.df.return(state);
      break;
    }

    case 'updatePlayerCount': {
      const count = context.df.getInput() as number;
      state.totalPlayers = count;
      context.df.setState(state);

      context.log(`[HostEntity] Player count updated to ${count}`);

      context.df.return({ success: true, totalPlayers: count });
      break;
    }

    default:
      context.log(`[HostEntity] Unknown operation: ${context.df.operationName}`);
      break;
  }
};

df.app.entity('HostEntity', hostEntity);

export default hostEntity;
