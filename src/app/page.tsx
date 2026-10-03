'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Upload,
  Search,
  GitBranch,
  FileText,
  Shield,
  ArrowRight,
  Camera,
  Car,
  Building2,
  HardHat,
  Package,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Play,
  Layers,
  Eye,
  Filter,
  Link2,
  BarChart3,
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">EviTrace</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#problem" className="hover:text-slate-900 transition-colors">Problem</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#workflows" className="hover:text-slate-900 transition-colors">Workflows</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
            >
              See Demo
            </Link>
            <Link
              href="/cases/new"
              className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start a Case
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Media Pipeline
            </motion.div>
            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]"
            >
              Turn messy media into{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                traceable evidence
              </span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Upload photos and videos from an incident, inspection, delivery, or real-world case.
              EviTrace analyzes, organizes, connects, and turns them into a professional evidence package.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cases/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/25"
              >
                Start a Case
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-slate-200 transition-all"
              >
                <Play className="w-5 h-5" />
                Try Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Pipeline Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
                <PipelineStep number="30" label="RAW FILES" icon={<Camera className="w-5 h-5" />} />
                <PipelineArrow />
                <PipelineStep number="" label="AI MEDIA PIPELINE" icon={<Sparkles className="w-5 h-5" />} highlight />
                <PipelineArrow />
                <div className="space-y-3">
                  <PipelineResult number="24" label="USEFUL FILES" />
                  <PipelineResult number="6" label="EVIDENCE GROUPS" />
                  <PipelineResult number="1" label="TRACEABLE REPORT" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              The problem with raw evidence
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-slate-600 max-w-2xl mx-auto">
              People capture dozens of photos and videos to document incidents. But raw media is chaotic.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <Layers className="w-6 h-6" />, title: 'Scattered & Duplicated', desc: 'Files spread across devices with near-identical copies mixed in.' },
              { icon: <Search className="w-6 h-6" />, title: 'Hard to Search', desc: 'No way to quickly find which photo shows a specific issue.' },
              { icon: <Eye className="w-6 h-6" />, title: 'Hard to Interpret', desc: 'Unclear which photos are strongest evidence for each finding.' },
              { icon: <FileText className="w-6 h-6" />, title: 'No Structure', desc: 'No timeline, no grouping, no connection between media and conclusions.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How EviTrace works
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-slate-600 max-w-2xl mx-auto">
              A complete AI media pipeline from raw uploads to professional report.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-5 gap-6"
          >
            {[
              { icon: <Upload className="w-6 h-6" />, step: '01', title: 'Upload', desc: 'Drop your photos and videos. We handle ingestion through Cloudinary.' },
              { icon: <Sparkles className="w-6 h-6" />, step: '02', title: 'Analyze', desc: 'AI examines each file for objects, damage, quality, and relevance.' },
              { icon: <Filter className="w-6 h-6" />, step: '03', title: 'Organize', desc: 'Duplicates are flagged. Quality is scored. Evidence is grouped.' },
              { icon: <Link2 className="w-6 h-6" />, step: '04', title: 'Trace', desc: 'Every finding is linked back to its supporting original media.' },
              { icon: <FileText className="w-6 h-6" />, step: '05', title: 'Report', desc: 'Generate a professional, traceable evidence report.' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="text-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-blue-600 mb-1">STEP {item.step}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                {i < 4 && (
                  <div className="hidden md:block mt-4">
                    <ChevronRight className="w-5 h-5 text-slate-300 mx-auto rotate-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Before/After Transformation */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              From chaos to clarity
            </motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-red-200 shadow-sm"
            >
              <div className="text-red-600 font-bold text-sm mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> BEFORE
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><Camera className="w-4 h-4 text-slate-400" /> IMG_3421.jpg</div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><Camera className="w-4 h-4 text-slate-400" /> IMG_3422.jpg</div>
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-red-500"><Camera className="w-4 h-4" /> IMG_3422_copy.jpg <span className="text-xs ml-auto">duplicate</span></div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><Camera className="w-4 h-4 text-slate-400" /> IMG_3423.jpg</div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg text-yellow-600"><Camera className="w-4 h-4" /> blurry_shot.jpg <span className="text-xs ml-auto">low quality</span></div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><Camera className="w-4 h-4 text-slate-400" /> VID_0891.mp4</div>
                <div className="text-center text-slate-400 py-2">... 24 more files</div>
              </div>
              <div className="mt-4 text-sm text-red-600 font-medium">30 unorganized files. No structure.</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-green-200 shadow-sm"
            >
              <div className="text-green-600 font-bold text-sm mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> AFTER — EviTrace
              </div>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-semibold text-blue-900">Front Bumper Damage</div>
                  <div className="text-blue-600 text-xs mt-1">4 assets · 94% confidence</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-semibold text-blue-900">Left Door Damage</div>
                  <div className="text-blue-600 text-xs mt-1">3 assets · 91% confidence</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-semibold text-blue-900">Headlight Assembly</div>
                  <div className="text-blue-600 text-xs mt-1">2 assets · 87% confidence</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-700">+ 3 more groups</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 font-medium">
                Organized. Grouped. Traceable. Report-ready.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Evidence Trace Feature */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Every finding is traceable
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                The signature EviTrace feature: click any finding and see exactly which original media supports it and why.
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium px-4 py-2 rounded-lg">
                    <BarChart3 className="w-4 h-4" />
                    FINDING
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-3">Possible front bumper deformation</h3>
                  <p className="text-sm text-slate-500 mt-1">94% AI confidence</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-slate-300" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-400 mb-3">SUPPORTED BY</div>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {['IMG_3422.jpg', 'IMG_3423.jpg', 'VID_0891.mp4'].map((f) => (
                      <div key={f} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-mono text-slate-700">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-slate-300" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-400 mb-3">WHY SELECTED</div>
                  <div className="inline-flex flex-col gap-2 text-sm text-left">
                    {[
                      'Highly relevant to case type',
                      'Clear visual evidence of damage',
                      'Multiple viewpoints corroborate',
                      'Not a duplicate',
                      'High quality media',
                    ].map((r) => (
                      <div key={r} className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Supported Workflows */}
      <section id="workflows" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for real-world workflows
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-slate-600">
              EviTrace works for any scenario where media documents a real-world event.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {[
              { icon: <Car className="w-8 h-8" />, title: 'Vehicle Incidents' },
              { icon: <Building2 className="w-8 h-8" />, title: 'Property Inspections' },
              { icon: <HardHat className="w-8 h-8" />, title: 'Construction' },
              { icon: <Package className="w-8 h-8" />, title: 'Delivery Damage' },
              { icon: <AlertTriangle className="w-8 h-8" />, title: 'General Incidents' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm text-center hover:border-blue-300 hover:shadow-md transition-all cursor-default"
              >
                <div className="text-blue-600 flex justify-center mb-3">{item.icon}</div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Ready to organize your evidence?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
              Upload your media. Let AI do the heavy lifting. Get a professional, traceable evidence package.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cases/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/25"
              >
                Start a Case
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 text-slate-600 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-slate-100 transition-all"
              >
                <Play className="w-5 h-5" />
                Try Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-slate-900">EviTrace</span>
          </div>
          <p className="text-sm text-slate-500">
            AI-powered media pipeline for traceable evidence. Built for the AI Media Pipeline Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}

function PipelineStep({
  number,
  label,
  icon,
  highlight,
}: {
  number: string;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
      <div className="flex justify-center mb-2">{icon}</div>
      {number && <div className="text-2xl font-bold">{number}</div>}
      <div className={`text-xs font-bold tracking-wider ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>
        {label}
      </div>
    </div>
  );
}

function PipelineArrow() {
  return (
    <div className="hidden md:flex justify-center">
      <ArrowRight className="w-6 h-6 text-slate-300" />
    </div>
  );
}

function PipelineResult({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <span className="text-lg font-bold text-blue-600">{number}</span>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
    </div>
  );
}
