/**
 * QuestionSetDetailPage
 * =====================
 * View and manage questions within a question set
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { Card, Button, Badge, Spinner } from '../components/common';
import { ArrowLeft, Plus, Edit, Trash2, Check, X, Clock, Award } from 'lucide-react';
import {
  useQuestionSet,
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '../hooks';
import { QuestionEditorModal } from '../components/QuestionEditorModal';
import { toast } from '@pathcte/shared';
import type { Question } from '@pathcte/shared';

export default function QuestionSetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Fetch data
  const { data: questionSet, isLoading: setLoading } = useQuestionSet(id);
  const { data: questions, isLoading: questionsLoading } = useQuestions(id);

  // Mutations
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const isLoading = setLoading || questionsLoading;

  // Handlers
  const handleCreateClick = () => {
    setEditorMode('create');
    setSelectedQuestion(null);
    setIsEditorOpen(true);
  };

  const handleEditClick = (question: Question) => {
    setEditorMode('edit');
    setSelectedQuestion(question);
    setIsEditorOpen(true);
  };

  const handleDeleteClick = async (question: Question) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(question.id);
      toast.success('Question deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete question');
      console.error(error);
    }
  };

  const handleSaveQuestion = async (data: Partial<Question>) => {
    if (editorMode === 'create') {
      await createMutation.mutateAsync(data);
      toast.success('Question added successfully!');
    } else if (selectedQuestion) {
      await updateMutation.mutateAsync({
        id: selectedQuestion.id,
        updates: data,
      });
      toast.success('Question updated successfully!');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!questionSet) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Question Set Not Found
          </h2>
          <Button variant="outline" onClick={() => navigate('/question-sets')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Question Sets
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/question-sets')}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Question Sets
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
                {questionSet.title}
              </h1>
              {questionSet.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {questionSet.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="info">{questionSet.subject}</Badge>
                {questionSet.career_sector && (
                  <Badge variant="default">{questionSet.career_sector}</Badge>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    questionSet.difficulty_level === 'easy'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : questionSet.difficulty_level === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {questionSet.difficulty_level}
                </span>
                {questionSet.grade_level && questionSet.grade_level.length > 0 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                    Grades {Math.min(...questionSet.grade_level)}-
                    {Math.max(...questionSet.grade_level)}
                  </span>
                )}
              </div>
            </div>

            <Button variant="primary" onClick={handleCreateClick}>
              <Plus size={20} className="mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Questions List */}
        {questions && questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Question Number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Question Text */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {question.question_text}
                    </h3>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {(question.options as { text: string; is_correct: boolean }[]).map(
                        (option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-2 p-2 rounded-lg border ${
                              option.is_correct
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                            }`}
                          >
                            {option.is_correct ? (
                              <Check size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                            ) : (
                              <X size={16} className="text-gray-400 flex-shrink-0" />
                            )}
                            <span
                              className={`text-sm ${
                                option.is_correct
                                  ? 'text-green-800 dark:text-green-300 font-medium'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {option.text}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {question.time_limit_seconds}s
                      </span>
                      <span className="flex items-center gap-1">
                        <Award size={14} />
                        {question.points} pts
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          question.difficulty === 'easy'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(question)}
                      title="Edit question"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDeleteClick(question)}
                      disabled={deleteMutation.isPending}
                      title="Delete question"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Plus size={40} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Questions Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add your first question to this question set
            </p>
            <Button variant="primary" onClick={handleCreateClick}>
              <Plus size={20} className="mr-2" />
              Add First Question
            </Button>
          </div>
        )}

        {/* Question Editor Modal */}
        <QuestionEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveQuestion}
          question={selectedQuestion}
          mode={editorMode}
          questionSetId={id!}
          nextOrderIndex={questions?.length || 0}
        />
      </div>
    </DashboardLayout>
  );
}
