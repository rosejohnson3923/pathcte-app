import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@pathcte/shared';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthConfirmPage from './pages/AuthConfirmPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import CareerPathkeysPage from './pages/CareerPathkeysPage';
import CareersPage from './pages/CareersPage';
import HowToPlayPage from './pages/HowToPlayPage';
import JoinGamePage from './pages/JoinGamePage';
import HostGamePage from './pages/HostGamePage';
import GamePage from './pages/GamePage';
import QuestionSetsPage from './pages/QuestionSetsPage';
import QuestionSetDetailPage from './pages/QuestionSetDetailPage';
import StudentsPage from './pages/StudentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from './pages/MarketPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import JoinTournamentPage from './pages/JoinTournamentPage';
import TournamentCoordinatorPage from './pages/TournamentCoordinatorPage';
import NotFoundPage from './pages/NotFoundPage';
import { TestPathkeyCardPage } from './pages/TestPathkeyCardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/common';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const setTheme = useUIStore((state) => state.setTheme);
  const theme = useUIStore((state) => state.theme);

  // Initialize auth state and theme on app mount
  useEffect(() => {
    initialize();
    // Apply initial theme to DOM (only on mount)
    setTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/auth/confirm" element={<AuthConfirmPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <CollectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-pathkeys"
          element={
            <ProtectedRoute>
              <CareerPathkeysPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <CareersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/how-to-play"
          element={
            <ProtectedRoute>
              <HowToPlayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-game"
          element={
            <ProtectedRoute>
              <JoinGamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host-game"
          element={
            <ProtectedRoute>
              <HostGamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/:sessionId/*"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/question-sets"
          element={
            <ProtectedRoute>
              <QuestionSetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/question-sets/:id"
          element={
            <ProtectedRoute>
              <QuestionSetDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requireRole="teacher">
              <TeacherDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments/create"
          element={
            <ProtectedRoute>
              <CreateTournamentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments/join"
          element={
            <ProtectedRoute>
              <JoinTournamentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournament/:tournamentId"
          element={
            <ProtectedRoute>
              <TournamentCoordinatorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <MarketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-pathkey-card"
          element={<TestPathkeyCardPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
