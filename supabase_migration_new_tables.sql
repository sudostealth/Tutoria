-- ====================================================================
-- SUPABASE MIGRATION SCRIPT FOR NEW TABLES & ANALYTICS
-- Run this script in your Supabase SQL Editor to add the missing tables.
-- ====================================================================

-- 1. MONTHLY & YEARLY POST STATS TABLE
-- Stores post counts aggregated by Year, Month, Division, District, and Thana
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

-- 2. UNIQUE TUTORS CONNECTED TABLE
-- Stores unique tutor records indexed by tutor phone number
CREATE TABLE IF NOT EXISTS unique_tutors (
  tutor_phone TEXT PRIMARY KEY,
  tutor_name TEXT NOT NULL,
  study_status TEXT,
  institution TEXT,
  first_connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_connected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES FOR FAST ANALYTICS QUERYING
CREATE INDEX IF NOT EXISTS idx_post_stats_ym ON post_stats(year, month);
CREATE INDEX IF NOT EXISTS idx_post_stats_year ON post_stats(year);
CREATE INDEX IF NOT EXISTS idx_post_stats_location ON post_stats(division, district, thana);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE post_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_tutors ENABLE ROW LEVEL SECURITY;

-- Permissive policies for API operations (Anon & Authenticated)
CREATE POLICY "Allow public read post_stats" ON post_stats FOR SELECT USING (true);
CREATE POLICY "Allow public manage post_stats" ON post_stats FOR ALL USING (true);

CREATE POLICY "Allow public read unique_tutors" ON unique_tutors FOR SELECT USING (true);
CREATE POLICY "Allow public manage unique_tutors" ON unique_tutors FOR ALL USING (true);
