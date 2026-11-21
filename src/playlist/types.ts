/**
 * @module types
 * @description
 * Public TypeScript types for `@arraypress/waveform-playlist-astro`.
 *
 * The shared option surfaces are owned by the two core libraries, whose
 * type declarations are generated from their TypeScript source (2.0):
 *
 *  - `@arraypress/waveform-playlist` owns the playlist-specific options
 *    ({@link WaveformPlaylistOptions}) and the parsed track / chapter /
 *    marker shapes.
 *  - `@arraypress/waveform-player` owns the player option surface
 *    ({@link WaveformPlayerOptions}) the playlist forwards to its embedded
 *    player.
 *
 * This wrapper re-exports those shared types verbatim (so consumers can
 * keep importing them from this package) and derives its component prop
 * interface from BOTH cores rather than re-declaring any option. That
 * keeps the three packages from drifting: any option a core adds (or
 * renames) flows through here automatically, and there is a single source
 * of truth.
 *
 * The prop names match the library option names 1:1 (camelCase) — the
 * Astro component handles the conversion to the libraries' `data-*`
 * attribute contract (kebab-case) under the hood.
 *
 * Options are intentionally all optional; only `tracks` is required (the
 * wrapper exists to render a playlist, which needs tracks). When an option
 * is omitted, the wrapper emits no corresponding `data-*` attribute,
 * letting the core libraries apply their own internal defaults.
 *
 * @see {@link https://github.com/WaveformPlayer/waveform-playlist} — playlist core
 * @see {@link https://github.com/WaveformPlayer/waveform-player}   — player core
 */

import type { WaveformPlayerOptions } from '@arraypress/waveform-player';
import type { WaveformPlaylistOptions } from '@arraypress/waveform-playlist';

/**
 * Shared player option types, re-exported from the player core so consumers
 * can continue to import them from this sub-path. The core's generated
 * declarations are the single source of truth for their shape.
 */
export type {
	WaveformStyle,
	ColorPreset,
	AudioMode,
	AudioPreload,
	ButtonAlign,
	WaveformMarker,
	WaveformPeaks,
} from '@arraypress/waveform-player';

/**
 * Shared playlist types, re-exported from the playlist core. The parsed
 * shapes ({@link WaveformPlaylistTrack} / {@link WaveformPlaylistChapter} /
 * {@link WaveformPlaylistMarker}) describe what the library produces at
 * runtime; {@link WaveformPlaylistTrackInput} below is the (looser) shape
 * this component accepts as input.
 */
export type {
	WaveformPlaylistOptions,
	WaveformPlaylistTrack,
	WaveformPlaylistChapter,
	WaveformPlaylistMarker,
} from '@arraypress/waveform-playlist';

/**
 * The playlist's layout options — `layout` and the hero / grid / density
 * options that ship with it. Typed from the playlist core; `layout`
 * overrides the player's own `layout` (both read `data-layout`).
 */
export interface WaveformPlaylistLayoutProps {
	/**
	 * Playlist layout. `'list'` shows the full track list; `'minimal'` a
	 * compact button switcher; `'hero'` a now-playing unit (cover +
	 * waveform) over a track queue; `'grid'` a cover-art grid with a
	 * now-playing bar.
	 * @default 'list'
	 */
	layout?: WaveformPlaylistOptions['layout'];
	/**
	 * Show the now-playing / per-row artist. Turn off for single-artist
	 * albums where it would only repeat.
	 * @default true
	 */
	showArtist?: WaveformPlaylistOptions['showArtist'];
	/**
	 * Hero cover size in px. Defaults to the waveform height plus the time
	 * row, so the cover sits flush with the waveform column.
	 */
	coverSize?: WaveformPlaylistOptions['coverSize'];
	/** Hero queue thumbnail / grid cover size in px. Defaults to the CSS value. */
	thumbnailSize?: WaveformPlaylistOptions['thumbnailSize'];
	/** Row density for every layout. @default 'comfortable' */
	density?: WaveformPlaylistOptions['density'];
	/** Hero / grid cover position relative to the waveform. @default 'left' */
	coverPosition?: WaveformPlaylistOptions['coverPosition'];
	/** Grid layout: now-playing bar above or below the covers. @default 'bottom' */
	barPosition?: WaveformPlaylistOptions['barPosition'];
}

/**
 * The remaining playlist-specific options, picked off the playlist core's
 * {@link WaveformPlaylistOptions}. Picking the named keys deliberately
 * strips the core interface's `[option: string]: unknown` pass-through
 * index signature, so {@link WaveformPlaylistProps} stays strict (a typo'd
 * prop is a type error) while still tracking the core option types.
 */
type PlaylistContainerOptions = WaveformPlaylistLayoutProps &
	Pick<
		WaveformPlaylistOptions,
		| 'continuous'
		| 'expandChapters'
		| 'showDuration'
		| 'showChapterMarkers'
		| 'chapterMarkerColor'
		| 'showPlayState'
	>;

/**
 * The WaveformPlayer options the playlist forwards to its embedded player,
 * inherited from the player core's {@link WaveformPlayerOptions}. Several
 * groups are removed:
 *
 *  - Per-track content (`url`, `src`, `title`, `artist`, `artwork`,
 *    `album`, `markers`, `waveform`, and 2.0's `duration`, `downloadUrl`,
 *    `downloadName`) — these belong on each entry of the
 *    {@link WaveformPlaylistProps.tracks} array, not the container. The
 *    playlist strips any container-level copy.
 *  - What the playlist never passes to its player: `audioMode` (it always
 *    drives a self-mode player), `loop` (a looping track never fires
 *    `ended`, which breaks `continuous`), `showLoop` (its button turns that
 *    loop on), `loopLabel` (names that button, which never exists) and the
 *    player's `lazy` (the playlist loads its player itself). This
 *    component's own `lazy` prop, declared below, is something else: it
 *    defers building the whole playlist.
 *  - `layout` — the player's `layout` (`'default' | 'preview'`) collides
 *    with the playlist's own `layout` (`'list' | 'minimal' | 'hero' |
 *    'grid'`) on the same
 *    `data-layout` attribute; the playlist's wins, so the player's is
 *    removed here.
 *  - `style` — in an Astro component `style` is the HTML inline-style
 *    attribute; the visual style is selected via `waveformStyle`.
 *  - every `on*` callback (including the Media Session `onNextTrack` /
 *    `onPreviousTrack`) — a server-rendered Astro component emits static
 *    HTML with nothing to attach a runtime callback to. Consumers listen for
 *    the bubbling `waveformplayer:*` DOM events instead.
 */
type ForwardedPlayerOptions = Omit<
	WaveformPlayerOptions,
	| 'url'
	| 'src'
	| 'title'
	| 'artist'
	| 'artwork'
	| 'album'
	| 'markers'
	| 'waveform'
	| 'duration'
	| 'downloadUrl'
	| 'downloadName'
	| 'audioMode'
	| 'loop'
	| 'showLoop'
	| 'loopLabel'
	| 'lazy'
	| 'layout'
	| 'style'
	| 'onLoad'
	| 'onPlay'
	| 'onPause'
	| 'onEnd'
	| 'onError'
	| 'onTimeUpdate'
	| 'onNextTrack'
	| 'onPreviousTrack'
>;

/**
 * A single track as accepted by the `<WaveformPlaylist>` component.
 *
 * This is the *input* shape (everything optional) — distinct from the
 * playlist core's parsed {@link WaveformPlaylistTrack}, which is what the
 * library produces at runtime (with resolved `title`, numeric chapter
 * `time`s, the backing DOM element, etc.).
 */
export interface WaveformPlaylistTrackInput {
	/**
	 * Audio file URL. Effectively required per track — without it the
	 * library has nothing to play — but kept optional so partially-built
	 * track objects type-check while you wire up data.
	 */
	url?: string;
	/** Track title (defaults to a prettified filename when omitted). */
	title?: string;
	/** Artist / description. */
	artist?: string;
	/** Artwork image URL. */
	artwork?: string;
	/** Album name (forwarded to the Media Session API). */
	album?: string;
	/**
	 * The track's length: seconds (`225`, or `'225'`) or a clock string
	 * (`'3:45'`, `'1:02:03'`). Rendered as the track's `data-duration`, which
	 * the playlist both displays (bare seconds formatted as a clock) and, from
	 * 2.0, passes to the player as its `duration` — so the time readout,
	 * markers and seeks have a length before the audio's metadata loads (with
	 * `preload: 'none'`, not until playback starts).
	 */
	duration?: number | string;
	/**
	 * Where this track's download link points (`data-download-url`), shown
	 * when the playlist has `showDownload`. Defaults to the track's `url`.
	 */
	downloadUrl?: string;
	/**
	 * Suggested file name for this track's download (`data-download-name`).
	 * Defaults to the url's file name.
	 */
	downloadName?: string;
	/**
	 * Explicit waveform markers for this track (separate from chapters).
	 * Serialised to the track's `data-markers` JSON attribute.
	 */
	markers?: { time: number; label?: string; color?: string }[];
	/**
	 * Pre-computed peaks, so the player skips decoding this track's audio.
	 * An array is JSON-encoded into the track's `data-waveform`; a string —
	 * a `.json` peaks URL, or compact `wp1:` peaks (2.0) — is emitted
	 * verbatim for the player to resolve.
	 */
	waveform?: number[] | string;
	/**
	 * Chapters for this track. Each becomes a `[data-chapter]` child; the
	 * `time` is in seconds and the `label` is the chapter's visible text.
	 */
	chapters?: { time: number; label: string; color?: string }[];
}

/**
 * Props accepted by the `<WaveformPlaylist>` Astro component.
 *
 * Composes the playlist core's own options ({@link PlaylistContainerOptions})
 * with the forwarded player options ({@link ForwardedPlayerOptions}), then
 * adds the required `tracks` array and the Astro-specific extras. Because
 * the option surface is inherited from the two cores rather than
 * hand-copied, anything they add in future is exposed here without a manual
 * edit.
 */
export interface WaveformPlaylistProps
	extends PlaylistContainerOptions,
		ForwardedPlayerOptions {
	// ─────────────────────────────────────────────────────────────────────
	// Tracks (required)
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * The tracks to render. Each becomes a `[data-track]` child of the
	 * playlist container, with its chapters as nested `[data-chapter]`
	 * elements. At least one track is expected.
	 */
	tracks: WaveformPlaylistTrackInput[];

	// ─────────────────────────────────────────────────────────────────────
	// Astro-specific extras
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Defer initialisation until the playlist scrolls into view.
	 *
	 * Not the player's 2.0 `lazy` option (the playlist never passes that to
	 * its player): this defers building the whole playlist. When `true`, the
	 * component emits `data-waveform-playlist-lazy` and
	 * the bundled `IntersectionObserver` script promotes it to
	 * `data-waveform-playlist` once it crosses the viewport (with 200 px of
	 * buffer so the UI is built and the first track decoded ahead of time).
	 *
	 * @default false
	 */
	lazy?: boolean;

	/**
	 * DOM id forwarded to the playlist container. Useful for targeting the
	 * playlist from external scripts.
	 */
	id?: string;

	/**
	 * Extra class names appended to the container's `class` attribute.
	 *
	 * The base class `wfpl-host` is always applied so the package's CSS
	 * (or your own overrides) can target the wrapper. The library also adds
	 * its own `waveform-playlist` class on mount.
	 */
	class?: string;

	/**
	 * Inline style passed through to the container. Useful for setting
	 * `min-height` to reserve layout space before the playlist renders.
	 */
	style?: string;
}
