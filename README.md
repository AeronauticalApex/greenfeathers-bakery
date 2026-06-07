# Greenfeathers Farm Bakery 🐔🍞

A warm, mobile-first website for a farm microbakery in Springfield, Vermont.
Customers see the weekly menu and **text their order** — no online payments, no email.
The owner edits the week and the menu from a simple, phone-friendly `/admin` page.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase**, ready to
deploy on **Vercel**.

---

## How ordering works (for customers)

1. **See this week's menu** on the home page.
2. **Text your order** to **(802) 245-9095** before the weekly deadline.
3. **Pay by Venmo** when ordering, or **cash on delivery**.

The primary button is a tap-to-text link (`sms:`) so it opens the phone's messages app.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Set up your environment
cp .env.example .env.local
# then edit .env.local (see "Admin password" and "Supabase" below)

# 3. Run the dev server
npm run dev
```

Open **http://localhost:3000**.

> 💡 **It works out of the box.** Even with no Supabase keys set, the public site
> renders the real seeded menu (Menu for May 29). Connect Supabase when you're
> ready to edit the menu live from `/admin`.

### Other commands

| Command            | What it does                          |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Start the dev server                  |
| `npm run build`    | Production build                      |
| `npm start`        | Run the production build              |
| `npm run lint`     | ESLint                                |
| `npm run typecheck`| TypeScript type-check (no emit)       |

---

## Setting the admin password

The admin area at **`/admin`** is protected by a **6-digit numeric passcode** plus a
signed, expiring session cookie. The login endpoint is rate-limited (5 tries per 15
minutes per IP).

In `.env.local`:

```bash
# The 6-digit code you type at /admin
ADMIN_PASSWORD=482917

# A long random secret that signs the session cookie.
# Generate one with:  openssl rand -hex 32
ADMIN_SESSION_SECRET=paste-a-long-random-string-here
```

Then visit `/admin`, enter the code, and you're in. Click **Sign out** when done.

> Choose your own 6 digits — don't ship the example `123456`. The password is checked
> on the server only and is never sent to the browser.

---

## Connecting Supabase (to edit the menu)

The public site reads from Supabase when configured, and **falls back to the seeded
menu** otherwise. Saving changes from `/admin` requires Supabase.

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run **`supabase/schema.sql`**, then **`supabase/seed.sql`**
   (the seed loads the full product catalog), then **`supabase/storage.sql`**
   (creates the public `menu-photos` bucket so product photos can be uploaded).
3. In **Settings → API**, copy your keys into `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key   # server only!
   ```

4. Restart `npm run dev`. The `/admin` "Preview mode" banner disappears and your
   edits now save.

**Security note:** the `SUPABASE_SERVICE_ROLE_KEY` is used only on the server (in the
`/admin` API routes) and must never be exposed to the browser. Row Level Security is
enabled so the public anon key can only *read* the menu.

---

## Using the admin (the owner's 2-minute weekly update)

At `/admin` you can:

- **Edit the week** — update the week label (e.g. "Menu for June 5") and the order
  deadline text in one quick form.
- **Manage items** — add, edit, or remove items; set price, unit note (`(6)`, `(4)`,
  `(12)`), section, and the `*` "not made with sourdough" footnote flag.
- **Add a photo** — upload a product photo (resized in the browser, stored in the
  public `menu-photos` bucket). Items with a photo render as large featured cards on
  the website; items without keep the elegant text style.
- **Toggle availability** — tap an item to instantly put it on / take it off this week.
- Removing a product asks **"Are you sure?"** first.

## Two public menus

- **Home (`/`)** — *This Week's Menu*: just what they're baking this week, with the
  order deadline banner.
- **Full Menu (`/menu`)** — the entire catalog grouped by section; this week's items
  carry a **"Baking this week"** badge, and the page explains that anything else can be
  ordered ahead. Both pages are driven by the same catalog + weekly picker in `/admin`.

## Section / hero background photos (ready for the client's photos)

Heroes and sections accept an optional background image via the `ScrollFadeBackground`
component — it fades + eases into frame on scroll, under a gradient wash that keeps text
readable. Tasteful placeholders live in `public/placeholders/`; drop the client's real
photos in (same filenames) or pass a new `src` to swap them in.

---

## Deploying to Vercel

1. Push this repo to GitHub and import it at [vercel.com](https://vercel.com).
2. In the project's **Environment Variables**, add all five from `.env.local`
   (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, the three Supabase keys).
3. Deploy. (The login cookie is `Secure` in production, so HTTPS is required —
   Vercel provides this automatically.)

---

## Project structure

```
src/
  app/
    (site)/              # public pages share the header/footer layout
      page.tsx           #   Home — hero, this week's menu, how-to-order, CTA
      about/page.tsx     #   About — warm story (placeholder copy to fill in)
      contact/page.tsx   #   Find Us — address, phone, Instagram, Google Map
    admin/               # password-protected menu manager
      page.tsx           #   gates on auth → login or editor
      AdminLogin.tsx     #   6-digit passcode form
      AdminEditor.tsx    #   week + items editor with confirmations
    api/admin/           # login, logout, menu (week), items (CRUD)
  components/            # ChickenMark, Header, Footer, MenuDisplay, etc.
  lib/                   # types, seed data, Supabase client, auth, business facts
supabase/
  schema.sql             # tables + RLS
  seed.sql               # the real current menu
```

The bakery's contact details live in one place: `src/lib/business.ts`.
The chicken logo is a hand-drawn SVG in `src/components/ChickenMark.tsx`.

---

## Editing the "About" story

The About page ships with clearly-marked **placeholder copy** in italics. Open
`src/app/(site)/about/page.tsx` and replace the bracketed `[…]` paragraphs with the
owner's own words.
