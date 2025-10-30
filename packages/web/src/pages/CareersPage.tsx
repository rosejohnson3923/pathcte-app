/**
 * CareersPage
 * ===========
 * Browse and explore all careers
 */

import { useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout';
import { CareerCard, CareerDetail, CareerSearch } from '../components/careers';
import { useCareers } from '../hooks';
import { Spinner } from '../components/common';
import { Compass } from 'lucide-react';
import type { Career } from '@pathcte/shared';

export default function CareersPage() {
  const { data: careers, isLoading } = useCareers();

  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'salary' | 'growth'>('title');

  // Filter and sort careers
  const filteredAndSortedCareers = useMemo(() => {
    if (!careers) return [];

    let result = [...careers];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (career) =>
          career.title.toLowerCase().includes(term) ||
          career.description?.toLowerCase().includes(term) ||
          career.industry.toLowerCase().includes(term) ||
          career.sector?.toLowerCase().includes(term)
      );
    }

    // Filter by industry
    if (selectedIndustry !== 'all') {
      result = result.filter((career) => career.industry === selectedIndustry);
    }

    // Filter by sector
    if (selectedSector !== 'all') {
      result = result.filter((career) => career.sector === selectedSector);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'salary': {
          const aSalary = a.salary_median || a.salary_max || a.salary_min || 0;
          const bSalary = b.salary_median || b.salary_max || b.salary_min || 0;
          return bSalary - aSalary;
        }
        case 'growth': {
          const aGrowth = a.growth_rate || 0;
          const bGrowth = b.growth_rate || 0;
          return bGrowth - aGrowth;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [careers, searchTerm, selectedIndustry, selectedSector, sortBy]);

  const handleCareerClick = (career: Career) => {
    setSelectedCareer(career);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedCareer(null), 300);
  };

  return (
    <DashboardLayout>
      <div>
        {/* Page Header with Enhanced Design */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 border-4 border-white rounded-full"></div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Compass className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-1">
                Gaming & Esports Careers
              </h1>
              <p className="text-indigo-100 text-lg">
                Discover 50+ career paths in the gaming and esports industry
              </p>
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
            {/* Search and Filters */}
            <CareerSearch
              careers={careers || []}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedIndustry={selectedIndustry}
              onIndustryChange={setSelectedIndustry}
              selectedSector={selectedSector}
              onSectorChange={setSelectedSector}
              sortBy={sortBy}
              onSortChange={setSortBy}
              className="mb-6"
            />

            {/* Results Count */}
            <div className="mb-4 text-sm text-text-secondary">
              Showing {filteredAndSortedCareers.length} career
              {filteredAndSortedCareers.length !== 1 ? 's' : ''}
            </div>

            {/* Career Grid */}
            {filteredAndSortedCareers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedCareers.map((career) => (
                  <CareerCard
                    key={career.id}
                    career={career}
                    onClick={() => handleCareerClick(career)}
                    showSalary={true}
                    showGrowth={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Compass size={48} className="mx-auto mb-4 text-text-tertiary" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No careers found
                </h3>
                <p className="text-text-secondary">
                  Try adjusting your search or filters to see more results.
                </p>
              </div>
            )}
          </>
        )}

        {/* Career Detail Modal */}
        <CareerDetail
          career={selectedCareer}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      </div>
    </DashboardLayout>
  );
}
