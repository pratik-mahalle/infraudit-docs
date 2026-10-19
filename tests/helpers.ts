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

/** The slice of html from the first `start` up to the next `end` after it ('' if start is missing). */
export function between(html: string, start: string, end: string): string {
	const i = html.indexOf(start);
	return i < 0 ? '' : html.slice(i, html.indexOf(end, i));
}

/** Text of every <a> pointing at href, tags stripped. */
export function linkTexts(html: string, href: string): string[] {
	const re = new RegExp(`<a\\b[^>]*href="${href.replace(/[.?*+^$[\]\\(){}|]/g, '\\$&')}"[^>]*>([\\s\\S]*?)</a>`, 'g');
	return [...html.matchAll(re)].map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}
