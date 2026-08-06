import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';

import { CustomCursor } from './components/common/CustomCursor';
import { ScrollProgress } from './components/common/ScrollProgress';
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
import { NotFoundPage } from './pages/ErrorPages';

// ─── Route Guards ──────────────────────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoadSpinner />;
  return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoadSpinner />;
  return user ? children : <Navigate to="/login" replace />;
};

// ─── Page Load Spinner ────────────────────────────────────────────────────────
const PageLoadSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
  </div>
);

// ─── Page Transition Wrapper ──────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="enter"
    exit="exit"
  >
    {children}
  </motion.div>
);

// ─── Animated Routes ──────────────────────────────────────────────────────────
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"             element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/soil-analysis" element={<PageWrapper><SoilAnalysis /></PageWrapper>} />
        <Route path="/schemes"      element={<PageWrapper><Schemes /></PageWrapper>} />
        <Route path="/ai-chat"      element={<PageWrapper><ChatBot /></PageWrapper>} />
        <Route path="/login"        element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register"     element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <PageWrapper><Profile /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </AdminRoute>
          }
        />
        {/* 404 Catch-all */}
        <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <AnimatePresence mode="wait">
                {!loadingComplete && (
                  <LoadingScreen key="loader" onComplete={() => setLoadingComplete(true)} />
                )}
              </AnimatePresence>

              {loadingComplete && (
                <Router>
                  <div className="flex flex-col min-h-screen selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
                    <CustomCursor />
                    <ScrollProgress totalSections={3} />
                    <Navbar />
                    <main id="main-content" className="flex-1 z-10" role="main">
                      <ErrorBoundary>
                        <AnimatedRoutes />
                      </ErrorBoundary>
                    </main>
                    <Footer />
                  </div>
                </Router>
              )}
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
