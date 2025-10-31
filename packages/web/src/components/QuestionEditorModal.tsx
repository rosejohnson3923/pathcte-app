/**
 * QuestionEditorModal
 * ===================
 * Modal for creating and editing individual questions
 */

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalFooter } from './common/Modal';
import { Button, Input } from './common';
import { Plus, X, Check } from 'lucide-react';
import { Question } from '@pathcte/shared';

interface QuestionOption {
  text: string;
  is_correct: boolean;
}

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Question>) => Promise<void>;
  question?: Question | null;
  mode: 'create' | 'edit';
  questionSetId: string;
  nextOrderIndex: number;
}

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  question,
  mode,
  questionSetId,
  nextOrderIndex,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState(30);
  const [points, setPoints] = useState(10);
  const [options, setOptions] = useState<QuestionOption[]>([
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ]);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && question) {
      setQuestionText(question.question_text);
      setDifficulty(question.difficulty as 'easy' | 'medium' | 'hard');
      setTimeLimit(question.time_limit_seconds || 30);
      setPoints(question.points || 10);
      setOptions(question.options as QuestionOption[]);
    } else {
      // Reset form for create mode
      setQuestionText('');
      setDifficulty('medium');
      setTimeLimit(30);
      setPoints(10);
      setOptions([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ]);
    }
    setErrors({});
  }, [mode, question, isOpen]);

  const updateOption = (index: number, field: 'text' | 'is_correct', value: string | boolean) => {
    const newOptions = [...options];
    if (field === 'is_correct') {
      // Only one option can be correct
      newOptions.forEach((opt, i) => {
        opt.is_correct = i === index ? (value as boolean) : false;
      });
    } else {
      newOptions[index] = { ...newOptions[index], text: value as string };
    }
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', is_correct: false }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!questionText.trim()) {
      newErrors.questionText = 'Question text is required';
    } else if (questionText.length < 10) {
      newErrors.questionText = 'Question must be at least 10 characters';
    }

    const filledOptions = options.filter((opt) => opt.text.trim());
    if (filledOptions.length < 2) {
      newErrors.options = 'At least 2 answer options are required';
    }

    const correctOptions = options.filter((opt) => opt.is_correct && opt.text.trim());
    if (correctOptions.length === 0) {
      newErrors.correct = 'You must mark one answer as correct';
    } else if (correctOptions.length > 1) {
      newErrors.correct = 'Only one answer can be correct';
    }

    if (timeLimit < 5 || timeLimit > 300) {
      newErrors.timeLimit = 'Time limit must be between 5 and 300 seconds';
    }

    if (points < 1 || points > 100) {
      newErrors.points = 'Points must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty options
      const validOptions = options.filter((opt) => opt.text.trim());

      const data: Partial<Question> = {
        question_text: questionText.trim(),
        question_type: 'multiple_choice',
        options: validOptions,
        difficulty,
        time_limit_seconds: timeLimit,
        points,
        order_index: mode === 'create' ? nextOrderIndex : question?.order_index || 0,
      };

      if (mode === 'create') {
        data.question_set_id = questionSetId;
      }

      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving question:', error);
      setErrors({ submit: 'Failed to save question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Question' : 'Edit Question'}
      description="Add a multiple-choice question to this question set"
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <div className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question Text *
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question here..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                required
              />
              {errors.questionText && (
                <p className="mt-1 text-sm text-red-600">{errors.questionText}</p>
              )}
            </div>

            {/* Answer Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Answer Options * (select the correct answer)
                </label>
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Option
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {/* Correct Answer Radio */}
                    <button
                      type="button"
                      onClick={() => updateOption(index, 'is_correct', !option.is_correct)}
                      className={`mt-2 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        option.is_correct
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                      title={option.is_correct ? 'Correct answer' : 'Mark as correct'}
                    >
                      {option.is_correct && <Check size={16} className="text-white" />}
                    </button>

                    {/* Option Text */}
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(index, 'text', e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />

                    {/* Remove Button */}
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="mt-2 flex-shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Remove option"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {errors.options && <p className="mt-2 text-sm text-red-600">{errors.options}</p>}
              {errors.correct && <p className="mt-2 text-sm text-red-600">{errors.correct}</p>}
            </div>

            {/* Difficulty, Time Limit, Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <div className="flex flex-col gap-2">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`py-2 px-3 rounded-lg border-2 font-medium transition-colors text-sm ${
                        difficulty === level
                          ? level === 'easy'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : level === 'medium'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Limit */}
              <div>
                <Input
                  label="Time Limit (seconds)"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 30)}
                  min={5}
                  max={300}
                  error={errors.timeLimit}
                  fullWidth
                />
              </div>

              {/* Points */}
              <div>
                <Input
                  label="Points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 10)}
                  min={1}
                  max={100}
                  error={errors.points}
                  fullWidth
                />
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-300">{errors.submit}</p>
              </div>
            )}
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            {mode === 'create' ? 'Add Question' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
