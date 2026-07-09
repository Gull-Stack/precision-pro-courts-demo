# Precision Pro Courts — project notes

Eleventy (v3) static site. Live: **precisionprocourts.com** (Vercel, `gull-stack`
scope, GitHub integration on `Gull-Stack/precision-pro-courts-demo` → push to
`main` auto-deploys **production**). GA4: `G-4FH3XE2VWD`.

- Source: `src/` (Nunjucks). Build: `npm run build` → `_site/`. Serve: `npx @11ty/eleventy --serve`.
- Serverless: `api/*.js` (Vercel Node functions, SendGrid). `SENDGRID_API_KEY` set on Vercel.
  These only run on Vercel — `eleventy --serve` does NOT execute `/api`.
- Leads: `/contact/` uses a LeadConnector CRM iframe; `api/contact.js` is the
  SendGrid form handler (to team@precisionprocourts.com, cc bryce@gullstack.com,
  from noreply@gullstack.com).
- Gallery images: original `.jpg` in `src/assets/images/gallery/`, plus generated
  `thumbs/NAME.{webp,jpg}` (~600px) and `webp/NAME.webp` (full-res). No commit-tracked
  resize script — generate with Pillow (`sips` on this Mac can't write WebP).

## Session Log

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
  precisionprocourts.com. Notion PPC page (GullStack HQ → Sales Pipeline) updated.
- **State / next up:**
  - Quote-form email send runs only on Vercel (needs `SENDGRID_API_KEY`, already set);
    no real test lead was sent (would hit the client inbox). Do one real submission
    if delivery confirmation is wanted.
  - To re-run the gallery pipeline for future batches: `scratchpad/ppc_gallery.py`
    (edit the MAP dict; `sips` can't write WebP on this Mac, Pillow can).
