import React from 'react';
import { Language, TuitionPost } from '../types';
import { getTranslation } from '../lib/i18n';
import { 
  X, Printer, MapPin, Calendar, DollarSign, Users, BookOpen, 
  Send, Phone, ShieldCheck, Download, Share2, Check, FileText, Sparkles, Clock, MessageCircle, Copy
} from 'lucide-react';

interface TuitionDetailModalProps {
  language: Language;
  post: TuitionPost | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyClick?: (post: TuitionPost) => void;
}

export const TuitionDetailModal: React.FC<TuitionDetailModalProps> = ({
  language,
  post,
  isOpen,
  onClose,
  onApplyClick
}) => {
  const isBn = language === 'bn';
  const [copied, setCopied] = React.useState(false);

  // Keyboard shortcut (ESC) to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const handlePrint = () => {
    const printElement = document.querySelector('.printable-tuition-sheet');
    if (!printElement) {
      window.print();
      return;
    }

    try {
      const printWin = window.open('', '_blank', 'width=850,height=950');
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Tuition Request Memo #${post.id ? post.id.slice(-6) : 'FTM'}</title>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
                body {
                  font-family: 'Outfit', -apple-system, sans-serif;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  padding: 30px !important;
                  margin: 0 !important;
                }
                .no-print { display: none !important; }
                @media print {
                  body { padding: 0 !important; }
                  @page { margin: 1cm; size: auto; }
                }
              </style>
            </head>
            <body>
              <div class="printable-tuition-sheet">
                ${printElement.innerHTML}
              </div>
              <script>
                setTimeout(() => {
                  window.focus();
                  window.print();
                }, 300);
              </script>
            </body>
          </html>
        `);
        printWin.document.close();
      } else {
        window.print();
      }
    } catch (err) {
      console.error('Print window creation error:', err);
      window.print();
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString(
    isBn ? 'bn-BD' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  ) : '';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6 flex flex-col max-h-[92vh] cursor-default"
      >
        
        {/* Screen Header & Modal Action Bar (Hidden on Print) */}
        <div className="no-print p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{isBn ? 'টিউশন রিকুয়েস্ট মেমো' : 'Tuition Request Memo'}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase rounded-full">
                  ID: #{post.id.slice(-6)}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {isBn ? 'অভিভাবকের দেয়া বিস্তারিত টিউশন সারসংক্ষেপ' : 'Verified parent tuition request details'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* PRINT / PDF BUTTON */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title={isBn ? 'প্রিন্ট অথবা পিডিএফ (PDF) হিসেবে সেভ করুন' : 'Print or Save as PDF'}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isBn ? 'প্রিন্ট / PDF' : 'Print / PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTENT SHEET CONTAINER */}
        <div className="overflow-y-auto p-5 sm:p-8 flex-1 bg-slate-50/50">
          
          <div className="printable-tuition-sheet bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Memo Header - Standard Printed Official Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                    T
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Tutoria
                  </h1>
                </div>
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  {isBn ? 'বাংলাদেশ টিউটর ও অভিভাবক নেটওয়ার্ক' : 'Bangladesh Verified Tutor & Guardian Network'}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
                <p className="font-extrabold text-slate-900 text-sm">
                  {isBn ? 'টিউশন আইডি:' : 'Tuition Req ID:'} <span className="font-mono text-emerald-700">#{post.id.slice(-8)}</span>
                </p>
                <p>{isBn ? 'তারিখ:' : 'Date:'} {formattedDate}</p>
                <p className="text-[11px] text-slate-400">{isBn ? 'স্ট্যাটাস: লাইভ রিকুয়েস্ট' : 'Status: Live Request'}</p>
              </div>
            </div>

            {/* Core Highlight Banner */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-black bg-emerald-700 text-white rounded-full">
                    {post.medium}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-black bg-slate-900 text-white rounded-full">
                    {post.tuitionType === 'Offline' ? (isBn ? 'অফলাইন টিউশন' : 'Offline Tuition') : post.tuitionType === 'Online' ? (isBn ? 'অনলাইন টিউশন' : 'Online Tuition') : (isBn ? 'হাইব্রিড' : 'Mixed')}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                  {post.studentClass} {isBn ? 'শিক্ষার্থীর জন্য টিউটর প্রয়োজন' : 'Tuition Required'}
                </h2>
              </div>

              <div className="bg-white px-4 py-2.5 rounded-xl border border-emerald-200 text-right shadow-2xs w-full sm:w-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isBn ? 'মাসিক সম্মানী (Salary)' : 'Monthly Salary'}
                </span>
                <span className="text-lg sm:text-xl font-black text-emerald-700">
                  ৳{post.salary.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isBn ? 'প্রতি মাসে (নেগোশিয়েবল)' : '/ Month (Negotiable)'}
                </span>
              </div>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Location Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isBn ? 'অবস্থান ও ঠিকানা' : 'Location Details'}</span>
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {post.thana}, {post.district}
                </p>
                <p className="text-slate-600">
                  {isBn ? 'বিভাগ:' : 'Division:'} <span className="font-semibold text-slate-800">{post.division}</span>
                </p>
                {post.address && (
                  <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200 text-[11px] mt-1">
                    <strong className="text-slate-900">{isBn ? 'বিস্তারিত এলাকা:' : 'Detailed Area:'}</strong> {post.address}
                  </p>
                )}
              </div>

              {/* Subject List */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider block flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isBn ? 'পড়াতে হবে যে সকল বিষয়' : 'Subjects to Teach'}</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.subjects.map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 font-bold text-slate-800 bg-white border border-slate-300 rounded-lg text-xs shadow-2xs"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Days & Schedule */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'সাপ্তাহিক সময়সূচী' : 'Weekly Schedule'}</span>
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {isBn ? `সপ্তাহে ${post.daysPerWeek} দিন` : `${post.daysPerWeek} Days Per Week`}
                </p>
                {post.preferredDays && post.preferredDays.length > 0 && (
                  <p className="text-slate-600 text-[11px]">
                    {isBn ? 'পছন্দের দিনসমূহ:' : 'Preferred Days:'} {post.preferredDays.join(', ')}
                  </p>
                )}
              </div>

              {/* Preferences */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isBn ? 'টিউটর ও শিক্ষার্থীর অগ্রাধিকার' : 'Tutor Preference'}</span>
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {isBn ? 'পছন্দের টিউটর:' : 'Required Tutor:'}{' '}
                  <span className="text-emerald-700 font-extrabold">
                    {post.tutorGenderPref === 'Any' 
                      ? (isBn ? 'পুরুষ / মহিলা যেকোনো' : 'Male or Female') 
                      : post.tutorGenderPref === 'Male' 
                        ? (isBn ? 'শুধুমাত্র পুরুষ টিউটর' : 'Male Tutor Only') 
                        : (isBn ? 'শুধুমাত্র মহিলা টিউটর' : 'Female Tutor Only')}
                  </span>
                </p>
              </div>

            </div>

            {/* Special Notes Section */}
            {post.specialNote && (
              <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs space-y-1">
                <span className="font-extrabold text-amber-900 uppercase tracking-wider text-[10px] block">
                  {isBn ? 'বিশেষ নির্দেশাবলী / নোট:' : 'Special Instructions:'}
                </span>
                <p className="text-amber-950 font-medium leading-relaxed italic">
                  "{post.specialNote}"
                </p>
              </div>
            )}

            {/* Footer Verification Notice for Print */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {isBn ? 'Tutoria মোবাইল ভেরিফাইড পোস্ট' : 'Verified Tuition Request Memo'}
                </span>
              </div>
              <div className="text-slate-400">
                Printed via Tutoria Portal • www.tutoria.bd
              </div>
            </div>

          </div>

          {/* Action Row inside Modal (Hidden on Print) */}
          <div className="no-print mt-6 flex flex-col space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-100/80 p-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'ফেসবুক গ্রুপ বা হোয়াটসঅ্যাপে শেয়ার করুন:' : 'Share Post to Groups:'}</span>
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                {/* WhatsApp Share Button */}
                <button
                  onClick={() => {
                    const text = `📚 *Tutoria - ফ্রি টিউশন পোস্ট*\n\nশ্রেণি: ${post.studentClass} (${post.medium})\nলোকেশন: ${post.thana}, ${post.district}\nবিষয়: ${post.subjects.join(', ')}\nসম্মানী: ৳${post.salary.toLocaleString('en-IN')}/মাস (${post.daysPerWeek} দিন/সপ্তাহ)\n\nজিরো কমিশনে সরাসরি আবেদন করতে ভিজিট করুন:\n${window.location.origin}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="WhatsApp-এ পোস্টটি শেয়ার করুন"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Share</span>
                </button>

                {/* Facebook Group Share Button */}
                <button
                  onClick={() => {
                    const text = `[Tutoria] ${post.studentClass} (${post.medium}) টিউশন - ${post.thana}, ${post.district} | বেতন: ৳${post.salary.toLocaleString('en-IN')}/মাস`;
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(text)}`;
                    window.open(url, '_blank');
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Facebook Group-এ পোস্ট শেয়ার করুন"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Facebook Group</span>
                </button>

                {/* Copy Link Button */}
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'লিঙ্ক কপি' : 'Copy Link')}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 w-full">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? 'প্রিন্ট / PDF ডাউনলোড' : 'Print / Save PDF'}</span>
              </button>

              {onApplyClick && (
                <button
                  onClick={() => {
                    onClose();
                    onApplyClick(post);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isBn ? 'আবেদন করুন' : 'Apply Now'}</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
