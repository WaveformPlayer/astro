/**
 * test/sounds/peer-ranges.test.ts
 * -------------------------------
 *
 * The peer floors are load-bearing. This wrapper imports
 * `@arraypress/waveform-sounds/render` (server) and `/no-autoinit` (client)
 * and emits the JSON `data-strings` / `data-player-options` attributes —
 * all first shipped in waveform-sounds 0.1.0. It is now tested against
 * waveform-sounds 2.0 (the release that lines the list up with the 2.0
 * player, whose types moved to `types/types.d.ts`), which needs
 * `@arraypress/waveform-player@2.0.0`.
 */
import { describe, it, expect } from 'vitest';
import pkg from '../../package.json';
import { atLeast, floor, installedVersion, isPublished2x, parse } from '../versions';

const peers: Record<string, string> = pkg.peerDependencies;
const devs: Record<string, string> = pkg.devDependencies;

describe('peer dependency floors', () => {
	it('requires waveform-sounds >= 2.0.0', () => {
		expect(atLeast(floor(peers['@arraypress/waveform-sounds']), [2, 0, 0])).toBe(true);
	});

	it("requires waveform-player >= 2.0.0 (the sounds core's own floor)", () => {
		expect(atLeast(floor(peers['@arraypress/waveform-player']), [2, 0, 0])).toBe(true);
	});

	it('develops against the published 2.0 packages (a ^2.x devDependency at least the peer floor)', () => {
		for (const name of ['@arraypress/waveform-sounds', '@arraypress/waveform-player']) {
			expect(isPublished2x(devs[name], floor(peers[name])), `${name}@${devs[name]}`).toBe(true);
			expect(atLeast(parse(installedVersion(name)), floor(peers[name])), name).toBe(true);
		}
	});

	it('supports the current Astro only (7.4+; Astro 6 was dropped in 2.0)', () => {
		expect(pkg.peerDependencies.astro).toBe('^7.4.0');
	});

	it('develops against an Astro the peer range admits', () => {
		expect(atLeast(parse(installedVersion('astro')), floor(peers.astro))).toBe(true);
		expect(atLeast(floor(pkg.devDependencies.astro), [7, 4, 0])).toBe(true);
	});
});
