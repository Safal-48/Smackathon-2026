import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Activity, Plus, Trash2, Edit3, ShieldAlert, MapPin } from 'lucide-react';
import API from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form for creating scheme
  const [showAddModal, setShowAddModal] = useState(false);
  const [newScheme, setNewScheme] = useState({
    title: '',
    code: '',
    category: 'Financial Assistance',
    shortDescription: '',
    fullDescription: '',
    benefits: '',
    requiredDocuments: '',
    applicationSteps: '',
  });

  const fetchAdminStats = async () => {
    try {
      const res = await API.get('/admin/analytics');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newScheme,
        benefits: newScheme.benefits.split(',').map((b) => b.trim()),
        requiredDocuments: newScheme.requiredDocuments.split(',').map((d) => d.trim()),
        applicationSteps: newScheme.applicationSteps ? newScheme.applicationSteps.split(',').map((s) => s.trim()) : [],
      };

      const res = await API.post('/admin/schemes', payload);
      if (res.data.success) {
        setShowAddModal(false);
        fetchAdminStats();
      }
    } catch (err) {
      alert('Failed to create scheme. Make sure code is unique.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-purple-400" />
            Agricultural Admin & Agronomist Command Console
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage official government schemes and monitor regional district soil analytics.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50"
        >
          <Plus className="w-4 h-4" />
          Add Government Scheme
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Registered Farmers</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-slate-100">{stats?.totalFarmers || 124}</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Soil Reports Generated</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-black text-slate-100">{stats?.totalSoilTests || 89}</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Government Schemes</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-black text-slate-100">{stats?.totalSchemes || 12}</span>
        </div>
      </div>

      {/* District Soil Health Heatmap Analytics */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          Regional District Soil Quality Heatmap
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono">
              <tr>
                <th className="p-3">District</th>
                <th className="p-3">Avg Nitrogen (N)</th>
                <th className="p-3">Avg pH Balance</th>
                <th className="p-3">Dominant Soil Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {stats?.districtSoilHealth?.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-slate-100">{row.district}</td>
                  <td className="p-3">{row.avgNitrogen} kg/ha</td>
                  <td className="p-3">{row.avgpH}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      row.dominantStatus === 'Optimal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {row.dominantStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Scheme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-purple-500/30 p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-100">Add New Government Scheme</h2>

            <form onSubmit={handleCreateScheme} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Scheme Title (e.g. PM-KISAN)"
                value={newScheme.title}
                onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Code (e.g. PMK-2026)"
                  value={newScheme.code}
                  onChange={(e) => setNewScheme({ ...newScheme, code: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                />

                <select
                  value={newScheme.category}
                  onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                >
                  <option value="Financial Assistance">Financial Assistance</option>
                  <option value="Insurance & Credit">Insurance & Credit</option>
                  <option value="Solar & Irrigation">Solar & Irrigation</option>
                </select>
              </div>

              <textarea
                placeholder="Short Summary"
                rows={2}
                value={newScheme.shortDescription}
                onChange={(e) => setNewScheme({ ...newScheme, shortDescription: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
              />

              <textarea
                placeholder="Full Eligibility & Rules"
                rows={3}
                value={newScheme.fullDescription}
                onChange={(e) => setNewScheme({ ...newScheme, fullDescription: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
              />

              <input
                type="text"
                placeholder="Benefits (comma separated)"
                value={newScheme.benefits}
                onChange={(e) => setNewScheme({ ...newScheme, benefits: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
              />

              <input
                type="text"
                placeholder="Required Documents (comma separated)"
                value={newScheme.requiredDocuments}
                onChange={(e) => setNewScheme({ ...newScheme, requiredDocuments: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
              />

              <input
                type="text"
                placeholder="Application Steps (comma separated)"
                value={newScheme.applicationSteps}
                onChange={(e) => setNewScheme({ ...newScheme, applicationSteps: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 font-bold text-white rounded-xl"
                >
                  Publish Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
