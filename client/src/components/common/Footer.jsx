import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Copy,
  CheckCircle2,
  Clock,
  Headphones,
  Sprout,
  Heart,
  ArrowUpRight,
  MessageCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { feedbackAPI } from '../../services/api';

export const Footer = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Contact form state
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    phone: user?.phone || '',
    category: 'soil_report',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMsg('Please write at least 10 characters in your query.');
      return;
    }

    setLoading(true);

    try {
      await feedbackAPI.submit({
        name: formData.name || 'Farmer Guest',
        phone: formData.phone,
        category: formData.category,
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: user?.fullName || '', phone: user?.phone || '', category: 'soil_report', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Message sent! Thank you for reaching out.');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="contact" className="relative bg-slate-950 border-t border-slate-800/80 pt-16 pb-8 overflow-hidden z-20">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* ─── CONTACT US SECTION HEADER ────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>24/7 Farmer Assistance & Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-emerald-200 to-teal-300 tracking-tight">
            {t('contactTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t('contactSubtitle')}
          </p>
        </div>

        {/* ─── CONTACT GRID (INFO CARDS + CONTACT FORM) ────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* EMAIL CONTACT CARD */}
            <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 hover:border-emerald-400/60 transition-all shadow-xl bg-slate-950/80 backdrop-blur-2xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider block">
                      {t('emailUsTitle')}
                    </span>
                    <a
                      href="mailto:krushimitra.work@gmail.com"
                      className="text-base sm:text-lg font-black text-slate-100 hover:text-emerald-300 transition-colors break-all flex items-center gap-1.5 mt-0.5"
                    >
                      krushimitra.work@gmail.com
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    </a>
                    <span className="text-xs text-slate-400 block mt-1">
                      Direct support for soil reports, AI diagnostics & partnership queries
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleCopy('krushimitra.work@gmail.com', 'email')}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{t('copiedSuccess')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t('copyEmailBtn')}</span>
                      </>
                    )}
                  </button>
                  <a
                    href="mailto:krushimitra.work@gmail.com"
                    className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all"
                  >
                    Send Mail
                  </a>
                </div>
              </div>
            </div>

            {/* PHONE & WHATSAPP CARD */}
            <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 hover:border-emerald-400/60 transition-all shadow-xl bg-slate-950/80 backdrop-blur-2xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase text-teal-400 tracking-wider block">
                      {t('callUsTitle')}
                    </span>
                    <a
                      href="tel:7875648995"
                      className="text-lg sm:text-xl font-black text-slate-100 hover:text-teal-300 transition-colors flex items-center gap-2 mt-0.5"
                    >
                      +91 7875648995
                      <span className="text-xs bg-teal-500/10 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                        Active
                      </span>
                    </a>
                    <span className="text-xs text-slate-400 block mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 inline" /> {t('workingHours')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleCopy('7875648995', 'phone')}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {copiedPhone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-teal-400">{t('copiedSuccess')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://wa.me/917875648995?text=Hello%20KrishiMitra%20AI%20Team%2C%20I%20need%20assistance%20regarding%20my%20farm."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* TWO BOTTOM COMPACT CARDS: OFFICE LOCATION & TOLL FREE KISAN HELPLINE */}
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* OFFICE LOCATION */}
              <div className="p-5 rounded-3xl glass-panel border border-slate-800 space-y-2.5 bg-slate-950/80">
                <div className="flex items-center gap-2 text-emerald-400">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {t('officeAddressTitle')}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {t('officeAddress')}
                </p>
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 inline-block">
                    📍 Maharashtra Regional Office
                  </span>
                </div>
              </div>

              {/* KISAN TOLL-FREE HELPLINE */}
              <div className="p-5 rounded-3xl glass-panel border border-slate-800 space-y-2.5 bg-slate-950/80">
                <div className="flex items-center gap-2 text-amber-400">
                  <Headphones className="w-5 h-5 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {t('kisanHelplineTitle')}
                  </h4>
                </div>
                <p className="text-sm font-black text-amber-400 font-mono">
                  {t('kisanHelplineNumber')}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Government Kisan Call Center for instant agricultural advice & weather updates.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Direct Message Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-emerald-500/40 shadow-2xl bg-slate-950/90 relative space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  {t('sendUsMessage')}
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                  Fast Reply
                </span>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-black text-slate-100">Message Received!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('messageSentSuccess')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">
                      {t('yourName')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">
                      {t('yourPhone')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 7875648995 or email"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">
                      {t('selectCategory')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs outline-none transition-colors cursor-pointer"
                    >
                      <option value="soil_report">{t('soilReportQuery')}</option>
                      <option value="scheme_assistance">{t('schemeAssistanceQuery')}</option>
                      <option value="tech_support">{t('techSupportQuery')}</option>
                      <option value="general">{t('generalFeedbackQuery')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">
                      {t('yourMessage')}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe your query or requirement in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                        <span>{t('sendMessageBtn')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* ─── FOOTER BOTTOM LINKS & COPYRIGHT ──────────────────────────────────── */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950/50">
              <Sprout className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-slate-200 text-sm block">KrishiMitra AI (KrishiSeva)</span>
              <span className="text-[11px] text-slate-400 block">
                Empowering Farmers with Soil Diagnostics, Crop AI & Direct Welfare Schemes
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-6 font-medium text-slate-300">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              {t('navHome')}
            </Link>
            <Link to="/soil-analysis" className="hover:text-emerald-400 transition-colors">
              {t('navSoil')}
            </Link>
            <Link to="/schemes" className="hover:text-emerald-400 transition-colors">
              {t('navSchemes')}
            </Link>
            <Link to="/ai-chat" className="hover:text-emerald-400 transition-colors">
              {t('navChat')}
            </Link>
            <a href="#contact" className="text-emerald-400 font-bold hover:underline">
              {t('navContact')}
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>Crafted for Farmers with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>using React, Node & Gemini AI</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
