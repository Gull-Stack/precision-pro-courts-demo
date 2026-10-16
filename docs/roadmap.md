# Precision Pro Courts — roadmap

## Now

- **Photo-by-text — blocked on a restart.** The path is built and tested against a
  throwaway clone, and the scheduler is running, but it cannot read its source yet:
  macOS Full Disk Access is granted and does not take effect until Bryce reboots.
  After the reboot, confirm it before promising the client anything, then let the
  next photo he sends be the real proof. Runbook:
  `~/Documents/_docs/playbooks/ppc-text-bridge.md`.
- **The client has not been answered.** He asked two things on 16 Sept: the main
  photo (fixed and live) and a Vercel seat (no — see `notes.md`). Neither reply
  has been sent. The second reply depends on the item above being confirmed.
- **Cost page — waiting on Sam.** Asked 15 Oct 2026 for rough price ranges: backyard
  pickleball, half-court basketball, resurfacing. Build a cost page plus FAQ schema
  when they arrive. AI search tools get asked this constantly and no local builder answers it.
- **About page reviews.** "Mike T.", "Jennifer R." and "David L." look like
  placeholders and do not match the real Google reviews. Bryce to confirm; swap in
  real Google reviews if they are not real.

## Next

- **Before/after slider.** Needs before and after photos of the same court. None exist yet.

- **Vinyl and wood flooring pages.** Sam plans to add them (13 Oct 2026). They go under the
  Court Surfacing flyout in `header.njk`.
- **More blog posts.** Kendall sends them by email. Each is one markdown file plus photos.

- **Copy edits by text.** The bridge deliberately ignores text with no photo,
  because a wrong word on a live page is worse than a slow one. If Sam starts
  sending them often, the shape to build is a queue Bryce approves, not direct
  publishing.
- **Leads have no system of record.** `api/quote.js` emails the court designer
  quote and stores nothing. Jobber holds contact-form leads; designer leads exist
  only in an inbox.
- **3D court designer.** Live at `/court-designer-3d/`. White-labels from two
  files. Nothing has been pitched to another contractor yet.

## Watch

- GA4 property `G-GKP6N4CMDM` had never received a hit before 14 Sept 2026.
  Confirm it is still collecting after a week of real traffic.
- The desktop nav has no room left. Anything added to it needs a re-measure; it
  currently needs 1009px and collapses at 1024px.
