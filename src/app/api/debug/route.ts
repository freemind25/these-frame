import { NextResponse } from 'next/server'
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { tmpdir } from 'os'

export async function GET() {
  const info: Record<string, unknown> = {
    cwd: process.cwd(),
    tmpdir: tmpdir(),
    env_DATABASE_URL: process.env.DATABASE_URL || '(not set)',
    node_env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    platform: process.platform,
  }

  // Test /tmp write
  const testPath = '/tmp/thesis-test.txt'
  try {
    mkdirSync('/tmp', { recursive: true })
    writeFileSync(testPath, 'ok')
    info.tmp_write = 'OK'
    info.tmp_read = readFileSync(testPath, 'utf-8')
    unlinkSync(testPath)
  } catch (e) {
    info.tmp_write = `FAILED: ${e}`
  }

  // Test os.tmpdir write
  const testPath2 = resolve(tmpdir(), 'thesis-test2.txt')
  try {
    mkdirSync(tmpdir(), { recursive: true })
    writeFileSync(testPath2, 'ok')
    info.os_tmp_write = 'OK'
    unlinkSync(testPath2)
  } catch (e) {
    info.os_tmp_write = `FAILED: ${e}`
  }

  return NextResponse.json(info)
}
