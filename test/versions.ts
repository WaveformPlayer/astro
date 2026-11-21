/// <reference types="node" />
/**
 * test/versions.ts
 * ----------------
 *
 * Shared by the four peer-range tests. The repo develops against the
 * published 2.0 cores: each devDependency is a `^2.x` range at least the
 * peer floor (`isPublished2x`), and "develops against a new enough core" is
 * also checked against the version actually installed.
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

/** `range` is a published `^2.x.y` range (not a `file:` link) whose floor is at least `min`. */
export function isPublished2x(range: string, min: number[]): boolean {
	if (!/^\^\d+\.\d+\.\d+$/.test(range)) return false;
	const f = floor(range);
	return f[0] === 2 && atLeast(f, min);
}

/** `x.y.z` → `[x, y, z]` (a prerelease suffix is ignored). */
export const parse = (version: string): number[] => version.split(/[.-]/).slice(0, 3).map(Number);

const require = createRequire(resolve(process.cwd(), 'package.json'));

/** The version of `name` installed in node_modules. */
export function installedVersion(name: string): string {
	return JSON.parse(readFileSync(require.resolve(`${name}/package.json`), 'utf8')).version;
}
