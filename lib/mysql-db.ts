import mysql from 'mysql2/promise'
import { randomUUID } from 'crypto'

// Connexion pool unique (partagée entre les requêtes)
let pool: mysql.Pool | null = null

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL!)
  }
  return pool
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name TEXT, client TEXT, year VARCHAR(10),
    category TEXT, status VARCHAR(50), description TEXT,
    links JSON, metrics JSON, notes JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    title TEXT, project_id VARCHAR(36), priority VARCHAR(20),
    status VARCHAR(30), kanban_column VARCHAR(30),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    sender TEXT, subject TEXT, body TEXT, time VARCHAR(20),
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    client_name TEXT, client_email TEXT, client_phone TEXT,
    date VARCHAR(20), time VARCHAR(20), duration VARCHAR(20),
    service TEXT, status VARCHAR(30) DEFAULT 'pending', notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS knowledge_base (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    problem TEXT, solution TEXT, tags JSON,
    project_id VARCHAR(36), client_name TEXT,
    severity VARCHAR(20) DEFAULT 'medium',
    url TEXT, image_url TEXT, video_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    type VARCHAR(30), payload TEXT, subject TEXT,
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name TEXT, provider TEXT, category VARCHAR(30),
    price_monthly DECIMAL(10,2) DEFAULT 0,
    price_yearly DECIMAL(10,2) DEFAULT 0,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    status VARCHAR(20) DEFAULT 'active',
    next_billing_date VARCHAR(20),
    auto_renew TINYINT(1) DEFAULT 1,
    notes TEXT, url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    candidate_name TEXT, candidate_email TEXT, candidate_phone TEXT,
    role TEXT, experience TEXT, contract_type TEXT,
    portfolio TEXT, status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS site_projects (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    title TEXT, image TEXT, link TEXT,
    is_live TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 99,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS site_services (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    title_main TEXT, title_sub TEXT,
    features JSON, metrics JSON, tabs JSON,
    sort_order INT DEFAULT 99,
    active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sent_emails (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    to_email TEXT, to_name TEXT, from_name TEXT,
    subject TEXT, message TEXT,
    is_opened TINYINT(1) DEFAULT 0,
    opened_at DATETIME,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`

let schemaInit = false

async function ensureSchema() {
  if (schemaInit) return
  const pool = getPool()
  for (const stmt of SCHEMA.split(';').map(s => s.trim()).filter(Boolean)) {
    await pool.execute(stmt)
  }
  schemaInit = true
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const JSON_FIELDS: Record<string, string[]> = {
  projects: ['links', 'metrics', 'notes'],
  knowledge_base: ['tags'],
  site_services: ['features', 'metrics', 'tabs'],
}
const BOOL_FIELDS = ['is_read', 'auto_renew', 'is_opened']
const ALLOWED_TABLES = new Set([
  'projects', 'tasks', 'messages', 'appointments',
  'knowledge_base', 'contact_submissions', 'subscriptions', 'applications',
  'site_projects', 'site_services', 'sent_emails',
])

function assertTable(table: string) {
  if (!ALLOWED_TABLES.has(table)) throw new Error(`Unknown table: ${table}`)
}

function parseRow(table: string, row: Record<string, unknown>): Record<string, unknown> {
  const out = { ...row }
  for (const f of (JSON_FIELDS[table] || [])) {
    if (typeof out[f] === 'string') {
      try { out[f] = JSON.parse(out[f] as string) } catch { /* keep raw */ }
    }
  }
  for (const f of BOOL_FIELDS) {
    if (f in out) out[f] = out[f] === 1 || out[f] === true
  }
  return out
}

function serializeRow(table: string, row: Record<string, unknown>): Record<string, unknown> {
  const out = { ...row }
  for (const f of (JSON_FIELDS[table] || [])) {
    if (out[f] !== undefined && typeof out[f] !== 'string') {
      out[f] = JSON.stringify(out[f])
    }
  }
  return out
}

// ─── DB Client ────────────────────────────────────────────────────────────────

export const mysqlDb = {
  async get<T>(table: string, orderBy?: string, dir?: 'asc' | 'desc'): Promise<T[]> {
    assertTable(table)
    await ensureSchema()
    const SORT_ORDER_TABLES = ['site_projects', 'site_services']
    const col = orderBy ?? (SORT_ORDER_TABLES.includes(table) ? 'sort_order' : 'created_at')
    const direction = (dir ?? (SORT_ORDER_TABLES.includes(table) ? 'asc' : 'desc')).toUpperCase()
    const [rows] = await getPool().execute(
      `SELECT * FROM \`${table}\` ORDER BY \`${col}\` ${direction}`
    )
    return (rows as Record<string, unknown>[]).map(r => parseRow(table, r)) as T[]
  },

  async getById<T>(table: string, id: string): Promise<T | null> {
    assertTable(table)
    await ensureSchema()
    const [rows] = await getPool().execute(`SELECT * FROM \`${table}\` WHERE id = ?`, [id])
    const arr = rows as Record<string, unknown>[]
    return arr.length > 0 ? parseRow(table, arr[0]) as T : null
  },

  async insert<T>(table: string, data: Record<string, unknown>): Promise<T> {
    assertTable(table)
    await ensureSchema()
    const row = serializeRow(table, { ...data, id: (data.id as string) || randomUUID() })
    const keys = Object.keys(row)
    const placeholders = keys.map(() => '?').join(', ')
    await getPool().execute(
      `INSERT INTO \`${table}\` (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`,
      Object.values(row) as mysql.ExecuteValues
    )
    return parseRow(table, row) as T
  },

  async update<T>(table: string, id: string, data: Record<string, unknown>): Promise<T | null> {
    assertTable(table)
    await ensureSchema()
    const row = serializeRow(table, data)
    const sets = Object.keys(row).map(k => `\`${k}\` = ?`).join(', ')
    await getPool().execute(`UPDATE \`${table}\` SET ${sets} WHERE id = ?`, [...Object.values(row), id] as mysql.ExecuteValues)
    return this.getById(table, id)
  },

  async delete(table: string, id: string): Promise<void> {
    assertTable(table)
    await ensureSchema()
    await getPool().execute(`DELETE FROM \`${table}\` WHERE id = ?`, [id])
  },
}
