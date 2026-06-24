-- Greenfeathers Farm Bakery — site-wide settings (single row, id = 1).
-- For the record: mirrors the site_settings table that already exists in the
-- database. Safe to re-run. Public read; writes go through the service-role key.

create table if not exists public.site_settings (
  id                      integer primary key default 1,
  closed_from             date,
  closed_to               date,
  force_closed            boolean not null default false,
  closed_message          text not null default 'We''re taking a short break. Check back soon!',
  open_message            text not null default 'Now taking orders for this week. Text us to order!',
  flash_sale_enabled      boolean not null default false,
  flash_sale_title        text not null default '',
  flash_sale_body         text not null default '',
  pickup_delivery_enabled boolean not null default true,
  pickup_delivery_title   text not null default '',
  pickup_delivery_body    text not null default '',
  updated_at              timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

-- Ensure the single row exists.
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- Row Level Security: public can read; writes use the service-role key, which
-- bypasses RLS, so no write policy is added.
alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select using (true);
