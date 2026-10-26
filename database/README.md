# Caventra Database Layer

The `database/` directory manages the SQLite persistence layer for Caventra.

---

## Storage Engine & Architecture

- **Engine**: SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) (high-speed synchronous SQLite3 driver).
- **Journal Mode**: `WAL` (Write-Ahead Logging) for concurrent reads without write-blocking.
- **Data File**: Stored in `data/caventra.db` (or custom path configured via `DATA_DIR` environment variable).

---

## Directory Organization

```
database/
├── schema.sql                    # SQL definitions for kv and inquiries tables
├── connection.js                 # Better-SQLite3 connection, WAL pragma & migrations
├── data/                         # Local database storage directory
│   ├── caventra.db               # Primary SQLite database
│   ├── caventra.db-shm           # Shared memory WAL index
│   └── caventra.db-wal           # Write-Ahead Log journal
└── README.md                     # This documentation
```

---

## Tables Overview

1. `kv`:
   - Key-value store for site content and CMS updates.
   - Primary key: `key` (`TEXT`).
2. `inquiries`:
   - Inquiries captured through the public contact form and project cost estimator.
   - Columns: `id`, `name`, `email`, `phone`, `company`, `type`, `budget`, `timeline`, `message`, `ip`, `created_at`, `lead_source`.
