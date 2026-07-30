-- Tutoria Database Schema for Supabase / PostgreSQL
-- Copy and run this script in your Supabase SQL Editor

-- 1. Taxonomy Table
CREATE TABLE IF NOT EXISTS taxonomy (
  id VARCHAR(50) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Posts Table (Tuition Requests)
CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(100) PRIMARY KEY,
  secret_code VARCHAR(50) NOT NULL UNIQUE,
  parent_name VARCHAR(150) NOT NULL,
  parent_phone VARCHAR(30) NOT NULL,
  is_whatsapp BOOLEAN DEFAULT FALSE,
  division VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  thana VARCHAR(50) NOT NULL,
  address TEXT DEFAULT '',
  coords JSONB DEFAULT '{"lat": 23.8103, "lng": 90.4125}',
  tuition_type VARCHAR(50) DEFAULT 'Offline',
  medium VARCHAR(100) NOT NULL,
  student_class VARCHAR(100) NOT NULL,
  subjects JSONB DEFAULT '[]',
  days_per_week INT DEFAULT 3,
  preferred_days JSONB DEFAULT '[]',
  tutor_gender_pref VARCHAR(30) DEFAULT 'Any',
  salary INT DEFAULT 5000,
  special_note TEXT DEFAULT '',
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for searching live posts
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_division_district_thana ON posts(division, district, thana);

-- 3. Applications Table (Tutor Applications)
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(100) PRIMARY KEY,
  post_id VARCHAR(100) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  secret_code VARCHAR(50) NOT NULL UNIQUE,
  tutor_name VARCHAR(150) NOT NULL,
  tutor_phone VARCHAR(30) NOT NULL,
  is_whatsapp BOOLEAN DEFAULT FALSE,
  study_status VARCHAR(100) NOT NULL,
  study_level VARCHAR(100) DEFAULT '',
  institution VARCHAR(200) DEFAULT '',
  department VARCHAR(200) DEFAULT '',
  completed_degree VARCHAR(200) DEFAULT '',
  experience TEXT DEFAULT '',
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_applications_post_id ON applications(post_id);

-- 4. Post Monthly Stats Table
CREATE TABLE IF NOT EXISTS post_stats (
  id VARCHAR(150) PRIMARY KEY,
  year INT NOT NULL,
  month INT NOT NULL,
  year_month VARCHAR(20) NOT NULL,
  division VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  thana VARCHAR(50) NOT NULL,
  post_count INT DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Unique Tutors Connected Table
CREATE TABLE IF NOT EXISTS unique_tutors (
  tutor_phone VARCHAR(30) PRIMARY KEY,
  tutor_name VARCHAR(150) NOT NULL,
  study_status VARCHAR(100),
  institution VARCHAR(200),
  first_connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
