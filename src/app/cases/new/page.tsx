'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, ArrowRight, Car, Building2, HardHat, Package, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CASE_TYPE_LABELS } from '@/lib/types';

const CASE_TYPES = [
  { id: 'vehicle_incident', icon: Car, label: 'Vehicle Incident' },
  { id: 'property_inspection', icon: Building2, label: 'Property Inspection' },
  { id: 'construction_inspection', icon: HardHat, label: 'Construction Inspection' },
  { id: 'delivery_damage', icon: Package, label: 'Delivery Damage' },
  { id: 'general_incident', icon: AlertTriangle, label: 'General Incident' },
];

export default function NewCasePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('vehicle_incident');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Case name is required.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type, description }),
      });

      if (!res.ok) {
        throw new Error('Failed to create case');
      }

      const data = await res.json();
      router.push(`/cases/${data.id || data.caseId}/upload`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the case.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
          <Shield className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight text-gray-900">EviTrace</span>
        </Link>
        <Link href="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create New Case</h1>
            <p className="text-gray-500 mt-1">Set up your evidence case to start analyzing media.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Case Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Vehicle Incident — October 2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-900"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Case Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {CASE_TYPES.map((caseType) => {
                  const Icon = caseType.icon;
                  const isSelected = type === caseType.id;
                  
                  return (
                    <button
                      key={caseType.id}
                      type="button"
                      onClick={() => setType(caseType.id)}
                      disabled={isSubmitting}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="text-xs font-medium text-center leading-tight">
                        {caseType.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any relevant details about this case..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-900 resize-y"
                disabled={isSubmitting}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Case
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
