-- =======================================================
-- TUTORIA (FREE TUITION MEDIA) - SUPABASE DATABASE SCHEMA
-- Run this in your Supabase project SQL Editor
-- =======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. POSTS TABLE
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  secret_code TEXT UNIQUE NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  is_whatsapp BOOLEAN DEFAULT false,
  division TEXT NOT NULL,
  district TEXT NOT NULL,
  thana TEXT NOT NULL,
  address TEXT,
  coords JSONB DEFAULT '{"lat": 23.8103, "lng": 90.4125}'::jsonb,
  tuition_type TEXT DEFAULT 'Offline',
  medium TEXT NOT NULL,
  student_class TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  days_per_week INT DEFAULT 3,
  preferred_days JSONB DEFAULT '[]'::jsonb,
  tutor_gender_pref TEXT DEFAULT 'Any',
  salary INT NOT NULL DEFAULT 5000,
  special_note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_secret_code ON posts(secret_code);
CREATE INDEX IF NOT EXISTS idx_posts_location ON posts(division, district, thana);

-- 2. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  secret_code TEXT UNIQUE NOT NULL,
  tutor_name TEXT NOT NULL,
  tutor_phone TEXT NOT NULL,
  is_whatsapp BOOLEAN DEFAULT false,
  study_status TEXT NOT NULL,
  study_level TEXT,
  institution TEXT,
  department TEXT,
  completed_degree TEXT,
  experience TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

-- Indexes for applications
CREATE INDEX IF NOT EXISTS idx_applications_post_id ON applications(post_id);
CREATE INDEX IF NOT EXISTS idx_applications_secret_code ON applications(secret_code);

-- 3. TAXONOMY TABLE
CREATE TABLE IF NOT EXISTS taxonomy (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL
);

-- 4. MONTHLY & YEARLY POST STATS TABLE (Grouped by Year, Month, Division, District, Thana)
CREATE TABLE IF NOT EXISTS post_stats (
  id TEXT PRIMARY KEY,
  year INT NOT NULL,
  month INT NOT NULL,
  year_month TEXT NOT NULL,
  division TEXT NOT NULL,
  district TEXT NOT NULL,
  thana TEXT NOT NULL,
  post_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unq_year_month_location UNIQUE (year, month, division, district, thana)
);

-- 5. UNIQUE TUTORS CONNECTED TABLE
CREATE TABLE IF NOT EXISTS unique_tutors (
  tutor_phone TEXT PRIMARY KEY,
  tutor_name TEXT NOT NULL,
  study_status TEXT,
  institution TEXT,
  first_connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_connected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for statistics performance
CREATE INDEX IF NOT EXISTS idx_post_stats_ym ON post_stats(year, month);
CREATE INDEX IF NOT EXISTS idx_post_stats_year ON post_stats(year);
CREATE INDEX IF NOT EXISTS idx_post_stats_location ON post_stats(division, district, thana);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_tutors ENABLE ROW LEVEL SECURITY;

-- Permissive policies for API operations
CREATE POLICY "Allow public read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete posts" ON posts FOR DELETE USING (true);

CREATE POLICY "Allow public read applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update applications" ON applications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete applications" ON applications FOR DELETE USING (true);

CREATE POLICY "Allow public read taxonomy" ON taxonomy FOR SELECT USING (true);
CREATE POLICY "Allow public taxonomy manage" ON taxonomy FOR ALL USING (true);

CREATE POLICY "Allow public read post_stats" ON post_stats FOR SELECT USING (true);
CREATE POLICY "Allow public manage post_stats" ON post_stats FOR ALL USING (true);

CREATE POLICY "Allow public read unique_tutors" ON unique_tutors FOR SELECT USING (true);
CREATE POLICY "Allow public manage unique_tutors" ON unique_tutors FOR ALL USING (true);
