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
 * For gaming/esports careers, images are stored as "Career Title.png" at container root
 * For traditional careers, images are stored in folders like "onet-code/main.jpg"
 */
export const getCareerImageUrl = (careerIdentifier: string, filename?: string): string => {
  // If no filename specified and identifier doesn't contain slash, assume it's a career title
  // Use .png extension for gaming careers stored as "Career Title.png"
  if (!filename && !careerIdentifier.includes('/')) {
    return buildAzureBlobUrl(AZURE_CONTAINERS.CAREERS, `${careerIdentifier}.png`);
  }

  // Legacy format: onet-code with folder structure
  const finalFilename = filename || 'main.jpg';
  return buildAzureBlobUrl(AZURE_CONTAINERS.CAREERS, `${careerIdentifier}/${finalFilename}`);
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
 * For careers, optionally provide industry/sector for better-matching images
 */
export const getPlaceholderImageUrl = (
  type: 'pathkey' | 'career' | 'avatar' | 'achievement',
  context?: { industry?: string; sector?: string; title?: string }
): string => {
  const placeholders = {
    pathkey: 'https://via.placeholder.com/300x400/9333ea/ffffff?text=Pathkey',
    career: getCareerPlaceholderImage(context),
    avatar: 'https://via.placeholder.com/200x200/94a3b8/ffffff?text=User',
    achievement: 'https://via.placeholder.com/100x100/f59e0b/ffffff?text=Achievement',
  };

  return placeholders[type];
};

/**
 * Get industry-specific placeholder image from Unsplash
 * Uses Unsplash's free API for high-quality stock photos
 */
const getCareerPlaceholderImage = (context?: { industry?: string; sector?: string; title?: string }): string => {
  // Map industries to relevant Unsplash search terms
  const industryKeywords: Record<string, string> = {
    'Technology': 'computer,coding,technology',
    'Healthcare': 'medical,healthcare,hospital',
    'Education': 'classroom,teaching,education',
    'Business': 'office,business,professional',
    'Engineering': 'engineering,construction,blueprint',
    'Arts': 'art,creative,design',
    'Science': 'laboratory,science,research',
    'Finance': 'finance,banking,analytics',
    'Marketing': 'marketing,advertising,social-media',
    'Legal': 'law,legal,courthouse',
    'Manufacturing': 'factory,manufacturing,industrial',
    'Retail': 'retail,shopping,customer-service',
    'Transportation': 'transportation,logistics,vehicle',
    'Hospitality': 'hotel,restaurant,hospitality',
    'Agriculture': 'agriculture,farming,nature',
    'Construction': 'construction,building,architecture',
    'Government': 'government,civic,public-service',
    'Nonprofit': 'community,volunteering,nonprofit',
  };

  const industry = context?.industry || 'Business';
  const keywords = industryKeywords[industry] || 'professional,career,workplace';

  // Use Unsplash Source API (free, no API key required)
  // Format: https://source.unsplash.com/[width]x[height]/?[keywords]
  return `https://source.unsplash.com/1600x900/?${keywords}`;
};

/**
 * Ensure Azure Storage URL has SAS token appended
 */
export const ensureAzureUrlHasSasToken = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;

  // If it's not an Azure Storage URL, return as-is
  if (!imageUrl.includes('pathcte.blob.core.windows.net')) {
    return imageUrl;
  }

  // If it already has a SAS token (has query params), return as-is
  if (imageUrl.includes('?sv=') || imageUrl.includes('&sv=')) {
    return imageUrl;
  }

  // Extract the blob path and rebuild with SAS token
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const container = pathParts[0];
      const blobName = pathParts.slice(1).join('/');
      return buildAzureBlobUrl(container, blobName);
    }
  } catch (e) {
    console.error('Error parsing Azure URL:', e);
  }

  return imageUrl;
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

  // Ensure Azure URLs have SAS token
  const urlWithToken = ensureAzureUrlHasSasToken(imageUrl);
  if (urlWithToken) {
    return urlWithToken;
  }

  // If it's already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Otherwise, assume it's a blob name and build the URL
  return imageUrl;
};
