/**
 * A preview server for dist/. Node's http module only — no dependency, and nothing here ships.
 *
 * It exists because the site uses directory URLs (`/features/`), which cannot be previewed by
 * opening files off disk: `file://` will not resolve a directory to its index.html, and every
 * root-absolute asset path breaks. This resolves both the way a real static host does, and
 * falls back to 404.html so that page can be checked too.
 *
 *   node serve.mjs [port]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const PORT = Number(process.argv[2]) || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const send = (res, status, body, type) => {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
};

createServer(async (req, res) => {
  /* normalize() before joining: without it, a path containing ../ escapes dist/. */
  const url = decodeURIComponent(req.url.split('?')[0]);
  let path = join(DIST, normalize(url).replace(/^(\.\.[/\\])+/, ''));

  try {
    const info = await stat(path).catch(() => null);
    if (!info || info.isDirectory()) path = join(path, 'index.html');
    const body = await readFile(path);
    send(res, 200, body, TYPES[extname(path)] ?? 'application/octet-stream');
  } catch {
    try {
      send(res, 404, await readFile(join(DIST, '404.html')), TYPES['.html']);
    } catch {
      send(res, 404, 'Not found', TYPES['.txt']);
    }
  }
}).listen(PORT, () => {
  console.log(`Open Cut website: http://localhost:${PORT}`);
});
