import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractMarginNotes, marginNotesPlugin } from './margin-notes.ts';

test('extractMarginNotes returns each :::margin block in order', () => {
	assert.deepEqual(extractMarginNotes('a\n\n:::margin\nOne\n:::\n\nb\n\n:::margin\nTwo `x`\n:::\n'), ['One', 'Two `x`']);
	assert.deepEqual(extractMarginNotes('no notes'), []);
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
