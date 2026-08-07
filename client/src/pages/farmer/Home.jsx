import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  ShieldCheck,
  Bot,
  ArrowRight,
  Activity,
  Thermometer,
  Droplets,
  Sun,
  Sparkles,
  Bell,
  Calendar as CalendarIcon,
  CheckSquare,
  Bookmark,
  CloudRain,
  TrendingUp,
  User,
  Zap,
  Plus,
  Check,
  AlertTriangle,
  Clock,
  ChevronRight,
  Compass,
  FileSpreadsheet,
  Wind,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLocationProfile } from '../../context/LocationContext';
import { FarmlandScene } from '../../components/3d/FarmlandScene';
import { Card3D } from '../../components/common/Card3D';
import { MagneticButton } from '../../components/common/MagneticButton';
import { RevealText, FadeUp, ImageWipe } from '../../components/common/RevealText';
import API from '../../services/api';

// Analytics Trend Data
const npkTrendData = [
  { month: 'Jan', Nitrogen: 45, Phosphorus: 22, Potassium: 35, HealthScore: 72 },
  { month: 'Mar', Nitrogen: 52, Phosphorus: 25, Potassium: 38, HealthScore: 78 },
  { month: 'May', Nitrogen: 60, Phosphorus: 28, Potassium: 42, HealthScore: 84 },
  { month: 'Jul', Nitrogen: 65, Phosphorus: 32, Potassium: 48, HealthScore: 88 },
  { month: 'Aug', Nitrogen: 68, Phosphorus: 34, Potassium: 50, HealthScore: 91 },
];

const yieldProjectionData = [
  { crop: 'Cotton', Actual: 12, Potential: 15 },
  { crop: 'Soybean', Actual: 8, Potential: 10 },
  { crop: 'Wheat', Actual: 18, Potential: 22 },
  { crop: 'Paddy', Actual: 22, Potential: 26 },
];

export const Home = () => {
  const { user } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { locationProfile, openLocationModal } = useLocationProfile();

  // State Management
  const [activeTab, setActiveTab] = useState('overview'); // overview | analytics | calendar
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [soilReports, setSoilReports] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Apply 2nd split Urea (25kg/acre) on Plot A', dueDate: 'Today', done: false, type: 'fertilizer' },
    { id: 2, text: 'Drip Irrigation cycle (2 hours) for Cotton', dueDate: 'Tomorrow', done: false, type: 'water' },
    { id: 3, text: 'Submit PM-KISAN 7/12 land document verification', dueDate: 'In 3 Days', done: true, type: 'scheme' },
    { id: 4, text: 'Inspect Soybean leaves for stem fly pest risk', dueDate: '12 Aug', done: false, type: 'inspection' },
  ]);

  const [newReminderText, setNewReminderText] = useState('');
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const notifications = [
    { id: 1, title: 'Weather Warning', desc: 'Moderate rainfall expected tomorrow (15mm). Hold pesticide spraying.', time: '10 mins ago', type: 'warning' },
    { id: 2, title: 'PM-KISAN Status', desc: '17th installment of ₹2,000 processed into your bank account.', time: '2 hours ago', type: 'success' },
    { id: 3, title: 'Soil Report Generated', desc: 'Soil Health Score for Plot A updated to 88/100.', time: '1 day ago', type: 'info' },
  ];

  // Fetch saved schemes & soil history
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const soilRes = await API.get('/soil/history');
        if (soilRes.data.success) {
          setSoilReports(soilRes.data.reports);
        }
      } catch (err) {
        console.log('Soil history fetch fallback');
      }

      // Load saved bookmarks from localStorage
      const bookmarks = JSON.parse(localStorage.getItem('krishi_bookmarks') || '[]');
      if (bookmarks.length > 0) {
        try {
          const schemesRes = await API.get('/schemes');
          if (schemesRes.data.success) {
            setSavedSchemes(schemesRes.data.schemes.filter((s) => bookmarks.includes(s._id)));
          }
        } catch (err) {
          console.log('Schemes fetch fallback');
        }
      }
    };

    loadDashboardData();
  }, []);

  const toggleReminder = (id) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  };

  const addReminder = (e) => {
    e.preventDefault();
    if (!newReminderText.trim()) return;
    setReminders([
      ...reminders,
      { id: Date.now(), text: newReminderText.trim(), dueDate: 'Upcoming', done: false, type: 'task' },
    ]);
    setNewReminderText('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-12">
      
      {/* 3D R3F Canvas Background */}
      <FarmlandScene />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* GRAND 3D HERO SECTION */}
        <section className="py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase shadow-lg shadow-emerald-950/40">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{t('nextGenTitle')}</span>
            </div>

            <RevealText
              text="KrishiSeva AI"
              className="display-title font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-emerald-200 to-teal-300"
              tag="h1"
            />

            <FadeUp className="body-text text-slate-300 text-base leading-relaxed">
              {t('heroDesc')}
            </FadeUp>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/soil-analysis">
                <MagneticButton className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 flex items-center gap-2.5">
                  <Sprout className="w-5 h-5 stroke-[2.5]" />
                  {t('launchSoilBtn')}
                </MagneticButton>
              </Link>

              <Link to="/schemes">
                <MagneticButton className="px-6 py-3.5 rounded-2xl glass-panel hover:bg-slate-800/80 border border-emerald-500/30 text-slate-100 font-bold text-sm flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-emerald-400" />
                  {t('exploreSchemesBtn')}
                </MagneticButton>
              </Link>
            </div>
          </div>

          {/* Floating 3D Hero Stat Spotlight Card */}
          <div className="w-full lg:w-[420px]">
            <Card3D depth={24} className="w-full">
              <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-5 shadow-2xl relative overflow-hidden bg-slate-950/80 backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">{t('iotTelemetry')}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('avgSoilHealth')}</span>
                    <span className="text-2xl font-black text-emerald-400 block mt-1">94.8%</span>
                    <span className="text-[9px] text-emerald-300 font-semibold block mt-0.5">Optimal Fertility</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('yieldGain')}</span>
                    <span className="text-2xl font-black text-amber-400 block mt-1">+28%</span>
                    <span className="text-[9px] text-amber-300 font-semibold block mt-0.5">AI Guidance</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-emerald-400 animate-bounce" />
                    <div>
                      <span className="text-xs font-bold text-slate-100 block">AI Bio Sensor Telemetry</span>
                      <span className="text-[10px] text-emerald-300 block">Real-time Parallax Analysis</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">ONLINE</span>
                </div>
              </div>
            </Card3D>
          </div>
        </section>

        {/* Top Header Bar with Profile & Notifications */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl gpu-layer">
          
          {/* Profile Overview */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-950/50">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'F'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <RevealText
                  text={user ? user.fullName : 'Smart Farmer'}
                  className="text-xl sm:text-2xl font-black text-slate-100"
                  tag="h1"
                />
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {t('verifiedFarmer')}
                </span>
              </div>
              <FadeUp className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openLocationModal}
                  className="font-semibold text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer bg-slate-900/90 border border-emerald-500/30 px-2.5 py-1 rounded-xl hover:border-emerald-400 transition-all"
                  title="Click to view or edit Farmer Location Profile"
                >
                  <span>📍 {locationProfile.village}, {locationProfile.taluka}, {locationProfile.district}, {locationProfile.state}</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-md">
                    {locationProfile.isGps ? 'GPS Active' : 'Manual'}
                  </span>
                </button>
                <span>•</span>
                <span className="text-slate-300 font-medium">🌾 Farm Size: {user?.farmSizeAcres || 2.5} Acres</span>
              </FadeUp>
            </div>
          </div>

          {/* Quick Toolbar Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-3 rounded-2xl glass-panel hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800 relative transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-emerald-400" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </button>

              {/* Notifications Dropdown Drawer */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 sm:w-96 glass-panel rounded-3xl border border-emerald-500/30 p-4 shadow-2xl z-50 space-y-3 gpu-layer"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <Bell className="w-4 h-4 text-emerald-400" />
                        Agricultural Alerts ({notifications.length})
                      </h4>
                      <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white text-xs">
                        Dismiss
                      </button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${n.type === 'warning' ? 'text-amber-400' : n.type === 'success' ? 'text-emerald-400' : 'text-teal-400'}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action Navigation Buttons */}
            <Link to="/soil-analysis">
              <MagneticButton className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2">
                <Sprout className="w-4 h-4" />
                {t('newSoilTest')}
              </MagneticButton>
            </Link>

            <Link to="/ai-chat">
              <MagneticButton className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/50 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                {t('askAiAssistant')}
              </MagneticButton>
            </Link>

          </div>

        </div>

        {/* SINGLE UNIFIED TODAY'S WEATHER SECTION (CLICKABLE FOR 3-DAY FORECAST) */}
        <section>
          <Card3D depth={12}>
            <div
              onClick={() => setShowWeatherModal(true)}
              className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer shadow-xl relative overflow-hidden group bg-slate-950/80 backdrop-blur-2xl"
              title="Click to view 3-Day Detailed Forecast"
            >
              {/* Ambient radial glow */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                
                {/* Left Side: Today Weather Main */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                    <Sun className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" style={{ animationDuration: '16s' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-emerald-400">{t('todayWeatherHeader')}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">Sunny</span>
                    </div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-100">31°C</span>
                      <span className="text-xs sm:text-sm text-slate-400">Nagpur, Maharashtra</span>
                    </div>
                  </div>
                </div>

                {/* Center Quick Telemetry Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 text-xs w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800/80 pt-3 md:pt-0 md:pl-6">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" /> {t('humidity')}
                    </span>
                    <span className="text-sm font-extrabold text-slate-200 block">48%</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block flex items-center gap-1">
                      <Wind className="w-3 h-3 text-emerald-400" /> {t('wind')}
                    </span>
                    <span className="text-sm font-extrabold text-slate-200 block">14 km/h</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" /> {t('solar')}
                    </span>
                    <span className="text-sm font-extrabold text-slate-200 block">5.8 kWh/m²</span>
                  </div>
                </div>

                {/* Right Side CTA: Click for 3-Day Forecast */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all group-hover:border-emerald-400">
                  <CalendarIcon className="w-4 h-4 text-emerald-400" />
                  <span>{t('view3DayForecast')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-400" />
                </div>

              </div>
            </div>
          </Card3D>
        </section>

        {/* 3-DAY WEATHER FORECAST EXPANDED POPUP MODAL */}
        <AnimatePresence>
          {showWeatherModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-3xl glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 relative bg-slate-950/95"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <CloudRain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-100">{t('threeDayForecastTitle')}</h3>
                      <p className="text-xs text-slate-400">Live telemetry for Nagpur, Maharashtra (Updated 10 mins ago)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWeatherModal(false)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 3-Day Cards Grid */}
                <div className="grid sm:grid-cols-3 gap-4">
                  
                  {/* Day 1: Today */}
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 relative overflow-hidden">
                    <div className="inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                      Today (Aug 6)
                    </div>
                    <div className="flex items-center justify-between">
                      <Sun className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-100">31°C</span>
                        <span className="text-[10px] text-slate-400 block">Low: 24°C</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Humidity: 48%</span>
                        <span>Rain: 0%</span>
                      </div>
                      <p className="text-emerald-300 font-semibold text-[11px]">✓ Excellent condition for spraying & fertilizer application.</p>
                    </div>
                  </div>

                  {/* Day 2: Tomorrow */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="inline-flex px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase">
                      Tomorrow (Aug 7)
                    </div>
                    <div className="flex items-center justify-between">
                      <CloudSun className="w-8 h-8 text-cyan-400" />
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-100">29°C</span>
                        <span className="text-[10px] text-slate-400 block">Low: 22°C</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Humidity: 65%</span>
                        <span>Rain: 20%</span>
                      </div>
                      <p className="text-teal-300 font-semibold text-[11px]">✓ Partly cloudy with high soil moisture retention.</p>
                    </div>
                  </div>

                  {/* Day 3: Day After Tomorrow */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase">
                      Day After (Aug 8)
                    </div>
                    <div className="flex items-center justify-between">
                      <CloudRain className="w-8 h-8 text-indigo-400" />
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-100">27°C</span>
                        <span className="text-[10px] text-slate-400 block">Low: 21°C</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Humidity: 82%</span>
                        <span>Rain: 60%</span>
                      </div>
                      <p className="text-amber-300 font-semibold text-[11px]">⚠️ Moderate rainfall expected. Ensure field drainage.</p>
                    </div>
                  </div>

                </div>

                {/* Additional Extended Telemetry Metrics */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Solar Radiance</span>
                    <span className="text-sm font-black text-amber-400 block mt-0.5">5.8 kWh/m²</span>
                    <span className="text-[9px] text-emerald-400 block">Solar Pump Ready</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Soil Evaporation</span>
                    <span className="text-sm font-black text-cyan-400 block mt-0.5">4.2 mm/day</span>
                    <span className="text-[9px] text-cyan-300 block">Normal Transpiration</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Sunlight Hours</span>
                    <span className="text-sm font-black text-yellow-300 block mt-0.5">9.5 Hours</span>
                    <span className="text-[9px] text-slate-400 block">Clear Daylight</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Barometric Press.</span>
                    <span className="text-sm font-black text-emerald-400 block mt-0.5">1012 hPa</span>
                    <span className="text-[9px] text-emerald-300 block">Stable Atmosphere</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowWeatherModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
                  >
                    Close Forecast
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dashboard Grid Section */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Soil Health Summary, AI Recommendations, Analytics */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Live Crop Health & AI Agronomic Feed */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  {t('activeCropHealthHeader')}
                </h3>
                <span className="text-xs text-slate-400 font-mono">Live Monitoring</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Crop 1 */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">Cotton (Bt Cotton)</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      94% Health
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Stage: Flowering & Square Formation (Day 45)</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%]" />
                  </div>
                  <span className="text-[11px] text-emerald-300 block font-medium">AI Tip: Maintain 2.5cm soil moisture during square formation.</span>
                </div>

                {/* Crop 2 */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">Soybean (JS 335)</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      86% Health
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Stage: Vegetative Branching (Day 28)</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[86%]" />
                  </div>
                  <span className="text-[11px] text-amber-300 block font-medium">AI Tip: Spray 1% Neem Oil to prevent leaf caterpillar infestation.</span>
                </div>
              </div>
            </div>

            {/* 2. Recharts NPK Nutrient Trend & Yield Analytics */}
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-4 gpu-layer">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Soil Fertility Trend & Potential Yield Analytics
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      activeTab === 'overview' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
                    }`}
                  >
                    NPK History
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      activeTab === 'analytics' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
                    }`}
                  >
                    Yield Gap
                  </button>
                </div>
              </div>

              {activeTab === 'overview' ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={npkTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#25352c" />
                      <XAxis dataKey="month" stroke="#84a98c" tick={{ fill: '#cad2c5', fontSize: 11 }} />
                      <YAxis stroke="#84a98c" tick={{ fill: '#cad2c5', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#121a15', borderColor: '#25352c', borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="Nitrogen" stroke="#84a98c" fill="#84a98c" fillOpacity={0.25} />
                      <Area type="monotone" dataKey="Phosphorus" stroke="#52796f" fill="#52796f" fillOpacity={0.25} />
                      <Area type="monotone" dataKey="Potassium" stroke="#e5a93c" fill="#e5a93c" fillOpacity={0.25} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yieldProjectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#25352c" />
                      <XAxis dataKey="crop" stroke="#84a98c" tick={{ fill: '#cad2c5', fontSize: 11 }} />
                      <YAxis stroke="#84a98c" tick={{ fill: '#cad2c5', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#121a15', borderColor: '#25352c', borderRadius: '12px', fontSize: '12px' }} />
                      <Bar dataKey="Actual" fill="#52796f" radius={[6, 6, 0, 0]} name="Current Yield (Q/acre)" />
                      <Bar dataKey="Potential" fill="#84a98c" radius={[6, 6, 0, 0]} name="Potential Yield with AI Advice" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* 3. Soil Reports Log Summary */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  Recent Soil Diagnostic Reports
                </h3>
                <Link to="/soil-analysis" className="text-xs font-bold text-emerald-400 hover:underline">
                  Full Diagnostic →
                </Link>
              </div>

              <div className="space-y-3">
                {soilReports.slice(0, 2).map((report, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{report.locationName}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                          {report.healthStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        NPK: {report.nitrogen}-{report.phosphorus}-{report.potassium} | pH: {report.pH} | Organic Carbon: {report.organicCarbon || 0.65}%
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-400">{report.soilHealthScore || 88}/100</span>
                      <span className="text-[10px] text-slate-500 block">Tested: {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Farming Reminders, Saved Schemes & Calendar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 1. Farming Task Reminders Checklist */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                  {t('farmingRemindersHeader')}
                </h3>
                <span className="text-xs text-slate-400 font-mono">{reminders.filter(r => !r.done).length} {t('pendingTasks')}</span>
              </div>

              {/* Add New Task Form */}
              <form onSubmit={addReminder} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('addCustomTaskPlaceholder')}
                  value={newReminderText}
                  onChange={(e) => setNewReminderText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-500"
                />
                <button type="submit" className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {reminders.map((task) => {
                  const displayDueDate =
                    task.dueDate === 'Today'
                      ? t('todayText')
                      : task.dueDate === 'Tomorrow'
                      ? t('tomorrowText')
                      : task.dueDate === 'In 3 Days'
                      ? t('inDaysText')
                      : task.dueDate;

                  const displayText =
                    task.id === 1
                      ? lang === 'hi'
                        ? 'प्लाॉट A पर यूरिया की दूसरी खुराक (25किग्रा/एकड़) डालें'
                        : lang === 'mr'
                        ? 'प्लॉट A वर युरियाचा दुसरा हप्ता (25किलो/एकड) द्या'
                        : task.text
                      : task.id === 2
                      ? lang === 'hi'
                        ? 'कपास के लिए ड्रिप सिंचाई (2 घंटे)'
                        : lang === 'mr'
                        ? 'कापसासाठी ठिबक सिंचन चक्र (२ तास)'
                        : task.text
                      : task.id === 3
                      ? lang === 'hi'
                        ? 'पीएम-किसान 7/12 जमीन दस्तावेज सत्यापन जमा करें'
                        : lang === 'mr'
                        ? 'पीएम-किसान ७/१२ जमीन दस्तऐवज पडताळणी जमा करा'
                        : task.text
                      : task.id === 4
                      ? lang === 'hi'
                        ? 'सोयाबीन की पत्तियों में तना मक्खी कीट जोखिम की जांच करें'
                        : lang === 'mr'
                        ? 'सोयाबीनच्या पानांवर खोडमाशी कीड तपासणी करा'
                        : task.text
                      : task.text;

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleReminder(task.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        task.done
                          ? 'bg-slate-900/40 border-slate-800 opacity-60 line-through'
                          : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                        task.done ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                      }`}>
                        {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="text-slate-200 block font-medium">{displayText}</span>
                        <span className="text-[10px] text-amber-400 font-semibold">{displayDueDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Saved Welfare Schemes */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-cyan-400" />
                  {t('savedSchemesHeader')}
                </h3>
                <Link to="/schemes" className="text-xs font-bold text-cyan-400 hover:underline">
                  {t('browseAllBtn')}
                </Link>
              </div>

              {savedSchemes.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  {t('noSavedSchemesText')}
                </div>
              ) : (
                <div className="space-y-2">
                  {savedSchemes.map((s) => (
                    <div key={s._id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-100 block">{s.title}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">{s.code}</span>
                      </div>
                      <Link to="/schemes" className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Interactive Crop Season Calendar */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  {t('cropCalendarHeader')}
                </h3>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">2026</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-purple-500/20">
                    <span>10</span>
                    <span className="text-[9px] uppercase">Aug</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-100 block">{t('topDressingTitle')}</span>
                    <span className="text-[11px] text-slate-400 block">{t('topDressingDesc')}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-purple-500/20">
                    <span>18</span>
                    <span className="text-[9px] uppercase">Aug</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-100 block">{t('pestScoutingTitle')}</span>
                    <span className="text-[11px] text-slate-400 block">{t('pestScoutingDesc')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
