import React, { useState, useEffect } from 'react';
import { Language, TuitionPost, TutorApplication } from '../types';
import { getTranslation } from '../lib/i18n';
import { Key, Search, Clock, CheckCircle2, Phone, XCircle, AlertCircle, PhoneCall, ShieldCheck, Trash2, RotateCcw, Printer } from 'lucide-react';
import { TuitionDetailModal } from './TuitionDetailModal';

interface TrackCodeViewProps {
  language: Language;
  initialCode?: string;
}

export const TrackCodeView: React.FC<TrackCodeViewProps> = ({ language, initialCode }) => {
  const [secretCode, setSecretCode] = useState(initialCode || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialCode) {
      setSecretCode(initialCode);
      handleLookup(initialCode);
    }
  }, [initialCode]);

  // Loaded result state
  const [postData, setPostData] = useState<TuitionPost | null>(null);
  const [applicants, setApplicants] = useState<TutorApplication[]>([]);
  const [tutorApp, setTutorApp] = useState<TutorApplication | null>(null);
  const [hoursRemaining, setHoursRemaining] = useState<number>(5);
  const [timerExpired, setTimerExpired] = useState<boolean>(false);
  const [showParentContact, setShowParentContact] = useState<boolean>(false);

  // UI action states
  const [confirmingAppId, setConfirmingAppId] = useState<string | null>(null);
  const [actionLoadingAppId, setActionLoadingAppId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string>('');

  // Live countdown timer state for accepted tutor
  const [countdownText, setCountdownText] = useState('05:00:00');

  // Print modal state
  const [selectedPostForPrint, setSelectedPostForPrint] = useState<TuitionPost | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const handleLookup = async (codeToSearch?: string, silentRefresh: boolean = false) => {
    const code = (codeToSearch || secretCode).trim().toUpperCase();
    if (!code) return;

    if (!silentRefresh) {
      setLoading(true);
      setErrorMsg('');
      setSuccessNotice('');
      setPostData(null);
      setApplicants([]);
      setTutorApp(null);
    }

    try {
      if (code.startsWith('TUTR-P-') || code.startsWith('FTM-P-')) {
        // Parent lookup
        const res = await fetch('/api/posts/secret/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secretCode: code })
        });
        const data = await res.json();
        if (res.ok) {
          setPostData(data.post);
          setApplicants(data.applications || []);
        } else if (!silentRefresh) {
          setErrorMsg(data.error || getTranslation(language, 'invalidCodeMsg'));
        }
      } else if (code.startsWith('TUTR-T-') || code.startsWith('FTM-T-')) {
        // Tutor lookup
        const res = await fetch('/api/applications/secret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secretCode: code })
        });
        const data = await res.json();
        if (res.ok) {
          setTutorApp(data.application);
          setHoursRemaining(data.hoursRemaining || 0);
          setTimerExpired(Boolean(data.timerExpired));
          setShowParentContact(Boolean(data.showParentContact));
        } else if (!silentRefresh) {
          setErrorMsg(data.error || getTranslation(language, 'invalidCodeMsg'));
        }
      } else {
        // Try both
        const parentRes = await fetch('/api/posts/secret/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secretCode: code })
        });
        if (parentRes.ok) {
          const pData = await parentRes.json();
          setPostData(pData.post);
          setApplicants(pData.applications || []);
        } else {
          const tutorRes = await fetch('/api/applications/secret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secretCode: code })
          });
          if (tutorRes.ok) {
            const tData = await tutorRes.json();
            setTutorApp(tData.application);
            setHoursRemaining(tData.hoursRemaining || 0);
            setTimerExpired(Boolean(tData.timerExpired));
            setShowParentContact(Boolean(tData.showParentContact));
          } else if (!silentRefresh) {
            setErrorMsg(getTranslation(language, 'invalidCodeMsg'));
          }
        }
      }
    } catch (err: any) {
      if (!silentRefresh) setErrorMsg('Error looking up code: ' + err.message);
    } finally {
      if (!silentRefresh) setLoading(false);
    }
  };

  // Parent Action: Accept Applicant
  const handleAcceptApplicant = async (appId: string) => {
    if (!postData) return;
    setActionLoadingAppId(appId);
    try {
      const res = await fetch('/api/posts/secret/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretCode: postData.secretCode, applicationId: appId })
      });
      const data = await res.json();
      if (res.ok) {
        await handleLookup(postData.secretCode, true);
      } else {
        alert(data.error || 'টিউটর সিলেক্ট করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      console.error(err);
      alert('ত্রুটি: ' + err.message);
    } finally {
      setActionLoadingAppId(null);
    }
  };

  // Parent Action: Reject From Trial
  const handleRejectFromTrial = async (appId: string) => {
    if (!postData) return;
    setActionLoadingAppId(appId);
    try {
      const res = await fetch('/api/posts/secret/reject-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretCode: postData.secretCode, applicationId: appId })
      });
      const data = await res.json();
      if (res.ok) {
        await handleLookup(postData.secretCode, true);
      } else {
        alert(data.error || 'ট্রায়াল বাতিল করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      console.error(err);
      alert('ত্রুটি: ' + err.message);
    } finally {
      setActionLoadingAppId(null);
    }
  };

  // Parent Action: Reject Applicant
  const handleRejectApplicant = async (appId: string) => {
    if (!postData) return;
    setActionLoadingAppId(appId);
    try {
      const res = await fetch('/api/posts/secret/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretCode: postData.secretCode, applicationId: appId })
      });
      const data = await res.json();
      if (res.ok) {
        await handleLookup(postData.secretCode, true);
      } else {
        alert(data.error || 'আবেদন রিজেক্ট করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      console.error(err);
      alert('ত্রুটি: ' + err.message);
    } finally {
      setActionLoadingAppId(null);
    }
  };

  // Parent Action: Cancel Acceptance
  const handleCancelAcceptance = async (appId: string) => {
    if (!postData) return;
    setActionLoadingAppId(appId);
    try {
      const res = await fetch('/api/posts/secret/cancel-accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretCode: postData.secretCode, applicationId: appId })
      });
      const data = await res.json();
      if (res.ok) {
        await handleLookup(postData.secretCode, true);
      } else {
        alert(data.error || 'সিলেকশন বাতিল করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      console.error(err);
      alert('ত্রুটি: ' + err.message);
    } finally {
      setActionLoadingAppId(null);
    }
  };

  // Parent Action: Confirm & Finalize Tuition -> Deletes post from site!
  const handleConfirmFinal = async (appId: string) => {
    if (!postData) return;
    setActionLoadingAppId(appId);
    try {
      const res = await fetch('/api/posts/secret/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretCode: postData.secretCode, applicationId: appId })
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmingAppId(null);
        setPostData(null);
        setApplicants([]);
        setSecretCode('');
        setSuccessNotice('টিউশনটি সফলভাবে সম্পন্ন হয়েছে! আপনার পোস্টটি ওয়েবসাইট থেকে নামিয়ে দেওয়া হয়েছে। ধন্যবাদ!');
      } else {
        alert(data.error || 'টিউশন চূড়ান্ত করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      console.error(err);
      alert('ত্রুটি: ' + err.message);
    } finally {
      setActionLoadingAppId(null);
    }
  };

  // Live timer tick effect for tutor accepted 5-hour countdown
  useEffect(() => {
    if (!tutorApp || tutorApp.status !== 'accepted') return;

    const acceptedAtStr = tutorApp.acceptedAt || tutorApp.createdAt || new Date().toISOString();
    const acceptedTime = new Date(acceptedAtStr).getTime();

    const updateTimer = () => {
      const fiveHoursMs = 5 * 60 * 60 * 1000;
      const elapsedMs = Date.now() - acceptedTime;
      const remainingMs = fiveHoursMs - elapsedMs;

      if (remainingMs <= 0) {
        setCountdownText('00:00:00');
        setTimerExpired(true);
        setShowParentContact(true);
      } else {
        const h = Math.floor(remainingMs / (1000 * 60 * 60));
        const m = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((remainingMs % (1000 * 60)) / 1000);
        setCountdownText(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [tutorApp]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Title */}
      {!initialCode && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Key className="w-6 h-6 text-amber-500" />
              <span>{getTranslation(language, 'trackTitle')}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {getTranslation(language, 'trackSub')}
            </p>
          </div>

          {/* Input & Lookup Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={secretCode}
              onChange={e => setSecretCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              placeholder={getTranslation(language, 'inputSecretPlaceholder')}
              className="flex-1 px-4 py-3 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-amber-500 uppercase tracking-widest"
            />
            <button
              onClick={() => handleLookup()}
              disabled={loading}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <span>চেক হচ্ছে...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{getTranslation(language, 'btnCheckStatus')}</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}
        </div>
      )}

      {initialCode && errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {initialCode && successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* --- PARENT VIEW --- */}
      {postData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Post Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {getTranslation(language, 'parentPostOverview')}
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPostForPrint(postData);
                    setPrintModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="মেমো প্রিন্ট অথবা পিডিএফ (PDF) ডাউনলোড করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'মেমো প্রিন্ট / PDF' : 'Print Memo / PDF'}</span>
                </button>

                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  postData.status === 'live'
                    ? 'bg-emerald-100 text-emerald-800'
                    : postData.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  স্ট্যাটাস: {postData.status === 'live' ? 'সক্রিয় (Live)' : 'পেন্ডিং (Admin Review)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">শ্রেণী & মাধ্যম</span>
                <span className="font-bold text-slate-800">{postData.studentClass} ({postData.medium})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">এলাকা</span>
                <span className="font-bold text-slate-800">{postData.thana}, {postData.district}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">মাসিক সম্মানী</span>
                <span className="font-bold text-emerald-700">৳{postData.salary.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">আবেদনকারী</span>
                <span className="font-bold text-slate-800">{applicants.length} জন টিউটর</span>
              </div>
            </div>
          </div>

          {/* Applicants List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {getTranslation(language, 'applicantsListTitle')} ({applicants.length})
            </h3>

            {applicants.length > 0 ? (
              <div className="space-y-4">
                {applicants.map(app => (
                  <div
                    key={app.id}
                    className={`p-4 rounded-xl border transition-all ${
                      app.status === 'trial' || app.status === 'accepted'
                        ? 'bg-emerald-50/80 border-emerald-400'
                        : app.status === 'rejected' || app.status === 'rejected_from_trial'
                        ? 'bg-rose-50/50 border-rose-200 opacity-80'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{app.tutorName}</h4>
                          {(app.status === 'trial' || app.status === 'accepted') && (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>ট্রায়ালে নির্বাচিত (Trial)</span>
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-full flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>রিজেক্টেড (Rejected)</span>
                            </span>
                          )}
                          {app.status === 'rejected_from_trial' && (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-full flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>ট্রায়াল থেকে রিজেক্টেড (Rejected from Trial)</span>
                            </span>
                          )}
                          {app.status === 'pending' && (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                              পেন্ডিং (Pending)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {app.studyStatus === 'studying'
                            ? `${app.studyLevel} — ${app.institution} (${app.department})`
                            : app.completedDegree}
                        </p>
                      </div>

                      {/* Parent Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {actionLoadingAppId === app.id ? (
                          <span className="text-xs font-bold text-slate-500 animate-pulse px-3 py-1 bg-slate-200 rounded-lg">
                            প্রসেসিং হচ্ছে...
                          </span>
                        ) : app.status === 'trial' || app.status === 'accepted' ? (
                          <>
                            <button
                              onClick={() => handleCancelAcceptance(app.id)}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                              title="সিলেকশন বাতিল করুন"
                            >
                              সিলেকশন বাতিল
                            </button>
                            <button
                              onClick={() => handleRejectFromTrial(app.id)}
                              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>ট্রায়াল থেকে রিজেক্ট</span>
                            </button>
                            <button
                              onClick={() => setConfirmingAppId(confirmingAppId === app.id ? null : app.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>টিউশন চূড়ান্ত করুন</span>
                            </button>
                          </>
                        ) : app.status === 'rejected' || app.status === 'rejected_from_trial' ? (
                          <button
                            onClick={() => handleAcceptApplicant(app.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>পুনরায় ট্রায়ালের জন্য সিলেক্ট করুন</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRejectApplicant(app.id)}
                              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>রিজেক্ট করুন</span>
                            </button>
                            {postData.status !== 'trial' && postData.status !== 'accepted' && (
                              <button
                                onClick={() => handleAcceptApplicant(app.id)}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>ট্রায়ালের জন্য সিলেক্ট করুন</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Inline confirmation panel for Finalizing Tuition */}
                    {confirmingAppId === app.id && (
                      <div className="mt-3 p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-950">
                            <strong className="block text-sm font-bold text-amber-900 mb-0.5">
                              আপনি কি নিশ্চিত যে টিউশনটি চূড়ান্ত করতে চান?
                            </strong>
                            এই টিউটরের সাথে কথা বলে টিউশনটি নিশ্চিত করা হলে আপনার পোস্টটি স্থায়ীভাবে সম্পন্ন হয়ে সাইট থেকে উঠে যাবে।
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setConfirmingAppId(null)}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg transition-colors"
                          >
                            ফিরে যান
                          </button>
                          <button
                            onClick={() => handleConfirmFinal(app.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>হ্যাঁ, টিউশন চূড়ান্ত করুন</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Show Tutor Phone if accepted / in trial */}
                    {(app.status === 'trial' || app.status === 'accepted') && (
                      <div className="mt-3 p-3 bg-white border border-emerald-300 rounded-xl space-y-1">
                        <p className="text-xs font-bold text-emerald-900">
                          {getTranslation(language, 'pleaseCallTutor')}
                        </p>
                        <a
                          href={`tel:${app.tutorPhone}`}
                          className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 hover:underline"
                        >
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <span>{app.tutorPhone} {app.isWhatsapp ? '(WhatsApp আছে)' : ''}</span>
                        </a>
                      </div>
                    )}

                    {/* Experience text */}
                    <div className="mt-2 text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-100">
                      <strong>অভিজ্ঞতা:</strong> {app.experience}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                {getTranslation(language, 'noApplicantsYet')}
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- TUTOR VIEW --- */}
      {tutorApp && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {getTranslation(language, 'tutorAppStatus')}
              </h3>
              <p className="text-xs text-slate-500">
                আবেদনকারী: <strong className="text-slate-800">{tutorApp.tutorName}</strong>
              </p>
            </div>

            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              tutorApp.status === 'trial' || tutorApp.status === 'accepted'
                ? 'bg-emerald-100 text-emerald-800'
                : tutorApp.status === 'pending'
                ? 'bg-amber-100 text-amber-800'
                : tutorApp.status === 'confirmed'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {tutorApp.status === 'trial' || tutorApp.status === 'accepted'
                ? 'ট্রায়ালে (In Trial)'
                : tutorApp.status === 'pending'
                ? 'পেন্ডিং (Pending)'
                : tutorApp.status === 'confirmed'
                ? 'সম্পন্ন (Confirmed)'
                : tutorApp.status === 'rejected_from_trial'
                ? 'ট্রায়াল বাতিল (Trial Rejected)'
                : 'বাতিল (Declined)'}
            </span>
          </div>

          {/* Conditional Messaging */}

          {/* Case 1: Pending */}
          {tutorApp.status === 'pending' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium space-y-1">
              <p className="font-bold">{getTranslation(language, 'statusPending')}</p>
              {tutorApp.postInfo?.status === 'trial' || tutorApp.postInfo?.status === 'accepted' ? (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                  <strong className="block mb-1 text-sm">অন্যান্য টিউটর ট্রায়ালে আছেন (Another Tutor in Trial)</strong>
                  অভিভাবক বর্তমানে অন্য একজন টিউটরের সাথে কথা বলছেন বা ট্রায়াল নিচ্ছেন। যদি তিনি চূড়ান্ত না হন, তবে আপনার সুযোগ আসতে পারে। অনুগ্রহ করে অপেক্ষা করুন।
                </div>
              ) : (
                <p>অভিভাবক আপনার আবেদন খতিয়ে দেখছেন। অভিভাবক পছন্দ করলে আপনাকে এই পেজে বা ফোনে অবহিত করবেন।</p>
              )}
            </div>
          )}

          {/* Case 2: Rejected from trial */}
          {tutorApp.status === 'rejected_from_trial' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-medium space-y-1">
              <p className="font-bold">আপনার ট্রায়াল বাতিল করা হয়েছে (Trial Rejected)</p>
              <p>অভিভাবক ট্রায়াল পিরিয়ড শেষে আপনাকে নির্বাচন করেননি। অনুগ্রহ করে অন্য টিউশন পোস্টে আবেদন করুন।</p>
            </div>
          )}

          {/* Case 3: Accepted / Trial (5-Hour Countdown Timer) */}
          {(tutorApp.status === 'trial' || tutorApp.status === 'accepted') && (
            <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-emerald-600 animate-pulse shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    অভিভাবক আপনাকে ট্রায়ালের জন্য পছন্দ করেছেন!
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    {getTranslation(language, 'acceptedTimerNotice')}
                  </p>
                </div>
              </div>

              {/* 5-Hour Timer Box */}
              {!timerExpired ? (
                <div className="bg-white p-4 rounded-xl border border-emerald-200 text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    অভিভাবকের সরাসরি ফোন নম্বর প্রকাশের বাকী সময়
                  </span>
                  <div className="text-3xl font-mono font-black text-emerald-700 tracking-widest">
                    {countdownText}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    (অভিভাবক আপনাকে সরাসরি কল দিতে পারেন, বা ৫ ঘণ্টা অতিবাহিত হলে আপনি কল দিতে পারবেন)
                  </p>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-emerald-300 text-center space-y-2">
                  <span className="text-xs font-bold text-emerald-800 block">
                    {getTranslation(language, 'timerExpiredNotice')}
                  </span>
                  {tutorApp.postInfo?.parentPhone && (
                    <a
                      href={`tel:${tutorApp.postInfo.parentPhone}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{tutorApp.postInfo.parentName}: {tutorApp.postInfo.parentPhone}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Case 3: Confirmed / Taken by another tutor */}
          {tutorApp.status === 'confirmed' && (
            <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-900 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <span>টিউশনটি সম্পন্ন হয়েছে</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                {getTranslation(language, 'confirmedOtherNotice')}
              </p>
            </div>
          )}

          {/* Case 4: Rejected */}
          {tutorApp.status === 'rejected' && (
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium">
              অভিভাবক অন্য একজন টিউটর নির্বাচন করেছেন। নতুন অন্যান্য পোস্টগুলোতে আবেদন করার অনুরোধ করা হচ্ছে।
            </div>
          )}

        </div>
      )}

      {/* Tuition Request Printable Detail Modal */}
      <TuitionDetailModal
        language={language}
        post={selectedPostForPrint}
        isOpen={printModalOpen}
        onClose={() => {
          setPrintModalOpen(false);
          setSelectedPostForPrint(null);
        }}
      />

    </div>
  );
};
