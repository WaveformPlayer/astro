/**
 * test/player/lazy.test.ts
 * ------------------------
 *
 * `<WaveformPlayer lazy>` against the REAL 2.0 core (its published
 * `/no-autoinit` ES module bundle) in jsdom.
 *
 * In 1.x the Astro `lazy` prop was the wrapper's own mount deferral. In 2.0
 * it is the core's `lazy` option (`data-lazy`), so a page written for 1.x —
 * `<WaveformPlayer url=… lazy />` — must still render a player that loads
 * nothing until it nears the viewport. This suite renders the component,
 * puts the markup in a document, runs the core's own `init()` scan (what the
 * script-tag build does on DOMContentLoaded and the component's inline
 * script does on `astro:page-load`) and checks exactly that.
 */
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import WaveformPlayerRaw from '../../src/player/WaveformPlayer.astro';
import type { WaveformPlayerProps } from '../../src/player/types';
import { installDom, enter, MockIO } from './dom';

const Component = WaveformPlayerRaw as Parameters<AstroContainer['renderToString']>[0];

/** The parts of a player instance this suite reads. */
interface PlayerLike {
	options: Record<string, unknown>;
	audio: HTMLAudioElement | null;
	_loadId: number;
	destroy(): void;
}
interface PlayerClass {
	init(root?: ParentNode): void;
	getInstance(el: HTMLElement): PlayerLike | undefined;
	destroyAll(): void;
}

let container: AstroContainer;
let WaveformPlayer: PlayerClass;

beforeAll(async () => {
	container = await AstroContainer.create();
	({ WaveformPlayer } = (await installDom()) as unknown as { WaveformPlayer: PlayerClass });
});

afterEach(() => {
	WaveformPlayer.destroyAll();
	document.body.innerHTML = '';
	MockIO.instances = [];
});

/** Render, mount the markup (scripts don't run from innerHTML), init. */
async function mount(props: WaveformPlayerProps): Promise<{ el: HTMLElement; player: PlayerLike }> {
	const html = await container.renderToString(Component, {
		props: props as unknown as Record<string, unknown>,
	});
	document.body.innerHTML = html;
	const el = document.querySelector<HTMLElement>('[data-waveform-player]');
	if (!el) throw new Error('no [data-waveform-player] container rendered');
	WaveformPlayer.init();
	const player = WaveformPlayer.getInstance(el);
	if (!player) throw new Error('the core did not mount a player');
	return { el, player };
}

const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

describe('<WaveformPlayer lazy> with the real 2.0 core', () => {
	it('builds and registers the player at once, but loads nothing until it nears the viewport', async () => {
		const { el, player } = await mount({ url: '/a.mp3', lazy: true, waveform: [0.2, 0.6, 0.4] });
		expect(player.options.lazy).toBe(true);
		await frame();
		await frame();
		expect(player._loadId).toBe(0);
		expect(player.audio?.getAttribute('src') ?? null).toBeNull();
		expect(MockIO.instances).toHaveLength(1);
		expect(MockIO.instances[0].observed.has(el)).toBe(true);

		enter(el);
		expect(player._loadId).toBe(1);
		expect(player.audio?.getAttribute('src')).toBe('/a.mp3');
	});

	it('loads on the first frame without lazy, and makes no observer', async () => {
		const { player } = await mount({ url: '/b.mp3', waveform: [0.2, 0.6, 0.4] });
		expect(player.options.lazy).toBe(false);
		await frame();
		expect(MockIO.instances).toHaveLength(0);
		expect(player.audio?.getAttribute('src')).toBe('/b.mp3');
	});

	it('shows a known duration and wp1: peaks before any audio loads', async () => {
		// 3 peaks, round(p × 255) → [51, 153, 102] → base64url "M5lm".
		const { el, player } = await mount({
			url: '/c.mp3',
			preload: 'none',
			duration: 187,
			waveform: 'wp1:M5lm',
		});
		await frame();
		expect(player.options.duration).toBe(187);
		expect(el.querySelector('.time-total')?.textContent).toBe('3:07');
		expect((player as unknown as { waveformData: number[] }).waveformData.map((p) => Math.round(p * 255))).toEqual([
			51, 153, 102,
		]);
	});
});
