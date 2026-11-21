/**
 * test/player/peer-range.test.ts
 * ------------------------------
 *
 * Pins the core peer floor to the oldest core that parses every `data-*`
 * attribute this component emits. An older core ignores the attributes it
 * doesn't know, so an under-declared floor fails silently at the consumer's
 * site: the prop renders, the option never applies.
 */
import { describe, it, expect } from 'vitest';
import pkg from '../../package.json';
import { atLeast, floor, installedVersion, parse } from '../versions';

const CORE = '@arraypress/waveform-player';

describe('core peer range', () => {
	it('declares a floor that parses every data-* attribute the component emits', () => {
		// Newest attributes emitted, and the core release that added them:
		//   data-duration, data-lazy, data-loop, data-show-loop, data-loop-label,
		//   data-show-volume, data-volume, data-volume-label, data-mute-label,
		//   data-show-download, data-download-url, data-download-name,
		//   data-download-label, and wp1: peaks in data-waveform   2.0.0  ← the floor
		//   data-cross-origin                                      1.23.0
		// `lazy` in particular is no longer the wrapper's own: a 1.x core would
		// ignore data-lazy and load every "lazy" player at once.
		expect(atLeast(floor(pkg.peerDependencies[CORE]), [2, 0, 0]), 'peer floor below 2.0.0').toBe(true);
	});

	it('is a 2.x range (the 2.0 types and options do not exist in 1.x)', () => {
		expect(pkg.peerDependencies[CORE]).toBe('^2.0.0');
	});

	it('develops against the sibling checkout, at least as new as the peer floor', () => {
		expect(pkg.devDependencies[CORE]).toBe('file:../waveform-player');
		expect(atLeast(parse(installedVersion(CORE)), floor(pkg.peerDependencies[CORE]))).toBe(true);
	});
});
