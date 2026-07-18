-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New Query → paste → Run)

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  rating integer not null check (rating between 1 and 5),
  comment text,
  meeting_title text,
  user_name text,        -- null = anonymous submission
  user_avatar_url text,  -- null = anonymous submission
  created_at timestamptz not null default now()
);

-- Row Level Security is left OFF here since all access goes through our
-- Next.js API routes using the service role key (which bypasses RLS by
-- design). If you ever query Supabase directly from the browser with the
-- anon key instead, enable RLS and add explicit insert/select policies
-- before doing so.
