-- Run this in the Supabase SQL editor to set up storage tables.

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null,                -- 'adzuna', 'greenhouse', etc.
  external_id text not null,           -- id from the source API, for dedup
  title text not null,
  company text not null,
  location text,
  is_remote boolean default false,
  description text,
  apply_url text not null,
  salary_min numeric,
  salary_max numeric,
  relevance_score int,                 -- 0-100, set by Claude scoring step
  relevance_reason text,               -- one-line "why this matches you"
  status text default 'new',           -- new | reviewed | applied | skipped
  posted_at timestamptz,
  found_at timestamptz default now(),
  unique (source, external_id)
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  full_name text,
  title text,
  email text,
  linkedin_search_url text,            -- fallback when Apollo has no match
  source text default 'apollo',        -- 'apollo' | 'linkedin_search_link' | 'github'
  found_at timestamptz default now()
);

create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_jobs_found_at on jobs(found_at desc);
