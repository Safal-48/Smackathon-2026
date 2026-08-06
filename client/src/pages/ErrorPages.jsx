import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Frown, Home, RefreshCw, Bot } from 'lucide-react';

export const NotFoundPage = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8 max-w-lg"
    >
      {/* Animated 404 */}
      <div className="relative">
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400 select-none"
        >
          404
        </motion.div>
        <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 -z-10 rounded-full" />
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
          <Frown className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-100">Page Not Found</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          The farming page you're looking for has moved or doesn't exist. Let's get you back to your fields!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold text-sm transition-all hover:from-emerald-400 hover:to-green-400 shadow-lg shadow-emerald-950/50"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link
            to="/ai-chat"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            Ask AI Assistant
          </Link>
        </div>
      </div>
    </motion.div>
  </div>
);

export const ErrorBoundaryFallback = ({ error, resetError }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center space-y-6 max-w-md">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto"
      >
        <Frown className="w-10 h-10 text-rose-400" />
      </motion.div>

      <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 space-y-3">
        <h2 className="text-xl font-black text-slate-100">Something went wrong</h2>
        <p className="text-slate-400 text-sm">
          {error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={resetError}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  </div>
);
