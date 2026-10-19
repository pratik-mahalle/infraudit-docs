import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractMarginNotes, marginNotesPlugin } from './margin-notes.ts';

test('extractMarginNotes returns each rendered margin note, markup intact', () => {
	const note = '<aside class="margin-note"><p>One <code>x</code> and <a href="/a">a link</a></p></aside>';
	assert.deepEqual(extractMarginNotes(`<p>a</p>${note}<p>b</p><aside class="margin-note"><p>Two</p></aside>`), [
		note,
		'<aside class="margin-note"><p>Two</p></aside>',
	]);
	assert.deepEqual(extractMarginNotes('<pre><code>:::margin\nnot a note\n:::</code></pre>'), []);
});

test('marginNotesPlugin turns :::margin into an aside and leaves other directives alone', () => {
	const c = { type: 'text', value: 'hi' };
	assert.deepEqual(marginNotesPlugin.containerDirective({ type: 'containerDirective', name: 'margin', children: [c] }), {
		type: 'paragraph',
		data: { hName: 'aside', hProperties: { className: ['margin-note'] } },
		children: [c],
	});
	assert.equal(marginNotesPlugin.containerDirective({ type: 'containerDirective', name: 'other', children: [c] }), undefined);
});
