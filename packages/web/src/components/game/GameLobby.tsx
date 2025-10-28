/**
 * GameLobby Component
 * ===================
 * Pre-game lobby showing connected players and game code
 */

import { useEffect, useState } from 'react';
import { Card, Badge, Button, Spinner } from '../common';
import { Users, Copy, Check, Crown, Wifi, WifiOff, Gamepad2 } from 'lucide-react';
import { useGameStore } from '@pathket/shared';
import { realtimeService, gameService } from '@pathket/shared';
import type { GamePlayer } from '@pathket/shared';

export interface GameLobbyProps {
  sessionId: string;
  isHost: boolean;
  onStartGame?: () => void;
  onLeaveGame?: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({
  sessionId,
  isHost,
  onStartGame,
  onLeaveGame,
}) => {
  const { session, players, setPlayers, addPlayer, updatePlayer } = useGameStore();
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

  // Subscribe to real-time updates
  useEffect(() => {
    realtimeService.subscribeToGame(sessionId, {
      onPlayerJoined: (player: GamePlayer) => {
        addPlayer(player);
      },
      onPlayerUpdate: (player: GamePlayer) => {
        updatePlayer(player.id, player);
      },
      onPlayerLeft: (player: GamePlayer) => {
        updatePlayer(player.id, { is_connected: false });
      },
    });

    return () => {
      realtimeService.unsubscribeFromGame(sessionId);
    };
  }, [sessionId, addPlayer, updatePlayer]);

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
            <Users size={20} className="text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">
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
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Waiting for players to join...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  player.is_connected
                    ? 'border-purple-200 bg-purple-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                {/* Player Number */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    player.is_connected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {player.display_name}
                    </p>
                    {index === 0 && isHost && (
                      <Crown size={16} className="text-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {player.is_connected ? (
                      <>
                        <Wifi size={12} className="text-green-600" />
                        <span className="text-green-600">Connected</span>
                      </>
                    ) : (
                      <>
                        <WifiOff size={12} className="text-gray-400" />
                        <span className="text-gray-500">Disconnected</span>
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
      <Card className="bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Gamepad2 size={20} className="text-indigo-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              Game Mode
            </h4>
            <p className="text-sm text-gray-600">
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
              disabled={!canStartGame}
              className="flex-1"
            >
              Start Game
            </Button>
            <Button variant="outline" onClick={onLeaveGame}>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Waiting for players...</strong> Share the game code{' '}
            <span className="font-mono font-bold">{session.game_code}</span> with your students so
            they can join.
          </p>
        </div>
      )}
    </div>
  );
};
