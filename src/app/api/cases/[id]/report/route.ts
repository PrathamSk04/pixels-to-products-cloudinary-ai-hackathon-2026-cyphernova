import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ProcessingStats } from '@/lib/types';

import { initializeDemoCase } from '@/lib/demo-init';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    if (caseId === 'demo-case-1') {
      initializeDemoCase();
    }
    const caseInfo = store.getCase(caseId);

    if (!caseInfo) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const allMedia = store.getMediaByCase(caseId);
    const evidenceGroups = store.getEvidenceGroupsByCase(caseId).map(g => ({
      ...g,
      mediaItems: g.mediaItems && g.mediaItems.length > 0
        ? g.mediaItems
        : allMedia.filter(m => m.evidenceGroupId === g.id),
    }));

    const findings = store.getFindingsByCase(caseId).map(f => {
      const links = store.getEvidenceLinksByFinding(f.id);
      return {
        ...f,
        evidenceLinks: links.map(l => ({
          ...l,
          mediaItem: store.getMedia(l.mediaId),
        })),
      };
    });

    const timeline = store.getTimelineByCase(caseId);

    const stats: ProcessingStats = {
      totalFiles: caseInfo.mediaCount || allMedia.length,
      uniqueAssets: caseInfo.usefulCount || allMedia.filter(m => !m.isDuplicate && !m.isLowQuality).length,
      duplicatesDetected: caseInfo.duplicateCount || allMedia.filter(m => m.isDuplicate).length,
      lowQualityAssets: caseInfo.lowQualityCount || allMedia.filter(m => m.isLowQuality).length,
      evidenceGroups: evidenceGroups.length,
      visualFindings: findings.length,
    };

    const report = {
      id: `report-${caseId}`,
      caseId,
      title: `${caseInfo.name} Evidence Report`,
      generatedAt: new Date().toISOString(),
      caseInfo,
      stats,
      evidenceGroups,
      findings,
      timeline,
      disclaimer:
        'AI-generated observations are for documentation and organizational purposes and should not be treated as a professional, legal, insurance, medical, or engineering determination.',
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
