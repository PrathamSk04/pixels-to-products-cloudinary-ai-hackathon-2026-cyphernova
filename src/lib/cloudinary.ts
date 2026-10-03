import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Generate Cloudinary transformed URL for optimized delivery
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'thumb' | 'scale';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg';
    gravity?: 'auto' | 'face' | 'center';
  } = {}
): string {
  // If it's not a Cloudinary asset or Cloudinary is not configured, return original or fallback
  if (!publicIdOrUrl.startsWith('http') && !isCloudinaryConfigured()) {
    return publicIdOrUrl;
  }

  if (publicIdOrUrl.startsWith('http') && !publicIdOrUrl.includes('res.cloudinary.com')) {
    return publicIdOrUrl;
  }

  const {
    width = 800,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
  } = options;

  // If public ID was passed, use cloudinary url generator
  if (!publicIdOrUrl.startsWith('http') && isCloudinaryConfigured()) {
    return cloudinary.url(publicIdOrUrl, {
      width,
      height,
      crop,
      quality,
      fetch_format: format,
      gravity,
      secure: true,
    });
  }

  // If it's already a full cloudinary URL, insert transformation parameters
  if (publicIdOrUrl.includes('/upload/')) {
    const parts = publicIdOrUrl.split('/upload/');
    const transforms = [`f_${format}`, `q_${quality}`];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (crop) transforms.push(`c_${crop}`);
    if (gravity) transforms.push(`g_${gravity}`);

    return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
  }

  return publicIdOrUrl;
}

/**
 * Generate thumbnail URL for media items
 */
export function getThumbnailUrl(publicIdOrUrl: string, width = 400, height = 300): string {
  return getOptimizedImageUrl(publicIdOrUrl, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    gravity: 'auto',
  });
}

/**
 * Generate video poster frame / thumbnail from Cloudinary video
 */
export function getVideoPosterUrl(publicIdOrUrl: string, second = 1): string {
  if (publicIdOrUrl.includes('/upload/')) {
    const parts = publicIdOrUrl.split('/upload/');
    return `${parts[0]}/upload/so_${second},w_600,h_400,c_fill,f_jpg,q_auto/${parts[1].replace(/\.[^/.]+$/, '.jpg')}`;
  }
  return publicIdOrUrl;
}

export { cloudinary };
