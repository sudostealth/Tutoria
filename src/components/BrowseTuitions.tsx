import React, { useState, useEffect } from 'react';
import { Language, TaxonomyData, TuitionPost } from '../types';
import { getTranslation } from '../lib/i18n';
import { getDistrictsForDivision, getThanasForDistrict, getAllThanasInDivision, initialTaxonomy } from '../lib/bdData';
import { SearchableCombobox } from './SearchableCombobox';
import { LocationPickerMap } from './LocationPickerMap';
import { EmptyTuitionsState } from './EmptyTuitionsState';
import { Search, Filter, MapPin, Calendar, DollarSign, Users, BookOpen, RefreshCw, Layers, Map as MapIcon, Grid, Sparkles, Send, Table as TableIcon, Printer, Share2, MessageCircle, Check } from 'lucide-react';
import { TuitionDetailModal } from './TuitionDetailModal';

interface BrowseTuitionsProps {
  language: Language;
  taxonomy: TaxonomyData | null;
  onApplyClick: (post: TuitionPost) => void;
  onAddTaxonomy: (type: any, key: string | undefined, value: string) => void;
  onPostClick?: () => void;
  initialDivision?: string;
}

export const BrowseTuitions: React.FC<BrowseTuitionsProps> = ({
  language,
  taxonomy,
  onApplyClick,
  onAddTaxonomy,
  onPostClick,
  initialDivision
}) => {
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Tuition detail modal state for Print / PDF view
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<TuitionPost | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Filter States
  const [division, setDivision] = useState(initialDivision || 'all');

  useEffect(() => {
    if (initialDivision) {
      setDivision(initialDivision);
    }
  }, [initialDivision]);
  const [district, setDistrict] = useState('all');
  const [thana, setThana] = useState('all');
  const [medium, setMedium] = useState('all');
  const [studentClass, setStudentClass] = useState('all');
  const [gender, setGender] = useState('all');
  const [tuitionType, setTuitionType] = useState('all');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (division !== 'all') queryParams.append('division', division);
      if (district !== 'all') queryParams.append('district', district);
      if (thana !== 'all') queryParams.append('thana', thana);
      if (medium !== 'all') queryParams.append('medium', medium);
      if (studentClass !== 'all') queryParams.append('studentClass', studentClass);
      if (gender !== 'all') queryParams.append('gender', gender);
      if (tuitionType !== 'all') queryParams.append('tuitionType', tuitionType);
      if (minSalary) queryParams.append('minSalary', minSalary);
      if (maxSalary) queryParams.append('maxSalary', maxSalary);
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await fetch(`/api/posts?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching tuition posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [division, district, thana, medium, studentClass, gender, tuitionType, minSalary, maxSalary]);

  const handleResetFilters = () => {
    setDivision('all');
    setDistrict('all');
    setThana('all');
    setMedium('all');
    setStudentClass('all');
    setGender('all');
    setTuitionType('all');
    setMinSalary('');
    setMaxSalary('');
    setSearchTerm('');
  };

  const availableDivisions = ['all', ...(taxonomy?.divisions || initialTaxonomy.divisions)];
  
  const availableDistricts = division === 'all'
    ? ['all', ...Array.from(new Set(Object.values(taxonomy?.districts || initialTaxonomy.districts).flat()))]
    : ['all', ...getDistrictsForDivision(division, taxonomy)];

  const availableThanas = district === 'all'
    ? (division === 'all'
        ? ['all', ...Array.from(new Set(Object.values(taxonomy?.thanas || initialTaxonomy.thanas).flat()))]
        : ['all', ...getAllThanasInDivision(division, taxonomy)])
    : ['all', ...getThanasForDistrict(district, taxonomy)];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>সক্রিয় টিউশনসমূহ ({posts.length} টি)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            ফিল্টার করুন এবং সরাসরি যেকোনো টিউশনে ফ্রিতে আবেদন করুন
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-emerald-700 shadow-2xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>টেবিল ভিউ</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-2xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>গ্রিড ভিউ</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchPosts()}
              placeholder={getTranslation(language, 'searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={fetchPosts}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>সার্চ করুন</span>
          </button>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100">
          
          <SearchableCombobox
            label={getTranslation(language, 'division')}
            options={availableDivisions}
            value={division === 'all' ? 'সব বিভাগ' : division}
            onChange={val => { setDivision(val === 'সব বিভাগ' ? 'all' : val); setDistrict('all'); setThana('all'); }}
          />

          <SearchableCombobox
            label={getTranslation(language, 'district')}
            options={availableDistricts}
            value={district === 'all' ? 'সব জেলা' : district}
            onChange={val => { setDistrict(val === 'সব জেলা' ? 'all' : val); setThana('all'); }}
          />

          <SearchableCombobox
            label={getTranslation(language, 'thana')}
            options={availableThanas}
            value={thana === 'all' ? 'সব থানা' : thana}
            onChange={val => setThana(val === 'সব থানা' ? 'all' : val)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation(language, 'medium')}</label>
            <select
              value={medium}
              onChange={e => setMedium(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
            >
              <option value="all">সব মাধ্যম</option>
              <option value="Bangla">Bangla</option>
              <option value="English Version">English Version</option>
              <option value="English">English</option>
              <option value="Madrasa">Madrasa</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation(language, 'tutorGenderPref')}</label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
            >
              <option value="all">যেকোনো লিঙ্গ</option>
              <option value="Male">পুরুষ টিউটর</option>
              <option value="Female">মহিলা টিউটর</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation(language, 'tuitionType')}</label>
            <select
              value={tuitionType}
              onChange={e => setTuitionType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none"
            >
              <option value="all">সব ধরন</option>
              <option value="Offline">অফলাইন</option>
              <option value="Online">অনলাইন</option>
              <option value="Mixed">মিক্সড</option>
            </select>
          </div>

        </div>

        {/* Reset Filters button */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{getTranslation(language, 'resetFilters')}</span>
          </button>
        </div>

      </div>

      {/* View Mode Content */}
      {viewMode === 'table' ? (
        /* High Density Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">
              টিউশন পোস্ট লোড হচ্ছে...
            </div>
          ) : posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4">শ্রেণী ও বিষয়</th>
                    <th className="p-4">এলাকা</th>
                    <th className="p-4">বেতন</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {posts.map(post => (
                    <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{post.studentClass}</span>
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-md">
                            {post.medium}
                          </span>
                        </div>
                        <div className="text-slate-500 text-xs mt-1 flex flex-wrap gap-1">
                          {post.subjects.map((sub, idx) => (
                            <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{post.thana}, {post.district}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          সপ্তাহে {post.daysPerWeek} দিন • প্রয়োজন: {post.tutorGenderPref === 'Any' ? 'যেকোনো' : post.tutorGenderPref}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-emerald-600 text-sm">
                          ৳{post.salary.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block">প্রতি মাসে</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedPostForDetail(post);
                              setDetailModalOpen(true);
                            }}
                            className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            title={language === 'bn' ? 'মেমো ও প্রিন্ট দেখুন (PDF)' : 'View Memo & Print PDF'}
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline text-[11px]">{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                          </button>

                          <button
                            onClick={() => onApplyClick(post)}
                            className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            আবেদন করুন
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyTuitionsState
              language={language}
              onResetFilters={handleResetFilters}
              onPostClick={onPostClick}
              activeFilters={{
                division,
                district,
                thana,
                medium,
                studentClass,
                gender,
                tuitionType,
                searchTerm
              }}
            />
          )}
        </div>
      ) : (
        /* Posts Feed Grid */
        <div>
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">
              টিউশন পোস্ট লোড হচ্ছে...
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  {/* Top Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full">
                        {post.medium}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                        ৳{post.salary.toLocaleString('en-IN')} / মাস
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {post.studentClass}
                    </h3>

                    {/* Location */}
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{post.thana}, {post.district} ({post.division})</span>
                    </p>
                  </div>

                  {/* Subject Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      বিষয়সমূহ
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {post.subjects.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200/60"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>সপ্তাহে {post.daysPerWeek} দিন</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>প্রয়োজন: {post.tutorGenderPref === 'Any' ? 'যেকোনো' : post.tutorGenderPref === 'Male' ? 'পুরুষ' : 'মহিলা'}</span>
                    </div>
                  </div>

                  {post.specialNote && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                      "{post.specialNote}"
                    </p>
                  )}

                  {/* Quick Share Bar */}
                  <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">শেয়ার:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const text = `📚 *Tutoria - ফ্রি টিউশন পোস্ট*\n\nশ্রেণি: ${post.studentClass} (${post.medium})\nলোকেশন: ${post.thana}, ${post.district}\nবিষয়: ${post.subjects.join(', ')}\nসম্মানী: ৳${post.salary.toLocaleString('en-IN')}/মাস (${post.daysPerWeek} দিন/সপ্তাহ)\n\nজিরো কমিশনে আবেদন করতে ভিজিট করুন:\n${window.location.origin}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="WhatsApp-এ শেয়ার করুন"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const text = `[Tutoria] ${post.studentClass} (${post.medium}) টিউশন - ${post.thana}, ${post.district} | বেতন: ৳${post.salary.toLocaleString('en-IN')}/মাস`;
                          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(text)}`;
                          window.open(url, '_blank');
                        }}
                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Facebook Group-এ শেয়ার করুন"
                      >
                        <Share2 className="w-3 h-3 text-blue-600" />
                        <span>FB Group</span>
                      </button>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedPostForDetail(post);
                        setDetailModalOpen(true);
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={language === 'bn' ? 'বিবরণ ও মেমো প্রিন্ট (PDF)' : 'Print Request Memo (PDF)'}
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>{language === 'bn' ? 'প্রিন্ট / PDF' : 'Print / Memo'}</span>
                    </button>

                    <button
                      onClick={() => onApplyClick(post)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>আবেদন করুন</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <EmptyTuitionsState
              language={language}
              onResetFilters={handleResetFilters}
              onPostClick={onPostClick}
              activeFilters={{
                division,
                district,
                thana,
                medium,
                studentClass,
                gender,
                tuitionType,
                searchTerm
              }}
            />
          )}
        </div>
      )}

      {/* Tuition Request Printable Detail Modal */}
      <TuitionDetailModal
        language={language}
        post={selectedPostForDetail}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedPostForDetail(null);
        }}
        onApplyClick={onApplyClick}
      />

    </div>
  );
};

