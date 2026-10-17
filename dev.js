'use strict';
// Servidor local só para testar (npm run dev). Na Vercel este arquivo não é usado.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon' };
const apis = { catalog: require('./api/catalog'), auth: require('./api/auth'), admin: require('./api/admin'), img: require('./api/img') };

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://' + req.headers.host);
  const m = /^\/api\/([a-z]+)$/.exec(u.pathname);
  if (m && apis[m[1]]) return apis[m[1]](req, res);
  let p = decodeURIComponent(u.pathname);
  if (p === '/') p = '/index.html';
  else if (!path.extname(p)) p += '.html';
  const f = path.normalize(path.join(PUB, p));
  if (!f.startsWith(PUB) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end('404'); }
  res.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(process.env.PORT || 3000, () => console.log('http://localhost:' + (process.env.PORT || 3000)));
