/**
 * QuestionSetEditorModal
 * ======================
 * Modal for creating and editing question sets
 */

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalFooter } from './common/Modal';
import { Button, Input } from './common';
import { useAuth } from '../hooks';
import { QuestionSet } from '@pathket/shared';

interface QuestionSetEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<QuestionSet>) => Promise<void>;
  questionSet?: QuestionSet | null;
  mode: 'create' | 'edit';
}

const SUBJECTS = [
  'Healthcare',
  'Technology',
  'Business',
  'Arts',
  'Science',
  'Education',
  'Public Service',
  'Environmental Science',
  'Skilled Trades',
  'Hospitality',
];

const CAREER_SECTORS = [
  'Healthcare',
  'Technology',
  'Business',
  'Arts & Entertainment',
  'Science',
  'Education',
  'Public Service',
  'Agriculture',
  'Construction',
  'Hospitality',
];

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const QuestionSetEditorModal: React.FC<QuestionSetEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  questionSet,
  mode,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [careerSector, setCareerSector] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && questionSet) {
      setTitle(questionSet.title);
      setDescription(questionSet.description || '');
      setSubject(questionSet.subject);
      setCareerSector(questionSet.career_sector || '');
      setDifficultyLevel(questionSet.difficulty_level as 'easy' | 'medium' | 'hard');
      setIsPublic(questionSet.is_public);
      setTags(questionSet.tags?.join(', ') || '');
      setSelectedGrades(questionSet.grade_level || []);
    } else {
      // Reset form for create mode
      setTitle('');
      setDescription('');
      setSubject('');
      setCareerSector('');
      setDifficultyLevel('medium');
      setIsPublic(false);
      setTags('');
      setSelectedGrades([]);
    }
    setErrors({});
  }, [mode, questionSet, isOpen]);

  const toggleGrade = (grade: number) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade].sort()
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!subject) {
      newErrors.subject = 'Subject is required';
    }

    if (selectedGrades.length === 0) {
      newErrors.grades = 'Select at least one grade level';
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
      const data: Partial<QuestionSet> = {
        title: title.trim(),
        description: description.trim() || null,
        subject,
        career_sector: careerSector || null,
        difficulty_level: difficultyLevel,
        is_public: isPublic,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        grade_level: selectedGrades,
        total_questions: mode === 'create' ? 0 : questionSet?.total_questions || 0,
        is_verified: false,
      };

      if (mode === 'create' && user) {
        data.creator_id = user.id;
      }

      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving question set:', error);
      setErrors({ submit: 'Failed to save question set. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Question Set' : 'Edit Question Set'}
      description={
        mode === 'create'
          ? 'Create a new question set for your games'
          : 'Update question set information'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <div className="space-y-4">
            {/* Title */}
            <Input
              label="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              placeholder="e.g., Healthcare Careers Fundamentals"
              required
              fullWidth
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this question set..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Subject & Career Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select subject...</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Career Sector
                </label>
                <select
                  value={careerSector}
                  onChange={(e) => setCareerSector(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select sector...</option>
                  {CAREER_SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level
              </label>
              <div className="flex gap-3">
                {DIFFICULTY_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficultyLevel(level)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                      difficultyLevel === level
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

            {/* Grade Levels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade Levels *
              </label>
              <div className="flex flex-wrap gap-2">
                {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => toggleGrade(grade)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                      selectedGrades.includes(grade)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Grade {grade}
                  </button>
                ))}
              </div>
              {errors.grades && <p className="mt-1 text-sm text-red-600">{errors.grades}</p>}
            </div>

            {/* Tags */}
            <Input
              label="Tags (comma-separated)"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., healthcare, medicine, careers"
              fullWidth
            />

            {/* Public Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Make this question set public (visible to all teachers)
              </label>
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
            {mode === 'create' ? 'Create Question Set' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
