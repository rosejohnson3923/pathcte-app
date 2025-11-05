/**
 * JoinTournamentPage
 * ==================
 * Teacher joins a tournament with their classroom
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { Button, Input, Card, Spinner, Badge } from '../components/common';
import { useAuth } from '../hooks';
import { tournamentService, useGameStore } from '@pathcte/shared';
import {
  Trophy,
  Users,
  School,
  Copy,
  Check,
  ArrowRight,
  Info,
  Clock,
  Zap
} from 'lucide-react';
import type { Tournament, GameSession } from '@pathcte/shared';

export default function JoinTournamentPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { setSession, setIsHost } = useGameStore();

  const [tournamentCode, setTournamentCode] = useState('');
  const [classroomName, setClassroomName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearchTournament = async () => {
    if (!tournamentCode.trim()) {
      setError('Please enter a tournament code');
      return;
    }

    setIsSearching(true);
    setError(null);
    setTournament(null);

    try {
      const foundTournament = await tournamentService.getTournamentByCode(tournamentCode);

      if (!foundTournament) {
        setError('Tournament not found. Please check the code and try again.');
        setIsSearching(false);
        return;
      }

      if (foundTournament.status === 'completed' || foundTournament.status === 'cancelled') {
        setError(`This tournament has ${foundTournament.status}. Contact the coordinator for more information.`);
        setIsSearching(false);
        return;
      }

      setTournament(foundTournament);
    } catch (err) {
      console.error('Error searching tournament:', err);
      setError(err instanceof Error ? err.message : 'Failed to find tournament');
    } finally {
      setIsSearching(false);
    }
  };

  const handleJoinTournament = async () => {
    if (!profile) {
      setError('You must be logged in to join a tournament');
      return;
    }

    if (!classroomName.trim()) {
      setError('Please enter your classroom name');
      return;
    }

    if (!tournament) {
      setError('Please search for a tournament first');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const session = await tournamentService.joinTournamentAsClassroom({
        tournamentCode: tournament.tournament_code,
        hostId: profile.id,
        classroomName: classroomName.trim(),
      });

      setGameSession(session);
      setSession(session);
      setIsHost(true);
    } catch (err) {
      console.error('Error joining tournament:', err);
      setError(err instanceof Error ? err.message : 'Failed to join tournament');
      setIsJoining(false);
    }
  };

  const handleCopyGameCode = async () => {
    if (gameSession?.game_code) {
      await navigator.clipboard.writeText(gameSession.game_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoToGame = () => {
    if (gameSession) {
      navigate(`/game/${gameSession.id}`);
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
              Only teachers can join tournaments as classroom hosts. Please log in with a teacher account.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Success state - show game code
  if (gameSession) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Successfully Joined Tournament!
            </h1>
            <p className="text-text-secondary">
              Your classroom has been added to the tournament
            </p>
          </div>

          {/* Tournament Info */}
          <Card variant="glass">
            <Card.Content className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-text-secondary">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">{tournament?.title}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-text-secondary">
                <School className="w-4 h-4" />
                <span className="text-sm">{classroomName}</span>
              </div>
            </Card.Content>
          </Card>

          {/* Student Game Code */}
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <Card.Content className="text-center py-8">
              <p className="text-purple-100 text-sm font-medium mb-2">
                Student Game Code
              </p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <h2 className="text-6xl font-bold tracking-widest font-mono">
                  {gameSession.game_code}
                </h2>
                <button
                  onClick={handleCopyGameCode}
                  className="p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  title="Copy game code"
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-purple-100 text-sm">
                Share this code with your students to join your classroom
              </p>
            </Card.Content>
          </Card>

          {/* Instructions */}
          <Card variant="glass">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Next Steps
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Share the game code</div>
                    <div className="text-sm text-text-secondary">
                      Have your students go to the PathCTE website and enter code: <span className="font-mono font-bold">{gameSession.game_code}</span>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Wait for students to join</div>
                    <div className="text-sm text-text-secondary">
                      Monitor the game lobby as students connect
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Start when ready</div>
                    <div className="text-sm text-text-secondary">
                      {tournament?.start_mode === 'coordinated'
                        ? 'The tournament coordinator will start all classrooms together'
                        : 'Start your classroom game when you are ready'}
                    </div>
                  </div>
                </li>
              </ol>
            </Card.Content>
            <Card.Footer>
              <Button onClick={handleGoToGame} className="w-full" size="lg">
                <Users className="w-5 h-5 mr-2" />
                Go to Game Lobby
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            Join Tournament
          </h1>
          <p className="text-text-secondary mt-2">
            Enter the tournament code and your classroom name
          </p>
        </div>

        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </Card>
        )}

        {/* Tournament Code Entry */}
        {!tournament && (
          <Card variant="glass" className="backdrop-blur-lg">
            <Card.Header>
              <Card.Title>Step 1: Enter Tournament Code</Card.Title>
              <Card.Description>
                Get the 6-character code from your tournament coordinator
              </Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <Input
                label="Tournament Code"
                value={tournamentCode}
                onChange={(e) => setTournamentCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest uppercase"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchTournament();
                  }
                }}
              />
              <Button
                onClick={handleSearchTournament}
                disabled={isSearching || !tournamentCode.trim()}
                className="w-full"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    Find Tournament
                  </>
                )}
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Tournament Info & Classroom Name */}
        {tournament && (
          <div className="space-y-6">
            {/* Tournament Details */}
            <Card variant="glass" className="backdrop-blur-lg border-2 border-purple-500/50">
              <Card.Header>
                <div className="flex items-start justify-between">
                  <div>
                    <Card.Title className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      {tournament.title}
                    </Card.Title>
                    {tournament.description && (
                      <Card.Description className="mt-2">
                        {tournament.description}
                      </Card.Description>
                    )}
                  </div>
                  <Badge variant="success">
                    {tournament.status === 'setup' ? 'Ready' : 'Open'}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Content className="space-y-3">
                {tournament.school_name && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <School className="w-4 h-4" />
                    <span className="text-sm">{tournament.school_name}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-default">
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Start Mode</div>
                    <div className="flex items-center gap-2">
                      {tournament.start_mode === 'coordinated' ? (
                        <Zap className="w-4 h-4 text-purple-500" />
                      ) : (
                        <Users className="w-4 h-4 text-purple-500" />
                      )}
                      <span className="text-sm font-medium text-text-primary capitalize">
                        {tournament.start_mode}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Progression</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-medium text-text-primary capitalize">
                        {tournament.progression_mode}
                      </span>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Classroom Name Entry */}
            <Card variant="glass" className="backdrop-blur-lg">
              <Card.Header>
                <Card.Title>Step 2: Enter Your Classroom Name</Card.Title>
                <Card.Description>
                  This helps students identify their classroom in the tournament
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <Input
                  label="Classroom Name"
                  value={classroomName}
                  onChange={(e) => setClassroomName(e.target.value)}
                  placeholder="e.g., Mr. Smith's Math Class or Room 205"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinTournament();
                    }
                  }}
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTournament(null);
                      setTournamentCode('');
                      setError(null);
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleJoinTournament}
                    disabled={isJoining || !classroomName.trim()}
                    className="flex-1"
                    size="lg"
                  >
                    {isJoining ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Tournament
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
