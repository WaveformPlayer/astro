/**
 * test/playlist/types.typecheck.ts
 * --------------------------------
 *
 * Type-level assertions, checked by `npm run typecheck` (not vitest).
 *
 * The playlist's layout options are the installed playlist core's own types
 * (2.0 declares every one; the 1.x `PlaylistOption` fallback for older cores
 * is gone). The 2.0 player options the playlist strips or takes per track
 * are not container props, and the track input takes the 2.0 per-track
 * fields.
 */
import type { WaveformPlaylistOptions } from '@arraypress/waveform-playlist';
import type { WaveformPlayerOptions } from '@arraypress/waveform-player';
import type { WaveformPlaylistProps, WaveformPlaylistTrackInput } from '../../src/playlist/types';

type Equal<A, B> =
	(<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
const assert = <T extends true>(): T => true as T;

assert<Equal<WaveformPlaylistProps['layout'], 'list' | 'minimal' | 'hero' | 'grid' | undefined>>();
assert<Equal<WaveformPlaylistProps['layout'], WaveformPlaylistOptions['layout']>>();
assert<Equal<WaveformPlaylistProps['showArtist'], boolean | undefined>>();
assert<Equal<WaveformPlaylistProps['coverSize'], number | undefined>>();
assert<Equal<WaveformPlaylistProps['thumbnailSize'], number | undefined>>();
assert<Equal<WaveformPlaylistProps['density'], 'comfortable' | 'compact' | undefined>>();
assert<Equal<WaveformPlaylistProps['coverPosition'], 'left' | 'top' | undefined>>();
assert<Equal<WaveformPlaylistProps['barPosition'], 'top' | 'bottom' | undefined>>();

// 2.0 player options the playlist passes on keep the player's types.
assert<Equal<WaveformPlaylistProps['showVolume'], WaveformPlayerOptions['showVolume']>>();
assert<Equal<WaveformPlaylistProps['volume'], WaveformPlayerOptions['volume']>>();
assert<Equal<WaveformPlaylistProps['showDownload'], WaveformPlayerOptions['showDownload']>>();
assert<Equal<WaveformPlaylistProps['volumeLabel'], string | undefined>>();
assert<Equal<WaveformPlaylistProps['muteLabel'], string | undefined>>();
assert<Equal<WaveformPlaylistProps['downloadLabel'], string | undefined>>();

// Stripped by the playlist, or per track: not container props.
type Removed = 'loop' | 'showLoop' | 'loopLabel' | 'duration' | 'downloadUrl' | 'downloadName' | 'onNextTrack' | 'onPreviousTrack';
assert<Equal<Extract<keyof WaveformPlaylistProps, Removed>, never>>();
// `lazy` is this component's own (defers the whole playlist), a plain boolean.
assert<Equal<WaveformPlaylistProps['lazy'], boolean | undefined>>();

// Track input: 2.0 per-track fields.
assert<Equal<WaveformPlaylistTrackInput['duration'], number | string | undefined>>();
assert<Equal<WaveformPlaylistTrackInput['downloadUrl'], string | undefined>>();
assert<Equal<WaveformPlaylistTrackInput['downloadName'], string | undefined>>();
assert<Equal<WaveformPlaylistTrackInput['waveform'], number[] | string | undefined>>();
