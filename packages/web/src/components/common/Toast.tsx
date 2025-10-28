/**
 * Toast Component
 * ===============
 * Toast notification system
 * Integrates with UI store
 */

import React from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '@pathket/shared';
import clsx from 'clsx';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    text: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    text: 'text-red-800',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    text: 'text-amber-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-800',
  },
};

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-4 p-6"
    >
      <div className="flex w-full flex-col items-end space-y-4">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          const color = colors[toast.type];

          return (
            <Transition
              key={toast.id}
              show={true}
              appear={true}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transform ease-in duration-200 transition"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="translate-x-full opacity-0"
            >
              <div
                className={clsx(
                  'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
                  color.bg,
                  color.border
                )}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icon className={clsx('h-5 w-5', color.icon)} aria-hidden="true" />
                    </div>
                    <div className="ml-3 flex-1 pt-0.5">
                      <p className={clsx('text-sm font-medium', color.text)}>{toast.message}</p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className={clsx(
                          'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                          color.icon,
                          'hover:opacity-75'
                        )}
                        onClick={() => removeToast(toast.id)}
                      >
                        <span className="sr-only">Close</span>
                        <X className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          );
        })}
      </div>
    </div>
  );
};

ToastContainer.displayName = 'ToastContainer';
