import React, { useState } from 'react';
import { Language, SiteStats } from '../types';
import { getTranslation } from '../lib/i18n';
import { X, Search, MapPin, ChevronDown, ChevronRight, Building, Calendar, Users, BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';
import { StatHotspotsMap } from './StatHotspotsMap';

interface StatModalProps {
  language: Language;
  stats: SiteStats | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StatModal: React.FC<StatModalProps> = ({
  language,
  stats,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'time' | 'geo' | 'tutors'>('time');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDivisions, setExpandedDivisions] = useState<Record<string, boolean>>({ 'Dhaka': true });

  // Close modal on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleDivision = (divName: string) => {
    setExpandedDivisions(prev => ({
      ...prev,
      [divName]: !prev[divName]
    }));
  };

  const geoBreakdown = stats?.geographicBreakdown || [];
  const monthlyBreakdown = stats?.monthlyBreakdown || [];
  const yearlyBreakdown = stats?.yearlyBreakdown || [];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col cursor-default"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ডাটাবেজ স্ট্যাটিস্টিক্স ও রিয়েলটাইম কাউন্ট
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                মাসিক, বাৎসরিক, এলাকা ভিত্তিক পোস্ট এবং ইউনিক টিউটর পরিসংখ্যান
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('time')}
            className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'time'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>মাসিক ও বাৎসরিক হিসাব</span>
          </button>

          <button
            onClick={() => setActiveTab('geo')}
            className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'geo'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>এলাকা ভিত্তিক (Division/Thana)</span>
          </button>

          <button
            onClick={() => setActiveTab('tutors')}
            className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tutors'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>সংযুক্ত টিউটর সংখ্যা</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 flex-1 space-y-5">

          {/* TAB 1: TIME (Monthly & Yearly) */}
          {activeTab === 'time' && (
            <div className="space-y-6">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">মোট পোস্ট সংখ্যা</span>
                  <p className="text-2xl font-black text-emerald-800">{stats?.totalPosts || 0}</p>
                  <span className="text-[10px] text-emerald-600 font-medium block">ডাটাবেজে সংরক্ষিত</span>
                </div>
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">লাইভ পোস্ট সংখ্যা</span>
                  <p className="text-2xl font-black text-emerald-800">{stats?.totalLivePosts || 0}</p>
                  <span className="text-[10px] text-emerald-600 font-medium block">বর্তমানে লাইভ</span>
                </div>

                <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">সংযুক্ত টিউটর</span>
                  <p className="text-2xl font-black text-teal-800">{stats?.totalUniqueTutors || 0}</p>
                  <span className="text-[10px] text-teal-600 font-medium block">ইউনিক টিউটর ফোন</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">শীর্ষ বিভাগ</span>
                  <p className="text-lg font-black text-slate-800">{stats?.topDivision?.name || 'Dhaka'}</p>
                  <span className="text-[10px] text-slate-500 font-medium block">{stats?.topDivision?.count || 0} টি পোস্ট</span>
                </div>
              </div>

              {/* Yearly Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>বাৎসরিক পোস্টের হিসাব (Yearly Stats)</span>
                </h4>

                {yearlyBreakdown.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {yearlyBreakdown.map((y, i) => (
                      <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-xs font-bold text-slate-500 block">বছর</span>
                          <span className="text-lg font-black text-slate-900">{y.year}</span>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-lg">
                            {y.postCount} টি
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">কোনো বাৎসরিক তথ্য পাওয়া যায়নি</p>
                )}
              </div>

              {/* Monthly Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>মাসিক পোস্টের হিসাব (Monthly Stats)</span>
                </h4>

                {monthlyBreakdown.length > 0 ? (
                  <div className="space-y-2">
                    {monthlyBreakdown.map((m, idx) => {
                      const maxCount = Math.max(...monthlyBreakdown.map(x => x.postCount), 1);
                      const percent = Math.round((m.postCount / maxCount) * 100);

                      return (
                        <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{m.monthName}</span>
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-md">
                              {m.postCount} টি টিউশন
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(percent, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">কোনো মাসিক তথ্য পাওয়া যায়নি</p>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: GEOGRAPHIC BREAKDOWN */}
          {activeTab === 'geo' && (
            <div className="space-y-4">

              {/* Stat Hotspots Map */}
              <StatHotspotsMap language={language} stats={stats} />
              
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={getTranslation(language, 'geoSearchPlaceholder')}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {geoBreakdown.length > 0 ? (
                geoBreakdown.map((div, idx) => {
                  const isExpanded = Boolean(expandedDivisions[div.division]);
                  
                  // Filter districts / thanas if search query present
                  const filteredDistricts = div.districts.filter(dist => {
                    if (!searchTerm.trim()) return true;
                    const q = searchTerm.toLowerCase();
                    return (
                      dist.district.toLowerCase().includes(q) ||
                      dist.thanas.some(t => t.thana.toLowerCase().includes(q))
                    );
                  });

                  if (searchTerm.trim() && filteredDistricts.length === 0) {
                    return null;
                  }

                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      {/* Division Header */}
                      <button
                        onClick={() => toggleDivision(div.division)}
                        className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          )}
                          <span className="text-sm font-bold text-slate-900">{div.division} বিভাগ</span>
                        </div>
                        <span className="px-2.5 py-0.5 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-full">
                          {div.postCount} রিকুয়েস্ট
                        </span>
                      </button>

                      {/* District & Thana List */}
                      {(isExpanded || searchTerm.trim()) && (
                        <div className="p-3 divide-y divide-slate-100 bg-white">
                          {filteredDistricts.map((dist, dIdx) => (
                            <div key={dIdx} className="py-2.5 first:pt-0 last:pb-0">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <Building className="w-3.5 h-3.5 text-teal-600" />
                                  {dist.district} জেলা
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {dist.postCount} টি
                                </span>
                              </div>

                              {/* Thanas list */}
                              <div className="flex flex-wrap gap-1.5 pl-5">
                                {dist.thanas.map((thana, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-lg border border-slate-200/60"
                                  >
                                    <span>{thana.thana}</span>
                                    <span className="text-[10px] font-bold text-emerald-700">({thana.postCount})</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  কোনো ডাটা পাওয়া যায়নি
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UNIQUE TUTORS CONNECTED */}
          {activeTab === 'tutors' && (
            <div className="space-y-5">
              
              <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-emerald-200" />
                    <h4 className="text-base font-extrabold text-white">সংযুক্ত ইউনিক টিউটর পরিসংখ্যান</h4>
                  </div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-xs text-white text-xs font-bold rounded-full border border-white/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>ইউনিক নম্বর ভ্যালিডেটেড</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-white">{stats?.totalUniqueTutors || 0}</span>
                  <span className="text-emerald-100 text-xs font-medium">জন টিউটর টিউশন পোর্টালে সংযুক্ত আছেন</span>
                </div>

                <p className="text-xs text-emerald-100 leading-relaxed pt-1 border-t border-white/10">
                  সিস্টেম প্রতিটি টিউটরের ফোন নম্বর দিয়ে ইউনিক কাউন্ট নির্ধারণ করে। একই টিউটর একাধিক টিউশনে আবেদন করলেও তাকে ডাটাবেজে একবারই ইউনিক টিউটর হিসেবে গণনায় অন্তর্ভুক্ত করা হয়।
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-slate-800">টিউটর কানেকশন সুবিধা সমূহ:</h5>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>অভিভাবকের সাথে সরাসরি কোনো মিডিয়া ফি ছাড়াই স্বাধীন যোগাযোগ।</li>
                  <li>সিক্রেট কোডের মাধ্যমে নিজ আবেদনের সর্বশেষ স্ট্যাটাস রিয়েলটাইমে পর্যবেক্ষণ।</li>
                  <li>সম্পূর্ণ ফ্রী সার্ভিস ও ডিজিটাল প্ল্যাটফর্ম সেফটি।</li>
                </ul>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            {getTranslation(language, 'close')}
          </button>
        </div>

      </div>
    </div>
  );
};

