import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { EvidenceGroup, Finding, EvidenceLink, TimelineEntry } from '@/lib/types';
import { getAIProvider } from '@/lib/ai/provider';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    const caseData = store.getCase(caseId);

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const allMedia = store.getMediaByCase(caseId);
    if (allMedia.length === 0) {
      return NextResponse.json({ error: 'No media to process' }, { status: 400 });
    }

    // Step 1: Update status to processing
    store.updateCase(caseId, { status: 'processing' });

    const aiProvider = getAIProvider();

    // Step 2: Analyze each media item
    const duplicateMap = new Map<string, string>(); // hash -> primary mediaId
    const nameMap = new Map<string, string>(); // normalized name -> primary mediaId

    for (const media of allMedia) {
      // 1. Duplicate check by hash or near-identical filename
      const normName = media.filename.toLowerCase().replace(/[-_\s]/g, '');
      const isExactDuplicate = duplicateMap.has(media.hash);
      const isNameDuplicate = nameMap.has(normName) && !isExactDuplicate;

      if (isExactDuplicate) {
        media.isDuplicate = true;
        media.duplicateOf = duplicateMap.get(media.hash);
        media.status = 'duplicate';
      } else if (isNameDuplicate && allMedia.length > 2) {
        media.isDuplicate = true;
        media.duplicateOf = nameMap.get(normName);
        media.status = 'duplicate';
      } else {
        duplicateMap.set(media.hash, media.id);
        nameMap.set(normName, media.id);
      }

      // 2. AI Vision Analysis if not already analyzed
      if (!media.caption || media.caption.startsWith('Image of') || media.categories.length === 0) {
        if (media.type === 'video') {
          const videoAnalysis = await aiProvider.analyzeVideo(media.cloudinaryUrl, media.filename, caseData.type);
          media.caption = videoAnalysis.caption;
          media.categories = videoAnalysis.categories;
          media.qualityScore = videoAnalysis.qualityScore;
          media.clarityScore = videoAnalysis.clarityScore;
          media.resolutionScore = videoAnalysis.resolutionScore;
          media.relevanceScore = videoAnalysis.relevanceScore;
        } else {
          const imageAnalysis = await aiProvider.analyzeImage(media.cloudinaryUrl, media.filename, caseData.type);
          media.caption = imageAnalysis.caption;
          media.categories = imageAnalysis.categories;
          media.qualityScore = imageAnalysis.qualityScore;
          media.clarityScore = imageAnalysis.clarityScore;
          media.resolutionScore = imageAnalysis.resolutionScore;
          media.relevanceScore = imageAnalysis.relevanceScore;
          media.isLowQuality = imageAnalysis.isLowQuality;
          if (imageAnalysis.isLowQuality) {
            media.status = 'low_quality';
          }
        }
      }

      if (!media.isDuplicate && !media.isLowQuality) {
        media.status = 'analyzed';
      }

      store.updateMedia(media.id, media);
    }

    // Step 3: Group evidence using AI provider
    const groupResult = await aiProvider.groupEvidence(caseData.type, allMedia);

    // Clear existing groups/findings if reprocessing
    const existingGroups = store.getEvidenceGroupsByCase(caseId);
    // If not demo case with pre-set groups, populate created groups
    if (existingGroups.length === 0) {
      for (const grp of groupResult.groups) {
        const groupMedia = grp.mediaIds.map(id => store.getMedia(id)).filter(Boolean) as typeof allMedia;

        const newGroup: EvidenceGroup = {
          id: crypto.randomUUID(),
          caseId,
          title: grp.title,
          description: grp.description,
          confidence: grp.confidence,
          category: grp.category,
          mediaItems: groupMedia,
          findings: [],
          strongestMediaId: grp.strongestMediaId,
        };

        // Assign evidenceGroupId to media items
        for (const item of groupMedia) {
          store.updateMedia(item.id, { evidenceGroupId: newGroup.id });
        }

        // Create Finding for this evidence group
        const newFinding: Finding = {
          id: crypto.randomUUID(),
          caseId,
          title: `Evidence of ${grp.title.replace(' Evidence', '')}`,
          description: grp.description,
          confidence: grp.confidence,
          category: grp.category,
          evidenceGroupId: newGroup.id,
        };

        store.addFinding(newFinding);
        newGroup.findings.push(newFinding);

        // Create Evidence Links with traceability reasons
        for (const item of groupMedia) {
          const isStrongest = item.id === grp.strongestMediaId;
          const link: EvidenceLink = {
            id: crypto.randomUUID(),
            findingId: newFinding.id,
            mediaId: item.id,
            reason: isStrongest
              ? 'Primary visual evidence — highest resolution and clear perspective'
              : 'Corroborating angle confirms visual observation',
            strength: isStrongest ? grp.confidence : Math.max(60, grp.confidence - 8),
          };
          store.addEvidenceLink(link);
        }

        store.addEvidenceGroup(newGroup);
      }
    }

    // Step 4: Build Timeline entries from media timestamps
    const existingTimeline = store.getTimelineByCase(caseId);
    if (existingTimeline.length === 0) {
      const usefulMedia = allMedia.filter(m => !m.isDuplicate && !m.isLowQuality);
      usefulMedia.forEach((m, idx) => {
        const entry: TimelineEntry = {
          id: crypto.randomUUID(),
          mediaId: m.id,
          timestamp: m.timestamp || new Date(Date.now() + idx * 30000).toISOString(),
          label: m.caption.slice(0, 45) + (m.caption.length > 45 ? '...' : ''),
          description: m.caption,
          thumbnailUrl: m.thumbnailUrl || m.cloudinaryUrl,
          isEstimated: !m.timestamp,
        };
        store.addTimelineEntry(entry);
      });
    }

    // Step 5: Update Case statistics and mark completed
    const updatedMedia = store.getMediaByCase(caseId);
    const updatedGroups = store.getEvidenceGroupsByCase(caseId);
    const updatedFindings = store.getFindingsByCase(caseId);
    const updatedTimeline = store.getTimelineByCase(caseId);

    const stats = {
      totalFiles: updatedMedia.length,
      uniqueAssets: updatedMedia.filter(m => !m.isDuplicate && !m.isLowQuality).length,
      duplicatesDetected: updatedMedia.filter(m => m.isDuplicate).length,
      lowQualityAssets: updatedMedia.filter(m => m.isLowQuality).length,
      evidenceGroups: updatedGroups.length,
      visualFindings: updatedFindings.length,
    };

    store.updateCase(caseId, {
      status: 'completed',
      mediaCount: stats.totalFiles,
      usefulCount: stats.uniqueAssets,
      duplicateCount: stats.duplicatesDetected,
      lowQualityCount: stats.lowQualityAssets,
      evidenceGroupCount: stats.evidenceGroups,
      findingCount: stats.visualFindings,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      stats,
      evidenceGroups: updatedGroups,
      findings: updatedFindings,
      timeline: updatedTimeline,
    });
  } catch (error) {
    console.error('Error processing media pipeline:', error);
    return NextResponse.json({ error: 'Internal Server Error during processing' }, { status: 500 });
  }
}
