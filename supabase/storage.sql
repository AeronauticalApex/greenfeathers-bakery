-- Greenfeathers Farm Bakery: product photo storage.
-- Run once in the Supabase SQL Editor (after schema.sql). Safe to re-run.
--
-- Creates a PUBLIC bucket "menu-photos" that anyone can read (so photos show on
-- the website) but only the server (service-role key, used by /admin) can write.

insert into storage.buckets (id, name, public)
values ('menu-photos', 'menu-photos', true)
on conflict (id) do update set public = true;

-- Public read access to objects in this bucket.
drop policy if exists "Public read menu photos" on storage.objects;
create policy "Public read menu photos"
  on storage.objects for select
  using (bucket_id = 'menu-photos');

-- Writes (insert/update/delete) go through the service-role key, which bypasses
-- RLS, so no write policies are needed for the anon/public roles.
