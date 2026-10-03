'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Shield,
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Camera,
  GitBranch,
  Sparkles,
  ExternalLink,
  Download,
  Calendar,
  Tag,
} from 'lucide-react';
import { Report, Finding, EvidenceGroup, MediaItem, TimelineEntry } from '@/lib/types';
import { formatDate, CASE_TYPE_LABELS, cn } from '@/lib/utils';

interface FindingWithLinks extends Finding {
  evidenceLinks?: {
    id: string;
    mediaId: string;
    reason: string;
    strength: number;
    mediaItem?: MediaItem;
  }[];
}

export default function CaseReportPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/cases/${caseId}/report`);
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        }
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div>
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Report Not Found</h2>
          <p className="text-slate-600 text-sm mb-4">Please ensure media has been processed for this case.</p>
          <Link href={`/cases/${caseId}`} className="text-blue-600 font-medium hover:underline">
            Back to Case Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { caseInfo, stats, evidenceGroups, findings, timeline, disclaimer } = report;

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white text-slate-900 py-8 px-4 md:px-8 print:p-0 print:py-0">
      {/* Non-print action header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/cases/${caseId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Report Document Container */}
      <article className="max-w-4xl mx-auto bg-white border border-slate-200 print:border-0 rounded-2xl print:rounded-none shadow-sm print:shadow-none p-8 md:p-12 print:p-0 print:m-0 print:max-w-none print:w-full">
        {/* Document Header */}
        <header className="border-b border-slate-200 pb-6 mb-6 print:pb-3 print:mb-4">
          <div className="flex items-start justify-between gap-4 mb-4 print:mb-2">
            <div>
              <div className="flex items-center gap-2 mb-2 print:mb-1">
                <div className="w-7 h-7 print:w-6 print:h-6 bg-blue-600 rounded-md flex items-center justify-center">
                  <Shield className="w-4 h-4 print:w-3.5 print:h-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-900 text-lg print:text-base tracking-tight">EviTrace</span>
                <span className="text-xs print:text-[9.5px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Traceable Evidence Package
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl print:text-xl font-extrabold text-slate-900 tracking-tight">
                {caseInfo.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm print:text-xs text-slate-500 mt-2 print:mt-1">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  {CASE_TYPE_LABELS[caseInfo.type]}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Generated {formatDate(report.generatedAt)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs print:text-[9.5px] uppercase font-mono text-slate-400">Report Reference</div>
              <div className="text-sm print:text-xs font-mono font-semibold text-slate-800">{report.id}</div>
              <div className="text-xs print:text-[9.5px] text-green-700 font-medium mt-0.5">Verified Pipeline Ingestion</div>
            </div>
          </div>

          {caseInfo.description && (
            <p className="text-sm print:text-xs text-slate-600 bg-slate-50 border border-slate-100 p-4 print:p-2.5 rounded-xl print:rounded-lg leading-relaxed print:leading-normal">
              <span className="font-semibold text-slate-800">Case Description: </span>
              {caseInfo.description}
            </p>
          )}
        </header>

        {/* Case Executive Summary Statistics */}
        <section className="mb-8 print:mb-4 break-inside-avoid">
          <h2 className="text-xs print:text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-3 print:mb-2">
            Pipeline Analytics Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 print:grid-cols-6 gap-3 print:gap-2">
            {[
              { label: 'Media Files', value: stats.totalFiles, sub: 'Analyzed' },
              { label: 'Useful Assets', value: stats.uniqueAssets, sub: 'Filtered' },
              { label: 'Duplicates', value: stats.duplicatesDetected, sub: 'Preserved' },
              { label: 'Low Quality', value: stats.lowQualityAssets, sub: 'Flagged' },
              { label: 'Evidence Groups', value: stats.evidenceGroups, sub: 'Corroborated' },
              { label: 'Visual Findings', value: stats.visualFindings, sub: 'Traceable' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 border border-slate-200/80 rounded-xl print:rounded-lg p-3.5 print:p-2 text-center">
                <div className="text-2xl print:text-lg font-black text-slate-900">{s.value}</div>
                <div className="text-xs print:text-[9.5px] font-bold text-slate-700 leading-tight mt-0.5">{s.label}</div>
                <div className="text-[10px] print:text-[8px] text-slate-400 uppercase font-mono mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 1: Detailed Findings with Visual Evidence Trace */}
        <section className="mb-10 print:mb-5">
          <h2 className="text-lg print:text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6 print:mb-3 flex items-center justify-between break-after-avoid">
            <span>Visual Findings & Evidence Trace</span>
            <span className="text-xs print:text-[10.5px] font-normal text-slate-500">{findings.length} findings recorded</span>
          </h2>

          <div className="space-y-6 print:space-y-3">
            {findings.map((finding: FindingWithLinks, index: number) => {
              const links = finding.evidenceLinks || [];

              return (
                <div
                  key={finding.id}
                  className="bg-white border border-slate-200 rounded-xl print:rounded-lg p-5 print:p-3 shadow-xs print:shadow-none break-inside-avoid"
                >
                  {/* Finding Title & Confidence */}
                  <div className="flex items-start justify-between gap-2 mb-2 print:mb-1.5">
                    <div>
                      <div className="text-xs print:text-[10px] font-mono font-bold text-blue-600 mb-0.5">
                        FINDING #{String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-base print:text-sm font-bold text-slate-900">
                        {finding.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-800 text-xs print:text-[10px] px-2.5 py-1 print:py-0.5 rounded-full font-bold flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 print:w-3 print:h-3 text-green-600" />
                      {finding.confidence}% AI Confidence
                    </div>
                  </div>

                  <p className="text-sm print:text-xs text-slate-700 mb-4 print:mb-2 leading-relaxed print:leading-normal">
                    {finding.description}
                  </p>

                  {/* Supporting Evidence Trace Cards */}
                  <div>
                    <div className="text-xs print:text-[10px] font-mono font-semibold uppercase text-slate-400 mb-2.5 print:mb-1.5">
                      Supporting Visual Evidence ({links.length} Source{links.length > 1 ? 's' : ''})
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3 gap-3 print:gap-2">
                      {links.map((link) => {
                        const media = link.mediaItem;
                        if (!media) return null;

                        return (
                          <div
                            key={link.id}
                            className="border border-slate-200 print:border-slate-300 rounded-xl print:rounded-lg overflow-hidden bg-slate-50/50 flex flex-col"
                          >
                            <div className="relative aspect-[4/3] print:aspect-[16/11] bg-slate-200">
                              <img
                                src={media.thumbnailUrl || media.cloudinaryUrl}
                                alt={media.caption}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] print:text-[8.5px] font-mono px-1.5 py-0.5 rounded">
                                {media.type.toUpperCase()}
                              </div>
                            </div>

                            <div className="p-3 print:p-2 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="text-xs print:text-[10px] font-mono font-bold text-slate-900 truncate mb-1 print:mb-0.5">
                                  {media.filename}
                                </div>
                                <div className="text-xs print:text-[9.5px] print:leading-snug text-slate-600 line-clamp-2 mb-2 print:mb-1">
                                  {media.caption}
                                </div>
                              </div>

                              <div className="pt-2 print:pt-1 border-t border-slate-200/80 text-[11px] print:text-[9px] print:leading-tight text-green-700 flex items-start gap-1 font-medium">
                                <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                                <span>{link.reason}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Evidence Groups Hierarchy */}
        <section className="mb-10 print:mb-5">
          <h2 className="text-lg print:text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6 print:mb-3 flex items-center justify-between break-after-avoid">
            <span>Evidence Clusters</span>
            <span className="text-xs print:text-[10.5px] font-normal text-slate-500">{evidenceGroups.length} groups synthesized</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5">
            {evidenceGroups.map((group: EvidenceGroup) => (
              <div key={group.id} className="border border-slate-200 print:border-slate-300 rounded-xl print:rounded-lg p-4 print:p-2.5 bg-slate-50/40 break-inside-avoid">
                <div className="flex items-start justify-between gap-2 mb-1.5 print:mb-1">
                  <h4 className="font-bold text-slate-900 text-sm print:text-xs">{group.title}</h4>
                  <span className="text-xs print:text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {group.confidence}% Match
                  </span>
                </div>
                <p className="text-xs print:text-[10px] print:leading-snug text-slate-600 mb-2 print:mb-1">{group.description}</p>
                <div className="text-[11px] print:text-[9px] text-slate-500 font-mono">
                  {group.mediaItems?.length || 0} Assets Corroborating
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Chronological Timeline */}
        {timeline && timeline.length > 0 && (
          <section className="mb-8 print:mb-4">
            <h2 className="text-lg print:text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6 print:mb-3 flex items-center justify-between break-after-avoid">
              <span>Chronological Event Flow</span>
              <span className="text-xs print:text-[10.5px] font-normal text-slate-500">EXIF & Capture Metadata</span>
            </h2>

            <div className="space-y-3 print:space-y-0 print:grid print:grid-cols-2 print:gap-2">
              {timeline.map((entry: TimelineEntry) => {
                const time = new Date(entry.timestamp);
                const formattedTime = time.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3.5 print:gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 print:p-1.5 text-sm break-inside-avoid"
                  >
                    <div className="w-22 print:w-18 font-mono font-semibold text-xs print:text-[9.5px] text-slate-700 flex-shrink-0">
                      {formattedTime}
                    </div>
                    <div className="w-10 h-8 print:w-8 print:h-6 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={entry.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-xs print:text-[10px] truncate">{entry.label}</div>
                      <div className="text-[11px] print:text-[9px] text-slate-500 truncate">{entry.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Legal Disclaimer & Footer */}
        <footer className="border-t border-slate-200 pt-5 mt-8 print:pt-2.5 print:mt-3 text-slate-500 text-xs leading-relaxed break-inside-avoid">
          <div className="bg-slate-50 border border-slate-200 rounded-xl print:rounded-lg p-3.5 print:p-2">
            <div className="font-semibold text-slate-700 mb-1 print:mb-0.5 text-xs print:text-[10px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 print:w-3 print:h-3 text-amber-600 flex-shrink-0" />
              Evidentiary Documentation Notice
            </div>
            <p className="text-xs print:text-[9.5px] print:leading-snug">{disclaimer}</p>
          </div>
          <div className="flex items-center justify-between text-[11px] print:text-[8.5px] text-slate-400 mt-3 print:mt-1.5">
            <span>Powered by EviTrace Media Pipeline Engine</span>
            <span>Cloudinary Optimized Delivery</span>
          </div>
        </footer>
      </article>

      {/* Print Stylesheet injection */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 10mm 12mm 12mm 12mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-size: 11pt !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* CRITICAL: Hide only user action elements, never the document header */
          nav, button, .print\\:hidden, .no-print {
            display: none !important;
          }
          .break-inside-avoid, .page-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .break-after-avoid {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
