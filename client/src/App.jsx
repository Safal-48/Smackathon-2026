import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import { CustomCursor } from './components/common/CustomCursor';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { Home } from './pages/farmer/Home';
import { SoilAnalysis } from './pages/farmer/SoilAnalysis';
import { Schemes } from './pages/farmer/Schemes';
import { ChatBot } from './pages/farmer/ChatBot';
import { Profile } from './pages/farmer/Profile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <AuthProvider>
      <LanguageProvider>
        <AnimatePresence mode="wait">
          {!loadingComplete && (
            <LoadingScreen key="loader" onComplete={() => setLoadingComplete(true)} />
          )}
        </AnimatePresence>

        <Router>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
            <CustomCursor />
            <Navbar />
            <main className="flex-1 z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/soil-analysis" element={<SoilAnalysis />} />
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/ai-chat" element={<ChatBot />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
