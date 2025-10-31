/**
 * StudentsPage
 * ============
 * Manage students and view their progress (Teacher view)
 */

import { useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout';
import { Card, Button, Spinner, Input } from '../components/common';
import { Users, Search, Trophy, Gamepad2, Target, TrendingUp } from 'lucide-react';
import { useStudentStats } from '../hooks';

export default function StudentsPage() {
  const { data: students, isLoading } = useStudentStats();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'games' | 'accuracy'>('score');

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    if (!students) return [];

    let filtered = students;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.display_name.toLowerCase().includes(term) ||
          student.email?.toLowerCase().includes(term)
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.display_name.localeCompare(b.display_name);
        case 'score':
          return b.total_score - a.total_score;
        case 'games':
          return b.total_games - a.total_games;
        case 'accuracy':
          return b.accuracy - a.accuracy;
        default:
          return 0;
      }
    });
  }, [students, searchTerm, sortBy]);

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <Users className="absolute top-5 right-10 w-20 h-20 text-white" />
            <Users className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-display font-bold text-white">
                Student Progress
              </h1>
            </div>
            <p className="text-blue-100 text-lg ml-20">
              Track individual student performance and engagement
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="score">Total Score</option>
              <option value="games">Games Played</option>
              <option value="accuracy">Accuracy</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {filteredAndSortedStudents.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Showing {filteredAndSortedStudents.length} of {students?.length || 0} students
          </p>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredAndSortedStudents.length > 0 ? (
          /* Student List */
          <div className="grid grid-cols-1 gap-4">
            {filteredAndSortedStudents.map((student) => (
              <Card key={student.user_id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {student.display_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {student.display_name}
                        </h3>
                        {student.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {/* Games Played */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Gamepad2 size={16} className="text-purple-600 dark:text-purple-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Games</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {student.total_games}
                      </p>
                    </div>

                    {/* Average Score */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target size={16} className="text-blue-600 dark:text-blue-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Avg Score</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {student.average_score.toFixed(1)}
                      </p>
                    </div>

                    {/* Accuracy */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {student.accuracy.toFixed(1)}%
                      </p>
                    </div>

                    {/* Pathkeys */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Trophy size={16} className="text-amber-600 dark:text-amber-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pathkeys</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {student.pathkeys_earned}
                      </p>
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="md:border-l md:pl-4 border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Last Active</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(student.last_active || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {students && students.length > 0 ? 'No Matching Students' : 'No Students Yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {students && students.length > 0
                ? 'Try adjusting your search term'
                : 'Students will appear here once they join and play games'}
            </p>
            {students && students.length > 0 && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Info Card */}
        {!isLoading && students && students.length > 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Student Progress Tracking
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              This page shows all students who have participated in your games. Stats update automatically
              as students play. Use the search and sort options to find specific students or identify
              top performers.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
