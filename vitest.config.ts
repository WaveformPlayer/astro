/**
 * vitest.config.ts
 * ----------------
 *
 * One config for all four components' tests (test/<name>/*.test.ts). The
 * components render through Astro's official `experimental_AstroContainer`
 * API, the supported way to test `.astro` files without a browser.
 *
 * `getViteConfig` from `astro/config` wires Vitest up with Astro's Vite
 * plugin so `.astro` imports resolve inside tests.
 *
 * @see https://docs.astro.build/en/guides/testing/#vitest
 */
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		include: ['test/**/*.test.ts'],
		environment: 'node',
		globals: false,
	},
});
