import { MediaItem, Case, Finding, EvidenceGroup, ProcessingStats } from '../types';

export interface ImageAnalysisResult {
  caption: string;
  categories: string[];
  findings: { label: string; confidence: number; category: string; description: string }[];
  qualityScore: number;
  clarityScore: number;
  resolutionScore: number;
  relevanceScore: number;
  isLowQuality: boolean;
}

export interface VideoAnalysisResult {
  caption: string;
  categories: string[];
  findings: { label: string; confidence: number; category: string; description: string }[];
  qualityScore: number;
  clarityScore: number;
  resolutionScore: number;
  relevanceScore: number;
}

export interface AIProvider {
  analyzeImage(imageUrl: string, filename: string, caseType: string): Promise<ImageAnalysisResult>;
  analyzeVideo(videoUrl: string, filename: string, caseType: string): Promise<VideoAnalysisResult>;
  generateReport(caseData: Case, groups: EvidenceGroup[], findings: Finding[], stats: ProcessingStats): Promise<string>;
  groupEvidence(caseType: string, mediaItems: MediaItem[]): Promise<{
    groups: {
      title: string;
      description: string;
      category: string;
      confidence: number;
      mediaIds: string[];
      strongestMediaId: string;
    }[];
  }>;
}

/**
 * Deterministic AI Provider for Demo & Offline environments
 */
export class DemoAIProvider implements AIProvider {
  async analyzeImage(imageUrl: string, filename: string, caseType: string): Promise<ImageAnalysisResult> {
    const fn = filename.toLowerCase();

    if (fn.includes('bumper') || fn.includes('front') || fn.includes('3422') || fn.includes('3423')) {
      return {
        caption: 'Front bumper showing visible deformation and impact scraping',
        categories: ['vehicle', 'front bumper', 'damage', 'deformation'],
        findings: [
          {
            label: 'Front Bumper Deformation',
            confidence: 94,
            category: 'structural_damage',
            description: 'Significant plastic deformation and paint transfer on front bumper.',
          },
        ],
        qualityScore: 94,
        clarityScore: 96,
        resolutionScore: 95,
        relevanceScore: 97,
        isLowQuality: false,
      };
    }

    if (fn.includes('headlight') || fn.includes('light') || fn.includes('3424')) {
      return {
        caption: 'Left headlight assembly showing crack in housing and displacement',
        categories: ['vehicle', 'headlight', 'damage', 'crack'],
        findings: [
          {
            label: 'Headlight Housing Crack',
            confidence: 87,
            category: 'component_damage',
            description: 'Misaligned left headlight assembly with visible housing fissure.',
          },
        ],
        qualityScore: 87,
        clarityScore: 89,
        resolutionScore: 90,
        relevanceScore: 88,
        isLowQuality: false,
      };
    }

    if (fn.includes('door') || fn.includes('side') || fn.includes('3425') || fn.includes('3426')) {
      return {
        caption: 'Lateral scraping along driver side door panels with exposed primer',
        categories: ['vehicle', 'left door', 'damage', 'scraping'],
        findings: [
          {
            label: 'Door Panel Lateral Abrasion',
            confidence: 91,
            category: 'surface_damage',
            description: 'Extensive scraping along side door panels with paint removal.',
          },
        ],
        qualityScore: 93,
        clarityScore: 91,
        resolutionScore: 94,
        relevanceScore: 92,
        isLowQuality: false,
      };
    }

    if (fn.includes('wheel') || fn.includes('tire') || fn.includes('3427')) {
      return {
        caption: 'Wheel well liner displacement and fender deformation',
        categories: ['vehicle', 'wheel well', 'damage', 'fender'],
        findings: [
          {
            label: 'Wheel Well Impact Damage',
            confidence: 78,
            category: 'structural_damage',
            description: 'Liner pushed inward; fender buckled around wheel arch.',
          },
        ],
        qualityScore: 82,
        clarityScore: 84,
        resolutionScore: 86,
        relevanceScore: 80,
        isLowQuality: false,
      };
    }

    if (fn.includes('blur') || fn.includes('low') || fn.includes('3433')) {
      return {
        caption: 'Low quality / blurry capture with severe motion blur',
        categories: ['vehicle', 'blurry', 'unusable'],
        findings: [],
        qualityScore: 35,
        clarityScore: 22,
        resolutionScore: 45,
        relevanceScore: 40,
        isLowQuality: true,
      };
    }

    if (fn.includes('scene') || fn.includes('skid') || fn.includes('overview') || fn.includes('3421') || fn.includes('3434')) {
      return {
        caption: 'Scene context documenting roadway conditions and vehicular positions',
        categories: ['scene', 'overview', 'road', 'evidence'],
        findings: [
          {
            label: 'Incident Scene Overview',
            confidence: 96,
            category: 'scene_analysis',
            description: 'Comprehensive scene overview confirming roadway environment.',
          },
        ],
        qualityScore: 91,
        clarityScore: 93,
        resolutionScore: 94,
        relevanceScore: 95,
        isLowQuality: false,
      };
    }

    // Default analysis
    return {
      caption: `Visual inspection of ${filename} documenting incident condition`,
      categories: ['incident', 'inspection', caseType.replace('_', ' ')],
      findings: [
        {
          label: `Observed Condition (${filename})`,
          confidence: 85,
          category: 'general_observation',
          description: `Detailed visual capture relevant to ${caseType.replace('_', ' ')}.`,
        },
      ],
      qualityScore: 88,
      clarityScore: 87,
      resolutionScore: 90,
      relevanceScore: 86,
      isLowQuality: false,
    };
  }

  async analyzeVideo(videoUrl: string, filename: string, caseType: string): Promise<VideoAnalysisResult> {
    return {
      caption: 'Dynamic walk-around video recording capturing 360-degree scene context',
      categories: ['walk-around', 'video', 'scene', 'overview'],
      findings: [
        {
          label: 'Continuous Scene Documentation',
          confidence: 95,
          category: 'scene_analysis',
          description: 'High-definition video providing spatial continuity and damage severity context.',
        },
      ],
      qualityScore: 90,
      clarityScore: 88,
      resolutionScore: 92,
      relevanceScore: 95,
    };
  }

  async generateReport(caseData: Case, groups: EvidenceGroup[], findings: Finding[], stats: ProcessingStats): Promise<string> {
    return `Executive summary for ${caseData.name}: Analyzed ${stats.totalFiles} media items. Detected ${stats.uniqueAssets} useful assets across ${stats.evidenceGroups} evidence groups with ${stats.visualFindings} verifiable visual findings. Duplicates (${stats.duplicatesDetected}) and low quality media (${stats.lowQualityAssets}) were isolated into low-value archives to preserve evidentiary integrity.`;
  }

  async groupEvidence(caseType: string, mediaItems: MediaItem[]): Promise<{
    groups: {
      title: string;
      description: string;
      category: string;
      confidence: number;
      mediaIds: string[];
      strongestMediaId: string;
    }[];
  }> {
    const useful = mediaItems.filter(m => !m.isDuplicate && !m.isLowQuality);
    const categoryBuckets = new Map<string, MediaItem[]>();

    useful.forEach(m => {
      const primaryCat = m.categories[1] || m.categories[0] || 'general';
      const existing = categoryBuckets.get(primaryCat) || [];
      existing.push(m);
      categoryBuckets.set(primaryCat, existing);
    });

    const groups = Array.from(categoryBuckets.entries()).map(([cat, items]) => {
      const sortedByQuality = [...items].sort((a, b) => b.qualityScore - a.qualityScore);
      const strongest = sortedByQuality[0];
      const avgConfidence = Math.round(
        items.reduce((acc, curr) => acc + curr.qualityScore, 0) / items.length
      );

      const formattedTitle = cat
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      return {
        title: `${formattedTitle} Evidence`,
        description: `Corroborated visual evidence set focusing on ${cat} with ${items.length} supporting asset${items.length > 1 ? 's' : ''}.`,
        category: cat.replace(/\s+/g, '_'),
        confidence: Math.min(99, Math.max(75, avgConfidence)),
        mediaIds: items.map(i => i.id),
        strongestMediaId: strongest.id,
      };
    });

    return { groups };
  }
}

/**
 * Factory for obtaining the configured AI provider
 */
export function getAIProvider(): AIProvider {
  // Can be swapped to GeminiProvider or OpenAIProvider via AI_PROVIDER env var
  return new DemoAIProvider();
}
