'use strict';
const crypto = require('crypto');
const db = require('./db');

const COOKIE = 'rb_session';
const SESSION_DAYS = 30;

// ---- senha (scrypt) ----
function hashPassword(password, saltHex) {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return { salt: salt.toString('hex'), hash: hash.toString('hex') };
}
function verifyPassword(password, rec) {
  const h = hashPassword(password, rec.salt).hash;
  return crypto.timingSafeEqual(Buffer.from(h, 'hex'), Buffer.from(rec.hash, 'hex'));
}
const DUMMY = hashPassword('dummy-password-royal');

function passwordProblem(p) {
  if (typeof p !== 'string' || p.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (p.length > 100) return 'Senha muito longa.';
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return 'Use letras e números na senha.';
  return null;
}
function validEmail(e) {
  return typeof e === 'string' && e.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

// ---- segredo para assinar sessões ----
let cachedSecret = null;
async function secret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (cachedSecret) return cachedSecret;
  let s = await db.get('rb:secret');
  if (!s) {
    s = crypto.randomBytes(32).toString('hex');
    if (!(await db.setnx('rb:secret', s))) s = await db.get('rb:secret');
  }
  cachedSecret = s;
  return s;
}

function b64u(buf) { return Buffer.from(buf).toString('base64url'); }
async function sign(payload) {
  const body = b64u(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', await secret()).update(body).digest('base64url');
  return body + '.' + mac;
}
async function verify(token) {
  if (typeof token !== 'string' || token.length > 600) return null;
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;
  const expect = crypto.createHmac('sha256', await secret()).update(body).digest('base64url');
  const a = Buffer.from(mac), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return p.exp && p.exp > Date.now() ? p : null;
  } catch { return null; }
}

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

async function sessionCookie(admin) {
  const token = await sign({ e: admin.email, sv: admin.sv, exp: Date.now() + SESSION_DAYS * 86400000 });
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}${db.IS_PROD ? '; Secure' : ''}`;
}
function clearCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${db.IS_PROD ? '; Secure' : ''}`;
}

// devolve o registro do admin se a sessão for válida; senão null
async function currentAdmin(req) {
  const tok = parseCookies(req)[COOKIE];
  if (!tok) return null;
  const p = await verify(tok);
  if (!p) return null;
  const admin = await db.get('rb:admin');
  if (!admin || admin.email !== p.e || admin.sv !== p.sv) return null;
  return admin;
}

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
function newCode() { return String(crypto.randomInt(0, 1000000)).padStart(6, '0'); }
function codeMatches(code, rec) {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) return false;
  return crypto.timingSafeEqual(Buffer.from(sha(code)), Buffer.from(rec.code));
}

module.exports = {
  hashPassword, verifyPassword, DUMMY, passwordProblem, validEmail,
  sessionCookie, clearCookie, currentAdmin, sha, newCode, codeMatches,
};
