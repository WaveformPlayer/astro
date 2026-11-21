/**
 * @module @arraypress/waveform-astro/playlist
 * @description
 * Public entry point for the Astro wrapper around
 * `@arraypress/waveform-playlist`.
 *
 * ## Importing the component
 *
 * ```astro
 * ---
 * import WaveformPlaylist from '@arraypress/waveform-astro/playlist';
 * // or, if you prefer the explicit path:
 * import WaveformPlaylist from '@arraypress/waveform-astro/playlist/WaveformPlaylist.astro';
 * ---
 * <WaveformPlaylist
 *   tracks={[{ url: '/audio/track.mp3', title: 'My Track' }]}
 * />
 * ```
 *
 * ## Importing the types
 *
 * ```ts
 * import type {
 *   WaveformPlaylistProps,
 *   WaveformPlaylistTrackInput,
 *   WaveformPlaylistOptions,
 *   WaveformStyle,
 * } from '@arraypress/waveform-astro/playlist';
 * ```
 *
 * @see {@link ./WaveformPlaylist.astro} for the component implementation
 * @see {@link ./types.ts}                for the full prop interface
 */

import WaveformPlaylist from './WaveformPlaylist.astro';

export { WaveformPlaylist };
export default WaveformPlaylist;

export type {
	WaveformPlaylistProps,
	WaveformPlaylistLayoutProps,
	WaveformPlaylistTrackInput,
	WaveformPlaylistOptions,
	WaveformPlaylistTrack,
	WaveformPlaylistChapter,
	WaveformPlaylistMarker,
	WaveformStyle,
	WaveformMarker,
	WaveformPeaks,
	ColorPreset,
	AudioMode,
	AudioPreload,
	ButtonAlign,
} from './types';
