-- CivicBridge core schema (PGLite-safe: no extensions)

create table if not exists profiles (
  user_id text primary key,
  display_name text,
  role text not null default 'citizen',
  org_name text,
  expertise text,
  created_at timestamptz not null default now()
);

create table if not exists problems (
  id text primary key,
  title text not null,
  summary text not null,
  category text not null,
  subcategory text,
  priority text not null default 'medium',
  locality text,
  district text,
  lat double precision,
  lng double precision,
  status text not null default 'open',
  report_count int not null default 1,
  required_expertise text,
  fingerprint text,
  confidence double precision not null default 0.7,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reports (
  id text primary key,
  user_id text not null,
  problem_id text references problems(id),
  source text not null default 'web',
  raw_text text not null,
  structured_title text,
  structured_summary text,
  category text,
  locality text,
  district text,
  lat double precision,
  lng double precision,
  processing_status text not null default 'received',
  relationship_type text,
  relationship_confidence double precision,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_id_idx on reports (user_id);
create index if not exists reports_problem_id_idx on reports (problem_id);

create table if not exists status_events (
  id text primary key,
  problem_id text not null references problems(id),
  actor_user_id text,
  kind text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists status_events_problem_idx on status_events (problem_id);

create table if not exists university_interests (
  id text primary key,
  user_id text not null,
  problem_id text not null references problems(id),
  org_name text not null,
  note text,
  status text not null default 'proposed',
  created_at timestamptz not null default now()
);

create index if not exists university_interests_user_idx on university_interests (user_id);

create table if not exists partners (
  id text primary key,
  name text not null,
  kind text not null,
  expertise text not null,
  district text,
  capacity int not null default 5
);

create table if not exists audit_logs (
  id text primary key,
  user_id text,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);
