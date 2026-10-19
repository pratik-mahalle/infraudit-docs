# InfraAudit Docs Platform: Design

Date: 2026-10-19 · Status: draft for review

## Why

InfraAudit's docs (this repo, 128 pages) are built with Mintlify. Mintlify won't let Pratik change the background or the overall look, so the docs look like every other Mintlify site, and Pratik finds them boring. Pratik wants an own docs platform: well designed, fully restylable, and later AI-powered ("like Mintlify, but AI-powered docs").

v1 replaces Mintlify for InfraAudit's own docs (the product guide, the CLI reference and the API reference). The AI part is deliberately parked; Pratik will decide it later.

## What success looks like

- Pratik opens the site and it looks like the **Editorial** mockup (see below) with the real InfraAudit content, not filler.
- Every existing page renders, at the same path as on the live Mintlify site.
- Pratik changes the background, accent color or fonts in one theme file and sees the change without editing page or component code.
- Pushing to `main` deploys to `https://docs.infraudit.com`.

## Goals (v1)

1. Render all existing pages from this repo with the Editorial look.
2. Keep the existing navigation: three top tabs (Docs, CLI Reference, API Reference) with their sidebar groups, the Changelog and Support links, the GitHub link and the "Get Started Free" button to `https://infraaudit.dev`. Where each one goes in the Editorial header is under "Page layout".
3. Make the theme changeable from one file: background, accent color, fonts, light/dark.
4. Full-text search.
5. A working deploy on push to `main` (the hosting target is under "Build and deploy").

## Non-goals (v1)

- AI features of any kind (chat, "ask the docs", AI search, AI writing). These are phase 2, to be designed with Pratik.
- Hosting docs for other companies or other products: no sign-up, accounts, billing or multi-site support.
- A visual theme editor in the browser. The theme is edited as a file.
- Extra theme presets (the Aurora, Blueprint, Chapter and Floating directions from the mockups). Only Editorial ships.
- Rewriting or restructuring the content.
- A web-based content editor. Pages stay markdown files in git.

## Anti-goals (a failure even if it technically works)

- **It looks generic.** If it ends up looking like a stock Starlight, Docusaurus or Mintlify site with new colors, it has failed the main reason it exists.
- **A fake AI box.** Don't ship an "Ask AI" input that does nothing or just runs plain search under an AI label.
- **Broken links.** Page paths and internal links must not break.
- **Theme changes that need code edits.** If changing the background means touching CSS or components, the customization goal has failed.
- **A background that hurts reading.** No theme setting may drop body text below WCAG AA contrast.

## Current state (facts from this repo)

- Content: 123 pages with frontmatter (`title`, `description`, `icon`) plus `README.md` / `SUMMARY.md` (GitBook leftovers). Mostly `.md`, with a few `.mdx`. **No Mintlify-specific components are used**: pages are plain markdown (headings, lists, tables, fenced code, a few blockquote notes such as `> **Warning:** …`).
- Navigation lives in `docs.json` (Mintlify schema): `navigation.tabs[]` → `groups[]` → `pages[]` (page paths without extension, no nested groups). Docs has 7 groups, CLI Reference 2 and API Reference 4. `docs.json` also holds `logo` (`/logo/light.svg`, `/logo/dark.svg`), `favicon`, `anchors`, `topbarLinks`, `topbarCtaButton`, `footer`, `metadata` (OG tags) and `seo`.
- Internal links are mostly root-absolute (`[Dashboard](/platform/dashboard)`). There are also 22 relative `.md` links, and two of them point to missing files (`api/README.md`, `api/webhooks/README.md`). One page uses the `sidebarTitle` frontmatter. Three subfolder `README.md` files are GitBook leftovers.
- **Live site today: `https://infraudit.mintlify.app`**, on Mintlify's hosting, at root paths (`/introduction`, `/platform/drift-detection`). Its pages declare `https://docs.infraudit.com/...` as their canonical URL, but that domain doesn't resolve yet.
- **There's no working deploy pipeline.** `.github/workflows/deploy.yml` (GitHub Pages via `mintlify export`) failed on all 3 runs (2026-04-11), and `pratik-mahalle.github.io/infraudit-docs/` returns 404. It also pins Node 20, which is past end of life.
- Brand colors today: indigo `#6366f1` / `#a5b4fc` / `#4338ca`. Mintlify defaults to dark mode with a toggle. `docs.json` also turns on page feedback (thumbs, suggest edit, raise issue).

## The look: Editorial (Pratik's pick)

The reference is `2026-10-19-docs-look-mockups.html` in this folder. Open it in a browser: the **third** mock ("3 · Editorial") is the chosen one, and the first two are rejected directions. It reads like a well-made technical book.

**Surface and color (light)**
- Background: warm paper `#f3ede1` with a fine paper grain (SVG fractal noise at about 9% opacity).
- Ink text `#221d17`. Secondary `#4b4237` / `#5b5145`. Muted labels `#6e6250` (5.1:1). Page numbers `#76694f` (4.6:1). *(Claude's call: these are darkened from the mock's `#8a7c66` / `#a89a83`, which fail AA. AA applies to all text, not just body text.)*
- Hairline rules `#ddd2bf`. Header bottom: a 3px double rule `#cfc3ad`.
- Accent: ink-blue `#2b3a8c` (active nav, links, numerals, drop cap, primary button). Second accent: oxblood `#9b3d26`, used only for the small-caps breadcrumb.
- Code blocks: dark ink `#221d17` with 4px corners and light text `#e9e3d8`. Syntax colors are as in the mock.

**Type**
- Newsreader (serif) for the wordmark, headings, lede, sidebar links, table of contents and margin notes. Inter for UI chrome (buttons, small-caps labels, code-tab labels). JetBrains Mono for code.
- H1 is about 40px Newsreader, regular weight. Labels and group names are small caps with letter-spacing.

**Page layout (desktop)**
- **Header** *(Claude's call where it differs from the mock)*:
  - On the left, a serif **text** wordmark: `docs.json` `name` + " Docs". The current logo SVGs (a bold indigo Inter wordmark) clash with the look, so they're used only for the favicon and OG image. `docs.json` `logo` is ignored in the header.
  - Three small-caps tabs, `docs · cli · api`, with the active one underlined in the accent color.
  - "changelog" sits next to the tabs as a plain small-caps link, not a tab. It opens `/resources/changelog` inside the Docs tab.
  - Search is an underlined field with an italic placeholder and a `⌘K` hint.
  - On the right are small "GitHub" and "Support" text links, then the CTA button, using `docs.json` `topbarCtaButton` (text "Get Started Free").
- **Left sidebar**: the groups of the active tab, with small-caps group names. Page links are serif with a right-aligned page number (`01`, `02`, …), numbered in order through the whole tab. The active page is italic and in the accent color.
- **Main column**: a small-caps oxblood breadcrumb (`platform guide · chapter 04`), then the H1 title. The page's frontmatter `description` is shown as the lede in larger serif, with a drop cap in the accent color. The body follows.
- **Right margin column**: "in this chapter" (the table of contents for the page's headings), with margin notes below it.
- Ordered lists use italic serif numerals in the accent color. Blockquote notes and warnings are styled to fit the look; they must not look like default callout boxes.

**Dark mode** *(Claude's call)*: keep a light/dark toggle, defaulting to light. Dark is "ink paper": a warm near-black surface with light warm text and a lighter ink-blue accent. Same grain, same structure. Exact values are left to the builder, and must meet AA contrast.

**Small screens**: the sidebar becomes a drawer, and the margin column folds inline (the table of contents collapses at the top, and margin notes sit after the paragraph they belong to). No horizontal scroll.

## Changing the theme

Pratik changes the theme in **one file** (*Claude's call: a `theme.json` at the repo root, separate from `docs.json`*). It controls at least:

- `background`: one of a plain color, the paper texture (on/off, plus base color), a gradient (CSS gradient string) or an image (path to a file in the repo).
- `accent`: the main accent color. The second accent is optional.
- `fonts`: heading, body, UI and code font names (Google Fonts by name).
- `mode`: `light`, `dark` or `toggle` (default).

*Claude's calls on the details:*

- **Light and dark values.** `background` and `accent` take either one value or `{ "light": …, "dark": … }`. With one value, the dark version is derived automatically. The file still holds only what Pratik wants to change, and Editorial's values are the defaults.
- **Where text sits.**
  - With a plain color background, text sits directly on that color.
  - With an image or gradient, the reading column sits on a paper or translucent surface, so text stays legible over any picture.
- **Contrast check.** The theme is checked against AA for every text/background pair, in both the preview and the build. Below AA, the build stops with a clear message naming the color, the ratio and the nearest shade that passes. For example, today's brand `#6366f1` is 3.8:1 on paper, and `#4f46e5` would pass at 5.4:1. Pratik sees this in the local preview before anything is pushed.
- `docs.json` `colors` is ignored once `theme.json` exists.

Editing `theme.json` updates the local preview live, and goes to production on push.

## Content and navigation

- Pages stay where they are, at the same paths. Authors keep writing markdown in the same folders.
- `docs.json` stays the source of truth for navigation, logo, favicon, anchors, top-bar links, CTA, footer and metadata (*Claude's call: so nothing gets rewritten, and Pratik edits the same file as today*).
- **Paths don't change.** A page at `platform/drift-detection.md` is served at `/platform/drift-detection`, the same path the live Mintlify site uses. Root-absolute and relative `.md` links in content both have to resolve. The two links to missing files get fixed or removed.
- `sidebarTitle` frontmatter, when present, is used as the sidebar label.
- **Page feedback** *(Claude's call)*: each page ends with static "Edit this page on GitHub" and "Report an issue" links. Thumbs up/down is dropped in v1, because a static site has nowhere to store votes.
- Page `icon` frontmatter is not shown in v1, since Editorial uses page numbers instead.
- Margin notes: authors need a markdown way to write one (directive or component, the builder's choice). Existing content has none yet, so this just has to work for new writing.
- `README.md`, `SUMMARY.md`, `.gitbook.yaml` and `docs/` (this spec) are not published as pages.

## Search

Built-in, static full-text search (no server). The placeholder says "Search the docs". Don't say "ask" until AI exists (see anti-goals).

## AI (parked)

There is nothing in v1. The margin column is where it's expected to live later (the mock shows "✎ Ask a question about this chapter…"). Phase 2 will be designed with Pratik. Nothing in v1 should make adding a server-side piece later harder than necessary, but don't build for it now.

## Build and deploy

- *Claude's call:* **Astro + Starlight**, heavily customized. The reasons: it builds a static site (so GitHub Pages keeps working), it has built-in static search (Pagefind), a light/dark toggle, an MDX/markdown pipeline and code blocks with copy buttons, and every part of the page (header, sidebar, title, table of contents) can be replaced with our own component. The Editorial look is built through those overrides and our own CSS, not by recoloring Starlight's defaults.
- The site code lives in this repo (*Claude's call: one product today; extract it into its own package if a second product ever comes*).
- **Deploy:** the workflow is rebuilt: Node LTS, the new build, and a push to `main` triggers the deploy.
- **Address (Pratik's decision):**
  - The site is served at **`https://docs.infraudit.com`**, at the root path (no base path), from GitHub Pages with a custom domain.
  - The repo gets a `CNAME` file. Pratik adds the DNS record for `docs.infraudit.com` (the builder writes down exactly which record).
  - Canonical URLs stay `https://docs.infraudit.com/...`, matching what the live pages already declare.
- **The old Mintlify site (Pratik's decision):** `infraudit.mintlify.app` keeps running alongside the new site for a while, and Pratik will switch it off later. Nothing in v1 depends on it or changes it.

## Calls Claude made (not discussed with Pratik)

- Astro + Starlight as the base.
- Site code in this repo, not a separate one.
- `theme.json` as a separate file. `docs.json` stays the navigation file.
- Dark mode kept, defaulting to light (Mintlify currently defaults to dark).
- Page description shown as the lede with the drop cap.
- Newsreader/Inter/JetBrains Mono as the default fonts.
- Page icons are dropped in favor of page numbers.
- Search wording "Search the docs" until AI exists.
- AA contrast covers all text. The mock's muted greys are darkened to pass. A theme below AA stops the build, with a suggested shade.
- `theme.json` takes single or light/dark values, and dark is derived when only one is given.
- Header: text wordmark (logo SVGs only for the favicon and OG image), three tabs, Changelog as a plain link, GitHub and Support as small text links, and the CTA text taken from `docs.json`.
- Page feedback: edit and issue links kept, thumbs dropped.

## Left to the builder

- How content is loaded from the existing folders without moving files.
- How `docs.json` is read into the sidebar and header.
- The margin-note syntax.
- Dark-mode color values (AA contrast).
- Font loading (self-hosted or Google).
- Responsive breakpoints.
- How relative `.md` links are resolved.
- How a local preview is started (`npm run dev` or similar).
