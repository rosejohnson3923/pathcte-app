/**
 * Career Pathkey Detail Modal
 * ============================
 * Shows detailed information about a career pathkey and progress
 */

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trophy, Lock, CheckCircle2, Circle } from 'lucide-react';
import type { CareerPathkeyCardProps } from './CareerPathkeyCard';
import { ensureAzureUrlHasSasToken } from '../../config/azure';
import clsx from 'clsx';

interface CareerPathkeyDetailProps {
  pathkey: CareerPathkeyCardProps | null;
  isOpen: boolean;
  onClose: () => void;
}

const BUSINESS_DRIVER_ICONS: Record<string, string> = {
  people: '👥',
  product: '📦',
  pricing: '💰',
  process: '⚙️',
  proceeds: '📈',
  profits: '💎',
};

const BUSINESS_DRIVER_NAMES: Record<string, string> = {
  people: 'People',
  product: 'Product',
  pricing: 'Pricing',
  process: 'Process',
  proceeds: 'Proceeds',
  profits: 'Profits',
};

export const CareerPathkeyDetail: React.FC<CareerPathkeyDetailProps> = ({
  pathkey,
  isOpen,
  onClose,
}) => {
  if (!pathkey) return null;

  const isComplete = pathkey.section1.unlocked && pathkey.section2.unlocked && pathkey.section3.unlocked;
  const sectionsUnlocked = [pathkey.section1.unlocked, pathkey.section2.unlocked, pathkey.section3.unlocked].filter(Boolean).length;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                {/* Header */}
                <div className={clsx(
                  'relative p-6 bg-gradient-to-br',
                  isComplete
                    ? 'from-amber-600 via-amber-500 to-amber-600'
                    : sectionsUnlocked > 0
                    ? 'from-blue-600 via-blue-500 to-blue-600'
                    : 'from-gray-700 via-gray-600 to-gray-700'
                )}>
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
                  >
                    <X className="text-white" size={20} />
                  </button>

                  <div className="flex items-center gap-4">
                    {/* Career Image Thumbnail */}
                    {pathkey.images?.career ? (
                      <div className="w-24 h-32 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm flex-shrink-0 border-2 border-white/20">
                        <img
                          src={ensureAzureUrlHasSasToken(pathkey.images.career) || pathkey.images.career}
                          alt={pathkey.careerTitle}
                          className={clsx(
                            'w-full h-full object-cover',
                            !pathkey.section1.unlocked && 'opacity-40 grayscale'
                          )}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-32 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <Trophy className="text-white" size={32} />
                      </div>
                    )}

                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-1">
                        {pathkey.careerTitle}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {pathkey.careerSector && (
                          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                            {pathkey.careerSector}
                          </span>
                        )}
                        {pathkey.careerCluster && (
                          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                            {pathkey.careerCluster}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
                      <span>Overall Progress</span>
                      <span className="font-bold">{sectionsUnlocked}/3 Sections Unlocked</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${(sectionsUnlocked / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Section 1: Career Mastery */}
                  <div className={clsx(
                    'rounded-xl border-2 p-6',
                    pathkey.section1.unlocked
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  )}>
                    <div className="flex items-start gap-4">
                      {pathkey.section1.unlocked ? (
                        <CheckCircle2 className="text-green-500 flex-shrink-0" size={32} />
                      ) : (
                        <Circle className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={32} />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy size={20} className={pathkey.section1.unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'} />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Section 1: Career Mastery
                          </h3>
                        </div>

                        {pathkey.section1.unlocked ? (
                          <div className="space-y-2">
                            <p className="text-green-700 dark:text-green-300 font-medium">
                              ✅ Career Image Unlocked!
                            </p>
                            {pathkey.section1.unlockedAt && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Unlocked: {new Date(pathkey.section1.unlockedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-gray-700 dark:text-gray-300">
                              Finish in the <strong>Top 3</strong> in a Career mode game for this career.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Requirements:</strong>
                              </p>
                              <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside mt-1">
                                <li>Play a Career mode game for "{pathkey.careerTitle}"</li>
                                <li>Minimum 3 players required</li>
                                <li>Place 1st, 2nd, or 3rd</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Industry/Cluster Mastery */}
                  <div className={clsx(
                    'rounded-xl border-2 p-6',
                    pathkey.section2.unlocked
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : pathkey.section1.unlocked
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  )}>
                    <div className="flex items-start gap-4">
                      {pathkey.section2.unlocked ? (
                        <CheckCircle2 className="text-green-500 flex-shrink-0" size={32} />
                      ) : pathkey.section1.unlocked ? (
                        <Circle className="text-blue-500 flex-shrink-0" size={32} />
                      ) : (
                        <Lock className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={32} />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🔒</span>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Section 2: Industry/Cluster Mastery
                          </h3>
                        </div>

                        {!pathkey.section1.unlocked ? (
                          <p className="text-gray-600 dark:text-gray-400">
                            🔒 Unlock Section 1 first to access this section.
                          </p>
                        ) : pathkey.section2.unlocked ? (
                          <div className="space-y-2">
                            <p className="text-green-700 dark:text-green-300 font-medium">
                              ✅ Lock Unlocked via {pathkey.section2.via === 'industry' ? 'Industry' : 'Cluster'} Path!
                            </p>
                            {pathkey.section2.unlockedAt && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Unlocked: {new Date(pathkey.section2.unlockedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-gray-700 dark:text-gray-300">
                              Complete <strong>3 question sets</strong> from the same industry or cluster with <strong>90% accuracy</strong>.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Sets Completed (90%+)</span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {pathkey.section2.progress || 0} / {pathkey.section2.required || 3}
                                </span>
                              </div>
                              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 transition-all duration-500"
                                  style={{ width: `${((pathkey.section2.progress || 0) / (pathkey.section2.required || 3)) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Two Paths Available:</strong>
                              </p>
                              <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside mt-1">
                                <li><strong>Industry Path:</strong> Complete 3 sets from the same industry (e.g., "{pathkey.careerSector}")</li>
                                <li><strong>Cluster Path:</strong> Complete 3 sets from the same cluster (e.g., "{pathkey.careerCluster}")</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Business Driver Mastery */}
                  <div className={clsx(
                    'rounded-xl border-2 p-6',
                    pathkey.section3.unlocked
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : pathkey.section1.unlocked
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  )}>
                    <div className="flex items-start gap-4">
                      {pathkey.section3.unlocked ? (
                        <CheckCircle2 className="text-green-500 flex-shrink-0" size={32} />
                      ) : pathkey.section1.unlocked ? (
                        <Circle className="text-amber-500 flex-shrink-0" size={32} />
                      ) : (
                        <Lock className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={32} />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🔑</span>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Section 3: Business Driver Mastery
                          </h3>
                        </div>

                        {!pathkey.section1.unlocked ? (
                          <p className="text-gray-600 dark:text-gray-400">
                            🔒 Unlock Section 1 first to access this section.
                          </p>
                        ) : pathkey.section3.unlocked ? (
                          <div className="space-y-2">
                            <p className="text-green-700 dark:text-green-300 font-medium">
                              ✅ Key Unlocked! All 6 Business Drivers Mastered!
                            </p>
                            {pathkey.section3.unlockedAt && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Unlocked: {new Date(pathkey.section3.unlockedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-gray-700 dark:text-gray-300">
                              Answer <strong>5 questions</strong> per business driver with <strong>90% accuracy</strong>.
                            </p>
                          </div>
                        )}

                        {/* Business Driver Grid */}
                        {pathkey.section3.drivers && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                            {pathkey.section3.drivers.map((driver) => (
                              <div
                                key={driver.driver}
                                className={clsx(
                                  'rounded-lg p-3 border-2',
                                  driver.mastered
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                                )}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">{BUSINESS_DRIVER_ICONS[driver.driver]}</span>
                                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                                    {BUSINESS_DRIVER_NAMES[driver.driver]}
                                  </span>
                                  {driver.mastered && (
                                    <CheckCircle2 className="text-green-500 ml-auto" size={16} />
                                  )}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {driver.currentProgress} / {driver.required} correct
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className={clsx(
                                      'h-full transition-all duration-500',
                                      driver.mastered ? 'bg-green-500' : 'bg-amber-500'
                                    )}
                                    style={{ width: `${(driver.currentProgress / driver.required) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
