/**
 * TournamentCoordinatorPage
 * ==========================
 * Tournament coordinator dashboard for monitoring and managing tournament
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { Button, Card, Spinner, Badge } from '../components/common';
import { useAuth } from '../hooks';
import { tournamentService } from '@pathcte/shared';
import {
  Trophy,
  Users,
  School,
  Copy,
  Check,
  Play,
  Clock,
  Zap,
  Settings,
  BarChart3,
  AlertCircle,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import type {
  Tournament,
  GameSession,
  TournamentLeaderboardEntry,
  ClassroomRanking,
} from '@pathcte/shared';

type TabType = 'classrooms' | 'tournament-leaderboard' | 'classroom-rankings';

export default function TournamentCoordinatorPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [classrooms, setClassrooms] = useState<GameSession[]>([]);
  const [leaderboard, setLeaderboard] = useState<TournamentLeaderboardEntry[]>([]);
  const [rankings, setRankings] = useState<ClassroomRanking[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('classrooms');
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isCoordinator, setIsCoordinator] = useState(true);
  const [myClassroom, setMyClassroom] = useState<GameSession | null>(null);

  // Load tournament and initial data via Azure Functions (bypasses RLS)
  useEffect(() => {
    if (!tournamentId || !profile) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First try to load as coordinator (bypasses RLS)
        try {
          const coordinatorData = await tournamentService.getTournamentCoordinatorData(tournamentId);

          setTournament(coordinatorData.tournament);
          setClassrooms(coordinatorData.classrooms);
          setLeaderboard(coordinatorData.tournamentLeaderboard);
          setRankings(coordinatorData.classroomRankings);
          setIsCoordinator(true);
        } catch (err: any) {
          // If 403 Forbidden, user is a participant, not coordinator
          if (err.message?.includes('Forbidden') || err.message?.includes('403')) {
            console.log('[TournamentPage] User is participant, loading participant view');
            setIsCoordinator(false);

            // Load tournament data (accessible via RLS for participants)
            const tournamentData = await tournamentService.getTournamentById(tournamentId);
            if (!tournamentData) {
              throw new Error('Tournament not found');
            }
            setTournament(tournamentData);

            // Load classrooms in tournament (to find user's classroom)
            const classroomsData = await tournamentService.getTournamentClassrooms(tournamentId);
            setClassrooms(classroomsData);

            // Find user's classroom
            const userClassroom = classroomsData.find((c: GameSession) => c.host_id === profile.id);
            setMyClassroom(userClassroom || null);

            // Load leaderboards
            const leaderboardData = await tournamentService.getTournamentLeaderboard(tournamentId);
            setLeaderboard(leaderboardData);

            const rankingsData = await tournamentService.getClassroomRankings(tournamentId);
            setRankings(rankingsData);
          } else {
            // Other error, rethrow
            throw err;
          }
        }
      } catch (err) {
        console.error('Error loading tournament:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tournament');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [tournamentId, profile]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!tournamentId) return;

    const unsubscribeTournament = tournamentService.subscribeTournament(
      tournamentId,
      (updatedTournament: Tournament) => {
        setTournament(updatedTournament);
      }
    );

    const unsubscribeClassrooms = tournamentService.subscribeTournamentClassrooms(
      tournamentId,
      (updatedClassrooms: GameSession[]) => {
        setClassrooms(updatedClassrooms);
      }
    );

    const unsubscribeLeaderboard = tournamentService.subscribeTournamentLeaderboard(
      tournamentId,
      (updatedLeaderboard: TournamentLeaderboardEntry[]) => {
        setLeaderboard(updatedLeaderboard);
      }
    );

    return () => {
      unsubscribeTournament();
      unsubscribeClassrooms();
      unsubscribeLeaderboard();
    };
  }, [tournamentId]);

  const handleStartTournament = async () => {
    if (!tournament || !profile) return;

    setIsStarting(true);
    setError(null);

    try {
      await tournamentService.startTournament(tournament.id, profile.id);
      // Tournament state will update via subscription
    } catch (err) {
      console.error('Error starting tournament:', err);
      setError(err instanceof Error ? err.message : 'Failed to start tournament');
      setIsStarting(false);
    }
  };

  const handleCopyTournamentCode = async () => {
    if (tournament?.tournament_code) {
      await navigator.clipboard.writeText(tournament.tournament_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRefresh = async () => {
    if (!tournamentId) return;

    try {
      const [classroomsData, leaderboardData, rankingsData] = await Promise.all([
        tournamentService.getTournamentClassrooms(tournamentId),
        tournamentService.getTournamentLeaderboard(tournamentId),
        tournamentService.getClassroomRankings(tournamentId),
      ]);
      setClassrooms(classroomsData);
      setLeaderboard(leaderboardData);
      setRankings(rankingsData);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  if (!profile || profile.user_type !== 'teacher') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card variant="glass" className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">Teachers Only</h2>
            <p className="text-text-secondary">
              Only teachers can access the tournament coordinator dashboard.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !tournament) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card variant="glass" className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">Error</h2>
            <p className="text-text-secondary mb-6">{error || 'Tournament not found'}</p>
            <Button onClick={() => navigate('/tournaments')}>Back to Tournaments</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const canStartTournament =
    tournament.start_mode === 'coordinated' &&
    tournament.status === 'waiting' &&
    classrooms.length > 0;

  const totalPlayers = classrooms.reduce((sum, classroom) => {
    // Count players from leaderboard for this classroom
    return sum + leaderboard.filter((p) => p.game_session_id === classroom.id).length;
  }, 0);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      setup: { variant: 'info' as const, label: 'Ready' },
      waiting: { variant: 'warning' as const, label: 'Waiting to Start' },
      in_progress: { variant: 'success' as const, label: 'In Progress' },
      completed: { variant: 'default' as const, label: 'Completed' },
      cancelled: { variant: 'danger' as const, label: 'Cancelled' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.setup;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              {tournament.title}
            </h1>
            {tournament.description && (
              <p className="text-text-secondary mt-2">{tournament.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(tournament.status)}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Participant View: My Classroom Card */}
        {!isCoordinator && myClassroom && (
          <Card className="bg-gradient-to-br from-teal-500 to-cyan-600">
            <Card.Content className="py-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">My Classroom</p>
                  <h2 className="text-3xl font-bold text-white">{myClassroom.classroom_name}</h2>
                </div>
                <School className="w-12 h-12 text-white/30" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">Student Game Code</p>
                  <h3 className="text-2xl font-bold tracking-widest font-mono text-white">
                    {myClassroom.game_code}
                  </h3>
                </div>
                <Button
                  onClick={() => navigate(`/game/${myClassroom.id}`)}
                  className="!bg-white !text-gray-900 dark:!text-gray-900 hover:!bg-gray-100 hover:!text-black font-bold shadow-lg border-2 border-teal-200"
                >
                  <Users className="w-4 h-4 mr-2 text-gray-900" />
                  <span className="text-gray-900">Go to Game Lobby</span>
                  <ChevronRight className="w-4 h-4 ml-2 text-gray-900" />
                </Button>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Coordinator View: Tournament Code Card */}
        {isCoordinator && (
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <Card.Content className="flex items-center justify-between py-6">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Tournament Code</p>
                <h2 className="text-4xl font-bold tracking-widest font-mono">
                  {tournament.tournament_code}
                </h2>
                <p className="text-purple-100 text-sm mt-2">
                  Share this code with teachers to join the tournament
                </p>
              </div>
              <button
                onClick={handleCopyTournamentCode}
                className="p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                title="Copy tournament code"
              >
                {copiedCode ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </Card.Content>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass">
            <Card.Content className="text-center py-6">
              <School className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-3xl font-bold text-text-primary">{classrooms.length}</div>
              <div className="text-sm text-text-secondary">Classrooms</div>
            </Card.Content>
          </Card>
          <Card variant="glass">
            <Card.Content className="text-center py-6">
              <Users className="w-8 h-8 mx-auto mb-2 text-teal-500" />
              <div className="text-3xl font-bold text-text-primary">{totalPlayers}</div>
              <div className="text-sm text-text-secondary">Total Players</div>
            </Card.Content>
          </Card>
          <Card variant="glass">
            <Card.Content className="text-center py-6">
              {tournament.start_mode === 'coordinated' ? (
                <Zap className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              ) : (
                <Users className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              )}
              <div className="text-sm font-medium text-text-primary capitalize">
                {tournament.start_mode}
              </div>
              <div className="text-xs text-text-secondary">Start Mode</div>
            </Card.Content>
          </Card>
          <Card variant="glass">
            <Card.Content className="text-center py-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <div className="text-sm font-medium text-text-primary capitalize">
                {tournament.progression_mode}
              </div>
              <div className="text-xs text-text-secondary">Progression</div>
            </Card.Content>
          </Card>
        </div>

        {/* Start Tournament Button (Coordinated Mode - Coordinator Only) */}
        {isCoordinator && canStartTournament && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500">
            <Card.Content className="flex items-center justify-between py-4">
              <div>
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
                  Ready to Start
                </h3>
                <p className="text-sm text-green-700 dark:text-green-200">
                  {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''} joined and
                  waiting. Click start to begin all games simultaneously.
                </p>
              </div>
              <Button
                onClick={handleStartTournament}
                disabled={isStarting}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {isStarting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Tournament
                  </>
                )}
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border-default">
          <button
            onClick={() => setActiveTab('classrooms')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'classrooms'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <School className="w-4 h-4 inline mr-2" />
            Classrooms ({classrooms.length})
          </button>
          <button
            onClick={() => setActiveTab('tournament-leaderboard')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'tournament-leaderboard'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Tournament Leaderboard ({leaderboard.length})
          </button>
          <button
            onClick={() => setActiveTab('classroom-rankings')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'classroom-rankings'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Classroom Rankings
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Classrooms Tab */}
          {activeTab === 'classrooms' && (
            <div className="space-y-4">
              {classrooms.length === 0 ? (
                <Card variant="glass" className="text-center py-12">
                  <School className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    No Classrooms Yet
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Share the tournament code with teachers to get started
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <span className="text-sm text-text-secondary">Tournament Code:</span>
                    <span className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">
                      {tournament.tournament_code}
                    </span>
                  </div>
                </Card>
              ) : (
                classrooms.map((classroom) => {
                  const playerCount = leaderboard.filter(
                    (p) => p.game_session_id === classroom.id
                  ).length;

                  return (
                    <Card key={classroom.id} variant="glass">
                      <Card.Content className="flex items-center justify-between py-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <School className="w-5 h-5 text-purple-500" />
                            <h3 className="text-lg font-bold text-text-primary">
                              {classroom.classroom_name}
                            </h3>
                            {getStatusBadge(classroom.status)}
                          </div>
                          <div className="flex items-center gap-6 text-sm text-text-secondary">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>
                                {playerCount} player{playerCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Game Code:</span>
                              <span className="font-mono font-bold text-text-primary">
                                {classroom.game_code}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/game/${classroom.id}`)}
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Card.Content>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* Tournament Leaderboard Tab */}
          {activeTab === 'tournament-leaderboard' && (
            <Card variant="glass">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Tournament Leaderboard
                </Card.Title>
                <Card.Description>Top players across all classrooms</Card.Description>
              </Card.Header>
              <Card.Content>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                    <p className="text-text-secondary">No players have joined yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.slice(0, 50).map((entry, index) => (
                      <div
                        key={entry.player_id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index < 3
                            ? 'bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30'
                            : 'bg-bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? 'bg-amber-500 text-white'
                                : index === 1
                                  ? 'bg-gray-400 text-white'
                                  : index === 2
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-bg-tertiary text-text-secondary'
                            }`}
                          >
                            {entry.rank}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-text-primary">
                              {entry.display_name}
                            </div>
                            <div className="text-sm text-text-secondary flex items-center gap-2">
                              <School className="w-3 h-3" />
                              {entry.classroom_name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-text-primary">
                            {entry.total_score}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {entry.total_correct}/{entry.total_answers} correct
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          )}

          {/* Classroom Rankings Tab */}
          {activeTab === 'classroom-rankings' && (
            <Card variant="glass">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-500" />
                  Classroom Rankings
                </Card.Title>
                <Card.Description>Performance by classroom</Card.Description>
              </Card.Header>
              <Card.Content>
                {rankings.length === 0 ? (
                  <div className="text-center py-12">
                    <School className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                    <p className="text-text-secondary">No classroom data available yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rankings.map((ranking, index) => (
                      <div
                        key={ranking.game_session_id}
                        className={`p-4 rounded-lg border-2 ${
                          index === 0
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-border-default bg-bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                index === 0
                                  ? 'bg-amber-500 text-white'
                                  : index === 1
                                    ? 'bg-gray-400 text-white'
                                    : index === 2
                                      ? 'bg-amber-700 text-white'
                                      : 'bg-bg-tertiary text-text-secondary'
                              }`}
                            >
                              {ranking.rank}
                            </div>
                            <div>
                              <h3 className="font-bold text-text-primary">
                                {ranking.classroom_name}
                              </h3>
                              <p className="text-sm text-text-secondary">
                                {ranking.player_count} player
                                {ranking.player_count !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-text-primary">
                              {ranking.total_score}
                            </div>
                            <div className="text-xs text-text-secondary">Total Points</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">Average Score</span>
                          <span className="font-bold text-text-primary">
                            {ranking.avg_score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Settings Link */}
        <Card variant="glass">
          <Card.Content className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-text-secondary" />
              <div>
                <h3 className="font-medium text-text-primary">Tournament Settings</h3>
                <p className="text-sm text-text-secondary">
                  Max Classrooms: {tournament.max_classrooms} • Max Players per Classroom:{' '}
                  {tournament.max_players_per_classroom} • Late Join:{' '}
                  {tournament.allow_late_join ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </DashboardLayout>
  );
}
