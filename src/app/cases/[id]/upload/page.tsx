'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Video,
  X,
  Sparkles,
  Cloud,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Case, MediaItem } from '@/lib/types';
import { formatFileSize, cn } from '@/lib/utils';

interface UploadingFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  mediaItem?: MediaItem;
}

export default function CaseUploadPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadQueue, setUploadQueue] = useState<UploadingFile[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCaseAndMedia() {
      try {
        const [caseRes, mediaRes] = await Promise.all([
          fetch(`/api/cases/${caseId}`),
          fetch(`/api/cases/${caseId}/media`),
        ]);

        if (caseRes.ok) setCaseData(await caseRes.json());
        if (mediaRes.ok) setExistingMedia(await mediaRes.json());
      } catch (err) {
        console.error('Failed to load case:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCaseAndMedia();
  }, [caseId]);

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadingFile[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'queued',
    }));

    setUploadQueue((prev) => [...prev, ...newFiles]);

    // Start uploading each file sequentially or in small batches
    newFiles.forEach((item) => {
      uploadFile(item);
    });
  };

  const uploadFile = async (item: UploadingFile) => {
    setUploadQueue((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading', progress: 20 } : f))
    );

    const formData = new FormData();
    formData.append('file', item.file);
    formData.append('caseId', caseId);

    try {
      // Simulate progressive upload animation while awaiting response
      const progressTimer = setInterval(() => {
        setUploadQueue((prev) =>
          prev.map((f) => {
            if (f.id === item.id && f.status === 'uploading' && f.progress < 85) {
              return { ...f, progress: f.progress + 15 };
            }
            return f;
          })
        );
      }, 250);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressTimer);

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const mediaItem: MediaItem = await res.json();

      setUploadQueue((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: 'completed', progress: 100, mediaItem }
            : f
        )
      );

      setExistingMedia((prev) => [...prev, mediaItem]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setUploadQueue((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: 'error', errorMessage: message }
            : f
        )
      );
    }
  };

  const removeQueueItem = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const totalUploaded = existingMedia.length;
  const isUploading = uploadQueue.some((item) => item.status === 'uploading' || item.status === 'queued');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">EviTrace</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <Link href={`/cases/${caseId}`} className="text-sm text-slate-600 hover:text-slate-900 truncate max-w-[200px]">
              {caseData?.name || 'Case'}
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-900">Upload Media</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/cases/${caseId}`}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Skip to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Title Area */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Add your evidence
          </h1>
          <p className="text-slate-600 mt-2">
            Drop photos and videos here. EviTrace will handle the organization, duplicate detection, and evidence grouping.
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelection(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer bg-white',
            isDragging
              ? 'border-blue-600 bg-blue-50/50 scale-[1.005]'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
            className="hidden"
            onChange={(e) => handleFileSelection(e.target.files)}
          />

          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Drag & drop files here, or <span className="text-blue-600 underline">browse</span>
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            Supports JPG, JPEG, PNG, WEBP, MP4, MOV. Multiple uploads supported.
          </p>

          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-medium">
            <Cloud className="w-3.5 h-3.5 text-blue-600" />
            Direct Cloudinary Ingestion & Transformation Active
          </div>
        </div>

        {/* Upload Queue Section */}
        {uploadQueue.length > 0 && (
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">
                Upload Queue ({uploadQueue.filter((i) => i.status === 'completed').length}/{uploadQueue.length} done)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <AnimatePresence>
                {uploadQueue.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                        {item.file.type.startsWith('video') ? (
                          <Video className="w-6 h-6 text-slate-400" />
                        ) : (
                          <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate max-w-xs md:max-w-md">
                          {item.file.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{formatFileSize(item.file.size)}</span>
                          <span>•</span>
                          <span className="uppercase">{item.file.type.split('/')[1] || 'FILE'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.status === 'uploading' && (
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-blue-600 font-medium">{item.progress}%</span>
                        </div>
                      )}

                      {item.status === 'completed' && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Uploaded
                        </span>
                      )}

                      {item.status === 'error' && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Failed
                        </span>
                      )}

                      <button
                        onClick={() => removeQueueItem(item.id)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Existing / Uploaded Media Summary */}
        {totalUploaded > 0 && (
          <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to Process ({totalUploaded} asset{totalUploaded > 1 ? 's' : ''})
                </h3>
                <p className="text-sm text-slate-500">
                  All media items are safely stored in Cloudinary and ready for AI analysis.
                </p>
              </div>

              <Link
                href={`/cases/${caseId}/processing`}
                className={cn(
                  'inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-600/25',
                  isUploading && 'opacity-60 pointer-events-none'
                )}
              >
                <Sparkles className="w-4 h-4" />
                Process Media Pipeline
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Thumbnails preview */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {existingMedia.map((m) => (
                <div key={m.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                  <img src={m.thumbnailUrl || m.cloudinaryUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
                    <span className="text-[10px] text-white font-mono truncate">{m.filename}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
