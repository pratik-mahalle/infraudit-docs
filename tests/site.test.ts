// Checks the built site in dist/. Run `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import docs from '../docs.json' with { type: 'json' };
import { tabs } from '../src/lib/nav.ts';
import { DIST, page, allHtml, linkTexts } from './helpers.ts';

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

test('pages link to their source on GitHub for editing', () => {
	assert.ok(
		page('/platform/drift-detection/').includes(
			'href="https://github.com/pratik-mahalle/infraudit-docs/edit/main/platform/drift-detection.md"',
		),
	);
});
