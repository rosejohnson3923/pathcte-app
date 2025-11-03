/**
 * PathCTE Azure Durable Functions Entry Point
 *
 * Imports all HTTP triggers to register them with the Functions runtime
 * The app.http() calls at the bottom of each file will execute on module load
 */

// Import HTTP triggers to register them (app.http() executes as side effect)
import './http/submitAnswer';
import './http/startQuestion';
import './http/advanceQuestion';
import './http/getTimerState';
import './http/initializeGame';

// Entities
export { default as HostEntity } from './entities/HostEntity';
export { default as PlayerEntity } from './entities/PlayerEntity';

// Orchestrators
export {
  callHostEntity,
  callPlayerEntity,
  initializeGameOrchestrator,
  startQuestionOrchestrator,
  advanceQuestionOrchestrator,
  submitAnswerOrchestrator,
} from './orchestrators/entityCallers';

// Activities
export { broadcastQuestionStarted } from './activities/broadcastQuestionStarted';
export { recordAnswer } from './activities/recordAnswer';
export { updatePlayerScore } from './activities/updatePlayerScore';
export { updatePlayerStatus } from './activities/updatePlayerStatus';
export { broadcastGameEnded } from './activities/broadcastGameEnded';
