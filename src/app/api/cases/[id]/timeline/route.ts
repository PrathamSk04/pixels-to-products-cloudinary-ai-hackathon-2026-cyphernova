import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { TimelineEntry } from '@/lib/types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    let timeline = store.getTimelineByCase(caseId);

    if (timeline.length === 0) {
      const allMedia = store.getMediaByCase(caseId);
      const useful = allMedia.filter(m => !m.isDuplicate && !m.isLowQuality);

      timeline = useful.map((m, idx) => ({
        id: crypto.randomUUID(),
        mediaId: m.id,
        timestamp: m.timestamp || new Date(Date.now() + idx * 60000).toISOString(),
        label: m.caption ? (m.caption.slice(0, 50) + (m.caption.length > 50 ? '...' : '')) : m.filename,
        description: m.caption || `Uploaded file ${m.filename}`,
        thumbnailUrl: m.thumbnailUrl || m.cloudinaryUrl,
        isEstimated: !m.timestamp,
      }));
    }

    return NextResponse.json(timeline);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
