import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import docs from './docs.json' with { type: 'json' };
import { tabs, starlightSidebar } from './src/lib/nav.ts';
import { REPO_URL } from './src/lib/site.ts';

const head = Object.entries(docs.metadata ?? {}).map(([key, content]) => ({
	tag: 'meta',
	attrs: key.startsWith('og:') ? { property: key, content } : { name: key, content },
}));

export default defineConfig({
	site: 'https://docs.infraudit.com',
	redirects: { '/': tabs(docs)[0].href },
	integrations: [
		starlight({
			title: docs.name,
			favicon: '/favicon.svg',
			editLink: { baseUrl: REPO_URL + '/edit/main/' },
			sidebar: starlightSidebar(docs),
			head,
		}),
	],
});
