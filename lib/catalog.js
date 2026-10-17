'use strict';
const crypto = require('crypto');
const db = require('./db');
const seed = require('./seed.json');

const KEY = 'rb:catalog';
const rid = (p) => p + crypto.randomBytes(5).toString('hex');

async function load() {
  let c = await db.get(KEY);
  if (!c) {
    c = JSON.parse(JSON.stringify(seed));
    c.updated = Date.now();
    await db.setnx(KEY, c);
    c = (await db.get(KEY)) || c;
  }
  return c;
}
async function save(c) {
  c.updated = Date.now();
  await db.set(KEY, c);
  return c;
}

const clean = (s, max) => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

function badReq(msg) { return Object.assign(new Error(msg), { status: 400 }); }

function validCategory(input) {
  const name = clean(input.name, 30);
  if (!name) throw badReq('Dê um nome para a categoria.');
  const emoji = clean(input.emoji, 8) || '💖';
  return { name, emoji };
}

function validProduct(input, cats) {
  const title = clean(input.title, 80);
  if (!title) throw badReq('Dê um título para o produto.');
  const price = Number(input.price);
  if (!Number.isInteger(price) || price < 0 || price > 99999999) throw badReq('Preço inválido.');
  const cat = input.cat ? String(input.cat) : '';
  if (cat && !cats.some((c) => c.id === cat)) throw badReq('Categoria inválida.');
  return { title, price, cat, desc: clean(input.desc, 500), hidden: !!input.hidden };
}

// ---- imagens enviadas pelo celular (guardadas no banco) ----
const MAX_IMG = 700 * 1024;
function parseImage(dataUrl) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) throw badReq('Imagem inválida. Use JPG, PNG ou WebP.');
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > MAX_IMG) throw badReq('Imagem muito grande.');
  const ok =
    (m[1] === 'image/jpeg' && buf[0] === 0xff && buf[1] === 0xd8) ||
    (m[1] === 'image/png' && buf.slice(1, 4).toString() === 'PNG') ||
    (m[1] === 'image/webp' && buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP');
  if (!ok) throw badReq('O arquivo não parece ser uma imagem válida.');
  return { mime: m[1], data: m[2] };
}
async function storeImage(dataUrl) {
  const img = parseImage(dataUrl);
  const id = crypto.randomBytes(12).toString('hex');
  await db.set('rb:img:' + id, img);
  return '/api/img?id=' + id;
}
async function dropImage(url) {
  const m = /^\/api\/img\?id=([a-f0-9]{24})$/.exec(url || '');
  if (m) await db.del('rb:img:' + m[1]);
}

module.exports = { load, save, rid, validCategory, validProduct, storeImage, dropImage, clean, badReq };
