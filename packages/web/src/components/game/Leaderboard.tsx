/**
 * Leaderboard Component
 * ======================
 * Real-time player rankings during and after game
 */

import { Card, Badge } from '../common';
import { Trophy, Medal, Award } from 'lucide-react';
import type { GamePlayer } from '@pathcte/shared';

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

  const getPlacementColor = (index: number) => {
    if (index === 0) return 'from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-300 dark:border-amber-500';
    if (index === 1) return 'from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border-gray-300 dark:border-gray-500';
    if (index === 2) return 'from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-300 dark:border-orange-500';
    return 'from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-600';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return { emoji: '🥇', text: '1st', color: 'text-amber-500' };
    if (index === 1) return { emoji: '🥈', text: '2nd', color: 'text-text-secondary' };
    if (index === 2) return { emoji: '🥉', text: '3rd', color: 'text-orange-500' };
    return { emoji: '', text: `${index + 1}th`, color: 'text-text-tertiary' };
  };

  const isCurrentPlayer = (player: GamePlayer) => player.id === currentPlayerId;

  if (compact) {
    return (
      <Card className="overflow-hidden border-2">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" />
          Leaderboard
        </h3>

        <div className="space-y-2">
          {sortedPlayers.slice(0, 5).map((player, index) => {
            const rank = getRankBadge(index);
            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                  isCurrentPlayer(player)
                    ? 'bg-purple-100/20 border-2 border-purple-500 shadow-lg backdrop-blur-sm'
                    : index < 3
                    ? `bg-gradient-to-r ${getPlacementColor(index)} shadow-md`
                    : 'bg-bg-tertiary'
                }`}
              >
                {/* Placement */}
                <div className="flex-shrink-0 w-10 text-center">
                  {rank.emoji ? (
                    <div className="text-2xl">{rank.emoji}</div>
                  ) : (
                    <div className={`font-bold text-lg ${rank.color}`}>#{index + 1}</div>
                  )}
                </div>

                {/* Player Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {player.display_name}
                  </p>
                  {player.total_answers > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-1.5 bg-border-subtle rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                          style={{ width: `${(player.correct_answers / player.total_answers) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-tertiary min-w-[3ch]">
                        {Math.round((player.correct_answers / player.total_answers) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className={`font-bold text-xl ${
                    index === 0 ? 'text-amber-500' :
                    index === 1 ? 'text-text-secondary' :
                    index === 2 ? 'text-orange-500' :
                    'text-text-primary'
                  }`}>
                    {player.score}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {player.correct_answers}/{player.total_answers}
                  </p>
                </div>
              </div>
            );
          })}

          {sortedPlayers.length > 5 && (
            <p className="text-xs text-text-tertiary text-center pt-2">
              +{sortedPlayers.length - 5} more players
            </p>
          )}

          {sortedPlayers.length === 0 && (
            <div className="text-center py-8">
              <Trophy size={32} className="mx-auto mb-2 text-text-tertiary" />
              <p className="text-sm text-text-secondary">Waiting for players...</p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg mb-3 animate-pulse">
          <Trophy className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Leaderboard</h2>
        <p className="text-text-secondary">{players.length} players</p>
      </div>

      {/* Player List */}
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const rank = getRankBadge(index);
          return (
            <Card
              key={player.id}
              className={`bg-gradient-to-r ${getPlacementColor(index)} ${
                isCurrentPlayer(player) ? 'ring-4 ring-purple-500' : ''
              } transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
              padding="md"
            >
              <div className="flex items-center gap-4">
                {/* Placement Number/Icon */}
                <div className="flex-shrink-0">
                  {rank.emoji ? (
                    <div className="text-4xl">{rank.emoji}</div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center">
                      <span className={`font-bold text-xl ${rank.color}`}>#{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-text-primary truncate">
                      {player.display_name}
                    </h3>
                    {isCurrentPlayer(player) && (
                      <Badge variant="success" className="flex-shrink-0">
                        You
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span>
                      {player.correct_answers} / {player.total_answers} correct
                    </span>
                    {player.total_answers > 0 && (
                      <span>
                        {Math.round((player.correct_answers / player.total_answers) * 100)}% accuracy
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {player.total_answers > 0 && (
                    <div className="mt-2">
                      <div className="h-2 bg-border-subtle rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            index === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-slate-500' :
                            index === 2 ? 'bg-gradient-to-r from-orange-400 to-amber-500' :
                            'bg-gradient-to-r from-green-400 to-emerald-500'
                          }`}
                          style={{ width: `${(player.correct_answers / player.total_answers) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    index === 0 ? 'text-amber-500' :
                    index === 1 ? 'text-text-secondary' :
                    index === 2 ? 'text-orange-500' :
                    'text-text-primary'
                  }`}>
                    {player.score}
                  </div>
                  <p className="text-xs text-text-tertiary uppercase tracking-wide">Points</p>
                </div>
              </div>

              {/* Placement Badge (for top 3) */}
              {showPlacement && index < 3 && (
                <div className="mt-3 pt-3 border-t border-border-default">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-secondary">
                      {index === 0 ? '🏆 1st Place' : index === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
                    </span>
                    {player.tokens_earned > 0 && (
                      <Badge variant="warning">+{player.tokens_earned} tokens</Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {players.length === 0 && (
        <div className="text-center py-12">
          <Trophy size={48} className="mx-auto mb-4 text-text-tertiary" />
          <p className="text-text-secondary">No players yet</p>
        </div>
      )}
    </div>
  );
};
