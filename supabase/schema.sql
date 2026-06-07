-- Greenfeathers Farm Bakery — database schema
-- Run this in the Supabase SQL Editor (or via the CLI) once per project.
-- Safe to re-run: it drops and recreates the tables.

drop table if exists public.menu_items cascade;
drop table if exists public.weekly_menu cascade;

-- The weekly menu header (one active row at a time).
create table public.weekly_menu (
  id            uuid primary key default gen_random_uuid(),
  week_label    text not null,                 -- e.g. "Menu for May 29"
  order_deadline text not null,                -- e.g. "Order by 8 PM Tuesday May 26 for pickup Friday May 29"
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Individual items on the menu.
create table public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  price         numeric(8,2) not null default 0,
  unit_note     text not null default '',       -- e.g. "(6)", "(4)", "(12)"
  section       text not null
                  check (section in (
                    'Breads',
                    'Sourdough Cookies',
                    'Sweet Rolls & Brownies',
                    'Sweet Scones',
                    'Savory Scones',
                    'Muffins',
                    'Sourdough Bagels',
                    'English Muffins'
                  )),
  not_sourdough boolean not null default false, -- renders the "*" footnote
  sort_order    integer not null default 0,
  available     boolean not null default true,
  photo_url     text,                           -- optional product photo (public bucket URL)
  created_at    timestamptz not null default now()
);

create index menu_items_section_sort_idx on public.menu_items (section, sort_order);
create index weekly_menu_active_idx on public.weekly_menu (active, created_at desc);

-- Row Level Security: the public site reads with the anon key; all writes go
-- through the service-role key (used only by the server in /admin), which
-- bypasses RLS. So we grant public SELECT and add no write policies.
alter table public.weekly_menu enable row level security;
alter table public.menu_items enable row level security;

create policy "Public can read the weekly menu"
  on public.weekly_menu for select
  using (true);

create policy "Public can read menu items"
  on public.menu_items for select
  using (true);
