import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Sprout, Shield, Bot, LayoutDashboard, Globe, LogOut, User as UserIcon, Menu, X, Sun, Moon, MapPin, Headphones } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useLocationProfile } from '../../context/LocationContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { locationProfile, openLocationModal } = useLocationProfile();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('navHome'), path: '/', icon: LayoutDashboard },
    { name: t('navSoil'), path: '/soil-analysis', icon: Sprout },
    { name: t('navSchemes'), path: '/schemes', icon: Shield },
    { name: t('navChat'), path: '/ai-chat', icon: Bot },
    { name: t('navContact'), path: '#contact', isHash: true, icon: Headphones },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: t('navAdmin'), path: '/admin', icon: UserIcon });
  }

  return (
    <nav className="sticky top-4 z-50 max-w-[98%] 2xl:max-w-7xl mx-auto mt-3 sm:mt-4 mb-6 px-2 sm:px-4">
      <div className="glass-panel rounded-2xl border border-slate-800/80 shadow-2xl shadow-slate-950/60 px-3 sm:px-5 backdrop-blur-xl bg-slate-950/90">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* Logo */}
          <RouterLink to="/" className="flex items-center gap-2.5 shrink-0 group py-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <span className="text-base sm:text-lg font-black text-gradient-green tracking-tight whitespace-nowrap block">KrishiSeva AI</span>
              <span className="hidden 2xl:block text-[9px] text-slate-400 font-medium tracking-wider uppercase whitespace-nowrap">Smart Farming & Schemes</span>
            </div>
          </RouterLink>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 shrink min-w-0 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              if (link.isHash) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      const elem = document.querySelector(link.path);
                      if (elem) {
                        e.preventDefault();
                        elem.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition-all whitespace-nowrap shrink-0"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>{link.name}</span>
                  </a>
                );
              }
              return (
                <RouterLink
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.name}</span>
                </RouterLink>
              );
            })}
          </div>

          {/* Right Actions: Location Badge, Language Switcher, Theme Toggle & Auth */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {/* Location Profile Quick Badge */}
            <button
              onClick={openLocationModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 text-xs font-semibold transition-all shadow-sm group whitespace-nowrap shrink-0"
              title="Click to view or edit your Farmer Location Profile (GPS / Manual)"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="max-w-[100px] truncate">
                {locationProfile?.district || 'Nagpur'}
              </span>
            </button>

            {/* Dark/Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 px-2 rounded-xl glass-panel hover:bg-emerald-500/10 border border-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-all flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '16s' }} />
                  <span className="text-[11px] font-bold text-amber-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-800">Dark</span>
                </>
              )}
            </button>

            {/* Multilingual Dropdown Selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 rounded-xl px-2 py-1 text-xs text-slate-300 whitespace-nowrap shrink-0">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer font-medium text-xs"
              >
                <option value="en" className="bg-slate-900 text-slate-200">EN</option>
                <option value="hi" className="bg-slate-900 text-slate-200">HI</option>
                <option value="mr" className="bg-slate-900 text-slate-200">MR</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800 whitespace-nowrap shrink-0">
                {user.role === 'admin' ? (
                  <RouterLink
                    to="/admin"
                    className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                  >
                    👑 Admin Console
                  </RouterLink>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 max-w-[130px] truncate">
                    🌾 {user.fullName}
                  </span>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <RouterLink
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  {t('login')}
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/50 transition-all"
                >
                  {t('register')}
                </RouterLink>
                <RouterLink
                  to="/login"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
                  title="Admin Console Login"
                >
                  👑 Admin
                </RouterLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Mobile Theme Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
            </button>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-1.5 py-1 outline-none"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            if (link.isHash) {
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    const elem = document.querySelector(link.path);
                    if (elem) {
                      e.preventDefault();
                      elem.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                >
                  <Icon className="w-5 h-5 text-emerald-400" />
                  {link.name}
                </a>
              );
            }
            return (
              <RouterLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                {link.name}
              </RouterLink>
            );
          })}
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="w-5 h-5" />
              {t('logout')} ({user.fullName})
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <RouterLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg bg-slate-800 text-sm font-semibold text-slate-200"
              >
                {t('login')}
              </RouterLink>
              <RouterLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg bg-emerald-500 text-sm font-semibold text-slate-950"
              >
                {t('register')}
              </RouterLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
