/**
 * CareerCard Component
 * ====================
 * Displays an individual career with image, salary, and key details
 */

import { useState } from 'react';
import { getCareerImageUrl, getPlaceholderImageUrl } from '@pathket/shared';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';
import clsx from 'clsx';
import type { Career } from '@pathket/shared';

export interface CareerCardProps {
  career: Career;
  onClick?: () => void;
  showSalary?: boolean;
  showGrowth?: boolean;
  className?: string;
}

export const CareerCard: React.FC<CareerCardProps> = ({
  career,
  onClick,
  showSalary = true,
  showGrowth = true,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Format salary
  const formatSalary = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: career.salary_currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const salaryRange = career.salary_min && career.salary_max
    ? `${formatSalary(career.salary_min)} - ${formatSalary(career.salary_max)}`
    : career.salary_median
    ? formatSalary(career.salary_median)
    : 'Salary varies';

  // Growth rate indicator
  const growthRate = career.growth_rate || 0;
  const isPositiveGrowth = growthRate > 0;

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-transparent hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${className}`}
      onClick={onClick}
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={
            imageError
              ? getPlaceholderImageUrl('career', {
                  industry: career.industry,
                  sector: career.sector || undefined,
                  title: career.title,
                })
              : getCareerImageUrl(career.title)
          }
          alt={career.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        {/* Title Only at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg line-clamp-2 drop-shadow-lg">
            {career.title}
          </h3>
        </div>
      </div>

      {/* Info Section - Cleaner Layout */}
      <div className="p-4 space-y-3">
        {/* Salary and Growth in one row */}
        <div className="flex items-center justify-between">
          {showSalary && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
              <DollarSign size={14} />
              <span className="text-sm font-bold">{salaryRange}</span>
            </div>
          )}

          {showGrowth && growthRate !== 0 && (
            <div className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm',
              isPositiveGrowth
                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
            )}>
              {isPositiveGrowth ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{growthRate > 0 ? '+' : ''}{growthRate}%</span>
            </div>
          )}
        </div>

        {/* Tags - Simplified */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Briefcase size={14} className="text-purple-600 dark:text-purple-400" />
          <span>{career.industry}</span>
          {career.education_level && career.education_level.length > 0 && (
            <>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span>{career.education_level[0]}</span>
            </>
          )}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/50 rounded-2xl transition-colors pointer-events-none" />
    </div>
  );
};
