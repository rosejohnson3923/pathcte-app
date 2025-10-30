/**
 * PathkeyCard Component
 * =====================
 * Displays an individual pathkey with image, rarity, and collection status
 */

import React, { useState } from 'react';
import { getPathkeyImageUrl, getPlaceholderImageUrl } from '@pathcte/shared';
import { ensureAzureUrlHasSasToken } from '../../config/azure';
import { Trophy, Lock, Star } from 'lucide-react';
import clsx from 'clsx';
import type { Pathkey, UserPathkey } from '@pathcte/shared';

export interface PathkeyCardProps {
  pathkey: Pathkey;
  userPathkey?: UserPathkey;
  onClick?: () => void;
  showQuantity?: boolean;
  className?: string;
}

export const PathkeyCard: React.FC<PathkeyCardProps> = ({
  pathkey,
  userPathkey,
  onClick,
  showQuantity = true,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const isOwned = !!userPathkey;
  const quantity = userPathkey?.quantity || 0;

  // Rarity color mapping with gradients
  const rarityStyles: Record<string, { gradient: string; glow: string; text: string; border: string }> = {
    common: {
      gradient: 'from-gray-600 via-gray-500 to-gray-600',
      glow: 'shadow-gray-500/50',
      text: 'text-gray-300',
      border: 'border-gray-500',
    },
    uncommon: {
      gradient: 'from-green-600 via-green-500 to-green-600',
      glow: 'shadow-green-500/50',
      text: 'text-green-300',
      border: 'border-green-500',
    },
    rare: {
      gradient: 'from-blue-600 via-blue-500 to-blue-600',
      glow: 'shadow-blue-500/50',
      text: 'text-blue-300',
      border: 'border-blue-500',
    },
    epic: {
      gradient: 'from-purple-600 via-purple-500 to-purple-600',
      glow: 'shadow-purple-500/50',
      text: 'text-purple-300',
      border: 'border-purple-500',
    },
    legendary: {
      gradient: 'from-amber-600 via-amber-400 to-amber-600',
      glow: 'shadow-amber-500/50',
      text: 'text-amber-300',
      border: 'border-amber-500',
    },
  };

  const rarity = rarityStyles[pathkey.rarity] || rarityStyles.common;

  return (
    <div
      className={clsx(
        'group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300',
        'bg-white dark:bg-gray-900',
        'hover:scale-105 hover:shadow-2xl',
        isOwned ? rarity.glow : 'opacity-60 grayscale',
        'border-2',
        rarity.border,
        className
      )}
      onClick={onClick}
    >
      {/* Card Content */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Pathkey Image */}
        <img
          src={imageError ? getPlaceholderImageUrl('pathkey') : (ensureAzureUrlHasSasToken(pathkey.image_url) || getPlaceholderImageUrl('pathkey'))}
          alt={pathkey.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* Quantity Badge - Top Left */}
        {isOwned && showQuantity && quantity > 1 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-white font-bold text-xs shadow-lg flex items-center gap-1">
            <Star size={12} className="fill-current" />
            <span>×{quantity}</span>
          </div>
        )}

        {/* Rarity Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <div className={clsx(
            'px-2.5 py-1 rounded-lg backdrop-blur-sm font-bold text-xs uppercase shadow-lg',
            'bg-black/80 border', rarity.border, rarity.text
          )}>
            {pathkey.rarity}
          </div>
        </div>

        {/* Not Owned Overlay */}
        {!isOwned && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mb-2 shadow-lg">
              <Lock size={24} className="text-gray-400" />
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-gray-800 text-white font-semibold text-xs">
              Not Collected
            </div>
          </div>
        )}

        {/* Owned Trophy - Bottom Right */}
        {isOwned && (
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
            <Trophy size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Card Info Footer */}
      <div className={clsx('p-3 bg-gradient-to-br', rarity.gradient)}>
        <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">
          {pathkey.name}
        </h3>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-300 capitalize">
            {pathkey.key_type.replace('_', ' ')}
          </span>
          {isOwned && userPathkey && (
            <span className="text-gray-400">
              {new Date(userPathkey.acquired_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Hover Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
