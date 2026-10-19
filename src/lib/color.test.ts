import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrast, nearestPassing, darkSurfaceFrom } from './color.ts';

test('contrast follows WCAG 2.x', () => {
	assert.equal(contrast('#ffffff', '#000000'), 21);
	assert.equal(contrast('#6366f1', '#f3ede1').toFixed(2), '3.83');
});

test('nearestPassing finds the closest shade that reaches 4.5:1', () => {
	const c = contrast(nearestPassing('#6366f1', '#f3ede1'), '#f3ede1');
	assert.ok(c >= 4.5 && c < 4.8, `got ${c}`);
});

test('darkSurfaceFrom gives a surface light text reads well on', () => {
	assert.ok(contrast(darkSurfaceFrom('#f3ede1'), '#ece4d4') >= 12);
});
