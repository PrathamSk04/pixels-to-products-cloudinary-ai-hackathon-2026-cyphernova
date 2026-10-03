'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Camera,
  Layers,
  Copy,
  AlertTriangle,
  GitBranch,
  Clock,
  FileText,
  Eye,
} from 'lucide-react';
import { ProcessingStats } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PIPELINE_STEPS: Step[] = [
  { id: 'upload', label: 'Cloudinary Ingestion', description: 'Media ingested and optimized with auto format & quality', icon: Camera },
  { id: 'analyze', label: 'AI Vision Analysis', description: 'Multi-modal analysis for objects, damage, and context', icon: Sparkles },
  { id: 'quality', label: 'Quality Assessment', description: 'Scoring resolution, clarity, blur, and relevance', icon: Eye },
  { id: 'deduplicate', label: 'Deduplication', description: 'Detecting exact hashes and near-duplicate visual content', icon: Copy },
  { id: 'group', label: 'Evidence Grouping', description: 'Clustering media into verified thematic evidence groups', icon: GitBranch },
  { id: 'timeline', label: 'Chronology Building', description: 'Sequencing timestamps and media capture chronology', icon: Clock },
  { id: 'report', label: 'Traceable Report Assembly', description: 'Connecting findings to original Cloudinary assets', icon: FileText },
];

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<ProcessingStats>({
    totalFiles: 0,
    uniqueAssets: 0,
    duplicatesDetected: 0,
    lowQualityAssets: 0,
    evidenceGroups: 0,
    visualFindings: 0,
  });

  useEffect(() => {
    let isCancelled = false;

    async function runPipeline() {
      try {
        // Trigger backend processing
        const res = await fetch(`/api/cases/${caseId}/process`, {
          method: 'POST',
        });

        if (!res.ok) {
          throw new Error('Pipeline processing failed');
        }

        const data = await res.json();
        const serverStats: ProcessingStats = data.stats;

        // Progressively advance through the visual pipeline steps
        const stepDelay = 600; // ms per step for visual demonstration

        for (let i = 0; i < PIPELINE_STEPS.length; i++) {
          if (isCancelled) return;

          setCurrentStepIndex(i);

          // Update stats dynamically as pipeline reaches relevant stages
          if (i >= 0) {
            setStats((prev) => ({ ...prev, totalFiles: serverStats.totalFiles }));
          }
          if (i >= 2) {
            setStats((prev) => ({
              ...prev,
              uniqueAssets: serverStats.uniqueAssets,
              lowQualityAssets: serverStats.lowQualityAssets,
            }));
          }
          if (i >= 3) {
            setStats((prev) => ({
              ...prev,
              duplicatesDetected: serverStats.duplicatesDetected,
            }));
          }
          if (i >= 4) {
            setStats((prev) => ({
              ...prev,
              evidenceGroups: serverStats.evidenceGroups,
            }));
          }
          if (i >= 5) {
            setStats((prev) => ({
              ...prev,
              visualFindings: serverStats.visualFindings,
            }));
          }

          await new Promise((resolve) => setTimeout(resolve, stepDelay));
          setCompletedSteps((prev) => [...prev, PIPELINE_STEPS[i].id]);
        }

        if (!isCancelled) {
          setIsDone(true);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Processing error';
        if (!isCancelled) {
          setError(message);
        }
      }
    }

    runPipeline();

    return () => {
      isCancelled = true;
    };
  }, [caseId]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">EviTrace</span>
          </div>
          <span className="text-xs font-mono uppercase bg-blue-950 text-blue-400 border border-blue-800 px-3 py-1 rounded-full">
            Pipeline Engine Active
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full flex flex-col justify-center">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-400 text-xs px-3.5 py-1.5 rounded-full font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Transforming Raw Media into Traceable Evidence
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            {isDone ? 'Evidence Ready' : 'Building your evidence'}
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base">
            {isDone
              ? 'Media analyzed, duplicates classified, and evidence groups linked.'
              : 'EviTrace is running AI vision analysis, duplicate checks, and evidence grouping.'}
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {[
            { label: 'Files Received', value: stats.totalFiles, icon: Camera, color: 'text-blue-400' },
            { label: 'Unique Assets', value: stats.uniqueAssets, icon: Layers, color: 'text-emerald-400' },
            { label: 'Duplicates Detected', value: stats.duplicatesDetected, icon: Copy, color: 'text-amber-400' },
            { label: 'Low-Quality Flagged', value: stats.lowQualityAssets, icon: AlertTriangle, color: 'text-rose-400' },
            { label: 'Evidence Groups', value: stats.evidenceGroups, icon: GitBranch, color: 'text-purple-400' },
            { label: 'Visual Findings', value: stats.visualFindings, icon: Sparkles, color: 'text-indigo-400' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4 text-center"
            >
              <div className="flex justify-center mb-1.5">
                <item.icon className={cn('w-4 h-4', item.color)} />
              </div>
              <div className="text-2xl font-bold text-white">
                {item.value}
              </div>
              <div className="text-[11px] text-slate-400 font-medium tracking-tight">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Steps View */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl mb-8">
          <div className="space-y-4">
            {PIPELINE_STEPS.map((step, idx) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStepIndex === idx && !isDone;
              const isPending = idx > currentStepIndex && !isCompleted;

              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center justify-between p-3.5 rounded-xl border transition-all',
                    isCurrent
                      ? 'bg-blue-950/40 border-blue-600 shadow-md shadow-blue-900/20'
                      : isCompleted
                      ? 'bg-slate-800/40 border-slate-700/60'
                      : 'bg-slate-900/30 border-slate-800/40 opacity-50'
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-500'
                      )}
                    >
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        {step.label}
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2 py-0.2 rounded-full">
                            Processing
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-sm md:max-w-xl">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center pl-3">
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {isCurrent && (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    )}
                    {isPending && (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          {error ? (
            <div className="inline-flex flex-col items-center gap-2">
              <span className="text-sm text-rose-400">{error}</span>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-lg"
              >
                Retry Processing
              </button>
            </div>
          ) : isDone ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href={`/cases/${caseId}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
              >
                View Evidence Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/cases/${caseId}/report`}
                className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700"
              >
                <FileText className="w-4 h-4" />
                Jump to Report
              </Link>
            </motion.div>
          ) : (
            <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Executing pipeline algorithms...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
