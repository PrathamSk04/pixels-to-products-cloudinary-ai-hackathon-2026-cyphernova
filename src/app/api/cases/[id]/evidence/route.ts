import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

import { initializeDemoCase } from '@/lib/demo-init';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    if (caseId === 'demo-case-1') {
      initializeDemoCase();
    }
    const groups = store.getEvidenceGroupsByCase(caseId);
    const allMedia = store.getMediaByCase(caseId);
    const allFindings = store.getFindingsByCase(caseId);

    const populatedGroups = groups.map(group => {
      // Ensure mediaItems and findings are accurately populated
      const groupMedia = group.mediaItems && group.mediaItems.length > 0
        ? group.mediaItems
        : allMedia.filter(m => m.evidenceGroupId === group.id);

      const groupFindings = group.findings && group.findings.length > 0
        ? group.findings
        : allFindings.filter(f => f.evidenceGroupId === group.id);

      return {
        ...group,
        mediaItems: groupMedia,
        findings: groupFindings,
      };
    });

    return NextResponse.json(populatedGroups);
  } catch (error) {
    console.error('Error fetching evidence:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
