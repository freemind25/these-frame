// Server-only book skills logic.
// Separated from book-skills.ts to keep that file client-safe (no fs/db imports).

import { db } from '@/lib/db'
import type { BookSkill } from '@/data/book-skills'
import { BOOK_SKILLS } from '@/data/book-skills'

function formatSkillsToMarkdown(skills: BookSkill[]): string {
  if (skills.length === 0) return ''

  const lines: string[] = [`## Références actives (${skills.length} ouvrage${skills.length > 1 ? 's' : ''})\n`]

  for (const s of skills) {
    lines.push(`### ${s.title} (${s.author})`)
    lines.push(`**Concept clé :** ${s.coreConcept}`)

    if (s.frameworks.length > 0) {
      lines.push('**Cadres :**')
      for (const f of s.frameworks) {
        lines.push(`- *${f.name}* : ${f.description}`)
      }
    }

    lines.push('**Principes :**')
    for (const p of s.principles) {
      lines.push(`- ${p}`)
    }

    if (s.antiPatterns.length > 0) {
      lines.push('**Éviter :**')
      for (const a of s.antiPatterns) {
        lines.push(`- ✗ ${a}`)
      }
    }

    lines.push(`**Aide-mémoire :** ${s.quickReference}`)
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Async version that fetches both built-in and custom book skills.
 * Custom skills have IDs starting with 'c_' (cuid format).
 * SERVER-ONLY — do not import from client components.
 */
export async function getBookSkillSummaryAsync(bookIds: string[]): Promise<string> {
  const builtInSkills = bookIds
    .map((id) => BOOK_SKILLS[id])
    .filter(Boolean)

  const customIds = bookIds.filter(id => !BOOK_SKILLS[id])
  let customSkills: BookSkill[] = []

  if (customIds.length > 0) {
    try {
      const records = await db.customBookSkill.findMany({
        where: { id: { in: customIds }, status: 'ready' },
      })
      customSkills = records.map(r => {
        let frameworks: BookSkill['frameworks'] = []
        let principles: string[] = []
        let techniques: string[] = []
        let antiPatterns: string[] = []
        let relevance: BookSkill['relevance'] = []
        try { frameworks = JSON.parse(r.frameworks) } catch { /* empty */ }
        try { principles = JSON.parse(r.principles) } catch { /* empty */ }
        try { techniques = JSON.parse(r.techniques) } catch { /* empty */ }
        try { antiPatterns = JSON.parse(r.antiPatterns) } catch { /* empty */ }
        try { relevance = JSON.parse(r.relevance) } catch { /* empty */ }
        return {
          id: r.id,
          title: r.title,
          author: r.author,
          coreConcept: r.coreConcept,
          frameworks,
          principles,
          techniques,
          antiPatterns,
          relevance,
          quickReference: r.quickReference,
        }
      })
    } catch (err) {
      console.error('[getBookSkillSummaryAsync] DB error:', err)
    }
  }

  const allSkills = [...builtInSkills, ...customSkills]
  if (allSkills.length === 0) return ''

  return formatSkillsToMarkdown(allSkills)
}
