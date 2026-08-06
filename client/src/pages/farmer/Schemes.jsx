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
  Volume2,
  VolumeX,
  ListOrdered,
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
  const [modalTab, setModalTab] = useState('howToApply'); // 'howToApply' | 'applyForm'
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [farmerNotes, setFarmerNotes] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSchemeId, setSpeakingSchemeId] = useState(null);
  const [speakingText, setSpeakingText] = useState('');

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
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          setIsSpeaking(false);
          setSpeakingSchemeId(null);
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedScheme(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingSchemeId(null);
  };

  const getSchemeAudioExplainer = (scheme) => {
    if (lang === 'hi') {
      return scheme.audioExplainerHindi || `${scheme.titleHindi || scheme.title} में आपको ${scheme.benefits?.[0] || 'सरकारी वित्तीय सहायता'} का लाभ मिलता है। सभी योग्य किसान इसके लिए आवेदन कर सकते हैं।`;
    }
    if (lang === 'mr') {
      return scheme.audioExplainerMarathi || `${scheme.titleMarathi || scheme.title} मध्ये तुम्हाला ${scheme.benefits?.[0] || 'सरकारी अर्थसहाय्य'} चा लाभ मिळतो. सर्व पात्र शेतकरी अर्ज करू शकतात.`;
    }
    return scheme.audioExplainer || `Under ${scheme.title}, you receive ${scheme.benefits?.[0] || 'financial support and subsidies'}. Check eligibility details to apply.`;
  };

  const toggleSchemeAudio = (scheme) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in your browser.');
      return;
    }

    if (speakingSchemeId === scheme._id) {
      window.speechSynthesis.cancel();
      setSpeakingSchemeId(null);
      setIsSpeaking(false);
      setSpeakingText('');
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = getSchemeAudioExplainer(scheme);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => {
      setSpeakingSchemeId(null);
      setIsSpeaking(false);
      setSpeakingText('');
    };

    utterance.onerror = () => {
      setSpeakingSchemeId(null);
      setIsSpeaking(false);
      setSpeakingText('');
    };

    window.speechSynthesis.speak(utterance);
    setSpeakingSchemeId(scheme._id);
    setIsSpeaking(true);
    setSpeakingText(textToSpeak);
  };

  const toggleReadAloud = (schemeTitle, steps, docs) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingSchemeId(null);
      setSpeakingText('');
      return;
    }

    const currentExplainer = selectedScheme ? getSchemeAudioExplainer(selectedScheme) : `${t('howToApply')} - ${schemeTitle}. ${t('stepsTitle')}: ${steps.join('. ')}.`;
    const textToRead = `${currentExplainer} ${t('stepsTitle')}: ${steps.join('. ')}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingSchemeId(null);
      setSpeakingText('');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSchemeId(null);
      setSpeakingText('');
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    if (selectedScheme) setSpeakingSchemeId(selectedScheme._id);
    setSpeakingText(textToRead);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const displayedSchemes =
    activeTab === 'bookmarks'
      ? schemes.filter((s) => bookmarks.includes(s._id))
      : schemes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner with Multilingual Switcher */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl gpu-layer">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            {t('schemesTagline')}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 flex items-center gap-3">
            {t('schemesHeader')}
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">{t('schemesDesc')}</p>
        </div>

        {/* Language Selection Bar (EN, HI, MR) */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
          <Globe className="w-4 h-4 text-emerald-400 ml-2" />
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'en' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'hi' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('mr')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'mr' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
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
              {t('allSchemesTab')} ({schemes.length})
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
              {t('bookmarkedTab')} ({bookmarks.length})
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
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            
            {/* 1. State Filter */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">{t('stateLabel')}</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="All States">{t('allStatesOption')}</option>
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
              <label className="text-slate-400 font-semibold block mb-1">{t('districtLabel')}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="All Districts">{t('allDistrictsOption')}</option>
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
              <label className="text-slate-400 font-semibold block mb-1">{t('cropLabel')}</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="All Crops">{t('allCropsOption')}</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Paddy">Paddy (धान)</option>
                <option value="Sugarcane">Sugarcane (गन्ना)</option>
              </select>
            </div>

            {/* 4. Land Size (Acres) */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">{t('landSizeLabel')}</label>
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
              <label className="text-slate-400 font-semibold block mb-1">{t('farmerCategoryLabel')}</label>
              <select
                value={farmerCategory}
                onChange={(e) => setFarmerCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="All Categories">{t('allCategoriesOption')}</option>
                <option value="Small & Marginal Farmers">Small & Marginal</option>
                <option value="Women Farmers">Women Farmers</option>
                <option value="SC/ST Farmers">SC/ST Farmers</option>
              </select>
            </div>

            {/* 6. Subsidy Category */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">{t('schemeTypeLabel')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-cyan-500"
              >
                <option value="">{t('allTypesOption')}</option>
                <option value="Financial Assistance">{t('financialAssistance')}</option>
                <option value="Insurance & Credit">{t('insuranceCredit')}</option>
                <option value="Solar & Irrigation">{t('solarIrrigation')}</option>
                <option value="Machinery & Infrastructure">{t('machineryInfra')}</option>
                <option value="Organic & Soil Health">{t('organicSoilHealth')}</option>
                <option value="Allied & Livestock">{t('alliedLivestock')}</option>
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
                        <span>{t('maxLand')} {scheme.eligibilityCriteria?.maxLandAcres || 'Unlimited'} Acres</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{t('deadline')} {scheme.applicationDeadline || 'Ongoing'}</span>
                      </div>
                    </div>

                    {/* Key Benefits List */}
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">{t('directBenefits')}</span>
                      {scheme.benefits?.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* Spoken AI Audio Transcript Banner */}
                    {speakingSchemeId === scheme._id && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 shadow-lg shadow-amber-950/40"
                      >
                        <Volume2 className="w-4 h-4 shrink-0 text-amber-400 mt-0.5 animate-pulse" />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[10px] text-amber-400 uppercase tracking-wider">
                              AI Audio Explainer Speaking ({lang.toUpperCase()})
                            </span>
                            <div className="flex items-center gap-0.5 h-3">
                              <span className="w-0.5 h-2.5 bg-amber-400 animate-pulse" />
                              <span className="w-0.5 h-3.5 bg-amber-300 animate-pulse delay-75" />
                              <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-150" />
                            </div>
                          </div>
                          <p className="italic text-slate-200 text-xs font-medium leading-relaxed">
                            "{speakingText}"
                          </p>
                        </div>
                      </motion.div>
                    )}

                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => toggleSchemeAudio(scheme)}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm ${
                        speakingSchemeId === scheme._id
                          ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 animate-pulse'
                          : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 hover:text-emerald-300'
                      }`}
                    >
                      {speakingSchemeId === scheme._id ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span>🔊 AI Audio Explainer</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedScheme(scheme);
                          setModalTab('howToApply');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-900/90 flex items-center gap-2 transition-all shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-emerald-400" />
                        {t('viewDocsBtn')}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedScheme(scheme);
                          setModalTab('howToApply');
                        }}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-950/50"
                      >
                        View Eligibility & Apply
                      </button>
                    </div>
                  </div>

                </div>
              </Card3D>
            );
          })}
        </div>
      )}

      {/* Scheme Detail & Application Modal */}
      {selectedScheme && (() => {
        const schemeTitle =
          lang === 'hi' && selectedScheme.titleHindi
            ? selectedScheme.titleHindi
            : lang === 'mr' && selectedScheme.titleMarathi
            ? selectedScheme.titleMarathi
            : selectedScheme.title;

        const currentSteps =
          lang === 'hi' && selectedScheme.applicationStepsHindi?.length
            ? selectedScheme.applicationStepsHindi
            : lang === 'mr' && selectedScheme.applicationStepsMarathi?.length
            ? selectedScheme.applicationStepsMarathi
            : selectedScheme.applicationSteps?.length
            ? selectedScheme.applicationSteps
            : [
                'Collect Aadhaar card, bank passbook, and land ownership records.',
                'Visit nearest CSC or open official portal.',
                'Click "New Farmer Registration" and fill details.',
                'Submit and note down registration number.',
                'Track status on the portal.'
              ];

        const currentDocs =
          lang === 'hi' && selectedScheme.requiredDocumentsHindi?.length
            ? selectedScheme.requiredDocumentsHindi
            : lang === 'mr' && selectedScheme.requiredDocumentsMarathi?.length
            ? selectedScheme.requiredDocumentsMarathi
            : selectedScheme.requiredDocuments?.length
            ? selectedScheme.requiredDocuments
            : ['Aadhaar card', 'Bank passbook', 'Land record (Khatauni/Patta)'];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="glass-panel w-full max-w-2xl rounded-3xl border border-emerald-500/30 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Navigation Tabs */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
                <button
                  onClick={() => setModalTab('howToApply')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    modalTab === 'howToApply'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {t('howToApply')} & {t('docsTitle')}
                </button>
                <button
                  onClick={() => setModalTab('applyForm')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    modalTab === 'applyForm'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Submit Guided Application
                </button>
              </div>

              {/* HOW TO APPLY & DOCUMENTS VIEW (Matching screenshot design) */}
              {modalTab === 'howToApply' && (
                <div className="space-y-6">
                  
                  {/* Card Header matching exact user format */}
                  <div className="bg-amber-100/10 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                          {t('howToApply')}
                        </h2>
                        <h3 className="text-sm sm:text-base font-bold text-slate-200 mt-1">
                          {schemeTitle}
                        </h3>
                      </div>

                      {/* Read Aloud Voice Button */}
                      <button
                        type="button"
                        onClick={() => toggleReadAloud(schemeTitle, currentSteps, currentDocs)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all shadow-md ${
                          isSpeaking
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span>{isSpeaking ? t('stopReading') : `🔊 ${t('readAloud')}`}</span>
                      </button>
                    </div>

                    <div className="h-px bg-emerald-500/20 w-full" />

                    {/* STEPS Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                        <ListOrdered className="w-4 h-4 text-emerald-400" />
                        <span>{t('stepsTitle')}</span>
                      </div>

                      <div className="space-y-2.5">
                        {currentSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800"
                          >
                            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-200 leading-snug font-medium">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DOCUMENTS NEEDED Section */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>{t('docsTitle')}</span>
                      </div>

                      <div className="space-y-2">
                        {currentDocs.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800"
                          >
                            <span className="text-emerald-400 font-black text-base shrink-0">✓</span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-100">
                              {doc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    {selectedScheme.applicationUrl && (
                      <a
                        href={selectedScheme.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-semibold"
                      >
                        Official Govt Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setModalTab('applyForm')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50"
                    >
                      <Send className="w-4 h-4" />
                      Proceed to Guided Application
                    </button>
                  </div>

                </div>
              )}

              {/* GUIDED APPLICATION FORM VIEW */}
              {modalTab === 'applyForm' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase">
                        {selectedScheme.code}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Deadline: {selectedScheme.applicationDeadline || 'Ongoing'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-100">{schemeTitle}</h2>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{selectedScheme.fullDescription}</p>
                  </div>

                  {/* Eligibility Quick Summary */}
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block font-semibold">Target States:</span>
                      <span className="text-slate-200 font-bold">{selectedScheme.eligibilityCriteria?.targetStates?.join(', ') || 'All India'}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block font-semibold">Land Limit:</span>
                      <span className="text-amber-400 font-bold">{selectedScheme.eligibilityCriteria?.maxLandAcres ? `Up to ${selectedScheme.eligibilityCriteria.maxLandAcres} Acres` : 'No Max Limit'}</span>
                    </div>
                  </div>

                  {/* Farmer Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">Farmer Land Survey No. / 7-12 Remarks (Optional)</label>
                    <textarea
                      rows={3}
                      value={farmerNotes}
                      onChange={(e) => setFarmerNotes(e.target.value)}
                      placeholder="Enter 7/12 land survey number, GAT number, or special requests..."
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
                        onClick={() => setModalTab('howToApply')}
                        className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold"
                      >
                        Back to Instructions
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
              )}

            </div>
          </div>
        );
      })()}

    </div>
  );
};

