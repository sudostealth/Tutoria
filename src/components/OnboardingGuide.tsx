import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../lib/i18n';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, GraduationCap, PlusCircle, Key, PhoneCall, ShieldCheck, 
  Sparkles, CheckCircle2, ArrowRight, Copy, Check, Clock, Eye, Send, 
  Lock, Unlock, HelpCircle, RefreshCw, Zap
} from 'lucide-react';

interface OnboardingGuideProps {
  language: Language;
  onPostClick?: () => void;
  onBrowseClick?: () => void;
  onTrackClick?: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ 
  language,
  onPostClick,
  onBrowseClick,
  onTrackClick 
}) => {
  const isBn = language === 'bn';
  
  // Interactive Simulator States
  const [activeRole, setActiveRole] = useState<'parent' | 'tutor'>('parent');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatedUnlocked, setSimulatedUnlocked] = useState(false);

  // Mock code for simulator
  const sampleParentCode = "TUTR-P-782190";
  const sampleTutorCode = "TUTR-T-431802";
  const activeSampleCode = activeRole === 'parent' ? sampleParentCode : sampleTutorCode;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Badge & Title */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>{isBn ? '১০০% ফ্রি ও সহজ নিয়মাবলী' : '100% Free & Passwordless Guide'}</span>
        </motion.div>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {getTranslation(language, 'howItWorksTitle')}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          {isBn 
            ? 'কোনো অ্যাকাউন্ট খোলা, সোশ্যাল লগইন বা পাসওয়ার্ড ছাড়াই সম্পূর্ণ বিনামূল্যে কিভাবে টিউশন পোস্ট করবেন কিংবা টিউশনে আবেদন করবেন তা লাইভ টেস্ট করে দেখুন।'
            : 'Explore how our zero-password secret code marketplace operates for parents and tutors in 3 easy interactive steps.'}
        </p>

        {/* Role Selector Tabs (Parent vs Tutor) */}
        <div className="flex items-center justify-center pt-4">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-2 border border-slate-300 shadow-inner">
            <button
              onClick={() => {
                setActiveRole('parent');
                setCurrentStep(1);
                setSimulatedUnlocked(false);
              }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeRole === 'parent'
                  ? 'bg-emerald-600 text-white shadow-md scale-102'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{isBn ? 'আমি একজন অভিভাবক (Parent)' : 'I am a Parent'}</span>
            </button>

            <button
              onClick={() => {
                setActiveRole('tutor');
                setCurrentStep(1);
                setSimulatedUnlocked(false);
              }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeRole === 'tutor'
                  ? 'bg-emerald-600 text-white shadow-md scale-102'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isBn ? 'আমি একজন টিউটর (Tutor)' : 'I am a Tutor'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Step Progress Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
              {activeRole === 'parent' ? (isBn ? 'অভিভাবকদের ৩ ধাপের প্রসেস' : 'Parent 3-Step Process') : (isBn ? 'টিউটরদের ৩ ধাপের প্রসেস' : 'Tutor 3-Step Process')}
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              {currentStep === 1 
                ? (activeRole === 'parent' ? (isBn ? 'ধাপ ১: টিউশন পোস্ট ও সিক্রেট কোড লাভ' : 'Step 1: Post Request & Get Code') : (isBn ? 'ধাপ ১: পছন্দমতো টিউশনে আবেদন' : 'Step 1: Find & Apply for Tuition'))
                : currentStep === 2
                ? (activeRole === 'parent' ? (isBn ? 'ধাপ ২: সিক্রেট কোড দিয়ে টিউটর ট্র্যাকিং' : 'Step 2: Track & Review Tutors') : (isBn ? 'ধাপ ২: টিউটর কোড দিয়ে স্ট্যাটাস ট্র্যাকিং' : 'Step 2: Track Application Status'))
                : (activeRole === 'parent' ? (isBn ? 'ধাপ ৩: টিউটর পছন্দ হলে কানেক্ট আনলক' : 'Step 3: Accept Tutor & Unlock Contact') : (isBn ? 'ধাপ ৩: অভিভাবকের নম্বর পেয়ে সরাসরি কথা' : 'Step 3: Unlock Parent Contact & Connect'))}
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[1, 2, 3].map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`w-9 h-9 rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  currentStep === stepNum
                    ? 'bg-slate-900 text-white shadow-md scale-110'
                    : currentStep > stepNum
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {currentStep > stepNum ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : stepNum}
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive Interactive Simulator Content View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeRole}-${currentStep}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Explanation Column */}
            <div className="lg:col-span-6 space-y-4">
              
              {activeRole === 'parent' ? (
                <>
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                        <PlusCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {isBn ? '১. কোনো অ্যাকাউন্ট ছাড়াই ফর্ম পূরণ' : '1. Fill Tuition Details'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {isBn 
                          ? 'টিউশন পোস্ট ফর্মে আপনার সন্তানের ক্লাস (যেমন: Class 9, English Medium), বিষয়, জেলা, থানা, মাসিক সম্মানী এবং আপনার নিজস্ব ফোন নম্বর দিন।'
                          : 'Enter your child’s class, subject list, location, budget, and mobile number. No password creation required.'}
                      </p>
                      <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{isBn ? 'ফলাফল: সাথে সাথে একটি ইউনিক গোপন কোড (TUTR-P-XXXXXX) পাবেন।' : 'Result: Receive an instant Secret Tracking Code.'}</span>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                        <Key className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {isBn ? '২. সিক্রেট কোড দিয়ে আবেদনকারী দেখুন' : '2. Track Tutor Applicants'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {isBn 
                          ? '"ট্র্যাক করুন" পেজে আপনার কোডটি লিখলেই বুয়েট, ঢাবি, মেডিকেল ও শীর্ষ বিশ্ববিদ্যালয়ের শিক্ষার্থীদের আবেদনের তালিকা ও শিক্ষাগত যোগ্যতা দেখতে পাবেন।'
                          : 'Enter your code in the "Track" view to review tutor profiles, universities, departments, and experience.'}
                      </p>
                      <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{isBn ? 'সম্পূর্ণ গোপনীয়তা: আপনার ফোন নম্বর কিন্তু সাধারণ টিউটরদের কাছে হাইড থাকে।' : 'Full Privacy: Your number stays hidden from the public.'}</span>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                        <PhoneCall className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {isBn ? '৩. টিউটর অ্যাকসেপ্ট করুন ও নম্বর আনলক' : '3. Accept Tutor & Connect'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {isBn 
                          ? 'পছন্দের টিউটরের পাশে "একসেপ্ট (Accept)" বাটনে ক্লিক করার সাথে সাথে তার সাথে যোগাযোগের জন্য ফোন নম্বর আনলক হবে।'
                          : 'Click "Accept" on your chosen tutor to instantly unlock their contact details.'}
                      </p>
                      <div className="bg-teal-50 p-3.5 rounded-2xl border border-teal-200 text-xs text-teal-900 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{isBn ? 'জিরো চার্জ: অভিভাবক ও টিউটর উভয় পক্ষ থেকেই কোনো টাকা কাটা হয় না।' : 'Zero Commission: Completely free for both parties.'}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {isBn ? '১. ফিল্টার করে ফ্রি আবেদন' : '1. Find & Apply for Free'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {isBn 
                          ? '"টিউশন খুঁজুন" বোর্ডের ফিল্টার ব্যবহার করে আপনার এলাকার কাঙ্ক্ষিত টিউশন নির্বাচন করুন। "আবেদন করুন" বাটনে চাপ দিয়ে আপনার প্রাতিষ্ঠানিক তথ্য জমা দিন।'
                          : 'Filter posts by area, subject, or salary. Submit your university & experience details with 1 click.'}
                      </p>
                      <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{isBn ? 'কোনো কমিশন নেই: প্রথম মাসের বেতন বাবদ ৫০% বা সার্ভিস ফি দাবি করা হয় না।' : 'Zero Commission: No 50% first-month commission demanded.'}</span>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                        <Key className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {isBn ? '২. টিউটর ট্র্যাক কোড দিয়ে স্ট্যাটাস চেক' : '2. Track Status Live'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {isBn 
                          ? 'আবেদন শেষে পাওয়া টিউটর গোপন কোড (TUTR-T-XXXXXX) দিয়ে ট্র্যাকিং বোর্ডে আপনার আবেদনের অবস্থা চেক করুন।'
                          : 'Use your unique Tutor Secret Code to check real-time application updates.'}
                      </p>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                        <Unlock className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {isBn ? '৩. অভিভাবক একসেপ্ট করলে নম্বর আনলক' : '3. Phone Unlocks Upon Acceptance'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {isBn 
                          ? 'অভিভাবক আপনার আবেদন একসেপ্ট করার সাথে সাথে অভিভাবকের ভেরিফাইড মোবাইল নম্বর স্ক্রিনে ওপেন হবে।'
                          : 'Once the parent accepts your application, their direct mobile number unlocks automatically.'}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Navigation buttons inside simulator */}
              <div className="pt-2 flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {isBn ? 'আগের ধাপ' : 'Previous'}
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isBn ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (activeRole === 'parent' && onPostClick) onPostClick();
                      if (activeRole === 'tutor' && onBrowseClick) onBrowseClick();
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{activeRole === 'parent' ? (isBn ? 'এখনই ফ্রিতে পোস্ট করুন' : 'Post Tuition Now') : (isBn ? 'টিউশন সন্ধান করুন' : 'Browse Tuitions Now')}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {/* Right Live Visual Simulation Widget (Interactive Screen Preview) */}
            <div className="lg:col-span-6 bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 relative">
              
              {/* Simulator Device Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-[11px] font-mono text-slate-400 ml-1">tutoria.app/simulated-preview</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE DEMO
                </span>
              </div>

              {/* Simulated Screen Content matching exact step details */}
              <div className="space-y-3 font-sans text-xs">
                
                {/* PARENT FLOW STEP 1 */}
                {activeRole === 'parent' && currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-slate-300 text-[11px] font-bold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <PlusCircle className="w-4 h-4" />
                          {isBn ? '১. টিউশন পোস্ট ফর্ম জমা (নমুনা)' : '1. Submit Tuition Request'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">STEP 1/3</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-400 block text-[10px]">শ্রেণি ও মাধ্যম:</span>
                          <span className="font-bold text-slate-200">Class 9 (Bangla)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">বিষয়সমূহ:</span>
                          <span className="font-bold text-slate-200">General Math, Physics</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">অবস্থান:</span>
                          <span className="font-bold text-slate-200">Dhanmondi, Dhaka</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">সম্মানী budget:</span>
                          <span className="font-bold text-emerald-400">৳ 6,000 / মাস</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Key className="w-3.5 h-3.5" />
                          {isBn ? 'ইনস্ট্যান্ট সিক্রেট ট্র্যাক কোড' : 'Instant Secret Track Code'}
                        </span>
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">GENERATED</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-amber-500/40 font-mono font-black text-sm text-amber-300">
                        <span>{sampleParentCode}</span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি' : 'Copy')}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">
                        {isBn ? '💡 এই কোডটি নিরাপদে রাখুন! কোনো পাসওয়ার্ড ছাড়াই পরবর্তীতে টিউটরদের আবেদন দেখতে পারবেন।' : 'Keep this secret code safe to review tutor applicants later.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* PARENT FLOW STEP 2 */}
                {activeRole === 'parent' && currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-[11px]">
                        <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-mono text-amber-300 font-bold">{sampleParentCode}</span>
                        <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                          {isBn ? '২ জন টিউটর আবেদন করেছেন' : '2 Tutors Applied'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">১. আরিফ আহমেদ (BUET CSE, 3rd Year)</span>
                          <span className="text-[10px] bg-sky-950 border border-sky-500/30 text-sky-300 px-2 py-0.5 rounded">
                            {isBn ? 'অভিজ্ঞতা: ৩ বছর' : 'Exp: 3 Yrs'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>{isBn ? 'সম্মানী সম্মত: ৳ ৬,০০০/মাস' : 'Agreed Salary: ৳ 6,000/mo'}</span>
                          <span className="text-amber-400 font-bold text-[10px] flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {isBn ? 'ফোন লকিং মোড' : 'Phone Locked'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">২. নুসরাত জাহান (ঢাবি পদার্থবিজ্ঞান)</span>
                          <span className="text-[10px] bg-purple-950 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded">
                            {isBn ? 'অভিজ্ঞতা: ২ বছর' : 'Exp: 2 Yrs'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>{isBn ? 'সম্মানী সম্মত: ৳ ৬,০০০/মাস' : 'Agreed Salary: ৳ 6,000/mo'}</span>
                          <span className="text-amber-400 font-bold text-[10px] flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {isBn ? 'ফোন লকিং মোড' : 'Phone Locked'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 text-center bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      🔒 {isBn ? 'অভিভাবকের নম্বর কিন্তু সাধারণ ভিজিটরদের কাছে সম্পূর্ণ নিরাপদ থাকে।' : 'Parent number remains strictly hidden from general visitors.'}
                    </div>
                  </div>
                )}

                {/* PARENT FLOW STEP 3 */}
                {activeRole === 'parent' && currentStep === 3 && (
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-emerald-500/40 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-emerald-400" />
                          {isBn ? 'পছন্দের টিউটর: আরিফ আহমেদ (BUET)' : 'Chosen Tutor: Arif Ahmed (BUET)'}
                        </span>
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded">
                          ACCEPTED
                        </span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between text-emerald-400 font-mono font-bold text-xs">
                          <span className="flex items-center gap-1.5">
                            <Unlock className="w-4 h-4 text-emerald-400" />
                            01712-345678 ({isBn ? 'আনলকড নম্বর' : 'Unlocked Phone'})
                          </span>
                          <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                            VERIFIED
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => alert('সরাসরি টিউটরের সাথে কথা বলতে ডায়াল করুন: 01712-345678')}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>{isBn ? 'কল দিন' : 'Call Now'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alert('ওয়াটসঅ্যাপ চ্যাট শুরু করতে ডায়াল করুন: 01712-345678')}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                          >
                            <Send className="w-3 h-3 text-emerald-400" />
                            <span>{isBn ? 'WhatsApp চ্যাট' : 'WhatsApp'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-300 text-center font-semibold">
                      ✨ {isBn ? 'জিরো কমিশন! সরাসরি অভিভাবকদের সাথে আলোচনা সম্পন্ন করুন।' : 'Zero Commission! Connect directly with the tutor for free.'}
                    </div>
                  </div>
                )}

                {/* TUTOR FLOW STEP 1 */}
                {activeRole === 'tutor' && currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-slate-300 text-[11px] font-bold">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {isBn ? '১. পছন্দমতো টিউশন পোস্ট খুঁজুন' : '1. Search Live Tuition Posts'}
                        </span>
                        <span className="text-[10px] text-slate-400">BOARD PREVIEW</span>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">Class 10 (English Version)</span>
                          <span className="text-emerald-400 font-bold text-[11px]">৳ 8,000 / মাস</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          বিষয়: Physics, General Math | এলাকা: Uttara, Dhaka
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-3 rounded-2xl border border-emerald-500/30 space-y-2">
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                        {isBn ? 'বিনামূল্যে আবেদন জমা দিন:' : 'Submit Free Application:'}
                      </div>

                      <div className="space-y-1 text-[10px]">
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">
                          নাম: তানভীর রহমান (DU, Physics)
                        </div>
                        <button
                          type="button"
                          onClick={() => alert('আবেদন সফলভাবে সম্পন্ন হয়েছে!')}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                        >
                          {isBn ? '১-ক্লিকে বিনামূল্যে আবেদন করুন' : 'Submit Application Free'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TUTOR FLOW STEP 2 */}
                {activeRole === 'tutor' && currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Key className="w-3.5 h-3.5" />
                          {isBn ? 'আপনার টিউটর গোপন ট্র্যাক কোড' : 'Your Tutor Secret Track Code'}
                        </span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">SAVED</span>
                      </div>

                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-amber-500/40 font-mono font-black text-sm text-amber-300">
                        <span>{sampleTutorCode}</span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি' : 'Copy')}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-bold">{isBn ? 'আবেদনের বর্তমান স্ট্যাটাস:' : 'Application Status:'}</span>
                        <span className="text-[10px] bg-sky-950 border border-sky-500/40 text-sky-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          {isBn ? 'অভিভাবকের পর্যালোচনায়' : 'Pending Parent Review'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {isBn 
                          ? 'অভিভাবক টিউটরদের মেধা ও অভিজ্ঞতা পর্যালোচনা করছেন। একসেপ্ট করলে সাথে সাথে অভিভাবকের মোবাইল নম্বর দেখতে পাবেন।'
                          : 'Parent is reviewing tutor qualifications. Mobile number unlocks instantly upon acceptance.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* TUTOR FLOW STEP 3 */}
                {activeRole === 'tutor' && currentStep === 3 && (
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-emerald-500/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-400 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {isBn ? 'অভিভাবক আপনার আবেদন একসেপ্ট করেছেন 🎉' : 'Parent Accepted Your Application 🎉'}
                        </span>
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded">
                          UNLOCKED
                        </span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 space-y-2">
                        <div className="text-[11px]">
                          <span className="text-slate-400 block text-[10px]">{isBn ? 'অভিভাবকের নাম:' : 'Parent Name:'}</span>
                          <span className="font-bold text-white text-xs">এস. রহমান (Dhanmondi, Dhaka)</span>
                        </div>

                        <div className="flex items-center justify-between text-emerald-400 font-mono font-bold text-xs bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/30">
                          <span className="flex items-center gap-1.5">
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                            01819-876543
                          </span>
                          <span className="text-[10px] text-emerald-300 font-sans">
                            {isBn ? 'সরাসরি কল দিন' : 'Direct Call'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => alert('অভিভাবককে কল দিতে ডায়াল করুন: 01819-876543')}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>{isBn ? 'অভিভাবককে কল দিন' : 'Call Parent'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alert('অভিভাবকের সাথে ওয়াটসঅ্যাপ শুরু করতে ডায়াল করুন: 01819-876543')}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                          >
                            <Send className="w-3 h-3 text-emerald-400" />
                            <span>{isBn ? 'WhatsApp মেসেজ' : 'WhatsApp'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-[10px] text-slate-400 text-center italic">
                      💡 {isBn ? 'প্রথম মাসের ৫০% মিডিয়া ফি দাবি করা সম্পূর্ণ নিষেধ ও সম্পূর্ণ ফ্রী প্ল্যাটফর্ম।' : 'No 50% commission demanded. Tutoria is 100% free for tutors.'}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Trust & Zero-Commission Interactive Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-2 group">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {isBn ? '১০০% ফ্রি সেবা' : '100% Free Platform'}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {isBn ? 'অভিভাবক বা টিউটর কারও কাছ থেকেই কোনো মিডিয়া ফি বা হিডেন কমিশন নেওয়া হয় না।' : 'Zero media charges or registration fees for parents and tutors.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-2 group">
          <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Key className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {isBn ? 'পাসওয়ার্ডবিহীন কোড' : 'Passwordless Secret Code'}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {isBn ? 'লগইন ঝামেলামুক্ত ইউনিক গোপন কোড দিয়ে সহজেই আপনার টিউশন ও টিউটর তথ্য ট্র্যাক করুন।' : 'Track applications instantly using a single unique secret code.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-2 group">
          <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <UserCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {isBn ? 'গোপনীয়তা নিশ্চিত' : 'Strict Phone Privacy'}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {isBn ? 'আপনার সম্মতি ও একসেপ্ট ছাড়া সাধারণ টিউশন বোর্ডে অভিভাবকের নম্বর প্রকাশ পায় না।' : 'Phone numbers stay encrypted until explicit parent acceptance.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-2 group">
          <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {isBn ? 'স্মার্ট প্রিন্ট ও পিডিএফ' : 'Print / Save PDF Memo'}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {isBn ? 'যেকোনো টিউশন তথ্যের প্রফেশনাল প্রিন্টেবল মেমো কপি এক ক্লিকেই সেভ করে রাখতে পারেন।' : 'Generate printable PDF request memos in 1 click.'}
          </p>
        </div>

      </div>

    </div>
  );
};
