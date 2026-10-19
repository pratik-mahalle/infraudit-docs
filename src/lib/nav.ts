// Reads Mintlify's docs.json so it stays the one navigation file for both sites.

export interface NavLink {
	name: string;
	url: string;
}

export interface DocsJson {
	name: string;
	navigation: { tabs: { tab: string; groups: { group: string; pages: string[] }[] }[] };
	anchors?: NavLink[];
	topbarLinks?: NavLink[];
	topbarCtaButton?: NavLink;
	footer?: {
		socials?: Record<string, string>;
		links?: { title: string; items: { label: string; href: string }[] }[];
	};
	metadata?: Record<string, string>;
}

export interface Link {
	label: string;
	href: string;
}

export interface Tab {
	label: string;
	short: string;
	href: string;
	groups: { label: string; pages: string[] }[];
}

export function tabs(docs: DocsJson): Tab[] {
	return docs.navigation.tabs.map((t) => ({
		label: t.tab,
		short: t.tab.split(' ')[0],
		href: '/' + t.groups[0].pages[0],
		groups: t.groups.map((g) => ({ label: g.group, pages: g.pages })),
	}));
}

export function pagePatterns(docs: DocsJson): string[] {
	return tabs(docs).flatMap((t) => t.groups.flatMap((g) => g.pages.map((p) => `${p}.{md,mdx}`)));
}

export function starlightSidebar(docs: DocsJson) {
	return tabs(docs).map((t) => ({
		label: t.label,
		items: t.groups.map((g) => ({ label: g.label, items: g.pages })),
	}));
}

export function chapterFor(docs: DocsJson, slug: string) {
	for (const tab of tabs(docs)) {
		let n = 0;
		for (const g of tab.groups) {
			for (const p of g.pages) {
				n++;
				if (p === slug) return { tab, group: g.label, number: String(n).padStart(2, '0') };
			}
		}
	}
	return undefined;
}

export function headerLinks(docs: DocsJson): { beside: Link[]; right: Link[]; cta?: Link } {
	const toLink = (l: NavLink): Link => ({ label: l.name, href: l.url });
	const anchors = docs.anchors ?? [];
	const beside = anchors.filter((a) => a.name === 'Changelog').map(toLink);
	const right: Link[] = [];
	for (const l of [...(docs.topbarLinks ?? []), ...anchors.filter((a) => a.name !== 'Changelog')]) {
		if (!right.some((r) => r.href === l.url)) right.push(toLink(l));
	}
	return { beside, right, cta: docs.topbarCtaButton && toLink(docs.topbarCtaButton) };
}
