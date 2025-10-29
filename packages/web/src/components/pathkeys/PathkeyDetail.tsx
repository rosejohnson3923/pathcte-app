/**
 * PathkeyDetail Component
 * =======================
 * Modal displaying detailed information about a pathkey
 */

import React, { useState } from 'react';
import { Modal, Badge, Button } from '../common';
import { getPathkeyImageUrl, getPlaceholderImageUrl } from '@pathket/shared';
import { ensureAzureUrlHasSasToken } from '../../config/azure';
import { Trophy, Calendar, Hash, Star } from 'lucide-react';
import type { Pathkey, UserPathkey } from '@pathket/shared';

export interface PathkeyDetailProps {
  pathkey: Pathkey | null;
  userPathkey?: UserPathkey;
  isOpen: boolean;
  onClose: () => void;
}

export const PathkeyDetail: React.FC<PathkeyDetailProps> = ({
  pathkey,
  userPathkey,
  isOpen,
  onClose,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!pathkey) return null;

  const isOwned = !!userPathkey;
  const quantity = userPathkey?.quantity || 0;

  // Rarity color mapping
  const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
    common: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
    uncommon: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    rare: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    epic: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    legendary: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  };

  const rarityStyle = rarityColors[pathkey.rarity] || rarityColors.common;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="max-w-2xl">
        {/* Header with Image */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Image */}
          <div className="flex-shrink-0">
            <div
              className={`relative w-full md:w-64 aspect-[3/4] rounded-xl overflow-hidden border-4 ${rarityStyle.border} ${rarityStyle.bg}`}
            >
              <img
                src={
                  imageError
                    ? getPlaceholderImageUrl('pathkey')
                    : (ensureAzureUrlHasSasToken(pathkey.image_url) || getPlaceholderImageUrl('pathkey'))
                }
                alt={pathkey.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />

              {/* Owned Badge Overlay */}
              {isOwned && (
                <div className="absolute top-3 right-3">
                  <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <Trophy size={16} />
                    <span>Collected</span>
                  </div>
                </div>
              )}

              {/* Quantity Badge */}
              {isOwned && quantity > 1 && (
                <div className="absolute top-3 left-3">
                  <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                    ×{quantity}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {pathkey.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant={pathkey.rarity as any} className="capitalize">
                    {pathkey.rarity}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {pathkey.key_type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>

            {pathkey.description && (
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {pathkey.description}
              </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Key Code */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Hash size={16} />
                  <span className="text-xs font-medium">Key Code</span>
                </div>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">
                  {pathkey.key_code}
                </p>
              </div>

              {/* Rarity */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Star size={16} />
                  <span className="text-xs font-medium">Rarity</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {pathkey.rarity}
                </p>
              </div>

              {/* Acquired Date (if owned) */}
              {isOwned && userPathkey && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 col-span-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar size={16} />
                    <span className="text-xs font-medium">Acquired</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(userPathkey.acquired_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Sections */}
        {pathkey.metadata && Object.keys(pathkey.metadata).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Additional Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <dl className="space-y-2">
                {Object.entries(pathkey.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-100">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Colors (if available) */}
        {(pathkey.color_primary || pathkey.color_secondary) && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Colors</h3>
            <div className="flex gap-3">
              {pathkey.color_primary && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: pathkey.color_primary }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {pathkey.color_primary}
                  </span>
                </div>
              )}
              {pathkey.color_secondary && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: pathkey.color_secondary }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {pathkey.color_secondary}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not Owned Message */}
        {!isOwned && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Not yet collected.</strong> Play games to earn pathkeys and add
              them to your collection!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {/* Future: Add more actions like "View Career", "Mark Favorite", etc. */}
        </div>
      </div>
    </Modal>
  );
};
