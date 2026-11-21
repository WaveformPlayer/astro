/// <reference types="node" />
/**
 * test/versions.ts
 * ----------------
 *
 * Shared by the four peer-range tests. The cores are devDependencies as
 * `file:../waveform-<name>` (the sibling 2.0 checkouts, until 2.0 is on npm),
 * so "develops against a new enough core" is checked against the version
 * actually installed, not against a range string.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

/** The lowest version a `^x.y.z` range (or a `||` union of them) admits. */
export function floor(range: string): number[] {
	const parts = range.split('||').map((part) => {
		const m = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(part.trim());
		if (!m) throw new Error(`expected ^x.y.z ranges, got ${range}`);
		return m.slice(1).map(Number);
	});
	return parts.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])[0];
}

/** `a >= b`, both as `[major, minor, patch]`. */
export function atLeast(a: number[], b: number[]): boolean {
	for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
	return true;
}

/** `x.y.z` → `[x, y, z]` (a prerelease suffix is ignored). */
export const parse = (version: string): number[] => version.split(/[.-]/).slice(0, 3).map(Number);

const require = createRequire(resolve(process.cwd(), 'package.json'));

/** The version of `name` installed in node_modules. */
export function installedVersion(name: string): string {
	return JSON.parse(readFileSync(require.resolve(`${name}/package.json`), 'utf8')).version;
}
