import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import docs from '../docs.json' with { type: 'json' };
import { pagePatterns } from './lib/nav.ts';

const schema = docsSchema({ extend: z.object({ icon: z.string().optional(), sidebarTitle: z.string().optional() }) });

export const collections = {
	// Pages stay where Mintlify expects them; only the ones listed in docs.json are published.
	docs: defineCollection({
		loader: glob({ base: '.', pattern: pagePatterns(docs) }),
		schema: (ctx) =>
			schema(ctx).transform((d) => (d.sidebarTitle ? { ...d, sidebar: { ...d.sidebar, label: d.sidebarTitle } } : d)),
	}),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
