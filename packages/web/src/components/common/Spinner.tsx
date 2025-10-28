/**
 * Spinner Component
 * =================
 * Loading spinner indicator
 * Multiple sizes and variants
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const sizeValues = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const variantClasses = {
    primary: 'text-purple-600',
    secondary: 'text-teal-600',
    white: 'text-white',
  };

  return (
    <Loader2
      size={sizeValues[size]}
      className={clsx('animate-spin', sizeClasses[size], variantClasses[variant], className)}
    />
  );
};

Spinner.displayName = 'Spinner';

// Full-page loading spinner
export const FullPageSpinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

FullPageSpinner.displayName = 'FullPageSpinner';
