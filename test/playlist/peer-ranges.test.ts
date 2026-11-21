/**
 * test/playlist/peer-ranges.test.ts
 * ---------------------------------
 *
 * The peer floors are load-bearing, not cosmetic. This wrapper emits
 * attributes only `@arraypress/waveform-playlist@2.0.0` reads: a track's
 * `data-download-url` / `data-download-name`, a track `data-duration` that
 * also reaches the player as seconds, and `wp1:` peaks; and the container's
 * 2.0 player options (`data-show-volume`, …). 2.0 in turn needs
 * `@arraypress/waveform-player@2.0.0`.
 */
import { describe, it, expect } from 'vitest';
import pkg from '../../package.json';
import { atLeast, floor, installedVersion, isPublished2x, parse } from '../versions';

const peers: Record<string, string> = pkg.peerDependencies;
const devs: Record<string, string> = pkg.devDependencies;

describe('peer dependency floors', () => {
	it('requires waveform-playlist >= 2.0.0 (the release that reads what this wrapper emits)', () => {
		expect(atLeast(floor(peers['@arraypress/waveform-playlist']), [2, 0, 0])).toBe(true);
	});

	it("requires waveform-player >= 2.0.0 (the playlist core's own floor)", () => {
		expect(atLeast(floor(peers['@arraypress/waveform-player']), [2, 0, 0])).toBe(true);
	});

	it('develops against the published 2.0 packages (a ^2.x devDependency at least the peer floor)', () => {
		for (const name of ['@arraypress/waveform-playlist', '@arraypress/waveform-player']) {
			expect(isPublished2x(devs[name], floor(peers[name])), `${name}@${devs[name]}`).toBe(true);
			expect(atLeast(parse(installedVersion(name)), floor(peers[name])), name).toBe(true);
		}
	});
});
