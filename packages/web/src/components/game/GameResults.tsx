/**
 * GameResults Component
 * ======================
 * Final results screen showing stats, rewards, and leaderboard
 */

import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../common';
import { Leaderboard } from './Leaderboard';
import { Trophy, Award, Target, Zap, Home, PlayCircle } from 'lucide-react';
import type { GamePlayer, GameSession } from '@pathcte/shared';

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
  const navigate = useNavigate();

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

  const handleViewCollection = () => {
    navigate('/collection');
  };

  const currentPlayerPathkeys = currentPlayer?.pathkeys_earned || [];
  const earnedPathkeys = currentPlayerPathkeys.length > 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header with animated trophy */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 shadow-2xl animate-bounce mb-4">
          <Trophy className="text-white drop-shadow-lg" size={48} />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
          Game Over!
        </h1>
        <p className="text-text-secondary text-xl font-medium">
          {players.length} player{players.length !== 1 ? 's' : ''} competed
        </p>
      </div>

      {/* Personal Stats (if current player) */}
      {currentPlayer && (
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-300 dark:border-purple-700 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              {currentPlayer.display_name}
            </h2>
            <p className="text-xl text-purple-600 dark:text-purple-400 font-bold">
              {getPlacementMessage(currentPlayer.placement)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Final Score */}
            <div className="bg-bg-primary hover:bg-bg-secondary rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <Trophy className="mx-auto mb-3 text-purple-600 dark:text-purple-400" size={32} />
              <div className="text-4xl font-extrabold text-text-primary mb-1">{currentPlayer.score}</div>
              <p className="text-xs text-text-secondary uppercase font-semibold tracking-wide">Total Score</p>
            </div>

            {/* Placement */}
            {currentPlayer.placement && (
              <div className="bg-bg-primary hover:bg-bg-secondary rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <Award className="mx-auto mb-3 text-amber-500 dark:text-amber-400" size={32} />
                <div className="text-4xl font-extrabold text-text-primary mb-1">#{currentPlayer.placement}</div>
                <p className="text-xs text-text-secondary uppercase font-semibold tracking-wide">Placement</p>
              </div>
            )}

            {/* Accuracy */}
            <div className="bg-bg-primary hover:bg-bg-secondary rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <Target className="mx-auto mb-3 text-green-600 dark:text-green-400" size={32} />
              <div className="text-4xl font-extrabold text-text-primary mb-1">
                {calculateAccuracy(currentPlayer)}%
              </div>
              <p className="text-xs text-text-secondary uppercase font-semibold tracking-wide">Accuracy</p>
            </div>

            {/* Correct Answers */}
            <div className="bg-bg-primary hover:bg-bg-secondary rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <Zap className="mx-auto mb-3 text-blue-600 dark:text-blue-400" size={32} />
              <div className="text-4xl font-extrabold text-text-primary mb-1">
                {currentPlayer.correct_answers}/{currentPlayer.total_answers}
              </div>
              <p className="text-xs text-text-secondary uppercase font-semibold tracking-wide">Questions Answered</p>
            </div>
          </div>
        </Card>
      )}

      {/* Rewards */}
      {currentPlayer && currentPlayer.tokens_earned > 0 && (
        <Card className="shadow-xl">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
            🎉 Rewards Earned
          </h3>

          <div className="space-y-4">
            {/* XP (Experience Points) */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Zap className="text-white" size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-text-primary">Experience Points</h4>
                  <p className="text-sm text-text-secondary">XP added to your account</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  +{currentPlayer.tokens_earned} XP
                </div>
              </div>
            </div>

            {/* Pathkeys */}
            {earnedPathkeys && (
              <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full bg-purple-500 dark:bg-purple-600 flex items-center justify-center shadow-lg">
                    <Award className="text-white" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-text-primary">Pathkeys Unlocked!</h4>
                    <p className="text-sm text-text-secondary">
                      {currentPlayerPathkeys.length} new pathkey
                      {currentPlayerPathkeys.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2" size="sm" onClick={handleViewCollection}>
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
      <div className="flex gap-4 pt-4">
        {onPlayAgain && (
          <Button variant="primary" onClick={onPlayAgain} className="flex-1 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <PlayCircle size={24} className="mr-2" />
            Play Again
          </Button>
        )}
        <Button
          variant={onPlayAgain ? 'outline' : 'primary'}
          onClick={onReturnHome}
          className={`${onPlayAgain ? '' : 'flex-1'} py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
        >
          <Home size={24} className="mr-2" />
          Return Home
        </Button>
      </div>

      {/* Share Message (optional future feature) */}
      <div className="text-center pt-4">
        <p className="text-base text-text-secondary font-medium">
          Great game! Keep playing to unlock more pathkeys and climb the leaderboard. 🚀
        </p>
      </div>
    </div>
  );
};
