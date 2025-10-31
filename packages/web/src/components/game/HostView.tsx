/**
 * HostView Component
 * ===================
 * Teacher/host control panel for managing live games
 * Blooket-style view where host doesn't answer, just facilitates
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Button, Badge } from '../common';
import { Clock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { shuffleQuestionOptions } from '@pathcte/shared';
import type { Question, GamePlayer } from '@pathcte/shared';

export interface HostViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  questionSetTitle: string;
  players: GamePlayer[];
  onNextQuestion: () => void;
  progressionControl: 'auto' | 'manual';
  onTimerExpired?: () => void;
}

export const HostView: React.FC<HostViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  questionSetTitle,
  players,
  onNextQuestion,
  progressionControl,
  onTimerExpired,
}) => {
  // Shuffle options using the SAME seed as students see
  // This ensures teachers see the exact same order as students
  const shuffledOptions = useMemo(
    () => shuffleQuestionOptions(question.options, question.id),
    [question.id, question.options]
  );

  const [timeRemaining, setTimeRemaining] = useState(question.time_limit_seconds);
  const [playersAnswered, setPlayersAnswered] = useState<Set<string>>(new Set());

  // Store latest onTimerExpired callback in ref to avoid stale closures
  const onTimerExpiredRef = useRef(onTimerExpired);
  useEffect(() => {
    onTimerExpiredRef.current = onTimerExpired;
  }, [onTimerExpired]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - only auto-advance in auto mode
          // In manual mode, timer is just for display
          if (progressionControl === 'auto' && onTimerExpiredRef.current) {
            console.log('[HostView] Timer expired in auto mode, calling onTimerExpired');
            setTimeout(() => onTimerExpiredRef.current?.(), 100);
          } else {
            console.log('[HostView] Timer expired in manual mode, waiting for teacher');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question.id, progressionControl]);

  // Reset timer and answered tracking when question changes
  useEffect(() => {
    setTimeRemaining(question.time_limit_seconds);
    setPlayersAnswered(new Set());
  }, [question.id, question.time_limit_seconds]);

  // Track which players have answered by monitoring their total_answers count
  // When a player's total_answers increases, they've answered the current question
  useEffect(() => {
    const newAnswered = new Set<string>();
    players.forEach(player => {
      // If player has answered at least questionNumber questions, they've answered this one
      if (player.total_answers >= questionNumber) {
        newAnswered.add(player.id);
      }
    });
    setPlayersAnswered(newAnswered);
  }, [players, questionNumber]);

  const getTimerColor = () => {
    const percentage = (timeRemaining / question.time_limit_seconds) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-amber-600';
    return 'text-red-600';
  };

  // Count how many students have answered
  const answeredCount = playersAnswered.size;
  const totalPlayers = players.length;

  return (
    <div className="space-y-6">
      {/* Question Set Title */}
      {questionSetTitle && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {questionSetTitle}
          </h2>
        </div>
      )}

      {/* Header: Progress & Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="info">
            Question {questionNumber} of {totalQuestions}
          </Badge>

          {/* Student Progress */}
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full border border-purple-200 dark:border-purple-800">
            <Users size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              {answeredCount}/{totalPlayers} answered
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getTimerColor()}`}>
          <Clock size={20} />
          <span>{timeRemaining}s</span>
        </div>
      </div>

      {/* Question Card (Read-only) */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-purple-500/30">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
            <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />
            <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">
              Host View
            </span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {question.question_text}
          </h2>

          {/* Question Image (if available) */}
          {question.image_url && (
            <div className="mb-4">
              <img
                src={question.image_url}
                alt="Question illustration"
                className="max-w-md mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Points Display */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-500/30">
            <span className="text-sm font-medium text-amber-500">
              Worth {question.points} points
            </span>
          </div>
        </div>
      </Card>

      {/* Answer Options (Display only - not interactive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shuffledOptions.map((option, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border-2 ${
              option.is_correct
                ? 'border-green-500 bg-green-500/10'
                : 'border-border-default bg-bg-tertiary opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Option Letter */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  option.is_correct
                    ? 'bg-green-600 text-white'
                    : 'bg-bg-tertiary text-text-primary'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>

              {/* Option Text */}
              <div className="flex-1">
                <p className="text-lg font-medium text-text-primary">{option.text}</p>
                {option.is_correct && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">✓ Correct Answer</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Host Controls */}
      <div className="space-y-3">
        {progressionControl === 'manual' ? (
          <Button
            variant="primary"
            onClick={onNextQuestion}
            className="w-full py-4 text-lg font-bold"
          >
            <ArrowRight size={20} className="mr-2" />
            {questionNumber < totalQuestions ? 'Next Question' : 'End Game'}
          </Button>
        ) : (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Auto Mode: Game will advance automatically when timer expires
              </p>
            </div>
          </Card>
        )}

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Students are answering on their devices. Monitor their progress on the leaderboard.
        </p>
      </div>
    </div>
  );
};
