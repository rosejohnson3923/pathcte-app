/**
 * QuestionSetsPage
 * ================
 * Manage question sets for teachers
 */

import { useState } from 'react';
import { DashboardLayout } from '../components/layout';
import { Card, Button, Badge, Spinner } from '../components/common';
import { FileQuestion, Plus, Edit, Trash2, Copy } from 'lucide-react';

export default function QuestionSetsPage() {
  const [isLoading] = useState(false);

  // Mock data - will be replaced with real data from hooks
  const questionSets = [
    {
      id: '1',
      title: 'Career Exploration Basics',
      description: 'Fundamental questions about various career paths',
      total_questions: 25,
      created_at: '2025-01-15',
      is_public: true,
    },
    {
      id: '2',
      title: 'STEM Careers Deep Dive',
      description: 'Advanced questions about science, technology, engineering, and math careers',
      total_questions: 30,
      created_at: '2025-01-20',
      is_public: false,
    },
  ];

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
              <Button variant="outline" className="!bg-white !text-indigo-700 !border-white hover:!bg-indigo-50 hover:!text-indigo-800 dark:!bg-indigo-700 dark:!text-white dark:!border-indigo-600 dark:hover:!bg-indigo-800 font-semibold shadow-lg">
                <Plus size={20} className="mr-2" />
                Create New Set
              </Button>
            </div>
          </div>
        </div>

        {/* Question Sets List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : questionSets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {questionSets.map((set) => (
              <Card key={set.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {set.title}
                      </h3>
                      {set.is_public && (
                        <Badge variant="success">Public</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {set.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">
                      {set.total_questions} questions
                    </span>
                    <span>
                      Created {new Date(set.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Copy size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
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
              No Question Sets Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first question set to start hosting games
            </p>
            <Button variant="outline" className="!bg-white !text-indigo-700 !border-indigo-200 hover:!bg-indigo-50 hover:!text-indigo-800 dark:!bg-indigo-700 dark:!text-white dark:!border-indigo-600 dark:hover:!bg-indigo-800 font-semibold">
              <Plus size={20} className="mr-2" />
              Create Your First Set
            </Button>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Coming Soon: Full Question Set Manager
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            The complete question set creation and editing interface is currently in development.
            For now, you can use the default question sets when hosting games.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
