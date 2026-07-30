import React, { useState } from 'react';
import { Language, TaxonomyData, TuitionPost, TutorApplication } from '../types';
import { getTranslation } from '../lib/i18n';
import { isValidBDPhone, formatBDPhone } from '../lib/bdData';
import { SearchableCombobox } from './SearchableCombobox';
import { X, Copy, Check, ShieldAlert, Key, CheckCircle, AlertCircle, Send, GraduationCap, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplyTutorModalProps {
  language: Language;
  post: TuitionPost | null;
  isOpen: boolean;
  onClose: () => void;
  taxonomy: TaxonomyData | null;
  onAddTaxonomy: (type: any, key: string | undefined, value: string) => void;
  onApplied?: (app: TutorApplication) => void;
  onOpenPrivacyPolicy?: () => void;
}

export const ApplyTutorModal: React.FC<ApplyTutorModalProps> = ({
  language,
  post,
  isOpen,
  onClose,
  taxonomy,
  onAddTaxonomy,
  onApplied,
  onOpenPrivacyPolicy
}) => {
  const [tutorName, setTutorName] = useState('');
  const [tutorPhone, setTutorPhone] = useState('');
  const [isWhatsapp, setIsWhatsapp] = useState(true);
  const [studyStatus, setStudyStatus] = useState<'studying' | 'completed'>('studying');
  
  // If studying
  const [studyLevel, setStudyLevel] = useState('Undergraduate (Honours)');
  const [institution, setInstitution] = useState('Bangladesh University of Engineering and Technology (BUET)');
  const [department, setDepartment] = useState('Computer Science & Engineering (CSE)');
  
  // If completed
  const [completedDegree, setCompletedDegree] = useState('');
  
  const [experience, setExperience] = useState('');

  // Terms agreement state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // UI state
  const [phoneError, setPhoneError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdApp, setCreatedApp] = useState<TutorApplication | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Reset state whenever modal opens or active post changes
  React.useEffect(() => {
    if (isOpen) {
      setCreatedApp(null);
      setPhoneError('');
      setFormError('');
      setIsSubmitting(false);
      setAgreedToTerms(false);
    }
  }, [isOpen, post?.id]);

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

  if (!isOpen || !post) return null;

  const availableInstitutions = taxonomy?.institutions || [
    'University of Dhaka', 'Bangladesh University of Engineering and Technology (BUET)', 'Rajshahi University of Engineering & Technology (RUET)', 'Notre Dame College', 'Rajuk Uttara Model College'
  ];

  const availableDepartments = taxonomy?.departments || [
    'Computer Science & Engineering (CSE)', 'Electrical & Electronic Engineering (EEE)', 'Physics', 'Mathematics', 'Medicine (MBBS)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setFormError('');

    if (!agreedToTerms) {
      setFormError('অনুগ্রহ করে গোপনীয়তা নীতি ও প্ল্যাটফর্মের নিয়মাবলীতে সম্মতি প্রদান করুন (নিচের বক্সে টিক দিন)।');
      return;
    }

    if (!tutorName.trim()) {
      setFormError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    if (!isValidBDPhone(tutorPhone)) {
      setPhoneError('সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      return;
    }

    if (!experience.trim()) {
      setFormError('অনুগ্রহ করে আপনার অভিজ্ঞতা ও দক্ষতা সংক্ষেপে লিখুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        postId: post.id,
        tutorName: tutorName.trim(),
        tutorPhone: formatBDPhone(tutorPhone),
        isWhatsapp,
        studyStatus,
        studyLevel: studyStatus === 'studying' ? studyLevel : '',
        institution: studyStatus === 'studying' ? institution : '',
        department: studyStatus === 'studying' ? department : '',
        completedDegree: studyStatus === 'completed' ? completedDegree : '',
        experience: experience.trim()
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.application) {
        setCreatedApp(data.application);
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
        if (onApplied) onApplied(data.application);
      } else {
        setFormError(data.error || 'আবেদন জমা দেওয়া সম্ভব হয়নি। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setFormError('আবেদন জমা দেওয়ার সময় সমস্যা হয়েছে: ' + (err.message || 'Network Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (createdApp?.secretCode) {
      navigator.clipboard.writeText(createdApp.secretCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-6 flex flex-col max-h-[90vh] cursor-default"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-teal-950 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              {getTranslation(language, 'applyModalTitle')}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {post.studentClass} ({post.medium}) — {post.thana}, {post.district} (সম্মানী: ৳{post.salary})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              title={language === 'bn' ? 'প্রিন্ট অথবা পিডিএফ (PDF) সেভ করুন' : 'Print or Save as PDF'}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close modal"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          {createdApp ? (
            /* --- TUTOR SECRET CODE SCREEN --- */
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  আবেদন সফলভাবে জমা হয়েছে!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  অভিভাবক আপনার আবেদন পর্যালোচনা করবেন। আপনার আবেদনের আপডেট ও যোগাযোগ তথ্য দেখতে এই গোপন কোড ব্যবহার করুন।
                </p>
              </div>

              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-5 rounded-2xl max-w-md mx-auto space-y-3">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  আপনার আবেদনের গোপন কোড (Tutor Secret Code)
                </span>
                <div className="text-3xl font-mono font-black text-amber-950 tracking-widest">
                  {createdApp.secretCode}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  {codeCopied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{getTranslation(language, 'codeCopied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{getTranslation(language, 'copyCode')}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {getTranslation(language, 'secretCodeWarning')}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  ঠিক আছে (সম্পন্ন)
                </button>
              </div>
            </div>
          ) : (
            /* --- FORM --- */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Tutor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'tutorName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={tutorName}
                    onChange={e => setTutorName(e.target.value)}
                    placeholder="আপনার পুরো নাম"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'tutorPhone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={tutorPhone}
                    onChange={e => { setTutorPhone(e.target.value); setPhoneError(''); }}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                  />
                  {phoneError && (
                    <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {phoneError}
                    </p>
                  )}
                  <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isWhatsapp}
                      onChange={e => setIsWhatsapp(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">
                      {getTranslation(language, 'isWhatsapp')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Studying Status */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {getTranslation(language, 'studyStatus')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStudyStatus('studying')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      studyStatus === 'studying'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {getTranslation(language, 'studying')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudyStatus('completed')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      studyStatus === 'completed'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {getTranslation(language, 'completed')}
                  </button>
                </div>
              </div>

              {studyStatus === 'studying' ? (
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {getTranslation(language, 'studyLevel')}
                    </label>
                    <select
                      value={studyLevel}
                      onChange={e => setStudyLevel(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                    >
                      <option value="Undergraduate (Honours)">Undergraduate / Honours (রানিং)</option>
                      <option value="Postgraduate (Masters)">Postgraduate / Masters (রানিং)</option>
                      <option value="HSC Passed / Admission Candidate">HSC পাস / অ্যাডমিশন ক্যান্ডিডেট</option>
                      <option value="Diploma / Polytechnic">ডিপ্লোমা / পলিটেকনিক</option>
                    </select>
                  </div>

                  <SearchableCombobox
                    label={getTranslation(language, 'institution')}
                    options={availableInstitutions}
                    value={institution}
                    onChange={val => setInstitution(val)}
                    onAddNew={val => onAddTaxonomy('institutions', undefined, val)}
                  />

                  <SearchableCombobox
                    label={getTranslation(language, 'department')}
                    options={availableDepartments}
                    value={department}
                    onChange={val => setDepartment(val)}
                    onAddNew={val => onAddTaxonomy('departments', undefined, val)}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'completedDegreeDesc')}
                  </label>
                  <textarea
                    rows={2}
                    value={completedDegree}
                    onChange={e => setCompletedDegree(e.target.value)}
                    placeholder="যেমন: B.Sc. in CSE from BUET (2022)"
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {getTranslation(language, 'experience')} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="আপনার টিউশন অভিজ্ঞতা, পড়ানোর ধরণ ও বিষয়ভিত্তিক দক্ষতা সম্পর্কে সংক্ষেপে লিখুন..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              {/* Terms & Privacy Policy Acceptance Box */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="apply-agreed-terms"
                  checked={agreedToTerms}
                  onChange={e => {
                    setAgreedToTerms(e.target.checked);
                    if (e.target.checked && formError.includes('গোপনীয়তা')) {
                      setFormError('');
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                />
                <label htmlFor="apply-agreed-terms" className="text-xs text-slate-700 leading-snug cursor-pointer select-none">
                  আমি প্রদত্ত সকল তথ্যের সত্যতা নিশ্চিত করছি এবং Tutoria-র{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacyPolicy}
                    className="font-extrabold text-emerald-800 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    গোপনীয়তা নীতি, নিয়মাবলী ও আইনি সতর্কবার্তা
                  </button>
                  -তে সম্মত হয়ে টিউটর আবেদন জমা দিচ্ছি।
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <span>জমা দেওয়া হচ্ছে...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{getTranslation(language, 'submitApplyBtn')}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
