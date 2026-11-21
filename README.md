<div align="center">

# WaveformPlayer for Astro

**Astro components for WaveformPlayer: the player, the persistent bar, playlists and sound lists.**
One package, one sub-path per component. Install only the cores you use.

**[Documentation](https://docs.waveformplayer.com/)** · [Astro guide](https://docs.waveformplayer.com/frameworks/astro/)

</div>

---

## Install

Install this package, plus the core(s) for the components you use:

| Import from | Components | Also install |
| --- | --- | --- |
| `@arraypress/waveform-astro/player` | `WaveformPlayer` | `@arraypress/waveform-player` |
| `@arraypress/waveform-astro/bar` | `WaveformBar`, `WaveformBarTrigger` | `@arraypress/waveform-bar` `@arraypress/waveform-player` |
| `@arraypress/waveform-astro/playlist` | `WaveformPlaylist` | `@arraypress/waveform-playlist` `@arraypress/waveform-player` |
| `@arraypress/waveform-astro/sounds` | `WaveformSounds` | `@arraypress/waveform-sounds` `@arraypress/waveform-player` |

```bash
# just the player
npm install @arraypress/waveform-astro @arraypress/waveform-player
```

Requires Astro 7.4+ and the 2.0 cores (`^2.0.0`), which support Chrome/Edge
111+, Firefox 114+ and Safari 16.4+. Node 22.12+.

The cores are optional peer dependencies, so npm won't install the ones you
don't import. There is no root import (`@arraypress/waveform-astro` on its
own): each component loads its own core, and a combined entry would need all
of them.

Each sub-path also exposes its `.astro` files and types directly, for
example `@arraypress/waveform-astro/player/WaveformPlayer.astro` and
`@arraypress/waveform-astro/player/types`.

## Player

```astro
---
import WaveformPlayer from '@arraypress/waveform-astro/player';
---
<WaveformPlayer src="/track.mp3" title="My Song" artist="The Artist" waveformStyle="mirror" />
```

Every core option is a prop, emitted as its `data-*` attribute. The 2.0
options:

| Prop | Attribute | |
| --- | --- | --- |
| `duration` | `data-duration` | Track length in seconds, shown as the total until the audio's metadata arrives (with `preload="none"`, until play) |
| `lazy` | `data-lazy` | Build the player now; load audio and peaks, and draw, within 200px of the viewport |
| `loop`, `showLoop`, `loopLabel` | `data-loop`, … | Loop the track; a loop toggle button and its name |
| `showVolume`, `volume`, `volumeLabel`, `muteLabel` | `data-show-volume`, … | Mute toggle and volume slider; initial volume (0..1) |
| `showDownload`, `downloadUrl`, `downloadName`, `downloadLabel` | `data-show-download`, … | A download link (default: the track url and its file name) |

`waveform` takes peaks as an array, a `.json` URL, or compact `wp1:` peaks
(about a quarter of the size of a JSON array; `@arraypress/waveform-gen`
writes them):

```astro
<WaveformPlayer url="/track.mp3" preload="none" duration={187} waveform="wp1:M5lm…" />
```

`lazy` is the core's option. In 1.x it was this component's own (a
`data-waveform-player-lazy` container promoted by an inline observer script);
`<WaveformPlayer lazy>` still defers loading the same way, and the player now
exists, at full height, before it is on screen.

### Events

There are no callback props: a server-rendered component has no function to
call. Every player dispatches bubbling, composed `waveformplayer:*`
CustomEvents on its container, typed on `DocumentEventMap`, so one listener
hears them all. `detail.player` is the instance.

| Event | `detail` (besides `player`, `url`) |
| --- | --- |
| `waveformplayer:ready` / `load` / `play` / `pause` / `destroy` | — |
| `waveformplayer:ended` | `currentTime`, `duration` |
| `waveformplayer:timeupdate` | `currentTime`, `duration`, `progress` |
| `waveformplayer:error` | `error` |
| `waveformplayer:seek` (2.0) | `currentTime`, `duration` |
| `waveformplayer:ratechange` (2.0) | `playbackRate` |
| `waveformplayer:volumechange` (2.0) | `volume`, `muted` |
| `waveformplayer:loop` (2.0) | `loop`, `start`, `end` |
| `waveformplayer:next` / `previous` | — (lock-screen skip buttons) |
| `waveformplayer:request-play` / `request-pause` / `request-seek` | for `audioMode="external"` controllers |

`seek`, `ratechange`, `volumechange` and `loop` come from the player's own
`<audio>`, so they don't fire with `audioMode="external"`.

```astro
<script>
  document.addEventListener('waveformplayer:seek', (e) => {
    console.log(e.detail.currentTime);
  });
</script>
```

The detail types are exported from `@arraypress/waveform-astro/player`
(`WaveformSeekEventDetail`, …).

## Bar

```astro
---
import { WaveformBar, WaveformBarTrigger } from '@arraypress/waveform-astro/bar';
---
<WaveformBarTrigger url="/audio/track.mp3" title="My Track" artist="Producer" />

<!-- Render once, in your root layout -->
<WaveformBar />
```

A trigger's `duration` may be seconds (`187`) or a clock string (`'3:07'`);
waveform-bar 2.0 shows it and passes it to the player. `waveform` takes
compact `wp1:` peaks too.

## Playlist

```astro
---
import WaveformPlaylist from '@arraypress/waveform-astro/playlist';
import '@arraypress/waveform-player/dist/waveform-player.css';
import '@arraypress/waveform-playlist/dist/waveform-playlist.css';
import wfpJsUrl from '@arraypress/waveform-player/dist/waveform-player.min.js?url';
import wfplJsUrl from '@arraypress/waveform-playlist/dist/waveform-playlist.js?url';
---
<script src={wfpJsUrl} is:inline></script>
<script src={wfplJsUrl} is:inline></script>

<WaveformPlaylist tracks={[{ url: '/a.mp3', title: 'A', artist: 'Artist' }]} />
```

Per track: `duration` (seconds or `'3:45'`, shown in the list and passed to
the player), `downloadUrl` / `downloadName` (with `showDownload` on the
playlist), and `waveform` (an array, a URL or `wp1:` peaks). The playlist
passes `showVolume`, `volume`, `showDownload` and the labels to its player;
it never passes `loop`, `showLoop` or the player's `lazy`, so those aren't
props. The playlist's own `lazy` prop defers building the whole playlist
until it nears the viewport.

## Sounds

```astro
---
import WaveformSounds from '@arraypress/waveform-astro/sounds';
import '@arraypress/waveform-player/styles.css';
import '@arraypress/waveform-sounds/styles.css';
---
<WaveformSounds
  sounds={[
    { url: '/previews/kick-01.mp3', title: 'Kick 01', type: 'Drums', bpm: 128, key: 'F minor', duration: 2.4 },
    { url: '/previews/bass-04.mp3', title: 'Bass Loop 04', type: 'Bass', bpm: 128, key: 'Fmin', peaks: 'a1b2c3…' },
  ]}
  pageSize={100}
  columns={['type', 'bpm', 'key']}
/>
```

## Documentation

Every prop, the imperative API and SSR notes:
[docs.waveformplayer.com/frameworks/astro](https://docs.waveformplayer.com/frameworks/astro/).

## License

MIT © ArrayPress Limited
