/**
 * Input Component
 * ===============
 * Reusable input field with validation and error states
 * Supports various input types and configurations
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  forceLight?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      forceLight = false,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    const baseInputClasses = forceLight
      ? 'rounded-lg border px-4 py-2 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-900 disabled:bg-gray-100'
      : 'rounded-lg border px-4 py-2 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-700';

    const stateClasses = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : forceLight
      ? 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
      : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500';

    const iconPaddingClasses = {
      left: leftIcon ? 'pl-10' : '',
      right: rightIcon ? 'pr-10' : '',
    };

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className={forceLight ? "text-sm font-medium text-gray-700" : "text-sm font-medium text-gray-700 dark:text-gray-300"}>
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className={forceLight ? "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" : "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              baseInputClasses,
              stateClasses,
              iconPaddingClasses.left,
              iconPaddingClasses.right,
              fullWidth && 'w-full',
              className
            )}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && !hasError && (
            <div className={forceLight ? "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" : "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"}>
              {rightIcon}
            </div>
          )}

          {hasError && (
            <div className={forceLight ? "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-red-500" : "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-red-500 dark:text-red-400"}>
              <AlertCircle size={20} />
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className={forceLight ? "text-sm text-red-600" : "text-sm text-red-600 dark:text-red-400"}>
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className={forceLight ? "text-sm text-gray-500" : "text-sm text-gray-500 dark:text-gray-400"}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
