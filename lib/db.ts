/**
 * Couche DB unifiée :
 *   - DATABASE_URL non défini  → SQLite local (dev)
 *   - DATABASE_URL=mysql://... → MySQL IONOS (prod)
 */

export interface DbClient {
  get<T>(table: string, orderBy?: string, dir?: 'asc' | 'desc'): Promise<T[]>
  getById<T>(table: string, id: string): Promise<T | null>
  insert<T>(table: string, data: Record<string, unknown>): Promise<T>
  update<T>(table: string, id: string, data: Record<string, unknown>): Promise<T | null>
  delete(table: string, id: string): Promise<void>
}

function makeAsyncLocal(): DbClient {
  // better-sqlite3 est synchrone — on wrappe en async pour l'interface uniforme
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { localDb } = require('./local-db') as typeof import('./local-db')
  return {
    get:      async (t, o, d)    => localDb.get(t, o, d),
    getById:  async (t, id)      => localDb.getById(t, id),
    insert:   async (t, data)    => localDb.insert(t, data),
    update:   async (t, id, data)=> localDb.update(t, id, data),
    delete:   async (t, id)      => { localDb.delete(t, id) },
  }
}

function makeMysqlClient(): DbClient {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { mysqlDb } = require('./mysql-db') as typeof import('./mysql-db')
  return mysqlDb
}

const DATABASE_URL = process.env.DATABASE_URL || ''

export const db: DbClient = DATABASE_URL.startsWith('mysql')
  ? makeMysqlClient()
  : makeAsyncLocal()
