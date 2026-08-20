-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.posts (
  id text NOT NULL,
  secret_code text NOT NULL UNIQUE,
  parent_name text NOT NULL,
  parent_phone text NOT NULL,
  is_whatsapp boolean DEFAULT false,
  division text NOT NULL,
  district text NOT NULL,
  thana text NOT NULL,
  address text,
  coords jsonb DEFAULT '{"lat": 23.8103, "lng": 90.4125}'::jsonb,
  tuition_type text DEFAULT 'Offline'::text,
  medium text NOT NULL,
  student_class text NOT NULL,
  subjects jsonb NOT NULL DEFAULT '[]'::jsonb,
  days_per_week integer DEFAULT 3,
  preferred_days jsonb DEFAULT '[]'::jsonb,
  tutor_gender_pref text DEFAULT 'Any'::text,
  salary integer NOT NULL DEFAULT 5000,
  special_note text,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.applications (
  id text NOT NULL,
  post_id text,
  secret_code text NOT NULL UNIQUE,
  tutor_name text NOT NULL,
  tutor_phone text NOT NULL,
  is_whatsapp boolean DEFAULT false,
  study_status text NOT NULL,
  study_level text,
  institution text,
  department text,
  completed_degree text,
  experience text NOT NULL,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  accepted_at timestamp with time zone,
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.taxonomy (
  id text NOT NULL DEFAULT 'main'::text,
  data jsonb NOT NULL,
  CONSTRAINT taxonomy_pkey PRIMARY KEY (id)
);
CREATE TABLE public.post_stats (
  id text NOT NULL,
  year integer NOT NULL,
  month integer NOT NULL,
  year_month text NOT NULL,
  division text NOT NULL,
  district text NOT NULL,
  thana text NOT NULL,
  post_count integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT post_stats_pkey PRIMARY KEY (id)
);
CREATE TABLE public.unique_tutors (
  tutor_phone text NOT NULL,
  tutor_name text NOT NULL,
  study_status text,
  institution text,
  first_connected_at timestamp with time zone DEFAULT now(),
  last_connected_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_tutors_pkey PRIMARY KEY (tutor_phone)
);
