/**
 * QuestionCountSelector Component
 * ================================
 * Reusable component for selecting number of questions for a game
 */

import React from 'react';

export interface QuestionCountSelectorProps {
  selectedCount: number;
  totalAvailable: number;
  onSelectCount: (count: number) => void;
  disabled?: boolean;
}

const QUESTION_COUNT_OPTIONS = [10, 15, 20, 25, 30];

export const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({
  selectedCount,
  totalAvailable,
  onSelectCount,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Number of Questions
      </label>
      <div className="grid grid-cols-5 gap-2">
        {QUESTION_COUNT_OPTIONS.map((count) => {
          const isAvailable = count <= totalAvailable;
          const isSelected = selectedCount === count && isAvailable;

          return (
            <button
              key={count}
              type="button"
              onClick={() => isAvailable && !disabled && onSelectCount(count)}
              disabled={!isAvailable || disabled}
              className={`
                px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all
                ${
                  isSelected
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg scale-105'
                    : isAvailable
                    ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {count}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Questions will be randomly selected • Variety ensured across multiple games
      </p>
    </div>
  );
};
