import React, { useState, useEffect } from 'react';
import { Language, GitHubProfile } from '../types';
import { ExternalLink, CheckCircle2, Send, MessageSquare, Bell, Users, Sparkles, ShieldCheck } from 'lucide-react';

interface FooterProps {
  language: Language;
  onOpenPrivacyPolicy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenPrivacyPolicy }) => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const isBn = language === 'bn';

  useEffect(() => {
    fetch('/api/github-profile')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error('Error loading GitHub profile:', err));
  }, []);

  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-10 px-4 sm:px-8 text-slate-600 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Telegram Community Section Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-sky-400/30 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Decorative background paper plane glow */}
          <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none">
            <Send className="w-48 h-48 text-white rotate-12" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Telegram Info */}
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold text-sky-50 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span>{isBn ? 'অফিসিয়াল টেলিগ্রাম কমিউনিটি' : 'Official Telegram Community'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center lg:justify-start gap-2">
                <span>{isBn ? 'নতুন টিউশন আপডেট ও সরাসরি সাপোর্ট পেয়ে যান Telegram এ' : 'Get Live Tuition Updates & Support on Telegram'}</span>
              </h3>

              <p className="text-xs sm:text-sm text-sky-100 max-w-2xl font-medium leading-relaxed">
                {isBn 
                  ? 'আমাদের টেলিগ্রাম চ্যানেলে যোগ দিয়ে প্রতিদিনের নতুন টিউশনের নোটিফিকেশন পান। চ্যানেলে যুক্ত হয়ে সরাসরি ডিসকাশন ও সমাধান গ্রুপেও কথা বলতে পারবেন।'
                  : 'Join our Telegram Channel for instant daily tuition alerts and access our connected Discussion & Query Group for solutions.'}
              </p>
            </div>

            {/* Telegram Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              
              {/* Channel Link */}
              <a
                href="https://t.me/tutoriabd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border border-white"
              >
                <div className="w-6 h-6 bg-sky-500 rounded-lg flex items-center justify-center text-white shrink-0">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-sky-600 font-bold uppercase tracking-wider leading-none">
                    {isBn ? 'নতুন আপডেটের জন্য' : 'For New Updates'}
                  </div>
                  <div className="font-black text-sky-900 leading-tight">
                    {isBn ? 'Telegram Channel' : 'Telegram Channel'}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-sky-500 ml-1" />
              </a>

              {/* Group Link */}
              <a
                href="https://t.me/+kqIyWF0RsM43MjNl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-white shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-sky-200 font-bold uppercase tracking-wider leading-none">
                    {isBn ? 'প্রশ্ন ও সমাধানের জন্য' : 'Discussion & Query'}
                  </div>
                  <div className="font-black text-white leading-tight">
                    {isBn ? 'Telegram Discussion Group' : 'Telegram Discussion Group'}
                  </div>
                </div>
                <Users className="w-4 h-4 text-sky-200 ml-1" />
              </a>

            </div>

          </div>
        </div>

        {/* Footer Main Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 border-t border-slate-100">
          
          {/* Left Brand Info & Links */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
                T
              </div>
              <span className="text-sm font-bold text-slate-900">
                © {new Date().getFullYear()} Tutoria
              </span>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={onOpenPrivacyPolicy}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'গোপনীয়তা নীতি ও আইনি নিয়মাবলী' : 'Privacy Policy & Terms'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              বাংলাদেশের একমাত্র ১০০% বিনামূল্যে টিউশন ও টিউটর কানেকশন প্ল্যাটফর্ম। কোনো মিডিয়া ফি নেই।
            </p>
          </div>

          {/* Right GitHub Developer Widget (sudostealth) */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
            <img
              src={profile?.avatarUrl || "https://github.com/sudostealth.png"}
              alt="sudostealth"
              className="w-10 h-10 rounded-xl border border-slate-200 object-cover ring-2 ring-emerald-500/20"
            />
            <div className="space-y-0.5 text-left">
              <div className="flex items-center gap-1.5">
                <a
                  href={profile?.htmlUrl || "https://github.com/sudostealth"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span>{profile?.name || 'Sudo Stealth'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  <span>Verified Dev</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                @{profile?.username || 'sudostealth'} • GitHub API Integrated
              </p>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
