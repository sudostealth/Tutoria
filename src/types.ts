export type Language = 'bn' | 'en';

export type TuitionType = 'Offline' | 'Online' | 'Mixed';
export type GenderPreference = 'Male' | 'Female' | 'Any';
export type EducationMedium = 'Bangla' | 'English' | 'English Version' | 'Madrasa';

export type PostStatus = 'pending' | 'live' | 'edited_pending' | 'completed' | 'rejected' | 'trial' | 'accepted';
export type ApplicationStatus = 'pending' | 'accepted' | 'confirmed' | 'rejected' | 'trial' | 'rejected_from_trial';

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface TuitionPost {
  id: string;
  secretCode: string;
  parentName: string;
  parentPhone: string;
  isWhatsapp: boolean;
  division: string;
  district: string;
  thana: string;
  address: string;
  coords?: LocationCoords;
  tuitionType: TuitionType;
  medium: EducationMedium;
  studentClass: string;
  subjects: string[];
  daysPerWeek: number;
  preferredDays?: string[];
  tutorGenderPref: GenderPreference;
  salary: number;
  specialNote?: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  applicantCount?: number;
}

export interface TutorApplication {
  id: string;
  postId: string;
  secretCode: string;
  tutorName: string;
  tutorPhone: string;
  isWhatsapp: boolean;
  studyStatus: 'studying' | 'completed';
  // If studying
  studyLevel?: string;
  institution?: string;
  department?: string;
  // If completed
  completedDegree?: string;
  experience: string;
  status: ApplicationStatus;
  acceptedAt?: string; // ISO string when parent accepts
  createdAt: string;
  // Joined post info for tracking view
  postInfo?: Partial<TuitionPost>;
}

export interface TaxonomyData {
  divisions: string[];
  districts: Record<string, string[]>; // division -> districts
  thanas: Record<string, string[]>;    // district -> thanas
  mediums: EducationMedium[];
  classesByMedium: Record<EducationMedium, string[]>;
  subjectsByMediumAndClass: Record<string, string[]>;
  institutions: string[];
  departments: string[];
}

export interface GeographicStat {
  division: string;
  postCount: number;
  districts: {
    district: string;
    postCount: number;
    thanas: {
      thana: string;
      postCount: number;
    }[];
  }[];
}

export interface MonthlySummary {
  yearMonth: string; // "2026-07"
  monthName: string; // "July 2026" or "জুলাই ২০২৬"
  year: number;
  month: number;
  postCount: number;
}

export interface YearlySummary {
  year: number;
  postCount: number;
}

export interface LocationMonthlyStat {
  yearMonth: string;
  year: number;
  month: number;
  division: string;
  district: string;
  thana: string;
  postCount: number;
}

export interface UniqueTutorRecord {
  tutorPhone: string;
  tutorName: string;
  studyStatus?: string;
  institution?: string;
  firstConnectedAt: string;
  lastConnectedAt: string;
}

export interface SiteStats {
  totalPosts: number;
  totalLivePosts: number;
  totalUniqueTutors: number;
  topDivision: {
    name: string;
    count: number;
  };
  runningSinceYear: number;
  geographicBreakdown: GeographicStat[];
  monthlyBreakdown: MonthlySummary[];
  yearlyBreakdown: YearlySummary[];
  locationMonthlyStats: LocationMonthlyStat[];
}

export interface GitHubProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  htmlUrl: string;
  publicRepos: number;
  location: string;
}
