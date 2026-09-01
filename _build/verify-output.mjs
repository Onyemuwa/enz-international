// Proves a refactor changed no output.
//
// The generator writes 76 pages plus the sitemap, robots, manifest and host
// config. Any change to it that is meant to be structural — splitting files,
// renaming helpers, extracting a component — must leave every one of those
// byte-identical. This hashes them all so that claim can be checked instead of
// asserted.
//
//   node _build/verify-output.mjs snapshot   before the change
//   node _build/verify-output.mjs check      after re-running the generator
//
// A deliberate content change is expected to fail the check. Read the diff it
// prints, confirm each file listed is one you meant to change, then re-snapshot.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = path.join(ROOT, '_build', '.output-snapshot.json');

// Everything the generator is responsible for, and nothing it is not.
const SKIP_DIRS = new Set(['node_modules', '.git', '_build', '_content', 'assets', '.vercel']);

function collect(dir, acc = {}) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      collect(full, acc);
      continue;
    }
    if (!/\.(html|xml|txt|json|webmanifest)$/.test(entry)) continue;
    const rel = path.relative(ROOT, full).replace(/\\/g, '/');
    acc[rel] = createHash('sha256').update(readFileSync(full)).digest('hex').slice(0, 16);
  }
  return acc;
}

const mode = process.argv[2];
const current = collect(ROOT);

if (mode === 'snapshot') {
  writeFileSync(SNAPSHOT, JSON.stringify(current, null, 1));
  console.log(`snapshot written: ${Object.keys(current).length} files`);
  process.exit(0);
}

if (!existsSync(SNAPSHOT)) {
  console.error('No snapshot. Run: node _build/verify-output.mjs snapshot');
  process.exit(1);
}

const before = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
const added = Object.keys(current).filter((f) => !(f in before));
const removed = Object.keys(before).filter((f) => !(f in current));
const changed = Object.keys(current).filter((f) => f in before && before[f] !== current[f]);

const show = (label, list) => {
  if (!list.length) return;
  console.log(`\n${label} (${list.length}):`);
  for (const f of list.slice(0, 15)) console.log('   ' + f);
  if (list.length > 15) console.log(`   ...and ${list.length - 15} more`);
};

if (!added.length && !removed.length && !changed.length) {
  console.log(`IDENTICAL — all ${Object.keys(current).length} generated files match the snapshot.`);
  process.exit(0);
}

console.log(`OUTPUT DIFFERS from snapshot (${Object.keys(current).length} files now):`);
show('changed', changed);
show('added', added);
show('removed', removed);
process.exit(1);
