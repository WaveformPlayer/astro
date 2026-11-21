/**
 * test/player/types.typecheck.ts
 * ------------------------------
 *
 * Type-level assertions, checked by `npm run typecheck` (not vitest).
 *
 * - The 13 options new in the 2.0 core are props with the core's own types.
 * - `lazy` is the core's option (one meaning), not a separate Astro prop.
 * - There are no callback props; the 2.0 events are the core's typed
 *   `waveformplayer:*` DOM events, and `window.WaveformPlayer` is the core's
 *   own declaration (this package no longer declares a conflicting one).
 */
import type {
	WaveformPlayerOptions,
	WaveformSeekEventDetail,
	WaveformRateChangeEventDetail,
	WaveformVolumeChangeEventDetail,
	WaveformLoopEventDetail,
	WaveformPlayer,
} from '@arraypress/waveform-player';
import type { WaveformPlayerProps } from '../../src/player/types';

type Equal<A, B> =
	(<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
const assert = <T extends true>(): T => true as T;

type NewOptions =
	| 'duration'
	| 'lazy'
	| 'loop'
	| 'showLoop'
	| 'loopLabel'
	| 'showVolume'
	| 'volume'
	| 'volumeLabel'
	| 'muteLabel'
	| 'showDownload'
	| 'downloadUrl'
	| 'downloadName'
	| 'downloadLabel';

assert<Equal<Pick<WaveformPlayerProps, NewOptions>, Pick<WaveformPlayerOptions, NewOptions>>>();
assert<Equal<WaveformPlayerProps['duration'], number | null | undefined>>();
assert<Equal<WaveformPlayerProps['lazy'], boolean | undefined>>();
// `waveform` takes compact `wp1:` strings (a string) as well as arrays.
assert<Equal<WaveformPlayerProps['waveform'], WaveformPlayerOptions['waveform']>>();

// No callback props, old or new.
type Callbacks = Extract<keyof WaveformPlayerProps, `on${string}`>;
assert<Equal<Callbacks, never>>();

// The events are typed on document by the core.
assert<Equal<DocumentEventMap['waveformplayer:seek'], CustomEvent<WaveformSeekEventDetail>>>();
assert<Equal<DocumentEventMap['waveformplayer:ratechange'], CustomEvent<WaveformRateChangeEventDetail>>>();
assert<Equal<DocumentEventMap['waveformplayer:volumechange'], CustomEvent<WaveformVolumeChangeEventDetail>>>();
assert<Equal<DocumentEventMap['waveformplayer:loop'], CustomEvent<WaveformLoopEventDetail>>>();
export const onSeek = (e: DocumentEventMap['waveformplayer:seek']): number => e.detail.currentTime;
export const onVolume = (e: DocumentEventMap['waveformplayer:volumechange']): boolean => e.detail.muted;

// window.WaveformPlayer is the core's class (src/player/globals.d.ts no longer
// redeclares it as an optional hand-written shape).
assert<Equal<Window['WaveformPlayer'], typeof WaveformPlayer>>();
