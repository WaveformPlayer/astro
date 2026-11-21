/**
 * @module @arraypress/waveform-astro/sounds
 * @description
 * Public entry point for the Astro wrapper around
 * `@arraypress/waveform-sounds`.
 *
 * ```astro
 * ---
 * import WaveformSounds from '@arraypress/waveform-astro/sounds';
 * // or: import WaveformSounds from '@arraypress/waveform-astro/sounds/WaveformSounds.astro';
 * ---
 * <WaveformSounds manifest="/sounds.json" />
 * ```
 *
 * ```ts
 * import type { WaveformSoundsProps, SoundInput } from '@arraypress/waveform-astro/sounds';
 * ```
 *
 * @see {@link ./WaveformSounds.astro} for the component implementation
 * @see {@link ./types.ts}             for the prop interface
 */

import WaveformSounds from './WaveformSounds.astro';

export { WaveformSounds };
export default WaveformSounds;

export type {
	WaveformSoundsProps,
	NotForwardedOption,
	WaveformSoundsOptions,
	WaveformSoundsStrings,
	WaveformSoundsEventMap,
	SoundInput,
	Sound,
	SoundsManifest,
	SoundsFilter,
	SoundsSort,
	SoundsLayout,
	SoundsFilterControl,
	SoundsLoopFilter,
	SoundsColumn,
} from './types';
