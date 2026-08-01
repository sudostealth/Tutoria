import React, { useState, useEffect } from 'react';
import { Language, TuitionPost, TaxonomyData, SiteStats } from '../types';
import { getTranslation } from '../lib/i18n';
import { ShieldCheck, Lock, CheckCircle, XCircle, Search, Key, Database, BarChart3, RefreshCw, X, AlertCircle, ExternalLink } from 'lucide-react';
import { TrackCodeView } from './TrackCodeView';

interface AdminPanelProps {
  language: Language;
  taxonomy: TaxonomyData | null;
  onRefreshTaxonomy: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  language,
  taxonomy,
  onRefreshTaxonomy
}) => {
  const [email, setEmail] = useState(() => import.meta.env.VITE_ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'live' | 'recovery' | 'taxonomy' | 'stats'>('pending');

  // Pending Posts
  const [pendingPosts, setPendingPosts] = useState<TuitionPost[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // Live Posts
  const [livePosts, setLivePosts] = useState<TuitionPost[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);

  // Recovery State
  const [recoveryQuery, setRecoveryQuery] = useState('');
  const [recoveryType, setRecoveryType] = useState<'parent' | 'tutor'>('parent');
  const [recoveryResults, setRecoveryResults] = useState<{ posts?: TuitionPost[]; applications?: any[] }>({});
  const [manageCode, setManageCode] = useState<string | null>(null);

  // Site Stats
  const [stats, setStats] = useState<SiteStats | null>(null);

  // New taxonomy input
  const [customTaxVal, setCustomTaxVal] = useState('');
  const [customTaxType, setCustomTaxType] = useState<'institutions' | 'departments'>('institutions');

  // Verify stored token on mount
  useEffect(() => {
    if (adminToken) {
      fetchPendingPosts(adminToken);
      fetchLivePosts(adminToken);
      fetchSiteStats();
    }
  }, [adminToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAdminToken(data.token);
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        fetchPendingPosts(data.token);
        fetchLivePosts(data.token);
        fetchSiteStats();
      } else {
        setAuthError(data.error || 'ভুল ইমেইল অথবা পাসওয়ার্ড!');
      }
    } catch (err) {
      setAuthError('লগইন করতে ব্যর্থ হয়েছে। নেটওয়ার্ক চেক করুন।');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setIsAuthenticated(false);
    setPassword('');
  };

  const fetchPendingPosts = async (tokenOverride?: string) => {
    const token = tokenOverride || adminToken;
    if (!token) return;
    setLoadingPending(true);
    try {
      const res = await fetch('/api/admin/pending-posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingPosts(data);
        setIsAuthenticated(true);
      } else if (res.status === 401) {
        handleLogout();
        setAuthError('সেশন মেয়াদোত্তীর্ণ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchLivePosts = async (tokenOverride?: string) => {
    const token = tokenOverride || adminToken;
    if (!token) return;
    setLoadingLive(true);
    try {
      const res = await fetch('/api/admin/live-posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLivePosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLive(false);
    }
  };

  const fetchSiteStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePost = async (id: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/approve-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchPendingPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPost = async (id: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/reject-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchPendingPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecoverySearch = async () => {
    if (!recoveryQuery.trim() || !adminToken) return;
    try {
      const res = await fetch('/api/admin/recover-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ query: recoveryQuery, type: recoveryType })
      });
      if (res.ok) {
        const data = await res.json();
        setRecoveryResults(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTaxonomy = async () => {
    if (!customTaxVal.trim() || !adminToken) return;
    try {
      const res = await fetch('/api/taxonomy/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ type: customTaxType, value: customTaxVal.trim() })
      });
      if (res.ok) {
        setCustomTaxVal('');
        onRefreshTaxonomy();
        alert('সফলভাবে যুক্ত করা হয়েছে!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-base md:text-lg font-bold text-white">
                {getTranslation(language, 'adminTitle')}
              </h2>
              <p className="text-xs text-slate-400">
                সাইট অনুমোদন, সিক্রেট কোড রিকভারি ও ডাটা মডারেশন
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                লগআউট
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {!isAuthenticated ? (
            /* Admin Auth Screen */
            <form onSubmit={handleLogin} className="max-w-md mx-auto py-8 space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">
                  {getTranslation(language, 'adminLoginTitle')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  এডমিন ইমেইল ও পাসওয়ার্ড প্রদান করুন
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    এডমিন ইমেইল
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@tutoria.bd"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {getTranslation(language, 'adminPassLabel')}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {authError && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}

              <button
                type="submit"

                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                {getTranslation(language, 'btnLogin')}
              </button>
            </form>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="space-y-6">
              
              {/* Tab navigation */}
              <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-1">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                    activeTab === 'pending'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>পেন্ডিং অনুমোদন ({pendingPosts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                    activeTab === 'live'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>লাইভ পোস্ট ({livePosts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('recovery')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                    activeTab === 'recovery'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>কোড রিকভারি</span>
                </button>

                <button
                  onClick={() => setActiveTab('taxonomy')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                    activeTab === 'taxonomy'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>ড্রপডাউন ডাটা</span>
                </button>

                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                    activeTab === 'stats'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>সাইট পরিসংখ্যান</span>
                </button>
              </div>

              {/* TAB 1: PENDING MODERATION */}
              {activeTab === 'pending' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      পেন্ডিং টিউশন পোস্ট অনুমোদন কিউ
                    </h3>
                    <button
                      onClick={fetchPendingPosts}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>রিফ্রেশ</span>
                    </button>
                  </div>

                  {pendingPosts.length > 0 ? (
                    <div className="space-y-4">
                      {pendingPosts.map(post => (
                        <div key={post.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{post.parentName}</span>
                              <span className="text-xs text-slate-500">({post.parentPhone})</span>
                              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-100 text-amber-900 rounded font-bold">
                                {post.secretCode}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              {post.studentClass} ({post.medium}) — {post.thana}, {post.district} | ৳{post.salary}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              বিষয়: {post.subjects.join(', ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRejectPost(post.id)}
                              className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl transition-colors"
                            >
                              বাতিল (Reject)
                            </button>
                            <button
                              onClick={() => handleApprovePost(post.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                            >
                              অনুমোদন দিন (Approve)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-400">
                      বর্তমানে কোনো পেন্ডিং পোস্ট নেই।
                    </div>
                  )}
                </div>
              )}

              {/* TAB 1.5: LIVE POSTS */}
              {activeTab === 'live' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      লাইভ টিউশন পোস্ট
                    </h3>
                    <button
                      onClick={() => fetchLivePosts(adminToken || undefined)}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>রিফ্রেশ</span>
                    </button>
                  </div>

                  {livePosts.length > 0 ? (
                    <div className="space-y-4">
                      {livePosts.map(post => (
                        <div key={post.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">{post.parentName}</span>
                                <span className="text-xs text-slate-500">({post.parentPhone})</span>
                                <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-100 text-amber-900 rounded font-bold">
                                  {post.secretCode}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1">
                                {post.studentClass} ({post.medium}) — {post.thana}, {post.district} | ৳{post.salary}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                বিষয়: {post.subjects.join(', ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setManageCode(manageCode === post.secretCode ? null : post.secretCode)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {manageCode === post.secretCode ? 'Close' : 'Manage Applications'}
                              </button>
                            </div>
                          </div>
                          {manageCode === post.secretCode && (
                            <div className="mt-2 border-t border-slate-200 pt-3">
                              <TrackCodeView language={language} initialCode={post.secretCode} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-400">
                      বর্তমানে কোনো লাইভ পোস্ট নেই।
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SECRET CODE RECOVERY */}
              {activeTab === 'recovery' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    অভিভাবক বা টিউটরের গোপন কোড রিকভারি টুল
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={recoveryType}
                      onChange={e => setRecoveryType(e.target.value as any)}
                      className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-bold"
                    >
                      <option value="parent">অভিভাবকের কোড</option>
                      <option value="tutor">টিউটরের কোড</option>
                    </select>

                    <input
                      type="text"
                      value={recoveryQuery}
                      onChange={e => setRecoveryQuery(e.target.value)}
                      placeholder={getTranslation(language, 'searchByPhoneName')}
                      className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
                    />

                    <button
                      onClick={handleRecoverySearch}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>খুঁজুন</span>
                    </button>
                  </div>

                  {/* Results */}
                  {recoveryResults.posts && recoveryResults.posts.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-500 block">মিল পাওয়া অভিভাবক পোস্টসমূহ:</span>
                      {recoveryResults.posts.map(p => (
                        <div key={p.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{p.parentName} ({p.parentPhone})</span>
                            <span className="text-slate-500 block">{p.studentClass} — {p.thana}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 font-mono font-black bg-amber-100 text-amber-900 rounded-lg text-sm">
                              {p.secretCode}
                            </span>
                            <button
                              onClick={() => setManageCode(p.secretCode)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Manage
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {recoveryResults.applications && recoveryResults.applications.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-500 block">মিল পাওয়া টিউটর আবেদনসমূহ:</span>
                      {recoveryResults.applications.map(a => (
                        <div key={a.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{a.tutorName} ({a.tutorPhone})</span>
                            <span className="text-slate-500 block">{a.institution || a.completedDegree}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 font-mono font-black bg-amber-100 text-amber-900 rounded-lg text-sm">
                              {a.secretCode}
                            </span>
                            <button
                              onClick={() => setManageCode(a.secretCode)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Status
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {manageCode && (
                    <div className="mt-6 border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-900">Manage Actions for {manageCode}</h4>
                        <button
                          onClick={() => setManageCode(null)}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs font-bold"
                        >
                          Close
                        </button>
                      </div>
                      <div className="bg-slate-100 p-2 rounded-xl">
                        <TrackCodeView language={language} initialCode={manageCode} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TAXONOMY MANAGER */}
              {activeTab === 'taxonomy' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    ড্রপডাউন ডাটাবেজ এন্ট্রি ম্যানুয়ালি যুক্ত বা কিউরেট করুন
                  </h3>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি টাইপ</label>
                        <select
                          value={customTaxType}
                          onChange={e => setCustomTaxType(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                        >
                          <option value="institutions">শিক্ষা প্রতিষ্ঠান (Institutions)</option>
                          <option value="departments">ডিপার্টমেন্ট / বিষয় (Departments)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">নতুন এন্ট্রি নাম</label>
                        <input
                          type="text"
                          value={customTaxVal}
                          onChange={e => setCustomTaxVal(e.target.value)}
                          placeholder="নতুন প্রতিষ্ঠানের নাম..."
                          className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAddTaxonomy}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      ডাটাবেজে যুক্ত করুন
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: SITE ANALYTICS */}
              {activeTab === 'stats' && stats && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    সাইট মেট্রিক্স ও সামারি
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 border rounded-xl">
                      <span className="text-slate-400 text-xs font-medium block">মোট লাইভ পোস্ট</span>
                      <span className="text-2xl font-black text-slate-900">{stats.totalPosts}</span>
                    </div>

                    <div className="p-4 bg-slate-50 border rounded-xl">
                      <span className="text-slate-400 text-xs font-medium block">ইউনিক টিউটর</span>
                      <span className="text-2xl font-black text-slate-900">{stats.totalUniqueTutors}</span>
                    </div>

                    <div className="p-4 bg-slate-50 border rounded-xl">
                      <span className="text-slate-400 text-xs font-medium block">শীর্ষ বিভাগ</span>
                      <span className="text-xl font-bold text-emerald-700">{stats.topDivision.name} ({stats.topDivision.count})</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
