import React, { useEffect } from 'react';
import { Language } from '../types';
import { X, ShieldAlert, ShieldCheck, Scale, Lock, AlertTriangle, FileText, CheckCircle2, Ban, PhoneCall, Gavel } from 'lucide-react';

interface PrivacyPolicyModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  const isBn = language === 'bn';

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600/30 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>{isBn ? 'গোপনীয়তা নীতি, নিয়মাবলী ও আইনি সতর্কবার্তা' : 'Privacy Policy, Terms & Legal Regulations'}</span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {isBn 
                  ? 'Tutoria প্ল্যাটফর্ম ব্যবহারের নিয়মাবলী ও নিরাপত্তা দিকনির্দেশনা'
                  : 'Rules, regulations, privacy guidelines and legal warnings for Tutoria'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
            aria-label="Close Privacy Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 font-sans text-slate-700 text-sm leading-relaxed">
          
          {/* Top Zero Commission Assurance Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-emerald-950 text-base">
                  {isBn ? '১০০% ফ্রী ও নিরাপদ কমিউনিটি প্ল্যাটফর্ম' : '100% Free & Secure Community Platform'}
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                  {isBn 
                    ? 'Tutoria-তে শিক্ষক ও অভিভাবকের মাঝে কোনো তৃতীয় পক্ষ বা মিডিয়া কমিশন নেই। কোনো টাকা লেনদেন করা লাগে না।'
                    : 'Tutoria charges zero media fees and zero commission. Direct tutor-parent matching with complete security.'}
                </p>
              </div>
            </div>
            <span className="shrink-0 px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs">
              {isBn ? 'জিরো কমিশন' : 'Zero Commission'}
            </span>
          </div>

          {/* Section 1: Rules & Regulations (করণীয় ও বর্জনীয়) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold">
                {isBn ? '১. প্ল্যাটফর্ম ব্যবহারের প্রধান নিয়মাবলী (Rules & Regulations)' : '1. Core Rules & Regulations'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Do's (করণীয়) */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'করণীয় (What You Must Do)' : 'What You Must Do'}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium list-disc list-inside">
                  <li>{isBn ? 'টিউশন পোস্ট বা টিউটর আবেদনে সবসময় সঠিক ও সত্য তথ্য প্রদান করুন।' : 'Provide accurate and honest information on all posts and applications.'}</li>
                  <li>{isBn ? 'টিউটর ও অভিভাবক উভয়েই পরস্পরের সাথে পেশাদার ও মার্জিত আচরণ বজায় রাখুন।' : 'Maintain respectful and professional communication at all times.'}</li>
                  <li>{isBn ? 'টিউশন চূড়ান্ত করার পূর্বে পারস্পরিক আলোচনা করে পড়ার সময় ও সম্মানী ঠিক করুন।' : 'Discuss subject scope, schedule, and salary clearly before starting classes.'}</li>
                  <li>{isBn ? 'যেকোনো সন্দেহজনক পোস্ট বা আইডি দেখলে সাথে সাথে আমাদের এডমিন বা টেলিগ্রাম সেন্টারে রিপোর্ট করুন।' : 'Report any suspicious activity or post immediately to our admin team.'}</li>
                </ul>
              </div>

              {/* Dont's (বর্জনীয়) */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs sm:text-sm">
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>{isBn ? 'কঠোরভাবে নিষিদ্ধ (Strictly Prohibited)' : 'Strictly Prohibited'}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium list-disc list-inside">
                  <li>{isBn ? 'কোনো ভুয়া/ফেক টিউশন পোস্ট বা মিথ্যা টিউটর অভিজ্ঞতা প্রকাশ করা সম্পূর্ণ নিষেধ।' : 'Posting fake tuition posts or false educational credentials.'}</li>
                  <li>{isBn ? 'পড়ানোর আগে কোনো প্রকার অগ্রিম টাকা, রেজিস্ট্রেশন ফি বা সিকিউরিটি মানি চাওয়া।' : 'Demanding advance money, registration fees, or security deposits.'}</li>
                  <li>{isBn ? 'অন্য কারও ছবি, ফোন নম্বর বা পরিচয় ব্যবহার করে বিভ্রান্তি সৃষ্টি করা।' : 'Using someone else\'s phone number, photo, or identity.'}</li>
                  <li>{isBn ? 'কাউকে মোবাইলে বা মেসেজে হয়রানি, অবমাননা বা অশালীন কথা বলা।' : 'Harassing, insulting, or spamming members via calls or chat.'}</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Section 2: Fraud Warning & Legal Actions */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Gavel className="w-32 h-32 text-rose-500" />
            </div>

            <div className="flex items-center gap-2.5 text-rose-400 font-black text-sm sm:text-base border-b border-slate-800 pb-3">
              <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
              <span>{isBn ? '২. জালিয়াতি প্রতিরোধ ও আইনি পদক্ষেপের হুঁশিয়ারি (Strict Legal Warnings)' : '2. Anti-Fraud Policy & Strict Legal Consequences'}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {isBn 
                ? 'Tutoria প্ল্যাটফর্ম কোনো প্রকার সাইবার অপরাধ, জালিয়াতি বা হয়রানি সহ্য করে না। নিরাপত্তা বজায় রাখতে আমাদের সিস্টেমে প্রতিটি কার্যক্রমের আইপি অ্যাড্রেস (IP Address), নেটওয়ার্ক টাইমস্ট্যাম্প এবং ব্যবহারকারীর সনাক্তকরণ তথ্য ডিজিটাল লগে সংরক্ষিত থাকে।'
                : 'Tutoria maintains zero tolerance for fraud, harassment, or cyber crime. Every submission automatically logs IP address, timestamp, and device parameters for security auditing.'}
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30 space-y-3">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{isBn ? 'প্রতারণা বা অনিয়ম করার চেষ্টা করলে গ্রহণীয় আইনি ব্যবস্থা:' : 'Legal Actions Against Fraudsters & Impersonators:'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-extrabold text-white text-xs">১. একাউন্ট ও আইপি স্থায়ী ব্যান</div>
                  <p className="text-[11px] text-slate-400">অপরাধকারীর ফোন নম্বর ও ডিভাইস আইপি নেটওয়ার্ক থেকে চিরতরে ব্লকলিস্ট করা হবে।</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-extrabold text-white text-xs">২. সাইবার পুলিশে রিপোর্ট</div>
                  <p className="text-[11px] text-slate-400">বাংলাদেশ পুলিশের সাইবার ক্রাইম ইনভেস্টিগেশন ডিভিশন ও পুলিশ সাইবার সাপোর্ট ফর উইমেনে তথ্য হস্তান্তর।</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-extrabold text-white text-xs">৩. প্রচলিত আইনে মামলা</div>
                  <p className="text-[11px] text-slate-400">সাইবার নিরাপত্তা আইন ও দণ্ডবিধির ৪২০/৪০৬ ধারায় সরাসরি আইনি মামলা গ্রহণ করা হবে।</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Data Privacy & Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold">
                {isBn ? '৩. আপনার গোপনীয়তা রক্ষা (Data Privacy & Protection)' : '3. Your Data Privacy & Protection'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'গোপন মোবাইল নম্বর সুরক্ষা' : 'Hidden Mobile Number Protection'}</span>
                </div>
                <p className="leading-relaxed">
                  {isBn 
                    ? 'সাধারণ ভিজিটরদের কাছে অভিভাবকদের মোবাইল নম্বর প্রকাশ করা হয় না। শুধুমাত্র অভিভাবক নিজে যখন কোনো টিউটরের আবেদনে সন্তুষ্ট হয়ে একসেপ্ট করবেন, তখনই উক্ত নির্দিষ্ট টিউটর নম্বর দেখতে পাবেন।'
                    : 'Parent phone numbers remain strictly hidden from general public visitors. Contact information is only unlocked when a parent explicitly accepts a tutor applicant.'}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'সিক্রেট ট্র্যাক কোড সিকিউরিটি' : 'Secret Track Code Security'}</span>
                </div>
                <p className="leading-relaxed">
                  {isBn 
                    ? 'আমাদের সিস্টেমে কোনো পাসওয়ার্ডের ঝামেলা নেই। পোস্ট বা আবেদনের সময় প্রাপ্ত নিজস্ব ইউনিক সিক্রেট কোডটি গোপন রাখুন। এই কোডের মাধ্যমে যেকোনো ডিভাইস থেকে স্টেটাস দেখা যায়।'
                    : 'No complex passwords required. Always keep your generated secret tracking code private to monitor tutor application status securely.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Reporting Helpdesk */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-extrabold text-sky-950 text-sm">
                {isBn ? 'কোনো অভিযোগ বা সন্দেহজনক আচরণ চোখে পড়েছে?' : 'Have a query, complaint or report?'}
              </h4>
              <p className="text-xs text-sky-800 font-medium">
                {isBn 
                  ? 'আমাদের টেলিগ্রাম হেল্পডেস্কে সরাসরি বার্তা পাঠিয়ে প্রতারক বা নিয়মভঙ্গকারীর বিরুদ্ধে রিপোর্ট করুন।'
                  : 'Contact our Telegram Community Helpdesk directly to report fraudulent or abusive behavior.'}
              </p>
            </div>
            <a
              href="https://t.me/+kqIyWF0RsM43MjNl"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isBn ? 'টেলিগ্রাম সাপোর্ট গ্রুপে রিপোর্ট করুন' : 'Report on Telegram'}</span>
            </a>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            {isBn ? 'সর্বশেষ হালনাগাদ: ২০২৬' : 'Last Updated: 2026'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {isBn ? 'আমি বুঝেছি ও সম্মত' : 'I Understand & Agree'}
          </button>
        </div>

      </div>
    </div>
  );
};
