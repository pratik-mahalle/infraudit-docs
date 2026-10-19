import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const DIST = new URL('../dist/', import.meta.url).pathname;

/** HTML of a built page, e.g. page('/platform/drift-detection/'). */
export function page(path: string): string {
	return readFileSync(join(DIST, path.replace(/^\/|\/$/g, ''), 'index.html'), 'utf8');
}

/** Every .html file under dist, relative to dist. */
export function allHtml(): string[] {
	return readdirSync(DIST, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.html'));
}

/** Text of every <a> pointing at href, tags stripped. */
export function linkTexts(html: string, href: string): string[] {
	const re = new RegExp(`<a\\b[^>]*href="${href.replace(/[.?*+^$[\]\\(){}|]/g, '\\$&')}"[^>]*>([\\s\\S]*?)</a>`, 'g');
	return [...html.matchAll(re)].map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}
