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
			customCss: ['./src/styles/editorial.css'],
			components: {
				Head: './src/components/Head.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
				Header: './src/components/Header.astro',
				Sidebar: './src/components/Sidebar.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			// Code reads as dark ink in both modes, like the mockup.
			expressiveCode: {
				themes: ['github-dark'],
				shiki: { langAlias: { env: 'dotenv' } },
				styleOverrides: {
					borderRadius: '4px',
					codeBackground: '#221d17',
					codeForeground: '#e9e3d8',
					codeFontFamily: 'var(--ed-font-code)',
					uiFontFamily: 'var(--ed-font-ui)',
					frames: { editorBackground: '#221d17', terminalBackground: '#221d17' },
				},
			},
		}),
	],
});
