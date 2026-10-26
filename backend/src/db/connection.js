'use strict';

const path = require('path');
const Database = require('better-sqlite3');
const { DATA } = require('../config');

const db = new Database(path.join(DATA, 'caventra.db'));
db.pragma('journal_mode = WAL');

// Schema migrations
db.exec(`
CREATE TABLE IF NOT EXISTS kv(key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS inquiries(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, company TEXT, type TEXT, budget TEXT, timeline TEXT, message TEXT, ip TEXT, created_at INTEGER NOT NULL, lead_source TEXT);
`);

try { db.exec('ALTER TABLE inquiries ADD COLUMN phone TEXT;'); } catch (e) {}
try { db.exec('ALTER TABLE inquiries ADD COLUMN lead_source TEXT;'); } catch (e) {}

const getSite = () => {
  const r = db.prepare('SELECT value FROM kv WHERE key=?').get('site');
  return r ? JSON.parse(r.value) : {};
};

const setSite = o => db.prepare(
  'INSERT INTO kv(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at'
).run('site', JSON.stringify(o), Date.now());

module.exports = { db, getSite, setSite };
