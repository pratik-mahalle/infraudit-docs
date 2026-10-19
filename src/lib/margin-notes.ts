// `:::margin` … `:::` blocks: rendered inline as <aside class="margin-note">, and repeated in the
// right column by TableOfContents.astro. CSS shows one copy or the other depending on width.

interface DirectiveNode {
	type: string;
	name?: string;
	children?: unknown[];
}

/** Sätteri mdast plugin; Starlight's directive restoration skips nodes that carry `data`. */
export const marginNotesPlugin = {
	name: 'margin-notes',
	containerDirective(node: DirectiveNode) {
		if (node.name !== 'margin') return undefined;
		return { type: 'paragraph', data: { hName: 'aside', hProperties: { className: ['margin-note'] } }, children: node.children };
	},
};

/** The rendered <aside class="margin-note"> blocks of a page, so the margin copy keeps links and code. */
export function extractMarginNotes(html: string): string[] {
	return [...html.matchAll(/<aside class="margin-note">[\s\S]*?<\/aside>/g)].map((m) => m[0]);
}
