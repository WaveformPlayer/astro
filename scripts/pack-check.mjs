/**
 * scripts/pack-check.mjs
 * ----------------------
 *
 * `npm run test:pack`: checks what `npm pack` would publish.
 *
 * - every `exports` target is in the tarball (a sub-path that points at a
 *   missing file only fails in a consumer's build);
 * - nothing ships beyond src/, the docs, LICENSE and package.json (no
 *   tests, examples or config);
 * - ES modules only, like the 2.0 cores: no `require` export condition, no
 *   `.cjs` / `.d.cts` file, `"type": "module"`.
 *
 * `npm pack --json` prints an array up to npm 11 and, from npm 12, an object
 * keyed by package name. Both are accepted.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const raw = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
	cwd: new URL('..', import.meta.url),
	encoding: 'utf8',
	stdio: ['ignore', 'pipe', 'ignore'],
});
const parsed = JSON.parse(raw);
const entry = Array.isArray(parsed) ? parsed[0] : (parsed[pkg.name] ?? Object.values(parsed)[0]);
if (!entry?.files) throw new Error(`unexpected npm pack --json output:\n${raw}`);
const files = new Set(entry.files.map((f) => f.path));

const targets = new Set();
const collect = (value) => {
	if (typeof value === 'string') targets.add(value.replace(/^\.\//, ''));
	else if (value && typeof value === 'object') Object.values(value).forEach(collect);
};
collect(pkg.exports);

const problems = [];
for (const t of targets) if (!files.has(t)) problems.push(`exports target missing from tarball: ${t}`);
const allowed = /^(src\/.+|README\.md|CHANGELOG\.md|LICENSE|package\.json)$/;
for (const f of files) if (!allowed.test(f)) problems.push(`unexpected file in tarball: ${f}`);
for (const f of files) if (/\.(cjs|d\.cts)$/.test(f)) problems.push(`CommonJS file in tarball: ${f}`);
if (pkg.type !== 'module') problems.push('package.json "type" must be "module"');
if (JSON.stringify(pkg.exports).includes('"require"')) problems.push('exports has a "require" condition');

if (problems.length) {
	console.error(problems.join('\n'));
	process.exit(1);
}
console.log(`pack ok: ${files.size} files, ${targets.size} export targets, all present`);
