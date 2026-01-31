/**
 * Image optimization utilities for improved performance
 */

// Cache for preloaded images
const preloadedImages = new Set<string>();

/**
 * Preload an array of images
 * @param urls - Array of image URLs to preload
 */
export const preloadImages = (urls: string[]): void => {
  urls.forEach((url) => {
    if (preloadedImages.has(url)) return;
    
    const img = new Image();
    img.src = url;
    preloadedImages.add(url);
  });
};

/**
 * Preload images using link preload (higher priority)
 * @param urls - Array of image URLs to preload
 */
export const preloadCriticalImages = (urls: string[]): void => {
  urls.forEach((url) => {
    if (preloadedImages.has(url)) return;
    
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
    preloadedImages.add(url);
  });
};

/**
 * Get optimized Unsplash URL with specific dimensions
 * @param url - Original Unsplash URL
 * @param width - Desired width
 * @param quality - Image quality (1-100)
 */
export const getOptimizedUnsplashUrl = (
  url: string,
  width: number = 400,
  quality: number = 80
): string => {
  if (!url.includes("unsplash.com")) return url;
  
  // Parse existing URL and update params
  const urlObj = new URL(url);
  urlObj.searchParams.set("w", width.toString());
  urlObj.searchParams.set("q", quality.toString());
  urlObj.searchParams.set("auto", "format");
  urlObj.searchParams.set("fit", "crop");
  
  return urlObj.toString();
};

/**
 * Get srcset for responsive images
 * @param url - Base image URL
 * @param sizes - Array of widths for srcset
 */
export const getResponsiveSrcSet = (url: string, sizes: number[] = [400, 600, 800, 1200]): string => {
  if (!url.includes("unsplash.com")) return "";
  
  return sizes
    .map((size) => `${getOptimizedUnsplashUrl(url, size)} ${size}w`)
    .join(", ");
};

/**
 * Calculate optimal image size based on container
 * @param containerWidth - Width of the container
 * @param devicePixelRatio - Device pixel ratio (default 2 for retina)
 */
export const getOptimalImageSize = (
  containerWidth: number,
  devicePixelRatio: number = typeof window !== "undefined" ? window.devicePixelRatio : 2
): number => {
  const sizes = [200, 400, 600, 800, 1200, 1600];
  const targetSize = containerWidth * Math.min(devicePixelRatio, 2);
  
  return sizes.find((size) => size >= targetSize) || sizes[sizes.length - 1];
};

/**
 * Check if image is already in browser cache
 * @param url - Image URL to check
 */
export const isImageCached = (url: string): boolean => {
  const img = new Image();
  img.src = url;
  return img.complete;
};

/**
 * Create a low-quality placeholder URL for blur-up effect
 * @param url - Original image URL
 */
export const getLowQualityPlaceholder = (url: string): string => {
  if (url.includes("unsplash.com")) {
    return getOptimizedUnsplashUrl(url, 20, 10) + "&blur=50";
  }
  return url;
};

/**
 * Transform Google Drive share URLs to direct image URLs
 * @param url - Original URL
 */
export const transformGoogleDriveUrl = (url: string): string => {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    // Handle "file/d/ID/view" format
    const fileIdMatch = url.match(/\/d\/([^/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      // Use thumbnail endpoint which is faster and reliable for images
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`;
    }
    // Handle "id=ID" format
    const idParamMatch = url.match(/[?&]id=([^&]+)/);
    if (idParamMatch && idParamMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${idParamMatch[1]}&sz=w1000`;
    }
  }
  return url;
};
