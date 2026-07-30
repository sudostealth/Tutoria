import React, { useState } from 'react';
import { Language, TaxonomyData } from '../types';
import { initialTaxonomy, getDistrictsForDivision, getThanasForDistrict } from '../lib/bdData';
import { X, Calculator, DollarSign, MapPin, BookOpen, Calendar, Sparkles, TrendingUp, Info, CheckCircle2, ArrowRight } from 'lucide-react';

interface SalaryCalculatorModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  taxonomy: TaxonomyData | null;
  onOpenPostWithSalary?: (estimatedSalary: number, division: string, district: string, thana: string, medium: string, studentClass: string) => void;
}

// Thana Tier multiplier rates
const HIGH_COST_THANAS = ['dhanmondi', 'gulshan', 'banani', 'uttara', 'mirpur', 'bashundhara', 'mohammadpur', 'khulshi', 'panchlaish', 'dhanmondi R/A'];

export const SalaryCalculatorModal: React.FC<SalaryCalculatorModalProps> = ({
  language,
  isOpen,
  onClose,
  taxonomy,
  onOpenPostWithSalary
}) => {
  const isBn = language === 'bn';

  // Calculator Inputs
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('Dhanmondi');
  const [medium, setMedium] = useState('Bangla Medium');
  const [studentClass, setStudentClass] = useState('Class 9-10 (SSC)');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [isSpecialized, setIsSpecialized] = useState(true); // Higher Math/Physics/Chemistry/O-Level

  if (!isOpen) return null;

  const availableDivisions = taxonomy?.divisions || initialTaxonomy.divisions;
  const availableDistricts = getDistrictsForDivision(division, taxonomy);
  const availableThanas = getThanasForDistrict(district, taxonomy);

  // Calculation Logic
  const calculateSalary = () => {
    let basePerClass = 300; // Base rate per class in BDT

    // 1. Medium Factor
    if (medium.includes('English Medium') || medium.includes('Edexcel') || medium.includes('Cambridge')) {
      basePerClass += 250;
    } else if (medium.includes('English Version')) {
      basePerClass += 120;
    } else if (medium.includes('Madrasah')) {
      basePerClass -= 30;
    }

    // 2. Class Level Factor
    if (studentClass.includes('Class 1-5') || studentClass.includes('Pre-Primary')) {
      basePerClass += 0;
    } else if (studentClass.includes('Class 6-8')) {
      basePerClass += 80;
    } else if (studentClass.includes('Class 9-10') || studentClass.includes('SSC')) {
      basePerClass += 180;
    } else if (studentClass.includes('Class 11-12') || studentClass.includes('HSC')) {
      basePerClass += 320;
    } else if (studentClass.includes('O-Level') || studentClass.includes('A-Level')) {
      basePerClass += 450;
    } else if (studentClass.includes('Admission')) {
      basePerClass += 500;
    }

    // 3. Location / Thana Factor
    const isDhakaDivision = division.toLowerCase() === 'dhaka';
    const isHighCost = HIGH_COST_THANAS.some(t => thana.toLowerCase().includes(t) || district.toLowerCase().includes(t));

    if (isHighCost) {
      basePerClass *= 1.35;
    } else if (isDhakaDivision) {
      basePerClass *= 1.15;
    } else {
      basePerClass *= 0.85;
    }

    // 4. Subject Complexity
    if (isSpecialized) {
      basePerClass += 100;
    }

    const classesPerMonth = daysPerWeek * 4; // Approx 4 weeks
    const calculatedMonthly = Math.round(basePerClass * classesPerMonth / 100) * 100;

    const minSalary = Math.round((calculatedMonthly * 0.85) / 500) * 500;
    const maxSalary = Math.round((calculatedMonthly * 1.15) / 500) * 500;
    const avgPerClass = Math.round(calculatedMonthly / classesPerMonth);

    return {
      suggestedAvg: Math.max(3000, calculatedMonthly),
      minSalary: Math.max(2500, minSalary),
      maxSalary: Math.max(3500, maxSalary),
      avgPerClass: Math.max(250, avgPerClass),
      classesPerMonth
    };
  };

  const { suggestedAvg, minSalary, maxSalary, avgPerClass, classesPerMonth } = calculateSalary();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{isBn ? 'ইন্টারেক্টিভ টিউশন স্যালারি ক্যালকুলেটর' : 'Interactive Tuition Salary Calculator'}</span>
              </h2>
              <p className="text-xs text-emerald-300 font-medium">
                {isBn 
                  ? 'থানা, মাধ্যম ও শ্রেণি অনুযায়ী সঠিক সম্মানী বা রেট জানুন' 
                  : 'Calculate standard tuition salary ranges across different Bangladesh locations'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-sans text-slate-700 text-sm leading-relaxed">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Controls Column */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? '১. টিউশনের বিষয় ও এলাকা নির্বাচন' : '1. Tuition Details'}</span>
              </h3>

              {/* Location Selectors */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-600 mb-1 block">বিভাগ (Division)</label>
                  <select
                    value={division}
                    onChange={e => {
                      const div = e.target.value;
                      setDivision(div);
                      const dists = getDistrictsForDivision(div, taxonomy);
                      if (dists.length > 0) {
                        setDistrict(dists[0]);
                        const ths = getThanasForDistrict(dists[0], taxonomy);
                        if (ths.length > 0) setThana(ths[0]);
                      }
                    }}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {availableDivisions.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-600 mb-1 block">জেলা (District)</label>
                  <select
                    value={district}
                    onChange={e => {
                      const dist = e.target.value;
                      setDistrict(dist);
                      const ths = getThanasForDistrict(dist, taxonomy);
                      if (ths.length > 0) setThana(ths[0]);
                    }}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-600 mb-1 block">থানা / এলাকা (Thana)</label>
                <select
                  value={thana}
                  onChange={e => setThana(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {availableThanas.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Medium & Class */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-600 mb-1 block">মাধ্যম (Medium)</label>
                  <select
                    value={medium}
                    onChange={e => setMedium(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Bangla Medium">বাংলা মাধ্যম (Bangla)</option>
                    <option value="English Version">ইংলিশ ভার্সন (English Version)</option>
                    <option value="English Medium (Edexcel/Cambridge)">ইংলিশ মিডিয়াম (Edexcel/Cambridge)</option>
                    <option value="Madrasah Medium">মাদরাসা মাধ্যম</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-600 mb-1 block">শ্রেণি (Class)</label>
                  <select
                    value={studentClass}
                    onChange={e => setStudentClass(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Class 1-5 (Primary)">Class 1 - 5 (Primary)</option>
                    <option value="Class 6-8 (Middle)">Class 6 - 8 (Middle)</option>
                    <option value="Class 9-10 (SSC)">Class 9 - 10 (SSC)</option>
                    <option value="Class 11-12 (HSC)">Class 11 - 12 (HSC)</option>
                    <option value="O-Level / A-Level">O-Level / A-Level</option>
                    <option value="Admission Test Candidate">Admission Test / Varsity</option>
                  </select>
                </div>
              </div>

              {/* Days Per Week Slider */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span className="text-slate-700">সপ্তাহে কয়দিন পড়াতে হবে?</span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-lg text-xs font-black">
                    {daysPerWeek} দিন / সপ্তাহ
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={6}
                  step={1}
                  value={daysPerWeek}
                  onChange={e => setDaysPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Specialized Subject Checkbox */}
              <label className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSpecialized}
                  onChange={e => setIsSpecialized(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-800 leading-snug">
                  <strong>বিশেষ বিষয় (Science / Higher Math / Physics / Chemistry / English / Coding)</strong>
                </span>
              </label>

            </div>

            {/* Right Output Column */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <DollarSign className="w-40 h-40 text-emerald-400" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>আনুমানিক স্ট্যান্ডার্ড স্যালারি রেঞ্জ</span>
                </div>

                {/* Big Estimated Number Display */}
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/30 text-center space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">প্রস্তাবিত মাসিক সম্মানী</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                    ৳{minSalary.toLocaleString('en-IN')} - ৳{maxSalary.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-slate-300 font-medium block pt-1">
                    গড় প্রস্তাবিত: <strong className="text-white">৳{suggestedAvg.toLocaleString('en-IN')}</strong> / মাস
                  </span>
                </div>

                {/* Per Class Breakdown Card */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase">প্রতি ক্লাসের গড় মূল্য</span>
                    <p className="text-sm font-black text-white mt-0.5">৳{avgPerClass} / ক্লাস</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase">মাসে মোট ক্লাস</span>
                    <p className="text-sm font-black text-emerald-300 mt-0.5">{classesPerMonth} টি ক্লাস</p>
                  </div>
                </div>

                {/* Regional Rate Info Note */}
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/20 rounded-xl text-xs space-y-1 text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>মার্কেট এনালাইসিস:</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/90 leading-snug">
                    {thana} এলাকা ও {studentClass}-এর জন্য বাজারে স্বাভাবিক সম্মানী ৳{minSalary} থেকে ৳{maxSalary} টাকা।
                  </p>
                </div>
              </div>

              {/* Action Button: Post Tuition or Close */}
              {onOpenPostWithSalary && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPostWithSalary(suggestedAvg, division, district, thana, medium, studentClass);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>এই সম্মানীতে টিউশন পোস্ট করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>

          </div>

        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            * প্রাপ্ত স্যালারি আনুমানিক নির্দেশিকা মাত্র, অভিভাবক ও শিক্ষক আলোচনা সাপেক্ষে পরিবর্তনযোগ্য।
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
