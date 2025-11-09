/**
 * CreateTournamentPage
 * ====================
 * Tournament coordinator creates a multi-classroom tournament
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { Button, Input, Card, Spinner, Badge } from '../components/common';
import { useAuth, useFilteredQuestionSets } from '../hooks';
import { tournamentService } from '@pathcte/shared';
import {
  Trophy,
  Settings,
  Users,
  BookOpen,
  Play,
  Clock,
  Zap,
  Filter
} from 'lucide-react';
import type { TournamentStartMode, ProgressionMode } from '@pathcte/shared';

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Filter state
  const [gradeFilter, setGradeFilter] = useState<number | undefined>(undefined);
  const [explorationTypeFilter, setExplorationTypeFilter] = useState<'industry' | 'career' | 'cluster' | ''>('');

  // Fetch question sets with filtering
  const { data: questionSets, isLoading: loadingQuestionSets } = useFilteredQuestionSets({
    exploration_type: explorationTypeFilter || undefined,
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<string>('');
  const [schoolName, setSchoolName] = useState('');
  const [startMode, setStartMode] = useState<TournamentStartMode>('independent');
  const [progressionMode, setProgressionMode] = useState<ProgressionMode>('manual');
  const [allowLateJoin, setAllowLateJoin] = useState(false);
  const [maxClassrooms, setMaxClassrooms] = useState(20);
  const [maxPlayersPerClassroom, setMaxPlayersPerClassroom] = useState(60);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-select first question set when loaded
  if (questionSets && questionSets.length > 0 && !selectedQuestionSet) {
    setSelectedQuestionSet(questionSets[0].id);
  }

  // Get selected question set details
  const selectedSet = questionSets?.find((set) => set.id === selectedQuestionSet);

  const handleCreateTournament = async () => {
    console.log('[CreateTournamentPage] handleCreateTournament called');
    console.log('[CreateTournamentPage] Profile:', profile);
    console.log('[CreateTournamentPage] Title:', title);
    console.log('[CreateTournamentPage] Selected Question Set:', selectedQuestionSet);

    if (!profile) {
      console.log('[CreateTournamentPage] Validation failed: No profile');
      setError('You must be logged in to create a tournament');
      return;
    }

    if (!title.trim()) {
      console.log('[CreateTournamentPage] Validation failed: No title');
      setError('Please enter a tournament title');
      return;
    }

    if (!selectedQuestionSet) {
      console.log('[CreateTournamentPage] Validation failed: No question set');
      setError('Please select a question set');
      return;
    }

    console.log('[CreateTournamentPage] All validations passed, starting creation...');
    setIsCreating(true);
    setError(null);

    try {
      const params = {
        coordinatorId: profile.id,
        title: title.trim(),
        description: description.trim() || undefined,
        questionSetId: selectedQuestionSet,
        startMode,
        progressionMode,
        allowLateJoin,
        maxClassrooms,
        maxPlayersPerClassroom,
        schoolName: schoolName.trim() || undefined,
      };
      console.log('[CreateTournamentPage] Creating tournament with params:', params);

      const tournament = await tournamentService.createTournament(params);

      console.log('[CreateTournamentPage] Tournament created successfully:', tournament);
      console.log('[CreateTournamentPage] Navigating to /tournament/' + tournament.id);

      // Navigate to tournament coordinator view
      navigate(`/tournament/${tournament.id}`);
    } catch (err) {
      console.error('[CreateTournamentPage] Error creating tournament:', err);
      console.error('[CreateTournamentPage] Error type:', typeof err);
      console.error('[CreateTournamentPage] Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        raw: err,
      });
      setError(err instanceof Error ? err.message : 'Failed to create tournament');
      setIsCreating(false);
    }
  };

  if (!profile || profile.user_type !== 'teacher') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card variant="glass" className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Teachers Only
            </h2>
            <p className="text-text-secondary">
              Only teachers can create tournaments. Please log in with a teacher account.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              Create Tournament
            </h1>
            <p className="text-text-secondary mt-1">
              Set up a multi-classroom competition
            </p>
          </div>
        </div>

        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tournament Info */}
            <Card variant="glass">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Tournament Information
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <Input
                  label="Tournament Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Spring Career Challenge 2024"
                  required
                />
                <Input
                  label="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your tournament..."
                />
                <Input
                  label="School Name (Optional)"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g., Lincoln High School"
                />
              </Card.Content>
            </Card>

            {/* Tournament Settings */}
            <Card variant="glass">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Tournament Settings
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-6">
                {/* Start Mode */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Start Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStartMode('independent')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        startMode === 'independent'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-border-default hover:border-purple-300'
                      }`}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <div className="font-medium text-text-primary">Independent</div>
                      <div className="text-xs text-text-secondary mt-1">
                        Each classroom starts their own game
                      </div>
                    </button>
                    <button
                      onClick={() => setStartMode('coordinated')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        startMode === 'coordinated'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-border-default hover:border-purple-300'
                      }`}
                    >
                      <Zap className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <div className="font-medium text-text-primary">Coordinated</div>
                      <div className="text-xs text-text-secondary mt-1">
                        You start all classrooms at once
                      </div>
                    </button>
                  </div>
                </div>

                {/* Progression Mode */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Question Progression
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setProgressionMode('manual')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        progressionMode === 'manual'
                          ? 'border-teal-500 bg-teal-500/10'
                          : 'border-border-default hover:border-teal-300'
                      }`}
                    >
                      <Play className="w-6 h-6 mx-auto mb-2 text-teal-500" />
                      <div className="font-medium text-text-primary">Manual</div>
                      <div className="text-xs text-text-secondary mt-1">
                        {startMode === 'coordinated' ? 'You control' : 'Each teacher controls'} question timing
                      </div>
                    </button>
                    <button
                      onClick={() => setProgressionMode('auto')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        progressionMode === 'auto'
                          ? 'border-teal-500 bg-teal-500/10'
                          : 'border-border-default hover:border-teal-300'
                      }`}
                    >
                      <Clock className="w-6 h-6 mx-auto mb-2 text-teal-500" />
                      <div className="font-medium text-text-primary">Auto</div>
                      <div className="text-xs text-text-secondary mt-1">
                        Timer advances automatically
                      </div>
                    </button>
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Max Classrooms"
                    type="number"
                    value={maxClassrooms}
                    onChange={(e) => setMaxClassrooms(Number(e.target.value))}
                    min={1}
                    max={100}
                  />
                  <Input
                    label="Max Players per Classroom"
                    type="number"
                    value={maxPlayersPerClassroom}
                    onChange={(e) => setMaxPlayersPerClassroom(Number(e.target.value))}
                    min={1}
                    max={100}
                  />
                </div>

                {/* Allow Late Join */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border-default hover:bg-bg-secondary transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowLateJoin}
                    onChange={(e) => setAllowLateJoin(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-medium text-text-primary">Allow Late Joining</div>
                    <div className="text-xs text-text-secondary">
                      Students can join after games have started
                    </div>
                  </div>
                </label>
              </Card.Content>
            </Card>

            {/* Question Set Selection */}
            <Card variant="glass">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Select Question Set
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                {/* Filters */}
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter by:</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Grade Level</label>
                    <select
                      value={gradeFilter || ''}
                      onChange={(e) => setGradeFilter(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-text-primary focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Grades</option>
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Type</label>
                    <select
                      value={explorationTypeFilter}
                      onChange={(e) => setExplorationTypeFilter(e.target.value as any)}
                      className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-text-primary focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="career">Career</option>
                      <option value="industry">Industry</option>
                      <option value="cluster">Cluster</option>
                    </select>
                  </div>
                </div>

                {/* Question Set List */}
                {loadingQuestionSets ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="md" />
                  </div>
                ) : questionSets && questionSets.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {questionSets.map((set) => (
                      <button
                        key={set.id}
                        onClick={() => setSelectedQuestionSet(set.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedQuestionSet === set.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-border-default hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium text-text-primary">{set.title}</div>
                            {set.description && (
                              <div className="text-xs text-text-secondary mt-1 line-clamp-1">
                                {set.description}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="default" size="sm">
                                {set.total_questions} questions
                              </Badge>
                              {set.subject && (
                                <Badge variant="outline" size="sm">
                                  {set.subject}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {selectedQuestionSet === set.id && (
                            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    No question sets found. Try adjusting your filters.
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Card variant="glass" className="backdrop-blur-lg">
                <Card.Header>
                  <Card.Title className="text-lg">Tournament Summary</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-3">
                  <div>
                    <div className="text-xs text-text-secondary">Title</div>
                    <div className="text-sm font-medium text-text-primary">
                      {title || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary">Question Set</div>
                    <div className="text-sm font-medium text-text-primary">
                      {selectedSet?.title || 'Not selected'}
                    </div>
                  </div>
                  {selectedSet?.grade_level && (
                    <div>
                      <div className="text-xs text-text-secondary">Grade Level</div>
                      <div className="text-sm font-medium text-text-primary">
                        Grade {selectedSet.grade_level}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-text-secondary">Start Mode</div>
                    <div className="text-sm font-medium text-text-primary capitalize">
                      {startMode}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary">Progression</div>
                    <div className="text-sm font-medium text-text-primary capitalize">
                      {progressionMode}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border-default">
                    <div className="text-xs text-text-secondary mb-2">Limits</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Classrooms:</span>
                        <span className="font-medium text-text-primary">{maxClassrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Per Classroom:</span>
                        <span className="font-medium text-text-primary">{maxPlayersPerClassroom}</span>
                      </div>
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button
                    onClick={handleCreateTournament}
                    disabled={isCreating || !title.trim() || !selectedQuestionSet}
                    className="w-full"
                    size="lg"
                  >
                    {isCreating ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Creating Tournament...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5 mr-2" />
                        Create Tournament
                      </>
                    )}
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
