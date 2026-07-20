@AGENTS.md

# Project conventions (sleekwealth)

This section is durable project context — read it automatically by any Claude
Code session, on any device, via git. Keep it updated as conventions change;
don't let it go stale.

## Workflow with Aneri (project owner)
- Aneri designs pages in a separate tool called "Claude Design," then hands off
  packets (screenshots + copy) for implementation here. Packets convey
  layout/structure/animation intent only, NOT final pixel alignment — when a
  new packet's page is structurally similar to an already-polished page in
  this repo, carry forward that page's alignment/CSS approach rather than
  copying the fresh packet's spacing as-is.
- She reviews changes on localhost and reports bugs by eye/screenshot, not
  structured bug reports.
- Never edit, trim, or "clean up" her actual written content (blog copy, etc.)
  without asking first — preserve it verbatim; flag concerns instead of
  silently fixing them.
- Git: commits are local by default. **Never push to `origin` without an
  explicit ask each time**, even if a commit was just requested — confirm
  scope if "commit to GitHub" is ambiguous about push.
- Never ask her to paste secrets (tokens, passwords, API keys) into chat, even
  offering not to echo them back. Give her the exact env var name and have her
  edit `.env.local` (or the Vercel dashboard) herself, then confirm.
- When migrating content/images from the old Wix site: fetch raw HTML
  directly (not a summarized WebFetch) and grep for
  `static.wixstatic.com/media/` hashes. Use the fit-mode URL
  `/v1/fit/w_9999,h_9999,q_100/<file>` to get the true max-resolution
  original — the plain `media/<hash>~mv2.png` URL serves a compressed
  default.

## Known recurring bugs — check for these proactively
- **Nowrap/flex alignment**: `whitespace-nowrap` (or `nowrap`) combined with
  flex siblings whose content length varies causes overlap or per-row
  misalignment (flex-sizing reacts to each row's differing min-content
  width). Seen repeatedly in Claude Design packet imports. When implementing
  a new packet, grep for `whitespace-nowrap`/`nowrap` near `flex-1`/`basis-`
  and check whether sibling content length varies.
- **Never add `unoptimized` to a `next/image` `<Image>`** to fix perceived
  blur/softness. It disables Next's per-device resizing and WebP/AVIF
  conversion, so phones download the same multi-MB raw file as desktop. This
  has been added and removed repeatedly across past sessions — the actual
  fix for softness is a correct `sizes` prop (matching the element's real
  rendered width) plus `quality={95}` (the max allowed in `next.config.ts`),
  not `unoptimized`. If found on any `<Image>`, treat it as a bug.

## Pixie CMS (`/pixie`)
- The admin/CMS route is deliberately `/pixie`, not `/admin` — a
  security-by-obscurity choice. Keep all CMS paths (`app/pixie/**`,
  `app/api/pixie/**`) under that name.
- Two independent publish paths:
  1. Code/design changes — built in Claude Code, tested on localhost,
     committed + pushed only when explicitly asked → Vercel auto-deploys
     `master`.
  2. Blog content (posts, drafts, publishes) — done through Pixie on the
     **live production site**, not localhost (localhost reads local files,
     not live GitHub content). Pixie commits straight to GitHub via its own
     API integration, triggering the same auto-deploy independently.
- Blog posts have one subtitle field only (manually entered, shown beneath
  the title) — no auto-derived-from-body fallback and no separate override
  field; that duplication was intentionally removed.

## Deploy
- Live at `sleekwealth.com` (and `www`), Vercel project "SW" (Hobby plan),
  connected to GitHub repo `Aneri-18/sleekwealth`, auto-deploys every push to
  `master`.
- DNS zone also hosts Zoho Mail SPF/DKIM TXT records for `@sleekwealth.com`
  email — never touch those when editing DNS.
- `.env.local` needs 4 vars: `GITHUB_TOKEN`, `ADMIN_USERNAME`,
  `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`. The bcrypt hash's `$` must be
  backslash-escaped in `.env.local` (`\$2a\$10\$...`) but pasted as a literal
  string (no escaping) into Vercel's dashboard.
- Known DNS quirk: Aneri's ISP resolver cluster has intermittently served
  stale Wix records for the bare apex domain (not `www`) even though the DNS
  zone and Vercel config are correct — not a code issue if this recurs. Fix
  is pointing DNS at 1.1.1.1/8.8.8.8, either per-device or once at the
  router's admin page for the whole network.
