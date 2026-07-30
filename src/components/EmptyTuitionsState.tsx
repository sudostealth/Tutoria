import React from 'react';
import { SearchX, RefreshCw, PlusCircle, FilterX, Sparkles, MapPin, BookOpen, SlidersHorizontal } from 'lucide-react';
import { Language } from '../types';

interface EmptyTuitionsStateProps {
  language: Language;
  onResetFilters: () => void;
  onPostClick?: () => void;
  activeFilters?: {
    division?: string;
    district?: string;
    thana?: string;
    medium?: string;
    studentClass?: string;
    gender?: string;
    tuitionType?: string;
    searchTerm?: string;
  };
}

export const EmptyTuitionsState: React.FC<EmptyTuitionsStateProps> = ({
  language,
  onResetFilters,
  onPostClick,
  activeFilters
}) => {
  const isBn = language === 'bn';

  // Count active non-'all' filters
  const activeList: { label: string; value: string }[] = [];
  if (activeFilters) {
    if (activeFilters.division && typeof activeFilters.division === 'string' && activeFilters.division !== 'all') {
      activeList.push({ label: isBn ? 'বিভাগ' : 'Division', value: activeFilters.division });
    }
    if (activeFilters.district && typeof activeFilters.district === 'string' && activeFilters.district !== 'all') {
      activeList.push({ label: isBn ? 'জেলা' : 'District', value: activeFilters.district });
    }
    if (activeFilters.thana && typeof activeFilters.thana === 'string' && activeFilters.thana !== 'all') {
      activeList.push({ label: isBn ? 'থানা' : 'Thana', value: activeFilters.thana });
    }
    if (activeFilters.medium && activeFilters.medium !== 'all') {
      activeList.push({ label: isBn ? 'মাধ্যম' : 'Medium', value: activeFilters.medium });
    }
    if (activeFilters.gender && activeFilters.gender !== 'all') {
      activeList.push({
        label: isBn ? 'টিউটর' : 'Tutor',
        value: activeFilters.gender === 'Male' ? (isBn ? 'পুরুষ' : 'Male') : activeFilters.gender === 'Female' ? (isBn ? 'মহিলা' : 'Female') : activeFilters.gender
      });
    }
    if (activeFilters.tuitionType && activeFilters.tuitionType !== 'all') {
      activeList.push({ label: isBn ? 'টাইপ' : 'Type', value: activeFilters.tuitionType });
    }
    if (activeFilters.searchTerm && activeFilters.searchTerm.trim() !== '') {
      activeList.push({ label: isBn ? 'সার্চ' : 'Search', value: `"${activeFilters.searchTerm}"` });
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8 sm:p-12 text-center max-w-2xl mx-auto my-6 overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

      {/* Vector Illustration Badge */}
      <div className="relative inline-flex items-center justify-center mb-6">
        {/* Outer Pulsing Aura */}
        <div className="w-24 h-24 rounded-3xl bg-slate-100 border border-slate-200/80 flex items-center justify-center relative shadow-inner">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-2xs">
            <SearchX className="w-8 h-8 stroke-[1.75]" />
          </div>

          {/* Floating Accents */}
          <div className="absolute -top-2 -right-2 p-1.5 bg-amber-500 text-white rounded-xl shadow-md border border-amber-400 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div className="absolute -bottom-2 -left-2 p-1.5 bg-slate-800 text-slate-300 rounded-xl shadow-md border border-slate-700">
            <FilterX className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Text Content */}
      <div className="space-y-2 relative z-10">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          {isBn ? 'কোনো টিউশন পাওয়া যায়নি!' : 'No Matching Tuitions Found!'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {isBn
            ? 'আপনার নির্বাচন করা ফিল্টার বা সার্চ কিওয়ার্ডের সাথে মিল রেখে কোনো প্রস্তাবনা খুঁজে পাওয়া যায়নি। ফিল্টারগুলো রিসেট করে পুনরায় চেষ্টা করুন।'
            : 'We couldn’t find any active tuition postings matching your current search criteria or filter combinations.'}
        </p>
      </div>

      {/* Display Active Filters if Any */}
      {activeList.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 mb-2.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isBn ? 'সক্রিয় ফিল্টারসমূহ:' : 'Active Filters:'}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {activeList.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 border border-slate-200/80 text-slate-700 text-xs font-semibold rounded-full shadow-2xs"
              >
                <span className="text-slate-400 font-normal">{item.label}:</span>
                <span className="text-emerald-700 font-bold">{item.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
        <button
          onClick={onResetFilters}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isBn ? 'সকল ফিল্টার রিসেট করুন' : 'Clear All Filters'}</span>
        </button>

        {onPostClick && (
          <button
            onClick={() => onPostClick()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isBn ? 'নতুন টিউশন পোস্ট করুন' : 'Post a Tuition Request'}</span>
          </button>
        )}
      </div>

      {/* Helpful Hint */}
      <div className="mt-6 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
        <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>
          {isBn
            ? 'টিপস: পছন্দসই এলাকা বা ক্লাসের স্পেসিফিকেশন কিছুটা কমিয়ো সার্চ করুন।'
            : 'Tip: Broaden your search area or select fewer subjects to see more listings.'}
        </span>
      </div>
    </div>
  );
};
