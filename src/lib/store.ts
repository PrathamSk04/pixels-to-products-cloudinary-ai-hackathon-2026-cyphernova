import {
  Case,
  MediaItem,
  Finding,
  EvidenceLink,
  EvidenceGroup,
  TimelineEntry,
} from './types';

class DataStore {
  cases = new Map<string, Case>();
  mediaItems = new Map<string, MediaItem>();
  findings = new Map<string, Finding>();
  evidenceLinks = new Map<string, EvidenceLink>();
  evidenceGroups = new Map<string, EvidenceGroup>();
  timelineEntries = new Map<string, TimelineEntry>();

  // Case Methods
  createCase(caseData: Case): Case {
    this.cases.set(caseData.id, caseData);
    return caseData;
  }

  getCase(id: string): Case | undefined {
    return this.cases.get(id);
  }

  getCases(): Case[] {
    return Array.from(this.cases.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  updateCase(id: string, updates: Partial<Case>): Case | undefined {
    const existing = this.cases.get(id);
    if (!existing) return undefined;
    const updated: Case = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.cases.set(id, updated);
    return updated;
  }

  // Media Methods
  addMedia(media: MediaItem): MediaItem {
    this.mediaItems.set(media.id, media);
    return media;
  }

  getMedia(id: string): MediaItem | undefined {
    return this.mediaItems.get(id);
  }

  getMediaByCase(caseId: string): MediaItem[] {
    return Array.from(this.mediaItems.values()).filter((m) => m.caseId === caseId);
  }

  updateMedia(id: string, updates: Partial<MediaItem>): MediaItem | undefined {
    const existing = this.mediaItems.get(id);
    if (!existing) return undefined;
    const updated: MediaItem = { ...existing, ...updates };
    this.mediaItems.set(id, updated);
    return updated;
  }

  // Finding Methods
  addFinding(finding: Finding): Finding {
    this.findings.set(finding.id, finding);
    return finding;
  }

  getFindings(): Finding[] {
    return Array.from(this.findings.values());
  }

  getFindingsByCase(caseId: string): Finding[] {
    return Array.from(this.findings.values()).filter((f) => f.caseId === caseId);
  }

  // Evidence Group Methods
  addEvidenceGroup(group: EvidenceGroup): EvidenceGroup {
    this.evidenceGroups.set(group.id, group);
    return group;
  }

  getEvidenceGroups(): EvidenceGroup[] {
    return Array.from(this.evidenceGroups.values());
  }

  getEvidenceGroupsByCase(caseId: string): EvidenceGroup[] {
    return Array.from(this.evidenceGroups.values()).filter((g) => g.caseId === caseId);
  }

  // Evidence Link Methods
  addEvidenceLink(link: EvidenceLink): EvidenceLink {
    this.evidenceLinks.set(link.id, link);
    return link;
  }

  getEvidenceLinks(): EvidenceLink[] {
    return Array.from(this.evidenceLinks.values());
  }

  getEvidenceLinksByFinding(findingId: string): EvidenceLink[] {
    return Array.from(this.evidenceLinks.values()).filter((l) => l.findingId === findingId);
  }

  getEvidenceLinksByMedia(mediaId: string): EvidenceLink[] {
    return Array.from(this.evidenceLinks.values()).filter((l) => l.mediaId === mediaId);
  }

  // Timeline Methods
  addTimelineEntry(entry: TimelineEntry): TimelineEntry {
    this.timelineEntries.set(entry.id, entry);
    return entry;
  }

  getTimelineByCase(caseId: string): TimelineEntry[] {
    return Array.from(this.timelineEntries.values())
      .filter((e) => {
        const media = this.getMedia(e.mediaId);
        return media && media.caseId === caseId;
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Utility Methods
  clearAll() {
    this.cases.clear();
    this.mediaItems.clear();
    this.findings.clear();
    this.evidenceLinks.clear();
    this.evidenceGroups.clear();
    this.timelineEntries.clear();
  }
}

// Use a global variable pattern to survive HMR in Next.js dev
const globalForStore = globalThis as unknown as { __evitrace_store: DataStore };
export const store = globalForStore.__evitrace_store || new DataStore();
if (process.env.NODE_ENV !== 'production') {
  globalForStore.__evitrace_store = store;
}
