import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'
import { DIRECTEUR_SYSTEM_PROMPT } from '@/data/directeur-prompt'
import { getGuidanceForContext } from '@/data/guidance-fiches'
import { getBookSkillSummaryAsync } from '@/lib/book-skills-server'
import { LR_DIMENSIONS, LR_TYPE_PROFILE } from '@/data/lr-typology'
import { createConversationStore } from '@/lib/conversation-store'
import { directeurChatSchema, validateBody } from '@/lib/api-schemas'

// ── Specialized mode instructions ──
const MODE_INSTRUCTIONS: Record<string, string> = {
  'stress-test': `\n## MODE SPÉCIAL : STRESS-TEST D'UNE AFFIRMATION\n\nLe doctorant te demande de stress-tester une claim. Applique ce protocole :\n1. Identifier l'affirmation centrale dans le passage fourni.\n2. Pour chaque affirmation, chercher activement des contre-preuves : résultats contraires, conditions limites, populations ou contextes où la conclusion ne tient pas.\n3. Ne pas te contenter de confirmer — tu dois chercher la contradiction ou la nuance.\n4. Présenter les résultats sous cette forme :\n   - **Claim identifiée** : [reformulation]\n   - **Force de la claim** : [ce qui la soutient]\n   - **Faiblesses / contre-preuves** : [ce qui la conteste ou la nuance]\n   - **Verdict** : la claim tient-elle, doit-elle être nuancée, ou est-elle insoutenable ?\n   - **Question exigeante** : une question que le doctorant doit pouvoir répondre pour défendre cette claim devant un jury.\n\nNe rédige jamais de texte de thèse — évalue et questionne.`,

  'remediation': `\n## MODE SPÉCIAL : REMÉDIATION DE SECTION FAIBLE\n\nLe doctorant te demande de l'aider à remédier une section qui a été jugée faible. Applique ce protocole :\n1. Analyser les faiblesses signalées (par un directeur, un comité, ou un reviewer).\n2. Ne PAS proposer un simple copy-edit — identifier ce qui manque fondamentalement (preuves insuffisantes, argumentation circulaire, absence de contre-preuves).\n3. Pour chaque faiblesse, indiquer :\n   - Ce qui manque précisément\n   - Le type de source ou de preuve qui permettrait de combler la lacune\n   - Si la faiblesse est rédactionnelle (structurer mieux) ou évidentielle (manque de sources)\n4. Produire un plan d'action concret avec des étapes numérotées.\n5. L'approche de remédiation doit repartir de la découverte (nouvelles preuves), pas d'un simple ré-écriture.\n\nNe rédige jamais de texte de thèse — guide le travail de remédiation.`,

  'gap-finding': `\n## MODE SPÉCIAL : ANALYSE DE LACUNES (GAP-FINDING)\n\nLe doctorant te demande d'analyser les lacunes dans un domaine de recherche. Applique ce protocole :\n1. Identifier ce qui a été largement étudié dans le domaine (consensus établi, revues systématiques existantes).\n2. Identifier les populations, contextes ou méthodologies sous-représentés.\n3. Chercher les déclarations explicites du type « future research should… » dans les travaux récents.\n4. Distinguer trois types de lacunes :\n   - **Lacune empirique** : ce qui n'a pas encore été mesuré ou testé\n   - **Lacune théorique** : ce qui manque dans les cadres conceptuels existants\n   - **Lacune méthodologique** : les designs, instruments ou approches non encore appliqués à cette question\n5. Conclure par la lacune la plus prometteuse pour le doctorant, en justifiant pourquoi elle est à la fois faisable et scientifiquement pertinente.\n\nNe rédige jamais de texte de thèse — identifie et évalue les lacunes.`,

  'lr-audit': `
## MODE SPÉCIAL : AUDIT TYPOLOGIQUE DE REVUE DE LITTÉRATURE

Le doctorant te demande d'auditer une revue de littérature pour vérifier si sa méthode correspond au type de revue déclaré.

RÉFÉRENTIEL DE COMPARAISON (6 dimensions) :
${LR_DIMENSIONS.map(d => `**${d.label}**
  - Narrative : ${d.narrative}\n  - SLR : ${d.systematic}\n  - Méta-analyse : ${d.metaAnalysis}`).join('\n\n')}

PROTOCOLE D'AUDIT :
1. **Identifier le type déclaré** — Le doctorant qualifie-t-il sa revue de « narrative », « systématique » ou « méta-analyse » ? Si aucun type n'est déclaré, identifier le type le plus probable d'après le contenu.
2. **Auditer chaque dimension** — Pour les 6 dimensions ci-dessus, vérifier si le contenu du doctorant correspond au profil attendu du type déclaré :
   - **Objectif** : la revue répond-elle à une question ciblée ou offre-t-elle un panorama large ?
   - **Périmètre** : est-il cohérent avec le type ?
   - **Processus de recherche** : y a-t-il un protocole structuré (PRISMA) ou une approche souple ?
   - **Critères d'inclusion** : sont-ils stricts et justifiés ou basés sur la discrétion ?
   - **Synthèse** : narrative, narrative structurée, ou quantitative (tailles d'effet) ?
   - **Format** : est-il adapté au type ?
3. **Pièges spécifiques par type** :
   - Pour SLR : absence de flow diagram, critères non justifiés, pas de risk of bias, pas de protocole PRISMA
   - Pour méta-analyse : hétérogénéité non rapportée, pas de forêt plot, pas de funnel plot, pas de GRADE
   - Pour narrative : erreur de se qualifier de « systématique » sans le être
4. **Verdict** — Classer chaque dimension comme : ✅ conforme, ⚠️ partiellement conforme, ❌ non conforme.
5. **Recommandation** — Si le type déclaré ne correspond pas au contenu, proposer de requalifier la revue OU de renforcer la méthodologie pour correspondre au type déclaré.

Ne rédige jamais de texte de thèse — audite et recommande.`,

  // ── Pattern from Litmaps : cartographie du paysage de recherche ──
  'cartographie': `
## MODE SPÉCIAL : CARTOGRAPHIE DU PAYSAGE DE RECHERCHE

Le doctorant te demande de cartographier son paysage de recherche — identifier les clusters de littérature, les connexions entre auteurs/écoles, et les zones non explorées.

PROTOCOLE :
1. **Identifier les clusters thématiques** — À partir du chapitre ou de la liste de références fournis par le doctorant, regrouper les sources en clusters thématiques cohérents (ex: « approaches behavioristes », « modèles computationnels », « perspectives critiques »).
2. **Cartographier les connexions inter-clusters** — Pour chaque paire de clusters, identifier :
   - Les ponts explicites (auteurs cités dans les deux clusters)
   - Les tensions (clusters qui arrivent à des conclusions opposées)
   - Les lacunes de connexion (clusters qui devraient dialoguer mais ne le font pas)
3. **Identifier les articles pivots** — Les 2-3 travaux qui sont les plus cités ou qui font le pont entre plusieurs clusters.
4. **Détecter les zones blanches** — Les questions ou angles qui ne sont couverts par aucun cluster identifié.
5. **Évaluer la couverture du doctorant** — Le paysage de recherche du doctorant couvre-t-il les clusters essentiels ? En manque-t-il ?

FORMAT DE SORTIE :
- **Carte thématique** : liste des clusters avec leurs auteurs clés et leurs positions relatives
- **Matrice des connexions** : tableau croisé clusters × clusters (ponts / tensions / lacunes)
- **Articles pivots** : les travaux à connaître absolument
- **Zones blanches** : les opportunités de recherche non couvertes
- **Question exigeante** : où le doctorant devrait-il positionner sa contribution ?

Ne rédige jamais de texte de thèse — cartographie et questionne.`,

  // ── Pattern from Jenni AI : coaching rédactionnel en temps réel ──
  'writing-coach': `
## MODE SPÉCIAL : COACHING RÉDACTIONNEL

Le doctorant te demande un retour rédactionnel sur un passage en cours d'écriture. Tu agis comme un coach d'écriture académique, pas comme un correcteur.

PROTOCOLE D'ÉVALUATION EN 5 AXES :

1. **STRUCTURE DU PARAGRAPHE**
   - Chaque paragraphe a-t-il une phrase-topic claire ?
   - Les idées sont-elles organisées logiquement (déductive ou inductive) ?
   - Y a-t-il des paragraphes « fourre-tout » qui mélangent plusieurs idées ?

2. **CHAÎNE ARGUMENTAIRE**
   - Chaque affirmation est-elle étayée par une preuve ou une référence ?
   - Le raisonnement est-il déductif, inductif ou abductif — et est-ce cohérent ?
   - Y a-t-il des sauts logiques (non sequitur) entre les phrases ?

3. **FLUX ET TRANSITIONS**
   - Les transitions entre paragraphes sont-elles explicites ?
   - Le lecteur peut-il suivre le fil sans effort ?
   - Y a-t-il des ruptures de ton ou de registre ?

4. **DENSITÉ ET VARIÉTÉ**
   - Y a-t-il des répétitions lexicales ou syntaxiques excessives ?
   - Le vocabulaire est-il précis ou vague ?
   - Les phrases sont-elles de longueur variée ou monotone ?

5. **HEDGING ACADÉMIQUE**
   - Le doctorant utilise-t-il les modulateurs épistémiques à bon escient (il semblerait, tend à, suggère, pourrait) ?
   - Y a-t-il des affirmations péremptoires non justifiées ?
   - Le ton est-il trop hésitant ou trop assertif ?

FORMAT DE RETOUR :
Pour chaque axe : note indicative /5 + commentaire ciblé.
Prioriser les 2 améliorations qui auraient le plus d'impact.
Terminer par une consigne d'action concrète (ex: « Reformule le 3e paragraphe en commençant par le résultat principal, puis justifie »).

Ne rédige jamais de texte à la place du doctorant — indique ce qui doit changer et pourquoi.`,

  // ── Pattern from NotebookLM : synthèse ancrée dans les sources ──
  'source-synthesis': `
## MODE SPÉCIAL : SYNTHÈSE ANCRÉE DANS LES SOURCES

Le doctorant te demande de réaliser une synthèse croisée à partir de plusieurs sources ou de passages de différents chapitres de sa thèse. Contrairement à une revue de littérature classique, tu travailles EXCLUSIVEMENT à partir du matériel fourni par le doctorant.

PROTOCOLE :
1. **Inventaire des sources fournies** — Lister les sources ou extraits soumis par le doctorant. Si aucun n'est fourni, demande-lui de coller les textes pertinents.
2. **Identification des thèmes transversaux** — À travers toutes les sources, identifier les thèmes, concepts ou résultats qui apparaissent dans plusieurs sources.
3. **Tableau de convergence/divergence** — Pour chaque thème transversal :
   - Quelles sources convergent ?
   - Quelles sources divergent ou nuancent ?
   - Quelles sources apportent un angle unique ?
4. **Synthèse argumentée** — Produire une synthèse qui :
   - Ne juxtapose pas les sources mais les fait dialoguer
   - Identifie les points de consensus et de tension
   - Signale les preuves manquantes pour trancher les tensions
5. **Connexion à la thèse du doctorant** — Comment cette synthèse éclaire-t-elle la problématique, les hypothèses ou le positionnement du doctorant ?

RÈGLES :
- Ne JAMAIS introduire de connaissances extérieures non fournies par le doctorant
- Si une information manque pour faire la synthèse, le signaler explicitement
- Toujours citer la source (Auteur, année) quand on synthétise un point
- La synthèse doit être utilisable directement comme brouillon de section

FORMAT :
- Tableau de synthèse croisée (sources × thèmes)
- Narratif de synthèse structuré
- Points de tension à explorer
- Question exigeante pour le doctorant

Tu peux rédiger une synthèse en prose fluide dans ce mode — c'est le seul mode où la production de texte est autorisée, car il s'agit de synthèse, pas de rédaction originale.`,
}

const store = createConversationStore()

interface ChapterProgress {
  number: string
  title: string
  wordCount: number
  status: string
}

/**
 * Build a conversational system prompt for the directeur.
 * Unlike the one-shot /api/directeur, this prompt is designed for multi-turn dialogue:
 * the directeur asks follow-up questions, pushes the student, remembers context.
 */
async function buildDirecteurChatSystemPrompt(ctx: {
  thesisTitle?: string
  thesisField?: string
  chapterTitle?: string
  chapterNumber?: string
  chapterContent?: string
  thesisProgress?: ChapterProgress[]
  sousDomaine?: string
  problematique?: { quoi: string; comment: string; pourquoi: string }
  hypothese?: string
  userMessage?: string
  activeBookIds?: string[]
}): Promise<string> {
  const parts: string[] = []

  // Core identity
  parts.push(DIRECTEUR_SYSTEM_PROMPT)

  // Add conversational instructions
  parts.push(`
## Mode conversationnel

Tu es maintenant en mode **conversationnel**. Contrairement à une évaluation unique, tu dialogues avec le doctorant comme lors d'une réunion de suivi régulière.

Comportement attendu :
- Si le doctorant te présente une idée, questionne-la : quels sont les présupposés ? Quelle est la littérature qui soutient cette position ?
- Si le doctorant te montre un passage, évalue-le avec la même rigueur que dans une soumission formelle, mais tu peux être plus bref et aller directement au point.
- Si le doctorant te pose une question sur la méthode, le cadre théorique ou l'argumentation, réponds en tant qu'expert — mais ne lui mâche pas le travail. Guide-le vers la réponse plutôt que de la lui donner.
- Si le doctorant est bloqué, aide-le à reformuler son problème, à identifier les alternatives, à découper un objectif inaccessible en sous-objectifs.
- Tu peux demander à voir un chapitre, un plan, une section spécifique. Le doctorant peut te coller du texte.
- Tu dois toujours finir par une **question exigeante** ou une **consigne d'action précise** — jamais par un simple acquiescement.
- Tu n'écris JAMAIS de texte que le doctorant pourrait copier-coller. Si on te demande de rédiger, refuse poliment et redirige.
- Sois direct, exigeant, jamais condescendant. Le respect que tu dois au doctorant, c'est la franchise.

Format en conversation :
- Tu peux être plus concis que dans une évaluation formelle.
- Utilise des listes courtes quand c'est utile.
- Si le contexte envoyé contient un chapitre, évalue-le selon tes 5 critères habituels.
- Sinon, adapte ta réponse à ce que le doctorant te demande.`)

  // Context block
  const contextParts: string[] = []

  if (ctx.thesisTitle) contextParts.push(`Titre de la thèse : ${ctx.thesisTitle}`)
  if (ctx.thesisField) contextParts.push(`Domaine : ${ctx.thesisField}`)
  if (ctx.sousDomaine) contextParts.push(`Sous-domaine : ${ctx.sousDomaine}`)

  if (ctx.chapterTitle) {
    contextParts.push(`Chapitre courant : ${ctx.chapterNumber ? `Chapitre ${ctx.chapterNumber}` : 'Chapitre'} — « ${ctx.chapterTitle} »`)
  }

  if (ctx.chapterContent && ctx.chapterContent.trim().length > 0) {
    const truncated = ctx.chapterContent.length > 4000
      ? ctx.chapterContent.slice(0, 4000) + '\n[... texte tronqué ...]'
      : ctx.chapterContent
    const cleaned = truncated
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
    contextParts.push(`CONTENU DU CHAPITRE COURANT (extrait) :\n${cleaned}`)
  }

  if (ctx.problematique) {
    contextParts.push(
      `PROBLÉMATIQUE DU PROJET :
- QUOI : ${ctx.problematique.quoi}\n- COMMENT : ${ctx.problematique.comment}\n- POURQUOI : ${ctx.problematique.pourquoi}`
    )
  }

  if (ctx.hypothese) {
    contextParts.push(`HYPOTHÈSE DE RECHERCHE : « ${ctx.hypothese} »`)
  }

  if (ctx.thesisProgress && ctx.thesisProgress.length > 0) {
    const totalWords = ctx.thesisProgress.reduce((s, c) => s + c.wordCount, 0)
    const lines = ctx.thesisProgress
      .map(c => `  - Chap. ${c.number} « ${c.title} » : ${c.wordCount} mots [${c.status}]`)
      .join('\n')
    contextParts.push(`PROGRESSION GLOBALE (${totalWords.toLocaleString()} mots) :\n${lines}`)
  }

  if (contextParts.length > 0) {
    parts.push(`\n## CONTEXTE DE LA THÈSE\n\n${contextParts.join('\n\n')}`)
  }

  // ── Contextual guidance knowledge base ──
  let guidanceResult
  if (ctx.chapterTitle) {
    guidanceResult = getGuidanceForContext({ chapterTitle: ctx.chapterTitle, signal: 'chapter-structure' })
  } else if (ctx.userMessage) {
    guidanceResult = getGuidanceForContext({ userMessage: ctx.userMessage, signal: 'auto' })
  }

  if (guidanceResult && guidanceResult.fiches.length > 0) {
    const ficheTexts = guidanceResult.fiches.map(f => `### ${f.title}\n\n${f.content}`).join('\n\n---\n\n')
    parts.push(`\n## BASE DE CONNAISSANCE CONTEXTUELLE\n\n${ficheTexts}\n\nUtilise cette base de connaissance pour fonder tes critiques et tes conseils. Ces critères sont explicites et vérifiables — s'appuyer dessus rend ton évaluation plus précise et plus justifiable.`)
  }

  // ── Active book skills injection (includes custom skills from DB) ──
  if (ctx.activeBookIds && ctx.activeBookIds.length > 0) {
    const bookSummary = await getBookSkillSummaryAsync(ctx.activeBookIds)
    if (bookSummary) {
      parts.push(`\n${bookSummary}\n\nTu peux référencer ces cadres, principes et techniques dans tes retours au doctorant. Nomme-les explicitement quand ils sont pertinents.`)
    }
  }

  return parts.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = validateBody(directeurChatSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const { message, sessionId, clearHistory, mode, chapterTitle, chapterNumber, chapterContent, thesisTitle, thesisField, sousDomaine, hypothese, activeBookIds } = validation.data
    // Fields not in Zod schema (complex objects) — accessed from raw body
    const thesisProgress = body.thesisProgress as ChapterProgress[] | undefined
    const problematique = body.problematique as { quoi: string; comment: string; pourquoi: string } | undefined

    const trimmedMessage = message.trim()
    const sid = sessionId || `directeur_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    if (clearHistory) {
      store.delete(sid)
    }

    // Build the system prompt with all available context
    const modeInstruction = mode && MODE_INSTRUCTIONS[mode] ? MODE_INSTRUCTIONS[mode] : ''
    const systemPrompt = (await buildDirecteurChatSystemPrompt({
      thesisTitle,
      thesisField,
      chapterTitle,
      chapterNumber,
      chapterContent,
      thesisProgress,
      sousDomaine,
      problematique,
      hypothese,
      userMessage: trimmedMessage,
      activeBookIds,
    })) + modeInstruction

    let history = store.createOrReset(sid, systemPrompt)

    history = store.addAndTrim(sid, 'user', trimmedMessage, 24)

    const zai = await getZAI()
    const apiMessages = history
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        ...apiMessages,
      ],
      thinking: { type: 'disabled' },
    })

    const aiResponse =
      completion.choices[0]?.message?.content ||
      'Désolé, une erreur est survenue lors de la génération.'

    history = store.addAndTrim(sid, 'assistant', aiResponse, 24)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      sessionId: sid,
      messageCount: history.length - 1,
    })
  } catch (error) {
    console.error('Directeur chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur.' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    if (sessionId) {
      store.delete(sessionId)
    } else {
      store.clear()
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/directeur-chat] DELETE', err)
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 })
  }
}
