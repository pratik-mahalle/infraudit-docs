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

export function extractMarginNotes(body: string): string[] {
	return [...body.matchAll(/^:::margin[ \t]*\n([\s\S]*?)\n:::[ \t]*$/gm)].map((m) => m[1].trim());
}
