/**
 * Image Utilities
 * ================
 * Helpers for working with images from Azure Blob Storage
 */

import { buildAzureBlobUrl, AZURE_CONTAINERS } from '../config/azure-storage';

/**
 * Get the full URL for a pathkey image
 */
export const getPathkeyImageUrl = (pathkeyId: string, format: 'png' | 'jpg' | 'gif' = 'png'): string => {
  return buildAzureBlobUrl(AZURE_CONTAINERS.PATHKEYS, `${pathkeyId}.${format}`);
};

/**
 * Get the full URL for a pathkey animated image
 */
export const getPathkeyAnimatedUrl = (pathkeyId: string): string => {
  return buildAzureBlobUrl(AZURE_CONTAINERS.PATHKEYS, `${pathkeyId}-animated.gif`);
};

/**
 * Get the full URL for a career image
 */
export const getCareerImageUrl = (careerCode: string, filename: string = 'main.jpg'): string => {
  return buildAzureBlobUrl(AZURE_CONTAINERS.CAREERS, `${careerCode}/${filename}`);
};

/**
 * Get the full URL for a career video
 */
export const getCareerVideoUrl = (careerCode: string, filename: string = 'main.mp4'): string => {
  return buildAzureBlobUrl(AZURE_CONTAINERS.CAREERS, `${careerCode}/${filename}`);
};

/**
 * Get the full URL for a user avatar
 */
export const getAvatarUrl = (userId: string, format: 'jpg' | 'png' = 'jpg'): string => {
  return buildAzureBlobUrl(AZURE_CONTAINERS.AVATARS, `${userId}.${format}`);
};

/**
 * Get the full URL for an achievement icon
 */
export const getAchievementIconUrl = (achievementId: string, format: 'png' | 'svg' = 'png'): string => {
  return buildAzureBlobUrl(AZURE_CONTAINERS.ACHIEVEMENTS, `${achievementId}.${format}`);
};

/**
 * Get a placeholder image URL (from a CDN or fallback)
 */
export const getPlaceholderImageUrl = (type: 'pathkey' | 'career' | 'avatar' | 'achievement'): string => {
  const placeholders = {
    pathkey: 'https://via.placeholder.com/300x400/9333ea/ffffff?text=Pathkey',
    career: 'https://via.placeholder.com/600x400/6366f1/ffffff?text=Career',
    avatar: 'https://via.placeholder.com/200x200/94a3b8/ffffff?text=User',
    achievement: 'https://via.placeholder.com/100x100/f59e0b/ffffff?text=Achievement',
  };

  return placeholders[type];
};

/**
 * Get image URL with fallback to placeholder
 */
export const getImageWithFallback = (
  imageUrl: string | null | undefined,
  fallbackType: 'pathkey' | 'career' | 'avatar' | 'achievement'
): string => {
  if (!imageUrl) {
    return getPlaceholderImageUrl(fallbackType);
  }

  // If it's already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Otherwise, assume it's a blob name and build the URL
  return imageUrl;
};
