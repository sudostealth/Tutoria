/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, TaxonomyData, SiteStats, TuitionPost } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrowseTuitions } from './components/BrowseTuitions';
import { TrackCodeView } from './components/TrackCodeView';
import { OnboardingGuide } from './components/OnboardingGuide';
import { FAQ } from './components/FAQ';
import { PostTuitionModal } from './components/PostTuitionModal';
import { ApplyTutorModal } from './components/ApplyTutorModal';
import { StatModal } from './components/StatModal';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { SalaryCalculatorModal } from './components/SalaryCalculatorModal';
import { Footer } from './components/Footer';
import { ToastContainer, ToastItem } from './components/Toast';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'post' | 'track' | 'how' | 'faq' | 'admin'>('home');

  // Taxonomy & Stats Data
  const [taxonomy, setTaxonomy] = useState<TaxonomyData | null>(null);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [taxonomyLoading, setTaxonomyLoading] = useState<boolean>(true);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [taxonomyError, setTaxonomyError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Global Toast Notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Modals & Navigation state
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [geoStatsModalOpen, setGeoStatsModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [salaryCalcModalOpen, setSalaryCalcModalOpen] = useState(false);
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string | undefined>(undefined);

  // PWA Install Event State
  const [deferredPwaPrompt, setDeferredPwaPrompt] = useState<any>(null);

  // Selected post for tutor application
  const [selectedPostForApply, setSelectedPostForApply] = useState<TuitionPost | null>(null);

  useEffect(() => {
    // Listen for PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPwaPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = () => {
    if (deferredPwaPrompt) {
      deferredPwaPrompt.prompt();
      deferredPwaPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          addToast({
            type: 'success',
            title: language === 'bn' ? 'Tutoria অ্যাপ ইন্সটল করা হচ্ছে!' : 'Installing Tutoria App!',
            message: language === 'bn' ? 'ধন্যবাদ! অ্যাপটি আপনার হোমস্ক্রিনে যুক্ত হচ্ছে।' : 'Thank you! The app is being added to your home screen.'
          });
        }
        setDeferredPwaPrompt(null);
      });
    } else {
      addToast({
        type: 'info',
        title: language === 'bn' ? 'অ্যাপ ইন্সটল নির্দেশনা (PWA)' : 'Install App Instructions',
        message: language === 'bn'
          ? 'ব্রাউজারের ৩ ডট মেনু (⋮) বা Share বোতামে ট্যাপ করে "Add to Home Screen" বা "Install App" নির্বাচন করুন।'
          : 'Tap browser 3-dots menu or Share button and select "Add to Home Screen".'
      });
    }
  };

  const addToast = (toastData: Omit<ToastItem, 'id' | 'createdAt'>) => {
    const newToast: ToastItem = {
      ...toastData,
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now()
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchTaxonomy = async (showLoading = false) => {
    if (showLoading) setTaxonomyLoading(true);
    setTaxonomyError(null);
    try {
      const res = await fetch('/api/taxonomy');
      if (res.ok) {
        const data = await res.json();
        setTaxonomy(data);
      } else {
        const errText = `Failed to load taxonomy (${res.status})`;
        console.warn(errText);
        setTaxonomyError(errText);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Network error loading taxonomy';
      console.error('Error loading taxonomy:', err);
      setTaxonomyError(errMsg);
    } finally {
      setTaxonomyLoading(false);
    }
  };

  const fetchStats = async (showLoading = false) => {
    if (showLoading) setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        const errText = `Failed to load stats (${res.status})`;
        console.warn(errText);
        setStatsError(errText);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Network error loading stats';
      console.error('Error loading site stats:', err);
      setStatsError(errMsg);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomy(true);
    fetchStats(true);
  }, []);

  // Detect secret admin URL slug (e.g. /x-admin-control)
  useEffect(() => {
    const adminSlug = (import.meta.env.VITE_ADMIN_SLUG || 'x-admin-control').replace(/^\//, '').trim().toLowerCase();

    const checkAdminRoute = () => {
      const currentPath = window.location.pathname.replace(/^\//, '').trim().toLowerCase();
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const adminQuery = searchParams.get('admin')?.toLowerCase();

      if (currentPath === adminSlug || currentHash === adminSlug || adminQuery === adminSlug) {
        setAdminPanelOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleLanguageToggle = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleAddTaxonomy = async (type: string, key: string | undefined, value: string) => {
    try {
      const res = await fetch('/api/taxonomy/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, key, value })
      });
      if (res.ok) {
        fetchTaxonomy();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyClick = (post: TuitionPost) => {
    setSelectedPostForApply(post);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Sticky Navbar */}
      <Navbar
        language={language}
        onLanguageToggle={handleLanguageToggle}
        activeTab={activeTab}
        setActiveTab={tab => {
          if (tab === 'post') {
            setPostModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAdmin={() => setAdminPanelOpen(true)}
        onOpenCalculator={() => setSalaryCalcModalOpen(true)}
        deferredPwaPrompt={deferredPwaPrompt}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <Hero
              language={language}
              stats={stats}
              taxonomy={taxonomy}
              onPostClick={() => setPostModalOpen(true)}
              onBrowseClick={(divFilter) => {
                if (typeof divFilter === 'string') {
                  setSelectedDivisionFilter(divFilter);
                } else {
                  setSelectedDivisionFilter(undefined);
                }
                setActiveTab('browse');
              }}
              onTrackClick={() => setActiveTab('track')}
              onOpenGeoStatsModal={() => setGeoStatsModalOpen(true)}
            />

            {/* Featured Tuitions Board Preview */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <BrowseTuitions
                language={language}
                taxonomy={taxonomy}
                onApplyClick={handleApplyClick}
                onAddTaxonomy={handleAddTaxonomy}
                onPostClick={() => setPostModalOpen(true)}
                initialDivision={selectedDivisionFilter}
              />
            </section>
            {/* Platform Instructions */}
            <section className="bg-white py-12 border-t border-slate-200">
              <OnboardingGuide language={language} />
            </section>

            {/* Platform FAQ Section */}
            <section className="bg-slate-50/70 py-12 border-t border-slate-200">
              <FAQ
                language={language}
                onPostClick={() => setPostModalOpen(true)}
                onBrowseClick={() => setActiveTab('browse')}
                onTrackClick={() => setActiveTab('track')}
              />
            </section>
          </div>
        )}

        {activeTab === 'browse' && (
          <BrowseTuitions
            language={language}
            taxonomy={taxonomy}
            onApplyClick={handleApplyClick}
            onAddTaxonomy={handleAddTaxonomy}
            onPostClick={() => setPostModalOpen(true)}
            initialDivision={selectedDivisionFilter}
          />
        )}

        {activeTab === 'track' && (
          <TrackCodeView language={language} />
        )}

        {activeTab === 'how' && (
          <OnboardingGuide language={language} />
        )}

        {activeTab === 'faq' && (
          <FAQ
            language={language}
            onPostClick={() => setPostModalOpen(true)}
            onBrowseClick={() => setActiveTab('browse')}
            onTrackClick={() => setActiveTab('track')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
      />

      {/* --- MODALS --- */}
      
      {/* Parent Post Tuition Request Modal */}
      <PostTuitionModal
        language={language}
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        taxonomy={taxonomy}
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
        onPostCreated={(createdPost) => {
          fetchStats();
          addToast({
            type: 'success',
            title: language === 'bn' ? 'টিউশন পোস্ট সফলভাবে সম্পন্ন হয়েছে!' : 'Tuition Request Posted Successfully!',
            message: language === 'bn'
              ? 'আপনার টিউটর পাওয়ার রিকুয়েস্টটি লাইভ প্রকাশিত হয়েছে। সিক্রেট কোডটি দিয়ে ট্র্যাক করতে পারবেন।'
              : 'Your tuition request is now live. Use your secret code to track applicant updates.',
            secretCode: createdPost?.secretCode
          });
        }}
        onAddTaxonomy={handleAddTaxonomy}
      />

      {/* Tutor Apply Modal */}
      <ApplyTutorModal
        language={language}
        post={selectedPostForApply}
        isOpen={applyModalOpen}
        onClose={() => { setApplyModalOpen(false); setSelectedPostForApply(null); }}
        taxonomy={taxonomy}
        onAddTaxonomy={handleAddTaxonomy}
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
        onApplied={(createdApp) => {
          fetchStats();
          addToast({
            type: 'success',
            title: language === 'bn' ? 'টিউটর আবেদন সফল হয়েছে!' : 'Tutor Application Submitted!',
            message: language === 'bn'
              ? 'আপনার আবেদনপত্রটি অভিভাবকের কাছে পৌঁছেছে। ট্র্যাকিং কোডটি সংগ্রহে রাখুন।'
              : 'Your application has been received. Please keep your secret tracking code safe.',
            secretCode: createdApp.secretCode
          });
        }}
      />

      {/* Geographic Breakdown Stats Modal */}
      <StatModal
        language={language}
        stats={stats}
        isOpen={geoStatsModalOpen}
        onClose={() => setGeoStatsModalOpen(false)}
      />

      {/* Admin Control Panel Modal */}
      <AdminPanel
        language={language}
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        taxonomy={taxonomy}
        onRefreshTaxonomy={fetchTaxonomy}
      />

      {/* Privacy Policy & Legal Terms Modal */}
      <PrivacyPolicyModal
        language={language}
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Interactive Salary Calculator Modal */}
      <SalaryCalculatorModal
        language={language}
        isOpen={salaryCalcModalOpen}
        onClose={() => setSalaryCalcModalOpen(false)}
        taxonomy={taxonomy}
        onOpenPostWithSalary={(estimatedSalary) => {
          setSalaryCalcModalOpen(false);
          setPostModalOpen(true);
          addToast({
            type: 'info',
            title: language === 'bn' ? 'ক্যালকুলেটেড সম্মানী যুক্ত করা হয়েছে' : 'Estimated Rate Selected',
            message: language === 'bn' ? `প্রস্তাবিত সম্মানী: ৳${estimatedSalary.toLocaleString('en-IN')}` : `Rate: ৳${estimatedSalary}`
          });
        }}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}
