# InfraAudit Editorial Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Mintlify with a self-built Astro + Starlight docs site for InfraAudit, styled to the approved "Editorial" look, themeable from one `theme.json`, deployed to `https://docs.infraudit.com` from this repo.

**Architecture:** Starlight loads the existing markdown pages in place (an Astro `glob` loader with `base: '.'`, using patterns derived from `docs.json`). Small pure modules in `src/lib/` turn `docs.json` into navigation data and `theme.json` into CSS custom properties, failing the build on bad or low-contrast values. The Editorial look comes from Starlight component overrides (`Head`, `Header`, `Sidebar`, `PageTitle`, `TableOfContents`, `Footer`, `ThemeProvider`, `ThemeSelect`) plus one stylesheet.

**Tech Stack:** Astro 7.4.0, @astrojs/starlight 0.42.6, @astrojs/markdown-satteri 0.4.4 (Astro 7's default Markdown processor, which needs an explicit dependency because we pass it a plugin), Pagefind (bundled with Starlight), Node ≥ 22.22 locally and Node 24 in CI. Tests use Node's built-in runner (`node --test`, which strips TypeScript types natively). No other dependencies.

**Spec:** `docs/superpowers/specs/2026-10-19-docs-platform-design.md`. The visual reference is `docs/superpowers/specs/2026-10-19-docs-look-mockups.html`: open it in a browser, and the **third** mock is the target.

**Verified in a throwaway spike (2026-10-19), so trust these:**
- `glob({ base: './content', pattern: [...] })` with `docsSchema()` works. `entry.filePath` is repo-relative, so `editLink.baseUrl` produces correct edit URLs.
- A Sätteri mdast plugin `{ name, containerDirective(node) { … return { type: 'paragraph', data: { hName: 'aside', hProperties: { className: ['margin-note'] } }, children: node.children } } }` registered via `markdown: { processor: satteri({ mdastPlugins: [plugin] }) }` renders `:::margin` blocks as `<aside class="margin-note">`. Starlight's directive restoration leaves nodes with `data` alone.
- `schema: (ctx) => docsSchema({ extend })(ctx).transform(d => d.sidebarTitle ? { ...d, sidebar: { ...d.sidebar, label: d.sidebarTitle } } : d)` makes the sidebar use `sidebarTitle`.
- `Astro.locals.starlightRoute` exposes `id`, `entry` (with `data`, `body`, `filePath`), `sidebar` (nested `{type:'group',label,entries}` / `{type:'link',label,href,isCurrent}`), `toc`, `pagination` and `editUrl`.
- `redirects: { '/': '/introduction' }` emits a static redirect page.
- Relative `.md` links are **not** rewritten. They render as broken `href="core-concepts.md"`.
- `node --test 'src/**/*.test.ts'` works when `package.json` has `"type": "module"` and imports use `.ts` extensions (Astro's base tsconfig sets `allowImportingTsExtensions`).
- The UI string keys `search.label`, `tableOfContents.onThisPage` and `page.editLink` exist in Starlight's translations.

## Global Constraints

- Work on branch `editorial-docs`. **Never push to `main` without asking Pratik**: a push to `main` deploys the site, and the Mintlify site redeploys from it too.
- Commit messages have no `Co-Authored-By` trailers.
- The Mintlify site (`infraudit.mintlify.app`) must keep building from this repo:
  - Don't rename, move or delete any content page, `docs.json`, `favicon.svg` or `logo/`.
  - Don't add keys to `docs.json`.
  - Don't add MDX components to content.
- Page paths are unchanged: `platform/drift-detection.md` is served at `/platform/drift-detection/`. `site: 'https://docs.infraudit.com'`, with no `base`.
- Published pages are exactly the 123 pages listed in `docs.json` `navigation`. Never publish `README.md`, `SUMMARY.md`, `docs/`, `.claude/` or `node_modules/`.
- Contrast: every text color must be ≥ 4.5:1 against its reading surface, in both modes. This covers all text, not only body text.
- Editorial light palette, exact:
  - surface `#f3ede1`
  - text `#221d17`
  - text2 `#4b4237`
  - muted `#6e6250`
  - faint `#76694f`
  - rule `#ddd2bf`
  - header double rule `#cfc3ad`
  - accent `#2b3a8c`
  - accent2 `#9b3d26`
  - code background `#221d17`, code text `#e9e3d8`
- Editorial dark palette (Claude's call, all ≥ 5.3:1), exact:
  - surface `#1b1813`
  - text `#ece4d4`
  - text2 `#cfc4b0`
  - muted `#a89a83`
  - faint `#9a8c75`
  - rule `#3a342b`
  - accent `#9fb0ff`
  - accent2 `#e08a6f`
- Default fonts:
  - heading and body: `Newsreader`, falling back to `Georgia, serif`
  - ui: `Inter`, falling back to `system-ui, sans-serif`
  - code: `JetBrains Mono`, falling back to `ui-monospace, monospace`
- Default `mode: 'toggle'`, starting in **light** when the visitor has no stored choice. There is no "auto/system" option.
- Copy:
  - search placeholder: "Search the docs"
  - table of contents heading: "In this chapter" (rendered in small caps)
  - edit link: "Edit this page on GitHub"
  - issue link: "Report an issue"
  - wordmark: `${docs.name} Docs`
  - CTA text and URL: from `docs.json` `topbarCtaButton` ("Get Started Free" → `https://infraaudit.dev`)
- No AI UI of any kind. No "ask" wording.

## Review Focus

1. **A typo in `theme.json`** (`accent: "blue"`, `background.type: "photo"`, an image path that doesn't exist, or `mode: "auto"`) must stop the build with a message naming the key and the bad value. It must never fall back silently. *(Task 3 tests.)*
2. **A forced mode with a stale stored choice.** With `mode: "dark"`, a visitor who has `starlight-theme=light` in localStorage still gets dark, and no toggle is rendered. *(Task 4 `initialTheme` tests.)*
3. **Small screens.** At 375px, the three tabs and the Changelog, GitHub and Support links are reachable from the drawer. Margin notes appear inline after their paragraph. There's no horizontal scroll. *(Task 5 drawer test, Task 8 screenshot check.)*
4. **A page with no `description`** renders no empty lede and no stray drop cap. *(Task 8 manual step.)*
5. **A `docs.json` entry whose file doesn't exist** fails the build and names the slug (Starlight's own sidebar error). It must not produce a silently missing page. *(Task 8 manual step.)*

---

### Task 1: Project scaffold and the `docs.json` navigation model

**Files:**
- Create: `package.json`, `package-lock.json`, `tsconfig.json`, `src/lib/nav.ts`, `src/lib/nav.test.ts`
- Modify: `.gitignore` (add `node_modules/`, `dist/`, `.astro/`)
- Commit as well: `docs/superpowers/specs/*`, `docs/superpowers/plans/*` (written but not committed yet)

**Interfaces:**
- Produces (all exported from `src/lib/nav.ts`; `docs` is the parsed `docs.json`):
  - `interface DocsJson { name: string; navigation: { tabs: { tab: string; groups: { group: string; pages: string[] }[] }[] }; anchors?: NavLink[]; topbarLinks?: NavLink[]; topbarCtaButton?: NavLink; footer?: { socials?: Record<string, string>; links?: { title: string; items: { label: string; href: string }[] }[] }; metadata?: Record<string, string> }`, where `NavLink = { name: string; url: string }`
  - `interface Link { label: string; href: string }`
  - `interface Tab { label: string; short: string; href: string; groups: { label: string; pages: string[] }[] }`. `short` is the first word of `label` ("CLI Reference" → "CLI"). `href` is `'/' + first page`.
  - `tabs(docs: DocsJson): Tab[]`
  - `pagePatterns(docs: DocsJson): string[]`. One glob per page: `'platform/drift-detection.{md,mdx}'`.
  - `starlightSidebar(docs: DocsJson): { label: string; items: { label: string; items: string[] }[] }[]`. One top-level group per tab (label = tab name), with sub-groups = `docs.json` groups and items = page slugs.
  - `chapterFor(docs: DocsJson, slug: string): { tab: Tab; group: string; number: string } | undefined`. `number` is the 1-based position of the page across its whole tab, zero-padded to 2 digits.
  - `headerLinks(docs: DocsJson): { beside: Link[]; right: Link[]; cta?: Link }`:
    - `beside` holds the anchor named `Changelog`.
    - `right` holds `topbarLinks` followed by the other anchors, deduplicated by URL.
    - `cta` comes from `topbarCtaButton`.

- [ ] **Step 1: Create the branch and scaffold the package**

```bash
git checkout -b editorial-docs
npm init -y && npm pkg set type=module private=true
npm i astro@7.4.0 @astrojs/starlight@0.42.6 @astrojs/markdown-satteri@0.4.4
npm pkg set scripts.dev="astro dev" scripts.build="astro build" scripts.preview="astro preview" \
  scripts.test="node --test 'src/**/*.test.ts'" scripts.test:site="node --test 'tests/**/*.test.ts'"
```

`tsconfig.json`: `{ "extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist", "node_modules"] }`.

- [ ] **Step 2: Write the failing tests in `src/lib/nav.test.ts`**

Import the real file with `import docs from '../../docs.json' with { type: 'json' }` and also use a small fixture `F = { name: 'X', navigation: { tabs: [{ tab: 'Docs', groups: [{ group: 'A', pages: ['a', 'b'] }, { group: 'B', pages: ['c'] }] }, { tab: 'CLI Reference', groups: [{ group: 'C', pages: ['cli/x'] }] }] } }`.
- `tabs(docs).map(t => t.short)` deep-equals `['Docs', 'CLI', 'API']`, and `tabs(docs)[0].href === '/introduction'`.
- `pagePatterns(docs).length === 123`. It includes `'platform/drift-detection.{md,mdx}'`, and no entry matches `/README|SUMMARY/`.
- `chapterFor(F, 'c')` deep-equals `{ tab: tabs(F)[0], group: 'B', number: '03' }`, `chapterFor(F, 'cli/x').number === '01'`, and `chapterFor(F, 'nope') === undefined`.
- `starlightSidebar(F)` deep-equals `[{ label: 'Docs', items: [{ label: 'A', items: ['a', 'b'] }, { label: 'B', items: ['c'] }] }, { label: 'CLI Reference', items: [{ label: 'C', items: ['cli/x'] }] }]`.
- `headerLinks(docs)` deep-equals:
  - `beside`: `[{ label: 'Changelog', href: '/resources/changelog' }]`
  - `right`: `[{ label: 'GitHub', href: 'https://github.com/pratik-mahalle/infraudit-go' }, { label: 'Support', href: '/resources/support' }]`
  - `cta`: `{ label: 'Get Started Free', href: 'https://infraaudit.dev' }`

- [ ] **Step 3: Run the tests and confirm they fail.** Run `npm test`. Expected: it fails because the exports of `./nav.ts` are missing.
- [ ] **Step 4: Implement `src/lib/nav.ts`** with the signatures above. These are pure functions with no I/O.
- [ ] **Step 5: Run the tests and confirm they pass.** Run `npm test`. Expected: all nav tests pass.
- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json .gitignore src/lib/nav.ts src/lib/nav.test.ts docs/superpowers
git commit -m "feat(site): scaffold Astro + Starlight and docs.json nav model"
```

---

### Task 2: Build the site from existing content (stock Starlight look)

**Files:**
- Create:
  - `astro.config.mjs`
  - `src/content.config.ts`
  - `src/content/i18n/en.json`
  - `src/lib/site.ts`
  - `public/favicon.svg` (a copy of the root `favicon.svg`; the root file stays for Mintlify)
  - `public/CNAME` (contents: `docs.infraudit.com`)
  - `.mintignore` (lines: `src/`, `public/`, `docs/`, `tests/`, `dist/`, `node_modules/`)
  - `tests/helpers.ts`
  - `tests/site.test.ts`
- Modify (content link fixes): `cli/installation.md`, `cli/configuration.md`, `getting-started/what-is-infraudit.md`, `getting-started/quickstart-self-host.md`, `getting-started/core-concepts.md`

**Interfaces:**
- Consumes: `tabs`, `pagePatterns` and `starlightSidebar` from Task 1.
- Produces: `src/lib/site.ts` exports `REPO_URL = 'https://github.com/pratik-mahalle/infraudit-docs'`. `tests/helpers.ts` exports helpers that later tasks reuse:
  - `page(path: string): string` reads `dist/<path>/index.html`.
  - `allHtml(): string[]` lists every `.html` path under `dist`.

- [ ] **Step 1: Write the failing build-output tests in `tests/site.test.ts`.** They read `dist/`, so they run after `npm run build`.
  - Every slug in `docs.json` navigation has `dist/<slug>/index.html`, and the count is 123.
  - There is no `dist/README*`, `dist/summary*`, `dist/docs/` or `dist/getting-started/readme/`.
  - **Link check:** for every `href`/`src` in every built HTML file, skip `http(s):`, `mailto:`, `#…` and `data:`. Resolve relative values against the file's own URL, strip `?…`/`#…`, and assert that one of `dist/<p>`, `dist/<p>/index.html` or `dist/<p>.html` exists. On failure, list every broken `file → href` pair.
  - `dist/index.html` contains `url=/introduction`.
  - `dist/CNAME` is exactly `docs.infraudit.com`.
  - `dist/pagefind/pagefind-entry.json` has `languages.*.page_count >= 123`.
  - The sidebar on `/introduction/` labels the link "Introduction" (from `sidebarTitle`), not "InfraAudit Documentation".
  - `/platform/drift-detection/` has an edit link to `${REPO_URL}/edit/main/platform/drift-detection.md`.
- [ ] **Step 2: Run the tests and confirm they fail.** Run `npm run test:site`. Expected: it fails because `dist/` doesn't exist.
- [ ] **Step 3: Write `src/content.config.ts`.**
  - The `docs` collection uses `loader: glob({ base: '.', pattern: pagePatterns(docs) })`, with the `sidebarTitle` transform from the "Verified" notes and `extend: z.object({ icon: z.string().optional(), sidebarTitle: z.string().optional() })`.
  - The `i18n` collection uses `i18nLoader()` and `i18nSchema()`.
  - `en.json` is `{ "search.label": "Search the docs", "tableOfContents.onThisPage": "In this chapter", "page.editLink": "Edit this page on GitHub" }`.
- [ ] **Step 4: Write `astro.config.mjs`.**
  - `site: 'https://docs.infraudit.com'` and `redirects: { '/': tabs(docs)[0].href }`.
  - `starlight({ title: docs.name, favicon: '/favicon.svg', editLink: { baseUrl: REPO_URL + '/edit/main/' }, sidebar: starlightSidebar(docs), head })`.
  - `head` holds one `<meta>` per `docs.json` `metadata` entry: `property=` for `og:*` keys and `name=` for everything else.
  - Import `docs.json` with `with { type: 'json' }`.
  - No `markdown` key yet; Task 6 adds it.
- [ ] **Step 5: Fix the 22 relative `.md` links in content to root-absolute slugs.** For example, `](shell-completion.md)` in `cli/installation.md` becomes `](/cli/shell-completion)`, and `](../concepts/baselines.md)` becomes `](/concepts/baselines)`. The two broken targets map like this: `../api/README.md` → `/api/overview`, and `../api/webhooks/README.md` → `/api/webhooks/overview`. Find them with `grep -rnE '\]\([^)/#h][^)]*\.mdx?(#[^)]*)?\)' --include='*.md' --include='*.mdx' --exclude=README.md --exclude=SUMMARY.md --exclude-dir=docs .`, which must return nothing afterwards. The same links then also work on Mintlify.
- [ ] **Step 6: Build, then run the tests and confirm they pass.** Run `npm run build && npm run test:site`. Expected: all pass. If the link check finds other broken links, fix the content and list them in the commit message.
- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs src/content.config.ts src/content/i18n src/lib/site.ts public .mintignore tests \
  cli/installation.md cli/configuration.md getting-started/what-is-infraudit.md \
  getting-started/quickstart-self-host.md getting-started/core-concepts.md
git commit -m "feat(site): build all docs.json pages with Starlight; fix relative md links"
```

---

### Task 3: Theme engine (`theme.json` → validated palettes and CSS)

**Files:**
- Create: `src/lib/color.ts`, `src/lib/color.test.ts`, `src/lib/theme.ts`, `src/lib/theme.test.ts`, `theme.json`

**Interfaces:**
- Produces, from `src/lib/color.ts`:
  - `contrast(a: string, b: string): number`: the WCAG 2.x ratio for `#rrggbb` inputs.
  - `nearestPassing(change: string, against: string, min = 4.5): string`. It moves `change`'s HSL lightness in steps of 0.01, in the direction that raises contrast with `against`, and returns the first `#rrggbb` that reaches `min`.
  - `darkSurfaceFrom(hex: string): string`. Same hue, saturation capped at 0.25, lightness 0.09.
- Produces, from `src/lib/theme.ts`:
  - `type Background = { type: 'paper'; color?: string } | { type: 'color'; color: string } | { type: 'gradient'; value: string } | { type: 'image'; src: string }`. `src` is a path under `public/`, such as `/backgrounds/x.jpg`.
  - `interface ThemeInput { background?: Background | { light?: Background; dark?: Background }; accent?: string | { light?: string; dark?: string }; accent2?: string | { light?: string; dark?: string }; fonts?: Partial<Fonts>; mode?: 'light' | 'dark' | 'toggle' }`
  - `interface Fonts { heading: string; body: string; ui: string; code: string }`
  - `interface Palette { surface: string; reading: string; text: string; text2: string; muted: string; faint: string; rule: string; accent: string; accent2: string; bg: string; grain: boolean }`. `bg` is a CSS `background` value. `reading` is the color behind text.
  - `interface ResolvedTheme { light: Palette; dark: Palette; fonts: Fonts; mode: 'light' | 'dark' | 'toggle' }`
  - `class ThemeError extends Error`
  - `resolveTheme(input: ThemeInput, opts?: { imageExists?: (src: string) => boolean }): ResolvedTheme`. It throws `ThemeError`. `imageExists` defaults to `existsSync('public' + src)`.
  - `themeCss(t: ResolvedTheme): string`. It sets `--ed-surface`, `--ed-reading`, `--ed-text`, `--ed-text-2`, `--ed-muted`, `--ed-faint`, `--ed-rule`, `--ed-accent`, `--ed-accent-2`, `--ed-bg`, `--ed-grain`, `--ed-font-heading`, `--ed-font-body`, `--ed-font-ui` and `--ed-font-code` under `:root,:root[data-theme='light']{…}` and `:root[data-theme='dark']{…}`.
  - `fontLinks(f: Fonts): string[]`
  - `initialTheme(mode: 'light' | 'dark' | 'toggle', stored: string | null): 'light' | 'dark'`
  - `export const DEFAULT_THEME: ResolvedTheme` holds the Editorial values from Global Constraints.

**Resolution rules** (decided; the tests pin them):
- Without input, every value is the Editorial default. The default background is `{ type: 'paper' }`: `surface` is the palette surface, `grain` is `true` and `bg` is the surface color.
- **`paper` / `color`:** `surface` and `reading` are the given color. `grain` is on only for `paper`. When only one value is given, the dark surface is `darkSurfaceFrom(color)`.
- **`gradient` / `image`:** the same `bg` is used in both modes. `surface` is the default palette surface. `reading` is `color-mix(in srgb, <surface> 92%, transparent)`, and `grain` is off. Contrast is checked against `surface`.
- **A single `accent` / `accent2`:** this is the light value. Dark is `nearestPassing(value, darkSurface)` when the value fails on dark, and the value itself otherwise.
- **Contrast check:** for each mode, check `text`, `text2`, `muted`, `faint`, `accent` and `accent2` against `surface`. `rule` is not checked. On the first failure, throw:
  `theme.json (<mode> mode): <role> <fg> on background <bg> is <ratio>:1, needs 4.5:1. Try <field> <suggestion>.`
  - For the `accent` and `accent2` roles, `<field>` is that role and `<suggestion>` is `nearestPassing(fg, bg)`.
  - For text roles, `<field>` is `background` and `<suggestion>` is `nearestPassing(bg, fg)`.
  - `<ratio>` has 2 decimals.
- **Validation messages:**
  - Bad color: `theme.json: <key> "<value>" must be a 6-digit hex color like #2b3a8c.`
  - Bad type: `theme.json: background.type must be one of paper, color, gradient, image.`
  - Missing image: `theme.json: background image <src> not found in public/.`
  - Bad mode: `theme.json: mode must be light, dark or toggle.`
- **`fontLinks`:** for each *unique* family, emit two URLs. The first is `https://fonts.googleapis.com/css2?family=<Name+With+Plus>:ital,wght@0,400;0,500;0,600;1,400&display=swap`. The second is `https://fonts.googleapis.com/css2?family=<Name+With+Plus>&display=swap`. Comment: `// ponytail: Google rejects axis sets a static font lacks; the plain link is the fallback. Self-host fonts if this matters.`
- **`initialTheme`:** `mode === 'toggle' ? (stored === 'dark' ? 'dark' : 'light') : mode`.

- [ ] **Step 1: Write the failing tests.**
  - `color.test.ts`:
    - `contrast('#ffffff', '#000000')` equals 21.
    - `contrast('#6366f1', '#f3ede1')` rounds to 3.83.
    - `nearestPassing('#6366f1', '#f3ede1')` gives a contrast ≥ 4.5 and < 4.8.
    - `darkSurfaceFrom('#f3ede1')` gives a contrast ≥ 12 against `#ece4d4`.
  - `theme.test.ts`:
    - `resolveTheme({})` deep-equals `DEFAULT_THEME`.
    - `resolveTheme({ accent: '#6366f1' })` throws a `ThemeError` matching `/light mode\): accent #6366f1 on background #f3ede1 is 3\.83:1, needs 4\.5:1\. Try accent #[0-9a-f]{6}\./`.
    - `resolveTheme({ accent: '#4f46e5' }).dark.accent` passes 4.5 against `.dark.surface`.
    - `resolveTheme({ background: { type: 'color', color: '#777777' } })` throws a message matching `/Try background #[0-9a-f]{6}/`.
    - `{ accent: 'blue' }`, `{ background: { type: 'photo' } }` and `{ mode: 'auto' }` each throw their exact validation message.
    - `{ background: { type: 'image', src: '/bg.jpg' } }` with `imageExists: () => false` throws the "not found" message. With `() => true`, the result has `light.grain === false`, `light.bg` containing `url(/bg.jpg)` and `light.reading` starting `color-mix(`.
    - `themeCss(DEFAULT_THEME)` contains `--ed-accent:#2b3a8c` and `:root[data-theme='dark']{`, and its dark block contains `--ed-accent:#9fb0ff`.
    - `fontLinks(DEFAULT_THEME.fonts).length === 6`, and the first link includes `family=Newsreader:ital,wght@`.
    - `initialTheme`: `('toggle', null)` → `'light'`, `('toggle', 'dark')` → `'dark'`, `('dark', 'light')` → `'dark'`, and `('light', 'dark')` → `'light'`.
- [ ] **Step 2: Run the tests and confirm they fail.** Run `npm test`. Expected: the new tests fail because their imports are missing.
- [ ] **Step 3: Implement `color.ts` and `theme.ts`** with the signatures and rules above. Put the paper-grain SVG data URI as a constant in `theme.ts`: feTurbulence `baseFrequency .85`, `numOctaves 2`, alpha `.09`, copied from mock 3's `.p3` background. `--ed-grain` is `url("…")` or `none`.
- [ ] **Step 4: Write `theme.json`** with Pratik's knobs set to the Editorial defaults, so the file shows what can be changed: `{ "background": { "type": "paper", "color": "#f3ede1" }, "accent": "#2b3a8c", "fonts": { "heading": "Newsreader", "body": "Newsreader", "ui": "Inter", "code": "JetBrains Mono" }, "mode": "toggle" }`. Add a test asserting `resolveTheme(themeJson)` deep-equals `DEFAULT_THEME`.
- [ ] **Step 5: Run the tests and confirm they pass.** Run `npm test`. Expected: all pass.
- [ ] **Step 6: Commit.** `git commit -m "feat(theme): theme.json resolution with AA contrast check"`

---

### Task 4: Wire the theme in, plus the Editorial base styles

**Files:**
- Create: `src/components/Head.astro`, `src/components/ThemeProvider.astro`, `src/components/ThemeSelect.astro`, `src/styles/editorial.css`
- Modify: `astro.config.mjs` (`components`, `customCss`, `expressiveCode`), `tests/site.test.ts`

**Interfaces:**
- Consumes: `resolveTheme`, `themeCss`, `fontLinks` and `initialTheme` (Task 3), plus `theme.json`.
- Produces: the CSS custom properties `--ed-*` that Tasks 5–6 style against, and the `data-theme` attribute on `<html>`.

- [ ] **Step 1: Add failing assertions to `tests/site.test.ts`.**
  - The `/introduction/` `<head>` contains `--ed-accent:#2b3a8c`, a Google Fonts link with `family=Newsreader`, and a `<script>` whose text includes both `starlight-theme` and `"toggle"` (the inlined `initialTheme` call).
  - The page has a button with `aria-label="Switch to dark theme"` and no `<select>` for the theme.
- [ ] **Step 2: Run them and confirm they fail.** Run `npm run build && npm run test:site`. Expected: the new assertions fail.
- [ ] **Step 3: Implement the three components.**
  - **`Head.astro`:** render Starlight's default (`import Default from '@astrojs/starlight/components/Head.astro'`), then `<link rel="preconnect">` for both Google Fonts origins, a `<link rel="stylesheet">` per `fontLinks()` URL, and `<style set:html={themeCss(resolveTheme(themeJson))} />`. A `ThemeError` must propagate, which fails the build or shows the dev overlay.
  - **`ThemeProvider.astro`:** an inline script built as ``set:html={`(${initialTheme})(${JSON.stringify(mode)}, localStorage.getItem('starlight-theme'))`}`` whose result is written to `document.documentElement.dataset.theme`. Write it so it runs before paint, the same as Starlight's own. Using the tested function's source means the shipped logic is the tested logic.
  - **`ThemeSelect.astro`:** renders nothing unless the mode is `toggle`. Otherwise it's a `<button>` showing a sun or moon icon (`@astrojs/starlight/components` `Icon`) with `aria-label` "Switch to dark theme" or "Switch to light theme". On click it flips `data-theme` and stores the value in `localStorage['starlight-theme']`.
- [ ] **Step 4: Write `editorial.css`** (unlayered, so it beats `@layer starlight`):
  - **Starlight variables:** map Starlight's variables to the `--ed-*` tokens:
    - `--sl-color-bg` = `--ed-surface`
    - `--sl-color-text` = `--ed-text`
    - `--sl-color-white` = `--ed-text`
    - `--sl-color-gray-1..3` across text2 → muted
    - `--sl-color-gray-5/6` and `--sl-color-hairline*` = `--ed-rule`
    - `--sl-color-accent*` from `--ed-accent`
    - `--sl-font` = body font
    - `--sl-font-mono` = code font
  - **Page background:** `body { background: var(--ed-grain), var(--ed-bg); }`. The content pane, sidebar and header use `background: var(--ed-reading)`.
  - **Typography:** body copy is the body font at about 18px with 1.6 line height. `h1`–`h3` use the heading font at regular weight. UI chrome (buttons, labels, code-tab labels) uses the UI font.
  - **Blockquotes:** existing `> **Warning:** …` notes become a hairline left rule in the accent color, italic serif and no box. They must not look like default callout boxes.
  - **Ordered lists:** italic serif numerals in `--ed-accent` (`li::marker`).
  - **Code blocks:** in `astro.config.mjs`, set `expressiveCode: { themes: ['github-dark'], styleOverrides: { borderRadius: '4px', codeBackground: '#221d17', codeFontFamily: 'var(--ed-font-code)' } }`, so blocks are dark ink in both modes. Check the key names against the installed `@astrojs/starlight/expressive-code` types.
  - Register `components: { Head, ThemeProvider, ThemeSelect }` and `customCss: ['./src/styles/editorial.css']`.
- [ ] **Step 5: Run the checks and confirm they pass.** Run `npm test && npm run build && npm run test:site`. Expected: all pass.
- [ ] **Step 6: Run the contrast-failure smoke test.** Set `"accent": "#6366f1"` in `theme.json` and run `npm run build`. Expected: the build fails with the Task 3 message, including "Try accent #…". Revert the change.
- [ ] **Step 7: Commit.** `git commit -m "feat(theme): apply theme.json, light-default toggle, editorial base styles"`

---

### Task 5: Editorial chrome (header, numbered sidebar, chapter title)

**Files:**
- Create: `src/components/Header.astro`, `src/components/Sidebar.astro`, `src/components/PageTitle.astro`
- Modify: `astro.config.mjs` (`components`), `src/styles/editorial.css`, `tests/site.test.ts`

**Interfaces:**
- Consumes: `tabs`, `chapterFor` and `headerLinks` (Task 1), `Astro.locals.starlightRoute` (`id`, `entry.data.title`, `entry.data.description`, `sidebar`), and Starlight's default `Search` (`@astrojs/starlight/components/Search.astro`) and `MobileMenuFooter` components.

- [ ] **Step 1: Add failing assertions to `tests/site.test.ts`** for `/platform/drift-detection/`:
  - **Header:**
    - The wordmark text is `InfraAudit Docs`.
    - There are exactly 3 header tab links with the texts `Docs`, `CLI` and `API`, and only `Docs` has `aria-current="page"`.
    - A link `/resources/changelog` sits inside the tabs nav.
    - The right group has links to `https://github.com/pratik-mahalle/infraudit-go` and `/resources/support`.
    - The CTA is `<a href="https://infraaudit.dev">Get Started Free</a>`.
  - **Sidebar:** it contains the group label `Platform Guide`, and does not contain `CLI` or `Commands` as group labels. The current link's number equals `chapterFor(docs, 'platform/drift-detection').number`.
  - **Title:** the breadcrumb text equals `Platform Guide · chapter <that number>`. There's an `<h1 id="_top">` with the frontmatter title, and `<p class="lede">` with the frontmatter description.
  - **CLI page** (`/cli/overview/`): only the `CLI` tab is `aria-current`, and the sidebar contains `Commands`.
  - **Drawer:** the sidebar markup contains a mobile-only tab list with the same 3 tabs and the Changelog, GitHub and Support links.
- [ ] **Step 2: Run them and confirm they fail.** Run `npm run build && npm run test:site`.
- [ ] **Step 3: Implement the three overrides** to the spec's "Page layout" section and mock 3.
  - **`Header.astro`:**
    - On the left, the wordmark links to `tabs(docs)[0].href`.
    - A `<nav>` holds the tabs and the `beside` links. The active tab is `chapterFor(docs, route.id)?.tab`, falling back to the first tab.
    - Then the `Search` component, the `right` links, the CTA and `ThemeSelect`.
    - Below `50rem`, show only the wordmark, search and the toggle.
  - **`Sidebar.astro`:**
    - First, a block visible only below `50rem`: the tabs plus the `beside` and `right` links.
    - Then the entries of the top-level `route.sidebar` group whose `label` equals the active tab's `label`. Each sub-group label is small caps. Each link has a right-aligned 2-digit number, counted in order through the tab.
    - Then `<MobileMenuFooter />`.
  - **`PageTitle.astro`:** the breadcrumb (`<group> · chapter <NN>`, small caps, `--ed-accent-2`), then `<h1 id="_top">`, then `<p class="lede">` only when there is a description. The drop cap is `.lede::first-letter` in `--ed-accent`.
  - **CSS:**
    - The header has a 3px double bottom border `#cfc3ad` (or `--ed-rule` in dark mode).
    - Tabs are lowercase small caps, and the active one has a 1px accent underline.
    - The search field is underline-only with an italic serif placeholder.
    - Sidebar links use the serif font. The active link is italic in the accent color. Numbers are in `--ed-faint`.
    - H1 is about 40px heading font.
    - Lede is about 1.15× body size.
- [ ] **Step 4: Run the checks and confirm they pass.** Run `npm test && npm run build && npm run test:site`.
- [ ] **Step 5: Commit.** `git commit -m "feat(site): editorial header, numbered sidebar, chapter title"`

---

### Task 6: Margin notes, "In this chapter" and the page footer

**Files:**
- Create: `src/lib/margin-notes.ts`, `src/lib/margin-notes.test.ts`, `src/components/TableOfContents.astro`, `src/components/Footer.astro`
- Modify: `astro.config.mjs` (`markdown.processor`, `components`), `src/styles/editorial.css`, `tests/site.test.ts`

**Interfaces:**
- Produces, from `src/lib/margin-notes.ts`:
  - `marginNotesPlugin`: the Sätteri mdast plugin object from the "Verified" notes, with the name `'margin-notes'`.
  - `extractMarginNotes(body: string): string[]`: the trimmed inner text of each `:::margin` … `:::` block, in order.
- Consumes: `REPO_URL` (Task 2), `docs.footer` (Task 1 types), and `route.toc`, `route.entry.body`, `route.editUrl` and `route.pagination`.

- [ ] **Step 1: Write the failing tests.**
  - **`margin-notes.test.ts`:**
    - `extractMarginNotes('a\n\n:::margin\nOne\n:::\n\nb\n\n:::margin\nTwo `x`\n:::\n')` deep-equals `['One', 'Two `x`']`.
    - `extractMarginNotes('no notes')` deep-equals `[]`.
    - `marginNotesPlugin.containerDirective({ type: 'containerDirective', name: 'margin', children: [c] })` returns `{ type: 'paragraph', data: { hName: 'aside', hProperties: { className: ['margin-note'] } }, children: [c] }`.
    - With `name: 'other'`, it returns `undefined`.
  - **`tests/site.test.ts`, for `/platform/drift-detection/`:**
    - The right column heading text is `In this chapter`.
    - There's a link with the text `Edit this page on GitHub`.
    - There's a link whose `href` starts with `${REPO_URL}/issues/new?title=` and has the text `Report an issue`.
    - The footer contains each `docs.json` `footer.links[*].items[*].label` (for example `Pricing` and `Privacy policy`).
- [ ] **Step 2: Run them and confirm they fail.** Run `npm test` and `npm run build && npm run test:site`.
- [ ] **Step 3: Implement the module and overrides.**
  - **`margin-notes.ts`.** Then in `astro.config.mjs`, set `markdown: { processor: satteri({ mdastPlugins: [marginNotesPlugin] }) }`.
  - **`TableOfContents.astro`:** render Starlight's default TOC, then `<div class="margin-notes">` with one `<p>` per `extractMarginNotes(route.entry.body)`. Add `// ponytail: notes render as plain text in the margin column; inline copies render full markdown.`
  - **`Footer.astro`:**
    - Starlight's default Footer, which provides the edit link and pagination.
    - A "Report an issue" link: `${REPO_URL}/issues/new?title=${encodeURIComponent('Docs: ' + title)}&body=${encodeURIComponent(canonical page URL)}`.
    - The `docs.json` `footer.links` columns, with small-caps titles.
  - **CSS:**
    - `.margin-note` is italic serif in `--ed-text-2`, with a hairline top rule.
    - At `≥ 72rem`, inline `.margin-note` is `display: none` and the `.margin-notes` column copy shows. Below that, the inline copy shows and the column copy is hidden.
- [ ] **Step 4: Run the checks and confirm they pass.** Run `npm test && npm run build && npm run test:site`.
- [ ] **Step 5: Commit.** `git commit -m "feat(site): margin notes, chapter TOC, footer with edit/issue links"`

---

### Task 7: Deploy to docs.infraudit.com, plus the authoring docs

**Files:**
- Modify: `.github/workflows/deploy.yml` (rewrite), `README.md` (add the "Run locally" and "Change the theme" sections; the existing text stays)

- [ ] **Step 1: Rewrite `deploy.yml`.**
  - Keep the triggers (`push` to `main`, `workflow_dispatch`), the permissions, the concurrency settings and the `deploy` job.
  - Build job: `actions/setup-node@v4` with `node-version: '24'` and `cache: npm`, then `npm ci`, `npm test`, `npm run build`, `npm run test:site`, then `actions/upload-pages-artifact@v3` with `path: dist/`.
  - Remove the Mintlify install, export and debug steps.
- [ ] **Step 2: Write the README sections.**
  - **"Run locally":** `npm ci && npm run dev`, then open the printed URL.
  - **"Change the theme":** every `theme.json` key with an example for each background type, a note that images go in `public/`, the light/dark object form, and what the contrast error looks like and how to act on its suggestion.
  - **"Add a page":** create the `.md`, then add its path to `docs.json` `navigation`.
- [ ] **Step 3: Check that the YAML parses.** Run `npx --yes yaml@2 valid < .github/workflows/deploy.yml`. Expected: exit 0. The real proof is the first run on `main`, which happens after Pratik merges. Say so in the task report.
- [ ] **Step 4: Commit.** `git commit -m "ci: build and deploy the Astro site to GitHub Pages"`
- [ ] **Step 5: Hand Pratik the go-live steps. These are outward-facing, so ask before running anything here.**
  1. In GitHub Pages settings, set the source to GitHub Actions and the custom domain: `gh api -X PUT repos/pratik-mahalle/infraudit-docs/pages -f build_type=workflow -f cname=docs.infraudit.com` (use `POST` if Pages isn't enabled yet).
  2. Pratik adds a DNS record: `CNAME docs → pratik-mahalle.github.io`.
  3. After DNS resolves, tick "Enforce HTTPS".
  4. Merge `editorial-docs` into `main` (or push it) only when Pratik says so.

---

### Task 8: Visual and failure-mode verification against the mockup

**Files:** none are committed. Screenshots go to the scratchpad.

- [ ] **Step 1: Desktop light screenshot.** Run `npm run build && npx astro preview --port 4321`, then use headless Chrome:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1280,1400 --virtual-time-budget=4000 --screenshot=<scratchpad>/drift-light.png http://localhost:4321/platform/drift-detection/`.
  Compare it side by side with mock 3 and check:
  - paper grain is visible
  - the double rule is under the header
  - the tabs are small caps
  - sidebar numbers are present and the active link is italic in ink-blue
  - the breadcrumb is oxblood
  - the drop cap is there
  - the right column reads "In this chapter"
  - code blocks are dark ink
  Fix differences in `editorial.css` and re-shoot.
- [ ] **Step 2: Dark mode screenshot.** Set `"mode": "dark"` in `theme.json`, rebuild, re-shoot to `drift-dark.png`, check it, then revert.
- [ ] **Step 3: Mobile screenshot (Review Focus 3).** Use `--window-size=375,1600`, saved to `drift-mobile.png`. Check that there's no horizontal scroll: run `document.documentElement.scrollWidth <= 375` via `--dump-dom` plus a script, or check the screenshot visually. Open the drawer at 375px in a real browser and confirm the tabs and links are there.
- [ ] **Step 4: Missing description (Review Focus 4).** Temporarily delete `description:` from `resources/support.md`, build, and confirm `/resources/support/` has no `.lede` element and no stray drop cap. Revert.
- [ ] **Step 5: Bad `docs.json` page (Review Focus 5).** Temporarily add `"platform/does-not-exist"` to a group and run `npm run build`. Expected: the build fails and names `platform/does-not-exist`. Revert.
- [ ] **Step 6: Image background.** Put any JPG in `public/backgrounds/test.jpg`, set `"background": { "type": "image", "src": "/backgrounds/test.jpg" }`, build and screenshot. The text must sit on the paper reading surface over the image. Revert, and delete the JPG.
- [ ] **Step 7: Live theme edit.** With `npm run dev` running, change `accent` in `theme.json` to `#4f46e5` and save. Expected: the open page updates without restarting the dev server. Revert.
- [ ] **Step 8: Report.** Write up the screenshot paths, every check with pass/fail, and any CSS fixes made (commit them as `fix(style): …`).
