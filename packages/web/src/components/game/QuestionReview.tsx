/**
 * QuestionReview Component
 * ========================
 * Shows a detailed review of all questions answered in a game
 * Displays correct/incorrect answers with explanations
 */

import { Card } from '../common';
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import { useMemo } from 'react';

export interface QuestionReviewAnswer {
  id: string;
  selected_option_index: number;
  is_correct: boolean;
  points_earned: number;
  time_taken_ms: number;
  answered_at: string;
  questions: {
    id: string;
    question_text: string;
    options: Array<{
      text: string;
      is_correct: boolean;
    }>;
  };
}

export interface QuestionReviewProps {
  answers: QuestionReviewAnswer[];
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({ answers }) => {
  const stats = useMemo(() => {
    const correct = answers.filter(a => a.is_correct).length;
    const total = answers.length;
    const totalPoints = answers.reduce((sum, a) => sum + a.points_earned, 0);
    return { correct, incorrect: total - correct, total, totalPoints };
  }, [answers]);

  if (!answers || answers.length === 0) {
    return (
      <Card>
        <p className="text-center text-text-secondary py-8">
          No answers to review
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
          <CheckCircle className="mx-auto mb-2 text-green-600 dark:text-green-400" size={24} />
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.correct}</div>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Correct</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center border border-red-200 dark:border-red-800">
          <XCircle className="mx-auto mb-2 text-red-600 dark:text-red-400" size={24} />
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.incorrect}</div>
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">Incorrect</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center border border-purple-200 dark:border-purple-800">
          <Award className="mx-auto mb-2 text-purple-600 dark:text-purple-400" size={24} />
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.totalPoints}</div>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Points</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800">
          <Clock className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={24} />
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {Math.round((stats.correct / stats.total) * 100)}%
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Accuracy</p>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="space-y-4">
        {answers.map((answer, index) => {
          const question = answer.questions;
          const selectedOption = question.options[answer.selected_option_index];
          const correctAnswerIndex = question.options.findIndex(opt => opt.is_correct);
          const correctOption = question.options[correctAnswerIndex];

          return (
            <Card key={answer.id} className={`border-l-4 ${
              answer.is_correct
                ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10'
                : 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10'
            }`}>
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    answer.is_correct
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-text-primary mb-2">
                      {question.question_text}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  answer.is_correct
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                  {answer.is_correct ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {answer.is_correct ? 'Correct' : 'Incorrect'}
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => {
                  const isSelected = optionIndex === answer.selected_option_index;
                  const isCorrect = option.is_correct;

                  let className = 'p-3 rounded-lg border-2 ';
                  if (isSelected && isCorrect) {
                    // Selected and correct
                    className += 'border-green-500 bg-green-100 dark:bg-green-900/30';
                  } else if (isSelected && !isCorrect) {
                    // Selected but wrong
                    className += 'border-red-500 bg-red-100 dark:bg-red-900/30';
                  } else if (!isSelected && isCorrect) {
                    // Not selected but is the correct answer
                    className += 'border-green-400 bg-green-50 dark:bg-green-900/20';
                  } else {
                    // Not selected and not correct
                    className += 'border-gray-200 dark:border-gray-700 bg-bg-primary';
                  }

                  return (
                    <div key={optionIndex} className={className}>
                      <div className="flex items-center justify-between">
                        <span className="text-text-primary">{option.text}</span>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              Your Answer
                            </span>
                          )}
                          {isCorrect && (
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500 text-white">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation section removed - not available in database */}

              {/* Points Info */}
              <div className="mt-3 flex items-center justify-between text-sm text-text-secondary">
                <span>
                  Points: <span className={`font-bold ${answer.points_earned > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {answer.points_earned > 0 ? '+' : ''}{answer.points_earned}
                  </span>
                </span>
                <span>
                  Time: {(answer.time_taken_ms / 1000).toFixed(1)}s
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
