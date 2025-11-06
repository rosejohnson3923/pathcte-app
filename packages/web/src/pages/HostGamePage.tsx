/**
 * HostGamePage
 * =============
 * Create and configure a new game session (teacher view)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { Button, Input, Card, Spinner, Badge } from '../components/common';
import { useAuth, useFilteredQuestionSets } from '../hooks';
import { gameService, useGameStore } from '@pathcte/shared';
import { Gamepad2, Settings, Users, BookOpen, Play, ChevronDown, UserCheck, Filter } from 'lucide-react';
import type { GameMode, SessionType } from '@pathcte/shared';

const GAME_MODES: { value: GameMode; label: string; description: string }[] = [
  {
    value: 'career_quest',
    label: 'Career Quest',
    description: 'Classic quiz mode: +25 points correct, -10 incorrect/no answer',
  },
  {
    value: 'speed_run',
    label: 'Lightning! Path',
    description: 'Auto-only speed mode: +25 points correct, -10 incorrect/no answer',
  },
];

export default function HostGamePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSession, setIsHost } = useGameStore();

  // Filter state
  const [explorationTypeFilter, setExplorationTypeFilter] = useState<'industry' | 'career' | 'cluster' | ''>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');

  // Fetch question sets with filtering
  const { data: questionSets, isLoading: loadingQuestionSets } = useFilteredQuestionSets({
    exploration_type: explorationTypeFilter || undefined,
    difficulty: difficultyFilter || undefined,
  });

  const [selectedQuestionSet, setSelectedQuestionSet] = useState<string>('');
  const [sessionType, setSessionType] = useState<SessionType>('multiplayer');
  const [selectedMode, setSelectedMode] = useState<GameMode>('career_quest');
  const [maxPlayers, setMaxPlayers] = useState(30);
  const [isPublic, setIsPublic] = useState(true);
  const [allowLateJoin, setAllowLateJoin] = useState(false);
  const [progressionControl, setProgressionControl] = useState<'auto' | 'manual'>('manual');
  const [questionCount, setQuestionCount] = useState<number>(30);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-select first question set when loaded
  if (questionSets && questionSets.length > 0 && !selectedQuestionSet) {
    setSelectedQuestionSet(questionSets[0].id);
  }

  // Get selected question set details
  const selectedSet = questionSets?.find((set) => set.id === selectedQuestionSet);

  // Auto-adjust question count when question set changes
  React.useEffect(() => {
    if (selectedSet && questionCount > selectedSet.total_questions) {
      // Find the highest available tier
      const availableTiers = [10, 15, 20, 25, 30].filter(t => t <= selectedSet.total_questions);
      setQuestionCount(availableTiers[availableTiers.length - 1] || selectedSet.total_questions);
    }
  }, [selectedSet, questionCount]);

  const handleCreateGame = async () => {
    if (!user) {
      setError('You must be logged in to host a game');
      return;
    }

    if (!selectedQuestionSet) {
      setError('Please select a question set');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { session, error: createError } = await gameService.createGame({
        hostId: user.id,
        questionSetId: selectedQuestionSet,
        gameMode: selectedMode,
        sessionType,
        maxPlayers: sessionType === 'solo' ? 1 : maxPlayers,
        isPublic: sessionType === 'solo' ? false : isPublic,
        allowLateJoin: sessionType === 'solo' ? false : allowLateJoin,
        settings: {
          progressionControl: sessionType === 'solo' || selectedMode === 'speed_run' ? 'auto' : progressionControl,
          questionCount: questionCount,
          difficulty: difficultyFilter || undefined,
        },
      } as any);

      if (createError || !session) {
        throw createError || new Error('Failed to create game');
      }

      // Update game store
      setSession(session);
      setIsHost(true);

      // Solo practice: Auto-join and start immediately
      if (sessionType === 'solo') {
        // Join as the only player
        await gameService.joinGame({
          gameCode: session.game_code,
          displayName: (user as any).display_name || 'Teacher',
          userId: user.id,
        });

        // Auto-start
        await gameService.startGame(session.id);

        // Go directly to game (skip lobby)
        navigate(`/game/${session.id}`);
      } else {
        // Multiplayer: Go to lobby
        navigate(`/game/${session.id}/lobby`);
      }
    } catch (err: any) {
      console.error('Error creating game:', err);

      // Provide helpful error messages for common issues
      let errorMessage = err.message || 'Failed to create game. Please try again.';

      if (errorMessage.includes('No questions found')) {
        errorMessage += '\n\nTip: Try selecting "All Difficulty Levels" or choose a different difficulty.';
      }

      setError(errorMessage);
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

            {/* Exploration Type Filter (Required Parent Filter) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  Exploration Type <span className="text-red-500">*</span>
                </div>
              </label>
              <div className="relative">
                <select
                  value={explorationTypeFilter}
                  onChange={(e) => {
                    const value = e.target.value as 'industry' | 'career' | 'cluster' | '';
                    setExplorationTypeFilter(value);
                    // Reset selection when filter changes
                    setSelectedQuestionSet('');
                  }}
                  className="w-full px-4 py-2.5 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">Select Exploration Type...</option>
                  <option value="industry">Industry</option>
                  <option value="career">Career</option>
                  <option value="cluster">Cluster</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  Difficulty Level
                </div>
              </label>
              <div className="relative">
                <select
                  value={difficultyFilter}
                  onChange={(e) => {
                    setDifficultyFilter(e.target.value);
                    setSelectedQuestionSet(''); // Reset selection when filter changes
                  }}
                  className="w-full px-4 py-2.5 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">All Difficulty Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>


            {/* Question Set Selection - Only shown after Exploration Type is selected */}
            {explorationTypeFilter && (
              <div className="mb-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    Select Question Set <span className="text-red-500">*</span>
                  </div>
                </label>

                {loadingQuestionSets ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner size="md" />
                  </div>
                ) : questionSets && questionSets.length > 0 ? (
                  <div className="relative">
                    <select
                      value={selectedQuestionSet}
                      onChange={(e) => setSelectedQuestionSet(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                      {questionSets.map((set) => (
                        <option key={set.id} value={set.id}>
                          {set.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <BookOpen size={40} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-1">No question sets available</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Try adjusting your filters or create a new question set
                    </p>
                  </div>
                )}
              </div>
            )}

                {selectedSet && (
                  <>
                    <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                              {selectedSet.subject}
                            </p>
                            {selectedSet.difficulty_level && (
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  selectedSet.difficulty_level === 'easy'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : selectedSet.difficulty_level === 'medium'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                }`}
                              >
                                {selectedSet.difficulty_level}
                              </span>
                            )}
                          </div>
                          {selectedSet.description && (
                            <p className="text-xs text-blue-800 dark:text-blue-400">
                              {selectedSet.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question Count Selection */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                      <label className="block text-sm font-medium text-text-secondary mb-3">
                        Number of Questions
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[10, 15, 20, 25, 30].map((count) => {
                          const isAvailable = count <= selectedSet.total_questions;
                          return (
                            <button
                              key={count}
                              onClick={() => isAvailable && setQuestionCount(count)}
                              disabled={!isAvailable}
                              className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                                questionCount === count && isAvailable
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                  : isAvailable
                                  ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100'
                                  : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                              }`}
                            >
                              {count}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Questions will be randomly selected from the pool of {selectedSet.total_questions} available
                      </p>
                    </div>
                  </>
                )}
          </Card>

          {/* Session Type Selection */}
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <UserCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Session Type</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose between practice or multiplayer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Multiplayer */}
              <button
                onClick={() => setSessionType('multiplayer')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  sessionType === 'multiplayer'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className={sessionType === 'multiplayer' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'} />
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Multiplayer</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Students join with code
                </p>
                {sessionType === 'multiplayer' && (
                  <div className="mt-2">
                    <Badge variant="success">Selected</Badge>
                  </div>
                )}
              </button>

              {/* Solo Practice */}
              <button
                onClick={() => setSessionType('solo')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  sessionType === 'solo'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck size={20} className={sessionType === 'solo' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'} />
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Solo Practice</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Test questions yourself
                </p>
                {sessionType === 'solo' && (
                  <div className="mt-2">
                    <Badge variant="success">Selected</Badge>
                  </div>
                )}
              </button>
            </div>

            {sessionType === 'solo' && (
              <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  💡 Solo Practice lets you test your questions before using them in a live game. You'll play through as a student would.
                </p>
              </div>
            )}
          </Card>

          {/* Game Mode and Settings (only for multiplayer) */}
          {sessionType === 'multiplayer' && (
            <>
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

              {/* Progression Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Progression
                </label>
                {selectedMode === 'speed_run' ? (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      ⚡ Lightning! Path Mode: Auto Only
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      This fast-paced mode automatically advances questions when the timer expires
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        progressionControl === 'manual'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}>
                        <input
                          type="radio"
                          name="progressionControl"
                          value="manual"
                          checked={progressionControl === 'manual'}
                          onChange={(e) => setProgressionControl(e.target.value as 'manual')}
                          className="sr-only"
                        />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Manual
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          You control when to advance to the next question
                        </span>
                      </label>

                      <label className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        progressionControl === 'auto'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}>
                        <input
                          type="radio"
                          name="progressionControl"
                          value="auto"
                          checked={progressionControl === 'auto'}
                          onChange={(e) => setProgressionControl(e.target.value as 'auto')}
                          className="sr-only"
                        />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Auto
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Automatically advance when timer expires
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Choose how questions progress during gameplay
                    </p>
                  </>
                )}
              </div>
            </div>
          </Card>
          </>
          )}

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
                  {sessionType === 'solo' ? 'Starting Practice...' : 'Creating Game...'}
                </>
              ) : (
                <>
                  <Play size={20} className="mr-2" />
                  {sessionType === 'solo' ? 'Start Solo Practice' : 'Create Game'}
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
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            {sessionType === 'solo' ? 'How Solo Practice Works' : 'Next Steps'}
          </h4>
          {sessionType === 'solo' ? (
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Click "Start Solo Practice" to begin immediately</li>
              <li>You'll play through as if you were a student</li>
              <li>Test question difficulty, timing, and correctness</li>
              <li>Perfect for validating new question sets!</li>
            </ul>
          ) : (
            <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>Click "Create Game" to generate your game code</li>
              <li>Share the code with your students</li>
              <li>Wait for students to join in the lobby</li>
              <li>Start the game when ready!</li>
            </ol>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
