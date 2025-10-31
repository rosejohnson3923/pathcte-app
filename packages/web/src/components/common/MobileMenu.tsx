/**
 * Mobile Menu Component
 * =====================
 * Slide-in mobile navigation menu with hamburger button
 */

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Menu as MenuIcon } from 'lucide-react';
import clsx from 'clsx';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  children,
  className
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        {/* Menu Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                  <div className={clsx(
                    "flex h-full flex-col bg-white dark:bg-gray-900 shadow-xl",
                    className
                  )}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200 dark:border-gray-800">
                      <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                        Menu
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onClick={onClose}
                        aria-label="Close menu"
                      >
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

interface MobileMenuButtonProps {
  onClick: () => void;
  className?: string;
  'aria-label'?: string;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  onClick,
  className,
  'aria-label': ariaLabel = 'Open menu'
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <MenuIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
};

MobileMenu.displayName = 'MobileMenu';
MobileMenuButton.displayName = 'MobileMenuButton';
