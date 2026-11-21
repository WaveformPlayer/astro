/**
 * test/player/dom.ts
 * ------------------
 *
 * A jsdom document for running the REAL 2.0 player core against this
 * component's server-rendered markup, while the suite stays in vitest's
 * `node` environment (under the `jsdom` environment Vite resolves `.astro`
 * imports as client modules and the container API can't render them — the
 * same reason as `test/sounds/dom.ts`).
 *
 * jsdom has no IntersectionObserver, so {@link MockIO} stands in for the
 * browser's: `enter(el)` reports the element as within the core's 200px
 * margin.
 */
import { JSDOM } from 'jsdom';
import { vi } from 'vitest';

/** Constructors and objects, taken from the jsdom window as they are. */
const GLOBALS = [
	'document',
	'navigator',
	'HTMLElement',
	'HTMLMediaElement',
	'Element',
	'Node',
	'Event',
	'CustomEvent',
	'EventTarget',
	'AbortController',
	'AbortSignal',
	'MutationObserver',
	'Audio',
	'customElements',
	'location',
] as const;

/** Window functions, bound to the jsdom window (they throw unbound). */
const FUNCTIONS = ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame'] as const;

/** A recording IntersectionObserver; `enter()` plays the browser's part. */
export class MockIO {
	static instances: MockIO[] = [];
	observed = new Set<Element>();
	constructor(
		public callback: (entries: { target: Element; isIntersecting: boolean }[], io: MockIO) => void,
		public options?: unknown
	) {
		MockIO.instances.push(this);
	}
	observe(el: Element): void {
		this.observed.add(el);
	}
	unobserve(el: Element): void {
		this.observed.delete(el);
	}
	disconnect(): void {
		this.observed.clear();
	}
}

/** Report `el` as intersecting to every observer watching it. */
export function enter(el: Element): void {
	for (const io of MockIO.instances) {
		if (io.observed.has(el)) io.callback([{ target: el, isIntersecting: true }], io);
	}
}

/**
 * Put jsdom's globals in place, then import the core's `/no-autoinit` build
 * (the published ES module bundle, not `src/`), so the test drives what a
 * consumer's bundler ships.
 */
export async function installDom() {
	const dom = new JSDOM('<!doctype html><html><body></body></html>', {
		url: 'http://localhost/',
		pretendToBeVisual: true,
	});
	const win = dom.window as unknown as Record<string, unknown>;
	vi.stubGlobal('window', win);
	for (const key of GLOBALS) vi.stubGlobal(key, win[key]);
	for (const key of FUNCTIONS) vi.stubGlobal(key, (win[key] as (...a: unknown[]) => unknown).bind(win));
	MockIO.instances = [];
	vi.stubGlobal('IntersectionObserver', MockIO);
	win.IntersectionObserver = MockIO;
	const core = await import('@arraypress/waveform-player/no-autoinit');
	return { dom, WaveformPlayer: core.default };
}
