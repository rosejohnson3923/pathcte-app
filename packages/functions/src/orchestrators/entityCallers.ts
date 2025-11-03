/**
 * Entity Caller Orchestrators
 *
 * Wrapper orchestrators that call entities and return results.
 * In Durable Functions v3, entities must be called from orchestrators,
 * not directly from HTTP triggers.
 */

import * as df from 'durable-functions';
import { OrchestrationContext, OrchestrationHandler, EntityId } from 'durable-functions';

/**
 * Calls a Host Entity operation
 */
const callHostEntity: OrchestrationHandler = function* (context: OrchestrationContext) {
  const input: {
    sessionId: string;
    operation: string;
    operationInput?: any;
  } = context.df.getInput();

  const entityId = new EntityId('HostEntity', input.sessionId);

  const result = yield context.df.callEntity(entityId, input.operation, input.operationInput);

  return result;
};

/**
 * Calls a Player Entity operation
 */
const callPlayerEntity: OrchestrationHandler = function* (context: OrchestrationContext) {
  const input: {
    playerId: string;
    operation: string;
    operationInput?: any;
  } = context.df.getInput();

  const entityId = new EntityId('PlayerEntity', input.playerId);

  const result = yield context.df.callEntity(entityId, input.operation, input.operationInput);

  return result;
};

/**
 * Initializes game with Host Entity and multiple Player Entities
 */
const initializeGameOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const input: {
    sessionId: string;
    questionSetId: string;
    questions: any[];
    progressionControl: 'manual' | 'auto';
    allowLateJoin: boolean;
    players: Array<{
      id: string;
      userId: string | null;
      displayName: string;
    }>;
  } = context.df.getInput();

  // Initialize Host Entity
  const hostEntityId = new EntityId('HostEntity', input.sessionId);

  const hostResult = yield context.df.callEntity(hostEntityId, 'initialize', {
    sessionId: input.sessionId,
    questionSetId: input.questionSetId,
    questions: input.questions,
    progressionControl: input.progressionControl || 'manual',
    allowLateJoin: input.allowLateJoin || false,
    totalPlayers: input.players.length,
  });

  // Initialize Player Entities in parallel
  const playerTasks = input.players.map((player) => {
    const playerEntityId = new EntityId('PlayerEntity', player.id);
    return context.df.callEntity(playerEntityId, 'initialize', {
      playerId: player.id,
      sessionId: input.sessionId,
      userId: player.userId,
      displayName: player.displayName,
    });
  });

  const playerResults = yield context.df.Task.all(playerTasks);

  return {
    success: true,
    sessionId: input.sessionId,
    hostInitialized: hostResult.success,
    playersInitialized: playerResults.length,
    players: input.players.map((player, i) => ({
      playerId: player.id,
      result: playerResults[i],
    })),
  };
};

/**
 * Orchestrator for starting questions
 * Starts question on Host Entity and broadcasts to players
 */
const startQuestionOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const input: {
    sessionId: string;
    questionIndex: number;
  } = context.df.getInput();

  // 1. Start question on Host Entity
  const hostEntityId = new EntityId('HostEntity', input.sessionId);

  const result = yield context.df.callEntity(hostEntityId, 'startQuestion', input.questionIndex);

  // 2. Broadcast to players (if successful)
  if (result.success) {
    yield context.df.callActivity('broadcastQuestionStarted', {
      sessionId: input.sessionId,
      questionIndex: result.questionIndex,
      question: result.question,
      startedAt: result.startedAt,
      timeLimit: result.timeLimit,
    });
  }

  return result;
};

/**
 * Orchestrator for advancing questions
 * Advances to next question on Host Entity and broadcasts to players
 */
const advanceQuestionOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const input: {
    sessionId: string;
  } = context.df.getInput();

  // 1. Advance question on Host Entity
  const hostEntityId = new EntityId('HostEntity', input.sessionId);

  const result = yield context.df.callEntity(hostEntityId, 'advanceQuestion');

  // 2. Broadcast to players (if there's a next question)
  if (result.success && result.hasMore) {
    yield context.df.callActivity('broadcastQuestionStarted', {
      sessionId: input.sessionId,
      questionIndex: result.nextIndex,
      question: result.question,
      startedAt: result.startedAt,
      timeLimit: result.timeLimit,
    });
  }

  return result;
};

/**
 * Orchestrator for submitting answers
 * Validates with Host Entity, updates Player Entity, and persists to database
 */
const submitAnswerOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const input: {
    playerId: string;
    sessionId: string;
    questionIndex: number;
    questionId: string;
    selectedOptionIndex: number;
    submittedAt: string;
    question: any;
  } = context.df.getInput();

  // 1. Validate timing with Host Entity
  const hostEntityId = new EntityId('HostEntity', input.sessionId);

  const validation = yield context.df.callEntity(hostEntityId, 'validateAnswerTiming', {
    playerId: input.playerId,
    submittedAt: input.submittedAt,
  });

  // 2. Submit answer to Player Entity
  const playerEntityId = new EntityId('PlayerEntity', input.playerId);

  const result = yield context.df.callEntity(playerEntityId, 'submitAnswer', {
    questionIndex: input.questionIndex,
    questionId: input.questionId,
    selectedOptionIndex: input.selectedOptionIndex,
    submittedAt: input.submittedAt,
    question: input.question,
    validation,
  });

  // 3. Persist answer to database (if validation passed)
  if (result.success) {
    yield context.df.callActivity('recordAnswer', {
      playerId: input.playerId,
      sessionId: input.sessionId,
      questionId: input.questionId,
      selectedOptionIndex: input.selectedOptionIndex,
      isCorrect: result.isCorrect,
      timeElapsed: validation.elapsed,
      pointsEarned: result.pointsEarned,
    });
  }

  return result;
};

// Register orchestrators
df.app.orchestration('callHostEntity', callHostEntity);
df.app.orchestration('callPlayerEntity', callPlayerEntity);
df.app.orchestration('initializeGameOrchestrator', initializeGameOrchestrator);
df.app.orchestration('startQuestionOrchestrator', startQuestionOrchestrator);
df.app.orchestration('advanceQuestionOrchestrator', advanceQuestionOrchestrator);
df.app.orchestration('submitAnswerOrchestrator', submitAnswerOrchestrator);

export {
  callHostEntity,
  callPlayerEntity,
  initializeGameOrchestrator,
  startQuestionOrchestrator,
  advanceQuestionOrchestrator,
  submitAnswerOrchestrator,
};
