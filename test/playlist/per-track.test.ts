/**
 * test/playlist/per-track.test.ts
 * -------------------------------
 *
 * The 2.0 per-track options (`duration`, `downloadUrl`, `downloadName`) and
 * `wp1:` peaks, rendered by this component and run through the REAL playlist
 * and player cores in jsdom: each track's values reach the player, and
 * switching tracks (which the playlist does with `loadTrack`, not a rebuild)
 * replaces them, so nothing carries over from the previous track.
 */
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import WaveformPlaylistRaw from '../../src/playlist/WaveformPlaylist.astro';
import type { WaveformPlaylistProps } from '../../src/playlist/types';
import { installDom } from '../player/dom';

const Component = WaveformPlaylistRaw as Parameters<AstroContainer['renderToString']>[0];

interface PlayerLike {
	options: Record<string, unknown>;
	waveformData: number[];
}
interface PlaylistLike {
	selectTrack(index: number): void;
	getPlayer(): PlayerLike | null;
	destroy(): void;
}
type PlaylistClass = new (el: HTMLElement) => PlaylistLike;

let container: AstroContainer;
let WaveformPlaylist: PlaylistClass;
const made: PlaylistLike[] = [];

beforeAll(async () => {
	container = await AstroContainer.create();
	const { WaveformPlayer } = await installDom();
	(window as unknown as Record<string, unknown>).WaveformPlayer = WaveformPlayer;
	// The playlist's ES module build reads window.WaveformPlayer when a
	// playlist is constructed. jsdom's readyState is already past 'loading',
	// so its import-time scan runs now and finds an empty body.
	WaveformPlaylist = (await import('@arraypress/waveform-playlist')).default as unknown as PlaylistClass;
});

afterEach(() => {
	for (const p of made.splice(0)) p.destroy();
	document.body.innerHTML = '';
});

async function mount(props: WaveformPlaylistProps): Promise<PlaylistLike> {
	document.body.innerHTML = await container.renderToString(Component, {
		props: props as unknown as Record<string, unknown>,
	});
	const el = document.querySelector<HTMLElement>('[data-waveform-playlist]');
	if (!el) throw new Error('no playlist container rendered');
	const playlist = new WaveformPlaylist(el);
	made.push(playlist);
	return playlist;
}

const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

describe('<WaveformPlaylist> per-track 2.0 options with the real cores', () => {
	it("passes each track's duration and download target to the player, and replaces them on a track change", async () => {
		const playlist = await mount({
			preload: 'none',
			showDownload: true,
			showVolume: true,
			tracks: [
				{ url: '/a.mp3', duration: 225, downloadUrl: '/dl/a.wav', downloadName: 'a.wav', waveform: 'wp1:M5lm' },
				{ url: '/b.mp3', duration: '1:02:03' },
			],
		});
		await frame();
		const player = playlist.getPlayer();
		expect(player).not.toBeNull();
		expect(player!.options.duration).toBe(225);
		expect(player!.options.downloadUrl).toBe('/dl/a.wav');
		expect(player!.options.downloadName).toBe('a.wav');
		expect(player!.options.showDownload).toBe(true);
		expect(player!.options.showVolume).toBe(true);
		expect(player!.waveformData.map((p) => Math.round(p * 255))).toEqual([51, 153, 102]);

		playlist.selectTrack(1);
		await frame();
		const after = playlist.getPlayer()!;
		expect(after.options.url).toBe('/b.mp3');
		expect(after.options.duration).toBe(3723);
		// Track 2 has no download target: the previous track's must not linger.
		expect(after.options.downloadUrl ?? null).toBeNull();
		expect(after.options.downloadName ?? null).toBeNull();
	});
});
