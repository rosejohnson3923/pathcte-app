/**
 * CareerDetail Component
 * ======================
 * Modal displaying comprehensive career information
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Badge, Button } from '../common';
import { getCareerImageUrl, getPlaceholderImageUrl, gameService, toast } from '@pathcte/shared';
import { useAuth } from '../../hooks';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  GraduationCap,
  Users,
  Briefcase,
  Award,
  Calendar,
  PlayCircle,
} from 'lucide-react';
import type { Career } from '@pathcte/shared';

export interface CareerDetailProps {
  career: Career | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CareerDetail: React.FC<CareerDetailProps> = ({
  career,
  isOpen,
  onClose,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!career) return null;

  const handleStartCareerQuest = async () => {
    if (!user) {
      toast.error('Please log in to explore careers');
      return;
    }

    setIsStarting(true);

    try {
      const { session, error } = await gameService.startCareerQuest({
        userId: user.id,
        careerId: career.id,
        careerTitle: career.title,
        careerSector: career.sector || career.industry,
      });

      if (error || !session) {
        throw error || new Error('Failed to start career quest');
      }

      // Navigate to the game page
      navigate(`/game/${session.id}`);
      onClose(); // Close the modal
    } catch (err: any) {
      console.error('Error starting career quest:', err);
      toast.error(err?.message || 'Failed to start career quest. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  // Format numbers
  const formatNumber = (num: number | null) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatSalary = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: career.salary_currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const growthRate = career.growth_rate || 0;
  const isPositiveGrowth = growthRate > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      <div className="max-w-4xl">
        {/* Header with Image */}
        <div className="mb-6">
          {/* Image */}
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-4">
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
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {career.title}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="info">
                      <Briefcase size={14} className="mr-1" />
                      {career.industry}
                    </Badge>
                    {career.sector && (
                      <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                        {career.sector}
                      </Badge>
                    )}
                    {growthRate !== 0 && (
                      <Badge variant={isPositiveGrowth ? 'success' : 'warning'}>
                        {isPositiveGrowth ? (
                          <TrendingUp size={14} className="mr-1" />
                        ) : (
                          <TrendingDown size={14} className="mr-1" />
                        )}
                        {growthRate > 0 ? '+' : ''}
                        {growthRate}% growth
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {career.description && (
          <div className="mb-6">
            <p className="text-text-primary leading-relaxed">{career.description}</p>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Salary */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <DollarSign size={20} />
              <span className="text-sm font-medium">Salary Range</span>
            </div>
            <div className="space-y-1">
              {career.salary_median && (
                <p className="text-lg font-bold text-gray-900">
                  {formatSalary(career.salary_median)}
                  <span className="text-sm font-normal text-gray-600"> median</span>
                </p>
              )}
              {career.salary_min && career.salary_max && (
                <p className="text-sm text-gray-600">
                  {formatSalary(career.salary_min)} - {formatSalary(career.salary_max)}
                </p>
              )}
            </div>
          </div>

          {/* Employment */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Users size={20} />
              <span className="text-sm font-medium">Employment</span>
            </div>
            <div className="space-y-1">
              {career.employment_2023 && (
                <p className="text-lg font-bold text-gray-900">
                  {formatNumber(career.employment_2023)}
                  <span className="text-sm font-normal text-gray-600"> (2023)</span>
                </p>
              )}
              {career.employment_2033_projected && (
                <p className="text-sm text-gray-600">
                  {formatNumber(career.employment_2033_projected)} projected (2033)
                </p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <GraduationCap size={20} />
              <span className="text-sm font-medium">Education</span>
            </div>
            {career.education_level && career.education_level.length > 0 ? (
              <p className="text-sm font-semibold text-gray-900">
                {career.education_level[0]}
              </p>
            ) : (
              <p className="text-sm text-gray-600">Varies</p>
            )}
          </div>
        </div>

        {/* Day in the Life */}
        {career.day_in_life_text && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
              <Calendar size={20} />
              A Day in the Life
            </h3>
            <div className="bg-bg-secondary rounded-lg p-4">
              <p className="text-text-primary leading-relaxed whitespace-pre-line">
                {career.day_in_life_text}
              </p>
            </div>
          </div>
        )}

        {/* Tasks */}
        {career.tasks && career.tasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
              <Briefcase size={20} />
              Common Tasks
            </h3>
            <div className="bg-bg-secondary rounded-lg p-4">
              <ul className="space-y-2">
                {career.tasks.map((task, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-text-primary">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Work Environment */}
        {career.work_environment && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3">
              Work Environment
            </h3>
            <div className="bg-bg-secondary rounded-lg p-4">
              <p className="text-text-primary leading-relaxed">{career.work_environment}</p>
            </div>
          </div>
        )}

        {/* Certifications */}
        {career.certifications && career.certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
              <Award size={20} />
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.certifications.map((cert, index) => (
                <Badge key={index} variant="outline">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {career.video_url && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
              <PlayCircle size={20} />
              Career Video
            </h3>
            <a
              href={career.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              Watch Video
              <PlayCircle size={16} />
            </a>
          </div>
        )}

        {/* Job Outlook */}
        {career.job_outlook && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3">Job Outlook</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-gray-900">{career.job_outlook}</p>
            </div>
          </div>
        )}

        {/* Related Careers */}
        {career.related_careers && career.related_careers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3">
              Related Careers
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.related_careers.slice(0, 5).map((relatedId, index) => (
                <Badge key={index} variant="info">
                  {relatedId}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleStartCareerQuest}
            disabled={isStarting}
          >
            {isStarting ? 'Starting...' : 'Explore This Career'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
