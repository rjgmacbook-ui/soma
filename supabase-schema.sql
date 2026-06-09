-- ─── SOMA — SUPABASE SCHEMA ──────────────────────────────────────────────────
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Journal entries
create table if not exists journal_entries (
  id          uuid primary key default gen_random_uuid(),
  content     text not null,
  mode        text not null check (mode in ('down', 'up')),
  created_at  timestamptz not null default now()
);

-- Gallery items
create table if not exists gallery_items (
  id               uuid primary key default gen_random_uuid(),
  url              text not null,
  title            text,
  type             text check (type in ('wallpaper', 'album', 'poster', 'sport', 'athlete')),
  mode_preference  text not null default 'both' check (mode_preference in ('down', 'up', 'both')),
  created_at       timestamptz not null default now()
);

-- Quotes
create table if not exists quotes (
  id         uuid primary key default gen_random_uuid(),
  text       text not null,
  author     text,
  mode       text not null default 'both' check (mode in ('down', 'up', 'both')),
  created_at timestamptz not null default now()
);

-- Audio resources
create table if not exists audio_resources (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  url         text,
  description text,
  type        text check (type in ('playlist', 'score', 'ambient', 'album')),
  mode        text not null default 'both' check (mode in ('down', 'up', 'both')),
  created_at  timestamptz not null default now()
);

-- User preferences (single row)
create table if not exists user_preferences (
  id           uuid primary key default '00000000-0000-0000-0000-000000000001',
  current_mode text not null default 'down' check (current_mode in ('down', 'up')),
  updated_at   timestamptz not null default now()
);

-- Insert default preferences row
insert into user_preferences (id, current_mode)
values ('00000000-0000-0000-0000-000000000001', 'down')
on conflict (id) do nothing;


-- ─── DISABLE RLS (personal single-user app) ──────────────────────────────────
alter table journal_entries   disable row level security;
alter table gallery_items     disable row level security;
alter table quotes            disable row level security;
alter table audio_resources   disable row level security;
alter table user_preferences  disable row level security;


-- ─── SEED DATA ────────────────────────────────────────────────────────────────

-- Down-regulating quotes
insert into quotes (text, author, mode) values
  ('You are allowed to be both a masterpiece and a work in progress.', 'Sophia Bush', 'both'),
  ('Breathing in, I calm body and mind. Breathing out, I smile.', 'Thich Nhat Hanh', 'down'),
  ('The present moment is the only moment available to us, and it is the door to all moments.', 'Thich Nhat Hanh', 'both'),
  ('You don''t have to control your thoughts. You just have to stop letting them control you.', 'Dan Millman', 'down'),
  ('Rest is not idle, it is wisely spent.', null, 'down'),
  ('Within you, there is a stillness and a sanctuary to which you can retreat at any time.', 'Hermann Hesse', 'down'),
  ('Almost everything will work again if you unplug it for a few minutes, including you.', 'Anne Lamott', 'down'),
  ('Your body is not a problem to be solved.', null, 'down');

-- Up-regulating quotes
insert into quotes (text, author, mode) values
  ('Even the darkest night will end and the sun will rise.', 'Victor Hugo', 'up'),
  ('Start where you are. Use what you have. Do what you can.', 'Arthur Ashe', 'up'),
  ('In the middle of difficulty lies opportunity.', 'Albert Einstein', 'up'),
  ('What you are is what you have been. What you''ll be is what you do now.', 'Buddha', 'up'),
  ('You are braver than you believe, stronger than you seem.', 'A.A. Milne', 'up'),
  ('The comeback is always stronger than the setback.', null, 'up'),
  ('Do something today that your future self will thank you for.', null, 'up');

-- Sample audio resources (user can add real URLs)
insert into audio_resources (title, url, description, type, mode) values
  ('Brian Eno — Ambient 1: Music for Airports', null, 'Slow, spacious ambient textures for deep calm', 'ambient', 'down'),
  ('Explosions in the Sky — The Earth Is Not a Cold Dead Place', null, 'Post-rock that holds emotion without words', 'album', 'down'),
  ('Max Richter — Sleep', null, '8-hour composition designed for the sleeping mind', 'album', 'down'),
  ('Interstellar OST — Hans Zimmer', null, 'Vast, expansive orchestral score', 'score', 'both'),
  ('Kendrick Lamar — DAMN.', null, 'Intensity and precision for up-regulation', 'album', 'up'),
  ('The Social Network OST — Trent Reznor & Atticus Ross', null, 'Forward-driving electronic score', 'score', 'up'),
  ('Your Rainy Day Playlist', null, 'Curated for winding down', 'playlist', 'down'),
  ('Morning Energy Mix', null, 'Upbeat tracks to activate your system', 'playlist', 'up');


-- ─── MIGRATION: Gallery types v2 ─────────────────────────────────────────────
-- Run this if you already created the gallery_items table with the old types.

alter table gallery_items
  drop constraint if exists gallery_items_type_check;

alter table gallery_items
  add constraint gallery_items_type_check
  check (type in ('random', 'sport', 'film', 'tv', 'music', 'people'));

alter table gallery_items
  add column if not exists context_name text;
-- context_name usage by type:
--   tv     → TV show name  (e.g. "Breaking Bad")
--   film   → Film title    (e.g. "Interstellar")
--   music  → Artist / album
--   sport  → Team / event
--   people → Person's name
--   random → leave null
