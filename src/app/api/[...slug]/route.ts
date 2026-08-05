// AUTO-GENERATED API ROUTER — DO NOT EDIT MANUALLY
// Consolidated 88 route files into 1 serverless function for Vercel Hobby plan

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

// Routes excluded from rate limiting
const RATE_LIMIT_EXEMPT = new Set(['ping', 'setup', 'debug-env', 'debug-zai', 'admin', 'mendeley/callback', 'cloud-drive/callback'])

import * as h_academy_db_annas_archive from '@/app/api/academy-db/annas-archive/handler'
import * as h_academy_db_libgen_im from '@/app/api/academy-db/libgen-im/handler'
import * as h_academy_db_libguides from '@/app/api/academy-db/libguides/handler'
import * as h_academy_db_welib from '@/app/api/academy-db/welib/handler'
import * as h_admin_secret_action from '@/app/api/admin/[secret]/[...action]/handler'
import * as h_agile_roadmap from '@/app/api/agile-roadmap/handler'
import * as h_ai_aggregate from '@/app/api/ai-aggregate/handler'
import * as h_ai_status from '@/app/api/ai-status/handler'
import * as h_ai_writing from '@/app/api/ai-writing/handler'
import * as h_asr_transcribe from '@/app/api/asr/transcribe/handler'
import * as h_auth_activate from '@/app/api/auth/activate/handler'
import * as h_auth_admin_generate from '@/app/api/auth/admin/generate/handler'
import * as h_auth_admin_keys from '@/app/api/auth/admin/keys/handler'
import * as h_auth_auth0_authorize from '@/app/api/auth/auth0/authorize/handler'
import * as h_auth_auth0_callback from '@/app/api/auth/auth0/callback/handler'
import * as h_auth_auth0_userinfo from '@/app/api/auth/auth0/userinfo/handler'
import * as h_auth_deactivate from '@/app/api/auth/deactivate/handler'
import * as h_auth_providers from '@/app/api/auth/providers/handler'
import * as h_auth_providers_accounts from '@/app/api/auth/providers/accounts/handler'
import * as h_auth_status from '@/app/api/auth/status/handler'
import * as h_auth_stytch_send_magic_link from '@/app/api/auth/stytch/send-magic-link/handler'
import * as h_auth_stytch_send_otp from '@/app/api/auth/stytch/send-otp/handler'
import * as h_auth_stytch_verify_magic_link from '@/app/api/auth/stytch/verify-magic-link/handler'
import * as h_auth_stytch_verify_otp from '@/app/api/auth/stytch/verify-otp/handler'
import * as h_auth_warrant_check from '@/app/api/auth/warrant/check/handler'
import * as h_auth_warrant_policies from '@/app/api/auth/warrant/policies/handler'
import * as h_automation_agents_execute from '@/app/api/automation/agents/execute/handler'
import * as h_automation_pipeline from '@/app/api/automation/pipeline/handler'
import * as h_cadrage from '@/app/api/cadrage/handler'
import * as h_cadrage_generate from '@/app/api/cadrage/generate/handler'
import * as h_cadrage_reformulate from '@/app/api/cadrage/reformulate/handler'
import * as h_cadrage_validate from '@/app/api/cadrage/validate/handler'
import * as h_cadrage_verify from '@/app/api/cadrage/verify/handler'
import * as h_cloud_drive_callback from '@/app/api/cloud-drive/callback/handler'
import * as h_cloud_drive_connect from '@/app/api/cloud-drive/connect/handler'
import * as h_cloud_drive_disconnect from '@/app/api/cloud-drive/disconnect/handler'
import * as h_cloud_drive_files from '@/app/api/cloud-drive/files/handler'
import * as h_cloud_drive_status from '@/app/api/cloud-drive/status/handler'
import * as h_consensus from '@/app/api/consensus/handler'
import * as h_consensus_config from '@/app/api/consensus/config/handler'
import * as h_consensus_mistral_config from '@/app/api/consensus/mistral-config/handler'
import * as h_debug_env from '@/app/api/debug-env/handler'
import * as h_debug_zai from '@/app/api/debug-zai/handler'
import * as h_directeur from '@/app/api/directeur/handler'
import * as h_directeur_chat from '@/app/api/directeur-chat/handler'
import * as h_download from '@/app/api/download/handler'
import * as h_export_pdf from '@/app/api/export-pdf/handler'
import * as h_generate_latex from '@/app/api/generate-latex/handler'
import * as h_grammar_check from '@/app/api/grammar-check/handler'
import * as h_guidance from '@/app/api/guidance/handler'
import * as h_harper_lint from '@/app/api/harper-lint/handler'
import * as h_humanizer from '@/app/api/humanizer/handler'
import * as h_journal_finder from '@/app/api/journal-finder/handler'
import * as h_literature_search from '@/app/api/literature-search/handler'
import * as h_literature_search_consensus from '@/app/api/literature-search/consensus/handler'
import * as h_literature_search_doi_lookup from '@/app/api/literature-search/doi-lookup/handler'
import * as h_literature_search_recommend from '@/app/api/literature-search/recommend/handler'
import * as h_literature_search_related from '@/app/api/literature-search/related/handler'
import * as h_mendeley_auth from '@/app/api/mendeley/auth/handler'
import * as h_mendeley_callback from '@/app/api/mendeley/callback/handler'
import * as h_mendeley_disconnect from '@/app/api/mendeley/disconnect/handler'
import * as h_mendeley_documents from '@/app/api/mendeley/documents/handler'
import * as h_mendeley_search from '@/app/api/mendeley/search/handler'
import * as h_notebook_ask from '@/app/api/notebook/ask/handler'
import * as h_notebook_entries from '@/app/api/notebook/entries/handler'
import * as h_notebook_sources from '@/app/api/notebook/sources/handler'
import * as h_office_export_docx from '@/app/api/office/export-docx/handler'
import * as h_office_export_pptx from '@/app/api/office/export-pptx/handler'
import * as h_office_export_xlsx from '@/app/api/office/export-xlsx/handler'
import * as h_ping from '@/app/api/ping/handler'
import * as h_references from '@/app/api/references/handler'
import * as h_references_bibtex from '@/app/api/references/bibtex/handler'
import * as h_references_claim_check from '@/app/api/references/claim-check/handler'
import * as h_references_import_bibtex from '@/app/api/references/import-bibtex/handler'
import * as h_references_verify from '@/app/api/references/verify/handler'
import * as h_root from '@/app/api/handler'
import * as h_setup from '@/app/api/setup/handler'
import * as h_thesis from '@/app/api/thesis/handler'
import * as h_thesis_apply_template from '@/app/api/thesis/apply-template/handler'
import * as h_thesis_assistant from '@/app/api/thesis-assistant/handler'
import * as h_thesis_chapters from '@/app/api/thesis/chapters/handler'
import * as h_thesis_chapters_chapterId from '@/app/api/thesis/chapters/[chapterId]/handler'
import * as h_thesis_parts from '@/app/api/thesis/parts/handler'
import * as h_thesis_parts_partId from '@/app/api/thesis/parts/[partId]/handler'
import * as h_thesis_seed from '@/app/api/thesis/seed/handler'
import * as h_thesis_search_index from '@/app/api/thesis-search/index/handler'
import * as h_thesis_search_search from '@/app/api/thesis-search/search/handler'
import * as h_thesis_switch_mode from '@/app/api/thesis/switch-mode/handler'

// ─── Route definitions ───────────────────────────────────────────────
// Each route: [patternSegments, handlerMap, dynamicParamNames?, isCatchAll?, catchAllParamName?]
// null in pattern = wildcard (matches any value)

const ROUTES: Array<{
  segs: (string | null)[]
  h: Record<string, Function>
  pNames?: string[]
  isCatchAll?: boolean
  restParam?: string
}> = [
  // --- Catch-all routes (longest match first) ---
  { segs: ['admin', null], h: { GET: h_admin_secret_action.GET }, pNames: ['secret'], isCatchAll: true, restParam: 'action' },

  // --- 3-segment dynamic ---
  { segs: ['thesis', 'chapters', null], h: { GET: h_thesis_chapters_chapterId.GET, PATCH: h_thesis_chapters_chapterId.PATCH, DELETE: h_thesis_chapters_chapterId.DELETE }, pNames: ['chapterId'] },
  { segs: ['thesis', 'parts', null], h: { DELETE: h_thesis_parts_partId.DELETE }, pNames: ['partId'] },

  // --- 3-segment static ---
  { segs: ['academy-db', 'annas-archive'], h: { GET: h_academy_db_annas_archive.GET } },
  { segs: ['academy-db', 'libgen-im'], h: { GET: h_academy_db_libgen_im.GET } },
  { segs: ['academy-db', 'libguides'], h: { GET: h_academy_db_libguides.GET } },
  { segs: ['academy-db', 'welib'], h: { GET: h_academy_db_welib.GET } },
  { segs: ['asr', 'transcribe'], h: { POST: h_asr_transcribe.POST } },
  { segs: ['auth', 'activate'], h: { POST: h_auth_activate.POST } },
  { segs: ['auth', 'admin', 'generate'], h: { POST: h_auth_admin_generate.POST } },
  { segs: ['auth', 'admin', 'keys'], h: { GET: h_auth_admin_keys.GET, POST: h_auth_admin_keys.POST, DELETE: h_auth_admin_keys.DELETE } },
  { segs: ['auth', 'auth0', 'authorize'], h: { GET: h_auth_auth0_authorize.GET } },
  { segs: ['auth', 'auth0', 'callback'], h: { GET: h_auth_auth0_callback.GET } },
  { segs: ['auth', 'auth0', 'userinfo'], h: { GET: h_auth_auth0_userinfo.GET } },
  { segs: ['auth', 'deactivate'], h: { POST: h_auth_deactivate.POST } },
  { segs: ['auth', 'providers'], h: { GET: h_auth_providers.GET, POST: h_auth_providers.POST, DELETE: h_auth_providers.DELETE } },
  { segs: ['auth', 'providers', 'accounts'], h: { GET: h_auth_providers_accounts.GET } },
  { segs: ['auth', 'status'], h: { GET: h_auth_status.GET } },
  { segs: ['auth', 'stytch', 'send-magic-link'], h: { POST: h_auth_stytch_send_magic_link.POST } },
  { segs: ['auth', 'stytch', 'send-otp'], h: { POST: h_auth_stytch_send_otp.POST } },
  { segs: ['auth', 'stytch', 'verify-magic-link'], h: { POST: h_auth_stytch_verify_magic_link.POST } },
  { segs: ['auth', 'stytch', 'verify-otp'], h: { POST: h_auth_stytch_verify_otp.POST } },
  { segs: ['auth', 'warrant', 'check'], h: { POST: h_auth_warrant_check.POST } },
  { segs: ['auth', 'warrant', 'policies'], h: { GET: h_auth_warrant_policies.GET, POST: h_auth_warrant_policies.POST, PUT: h_auth_warrant_policies.PUT, DELETE: h_auth_warrant_policies.DELETE } },
  { segs: ['automation', 'agents', 'execute'], h: { POST: h_automation_agents_execute.POST } },
  { segs: ['automation', 'pipeline'], h: { POST: h_automation_pipeline.POST } },
  { segs: ['cadrage', 'generate'], h: { POST: h_cadrage_generate.POST } },
  { segs: ['cadrage', 'reformulate'], h: { POST: h_cadrage_reformulate.POST } },
  { segs: ['cadrage', 'validate'], h: { POST: h_cadrage_validate.POST } },
  { segs: ['cadrage', 'verify'], h: { POST: h_cadrage_verify.POST } },
  { segs: ['cloud-drive', 'callback'], h: { GET: h_cloud_drive_callback.GET } },
  { segs: ['cloud-drive', 'connect'], h: { GET: h_cloud_drive_connect.GET } },
  { segs: ['cloud-drive', 'disconnect'], h: { POST: h_cloud_drive_disconnect.POST } },
  { segs: ['cloud-drive', 'files'], h: { GET: h_cloud_drive_files.GET } },
  { segs: ['cloud-drive', 'status'], h: { GET: h_cloud_drive_status.GET } },
  { segs: ['consensus', 'config'], h: { POST: h_consensus_config.POST, DELETE: h_consensus_config.DELETE } },
  { segs: ['consensus', 'mistral-config'], h: { POST: h_consensus_mistral_config.POST, DELETE: h_consensus_mistral_config.DELETE } },
  { segs: ['literature-search', 'consensus'], h: { POST: h_literature_search_consensus.POST } },
  { segs: ['literature-search', 'doi-lookup'], h: { POST: h_literature_search_doi_lookup.POST } },
  { segs: ['literature-search', 'recommend'], h: { POST: h_literature_search_recommend.POST } },
  { segs: ['literature-search', 'related'], h: { POST: h_literature_search_related.POST } },
  { segs: ['mendeley', 'auth'], h: { GET: h_mendeley_auth.GET, POST: h_mendeley_auth.POST } },
  { segs: ['mendeley', 'callback'], h: { GET: h_mendeley_callback.GET } },
  { segs: ['mendeley', 'disconnect'], h: { POST: h_mendeley_disconnect.POST } },
  { segs: ['mendeley', 'documents'], h: { GET: h_mendeley_documents.GET } },
  { segs: ['mendeley', 'search'], h: { GET: h_mendeley_search.GET } },
  { segs: ['notebook', 'ask'], h: { POST: h_notebook_ask.POST } },
  { segs: ['notebook', 'entries'], h: { GET: h_notebook_entries.GET, DELETE: h_notebook_entries.DELETE } },
  { segs: ['notebook', 'sources'], h: { GET: h_notebook_sources.GET, POST: h_notebook_sources.POST, PUT: h_notebook_sources.PUT, DELETE: h_notebook_sources.DELETE } },
  { segs: ['office', 'export-docx'], h: { POST: h_office_export_docx.POST } },
  { segs: ['office', 'export-pptx'], h: { POST: h_office_export_pptx.POST } },
  { segs: ['office', 'export-xlsx'], h: { POST: h_office_export_xlsx.POST } },
  { segs: ['references', 'bibtex'], h: { GET: h_references_bibtex.GET } },
  { segs: ['references', 'claim-check'], h: { POST: h_references_claim_check.POST } },
  { segs: ['references', 'import-bibtex'], h: { POST: h_references_import_bibtex.POST } },
  { segs: ['references', 'verify'], h: { POST: h_references_verify.POST } },
  { segs: ['thesis', 'apply-template'], h: { POST: h_thesis_apply_template.POST } },
  { segs: ['thesis', 'chapters'], h: { POST: h_thesis_chapters.POST, PATCH: h_thesis_chapters.PATCH } },
  { segs: ['thesis', 'parts'], h: { POST: h_thesis_parts.POST, PATCH: h_thesis_parts.PATCH } },
  { segs: ['thesis', 'seed'], h: { POST: h_thesis_seed.POST } },
  { segs: ['thesis', 'switch-mode'], h: { POST: h_thesis_switch_mode.POST } },
  { segs: ['thesis-search', 'index'], h: { POST: h_thesis_search_index.POST } },
  { segs: ['thesis-search', 'search'], h: { GET: h_thesis_search_search.GET } },

  // --- 1-segment static (shortest, lowest priority) ---
  { segs: ['agile-roadmap'], h: { GET: h_agile_roadmap.GET, PATCH: h_agile_roadmap.PATCH, DELETE: h_agile_roadmap.DELETE, POST: h_agile_roadmap.POST } },
  { segs: ['ai-aggregate'], h: { POST: h_ai_aggregate.POST } },
  { segs: ['ai-status'], h: { GET: h_ai_status.GET } },
  { segs: ['ai-writing'], h: { POST: h_ai_writing.POST, DELETE: h_ai_writing.DELETE } },
  { segs: ['cadrage'], h: { GET: h_cadrage.GET, PUT: h_cadrage.PUT } },
  { segs: ['consensus'], h: { GET: h_consensus.GET, POST: h_consensus.POST } },
  { segs: ['debug-env'], h: { GET: h_debug_env.GET } },
  { segs: ['debug-zai'], h: { GET: h_debug_zai.GET } },
  { segs: ['directeur'], h: { POST: h_directeur.POST } },
  { segs: ['directeur-chat'], h: { POST: h_directeur_chat.POST, DELETE: h_directeur_chat.DELETE } },
  { segs: ['download'], h: { GET: h_download.GET } },
  { segs: ['export-pdf'], h: { POST: h_export_pdf.POST } },
  { segs: ['generate-latex'], h: { POST: h_generate_latex.POST } },
  { segs: ['grammar-check'], h: { POST: h_grammar_check.POST } },
  { segs: ['guidance'], h: { POST: h_guidance.POST } },
  { segs: ['harper-lint'], h: { POST: h_harper_lint.POST } },
  { segs: ['humanizer'], h: { POST: h_humanizer.POST } },
  { segs: ['journal-finder'], h: { POST: h_journal_finder.POST } },
  { segs: ['literature-search'], h: { POST: h_literature_search.POST } },
  { segs: ['ping'], h: { GET: h_ping.GET } },
  { segs: ['references'], h: { GET: h_references.GET, POST: h_references.POST, PUT: h_references.PUT, DELETE: h_references.DELETE } },
  { segs: ['setup'], h: { POST: h_setup.POST } },
  { segs: ['thesis'], h: { GET: h_thesis.GET, PATCH: h_thesis.PATCH } },
  { segs: ['thesis-assistant'], h: { POST: h_thesis_assistant.POST, DELETE: h_thesis_assistant.DELETE } },

  // --- Root ---
  { segs: [], h: { GET: h_root.GET } },
]

// ─── Matcher ──────────────────────────────────────────────────────────

function matchRoute(slug: string[]): { h: Record<string, Function>; params: Record<string, any> } | null {
  for (const route of ROUTES) {
    // Catch-all route
    if (route.isCatchAll) {
      if (slug.length < route.segs.length) continue
      const params: Record<string, any> = {}
      let ok = true
      let pIdx = 0
      for (let i = 0; i < route.segs.length; i++) {
        if (route.segs[i] === null) {
          params[route.pNames![pIdx]] = slug[i]
          pIdx++
        } else if (route.segs[i] !== slug[i]) {
          ok = false
          break
        }
      }
      if (ok) {
        params[route.restParam!] = slug.slice(route.segs.length)
        return { h: route.h, params }
      }
      continue
    }

    // Exact-length match (static or dynamic)
    if (slug.length !== route.segs.length) continue
    const params: Record<string, any> = {}
    let ok = true
    let pIdx = 0
    for (let i = 0; i < route.segs.length; i++) {
      if (route.segs[i] === null) {
        params[route.pNames![pIdx]] = slug[i]
        pIdx++
      } else if (route.segs[i] !== slug[i]) {
        ok = false
        break
      }
    }
    if (ok) return { h: route.h, params }
  }
  return null
}

// ─── Route segment config ─────────────────────────────────────────────

export const dynamic = 'force-dynamic'

// ─── HTTP method handlers ─────────────────────────────────────────────

async function dispatch(method: string, req: NextRequest) {
  const url = new URL(req.url)
  const pathname = url.pathname
  const slugStr = pathname.startsWith('/api/') ? pathname.slice(5) : pathname.slice(1)
  const slug = slugStr ? slugStr.split('/').filter(Boolean) : []

  // Rate limiting (skip exempt routes)
  const routeRoot = slug[0] || ''
  const routePath2 = slug.slice(0, 2).join('/')
  const isExempt = RATE_LIMIT_EXEMPT.has(routeRoot) || RATE_LIMIT_EXEMPT.has(routePath2)
  let rl = isExempt ? null : checkRateLimit(req, slug)

  const match = matchRoute(slug)
  if (!match) {
    const headers = rl?.headers || {}
    return new NextResponse(
      JSON.stringify({ error: 'Not Found', path: pathname }),
      { status: 404, headers }
    )
  }

  const handler = match.h[method]
  if (!handler || typeof handler !== 'function') {
    const headers = rl?.headers || {}
    return new NextResponse(
      JSON.stringify({ error: 'Method Not Allowed', path: pathname, method }),
      { status: 405, headers }
    )
  }

  // Block if rate limited
  if (rl && !rl.allowed) {
    return NextResponse.json(
      { error: 'Too Many Requests', retryAfter: rl.resetSeconds },
      {
        status: 429,
        headers: {
          ...rl.headers,
          'Retry-After': String(rl.resetSeconds),
        },
      }
    )
  }

  const response = await handler(req, { params: Promise.resolve(match.params) })

  // Attach rate limit headers to successful responses
  if (rl && response && typeof response === 'object' && 'headers' in response) {
    for (const [k, v] of Object.entries(rl.headers)) {
      ;(response as NextResponse).headers.set(k, v)
    }
  }
  return response
}

export async function GET(req: NextRequest) { return dispatch('GET', req) }
export async function POST(req: NextRequest) { return dispatch('POST', req) }
export async function PUT(req: NextRequest) { return dispatch('PUT', req) }
export async function PATCH(req: NextRequest) { return dispatch('PATCH', req) }
export async function DELETE(req: NextRequest) { return dispatch('DELETE', req) }
export async function OPTIONS(req: NextRequest) {
  const url = new URL(req.url)
  const pathname = url.pathname
  const slugStr = pathname.startsWith('/api/') ? pathname.slice(5) : pathname.slice(1)
  const slug = slugStr ? slugStr.split('/').filter(Boolean) : []
  const match = matchRoute(slug)
  if (!match) return new NextResponse(null, { status: 404 })
  const methods = Object.keys(match.h).filter(k => typeof match.h[k] === 'function')
  return new NextResponse(null, { status: 204, headers: { Allow: methods.join(', ') } })
}
