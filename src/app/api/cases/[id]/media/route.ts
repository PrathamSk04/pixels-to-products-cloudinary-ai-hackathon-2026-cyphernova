import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { MediaItem } from '@/lib/types';

import { initializeDemoCase } from '@/lib/demo-init';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    if (caseId === 'demo-case-1') {
      initializeDemoCase();
    }
    const searchParams = req.nextUrl.searchParams;
    const filter = searchParams.get('filter');
    const search = searchParams.get('search')?.toLowerCase();

    let media = store.getMediaByCase(caseId);

    if (filter) {
      switch (filter) {
        case 'images':
          media = media.filter(m => m.type === 'image');
          break;
        case 'videos':
          media = media.filter(m => m.type === 'video');
          break;
        case 'evidence':
          media = media.filter(m => !m.isDuplicate && !m.isLowQuality && Boolean(m.evidenceGroupId));
          break;
        case 'duplicates':
          media = media.filter(m => m.isDuplicate || Boolean(m.duplicateOf));
          break;
        case 'low_quality':
          media = media.filter(m => m.isLowQuality || (m.qualityScore > 0 && m.qualityScore < 50));
          break;
        case 'unclassified':
          media = media.filter(m => !m.evidenceGroupId && !m.isDuplicate && !m.isLowQuality);
          break;
      }
    }

    if (search) {
      media = media.filter(m =>
        m.caption?.toLowerCase()?.includes(search) ||
        m.categories?.some(c => c.toLowerCase().includes(search)) ||
        m.filename.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await req.json();

    const caseData = store.getCase(resolvedParams.id);
    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const newMedia: MediaItem = {
      id: crypto.randomUUID(),
      caseId: resolvedParams.id,
      filename: body.filename || 'media_item',
      originalFilename: body.originalFilename || body.filename || 'media_item',
      type: body.type || 'image',
      mimeType: body.mimeType || 'image/jpeg',
      cloudinaryPublicId: body.cloudinaryPublicId || '',
      cloudinaryUrl: body.cloudinaryUrl || body.url || '',
      thumbnailUrl: body.thumbnailUrl || body.url || '',
      width: body.width || 800,
      height: body.height || 600,
      size: body.size || 0,
      duration: body.duration,
      timestamp: body.timestamp || now,
      hash: body.hash || crypto.randomUUID().slice(0, 8),
      qualityScore: body.qualityScore || 0,
      clarityScore: body.clarityScore || 0,
      resolutionScore: body.resolutionScore || 0,
      relevanceScore: body.relevanceScore || 0,
      caption: body.caption || '',
      categories: body.categories || [],
      status: 'uploaded',
      isDuplicate: Boolean(body.isDuplicate),
      duplicateOf: body.duplicateOf,
      isLowQuality: Boolean(body.isLowQuality),
      evidenceGroupId: body.evidenceGroupId,
      uploadedAt: now,
    };

    store.addMedia(newMedia);

    const allMedia = store.getMediaByCase(resolvedParams.id);
    store.updateCase(resolvedParams.id, {
      mediaCount: allMedia.length,
      usefulCount: allMedia.filter(m => !m.isDuplicate && !m.isLowQuality).length,
      duplicateCount: allMedia.filter(m => m.isDuplicate).length,
      lowQualityCount: allMedia.filter(m => m.isLowQuality).length,
      updatedAt: now,
    });

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    console.error('Error adding media:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
