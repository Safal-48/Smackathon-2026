import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Sparkles } from 'lucide-react';

export const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete && onComplete(), 400);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100"
    >
      <div className="relative flex flex-col items-center space-y-6 max-w-sm px-6 text-center">
        {/* Animated Glowing Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-pulse">
            <Sprout className="w-10 h-10 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="absolute -top-2 -right-2 text-amber-400 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-gradient-green">KrishiSeva AI</h2>
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Initializing 3D World & AI Engine</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full shadow-[0_0_12px_#22c55e]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="font-mono text-sm font-bold text-emerald-400">{progress}%</span>
      </div>
    </motion.div>
  );
};
