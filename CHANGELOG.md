# Changelog

## 2.0.0-next.0

One package replaces the four 1.x-era Astro wrappers. Components, props,
emitted markup and client behaviour are unchanged; only the import paths change.

| Before | Now |
| --- | --- |
| `@arraypress/waveform-player-astro` (0.8.0) | `@arraypress/waveform-astro/player` |
| `@arraypress/waveform-bar-astro` (0.5.1) | `@arraypress/waveform-astro/bar` |
| `@arraypress/waveform-playlist-astro` (0.5.0) | `@arraypress/waveform-astro/playlist` |
| `@arraypress/waveform-sounds-astro` (0.2.1) | `@arraypress/waveform-astro/sounds` |

`<old>/WaveformX.astro` and `<old>/types` move to `.../<name>/WaveformX.astro` and
`.../<name>/types`.

- The cores are optional peer dependencies: install only the ones you use.
- The `@arraypress/waveform-player` peer floor is `^1.24.5` for every sub-path
  (it was `^1.23.0` for the player wrapper and `^1.8.0` for the bar wrapper).
