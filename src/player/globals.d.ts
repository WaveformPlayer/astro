/**
 * @module globals
 * @description
 * Ambient declarations for the internal `window` flags `<WaveformPlayer>`'s
 * inline scripts set.
 *
 * `window.WaveformPlayer` itself is NOT declared here: since 2.0,
 * `@arraypress/waveform-player` generates its own declarations, including
 * `declare global { interface Window { WaveformPlayer: typeof WaveformPlayer } }`
 * and the `waveformplayer:*` events on `HTMLElementEventMap` /
 * `DocumentEventMap`. The 1.x hand-written `WaveformPlayer?:` here conflicted
 * with it (TS2687 / TS2717, hidden only by `skipLibCheck`). The type-only
 * import below pulls the core's declarations in, so
 *
 * ```ts
 * window.WaveformPlayer.init();
 * document.addEventListener('waveformplayer:seek', (e) => e.detail.currentTime);
 * ```
 *
 * is typed by the core itself.
 */

import type {} from '@arraypress/waveform-player';

declare global {
	interface Window {
		/**
		 * Internal — set by `<WaveformPlayer>`'s inline script to
		 * deduplicate the `astro:page-load` re-init listener
		 * that re-runs `WaveformPlayer.init()` after View Transitions
		 * navigations. Do not rely on this; it is an implementation
		 * detail.
		 *
		 * @internal
		 */
		__wfpInitBound?: boolean;

		/**
		 * Internal — set by `<WaveformPlayer>`'s inline teardown script to
		 * deduplicate the `astro:before-swap` listener that destroys
		 * outgoing players on View Transitions navigations. Do not rely on
		 * this; it is an implementation detail.
		 *
		 * @internal
		 */
		__wfpSwapBound?: boolean;
	}
}

export {};
