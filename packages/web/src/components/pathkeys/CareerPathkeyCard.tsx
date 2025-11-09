/**
 * CareerPathkeyCard Component
 * ===========================
 * Displays a career pathkey with three progressive unlock sections
 * in a baseball card-style composite layout
 *
 * Section 1: Career Image (Top 3 in Career mode)
 * Section 2: Lock (3 Industry/Cluster sets at 90%)
 * Section 3: Key (All 6 business drivers mastered)
 */

import React, { useState } from 'react';
import { Lock, Key, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { ensureAzureUrlHasSasToken } from '../../config/azure';

export interface CareerPathkeySection {
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  required?: number;
}

export interface BusinessDriverProgress {
  driver: string;
  mastered: boolean;
  currentProgress: number;
  required: number;
}

export interface CareerPathkeyCardProps {
  // Career info
  careerId: string;
  careerTitle: string;
  careerSector?: string;
  careerCluster?: string;

  // Section statuses
  section1: CareerPathkeySection;
  section2: CareerPathkeySection & { via?: 'industry' | 'cluster' };
  section3: CareerPathkeySection & { drivers?: BusinessDriverProgress[] };

  // Images (Azure Blob Storage URLs)
  images: {
    career?: string;
    lock?: string;
    key?: string;
  };

  // Interaction
  onClick?: () => void;
  className?: string;
  showProgress?: boolean;
}

export const CareerPathkeyCard: React.FC<CareerPathkeyCardProps> = ({
  careerId,
  careerTitle,
  careerSector,
  careerCluster,
  section1,
  section2,
  section3,
  images,
  onClick,
  className = '',
  showProgress = true,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({
    career: false,
    lock: false,
    key: false,
  });

  const isComplete = section1.unlocked && section2.unlocked && section3.unlocked;
  const hasAnyUnlock = section1.unlocked || section2.unlocked || section3.unlocked;

  const handleImageError = (section: 'career' | 'lock' | 'key') => {
    setImageErrors(prev => ({ ...prev, [section]: true }));
  };

  return (
    <div
      className={clsx(
        'group relative rounded-2xl overflow-hidden transition-all duration-300',
        'bg-white dark:bg-gray-900 border-4',
        isComplete
          ? 'border-amber-500 shadow-lg shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50'
          : hasAnyUnlock
          ? 'border-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40'
          : 'border-gray-700 hover:shadow-lg',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
      style={{ aspectRatio: '3/4' }}
    >
      {/* Grid Layout: Header (auto) + Career (60%) + Bottom (25%) */}
      <div className="grid grid-rows-[auto_1fr_auto] h-full">
        {/* Header */}
        <div className={clsx(
          'p-3 bg-gradient-to-br',
          isComplete
            ? 'from-amber-600 via-amber-500 to-amber-600'
            : hasAnyUnlock
            ? 'from-blue-600 via-blue-500 to-blue-600'
            : 'from-gray-700 via-gray-600 to-gray-700'
        )}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm line-clamp-1 flex-1">
              {careerTitle}
            </h3>
            {isComplete && (
              <Trophy className="text-amber-200 ml-2 flex-shrink-0" size={18} />
            )}
          </div>
          {(careerSector || careerCluster) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {careerSector && (
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-medium text-xs">
                  {careerSector}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Section 1: Career Image (Main area) */}
        <div className="relative overflow-hidden border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          {section1.unlocked && images.career && !imageErrors.career ? (
            <>
              <img
                src={ensureAzureUrlHasSasToken(images.career) || images.career}
                alt={`${careerTitle} - Career`}
                className="w-full h-full object-cover dark:opacity-90"
                onError={() => handleImageError('career')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Section 1 Badge */}
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                ✓
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center">
              <Trophy size={40} className={section1.unlocked ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'} />
              <span className="text-gray-600 dark:text-gray-400 text-xs font-medium mt-2 text-center px-2">
                {section1.unlocked ? 'Career Image' : 'Unlock: Top 3'}
              </span>
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-xs font-bold">
                1
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row: Lock (left) and Key (right) */}
        <div className="flex h-24">
          {/* Section 2: Lock Image (Left - 50% width) */}
          <div className="relative w-1/2 overflow-hidden border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center">
            {section2.unlocked && images.lock && !imageErrors.lock ? (
              <>
                <img
                  src={ensureAzureUrlHasSasToken(images.lock) || images.lock}
                  alt={`${careerTitle} - Lock`}
                  className="w-20 h-20 object-contain"
                  onError={() => handleImageError('lock')}
                />
                {/* Section 2 Badge */}
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                  ✓
                </div>
              </>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                <Lock size={24} className={section1.unlocked && !section2.unlocked ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'} />
                <span className="text-gray-600 dark:text-gray-400 text-[10px] font-medium mt-1">
                  {!section1.unlocked ? 'Locked' : '3 Sets'}
                </span>
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-[10px] font-bold">
                  2
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Key Image (Right - 50% width) */}
          <div className="relative w-1/2 overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center">
            {section3.unlocked && images.key && !imageErrors.key ? (
              <>
                <img
                  src={ensureAzureUrlHasSasToken(images.key) || images.key}
                  alt={`${careerTitle} - Key`}
                  className="w-20 h-20 object-contain rotate-90"
                  onError={() => handleImageError('key')}
                />
                {/* Section 3 Badge */}
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                  ✓
                </div>
              </>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                <Key size={24} className={clsx('rotate-90', section1.unlocked && !section3.unlocked ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500')} />
                <span className="text-gray-600 dark:text-gray-400 text-[10px] font-medium mt-1">
                  {!section1.unlocked ? 'Locked' : '6 Drivers'}
                </span>
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Badge */}
      {isComplete && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-lg animate-pulse">
          ✨ COMPLETE
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
