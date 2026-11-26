import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../out/', import.meta.url));
const port = Number(process.env.PORT || process.argv[2] || 3000);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf',
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Choose a TCP port between 1 and 65535.');
}
if (!(await stat(path.join(root, 'index.html')).catch(() => null))?.isFile()) {
  console.error('Run npm run build to generate out/ before starting a preview.');
  process.exit(1);
}

async function respond(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  const pathname = decodeURIComponent(url.pathname);
  const target = path.resolve(root, '.' + pathname);
  const relative = path.relative(root, target);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative) || pathname.includes('\0')) {
    response.writeHead(400).end();
    return;
  }

  let filename = target;
  let info = await stat(filename).catch(() => null);
  if (info?.isDirectory()) {
    filename = path.join(target, 'index.html');
    info = await stat(filename).catch(() => null);
    if (info?.isFile() && !url.pathname.endsWith('/')) {
      response.writeHead(308, { Location: url.pathname + '/' + url.search }).end();
      return;
    }
  }

  const found = info?.isFile();
  if (!found) {
    filename = path.join(root, '404.html');
    info = await stat(filename);
  }

  response.writeHead(found ? 200 : 404, {
    'Content-Type': mimeTypes[path.extname(filename).toLowerCase()] ?? 'application/octet-stream',
    'Content-Length': info.size,
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(filename).on('error', () => response.destroy()).pipe(response);
}

createServer((request, response) => {
  respond(request, response).catch(error => {
    if (!response.headersSent) response.writeHead(error instanceof URIError ? 400 : 500);
    response.end();
  });
}).listen(port, '127.0.0.1', () => console.log(`Preview at http://127.0.0.1:${port}`));
