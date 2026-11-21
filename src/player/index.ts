/**
 * @module @arraypress/waveform-astro/player
 * @description
 * Public entry point for the Astro wrapper around
 * `@arraypress/waveform-player`.
 *
 * ## Importing the component
 *
 * ```astro
 * ---
 * import WaveformPlayer from '@arraypress/waveform-astro/player';
 * // or, if you prefer the explicit path:
 * import WaveformPlayer from '@arraypress/waveform-astro/player/WaveformPlayer.astro';
 * ---
 * <WaveformPlayer url="/audio/track.mp3" />
 * ```
 *
 * ## Importing the types
 *
 * ```ts
 * import type {
 *   WaveformPlayerProps,
 *   WaveformStyle,
 *   WaveformMarker,
 * } from '@arraypress/waveform-astro/player';
 * ```
 *
 * @see {@link ./WaveformPlayer.astro} for the component implementation
 * @see {@link ./types.ts}              for the full prop interface
 */

import WaveformPlayer from './WaveformPlayer.astro';

export { WaveformPlayer };
export default WaveformPlayer;

export type {
	WaveformPlayerProps,
	WaveformStyle,
	WaveformMarker,
	WaveformPeaks,
	ColorPreset,
	AudioMode,
	AudioPreload,
	AudioCrossOrigin,
	ButtonAlign,
	WaveformPlayerEventMap,
	WaveformLifecycleEventDetail,
	WaveformEndedEventDetail,
	WaveformTimeUpdateEventDetail,
	WaveformErrorEventDetail,
	WaveformSeekEventDetail,
	WaveformRateChangeEventDetail,
	WaveformVolumeChangeEventDetail,
	WaveformLoopEventDetail,
} from './types';
