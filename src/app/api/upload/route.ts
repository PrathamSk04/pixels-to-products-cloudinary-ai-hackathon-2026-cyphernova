import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { MediaItem } from '@/lib/types';
import { cloudinary, isCloudinaryConfigured, getThumbnailUrl, getVideoPosterUrl } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;

    if (!file || !caseId) {
      return NextResponse.json({ error: 'File and caseId are required' }, { status: 400 });
    }

    const caseData = store.getCase(caseId);
    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const isVideo = file.type.startsWith('video') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');
    let cloudinaryUrl = '';
    let thumbnailUrl = '';
    let cloudinaryPublicId = '';
    let width = 1920;
    let height = 1080;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compute simple deterministic hash from buffer header for duplicate detection
    let hash = '';
    const sliceLen = Math.min(buffer.length, 1024);
    let hashVal = 0;
    for (let i = 0; i < sliceLen; i++) {
      hashVal = ((hashVal << 5) - hashVal + buffer[i]) | 0;
    }
    hash = Math.abs(hashVal).toString(16) + `_${file.size}`;

    if (isCloudinaryConfigured()) {
      const uploadPromise = new Promise<{
        secure_url: string;
        public_id: string;
        width?: number;
        height?: number;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'evitrace',
            resource_type: isVideo ? 'video' : 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error || !result) reject(error || new Error('Upload failed'));
            else resolve(result as { secure_url: string; public_id: string; width?: number; height?: number });
          }
        );
        stream.end(buffer);
      });

      const result = await uploadPromise;
      cloudinaryUrl = result.secure_url;
      cloudinaryPublicId = result.public_id;
      width = result.width || (isVideo ? 1920 : 4032);
      height = result.height || (isVideo ? 1080 : 3024);
      thumbnailUrl = isVideo
        ? getVideoPosterUrl(cloudinaryUrl)
        : getThumbnailUrl(cloudinaryUrl, 400, 300);
    } else {
      // Deterministic fallback for local / demo run without Cloudinary API credentials
      const seed = file.name.replace(/[^a-zA-Z0-9]/g, '') || 'sample';
      cloudinaryUrl = `https://picsum.photos/seed/${seed}/800/600`;
      thumbnailUrl = `https://picsum.photos/seed/${seed}/400/300`;
      cloudinaryPublicId = `evitrace/fallback/${file.name}`;
      width = 800;
      height = 600;
    }

    const now = new Date().toISOString();
    const newMedia: MediaItem = {
      id: crypto.randomUUID(),
      caseId,
      filename: file.name,
      originalFilename: file.name,
      type: isVideo ? 'video' : 'image',
      mimeType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
      cloudinaryPublicId,
      cloudinaryUrl,
      thumbnailUrl,
      width,
      height,
      size: file.size,
      timestamp: now,
      hash,
      qualityScore: 0,
      clarityScore: 0,
      resolutionScore: 0,
      relevanceScore: 0,
      caption: '',
      categories: [],
      status: 'uploaded',
      isDuplicate: false,
      isLowQuality: false,
      uploadedAt: now,
    };

    store.addMedia(newMedia);

    // Update case media count
    const allMedia = store.getMediaByCase(caseId);
    store.updateCase(caseId, {
      mediaCount: allMedia.length,
      usefulCount: allMedia.length,
      updatedAt: now,
    });

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Failed to upload media item' }, { status: 500 });
  }
}
