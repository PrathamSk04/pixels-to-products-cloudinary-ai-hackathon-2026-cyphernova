'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Loader2, AlertCircle } from 'lucide-react';

export default function DemoPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initDemo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
      });
      
      if (!res.ok) {
        throw new Error('Failed to initialize demo case');
      }
      
      router.push('/cases/demo-case-1');
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading the demo.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initDemo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-10 flex flex-col items-center text-center"
      >
        <motion.div
          animate={{ scale: isLoading ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: isLoading ? Infinity : 0, duration: 2, ease: "easeInOut" }}
          className="mb-6"
        >
          <Shield className={`w-20 h-20 ${error ? 'text-red-500' : 'text-blue-600'}`} />
        </motion.div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">EviTrace Demo</h1>
        
        {isLoading && (
          <div className="flex flex-col items-center mt-6">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-600">Loading demo case...</p>
            <p className="text-sm text-gray-400 mt-2">Setting up sample evidence and data</p>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mt-4 w-full"
          >
            <div className="flex items-center text-red-600 mb-4 p-4 bg-red-50 rounded-lg w-full justify-center border border-red-100">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm">{error}</span>
            </div>
            
            <button
              onClick={initDemo}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 outline-none"
            >
              Retry
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
