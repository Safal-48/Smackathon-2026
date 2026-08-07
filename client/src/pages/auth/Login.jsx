import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Phone, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('session') === 'expired';

  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('farmer123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(sessionExpired ? 'Your session expired. Please log in again.' : '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone.trim() || !password) {
      setError('Please enter your phone number or email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(phone.trim(), password);
      toast('Welcome back! Logging you into your dashboard.', 'success');
      if (data?.user?.role === 'admin' || phone.trim() === '9999999999') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (p, pass) => {
    setPhone(p);
    setPassword(pass);
    setError('');
    setLoading(true);

    try {
      const data = await login(p, pass);
      toast('Welcome back! Logging you into your dashboard.', 'success');
      if (data?.user?.role === 'admin' || p === '9999999999') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 space-y-6 shadow-2xl shadow-emerald-950/30">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <Sprout className="w-9 h-9 text-slate-950 stroke-[2.5]" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black text-slate-100">{t('login')}</h1>
            <p className="text-xs text-slate-400">Access your KrishiSeva AI Farming Dashboard or Admin Console</p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-phone" className="text-xs font-semibold text-slate-300 block mb-1">
                Phone Number / Email Address
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" aria-hidden="true" />
                <input
                  id="login-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Mobile number or email (e.g. 9876543210)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-emerald-400 hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('login')}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider text-center">⚡ Quick Demo Login Credentials:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('9876543210', 'farmer123')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-all"
              >
                <span className="text-xs font-bold text-slate-100 block">🌾 Farmer Login</span>
                <span className="text-[10px] text-slate-400 font-mono block">9876543210</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('9999999999', 'admin123')}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-left border border-amber-500/30 transition-all"
              >
                <span className="text-xs font-bold text-amber-300 block">👑 Admin Console</span>
                <span className="text-[10px] text-amber-400 font-mono block">9999999999</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 font-bold hover:underline">
              Register Free
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
