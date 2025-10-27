/**
 * Shared Types Export
 */

export * from './database.types';

// Additional UI/Application types
export interface PathkeyCardProps {
  pathkey: {
    id: string;
    name: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    image_url: string;
  };
  owned?: boolean;
  quantity?: number;
  onPress?: () => void;
}

export interface GameRoomState {
  sessionId: string;
  gameCode: string;
  status: 'waiting' | 'in_progress' | 'completed';
  players: PlayerState[];
  currentQuestionIndex: number;
  totalQuestions: number;
}

export interface PlayerState {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  score: number;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
}

export interface QuestionState {
  id: string;
  text: string;
  options: { text: string; index: number }[];
  imageUrl: string | null;
  timeLimit: number;
  points: number;
}

export interface AnswerResult {
  isCorrect: boolean;
  timeTaken: number;
  pointsAwarded: number;
  correctOptionIndex: number;
}
