-- ════════════════════════════════════════════════════════════════════
-- SkillCompass UAE — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS guards.
-- ════════════════════════════════════════════════════════════════════

-- ── Extensions ──────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Helper: keep updated_at fresh ───────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ════════════════════════════════════════════════════════════════════
-- profiles — one row per learner, linked to auth.users
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.profiles (
  id                       uuid primary key references auth.users(id) on delete cascade,
  full_name                text,
  age_range                text,                       -- e.g. '13-15', '16-18', '19-24'
  language_preference      text not null default 'english'
                             check (language_preference in ('english','arabic','bilingual')),
  goal                     text
                             check (goal in (
                               'ai_basics','coding_foundations','english_communication',
                               'university_readiness','entrepreneurship_skills')),
  confidence_level         int  check (confidence_level between 1 and 5),
  accessibility_preference text not null default 'simple_explanations'
                             check (accessibility_preference in (
                               'simple_explanations','more_examples',
                               'voice_friendly_text','high_contrast')),
  onboarded                boolean not null default false,
  role                     text not null default 'learner'
                             check (role in ('learner','mentor')),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- assessments — one diagnostic attempt
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.assessments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  goal            text not null,
  readiness_score int  not null default 0,             -- 0-100 overall
  questions       jsonb not null default '[]'::jsonb,  -- snapshot of questions served
  created_at      timestamptz not null default now()
);
create index if not exists idx_assessments_user on public.assessments(user_id);

-- ════════════════════════════════════════════════════════════════════
-- assessment_answers — one row per answered question
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.assessment_answers (
  id             uuid primary key default gen_random_uuid(),
  assessment_id  uuid not null references public.assessments(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  question_id    text not null,
  skill_name     text not null,
  selected_index int  not null,
  correct        boolean not null,
  created_at     timestamptz not null default now()
);
create index if not exists idx_answers_assessment on public.assessment_answers(assessment_id);
create index if not exists idx_answers_user on public.assessment_answers(user_id);

-- ════════════════════════════════════════════════════════════════════
-- skill_scores — per-skill percentage for an assessment
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.skill_scores (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  skill_name    text not null,
  score         int  not null,                          -- 0-100
  created_at    timestamptz not null default now()
);
create index if not exists idx_skill_scores_user on public.skill_scores(user_id);
create index if not exists idx_skill_scores_assessment on public.skill_scores(assessment_id);

-- ════════════════════════════════════════════════════════════════════
-- learning_paths — one generated 7-day plan
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.learning_paths (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete set null,
  goal          text not null,
  source        text not null default 'fallback'        -- 'ai' | 'fallback'
                  check (source in ('ai','fallback')),
  created_at    timestamptz not null default now()
);
create index if not exists idx_paths_user on public.learning_paths(user_id);

-- ════════════════════════════════════════════════════════════════════
-- learning_path_items — the daily lessons within a path
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.learning_path_items (
  id               uuid primary key default gen_random_uuid(),
  learning_path_id uuid not null references public.learning_paths(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  lesson_id        text not null,                        -- stable slug, unique within a path
  day              int  not null,
  title            text not null,
  target_skill     text not null,
  explanation      text not null,
  practice_task    text not null,
  success_criteria text not null,
  estimated_time   text not null,                        -- e.g. '20 min'
  content          jsonb not null default '{}'::jsonb,   -- room for extra structured fields
  created_at       timestamptz not null default now()
);
create index if not exists idx_path_items_path on public.learning_path_items(learning_path_id);
create index if not exists idx_path_items_user on public.learning_path_items(user_id);

-- ════════════════════════════════════════════════════════════════════
-- tutor_messages — chat history with the AI tutor, scoped to a lesson
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.tutor_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson_id  text,
  role       text not null check (role in ('user','assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_tutor_user on public.tutor_messages(user_id);
create index if not exists idx_tutor_lesson on public.tutor_messages(user_id, lesson_id);

-- ════════════════════════════════════════════════════════════════════
-- lesson_submissions — learner practice work + feedback
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.lesson_submissions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson_id  text not null,
  submission text not null,
  feedback   text,
  score      int,                                        -- 0-100 rubric score
  source     text default 'fallback' check (source in ('ai','fallback')),
  created_at timestamptz not null default now()
);
create index if not exists idx_submissions_user on public.lesson_submissions(user_id);

-- ════════════════════════════════════════════════════════════════════
-- lesson_completions — one row when a learner marks a lesson done
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.lesson_completions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson_id  text not null,
  created_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists idx_completions_user on public.lesson_completions(user_id);

-- ════════════════════════════════════════════════════════════════════
-- Row Level Security — every table is user-owned
-- ════════════════════════════════════════════════════════════════════
alter table public.profiles            enable row level security;
alter table public.assessments         enable row level security;
alter table public.assessment_answers  enable row level security;
alter table public.skill_scores        enable row level security;
alter table public.learning_paths      enable row level security;
alter table public.learning_path_items enable row level security;
alter table public.tutor_messages      enable row level security;
alter table public.lesson_submissions  enable row level security;
alter table public.lesson_completions  enable row level security;

-- profiles: a learner can read/write only their own row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Generic owner policy applied to all user_id-keyed tables.
-- (Repeated per table because RLS policies cannot be parameterized.)
do $$
declare t text;
begin
  foreach t in array array[
    'assessments','assessment_answers','skill_scores','learning_paths',
    'learning_path_items','tutor_messages','lesson_submissions','lesson_completions'
  ]
  loop
    execute format('drop policy if exists "%1$s_select_own" on public.%1$s;', t);
    execute format('create policy "%1$s_select_own" on public.%1$s for select using (auth.uid() = user_id);', t);

    execute format('drop policy if exists "%1$s_insert_own" on public.%1$s;', t);
    execute format('create policy "%1$s_insert_own" on public.%1$s for insert with check (auth.uid() = user_id);', t);

    execute format('drop policy if exists "%1$s_update_own" on public.%1$s;', t);
    execute format('create policy "%1$s_update_own" on public.%1$s for update using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);

    execute format('drop policy if exists "%1$s_delete_own" on public.%1$s;', t);
    execute format('create policy "%1$s_delete_own" on public.%1$s for delete using (auth.uid() = user_id);', t);
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════
-- Auto-create a profile row on signup so the app always has a profile.
-- ════════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── NOTE on the mentor dashboard ────────────────────────────────────
-- The mentor view aggregates across ALL learners. With RLS above, a
-- normal session only sees its own rows. To power the mentor view across
-- learners, the app uses the SUPABASE_SERVICE_ROLE_KEY on the server
-- (which bypasses RLS) — never exposed to the browser. If that key is
-- absent, the mentor view degrades to showing the signed-in user only.
-- A future role-based version can add policies keyed on profiles.role.
