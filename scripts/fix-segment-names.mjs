/**
 * Postbuild fix for a Windows-only Next 16.2.0 static-export bug: segment prefetch files are written
 * as nested folders (work/__next.work/__PAGE__.txt) because export/index.js builds segment paths with
 * path.relative() ("\" on Windows) and only replaces "/" with ".". The client requests dotted names
 * (work/__next.work.__PAGE__.txt), so this flattens every __next.* folder into dotted files.
 * Linux builds contain no such folders, so it is a no-op there.
 * Usage: node scripts/fix-segment-names.mjs [outDir]
 */
import { existsSync, readdirSync, renameSync, rmdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SEGMENT_DIR_PREFIX = '__next.';

/**
 * Moves every file inside segmentDir to routeDir under a dotted name, then removes the emptied folders.
 * @param {string} routeDir Directory that holds segmentDir.
 * @param {string} segmentDir The nested __next.* folder.
 * @returns {number} Files moved.
 * @throws {Error} If a dotted target already exists.
 */
function flattenSegmentDir(routeDir, segmentDir) {
  const entries = readdirSync(segmentDir, { recursive: true, withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => path.join(entry.parentPath, entry.name));
  for (const file of files) {
    const target = path.join(routeDir, path.relative(routeDir, file).split(/[\\/]/).join('.'));
    if (existsSync(target)) throw new Error(`Refusing to overwrite ${target}`);
    renameSync(file, target);
  }
  const dirs = entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(entry.parentPath, entry.name));
  // Deepest first; rmdirSync fails on a non-empty folder, so nothing unmoved can be deleted.
  for (const dir of dirs.sort((a, b) => b.length - a.length)) rmdirSync(dir);
  rmdirSync(segmentDir);
  return files.length;
}

/**
 * Flattens all nested __next.* segment folders under outDir into the dotted file names the client requests.
 * @param {string} outDir Static export directory.
 * @returns {number} Files moved (0 on a correct, e.g. Linux, export).
 */
export function fixSegmentNames(outDir) {
  let moved = 0;
  for (const entry of readdirSync(outDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(outDir, entry.name);
    moved += entry.name.startsWith(SEGMENT_DIR_PREFIX) ? flattenSegmentDir(outDir, dir) : fixSegmentNames(dir);
  }
  return moved;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const outDir = path.resolve(process.argv[2] ?? 'out');
  console.log(`fix-segment-names: moved ${fixSegmentNames(outDir)} file(s) in ${outDir}`);
}
