# Precision Pro Courts — project notes

Eleventy (v3) static site. Live: **precisionprocourts.com** (Vercel, `gull-stack`
scope, GitHub integration on `Gull-Stack/precision-pro-courts-demo` → push to
`main` auto-deploys **production**). GA4: `G-4FH3XE2VWD`.

- Source: `src/` (Nunjucks). Build: `npm run build` → `_site/`. Serve: `npx @11ty/eleventy --serve`.
- Serverless: `api/*.js` (Vercel Node functions, SendGrid). `SENDGRID_API_KEY` set on Vercel.
  These only run on Vercel — `eleventy --serve` does NOT execute `/api`.
- Leads: `/contact/` embeds the client's **Jobber work request form** (as of
  2026-07-14; previously a stale LeadConnector iframe). `api/contact.js` is the
  SendGrid form handler (to team@precisionprocourts.com, cc bryce@gullstack.com,
  from noreply@gullstack.com). Note: `api/quote.js` (court designer) emails only —
  it does NOT persist leads anywhere.
- **NOTE: this repo is PUBLIC** (`Gull-Stack/precision-pro-courts-demo`). Keep
  client strategy, pricing, and internal notes OUT of it. Those live in
  `~/Documents/_docs/playbooks/precision-pro-courts-jobber-teardown.md` (not tracked).
- Gallery images: original `.jpg` in `src/assets/images/gallery/`, plus generated
  `thumbs/NAME.{webp,jpg}` (~600px) and `webp/NAME.webp` (full-res). No commit-tracked
  resize script — generate with Pillow (`sips` on this Mac can't write WebP).

## Session Log

### 2026-09-07 — Phone number wired site-wide (waiting on the number itself)
- Sam asked to get the phone number up on the website. The site had **no phone
  anywhere** — `site.phone` was `""` and was only read by the six county-page
  "Call Us Today" buttons and the LocalBusiness/schema blocks. Header, footer and
  `/contact/` had no phone at all.
- Built the full treatment, all gated on `{% if site.phone %}`, so it stays dark
  until a real number is set:
  - **Header** (`src/_includes/header.njk`): click-to-call item before the Free
    Quote button, inline SVG handset (no emoji, per the house rule).
  - **Footer** (`src/_includes/footer.njk`): number in the brand column, large and
    tappable, plus the team@ email underneath (footer had neither before).
  - **`/contact/`** (`src/contact.njk`): Phone is now the first sidebar item, above
    Email.
  - **CSS** (`src/css/styles.css`): `.nav-phone`, `.footer-phone`, `.footer-email`,
    plus a mobile-drawer size bump for `.nav-phone`.
- **New field `site.phoneTel`** in `src/_data/site.json`. `phone` is the display
  string (`(801) 555-0134` shape), `phoneTel` is E.164 (`+18015550134`). Every
  `tel:` href and both schema `telephone` values now read
  `site.phoneTel or site.phone`. Setting those two fields lights up all 10+ spots.
- Verified by build both ways: with the fields empty nothing renders (0 hits for
  `nav-phone`/`footer-phone` in `_site/index.html`); with a test number every
  surface rendered `tel:+1…` correctly. **The test number was removed** — do not
  ship a placeholder.
- **Number set: `(801) 699-4625`** (`+18016994625`), taken from the client's Google
  Business Profile so the NAP matches the listing. Bryce supplied it 2026-09-07.
  It renders on **30 pages** — nav, footer, `/contact/`, every county CTA, and both
  schema `telephone` values. Pushed to `main`, production deploy fired.
- **TWO PHONE NUMBERS — resolved, no change needed.** PPC estimate letterheads
  carry **801-699-3708**; the Google Business Profile and Sam's own signature carry
  **(801) 699-4625**. Asked Sam 2026-09-07. His answer: *"It's my brothers number
  so both work great."* So 3708 is his brother's line and either reaches the
  business. **The site keeps (801) 699-4625** because it matches the GBP listing,
  and site/GBP agreement is what citation consistency depends on. Do not "fix" this
  to the letterhead number without also changing GBP.
- **Address now double-confirmed:** the same estimate letterhead reads **253 North
  1030 West Street, Orem, Utah 84057**, matching the GBP listing exactly. The
  locality change from Salt Lake City to Orem is still Bryce's call — see below.
- **NAP gap still open:** GBP lists the address as **253 N 1030 W St, Orem, UT
  84057**. `site.json` still says city `Salt Lake City` with SLC `geo` coordinates
  and empty street/zip, so the LocalBusiness schema contradicts the GBP listing.
  Fixing it means a real geocode for the Orem address — do not invent coordinates.
- **Closing CTA band** on the home page now carries the phone as its first contact
  item (it had email + website only). That band sits directly above the footer and
  is the highest-intent spot on the page.
- **Nav breakpoint moved 768 → 1024 (real bug, pre-existing and made worse).** The
  desktop nav needs **1009px** to fit on one line (logo 108 + links 837 + 64 padding,
  measured in-page), but the hamburger only took over at **768px**. So the nav
  overflowed on every viewport between 769 and 1008px — small laptops, iPad
  landscape, split-screen. It already overflowed below ~849px before this session;
  the phone item widened the gap. `styles.css` had the nav-drawer rules and the
  page-layout rules sharing one `@media (max-width: 768px)` block — split into
  `@media (max-width: 1024px)` for the nav and `@media (max-width: 768px)` for the
  layout. **If anything is ever added to the nav, re-measure**; the desktop bar has
  no room left.
- **Review count corrected 56 → 89.** The home page claimed "5.0 Stars — 56 Google
  Reviews" and the schema `reviewCount` said 56. The GBP listing shows **89**. Both
  hardcoded strings in `src/index.njk` and `site.rating.count` now say 89. Source is
  the client's own GBP, screenshotted by Bryce 2026-09-07 — do not adjust this number
  without re-reading the listing.
- Also open from the same conversation: Sam offered to send proposal PDFs, and
  confirmed Wednesday for a meeting. Wednesday is **2026-09-09** and no PPC event
  exists on it. That day already holds Pivot Travel 10:00-10:45 MT and the
  Jackalope demo 15:00-16:00 MT. Time still unset.
- Pre-existing defect noted, not fixed: `/contact/` still uses emoji icons
  (envelope, globe, stopwatch, pins) against the no-emoji-in-UI rule.

### 2026-07-14 — Contact form switched to Jobber
- Client confirmed Jobber is their CRM of record. `/contact/` was still serving a
  leftover **LeadConnector iframe internally titled "Solar Lead Form"** from the
  original template. Replaced with the client's Jobber work request embed
  (`src/contact.njk`, commit `ec7637c`). Verified live — iframe injects and renders.
- Prep work for the upcoming client meeting (lead-management / CRM scope) is in
  **`~/Documents/_docs/playbooks/precision-pro-courts-jobber-teardown.md`**, deliberately kept out
  of this repo because the repo is public.
- Open: `api/quote.js` still emails leads and persists nothing — there is no system
  of record for leads outside Jobber.

### 2026-07-08 (late) — 3D Court Designer (beta) LIVE
- **LIVE at precisionprocourts.com/court-designer-3d/** (commit `b6b69dc`). Full
  three.js clone of the CourtBuild/CourTex concept, built same-day for the client
  demo. 2D designer banners to it; 3D page links back.
- **What it does:** real 3D court (slab + painted surface — line geometry ported
  from the 2D tool), orbit/zoom, camera presets (corner/baseline/side/top),
  sport switching (pickleball/tennis/basketball/multi), full color/preset system,
  3D equipment (hoops w/ backboard+rim+net, net, chain-link fencing, light poles
  with WORKING spotlights + 🌙 day/night toggle, rebound wall), watermarked PNG
  download, quote form → existing `/api/quote` with spec + 3D render attached.
- **WHITE-LABEL (the product angle):** everything brandable lives in
  `src/_data/designer3d.json` — brand name/logo/watermark, theme colors, palette,
  presets, quote endpoint/copy. To re-skin for a new client: copy the two files
  (`court-designer-3d.njk` + `designer3d.json`) into their Eleventy site, swap the
  JSON + logo, point `quote.endpoint` at their form handler. three.js r160 +
  OrbitControls are vendored at `src/js/vendor/` (self-hosted, importmap maps
  `three` → the module; html-minifier handles type=module fine).
- Verified: all 4 sports render, equipment sport-aware (net/rebounder hide for
  basketball; multi = single half-court hoop), night mode, mobile responsive,
  zero console errors, quote payload verified via fetch-stub (1.5MB PNG, under
  the API's ~6MB guard). Live URLs polled 200.
- **Next:** show client; if they bite, pitch it to other Hard Court Marketing
  prospects as a productized add-on.

### 2026-07-08 — Court Designer v2 (equipment/build-out layer) + quote flow
- **Client asks (2):** (1) copy courtbuild.com / CourTex's "build the whole setup"
  designer — lights, hoop, fence — and make it ours; (2) add new projects to the
  Gallery from an Apple Photos shared album ("PPC content").
- **Shipped — Court Designer v2** (`src/court-designer.njk`, extends the existing
  2D canvas tool rather than a 3D clone, per Bryce's call):
  - New "Add to Your Build" toggles: **Net, Hoop (1 or 2 ends), Fencing, Lights,
    Rebound Wall** — all rendered top-down on the canvas (`drawEquipment()`), so
    they're in the downloaded PNG too.
  - Add-ons are sport-aware: Net + Rebound Wall hide for basketball
    (`equipApplies()` / `updateEquipVisibility()`).
  - Live **"Your Build"** summary (sport, surfaces, add-on chips) under the canvas.
  - **Quote flow**: new `api/quote.js` (mirrors `contact.js`) emails team + auto-reply
    with the full spec AND the rendered court PNG (inline via `cid` + attachment).
    Front-end form in the CTA section posts JSON to `/api/quote`.
  - Fixed a pre-existing default mismatch: swatches/labels said "Competition Blue"
    but the court rendered green. Unified defaults to Competition Blue play /
    Competition Green surround (palette-accurate hexes) across state + DOM.
  - Verified locally (port 8099, `precision-pro` in global launch.json): all toggles
    draw, summary syncs, sport-switching hides N/A add-ons, no console errors. The
    `/api/quote` email path is NOT verifiable locally (needs Vercel) but mirrors the
    proven `contact.js`.
- **Shipped — Gallery: 12 new projects added** (`src/gallery.njk`):
  - Source photos from the "PPC content" album (were in ~/Downloads as `IMG_*.jpeg`).
  - Pipeline (`scratchpad/ppc_gallery.py`, Pillow): EXIF-orientation fix → resize →
    per photo produce root `.jpg` (≤2000px), `webp/SLUG.webp` (≤1600), and
    `thumbs/SLUG.{webp,jpg}` (600px). Renamed to SEO slugs, added 12 `gallery-item`
    tiles under a "Latest Projects (July 2026)" comment with descriptive alt text.
  - Mix: two-tone blue pickleball (commercial + backyard), concrete + acrylic
    basketball courts, BYU-logo courts, purple, green/grey + green/tan multi-sport.
  - Verified locally: all load, zero image 404s, correct orientation.
  - **+3 more added same day** (indoor garage navy court, green pergola/mountain
    court, green white-fence court). These were HEIC with NO EXIF orientation tag —
    came in upside-down; `sips` HEIC→JPG then Pillow `.rotate(180)` before resize
    (see `scratchpad/ppc_gallery2.py`). **Gallery now 70 tiles total (15 new).**
- **DEPLOYED & verified live** — commits `ce52204` (designer v2 + gallery) and
  `9ccc238` (multi-sport hoop fix: single half-court hoop, aligned to arc, no ×2)
  pushed to `main`. `/court-designer/` + gallery + `/api/quote` all live on
  precisionprocourts.com. Notion PPC page (GullStack Flight Deck → Sales Pipeline) updated.
- **State / next up:**
  - Quote-form email send runs only on Vercel (needs `SENDGRID_API_KEY`, already set);
    no real test lead was sent (would hit the client inbox). Do one real submission
    if delivery confirmation is wanted.
  - To re-run the gallery pipeline for future batches: `scratchpad/ppc_gallery.py`
    (edit the MAP dict; `sips` can't write WebP on this Mac, Pillow can).
