/**
 * Game Store
 * ===========
 * Zustand store for game state management
 */

import { create } from 'zustand';
import type {
  GameSession,
  GamePlayer,
  Question,
} from '../types/database.types';

export interface GameState {
  // Current game session
  session: GameSession | null;

  // Player info
  currentPlayer: GamePlayer | null;
  players: GamePlayer[];

  // Questions
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question | null;

  // Game flow
  isHost: boolean;
  isLoading: boolean;
  error: string | null;

  // Timing
  questionStartTime: number | null;
  timeRemaining: number | null;

  // Actions
  setSession: (session: GameSession | null) => void;
  setCurrentPlayer: (player: GamePlayer | null) => void;
  setPlayers: (players: GamePlayer[]) => void;
  addPlayer: (player: GamePlayer) => void;
  updatePlayer: (playerId: string, updates: Partial<GamePlayer>) => void;
  removePlayer: (playerId: string) => void;

  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;

  setIsHost: (isHost: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  startQuestionTimer: () => void;
  stopQuestionTimer: () => void;
  updateTimeRemaining: (time: number) => void;

  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  session: null,
  currentPlayer: null,
  players: [],
  questions: [],
  currentQuestionIndex: -1,
  currentQuestion: null,
  isHost: false,
  isLoading: false,
  error: null,
  questionStartTime: null,
  timeRemaining: null,

  // Session actions
  setSession: (session) => set({ session }),

  // Player actions
  setCurrentPlayer: (player) => set({ currentPlayer: player }),

  setPlayers: (players) => set({ players }),

  addPlayer: (player) => set((state) => ({
    players: [...state.players, player],
  })),

  updatePlayer: (playerId, updates) => set((state) => ({
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, ...updates } : p
    ),
  })),

  removePlayer: (playerId) => set((state) => ({
    players: state.players.filter((p) => p.id !== playerId),
  })),

  // Question actions
  setQuestions: (questions) => set({
    questions,
    currentQuestionIndex: questions.length > 0 ? 0 : -1,
    currentQuestion: questions.length > 0 ? questions[0] : null,
  }),

  setCurrentQuestionIndex: (index) => set((state) => ({
    currentQuestionIndex: index,
    currentQuestion: state.questions[index] || null,
  })),

  nextQuestion: () => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex < state.questions.length) {
      return {
        currentQuestionIndex: nextIndex,
        currentQuestion: state.questions[nextIndex],
        questionStartTime: Date.now(),
        timeRemaining: state.questions[nextIndex]?.time_limit_seconds || null,
      };
    }
    return state;
  }),

  // UI state actions
  setIsHost: (isHost) => set({ isHost }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Timer actions
  startQuestionTimer: () => set((state) => ({
    questionStartTime: Date.now(),
    timeRemaining: state.currentQuestion?.time_limit_seconds || null,
  })),

  stopQuestionTimer: () => set({
    questionStartTime: null,
    timeRemaining: null,
  }),

  updateTimeRemaining: (time) => set({ timeRemaining: time }),

  // Reset
  resetGame: () => set({
    session: null,
    currentPlayer: null,
    players: [],
    questions: [],
    currentQuestionIndex: -1,
    currentQuestion: null,
    isHost: false,
    isLoading: false,
    error: null,
    questionStartTime: null,
    timeRemaining: null,
  }),
}));
