/**
 * GameResults Component
 * ======================
 * Final results screen showing stats, rewards, and leaderboard
 */

import { Card, Button } from '../common';
import { Leaderboard } from './Leaderboard';
import { Trophy, Award, Target, Zap, Coins, Home, PlayCircle } from 'lucide-react';
import type { GamePlayer, GameSession } from '@pathket/shared';

export interface GameResultsProps {
  session: GameSession;
  players: GamePlayer[];
  currentPlayer?: GamePlayer;
  onPlayAgain?: () => void;
  onReturnHome?: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
  players,
  currentPlayer,
  onPlayAgain,
  onReturnHome,
}) => {
  const calculateAccuracy = (player: GamePlayer) => {
    if (player.total_answers === 0) return 0;
    return Math.round((player.correct_answers / player.total_answers) * 100);
  };

  const getPlacementMessage = (placement: number | null) => {
    if (!placement) return 'Great job!';
    if (placement === 1) return '🏆 Champion!';
    if (placement === 2) return '🥈 Runner Up!';
    if (placement === 3) return '🥉 Third Place!';
    if (placement <= 10) return `Top 10 Finish!`;
    return 'Good effort!';
  };

  const currentPlayerPathkeys = currentPlayer?.pathkeys_earned || [];
  const earnedPathkeys = currentPlayerPathkeys.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
          <Trophy className="text-white" size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Game Over!
        </h1>
        <p className="text-gray-600 text-lg">
          {players.length} player{players.length !== 1 ? 's' : ''} competed
        </p>
      </div>

      {/* Personal Stats (if current player) */}
      {currentPlayer && (
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {currentPlayer.display_name}
            </h2>
            <p className="text-lg text-purple-700 font-semibold">
              {getPlacementMessage(currentPlayer.placement)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Final Score */}
            <div className="bg-white rounded-lg p-4 text-center">
              <Trophy className="mx-auto mb-2 text-purple-600" size={24} />
              <div className="text-3xl font-bold text-gray-900">{currentPlayer.score}</div>
              <p className="text-xs text-gray-600 uppercase">Total Score</p>
            </div>

            {/* Placement */}
            {currentPlayer.placement && (
              <div className="bg-white rounded-lg p-4 text-center">
                <Award className="mx-auto mb-2 text-amber-600" size={24} />
                <div className="text-3xl font-bold text-gray-900">#{currentPlayer.placement}</div>
                <p className="text-xs text-gray-600 uppercase">Placement</p>
              </div>
            )}

            {/* Accuracy */}
            <div className="bg-white rounded-lg p-4 text-center">
              <Target className="mx-auto mb-2 text-green-600" size={24} />
              <div className="text-3xl font-bold text-gray-900">
                {calculateAccuracy(currentPlayer)}%
              </div>
              <p className="text-xs text-gray-600 uppercase">Accuracy</p>
            </div>

            {/* Correct Answers */}
            <div className="bg-white rounded-lg p-4 text-center">
              <Zap className="mx-auto mb-2 text-blue-600" size={24} />
              <div className="text-3xl font-bold text-gray-900">
                {currentPlayer.correct_answers}/{currentPlayer.total_answers}
              </div>
              <p className="text-xs text-gray-600 uppercase">Correct</p>
            </div>
          </div>
        </Card>
      )}

      {/* Rewards */}
      {currentPlayer && currentPlayer.tokens_earned > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Rewards Earned
          </h3>

          <div className="space-y-3">
            {/* Tokens */}
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Coins className="text-amber-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Tokens</h4>
                  <p className="text-sm text-gray-600">Added to your account</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-700">
                  +{currentPlayer.tokens_earned}
                </div>
              </div>
            </div>

            {/* Pathkeys */}
            {earnedPathkeys && (
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Pathkeys Unlocked!</h4>
                    <p className="text-sm text-gray-600">
                      {currentPlayerPathkeys.length} new pathkey
                      {currentPlayerPathkeys.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2" size="sm">
                  View Collection
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Final Leaderboard */}
      <Leaderboard
        players={players}
        currentPlayerId={currentPlayer?.id}
        showPlacement={true}
        compact={false}
      />

      {/* Actions */}
      <div className="flex gap-3">
        {onPlayAgain && (
          <Button variant="primary" onClick={onPlayAgain} className="flex-1">
            <PlayCircle size={20} className="mr-2" />
            Play Again
          </Button>
        )}
        <Button
          variant={onPlayAgain ? 'outline' : 'primary'}
          onClick={onReturnHome}
          className={onPlayAgain ? '' : 'flex-1'}
        >
          <Home size={20} className="mr-2" />
          Return Home
        </Button>
      </div>

      {/* Share Message (optional future feature) */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Great game! Keep playing to unlock more pathkeys and climb the leaderboard.
        </p>
      </div>
    </div>
  );
};
