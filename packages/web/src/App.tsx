import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@pathket/shared';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import CareersPage from './pages/CareersPage';
import JoinGamePage from './pages/JoinGamePage';
import HostGamePage from './pages/HostGamePage';
import GamePage from './pages/GamePage';
import NotFoundPage from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/common';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state on app mount
  useEffect(() => {
    initialize();
  }, [initialize]);

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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
