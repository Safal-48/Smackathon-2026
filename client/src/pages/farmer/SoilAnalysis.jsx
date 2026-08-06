import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Upload,
  Bluetooth,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Droplets,
  Award,
  Sparkles,
  RefreshCw,
  Lightbulb,
  ShieldCheck,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import API from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Card3D } from '../../components/common/Card3D';
import { CameraModal } from '../../components/common/CameraModal';

export const SoilAnalysis = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [bluetoothConnecting, setBluetoothConnecting] = useState(false);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [soilImagePreview, setSoilImagePreview] = useState(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  const handleCameraCapture = (imageDataUrl) => {
    setSoilImagePreview(imageDataUrl);
  };

  const [formData, setFormData] = useState({
    nitrogen: 65,
    phosphorus: 32,
    potassium: 48,
    pH: 6.8,
    moisture: 45,
    organicCarbon: 0.72,
    soilType: 'Black Cotton',
    locationName: 'Plot A (North Field)',
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSoilImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateBluetoothSync = () => {
    setBluetoothConnecting(true);
    setTimeout(() => {
      setFormData({
        nitrogen: Math.floor(Math.random() * 35) + 50,
        phosphorus: Math.floor(Math.random() * 25) + 20,
        potassium: Math.floor(Math.random() * 30) + 35,
        pH: parseFloat((Math.random() * 1.8 + 6.0).toFixed(1)),
        moisture: Math.floor(Math.random() * 20) + 40,
        organicCarbon: parseFloat((Math.random() * 0.4 + 0.55).toFixed(2)),
        soilType: 'Black Cotton',
        locationName: 'IoT Probe #0892 Synced',
      });
      setBluetoothConnecting(false);
      setBluetoothConnected(true);
    }, 1400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, soilImage: soilImagePreview };
      const res = await API.post('/soil/analyze', payload);
      if (res.data.success) {
        setResult(res.data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Chart Data Preparation
  const chartData = result ? [
    { nutrient: 'Nitrogen (N)', value: result.nitrogen, max: 90, unit: 'kg/ha' },
    { nutrient: 'Phosphorus (P)', value: result.phosphorus, max: 50, unit: 'kg/ha' },
    { nutrient: 'Potassium (K)', value: result.potassium, max: 70, unit: 'kg/ha' },
    { nutrient: 'Moisture', value: result.moisture, max: 100, unit: '%' },
  ] : [];

  const radarData = result ? [
    { subject: 'Nitrogen', A: (result.nitrogen / 90) * 100 },
    { subject: 'Phosphorus', A: (result.phosphorus / 50) * 100 },
    { subject: 'Potassium', A: (result.potassium / 70) * 100 },
    { subject: 'pH Balance', A: (1 - Math.abs(6.8 - result.pH) / 3) * 100 },
    { subject: 'Organic Carbon', A: (result.organicCarbon / 0.8) * 100 },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-emerald-500/30 shadow-xl gpu-layer">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {t('aiDiagnosticSummary')}
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-100 flex items-center gap-3">
            <Sprout className="w-8 h-8 text-emerald-400" />
            {t('soilHeader')}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{t('soilDesc')}</p>
        </div>

        <button
          type="button"
          onClick={simulateBluetoothSync}
          disabled={bluetoothConnecting}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border shadow-lg ${
            bluetoothConnected
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
          }`}
        >
          <Bluetooth className={`w-4 h-4 ${bluetoothConnecting ? 'animate-bounce text-indigo-400' : ''}`} />
          {bluetoothConnecting
            ? t('pairingSensor')
            : bluetoothConnected
            ? t('sensorSynced')
            : t('pairBluetoothBtn')}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Soil Input Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            {t('soilNutrientHeader')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Upload Box with Live Camera Support */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">{t('soilPhotoUpload')}</label>
                <button
                  type="button"
                  onClick={() => setCameraModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  {t('takeLivePhoto')}
                </button>
              </div>

              <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-900/60">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {soilImagePreview ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={soilImagePreview} alt="Soil sample" className="w-14 h-14 rounded-xl object-cover border border-emerald-500/40" />
                      <div className="text-left text-xs">
                        <span className="text-emerald-400 font-bold block">Crop / Soil Photo Ready</span>
                        <span className="text-slate-400 text-[11px]">Click or drag to replace photo</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSoilImagePreview(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="flex items-center gap-3">
                      <Upload className="w-6 h-6 text-emerald-400" />
                      <span className="text-slate-600 font-bold text-xs">OR</span>
                      <Camera className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-xs text-slate-300 font-medium">{t('dragOrCamera')}</span>
                    <span className="text-[10px] text-slate-500">Supports JPG, PNG (Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Modal Popup */}
            <CameraModal
              isOpen={cameraModalOpen}
              onClose={() => setCameraModalOpen(false)}
              onCapture={handleCameraCapture}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('nitrogenLabel')}</label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('phosphorusLabel')}</label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('potassiumLabel')}</label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('phLabel')}</label>
                <input
                  type="number"
                  step="0.1"
                  name="pH"
                  value={formData.pH}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('moistureLabel')}</label>
                <input
                  type="number"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('organicCarbonLabel')}</label>
                <input
                  type="number"
                  step="0.01"
                  name="organicCarbon"
                  value={formData.organicCarbon}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('soilTypeLabel')}</label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none"
                >
                  <option value="Black Cotton">Black Cotton</option>
                  <option value="Red Soil">Red Soil</option>
                  <option value="Alluvial">Alluvial Soil</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('plotAliasLabel')}</label>
                <input
                  type="text"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Soil Report & AI Advice...
                </>
              ) : (
                t('analyzeBtn')
              )}
            </button>

          </form>
        </div>

        {/* Results Analytics Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Top Score Gauge Card */}
              <Card3D depth={12}>
                <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                  <div className="flex items-center gap-5">
                    
                    {/* Animated Circle Gauge */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="rgba(30, 41, 59, 0.8)" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#22c55e"
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * result.soilHealthScore) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute font-mono font-black text-2xl text-emerald-400">{result.soilHealthScore}</span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Overall Soil Health Score</span>
                      <h3 className="text-2xl font-black text-slate-100">{result.healthStatus} Condition</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-xs">{result.fertilityReport?.summary}</p>
                    </div>
                  </div>

                  <div className="text-right border-l border-slate-800/80 pl-6 hidden sm:block">
                    <span className="text-xs text-slate-400 font-medium block">Organic Carbon</span>
                    <span className="text-xl font-bold text-amber-400">{result.organicCarbon}%</span>
                    <span className="text-[11px] text-slate-400 block font-mono">{result.fertilityReport?.organicCarbonLevel}</span>
                  </div>
                </div>
              </Card3D>

              {/* Animated Recharts Nutrient Radar & Bar Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nutrient Balance Radar</h4>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                        <Radar name="Soil Sample" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">NPK Levels (kg/ha)</h4>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="nutrient" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="value" fill="#4ade80" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Recommended Crops */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  AI Crop Suitability Matches
                </h3>

                <div className="space-y-3">
                  {result.recommendedCrops?.map((crop, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-base">{crop.name}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">{crop.season}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{crop.reason}</p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span className="text-lg font-black text-emerald-400">{crop.suitabilityScore}% Match</span>
                        <span className="text-[11px] text-slate-400 block font-medium">Est. Yield: {crop.expectedYield}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fertilizer & Irrigation Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Fertilizer Schedule */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Fertilizer Dosage Schedule
                  </h3>
                  <div className="space-y-2">
                    {result.recommendedFertilizers?.map((f, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                        <span className="font-bold text-amber-300 block">{f.name}</span>
                        <span className="text-slate-200 block font-semibold">Dosage: {f.dosage}</span>
                        <p className="text-slate-400 text-[11px]">{f.timing}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Irrigation Advice */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    Smart Irrigation Advice
                  </h3>
                  {result.irrigationAdvice && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400 block">System Method:</span>
                        <span className="font-bold text-cyan-300">{result.irrigationAdvice.method}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400 block">Frequency & Volume:</span>
                        <span className="font-bold text-slate-200">{result.irrigationAdvice.frequency}</span>
                        <span className="text-slate-400 block text-[11px] mt-0.5">{result.irrigationAdvice.waterVolumePerAcre}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Soil Improvement Tips */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  Long-Term Soil Fertility Improvement Tips
                </h3>
                <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {result.soilImprovementTips?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-800 shadow-2xl">
                <Sprout className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Ready for Soil Diagnostic</h3>
              <p className="text-slate-400 text-sm max-w-md">
                Upload a soil image or enter NPK, pH, and Organic Carbon values on the left to calculate Soil Health Score, Fertility Radar, and AI Irrigation advice.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
