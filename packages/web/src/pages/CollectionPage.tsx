/**
 * CollectionPage
 * ==============
 * Full pathkey collection view for students
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout';
import { PathkeyGrid, PathkeyDetail } from '../components/pathkeys';
import { usePathkeys, useUserPathkeys } from '../hooks';
import { Spinner } from '../components/common';
import { Trophy } from 'lucide-react';
import type { Pathkey } from '@pathcte/shared';

export default function CollectionPage() {
  console.log('[CollectionPage] Rendering...');

  const { data: allPathkeys, isLoading: pathkeysLoading } = usePathkeys();
  const { data: userPathkeys, isLoading: userPathkeysLoading, isFetching: userPathkeysFetching } = useUserPathkeys();

  useEffect(() => {
    console.log('[CollectionPage] Component mounted');
    return () => {
      console.log('[CollectionPage] Component unmounting');
    };
  }, []);

  useEffect(() => {
    console.log('[CollectionPage] User pathkeys updated:', {
      count: userPathkeys?.length || 0,
      isLoading: userPathkeysLoading,
      isFetching: userPathkeysFetching,
      pathkeys: userPathkeys
    });
  }, [userPathkeys, userPathkeysLoading, userPathkeysFetching]);

  const [selectedPathkey, setSelectedPathkey] = useState<Pathkey | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handlePathkeyClick = (pathkey: Pathkey) => {
    setSelectedPathkey(pathkey);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    // Clear selected pathkey after modal animation
    setTimeout(() => setSelectedPathkey(null), 300);
  };

  const isLoading = pathkeysLoading || userPathkeysLoading;

  // Get user pathkey for the selected pathkey
  const selectedUserPathkey = selectedPathkey
    ? userPathkeys?.find((up) => up.pathkey_id === selectedPathkey.id)
    : undefined;

  return (
    <DashboardLayout>
      <div>
        {/* Page Header with Enhanced Design */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-8 overflow-hidden">
          {/* Decorative Pathkey Icons */}
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
                My Pathkey Collection
              </h1>
            </div>
            <p className="text-purple-100 text-lg ml-20">
              Explore and manage your pathkey collection. Collect more pathkeys by playing games!
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          /* Pathkey Grid */
          <PathkeyGrid
            pathkeys={allPathkeys || []}
            userPathkeys={userPathkeys || []}
            onPathkeyClick={handlePathkeyClick}
            showFilters={true}
          />
        )}

        {/* Pathkey Detail Modal */}
        <PathkeyDetail
          pathkey={selectedPathkey}
          userPathkey={selectedUserPathkey}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      </div>
    </DashboardLayout>
  );
}
