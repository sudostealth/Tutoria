import React, { useState, useEffect } from 'react';
import { Language, TaxonomyData, LocationCoords, TuitionPost } from '../types';
import { getTranslation } from '../lib/i18n';
import { isValidBDPhone, formatBDPhone, getDistrictsForDivision, getThanasForDistrict, getSubjectsForMediumAndClass } from '../lib/bdData';
import { SearchableCombobox } from './SearchableCombobox';
import { LocationPickerMap } from './LocationPickerMap';
import { X, Copy, Check, ShieldAlert, Key, MapPin, CheckCircle, AlertCircle, ArrowRight, Loader2, Sparkles, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostTuitionModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  taxonomy: TaxonomyData | null;
  onPostCreated?: (post?: TuitionPost) => void;
  onAddTaxonomy: (type: any, key: string | undefined, value: string) => void;
  onOpenPrivacyPolicy?: () => void;
}

export const PostTuitionModal: React.FC<PostTuitionModalProps> = ({
  language,
  isOpen,
  onClose,
  taxonomy,
  onPostCreated,
  onAddTaxonomy,
  onOpenPrivacyPolicy
}) => {
  // Form State
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [isWhatsapp, setIsWhatsapp] = useState(true);
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('Dhanmondi');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<LocationCoords>({ lat: 23.7461, lng: 90.3742 });
  const [tuitionType, setTuitionType] = useState<'Offline' | 'Online' | 'Mixed'>('Offline');
  const [medium, setMedium] = useState<'Bangla' | 'English' | 'English Version' | 'Madrasa'>('Bangla');
  const [studentClass, setStudentClass] = useState('Class 9');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['General Mathematics', 'Physics']);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [preferredDays, setPreferredDays] = useState<string[]>(['Sat', 'Mon', 'Wed']);
  const [tutorGenderPref, setTutorGenderPref] = useState<'Male' | 'Female' | 'Any'>('Any');
  const [salary, setSalary] = useState<string>('6000');
  const [specialNote, setSpecialNote] = useState('');

  // Custom subject input state
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [showCustomSubjectField, setShowCustomSubjectField] = useState(false);

  // Terms agreement state
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI state
  const [phoneError, setPhoneError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPost, setCreatedPost] = useState<TuitionPost | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Geocoding & map auto-positioning states
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isAutoLocated, setIsAutoLocated] = useState(false);
  const [userHasMovedPin, setUserHasMovedPin] = useState(false);
  const [geocodingPrecision, setGeocodingPrecision] = useState<'high' | 'medium' | 'low' | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCreatedPost(null);
      setPhoneError('');
      setFormError('');
      setIsSubmitting(false);
      setAgreedToTerms(false);
      setUserHasMovedPin(false);
      setIsAutoLocated(false);
      setGeocodingPrecision(null);
    }
  }, [isOpen]);

  // Advanced Precise Geocoding Engine for Bangladeshi Urban & Rural Addresses
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      if (!thana && !district && !division) return;

      setIsGeocoding(true);

      // Clean address string
      const rawAddress = address.trim();
      const parts = rawAddress.split(',').map(s => s.trim()).filter(Boolean);

      // Construct search candidate queries from most specific to broader
      const searchQueries: { query: string; precision: 'high' | 'medium' | 'low' }[] = [];

      if (parts.length >= 2) {
        // e.g. "Road 7, Block A, DUIP Area, Mirpur 2"
        searchQueries.push({
          query: `${parts.join(' ')}, ${thana}, ${district}, Bangladesh`,
          precision: 'high'
        });
        // e.g. "DUIP Area, Mirpur 2, Mirpur, Dhaka, Bangladesh"
        searchQueries.push({
          query: `${parts.slice(-2).join(' ')}, ${thana}, ${district}, Bangladesh`,
          precision: 'high'
        });
      } else if (parts.length === 1 && parts[0].length > 3) {
        searchQueries.push({
          query: `${parts[0]}, ${thana}, ${district}, Bangladesh`,
          precision: 'high'
        });
      }

      // Medium precision: Thana + Area / Sub-area token
      if (parts.length > 0) {
        searchQueries.push({
          query: `${parts[parts.length - 1]}, ${thana}, ${district}, Bangladesh`,
          precision: 'medium'
        });
      }

      // Low precision: Thana, District
      searchQueries.push({
        query: `${thana}, ${district}, Bangladesh`,
        precision: 'low'
      });

      // Fallback District
      searchQueries.push({
        query: `${district}, ${division}, Bangladesh`,
        precision: 'low'
      });

      let found = false;

      for (const candidate of searchQueries) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(candidate.query)}&limit=1&countrycodes=bd`
          );
          const data = await response.json();

          if (data && data.length > 0 && data[0].lat && data[0].lon) {
            setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
            setIsAutoLocated(true);
            setGeocodingPrecision(candidate.precision);
            setUserHasMovedPin(false);
            found = true;
            break;
          }
        } catch (err) {
          console.warn('Geocode candidate error:', candidate.query, err);
        }
      }

      if (!found) {
        setIsAutoLocated(false);
        setGeocodingPrecision(null);
      }

      setIsGeocoding(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [division, district, thana, address, isOpen]);

  // Update district when division changes
  useEffect(() => {
    const dists = getDistrictsForDivision(division, taxonomy);
    if (dists.length > 0 && !dists.includes(district)) {
      setDistrict(dists[0]);
    }
  }, [division, taxonomy]);

  // Update thana when district changes
  useEffect(() => {
    const thanas = getThanasForDistrict(district, taxonomy);
    if (thanas.length > 0 && !thanas.includes(thana)) {
      setThana(thanas[0]);
    }
  }, [district, taxonomy]);

  // Update classes when medium changes
  useEffect(() => {
    if (taxonomy && taxonomy.classesByMedium[medium]) {
      const clsList = taxonomy.classesByMedium[medium];
      if (clsList && clsList.length > 0 && !clsList.includes(studentClass)) {
        setStudentClass(clsList[0]);
      }
    }
  }, [medium, taxonomy]);

  // Available lists
  const availableDivisions = taxonomy?.divisions || ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'];
  const availableDistricts = getDistrictsForDivision(division, taxonomy);
  const availableThanas = getThanasForDistrict(district, taxonomy);
  const availableClasses = (taxonomy?.classesByMedium && taxonomy.classesByMedium[medium]) || ['Class 1', 'Class 5', 'Class 9', 'Class 10 (SSC)', 'Class 11 (HSC 1st)'];
  
  // Dynamic subjects based on Medium + Class
  const allSubjects = getSubjectsForMediumAndClass(medium, studentClass, taxonomy);

  // Auto adjust subjects selection if current selection becomes completely invalid
  useEffect(() => {
    const validSelections = selectedSubjects.filter(s => allSubjects.includes(s));
    if (validSelections.length === 0 && allSubjects.length > 0) {
      setSelectedSubjects([allSubjects[0]]);
    }
  }, [medium, studentClass, taxonomy]);

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleAddCustomSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (!trimmed) return;

    // Save to taxonomy for exact medium + class
    const key = `${medium}__${studentClass}`;
    onAddTaxonomy('subjectsByMediumAndClass', key, trimmed);

    // Select the newly added subject
    if (!selectedSubjects.includes(trimmed)) {
      setSelectedSubjects(prev => [...prev, trimmed]);
    }

    setCustomSubjectInput('');
    setShowCustomSubjectField(false);
  };

  const togglePreferredDay = (day: string) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter(d => d !== day));
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setFormError('');

    if (!agreedToTerms) {
      setFormError('অনুগ্রহ করে গোপনীয়তা নীতি ও প্ল্যাটফর্মের নিয়মাবলীতে সম্মতি প্রদান করুন (নিচের বক্সে টিক দিন)।');
      return;
    }

    if (!isValidBDPhone(parentPhone)) {
      setPhoneError('সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      return;
    }

    if (selectedSubjects.length === 0) {
      alert('অনুগ্রহ করে অন্তত একটি বিষয় সিলেক্ট করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        parentName: parentName.trim(),
        parentPhone: formatBDPhone(parentPhone),
        isWhatsapp,
        division,
        district,
        thana,
        address,
        coords,
        tuitionType,
        medium,
        studentClass,
        subjects: selectedSubjects,
        daysPerWeek,
        preferredDays,
        tutorGenderPref,
        salary: parseInt(salary, 10) || 5000,
        specialNote
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.post) {
        setCreatedPost(data.post);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        if (onPostCreated) onPostCreated(data.post);
      } else {
        alert(data.error || 'পোস্ট করতে ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      alert('Error submitting post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyCode = () => {
    if (createdPost?.secretCode) {
      navigator.clipboard.writeText(createdPost.secretCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

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
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6 flex flex-col max-h-[92vh] cursor-default"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              {getTranslation(language, 'postModalTitle')}
            </h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              {getTranslation(language, 'postModalSub')}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close modal"
            className="p-2 text-emerald-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          
          {createdPost ? (
            /* --- SUCCESS SECRET CODE SCREEN --- */
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {getTranslation(language, 'secretCodeTitle')}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {getTranslation(language, 'postPendingAdmin')}
                </p>
              </div>

              {/* Secret Code Card */}
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-5 rounded-2xl max-w-md mx-auto space-y-3">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  আপনার গোপন কোড (Secret Code)
                </span>
                <div className="text-3xl font-mono font-black text-amber-950 tracking-widest selection:bg-amber-200">
                  {createdPost.secretCode}
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

              {/* Warning box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {getTranslation(language, 'secretCodeWarning')}
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl max-w-md mx-auto text-left flex items-start gap-3">
                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                  <strong>জরুরী:</strong> যদি ১ ঘন্টার মধ্যে আপনার টিউশন পোস্টটি এপ্রুভ (Live) না হয়, তাহলে আমাদের টেলিগ্রাম চ্যানেল ও গ্রুপে যুক্ত হোন এবং এডমিনকে মেনশন করে পোস্টটি এক্সেপ্ট করতে বলুন। (If your tuition post is not approved within 1 hour, connect to our Telegram channel and group and mention the admin to accept the post.)
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
            /* --- FORM FIELDS --- */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Parent Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'parentName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="যেমন: মোঃ কামরুল ইসলাম"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'parentPhone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={e => { setParentPhone(e.target.value); setPhoneError(''); }}
                    placeholder="01712345678"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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

              {/* Geographic Dependent Comboboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <SearchableCombobox
                  label={getTranslation(language, 'division')}
                  options={availableDivisions}
                  value={division}
                  onChange={val => setDivision(val)}
                  onAddNew={val => onAddTaxonomy('divisions', undefined, val)}
                />

                <SearchableCombobox
                  label={getTranslation(language, 'district')}
                  options={availableDistricts}
                  value={district}
                  onChange={val => setDistrict(val)}
                  onAddNew={val => onAddTaxonomy('district', division, val)}
                />

                <SearchableCombobox
                  label={getTranslation(language, 'thana')}
                  options={availableThanas}
                  value={thana}
                  onChange={val => setThana(val)}
                  onAddNew={val => onAddTaxonomy('thana', district, val)}
                />
              </div>

              {/* Address & Map Picker */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    {getTranslation(language, 'address')} <span className="text-emerald-600 font-normal">(নিখুঁত পজিশনের জন্য বিস্তারিত লিখুন)</span>
                  </label>
                  {isGeocoding && (
                    <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>ম্যাপে লোকেশন অটো-খুঁজা হচ্ছে...</span>
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="যেমন: Road 7, Block A, DUIP Area, Mirpur 2 অথবা বাড়ি/গ্রাম, ওয়ার্ড ৩, ইউনিয়ন"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white font-medium"
                />

                {/* Format Helper Pills */}
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="font-extrabold text-slate-500">ফরম্যাট উদাহরণ:</span>
                  <button
                    type="button"
                    onClick={() => setAddress('Road 7, Block A, DUIP Area, Mirpur 2')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-md border border-slate-200 transition-colors cursor-pointer"
                  >
                    শহর: Road 7, Block A, DUIP Area, Mirpur 2
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddress('হাজী বাড়ি, ওয়ার্ড ৩, ধলিয়া ইউনিয়ন')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-md border border-slate-200 transition-colors cursor-pointer"
                  >
                    গ্রাম: বাড়ি/গ্রাম, ওয়ার্ড ৩, ইউনিয়ন
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{getTranslation(language, 'mapPickerTitle')}</span>
                  </label>

                  {userHasMovedPin ? (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-blue-600" />
                      <span>📌 ম্যানুয়ালি পিন করা হয়েছে</span>
                    </span>
                  ) : isAutoLocated && geocodingPrecision === 'high' ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>🎯 নিখুঁত রোড/ব্লক লেভেল লোকেশন</span>
                    </span>
                  ) : isAutoLocated && geocodingPrecision === 'medium' ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>📍 সাব-এরিয়া / ওয়ার্ড পজিশন</span>
                    </span>
                  ) : isAutoLocated ? (
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-slate-600" />
                      <span>🏙️ থানা সেন্ট্রাল পজিশন</span>
                    </span>
                  ) : null}
                </div>

                <LocationPickerMap
                  value={coords}
                  onChange={c => {
                    setCoords(c);
                    setUserHasMovedPin(true);
                    setIsAutoLocated(false);
                  }}
                  height="190px"
                />

                <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
                  * এলাকা ও ঠিকানা লেখার সাথে সাথে ম্যাপের পিনটি নিখুঁত পজিশনে চলে যাবে। চাইলে পিন ড্র্যাগ করে নিজের পছন্দমতো সরাতে পারেন।
                </p>
              </div>

              {/* Academic details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'tuitionType')}
                  </label>
                  <select
                    value={tuitionType}
                    onChange={e => setTuitionType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="Offline">{getTranslation(language, 'typeOffline')}</option>
                    <option value="Online">{getTranslation(language, 'typeOnline')}</option>
                    <option value="Mixed">{getTranslation(language, 'typeMixed')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'medium')}
                  </label>
                  <select
                    value={medium}
                    onChange={e => setMedium(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="Bangla">Bangla Medium</option>
                    <option value="English Version">English Version</option>
                    <option value="English">English Medium</option>
                    <option value="Madrasa">Madrasa</option>
                  </select>
                </div>

                <SearchableCombobox
                  label={getTranslation(language, 'studentClass')}
                  options={availableClasses}
                  value={studentClass}
                  onChange={val => setStudentClass(val)}
                />
              </div>

              {/* Multi-select Subjects */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {getTranslation(language, 'subjects')} *
                  </label>
                  {!showCustomSubjectField && (
                    <button
                      type="button"
                      onClick={() => setShowCustomSubjectField(true)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>+ বিষয় না থাকলে যোগ করুন</span>
                    </button>
                  )}
                </div>

                {showCustomSubjectField && (
                  <div className="mb-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={customSubjectInput}
                      onChange={e => setCustomSubjectInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSubject();
                        }
                      }}
                      placeholder={`${medium} (${studentClass})-এর নতুন বিষয় লিখুন...`}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSubject}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      যোগ করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomSubjectField(false)}
                      className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl max-h-36 overflow-y-auto">
                  {allSubjects.map((sub, idx) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleSubject(sub)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Days per week & preferred days */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'daysPerWeek')}
                  </label>
                  <select
                    value={daysPerWeek}
                    onChange={e => setDaysPerWeek(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>
                        সপ্তাহে {num} দিন
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'preferredDays')} (ঐচ্ছিক)
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => togglePreferredDay(day)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                          preferredDays.includes(day)
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salary & Tutor Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'tutorGenderPref')}
                  </label>
                  <select
                    value={tutorGenderPref}
                    onChange={e => setTutorGenderPref(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="Any">{getTranslation(language, 'genderAny')}</option>
                    <option value="Male">{getTranslation(language, 'genderMale')}</option>
                    <option value="Female">{getTranslation(language, 'genderFemale')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'salary')} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1000"
                      step="500"
                      value={salary}
                      onChange={e => setSalary(e.target.value)}
                      placeholder="6000"
                      className="w-full pl-3.5 pr-12 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-bold"
                    />
                    <span className="absolute right-3.5 top-2 text-xs font-bold text-slate-400">
                      BDT
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {getTranslation(language, 'specialNote')}
                </label>
                <textarea
                  rows={2}
                  value={specialNote}
                  onChange={e => setSpecialNote(e.target.value)}
                  placeholder="যেমন: নির্দিষ্ট বিশ্ববিদ্যালয়ের ছাত্র/ছাত্রী অগ্রাধিকার পাবে, বা বিশেষ শর্ত..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              {/* Terms & Privacy Policy Acceptance Box */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="post-agreed-terms"
                  checked={agreedToTerms}
                  onChange={e => {
                    setAgreedToTerms(e.target.checked);
                    if (e.target.checked && formError.includes('গোপনীয়তা')) {
                      setFormError('');
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                />
                <label htmlFor="post-agreed-terms" className="text-xs text-slate-700 leading-snug cursor-pointer select-none">
                  আমি সংগৃহীত তথ্যের সঠিকতা নিশ্চিত করছি এবং Tutoria-র{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacyPolicy}
                    className="font-extrabold text-emerald-800 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    গোপনীয়তা নীতি, নিয়মাবলী ও আইনি সতর্কবার্তা
                  </button>
                  -তে সম্মত হয়ে টিউশন পোস্ট করছি।
                </label>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <span>প্রসেসিং হচ্ছে...</span>
                  ) : (
                    <>
                      <span>{getTranslation(language, 'submitPostBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
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
