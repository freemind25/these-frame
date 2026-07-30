import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'
import type { OrchestrationTask, OrchestrationRun, AgentRole } from '@/types/agent-orchestration'
import { THESIS_AGENTS } from '@/types/agent-orchestration'

// POST /api/automation/agents/execute
// Multi-agent orchestration: Redacteur -> Directeur -> (loop if needs_fix) -> Chercheur
export async function POST(request: NextRequest) {
  try {
    const { thesis, workflow } = await request.json()
    // workflow: 'full' (write+review+enrich), 'review-only', 'write-only'

    if (!thesis?.chapters?.length) {
      return NextResponse.json({ error: 'Données de these requises' }, { status: 400 })
    }

    const zai = await getZAI()
    const runId = `run-${Date.now()}`
    const tasks: OrchestrationTask[] = []
    const agents = THESIS_AGENTS.map(a => ({ role: a.role, status: 'idle' as const, tasksCompleted: 0 }))
    const filledChapters = thesis.chapters.filter((ch: any) => ch.content && ch.wordCount > 100)
    const emptyChapters = thesis.chapters.filter((ch: any) => !ch.content || ch.wordCount < 50)

    // --- Phase 1: Redacteur - write drafts for empty chapters ---
    if (workflow !== 'review-only') {
      const writeAgentIdx = agents.findIndex(a => a.role === 'redacteur')
      agents[writeAgentIdx].status = 'working'

      for (const chapter of emptyChapters) {
        const taskId = `task-write-${chapter.id}`
        const task: OrchestrationTask = {
          id: taskId, type: 'write-chapter',
          title: `Rediger : ${chapter.title}`, description: 'Generation du brouillon initial',
          chapterId: chapter.id, chapterNumber: chapter.number, chapterTitle: chapter.title,
          assignedAgent: 'redacteur', status: 'in_progress', priority: chapter.order,
          createdAt: new Date().toISOString(), startedAt: new Date().toISOString(),
        }
        tasks.push(task)

        try {
          const draft = await callAgent(zai, 'redacteur', buildWritePrompt(thesis, chapter))
          task.status = 'in_review'
          task.completedAt = new Date().toISOString()
          task.output = draft
          agents[writeAgentIdx].tasksCompleted++
        } catch (err: any) {
          task.status = 'todo'
          task.error = err.message
        }
      }

      agents[writeAgentIdx].status = 'done'
    }

    // --- Phase 2: Directeur - review filled chapters ---
    if (workflow !== 'write-only') {
      const reviewChapters = [...filledChapters]
      if (workflow === 'full' && emptyChapters.length > 0) {
        const newDrafts = tasks.filter(t => t.type === 'write-chapter' && t.output)
        for (const draftTask of newDrafts) {
          const ch = emptyChapters.find((c: any) => c.id === draftTask.chapterId)
          if (ch) {
            reviewChapters.push({ ...ch, content: draftTask.output, wordCount: draftTask.output.split(/\s+/).length })
          }
        }
      }

      const dirAgentIdx = agents.findIndex(a => a.role === 'directeur')
      agents[dirAgentIdx].status = 'working'

      for (const chapter of reviewChapters) {
        const taskId = `task-review-${chapter.id}`
        const task: OrchestrationTask = {
          id: taskId, type: 'review-chapter',
          title: `Reviser : ${chapter.title}`, description: 'Evaluation critique et suggestions',
          chapterId: chapter.id, chapterNumber: chapter.number, chapterTitle: chapter.title,
          assignedAgent: 'directeur', status: 'in_progress', priority: chapter.order,
          createdAt: new Date().toISOString(), startedAt: new Date().toISOString(),
        }
        tasks.push(task)

        try {
          const review = await callAgent(zai, 'directeur', buildReviewPrompt(thesis, chapter))
          const parsed = parseReview(review)
          task.score = parsed.score
          task.remarks = parsed.remarks
          task.status = parsed.score >= 6 ? 'completed' : 'needs_fix'
          task.completedAt = new Date().toISOString()
          task.output = review
          agents[dirAgentIdx].tasksCompleted++
        } catch (err: any) {
          task.status = 'todo'
          task.error = err.message
        }
      }

      agents[dirAgentIdx].status = 'done'
    }

    // --- Phase 3: Chercheur - enrich chapters ---
    if (workflow === 'full') {
      const enrichChapters = filledChapters
      const cherAgentIdx = agents.findIndex(a => a.role === 'chercheur')
      agents[cherAgentIdx].status = 'working'

      for (const chapter of enrichChapters) {
        const taskId = `task-enrich-${chapter.id}`
        const task: OrchestrationTask = {
          id: taskId, type: 'enrich-chapter',
          title: `Enrichir : ${chapter.title}`, description: 'Suggestions de references et approfondissements',
          chapterId: chapter.id, chapterNumber: chapter.number, chapterTitle: chapter.title,
          assignedAgent: 'chercheur', status: 'in_progress', priority: chapter.order,
          createdAt: new Date().toISOString(), startedAt: new Date().toISOString(),
        }
        tasks.push(task)

        try {
          const enrichment = await callAgent(zai, 'chercheur', buildEnrichPrompt(thesis, chapter))
          task.status = 'completed'
          task.completedAt = new Date().toISOString()
          task.output = enrichment
          agents[cherAgentIdx].tasksCompleted++
        } catch (err: any) {
          task.status = 'todo'
          task.error = err.message
        }
      }

      agents[cherAgentIdx].status = 'done'
    }

    const completedCount = tasks.filter(t => t.status === 'completed' || t.status === 'needs_fix').length
    const avgScore = tasks.filter(t => t.score !== undefined).reduce((s, t) => s + (t.score || 0), 0) / Math.max(1, tasks.filter(t => t.score !== undefined).length)

    const run: OrchestrationRun = {
      id: runId, createdAt: new Date().toISOString(), status: 'completed',
      tasks, agents,
      summary: `${completedCount}/${tasks.length} tache(s) terminee(s). Note moyenne : ${Math.round(avgScore * 10) / 10}/10.`,
    }

    return NextResponse.json(run)
  } catch (err: any) {
    console.error('[automation/agents/execute]', err)
    return NextResponse.json({ error: err.message || 'Erreur orchestration' }, { status: 500 })
  }
}

async function callAgent(zai: any, role: AgentRole, prompt: string): Promise<string> {
  const agentDef = THESIS_AGENTS.find(a => a.role === role)
  const response = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: agentDef?.systemPrompt || '' },
      { role: 'user', content: prompt },
    ],
    temperature: role === 'redacteur' ? 0.7 : 0.4,
    max_tokens: 4000,
  })
  return response.choices?.[0]?.message?.content || ''
}

function buildWritePrompt(thesis: any, chapter: any): string {
  const prevChapter = thesis.chapters.find((c: any) => c.number === chapter.number - 1)
  const prevSummary = prevChapter?.content
    ? `\nResume du chapitre precedent (${prevChapter.title}) :\n${prevChapter.content.slice(0, 600)}...`
    : ''
  return `CONTEXTE DE LA THESE :\n- Titre : ${thesis.title}\n- Discipline : ${thesis.field}\n- Universite : ${thesis.university}\n\n${prevSummary}\n\nCHAPITRE A REDIGER :\nChapitre ${chapter.number} : ${chapter.title}\n\nRedige le contenu complet de ce chapitre en francais academique.`
}

function buildReviewPrompt(thesis: any, chapter: any): string {
  return `THESE : ${thesis.title} (${thesis.field})\nCHAPITRE ${chapter.number} : ${chapter.title}\n\nCONTENU A EVALUER :\n${(chapter.content || '').slice(0, 4000)}\n\nReponds STRICTEMENT en JSON :\n{\n  "score": <note 1-10>,\n  "remarks": [\n    {"type": "structure|contenu|style|argumentation", "severity": "info|warning|error", "text": "description"}\n  ]\n}\n3 a 8 remarques maximum.`
}

function buildEnrichPrompt(thesis: any, chapter: any): string {
  return `THESE : ${thesis.title} (${thesis.field})\nCHAPITRE ${chapter.number} : ${chapter.title}\n\nCONTENU :\n${(chapter.content || '').slice(0, 3000)}\n\nPour chaque section de ce chapitre, suggere :\n1. 2-3 references bibliographiques pertinentes [Auteur, Annee]\n2. Un approfondissement possible (1-2 phrases)\n3. Une connexion potentielle avec un autre chapitre de la these\n\nFormat : liste structuree par section du chapitre.`
}

function parseReview(raw: string): { score: number; remarks: { type: string; severity: string; text: string }[] } {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        score: typeof parsed.score === 'number' ? parsed.score : 5,
        remarks: Array.isArray(parsed.remarks) ? parsed.remarks.map((r: any) => ({
          type: r.type || 'contenu', severity: r.severity || 'info', text: String(r.text || ''),
        })) : [],
      }
    }
  } catch { /* fallback */ }
  return { score: 5, remarks: [{ type: 'info', severity: 'info', text: 'Reponse non parsable.' }] }
}
