/**
 * GamePage
 * =========
 * Main game container orchestrating the entire game flow
 */

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout';
import { GameLobby, QuestionDisplay, HostView, Leaderboard, GameResults } from '../components/game';
import { Button, Spinner, Card } from '../components/common';
import { useAuth } from '../hooks';
import { useGameStore, gameService, realtimeService, toast, supabase } from '@pathcte/shared';
import { ArrowLeft } from 'lucide-react';
import type { GamePlayer } from '@pathcte/shared';

// Azure Functions endpoint for game operations
const AZURE_FUNCTIONS_URL = import.meta.env.VITE_AZURE_FUNCTIONS_URL || 'http://localhost:7071';

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
    setIsHost,
    addPlayer,
    updatePlayer,
    resetGame,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ isCorrect: boolean; selectedIndex: number } | null>(null);
  const [questionSetTitle, setQuestionSetTitle] = useState<string>('');

  // Use refs to keep latest values without triggering effect dependency
  const currentQuestionIndexRef = useRef(currentQuestionIndex);
  const questionsRef = useRef(questions);

  // Update refs when values change
  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // Track component lifecycle
  useEffect(() => {
    console.log('[GamePage] Component mounted, sessionId:', sessionId);
    return () => {
      console.log('[GamePage] Component unmounting, sessionId:', sessionId);
    };
  }, [sessionId]);

  // Track session status changes
  useEffect(() => {
    if (session) {
      console.log('[GamePage] Session updated:', {
        id: session.id,
        status: session.status,
        currentQuestionIndex: session.current_question_index,
      });
    }
  }, [session?.status, session?.current_question_index]);

  // Track current question changes
  useEffect(() => {
    console.log('[GamePage] Current question index changed:', currentQuestionIndex);
  }, [currentQuestionIndex]);

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

        // Fetch question set title
        const { data: questionSet, error: questionSetError } = await supabase
          .from('question_sets')
          .select('title')
          .eq('id', gameSession.question_set_id)
          .single();

        if (questionSet && !questionSetError) {
          setQuestionSetTitle((questionSet as any).title);
        }

        // BUG FIX: Determine if current user is the host
        // In solo mode, the user is always a player (even if they created the game)
        // In multiplayer mode, check if user is the host
        const userIsHost = gameSession.session_type === 'multiplayer' && user?.id === gameSession.host_id;
        setIsHost(userIsHost);

        // Get players
        const { players: gamePlayers, error: playersError } = await gameService.getGamePlayers(sessionId);

        if (playersError || !gamePlayers) {
          throw new Error('Failed to load players');
        }

        setPlayers(gamePlayers);

        // Find current player (skip for hosts - they don't play, they facilitate)
        if (!userIsHost) {
          const player = gamePlayers.find((p: GamePlayer) => p.user_id === user?.id || p.id === currentPlayer?.id);
          if (player) {
            setCurrentPlayer(player);
          }
        } else {
          // Clear currentPlayer for hosts
          setCurrentPlayer(null);
        }

        // Load questions if game is in progress or completed
        if (gameSession.status !== 'waiting') {
          const businessDriver = (gameSession as any).settings?.businessDriver;
          const { questions: gameQuestions, error: questionsError } = await gameService.getGameQuestions(
            gameSession.question_set_id,
            userIsHost,  // Hosts get answers, students don't
            businessDriver
          );

          if (questionsError || !gameQuestions) {
            throw new Error('Failed to load questions');
          }

          setQuestions(gameQuestions as any);

          // Load current question index from database
          // This ensures the game state is preserved across page refreshes
          setCurrentQuestionIndex(gameSession.current_question_index || 0);
        }
      } catch (err: any) {
        console.error('Error loading game:', err);
        setError(err.message || 'Failed to load game');
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [sessionId, user, setSession, setPlayers, setCurrentPlayer, setQuestions, setIsHost]);

  // Reset answer state whenever question changes
  // This ensures clean state when advancing to next question
  useEffect(() => {
    setHasAnswered(false);
    setLastAnswer(null);
  }, [currentQuestionIndex]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!sessionId) return;

    console.log('[GamePage] Setting up realtime subscriptions');

    realtimeService.subscribeToGame(sessionId, {
      onGameUpdate: (updatedSession: any) => {
        console.log('[GamePage] 🎯 onGameUpdate callback INVOKED!');
        console.log('[GamePage] Realtime game update received:', {
          status: updatedSession.status,
          currentQuestionIndex: updatedSession.current_question_index,
          fullSession: updatedSession,
        });

        console.log('[GamePage] Calling setSession with updatedSession...');
        setSession(updatedSession);

        // Sync current question index from database (fallback for missed broadcasts)
        // Use ref to access current value without triggering effect dependency
        const currentIndex = currentQuestionIndexRef.current;
        if (updatedSession.current_question_index !== undefined && updatedSession.current_question_index !== currentIndex) {
          console.log('[GamePage] Syncing question index from realtime:', {
            from: currentIndex,
            to: updatedSession.current_question_index,
          });
          setCurrentQuestionIndex(updatedSession.current_question_index);
        } else {
          console.log('[GamePage] Not syncing question index:', {
            updatedIndex: updatedSession.current_question_index,
            currentIndex,
            willSync: false,
          });
        }

        // If game just started, load questions (check using ref)
        if (updatedSession.status === 'in_progress' && questionsRef.current.length === 0) {
          console.log('[GamePage] Game started, loading questions');
          const businessDriver = (updatedSession.settings as any)?.businessDriver;
          gameService.getGameQuestions(updatedSession.question_set_id, isHost, businessDriver).then(({ questions: gameQuestions }: any) => {
            if (gameQuestions) {
              console.log('[GamePage] Questions loaded:', gameQuestions.length);
              setQuestions(gameQuestions);
            }
          });
        }

        // If game just completed, reload player data to get rewards (pathkeys, tokens)
        // This ensures students see their earned pathkeys on the results screen
        if (updatedSession.status === 'completed' && currentPlayer) {
          console.log('[GamePage] Game completed, reloading player data for rewards...');
          gameService.getGamePlayers(sessionId!).then(({ players: updatedPlayers }) => {
            if (updatedPlayers) {
              console.log('[GamePage] Reloaded players with updated rewards:', updatedPlayers.length);
              setPlayers(updatedPlayers);

              // Update current player with their rewards
              const updated = updatedPlayers.find((p: GamePlayer) => p.id === currentPlayer.id);
              if (updated) {
                console.log('[GamePage] Updated current player with rewards:', {
                  id: updated.id,
                  name: updated.display_name,
                  pathkeys_earned: updated.pathkeys_earned,
                  tokens_earned: updated.tokens_earned,
                });
                setCurrentPlayer(updated);
              }
            }
          });
        }

        console.log('[GamePage] ✅ onGameUpdate callback completed');
      },
      onPlayerJoined: (player: GamePlayer) => {
        console.log('[GamePage] Player joined:', (player as any).name);
        addPlayer(player);
      },
      onPlayerUpdate: (player: GamePlayer) => {
        console.log('[GamePage] Player updated:', (player as any).name);
        updatePlayer(player.id, player);
      },
      onScoreUpdate: (player: GamePlayer) => {
        console.log('[GamePage] Player score updated:', (player as any).name, player.score);
        updatePlayer(player.id, player);
      },
    });

    // Subscribe to broadcast events for question changes
    realtimeService.subscribeToBroadcast(sessionId, 'question_changed', (payload: any) => {
      console.log('[GamePage] 📡 Question changed broadcast received:', payload.question_index);
      console.log('[GamePage] 📡 Broadcast payload:', payload);
      setCurrentQuestionIndex(payload.question_index);
      // Note: hasAnswered/lastAnswer reset handled by separate useEffect above
    });

    return () => {
      console.log('[GamePage] Cleaning up realtime subscriptions');
      realtimeService.unsubscribeFromGame(sessionId);
    };
  }, [sessionId]); // Removed questions.length to prevent race condition during question load

  // Game flow handlers
  const handleStartGame = async () => {
    if (!sessionId) return;

    setIsStartingGame(true);
    try {
      // 1. Update game status to 'in_progress'
      const { session: updatedSession, error } = await gameService.startGame(sessionId);

      if (error || !updatedSession) {
        throw error || new Error('Failed to start game');
      }

      // 2. Load questions (with answers since we're the host)
      // Apply business_driver filter from session settings if specified
      const businessDriver = (updatedSession as any).settings?.businessDriver;
      const { questions: gameQuestions } = await gameService.getGameQuestions(
        updatedSession.question_set_id,
        true,
        businessDriver
      );
      if (!gameQuestions || gameQuestions.length === 0) {
        throw new Error('No questions loaded');
      }
      setQuestions(gameQuestions as any);

      // 3. Get players for initialization
      const { data: playersData, error: playersError } = await supabase
        .from('game_players')
        .select('id, user_id, display_name')
        .eq('game_session_id', sessionId);

      if (playersError || !playersData || playersData.length === 0) {
        throw new Error('Failed to load players');
      }

      // 4. Initialize HostEntity via Azure Functions
      const initResponse = await fetch(`${AZURE_FUNCTIONS_URL}/api/game/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          questionSetId: updatedSession.question_set_id,
          questions: gameQuestions,
          progressionControl: (updatedSession as any).settings?.progressionControl || 'manual',
          allowLateJoin: (updatedSession as any).settings?.allowLateJoin || false,
          players: playersData.map((p: any) => ({
            id: p.id,
            userId: p.user_id,
            displayName: p.display_name,
          })),
        }),
      });

      if (!initResponse.ok) {
        const initError = await initResponse.json();
        throw new Error(`Failed to initialize game: ${initError.error || initResponse.statusText}`);
      }

      const initResult = await initResponse.json();
      console.log('[GamePage] Game initialized via Azure Functions:', initResult);

      // 5. Start first question via Azure Functions (this broadcasts to all players)
      const response = await fetch(`${AZURE_FUNCTIONS_URL}/api/game/startQuestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          questionIndex: 0,
        }),
      });

      if (!response.ok) {
        console.error('[GamePage] Failed to start first question via Azure Functions');
        // Don't throw - game is started, we can continue even if broadcast fails
      } else {
        const result = await response.json();
        console.log('[GamePage] First question started via Azure Functions:', result);
      }
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start game');
    } finally {
      setIsStartingGame(false);
    }
  };

  const handleNextQuestion = async () => {
    // DEBUGGING: Track what called this function
    console.log('[GamePage] ⚠️ handleNextQuestion CALLED!');
    console.trace('[GamePage] Call stack for handleNextQuestion:');

    if (!sessionId) return;

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      try {
        // Call Azure Functions to advance question
        // This will:
        // 1. Update Host Entity state
        // 2. Broadcast to all players via Realtime
        // 3. Update database
        const response = await fetch(`${AZURE_FUNCTIONS_URL}/api/game/advanceQuestion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to advance question: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to advance question');
        }

        console.log('[GamePage] Question advanced via Azure Functions:', result);

        // Note: Local state will be updated via Realtime subscription when database changes
        // No need to manually call nextQuestion() - that would cause double increment!
      } catch (error) {
        console.error('[GamePage] Failed to advance question:', error);
        toast.error('Failed to advance to next question');
        return;
      }
    } else {
      // End game
      await handleEndGame();
    }
  };

  const handleTimerExpired = async () => {
    // Get progression control setting
    const progressionControl = (session as any)?.settings?.progressionControl || 'manual';
    const isSoloSession = session?.session_type === 'solo';

    // DEBUGGING: Log timer expiration details
    console.log('[GamePage] ⏰ Timer expired!', {
      progressionControl,
      isSoloSession,
      isHost,
      willAutoAdvance: !isSoloSession && progressionControl === 'auto' && isHost,
    });

    // Solo Mode: Timer is just for tracking, student controls pace with "Next Question" button
    // Multiplayer Auto Mode: Timer triggers auto-advance (teacher view only)
    //   - Teacher advances via handleNextQuestion
    //   - Students get auto-advanced via real-time broadcast
    //   - Students who haven't answered lose the opportunity (like Blooket)
    // Multiplayer Manual Mode: Teacher manually clicks "Next Question" when ready
    if (!isSoloSession && progressionControl === 'auto' && isHost) {
      console.log('[GamePage] ⚠️ AUTO-ADVANCING due to timer expiration');
      await handleNextQuestion();
    } else {
      console.log('[GamePage] ✓ NOT auto-advancing (manual mode or not host)');
    }
  };

  const handleEndGame = async () => {
    if (!sessionId) return;

    try {
      console.log('Starting end game process...');
      const result = await gameService.endGame(sessionId);

      if (result.error) {
        console.error('End game error:', result.error);
        toast.error('Failed to end game. Please try again.');
        return;
      }

      // CRITICAL: Reload players FIRST to get updated placement and rewards
      // This ensures GameResults component has complete data when it first renders
      console.log('Reloading players with updated stats...');
      const { players: updatedPlayers } = await gameService.getGamePlayers(sessionId);
      if (updatedPlayers) {
        setPlayers(updatedPlayers);
        // Update current player with fresh data
        const updated = updatedPlayers.find((p: GamePlayer) => p.id === currentPlayer?.id);
        if (updated) {
          setCurrentPlayer(updated);
        }
      }

      // Now update session to 'completed' - this triggers GameResults to render
      // By this point, players already have placement/rewards data from reload above
      if (result.session) {
        setSession(result.session);
      }

      console.log('Game ended successfully, notifying players...');
      await realtimeService.notifyGameEnded(sessionId);
      console.log('End game complete');
    } catch (err: any) {
      console.error('Error ending game:', err);
      toast.error(err?.message || 'Failed to end game. Please try again.');
    }
  };

  const handleSubmitAnswer = async (optionIndex: number, timeTaken: number): Promise<boolean> => {
    if (!currentPlayer || !currentQuestion || !sessionId || hasAnswered) return false;

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

      return true;
    } catch (err: any) {
      console.error('Error submitting answer:', err);

      // Show user-friendly error message
      const errorMessage = err?.message || 'Failed to submit answer';

      if (errorMessage.includes('already submitted')) {
        toast.warning('You have already answered this question');

        // Fetch the existing answer to display it correctly
        const { answer: existingAnswer } = await gameService.getExistingAnswer(
          currentPlayer.id,
          currentQuestion.id
        );

        // Mark as answered and set the previous answer info
        setHasAnswered(true);
        if (existingAnswer) {
          setLastAnswer({
            isCorrect: (existingAnswer as any).is_correct,
            selectedIndex: (existingAnswer as any).selected_option_index,
          });
        }

        // Note: Timer expiration will handle auto-advance for auto mode
        // Manual mode requires teacher to click "Next Question"

        return false;
      } else if (errorMessage.includes('too fast')) {
        toast.error('Answer submitted too quickly. Please take your time.');
      } else if (errorMessage.includes('too slow')) {
        toast.error('Time limit exceeded for this question');
      } else {
        toast.error('Failed to submit answer. Please try again.');
      }

      return false;
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
          {session.status === 'waiting' ? 'Return to Dashboard' : 'Leave Game'}
        </Button>

        {/* Game Status: Lobby */}
        {session.status === 'waiting' && (
          <GameLobby
            sessionId={sessionId!}
            isHost={isHost}
            onStartGame={handleStartGame}
            onLeaveGame={handleLeaveGame}
            isStartingGame={isStartingGame}
          />
        )}

        {/* Game Status: In Progress */}
        {session.status === 'in_progress' && currentQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main: Question or Host View */}
            <div className="lg:col-span-2">
              {isHost ? (
                /* Host View: Teacher facilitates but doesn't answer */
                <HostView
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  questionSetTitle={questionSetTitle}
                  players={players}
                  onNextQuestion={() => {
                    console.log('[GamePage] 🖱️ HostView "Next Question" button clicked!');
                    handleNextQuestion();
                  }}
                  progressionControl={(() => {
                    const control = (session as any)?.settings?.progressionControl || 'manual';
                    console.log('[GamePage] ProgressionControl for HostView:', control, 'Session settings:', (session as any)?.settings);
                    return control;
                  })()}
                  onTimerExpired={handleTimerExpired}
                />
              ) : (
                /* Student View: Answer questions */
                <>
                  <QuestionDisplay
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    questionSetTitle={questionSetTitle}
                    onSubmitAnswer={handleSubmitAnswer}
                    onTimerExpired={handleTimerExpired}
                    hasAnswered={hasAnswered}
                    isCorrect={lastAnswer?.isCorrect}
                    selectedOptionIndex={lastAnswer?.selectedIndex}
                  />

                  {/* Solo Session Controls (only for solo student practice) */}
                  {/* In multiplayer teacher-led games, students should NOT see this button */}
                  {session.session_type === 'solo' && hasAnswered && (
                    <div className="mt-6">
                      <Button variant="primary" onClick={handleNextQuestion} className="w-full">
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'End Game'}
                      </Button>
                    </div>
                  )}
                </>
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
            totalQuestions={questions.length}
            onReturnHome={handleReturnHome}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
