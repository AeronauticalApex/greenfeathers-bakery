-- Greenfeathers Farm Bakery — seed / refresh the full catalog (49 items).
-- Run AFTER schema.sql. Mirrors src/lib/seed.ts exactly.
--
-- IDEMPOTENT: upserts by (section, name) — re-running never drops rows and
-- re-applies the catalog (prices, sections, photos, and the seeded weekly
-- selection). `available = true` means the item is on THIS WEEK's menu.
-- NOTE: re-running resets `available` + `photo_url` to these seed values, so
-- after the initial load manage the weekly menu and photos in /admin rather
-- than by re-running this file.

-- Ensure exactly one active week exists (won't overwrite an already-edited week).
insert into public.weekly_menu (week_label, order_deadline, active)
select 'Menu for May 29',
       'Order by 8 PM Tuesday May 26 for pickup Friday May 29',
       true
where not exists (select 1 from public.weekly_menu);

-- Full catalog. Columns: name, price, unit_note, section, not_sourdough,
-- sort_order, available, photo_url.
insert into public.menu_items
  (name, price, unit_note, section, not_sourdough, sort_order, available, photo_url)
values
  -- Breads
  ('Classic Boule',                10, '',            'Breads', false,  1, true,  '/photos/classic-boule.webp'),
  ('Classic Batard',               10, '',            'Breads', false,  2, true,  null),
  ('Challah',                      10, '',            'Breads', true,   3, true,  '/photos/challah.webp'),
  ('Sourdough Sandwich Loaf',      10, '',            'Breads', false,  4, false, '/photos/sandwich-loaf.webp'),
  ('Jalapeño-Cheddar',             15, '',            'Breads', false,  5, true,  '/photos/jalapeno-cheddar.webp'),
  ('White Cheddar-Dill',           15, '',            'Breads', false,  6, false, null),
  ('Cinnamon-Raisin',              15, '',            'Breads', false,  7, false, '/photos/cinnamon-raisin.webp'),
  ('Blueberry-Lemon',              15, '',            'Breads', false,  8, false, null),
  ('Parmesan-Herb',                15, '',            'Breads', false,  9, false, null),
  ('Jewish Rye',                   15, '(loaf only)', 'Breads', false, 10, true,  null),
  ('Pumpernickel',                 15, '(loaf only)', 'Breads', false, 11, true,  '/photos/pumpernickel.webp'),
  ('Multigrain',                   15, '(loaf only)', 'Breads', false, 12, false, null),
  ('Garlic-Rosemary',              15, '',            'Breads', false, 13, false, null),
  ('Za''atar and Kalamata Olive',  15, '',            'Breads', false, 14, false, null),
  ('Hot Italian',                  15, '',            'Breads', false, 15, false, null),
  ('Cracked Pepper-Parmesan',      15, '',            'Breads', false, 16, false, null),
  ('Honey Oat',                    15, '',            'Breads', false, 17, false, '/photos/honey-oat.webp'),
  ('Dark Chocolate-Espresso',      15, '',            'Breads', false, 18, false, '/photos/dark-chocolate-espresso.webp'),
  -- Sourdough Cookies
  ('Chocolate Chip with Sea Salt', 15, '(12)', 'Sourdough Cookies', false, 19, false, null),
  ('Lemon Crinkle',                15, '(12)', 'Sourdough Cookies', false, 20, true,  null),
  ('Chocolate Crinkle',            15, '(12)', 'Sourdough Cookies', false, 21, false, null),
  ('Molasses-Ginger',              15, '(12)', 'Sourdough Cookies', false, 22, false, null),
  ('Orange-Cardamom Shortbread',   15, '(12)', 'Sourdough Cookies', false, 23, false, null),
  ('Oatmeal-Raisin',               15, '(12)', 'Sourdough Cookies', false, 24, false, null),
  ('Peanut Butter',                15, '(12)', 'Sourdough Cookies', false, 25, false, '/photos/peanut-butter-cookies.webp'),
  ('Apple Cider Snickerdoodles',   15, '(12)', 'Sourdough Cookies', false, 26, false, null),
  ('Chai',                         15, '(12)', 'Sourdough Cookies', false, 27, false, null),
  ('Graham Crackers (animal shapes)', 15, '(25)', 'Sourdough Cookies', false, 28, false, '/photos/graham-crackers.webp'),
  -- Sweet Rolls & Brownies
  ('Iced Saigon-Cinnamon Sweet Rolls', 18, '(4)', 'Sweet Rolls & Brownies', false, 29, true,  '/photos/cinnamon-rolls.webp'),
  ('Sourdough Super Fudgy Brownies',   18, '(6)', 'Sweet Rolls & Brownies', false, 30, false, null),
  -- Sweet Scones
  ('Maple-Pecan',          15, '(4)', 'Sweet Scones', false, 31, false, null),
  ('Lemon-Poppyseed',      15, '(4)', 'Sweet Scones', false, 32, false, null),
  ('Dark Chocolate Espresso', 15, '(4)', 'Sweet Scones', false, 33, true,  null),
  ('Cherry-Almond',        15, '(4)', 'Sweet Scones', false, 34, false, '/photos/cherry-almond-scone.webp'),
  ('Mini Chocolate Chip',  15, '(4)', 'Sweet Scones', false, 35, false, null),
  -- Savory Scones
  ('Mediterranean',     15, '(4)', 'Savory Scones', false, 36, true,  null),
  ('Jalapeño-Cheddar',  15, '(4)', 'Savory Scones', false, 37, false, null),
  ('Parmesan-Herb',     15, '(4)', 'Savory Scones', false, 38, false, null),
  -- Muffins
  ('Morning Glory',             15, '(4)', 'Muffins', true, 39, true, '/photos/morning-glory.webp'),
  ('Gluten-free Morning Glory', 19, '(4)', 'Muffins', true, 40, true, null),
  -- Sourdough Bagels
  ('Plain',           12, '(6)', 'Sourdough Bagels', false, 41, false, null),
  ('Everything',      12, '(6)', 'Sourdough Bagels', false, 42, false, '/photos/everything-bagels.webp'),
  ('Sesame',          12, '(6)', 'Sourdough Bagels', false, 43, false, null),
  ('Poppy',           12, '(6)', 'Sourdough Bagels', false, 44, false, null),
  ('Garlic-Parmesan', 12, '(6)', 'Sourdough Bagels', false, 45, false, null),
  ('Pumpernickel',    12, '(6)', 'Sourdough Bagels', false, 46, false, null),
  ('Cinnamon-Raisin', 12, '(6)', 'Sourdough Bagels', false, 47, false, null),
  -- English Muffins
  ('Plain Sourdough',           12, '(6)', 'English Muffins', false, 48, true, '/photos/english-muffins.webp'),
  ('Cinnamon-Raisin Sourdough', 12, '(6)', 'English Muffins', false, 49, true, null)
on conflict (section, name) do update set
  price         = excluded.price,
  unit_note     = excluded.unit_note,
  not_sourdough = excluded.not_sourdough,
  sort_order    = excluded.sort_order,
  available     = excluded.available,
  photo_url     = excluded.photo_url;
