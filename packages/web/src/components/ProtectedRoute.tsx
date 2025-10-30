/**
 * ProtectedRoute Component
 * ========================
 * Wrapper for routes that require authentication
 * Redirects to login if user is not authenticated
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@pathcte/shared';
import { FullPageSpinner } from './common';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'student' | 'teacher' | 'parent';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const location = useLocation();
  const { user, profile, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on mount if not already initialized
    initialize();
  }, [initialize]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <FullPageSpinner message="Loading..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement if specified
  if (requireRole && profile?.user_type !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

ProtectedRoute.displayName = 'ProtectedRoute';
