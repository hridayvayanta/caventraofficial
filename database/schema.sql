-- ============================================================
-- CAVENTRA SQLite Database Schema & Migrations
-- Storage: Better-SQLite3 with WAL Journal Mode
-- ============================================================

-- Key-Value store for dynamic CMS site settings and configurations
CREATE TABLE IF NOT EXISTS kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Public client project inquiries, cost estimates & lead capture
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  type TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT,
  ip TEXT,
  created_at INTEGER NOT NULL,
  lead_source TEXT
);

-- Indexes for fast administration queries & CRM synchronization
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
