/**
 * JoinGamePage
 * ============
 * Enter game code and join a live game session
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { Button, Input, Card, Spinner } from '../components/common';
import { useAuth } from '../hooks';
import { gameService } from '@pathket/shared';
import { useGameStore } from '@pathket/shared';
import { Gamepad2, Users, ArrowRight } from 'lucide-react';

export default function JoinGamePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { setSession, setCurrentPlayer, setIsHost } = useGameStore();

  const [gameCode, setGameCode] = useState('');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!gameCode.trim()) {
      setError('Please enter a game code');
      return;
    }

    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsJoining(true);

    try {
      const { player, session, error: joinError } = await gameService.joinGame({
        gameCode: gameCode.trim().toUpperCase(),
        displayName: displayName.trim(),
        userId: user?.id,
      });

      if (joinError || !player || !session) {
        throw joinError || new Error('Failed to join game');
      }

      // Update game store
      setSession(session);
      setCurrentPlayer(player);
      setIsHost(false);

      // Navigate to game lobby
      navigate(`/game/${session.id}/lobby`);
    } catch (err: any) {
      console.error('Error joining game:', err);
      setError(err.message || 'Failed to join game. Please check the code and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleGameCodeChange = (value: string) => {
    // Auto-uppercase and limit to 6 characters
    setGameCode(value.toUpperCase().slice(0, 6));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
            <Gamepad2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
            Join a Game
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the 6-character game code to join your teacher's game
          </p>
        </div>

        {/* Join Form */}
        <Card>
          <form onSubmit={handleJoin} className="space-y-6">
            {/* Game Code Input */}
            <div>
              <label htmlFor="gameCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Game Code
              </label>
              <Input
                id="gameCode"
                type="text"
                value={gameCode}
                onChange={(e) => handleGameCodeChange(e.target.value)}
                placeholder="ABC123"
                disabled={isJoining}
                className="text-center text-2xl font-bold tracking-widest uppercase"
                maxLength={6}
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ask your teacher for the game code
              </p>
            </div>

            {/* Display Name Input */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                disabled={isJoining}
                maxLength={30}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This name will be visible to other players
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={isJoining || !gameCode.trim() || !displayName.trim()}
              className="w-full"
            >
              {isJoining ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Joining...
                </>
              ) : (
                <>
                  Join Game
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card padding="md" className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center">
                  <Users className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Multiplayer Fun</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compete with your classmates in real-time games
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                  <Gamepad2 className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Earn Rewards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Win tokens and unlock pathkeys by playing games
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have a game code?{' '}
            <span className="text-purple-600 dark:text-purple-400 font-medium">Ask your teacher to host a game</span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
