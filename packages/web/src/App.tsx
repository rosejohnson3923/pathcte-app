import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@pathcte/shared';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import CareersPage from './pages/CareersPage';
import JoinGamePage from './pages/JoinGamePage';
import HostGamePage from './pages/HostGamePage';
import GamePage from './pages/GamePage';
import QuestionSetsPage from './pages/QuestionSetsPage';
import QuestionSetDetailPage from './pages/QuestionSetDetailPage';
import StudentsPage from './pages/StudentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
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
          path="/careers"
          element={
            <ProtectedRoute>
              <CareersPage />
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
