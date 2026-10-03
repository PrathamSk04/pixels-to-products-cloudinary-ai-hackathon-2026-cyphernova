export type CaseType = 'vehicle_incident' | 'property_inspection' | 'construction_inspection' | 'delivery_damage' | 'general_incident';

export interface Case {
  id: string;
  name: string;
  type: CaseType;
  description: string;
  status: 'created' | 'uploading' | 'processing' | 'completed';
  createdAt: string;
  updatedAt: string;
  mediaCount: number;
  usefulCount: number;
  duplicateCount: number;
  lowQualityCount: number;
  evidenceGroupCount: number;
  findingCount: number;
}

export interface MediaItem {
  id: string;
  caseId: string;
  filename: string;
  originalFilename: string;
  type: 'image' | 'video';
  mimeType: string;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  duration?: number;
  timestamp?: string;
  hash: string;
  qualityScore: number;
  clarityScore: number;
  resolutionScore: number;
  relevanceScore: number;
  caption: string;
  categories: string[];
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'duplicate' | 'low_quality';
  isDuplicate: boolean;
  duplicateOf?: string;
  isLowQuality: boolean;
  evidenceGroupId?: string;
  uploadedAt: string;
}

export interface Finding {
  id: string;
  caseId: string;
  title: string;
  description: string;
  confidence: number;
  category: string;
  evidenceGroupId: string;
}

export interface EvidenceLink {
  id: string;
  findingId: string;
  mediaId: string;
  reason: string;
  strength: number;
}

export interface EvidenceGroup {
  id: string;
  caseId: string;
  title: string;
  description: string;
  confidence: number;
  category: string;
  mediaItems: MediaItem[];
  findings: Finding[];
  strongestMediaId: string;
}

export interface TimelineEntry {
  id: string;
  mediaId: string;
  timestamp: string;
  label: string;
  description: string;
  thumbnailUrl: string;
  isEstimated: boolean;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  detail?: string;
}

export interface ProcessingStats {
  totalFiles: number;
  uniqueAssets: number;
  duplicatesDetected: number;
  lowQualityAssets: number;
  evidenceGroups: number;
  visualFindings: number;
}

export interface EvidenceTrace {
  finding: Finding;
  supportingMedia: MediaItem[];
  reasons: { mediaId: string; reasons: string[] }[];
}

export interface Report {
  id: string;
  caseId: string;
  title: string;
  generatedAt: string;
  caseInfo: Case;
  stats: ProcessingStats;
  evidenceGroups: EvidenceGroup[];
  findings: Finding[];
  timeline: TimelineEntry[];
  disclaimer: string;
}

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  vehicle_incident: 'Vehicle Incident',
  property_inspection: 'Property Inspection',
  construction_inspection: 'Construction Inspection',
  delivery_damage: 'Delivery / Package Damage',
  general_incident: 'General Incident',
};
