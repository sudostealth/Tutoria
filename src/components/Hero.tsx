import React, { useState, useEffect } from 'react';
import { Language, SiteStats, TaxonomyData } from '../types';
import { getTranslation } from '../lib/i18n';
import { HeroHotspotsMap } from './HeroHotspotsMap';
import { motion } from 'motion/react';
import { PlusCircle, Search, Key, ShieldCheck, MapPin, Users, Award, FileText, ChevronRight, Sparkles, ArrowRight, CheckCircle2, Lock, Zap } from 'lucide-react';

interface HeroProps {
  language: Language;
  stats: SiteStats | null;
  taxonomy: TaxonomyData | null;
  onPostClick: () => void;
  onBrowseClick: (divisionFilter?: string) => void;
  onTrackClick: () => void;
  onOpenGeoStatsModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  stats,
  taxonomy,
  onPostClick,
  onBrowseClick,
  onTrackClick,
  onOpenGeoStatsModal
}) => {
  // Count up animations
  const [postsCount, setPostsCount] = useState(0);
  const [tutorsCount, setTutorsCount] = useState(0);
  const [quickCodeInput, setQuickCodeInput] = useState('');

  const targetPosts = stats ? (stats.totalPosts ?? 0) : 0;
  const targetTutors = stats ? (stats.totalUniqueTutors ?? 0) : 0;

  useEffect(() => {
    if (targetPosts === 0) {
      setPostsCount(0);
    } else {
      let currentP = 0;
      const stepP = Math.max(1, Math.floor(targetPosts / 20));
      const intervalP = setInterval(() => {
        currentP += stepP;
        if (currentP >= targetPosts) {
          setPostsCount(targetPosts);
          clearInterval(intervalP);
        } else {
          setPostsCount(currentP);
        }
      }, 30);
      return () => clearInterval(intervalP);
    }
  }, [targetPosts]);

  useEffect(() => {
    if (targetTutors === 0) {
      setTutorsCount(0);
    } else {
      let currentT = 0;
      const stepT = Math.max(1, Math.floor(targetTutors / 20));
      const intervalT = setInterval(() => {
        currentT += stepT;
        if (currentT >= targetTutors) {
          setTutorsCount(targetTutors);
          clearInterval(intervalT);
        } else {
          setTutorsCount(currentT);
        }
      }, 30);
      return () => clearInterval(intervalT);
    }
  }, [targetTutors]);

  const handleQuickCheck = () => {
    onTrackClick();
  };

  const isBn = language === 'bn';

  return (
    <div className="bg-slate-50 font-sans text-slate-900 border-b border-slate-200 relative overflow-hidden">
      
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/70 via-slate-50/30 to-transparent pointer-events-none -z-10" />

      {/* High Density Hero Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 p-6 md:p-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Animated Hero Text Group */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl space-y-3"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-extrabold tracking-wide shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{getTranslation(language, 'heroBadge')}</span>
            </motion.div>

            {/* Main Title with Typography Gradient Highlight */}
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight leading-[1.18]"
            >
              {isBn ? (
                <>
                  অভিভাবক ও দক্ষ টিউটরদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">সরাসরি ও বিশ্বস্ত</span> প্ল্যাটফর্ম
                </>
              ) : (
                <>
                  Bangladesh's Premier <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">Direct Platform</span> for Parents & Verified Tutors
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-2xl"
            >
              {getTranslation(language, 'heroSubtitle')}
            </motion.p>

            {/* Trust Badges Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-2 flex flex-wrap items-center gap-4 text-xs font-extrabold text-slate-700"
            >
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? '১০০% জিরো কমিশন গ্যারান্টি' : '100% Free & Zero Commission'}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200">
                <Lock className="w-4 h-4 text-slate-600" />
                <span>{isBn ? 'পাসওয়ার্ডবিহীন সিক্রেট কোড নিরাপত্তা' : 'Passwordless Access Codes'}</span>
              </div>

              <div className="flex items-center gap-1.5 text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-200/60">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>{isBn ? 'সরাসরি অভিভাবক-টিউটর যোগাযোগ' : 'Direct Parent-Tutor Connect'}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Side-by-side High-Density Stat Blocks */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 bg-slate-50/90 p-4 rounded-2xl border border-slate-200 shadow-xs shrink-0"
          >
            <div className="text-center px-2">
              <p className="text-2xl md:text-3xl font-black text-emerald-600">{postsCount}+</p>
              <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-tight">
                {getTranslation(language, 'statPosts')}
              </p>
            </div>

            <div className="text-center border-l border-slate-200 pl-4 sm:pl-6 pr-2">
              <p className="text-2xl md:text-3xl font-black text-emerald-600">{tutorsCount}+</p>
              <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-tight">
                {getTranslation(language, 'statTutors')}
              </p>
            </div>

            <div className="text-center border-l border-slate-200 pl-4 sm:pl-6 pr-2">
              <p className="text-xl md:text-2xl font-bold text-emerald-700 truncate max-w-[110px]">
                {stats?.topDivision?.name || 'Dhaka'}
              </p>
              <button 
                onClick={onOpenGeoStatsModal} 
                className="text-[10px] sm:text-xs text-slate-500 hover:text-emerald-700 uppercase font-bold tracking-tight underline cursor-pointer block"
              >
                {getTranslation(language, 'statTopDivision')}
              </button>
            </div>
          </motion.div>

        </div>
      </header>

      {/* Main High Density Action Panels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Parent CTA */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100 flex flex-col justify-between space-y-6 transition-all duration-300 border border-emerald-500/30 group"
          >
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-1.5 text-white">অভিভাবক হিসেবে পোস্ট করুন</h3>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                আপনার সন্তানের জন্য সেরা টিউটর খুঁজছেন? এখনই পোস্ট করুন, কোনো ফি বা রেজিস্ট্রেশন লাগবে না।
              </p>
            </div>
            <button
              onClick={onPostClick}
              className="w-full bg-white text-emerald-800 py-3 rounded-xl font-extrabold text-xs sm:text-sm hover:bg-emerald-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer group-hover:scale-102"
            >
              <span>{getTranslation(language, 'btnPostTuition')}</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>
          </motion.div>

          {/* Card 2: Tutor CTA */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-slate-200 flex flex-col justify-between space-y-6 transition-all duration-300 border border-slate-800 group"
          >
            <div>
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-1.5 text-white">টিউটর হিসেবে আবেদন করুন</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                আপনার পছন্দের এলাকা এবং বিষয়ের ওপর টিউশন খুঁজে সরাসরি আবেদন করুন একদম ফ্রিতে।
              </p>
            </div>
            <button
              onClick={() => onBrowseClick()}
              className="w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-extrabold text-xs sm:text-sm hover:bg-emerald-400 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer group-hover:scale-102"
            >
              <span>{getTranslation(language, 'btnApplyTutor')}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </motion.div>

          {/* Card 3: Track Code CTA */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
          >
            <div>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 border border-amber-100 group-hover:scale-110 transition-transform">
                <Key className="w-5 h-5" />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                সিক্রেট কোড দিয়ে ট্র্যাক করুন
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                অভিভাবক বা টিউটরদের আবেদন আপডেট এবং যোগাযোগের জন্য কোডটি সাবমিট করুন।
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickCodeInput}
                  onChange={e => setQuickCodeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleQuickCheck()}
                  placeholder="TUTR-P-XXXXXX"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase transition-all"
                />
                <button
                  onClick={handleQuickCheck}
                  className="bg-slate-900 hover:bg-emerald-600 px-4 py-2.5 rounded-xl text-white text-xs font-extrabold transition-all duration-300 cursor-pointer shadow-xs"
                >
                  চেক
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Realtime Geographic Tuition Hotspots Mini-Map */}
        <HeroHotspotsMap
          language={language}
          stats={stats}
          taxonomy={taxonomy}
          onBrowseClick={onBrowseClick}
          onOpenGeoStatsModal={onOpenGeoStatsModal}
        />
      </section>

    </div>
  );
};


