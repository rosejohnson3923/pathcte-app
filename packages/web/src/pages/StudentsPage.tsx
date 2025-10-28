/**
 * StudentsPage
 * ============
 * Manage students and view their progress (Teacher view)
 */

import { useState } from 'react';
import { DashboardLayout } from '../components/layout';
import { Card, Button, Spinner, Input } from '../components/common';
import { Users, UserPlus, Search, Trophy, Gamepad2, BookOpen } from 'lucide-react';

export default function StudentsPage() {
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with real data from hooks
  const students = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.j@school.edu',
      games_played: 12,
      pathkeys_collected: 24,
      total_score: 1250,
      last_active: '2025-01-28',
    },
    {
      id: '2',
      name: 'Sam Williams',
      email: 'sam.w@school.edu',
      games_played: 8,
      pathkeys_collected: 15,
      total_score: 890,
      last_active: '2025-01-27',
    },
    {
      id: '3',
      name: 'Jordan Lee',
      email: 'jordan.l@school.edu',
      games_played: 15,
      pathkeys_collected: 32,
      total_score: 1580,
      last_active: '2025-01-28',
    },
  ];

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Users className="absolute top-5 right-10 w-20 h-20 text-white" />
            <Users className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Users className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-white">
                    My Students
                  </h1>
                  <p className="text-teal-100 text-lg">
                    Track progress and manage your classroom
                  </p>
                </div>
              </div>
              <Button variant="outline" className="!bg-white !text-teal-700 !border-white hover:!bg-teal-50 hover:!text-teal-800 dark:!bg-teal-700 dark:!text-white dark:!border-teal-600 dark:hover:!bg-teal-800 font-semibold shadow-lg">
                <UserPlus size={20} className="mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={20} />}
            fullWidth
          />
        </div>

        {/* Students List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  {/* Student Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {student.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last active: {new Date(student.last_active).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
                        <Gamepad2 size={18} />
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {student.games_played}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Games</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                        <Trophy size={18} />
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {student.pathkeys_collected}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pathkeys</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                        <BookOpen size={18} />
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {student.total_score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Score</p>
                    </div>

                    <Button variant="outline" size="sm" className="dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-100 dark:hover:!bg-gray-600">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No students found' : 'No Students Yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Add students to start tracking their progress'}
            </p>
            {!searchTerm && (
              <Button variant="outline" className="!bg-white !text-teal-700 !border-teal-200 hover:!bg-teal-50 hover:!text-teal-800 dark:!bg-teal-700 dark:!text-white dark:!border-teal-600 dark:hover:!bg-teal-800 font-semibold">
                <UserPlus size={20} className="mr-2" />
                Add Your First Student
              </Button>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Coming Soon: Student Management Features
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            Full student management features including adding students, viewing detailed progress reports,
            and assigning homework are currently in development.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
