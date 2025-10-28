/**
 * GamePage
 * =========
 * Main game container orchestrating the entire game flow
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { GameLobby, QuestionDisplay, Leaderboard, GameResults } from '../components/game';
import { Button, Spinner, Card } from '../components/common';
import { useAuth } from '../hooks';
import { useGameStore, gameService, realtimeService } from '@pathket/shared';
import { ArrowLeft } from 'lucide-react';
import type { GamePlayer } from '@pathket/shared';

export default function GamePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    session,
    currentPlayer,
    players,
    questions,
    currentQuestion,
    currentQuestionIndex,
    isHost,
    setSession,
    setCurrentPlayer,
    setPlayers,
    setQuestions,
    setCurrentQuestionIndex,
    nextQuestion,
    addPlayer,
    updatePlayer,
    resetGame,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ isCorrect: boolean; selectedIndex: number } | null>(null);

  // Load game session and questions
  useEffect(() => {
    if (!sessionId) {
      setError('No game session ID provided');
      setIsLoading(false);
      return;
    }

    const loadGame = async () => {
      setIsLoading(true);

      try {
        // Get game session
        const { session: gameSession, error: sessionError } = await gameService.getGameById(sessionId);

        if (sessionError || !gameSession) {
          throw new Error('Game not found');
        }

        setSession(gameSession);

        // Get players
        const { players: gamePlayers, error: playersError } = await gameService.getGamePlayers(sessionId);

        if (playersError || !gamePlayers) {
          throw new Error('Failed to load players');
        }

        setPlayers(gamePlayers);

        // Find current player
        const player = gamePlayers.find((p: GamePlayer) => p.user_id === user?.id || p.id === currentPlayer?.id);
        if (player) {
          setCurrentPlayer(player);
        }

        // Load questions if game is in progress or completed
        if (gameSession.status !== 'waiting') {
          const { questions: gameQuestions, error: questionsError } = await gameService.getGameQuestions(
            gameSession.question_set_id
          );

          if (questionsError || !gameQuestions) {
            throw new Error('Failed to load questions');
          }

          setQuestions(gameQuestions);
        }
      } catch (err: any) {
        console.error('Error loading game:', err);
        setError(err.message || 'Failed to load game');
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [sessionId, user, setSession, setPlayers, setCurrentPlayer, setQuestions]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!sessionId) return;

    realtimeService.subscribeToGame(sessionId, {
      onGameUpdate: (updatedSession: any) => {
        setSession(updatedSession);

        // If game just started, load questions
        if (updatedSession.status === 'in_progress' && questions.length === 0) {
          gameService.getGameQuestions(updatedSession.question_set_id).then(({ questions: gameQuestions }: any) => {
            if (gameQuestions) {
              setQuestions(gameQuestions);
            }
          });
        }
      },
      onPlayerJoined: (player: GamePlayer) => {
        addPlayer(player);
      },
      onPlayerUpdate: (player: GamePlayer) => {
        updatePlayer(player.id, player);
      },
      onScoreUpdate: (player: GamePlayer) => {
        updatePlayer(player.id, player);
      },
    });

    // Subscribe to broadcast events for question changes
    realtimeService.subscribeToBroadcast(sessionId, 'question_changed', (payload: any) => {
      setCurrentQuestionIndex(payload.question_index);
      setHasAnswered(false);
      setLastAnswer(null);
    });

    return () => {
      realtimeService.unsubscribeFromGame(sessionId);
    };
  }, [sessionId, questions.length, setSession, setQuestions, addPlayer, updatePlayer, setCurrentQuestionIndex]);

  // Game flow handlers
  const handleStartGame = async () => {
    if (!sessionId) return;

    try {
      const { session: updatedSession, error } = await gameService.startGame(sessionId);

      if (error || !updatedSession) {
        throw error || new Error('Failed to start game');
      }

      // Notify all players
      await realtimeService.notifyGameStarting(sessionId);

      // Load questions
      const { questions: gameQuestions } = await gameService.getGameQuestions(updatedSession.question_set_id);
      if (gameQuestions) {
        setQuestions(gameQuestions);
      }
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start game');
    }
  };

  const handleNextQuestion = async () => {
    if (!sessionId) return;

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      nextQuestion();
      await realtimeService.notifyQuestionChanged(sessionId, nextIndex, questions[nextIndex].id);
      setHasAnswered(false);
      setLastAnswer(null);
    } else {
      // End game
      await handleEndGame();
    }
  };

  const handleEndGame = async () => {
    if (!sessionId) return;

    try {
      await gameService.endGame(sessionId);
      await realtimeService.notifyGameEnded(sessionId);
    } catch (err) {
      console.error('Error ending game:', err);
    }
  };

  const handleSubmitAnswer = async (optionIndex: number, timeTaken: number) => {
    if (!currentPlayer || !currentQuestion || !sessionId || hasAnswered) return;

    try {
      const { isCorrect, error } = await gameService.submitAnswer({
        playerId: currentPlayer.id,
        sessionId,
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
        timeTakenMs: timeTaken,
      });

      if (error) {
        throw error;
      }

      setHasAnswered(true);
      setLastAnswer({ isCorrect, selectedIndex: optionIndex });

      // Refresh current player to get updated score
      const { players: updatedPlayers } = await gameService.getGamePlayers(sessionId);
      if (updatedPlayers) {
        setPlayers(updatedPlayers);
        const updated = updatedPlayers.find((p: GamePlayer) => p.id === currentPlayer.id);
        if (updated) {
          setCurrentPlayer(updated);
        }
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const handleLeaveGame = async () => {
    if (currentPlayer) {
      await gameService.updatePlayerConnection(currentPlayer.id, false);
    }
    resetGame();
    navigate('/dashboard');
  };

  const handleReturnHome = () => {
    resetGame();
    navigate('/dashboard');
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

  if (error || !session) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'This game session does not exist.'}</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button variant="outline" onClick={handleLeaveGame} className="mb-4" size="sm">
          <ArrowLeft size={16} className="mr-2" />
          Leave Game
        </Button>

        {/* Game Status: Lobby */}
        {session.status === 'waiting' && (
          <GameLobby
            sessionId={sessionId!}
            isHost={isHost}
            onStartGame={handleStartGame}
            onLeaveGame={handleLeaveGame}
          />
        )}

        {/* Game Status: In Progress */}
        {session.status === 'in_progress' && currentQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main: Question */}
            <div className="lg:col-span-2">
              <QuestionDisplay
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onSubmitAnswer={handleSubmitAnswer}
                hasAnswered={hasAnswered}
                isCorrect={lastAnswer?.isCorrect}
                selectedOptionIndex={lastAnswer?.selectedIndex}
              />

              {/* Host Controls */}
              {isHost && hasAnswered && (
                <div className="mt-6">
                  <Button variant="primary" onClick={handleNextQuestion} className="w-full">
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'End Game'}
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar: Leaderboard */}
            <div className="lg:col-span-1">
              <Leaderboard players={players} currentPlayerId={currentPlayer?.id} compact={true} />
            </div>
          </div>
        )}

        {/* Game Status: Completed */}
        {session.status === 'completed' && (
          <GameResults
            session={session}
            players={players}
            currentPlayer={currentPlayer || undefined}
            onReturnHome={handleReturnHome}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
