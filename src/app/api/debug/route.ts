import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'
import { mkdirSync } from 'fs'

export async function GET() {
  const results: Record<string, string> = {}

  // Test 1: libSQL with file:/tmp/test.db
  try {
    const c1 = createClient({ url: 'file:/tmp/thesis-libsql-test.db' })
    await c1.execute('CREATE TABLE IF NOT EXISTS t(x INTEGER)')
    await c1.execute('INSERT INTO t VALUES(1)')
    const r = await c1.execute('SELECT * FROM t')
    results['libsql_file:/tmp'] = `OK (${JSON.stringify(r.rows)})`
    await c1.execute('DROP TABLE t')
    await c1.close()
  } catch (e) {
    results['libsql_file:/tmp'] = `FAILED: ${e}`
  }

  // Test 2: libSQL with file:///tmp/test.db (3 slashes)
  try {
    const c2 = createClient({ url: 'file:///tmp/thesis-libsql-test2.db' })
    await c2.execute('CREATE TABLE IF NOT EXISTS t(x INTEGER)')
    await c2.execute('INSERT INTO t VALUES(1)')
    const r = await c2.execute('SELECT * FROM t')
    results['libsql_file:///tmp'] = `OK (${JSON.stringify(r.rows)})`
    await c2.execute('DROP TABLE t')
    await c2.close()
  } catch (e) {
    results['libsql_file:///tmp'] = `FAILED: ${e}`
  }

  // Test 3: libSQL with explicit mode=rwc
  try {
    const c3 = createClient({ url: 'file:/tmp/thesis-libsql-test3.db?mode=rwc' })
    await c3.execute('SELECT 1')
    results['libsql_mode=rwc'] = 'OK'
    await c3.close()
  } catch (e) {
    results['libsql_mode=rwc'] = `FAILED: ${e}`
  }

  return NextResponse.json(results)
}
