# Changelog

## 2.2.0 — 2026-11-22

For `@arraypress/waveform-sounds` 2.2.0 (the other cores are unchanged).

### Added — sounds (`./sounds`)
- **`mergeEnharmonicKeys`** is forwarded (`data-merge-enharmonic-keys`). The
  2.2 core merges enharmonic keys (A#m / Bbm, C# / Db) into one key-menu
  entry by default; `mergeEnharmonicKeys={false}` keeps the spellings apart.
  The server render takes it through the core's `pickRenderOptions()`, so
  the SSR key menu and the adopted runtime agree (tested both ways against
  the real core).

### Changed
- **Peers**: `@arraypress/waveform-sounds` is `^2.2.0`. Its server-rendered
  markup changed in 2.2 — only the rows the list starts with are rendered, a
  row carries only `data-ws-index`, and every sound travels once as an inert
  `<script type="application/json" data-ws-sounds>` inside the component's
  container — and the runtime that adopts it must be the same version.
  `-player`, `-bar` and `-playlist` stay `^2.0.0`. All four remain optional.
- The JSON script is data (`type="application/json"`, never executed), so the
  component still ships no inline executable script; a strict hash-based CSP
  is unaffected.

## 2.1.0 — 2026-11-21

For the 2.1 cores (`@arraypress/waveform-player`, `-playlist` and `-sounds`
2.1.0; `-bar` stays 2.0).

### Fixed — sounds (`./sounds`)
- **`loop={false}` rendered the Loop toggle pressed**, until the runtime
  flipped it: the server `renderSounds` call didn't pass `loop`. The render
  options now come from the core's `pickRenderOptions()`
  (`@arraypress/waveform-sounds/render`) instead of a hand-kept list, so a
  render option the core adds reaches the server markup without an edit
  here.

### Changed
- **Peers**: `@arraypress/waveform-sounds` is `^2.1.0` (`pickRenderOptions`
  is 2.1). `-player`, `-bar` and `-playlist` stay `^2.0.0`. All four remain
  optional.
- README: the 2.1 cores' `<waveform-playlist>` and `<waveform-sounds>`
  custom elements can be written directly in an Astro page.

## 2.0.0 — 2026-11-21

One package replaces the four 1.x-era Astro wrappers, and it is built for the
2.0 cores (`@arraypress/waveform-player`, `-bar`, `-playlist` and `-sounds`
2.0).

| Before | Now |
| --- | --- |
| `@arraypress/waveform-player-astro` (0.8.0) | `@arraypress/waveform-astro/player` |
| `@arraypress/waveform-bar-astro` (0.5.1) | `@arraypress/waveform-astro/bar` |
| `@arraypress/waveform-playlist-astro` (0.5.0) | `@arraypress/waveform-astro/playlist` |
| `@arraypress/waveform-sounds-astro` (0.2.1) | `@arraypress/waveform-astro/sounds` |

`<old>/WaveformX.astro` and `<old>/types` move to `.../<name>/WaveformX.astro` and
`.../<name>/types`. There is no root import: each sub-path loads only its own
core.

### Requirements

- **The 2.0 cores.** Every core is an optional peer at `^2.0.0` (was
  `^1.24.5` for the player, `^1.11.0` bar, `^1.8.0` playlist,
  `^0.2.0 || ^0.3.0` sounds); install only the ones you use. 2.0 cores run
  on Chrome/Edge 111+, Firefox 114+ and Safari 16.4+.
- **Astro 7.4+ only; Astro 6 is no longer supported** (the peer range was
  `^6.0.0 || ^7.0.0`, now `^7.4.0`).
- **Node 22.12+** (`engines`), as for the cores.
- ES modules and TypeScript source only, as before: the package ships `src/`
  and has no CommonJS build or `typesVersions`.

### Added — player (`./player`)

- **The 13 options new in the 2.0 core are props**, each emitted as its
  `data-*` attribute only when set: `duration` (seconds, shown as the total
  until the audio's metadata arrives), `lazy`, `loop`, `showLoop`,
  `loopLabel`, `showVolume`, `volume`, `volumeLabel`, `muteLabel`,
  `showDownload`, `downloadUrl`, `downloadName`, `downloadLabel`.
- **`waveform` accepts compact `wp1:` peaks**, passed through for the core to
  decode.
- **Events, documented and typed.** No callback props (a server-rendered
  component has nothing to call): the core's bubbling `waveformplayer:*` DOM
  events, including 2.0's `seek`, `ratechange`, `volumechange` and `loop`,
  are typed on `DocumentEventMap` by the core; their detail types
  (`WaveformSeekEventDetail`, …, `WaveformPlayerEventMap`) and
  `AudioCrossOrigin` are re-exported from `./player`.

### Changed — player

- **`lazy` is the core's `lazy` option** (`data-lazy`). In 1.x it was the
  component's own: it rendered `data-waveform-player-lazy` and shipped an
  inline IntersectionObserver that built the player as it approached the
  viewport, polling up to ~1s for `window.WaveformPlayer`. Now the player is
  built at once (registered, its methods working, its title and loading
  state shown at full height, so nothing shifts) and the core defers the
  audio, the peaks and the drawing until it is within 200px of the viewport,
  with one shared observer. Pages using `<WaveformPlayer lazy>` keep working
  unchanged; only a stylesheet or script that targeted
  `[data-waveform-player-lazy]` needs to use `[data-lazy="true"]` instead.
- The `astro:page-load` re-init script now ships with every player (it used
  to skip lazy ones, which the removed observer mounted).

### Added — playlist (`./playlist`)

- Container props `showVolume`, `volume`, `volumeLabel`, `muteLabel`,
  `showDownload`, `downloadLabel`, which the 2.0 playlist passes to its
  player.
- Per track: `duration` may be seconds (`225`) or a clock string (`'3:45'`;
  the 2.0 playlist shows it and passes it to the player), and
  `downloadUrl` / `downloadName` render as `data-download-url` /
  `data-download-name`. `waveform` accepts `wp1:` peaks.

### Changed — playlist

- `loop`, `showLoop`, `loopLabel` and the player's `lazy`, which the 2.0
  playlist never passes to its player, and the per-track `duration`,
  `downloadUrl`, `downloadName`, are not container props. Neither are
  `onNextTrack` / `onPreviousTrack` (no callback props). The playlist's own
  `lazy` prop is unchanged: it defers building the whole playlist.
- The layout props take the playlist core's own types (the fallback for
  pre-1.8 cores is gone).

### Changed — bar (`./bar`)

- A trigger's `duration` is documented as seconds or a clock string, and
  `waveform` as accepting `wp1:` peaks (waveform-bar 2.0 passes both to the
  player). Config keys are unchanged.
- `window.WaveformBar` and `window.WaveformPlayer` are typed by the cores'
  own declarations; this package no longer declares conflicting
  hand-written versions.

### Sounds (`./sounds`)

- Unchanged; tested against waveform-sounds 2.0, and its server-rendered
  markup is still byte-identical to the core's `renderSounds`.

### Removed

- The player's 1.x lazy-mount script (`data-waveform-player-lazy`,
  `window.__wfpLazyMountBound`, the wait-for-the-core retry loop).
- The swap teardown's check that `WaveformPlayer.getAllInstances` exists
  (every 2.0 core has it).
- The hand-written `window.WaveformPlayer` / `window.WaveformBar` shapes.
- The playlist types' fallbacks for cores older than 1.8.0.
