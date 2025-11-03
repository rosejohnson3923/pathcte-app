/**
 * Player Entity - Answer Processing & Scoring
 *
 * Manages individual player state including:
 * - Score calculation
 * - Answer history
 * - Connection status
 */

import * as df from 'durable-functions';
import { EntityHandler, EntityContext } from 'durable-functions';

export interface AnswerRecord {
  questionIndex: number;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  submittedAt: string; // ISO timestamp
  timeElapsed: number;
  pointsEarned: number;
}

export interface PlayerEntityState {
  playerId: string;
  sessionId: string;
  userId: string | null;
  displayName: string;

  score: number;
  correctAnswers: number;
  totalAnswers: number;
  answerHistory: AnswerRecord[];

  connectionStatus: 'active' | 'disconnected';
  lastSeenAt: string; // ISO timestamp
  joinedAt: string; // ISO timestamp
}

/**
 * Calculate speed bonus points based on answer time
 * Faster answers get more bonus points
 */
function calculateSpeedBonus(elapsed: number, timeLimit: number, basePoints: number): number {
  // Speed bonus: up to 20% of base points for very fast answers
  // Linear decay from 100% at 0s to 0% at timeLimit
  const speedRatio = Math.max(0, 1 - elapsed / timeLimit);
  const maxBonus = Math.floor(basePoints * 0.2);
  return Math.floor(maxBonus * speedRatio);
}

const playerEntity: EntityHandler<PlayerEntityState> = function (
  context: EntityContext<PlayerEntityState>
): void {
  const state = context.df.getState(() => ({
    playerId: '',
    sessionId: '',
    userId: null,
    displayName: '',
    score: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    answerHistory: [],
    connectionStatus: 'active' as const,
    lastSeenAt: new Date().toISOString(),
    joinedAt: new Date().toISOString(),
  }))!;

  switch (context.df.operationName) {
    case 'initialize': {
      const params = context.df.getInput() as {
        playerId: string;
        sessionId: string;
        userId: string | null;
        displayName: string;
      };

      state.playerId = params.playerId;
      state.sessionId = params.sessionId;
      state.userId = params.userId;
      state.displayName = params.displayName;
      state.score = 0;
      state.correctAnswers = 0;
      state.totalAnswers = 0;
      state.answerHistory = [];
      state.connectionStatus = 'active';
      state.joinedAt = new Date().toISOString();
      state.lastSeenAt = new Date().toISOString();

      context.df.setState(state);

      context.log(`[PlayerEntity] Initialized player ${params.displayName} (${params.playerId})`);

      context.df.return({ success: true, state });
      break;
    }

    case 'submitAnswer': {
      const params = context.df.getInput() as {
        questionIndex: number;
        questionId: string;
        selectedOptionIndex: number;
        submittedAt: string; // ISO timestamp
        question: {
          options: Array<{ is_correct: boolean }>;
          points: number;
          time_limit_seconds: number;
        };
        validation: {
          valid: boolean;
          elapsed: number;
          timeLimit: number;
          reason: string | null;
        };
      };

      // Validation already done by HTTP trigger calling Host Entity
      if (!params.validation.valid) {
        context.log(`[PlayerEntity] Answer rejected for ${state.displayName}: ${params.validation.reason}`);
        context.df.return({
          success: false,
          reason: params.validation.reason,
        });
        break;
      }

      // Check correctness
      const isCorrect = params.question.options[params.selectedOptionIndex].is_correct;

      // Calculate points (base points + speed bonus)
      const speedBonus = calculateSpeedBonus(
        params.validation.elapsed,
        params.validation.timeLimit,
        params.question.points
      );
      const pointsEarned = isCorrect ? params.question.points + speedBonus : 0;

      // Update state
      state.score += pointsEarned;
      state.totalAnswers += 1;
      if (isCorrect) state.correctAnswers += 1;

      const answerRecord: AnswerRecord = {
        questionIndex: params.questionIndex,
        questionId: params.questionId,
        selectedOptionIndex: params.selectedOptionIndex,
        isCorrect,
        submittedAt: params.submittedAt,
        timeElapsed: params.validation.elapsed,
        pointsEarned,
      };

      state.answerHistory.push(answerRecord);
      state.lastSeenAt = new Date().toISOString();

      context.df.setState(state);

      context.log(
        `[PlayerEntity] ${state.displayName} answered Q${params.questionIndex + 1}: ` +
          `${isCorrect ? 'CORRECT' : 'WRONG'} (+${pointsEarned} pts, total: ${state.score})`
      );

      context.df.return({
        success: true,
        isCorrect,
        pointsEarned,
        speedBonus,
        newScore: state.score,
        correctAnswers: state.correctAnswers,
        totalAnswers: state.totalAnswers,
      });
      break;
    }

    case 'handleDisconnect': {
      state.connectionStatus = 'disconnected';
      state.lastSeenAt = new Date().toISOString();

      context.df.setState(state);

      context.log(`[PlayerEntity] Player ${state.displayName} disconnected`);

      context.df.return({ success: true });
      break;
    }

    case 'handleReconnect': {
      state.connectionStatus = 'active';
      state.lastSeenAt = new Date().toISOString();

      context.df.setState(state);

      context.log(`[PlayerEntity] Player ${state.displayName} reconnected`);

      context.df.return({
        success: true,
        playerState: state,
      });
      break;
    }

    case 'getState': {
      state.lastSeenAt = new Date().toISOString();
      context.df.setState(state);

      context.df.return(state);
      break;
    }

    case 'getScoreSummary': {
      context.df.return({
        playerId: state.playerId,
        displayName: state.displayName,
        score: state.score,
        correctAnswers: state.correctAnswers,
        totalAnswers: state.totalAnswers,
        accuracy: state.totalAnswers > 0 ? (state.correctAnswers / state.totalAnswers) * 100 : 0,
      });
      break;
    }

    default:
      context.log(`[PlayerEntity] Unknown operation: ${context.df.operationName}`);
      break;
  }
};

df.app.entity('PlayerEntity', playerEntity);

export default playerEntity;
