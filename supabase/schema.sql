-- Greenfeathers Farm Bakery — database schema (idempotent migration).
--
-- Matches the app exactly: the app queries two tables, `weekly_menu` (the week
-- header) and `menu_items` (the full catalog; the weekly selection is the
-- `available` flag — there is no separate products/selection table).
--
-- SAFE TO RE-RUN on a fresh OR existing database: it creates what's missing and
-- migrates an older table up to the current shape WITHOUT dropping data.
-- Run this first, then seed.sql, then storage.sql.

-- ---- weekly_menu --------------------------------------------------------
create table if not exists public.weekly_menu (
  id             uuid primary key default gen_random_uuid(),
  week_label     text not null,
  order_deadline text not null,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---- menu_items ---------------------------------------------------------
create table if not exists public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  price         numeric(8,2) not null default 0,
  unit_note     text not null default '',
  section       text not null,
  not_sourdough boolean not null default false,
  sort_order    integer not null default 0,
  available     boolean not null default true,
  photo_url     text,
  created_at    timestamptz not null default now()
);

-- Bring an older menu_items up to the current shape (each is a no-op if the
-- column already exists). This is what fixes a pre-restructure database.
alter table public.menu_items add column if not exists unit_note     text not null default '';
alter table public.menu_items add column if not exists not_sourdough boolean not null default false;
alter table public.menu_items add column if not exists sort_order    integer not null default 0;
alter table public.menu_items add column if not exists available     boolean not null default true;
alter table public.menu_items add column if not exists photo_url     text;

-- Section allow-list: drop any prior (old 2-section or current) check, then set
-- the current 8 sections. (Empty table => no rows can violate this.)
alter table public.menu_items drop constraint if exists menu_items_section_check;
alter table public.menu_items drop constraint if exists menu_items_section_chk;
alter table public.menu_items add constraint menu_items_section_chk
  check (section in (
    'Breads',
    'Sourdough Cookies',
    'Sweet Rolls & Brownies',
    'Sweet Scones',
    'Savory Scones',
    'Muffins',
    'Sourdough Bagels',
    'English Muffins'
  ));

-- Natural key so seed.sql can upsert (section + name is unique in the catalog).
create unique index if not exists menu_items_section_name_key
  on public.menu_items (section, name);

create index if not exists menu_items_section_sort_idx on public.menu_items (section, sort_order);
create index if not exists weekly_menu_active_idx on public.weekly_menu (active, created_at desc);

-- Row Level Security: public site reads with the anon key; all writes go through
-- the service-role key (used only by the server in /admin), which bypasses RLS.
alter table public.weekly_menu enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "Public can read the weekly menu" on public.weekly_menu;
create policy "Public can read the weekly menu"
  on public.weekly_menu for select using (true);

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
  on public.menu_items for select using (true);
