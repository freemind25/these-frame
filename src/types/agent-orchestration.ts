// ─── Agent Orchestration Types ───
// Inspired by agent-teams-ai: multi-agent roles, kanban task lifecycle,
// structured task references, and per-agent workflow prompts.

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'needs_fix' | 'completed'
export type AgentRole = 'redacteur' | 'directeur' | 'chercheur'
export type AgentStatus = 'idle' | 'working' | 'done' | 'error'

export interface ThesisAgent {
  role: AgentRole
  name: string
  description: string
  color: string
  icon: string
  systemPrompt: string
  status: AgentStatus
  currentTask?: string
  tasksCompleted: number
}

export const THESIS_AGENTS: ThesisAgent[] = [
  {
    role: 'redacteur',
    name: 'Rédacteur IA',
    description: 'Rédige et améliore le contenu des chapitres de la thèse.',
    color: 'violet',
    icon: 'PenLine',
    systemPrompt: `Tu es un rédacteur académique expert, spécialisé dans la rédaction de thèses de doctorat en français.

RÈGLES :
1. Rédige en français académique soutenu, style doctoral
2. Structure avec des titres (##) et sous-titres (###) en markdown
3. Vise 2000-4000 mots par chapitre selon l'importance
4. Inclus des références [Auteur, Année] pour marquer les citations à insérer
5. Utilise des connecteurs logiques (cependant, néanmoins, en revanche)
6. Évite le plagiat : génère du contenu original et argumenté
7. Adapte le ton et le contenu au type de chapitre (intro, revue, méthodo, résultats, discussion, conclusion)`
  },
  {
    role: 'directeur',
    name: 'Directeur IA',
    description: 'Critique, évalue et suggère des améliorations pour chaque chapitre.',
    color: 'amber',
    icon: 'GraduationCap',
    systemPrompt: `Tu es un directeur de thèse expérimenté et rigoureux.

RÔLE :
- Évalue la qualité académique du contenu rédigé
- Identifie les faiblesses argumentaires et les lacunes
- Suggère des améliorations concrètes et actionnables
- Vérifie la cohérence avec le cadrage préalable
- Note chaque chapitre sur 10 selon 4 critères

CRITÈRES D'ÉVALUATION :
1. Structure et organisation (plan clair, transitions)
2. Fond scientifique (arguments, preuves, références)
3. Style académique (langue, registre, clarté)
4. Originalité et contribution (apport, positionnement)

FORMAT DE RÉPONSE : Réponds en JSON structuré avec score et remarques détaillées.`
  },
  {
    role: 'chercheur',
    name: 'Chercheur IA',
    description: 'Enrichit les chapitres avec des références et approfondit le contenu.',
    color: 'cyan',
    icon: 'Search',
    systemPrompt: `Tu es un chercheur académique spécialisé dans la recherche documentaire et l'approfondissement scientifique.

RÔLE :
- Suggère des références bibliographiques pertinentes pour chaque section
- Identifie les auteurs clés et les travaux fondateurs du domaine
- Propose des approfondissements théoriques ou empiriques
- Suggère des connexions inter-chapitres
- Recommande des revues systématiques ou méta-analyses pertinentes

FORMAT : Pour chaque suggestion, indique [Auteur, Année] avec un résumé d'une phrase de la contribution.`
  },
]

export interface OrchestrationTask {
  id: string
  type: 'write-chapter' | 'review-chapter' | 'enrich-chapter'
  title: string
  description: string
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  assignedAgent: AgentRole
  status: TaskStatus
  priority: number
  createdAt: string
  startedAt?: string
  completedAt?: string
  output?: string
  error?: string
  // Review results
  score?: number
  remarks?: { type: string; severity: string; text: string }[]
}

export interface OrchestrationRun {
  id: string
  createdAt: string
  status: 'running' | 'completed' | 'error'
  tasks: OrchestrationTask[]
  agents: { role: AgentRole; status: AgentStatus; tasksCompleted: number }[]
  summary: string
}

// Kanban column definitions
export const KANBAN_COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'À faire', color: 'slate' },
  { key: 'in_progress', label: 'En cours', color: 'violet' },
  { key: 'in_review', label: 'En révision', color: 'amber' },
  { key: 'needs_fix', label: 'À corriger', color: 'red' },
  { key: 'completed', label: 'Terminé', color: 'emerald' },
]
