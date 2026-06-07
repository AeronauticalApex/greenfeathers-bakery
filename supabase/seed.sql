-- Greenfeathers Farm Bakery — seed data (full product catalog).
-- Run AFTER schema.sql. Idempotent: clears existing rows first, so re-running
-- always lands the same state. Keep in sync with src/lib/seed.ts.
--
-- `available = true` means the product is on THIS WEEK's menu (Menu for May 29);
-- everything else lives in the catalog but is off this week.

delete from public.menu_items;
delete from public.weekly_menu;

-- This week's menu header.
insert into public.weekly_menu (week_label, order_deadline, active)
values (
  'Menu for May 29',
  'Order by 8 PM Tuesday May 26 for pickup Friday May 29',
  true
);

-- Full catalog.
insert into public.menu_items (name, price, unit_note, section, not_sourdough, sort_order, available) values
  -- Breads — $10 each
  ('Classic Boule',                10, '',           'Breads', false,  1, true),
  ('Classic Batard',               10, '',           'Breads', false,  2, true),
  ('Challah',                      10, '',           'Breads', true,   3, true),
  ('Sourdough Sandwich Loaf',      10, '',           'Breads', false,  4, false),
  -- Breads — $15 each
  ('Jalapeño-Cheddar',             15, '',           'Breads', false,  5, true),
  ('White Cheddar-Dill',           15, '',           'Breads', false,  6, false),
  ('Cinnamon-Raisin',              15, '',           'Breads', false,  7, false),
  ('Blueberry-Lemon',              15, '',           'Breads', false,  8, false),
  ('Parmesan-Herb',                15, '',           'Breads', false,  9, false),
  ('Jewish Rye',                   15, '(loaf only)','Breads', false, 10, true),
  ('Pumpernickel',                 15, '(loaf only)','Breads', false, 11, true),
  ('Multigrain',                   15, '(loaf only)','Breads', false, 12, false),
  ('Garlic-Rosemary',              15, '',           'Breads', false, 13, false),
  ('Za''atar and Kalamata Olive',  15, '',           'Breads', false, 14, false),
  ('Hot Italian',                  15, '',           'Breads', false, 15, false),
  ('Cracked Pepper-Parmesan',      15, '',           'Breads', false, 16, false),
  ('Honey Oat',                    15, '',           'Breads', false, 17, false),
  ('Dark Chocolate-Espresso',      15, '',           'Breads', false, 18, false),

  -- Sourdough Cookies — $15 a dozen
  ('Chocolate Chip with Sea Salt', 15, '(12)', 'Sourdough Cookies', false, 19, false),
  ('Lemon Crinkle',                15, '(12)', 'Sourdough Cookies', false, 20, true),
  ('Chocolate Crinkle',            15, '(12)', 'Sourdough Cookies', false, 21, false),
  ('Molasses-Ginger',              15, '(12)', 'Sourdough Cookies', false, 22, false),
  ('Orange-Cardamom Shortbread',   15, '(12)', 'Sourdough Cookies', false, 23, false),
  ('Oatmeal-Raisin',               15, '(12)', 'Sourdough Cookies', false, 24, false),
  ('Peanut Butter',                15, '(12)', 'Sourdough Cookies', false, 25, false),
  ('Apple Cider Snickerdoodles',   15, '(12)', 'Sourdough Cookies', false, 26, false),
  ('Chai',                         15, '(12)', 'Sourdough Cookies', false, 27, false),
  ('Graham Crackers (animal shapes)', 15, '(25)', 'Sourdough Cookies', false, 28, false),

  -- Sweet Rolls & Brownies
  ('Iced Saigon-Cinnamon Sweet Rolls', 18, '(4)', 'Sweet Rolls & Brownies', false, 29, true),
  ('Sourdough Super Fudgy Brownies',   18, '(6)', 'Sweet Rolls & Brownies', false, 30, false),

  -- Sweet Scones — 4 for $15, with glaze
  ('Maple-Pecan',          15, '(4)', 'Sweet Scones', false, 31, false),
  ('Lemon-Poppyseed',      15, '(4)', 'Sweet Scones', false, 32, false),
  ('Dark Chocolate Espresso', 15, '(4)', 'Sweet Scones', false, 33, true),
  ('Cherry-Almond',        15, '(4)', 'Sweet Scones', false, 34, false),
  ('Mini Chocolate Chip',  15, '(4)', 'Sweet Scones', false, 35, false),

  -- Savory Scones — 4 for $15
  ('Mediterranean',     15, '(4)', 'Savory Scones', false, 36, true),
  ('Jalapeño-Cheddar',  15, '(4)', 'Savory Scones', false, 37, false),
  ('Parmesan-Herb',     15, '(4)', 'Savory Scones', false, 38, false),

  -- Muffins
  ('Morning Glory',             15, '(4)', 'Muffins', true, 39, true),
  ('Gluten-free Morning Glory', 19, '(4)', 'Muffins', true, 40, true),

  -- Sourdough Bagels — 6 for $12
  ('Plain',           12, '(6)', 'Sourdough Bagels', false, 41, false),
  ('Everything',      12, '(6)', 'Sourdough Bagels', false, 42, false),
  ('Sesame',          12, '(6)', 'Sourdough Bagels', false, 43, false),
  ('Poppy',           12, '(6)', 'Sourdough Bagels', false, 44, false),
  ('Garlic-Parmesan', 12, '(6)', 'Sourdough Bagels', false, 45, false),
  ('Pumpernickel',    12, '(6)', 'Sourdough Bagels', false, 46, false),
  ('Cinnamon-Raisin', 12, '(6)', 'Sourdough Bagels', false, 47, false),

  -- English Muffins — 6 for $12
  ('Plain Sourdough',           12, '(6)', 'English Muffins', false, 48, true),
  ('Cinnamon-Raisin Sourdough', 12, '(6)', 'English Muffins', false, 49, true);

-- Real client product photos (optimized into /public/photos). Qualified by
-- section because some names appear in more than one section.
update public.menu_items set photo_url = '/photos/classic-boule.webp'          where section = 'Breads' and name = 'Classic Boule';
update public.menu_items set photo_url = '/photos/challah.webp'                 where section = 'Breads' and name = 'Challah';
update public.menu_items set photo_url = '/photos/jalapeno-cheddar.webp'        where section = 'Breads' and name = 'Jalapeño-Cheddar';
update public.menu_items set photo_url = '/photos/cinnamon-raisin.webp'         where section = 'Breads' and name = 'Cinnamon-Raisin';
update public.menu_items set photo_url = '/photos/pumpernickel.webp'            where section = 'Breads' and name = 'Pumpernickel';
update public.menu_items set photo_url = '/photos/dark-chocolate-espresso.webp' where section = 'Breads' and name = 'Dark Chocolate-Espresso';
update public.menu_items set photo_url = '/photos/honey-oat.webp'              where section = 'Breads' and name = 'Honey Oat';
update public.menu_items set photo_url = '/photos/sandwich-loaf.webp'          where section = 'Breads' and name = 'Sourdough Sandwich Loaf';
update public.menu_items set photo_url = '/photos/peanut-butter-cookies.webp'  where section = 'Sourdough Cookies' and name = 'Peanut Butter';
update public.menu_items set photo_url = '/photos/graham-crackers.webp'        where section = 'Sourdough Cookies' and name = 'Graham Crackers (animal shapes)';
update public.menu_items set photo_url = '/photos/cinnamon-rolls.webp'         where section = 'Sweet Rolls & Brownies' and name = 'Iced Saigon-Cinnamon Sweet Rolls';
update public.menu_items set photo_url = '/photos/cherry-almond-scone.webp'    where section = 'Sweet Scones' and name = 'Cherry-Almond';
update public.menu_items set photo_url = '/photos/morning-glory.webp'          where section = 'Muffins' and name = 'Morning Glory';
update public.menu_items set photo_url = '/photos/everything-bagels.webp'      where section = 'Sourdough Bagels' and name = 'Everything';
update public.menu_items set photo_url = '/photos/english-muffins.webp'        where section = 'English Muffins' and name = 'Plain Sourdough';
