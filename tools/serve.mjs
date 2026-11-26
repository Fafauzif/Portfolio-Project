import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { basename, extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd());
const PORT = Number(process.env.PORT || 4321);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.json': 'application/json; charset=utf-8',
};

http.createServer(async (req, res) => {
  try {
    const request = new URL(req.url || '/', 'http://localhost');
    let path = decodeURIComponent(request.pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = normalize(join(ROOT, path));
    if (file !== ROOT && !file.startsWith(ROOT + sep)) { res.writeHead(403).end('forbidden'); return; }
    const info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      const location = './' + encodeURIComponent(basename(file)) + '/' + request.search;
      res.writeHead(308, { Location: location }).end();
      return;
    }
    const target = file;
    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    }).end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`serving ${ROOT} → http://127.0.0.1:${PORT}/`);
});
