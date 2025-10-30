/**
 * QuestionSetsPage
 * ================
 * Manage question sets for teachers
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { Card, Button, Badge, Spinner } from '../components/common';
import { FileQuestion, Plus, Edit, Trash2, Copy, Search } from 'lucide-react';
import { useQuestionSets, useMyQuestionSets, useCreateQuestionSet, useUpdateQuestionSet, useDeleteQuestionSet } from '../hooks';
import { QuestionSetEditorModal } from '../components/QuestionSetEditorModal';
import { toast } from '@pathcte/shared';
import type { QuestionSet } from '@pathcte/shared';

export default function QuestionSetsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<QuestionSet | null>(null);

  // Fetch question sets based on view mode
  const allSetsQuery = useQuestionSets();
  const mySetsQuery = useMyQuestionSets();

  const { data: questionSets, isLoading, error } = viewMode === 'all' ? allSetsQuery : mySetsQuery;

  // Mutations
  const createMutation = useCreateQuestionSet();
  const updateMutation = useUpdateQuestionSet();
  const deleteMutation = useDeleteQuestionSet();

  // Filter question sets based on search and filters
  const filteredSets = questionSets?.filter((set) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = set.title.toLowerCase().includes(searchLower);
      const descMatch = set.description?.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch) return false;
    }

    // Subject filter
    if (selectedSubject && set.subject !== selectedSubject) return false;

    // Grade filter
    if (selectedGrade) {
      const gradeNum = parseInt(selectedGrade);
      if (!set.grade_level?.includes(gradeNum)) return false;
    }

    return true;
  });

  // Extract unique subjects for filter
  const subjects = Array.from(new Set(questionSets?.map((set) => set.subject).filter(Boolean))) as string[];

  // Handlers
  const handleCreateClick = () => {
    setEditorMode('create');
    setSelectedQuestionSet(null);
    setIsEditorOpen(true);
  };

  const handleEditClick = (set: QuestionSet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditorMode('edit');
    setSelectedQuestionSet(set);
    setIsEditorOpen(true);
  };

  const handleDuplicateClick = async (set: QuestionSet, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const duplicatedSet = {
        ...set,
        title: `${set.title} (Copy)`,
        is_public: false,
        times_played: 0,
        average_score: null,
      };

      delete (duplicatedSet as any).id;
      delete (duplicatedSet as any).created_at;
      delete (duplicatedSet as any).updated_at;

      await createMutation.mutateAsync(duplicatedSet);
      toast.success('Question set duplicated successfully!');
    } catch (error) {
      toast.error('Failed to duplicate question set');
      console.error(error);
    }
  };

  const handleDeleteClick = async (set: QuestionSet, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${set.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(set.id);
      toast.success('Question set deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete question set');
      console.error(error);
    }
  };

  const handleSaveQuestionSet = async (data: Partial<QuestionSet>) => {
    if (editorMode === 'create') {
      await createMutation.mutateAsync(data);
      toast.success('Question set created successfully!');
    } else if (selectedQuestionSet) {
      await updateMutation.mutateAsync({
        id: selectedQuestionSet.id,
        updates: data,
      });
      toast.success('Question set updated successfully!');
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <FileQuestion className="absolute top-5 right-10 w-20 h-20 text-white" />
            <FileQuestion className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <FileQuestion className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-white">
                    Question Sets
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Create and manage question sets for your games
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="!bg-white !text-indigo-700 !border-white hover:!bg-indigo-50 hover:!text-indigo-800 dark:!bg-indigo-700 dark:!text-white dark:!border-indigo-600 dark:hover:!bg-indigo-800 font-semibold shadow-lg"
                onClick={handleCreateClick}
              >
                <Plus size={20} className="mr-2" />
                Create New Set
              </Button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Filters */}
        <div className="mb-6 space-y-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('all')}
            >
              All Question Sets
            </Button>
            <Button
              variant={viewMode === 'mine' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mine')}
            >
              My Question Sets
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search question sets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Grades</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          {/* Results Count */}
          {filteredSets && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredSets.length} of {questionSets?.length || 0} question sets
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-300">
              Failed to load question sets. Please try again.
            </p>
          </div>
        )}

        {/* Question Sets List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredSets && filteredSets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSets.map((set) => (
              <Card
                key={set.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/question-sets/${set.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {set.title}
                      </h3>
                      {set.is_public && (
                        <Badge variant="success">Public</Badge>
                      )}
                      {set.is_verified && (
                        <Badge variant="info">Verified</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {set.description}
                    </p>

                    {/* Additional Info */}
                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-500">
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
                        {set.subject}
                      </span>
                      {set.career_sector && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                          {set.career_sector}
                        </span>
                      )}
                      {set.difficulty_level && (
                        <span className={`px-2 py-1 rounded ${
                          set.difficulty_level === 'easy'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : set.difficulty_level === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}>
                          {set.difficulty_level}
                        </span>
                      )}
                      {set.grade_level && set.grade_level.length > 0 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          Grades {Math.min(...set.grade_level)}-{Math.max(...set.grade_level)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">
                      {set.total_questions} questions
                    </span>
                    {set.times_played > 0 && (
                      <span>
                        Played {set.times_played}x
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Duplicate"
                      onClick={(e) => handleDuplicateClick(set, e)}
                      disabled={createMutation.isPending}
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Edit"
                      onClick={(e) => handleEditClick(set, e)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                      onClick={(e) => handleDeleteClick(set, e)}
                      disabled={deleteMutation.isPending}
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
              <FileQuestion size={40} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {questionSets && questionSets.length > 0 ? 'No Matching Question Sets' : 'No Question Sets Yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {questionSets && questionSets.length > 0
                ? 'Try adjusting your filters or search term'
                : viewMode === 'mine'
                ? 'Create your first question set to start hosting games'
                : 'No question sets available yet'}
            </p>
            {questionSets && questionSets.length > 0 ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('');
                  setSelectedGrade('');
                }}
              >
                Clear Filters
              </Button>
            ) : viewMode === 'mine' ? (
              <Button
                variant="outline"
                className="!bg-white !text-indigo-700 !border-indigo-200 hover:!bg-indigo-50 hover:!text-indigo-800 dark:!bg-indigo-700 dark:!text-white dark:!border-indigo-600 dark:hover:!bg-indigo-800 font-semibold"
                onClick={handleCreateClick}
              >
                <Plus size={20} className="mr-2" />
                Create Your First Set
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setViewMode('all')}
              >
                View All Question Sets
              </Button>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Question Set Management
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            {questionSets && questionSets.length > 0
              ? `You have access to ${questionSets.length} question sets. The question set editor for creating and modifying content is coming soon.`
              : 'Question sets have been generated and imported. The complete editing interface is currently in development.'}
          </p>
        </div>

        {/* Question Set Editor Modal */}
        <QuestionSetEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveQuestionSet}
          questionSet={selectedQuestionSet}
          mode={editorMode}
        />
      </div>
    </DashboardLayout>
  );
}
