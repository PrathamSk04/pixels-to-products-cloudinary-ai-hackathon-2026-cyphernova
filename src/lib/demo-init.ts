import { getDemoCase } from './demo-data';
import { store } from './store';

let demoInitialized = false;

export function initializeDemoCase(forceRefresh = false): string {
  const existing = store.getCase('demo-case-1');
  const firstMedia = store.getMedia('demo-media-1');
  if (!forceRefresh && demoInitialized && existing && firstMedia && !firstMedia.cloudinaryUrl.includes('picsum')) {
    return 'demo-case-1';
  }

  const demo = getDemoCase();

  // Store the case
  store.createCase(demo.case);

  // Store all media items
  for (const media of demo.mediaItems) {
    store.addMedia(media);
  }

  // Store findings
  for (const finding of demo.findings) {
    store.addFinding(finding);
  }

  // Store evidence groups
  for (const group of demo.evidenceGroups) {
    store.addEvidenceGroup(group);
  }

  // Store evidence links
  for (const link of demo.evidenceLinks) {
    store.addEvidenceLink(link);
  }

  // Store timeline entries
  for (const entry of demo.timeline) {
    store.addTimelineEntry(entry);
  }

  demoInitialized = true;
  return demo.case.id;
}

export function isDemoCase(caseId: string): boolean {
  return caseId === 'demo-case-1';
}
