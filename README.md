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

## Bar

```astro
---
import { WaveformBar, WaveformBarTrigger } from '@arraypress/waveform-astro/bar';
---
<WaveformBarTrigger url="/audio/track.mp3" title="My Track" artist="Producer" />

<!-- Render once, in your root layout -->
<WaveformBar />
```

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
