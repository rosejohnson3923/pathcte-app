/**
 * HostGamePage
 * =============
 * Create and configure a new game session (teacher view)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { Button, Input, Card, Spinner, Badge } from '../components/common';
import { useAuth } from '../hooks';
import { gameService, useGameStore } from '@pathket/shared';
import { Gamepad2, Settings, Users, BookOpen, Play } from 'lucide-react';
import type { GameMode } from '@pathket/shared';

// For now, we'll use a mock question set. In Week 4, this will come from useQuestionSets hook
const MOCK_QUESTION_SET = {
  id: 'mock-set-1',
  title: 'Career Exploration Basics',
  total_questions: 10,
};

const GAME_MODES: { value: GameMode; label: string; description: string }[] = [
  {
    value: 'career_quest',
    label: 'Career Quest',
    description: 'Classic quiz mode with career-themed questions',
  },
  {
    value: 'speed_run',
    label: 'Speed Run',
    description: 'Fast-paced questions with time pressure',
  },
  {
    value: 'team_challenge',
    label: 'Team Challenge',
    description: 'Collaborative team-based gameplay',
  },
];

export default function HostGamePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSession, setIsHost } = useGameStore();

  const [selectedQuestionSet] = useState(MOCK_QUESTION_SET.id);
  const [selectedMode, setSelectedMode] = useState<GameMode>('career_quest');
  const [maxPlayers, setMaxPlayers] = useState(30);
  const [isPublic, setIsPublic] = useState(true);
  const [allowLateJoin, setAllowLateJoin] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGame = async () => {
    if (!user) {
      setError('You must be logged in to host a game');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { session, error: createError } = await gameService.createGame({
        hostId: user.id,
        questionSetId: selectedQuestionSet,
        gameMode: selectedMode,
        maxPlayers,
        isPublic,
        allowLateJoin,
      });

      if (createError || !session) {
        throw createError || new Error('Failed to create game');
      }

      // Update game store
      setSession(session);
      setIsHost(true);

      // Navigate to game lobby
      navigate(`/game/${session.id}/lobby`);
    } catch (err: any) {
      console.error('Error creating game:', err);
      setError(err.message || 'Failed to create game. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
            <Gamepad2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
            Host a Game
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a live multiplayer game for your students
          </p>
        </div>

        {/* Configuration Form */}
        <div className="space-y-6">
          {/* Question Set Selection */}
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Question Set</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose which questions to use for this game
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{MOCK_QUESTION_SET.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {MOCK_QUESTION_SET.total_questions} questions
                  </p>
                </div>
                <Badge variant="info">Selected</Badge>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Note: Custom question sets will be available in a future update
            </p>
          </Card>

          {/* Game Mode Selection */}
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Game Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select the gameplay style
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {GAME_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setSelectedMode(mode.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedMode === mode.value
                      ? 'border-purple-500 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{mode.label}</h4>
                    {selectedMode === mode.value && (
                      <Badge variant="success">Selected</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{mode.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Game Settings */}
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Settings className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure game options
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Max Players */}
              <div>
                <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Players
                </label>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-gray-400 dark:text-gray-500" />
                  <Input
                    id="maxPlayers"
                    type="number"
                    min={1}
                    max={100}
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value) || 30)}
                    className="max-w-xs"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 20-40 for classroom size
                </p>
              </div>

              {/* Public/Private */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Public Game</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow anyone with the code to join
                    </p>
                  </div>
                </label>
              </div>

              {/* Allow Late Join */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowLateJoin}
                    onChange={(e) => setAllowLateJoin(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Allow Late Join</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Let players join after the game starts
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Create Game Button */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleCreateGame}
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating Game...
                </>
              ) : (
                <>
                  <Play size={20} className="mr-2" />
                  Create Game
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Next Steps</h4>
          <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
            <li>Click "Create Game" to generate your game code</li>
            <li>Share the code with your students</li>
            <li>Wait for students to join in the lobby</li>
            <li>Start the game when ready!</li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
