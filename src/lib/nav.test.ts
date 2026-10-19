import { test } from 'node:test';
import assert from 'node:assert/strict';
import docs from '../../docs.json' with { type: 'json' };
import { tabs, pagePatterns, chapterFor, starlightSidebar, headerLinks, type DocsJson } from './nav.ts';

const F: DocsJson = {
	name: 'X',
	navigation: {
		tabs: [
			{ tab: 'Docs', groups: [{ group: 'A', pages: ['a', 'b'] }, { group: 'B', pages: ['c'] }] },
			{ tab: 'CLI Reference', groups: [{ group: 'C', pages: ['cli/x'] }] },
		],
	},
};

test('tabs use the first word as the short label and the first page as href', () => {
	assert.deepEqual(tabs(docs).map((t) => t.short), ['Docs', 'CLI', 'API']);
	assert.equal(tabs(docs)[0].href, '/introduction');
});

test('pagePatterns lists every navigation page and nothing else', () => {
	const p = pagePatterns(docs);
	assert.equal(p.length, 123);
	assert.ok(p.includes('platform/drift-detection.{md,mdx}'));
	assert.ok(!p.some((x) => /README|SUMMARY/.test(x)));
});

test('chapterFor numbers pages across the whole tab', () => {
	assert.deepEqual(chapterFor(F, 'c'), { tab: tabs(F)[0], group: 'B', number: '03' });
	assert.equal(chapterFor(F, 'cli/x')?.number, '01');
	assert.equal(chapterFor(F, 'nope'), undefined);
});

test('starlightSidebar nests docs.json groups under one group per tab', () => {
	assert.deepEqual(starlightSidebar(F), [
		{ label: 'Docs', items: [{ label: 'A', items: ['a', 'b'] }, { label: 'B', items: ['c'] }] },
		{ label: 'CLI Reference', items: [{ label: 'C', items: ['cli/x'] }] },
	]);
});

test('headerLinks splits changelog from the right-hand links and dedupes GitHub', () => {
	assert.deepEqual(headerLinks(docs), {
		beside: [{ label: 'Changelog', href: '/resources/changelog' }],
		right: [
			{ label: 'GitHub', href: 'https://github.com/pratik-mahalle/infraudit-go' },
			{ label: 'Support', href: '/resources/support' },
		],
		cta: { label: 'Get Started Free', href: 'https://infraaudit.dev' },
	});
});
