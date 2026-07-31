import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getTranslation } from '../lib/i18n';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Globe, Menu, X, PlusCircle, Search, HelpCircle, ShieldCheck, GraduationCap, Lock, Calculator, Download, Smartphone } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageToggle: () => void;
  activeTab: 'home' | 'browse' | 'post' | 'track' | 'how' | 'faq';
  setActiveTab: (tab: 'home' | 'browse' | 'post' | 'track' | 'how' | 'faq') => void;
  onOpenCalculator?: () => void;
  deferredPwaPrompt?: any;
  onInstallPwa?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageToggle,
  activeTab,
  setActiveTab,
  onOpenCalculator,
  deferredPwaPrompt,
  onInstallPwa
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: getTranslation(language, 'navHome') },
    { id: 'browse', label: getTranslation(language, 'navBrowse'), icon: Search },
    { id: 'post', label: getTranslation(language, 'navPost'), icon: PlusCircle, highlight: true },
    { id: 'track', label: getTranslation(language, 'navTrack'), icon: Key },
    { id: 'how', label: getTranslation(language, 'navHowItWorks'), icon: HelpCircle },
    { id: 'faq', label: language === 'bn' ? 'FAQ' : 'FAQ', icon: HelpCircle },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-20 flex items-center justify-between shrink-0 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* Brand logo & name */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          className="flex items-center cursor-pointer group h-16"
        >
          <img
            src="/tutoria_logo_animated.svg"
            alt="Tutoria Logo"
            className="h-full w-auto object-contain"
          />
        </motion.div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-3">
          
          {/* Salary Calculator Button */}
          {onOpenCalculator && (
            <button
              onClick={onOpenCalculator}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title={language === 'bn' ? 'টিউশন স্যালারি ক্যালকুলেটর' : 'Tuition Salary Calculator'}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'bn' ? 'স্যালারি ক্যালকুলেটর' : 'Salary Calc'}</span>
            </button>
          )}

          {/* PWA Install App Button */}
          {onInstallPwa && (
            <button
              onClick={onInstallPwa}
              className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title={language === 'bn' ? 'অ্যাপ ইন্সটল করুন (PWA)' : 'Install App'}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'অ্যাপ ইন্সটল' : 'Install App'}</span>
            </button>
          )}

          {/* Language pill toggle */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center space-x-1.5 border border-slate-200 rounded-full px-3 py-1 bg-slate-50 text-xs font-bold cursor-pointer hover:bg-slate-100 hover:border-emerald-300 transition-all shadow-2xs hover:scale-105 active:scale-95"
          >
            <span className={language === 'bn' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}>BN</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className={language === 'en' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}>EN</span>
          </button>

          <div className="flex items-center space-x-1 text-xs font-extrabold text-slate-600 bg-slate-50 p-1 rounded-2xl border border-slate-200/80">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(item.id as any)}
                    className="px-4 py-1.5 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ml-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </motion.button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive ? 'text-emerald-800 font-black' : 'hover:text-slate-900 text-slate-600 hover:bg-slate-100/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-200/90"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          {onOpenCalculator && (
            <button
              onClick={onOpenCalculator}
              className="p-2 text-amber-700 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer"
              title="Salary Calculator"
            >
              <Calculator className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onLanguageToggle}
            className="px-2.5 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-pointer"
          >
            {language === 'bn' ? 'English' : 'বাংলা'}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-xl px-4 py-4 space-y-2 z-50 overflow-hidden"
          >
            {onOpenCalculator && (
              <button
                onClick={() => {
                  onOpenCalculator();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>টিউশন স্যালারি ক্যালকুলেটর (Interactive Calculator)</span>
              </button>
            )}

            {onInstallPwa && (
              <button
                onClick={() => {
                  onInstallPwa();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Tutoria অ্যাপ ফোনে ইন্সটল করুন (PWA App)</span>
              </button>
            )}
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === item.id 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : item.highlight 
                    ? 'bg-emerald-600 text-white font-extrabold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
