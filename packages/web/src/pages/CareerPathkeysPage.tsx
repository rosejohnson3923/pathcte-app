/**
 * My Pathkeys Page
 * =================
 * Displays user's pathkey collection with three-section progressive unlock system
 */

import { useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout';
import { CareerPathkeyCard } from '../components/pathkeys/CareerPathkeyCard';
import { CareerPathkeyDetail } from '../components/pathkeys/CareerPathkeyDetail';
import type { CareerPathkeyCardProps } from '../components/pathkeys/CareerPathkeyCard';
import { useCareerPathkeys } from '../hooks';
import { Spinner } from '../components/common';
import { Trophy } from 'lucide-react';

type FilterType = 'all' | 'complete' | 'in-progress' | 'locked';

export default function CareerPathkeysPage() {
  const { data: pathkeys, isLoading } = useCareerPathkeys();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPathkey, setSelectedPathkey] = useState<CareerPathkeyCardProps | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleCardClick = (pathkey: CareerPathkeyCardProps) => {
    setSelectedPathkey(pathkey);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPathkey(null);
  };

  // Filter pathkeys based on selection
  const filteredPathkeys = pathkeys?.filter((pathkey) => {
    // Search filter
    if (searchTerm && !pathkey.careerTitle.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    const isComplete = pathkey.section1.unlocked && pathkey.section2.unlocked && pathkey.section3.unlocked;
    const isInProgress = (pathkey.section1.unlocked || pathkey.section2.unlocked || pathkey.section3.unlocked) && !isComplete;
    const isLocked = !pathkey.section1.unlocked && !pathkey.section2.unlocked && !pathkey.section3.unlocked;

    if (filter === 'complete' && !isComplete) return false;
    if (filter === 'in-progress' && !isInProgress) return false;
    if (filter === 'locked' && !isLocked) return false;

    return true;
  }) || [];

  // Calculate stats
  const stats = useMemo(() => {
    if (!pathkeys) {
      return {
        total: 0,
        complete: 0,
        inProgress: 0,
        locked: 0,
      };
    }

    return pathkeys.reduce(
      (acc, pathkey) => {
        const isComplete = pathkey.section1.unlocked && pathkey.section2.unlocked && pathkey.section3.unlocked;
        const isInProgress = (pathkey.section1.unlocked || pathkey.section2.unlocked || pathkey.section3.unlocked) && !isComplete;

        return {
          total: acc.total + 1,
          complete: acc.complete + (isComplete ? 1 : 0),
          inProgress: acc.inProgress + (isInProgress ? 1 : 0),
          locked: acc.locked + (!isComplete && !isInProgress ? 1 : 0),
        };
      },
      { total: 0, complete: 0, inProgress: 0, locked: 0 }
    );
  }, [pathkeys]);

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-8 overflow-hidden">
          {/* Decorative Icons */}
          <div className="absolute inset-0 opacity-10">
            <Trophy className="absolute top-5 right-10 w-20 h-20 text-white" />
            <Trophy className="absolute bottom-5 left-10 w-16 h-16 text-white" />
            <Trophy className="absolute top-1/2 right-1/4 w-12 h-12 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Trophy className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-display font-bold text-white">
                My Pathkeys
              </h1>
            </div>
            <p className="text-purple-100 text-lg ml-20">
              Unlock three sections for each career: Career Image, Industry Lock, and Business Driver Key
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Careers */}
          <div className="relative overflow-hidden rounded-xl p-5 border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-md hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Careers</div>
            </div>
          </div>

          {/* Complete */}
          <div className="relative overflow-hidden rounded-xl p-5 border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-300 dark:bg-purple-700 rounded-full -mr-10 -mt-10 opacity-30"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="text-purple-600 dark:text-purple-400" size={20} />
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.complete}</div>
              </div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-400">Complete</div>
            </div>
          </div>

          {/* In Progress */}
          <div className="relative overflow-hidden rounded-xl p-5 border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-300 dark:bg-blue-700 rounded-full -mr-10 -mt-10 opacity-30"></div>
            <div className="relative">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">{stats.inProgress}</div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-400">In Progress</div>
            </div>
          </div>

          {/* Locked */}
          <div className="relative overflow-hidden rounded-xl p-5 border-2 border-gray-400 dark:border-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 shadow-md hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full -mr-10 -mt-10 opacity-30"></div>
            <div className="relative">
              <div className="text-3xl font-bold text-gray-700 dark:text-gray-400 mb-1">{stats.locked}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-500">Locked</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('complete')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'complete'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Complete
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'in-progress'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'locked'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Locked
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredPathkeys.length} of {stats.total} careers
            </div>

            {/* Pathkey Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredPathkeys.map((pathkey) => (
                <div
                  key={pathkey.careerId}
                  onClick={() => handleCardClick(pathkey)}
                  className="cursor-pointer transform transition-transform hover:scale-105"
                >
                  <CareerPathkeyCard
                    {...pathkey}
                    showProgress={true}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPathkeys.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No careers found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? `No careers match "${searchTerm}"`
                    : 'Try adjusting your filters'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Career Pathkey Detail Modal */}
        <CareerPathkeyDetail
          pathkey={selectedPathkey}
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </DashboardLayout>
  );
}
