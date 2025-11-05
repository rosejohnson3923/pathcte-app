/**
 * TournamentLeaderboard
 * =====================
 * Dual-tab leaderboard component for tournament gameplay
 * Shows both tournament-wide rankings and classroom-specific rankings
 */

import { useState, useEffect } from 'react';
import { Card, Spinner } from '../common';
import { tournamentService } from '@pathcte/shared';
import { Trophy, Users, School, Crown, Medal, Award } from 'lucide-react';
import type { TournamentLeaderboardEntry } from '@pathcte/shared';

interface TournamentLeaderboardProps {
  tournamentId: string;
  currentGameSessionId: string;
  currentPlayerId?: string;
  className?: string;
}

type LeaderboardTab = 'tournament' | 'classroom';

export function TournamentLeaderboard({
  tournamentId,
  currentGameSessionId,
  currentPlayerId,
  className = '',
}: TournamentLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('tournament');
  const [tournamentLeaderboard, setTournamentLeaderboard] = useState<TournamentLeaderboardEntry[]>(
    []
  );
  const [classroomLeaderboard, setClassroomLeaderboard] = useState<TournamentLeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await tournamentService.getTournamentLeaderboard(tournamentId, 100);
        setTournamentLeaderboard(data);

        // Filter classroom-specific leaderboard
        const classroomData = data.filter((entry: TournamentLeaderboardEntry) => entry.game_session_id === currentGameSessionId);
        setClassroomLeaderboard(classroomData);
      } catch (err) {
        console.error('Error loading tournament leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [tournamentId, currentGameSessionId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = tournamentService.subscribeTournamentLeaderboard(
      tournamentId,
      (updatedLeaderboard: TournamentLeaderboardEntry[]) => {
        setTournamentLeaderboard(updatedLeaderboard);

        // Update classroom leaderboard
        const classroomData = updatedLeaderboard.filter(
          (entry: TournamentLeaderboardEntry) => entry.game_session_id === currentGameSessionId
        );
        setClassroomLeaderboard(classroomData);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [tournamentId, currentGameSessionId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-700" />;
      default:
        return null;
    }
  };

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg';
      case 2:
        return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md';
      case 3:
        return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md';
      default:
        return 'bg-bg-tertiary text-text-secondary';
    }
  };

  const renderLeaderboardEntry = (
    entry: TournamentLeaderboardEntry,
    showClassroom: boolean
  ) => {
    const isCurrentPlayer = currentPlayerId === entry.player_id;
    const isTopThree = entry.rank <= 3;

    return (
      <div
        key={entry.player_id}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
          isCurrentPlayer
            ? 'bg-purple-500/20 border-2 border-purple-500 shadow-md'
            : isTopThree
              ? 'bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30'
              : 'bg-bg-secondary/50 hover:bg-bg-secondary'
        }`}
      >
        {/* Rank */}
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadgeClass(entry.rank)}`}
          >
            {entry.rank}
          </div>
          {getRankIcon(entry.rank)}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-medium truncate ${isCurrentPlayer ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-text-primary'}`}
            >
              {entry.display_name}
              {isCurrentPlayer && ' (You)'}
            </span>
          </div>
          {showClassroom && (
            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <School className="w-3 h-3" />
              <span className="truncate">{entry.classroom_name}</span>
            </div>
          )}
        </div>

        {/* Score */}
        <div className="text-right">
          <div
            className={`text-xl font-bold ${isCurrentPlayer ? 'text-purple-600 dark:text-purple-400' : 'text-text-primary'}`}
          >
            {entry.total_score}
          </div>
          <div className="text-xs text-text-secondary">
            {entry.total_correct}/{entry.total_answers}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Card variant="glass" className={className}>
        <Card.Content className="text-center py-8">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-red-500 opacity-50" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card variant="glass" className={className}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Leaderboard
          </Card.Title>
          {isLoading && <Spinner size="sm" />}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('tournament')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'tournament'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Tournament
          </button>
          <button
            onClick={() => setActiveTab('classroom')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'classroom'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            }`}
          >
            <School className="w-4 h-4 inline mr-2" />
            My Classroom
          </button>
        </div>
      </Card.Header>

      <Card.Content>
        {/* Tournament Tab */}
        {activeTab === 'tournament' && (
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : tournamentLeaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                <p className="text-text-secondary">No players yet</p>
              </div>
            ) : (
              <>
                <div className="mb-3 pb-2 border-b border-border-default">
                  <p className="text-sm text-text-secondary">
                    Top {Math.min(50, tournamentLeaderboard.length)} players across all classrooms
                  </p>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {tournamentLeaderboard.slice(0, 50).map((entry) =>
                    renderLeaderboardEntry(entry, true)
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Classroom Tab */}
        {activeTab === 'classroom' && (
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : classroomLeaderboard.length === 0 ? (
              <div className="text-center py-12">
                <School className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                <p className="text-text-secondary">No players in your classroom yet</p>
              </div>
            ) : (
              <>
                <div className="mb-3 pb-2 border-b border-border-default">
                  <p className="text-sm text-text-secondary flex items-center gap-2">
                    <School className="w-4 h-4" />
                    {classroomLeaderboard[0]?.classroom_name} -{' '}
                    {classroomLeaderboard.length} player
                    {classroomLeaderboard.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {classroomLeaderboard.map((entry) =>
                    renderLeaderboardEntry(entry, false)
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer Info */}
        {!isLoading && (activeTab === 'tournament' ? tournamentLeaderboard : classroomLeaderboard).length > 0 && (
          <div className="mt-4 pt-4 border-t border-border-default">
            <div className="flex items-center justify-center gap-4 text-xs text-text-secondary">
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500" />
                <span>1st Place</span>
              </div>
              <div className="flex items-center gap-1">
                <Medal className="w-3 h-3 text-gray-400" />
                <span>2nd Place</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-700" />
                <span>3rd Place</span>
              </div>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
