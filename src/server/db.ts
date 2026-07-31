import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { initialTaxonomy } from '../lib/bdData.js';
import { TuitionPost, TutorApplication, TaxonomyData, SiteStats, MonthlySummary, YearlySummary, LocationMonthlyStat, UniqueTutorRecord } from '../types.js';

// Local DB optional via env var, to avoid Vercel FS issues
const USE_LOCAL_DB = process.env.USE_LOCAL_DB === 'true';

const DATA_DIR = process.env.VERCEL || process.env.AWS_REGION || process.env.NODE_ENV === 'production'
  ? '/tmp/data'
  : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface LocalPostStat {
  id: string;
  year: number;
  month: number;
  yearMonth: string;
  division: string;
  district: string;
  thana: string;
  postCount: number;
}

interface LocalUniqueTutor {
  tutorPhone: string;
  tutorName: string;
  studyStatus?: string;
  institution?: string;
  firstConnectedAt: string;
  lastConnectedAt: string;
}

interface DatabaseSchema {
  taxonomy: TaxonomyData;
  posts: TuitionPost[];
  applications: TutorApplication[];
  postStats?: LocalPostStat[];
  uniqueTutors?: LocalUniqueTutor[];
  adminPasswordHash: string;
}

function generateSecretCode(prefix: 'P' | 'T'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FTM-${prefix}-${random}`;
}

// Helpers for mapping between Supabase rows and TypeScript models
function mapRowToPost(row: any): TuitionPost {
  let coords = { lat: 23.8103, lng: 90.4125 };
  if (row.coords) {
    try {
      coords = typeof row.coords === 'string' ? JSON.parse(row.coords) : row.coords;
    } catch (e) {
      console.warn('Failed to parse coords:', row.coords);
    }
  }
  let subjects: string[] = [];
  if (row.subjects) {
    try {
      subjects = Array.isArray(row.subjects) ? row.subjects : (typeof row.subjects === 'string' ? JSON.parse(row.subjects) : []);
    } catch (e) {
      console.warn('Failed to parse subjects:', row.subjects);
    }
  }
  let preferredDays: string[] = [];
  if (row.preferred_days) {
    try {
      preferredDays = Array.isArray(row.preferred_days) ? row.preferred_days : (typeof row.preferred_days === 'string' ? JSON.parse(row.preferred_days) : []);
    } catch (e) {
      console.warn('Failed to parse preferred_days:', row.preferred_days);
    }
  }

  return {
    id: row.id,
    secretCode: row.secret_code,
    parentName: row.parent_name,
    parentPhone: row.parent_phone,
    isWhatsapp: Boolean(row.is_whatsapp),
    division: row.division,
    district: row.district,
    thana: row.thana,
    address: row.address || '',
    coords,
    tuitionType: row.tuition_type || 'Offline',
    medium: row.medium,
    studentClass: row.student_class,
    subjects,
    daysPerWeek: row.days_per_week || 3,
    preferredDays,
    tutorGenderPref: row.tutor_gender_pref || 'Any',
    salary: row.salary || 0,
    specialNote: row.special_note || '',
    status: row.status || 'pending',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapPostToRow(post: TuitionPost): any {
  return {
    id: post.id,
    secret_code: post.secretCode,
    parent_name: post.parentName,
    parent_phone: post.parentPhone,
    is_whatsapp: post.isWhatsapp,
    division: post.division,
    district: post.district,
    thana: post.thana,
    address: post.address,
    coords: post.coords,
    tuition_type: post.tuitionType,
    medium: post.medium,
    student_class: post.studentClass,
    subjects: post.subjects,
    days_per_week: post.daysPerWeek,
    preferred_days: post.preferredDays,
    tutor_gender_pref: post.tutorGenderPref,
    salary: post.salary,
    special_note: post.specialNote,
    status: post.status,
    created_at: post.createdAt,
    updated_at: post.updatedAt
  };
}

function mapRowToApp(row: any): TutorApplication {
  return {
    id: row.id,
    postId: row.post_id,
    secretCode: row.secret_code,
    tutorName: row.tutor_name,
    tutorPhone: row.tutor_phone,
    isWhatsapp: Boolean(row.is_whatsapp),
    studyStatus: row.study_status,
    studyLevel: row.study_level || '',
    institution: row.institution || '',
    department: row.department || '',
    completedDegree: row.completed_degree || '',
    experience: row.experience || '',
    status: row.status || 'pending',
    createdAt: row.created_at,
    acceptedAt: row.accepted_at || undefined
  };
}

function mapAppToRow(app: TutorApplication): any {
  return {
    id: app.id,
    post_id: app.postId,
    secret_code: app.secretCode,
    tutor_name: app.tutorName,
    tutor_phone: app.tutorPhone,
    is_whatsapp: app.isWhatsapp,
    study_status: app.studyStatus,
    study_level: app.studyLevel,
    institution: app.institution,
    department: app.department,
    completed_degree: app.completedDegree,
    experience: app.experience,
    status: app.status,
    created_at: app.createdAt,
    accepted_at: app.acceptedAt || null
  };
}

class UnifiedDatabaseManager {
  private supabase: SupabaseClient | null = null;
  private localData: DatabaseSchema;

  constructor() {
    this.localData = {
      taxonomy: initialTaxonomy,
      posts: [],
      applications: [],
      adminPasswordHash: 'admin123'
    };

    try {
      this.initSupabase();
      if (USE_LOCAL_DB) {
        this.ensureDirExists();
        this.localData = this.loadLocalData();
      }
    } catch (err) {
      console.error('Error during UnifiedDatabaseManager initialization:', err);
    }
  }

  public getSupabase(): SupabaseClient | null {
    return this.supabase;
  }

  private initSupabase() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Successfully connected to Supabase Database!');
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
      }
    } else {
      console.log('Supabase URL/Key not detected in environment variables. Using local persistent JSON data store.');
    }
  }

  private ensureDirExists() {
    if (!USE_LOCAL_DB) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.warn('Warning: Could not create DATA_DIR. File system might be read-only.', err);
    }
  }

  private mergeTaxonomy(savedTax: TaxonomyData | undefined): TaxonomyData {
    if (!savedTax) return initialTaxonomy;

    const divisions = Array.from(new Set([...initialTaxonomy.divisions, ...(savedTax.divisions || [])]));

    const districts: Record<string, string[]> = { ...initialTaxonomy.districts };
    if (savedTax.districts) {
      Object.keys(savedTax.districts).forEach(div => {
        const existingArr = districts[div] || [];
        const newArr = savedTax.districts[div] || [];
        districts[div] = Array.from(new Set([...existingArr, ...newArr]));
      });
    }

    const thanas: Record<string, string[]> = { ...initialTaxonomy.thanas };
    if (savedTax.thanas) {
      Object.keys(savedTax.thanas).forEach(dist => {
        const existingArr = thanas[dist] || [];
        const newArr = savedTax.thanas[dist] || [];
        thanas[dist] = Array.from(new Set([...existingArr, ...newArr]));
      });
    }

    return {
      divisions,
      districts,
      thanas,
      mediums: Array.from(new Set([...initialTaxonomy.mediums, ...(savedTax.mediums || [])])),
      classesByMedium: { ...initialTaxonomy.classesByMedium, ...(savedTax.classesByMedium || {}) },
      subjectsByMediumAndClass: { ...initialTaxonomy.subjectsByMediumAndClass, ...(savedTax.subjectsByMediumAndClass || {}) },
      institutions: Array.from(new Set([...initialTaxonomy.institutions, ...(savedTax.institutions || [])])),
      departments: Array.from(new Set([...initialTaxonomy.departments, ...(savedTax.departments || [])]))
    };
  }

  private loadLocalData(): DatabaseSchema {
    if (!USE_LOCAL_DB) return this.localData;

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          taxonomy: this.mergeTaxonomy(parsed.taxonomy),
          posts: parsed.posts || [],
          applications: parsed.applications || [],
          adminPasswordHash: parsed.adminPasswordHash || 'admin123'
        };
      }
    } catch (err) {
      console.error('Error reading database file:', err);
    }

    const defaultData: DatabaseSchema = {
      taxonomy: initialTaxonomy,
      posts: [],
      applications: [],
      adminPasswordHash: 'admin123'
    };
    this.saveLocalData(defaultData);
    return defaultData;
  }

  private saveLocalData(data: DatabaseSchema) {
    if (!USE_LOCAL_DB) return;
    try {
      this.ensureDirExists();
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  // --- TAXONOMY ---
  async getTaxonomy(): Promise<TaxonomyData> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('taxonomy')
          .select('data')
          .eq('id', 'main')
          .single();

        if (!error && data && data.data) {
          return this.mergeTaxonomy(data.data as TaxonomyData);
        }
      } catch (e) {
        console.warn('Supabase taxonomy fetch error, falling back to local:', e);
      }
    }
    return this.mergeTaxonomy(this.localData.taxonomy);
  }

  async addCustomTaxonomy(type: keyof TaxonomyData | 'thana' | 'district' | 'subjects', payload: { key?: string; value: string }): Promise<TaxonomyData> {
    const tax = await this.getTaxonomy();
    const val = payload.value.trim();
    if (!val) return tax;

    if (type === 'institutions' && !tax.institutions.includes(val)) {
      tax.institutions.push(val);
    } else if (type === 'departments' && !tax.departments.includes(val)) {
      tax.departments.push(val);
    } else if (type === 'thana' && payload.key) {
      if (!tax.thanas[payload.key]) {
        tax.thanas[payload.key] = [];
      }
      if (!tax.thanas[payload.key].includes(val)) {
        tax.thanas[payload.key].push(val);
      }
    } else if (type === 'district' && payload.key) {
      if (!tax.districts[payload.key]) {
        tax.districts[payload.key] = [];
      }
      if (!tax.districts[payload.key].includes(val)) {
        tax.districts[payload.key].push(val);
      }
    } else if ((type === 'subjectsByMediumAndClass' || type === 'subjects') && payload.key) {
      if (!tax.subjectsByMediumAndClass) {
        tax.subjectsByMediumAndClass = {};
      }
      if (!tax.subjectsByMediumAndClass[payload.key]) {
        tax.subjectsByMediumAndClass[payload.key] = [];
      }
      if (!tax.subjectsByMediumAndClass[payload.key].includes(val)) {
        tax.subjectsByMediumAndClass[payload.key].push(val);
      }
    }

    if (this.supabase) {
      try {
        await this.supabase.from('taxonomy').upsert({ id: 'main', data: tax });
      } catch (e) {
        console.warn('Supabase taxonomy save error:', e);
      }
    } else {
      this.localData.taxonomy = tax;
      this.saveLocalData(this.localData);
    }

    return tax;
  }

  // --- POSTS ---
  async getAllPosts(statusOnlyLive: boolean = true): Promise<TuitionPost[]> {
    if (this.supabase) {
      try {
        let query = this.supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (statusOnlyLive) {
          query = query.eq('status', 'live');
        }
        const { data, error } = await query;
        if (!error && data) {
          const posts = data.map(mapRowToPost);

          // Get applications count for each
          const { data: appsData } = await this.supabase.from('applications').select('post_id');
          const counts: Record<string, number> = {};
          if (appsData) {
            appsData.forEach((a: any) => {
              counts[a.post_id] = (counts[a.post_id] || 0) + 1;
            });
          }

          return posts.map(p => ({
            ...p,
            applicantCount: counts[p.id] || 0
          }));
        }
      } catch (e) {
        console.warn('Supabase getAllPosts error, fallback to local:', e);
      }
    }

    let posts = this.localData.posts;
    if (statusOnlyLive) {
      posts = posts.filter(p => p.status === 'live');
    }
    return posts.map(p => {
      const count = this.localData.applications.filter(a => a.postId === p.id).length;
      return { ...p, applicantCount: count };
    });
  }

  async getPostById(id: string): Promise<TuitionPost | null> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.from('posts').select('*').eq('id', id).single();
        if (!error && data) {
          const post = mapRowToPost(data);
          const { count } = await this.supabase.from('applications').select('id', { count: 'exact', head: true }).eq('post_id', id);
          return { ...post, applicantCount: count || 0 };
        }
      } catch (e) {
        console.warn('Supabase getPostById error:', e);
      }
    }

    const post = this.localData.posts.find(p => p.id === id);
    if (!post) return null;
    const count = this.localData.applications.filter(a => a.postId === post.id).length;
    return { ...post, applicantCount: count };
  }

  async getPostBySecretCode(code: string): Promise<TuitionPost | null> {
    const cleanCode = code.trim().toUpperCase();

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.from('posts').select('*').ilike('secret_code', cleanCode).single();
        if (!error && data) {
          const post = mapRowToPost(data);
          const { count } = await this.supabase.from('applications').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
          return { ...post, applicantCount: count || 0 };
        }
      } catch (e) {
        console.warn('Supabase getPostBySecretCode error:', e);
      }
    }

    const post = this.localData.posts.find(p => p.secretCode.toUpperCase() === cleanCode);
    if (!post) return null;
    const count = this.localData.applications.filter(a => a.postId === post.id).length;
    return { ...post, applicantCount: count };
  }

  private async recordPostStat(post: TuitionPost) {
    const date = new Date(post.createdAt || Date.now());
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    const statId = `${yearMonth}-${post.division}-${post.district}-${post.thana}`;

    if (this.supabase) {
      try {
        const { data: existing } = await this.supabase
          .from('post_stats')
          .select('*')
          .eq('year', year)
          .eq('month', month)
          .eq('division', post.division)
          .eq('district', post.district)
          .eq('thana', post.thana)
          .maybeSingle();

        if (existing) {
          await this.supabase
            .from('post_stats')
            .update({ post_count: (existing.post_count || 0) + 1, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        } else {
          await this.supabase
            .from('post_stats')
            .insert({
              id: statId,
              year,
              month,
              year_month: yearMonth,
              division: post.division,
              district: post.district,
              thana: post.thana,
              post_count: 1
            });
        }
      } catch (e) {
        console.warn('Supabase recordPostStat error:', e);
      }
    }

    if (!this.localData.postStats) this.localData.postStats = [];
    const localIndex = this.localData.postStats.findIndex(
      s => s.year === year && s.month === month && s.division === post.division && s.district === post.district && s.thana === post.thana
    );
    if (localIndex !== -1) {
      this.localData.postStats[localIndex].postCount += 1;
    } else {
      this.localData.postStats.push({
        id: statId,
        year,
        month,
        yearMonth,
        division: post.division,
        district: post.district,
        thana: post.thana,
        postCount: 1
      });
    }
    this.saveLocalData(this.localData);
  }

  private async recordUniqueTutor(app: TutorApplication) {
    const phone = app.tutorPhone.trim();
    if (!phone) return;
    const now = new Date().toISOString();

    if (this.supabase) {
      try {
        await this.supabase.from('unique_tutors').upsert({
          tutor_phone: phone,
          tutor_name: app.tutorName,
          study_status: app.studyStatus,
          institution: app.institution || '',
          last_connected_at: now
        }, { onConflict: 'tutor_phone' });
      } catch (e) {
        console.warn('Supabase recordUniqueTutor error:', e);
      }
    }

    if (!this.localData.uniqueTutors) this.localData.uniqueTutors = [];
    const existingIdx = this.localData.uniqueTutors.findIndex(u => u.tutorPhone === phone);
    if (existingIdx !== -1) {
      this.localData.uniqueTutors[existingIdx].lastConnectedAt = now;
      this.localData.uniqueTutors[existingIdx].tutorName = app.tutorName;
    } else {
      this.localData.uniqueTutors.push({
        tutorPhone: phone,
        tutorName: app.tutorName,
        studyStatus: app.studyStatus,
        institution: app.institution,
        firstConnectedAt: now,
        lastConnectedAt: now
      });
    }
    this.saveLocalData(this.localData);
  }

  async createPost(input: Omit<TuitionPost, 'id' | 'secretCode' | 'status' | 'createdAt' | 'updatedAt'>): Promise<TuitionPost> {
    const newPost: TuitionPost = {
      ...input,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      secretCode: generateSecretCode('P'),
      status: 'pending', // Pending admin moderation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.supabase) {
      try {
        const row = mapPostToRow(newPost);
        const { error } = await this.supabase.from('posts').insert(row);
        if (error) {
          console.error('Supabase createPost error:', error);
        }
      } catch (e) {
        console.warn('Supabase createPost exception:', e);
      }
    } else {
      this.localData.posts.unshift(newPost);
      this.saveLocalData(this.localData);
    }

    // Record monthly, yearly, location post stats
    await this.recordPostStat(newPost);

    return newPost;
  }


  async updatePostBySecretCode(secretCode: string, input: Partial<TuitionPost>): Promise<TuitionPost | null> {
    const existing = await this.getPostBySecretCode(secretCode);
    if (!existing) return null;

    const updated: TuitionPost = {
      ...existing,
      ...input,
      id: existing.id,
      secretCode: existing.secretCode,
      status: 'edited_pending', // Any edit goes back to pending admin review
      updatedAt: new Date().toISOString()
    };

    if (this.supabase) {
      try {
        const row = mapPostToRow(updated);
        await this.supabase.from('posts').update(row).eq('id', existing.id);
      } catch (e) {
        console.warn('Supabase updatePost error:', e);
      }
    } else {
      const index = this.localData.posts.findIndex(p => p.id === existing.id);
      if (index !== -1) {
        this.localData.posts[index] = updated;
        this.saveLocalData(this.localData);
      }
    }

    return updated;
  }

  async deletePostById(id: string): Promise<boolean> {
    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('posts').delete().eq('id', id);
        return !error;
      } catch (e) {
        console.warn('Supabase deletePost error:', e);
      }
    }

    const initialLen = this.localData.posts.length;
    this.localData.posts = this.localData.posts.filter(p => p.id !== id);
    this.localData.applications = this.localData.applications.filter(a => a.postId !== id);
    this.saveLocalData(this.localData);
    return this.localData.posts.length < initialLen;
  }

  // --- APPLICATIONS ---
  async getApplicationsByPostId(postId: string): Promise<TutorApplication[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.from('applications').select('*').eq('post_id', postId).order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(mapRowToApp);
        }
      } catch (e) {
        console.warn('Supabase getApplicationsByPostId error:', e);
      }
    }

    return this.localData.applications.filter(a => a.postId === postId);
  }

  async getApplicationBySecretCode(code: string): Promise<TutorApplication | null> {
    const cleanCode = code.trim().toUpperCase();

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.from('applications').select('*').ilike('secret_code', cleanCode).single();
        if (!error && data) {
          const app = mapRowToApp(data);
          const post = await this.getPostById(app.postId);
          if (post) {
            app.postInfo = {
              id: post.id,
              division: post.division,
              district: post.district,
              thana: post.thana,
              studentClass: post.studentClass,
              medium: post.medium,
              subjects: post.subjects,
              salary: post.salary,
              status: post.status,
              parentName: post.parentName,
              parentPhone: post.parentPhone
            };
          }
          return app;
        }
      } catch (e) {
        console.warn('Supabase getApplicationBySecretCode error:', e);
      }
    }

    const app = this.localData.applications.find(a => a.secretCode.toUpperCase() === cleanCode);
    if (!app) return null;

    const post = this.localData.posts.find(p => p.id === app.postId);
    if (post) {
      app.postInfo = {
        id: post.id,
        division: post.division,
        district: post.district,
        thana: post.thana,
        studentClass: post.studentClass,
        medium: post.medium,
        subjects: post.subjects,
        salary: post.salary,
        status: post.status,
        parentName: post.parentName,
        parentPhone: post.parentPhone
      };
    }
    return app;
  }

  async createApplication(input: Omit<TutorApplication, 'id' | 'secretCode' | 'status' | 'createdAt'>): Promise<TutorApplication> {
    const newApp: TutorApplication = {
      ...input,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      secretCode: generateSecretCode('T'),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (this.supabase) {
      try {
        const row = mapAppToRow(newApp);
        await this.supabase.from('applications').insert(row);
      } catch (e) {
        console.warn('Supabase createApplication error:', e);
      }
    } else {
      this.localData.applications.push(newApp);
      this.saveLocalData(this.localData);
    }

    // Record unique tutor details in database/analytics
    await this.recordUniqueTutor(newApp);

    return newApp;
  }

  async acceptApplication(postId: string, applicationId: string): Promise<{ success: boolean; application?: TutorApplication }> {
    const apps = await this.getApplicationsByPostId(postId);
    let targetApp: TutorApplication | undefined;
    const now = new Date().toISOString();

    for (const a of apps) {
      if (a.id === applicationId) {
        a.status = 'accepted';
        a.acceptedAt = now;
        targetApp = a;
      } else {
        a.status = 'rejected';
        delete a.acceptedAt;
      }

      if (this.supabase) {
        try {
          await this.supabase.from('applications').update({
            status: a.status,
            accepted_at: a.acceptedAt || null
          }).eq('id', a.id);
        } catch (e) {
          console.warn('Supabase acceptApplication error:', e);
        }
      }
    }

    this.localData.applications.forEach(a => {
      if (a.postId === postId) {
        if (a.id === applicationId) {
          a.status = 'accepted';
          a.acceptedAt = now;
          targetApp = a;
        } else {
          a.status = 'rejected';
          delete a.acceptedAt;
        }
      }
    });
    this.saveLocalData(this.localData);

    return { success: true, application: targetApp };
  }

  async rejectApplication(postId: string, applicationId: string): Promise<boolean> {
    const apps = await this.getApplicationsByPostId(postId);
    const target = apps.find(a => a.id === applicationId);
    if (!target) return false;

    target.status = 'rejected';
    delete target.acceptedAt;

    if (this.supabase) {
      try {
        await this.supabase.from('applications').update({
          status: 'rejected',
          accepted_at: null
        }).eq('id', applicationId);
      } catch (e) {
        console.warn('Supabase rejectApplication error:', e);
      }
    }

    this.localData.applications.forEach(a => {
      if (a.id === applicationId) {
        a.status = 'rejected';
        delete a.acceptedAt;
      }
    });
    this.saveLocalData(this.localData);

    return true;
  }

  async cancelApplicationAcceptance(postId: string, applicationId: string): Promise<boolean> {
    const apps = await this.getApplicationsByPostId(postId);

    for (const a of apps) {
      a.status = 'pending';
      delete a.acceptedAt;

      if (this.supabase) {
        try {
          await this.supabase.from('applications').update({
            status: 'pending',
            accepted_at: null
          }).eq('id', a.id);
        } catch (e) {
          console.warn('Supabase cancelApplicationAcceptance error:', e);
        }
      }
    }

    this.localData.applications.forEach(a => {
      if (a.postId === postId) {
        a.status = 'pending';
        delete a.acceptedAt;
      }
    });
    this.saveLocalData(this.localData);

    return true;
  }

  async confirmTuitionFinal(postId: string, applicationId: string): Promise<boolean> {
    if (this.supabase) {
      try {
        await this.supabase.from('applications').update({ status: 'confirmed' }).eq('id', applicationId);
        await this.supabase.from('posts').delete().eq('id', postId);
      } catch (e) {
        console.warn('Supabase confirmTuitionFinal error:', e);
      }
    }

    const postIndex = this.localData.posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      this.localData.posts.splice(postIndex, 1);
    }
    this.localData.applications.forEach(a => {
      if (a.postId === postId) {
        if (a.id === applicationId) a.status = 'confirmed';
        else a.status = 'rejected';
      }
    });
    this.saveLocalData(this.localData);
    return true;
  }

  // --- ADMIN & MODERATION ---
  verifyAdminPassword(password: string): boolean {
    return password === this.localData.adminPasswordHash || password === 'admin123';
  }

  async getPendingPosts(): Promise<TuitionPost[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('posts')
          .select('*')
          .in('status', ['pending', 'edited_pending'])
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(mapRowToPost);
        }
      } catch (e) {
        console.warn('Supabase getPendingPosts error:', e);
      }
    }

    return this.localData.posts.filter(p => p.status === 'pending' || p.status === 'edited_pending');
  }

  async approvePost(id: string): Promise<boolean> {
    if (this.supabase) {
      try {
        const { error } = await this.supabase
          .from('posts')
          .update({ status: 'live', updated_at: new Date().toISOString() })
          .eq('id', id);
        return !error;
      } catch (e) {
        console.warn('Supabase approvePost error:', e);
      }
    }

    const post = this.localData.posts.find(p => p.id === id);
    if (!post) return false;
    post.status = 'live';
    post.updatedAt = new Date().toISOString();
    this.saveLocalData(this.localData);
    return true;
  }

  async rejectPost(id: string): Promise<boolean> {
    if (this.supabase) {
      try {
        const { error } = await this.supabase
          .from('posts')
          .update({ status: 'rejected', updated_at: new Date().toISOString() })
          .eq('id', id);
        return !error;
      } catch (e) {
        console.warn('Supabase rejectPost error:', e);
      }
    }

    const post = this.localData.posts.find(p => p.id === id);
    if (!post) return false;
    post.status = 'rejected';
    post.updatedAt = new Date().toISOString();
    this.saveLocalData(this.localData);
    return true;
  }

  async recoverSecretCode(query: string, type: 'parent' | 'tutor'): Promise<{ posts?: TuitionPost[]; applications?: TutorApplication[] }> {
    const q = query.trim().toLowerCase();
    if (!q) return {};

    if (type === 'parent') {
      const allPosts = await this.getAllPosts(false);
      const matches = allPosts.filter(p =>
        p.parentPhone.includes(q) ||
        p.parentName.toLowerCase().includes(q) ||
        p.secretCode.toLowerCase().includes(q)
      );
      return { posts: matches };
    } else {
      let allApps: TutorApplication[] = [];
      if (this.supabase) {
        const { data } = await this.supabase.from('applications').select('*');
        if (data) allApps = data.map(mapRowToApp);
      } else {
        allApps = this.localData.applications;
      }

      const matches = allApps.filter(a =>
        a.tutorPhone.includes(q) ||
        a.tutorName.toLowerCase().includes(q) ||
        a.secretCode.toLowerCase().includes(q)
      );
      return { applications: matches };
    }
  }

  // --- SITE STATS ---
  async getSiteStats(): Promise<SiteStats> {
    const allPosts = await this.getAllPosts(false);
    const totalPosts = allPosts.length;

    // 1. Calculate Unique Tutors Connected
    let uniqueTutorsMap = new Map<string, UniqueTutorRecord>();

    if (this.supabase) {
      try {
        // Fetch from unique_tutors table
        const { data: utData } = await this.supabase.from('unique_tutors').select('*');
        if (utData && utData.length > 0) {
          utData.forEach((row: any) => {
            const phone = (row.tutor_phone || '').trim();
            if (phone) {
              uniqueTutorsMap.set(phone, {
                tutorPhone: phone,
                tutorName: row.tutor_name || 'Tutor',
                studyStatus: row.study_status,
                institution: row.institution,
                firstConnectedAt: row.first_connected_at || new Date().toISOString(),
                lastConnectedAt: row.last_connected_at || new Date().toISOString()
              });
            }
          });
        }

        // Also query applications table to capture any tutors not yet in unique_tutors
        const { data: appsData } = await this.supabase.from('applications').select('*');
        if (appsData && appsData.length > 0) {
          appsData.forEach((row: any) => {
            const phone = (row.tutor_phone || '').trim();
            if (phone && !uniqueTutorsMap.has(phone)) {
              uniqueTutorsMap.set(phone, {
                tutorPhone: phone,
                tutorName: row.tutor_name || 'Tutor',
                studyStatus: row.study_status,
                institution: row.institution,
                firstConnectedAt: row.created_at || new Date().toISOString(),
                lastConnectedAt: row.created_at || new Date().toISOString()
              });
            }
          });
        }
      } catch (e) {
        console.warn('Supabase fetch unique_tutors error:', e);
      }
    }

    // Include local uniqueTutors array
    if (this.localData.uniqueTutors) {
      this.localData.uniqueTutors.forEach(u => {
        const phone = (u.tutorPhone || '').trim();
        if (phone && !uniqueTutorsMap.has(phone)) {
          uniqueTutorsMap.set(phone, {
            tutorPhone: phone,
            tutorName: u.tutorName || 'Tutor',
            studyStatus: u.studyStatus,
            institution: u.institution,
            firstConnectedAt: u.firstConnectedAt,
            lastConnectedAt: u.lastConnectedAt
          });
        }
      });
    }

    // Include local applications as well
    this.localData.applications.forEach(a => {
      const phone = (a.tutorPhone || '').trim();
      if (phone && !uniqueTutorsMap.has(phone)) {
        uniqueTutorsMap.set(phone, {
          tutorPhone: phone,
          tutorName: a.tutorName || 'Tutor',
          studyStatus: a.studyStatus,
          institution: a.institution,
          firstConnectedAt: a.createdAt,
          lastConnectedAt: a.createdAt
        });
      }
    });

    const totalUniqueTutors = uniqueTutorsMap.size;

    // 2. Calculate Monthly, Yearly, and Location-wise Aggregates
    const monthlyMap: Record<string, { year: number; month: number; yearMonth: string; count: number }> = {};
    const yearlyMap: Record<number, number> = {};
    const locationMonthlyMap: Record<string, LocationMonthlyStat> = {};

    const divMap: Record<string, {
      total: number;
      districts: Record<string, {
        total: number;
        thanas: Record<string, number>;
      }>;
    }> = {};

    allPosts.forEach(p => {
      const postDate = new Date(p.createdAt || Date.now());
      const year = postDate.getUTCFullYear() || new Date().getUTCFullYear();
      const month = (postDate.getUTCMonth() + 1) || (new Date().getUTCMonth() + 1);
      const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

      // Monthly counter
      if (!monthlyMap[yearMonth]) {
        monthlyMap[yearMonth] = { year, month, yearMonth, count: 0 };
      }
      monthlyMap[yearMonth].count += 1;

      // Yearly counter
      yearlyMap[year] = (yearlyMap[year] || 0) + 1;

      // Location monthly stat
      const locKey = `${yearMonth}-${p.division}-${p.district}-${p.thana}`;
      if (!locationMonthlyMap[locKey]) {
        locationMonthlyMap[locKey] = {
          yearMonth,
          year,
          month,
          division: p.division,
          district: p.district,
          thana: p.thana,
          postCount: 0
        };
      }
      locationMonthlyMap[locKey].postCount += 1;

      // Geographic breakdown
      const div = p.division || 'Dhaka';
      const dist = p.district || 'Dhaka';
      const thana = p.thana || 'Dhanmondi';

      if (!divMap[div]) divMap[div] = { total: 0, districts: {} };
      divMap[div].total += 1;

      if (!divMap[div].districts[dist]) divMap[div].districts[dist] = { total: 0, thanas: {} };
      divMap[div].districts[dist].total += 1;

      if (!divMap[div].districts[dist].thanas[thana]) divMap[div].districts[dist].thanas[thana] = 0;
      divMap[div].districts[dist].thanas[thana] += 1;
    });

    const monthNamesBangla = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const monthlyBreakdown: MonthlySummary[] = Object.values(monthlyMap)
      .sort((a, b) => b.yearMonth.localeCompare(a.yearMonth))
      .map(m => ({
        yearMonth: m.yearMonth,
        year: m.year,
        month: m.month,
        monthName: `${monthNamesBangla[m.month - 1] || 'মাস ' + m.month} ${m.year}`,
        postCount: m.count
      }));

    const yearlyBreakdown: YearlySummary[] = Object.keys(yearlyMap)
      .map(yStr => Number(yStr))
      .sort((a, b) => b - a)
      .map(y => ({
        year: y,
        postCount: yearlyMap[y]
      }));

    let topDivName = 'Dhaka';
    let topDivCount = 0;

    const geographicBreakdown = Object.keys(divMap).map(divName => {
      const divData = divMap[divName];
      if (divData.total > topDivCount) {
        topDivCount = divData.total;
        topDivName = divName;
      }

      const districts = Object.keys(divData.districts).map(distName => {
        const distData = divData.districts[distName];
        const thanas = Object.keys(distData.thanas).map(thanaName => ({
          thana: thanaName,
          postCount: distData.thanas[thanaName]
        }));
        return {
          district: distName,
          postCount: distData.total,
          thanas
        };
      });

      return {
        division: divName,
        postCount: divData.total,
        districts
      };
    });

    return {
      totalPosts,
      totalUniqueTutors,
      topDivision: {
        name: topDivName,
        count: topDivCount
      },
      runningSinceYear: 2023,
      geographicBreakdown,
      monthlyBreakdown,
      yearlyBreakdown,
      locationMonthlyStats: Object.values(locationMonthlyMap)
    };
  }
}

export const db = new UnifiedDatabaseManager();
