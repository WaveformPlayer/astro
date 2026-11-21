/// <reference types="node" />
/**
 * test/core-file.ts
 * -----------------
 *
 * Read a file out of an installed core as text. The 2.0 cores' `exports`
 * maps don't expose `src/` or `types/` deep paths (waveform-bar's blocks
 * `src/` outright), so neither an import nor Vite's `?raw` can reach them by
 * package specifier — and `?raw` on a relative node_modules path would be
 * refused if a core were temporarily a `file:` symlink outside the project
 * root. Resolving the always-exported `package.json` gives the package root
 * on disk instead, for an npm install and a `file:` link alike.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

const require = createRequire(resolve(process.cwd(), 'package.json'));

/** The root directory of the installed package `name`. */
export const coreRoot = (name: string): string => dirname(require.resolve(`${name}/package.json`));

/** `file` (relative to the package root) of the installed package `name`. */
export const readCoreFile = (name: string, file: string): string =>
	readFileSync(join(coreRoot(name), file), 'utf8');
