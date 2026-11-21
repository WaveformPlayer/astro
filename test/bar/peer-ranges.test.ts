/**
 * test/bar/peer-ranges.test.ts
 * ----------------------------
 *
 * The peer floors must cover everything the wrapper types and relies on:
 *
 *   - `@arraypress/waveform-bar` ^2.0.0 — the bar this package is tested
 *     against; 2.0 is what passes a trigger's `duration` and `wp1:` peaks on
 *     to the player (documented on `WaveformBarTrackData`).
 *   - `@arraypress/waveform-player` ^2.0.0 — waveform-bar 2.0's own peer.
 *
 * Dev dependencies are the sibling 2.0 checkouts (`file:../waveform-*`); the
 * installed versions are held to the same floors.
 */
import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';
import { atLeast, floor, installedVersion, parse } from '../versions';

const MIN_FLOORS: Record<string, number[]> = {
	'@arraypress/waveform-bar': [2, 0, 0],
	'@arraypress/waveform-player': [2, 0, 0],
};

const peers: Record<string, string> = pkg.peerDependencies;
const devs: Record<string, string> = pkg.devDependencies;

describe('package.json — peer floors cover what the wrapper relies on', () => {
	for (const [name, min] of Object.entries(MIN_FLOORS)) {
		it(`peerDependencies["${name}"] is at least ^${min.join('.')}`, () => {
			const range = peers[name];
			expect(range, `${name} must be a peer`).toBeDefined();
			expect(atLeast(floor(range), min), `${name}@${range} < ${min.join('.')}`).toBe(true);
		});

		it(`"${name}" is an optional peer`, () => {
			expect(pkg.peerDependenciesMeta[name as keyof typeof pkg.peerDependenciesMeta]?.optional).toBe(true);
		});

		it(`the installed devDependency "${name}" is the sibling checkout, at least ^${min.join('.')}`, () => {
			expect(devs[name]).toBe(`file:../${name.split('/')[1]}`);
			expect(atLeast(parse(installedVersion(name)), min)).toBe(true);
		});
	}
});
