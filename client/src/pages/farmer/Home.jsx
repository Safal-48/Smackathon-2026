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
import { FarmlandScene } from '../../components/3d/FarmlandScene';
import { Card3D } from '../../components/common/Card3D';
import { MagneticButton } from '../../components/common/MagneticButton';
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
  const { t } = useLanguage();

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Top Header Bar with Profile & Notifications */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          
          {/* Profile Overview */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-950/50">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'F'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-100">
                  {user ? user.fullName : 'Smart Farmer'}
                </h1>
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Verified Farmer
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>📍 {user?.district || 'Nagpur'}, {user?.state || 'Maharashtra'}</span>
                <span>•</span>
                <span>🌾 Farm Size: {user?.farmSizeAcres || 2.5} Acres</span>
              </p>
            </div>
          </div>

          {/* Quick Toolbar Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-3 rounded-2xl glass-panel hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 relative transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
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
                    className="absolute right-0 top-14 w-80 sm:w-96 glass-panel rounded-3xl border border-slate-800 p-4 shadow-2xl z-50 space-y-3"
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
                            <span className={`font-bold ${n.type === 'warning' ? 'text-amber-400' : n.type === 'success' ? 'text-emerald-400' : 'text-cyan-400'}`}>
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
              <MagneticButton className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2">
                <Sprout className="w-4 h-4" />
                New Soil Test
              </MagneticButton>
            </Link>

            <Link to="/ai-chat">
              <MagneticButton className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/50 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Ask AI Assistant
              </MagneticButton>
            </Link>

          </div>

        </div>

        {/* 5-Day Weather Forecast & Solar Radiation Widget */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card3D depth={8}>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today (Sunny)</span>
              <Sun className="w-6 h-6 text-amber-400 mx-auto my-1 animate-spin" style={{ animationDuration: '12s' }} />
              <span className="text-lg font-black text-slate-100 block">31°C</span>
              <span className="text-[10px] text-slate-400 block">Humidity: 48%</span>
            </div>
          </Card3D>

          <Card3D depth={8}>
            <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-1 text-center">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Tomorrow (Rain)</span>
              <CloudRain className="w-6 h-6 text-cyan-400 mx-auto my-1" />
              <span className="text-lg font-black text-slate-100 block">27°C</span>
              <span className="text-[10px] text-amber-300 block font-semibold">15mm Rain Alert</span>
            </div>
          </Card3D>

          <Card3D depth={8}>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sat, 09 Aug</span>
              <Sun className="w-6 h-6 text-amber-400 mx-auto my-1" />
              <span className="text-lg font-black text-slate-100 block">29°C</span>
              <span className="text-[10px] text-slate-400 block">Humidity: 52%</span>
            </div>
          </Card3D>

          <Card3D depth={8}>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sun, 10 Aug</span>
              <Droplets className="w-6 h-6 text-blue-400 mx-auto my-1" />
              <span className="text-lg font-black text-slate-100 block">28°C</span>
              <span className="text-[10px] text-slate-400 block">Light Shower</span>
            </div>
          </Card3D>

          <Card3D depth={8}>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Wind Speed</span>
              <Wind className="w-6 h-6 text-emerald-400 mx-auto my-1" />
              <span className="text-lg font-black text-slate-100 block">14 km/h</span>
              <span className="text-[10px] text-slate-400 block">SW Direction</span>
            </div>
          </Card3D>

          <Card3D depth={8}>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Solar Radiance</span>
              <Zap className="w-6 h-6 text-yellow-400 mx-auto my-1" />
              <span className="text-lg font-black text-slate-100 block">5.8 kWh/m²</span>
              <span className="text-[10px] text-slate-400 block">Solar Pump Ready</span>
            </div>
          </Card3D>
        </div>

        {/* Dashboard Grid Section */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Soil Health Summary, AI Recommendations, Analytics */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Live Crop Health & AI Agronomic Feed */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Active Crop Health & AI Agronomic Feed
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
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Soil Fertility Trend & Potential Yield Analytics
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    NPK History
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="Nitrogen" stroke="#4ade80" fill="#4ade80" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="Phosphorus" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="Potassium" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yieldProjectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="crop" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                      <Bar dataKey="Actual" fill="#22c55e" radius={[6, 6, 0, 0]} name="Current Yield (Q/acre)" />
                      <Bar dataKey="Potential" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Potential Yield with AI Advice" />
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
                  Farming Reminders
                </h3>
                <span className="text-xs text-slate-400 font-mono">{reminders.filter(r => !r.done).length} Pending</span>
              </div>

              {/* Add New Task Form */}
              <form onSubmit={addReminder} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom task (e.g. Water Plot B)..."
                  value={newReminderText}
                  onChange={(e) => setNewReminderText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-500"
                />
                <button type="submit" className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {reminders.map((task) => (
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
                      <span className="text-slate-200 block font-medium">{task.text}</span>
                      <span className="text-[10px] text-amber-400 font-semibold">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Saved Welfare Schemes */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-cyan-400" />
                  Saved Schemes & Subsidies
                </h3>
                <Link to="/schemes" className="text-xs font-bold text-cyan-400 hover:underline">
                  Browse All →
                </Link>
              </div>

              {savedSchemes.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  No saved schemes. Bookmark schemes on the Welfare Scheme page for quick access.
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
                  Kharif Crop Calendar (August)
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
                    <span className="font-bold text-slate-100 block">Top Dressing Fertilization</span>
                    <span className="text-[11px] text-slate-400 block">Urea + MOP application for Cotton plot</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-purple-500/20">
                    <span>18</span>
                    <span className="text-[9px] uppercase">Aug</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-100 block">Pest Scouting Day</span>
                    <span className="text-[11px] text-slate-400 block">Inspect pink bollworm pheromone traps</span>
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
