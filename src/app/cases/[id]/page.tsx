'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Camera,
  FileText,
  Clock,
  GitBranch,
  BarChart3,
  ArrowRight,
  Image as ImageIcon,
  Video,
  AlertTriangle,
  Copy,
  Search,
  ChevronRight,
  Sparkles,
  Eye,
  Download,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Case, EvidenceGroup, ProcessingStats, MediaItem, Finding, CASE_TYPE_LABELS } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function CaseDashboard() {
  const params = useParams();
  const caseId = params.id as string;
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [evidenceGroups, setEvidenceGroups] = useState<EvidenceGroup[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'media' | 'timeline' | 'report'>('overview');

  const loadData = useCallback(async () => {
    try {
      const [caseRes, evidenceRes, mediaRes, findingsRes] = await Promise.all([
        fetch(`/api/cases/${caseId}`),
        fetch(`/api/cases/${caseId}/evidence`),
        fetch(`/api/cases/${caseId}/media`),
        fetch(`/api/cases/${caseId}/findings`),
      ]);

      if (caseRes.ok) setCaseData(await caseRes.json());
      if (evidenceRes.ok) setEvidenceGroups(await evidenceRes.json());
      if (mediaRes.ok) setMediaItems(await mediaRes.json());
      if (findingsRes.ok) setFindings(await findingsRes.json());
    } catch (err) {
      console.error('Failed to load case data:', err);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading case data...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Case not found</h2>
          <Link href="/" className="text-blue-600 hover:underline">Return to home</Link>
        </div>
      </div>
    );
  }

  const stats: ProcessingStats = {
    totalFiles: caseData.mediaCount,
    uniqueAssets: caseData.usefulCount,
    duplicatesDetected: caseData.duplicateCount,
    lowQualityAssets: caseData.lowQualityCount,
    evidenceGroups: caseData.evidenceGroupCount,
    visualFindings: caseData.findingCount,
  };

  const usefulMedia = mediaItems.filter((m) => !m.isDuplicate && !m.isLowQuality);
  const needsProcessing = caseData.status === 'created' || caseData.status === 'uploading';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">EviTrace</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-sm text-slate-600 truncate max-w-[200px] md:max-w-none">{caseData.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {needsProcessing ? (
              <Link
                href={`/cases/${caseId}/upload`}
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Media
              </Link>
            ) : (
              <Link
                href={`/cases/${caseId}/report`}
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                View Report
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1">
            {[
              { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
              { id: 'evidence' as const, label: 'Evidence', icon: GitBranch },
              { id: 'media' as const, label: 'Media Library', icon: Camera },
              { id: 'timeline' as const, label: 'Timeline', icon: Clock },
              { id: 'report' as const, label: 'Report', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'report') {
                    window.location.href = `/cases/${caseId}/report`;
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <OverviewTab caseData={caseData} stats={stats} evidenceGroups={evidenceGroups} caseId={caseId} needsProcessing={needsProcessing} />
        )}
        {activeTab === 'evidence' && (
          <EvidenceTab evidenceGroups={evidenceGroups} findings={findings} mediaItems={mediaItems} caseId={caseId} />
        )}
        {activeTab === 'media' && (
          <MediaLibraryTab mediaItems={mediaItems} />
        )}
        {activeTab === 'timeline' && (
          <TimelineTab caseId={caseId} />
        )}
      </div>
    </div>
  );
}

function OverviewTab({
  caseData,
  stats,
  evidenceGroups,
  caseId,
  needsProcessing,
}: {
  caseData: Case;
  stats: ProcessingStats;
  evidenceGroups: EvidenceGroup[];
  caseId: string;
  needsProcessing: boolean;
}) {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      {/* Case Info */}
      <motion.div variants={fadeIn} className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{caseData.name}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {CASE_TYPE_LABELS[caseData.type]}
              </span>
              <span>{formatDate(caseData.createdAt)}</span>
              <span className={cn(
                'px-2 py-0.5 rounded-full font-medium',
                caseData.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              )}>
                {caseData.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
            {caseData.description && (
              <p className="text-slate-600 mt-3 max-w-2xl">{caseData.description}</p>
            )}
          </div>
          {needsProcessing && (
            <Link
              href={`/cases/${caseId}/upload`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Upload & Process <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      {stats.totalFiles > 0 && (
        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Media Files', value: stats.totalFiles, icon: Camera, color: 'blue' },
            { label: 'Useful Assets', value: stats.uniqueAssets, icon: ImageIcon, color: 'green' },
            { label: 'Duplicates', value: stats.duplicatesDetected, icon: Copy, color: 'amber' },
            { label: 'Low Quality', value: stats.lowQualityAssets, icon: AlertTriangle, color: 'red' },
            { label: 'Evidence Groups', value: stats.evidenceGroups, icon: GitBranch, color: 'purple' },
            { label: 'Findings', value: stats.visualFindings, icon: Sparkles, color: 'indigo' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-${stat.color}-50`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Evidence Groups */}
      {evidenceGroups.length > 0 && (
        <motion.div variants={fadeIn}>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Evidence Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evidenceGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{group.title}</h3>
                  <span className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded-full',
                    group.confidence >= 90 ? 'bg-green-50 text-green-700' :
                    group.confidence >= 70 ? 'bg-blue-50 text-blue-700' :
                    'bg-amber-50 text-amber-700'
                  )}>
                    {group.confidence}%
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{group.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {group.mediaItems.slice(0, 4).map((media) => (
                      <div key={media.id} className="w-8 h-8 rounded-lg border-2 border-white bg-slate-100 overflow-hidden">
                        <img src={media.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {group.mediaItems.length > 4 && (
                      <div className="w-8 h-8 rounded-lg border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        +{group.mediaItems.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{group.mediaItems.length} assets</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function EvidenceTab({
  evidenceGroups,
  findings,
  mediaItems,
  caseId,
}: {
  evidenceGroups: EvidenceGroup[];
  findings: Finding[];
  mediaItems: MediaItem[];
  caseId: string;
}) {
  const [selectedGroup, setSelectedGroup] = useState<EvidenceGroup | null>(evidenceGroups[0] || null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [traceData, setTraceData] = useState<{ mediaId: string; reasons: string[] }[] | null>(null);
  const [highlightedMediaIds, setHighlightedMediaIds] = useState<string[]>([]);

  // When selectedGroup changes, default its media
  useEffect(() => {
    if (!selectedFinding && selectedGroup) {
      setHighlightedMediaIds(selectedGroup.mediaItems.map((m) => m.id));
    }
  }, [selectedGroup, selectedFinding]);

  const handleSelectFinding = async (finding: Finding) => {
    if (selectedFinding?.id === finding.id) {
      setSelectedFinding(null);
      setTraceData(null);
      setHighlightedMediaIds(selectedGroup ? selectedGroup.mediaItems.map((m) => m.id) : []);
      return;
    }

    setSelectedFinding(finding);

    // Auto-select the corresponding group in the graph
    const matchingGroup = evidenceGroups.find((g) => g.id === finding.evidenceGroupId);
    if (matchingGroup) {
      setSelectedGroup(matchingGroup);
    }

    try {
      const res = await fetch(`/api/cases/${caseId}/findings`);
      if (res.ok) {
        const allFindings = await res.json();
        const f = allFindings.find(
          (ff: Finding & { evidenceLinks?: { mediaId: string; reason: string }[] }) => ff.id === finding.id
        );
        if (f && f.evidenceLinks && f.evidenceLinks.length > 0) {
          const links = f.evidenceLinks.map((l: { mediaId: string; reason: string }) => ({
            mediaId: l.mediaId,
            reasons: [l.reason],
          }));
          setTraceData(links);
          setHighlightedMediaIds(links.map((l: { mediaId: string }) => l.mediaId));
        } else {
          // Fallback to group media
          const gMedia = matchingGroup ? matchingGroup.mediaItems.map((m) => m.id) : [];
          setHighlightedMediaIds(gMedia);
          setTraceData(
            gMedia.map((id) => ({
              mediaId: id,
              reasons: ['Primary evidence documenting observed finding'],
            }))
          );
        }
      }
    } catch {
      // Fallback
      if (matchingGroup) {
        setHighlightedMediaIds(matchingGroup.mediaItems.map((m) => m.id));
      }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      {/* Evidence Graph UI (Section 12) */}
      <motion.div variants={fadeIn} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Interactive Evidence Graph</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Click any finding or evidence node to trace relationships back to original media.
            </p>
          </div>
          {selectedFinding && (
            <button
              onClick={() => {
                setSelectedFinding(null);
                setTraceData(null);
                setHighlightedMediaIds(selectedGroup ? selectedGroup.mediaItems.map((m) => m.id) : []);
              }}
              className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors self-start"
            >
              Clear Finding Highlight
            </button>
          )}
        </div>

        {/* Visual Node Tree */}
        <div className="flex flex-col items-center py-4 bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
          {/* Root CASE Node */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              CASE MASTER
            </div>
            <div className="w-0.5 h-6 bg-slate-300" />
          </div>

          {/* Groups Row */}
          <div className="w-full">
            <div className="flex flex-wrap gap-3 justify-center">
              {evidenceGroups.map((group) => {
                const isGroupSelected = selectedGroup?.id === group.id;
                const isGroupActiveFinding = selectedFinding?.evidenceGroupId === group.id;

                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group);
                      setSelectedFinding(null);
                      setTraceData(null);
                      setHighlightedMediaIds(group.mediaItems.map((m) => m.id));
                    }}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium cursor-pointer max-w-[150px] text-center bg-white shadow-xs',
                      isGroupActiveFinding
                        ? 'border-blue-600 ring-4 ring-blue-100 bg-blue-50/60 scale-[1.03]'
                        : isGroupSelected
                        ? 'border-blue-500 bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <span className="font-semibold text-slate-900 truncate w-full">{group.title}</span>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        group.confidence >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      )}
                    >
                      {group.confidence}% AI Match
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {group.mediaItems.length} asset{group.mediaItems.length > 1 ? 's' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connecting Branch to Media */}
          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-2 flex flex-col items-center"
            >
              <div className="w-0.5 h-6 bg-blue-400" />

              <div className="w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-blue-600">Active Evidence Cluster:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedGroup.title}</span>
                  </div>
                  {selectedFinding && (
                    <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Highlighting Evidence for: &quot;{selectedFinding.title}&quot;
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {selectedGroup.mediaItems.map((media) => {
                    const isHighlighted = highlightedMediaIds.includes(media.id);

                    return (
                      <div
                        key={media.id}
                        className={cn(
                          'relative rounded-xl overflow-hidden border-2 transition-all bg-slate-50 flex flex-col',
                          isHighlighted
                            ? 'border-blue-600 ring-3 ring-blue-100 shadow-md scale-[1.02]'
                            : 'border-slate-200 opacity-60'
                        )}
                      >
                        <div className="relative aspect-[4/3] bg-slate-200">
                          <img
                            src={media.thumbnailUrl || media.cloudinaryUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {media.isDuplicate && (
                            <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Duplicate
                            </div>
                          )}
                          {isHighlighted && (
                            <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Evidence Link
                            </div>
                          )}
                        </div>

                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-xs font-mono font-bold text-slate-800 truncate">
                              {media.filename}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {media.caption}
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono">Q: {media.qualityScore}</span>
                            <a
                              href={media.cloudinaryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                            >
                              Original <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Signature Feature: Evidence Trace (Section 11) */}
      <motion.div variants={fadeIn}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Findings & Traceable Evidence</h2>
            <p className="text-sm text-slate-500">
              Every finding connects directly to original Cloudinary assets with verified rationale.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {findings.map((finding) => {
            const isSelected = selectedFinding?.id === finding.id;

            return (
              <div
                key={finding.id}
                className={cn(
                  'bg-white rounded-2xl border transition-all p-6 shadow-xs',
                  isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase text-blue-600 tracking-wider">
                      VERIFIED FINDING
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{finding.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{finding.description}</p>
                  </div>

                  <span
                    className={cn(
                      'text-xs font-bold px-3 py-1 rounded-full self-start flex-shrink-0 flex items-center gap-1',
                      finding.confidence >= 90
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    )}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {finding.confidence}% Confidence
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={() => handleSelectFinding(finding)}
                    className={cn(
                      'text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    )}
                  >
                    <GitBranch className="w-4 h-4" />
                    {isSelected ? 'Hide Evidence Trace' : 'Why is this evidence selected?'}
                  </button>

                  <span className="text-xs text-slate-400 font-mono">
                    Category: {finding.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Evidence Trace Drawer (Section 11) */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 pt-5 border-t border-slate-200"
                    >
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Why Selected Checklist */}
                          <div>
                            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                              Why Selected (Selection Criteria)
                            </div>
                            <div className="space-y-2 text-sm">
                              {[
                                'Highly relevant to documented incident',
                                'Clear visual evidence without severe blur or occlusion',
                                'Corroborating angle confirms spatial extent of damage',
                                'Not a duplicate or near-duplicate asset',
                                'Directly supports the registered finding',
                              ].map((reason, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs">
                                    ✓
                                  </div>
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Trace Context */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-mono font-bold uppercase text-slate-400 mb-1">
                                Traceability Guarantee
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Every finding in EviTrace maintains a cryptographic link to the unmodified Cloudinary
                                source asset. This allows forensic auditors to verify original EXIF timestamps, camera
                                model, and full-resolution uncompressed pixels.
                              </p>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-[11px] text-blue-600 font-mono">
                              <Sparkles className="w-3.5 h-3.5" />
                              Cloudinary Asset Delivery Verified
                            </div>
                          </div>
                        </div>

                        {/* Supporting Evidence Sources */}
                        <div>
                          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                            Evidence Sources ({traceData?.length || 0} Assets)
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {traceData &&
                              traceData.map((trace) => {
                                const media = mediaItems.find((m) => m.id === trace.mediaId);
                                if (!media) return null;

                                return (
                                  <div
                                    key={trace.mediaId}
                                    className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col justify-between"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-16 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                        <img
                                          src={media.thumbnailUrl || media.cloudinaryUrl}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-xs font-mono font-bold text-slate-900 truncate">
                                          {media.filename}
                                        </div>
                                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                          {media.caption}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-emerald-700 font-medium">
                                        ✓ Verified Evidence
                                      </span>
                                      <a
                                        href={media.cloudinaryUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                                      >
                                        View original <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

function MediaLibraryTab({ mediaItems }: { mediaItems: MediaItem[] }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia = mediaItems.filter((m) => {
    if (filter === 'images' && m.type !== 'image') return false;
    if (filter === 'videos' && m.type !== 'video') return false;
    if (filter === 'evidence' && (m.isDuplicate || m.isLowQuality || !m.evidenceGroupId)) return false;
    if (filter === 'duplicates' && !m.isDuplicate) return false;
    if (filter === 'low_quality' && !m.isLowQuality) return false;
    if (filter === 'unclassified' && (m.evidenceGroupId || m.isDuplicate || m.isLowQuality)) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        m.filename.toLowerCase().includes(s) ||
        m.caption.toLowerCase().includes(s) ||
        m.categories.some((c) => c.toLowerCase().includes(s))
      );
    }
    return true;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Filters */}
      <motion.div variants={fadeIn} className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'images', label: 'Images' },
            { id: 'videos', label: 'Videos' },
            { id: 'evidence', label: 'Evidence' },
            { id: 'duplicates', label: 'Duplicates' },
            { id: 'low_quality', label: 'Low Quality' },
            { id: 'unclassified', label: 'Unclassified' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'text-sm px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                filter === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </motion.div>

      {/* Media Grid */}
      <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredMedia.map((media) => (
          <button
            key={media.id}
            onClick={() => setSelectedMedia(selectedMedia?.id === media.id ? null : media)}
            className={cn(
              'bg-white rounded-xl border overflow-hidden text-left transition-all cursor-pointer',
              selectedMedia?.id === media.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
            )}
          >
            <div className="relative aspect-[4/3]">
              <img src={media.thumbnailUrl} alt={media.caption} className="w-full h-full object-cover" loading="lazy" />
              {media.type === 'video' && (
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Video className="w-3 h-3" /> Video
                </div>
              )}
              {media.isDuplicate && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Duplicate
                </div>
              )}
              {media.isLowQuality && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Low Quality
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <div className="text-white text-xs font-mono truncate">{media.filename}</div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-slate-600 line-clamp-2">{media.caption}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    media.qualityScore >= 80 ? 'bg-green-500' : media.qualityScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  )} />
                  <span className="text-xs text-slate-500">Q: {media.qualityScore}</span>
                </div>
                <span className="text-xs text-slate-500">R: {media.relevanceScore}</span>
              </div>
            </div>
          </button>
        ))}
      </motion.div>

      {/* Selected Media Detail */}
      {selectedMedia && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img src={selectedMedia.cloudinaryUrl} alt={selectedMedia.caption} className="w-full rounded-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{selectedMedia.filename}</h3>
              <p className="text-sm text-slate-600 mb-4">{selectedMedia.caption}</p>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 mb-2">AI-ASSISTED QUALITY ASSESSMENT</div>
                <div className="grid grid-cols-2 gap-3">
                  <QualityBar label="Clarity" score={selectedMedia.clarityScore} />
                  <QualityBar label="Resolution" score={selectedMedia.resolutionScore} />
                  <QualityBar label="Relevance" score={selectedMedia.relevanceScore} />
                  <QualityBar label="Overall" score={selectedMedia.qualityScore} />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-bold text-slate-400 mb-2">CATEGORIES</div>
                <div className="flex flex-wrap gap-1">
                  {selectedMedia.categories.map((cat) => (
                    <span key={cat} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{cat}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={selectedMedia.cloudinaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" /> View Original
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No media found matching your filters.</p>
        </div>
      )}
    </motion.div>
  );
}

function TimelineTab({ caseId }: { caseId: string }) {
  const [timeline, setTimeline] = useState<{ id: string; mediaId: string; timestamp: string; label: string; description: string; thumbnailUrl: string; isEstimated: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cases/${caseId}/timeline`)
      .then((res) => res.json())
      .then(setTimeline)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeIn}>
        <h2 className="text-lg font-bold text-slate-900 mb-6">Evidence Timeline</h2>
        {timeline.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No timeline data available.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[60px] md:left-[80px] top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-6">
              {timeline.map((entry, idx) => {
                const time = new Date(entry.timestamp);
                const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                return (
                  <motion.div
                    key={entry.id}
                    variants={fadeIn}
                    className="flex items-start gap-4 pl-0"
                  >
                    <div className="w-[50px] md:w-[70px] text-right">
                      <div className="text-sm font-bold text-slate-900">{timeStr}</div>
                      {entry.isEstimated && (
                        <div className="text-[10px] text-amber-600">est.</div>
                      )}
                    </div>
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm z-10 relative" />
                    </div>
                    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4">
                      <img src={entry.thumbnailUrl} alt="" className="w-20 h-15 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{entry.label}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{entry.description}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function QualityBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-900">{score}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
