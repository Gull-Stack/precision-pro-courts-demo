# Precision Pro Courts — durable notes

Client contact: **Sam Roberts**, owner. He texts. He does not email.

> This repo is PUBLIC. Keep client strategy, pricing, phone automation and other
> internal notes out of it — those live in `~/Documents/_docs/playbooks/`.

## Site facts

- Live at **precisionprocourts.com** (Vercel, `gull-stack` scope). Push to `main`
  deploys production, ~30 seconds from push to live.
- Phone on the site is **(801) 699-4625**, taken from the Google Business Profile.
  A second number on estimate letterheads reaches the same business. The site
  keeps the GBP number so the citation stays consistent.
- Analytics: two GA4 properties receive every page view. `G-4FH3XE2VWD` is the
  original. `G-GKP6N4CMDM` is the client-side property, added 14 Sept 2026.

## Decisions

- **16 Sept 2026 — hero photo replaced.** `backyard-court.jpg` had a leaf blower,
  a bin bag and a paint tray along the bottom edge. The hero is now
  `grey-blue-court.jpg`. The same photo was pulled from the gallery for the same
  reason, so gallery tiles went 70 -> 69.
- **16 Sept 2026 — no Vercel seat for the client.** He asked for one so he could
  add photos himself. Vercel cannot do that: this is a static Eleventy build, so
  adding a photo is a commit, and the Vercel dashboard only offers deploys,
  domains and env vars. A seat would let him roll back production and still not
  let him add a photo.

  Photos now reach the site another way, run by Bryce off-repo. Commits from it
  carry `Auto-published by ppc-text-bridge` in the body — **do not reword that
  string**, an undo path matches on it. Details in
  `~/Documents/_docs/playbooks/ppc-text-bridge.md`.
