/**
 * Serves the static export in out/ the way GitHub Pages does, for local and E2E testing:
 * "/dir/" serves dir/index.html, "/dir" redirects to "/dir/", and unknown paths get 404.html with status 404.
 * Usage: node scripts/serve-out.mjs [port]
 */
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = path.resolve('out');
const PORT = Number(process.argv[2] ?? 4310);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

const isFile = (file) => {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
};
const isDir = (file) => {
  try {
    return statSync(file).isDirectory();
  } catch {
    return false;
  }
};

const send = (res, status, file) => {
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
};

createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }
  const target = path.resolve(ROOT, `.${pathname}`);
  if (target !== ROOT && !target.startsWith(`${ROOT}${path.sep}`)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (isFile(target)) return send(res, 200, target);
  if (isDir(target)) {
    if (!pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${pathname}/` }).end();
      return;
    }
    const index = path.join(target, 'index.html');
    if (isFile(index)) return send(res, 200, index);
  }
  if (isFile(`${target}.html`)) return send(res, 200, `${target}.html`);
  send(res, 404, path.join(ROOT, '404.html'));
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}`));
