/**
 * PathkeyGrid Component
 * ======================
 * Grid layout for displaying pathkey collections with filtering and sorting
 */

import React, { useState, useMemo } from 'react';
import { PathkeyCard } from './PathkeyCard';
import { Badge, Spinner } from '../common';
import { Trophy } from 'lucide-react';
import type { Pathkey, UserPathkey, Rarity } from '@pathket/shared';

export interface PathkeyGridProps {
  pathkeys: Pathkey[];
  userPathkeys?: UserPathkey[];
  onPathkeyClick?: (pathkey: Pathkey) => void;
  showFilters?: boolean;
  isLoading?: boolean;
  className?: string;
}

type SortOption = 'recent' | 'rarity' | 'name';
type FilterRarity = 'all' | Rarity;

export const PathkeyGrid: React.FC<PathkeyGridProps> = ({
  pathkeys,
  userPathkeys = [],
  onPathkeyClick,
  showFilters = true,
  isLoading = false,
  className = '',
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('all');
  const [showOnlyOwned, setShowOnlyOwned] = useState(false);

  // Create a map of user pathkeys for quick lookup
  const userPathkeysMap = useMemo(() => {
    const map = new Map<string, UserPathkey>();
    userPathkeys.forEach((up) => map.set(up.pathkey_id, up));
    return map;
  }, [userPathkeys]);

  // Filter and sort pathkeys
  const filteredAndSortedPathkeys = useMemo(() => {
    let result = [...pathkeys];

    // Filter by ownership
    if (showOnlyOwned) {
      result = result.filter((p) => userPathkeysMap.has(p.id));
    }

    // Filter by rarity
    if (filterRarity !== 'all') {
      result = result.filter((p) => p.rarity === filterRarity);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'recent': {
          const aUserPathkey = userPathkeysMap.get(a.id);
          const bUserPathkey = userPathkeysMap.get(b.id);
          if (!aUserPathkey && !bUserPathkey) return 0;
          if (!aUserPathkey) return 1;
          if (!bUserPathkey) return -1;
          return new Date(bUserPathkey.acquired_at).getTime() - new Date(aUserPathkey.acquired_at).getTime();
        }
        case 'rarity': {
          const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
          return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        }
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [pathkeys, filterRarity, showOnlyOwned, sortBy, userPathkeysMap]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = pathkeys.length;
    const owned = userPathkeys.length;
    const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;

    const rarityBreakdown = pathkeys.reduce((acc, p) => {
      const userPathkey = userPathkeysMap.get(p.id);
      if (!acc[p.rarity]) {
        acc[p.rarity] = { total: 0, owned: 0 };
      }
      acc[p.rarity].total++;
      if (userPathkey) {
        acc[p.rarity].owned++;
      }
      return acc;
    }, {} as Record<string, { total: number; owned: number }>);

    return { total, owned, percentage, rarityBreakdown };
  }, [pathkeys, userPathkeys, userPathkeysMap]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Stats Header */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-purple-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Trophy className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pathkey Collection
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {stats.owned} of {stats.total} collected ({stats.percentage}%)
            </p>
          </div>
        </div>

        {/* Rarity Breakdown */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.rarityBreakdown).map(([rarity, counts]) => (
            <div
              key={rarity}
              className="bg-white dark:bg-gray-700/50 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600 shadow-sm"
            >
              <Badge variant={rarity as any} className="capitalize mb-1">
                {rarity}
              </Badge>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {counts.owned}/{counts.total}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Sort */}
      {showFilters && (
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy('rarity')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'rarity'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Rarity
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'name'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Name
              </button>
            </div>
          </div>

          {/* Rarity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rarity:</span>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value as FilterRarity)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>

          {/* Show Only Owned */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyOwned}
              onChange={(e) => setShowOnlyOwned(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show only owned
            </span>
          </label>

          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedPathkeys.length} pathkey
            {filteredAndSortedPathkeys.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Grid */}
      {filteredAndSortedPathkeys.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAndSortedPathkeys.map((pathkey) => (
            <PathkeyCard
              key={pathkey.id}
              pathkey={pathkey}
              userPathkey={userPathkeysMap.get(pathkey.id)}
              onClick={() => onPathkeyClick?.(pathkey)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
            No pathkeys found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {showOnlyOwned
              ? 'You haven\'t collected any pathkeys matching these filters yet.'
              : 'Try adjusting your filters to see more pathkeys.'}
          </p>
        </div>
      )}
    </div>
  );
};
