/**
 * Teacher Dashboard Page
 * =======================
 * Comprehensive classroom analytics and pathkey management for teachers
 *
 * Features:
 * - Student pathkey progress tracking
 * - Popular career/industry/business driver analytics
 * - Question set recommendations for balanced pathkey awards
 * - Students needing help identification
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '../components/layout';
import { Card, Badge, Spinner } from '../components/common';
import {
  GraduationCap,
  Users,
  TrendingUp,
  AlertCircle,
  Trophy,
  Target,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BarChart3,
  Activity,
  Check,
  X,
  Lock,
  Unlock,
  Key,
} from 'lucide-react';
import { teacherAnalyticsService, useAuthStore } from '@pathcte/shared';

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [pathkeyGroupBy, setPathkeyGroupBy] = useState<'career' | 'student'>('career');

  // Fetch teacher analytics data
  const { data: classroomAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['teacher', 'classroom-analytics', user?.id],
    queryFn: () => teacherAnalyticsService.getClassroomAnalytics(user!.id),
    enabled: !!user?.id,
  });

  const { data: studentProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['teacher', 'student-progress', user?.id],
    queryFn: () => teacherAnalyticsService.getStudentPathkeyProgress(user!.id),
    enabled: !!user?.id,
  });

  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['teacher', 'recommendations', user?.id],
    queryFn: () => teacherAnalyticsService.getQuestionSetRecommendations(user!.id),
    enabled: !!user?.id,
  });

  const isLoading = analyticsLoading || progressLoading || recommendationsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <GraduationCap className="absolute top-5 right-10 w-20 h-20 text-white" />
            <Trophy className="absolute bottom-5 left-10 w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-display font-bold text-white">
                Teacher Dashboard
              </h1>
            </div>
            <p className="text-blue-100 text-lg ml-20">
              Classroom pathkey analytics and recommendations
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {classroomAnalytics?.total_students || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {classroomAnalytics?.total_games_played || 0} games played
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pathkeys Awarded</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {classroomAnalytics?.total_pathkeys_awarded || 0}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Total unlocked
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Trophy className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Students Needing Help</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {classroomAnalytics?.students_needing_help.length || 0}
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  Require attention
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertCircle className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Pathkeys Awarded Details */}
        {classroomAnalytics && classroomAnalytics.pathkey_awards.length > 0 && (
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-amber-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Pathkeys Awarded Details
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPathkeyGroupBy('career')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathkeyGroupBy === 'career'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Group by Career
                </button>
                <button
                  onClick={() => setPathkeyGroupBy('student')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathkeyGroupBy === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Group by Student
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {pathkeyGroupBy === 'career' ? (
                // Group by Career
                (() => {
                  const groupedByCareer = classroomAnalytics.pathkey_awards.reduce((acc, award) => {
                    if (!acc[award.career_title]) {
                      acc[award.career_title] = [];
                    }
                    acc[award.career_title].push(award);
                    return acc;
                  }, {} as Record<string, typeof classroomAnalytics.pathkey_awards>);

                  return Object.entries(groupedByCareer)
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([careerTitle, awards]) => (
                      <div key={careerTitle} className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {careerTitle}
                          </h3>
                          <Badge variant="info">
                            {awards.length} student{awards.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {awards.map((award, idx) => (
                            <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                              <span>{award.student_name}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(award.completed_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                })()
              ) : (
                // Group by Student
                (() => {
                  const groupedByStudent = classroomAnalytics.pathkey_awards.reduce((acc, award) => {
                    if (!acc[award.student_name]) {
                      acc[award.student_name] = [];
                    }
                    acc[award.student_name].push(award);
                    return acc;
                  }, {} as Record<string, typeof classroomAnalytics.pathkey_awards>);

                  return Object.entries(groupedByStudent)
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([studentName, awards]) => (
                      <div key={studentName} className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {studentName}
                          </h3>
                          <Badge variant="info">
                            {awards.length} pathkey{awards.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {awards.map((award, idx) => (
                            <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                              <span>{award.career_title}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(award.completed_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                })()
              )}
            </div>
          </Card>
        )}

        {/* Recommended Question Sets */}
        {recommendations && recommendations.length > 0 && (
          <Card className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-amber-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Recommended Question Sets
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              These question sets will help the most students unlock pathkeys
            </p>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.question_set_id}
                  className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {rec.reason}
                      </p>
                    </div>
                    <Badge variant="info">
                      {rec.benefit_student_count} student{rec.benefit_student_count > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rec.benefit_students.slice(0, 5).map((name, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      >
                        {name}
                      </span>
                    ))}
                    {rec.benefit_students.length > 5 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        +{rec.benefit_students.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Careers */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Most Popular Careers
              </h2>
            </div>
            <div className="space-y-3">
              {classroomAnalytics?.most_popular_careers.slice(0, 5).map((career, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{career.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {career.play_count} plays • {career.student_count} students
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={career.avg_accuracy >= 70 ? 'success' : career.avg_accuracy >= 50 ? 'warning' : 'danger'}>
                      {career.avg_accuracy.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
              {(!classroomAnalytics?.most_popular_careers || classroomAnalytics.most_popular_careers.length === 0) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No career games played yet
                </p>
              )}
            </div>
          </Card>

          {/* Popular Industries */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-purple-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Most Popular Industries
              </h2>
            </div>
            <div className="space-y-3">
              {classroomAnalytics?.most_popular_industries.slice(0, 5).map((industry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{industry.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {industry.play_count} plays • {industry.student_count} students
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={industry.avg_accuracy >= 70 ? 'success' : industry.avg_accuracy >= 50 ? 'warning' : 'danger'}>
                      {industry.avg_accuracy.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
              {(!classroomAnalytics?.most_popular_industries || classroomAnalytics.most_popular_industries.length === 0) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No industry games played yet
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Weakest Business Drivers */}
        <Card className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-red-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Business Drivers Needing Practice
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Focus on these areas to help students unlock Business Driver Mastery
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classroomAnalytics?.weakest_business_drivers.map((driver) => (
              <div
                key={driver.driver}
                className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {driver.driver}
                  </h3>
                  <Badge variant={driver.avg_accuracy >= 70 ? 'success' : driver.avg_accuracy >= 50 ? 'warning' : 'danger'}>
                    {driver.avg_accuracy.toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {driver.students_struggling} student{driver.students_struggling !== 1 ? 's' : ''} struggling
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {driver.total_attempts} total attempts
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Students Needing Help */}
        {classroomAnalytics && classroomAnalytics.students_needing_help.length > 0 && (
          <Card className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-orange-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Students Needing Help
              </h2>
            </div>
            <div className="space-y-3">
              {classroomAnalytics.students_needing_help.map((student) => (
                <div
                  key={`${student.student_id}-${student.issue}`}
                  className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {student.student_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{student.student_email}</p>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        {student.details}
                      </p>
                    </div>
                    <Badge variant="warning">
                      {student.issue === 'low_accuracy' && 'Low Accuracy'}
                      {student.issue === 'stuck_progress' && 'Stuck Progress'}
                      {student.issue === 'no_activity' && 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Student Progress Details */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Student Pathkey Progress
            </h2>
          </div>
          <div className="space-y-2">
            {studentProgress?.map((student) => (
              <div key={student.student_id}>
                <button
                  onClick={() => setExpandedStudent(expandedStudent === student.student_id ? null : student.student_id)}
                  className="w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {student.total_pathkeys}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {student.student_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {student.careers_in_progress.length} career{student.careers_in_progress.length !== 1 ? 's' : ''} in progress
                      </p>
                    </div>
                  </div>
                  {expandedStudent === student.student_id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedStudent === student.student_id && (
                  <div className="mt-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Most Played Career</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {student.most_played_career || 'None yet'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Most Played Industry</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {student.most_played_industry || 'None yet'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weakest Business Driver</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {student.weakest_business_driver || 'None yet'}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Careers in Progress</h3>
                    <div className="space-y-2">
                      {student.careers_in_progress.map((career) => (
                        <div
                          key={career.career_id}
                          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{career.career_title}</p>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{career.career_sector}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              {career.career_mastery_unlocked ? (
                                <Check size={16} className="text-green-600" />
                              ) : (
                                <X size={16} className="text-gray-400" />
                              )}
                              <span className={career.career_mastery_unlocked ? 'text-green-600' : 'text-gray-500'}>
                                Career Mastery
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {career.industry_mastery_unlocked ? (
                                <Unlock size={16} className="text-green-600" />
                              ) : (
                                <Lock size={16} className="text-gray-400" />
                              )}
                              <span className={career.industry_mastery_unlocked ? 'text-green-600' : 'text-gray-500'}>
                                Industry Mastery
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {career.business_driver_mastery_unlocked ? (
                                <Key size={16} className="text-green-600" />
                              ) : (
                                <Key size={16} className="text-gray-400" />
                              )}
                              <span className={career.business_driver_mastery_unlocked ? 'text-green-600' : 'text-gray-500'}>
                                Business Driver Mastery
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {(!studentProgress || studentProgress.length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-8">
                No students found in your classroom
              </p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
