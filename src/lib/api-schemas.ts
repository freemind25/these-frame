import { z } from 'zod'

// ─── AI Chat Routes ───
export const aiWritingSchema = z.object({
  message: z.string().min(1, 'Le message est requis.').max(50000),
  mode: z.string().optional(),
  sessionId: z.string().optional(),
  clearHistory: z.boolean().optional(),
  // Inline AI fields
  prompt: z.string().optional(),
  text: z.string().optional(),
  // External provider fields
  provider: z.string().optional(),
  apiKey: z.string().optional(),
  baseUrl: z.string().url().optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(32000).optional(),
  thinking: z.enum(['enabled', 'disabled']).optional(),
})

export const thesisAssistantSchema = z.object({
  message: z.string().min(1, 'Le message est requis.').max(50000),
  mode: z.enum(['general', 'redaction', 'correction', 'critique', 'methode', 'bibliographie', 'suivi']).optional(),
  sessionId: z.string().optional(),
  clearHistory: z.boolean().optional(),
  // Inline AI fields
  prompt: z.string().optional(),
  text: z.string().optional(),
  chapterTitle: z.string().optional(),
  chapterNumber: z.string().optional(),
  chapterContent: z.string().max(50000).optional(),
  thesisTitle: z.string().optional(),
  thesisField: z.string().optional(),
  allChaptersContent: z.array(z.object({ number: z.string(), title: z.string(), content: z.string() })).optional(),
})

export const directeurChatSchema = z.object({
  message: z.string().min(1, 'Le message est requis.').max(50000),
  sessionId: z.string().optional(),
  clearHistory: z.boolean().optional(),
  // Inline AI fields
  prompt: z.string().optional(),
  text: z.string().optional(),
  mode: z.enum(['stress-test', 'remediation', 'gap-finding', 'lr-audit', 'cartographie', 'writing-coach', 'source-synthesis']).optional(),
  chapterTitle: z.string().optional(),
  chapterNumber: z.string().optional(),
  chapterContent: z.string().max(50000).optional(),
  thesisTitle: z.string().optional(),
  thesisField: z.string().optional(),
  sousDomaine: z.string().optional(),
  hypothese: z.string().optional(),
  activeBookIds: z.array(z.string()).optional(),
})

// ─── Thesis CRUD ───
export const thesisUpdateSchema = z.object({
  title: z.string().max(500).optional(),
  subtitle: z.string().max(500).optional(),
  author: z.string().max(200).optional(),
  field: z.string().max(200).optional(),
  university: z.string().max(200).optional(),
  status: z.enum(['draft', 'in_progress', 'submitted', 'completed']).optional(),
  structureMode: z.enum(['chapters', 'parts']).optional(),
})

export const chapterUpdateSchema = z.object({
  title: z.string().max(500).optional(),
  content: z.string().max(500000).optional(),
  status: z.enum(['draft', 'in_progress', 'submitted', 'done']).optional(),
  order: z.number().int().positive().optional(),
  partId: z.string().nullable().optional(),
})

// ─── Cadrage ───
export const cadrageGenerateSchema = z.object({
  thesisId: z.string().min(1),
  title: z.string().min(1).max(500),
  field: z.string().min(1).max(200),
  problematique: z.string().optional(),
  objectives: z.string().optional(),
  methodology: z.string().optional(),
})

// ─── Validation helper ───
export function validateBody<T>(schema: z.ZodType<T>, body: unknown) {
  const result = schema.safeParse(body)
  if (!result.success) {
    const firstError = result.error.issues[0]
    return { success: false as const, error: firstError?.message || 'Paramètres invalides.' }
  }
  return { success: true as const, data: result.data }
}
