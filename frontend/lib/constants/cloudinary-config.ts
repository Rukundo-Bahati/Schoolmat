// Cloudinary configuration for frontend
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwk1eq0om',
  folder: 'schoolmart',
  baseUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwk1eq0om'}/image/upload/`,
};

/**
 * Helper function to convert local image paths to Cloudinary URLs
 * @param localPath - The local image path (e.g., "/school-notebook-set.png")
 * @returns Cloudinary URL
 */
export function getCloudinaryUrl(localPath: string): string {
  if (!localPath) return '/placeholder.jpg';
  
  // If it's already a Cloudinary URL, return as-is
  if (localPath.startsWith('http')) {
    return localPath;
  }
  
  // Remove leading slash if present
  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  
  return `${CLOUDINARY_CONFIG.baseUrl}${CLOUDINARY_CONFIG.folder}/${cleanPath}`;
}

/**
 * Helper function to get optimized Cloudinary URL with transformations
 * @param localPath - The local image path
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export function getOptimizedCloudinaryUrl(
  localPath: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'good' | 'eco' | 'low';
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  } = {}
): string {
  const baseUrl = getCloudinaryUrl(localPath);
  
  if (!baseUrl.includes('cloudinary.com')) {
    return baseUrl; // Return as-is for non-Cloudinary URLs
  }
  
  const transformations = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  
  const transformString = transformations.join(',');
  
  if (transformString) {
    return baseUrl.replace('/upload/', `/upload/${transformString}/`);
  }
  
  return baseUrl;
}