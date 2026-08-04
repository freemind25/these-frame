// AUTO-GENERATED API ROUTER — DO NOT EDIT MANUALLY
// Consolidated 88 route files into a single serverless function for Vercel Hobby plan

import { NextRequest, NextResponse } from 'next/server'

// ─── Handler imports (alphabetical) ───────────────────────────────────
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
import * as h_references from '@/app/api/references/handler'
import * as h_references_bibtex from '@/app/api/references/bibtex/handler'
import * as h_references_claim_check from '@/app/api/references/claim-check/handler'
import * as h_references_import_bibtex from '@/app/api/references/import-bibtex/handler'
import * as h_references_verify from '@/app/api/references/verify/handler'
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
import * as h_root from '@/app/api/handler'

// ─── Route types ─────────────────────────────────────────────────────

type HandlerMap = Record<string, Function>

interface StaticRoute {
  kind: 'static'
  segments: string[]           // e.g. ['thesis', 'chapters']
  handler: HandlerMap
}

interface DynamicRoute {
  kind: 'dynamic'
  segments: (string | null)[]  // null = wildcard, e.g. ['thesis', 'chapters', null]
  paramNames: string[]         // e.g. ['chapterId']
  handler: HandlerMap
}

interface CatchAllRoute {
  kind: 'catch-all'
  prefix: (string | null)[]    // e.g. ['admin', null]  (null = wildcard)
  prefixParamNames: string[]   // e.g. ['secret']
  restParam: string            // e.g. 'action'
  handler: HandlerMap
}

type Route = StaticRoute | DynamicRoute | CatchAllRoute

// ─── Route table (most-specific first) ───────────────────────────────

const ROUTES: Route[] = [
  // Catch-all routes (highest priority)
  {
    kind: 'catch-all',
    prefix: ['admin', null],
    prefixParamNames: ['secret'],
    restParam: 'action',
    handler: { GET: h_admin_secret_action.GET },
  },

  // 3-segment dynamic routes
  {
    kind: 'dynamic',
    segments: ['thesis', 'chapters', null],
    paramNames: ['chapterId'],
    handler: { GET: h_thesis_chapters_chapterId.GET, PATCH: h_thesis_chapters_chapterId.PATCH, DELETE: h_thesis_chapters_chapterId.DELETE },
  },
  {
    kind: 'dynamic',
    segments: ['thesis', 'parts', null],
    paramNames: ['partId'],
    handler: { DELETE: h_thesis_parts_partId.DELETE },
  },

  // 3-segment static routes
  { kind: 'static', segments: ['academy-db', 'annas-archive'], handler: { GET: h_academy_db_annas_archive.GET } },
  { kind: 'static', segments: ['academy-db', 'libgen-im'], handler: { GET: h_academy_db_libgen_im.GET } },
  { kind: 'static', segments: ['academy-db', 'libguides'], handler: { GET: h_academy_db_libguides.GET } },
  { kind: 'static', segments: ['academy-db', 'welib'], handler: { GET: h_academy_db_welib.GET } },
  { kind: 'static', segments: ['asr', 'transcribe'], handler: { POST: h_asr_transcribe.POST } },
  { kind: 'static', segments: ['auth', 'activate'], handler: { POST: h_auth_activate.POST } },
  { kind: 'static', segments: ['auth', 'admin', 'generate'], handler: { POST: h_auth_admin_generate.POST } },
  { kind: 'static', segments: ['auth', 'admin', 'keys'], handler: { GET: h_auth_admin_keys.GET, POST: h_auth_admin_keys.POST, DELETE: h_auth_admin_keys.DELETE } },
  { kind: 'static', segments: ['auth', 'auth0', 'authorize'], handler: { GET: h_auth_auth0_authorize.GET } },
  { kind: 'static', segments: ['auth', 'auth0', 'callback'], handler: { GET: h_auth_auth0_callback.GET } },
  { kind: 'static', segments: ['auth', 'auth0', 'userinfo'], handler: { GET: h_auth_auth0_userinfo.GET } },
  { kind: 'static', segments: ['auth', 'deactivate'], handler: { POST: h_auth_deactivate.POST } },
  { kind: 'static', segments: ['auth', 'providers'], handler: { GET: h_auth_providers.GET, POST: h_auth_providers.POST, DELETE: h_auth_providers.DELETE } },
  { kind: 'static', segments: ['auth', 'providers', 'accounts'], handler: { GET: h_auth_providers_accounts.GET } },
  { kind: 'static', segments: ['auth', 'status'], handler: { GET: h_auth_status.GET } },
  { kind: 'static', segments: ['auth', 'stytch', 'send-magic-link'], handler: { POST: h_auth_stytch_send_magic_link.POST } },
  { kind: 'static', segments: ['auth', 'stytch', 'send-otp'], handler: { POST: h_auth_stytch_send_otp.POST } },
  { kind: 'static', segments: ['auth', 'stytch', 'verify-magic-link'], handler: { POST: h_auth_stytch_verify_magic_link.POST } },
  { kind: 'static', segments: ['auth', 'stytch', 'verify-otp'], handler: { POST: h_auth_stytch_verify_otp.POST } },
  { kind: 'static', segments: ['auth', 'warrant', 'check'], handler: { POST: h_auth_warrant_check.POST } },
  { kind: 'static', segments: ['auth', 'warrant', 'policies'], handler: { GET: h_auth_warrant_policies.GET, POST: h_auth_warrant_policies.POST, PUT: h_auth_warrant_policies.PUT, DELETE: h_auth_warrant_policies.DELETE } },
  { kind: 'static', segments: ['automation', 'agents', 'execute'], handler: { POST: h_automation_agents_execute.POST } },
  { kind: 'static', segments: ['automation', 'pipeline'], handler: { POST: h_automation_pipeline.POST } },
  { kind: 'static', segments: ['cadrage', 'generate'], handler: { POST: h_cadrage_generate.POST } },
  { kind: 'static', segments: ['cadrage', 'reformulate'], handler: { POST: h_cadrage_reformulate.POST } },
  { kind: 'static', segments: ['cadrage', 'validate'], handler: { POST: h_cadrage_validate.POST } },
  { kind: 'static', segments: ['cadrage', 'verify'], handler: { POST: h_cadrage_verify.POST } },
  { kind: 'static', segments: ['cloud-drive', 'callback'], handler: { GET: h_cloud_drive_callback.GET } },
  { kind: 'static', segments: ['cloud-drive', 'connect'], handler: { GET: h_cloud_drive_connect.GET } },
  { kind: 'static', segments: ['cloud-drive', 'disconnect'], handler: { POST: h_cloud_drive_disconnect.POST } },
  { kind: 'static', segments: ['cloud-drive', 'files'], handler: { GET: h_cloud_drive_files.GET } },
  { kind: 'static', segments: ['cloud-drive', 'status'], handler: { GET: h_cloud_drive_status.GET } },
  { kind: 'static', segments: ['consensus', 'config'], handler: { POST: h_consensus_config.POST, DELETE: h_consensus_config.DELETE } },
  { kind: 'static', segments: ['consensus', 'mistral-config'], handler: { POST: h_consensus_mistral_config.POST, DELETE: h_consensus_mistral_config.DELETE } },
  { kind: 'static', segments: ['literature-search', 'consensus'], handler: { POST: h_literature_search_consensus.POST } },
  { kind: 'static', segments: ['literature-search', 'doi-lookup'], handler: { POST: h_literature_search_doi_lookup.POST } },
  { kind: 'static', segments: ['literature-search', 'recommend'], handler: { POST: h_literature_search_recommend.POST } },
  { kind: 'static', segments: ['literature-search', 'related'], handler: { POST: h_literature_search_related.POST } },
  { kind: 'static', segments: ['mendeley', 'auth'], handler: { GET: h_mendeley_auth.GET, POST: h_mendeley_auth.POST } },
  { kind: 'static', segments: ['mendeley', 'callback'], handler: { GET: h_mendeley_callback.GET } },
  { kind: 'static', segments: ['mendeley', 'disconnect'], handler: { POST: h_mendeley_disconnect.POST } },
  { kind: 'static', segments: ['mendeley', 'documents'], handler: { GET: h_mendeley_documents.GET } },
  { kind: 'static', segments: ['mendeley', 'search'], handler: { GET: h_mendeley_search.GET } },
  { kind: 'static', segments: ['notebook', 'ask'], handler: { POST: h_notebook_ask.POST } },
  { kind: 'static', segments: ['notebook', 'entries'], handler: { GET: h_notebook_entries.GET, DELETE: h_notebook_entries.DELETE } },
  { kind: 'static', segments: ['notebook', 'sources'], handler: { GET: h_notebook_sources.GET, POST: h_notebook_sources.POST, PUT: h_notebook_sources.PUT, DELETE: h_notebook_sources.DELETE } },
  { kind: 'static', segments: ['office', 'export-docx'], handler: { POST: h_office_export_docx.POST } },
  { kind: 'static', segments: ['office', 'export-pptx'], handler: { POST: h_office_export_pptx.POST } },
  { kind: 'static', segments: ['office', 'export-xlsx'], handler: { POST: h_office_export_xlsx.POST } },
  { kind: 'static', segments: ['references', 'bibtex'], handler: { GET: h_references_bibtex.GET } },
  { kind: 'static', segments: ['references', 'claim-check'], handler: { POST: h_references_claim_check.POST } },
  { kind: 'static', segments: ['references', 'import-bibtex'], handler: { POST: h_references_import_bibtex.POST } },
  { kind: 'static', segments: ['references', 'verify'], handler: { POST: h_references_verify.POST } },
  { kind: 'static', segments: ['thesis', 'apply-template'], handler: { POST: h_thesis_apply_template.POST } },
  { kind: 'static', segments: ['thesis', 'chapters'], handler: { POST: h_thesis_chapters.POST, PATCH: h_thesis_chapters.PATCH } },
  { kind: 'static', segments: ['thesis', 'parts'], handler: { POST: h_thesis_parts.POST, PATCH: h_thesis_parts.PATCH } },
  { kind: 'static', segments: ['thesis', 'seed'], handler: { POST: h_thesis_seed.POST } },
  { kind: 'static', segments: ['thesis', 'switch-mode'], handler: { POST: h_thesis_switch_mode.POST } },
  { kind: 'static', segments: ['thesis-search', 'index'], handler: { POST: h_thesis_search_index.POST } },
  { kind: 'static', segments: ['thesis-search', 'search'], handler: { GET: h_thesis_search_search.GET } },

  // 1-segment static routes (shortest, lowest priority)
  { kind: 'static', segments: ['agile-roadmap'], handler: { GET: h_agile_roadmap.GET, PATCH: h_agile_roadmap.PATCH, DELETE: h_agile_roadmap.DELETE, POST: h_agile_roadmap.POST } },
  { kind: 'static', segments: ['ai-aggregate'], handler: { POST: h_ai_aggregate.POST } },
  { kind: 'static', segments: ['ai-status'], handler: { GET: h_ai_status.GET } },
  { kind: 'static', segments: ['ai-writing'], handler: { POST: h_ai_writing.POST, DELETE: h_ai_writing.DELETE } },
  { kind: 'static', segments: ['cadrage'], handler: { GET: h_cadrage.GET, PUT: h_cadrage.PUT } },
  { kind: 'static', segments: ['consensus'], handler: { GET: h_consensus.GET, POST: h_consensus.POST } },
  { kind: 'static', segments: ['debug-env'], handler: { GET: h_debug_env.GET } },
  { kind: 'static', segments: ['debug-zai'], handler: { GET: h_debug_zai.GET } },
  { kind: 'static', segments: ['directeur'], handler: { POST: h_directeur.POST } },
  { kind: 'static', segments: ['directeur-chat'], handler: { POST: h_directeur_chat.POST, DELETE: h_directeur_chat.DELETE } },
  { kind: 'static', segments: ['download'], handler: { GET: h_download.GET } },
  { kind: 'static', segments: ['export-pdf'], handler: { POST: h_export_pdf.POST } },
  { kind: 'static', segments: ['generate-latex'], handler: { POST: h_generate_latex.POST } },
  { kind: 'static', segments: ['grammar-check'], handler: { POST: h_grammar_check.POST } },
  { kind: 'static', segments: ['guidance'], handler: { POST: h_guidance.POST } },
  { kind: 'static', segments: ['harper-lint'], handler: { POST: h_harper_lint.POST } },
  { kind: 'static', segments: ['humanizer'], handler: { POST: h_humanizer.POST } },
  { kind: 'static', segments: ['journal-finder'], handler: { POST: h_journal_finder.POST } },
  { kind: 'static', segments: ['literature-search'], handler: { POST: h_literature_search.POST } },
  { kind: 'static', segments: ['ping'], handler: { GET: h_ping.GET } },
  { kind: 'static', segments: ['references'], handler: { GET: h_references.GET, POST: h_references.POST, PUT: h_references.PUT, DELETE: h_references.DELETE } },
  { kind: 'static', segments: ['setup'], handler: { POST: h_setup.POST } },
  { kind: 'static', segments: ['thesis'], handler: { GET: h_thesis.GET, PATCH: h_thesis.PATCH } },
  { kind: 'static', segments: ['thesis-assistant'], handler: { POST: h_thesis_assistant.POST, DELETE: h_thesis_assistant.DELETE } },

  // Root route (empty slug)
  { kind: 'static', segments: [], handler: { GET: h_root.GET } },
]

// ─── Router ───────────────────────────────────────────────────────────

function matchRoute(slug: string[]): { route: Route; params: Record<string, any> } | null {
  for (const route of ROUTES) {
    if (route.kind === 'catch-all') {
      const r = route as CatchAllRoute
      if (slug.length < r.prefix.length) continue
      const params: Record<string, any> = {}
      let matched = true
      for (let i = 0; i < r.prefix.length; i++) {
        if (r.prefix[i] === null) {
          // Dynamic segment
          params[r.prefixParamNames[i]] = slug[i]
        } else if (r.prefix[i] !== slug[i]) {
          matched = false
          break
        }
      }
      if (matched) {
        params[r.restParam] = slug.slice(r.prefix.length)
        return { route, params }
      }
      continue
    }

    if (route.kind === 'dynamic') {
      const r = route as DynamicRoute
      if (slug.length !== r.segments.length) continue
      const params: Record<string, any> = {}
      let matched = true
      let paramIdx = 0
      for (let i = 0; i < r.segments.length; i++) {
        if (r.segments[i] === null) {
          params[r.paramNames[paramIdx]] = slug[i]
          paramIdx++
        } else if (r.segments[i] !== slug[i]) {
          matched = false
          break
        }
      }
      if (matched) return { route, params }
      continue
    }

    // Static route
    const r = route as StaticRoute
    if (slug.length !== r.segments.length) continue
    let matched = true
    for (let i = 0; i < r.segments.length; i++) {
      if (r.segments[i] !== slug[i]) {
        matched = false
        break
      }
    }
    if (matched) return { route, params: {} }
  }
  return null
}

// ─── Route segment config ─────────────────────────────────────────────

export const dynamic = 'force-dynamic'

// ─── HTTP method handlers ─────────────────────────────────────────────

type Ctx = { params: Promise<Record<string, any>> }

function dispatch(method: string, req: NextRequest, ctx: Ctx) {
  // Parse slug from the request URL
  const url = new URL(req.url)
  const pathname = url.pathname
  // Remove /api/ prefix
  const slugStr = pathname.startsWith('/api/') ? pathname.slice(5) : pathname.slice(1)
  const slug = slugStr ? slugStr.split('/').filter(Boolean) : []

  const match = matchRoute(slug)
  if (!match) {
    return NextResponse.json({ error: 'Not Found', path: pathname, slug }, { status: 404 })
  }

  const handler = match.route.handler[method]
  if (!handler || typeof handler !== 'function') {
    return NextResponse.json({ error: 'Method Not Allowed', path: pathname, method }, { status: 405 })
  }

  const params = Promise.resolve(match.params)
  return handler(req, { params })
}

export async function GET(req: NextRequest, ctx: Ctx) {
  return dispatch('GET', req, ctx)
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return dispatch('POST', req, ctx)
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  return dispatch('PUT', req, ctx)
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  return dispatch('PATCH', req, ctx)
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  return dispatch('DELETE', req, ctx)
}

export async function OPTIONS(req: NextRequest, ctx: Ctx) {
  const url = new URL(req.url)
  const pathname = url.pathname
  const slugStr = pathname.startsWith('/api/') ? pathname.slice(5) : pathname.slice(1)
  const slug = slugStr ? slugStr.split('/').filter(Boolean) : []
  const match = matchRoute(slug)
  if (!match) return new NextResponse(null, { status: 404 })
  const methods = Object.keys(match.route.handler).filter(k => typeof match.route.handler[k] === 'function')
  return new NextResponse(null, { status: 204, headers: { Allow: methods.join(', ') } })
}
