// Checks the built site in dist/. Run `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import docs from '../docs.json' with { type: 'json' };
import { tabs, chapterFor } from '../src/lib/nav.ts';
import { DIST, page, allHtml, linkTexts, between } from './helpers.ts';

const slugs = tabs(docs).flatMap((t) => t.groups.flatMap((g) => g.pages));

test('every docs.json page is built', () => {
	assert.equal(slugs.length, 123);
	const missing = slugs.filter((s) => !existsSync(join(DIST, s, 'index.html')));
	assert.deepEqual(missing, []);
});

test('GitBook leftovers and repo docs are not published', () => {
	for (const p of ['README', 'readme', 'summary', 'SUMMARY', 'docs', 'getting-started/readme']) {
		assert.ok(!existsSync(join(DIST, p)), `dist/${p} should not exist`);
	}
});

test('every internal link and asset resolves to a built file', () => {
	const broken: string[] = [];
	for (const file of allHtml()) {
		const html = readFileSync(join(DIST, file), 'utf8');
		for (const [, raw] of html.matchAll(/(?<![\w-])(?:href|src)="([^"]+)"/g)) {
			const v = raw.replace(/&amp;/g, '&');
			if (/^(https?:|mailto:|data:|#|\/\/)/.test(v)) continue;
			const p = decodeURIComponent(new URL(v, 'https://x/' + file).pathname).replace(/^\//, '');
			const ok = [p, join(p, 'index.html'), p + '.html'].some((c) => c && existsSync(join(DIST, c)));
			if (!ok) broken.push(`${file} → ${raw}`);
		}
	}
	assert.deepEqual(broken, []);
});

test('the root redirects to the first page', () => {
	assert.match(readFileSync(join(DIST, 'index.html'), 'utf8'), /url=\/introduction/);
});

test('CNAME points GitHub Pages at docs.infraudit.com', () => {
	assert.equal(readFileSync(join(DIST, 'CNAME'), 'utf8').trim(), 'docs.infraudit.com');
});

test('search indexes every page', () => {
	const entry = JSON.parse(readFileSync(join(DIST, 'pagefind/pagefind-entry.json'), 'utf8'));
	const count = Object.values(entry.languages as Record<string, { page_count: number }>)[0].page_count;
	assert.ok(count >= 123, `pagefind indexed ${count} pages`);
});

test('sidebarTitle is used as the sidebar label', () => {
	const texts = linkTexts(page('/introduction/'), '/introduction/');
	assert.ok(texts.some((t) => t.startsWith('Introduction')), texts.join(' | '));
	assert.ok(!texts.includes('InfraAudit Documentation'));
});

test('theme.json is applied in the head with its fonts', () => {
	const html = page('/introduction/');
	const head = html.slice(0, html.indexOf('</head>'));
	assert.ok(head.includes('--ed-accent:#2b3a8c'));
	assert.match(head, /<link[^>]+fonts\.googleapis\.com\/css2\?family=Newsreader/);
	const scripts = [...head.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
	assert.ok(scripts.some((s) => s.includes('starlight-theme') && s.includes('"toggle"')), 'initialTheme is inlined');
});

test('light/dark is a two-state toggle, not Starlight’s auto select', () => {
	const html = page('/introduction/');
	assert.ok(html.includes('aria-label="Switch to dark theme"'));
	assert.ok(!html.includes('<starlight-theme-select'));
});

const drift = () => page('/platform/drift-detection/');
const tabTexts = (html: string) => {
	const nav = between(html, '<nav class="ed-tabs"', '</nav>');
	return [...nav.matchAll(/<a class="ed-tab"([^>]*)>([^<]*)<\/a>/g)].map((m) => ({
		text: m[2].trim(),
		current: m[1].includes('aria-current="page"'),
	}));
};

test('header: wordmark, tabs with the active one marked, changelog beside, links and CTA right', () => {
	const h = between(drift(), '<header class="header', '</header>');
	assert.match(h, /class="ed-wordmark"[^>]*>InfraAudit Docs</);
	assert.deepEqual(tabTexts(h), [
		{ text: 'Docs', current: true },
		{ text: 'CLI', current: false },
		{ text: 'API', current: false },
	]);
	assert.ok(between(h, '<nav class="ed-tabs"', '</nav>').includes('href="/resources/changelog"'));
	const right = between(h, '<div class="ed-header-links"', '</div>');
	assert.ok(right.includes('href="https://github.com/pratik-mahalle/infraudit-go"'));
	assert.ok(right.includes('href="/resources/support"'));
	assert.match(h, /<a[^>]*href="https:\/\/infraaudit\.dev"[^>]*>Get Started Free<\/a>/);
});

test('sidebar shows only the active tab, numbered like the chapter title', () => {
	const html = drift();
	const sb = between(html, '<div class="ed-sidebar"', '</nav>');
	const groups = [...sb.matchAll(/class="ed-group">([^<]*)</g)].map((m) => m[1]);
	assert.ok(groups.includes('Platform Guide'), groups.join(', '));
	assert.ok(!groups.includes('CLI') && !groups.includes('Commands'));
	const current = sb.match(/<a [^>]*aria-current="page"[^>]*>[\s\S]*?class="ed-num">(\d\d)</)?.[1];
	const number = chapterFor(docs, 'platform/drift-detection')?.number;
	assert.equal(current, number);
	assert.match(html, new RegExp(`class="ed-crumb">Platform Guide · chapter ${number}<`));
});

test('the page opens with its title and its description as the lede', () => {
	const html = drift();
	assert.match(html, /<h1 id="_top"[^>]*>Drift Detection<\/h1>/);
	assert.match(html, /<p class="lede"[^>]*>Detect and investigate configuration drift across your cloud infrastructure\.<\/p>/);
});

test('CLI pages mark the CLI tab and show CLI groups', () => {
	const html = page('/cli/overview/');
	assert.deepEqual(tabTexts(between(html, '<header class="header', '</header>')).filter((t) => t.current).map((t) => t.text), ['CLI']);
	assert.ok(between(html, '<div class="ed-sidebar"', '</nav>').includes('class="ed-group">Commands<'));
});

test('the mobile drawer carries the tabs and header links', () => {
	const m = between(drift(), '<div class="ed-mobile-nav"', '<div class="ed-sidebar"');
	for (const href of ['/introduction', '/cli/overview', '/api/overview', '/resources/changelog', 'https://github.com/pratik-mahalle/infraudit-go', '/resources/support']) {
		assert.ok(m.includes(`href="${href}"`), href);
	}
});

test('the right column is headed "In this chapter"', () => {
	assert.match(drift(), /<h2 id="starlight__on-this-page"[^>]*>In this chapter<\/h2>/);
});

test('each page ends with edit and report-an-issue links', () => {
	const html = drift();
	assert.ok(linkTexts(html, 'https://github.com/pratik-mahalle/infraudit-docs/edit/main/platform/drift-detection.md').some((t) => t.includes('Edit this page on GitHub')));
	assert.match(html, /<a[^>]*href="https:\/\/github\.com\/pratik-mahalle\/infraudit-docs\/issues\/new\?title=[^"]*"[^>]*>Report an issue<\/a>/);
});

test('the footer carries docs.json footer links', () => {
	const footer = between(drift(), '<div class="ed-footer-links"', '</footer>');
	for (const col of docs.footer.links) for (const item of col.items) assert.ok(footer.includes(`>${item.label}</a>`), item.label);
});

test('pages link to their source on GitHub for editing', () => {
	assert.ok(
		page('/platform/drift-detection/').includes(
			'href="https://github.com/pratik-mahalle/infraudit-docs/edit/main/platform/drift-detection.md"',
		),
	);
});
