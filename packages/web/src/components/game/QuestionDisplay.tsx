/**
 * QuestionDisplay Component
 * ==========================
 * Display current question with answer options and timer
 */

import { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '../common';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { shuffleQuestionOptions, type ShuffledOption } from '@pathket/shared';
import type { Question } from '@pathket/shared';

export interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  questionSetTitle: string;
  onSubmitAnswer: (optionIndex: number, timeTaken: number) => Promise<boolean>;
  onTimerExpired?: () => void;
  hasAnswered?: boolean;
  isCorrect?: boolean;
  selectedOptionIndex?: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  questionSetTitle,
  onSubmitAnswer,
  onTimerExpired,
  hasAnswered = false,
  isCorrect,
  selectedOptionIndex,
}) => {
  // Shuffle options deterministically based on question ID
  // This ensures all players see the same shuffle, but answers appear in different positions
  const shuffledOptions = useMemo(
    () => shuffleQuestionOptions(question.options, question.id),
    [question.id, question.options]
  );

  // Convert original database index to shuffled display index
  // selectedOptionIndex comes from server as the original index
  const displaySelectedIndex = useMemo(() => {
    if (selectedOptionIndex === undefined) return undefined;
    return shuffledOptions.findIndex(opt => opt.originalIndex === selectedOptionIndex);
  }, [selectedOptionIndex, shuffledOptions]);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(question.time_limit_seconds);
  const [startTime, setStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset component state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setTimeRemaining(question.time_limit_seconds);
    setStartTime(Date.now());
    setIsSubmitting(false);
  }, [question.id, question.time_limit_seconds]);

  // Timer countdown
  useEffect(() => {
    if (hasAnswered || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - notify parent component
          if (onTimerExpired) {
            setTimeout(() => onTimerExpired(), 100);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, hasAnswered, onTimerExpired]);

  const handleSubmit = async () => {
    if (selectedOption === null || hasAnswered || isSubmitting) return;

    setIsSubmitting(true);
    const timeTaken = Date.now() - startTime;

    // CRITICAL: Submit using original index from database, not shuffled display index
    const originalIndex = shuffledOptions[selectedOption].originalIndex;

    try {
      await onSubmitAnswer(originalIndex, timeTaken);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      // Always reset submitting state so button doesn't get stuck
      // The parent will update hasAnswered which will hide the button
      setIsSubmitting(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (!hasAnswered) {
      setSelectedOption(index);
    }
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / question.time_limit_seconds) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-amber-600';
    return 'text-red-600';
  };

  const getOptionStyle = (index: number) => {
    // If answered, show correct/incorrect based on server response
    if (hasAnswered) {
      // If this is the selected option, show green (correct) or red (incorrect)
      if (index === displaySelectedIndex) {
        if (isCorrect) {
          return 'border-green-500 bg-green-500/10 cursor-not-allowed';
        } else {
          return 'border-red-500 bg-red-500/10 cursor-not-allowed';
        }
      }
      // For hosts who can see answers, highlight the correct answer in green
      const option = shuffledOptions[index];
      if (option.is_correct) {
        return 'border-green-500 bg-green-500/10 cursor-not-allowed';
      }
      // Other unselected options are dimmed
      return 'border-border-default bg-bg-tertiary cursor-not-allowed opacity-60';
    }

    // Before answering
    if (selectedOption === index) {
      return 'border-purple-500 bg-purple-500/10 hover:border-purple-600';
    }
    return 'border-border-default bg-bg-primary hover:border-purple-400 cursor-pointer';
  };

  const getOptionIcon = (index: number) => {
    if (!hasAnswered) return null;

    // If this is the selected option, show icon based on correctness
    if (index === displaySelectedIndex) {
      if (isCorrect) {
        return <CheckCircle className="text-green-600" size={24} />;
      } else {
        return <XCircle className="text-red-600" size={24} />;
      }
    }

    // For hosts who can see answers, show checkmark on correct answer
    const option = shuffledOptions[index];
    if (option.is_correct) {
      return <CheckCircle className="text-green-600" size={24} />;
    }

    return null;
  };

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

      {/* Question Header */}
      <div className="flex items-center justify-between">
        <Badge variant="info">
          Question {questionNumber} of {totalQuestions}
        </Badge>

        {/* Timer */}
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getTimerColor()}`}>
          <Clock size={20} />
          <span>{timeRemaining}s</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-purple-500/30">
        <div className="text-center">
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

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            disabled={hasAnswered}
            className={`p-6 rounded-xl border-2 transition-all text-left ${getOptionStyle(index)}`}
          >
            <div className="flex items-start gap-4">
              {/* Option Letter */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  hasAnswered && index === displaySelectedIndex && isCorrect
                    ? 'bg-green-600 text-white'
                    : hasAnswered && index === displaySelectedIndex && !isCorrect
                    ? 'bg-red-600 text-white'
                    : hasAnswered && option.is_correct
                    ? 'bg-green-600 text-white'
                    : selectedOption === index
                    ? 'bg-purple-600 text-white'
                    : 'bg-bg-tertiary text-text-primary'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>

              {/* Option Text */}
              <div className="flex-1">
                <p className="text-lg font-medium text-text-primary">{option.text}</p>
              </div>

              {/* Correct/Incorrect Icon */}
              {getOptionIcon(index)}
            </div>
          </button>
        ))}
      </div>

      {/* Submit Button */}
      {!hasAnswered && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={selectedOption === null || isSubmitting}
          className="w-full py-4 text-lg font-bold"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
        </Button>
      )}

      {/* Feedback Message */}
      {hasAnswered && (
        <div
          className={`p-4 rounded-lg border-2 ${
            isCorrect
              ? 'bg-green-500/10 border-green-500'
              : 'bg-red-500/10 border-red-500'
          }`}
        >
          <p
            className={`text-center font-bold text-lg ${
              isCorrect ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
        </div>
      )}
    </div>
  );
};
