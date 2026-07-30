import React, { useState } from 'react';
import { Language } from '../types';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, UserCheck, GraduationCap, 
  ShieldCheck, MessageSquare, Sparkles, CheckCircle2, ArrowRight, PhoneCall, Filter
} from 'lucide-react';

interface FAQProps {
  language: Language;
  onPostClick?: () => void;
  onBrowseClick?: () => void;
  onTrackClick?: () => void;
}

interface FAQItem {
  id: string;
  category: 'parent' | 'tutor' | 'safety' | 'general';
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  badgeBn?: string;
  badgeEn?: string;
}

export const FAQ: React.FC<FAQProps> = ({
  language,
  onPostClick,
  onBrowseClick,
  onTrackClick
}) => {
  const isBn = language === 'bn';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'parent' | 'tutor' | 'safety'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['p1', 't1', 's1']); // Open top ones by default
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  const faqData: FAQItem[] = [
    // Parent FAQs
    {
      id: 'p1',
      category: 'parent',
      questionBn: 'কোনো একাউন্ট বা রেজিস্ট্রেশন ছাড়াই কিভাবে টিউশন পোস্ট করবো?',
      questionEn: 'How can I post a tuition request without creating an account?',
      answerBn: 'খুবই সহজ! "পোস্ট করুন" বাটনে ক্লিক করে শিক্ষার্থীর ক্লাস, বিষয়, এলাকা, বাজেট এবং আপনার ফোন নম্বর দিয়ে ফর্মটি জমা দিন। সাবমিট করার সাথে সাথে আপনি একটি ইউনিক গোপন কোড (যেমন: TUTR-P-XXXXXX) পাবেন। যেকোনো সময় এই গোপন কোড দিয়ে আপনি টিউটরদের আবেদন দেখতে ও যোগাযোগ করতে পারবেন।',
      answerEn: 'It’s simple! Click "Post Tuition", select your child’s class, subjects, location, salary budget, and phone number. Upon submission, you will instantly receive a unique secret code (e.g. TUTR-P-XXXXXX) to view and contact tutor applicants without creating passwords.',
      badgeBn: 'অভিভাবক',
      badgeEn: 'Parents'
    },
    {
      id: 'p2',
      category: 'parent',
      questionBn: 'অভিভাবকদের কি কোনো রেজিস্ট্রেশন ফি বা সার্ভিস চার্জ দিতে হয়?',
      questionEn: 'Is there any registration fee or commission for parents?',
      answerBn: 'একেবারেই না! Tutoria সম্পূর্ণ বিনামূল্যে পরিচালিত একটি প্ল্যাটফর্ম। অভিভাবকদের কাছ থেকে কোনো মিডিয়া ফি, কমিশন বা সার্ভিস চার্জ নেওয়া হয় না।',
      answerEn: 'Absolutely zero! Tutoria is 100% free for parents. We do not charge media fees, commissions, or hidden service charges.',
      badgeBn: '১০০% ফ্রি',
      badgeEn: '100% Free'
    },
    {
      id: 'p3',
      category: 'parent',
      questionBn: 'পছন্দের টিউটর বেছে নিবো ও কীভাবে তাদের সাথে কথা বলবো?',
      questionEn: 'How do I review and accept a tutor for my child?',
      answerBn: '"ট্র্যাক করুন" ট্যাবে গিয়ে আপনার অভিভাবক গোপন কোডটি লিখুন। আপনার পোস্টে আবেদনকারী টিউটরদের শিক্ষাগত যোগ্যতা, ডিপার্টমেন্ট ও অভিজ্ঞতার বিস্তারিত দেখতে পাবেন। উপযুক্ত টিউটরের পাশের "গ্রহণ করুন (Accept)" বাটনে চাপ দিলেই সরাসরি তাদের মোবাইল নম্বর আনলক হয়ে যাবে।',
      answerEn: 'Go to the "Track" tab and enter your parent secret code. You will see a verified list of tutors who applied, along with their education and experience. Click "Accept" on your preferred tutor to instantly unlock their mobile contact number.',
      badgeBn: 'সহজ প্রসেস',
      badgeEn: 'Easy Steps'
    },
    {
      id: 'p4',
      category: 'parent',
      questionBn: 'আমার মোবাইল নম্বর কি জনসমক্ষে বা অন্যান্য ওয়েবসাইটে দেখা যাবে?',
      questionEn: 'Is my personal phone number protected and kept private?',
      answerBn: 'না, আপনার মোবাইল নম্বর সম্পূর্ণ সুরক্ষিত ও গোপন রাখা হয়। সর্বসাধারণের জন্য প্রদর্শিত টিউশন বোর্ডে আপনার ফোন নম্বর কখনোই দেখানো হয় না। শুধুমাত্র আপনি যখন নির্দিষ্ট কোনো টিউটরের আবেদন গ্রহণ করবেন, তখনই সেই টিউটর আপনার নম্বর দেখতে পারবেন।',
      answerEn: 'Your mobile number is strictly protected. It is NEVER shown publicly on the tuition board. Only a tutor whom you explicitly ACCEPT through your tracking code will be granted access to your contact number.',
      badgeBn: 'গোপনীয়তা',
      badgeEn: 'Privacy'
    },
    {
      id: 'p5',
      category: 'parent',
      questionBn: 'শিক্ষকের সন্ধান পেয়ে গেলে টিউশন পোস্টটি কিভাবে বন্ধ বা হাইড করবো?',
      questionEn: 'Can I edit or pause my tuition request once I find a tutor?',
      answerBn: 'আপনার অভিভাবক সিক্রেট কোডটি দিয়ে "ট্র্যাক করুন" পেজে গিয়ে এক ক্লিকেই টিউটর নির্বাচন সম্পন্ন নিশ্চিত করতে পারবেন অথবা পোস্ট স্থগিত বা পরিবর্তন করতে পারবেন।',
      answerEn: 'Yes! Simply input your secret code in the "Track" tab to mark your request as fulfilled, pause new applications, or update details anytime.',
      badgeBn: 'কন্ট্রোল',
      badgeEn: 'Control'
    },

    // Tutor FAQs
    {
      id: 't1',
      category: 'tutor',
      questionBn: 'টিউটর হিসেবে টিউশনে আবেদন করতে কোনো কমিশন বা চার্জ লাগে?',
      questionEn: 'Do tutors need to pay any advance commission or media fee?',
      answerBn: 'না! প্রচলিত অভিভাবক-টিউটর মিডিয়া এজেন্সির মতো আমরা প্রথম মাসের ৫০% বেতন বা কোনো অগ্রিম রেজিস্ট্রেশন ফি দাবি করি না। টিউটরদের আবেদন প্রক্রিয়াও সম্পূর্ণ ১০০% বিনামূল্যে।',
      answerEn: 'No! Unlike traditional tuition media agencies that demand 50% first-month salary or advance registration fees, our platform is 100% free for tutors.',
      badgeBn: 'নো কমিশন',
      badgeEn: 'No Commission'
    },
    {
      id: 't2',
      category: 'tutor',
      questionBn: 'টিউশনে আবেদন করার প্রক্রিয়াটি কী?',
      questionEn: 'What is the step-by-step process for a tutor to apply?',
      answerBn: '"টিউশন খুঁজুন" পেজে আপনার পছন্দের এলাকা, ক্লাস বা সাবজেক্ট ফিল্টার করে পোস্ট নির্বাচন করুন। "আবেদন করুন" বাটনে ক্লিক করে আপনার প্রতিষ্ঠান, বিষয়, পড়াশোনার লেভেল ও অভিজ্ঞতা উল্লেখ করে সাবমিট করুন। আপনাকে একটি টিউটর সিক্রেট কোড (TUTR-T-XXXXXX) দেওয়া হবে।',
      answerEn: 'Browse live posts on "Browse Tuitions" using location and subject filters. Click "Apply Now", fill in your university/college, department, academic status, and teaching experience. You will receive a unique Tutor Secret Code.',
      badgeBn: 'টিউটর গাইড',
      badgeEn: 'Tutor Guide'
    },
    {
      id: 't3',
      category: 'tutor',
      questionBn: 'অভিভাবক আমাকে নির্বাচন করেছেন কিনা তা কিভাবে বুঝবো?',
      questionEn: 'How will I know if a parent accepts my application?',
      answerBn: 'আপনার টিউটর গোপন কোডটি "ট্র্যাক করুন" পেজে দিয়ে স্ট্যাটাস চেক করুন। অভিভাবক আপনার আবেদন একসেপ্ট করলেই অভিভাবকের মোবাইল নম্বরটি সাথে সাথে আনলক হয়ে যাবে এবং ৫ মিনিটের কাউন্টডাউন টাইমার শুরু হবে।',
      answerEn: 'Enter your Tutor Secret Code in the "Track" page. When a parent accepts your profile, the parent’s verified phone number will automatically unlock alongside a direct contact window.',
      badgeBn: 'রিয়েলটাইম আপডেট',
      badgeEn: 'Live Status'
    },
    {
      id: 't4',
      category: 'tutor',
      questionBn: 'আমি কি একাধিক টিউশনে আবেদন করতে পারবো?',
      questionEn: 'Can I apply for multiple tuition posts at the same time?',
      answerBn: 'হ্যাঁ, অবশ্যই! আপনার যোগ্যতা ও অবস্থানের সাথে মিলে এমন যেকোনো সংখ্যক টিউশনে আপনি আবেদন করতে পারবেন। প্রতিটি আবেদনের জন্য আলাদা ট্র্যাক কোড থাকবে।',
      answerEn: 'Yes! You can apply for any number of tuition requests that match your qualifications and location. Each application gets its own secret tracking code.',
      badgeBn: 'আনলিমিটেড',
      badgeEn: 'Unlimited'
    },

    // Safety & Trust FAQs
    {
      id: 's1',
      category: 'safety',
      questionBn: 'পাসওয়ার্ডের বদলে গোপন কোড (Secret Code) ব্যবহারের সুবিধা কি?',
      questionEn: 'Why do you use Secret Codes instead of user login passwords?',
      answerBn: 'পাসওয়ার্ড মনে রাখা, একাউন্ট ভেরিফিকেশন ও সোশ্যাল লগইনের ঝামেলা এড়াতে আমরা ইনস্ট্যান্ট গোপন কোড ব্যবস্থা চালু করেছি। এটি আপনার পরিচয় নিরাপদ রাখে এবং যেকোনো ডিভাইস থেকে দ্রুত তথ্য ট্র্যাকিং করতে দেয়।',
      answerEn: 'Secret codes eliminate password hassle, forced registration forms, and social logins. They offer instant, private access while allowing tracking from any phone or computer without memorizing accounts.',
      badgeBn: 'সিকিউরিটি',
      badgeEn: 'Security'
    },
    {
      id: 's2',
      category: 'safety',
      questionBn: 'টিউশনের বিস্তারিত তথ্য বা মেমো কিভাবে প্রিন্ট বা পিডিএফ (PDF) সেভ করবো?',
      questionEn: 'How can I print or save a tuition request memo as a PDF?',
      answerBn: 'টিউশন কার্ডে বা ট্র্যাকিং পেজে থাকা "মেমো প্রিন্ট / PDF" বাটনে ক্লিক করুন। এটি একটি সুন্দর প্রিন্ট-ফ্রেন্ডলি মেমো ভিউ ওপেন করবে যেখানে আপনি এক ক্লিকেই প্রিন্ট করতে পারেন অথবা আপনার ফোনে/পিসিতে PDF ফাইল আকারে সংরক্ষণ করতে পারেন।',
      answerEn: 'Simply click the "Print / Memo PDF" button on any tuition card or status view. This triggers a dedicated print layout allowing you to print or save the request as an official PDF file.',
      badgeBn: 'পিডিএফ সেভ',
      badgeEn: 'PDF Save'
    },
    {
      id: 's3',
      category: 'safety',
      questionBn: 'ভুয়া বা ফেক টিউশন পোস্ট প্রতিরোধে আপনারা কী ব্যবস্থা নেন?',
      questionEn: 'How does the platform verify posts and prevent fake listings?',
      answerBn: 'প্রতিটি নতুন পোস্ট এবং আবেদন সিস্টেমের ফরম্যাট চেক ও অ্যাডমিন রিভিউ প্যানেল দিয়ে পর্যালোচিত হয়। ভুয়া বা ভুল নম্বরযুক্ত পোস্ট অনতিবিলম্বে বাতিল করা হয়।',
      answerEn: 'Every tuition request and tutor submission undergoes format checking and manual admin moderation to filter out invalid numbers or unauthorized spam.',
      badgeBn: 'এডমিন ভেরিফাইড',
      badgeEn: 'Verified'
    }
  ];

  // Filter FAQs based on active tab & search query
  const filteredFaqs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const qBn = item.questionBn.toLowerCase();
    const qEn = item.questionEn.toLowerCase();
    const aBn = item.answerBn.toLowerCase();
    const aEn = item.answerEn.toLowerCase();

    const matchesSearch = qBn.includes(query) || qEn.includes(query) || aBn.includes(query) || aEn.includes(query);
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(i => i !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const handleFeedback = (id: string) => {
    setFeedbackGiven(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* FAQ Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold tracking-wide">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>{isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {isBn ? 'অভিভাবক ও টিউটরদের সাধারণ প্রশ্ন এবং সমাধান' : 'Clear Answers for Parents & Tutors'}
        </h2>

        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          {isBn 
            ? 'আমাদের প্ল্যাটফর্ম ব্যবহারের নিয়ম, গোপনীয়তা, বিনামূল্যে সেবার ধরণ ও গোপন কোড সংক্রান্ত সকল প্রশ্নের উত্তর সহজ ভাষায় নিচে দেওয়া হলো।'
            : 'Find everything you need to know about posting tuitions, applying as a tutor, secret codes, and platform security.'}
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'প্রশ্ন বা বিষয় দিয়ে দ্রুত খুঁজুন (যেমন: কমিশন, গোপন কোড, প্রিন্ট)...' : 'Search questions (e.g., commission, secret code, print)...'}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer bg-slate-100 px-2 py-0.5 rounded-md"
              >
                {isBn ? 'মুছে ফেলুন' : 'Clear'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{isBn ? 'সকল প্রশ্ন' : 'All Questions'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('parent')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'parent'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{isBn ? 'অভিভাবকদের জন্য' : 'For Parents'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('tutor')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'tutor'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{isBn ? 'টিউটরদের জন্য' : 'For Tutors'}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('safety')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'safety'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isBn ? 'নিরাপত্তা ও গোপন কোড' : 'Trust & Safety'}</span>
        </button>
      </div>

      {/* Accordion Questions List */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {isBn ? 'আপনার খোঁজা প্রশ্নের কোনো উত্তর পাওয়া যায়নি' : 'No matching questions found'}
          </h3>
          <p className="text-xs text-slate-500">
            {isBn ? 'অনুগ্রহ করে সার্চ কিউওয়ার্ড পরিবর্তন করুন অথবা ক্যাটাগরি অল নির্বাচন করুন।' : 'Try adjusting your search terms or clearing the filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            const questionText = isBn ? faq.questionBn : faq.questionEn;
            const answerText = isBn ? faq.answerBn : faq.answerEn;
            const badgeText = isBn ? faq.badgeBn : faq.badgeEn;

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isOpen 
                    ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Toggle */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {badgeText && (
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-md uppercase">
                            {badgeText}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {questionText}
                      </h3>
                    </div>
                  </div>

                  <div className={`p-1.5 rounded-lg shrink-0 transition-transform ${
                    isOpen ? 'bg-emerald-50 text-emerald-700 rotate-180' : 'text-slate-400'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Expanded Answer Content */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100 bg-slate-50/50 space-y-4">
                    <p className="pt-2">{answerText}</p>

                    {/* Was this helpful widget */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                      <span>{isBn ? 'উত্তরটি কি সহায়ক ছিলো?' : 'Was this answer helpful?'}</span>
                      {feedbackGiven[faq.id] ? (
                        <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isBn ? 'মতামতের জন্য ধন্যবাদ!' : 'Thanks for feedback!'}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(faq.id)}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            👍 {isBn ? 'হ্যাঁ' : 'Yes'}
                          </button>
                          <button
                            onClick={() => handleFeedback(faq.id)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            👎 {isBn ? 'না' : 'No'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Conversion / Trust Banner */}
      <div className="mt-12 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'সহজ ও নিরাপদ প্ল্যাটফর্ম' : 'Fast & Secure Marketplace'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
            {isBn ? 'অন্য কোনো প্রশ্ন বা কোনো সহায়তার প্রয়োজন?' : 'Still have questions or need assistance?'}
          </h3>
          <p className="text-xs text-slate-300 max-w-lg">
            {isBn 
              ? 'অবিলম্বে নতুন টিউশন পোস্ট করুন অথবা সরাসরি টিউটর ফিল্টার করে আপনার পছন্দের টিউশন খুঁজে নিন।'
              : 'Get started in under 2 minutes. Post a new request as a parent or explore active posts as a tutor.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto shrink-0">
          {onPostClick && (
            <button
              onClick={() => onPostClick()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isBn ? 'টিউশন পোস্ট করুন' : 'Post Tuition'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onBrowseClick && (
            <button
              onClick={() => onBrowseClick()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              {isBn ? 'টিউশন খুঁজুন' : 'Browse Posts'}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
