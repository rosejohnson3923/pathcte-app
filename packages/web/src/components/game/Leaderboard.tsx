/**
 * Leaderboard Component
 * ======================
 * Real-time player rankings during and after game
 */

import { Card, Badge } from '../common';
import { Trophy, Medal, Award } from 'lucide-react';
import type { GamePlayer } from '@pathket/shared';

export interface LeaderboardProps {
  players: GamePlayer[];
  currentPlayerId?: string;
  showPlacement?: boolean;
  compact?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  currentPlayerId,
  showPlacement = true,
  compact = false,
}) => {
  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.correct_answers !== a.correct_answers) return b.correct_answers - a.correct_answers;
    return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
  });

  const getPlacementIcon = (index: number) => {
    if (index === 0) return <Trophy className="text-amber-500" size={24} />;
    if (index === 1) return <Medal className="text-gray-400" size={24} />;
    if (index === 2) return <Award className="text-amber-700" size={24} />;
    return null;
  };

  const getPlacementColor = (index: number) => {
    if (index === 0) return 'from-amber-50 to-yellow-50 border-amber-300';
    if (index === 1) return 'from-gray-50 to-slate-50 border-gray-300';
    if (index === 2) return 'from-orange-50 to-amber-50 border-orange-300';
    return 'from-white to-gray-50 border-gray-200';
  };

  const isCurrentPlayer = (player: GamePlayer) => player.id === currentPlayerId;

  if (compact) {
    return (
      <Card className="overflow-hidden">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" />
          Leaderboard
        </h3>

        <div className="space-y-2">
          {sortedPlayers.slice(0, 5).map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                isCurrentPlayer(player) ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-50'
              }`}
            >
              {/* Placement */}
              <div className="flex-shrink-0 w-8 text-center">
                {getPlacementIcon(index) || (
                  <span className="font-bold text-gray-600">#{index + 1}</span>
                )}
              </div>

              {/* Player Name */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {player.display_name}
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">{player.score}</p>
                <p className="text-xs text-gray-500">
                  {player.correct_answers}/{player.total_answers}
                </p>
              </div>
            </div>
          ))}

          {sortedPlayers.length > 5 && (
            <p className="text-xs text-gray-500 text-center pt-2">
              +{sortedPlayers.length - 5} more players
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-3">
          <Trophy className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
        <p className="text-gray-600">{players.length} players</p>
      </div>

      {/* Player List */}
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <Card
            key={player.id}
            className={`bg-gradient-to-r ${getPlacementColor(index)} ${
              isCurrentPlayer(player) ? 'ring-4 ring-purple-500' : ''
            }`}
            padding="md"
          >
            <div className="flex items-center gap-4">
              {/* Placement Number/Icon */}
              <div className="flex-shrink-0">
                {getPlacementIcon(index) || (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-bold text-xl text-gray-700">#{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-gray-900 truncate">
                    {player.display_name}
                  </h3>
                  {isCurrentPlayer(player) && (
                    <Badge variant="success" className="flex-shrink-0">
                      You
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {player.correct_answers} / {player.total_answers} correct
                  </span>
                  {player.total_answers > 0 && (
                    <span>
                      {Math.round((player.correct_answers / player.total_answers) * 100)}% accuracy
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{player.score}</div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Points</p>
              </div>
            </div>

            {/* Placement Badge (for top 3) */}
            {showPlacement && index < 3 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {index === 0 ? '🏆 1st Place' : index === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
                  </span>
                  {player.tokens_earned > 0 && (
                    <Badge variant="warning">+{player.tokens_earned} tokens</Badge>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {players.length === 0 && (
        <div className="text-center py-12">
          <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No players yet</p>
        </div>
      )}
    </div>
  );
};
