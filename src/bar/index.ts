/**
 * @module @arraypress/waveform-astro/bar
 * @description
 * Public entry point for the Astro wrappers around
 * `@arraypress/waveform-bar`.
 *
 * Two components are exported:
 *
 *   - `WaveformBar`         — singleton init mount, render once
 *                             in your root layout
 *   - `WaveformBarTrigger`  — polymorphic play / queue trigger,
 *                             render anywhere you want a clickable
 *                             "play this track" element
 *
 * ## Importing the components
 *
 * ```astro
 * ---
 * import { WaveformBar, WaveformBarTrigger } from '@arraypress/waveform-astro/bar';
 * // or the explicit subpath form:
 * import WaveformBar from '@arraypress/waveform-astro/bar/WaveformBar.astro';
 * ---
 * ```
 *
 * ## Importing the types
 *
 * ```ts
 * import type {
 *   WaveformBarProps,
 *   WaveformBarConfig,
 *   WaveformBarTriggerProps,
 *   WaveformBarTrackData,
 *   WaveformBarMarker,
 *   WaveformBarActions,
 *   WaveformBarAction,
 *   WaveformBarTheme,
 *   RepeatMode,
 *   TriggerMode,
 *   WaveformStyle,
 * } from '@arraypress/waveform-astro/bar';
 * ```
 */

import WaveformBar from './WaveformBar.astro';
import WaveformBarTrigger from './WaveformBarTrigger.astro';

export { WaveformBar, WaveformBarTrigger };
export default WaveformBar;

export type {
	WaveformBarProps,
	WaveformBarConfig,
	WaveformBarTriggerProps,
	WaveformBarTrackData,
	WaveformBarMarker,
	WaveformBarActions,
	WaveformBarAction,
	WaveformBarTheme,
	RepeatMode,
	TriggerMode,
	WaveformStyle,
} from './types';
