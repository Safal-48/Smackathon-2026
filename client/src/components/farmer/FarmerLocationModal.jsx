import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle, X, ShieldCheck, Building2, Map, Home } from 'lucide-react';
import { useLocationProfile, INDIA_LOCATION_DATA } from '../../context/LocationContext';
import { useToast } from '../../context/ToastContext';

export const FarmerLocationModal = () => {
  const {
    locationProfile,
    saveLocation,
    detectGpsLocation,
    gpsLoading,
    gpsError,
    isModalOpen,
    closeLocationModal,
  } = useLocationProfile();

  const toast = useToast();

  const [selectedState, setSelectedState] = useState(locationProfile.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState(locationProfile.district || 'Nagpur');
  const [selectedTaluka, setSelectedTaluka] = useState(locationProfile.taluka || 'Hingna');
  const [selectedVillage, setSelectedVillage] = useState(locationProfile.village || 'Sukli');

  // Sync state when location profile changes
  useEffect(() => {
    if (locationProfile) {
      if (locationProfile.state) setSelectedState(locationProfile.state);
      if (locationProfile.district) setSelectedDistrict(locationProfile.district);
      if (locationProfile.taluka) setSelectedTaluka(locationProfile.taluka);
      if (locationProfile.village) setSelectedVillage(locationProfile.village);
    }
  }, [locationProfile]);

  // Handle State Change -> Reset District & Taluka
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const districts = Object.keys(INDIA_LOCATION_DATA[newState] || {});
    const firstDistrict = districts[0] || '';
    setSelectedDistrict(firstDistrict);
    const talukas = INDIA_LOCATION_DATA[newState]?.[firstDistrict] || [];
    setSelectedTaluka(talukas[0] || '');
  };

  // Handle District Change -> Reset Taluka
  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    const talukas = INDIA_LOCATION_DATA[selectedState]?.[newDistrict] || [];
    setSelectedTaluka(talukas[0] || '');
  };

  const handleManualSave = (e) => {
    e.preventDefault();
    saveLocation({
      state: selectedState,
      district: selectedDistrict,
      taluka: selectedTaluka,
      village: selectedVillage || 'Village Center',
      isGps: false,
    });
    toast('Farmer Location Profile updated successfully!', 'success');
    closeLocationModal();
  };

  if (!isModalOpen) return null;

  const availableStates = Object.keys(INDIA_LOCATION_DATA);
  const availableDistricts = Object.keys(INDIA_LOCATION_DATA[selectedState] || {});
  const availableTalukas = INDIA_LOCATION_DATA[selectedState]?.[selectedDistrict] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel w-full max-w-xl rounded-3xl border border-emerald-500/30 p-6 sm:p-8 space-y-6 relative shadow-2xl shadow-emerald-950/40 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeLocationModal}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Compass className="w-4 h-4" />
            <span>Smart Farming Location Module</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            Farmer Location Profile
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Auto-detect your precise GPS coordinates for localized weather, soil diagnostics, and regional government schemes.
          </p>
        </div>

        {/* Active Saved Location Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-400 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Location</span>
              <p className="text-sm font-extrabold text-slate-100">
                {locationProfile.village}, {locationProfile.taluka}, {locationProfile.district}, {locationProfile.state}
              </p>
              {locationProfile.isGps && (
                <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-mono font-semibold mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  GPS Verified ({locationProfile.latitude}° N, {locationProfile.longitude}° E)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: Automatic GPS Detection */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Automatic GPS Detection</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Recommended
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Click below to allow location access. KrishiSeva AI will pinpoint your farm's exact latitude and longitude.
          </p>

          <button
            type="button"
            onClick={detectGpsLocation}
            disabled={gpsLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {gpsLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                <span>Scanning GPS Satellites & Pinpointing...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>Detect My Location (GPS)</span>
              </>
            )}
          </button>

          {/* GPS Error Alert */}
          {gpsError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        {/* SECTION 2: Manual Selection (State, District, Taluka, Village) */}
        <form onSubmit={handleManualSave} className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-wider">
            <Map className="w-4 h-4 text-cyan-400" />
            <span>Manual Selection (State, District, Taluka, Village)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* State Select */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">State</label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {availableStates.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-slate-200">
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* District Select */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">District</label>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist} className="bg-slate-900 text-slate-200">
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Taluka Select */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Taluka / Sub-district</label>
              <select
                value={selectedTaluka}
                onChange={(e) => setSelectedTaluka(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                {availableTalukas.map((tal) => (
                  <option key={tal} value={tal} className="bg-slate-900 text-slate-200">
                    {tal}
                  </option>
                ))}
              </select>
            </div>

            {/* Village Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Village Name</label>
              <input
                type="text"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                placeholder="e.g. Sukli / Bori"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeLocationModal}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold hover:bg-slate-900 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/50 transition-all"
            >
              Save Manual Location Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
