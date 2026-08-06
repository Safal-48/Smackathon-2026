import React from 'react';
import { Sprout, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">KrishiSeva AI</span>
          <span>— Empowering Farmers with Precision Soil Diagnostics & Direct Benefits</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Built for Farmers with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>using React, Node & Gemini AI</span>
        </div>
      </div>
    </footer>
  );
};
