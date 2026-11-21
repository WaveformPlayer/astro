# CLAUDE.md — @arraypress/waveform-astro

Astro components for the waveform family, one sub-path each: `./player`,
`./bar`, `./playlist`, `./sounds` (merged from the four 1.x
`waveform-{player,bar,playlist,sounds}-astro` packages in 2.0). Each component
renders container markup and passes options as `data-*` attributes for its
core to parse client-side.

## Commands
- `npm test` — vitest (Astro's container API renders the `.astro` files; the
  real-core tests use jsdom through `test/player/dom.ts` / `test/sounds/dom.ts`).
- `npm run typecheck` — `tsc --noEmit` over `src/`, `test/` (incl. the
  `*.typecheck.ts` files, which vitest doesn't run) and `examples/`.
- `npm run lint` — Biome (policy and the reasons for each disabled rule are in
  `biome.jsonc`).
- `npm run test:pack` — what `npm pack` would publish: every `exports` target
  present, nothing beyond `src/`, docs, LICENSE, package.json.
- **No `build`, no `prepublishOnly`**: the package ships `src/` directly. The
  gate before a commit or publish is typecheck + test + lint + test:pack.

## Dependencies
- The cores are **optional peers at `^2.0.0`** (`-sounds` `^2.1.0`, for
  `pickRenderOptions`): a consumer installs only the
  cores of the sub-paths they import. `astro` peer `^7.4.0` (Astro 6 dropped
  in 2.0). `engines.node >=22.12`.
- devDependencies on the cores are the **published ranges** (`^2.1.0`; `-bar`
  `^2.0.0`), resolved from
  registry.npmjs.org (no `link: true` lock entries, real directories in
  `node_modules`). The drift tests read core files from disk next to each
  core's `package.json` (`test/core-file.ts`): the cores' `exports` block
  `src/` and `types/`, and it also works for a `file:` symlink, which Vite's
  `?raw` would refuse.
- For cross-repo work before a core release, a devDependency can temporarily
  be `file:../waveform-<name>` (the peer-range tests fail while it is).
  Switch it back and re-resolve the lock before publishing:
  `rm -rf node_modules/@arraypress/waveform-<name>` then
  `npm install --save-dev @arraypress/waveform-<name>@^2.x.y` (a plain
  `npm install` after editing package.json keeps the `link: true` entry).
- TypeScript 7, Astro 7.4, Biome 2.6, vitest 5 (all current as of 2026-11-21).
- ESM and TypeScript source only; no CommonJS and no `typesVersions` (Astro's
  bundler resolution reads `exports` `types` conditions directly).

## Forwarding rules, per sub-path

Types flow from the cores; values don't. Every component forwards through a
hand-written allowlist, and a drift test makes a missed option a red test.

### `./player` — `src/player/WaveformPlayer.astro`
- A new core option needs **both**: the `Astro.props` destructure and a
  `setStr` / `setNum` / `setBool` emitting the kebab-case `data-*`
  (`crossOrigin` → `data-cross-origin`; `showBPM` → `data-show-bpm`). Miss
  either and the prop typechecks and is silently dropped.
- `test/player/forwarding-drift.test.ts` renders every option the installed
  core has (`DEFAULT_OPTIONS` from `src/js/themes.ts` ∪ the keys of
  `WaveformPlayerOptions` in `types/types.d.ts`) and feeds the emitted
  `data-*` through the core's own `parseDataAttributes()` (`src/js/utils.ts`).
  A new option with a `null` default needs a sample in `test/player/core-options.ts`.
- `NOT_FORWARDED`: `style` (Astro's inline-CSS attribute; use
  `waveformStyle`) and every `on*` callback (a function can't cross into
  static HTML; consumers use the `waveformplayer:*` DOM events — documented
  in the README, typed by the core on `DocumentEventMap`).
- **`lazy` is the core's option** (`data-lazy`). 1.x had an Astro-only `lazy`
  (a `data-waveform-player-lazy` container + an inline IntersectionObserver
  that built the player late). The core's does the same job better — the
  player exists at full height and `getInstance()` works before it loads —
  so that script is gone. Don't bring an Astro-level lazy back.
- Per-track values (`duration`, `downloadUrl`, `downloadName`) can't carry
  over: there is no `loadTrack` path here; a new track is a new render.
- Every instance ships two `is:inline` scripts (ES5, verbatim to the
  browser): the `astro:before-swap` teardown (`window.__wfpSwapBound`) and
  the `astro:page-load` re-init (`window.__wfpInitBound`).

### `./bar` — `src/bar/WaveformBar.astro`, `WaveformBarTrigger.astro`
- `config` goes **verbatim** to `window.WaveformBar.init()`; the type is the
  contract. `WaveformBarConfig` (`src/bar/types.ts`) stays hand-written even
  though waveform-bar 2.0 generates declarations: it describes what an Astro
  page can serialise (no function endpoints, no callbacks).
- `test/bar/config-drift.test.ts` parses `const DEFAULTS = {` out of the
  installed bar's `src/js/core.ts` (read from disk: the bar's `exports` map
  blocks `src/`) and fails on a `DEFAULTS` key that isn't typed (unless in
  `NOT_TYPED`: the `on*` callbacks) or a typed key the bar doesn't know
  (unless in `NOT_IN_DEFAULTS`: `mode`). It also pins `SHARED_CONFIG_KEYS`,
  identical in all four framework packages.
- Triggers emit `data-wb-*`. Track `duration` is seconds or a clock string and
  `waveform` may be `wp1:` peaks; waveform-bar 2.0 passes both to its player.
- `window.WaveformBar` is typed by the bar's own `declare global`;
  `src/bar/globals.d.ts` only adds the wrapper's internal flags. Never
  redeclare `WaveformBar` there (TS2687/TS2717 against the bar's).

### `./playlist` — `src/playlist/WaveformPlaylist.astro`
- Follows the player pattern (destructure + emitter), not the bar's. Types
  derive from **both** cores: `waveform-playlist` owns the playlist options,
  `waveform-player` the player options forwarded to its embedded player.
- `test/playlist/forwarding-drift.test.ts` reads both cores'
  `types/types.d.ts`; every key must emit its `data-*` on the container or be
  in `NOT_FORWARDED`:
  - per-track (rendered on each `[data-track]`): `url`, `src`, `title`,
    `artist`, `artwork`, `album`, `markers`, `waveform`, `duration`,
    `downloadUrl`, `downloadName`;
  - stripped by the 2.0 playlist: `audioMode`, `loop`, `showLoop`, the
    player's `lazy`, plus `loopLabel` (names a button that never exists);
  - `style`, and every callback.
  The same keys are `Omit`ted from `WaveformPlaylistProps` (`types.ts`), so
  they don't typecheck and vanish.
- Forward a new *player* option here only if the playlist passes it to its
  player (usually yes — 2.0's `showVolume`, `volume`, `showDownload` and
  their labels do).
- The playlist's own `lazy` prop is a mount deferral for the whole playlist
  (`data-waveform-playlist-lazy` + an inline observer); the playlist core has
  no equivalent, so it stays.
- Tracks: `duration` is a number (seconds) or a string; `downloadUrl` /
  `downloadName` → `data-download-url` / `data-download-name`.
  `test/playlist/per-track.test.ts` runs both real cores and checks a track
  change replaces them.

### `./sounds` — `src/sounds/WaveformSounds.astro`
- Server-renders with `@arraypress/waveform-sounds/render`; the runtime ADOPTS
  that markup, so it must stay **byte-identical** to `renderSounds` (the SSR
  tests check). The render options are the core's `pickRenderOptions(Astro.props)`
  (plus the resolved `player` / `idPrefix`), so a render-shaping option needs
  no extra edit there.
- A new core option: destructure + `setStr`/`setNum`/`setBool`/`setList`/`setJson`
  emitting what the core's `readDataOptions` reads.
  `test/sounds/forwarding-drift.test.ts` reads `WaveformSoundsOptions` from
  the core's `types/types.d.ts`, constructs the REAL core over the render in
  jsdom and checks `instance.options[key]`. `NOT_FORWARDED`: `sounds`
  (rendered), `playerClass` (a constructor), the callbacks (also in
  `NotForwardedOption`). A new `null`-default option needs a `SAMPLES` entry.
- Client script (`client.ts` + `lifecycle.ts`): a processed `<script>`, never
  `is:inline` or `define:vars` (strict hash-based CSP). It never replaces the
  page's player: it keeps an existing `window.WaveformPlayer` and otherwise
  dynamic-imports `@arraypress/waveform-player/no-autoinit`. `init()` now and
  on `astro:page-load`; `prune()` on `astro:after-swap`.

## Peer-range tests
`test/<sub-path>/peer-range(s).test.ts` hold each peer at the floor that
parses what the component emits (all `^2.0.0` now) and check the
devDependency is a published `^2.x` range at least that floor, and the
installed version too (`test/versions.ts`).

## Conventions
- An omitted prop emits no attribute, so the core's default applies;
  `false` / `0` are emitted.
- Each change gets a test in `test/<sub-path>/` and a `CHANGELOG.md` entry.
- Commit messages end with the `Co-Authored-By` line.

## Cross-repo
An option change is a family-wide batch: load the `waveform-release` skill.
