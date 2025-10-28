/**
 * QuestionDisplay Component
 * ==========================
 * Display current question with answer options and timer
 */

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../common';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Question } from '@pathket/shared';

export interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmitAnswer: (optionIndex: number, timeTaken: number) => void;
  hasAnswered?: boolean;
  isCorrect?: boolean;
  selectedOptionIndex?: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
  hasAnswered = false,
  isCorrect,
  selectedOptionIndex,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(question.time_limit_seconds);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (hasAnswered || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - auto-submit if an option is selected
          if (selectedOption !== null && !hasAnswered) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, hasAnswered, selectedOption]);

  const handleSubmit = () => {
    if (selectedOption === null || hasAnswered || isSubmitting) return;

    setIsSubmitting(true);
    const timeTaken = Date.now() - startTime;
    onSubmitAnswer(selectedOption, timeTaken);
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
    // If answered, show correct/incorrect
    if (hasAnswered) {
      const option = question.options[index];
      if (option.is_correct) {
        return 'border-green-500 bg-green-50 cursor-not-allowed';
      }
      if (index === selectedOptionIndex && !option.is_correct) {
        return 'border-red-500 bg-red-50 cursor-not-allowed';
      }
      return 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60';
    }

    // Before answering
    if (selectedOption === index) {
      return 'border-purple-500 bg-purple-50 hover:border-purple-600';
    }
    return 'border-gray-300 bg-white hover:border-purple-400 cursor-pointer';
  };

  const getOptionIcon = (index: number) => {
    if (!hasAnswered) return null;

    const option = question.options[index];
    if (option.is_correct) {
      return <CheckCircle className="text-green-600" size={24} />;
    }
    if (index === selectedOptionIndex && !option.is_correct) {
      return <XCircle className="text-red-600" size={24} />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
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
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full">
            <span className="text-sm font-medium text-amber-900">
              Worth {question.points} points
            </span>
          </div>
        </div>
      </Card>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
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
                  hasAnswered && option.is_correct
                    ? 'bg-green-600 text-white'
                    : hasAnswered && index === selectedOptionIndex
                    ? 'bg-red-600 text-white'
                    : selectedOption === index
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>

              {/* Option Text */}
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-900">{option.text}</p>
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
          disabled={selectedOption === null || isSubmitting || timeRemaining === 0}
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
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}
        >
          <p
            className={`text-center font-bold text-lg ${
              isCorrect ? 'text-green-900' : 'text-red-900'
            }`}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
        </div>
      )}
    </div>
  );
};
