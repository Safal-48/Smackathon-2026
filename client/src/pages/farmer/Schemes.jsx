import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  CheckCircle,
  FileText,
  Clock,
  Send,
  X,
  Globe,
  Building,
  Sprout,
  Users,
  Maximize2,
  Calendar,
} from 'lucide-react';
import API from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Card3D } from '../../components/common/Card3D';

export const Schemes = () => {
  const { lang, setLang, t } = useLanguage();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('krishi_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'bookmarks'

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('All States');
  const [district, setDistrict] = useState('All Districts');
  const [crop, setCrop] = useState('All Crops');
  const [landAcres, setLandAcres] = useState('');
  const [farmerCategory, setFarmerCategory] = useState('All Categories');

  // Modal State
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [farmerNotes, setFarmerNotes] = useState('');

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await API.get('/schemes', {
        params: {
          search,
          category,
          state,
          district,
          crop,
          landAcres,
          farmerCategory,
        },
      });
      if (res.data.success) {
        setSchemes(res.data.schemes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [search, category, state, district, crop, landAcres, farmerCategory]);

  const toggleBookmark = (id) => {
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((bId) => bId !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    localStorage.setItem('krishi_bookmarks', JSON.stringify(updated));
  };

  const handleApply = async () => {
    if (!selectedScheme) return;
    try {
      const res = await API.post('/schemes/apply', {
        schemeId: selectedScheme._id,
        farmerNotes,
      });
      if (res.data.success) {
        setApplicationSuccess(true);
        setTimeout(() => {
          setApplicationSuccess(false);
          setSelectedScheme(null);
          setFarmerNotes('');
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayedSchemes =
    activeTab === 'bookmarks'
      ? schemes.filter((s) => bookmarks.includes(s._id))
      : schemes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner with Multilingual Switcher */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Verified Government Subsidies, Grants & Credit Assistance
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 flex items-center gap-3">
            {t('schemesHeader')}
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">{t('schemesDesc')}</p>
        </div>

        {/* Language Selection Bar (EN, HI, MR) */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
          <Globe className="w-4 h-4 text-cyan-400 ml-2" />
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'en' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'hi' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('mr')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'mr' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="space-y-4">
        
        {/* Navigation Tabs (All vs Saved Bookmarks) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Government Schemes ({schemes.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Bookmarked Schemes ({bookmarks.length})
            </button>
          </div>

          <span className="text-xs text-slate-400 hidden sm:block font-mono">
            Updated: Aug 2026 Official Gazette
          </span>
        </div>

        {/* Multi-Criteria Smart Filters Grid */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="AI Smart Search (e.g., PM-KISAN, ₹6,000, Drip Subsidy, Solar Pump, Crop Loss)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            
            {/* 1. State Filter */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="All States">All India / States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            {/* 2. District Filter */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="All Districts">All Districts</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Wardha">Wardha</option>
                <option value="Amravati">Amravati</option>
                <option value="Yavatmal">Yavatmal</option>
                <option value="Akola">Akola</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            {/* 3. Crop Selection */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="All Crops">All Crops</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Paddy">Paddy (धान)</option>
                <option value="Sugarcane">Sugarcane (गन्ना)</option>
              </select>
            </div>

            {/* 4. Land Size (Acres) */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Land Size (Acres)</label>
              <input
                type="number"
                placeholder="e.g. 2.5"
                value={landAcres}
                onChange={(e) => setLandAcres(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              />
            </div>

            {/* 5. Farmer Category */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Farmer Category</label>
              <select
                value={farmerCategory}
                onChange={(e) => setFarmerCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="All Categories">All Categories</option>
                <option value="Small & Marginal Farmers">Small & Marginal</option>
                <option value="Women Farmers">Women Farmers</option>
                <option value="SC/ST Farmers">SC/ST Farmers</option>
              </select>
            </div>

            {/* 6. Subsidy Category */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Scheme Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="">All Types</option>
                <option value="Financial Assistance">Financial</option>
                <option value="Insurance & Credit">Insurance</option>
                <option value="Solar & Irrigation">Irrigation/Solar</option>
              </select>
            </div>

          </div>
        </div>

      </div>

      {/* Scheme Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading Scheme Catalog...</div>
      ) : displayedSchemes.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm glass-panel rounded-3xl border border-slate-800">
          No schemes match your selected criteria. Try resetting state, crop, or land size filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {displayedSchemes.map((scheme) => {
            const isBookmarked = bookmarks.includes(scheme._id);
            const schemeTitle =
              lang === 'hi' && scheme.titleHindi
                ? scheme.titleHindi
                : lang === 'mr' && scheme.titleMarathi
                ? scheme.titleMarathi
                : scheme.title;

            const schemeDesc =
              lang === 'hi' && scheme.shortDescriptionHindi
                ? scheme.shortDescriptionHindi
                : lang === 'mr' && scheme.shortDescriptionMarathi
                ? scheme.shortDescriptionMarathi
                : scheme.shortDescription;

            return (
              <Card3D key={scheme._id} depth={10}>
                <div className="glass-panel glass-panel-hover p-6 sm:p-8 rounded-3xl border border-slate-800/80 flex flex-col justify-between space-y-5 h-full relative">
                  
                  <div className="space-y-4">
                    
                    {/* Card Top Pill Toolbar */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                          {scheme.category}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                          {scheme.code}
                        </span>
                      </div>

                      {/* Bookmark Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleBookmark(scheme._id)}
                        className={`p-2 rounded-xl border transition-all ${
                          isBookmarked
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>

                    <h3 className="text-2xl font-black text-slate-100 leading-snug">{schemeTitle}</h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{schemeDesc}</p>

                    {/* Eligibility Badges */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Max Land: {scheme.eligibilityCriteria?.maxLandAcres || 'Unlimited'} Acres</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Deadline: {scheme.applicationDeadline || 'Ongoing'}</span>
                      </div>
                    </div>

                    {/* Key Benefits List */}
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Direct Scheme Benefits:</span>
                      {scheme.benefits?.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 flex items-center justify-between border-t border-slate-800/80">
                    {scheme.applicationUrl && (
                      <a
                        href={scheme.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-semibold transition-colors"
                      >
                        Official Govt Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => setSelectedScheme(scheme)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-950/50"
                    >
                      View Eligibility & Apply
                    </button>
                  </div>

                </div>
              </Card3D>
            );
          })}
        </div>
      )}

      {/* Scheme Detail & Application Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-cyan-500/30 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <button
              onClick={() => setSelectedScheme(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase">
                  {selectedScheme.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">Official Code: {selectedScheme.code}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100">{selectedScheme.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{selectedScheme.fullDescription}</p>
            </div>

            {/* Target States & Target Category Badges */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">Target States:</span>
                <span className="text-slate-200 font-bold">{selectedScheme.eligibilityCriteria?.targetStates?.join(', ') || 'All India'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">Application Deadline:</span>
                <span className="text-amber-400 font-bold">{selectedScheme.applicationDeadline || 'Ongoing'}</span>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Required Application Documents Checklist
              </h4>
              <ul className="grid sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                {selectedScheme.requiredDocuments?.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 font-medium">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Farmer Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Farmer Land Survey No. / Remarks (Optional)</label>
              <textarea
                rows={2}
                value={farmerNotes}
                onChange={(e) => setFarmerNotes(e.target.value)}
                placeholder="Enter 7/12 survey number or special requests..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            {applicationSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Scheme Application Record Submitted Successfully!
              </div>
            ) : (
              <div className="flex items-center justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedScheme(null)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50"
                >
                  <Send className="w-4 h-4" />
                  Submit Guided Application
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
