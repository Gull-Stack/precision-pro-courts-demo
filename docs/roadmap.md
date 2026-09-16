# Precision Pro Courts — roadmap

## Now

- **Photo-by-text, first real one.** The path is built and tested against a
  throwaway clone, but no live message has gone through it yet. The next photo the
  client sends is the real proof — check the gallery and the deploy after it.
  Runbook: `~/Documents/_docs/playbooks/ppc-text-bridge.md`.
- **Orem address.** `site.json` still says Salt Lake City with SLC coordinates.
  The Google Business Profile says 253 N 1030 W St, Orem, UT 84057. The
  LocalBusiness schema contradicts the listing until this changes. Sam was asked
  8 Sept 2026 and has not answered. Street-level geocode is ready in the session
  log; the rooftop pin is on the GBP listing.

## Next

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
