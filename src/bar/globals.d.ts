/**
 * @module globals
 * @description
 * Ambient declarations for the internal `window` flags `<WaveformBar>`'s
 * inline script sets.
 *
 * `window.WaveformBar` itself is NOT declared here: since 2.0,
 * `@arraypress/waveform-bar` generates its own declarations, including
 * `declare global { interface Window { WaveformBar: WaveformBar } }` and the
 * `waveformbar:*` events on `DocumentEventMap`. A second, hand-written
 * `WaveformBar?:` here would conflict with it (TS2687 / TS2717) wherever both
 * are loaded. The type-only import below pulls the bar's declarations in, so
 *
 * ```ts
 * window.WaveformBar.play({ url: '/audio/track.mp3', title: 'My Track' });
 * ```
 *
 * is typed by the bar itself.
 */

import type {} from '@arraypress/waveform-bar';

declare global {
	interface Window {
		/**
		 * Internal — set by `<WaveformBar>`'s inline script to
		 * deduplicate the page-load init binding. Do not rely on this;
		 * it is an implementation detail.
		 *
		 * @internal
		 */
		__wbAstroInitBound?: boolean;

		/**
		 * Internal — set by `<WaveformBar>`'s inline script once the bar
		 * has been initialised, making `init(config)` idempotent across
		 * `astro:page-load` events (waveform-bar's `init()` destroys +
		 * rebuilds, which would restart the playing audio). Do not rely
		 * on this; it is an implementation detail.
		 *
		 * @internal
		 */
		__apWaveformBarInited?: boolean;
	}
}

export {};
