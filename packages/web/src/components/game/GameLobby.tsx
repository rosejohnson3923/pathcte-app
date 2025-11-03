/**
 * GameLobby Component
 * ===================
 * Pre-game lobby showing connected players and game code
 */

import { useEffect, useState } from 'react';
import { Card, Badge, Button, Spinner } from '../common';
import { Users, Copy, Check, Crown, Wifi, WifiOff, Gamepad2 } from 'lucide-react';
import { useGameStore } from '@pathcte/shared';
import { gameService } from '@pathcte/shared';

export interface GameLobbyProps {
  sessionId: string;
  isHost: boolean;
  onStartGame?: () => void;
  onLeaveGame?: () => void;
  isStartingGame?: boolean;
}

export const GameLobby: React.FC<GameLobbyProps> = ({
  sessionId,
  isHost,
  onStartGame,
  onLeaveGame,
  isStartingGame = false,
}) => {
  const { session, players, setPlayers } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);

  // Load initial players
  useEffect(() => {
    const loadPlayers = async () => {
      setIsLoadingPlayers(true);
      const { players: initialPlayers } = await gameService.getGamePlayers(sessionId);
      if (initialPlayers) {
        setPlayers(initialPlayers);
      }
      setIsLoadingPlayers(false);
    };

    loadPlayers();
  }, [sessionId, setPlayers]);

  // NOTE: GamePage handles all realtime subscriptions
  // We don't subscribe here to avoid conflicts

  const handleCopyCode = async () => {
    if (session?.game_code) {
      await navigator.clipboard.writeText(session.game_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canStartGame = isHost && players.length > 0;

  if (!session) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Code Card */}
      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <div className="text-center">
          <p className="text-purple-100 text-sm font-medium mb-2">Game Code</p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-5xl font-bold tracking-widest font-mono">
              {session.game_code}
            </h2>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title="Copy game code"
            >
              {copied ? (
                <Check size={24} className="text-green-200" />
              ) : (
                <Copy size={24} />
              )}
            </button>
          </div>
          <p className="text-purple-100 text-sm">
            Share this code with players to join
          </p>
        </div>
      </Card>

      {/* Players Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Players ({players.filter((p) => p.is_connected).length}/{session.max_players})
            </h3>
          </div>
          {session.status === 'waiting' && (
            <Badge variant="info">Waiting to start</Badge>
          )}
        </div>

        {/* Player List */}
        {isLoadingPlayers ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">Waiting for players to join...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  player.is_connected
                    ? 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                }`}
              >
                {/* Player Number */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    player.is_connected
                      ? 'bg-purple-600 dark:bg-purple-600 text-white'
                      : 'bg-gray-400 dark:bg-gray-600 text-white'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {player.display_name}
                    </p>
                    {index === 0 && isHost && (
                      <Crown size={16} className="text-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {player.is_connected ? (
                      <>
                        <Wifi size={12} className="text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400">Connected</span>
                      </>
                    ) : (
                      <>
                        <WifiOff size={12} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-400">Disconnected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Game Info */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <Gamepad2 size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Game Mode
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
              {session.game_mode.replace('_', ' ')}
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isHost ? (
          <>
            <Button
              variant="primary"
              onClick={onStartGame}
              disabled={!canStartGame || isStartingGame}
              loading={isStartingGame}
              className="flex-1"
            >
              {isStartingGame ? 'Starting Game...' : 'Start Game'}
            </Button>
            <Button variant="outline" onClick={onLeaveGame} disabled={isStartingGame}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onLeaveGame} className="flex-1">
            Leave Game
          </Button>
        )}
      </div>

      {/* Host Instructions */}
      {isHost && players.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Waiting for players...</strong> Share the game code{' '}
            <span className="font-mono font-bold">{session.game_code}</span> with your students so
            they can join.
          </p>
        </div>
      )}
    </div>
  );
};
