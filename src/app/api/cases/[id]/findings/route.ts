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
    const findings = store.getFindingsByCase(caseId);

    const populatedFindings = findings.map(finding => {
      const links = store.getEvidenceLinksByFinding(finding.id);
      const evidenceLinks = links.map(link => ({
        ...link,
        mediaItem: store.getMedia(link.mediaId),
      }));
      return {
        ...finding,
        evidenceLinks,
      };
    });

    return NextResponse.json(populatedFindings);
  } catch (error) {
    console.error('Error fetching findings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
