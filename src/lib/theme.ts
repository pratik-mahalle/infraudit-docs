// Turns theme.json into the --ed-* custom properties, refusing anything that makes text hard to read.
import { existsSync } from 'node:fs';
import { contrast, nearestPassing, darkSurfaceFrom } from './color.ts';

export type Background =
	| { type: 'paper'; color?: string }
	| { type: 'color'; color: string }
	| { type: 'gradient'; value: string }
	| { type: 'image'; src: string };
type Mode = 'light' | 'dark';
type PerMode<T> = T | { light?: T; dark?: T };

export interface Fonts {
	heading: string;
	body: string;
	ui: string;
	code: string;
}

export interface ThemeInput {
	background?: PerMode<Background>;
	accent?: PerMode<string>;
	accent2?: PerMode<string>;
	fonts?: Partial<Fonts>;
	mode?: 'light' | 'dark' | 'toggle';
}

export interface Palette {
	surface: string;
	reading: string;
	text: string;
	text2: string;
	muted: string;
	faint: string;
	rule: string;
	accent: string;
	accent2: string;
	bg: string;
	grain: boolean;
}

export interface ResolvedTheme {
	light: Palette;
	dark: Palette;
	fonts: Fonts;
	mode: 'light' | 'dark' | 'toggle';
}

export class ThemeError extends Error {}

const INK = {
	light: { surface: '#f3ede1', text: '#221d17', text2: '#4b4237', muted: '#6e6250', faint: '#76694f', rule: '#ddd2bf', accent: '#2b3a8c', accent2: '#9b3d26' },
	dark: { surface: '#1b1813', text: '#ece4d4', text2: '#cfc4b0', muted: '#a89a83', faint: '#9a8c75', rule: '#3a342b', accent: '#9fb0ff', accent2: '#e08a6f' },
};

const paper = (m: Mode): Palette => ({ ...INK[m], reading: INK[m].surface, bg: INK[m].surface, grain: true });

export const DEFAULT_THEME: ResolvedTheme = {
	light: paper('light'),
	dark: paper('dark'),
	fonts: { heading: 'Newsreader', body: 'Newsreader', ui: 'Inter', code: 'JetBrains Mono' },
	mode: 'toggle',
};

// Paper grain: fractal noise tinted dark on light paper, light on dark paper.
const grain = (r: number, g: number, b: number, alpha: number) =>
	`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 ${alpha} 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const GRAIN: Record<Mode, string> = { light: grain(0.13, 0.11, 0.09, 0.09), dark: grain(0.93, 0.9, 0.85, 0.05) };

const fail = (msg: string): never => {
	throw new ThemeError('theme.json' + msg);
};

const hex = (key: string, v: unknown): string =>
	typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v.toLowerCase() : fail(`: ${key} "${v}" must be a 6-digit hex color like #2b3a8c.`);

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isPerMode = (v: unknown) =>
	isObject(v) && Object.keys(v).length > 0 && Object.keys(v).every((k) => k === 'light' || k === 'dark');

/** Value for one mode, plus whether it came from a single value shared by both modes. */
function pick<T>(v: PerMode<T> | undefined, m: Mode) {
	if (v === undefined) return { value: undefined, single: false, key: '' };
	if (isPerMode(v)) return { value: (v as { light?: T; dark?: T })[m], single: false, key: '.' + m };
	return { value: v as T, single: true, key: '' };
}

const BAD_TYPE = ': background.type must be one of paper, color, gradient, image.';
const GRADIENT = /^(repeating-)?(linear|radial|conic)-gradient\(.+\)$/s;

function background(input: ThemeInput['background'], m: Mode, imageExists: (src: string) => boolean) {
	const { value: b, single, key } = pick(input, m);
	const base = INK[m].surface;
	if (b === undefined || (isObject(b) && b.type === 'paper' && b.color === undefined))
		return { surface: base, reading: base, bg: base, grain: true };
	if (!isObject(b)) return fail(BAD_TYPE);
	if (b.type === 'paper' || b.type === 'color') {
		const c = hex(`background${key}.color`, b.color);
		const surface = single && m === 'dark' ? darkSurfaceFrom(c) : c;
		return { surface, reading: surface, bg: surface, grain: b.type === 'paper' };
	}
	const reading = `color-mix(in srgb, ${base} 92%, transparent)`;
	if (b.type === 'gradient') {
		if (typeof b.value !== 'string' || !GRADIENT.test(b.value.trim()))
			fail(`: background${key}.value must be a CSS gradient like linear-gradient(135deg, #fde3d1, #e5defc).`);
		return { surface: base, reading, bg: b.value, grain: false };
	}
	if (b.type === 'image') {
		if (typeof b.src !== 'string' || !imageExists(b.src)) fail(`: background image ${b.src} not found in public/.`);
		return { surface: base, reading, bg: `url("${b.src}") center / cover fixed`, grain: false };
	}
	return fail(BAD_TYPE);
}

function accent(input: PerMode<string> | undefined, name: 'accent' | 'accent2', m: Mode, surface: string) {
	const { value, single, key } = pick(input, m);
	if (value === undefined) return INK[m][name];
	if (isObject(value)) {
		const bad = Object.keys(value).find((k) => k !== 'light' && k !== 'dark');
		fail(`: ${name} may only contain "light" and "dark", found "${bad}".`);
	}
	const c = hex(name + key, value);
	return single && m === 'dark' && contrast(c, surface) < 4.5 ? nearestPassing(c, surface) : c;
}

const KEYS = ['background', 'accent', 'accent2', 'fonts', 'mode'];
const FONT_KEYS = ['heading', 'body', 'ui', 'code'];

function fonts(input: unknown): Fonts {
	if (input === undefined) return DEFAULT_THEME.fonts;
	if (!isObject(input)) return fail(': fonts must be an object like { "heading": "Newsreader" }.');
	for (const [k, v] of Object.entries(input)) {
		if (!FONT_KEYS.includes(k)) fail(`: unknown key "fonts.${k}". Allowed: ${FONT_KEYS.join(', ')}.`);
		if (typeof v !== 'string' || !v.trim()) fail(`: fonts.${k} must be a font name like "Newsreader".`);
	}
	return { ...DEFAULT_THEME.fonts, ...(input as Partial<Fonts>) };
}

const ROLES = ['text', 'text2', 'muted', 'faint', 'accent', 'accent2'] as const;

function palette(input: ThemeInput, m: Mode, imageExists: (src: string) => boolean): Palette {
	const b = background(input.background, m, imageExists);
	const p: Palette = {
		...INK[m],
		...b,
		accent: accent(input.accent, 'accent', m, b.surface),
		accent2: accent(input.accent2, 'accent2', m, b.surface),
	};
	for (const role of ROLES) {
		const ratio = contrast(p[role], p.surface);
		if (ratio >= 4.5) continue;
		const isAccent = role === 'accent' || role === 'accent2';
		// A background hint has to work for every text color at once, or following it just moves the error.
		const hint = isAccent
			? `${role} ${nearestPassing(p[role], p.surface)}`
			: `background ${nearestPassing(p.surface, ROLES.map((r) => p[r]))}`;
		fail(` (${m} mode): ${role} ${p[role]} on background ${p.surface} is ${ratio.toFixed(2)}:1, needs 4.5:1. Try ${hint}.`);
	}
	return p;
}

export function resolveTheme(
	input: ThemeInput,
	opts: { imageExists?: (src: string) => boolean } = {},
): ResolvedTheme {
	const imageExists = opts.imageExists ?? ((src: string) => existsSync('public' + src));
	for (const k of Object.keys(input)) if (!KEYS.includes(k)) fail(`: unknown key "${k}". Allowed: ${KEYS.join(', ')}.`);
	if (input.mode !== undefined && !['light', 'dark', 'toggle'].includes(input.mode)) fail(': mode must be light, dark or toggle.');
	return {
		light: palette(input, 'light', imageExists),
		dark: palette(input, 'dark', imageExists),
		fonts: fonts(input.fonts),
		mode: input.mode ?? 'toggle',
	};
}

const stack = (name: string, fallback: string) => `'${name}', ${fallback}`;

export function themeCss(t: ResolvedTheme): string {
	const vars = (p: Palette, m: Mode) =>
		Object.entries({
			surface: p.surface, reading: p.reading, text: p.text, 'text-2': p.text2, muted: p.muted, faint: p.faint,
			rule: p.rule, accent: p.accent, 'accent-2': p.accent2, bg: p.bg, grain: p.grain ? GRAIN[m] : 'none',
		})
			.map(([k, v]) => `--ed-${k}:${v};`)
			.join('');
	const f = t.fonts;
	const fonts =
		`--ed-font-heading:${stack(f.heading, 'Georgia, serif')};--ed-font-body:${stack(f.body, 'Georgia, serif')};` +
		`--ed-font-ui:${stack(f.ui, 'system-ui, sans-serif')};--ed-font-code:${stack(f.code, 'ui-monospace, monospace')};`;
	return `:root,:root[data-theme='light']{${vars(t.light, 'light')}${fonts}}:root[data-theme='dark']{${vars(t.dark, 'dark')}}`;
}

// ponytail: Google rejects axis sets a static font lacks; the plain link is the fallback. Self-host fonts if this matters.
export function fontLinks(f: Fonts): string[] {
	return [...new Set([f.heading, f.body, f.ui, f.code])].flatMap((name) => {
		const family = name.replace(/ /g, '+');
		return [
			`https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,400;0,500;0,600;1,400&display=swap`,
			`https://fonts.googleapis.com/css2?family=${family}&display=swap`,
		];
	});
}

/** Inlined into the page as-is (see ThemeProvider.astro), so it must not reference anything outside itself. */
export function initialTheme(mode: 'light' | 'dark' | 'toggle', stored: string | null): 'light' | 'dark' {
	return mode === 'toggle' ? (stored === 'dark' ? 'dark' : 'light') : mode;
}
