// WCAG contrast and HSL lightness nudging for #rrggbb colors.

type Rgb = [number, number, number];

const toRgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as Rgb;
const toHex = (rgb: Rgb) => '#' + rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');

function luminance(hex: string): number {
	const [r, g, b] = toRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

function toHsl([r, g, b]: Rgb): Rgb {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	const d = max - min;
	if (d === 0) return [0, 0, l];
	const s = d / (1 - Math.abs(2 * l - 1));
	const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
	return [(h * 60 + 360) % 360, s, l];
}

function fromHsl([h, s, l]: Rgb): Rgb {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
	return [r + m, g + m, b + m];
}

/** Moves `change` lighter or darker (whichever pulls away from `against`) until it reaches `min`. */
export function nearestPassing(change: string, against: string, min = 4.5): string {
	const [h, s, l] = toHsl(toRgb(change));
	const step = luminance(change) >= luminance(against) ? 0.01 : -0.01;
	for (let x = l; x >= 0 && x <= 1; x += step) {
		const hex = toHex(fromHsl([h, s, x]));
		if (contrast(hex, against) >= min) return hex;
	}
	return step > 0 ? '#ffffff' : '#000000';
}

export function darkSurfaceFrom(hex: string): string {
	const [h, s] = toHsl(toRgb(hex));
	return toHex(fromHsl([h, Math.min(s, 0.25), 0.09]));
}
