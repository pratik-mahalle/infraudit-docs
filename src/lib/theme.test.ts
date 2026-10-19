import { test } from 'node:test';
import assert from 'node:assert/strict';
import themeJson from '../../theme.json' with { type: 'json' };
import { contrast } from './color.ts';
import { resolveTheme, themeCss, fontLinks, initialTheme, DEFAULT_THEME, ThemeError, type ThemeInput } from './theme.ts';

const throwsTheme = (input: unknown, message: string | RegExp, opts?: Parameters<typeof resolveTheme>[1]) =>
	assert.throws(() => resolveTheme(input as ThemeInput, opts), (e: unknown) => {
		assert.ok(e instanceof ThemeError);
		typeof message === 'string' ? assert.equal(e.message, message) : assert.match(e.message, message);
		return true;
	});

test('an empty theme is the Editorial default', () => {
	assert.deepEqual(resolveTheme({}), DEFAULT_THEME);
});

test('theme.json as shipped reproduces the Editorial default', () => {
	assert.deepEqual(resolveTheme(themeJson as ThemeInput), DEFAULT_THEME);
});

test('a low-contrast accent stops the build with a suggestion', () => {
	throwsTheme(
		{ accent: '#6366f1' },
		/light mode\): accent #6366f1 on background #f3ede1 is 3\.83:1, needs 4\.5:1\. Try accent #[0-9a-f]{6}\./,
	);
});

test('a single accent gets a readable dark-mode version', () => {
	const t = resolveTheme({ accent: '#4f46e5' });
	assert.ok(contrast(t.dark.accent, t.dark.surface) >= 4.5);
});

test('a background that makes text unreadable suggests a background shade', () => {
	throwsTheme({ background: { type: 'color', color: '#777777' } }, /Try background #[0-9a-f]{6}/);
});

test('bad values name the key', () => {
	throwsTheme({ accent: 'blue' }, 'theme.json: accent "blue" must be a 6-digit hex color like #2b3a8c.');
	throwsTheme({ background: { type: 'photo' } }, 'theme.json: background.type must be one of paper, color, gradient, image.');
	throwsTheme({ mode: 'auto' }, 'theme.json: mode must be light, dark or toggle.');
});

test('image backgrounds must exist and keep text on a reading surface', () => {
	const input = { background: { type: 'image', src: '/bg.jpg' } } as const;
	throwsTheme(input, 'theme.json: background image /bg.jpg not found in public/.', { imageExists: () => false });
	const t = resolveTheme(input, { imageExists: () => true });
	assert.equal(t.light.grain, false);
	assert.ok(t.light.bg.includes('url("/bg.jpg")'));
	assert.ok(t.light.reading.startsWith('color-mix('));
});

test('themeCss emits light and dark custom properties', () => {
	const css = themeCss(DEFAULT_THEME);
	assert.ok(css.includes('--ed-accent:#2b3a8c'));
	const dark = css.slice(css.indexOf(":root[data-theme='dark']{"));
	assert.ok(dark.length > 0 && css.includes(":root[data-theme='dark']{"));
	assert.ok(dark.includes('--ed-accent:#9fb0ff'));
});

test('fontLinks requests each family twice: full axes, then plain fallback', () => {
	const links = fontLinks(DEFAULT_THEME.fonts);
	assert.equal(links.length, 6);
	assert.ok(links[0].includes('family=Newsreader:ital,wght@'));
});

test('initialTheme starts light, honours a stored choice only in toggle mode', () => {
	assert.equal(initialTheme('toggle', null), 'light');
	assert.equal(initialTheme('toggle', 'dark'), 'dark');
	assert.equal(initialTheme('dark', 'light'), 'dark');
	assert.equal(initialTheme('light', 'dark'), 'light');
});

test('typos and wrong shapes in theme.json are named, never ignored', () => {
	throwsTheme({ acent: '#2b3a8c' }, 'theme.json: unknown key "acent". Allowed: background, accent, accent2, fonts, mode.');
	throwsTheme({ accent: { Light: '#ff0000' } }, 'theme.json: accent may only contain "light" and "dark", found "Light".');
	throwsTheme({ background: { color: '#ffffff' } }, 'theme.json: background.type must be one of paper, color, gradient, image.');
	throwsTheme({ background: null }, 'theme.json: background.type must be one of paper, color, gradient, image.');
	throwsTheme({ accent: null }, 'theme.json: accent "null" must be a 6-digit hex color like #2b3a8c.');
	throwsTheme(
		{ background: { type: 'gradient', vaule: 'linear-gradient(#fff, #eee)' } },
		'theme.json: background.value must be a CSS gradient like linear-gradient(135deg, #fde3d1, #e5defc).',
	);
	throwsTheme({ fonts: { header: 'Inter' } }, 'theme.json: unknown key "fonts.header". Allowed: heading, body, ui, code.');
	throwsTheme({ fonts: { heading: 123 } }, 'theme.json: fonts.heading must be a font name like "Newsreader".');
});

test('image URLs are quoted so paths with spaces still work', () => {
	const t = resolveTheme({ background: { type: 'image', src: '/a b.jpg' } }, { imageExists: () => true });
	assert.ok(t.light.bg.includes('url("/a b.jpg")'));
});

test('following the suggested background makes the theme pass', () => {
	for (const color of ['#777777', '#1e293b', '#c8b8a0']) {
		let hint = '';
		try {
			resolveTheme({ background: { type: 'color', color } });
		} catch (e) {
			hint = (e as Error).message.match(/Try background (#[0-9a-f]{6})/)?.[1] ?? '';
		}
		assert.ok(hint, `${color} should fail with a background hint`);
		assert.doesNotThrow(() => resolveTheme({ background: { type: 'color', color: hint } }), `${color} → ${hint}`);
	}
});
