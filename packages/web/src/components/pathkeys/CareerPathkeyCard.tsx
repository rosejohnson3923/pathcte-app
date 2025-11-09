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
import { Trophy } from 'lucide-react';
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
  careerTitle,
  careerSector,
  careerCluster,
  section1,
  section2,
  section3,
  images,
  onClick,
  className = '',
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({
    career: false,
    lock: false,
    key: false,
  });

  const isComplete = section1.unlocked && section2.unlocked && section3.unlocked;
  const hasAnyUnlock = section1.unlocked || section2.unlocked || section3.unlocked;

  const handleImageError = (section: 'career' | 'lock' | 'key') => {
    console.error(`[CareerPathkeyCard] Image error for ${careerTitle} - Section: ${section}`);
    setImageErrors(prev => ({ ...prev, [section]: true }));
  };

  return (
    <div
      className={clsx(
        'group relative rounded-2xl overflow-hidden transition-all duration-300',
        'bg-white dark:bg-gray-900 border-4',
        isComplete
          ? 'border-purple-600 shadow-lg shadow-purple-600/40 hover:shadow-2xl hover:shadow-purple-600/60'
          : hasAnyUnlock
          ? 'border-purple-400 shadow-lg shadow-purple-400/30 hover:shadow-xl hover:shadow-purple-400/50'
          : 'border-gray-700 hover:shadow-lg',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
      style={{ aspectRatio: '3/4' }}
    >
      {/* Grid Layout: Header (auto) + Career (80%) + Bottom (20%) */}
      <div className="grid grid-rows-[auto_1fr_auto] h-full">
        {/* Header */}
        <div className={clsx(
          'p-3 bg-gradient-to-br',
          isComplete
            ? 'from-purple-700 via-purple-600 to-purple-500'
            : hasAnyUnlock
            ? 'from-purple-600 via-purple-500 to-purple-400'
            : 'from-gray-700 via-gray-600 to-gray-700'
        )}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm line-clamp-1 flex-1">
              {careerTitle}
            </h3>
            {isComplete && (
              <Trophy className="text-purple-200 ml-2 flex-shrink-0" size={18} />
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
          {images.career && !imageErrors.career ? (
            <>
              <img
                src={ensureAzureUrlHasSasToken(images.career) || images.career}
                alt={`${careerTitle} - Career`}
                className={clsx(
                  'w-full h-full object-cover',
                  !section1.unlocked && 'opacity-40 grayscale'
                )}
                onError={() => handleImageError('career')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Section 1 Badge */}
              {section1.unlocked ? (
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                  ✓
                </div>
              ) : (
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-xs font-bold">
                  1
                </div>
              )}

              {/* Locked overlay text */}
              {!section1.unlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  <Trophy size={40} className="text-white mb-2" />
                  <span className="text-white text-xs font-bold text-center px-2">
                    Unlock: Top 3
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center">
              <Trophy size={40} className={section1.unlocked ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'} />
              <span className="text-gray-600 dark:text-gray-400 text-xs font-medium mt-2 text-center px-2">
                {section1.unlocked ? 'Career Image' : 'No Image'}
              </span>
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-xs font-bold">
                1
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row: Lock (left) and Key (right) */}
        <div className="flex h-20">
          {/* Section 2: Lock Emoji (Left - 50% width) */}
          <div className="relative w-1/2 overflow-hidden border-r border-gray-300 dark:border-gray-700 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 flex items-center justify-center">
            {section2.unlocked ? (
              <>
                {/* Glassmorphic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-600/30 backdrop-blur-sm" />
                <div className="absolute inset-0 border-2 border-white/30 dark:border-white/10" />

                {/* Unlocked emoji with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-purple-500/50 dark:bg-purple-400/40 rounded-full scale-150" />
                  <span className="text-6xl relative z-10 drop-shadow-lg">🔓</span>
                </div>

                {/* Section 2 Badge */}
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-lg z-20">
                  ✓
                </div>
              </>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                <span className="text-4xl opacity-40">🔒</span>
                <span className="text-gray-600 dark:text-gray-400 text-[10px] font-medium mt-1">
                  {!section1.unlocked ? 'Locked' : '3 Sets'}
                </span>
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-[10px] font-bold">
                  2
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Key Emoji (Right - 50% width) */}
          <div className="relative w-1/2 overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 flex items-center justify-center">
            {section3.unlocked ? (
              <>
                {/* Glassmorphic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 dark:from-amber-500/30 dark:to-yellow-600/30 backdrop-blur-sm" />
                <div className="absolute inset-0 border-2 border-white/30 dark:border-white/10" />

                {/* Key emoji with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-amber-500/50 dark:bg-amber-400/40 rounded-full scale-150" />
                  <span className="text-6xl relative z-10 drop-shadow-lg">🔑</span>
                </div>

                {/* Section 3 Badge */}
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-lg z-20">
                  ✓
                </div>
              </>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                <span className="text-4xl opacity-40">🔑</span>
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
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-purple-500 text-white text-xs font-bold shadow-lg animate-pulse">
          ✨ COMPLETE
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
