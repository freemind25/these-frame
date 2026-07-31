// Guidance Knowledge Base — 5 fiches for the Directeur IA
// Each fiche is a focused, self-contained knowledge card.

// ─────────────────────────────────────────────
// FICHE 1: Les 9 étapes d'un projet doctoral
// ─────────────────────────────────────────────
export const FICHE_ETAPES = {
  id: 'fiche-etapes',
  title: 'Les 9 étapes d\'un projet doctoral',
  content: `# Les 9 étapes d'un projet doctoral

Séquence de jalons vérifiables pour positionner un doctorant et proposer la tâche suivante.

## 1. Préparer
Clarifier le niveau d'exigence (mémoire vs. thèse doctorale), identifier les contraintes institutionnelles (règlement, calendrier, gabarit), choisir l'encadrant selon pertinence disciplinaire, disponibilité réelle et compatibilité de méthode de travail.

## 2. Explorer
Délimiter le champ avant de figer la question : cartographier les débats, revues de référence, auteurs incontournables du sous-champ. Vérifier la faisabilité (accès données/terrain, durée, moyens).

## 3. Lire (revue exploratoire)
Lire pour comprendre le paysage, puis repérer le vide à combler. Tenir un système de prise de notes homogène dès cette étape (fiche par source : référence, résumé une phrase, citation utile, position critique).

## 4. Concevoir
Construire le design de recherche : question(s), hypothèses, méthodologie, unité d'analyse, corpus/terrain. Anticiper les autorisations (éthique, terrain) — délais souvent sous-estimés.

## 5. Proposer
Rédiger la proposition/protocole : énoncé du problème, état de la littérature, méthodologie. La traiter comme un contrat avec l'encadrant et le comité.

## 6. Expérimenter / enquêter
Distinguer dans le journal de recherche ce qui relève de la collecte de ce qui relève de l'interprétation.

## 7. Analyser
Réserver un temps d'analyse dédié avant d'écrire les résultats. Rédiger prématurément pousse à sélectionner les données qui confirment une histoire déjà en tête.

## 8. Rédiger
La rédaction fait partie du processus de clarification, pas seulement sa mise en forme. Rédiger dans l'ordre qui débloque le plus vite (souvent : méthodologie → résultats → littérature → introduction → conclusion).

## 9. Défendre puis diffuser
La thèse n'est pas le point d'arrivée de la diffusion scientifique — prévoir les publications dès la conception si le règlement le permet.

## Comment utiliser avec un étudiant
1. Poser : « à quelle étape es-tu, concrètement, en ce moment ? »
2. Ne proposer que la tâche de l'étape courante ou suivante.
3. Rappeler qu'un retour en arrière est normal.`,
}

// ─────────────────────────────────────────────
// FICHE 2: Techniques d'écriture et déblocage rédactionnel
// ─────────────────────────────────────────────
export const FICHE_ECRITURE = {
  id: 'fiche-ecriture',
  title: 'Techniques d\'écriture et déblocage rédactionnel',
  content: `# Techniques d'écriture et déblocage rédactionnel

Écrire n'est pas la mise en forme d'une pensée terminée, c'est un outil pour penser.

## Modes d'écriture (toolbox)

### Écriture libre (freewriting)
Séance chronométrée (5-10 min), sur une question précise. Règle : ne pas s'arrêter, ne pas corriger, ne pas juger. Le texte produit n'est presque jamais utilisable tel quel — c'est normal.

### Écriture génératrice
Variante ciblée : amorce de phrase liée au chapitre ("Ce chapitre montre que…", "La question que je pose ici est…", "Ce que les données suggèrent, c'est…").

### Écriture en couches
- Passage 1 : structure et idées, sans citations ni style
- Passage 2 : références, données, transitions
- Passage 3 : polissage du style et cohérence terminologique
Cela empêche le blocage sur la première phrase.

### Écriture régulière vs. intensive
Régulière (30-60 min, plusieurs fois/semaine) construit une habitude. Les sessions intensives peuvent débloquer mais ne doivent pas devenir le seul mode.

## Structure du paragraphe
Un paragraphe académique = mini-argument : phrase d'ancrage, développement, preuve, retour au propos. Transitions : annoncer (forecasting) avant de développer, rappeler (signposting) ce qui vient d'être établi.

## Diagnostiquer le blocage
- **Cognitif** (contenu pas assez clair) → revoir la littérature ou l'analyse, pas plus d'heures d'écriture
- **Perfectionnisme** (contenu là mais n'ose pas écrire imparfaitement) → prescrire freewriting ou écriture en couches, autoriser explicitement un premier jet médiocre
- **Audience** (ne sait pas pour qui il écrit) → clarifier le lecteur visé
- **Logistique** (lieu, horaire, interruptions) → travailler sur les conditions matérielles

## Clôture et révision
Chaque chapitre a besoin d'une clôture provisoire avant de passer au suivant. Révision globale : cohérence de l'argument, cohérence terminologique, annonce/rappel entre chapitres.

## Comment utiliser avec un étudiant
1. Identifier quel type de blocage est en jeu AVANT de proposer une technique
2. Ne jamais suggérer « écris plus » sans préciser dans quel mode
3. Autoriser explicitement le texte imparfait au premier jet`,
}

// ─────────────────────────────────────────────
// FICHE 3: Structure rhétorique attendue par chapitre
// ─────────────────────────────────────────────
export const FICHE_RHETORIQUE = {
  id: 'fiche-rhetorique',
  title: 'Structure rhétorique attendue par chapitre',
  content: `# Structure rhétorique attendue par chapitre

## Types de structure de thèse
- Traditionnelle simple : intro, revue, méthodologie, résultats, discussion, conclusion
- Traditionnelle complexe : plusieurs chapitres résultats/discussion imbriqués
- Par thème/topique : organisée autour de questions plutôt que la séquence méthodologique
- Par compilation/articles : suite d'articles encadrés par intro + conclusion de synthèse
Demander explicitement quel type est imposé avant de conseiller la structure.

## Introduction : territoire → créneau → occupation
1. Établir le territoire (contexte, importance, ce qu'on sait)
2. Établir le créneau (ce qui manque, le problème non traité — souvent bâclé)
3. Occuper le créneau (objectifs, annonce de plan)
Diagnostic : si l'intro ne contient que l'étape 1 et saute à « dans cette thèse », le créneau manque.

## Revue de littérature
- Organiser par thème ou débat, jamais par liste chronologique de sources
- Verbes de rapport variés et positionnés (« montre que », « suggère », « conteste », « nuance »)
- Présent pour faits établis et positions théoriques, passé pour études spécifiques
- Distinguer résumer (reformuler une source) et synthétiser (mettre plusieurs sources en dialogue)

## Méthodologie
- Justifier les méthodes par rapport à la question, pas seulement les décrire
- Justifier l'unité d'analyse (pourquoi ce cas, cet échantillon, ce corpus)
- Décrire et évaluer les limites des sources de données

## Résultats
- Neutralité maximale, réserver l'interprétation à la discussion
- Référencer explicitement tableaux et figures dans le texte

## Discussion et conclusion
- Remonter du particulier vers le général
- Langage de nuance mesurée (« suggère », « il est possible que »)
- Structure : contribution → limites → implications → pistes futures (en terminant sur l'apport, pas sur les limites)

## Résumé/Abstract
Compresser en un paragraphe : problème, méthode, résultats, implication. Rédiger en dernier.`,
}

// ─────────────────────────────────────────────
// FICHE 4: Navigation institutionnelle et soutenance
// ─────────────────────────────────────────────
export const FICHE_INSTITUTIONNELLE = {
  id: 'fiche-institutionnelle',
  title: 'Navigation institutionnelle et soutenance',
  content: `# Navigation institutionnelle et soutenance

## Règles non dites
Les règlements décrivent les étapes formelles mais rarement la dimension relationnelle : comment se négocie le rythme de travail, comment se gère un désaccord avec un membre du comité. Conseiller à l'étudiant de chercher les sources informelles (anciens doctorants, secrétariat).

## Relation d'encadrement
- Le choix repose aussi sur disponibilité réelle et compatibilité de style de travail
- Formaliser tôt un rythme explicite d'échange (fréquence, délai de retour)
- Un retour critique sévère est normal, pas un jugement sur la valeur du doctorant

## Proposition comme point de référence
Y revenir explicitement en cas de doute sur la direction prise.

## Dimension sociale
L'isolement est un facteur de risque documenté, indépendamment de la qualité du travail. Soutien par les pairs = facteur de persévérance.

## Préparer la soutenance
- Exercice distinct de la rédaction (compétences orales et argumentation en temps réel)
- Relire la thèse en se mettant à la place d'un lecteur externe
- Lister les faiblesses anticipées et préparer des réponses assumées
- Organiser une simulation de soutenance
- Le rôle du jury est d'évaluer, pas de piéger
- Corrections post-soutenance = processus normal

## Comment utiliser avec un étudiant
1. Ne pas traiter une difficulté relationnelle comme un problème d'écriture
2. Rappeler que ces difficultés sont documentées comme fréquentes
3. Proposer un exercice concret (liste faiblesses + réponses, simulation) pour la soutenance`,
}

// ─────────────────────────────────────────────
// FICHE 5: Normes de citation et cohérence éditoriale
// ─────────────────────────────────────────────
export const FICHE_NORMES = {
  id: 'fiche-normes',
  title: 'Normes de citation et cohérence éditoriale',
  content: `# Normes de citation et cohérence éditoriale

## Systèmes de citation
- Notes-bibliographie : note de bas de page + biblio en fin. Dominant en SHS, histoire, arts.
- Auteur-date : appel court dans le texte (auteur, année) + liste de références. Dominant en sciences sociales et exactes.
- Ne jamais mélanger les deux systèmes. Vérifier le système imposé par l'établissement.

## Principes généraux
- Citer toute idée, donnée ou formulation empruntée, y compris reformulée
- Citations directes : rares et brèves, privilégier la paraphrase intégrée au raisonnement
- Citation longue (>100 mots) : bloc détaché, retrait, sans guillemets
- Toujours vérifier une citation ou donnée chiffrée contre la source originale

## Cohérence éditoriale
L'incohérence (majuscule tantôt oui/non, nombres tantôt en chiffres/lettres) est plus remarquée que le choix de convention lui-même.
- Ponctuation : cohérence guillemets, tirets, deux-points
- Majuscules : règle fixe pour titres de section et concepts propres
- Abréviations : introduire en toutes lettres à la première occurrence
- Nombres : convention fixe et tenue (ex. 1-9 en lettres, 10+ en chiffres)

## Tableaux et figures
- Numérotation continue + légende descriptive (compréhensible isolément)
- Toujours référencer explicitement dans le texte
- Source des données indiquée si non produite par l'auteur

## Point de vigilance
Les exigences de mise en forme (Chicago/Turabian) sont des conventions nord-américaines. Le rôle d'un outil est de faire respecter le gabarit local, pas la convention Chicago par défaut.

## Comment utiliser avec un étudiant
1. Toujours vérifier le système imposé localement avant tout conseil
2. Traiter les alertes comme cohérence interne, pas conformité absolue
3. Signaler l'usage excessif de citations directes comme signal de synthèse insuffisante`,
}

// ─────────────────────────────────────────────
// All fiches index
// ─────────────────────────────────────────────
export const ALL_FICHES = [
  FICHE_ETAPES,
  FICHE_ECRITURE,
  FICHE_RHETORIQUE,
  FICHE_INSTITUTIONNELLE,
  FICHE_NORMES,
] as const

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface GuidanceContext {
  chapterTitle?: string
  userMessage?: string
  signal?: 'new-project' | 'writing-block' | 'chapter-structure' | 'institutional' | 'formatting' | 'auto'
}

export interface GuidanceResult {
  fiches: Array<{ id: string; title: string; content: string }>
  reason: string
}

// ─────────────────────────────────────────────
// Signal → fiche mapping (explicit signals)
// ─────────────────────────────────────────────
const SIGNAL_MAP: Record<string, Array<{ id: string; title: string; content: string }>> = {
  'new-project': [FICHE_ETAPES],
  'writing-block': [FICHE_ECRITURE],
  'chapter-structure': [FICHE_RHETORIQUE],
  'institutional': [FICHE_INSTITUTIONNELLE],
  'formatting': [FICHE_NORMES],
}

// ─────────────────────────────────────────────
// Chapter title keywords → fiche
// ─────────────────────────────────────────────
const CHAPTER_KEYWORDS: Array<{ patterns: RegExp[]; fiche: { id: string; title: string; content: string } }> = [
  {
    patterns: [/intro/i],
    fiche: FICHE_RHETORIQUE,
  },
  {
    patterns: [/revue/i, /littérature/i, /litterature/i, /bibliograph/i],
    fiche: FICHE_RHETORIQUE,
  },
  {
    patterns: [/méthod/i, /methodo/i, /methodolog/i],
    fiche: FICHE_RHETORIQUE,
  },
  {
    patterns: [/résultat/i, /resultat/i, /résult/i, /result/i],
    fiche: FICHE_RHETORIQUE,
  },
  {
    patterns: [/discuss/i],
    fiche: FICHE_RHETORIQUE,
  },
  {
    patterns: [/conclus/i],
    fiche: FICHE_RHETORIQUE,
  },
  {
    patterns: [/résumé/i, /resume/i, /abstract/i],
    fiche: FICHE_RHETORIQUE,
  },
]

// ─────────────────────────────────────────────
// User message keyword heuristics
// ─────────────────────────────────────────────
const MSG_HEURISTICS: Array<{ patterns: RegExp[]; fiche: { id: string; title: string; content: string }; reason: string }> = [
  {
    patterns: [/bloqué/i, /bloquee/i, /procrastin/i, /commencer/i, /écrir/i, /ecri/i, /je ne sais pas/i],
    fiche: FICHE_ECRITURE,
    reason: 'Mots-clés de blocage rédactionnel détectés dans le message',
  },
  {
    patterns: [/directeur/i, /comité/i, /comite/i, /souten/i, /encadr/i, /jury/i],
    fiche: FICHE_INSTITUTIONNELLE,
    reason: 'Mots-clés institutionnels/d\'encadrement détectés dans le message',
  },
  {
    patterns: [/citation/i, /APA/i, /norme/i, /format/i, /bibliograph/i, /référence/i, /reference/i, /chicago/i, /turabian/i],
    fiche: FICHE_NORMES,
    reason: 'Mots-clés de normes/citation détectés dans le message',
  },
  {
    patterns: [/par où/i, /par ou/i, /étapes?\s*(du\s*)?projet/i, /etapes?\s*(du\s*)?projet/i, /comment\s+(je\s+)?commence/i],
    fiche: FICHE_ETAPES,
    reason: 'Question sur les étapes du projet détectée dans le message',
  },
  {
    patterns: [/structure\s+de\s*chapitre/i, /qu\'est\-ce\s*qui\s*doit/i, /dans\s*mon\s*intro/i, /introduction/i, /revue\s+de/i, /méthodologie/i],
    fiche: FICHE_RHETORIQUE,
    reason: 'Question sur la structure rhétorique détectée dans le message',
  },
]

/**
 * Selects up to 2 guidance fiches based on context signals.
 */
export function getGuidanceForContext(ctx: GuidanceContext): GuidanceResult {
  const { chapterTitle, userMessage, signal } = ctx
  const selected: Array<{ id: string; title: string; content: string }> = []
  const seen = new Set<string>()
  let reason = ''

  const addFiche = (f: { id: string; title: string; content: string }) => {
    if (!seen.has(f.id) && selected.length < 2) {
      seen.add(f.id)
      selected.push(f)
    }
  }

  // ── 1. Explicit signal ──
  if (signal && signal !== 'auto' && SIGNAL_MAP[signal]) {
    const mapped = SIGNAL_MAP[signal]
    mapped.forEach(addFiche)
    reason = `Signal explicite : ${signal}`
    return { fiches: selected, reason }
  }

  // ── 2. Auto-routing with heuristics ──
  const msg = (userMessage || '').toLowerCase()
  const chap = (chapterTitle || '').toLowerCase()

  // 2a. Check user message for keyword matches
  for (const h of MSG_HEURISTICS) {
    if (h.patterns.some(p => p.test(msg))) {
      addFiche(h.fiche)
      reason = h.reason
      break
    }
  }

  // 2b. Check chapter title for chapter type match
  if (chap) {
    for (const ck of CHAPTER_KEYWORDS) {
      if (ck.patterns.some(p => p.test(chap))) {
        addFiche(ck.fiche)
        if (!reason) {
          reason = `Type de chapitre détecté : « ${chapterTitle} »`
        }
        break
      }
    }
  }

  // 2c. Default: if chapter is active, use fiche-rhetorique
  if (selected.length === 0 && chap) {
    addFiche(FICHE_RHETORIQUE)
    reason = `Chapitre actif détecté (sans correspondance précise) : « ${chapterTitle} »`
  }

  // 2d. No signal at all
  if (selected.length === 0) {
    reason = 'Aucun signal contextuel détecté — pas de fiche chargée'
  }

  return { fiches: selected, reason }
}
