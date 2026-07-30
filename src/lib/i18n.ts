import { Language } from '../types';

export const translations = {
  bn: {
    siteName: 'Tutoria',
    siteSubTitle: 'অভিভাবক ও টিউটরের সরাসরি সংযোগ — সম্পূর্ণ বিনামূল্যে',
    heroBadge: 'বাংলাদেশব্যাপী শতভাগ ফ্রি ও বিশ্বস্ত শিক্ষাসেবা নেটওয়ার্ক',
    heroTitle: 'অভিভাবক ও দক্ষ টিউটরদের সরাসরি ও বিশ্বস্ত প্ল্যাটফর্ম',
    heroSubtitle: 'স্বচ্ছ ও আধুনিক উপায়ে কোনো মধ্যস্বত্বভোগী বা হিডেন চার্জ ছাড়াই অভিভাবক ও শিক্ষকদের সরাসরি সংযোগ। পাসওয়ার্ডের ঝামেলা ছাড়াই সুরক্ষিত এক্সেস।',
    btnPostTuition: 'অভিভাবক হিসেবে টিউশন পোস্ট করুন',
    btnApplyTutor: 'টিউটর হিসেবে টিউশন খুঁজুন',
    btnTrackCode: 'কোড দিয়ে স্ট্যাটাস দেখুন',
    navHome: 'হোম',
    navBrowse: 'টিউশন খুঁজুন',
    navPost: 'পোস্ট করুন',
    navTrack: 'ট্র্যাক করুন',
    navHowItWorks: 'নিয়মাবলী',
    navAdmin: 'এডমিন প্যানেল',
    
    // Stats
    statPosts: 'মোট টিউশন পোস্ট',
    statTutors: 'সংযুক্ত টিউটর সংখ্যা',
    statTopDivision: 'সর্বোচ্চ চাহিদাসম্পন্ন বিভাগ',
    statYears: 'সেবার সময়কাল',
    yearsValue: '৩+ বছর (২০২৩ থেকে)',
    viewFullGeoStats: 'বিভাগ, জেলা ও থানা অনুযায়ী বিস্তারিত পরিসংখ্যান দেখুন',
    
    // Geographic Stats Modal
    geoStatsTitle: 'বাংলাদেশব্যাপী টিউশন চাহিদার ভৌগোলিক চিত্র',
    geoSearchPlaceholder: 'জেলা বা থানা দিয়ে খুঁজুন...',
    close: 'বন্ধ করুন',
    
    // Parent Post Form
    postModalTitle: 'অভিভাবক: নতুন টিউশন রিকুয়েস্ট পোস্ট করুন',
    postModalSub: 'আপনার কোনো অ্যাকাউন্ট তৈরি করতে হবে না। পোস্টের পর একটি গোপন কোড দেওয়া হবে।',
    parentName: 'আপনার নাম (অভিভাবক)',
    parentPhone: 'মোবাইল নম্বর (১১ ডিজিট)',
    isWhatsapp: 'এই নম্বরে হোয়াটসঅ্যাপ (WhatsApp) আছে',
    division: 'বিভাগ',
    district: 'জেলা',
    thana: 'থানা / এলাকা',
    address: 'বিস্তারিত ঠিকানা (হাউস/রোড)',
    mapPickerTitle: 'ম্যাপে স্থান নির্দিষ্ট করুন (ঐচ্ছিক কিন্তু সাজেস্টেড)',
    tuitionType: 'টিউশনের ধরন',
    typeOffline: 'অফলাইন (বাসায় গিয়ে)',
    typeOnline: 'অনলাইন (দূরশিক্ষণ)',
    typeMixed: 'মিক্সড (বাসা + অনলাইন)',
    medium: 'পড়াশোনার মাধ্যম',
    studentClass: 'শিক্ষার্থীর শ্রেণী / লেভেল',
    subjects: 'বিষয়সমূহ (একাধিক নির্বাচন করুন)',
    daysPerWeek: 'সপ্তাহে কত দিন',
    preferredDays: 'পছন্দের দিনসমূহ',
    tutorGenderPref: 'টিউটরের লিঙ্গ পছন্দ',
    genderMale: 'পুরুষ টিউটর',
    genderFemale: 'মহিলা টিউটর',
    genderAny: 'যেকোনো (পুরুষ/মহিলা)',
    salary: 'মাসিক সম্মানী (টাকা / BDT)',
    specialNote: 'বিশেষ নির্দেশনা / শর্ত (ঐচ্ছিক)',
    submitPostBtn: 'টিউশন পোস্ট নিশ্চিত করুন',
    
    // Secret Code Success Screen
    secretCodeTitle: 'আপনার গোপন এক্সেস কোড!',
    secretCodeWarning: 'গোপন কোডটি কোথাও লিখে রাখুন বা কপি করে রাখুন! পরবর্তীতে আবেদনকারী টিউটর দেখতে, তাদের গ্রহণ করতে বা পোস্ট পরিবর্তন করতে এই কোড প্রয়োজন হবে।',
    copyCode: 'কোড কপি করুন',
    codeCopied: 'কোড কপি করা হয়েছে!',
    postPendingAdmin: 'আপনার পোস্টটি এডমিন অনুমোদনের অপেক্ষায় আছে। এডমিন চেক করার পর এটি লাইভ হবে।',
    
    // Tutor Apply Modal
    applyModalTitle: 'টিউটর: এই টিউশনে আবেদন করুন',
    tutorName: 'আপনার নাম (টিউটর)',
    tutorPhone: 'মোবাইল নম্বর',
    studyStatus: 'বর্তমান পড়াশোনার স্ট্যাটাস',
    studying: 'বর্তমানে অধ্যয়নরত (রানিং স্টুডেন্ট)',
    completed: 'পড়াশোনা সমাপ্ত (গ্রাজুয়েট/কমপ্লিট)',
    studyLevel: 'পড়াশোনার লেভেল / ডিগ্রী',
    institution: 'প্রতিষ্ঠানের নাম (স্কুল/কলেজ/বিশ্ববিদ্যালয়)',
    department: 'গ্রুপ / বিভাগ / সাবজেক্ট',
    completedDegreeDesc: 'পড়াশোনার বিবরণ (ডিগ্রী, বিষয় ও প্রতিষ্ঠানের নাম)',
    experience: 'পড়ানোর অভিজ্ঞতা ও পারদর্শিতা (~২০০ শব্দ)',
    submitApplyBtn: 'আবেদন জমা দিন',
    
    // Filter & Search
    filterTitle: 'ফিল্টার ফিল্ডস',
    searchPlaceholder: 'বিষয়, এলাকা বা কিউওয়ার্ড দিয়ে খুঁজুন...',
    allDivisions: 'সব বিভাগ',
    allDistricts: 'সব জেলা',
    allThanas: 'সব থানা',
    allMediums: 'সব মাধ্যম',
    allClasses: 'সব শ্রেণী',
    minSalary: 'সর্বনিম্ন বাজেট',
    maxSalary: 'সর্বোচ্চ বাজেট',
    resetFilters: 'ফিল্টার রিসেট করুন',
    noPostsFound: 'কোনো টিউশন পোস্ট পাওয়া যায়নি। আপনার সার্চ বা ফিল্টার পরিবর্তন করে দেখুন।',
    
    // Track View
    trackTitle: 'গোপন কোড দিয়ে স্ট্যাটাস ও আবেদন চেক করুন',
    trackSub: 'অভিভাবকের পোস্টের কোড বা টিউটরের আবেদনের কোড এখানে ইনপুট দিন',
    inputSecretPlaceholder: 'উদাহরণ: FTM-P-XXXXXX অথবা FTM-T-XXXXXX',
    btnCheckStatus: 'চেক করুন',
    invalidCodeMsg: 'দুঃখিত, এই গোপন কোডের কোনো রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে সঠিকভাবে কোড দিন।',
    
    // Track Parent Perspective
    parentPostOverview: 'আপনার পোস্টের বিবরণ',
    postStatusText: 'পোস্টের স্ট্যাটাস',
    applicantsListTitle: 'আবেদনকারী টিউটরদের তালিকা',
    noApplicantsYet: 'এখনো কোনো টিউটর এই পোস্টে আবেদন করেননি। খুব শীঘ্রই টিউটর আবেদন করবেন।',
    btnAcceptApplicant: 'টিউটর নির্বাচন করুন (Accept)',
    btnCancelAcceptance: 'নির্বাচন বাতিল করুন (Cancel)',
    btnConfirmFinal: 'টিউশন নিশ্চিত ও সম্পন্ন ঘোষণা করুন (Confirm & Finalize)',
    confirmNoticeText: 'অভিভাবক যদি টিউটরের সাথে কথা বলে ফাইনাল করে থাকেন, তবে এই বাটনে চাপলে পোস্টটি সাইট থেকে সম্পন্ন হিসেবে মুছে যাবে।',
    pleaseCallTutor: 'অনুগ্রহ করে নিচে উল্লেখিত নম্বরে কল করে টিউটরের সাথে কথা বলুন:',
    
    // Track Tutor Perspective
    tutorAppStatus: 'আপনার আবেদনের বর্তমান স্ট্যাটাস',
    statusPending: 'পেন্ডিং — অভিভাবকের পর্যালোচনার অপেক্ষায়',
    statusAccepted: 'গৃহীত হয়েছে! — অভিভাবকের যোগাযোগের অপেক্ষায়',
    statusConfirmed: 'অন্য টিউটরকে দেওয়া হয়েছে / সম্পন্ন',
    statusRejected: 'আবেদন বাতিল করা হয়েছে',
    acceptedTimerNotice: 'অভিভাবক আপনাকে পছন্দ করেছেন! অভিভাবকের ফোন নাম্বার প্রকাশের জন্য ৫ ঘণ্টার কাউন্টডাউন চলছে। অভিভাবক সরাসরি কল করতে পারেন:',
    timerExpiredNotice: '৫ ঘণ্টা পার হয়েছে! আপনি সরাসরি অভিভাবককে কল করতে পারেন:',
    callParentNow: 'অভিভাবককে সরাসরি কল করুন:',
    confirmedOtherNotice: 'এই টিউশনটি অন্য একজন টিউটরের সাথে চূড়ান্ত করা হয়েছে। আশা হারাবেন না, অন্যান্য পোস্টগুলোতে আবেদন করার চেষ্টা করুন!',
    
    // Onboarding / How it works
    howItWorksTitle: 'Tutoria যেভাবে কাজ করে',
    step1Title: '১. সম্পূর্ণ ফ্রি ও নো-সাইনআপ',
    step1Desc: 'কোনো আইডি খোলা বা পাসওয়ার্ড মনে রাখার ঝামেলা নেই। সার্ভিস চার্জ সম্পূর্ণ ০ টাকা।',
    step2Title: '২. ইউনিক গোপন কোড',
    step2Desc: 'পোস্ট বা আবেদনের পর একটি সিক্রেট কোড পাওয়া যাবে। এটি দিয়ে পরবর্তীতে এক্সেস পাবেন।',
    step3Title: '৩. এডমিন অনুমোদন ও সংযোগ',
    step3Desc: 'তথ্য যাচাই করে পোস্ট এপ্রুভ হয়। অভিভাবক পছন্দ করলে সরাসরি কল করে নিশ্চিত করতে পারেন।',
    
    // Footer & GitHub
    devCredit: 'ডেভেলপার পরিচিতি',
    githubBio: 'GitHub প্রোফাইল থেকে সংগৃহীত তথ্য',
    
    // Admin
    adminTitle: 'এডমিন কন্ট্রোল প্যানেল',
    adminLoginTitle: 'এডমিন লগইন',
    adminPassLabel: 'এডমিন পাসওয়ার্ড দিন',
    btnLogin: 'লগইন করুন',
    pendingPostsTab: 'পেন্ডিং পোস্ট অনুমোদন',
    codeRecoveryTab: 'গোপন কোড রিকভারি',
    taxonomyTab: 'ড্রপডাউন ডাটা সাজানো',
    siteStatsTab: 'সাইট অ্যানালিটিক্স',
    btnApprove: 'অনুমোদন দিন (Approve)',
    btnReject: 'বাতিল করুন (Reject)',
    lookupParent: 'অভিভাবকের গোপন কোড খুঁজুন (ফোন নম্বর/নাম)',
    lookupTutor: 'টিউটরের গোপন কোড খুঁজুন (ফোন নম্বর/নাম)',
    searchByPhoneName: 'ফোন নম্বর বা নাম লিখে খুঁজুন...',
    
    // Add new custom taxonomy item
    addNewOption: '+ নতুন যোগ করুন...',
    addNewModalTitle: 'নতুন অপশন ডাটাবেজে যোগ করুন',
    inputCustomValue: 'নতুন নাম টাইপ করুন',
    btnAddCustom: 'ডাটাবেজে যুক্ত করুন'
  },
  en: {
    siteName: 'Tutoria',
    siteSubTitle: 'Direct Connection Between Parents & Tutors — 100% Free',
    heroBadge: 'Zero-Commission Nationwide Academic Network in Bangladesh',
    heroTitle: 'Bangladesh\'s Premier Direct Platform for Parents & Verified Tutors',
    heroSubtitle: 'Empowering education through transparent, direct matching with no hidden fees or brokers. Post tuition requests or apply seamlessly with system secret codes.',
    btnPostTuition: 'Post Tuition as Parent',
    btnApplyTutor: 'Apply / Find Tuitions',
    btnTrackCode: 'Track Status with Code',
    navHome: 'Home',
    navBrowse: 'Browse Tuitions',
    navPost: 'Post Request',
    navTrack: 'Track Status',
    navHowItWorks: 'How it Works',
    navAdmin: 'Admin Panel',
    
    // Stats
    statPosts: 'Total Tuition Posts',
    statTutors: 'Connected Tutors',
    statTopDivision: 'Highest Demand Division',
    statYears: 'Active Contribution',
    yearsValue: '3+ Years (Since 2023)',
    viewFullGeoStats: 'Explore Full Division → District → Thana Breakdown',
    
    // Geographic Stats Modal
    geoStatsTitle: 'Geographic Breakdown of Tuition Demands across Bangladesh',
    geoSearchPlaceholder: 'Search by District or Thana...',
    close: 'Close',
    
    // Parent Post Form
    postModalTitle: 'Parent: Post a New Tuition Request',
    postModalSub: 'No account needed. You will receive a unique secret access code upon submission.',
    parentName: 'Your Name (Parent / Guardian)',
    parentPhone: 'Mobile Number (11 digits)',
    isWhatsapp: 'This number has WhatsApp',
    division: 'Division',
    district: 'District',
    thana: 'Thana / Area',
    address: 'Detailed Address (House/Road)',
    mapPickerTitle: 'Pin Location on Map (Optional but Recommended)',
    tuitionType: 'Tuition Type',
    typeOffline: 'Offline (Home Tutoring)',
    typeOnline: 'Online (Remote Learning)',
    typeMixed: 'Mixed (Home + Online)',
    medium: 'Medium of Study',
    studentClass: 'Student Class / Grade',
    subjects: 'Subjects (Multi-select)',
    daysPerWeek: 'Days per Week',
    preferredDays: 'Preferred Days',
    tutorGenderPref: 'Preferred Tutor Gender',
    genderMale: 'Male Tutor',
    genderFemale: 'Female Tutor',
    genderAny: 'Any Gender',
    salary: 'Monthly Salary (BDT)',
    specialNote: 'Special Notes / Requirements (Optional)',
    submitPostBtn: 'Confirm & Post Tuition',
    
    // Secret Code Success Screen
    secretCodeTitle: 'Your Secret Access Code!',
    secretCodeWarning: 'Please copy and save this secret code safely! You will need it to track tutor applicants, accept tutors, or edit/delete your post.',
    copyCode: 'Copy Code',
    codeCopied: 'Code Copied!',
    postPendingAdmin: 'Your post is submitted and pending admin approval. It will go live once reviewed.',
    
    // Tutor Apply Modal
    applyModalTitle: 'Tutor: Apply to this Tuition',
    tutorName: 'Your Name (Tutor)',
    tutorPhone: 'Mobile Number',
    studyStatus: 'Current Academic Status',
    studying: 'Currently Studying (Student)',
    completed: 'Completed Education (Graduate)',
    studyLevel: 'Education Level / Degree',
    institution: 'Institution Name (School/College/University)',
    department: 'Group / Department / Major',
    completedDegreeDesc: 'Education details (Degree, Major, Institution)',
    experience: 'Teaching Experience & Expertise (~200 words)',
    submitApplyBtn: 'Submit Application',
    
    // Filter & Search
    filterTitle: 'Filter Tuitions',
    searchPlaceholder: 'Search by subject, area, or keyword...',
    allDivisions: 'All Divisions',
    allDistricts: 'All Districts',
    allThanas: 'All Thanas',
    allMediums: 'All Mediums',
    allClasses: 'All Classes',
    minSalary: 'Min Salary',
    maxSalary: 'Max Salary',
    resetFilters: 'Reset Filters',
    noPostsFound: 'No tuition posts match your filters. Try adjusting your search criteria.',
    
    // Track View
    trackTitle: 'Track Status with Your Secret Access Code',
    trackSub: 'Enter your Parent Post Secret Code or Tutor Application Secret Code',
    inputSecretPlaceholder: 'e.g., FTM-P-XXXXXX or FTM-T-XXXXXX',
    btnCheckStatus: 'Check Status',
    invalidCodeMsg: 'Sorry, no matching post or application found for this secret code.',
    
    // Track Parent Perspective
    parentPostOverview: 'Your Tuition Post Overview',
    postStatusText: 'Post Status',
    applicantsListTitle: 'Tutor Applicants List',
    noApplicantsYet: 'No tutors have applied to this post yet. Tutors will apply soon!',
    btnAcceptApplicant: 'Accept Tutor',
    btnCancelAcceptance: 'Cancel Acceptance',
    btnConfirmFinal: 'Confirm & Finalize Tuition',
    confirmNoticeText: 'If you have spoken with the tutor and finalized agreement, clicking this will mark the tuition as completed and remove it from public board.',
    pleaseCallTutor: 'Please call the selected tutor directly to discuss details:',
    
    // Track Tutor Perspective
    tutorAppStatus: 'Your Application Status',
    statusPending: 'Pending — Awaiting parent review',
    statusAccepted: 'Accepted! — Parent is reviewing or contacting you',
    statusConfirmed: 'Taken by another tutor / Finalized',
    statusRejected: 'Application Declined',
    acceptedTimerNotice: 'The parent has accepted you! A 5-hour countdown is active before parent contact is directly revealed. The parent may call you directly:',
    timerExpiredNotice: '5 hours elapsed! You can now call the parent directly:',
    callParentNow: 'Call Parent Directly:',
    confirmedOtherNotice: 'This tuition has been taken by another tutor. Keep your head up and keep applying to other opportunities!',
    
    // Onboarding / How it works
    howItWorksTitle: 'How Tutoria Works',
    step1Title: '1. Completely Free & No Signup',
    step1Desc: 'Zero fees and zero account passwords. Connecting parents and teachers without middlemen.',
    step2Title: '2. Unique Secret Codes',
    step2Desc: 'Every post and application receives a unique secret code for management and tracking.',
    step3Title: '3. Admin Review & Direct Call',
    step3Desc: 'Admin moderates listings. When accepted, parents and tutors connect directly via phone.',
    
    // Footer & GitHub
    devCredit: 'Developer Profile',
    githubBio: 'Fetched live from GitHub API',
    
    // Admin
    adminTitle: 'Admin Control Panel',
    adminLoginTitle: 'Admin Login',
    adminPassLabel: 'Enter Admin Password',
    btnLogin: 'Login',
    pendingPostsTab: 'Pending Approval Queue',
    codeRecoveryTab: 'Secret Code Recovery',
    taxonomyTab: 'Dropdown Taxonomy Data',
    siteStatsTab: 'Site Analytics',
    btnApprove: 'Approve',
    btnReject: 'Reject',
    lookupParent: 'Lookup Parent Secret Code (by Phone/Name)',
    lookupTutor: 'Lookup Tutor Secret Code (by Phone/Name)',
    searchByPhoneName: 'Search by phone number or name...',
    
    // Add new custom taxonomy item
    addNewOption: '+ Add New...',
    addNewModalTitle: 'Add New Custom Option to Database',
    inputCustomValue: 'Type new value name',
    btnAddCustom: 'Add to Database'
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations['bn']): string {
  return translations[lang][key] || translations['bn'][key] || String(key);
}
