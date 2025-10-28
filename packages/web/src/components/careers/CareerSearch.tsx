/**
 * CareerSearch Component
 * ======================
 * Search and filter careers by multiple criteria
 */

import { useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Career } from '@pathket/shared';

export interface CareerSearchProps {
  careers: Career[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  sortBy: 'title' | 'salary' | 'growth';
  onSortChange: (sort: 'title' | 'salary' | 'growth') => void;
  className?: string;
}

export const CareerSearch: React.FC<CareerSearchProps> = ({
  careers,
  searchTerm,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  selectedSector,
  onSectorChange,
  sortBy,
  onSortChange,
  className = '',
}) => {
  // Extract unique industries and sectors
  const { industries, sectors } = useMemo(() => {
    const industriesSet = new Set<string>();
    const sectorsSet = new Set<string>();

    careers.forEach((career) => {
      if (career.industry) industriesSet.add(career.industry);
      if (career.sector) sectorsSet.add(career.sector);
    });

    return {
      industries: Array.from(industriesSet).sort(),
      sectors: Array.from(sectorsSet).sort(),
    };
  }, [careers]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search careers by title, description, or skills..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Industry Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="industry" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Industry:
          </label>
          <select
            id="industry"
            value={selectedIndustry}
            onChange={(e) => onIndustryChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="sector" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Sector:
          </label>
          <select
            id="sector"
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => onSortChange('title')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'title'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Title
            </button>
            <button
              onClick={() => onSortChange('salary')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'salary'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Salary
            </button>
            <button
              onClick={() => onSortChange('growth')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'growth'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Growth
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedIndustry !== 'all' || selectedSector !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              Search: {searchTerm}
            </span>
          )}
          {selectedIndustry !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              Industry: {selectedIndustry}
            </span>
          )}
          {selectedSector !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-500/30">
              Sector: {selectedSector}
            </span>
          )}
          <button
            onClick={() => {
              onSearchChange('');
              onIndustryChange('all');
              onSectorChange('all');
            }}
            className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
