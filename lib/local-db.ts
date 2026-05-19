import Database from 'better-sqlite3'
import path from 'path'
import { randomUUID } from 'crypto'

const DB_PATH = path.join(process.cwd(), 'local.db')

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    initSchema(_db)
    seedData(_db)
  }
  return _db
}

function seedData(db: Database.Database) {
  const hasSiteProjects = (db.prepare("SELECT COUNT(*) as c FROM site_projects").get() as { c: number }).c > 0
  if (!hasSiteProjects) {
    const sp = db.prepare("INSERT INTO site_projects (id,title,image,link,is_live,sort_order) VALUES (?,?,?,?,?,?)")
    const seedProjects = [
      ['sp-12','Chez Ramo','./images/Chez Ramo.png','https://xeloriom-sketch.github.io/chezramo/',1,0],
      ['sp-8','Daftar','./images/daftar.png','https://apidaftar.com',1,1],
      ['sp-10','ON Coaching','./images/ON Coaching.png','https://oncoaching.fr',1,2],
      ['sp-1','ARLEA Promotion','./images/ARLEA Promotion.png','https://arleapromotion.com',1,3],
      ['sp-11','Mosquée Es-Salam','./images/Mosquée Es-Salam.png','http://mosquee-essalem.fr',1,4],
      ['sp-2','Xpertive','./images/Xpertive.png','https://xpertive.com',1,5],
      ['sp-13','LuxFlora','./images/LuxFlora.png','https://xeloriom.github.io/LuxFlora/',1,6],
    ]
    const tx = db.transaction(() => { seedProjects.forEach(p => sp.run(...p)) })
    tx()
  }

  const hasSiteServices = (db.prepare("SELECT COUNT(*) as c FROM site_services").get() as { c: number }).c > 0
  if (!hasSiteServices) {
    const ss = db.prepare("INSERT INTO site_services (id,title_main,title_sub,features,metrics,tabs,sort_order,active) VALUES (?,?,?,?,?,?,?,?)")
    const seedServices = [
      ['ss-1','Identité','de Marque',
        JSON.stringify(['Logo SVG','Charte graphique','Typographie','Palette couleurs','Brandbook','Motion design']),
        JSON.stringify([{label:'Reconnaissance marque',value:94},{label:'Cohérence visuelle',value:98},{label:'ROI branding moyen',value:82}]),
        JSON.stringify([{name:'Logo',text:'Notre équipe crée des logos uniques qui capturent votre essence.'},{name:'Typo',text:'Nous sélectionnons des polices qui parlent le langage de votre marque.'},{name:'Couleurs',text:'Des palettes stratégiques pour susciter les bonnes émotions.'},{name:'Ton',text:'Une voix de marque cohérente à travers tous vos messages.'},{name:'Guide',text:'Une charte graphique complète pour votre univers visuel.'}]),
        0,1],
      ['ss-2','Expérience','Digitale',
        JSON.stringify(['Design UI/UX','Prototypage','Design system','Tests utilisateurs','Accessibilité','Responsive']),
        JSON.stringify([{label:'Satisfaction utilisateur',value:96},{label:'Réduction taux de rebond',value:71},{label:'Conversion optimisée',value:88}]),
        JSON.stringify([{name:'Design UI',text:"Conception d'interfaces privilégiant le plaisir de l'utilisateur."},{name:'Recherche UX',text:'Décisions basées sur la data pour des flux fluides.'},{name:'Prototypage',text:'Maquettes interactives pour valider avant de développer.'},{name:'Design system',text:'Un langage visuel cohérent, scalable, réutilisable.'}]),
        1,1],
      ['ss-3','Développement','Web',
        JSON.stringify(['Next.js / React','TypeScript','Animations Framer','API & backend','CMS headless','Déploiement']),
        JSON.stringify([{label:'Score Lighthouse',value:97},{label:'Uptime garanti',value:99},{label:'Temps de livraison',value:90}]),
        JSON.stringify([{name:'Frontend',text:'Next.js, React, Tailwind — les meilleures stacks du marché.'},{name:'Animations',text:'Framer Motion pour des expériences qui marquent les esprits.'},{name:'Performance',text:'Score Lighthouse 95+ garanti sur tous nos projets.'},{name:'CMS',text:'Sanity, Contentful — vous gérez le contenu en toute autonomie.'}]),
        2,1],
      ['ss-4','Stratégie','Digitale',
        JSON.stringify(['Audit SEO','Tunnel de conversion','Analytics','A/B testing','Growth hacking','Reporting']),
        JSON.stringify([{label:'Croissance trafic organique',value:86},{label:'Taux de conversion',value:74},{label:'ROI campagnes',value:92}]),
        JSON.stringify([{name:'SEO',text:"Audit technique complet et stratégie de contenu pour dominer Google."},{name:'Analytics',text:'Tableaux de bord temps réel pour piloter votre croissance.'},{name:'Conversion',text:'Optimisation du tunnel pour maximiser chaque visite.'},{name:'Growth',text:'Stratégies data-driven pour une croissance durable.'}]),
        3,1],
    ]
    const tx = db.transaction(() => { seedServices.forEach(s => ss.run(...s)) })
    tx()
  }
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT, client TEXT, year TEXT, category TEXT, status TEXT,
      description TEXT, links TEXT, metrics TEXT, notes TEXT,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS site_projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      image TEXT,
      link TEXT,
      is_live INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS site_services (
      id TEXT PRIMARY KEY,
      title_main TEXT NOT NULL,
      title_sub TEXT,
      features TEXT,
      metrics TEXT,
      tabs TEXT,
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT, project_id TEXT, priority TEXT, status TEXT, kanban_column TEXT,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender TEXT, subject TEXT, body TEXT, time TEXT, is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      client_name TEXT, client_email TEXT, client_phone TEXT,
      date TEXT, time TEXT, duration TEXT, service TEXT,
      status TEXT DEFAULT 'pending', notes TEXT,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS knowledge_base (
      id TEXT PRIMARY KEY,
      problem TEXT, solution TEXT, tags TEXT,
      project_id TEXT, client_name TEXT, severity TEXT DEFAULT 'medium',
      url TEXT, image_url TEXT, video_url TEXT,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
      updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id TEXT PRIMARY KEY,
      type TEXT, payload TEXT, subject TEXT, is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      name TEXT, provider TEXT, category TEXT,
      price_monthly REAL DEFAULT 0, price_yearly REAL DEFAULT 0,
      billing_cycle TEXT DEFAULT 'monthly', status TEXT DEFAULT 'active',
      next_billing_date TEXT, auto_renew INTEGER DEFAULT 1,
      notes TEXT, url TEXT,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      candidate_name TEXT, candidate_email TEXT, candidate_phone TEXT,
      role TEXT, experience TEXT, contract_type TEXT, portfolio TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
  `)
}

const JSON_FIELDS: Record<string, string[]> = {
  projects: ['links', 'metrics', 'notes'],
  knowledge_base: ['tags'],
  site_services: ['features', 'metrics', 'tabs'],
}

const BOOL_FIELDS = ['is_read', 'auto_renew', 'is_live', 'active']

const ALLOWED_TABLES = new Set([
  'projects', 'tasks', 'messages', 'appointments',
  'knowledge_base', 'contact_submissions', 'subscriptions', 'applications',
  'site_projects', 'site_services',
])

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

function assertTable(table: string) {
  if (!ALLOWED_TABLES.has(table)) throw new Error(`Unknown table: ${table}`)
}

const TABLE_ORDER: Record<string, { col: string; dir: 'asc' | 'desc' }> = {
  site_projects: { col: 'sort_order', dir: 'asc' },
  site_services: { col: 'sort_order', dir: 'asc' },
}

export const localDb = {
  get<T>(table: string, orderBy?: string, dir?: 'asc' | 'desc'): T[] {
    assertTable(table)
    const def = TABLE_ORDER[table] || { col: 'created_at', dir: 'desc' }
    const col = orderBy ?? def.col
    const d = dir ?? def.dir
    const rows = getDb()
      .prepare(`SELECT * FROM "${table}" ORDER BY "${col}" ${d.toUpperCase()}`)
      .all() as Record<string, unknown>[]
    return rows.map(r => parseRow(table, r)) as T[]
  },

  getById<T>(table: string, id: string): T | null {
    assertTable(table)
    const row = getDb()
      .prepare(`SELECT * FROM "${table}" WHERE id = ?`)
      .get(id) as Record<string, unknown> | null
    return row ? parseRow(table, row) as T : null
  },

  insert<T>(table: string, data: Record<string, unknown>): T {
    assertTable(table)
    const row = serializeRow(table, { ...data, id: (data.id as string) || randomUUID() })
    const keys = Object.keys(row)
    getDb()
      .prepare(`INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(',')}) VALUES (${keys.map(() => '?').join(',')})`)
      .run(...Object.values(row))
    return parseRow(table, row) as T
  },

  update<T>(table: string, id: string, data: Record<string, unknown>): T | null {
    assertTable(table)
    const row = serializeRow(table, data)
    const sets = Object.keys(row).map(k => `"${k}" = ?`).join(', ')
    getDb()
      .prepare(`UPDATE "${table}" SET ${sets} WHERE id = ?`)
      .run(...Object.values(row), id)
    return this.getById(table, id)
  },

  delete(table: string, id: string): void {
    assertTable(table)
    getDb().prepare(`DELETE FROM "${table}" WHERE id = ?`).run(id)
  },
}
