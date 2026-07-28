/**
 * Guide complet de rédaction de thèse
 * Conseils pratiques et actionnables extraits de 5 ouvrages de référence en rédaction académique.
 *
 * Sources :
 *   1. Turabian, K.L. (2018). A Manual for Writers of Research Papers, Theses, and Dissertations (9e éd.). University of Chicago Press.
 *   2. Murray, R. (2017). Writing for Academic Success (2e éd.). SAGE Publications.
 *   3. Graustein, G. (1930). The Fundamentals of Academic Writing. Harvard University Press.
 *   4. Paltridge, B. & Starfield, S. (2020). Thesis and Dissertation Writing in a Second Language (2e éd.). Routledge.
 *   5. Brause, D. (2000). Write Your Dissertation in Fifteen Minutes a Day. Owl Books.
 *
 * Convention : tout le contenu textuel est en français ; les noms d'interface,
 * clés et structure de code sont en anglais.
 */

// ─── Interfaces ───────────────────────────────────────────────────

/** Métadonnées d'une source bibliographique */
export interface WritingSource {
  id: string
  author: string
  year: number
  title: string
  publisher: string
  focusAreas: string[]
}

/** Conseil par phase de rédaction */
export interface WritingPhase {
  id: string
  phase: string
  icon: string
  description: string
  tips: string[]
  checkpoints: string[]
  sourceIds: string[]
}

/** Conseil de structuration (macro-organisation) */
export interface StructureTip {
  id: string
  topic: string
  icon: string
  principle: string
  actionableSteps: string[]
  example: string
  sourceIds: string[]
}

/** Conseil d'argumentation et de persuasion */
export interface ArgumentationTip {
  id: string
  strategy: string
  icon: string
  description: string
  howTo: string[]
  trap: string
  sourceIds: string[]
}

/** Conseil de style académique et mécanique du texte */
export interface StyleTip {
  id: string
  domain: string
  icon: string
  principle: string
  rules: string[]
  wrongRight: { wrong: string; right: string }[]
  sourceIds: string[]
}

/** Conseil de révision et d'amélioration */
export interface RevisionTip {
  id: string
  stage: string
  icon: string
  description: string
  actions: string[]
  tool: string
  sourceIds: string[]
}

/** Conseil de productivité et gestion du processus */
export interface ProductivityTip {
  id: string
  theme: string
  icon: string
  principle: string
  steps: string[]
  frequency: string
  sourceIds: string[]
}

/** Erreur fréquente à éviter */
export interface PitfallEntry {
  id: string
  pitfall: string
  icon: string
  consequence: string
  fix: string
  sourceIds: string[]
}

/** Conseil spécifique à la revue de littérature */
export interface LiteratureTip {
  id: string
  topic: string
  icon: string
  principle: string
  steps: string[]
  avoid: string[]
  sourceIds: string[]
}

/** Patron rhétorique (moves) pour les sections clés */
export interface RhetoricalMove {
  id: string
  section: string
  icon: string
  move: string
  function: string
  linguisticMarkers: string[]
  example: string
  sourceIds: string[]
}

/** Conseil de présentation visuelle et mise en page */
export interface PresentationTip {
  id: string
  topic: string
  icon: string
  principle: string
  rules: string[]
  sourceIds: string[]
}

// ─── Sources bibliographiques ────────────────────────────────────
export const writingSources: WritingSource[] = [
  {
    id: 'turabian',
    author: 'Kate L. Turabian',
    year: 2018,
    title: 'A Manual for Writers of Research Papers, Theses, and Dissertations',
    publisher: 'University of Chicago Press',
    focusAreas: [
      'Structure et organisation du manuscrit',
      'Citations et références',
      'Normes de présentation',
      'Argumentation logique',
      'Méthodologie de recherche',
    ],
  },
  {
    id: 'murray',
    author: 'Rowena Murray',
    year: 2017,
    title: 'Writing for Academic Success',
    publisher: 'SAGE Publications',
    focusAreas: [
      'Gestion du temps d\'écriture',
      'Stratégies de rédaction productive',
      'Surmonter le syndrome de la page blanche',
      'Feedback et révision',
      'Habitudes d\'écriture',
    ],
  },
  {
    id: 'graustein',
    author: 'Carl Graustein',
    year: 1930,
    title: 'The Fundamentals of Academic Writing',
    publisher: 'Harvard University Press',
    focusAreas: [
      'Clarté et simplicité du style',
      'Structure du paragraphe',
      'Logique de l\'argumentation',
      'Économie de langage',
      'Transition entre les idées',
    ],
  },
  {
    id: 'paltridge-starfield',
    author: 'Brian Paltridge & Sue Starfield',
    year: 2020,
    title: 'Thesis and Dissertation Writing in a Second Language',
    publisher: 'Routledge',
    focusAreas: [
      'Analyse des genres académiques',
      'Structures rhétoriques (moves)',
      'Langage académique (phraséologie)',
      'Voix et positionnement de l\'auteur',
      'Écriture en L2',
    ],
  },
  {
    id: 'brause',
    author: 'Diana Brause',
    year: 2000,
    title: 'Write Your Dissertation in Fifteen Minutes a Day',
    publisher: 'Owl Books',
    focusAreas: [
      'Micro-sessions d\'écriture quotidienne',
      'Psychologie de l\'écrivain',
      'Gestion de l\'angoisse de la page blanche',
      'Routines d\'écriture',
      'Fragmentation des tâches',
    ],
  },
]

// ─── Phases de rédaction ──────────────────────────────────────────
export const writingPhases: WritingPhase[] = [
  {
    id: 'exploration',
    phase: 'Phase d\'exploration',
    icon: 'Compass',
    description: 'Lecture extensive, prise de notes, repérage des thématiques et construction du cadre conceptuel avant d\'écrire le premier mot.',
    tips: [
      'Lisez 15 articles clés de votre domaine et résumez chacun en 3 phrases (contexte, méthode, apport)',
      'Créez un tableau comparatif des principaux auteurs : théorie, méthodes, résultats, limites',
      'Notez chaque idée ou citation pertinente avec la référence complète immédiatement — ne comptez pas sur votre mémoire',
      'Identifiez les « research gaps » en notant systématiquement ce que chaque article ne couvre pas',
      'Construisez votre cadre conceptuel sous forme de schéma (concepts reliés par des flèches) avant de rédiger',
      'Rédigez un « one-pager » de votre thèse en 200 mots : sujet, question, méthode, apport attendu',
    ],
    checkpoints: [
      'Question de recherche formulée en une seule phrase claire',
      'Cadre théorique identifié avec 5-10 concepts clés définis',
      'Au moins 20 références pertinentes répertoriées dans le gestionnaire',
      'Research gap explicité et justifié',
      'Design de recherche choisi et justifié',
    ],
    sourceIds: ['turabian', 'murray', 'paltridge-starfield'],
  },
  {
    id: 'planning',
    phase: 'Phase de planification',
    icon: 'ListTree',
    description: 'Architecture détaillée du manuscrit : plan par chapitre, par section, par paragraphe avec estimation de mots.',
    tips: [
      'Faites un plan hiérarchique à 3 niveaux : chapitre → section → sous-section avec titres provisoires pour chaque niveau',
      'Attribuez un nombre cible de mots à chaque chapitre (ex. : Intro 5 000, Revue 25 000, Méthodo 10 000, Résultats 20 000, Discussion 10 000, Conclusion 3 000)',
      'Pour chaque section, écrivez en une phrase le message clé que le lecteur doit retenir',
      'Identifiez les figures et tableaux nécessaires par chapitre et créez des emplacements « [FIGURE X] » dans le plan',
      'Vérifiez la cohérence logique : chaque chapitre doit permettre le suivant (cause → effet, ou question → réponse)',
      'Partagez le plan détaillé avec votre directeur AVANT de rédiger — une révision de plan coûte 1 heure, une révision de texte coûte 10 jours',
    ],
    checkpoints: [
      'Plan détaillé approuvé par le directeur de thèse',
      'Nombre de mots cible total défini (200-300 pages typiquement)',
      'Enchaînement logique vérifié entre les chapitres',
      'Liste des figures/tableaux établie',
    ],
    sourceIds: ['turabian', 'murray'],
  },
  {
    id: 'drafting',
    phase: 'Phase de rédaction du premier jet',
    icon: 'PenLine',
    description: 'Production du premier jet sans autocensure : l\'objectif est d\'avoir du texte, pas du texte parfait.',
    tips: [
      'Rédigez les chapitres méthodologiques et résultats EN PREMIER — ce sont les plus factuels et les plus faciles à démarrer',
      'Laissez l\'introduction et la conclusion pour la FIN — elles nécessitent de connaître tout le contenu',
      'Appliquez la règle « le premier jet n\'est jamais pour le lecteur » : écrivez vite, corrigez plus tard',
      'Commencez chaque session de rédaction par un paragraphe sur lequel vous vous êtes arrêté la veille — cela relance le flux',
      'Si vous bloquez sur une section, écrivez « [À COMPLÉTER : expliquer X] » et passez à la section suivante — revenez-y plus tard',
      'Gardez un document « brouillons et notes » séparé pour y jeter vos idées informelles sans polluer le manuscrit',
    ],
    checkpoints: [
      'Premier jet complet (même imparfait) de chaque chapitre',
      'Aucune section ne reste vide ou en « TODO »',
      'Toutes les données et analyses sont intégrées dans le texte',
    ],
    sourceIds: ['brause', 'murray', 'graustein'],
  },
  {
    id: 'revision',
    phase: 'Phase de révision et de raffinement',
    icon: 'Eraser',
    description: 'Rework systématique du texte : clarification, suppression du superflu, renforcement de l\'argumentation.',
    tips: [
      'Révisez en 3 passes distinctes : (1) structure et logique, (2) style et clarté, (3) orthographe et format — jamais en même temps',
      'Lisez votre texte à voix haute — les phrases trop longues ou mal rythmées sautent immédiatement aux oreilles',
      'Pour chaque paragraphe, vérifiez qu\'une seule idée principale est traitée — sinon, scindez-le',
      'Supprimez 10-15 % du texte du premier jet : les répétitions, les transitions inutiles, les phrases décoratives',
      'Vérifiez que chaque affirmation non évidente est suivie d\'une référence ou d\'une preuve — « selon X (2020)… »',
      'Faites relire par un pair (pas nécessairement de votre domaine) pour tester la lisibilité générale',
    ],
    checkpoints: [
      'Révision structurelle terminée (enchaînement logique vérifié)',
      'Révision stylistique terminée (clarté, concision)',
      'Relecture externe effectuée et retours intégrés',
      'Format et normes respectés (citations, marges, police)',
    ],
    sourceIds: ['turabian', 'murray', 'paltridge-starfield'],
  },
  {
    id: 'finalization',
    phase: 'Phase de finalisation',
    icon: 'CheckCircle2',
    description: 'Derniers ajustements, vérification des normes institutionnelles, préparation de la soumission.',
    tips: [
      'Vérifiez le respect des normes de l\'école doctorale (format, marges, police, interligne, pagination)',
      'Relisez systématiquement la page de titre, le résumé et les mots-clés — ce sont les éléments les plus consultés',
      'Assurez-vous que la bibliographie est complète : chaque citation dans le texte a une entrée biblio, et vice-versa',
      'Testez tous les liens hypertextiques (si version numérique), toutes les renvois de figures/tableaux',
      'Vérifiez la cohérence de la numérotation (chapitres, figures, tableaux, équations)',
      'Préparez les annexes, l\'index des termes (si requis) et les remerciements en dernier',
    ],
    checkpoints: [
      'Normes institutionnelles respectées point par point',
      'Bibliographie cohérente et complète',
      'Tous les renvois internes vérifiés (fig., tab., §)',
      'Version finale sauvegardée en 3 formats (PDF, DOCX, cloud)',
    ],
    sourceIds: ['turabian'],
  },
]

// ─── Conseils de structuration ────────────────────────────────────
export const structureTips: StructureTip[] = [
  {
    id: 'str-skeleton',
    topic: 'Le squelette de la thèse',
    icon: 'LayoutGrid',
    principle: 'Une thèse se construit comme une argumentation progressive : chaque chapitre pose une question que le suivant répond.',
    actionableSteps: [
      'Dessinez le « story arc » de votre thèse en 6 blocs : contexte → théorie → méthode → résultats → interprétation → conclusion',
      'Vérifiez que chaque chapitre commence par un « chapitre précédent a montré X, ce chapitre va montrer Y »',
      'Assurez-vous que le chapitre de conclusion revient sur CHAQUE objectif formulé dans l\'introduction',
      'Limitez-vous à 4-6 chapitres hors front/back matter — au-delà, le fil conducteur se perd',
    ],
    example: 'Chap. 1 (Contexte) pose la question. Chap. 2 (Théorie) donne les outils conceptuels. Chap. 3 (Méthodo) explique comment répondre. Chap. 4-5 (Résultats+Discussion) apportent la réponse. Chap. 6 (Conclusion) synthétise.',
    sourceIds: ['turabian', 'paltridge-starfield'],
  },
  {
    id: 'str-paragraph',
    topic: 'L\'art du paragraphe',
    icon: 'AlignLeft',
    principle: 'Un paragraphe = une idée. Il suit une structure microscopique : affirmer → démontrer → conclure.',
    actionableSteps: [
      'Commencez chaque paragraphe par une phrase-topic qui résume l\'idée principale en une seule phrase',
      'Développez avec 3-5 phrases d\'explication, preuve ou exemple',
      'Terminez par une phrase de transition vers le paragraphe suivant ou une sous-conclusion',
      'Si un paragraphe dépasse 250 mots, demandez-vous s\'il contient deux idées — scindez-le',
      'Supprimez les phrases-topic vides (« Dans cette section, nous allons discuter de… ») — entrez directement dans le vif du sujet',
    ],
    example: 'Topic sentence : « L\'approche mixte offre une triangulation des résultats (Creswell, 2018). » → Preuves : données quantitatives croisées avec entretiens. → Conclusion/transition : « Cette triangulation renforce la validité des résultats, ce qui justifie son emploi dans notre étude. »',
    sourceIds: ['graustein', 'turabian'],
  },
  {
    id: 'str-chapter-arc',
    topic: 'L\'arc narratif du chapitre',
    icon: 'GitBranch',
    principle: 'Chaque chapitre est un mini-ouvrage avec sa propre introduction, son développement et sa conclusion partielle.',
    actionableSteps: [
      'Ouvrez chaque chapitre par un court paragraphe qui annonce ce que le chapitre va traiter et pourquoi',
      'Fermez chaque chapitre par un paragraphe de synthèse qui résume l\'apport et annonce le chapitre suivant',
      'Utilisez des sous-titres explicites (pas « Analyse » mais « Analyse des déterminants socio-économiques »)',
      'Vérifiez que le lecteur peut comprendre un chapitre isolément sans avoir lu les précédents en détail',
      'Placez un « fil d\'Ariane » en début de chapitre : un rappel en 2-3 phrases de où on en est dans la thèse',
    ],
    example: 'Début de chapitre : « Le chapitre précédent a établi le cadre théorique de l\'analyse institutionnelle. Ce chapitre présente la méthodologie adoptée pour tester les hypothèses formulées. »',
    sourceIds: ['turabian', 'paltridge-starfield'],
  },
  {
    id: 'str-intro-funnel',
    topic: 'L\'entonnoir de l\'introduction',
    icon: 'Funnel',
    principle: 'L\'introduction va du général au spécifique en 4 étapes : contexte → problématique → objectifs → plan.',
    actionableSteps: [
      'Paragraphe 1-2 : amenez le contexte large (le domaine, l\'importance du sujet) avec des données factuelles',
      'Paragraphe 3-4 : resserrez vers la problématique spécifique en identifiant le research gap',
      'Paragraphe 5 : formulez les objectifs et hypothèses de recherche clairement (bulletpoints possibles)',
      'Dernier paragraphe : annoncez l\'organisation du manuscrit, chapitre par chapitre',
      'Longueur cible : 10-15 pages (3 000-5 000 mots) — pas plus, sinon c\'est une revue de littérature déguisée',
    ],
    example: '« La transition énergétique est un défi majeur du XXIe siècle [contexte large]. Toutefois, les mécanismes d\'adoption des technologies renouvelables par les PME restent mal compris [gap]. Cette thèse vise à… [objectifs]. Le manuscrit s\'organise en six chapitres… [plan]. »',
    sourceIds: ['turabian', 'paltridge-starfield'],
  },
  {
    id: 'str-conclusion-mirror',
    topic: 'Le miroir de la conclusion',
    icon: 'Copy',
    principle: 'La conclusion est le reflet inversé de l\'introduction : elle part du spécifique (résultats) pour revenir au général (implications).',
    actionableSteps: [
      'Rappelez la problématique et les objectifs en 2-3 phrases (sans répéter l\'intro mot à mot)',
      'Résumez les principaux résultats chapitre par chapitre — pas de nouveaux chiffres',
      'Répondez explicitement à la question de recherche formulée en introduction',
      'Dégagez la contribution scientifique en 2-3 phrases percutantes',
      'Ouvrez sur des perspectives de recherche future (1 paragraphe max)',
      'Longueur cible : 5-8 pages (1 500-3 000 mots) — plus court que l\'introduction',
    ],
    example: '« Cette thèse avait pour objectif de [rappel]. Les résultats montrent que [synthèse]. En réponse à la problématique, [réponse directe]. La contribution principale est [apport]. Des pistes futures incluent [ouverture]. »',
    sourceIds: ['turabian', 'graustein'],
  },
  {
    id: 'str-balance',
    topic: 'L\'équilibre des chapitres',
    icon: 'Scale',
    principle: 'Une thèse déséquilibrée signale un manque de maturité — la revue de littérature ne doit pas écraser les résultats.',
    actionableSteps: [
      'Viser cette répartition indicative : Intro 8 %, Revue 25 %, Méthodo 12 %, Résultats 30 %, Discussion 18 %, Conclusion 7 %',
      'Si votre revue de littérature dépasse 35 % du manuscrit, c\'est un signe que vous n\'avez pas assez de résultats',
      'Si vos résultats occupent moins de 25 %, vérifiez que vous n\'êtes pas en train de rédiger un « essai théorique » au lieu d\'une thèse empirique',
      'Demandez à votre directeur de valider la répartition en pages avant la rédaction finale',
      'Utilisez un tableur pour suivre le nombre de mots par chapitre en temps réel',
    ],
    example: 'Pour une thèse de 80 000 mots : Intro ≈ 6 400, Revue ≈ 20 000, Méthodo ≈ 9 600, Résultats ≈ 24 000, Discussion ≈ 14 400, Conclusion ≈ 5 600.',
    sourceIds: ['turabian', 'murray'],
  },
]

// ─── Conseils d'argumentation ─────────────────────────────────────
export const argumentationTips: ArgumentationTip[] = [
  {
    id: 'arg-claim-evidence',
    strategy: 'Affirmation soutenue par preuve',
    icon: 'ShieldCheck',
    description: 'Chaque affirmation non triviale doit être immédiatement suivie d\'une preuve empirique, d\'une référence ou d\'un raisonnement logique.',
    howTo: [
      'Rédigez un premier jet où vous affichez toutes vos affirmations',
      'Relisez et pour chaque affirmation, posez la question : « Qu\'est-ce qui justifie cela ? »',
      'Insérez la preuve (citation, donnée, exemple) immédiatement après l\'affirmation',
      'Si aucune preuve n\'est disponible, reformulez en opinion prudente (« Il semble que… », « On peut supposer que… »)',
    ],
    trap: 'Enchaîner les affirmations non justifiées — le jury perçoit cela comme un manque de rigueur scientifique.',
    sourceIds: ['turabian', 'graustein'],
  },
  {
    id: 'arg-counterarguments',
    strategy: 'Anticiper et réfuter les objections',
    icon: 'Swords',
    description: 'Un argument fort n\'ignore pas les objections — il les reconnaît et y répond de manière convaincante.',
    howTo: [
      'Pour chaque argument principal, listez mentalement 2 objections possibles',
      'Accordez 1-2 phrases à l\'objection : « Certains auteurs soutiennent que… (Dupont, 2019) »',
      'Réfutez immédiatement : « Toutefois, cette position néglige le fait que… » ou « Si cette objection est recevable dans le cas X, elle ne s\'applique pas ici car… »',
      'Intégrez cette technique surtout dans la Discussion et dans la revue de littérature',
    ],
    trap: 'Présenter uniquement les arguments favorables à votre hypothèse — cela signale un biais de confirmation.',
    sourceIds: ['turabian', 'graustein'],
  },
  {
    id: 'arg-signposting',
    strategy: 'Signalisation du cheminement argumentatif',
    icon: 'SignpostBig',
    description: 'Guider le lecteur explicitement à travers votre raisonnement avec des marqueurs de progression.',
    howTo: [
      'En début de section : « Cette section examine… dans le but de… »',
      'Entre les étapes : « Après avoir analysé X, il convient désormais d\'aborder Y »',
      'En fin de section : « Comme nous venons de le montrer, … ce qui nous amène à… »',
      'Évitez cependant les formulations trop lourdes : « Il est important de noter que… » → supprimez et entrez directement dans le contenu',
      'Utilisez un registre de modulation : « d\'une part… d\'autre part… », « non seulement… mais aussi… », « en revanche… »',
    ],
    trap: 'Abuser des marqueurs au point de rendre le texte artificiel — alternez entre signalisation explicite et transitions naturelles.',
    sourceIds: ['paltridge-starfield', 'turabian'],
  },
  {
    id: 'arg-hedging',
    strategy: 'L\'art de la nuance (hedging)',
    icon: 'Feather',
    description: 'Moduler vos affirmations selon le niveau de certitude — ne jamais présenter une interprétation comme un fait établi.',
    howTo: [
      'Certitude forte : « Les résultats montrent clairement que… », « Il est établi que… »',
      'Certitude modérée : « Ces données suggèrent que… », « Il semble que… », « Les résultats tendent à indiquer… »',
      'Certitude faible : « Une hypothèse plausible est que… », « On peut supposer que… »',
      'N\'utilisez JAMAIS de termes absolus (« prouve », « démontre », « toujours ») sauf si les preuves sont irréfutables',
      'Préférez « contribue à expliquer » à « explique » ; « est associé à » à « cause de »',
    ],
    trap: 'Être trop timide (« on pourrait peut-être éventuellement penser que… ») — le jury doutera de votre confiance dans vos résultats.',
    sourceIds: ['paltridge-starfield', 'graustein'],
  },
  {
    id: 'arg-synthesis',
    strategy: 'Synthétiser plutôt que juxtaposer',
    icon: 'Layers',
    description: 'La revue de littérature ne doit pas être une succession de résumés d\'articles — elle doit créer un dialogue entre les sources.',
    howTo: [
      'Regroupez les articles par thème, pas par auteur — « Trois courants s\'opposent sur cette question… »',
      'Mettez les auteurs en dialogue : « Alors que X (2018) soutient…, Y (2020) avance au contraire que… »',
      'Identifiez les convergences et les contradictions entre les études',
      'Concluez chaque sous-thème par un bilan : « En somme, la littérature met en évidence… mais laisse ouverte la question de… »',
      'Terminez la revue par un tableau de synthèse qui croise auteurs, méthodes et résultats principaux',
    ],
    trap: 'Faire un catalogue « Auteur A dit ceci. Auteur B dit cela. Auteur C a aussi dit quelque chose. » — c\'est un résumé, pas une synthèse.',
    sourceIds: ['turabian', 'paltridge-starfield', 'murray'],
  },
]

// ─── Conseils de style académique ─────────────────────────────────
export const styleTips: StyleTip[] = [
  {
    id: 'sty-clarity',
    domain: 'Clarté et lisibilité',
    icon: 'Eye',
    principle: 'Le style académique ne signifie pas style obscur. Un texte clair est un texte intelligent ; un texte confus est un texte qui se cache derrière son jargon.',
    rules: [
      'Limitez les phrases à 25-35 mots maximum — au-delà, scindez',
      'Une idée par phrase, une phrase par idée',
      'Évitez la voix passive when possible : « Les résultats ont montré que… » plutôt que « Il a été montré que… »',
      'Préférez les verbes d\'action aux nominalisations : « analyser les données » plutôt que « l\'analyse des données a été effectuée »',
      'Définissez chaque terme technique à sa première occurrence — même si votre jury le connaît',
    ],
    wrongRight: [
      { wrong: 'Il a été constaté par les auteurs de l\'étude que les résultats obtenus étaient significatifs d\'un point de vue statistique.', right: 'Notre analyse montre des résultats statistiquement significatifs.' },
      { wrong: 'L\'effectuation de l\'analyse a permis la mise en évidence d\'un effet significatif.', right: 'L\'analyse révèle un effet significatif.' },
      { wrong: 'Il est important de noter qu\'il convient de souligner que les résultats sont en adéquation avec nos attentes.', right: 'Les résultats confirment nos attentes.' },
      { wrong: 'En ce qui concerne la question de la méthodologie, il est à noter que nous avons opté pour une approche qualitative.', right: 'Nous avons adopté une approche qualitative.' },
    ],
    sourceIds: ['graustein', 'turabian'],
  },
  {
    id: 'sty-concision',
    domain: 'Économie de mots',
    icon: 'Scissors',
    principle: 'Chaque mot doit travailler. Si un mot peut être supprimé sans perte de sens, il doit l\'être.',
    rules: [
      'Supprimez les formules vides : « Il est à noter que », « Il convient de mentionner », « Il va sans dire que »',
      'Supprimez les adverbes redondants : « tout à fait nouveau » → « nouveau » ; « complètement unique » → « unique »',
      'Remplacez « en ce qui concerne » par « concernant » ou « quant à »',
      'Remplacez « dans le cadre de » par « dans » ou « dans le cadre »',
      'Évitez les répétitions dans la même phrase : « L\'analyse des analyses a révélé… » → « L\'analyse a révélé… »',
      'Supprimez les propositions relatives redondantes : « Les participants qui étaient âgés de plus de 18 ans » → « Les participants de plus de 18 ans »',
    ],
    wrongRight: [
      { wrong: 'Dans le but de répondre à la question de recherche qui a été formulée précédemment, une analyse a été réalisée.', right: 'Pour répondre à notre question de recherche, nous avons mené une analyse.' },
      { wrong: 'Il est important de prendre en considération le fait que les résultats obtenus sont limités.', right: 'Ces résultats sont limités.' },
    ],
    sourceIds: ['graustein', 'murray'],
  },
  {
    id: 'sty-academic-voice',
    domain: 'Voix académique et positionnement',
    icon: 'UserCheck',
    principle: 'Trouvez l\'équilibre entre objectivité et engagement — vous ne rapportez pas les faits, vous contribuez au débat scientifique.',
    rules: [
      'Utilisez « nous » (ou « je » si autorisé par votre institution) pour les décisions de recherche : « Nous avons choisi cette méthode parce que… »',
      'Utilisez le présent pour les vérités générales et le passé pour vos actions : « Bandura (1977) soutient que… Nous avons testé cette hypothèse en… »',
      'Prenez position : « Nous soutenons que… » est préférable à « Il pourrait être soutenu que… »',
      'Signalez explicitement votre contribution : « À notre connaissance, cette étude est la première à… »',
      'Distinguez clairement ce qui vient de la littérature de ce qui est votre analyse : marqueurs de source systématiques',
    ],
    wrongRight: [
      { wrong: 'Il pourrait être avancé que les résultats sont intéressants.', right: 'Ces résultats apportent un éclairage nouveau sur…' },
      { wrong: 'Des recherches antérieures ont montré (Smith, 2018; Jones, 2019). Notre étude a obtenu des résultats similaires.', right: 'En accord avec Smith (2018) et Jones (2019), nos résultats confirment…' },
    ],
    sourceIds: ['paltridge-starfield', 'turabian'],
  },
  {
    id: 'sty-transitions',
    domain: 'Transitions entre les idées',
    icon: 'ArrowRightLeft',
    principle: 'Les transitions créent la fluidité du texte — sans elles, le lecteur navigue à l\'aveuglette entre des idées déconnectées.',
    rules: [
      'En début de paragraphe : résumez le lien avec le paragraphe précédent (« Sur la base de ces résultats… »)',
      'Entre les sections : utilisez une phrase-charnière en fin de section qui annonce la suivante',
      'Variez les connecteurs : ne commencez pas 3 paragraphes consécutifs par « En outre… »',
      'Catégories de connecteurs à maîtriser : addition (en outre, de plus), opposition (toutefois, en revanche), cause (par conséquent, ainsi), illustration (par exemple, en l\'occurrence)',
      'Quand une transition naturelle n\'existe pas, créez un sous-titre — c\'est aussi un moyen de transition',
    ],
    wrongRight: [
      { wrong: 'Les résultats sont significatifs. Les limites doivent être discutées. Les perspectives sont nombreuses.', right: 'Si ces résultats sont significatifs, l\'étude présente certaines limites. Néanmoins, ils ouvrent des perspectives prometteuses.' },
    ],
    sourceIds: ['graustein', 'turabian'],
  },
  {
    id: 'sty-figures-tables',
    domain: 'Légendes de figures et tableaux',
    icon: 'Image',
    principle: 'Une figure ou un tableau doit être autonome — le lecteur doit le comprendre sans lire le texte.',
    rules: [
      'La légende se place AU-DESSUS d\'un tableau et EN-DESSOUS d\'une figure',
      'La légende doit contenir : ce qui est présenté, les variables, l\'échantillon, et tout symbole non évident',
      'Numérotez en continu (Figure 1, Figure 2… ou Tab. 1, Tab. 2…) dans l\'ordre d\'apparition',
      'Dans le texte, renvoyez systématiquement à la figure/tableau : « La Figure 3 illustre… » ou « (voir Figure 3) »',
      'Ne répétez pas dans le texte toutes les valeurs d\'un tableau — résumez la tendance principale',
      'Assurez-vous que la police dans les figures est lisible et cohérente avec le reste du manuscrit',
    ],
    wrongRight: [
      { wrong: '(voir figure ci-dessus)', right: 'La Figure 2 présente l\'évolution du taux de réponse selon les modalités expérimentales.' },
      { wrong: 'Comme le montre le tableau, les valeurs sont 12, 34, 56, 78 et 90.', right: 'Le Tableau 3 montre une progression régulière de 12 à 90 (voir Tableau 3).' },
    ],
    sourceIds: ['turabian'],
  },
]

// ─── Conseils de révision ─────────────────────────────────────────
export const revisionTips: RevisionTip[] = [
  {
    id: 'rev-structure',
    stage: 'Révision structurelle (macro)',
    icon: 'Workflow',
    description: 'Vérifier la logique globale, l\'enchaînement des idées et la cohérence argumentative du manuscrit entier.',
    actions: [
      'Lisez uniquement les titres et sous-titres de tous les chapitres — l\'arc narratif est-il clair sans lire le contenu ?',
      'Vérifiez que chaque chapitre contient un paragraphe d\'ouverture et de clôture',
      'Lisez la première phrase de chaque paragraphe d\'un chapitre — ces phrases seules doivent former un résumé cohérent',
      'Identifiez les « trous logiques » : un concept utilisé sans avoir été défini, un résultat mentionné sans analyse',
      'Vérifiez que les objectifs de l\'introduction trouvent tous une réponse dans la conclusion',
      'Assurez-vous que les transitions entre chapitres existent (même implicites)',
    ],
    tool: 'Plan révisé sur papier ou tableau blanc — visualisez l\'architecture avant de retoucher le texte',
    sourceIds: ['turabian', 'murray'],
  },
  {
    id: 'rev-style',
    stage: 'Révision stylistique (micro)',
    icon: 'Sparkles',
    description: 'Améliorer la clarté, la concision et la fluidité phrase par phrase, paragraphe par paragraphe.',
    actions: [
      'Lisez le texte à voix haute — tout ce qui sonne mal DOIT être réécrit',
      'Recherchez et supprimez : « il est important de noter que », « il convient de souligner », « dans le cadre de »',
      'Vérifiez que chaque phrase a un sujet, un verbe et un complément clairs — pas de phrases nominales flottantes',
      'Remplacez les mots faibles (« chose », « fait », « aspect », « élément ») par des termes précis',
      'Éliminez les répétitions de mots proches dans une même phrase (« analyser l\'analyse »)',
      'Vérifiez la longueur des phrases : si 3 phrases consécutives dépassent 30 mots, scindez-en au moins une',
    ],
    tool: 'Correcteur grammatical + recherche de mots-clés « il est », « il convient », « dans le cadre » dans votre éditeur',
    sourceIds: ['graustein', 'murray'],
  },
  {
    id: 'rev-references',
    stage: 'Révision des références',
    icon: 'BookOpenCheck',
    description: 'Vérifier l\'exactitude, la cohérence et la complétude de toutes les citations et de la bibliographie.',
    actions: [
      'Vérifiez que chaque citation dans le texte (Auteur, Année) a une entrée correspondante dans la bibliographie',
      'Vérifiez l\'inverse : chaque entrée bibliographique est citée au moins une fois dans le texte',
      'Confirmez les DOI et les URL des références récentes — les liens cassés sont un signal négatif',
      'Assurez-vous que le style bibliographique est homogène (APA, Vancouver, Chicago…) sur TOUTE la bibliographie',
      'Vérifiez les majuscules, italiques et ponctuation dans chaque entrée bibliographique',
      'Utilisez un gestionnaire de références pour automatiser le formatage — ne le faites jamais à la main',
    ],
    tool: 'Zotero / Mendeley / EndNote + vérification manuelle d\'un échantillon de 10 % des références',
    sourceIds: ['turabian'],
  },
  {
    id: 'rev-feedback',
    stage: 'Intégration du feedback',
    icon: 'MessageCircle',
    description: 'Recevoir, interpréter et intégrer les commentaires de votre directeur et des relecteurs de manière systématique.',
    actions: [
      'Créez un tableau à 3 colonnes : Commentaire reçu | Action prévue | Statut (fait / en cours / reporté)',
      'Ne modifiez JAMAIS votre texte sans avoir compris le problème soulevé — discutez avec le commentateur si nécessaire',
      'Traitez les commentaires en priorité : critiques structurelles d\'abord, détails stylistiques ensuite',
      'Quand un commentaire est ambigu, reformulez-le dans vos propres mots pour vérifier votre compréhension',
      'Documentez les décisions que vous ne suivez pas et justifiez-les — préparez une réponse argumentée',
      'Après intégration, relisez les sections modifiées pour vérifier la cohérence avec le reste du texte',
    ],
    tool: 'Tableur de suivi des commentaires (Google Sheets ou Excel) avec colonnes : Source | Citation | Problème | Action | Date | Statut',
    sourceIds: ['murray', 'brause'],
  },
]

// ─── Conseils de productivité ──────────────────────────────────────
export const productivityTips: ProductivityTip[] = [
  {
    id: 'prod-daily-writing',
    theme: 'Micro-sessions d\'écriture quotidienne',
    icon: 'Timer',
    principle: 'Écrire 15-30 minutes par jour est infiniment plus productif qu\'écrire 8 heures le dimanche. La régularité bat l\'intensité.',
    steps: [
      'Bloquez un créneau quotidien de 25 minutes (méthode Pomodoro) — même 15 minutes suffisent',
      'Définissez AVANT la session ce que vous allez écrire : une section, un paragraphe, une analyse — pas « travailler sur la thèse »',
      'Fermez TOUS les onglets, notifications et distractions pendant la session',
      'Si vous êtes bloqué, écrivez n\'importe quoi — même « je ne sais pas quoi écrire ici, mais il faut parler de… » — le flux viendra',
      'À la fin de chaque session, notez en une phrase où vous en êtes pour la session suivante',
      'Augmentez progressivement : après 2 semaines à 25 min, passez à 45 min',
    ],
    frequency: 'Quotidien — sans exception. Même 15 minutes comptent.',
    sourceIds: ['brause', 'murray'],
  },
  {
    id: 'prod-snack-writing',
    theme: 'Rédaction par « snacks »',
    icon: 'Cookie',
    principle: 'Fragmenter les tâches d\'écriture en unités réalisables en 15-30 minutes pour éliminer la procrastination.',
    steps: [
      'Listez toutes les micro-tâches d\'écriture de votre chapitre : « rédiger l\'intro de la section 3.2 », « décrire le Tableau 5 », « écrire la transition §2.3 → §2.4 »',
      'Attribuez une durée estimée à chaque micro-tâche (15, 30 ou 45 min)',
      'Choisissez la tâche la plus simple possible pour démarrer — la momentum viendra naturellement',
      'Cochez chaque tâche accomplie — la progression visuelle est un moteur psychologique puissant',
      'Conservez une « liste d\'attente » de tâches rapides (< 15 min) pour les jours où vous manquez de temps',
    ],
    frequency: 'Chaque session d\'écriture commence par le choix d\'une micro-tâche spécifique.',
    sourceIds: ['brause'],
  },
  {
    id: 'prod-writing-group',
    theme: 'Groupes d\'écriture (Shut Up & Write)',
    icon: 'Users',
    principle: 'L\'engagement social crée une pression positive qui maintient la régularité de l\'écriture.',
    steps: [
      'Formez un groupe de 3-5 doctorants — idéalement de disciplines différentes pour éviter les comparaisons',
      'Rencontrez-vous 1-2 fois par semaine pour une session de 2 heures (25 min écriture / 5 min pause × 4 cycles)',
      'Commencez chaque session par un tour de table : « Je vais travailler sur… »',
      'Terminez par un second tour : « J\'ai écrit X mots / terminé Y section »',
      'Utilisez un outil de suivi partagé (tableur ou application) pour visualiser la progression collective',
      'Si le groupe se démotivre, changez le format : session en ligne, changement de lieu, challenges hebdomadaires',
    ],
    frequency: '1-2 sessions par semaine de 2 heures, en complément de l\'écriture quotidienne individuelle.',
    sourceIds: ['murray', 'brause'],
  },
  {
    id: 'prod-perfectionism',
    theme: 'Combattre le perfectionnisme paralysant',
    icon: 'Ban',
    principle: 'Le perfectionnisme en rédaction est un mécanisme de procrastination déguisé. « Je veux bien faire » devient « Je ne fais rien ».',
    steps: [
      'Adoptez ce mantra : « Un texte mauvais que je peux réviser vaut infiniment mieux qu\'une page blanche parfaite »',
      'Fixez-vous pour objectif d\'écrire 300 mots imparfaits plutôt que 50 mots polis',
      'Quand vous relisez et corrigez pendant que vous écrivez : arrêtez. Séparez explicitement rédaction et correction',
      'Utilisez un écran sombre ou une police inhabituelle pour le premier jet — cela désactive le « correcteur intérieur »',
      'Accordez-vous le droit d\'écrire des paragraphes « placeholder » : « [INSÉRER : analyse détaillée des résultats du modèle 3] »',
      'Rappelez-vous : votre directeur s\'attend à un brouillon, pas à un manuscrit publié',
    ],
    frequency: 'À appliquer à CHAQUE session de rédaction du premier jet.',
    sourceIds: ['brause', 'murray'],
  },
  {
    id: 'prod-tracking',
    theme: 'Suivi de la progression',
    icon: 'TrendingUp',
    principle: 'Ce qui se mesure s\'améliore. Suivre ses mots écrits crée une boucle de rétroaction positive.',
    steps: [
      'Enregistrez le nombre de mots écrits par session dans un tableur ou une application (ex. : WritersSQ)',
      'Calculez votre moyenne hebdomadaire — l\'objectif n\'est pas un chiffre élevé mais une régularité',
      'Visualisez la progression par chapitre : nombre de mots actuels / nombre cible → pourcentage de complétion',
      'Célébrez les jalons : chaque 5 000 mots, chaque chapitre terminé, chaque révision intégrée',
      'Revue hebdomadaire : 10 minutes le dimanche pour planifier la semaine suivante en fonction de la progression',
      'Si la courbe stagne pendant 2 semaines, changez de stratégie : nouvelles horaires, nouveau lieu, nouveau groupe',
    ],
    frequency: 'Quotidien (enregistrement) + hebdomadaire (analyse) + mensuel (révision des objectifs).',
    sourceIds: ['brause', 'murray'],
  },
]

// ─── Erreurs fréquentes ───────────────────────────────────────────
export const commonPitfalls: PitfallEntry[] = [
  {
    id: 'pit-perfection',
    pitfall: 'Écrire et réviser en même temps',
    icon: 'PencilRuler',
    consequence: 'Ralentissement drastique (5-10x plus lent), frustration, blocage prolongé, syndrome de la page blanche.',
    fix: 'Séparez explicitement les deux activités. Le matin : rédiger sans relire. L\'après-midi (ou le lendemain) : réviser ce qui a été écrit.',
    sourceIds: ['brause', 'murray'],
  },
  {
    id: 'pit-bibliocoverage',
    pitfall: 'Revue de littérature en catalogue (auteur par auteur)',
    icon: 'Library',
    consequence: 'Le jury perçoit un manque de synthèse et de pensée critique — signe d\'immaturité académique.',
    fix: 'Organisez par thème et problématique. Mettez les auteurs en dialogue : convergences, contradictions et limites de chaque courant.',
    sourceIds: ['turabian', 'paltridge-starfield'],
  },
  {
    id: 'pit-intro-length',
    pitfall: 'Introduction trop longue (type revue de littérature)',
    icon: 'TextSearch',
    consequence: 'Le lecteur perd le fil, l\'introduction noie la problématique sous les détails, le plan annoncé arrive trop tard.',
    fix: 'Limitez l\'introduction à 10-15 pages max. Contexte (2-3 pages) → Problématique (3-4 pages) → Objectifs (2 pages) → Plan (1 page).',
    sourceIds: ['turabian'],
  },
  {
    id: 'pit-no-gap',
    pitfall: 'Absence de research gap clair dans la revue de littérature',
    icon: 'CircleDot',
    consequence: 'Le jury ne comprend pas pourquoi cette thèse était nécessaire — le « pourquoi » de la recherche manque.',
    fix: 'Formulez explicitement le gap en une ou deux phrases : « Si les travaux de X (2019) ont montré…, aucun n\'a encore examiné… » — mettez cette formulation en évidence.',
    sourceIds: ['turabian', 'paltridge-starfield'],
  },
  {
    id: 'pit-results-discussion',
    pitfall: 'Mélanger résultats et discussion',
    icon: 'Blend',
    consequence: 'Le lecteur ne distingue pas les faits de vos interprétations — cela fragilise la crédibilité scientifique.',
    fix: 'Séparez strictement : les résultats décrivent les faits (« Les données montrent… »), la discussion les interprète (« Ces résultats suggèrent que… »).',
    sourceIds: ['turabian'],
  },
  {
    id: 'pit-no-limits',
    pitfall: 'Omettre les limites de l\'étude',
    icon: 'ShieldOff',
    consequence: 'Le jury perçoit un manque de recul critique — cela peut être fatal lors de la soutenance.',
    fix: 'Dédiez systématiquement un sous-chapitre aux limites : taille de l\'échantillon, choix méthodologiques, biais possibles. Soyez honnête et précis.',
    sourceIds: ['turabian', 'murray'],
  },
  {
    id: 'pit-jargon',
    pitfall: 'Abus de jargon technique sans définition',
    icon: 'BookX',
    consequence: 'Même les experts de votre domaine perdent le fil — le jargon n\'est pas un marqueur de compétence, c\'est une barrière.',
    fix: 'Définissez chaque terme technique à sa première occurrence. Si votre grand-mère ne comprend pas la phrase, simplifiez.',
    sourceIds: ['graustein', 'paltridge-starfield'],
  },
  {
    id: 'pit-plagiarism',
    pitfall: 'Paraphrase trop proche du texte source',
    icon: 'AlertTriangle',
    consequence: 'Accusation de plagiat, rejet du manuscrit, sanctions disciplinaires — même involontaire.',
    fix: 'Lisez la source, fermez-la, et reformulez avec vos propres mots. Citez systématiquement. Utilisez des guillemets pour toute citation exacte de plus de 3 mots.',
    sourceIds: ['turabian', 'murray'],
  },
  {
    id: 'pit-no-direction',
    pitfall: 'Ne pas consulter son directeur régulièrement',
    icon: 'UserX',
    consequence: 'Le premier jet dérive progressivement de la direction approuvée — des mois de réécriture sont nécessaires.',
    fix: 'Envoyez un brouillon de chaque chapitre à votre directeur au fur et à mesure — pas tout à la fin. Fixez une réunion toutes les 3-4 semaines minimum.',
    sourceIds: ['murray'],
  },
  {
    id: 'pit-emergency',
    pitfall: 'Tout écrire dans les 3 derniers mois',
    icon: 'Clock',
    consequence: 'Qualité médiocre, stress intense, erreurs multiples, fatigue du jury à la lecture — et potentiel échec à la soutenance.',
    fix: 'Commencez la rédaction dès le 2e année. Fixez des échéances internes : chapitre 1 au mois 4, chapitre 2 au mois 6, etc.',
    sourceIds: ['brause', 'murray'],
  },
  {
    id: 'pit-repetition',
    pitfall: 'Répéter les mêmes résultats dans les sections Résultats et Discussion',
    icon: 'Copy',
    consequence: 'Article/manuscrit trop long, lecteur agacé, jury qui doute de votre capacité à synthétiser.',
    fix: 'Dans les Résultats : décrivez les faits avec les chiffres. Dans la Discussion : interprétez la signification sans répéter les données numériques.',
    sourceIds: ['turabian'],
  },
  {
    id: 'pit-bad-titles',
    pitfall: 'Titres de sections vagues ou non informatifs',
    icon: 'Heading',
    consequence: 'Le lecteur ne peut pas naviguer efficacement — il doit tout lire pour comprendre la structure.',
    fix: 'Rendez chaque titre auto-suffisant : « Analyse des déterminants » → « Analyse des déterminants socio-économiques de l\'adoption technologique en PME ».',
    sourceIds: ['turabian', 'graustein'],
  },
]

// ─── Conseils spécifiques à la revue de littérature ────────────────
export const literatureTips: LiteratureTip[] = [
  {
    id: 'lit-sourcing',
    topic: 'Stratégie de recherche documentaire',
    icon: 'Search',
    principle: 'Une revue de littérature solide repose sur une stratégie de recherche systématique, pas sur le hasard des découvertes.',
    steps: [
      'Commencez par les revues de littérature récentes (5 dernières années) dans votre domaine — elles cartographient déjà le terrain',
      'Utilisez les articles fondateurs (highly cited) comme pierres angulaires de votre cadre théorique',
      'Consultez les bibliographies des articles clés pour identifier d\'autres références pertinentes (technique du « snowballing »)',
      'Ciblez au moins 3 bases de données complémentaires (Web of Science, Scopus, Google Scholar)',
      'Enregistrez systématiquement votre stratégie de recherche (mots-clés, filtres, dates, bases) — vous devrez la décrire dans votre thèse',
      'Prévoyez un système de tri : lire en profondeur (10-15 articles), lire en diagonale (30-50), archiver (100+)',
    ],
    avoid: [
      'Limiter votre recherche à Google Scholar uniquement',
      'Ignorer les articles antérieurs à 2010 sans justification',
      'Citer un article que vous n\'avez pas lu en entier',
      'Sélectionner uniquement les articles qui soutiennent votre hypothèse',
    ],
    sourceIds: ['turabian', 'murray'],
  },
  {
    id: 'lit-synthesis',
    topic: 'Synthèse vs catalogue',
    icon: 'GitMerge',
    principle: 'Une bonne revue de littérature crée un dialogue entre les sources, pas une liste de résumés.',
    steps: [
      'Identifiez les thèmes récurrents dans la littérature — ils deviendront vos sous-sections',
      'Pour chaque thème, positionnez les auteurs sur un spectre : convergences, nuances, contradictions',
      'Utilisez des verbes de positionnement : « X soutient… », « Y remet en question… », « Z nuance cette perspective en… »',
      'Concluez chaque sous-thème par un bilan qui mène naturellement à votre gap de recherche',
      'Créez un tableau de synthèse (auteurs en colonnes, thèmes en lignes, résultats dans les cellules) — incluez-le en annexe',
      'Rédigez la conclusion de la revue de littérature en dernier — elle doit aboutir à votre problématique comme une évidence',
    ],
    avoid: [
      'Organiser par auteur (« Smith (2018) dit X. Jones (2019) dit Y. »)',
      'Présenter chaque article isolément sans le mettre en relation avec les autres',
      'Ne pas conclure la revue par un bilan et un gap explicite',
      'Citer des sources sans les discuter (mentionner sans analyser)',
    ],
    sourceIds: ['turabian', 'paltridge-starfield'],
  },
  {
    id: 'lit-note-taking',
    topic: 'Prise de notes efficace',
    icon: 'StickyNote',
    principle: 'La qualité de votre revue de littérature dépend directement de la qualité de vos notes de lecture.',
    steps: [
      'Pour chaque article lu, notez : (1) question de recherche, (2) méthode, (3) résultat principal, (4) limites identifiées par l\'auteur, (5) pertinence pour votre thèse',
      'Utilisez un tableau ou un outil structuré (Notion, Obsidian, OneNote) — pas des post-its dispersés',
      'Rédigez le résumé de chaque article dans vos propres mots IMMÉDIATEMENT après la lecture — jamais « plus tard »',
      'Codez les articles par thème avec des tags ou des couleurs pour faciliter le regroupement ultérieur',
      'Notez les citations exactes (avec numéros de page) au moment de la lecture — vous ne les retrouverez pas ensuite',
      'Relisez vos notes de lecture avant de commencer à rédiger — elles sont votre matière première',
    ],
    avoid: [
      'Surligner le PDF sans prendre de notes structurées',
      'Compter sur votre mémoire pour retrouver une citation précise',
      'Lire sans noter la pertinence pour votre propre recherche',
      'Stocker les PDFs sans organiser les métadonnées associées',
    ],
    sourceIds: ['murray', 'turabian'],
  },
  {
    id: 'lit-gap-articulation',
    topic: 'Formuler le research gap',
    icon: 'Puzzle',
    principle: 'Le research gap est le pivot de toute la thèse — il justifie votre recherche et donne son sens à votre contribution.',
    steps: [
      'Identifiez au moins 3 types de gaps possibles : gap empirique (manque de données), gap théorique (cadre incomplet), gap méthodologique (approche non testée)',
      'Formulez le gap en une ou deux phrases maximum : « Si les études précédentes ont montré X, aucune n\'a encore examiné Y dans le contexte Z »',
      'Testez la formulation : un collègue non-spécialiste comprend-il pourquoi ce gap est important ?',
      'Assurez-vous que le gap est ni trop large (« personne n\'a étudié ce sujet ») ni trop étroit (« personne n\'a testé cette variable en 2023 dans cette ville »)',
      'Reliez explicitement le gap à votre question de recherche : « Ce gap justifie la question suivante : … »',
      'Placez la formulation du gap à un endroit stratégique : fin de la revue de littérature ou début de l\'introduction — avec renvoi entre les deux',
    ],
    avoid: [
      'Prétendre que personne n\'a travaillé sur votre sujet (presque jamais vrai)',
      'Formuler un gap si vague que n\'importe quelle recherche pourrait y répondre',
      'Ne pas justifier pourquoi ce gap mérite d\'être comblé',
      'Oublier de relier le gap à votre question de recherche',
    ],
    sourceIds: ['turabian', 'paltridge-starfield'],
  },
  {
    id: 'lit-citation-integration',
    topic: 'Intégration fluide des citations',
    icon: 'Quote',
    principle: 'Les citations doivent se fondre naturellement dans votre argumentation — jamais plaquées comme des preuves externes.',
    steps: [
      'Intégrez la citation dans votre phrase : « La théorie de l\'autodétermination (Deci & Ryan, 2000) postule que… » plutôt que « Deci et Ryan (2000) disent que… »',
      'Utilisez le verbe de citation adapté au contenu : « montrent » (résultats empiriques), « soutiennent » (arguments), « suggèrent » (hypothèses), « nuancent » (limites)',
      'Regroupez les citations concordantes : « Plusieurs études confirment ce résultat (Smith, 2019; Dupont, 2020; Lee, 2021) »',
      'Pour les divergences, explicitez : « Contrairement à Smith (2019), Dupont (2020) observe… »',
      'Limitez les citations textuelles (< 5 % du texte) — préférez la paraphrase avec citation',
      'Chaque fois que vous citez, expliquez immédiatement la pertinence pour votre argument : « Cette observation corrobore notre hypothèse selon laquelle… »',
    ],
    avoid: [
      'Placer les citations entre parenthèses à la fin de la phrase sans les intégrer au discours',
      'Enchaîner les citations sans commentaire ni analyse',
      'Utiliser les mêmes verbes de citation en boucle (« montre », « montre », « montre »)',
      'Citer sans expliquer pourquoi cette citation est pertinente pour votre argument',
    ],
    sourceIds: ['turabian', 'paltridge-starfield', 'graustein'],
  },
]

// ─── Patrons rhétoriques (moves) ───────────────────────────────────
export const rhetoricalMoves: RhetoricalMove[] = [
  {
    id: 'move-intro-1',
    section: 'Introduction',
    icon: 'Waypoints',
    move: 'Établir le territoire (Establishing a Territory)',
    function: 'Délimiter le domaine de recherche et montrer son importance.',
    linguisticMarkers: [
      'Au cours des dernières décennies…',
      'De nombreuses études ont examiné…',
      'La question de X occupe une place centrale dans…',
      'X est un enjeu majeur de…',
      'Il est aujourd\'hui admis que…',
    ],
    example: 'Au cours des dernières décennies, la transition numérique a profondément transformé les pratiques managériales (Smith, 2018; Jones, 2020). Cette transformation soulève des questions fondamentales quant à…',
    sourceIds: ['paltridge-starfield'],
  },
  {
    id: 'move-intro-2',
    section: 'Introduction',
    icon: 'TriangleAlert',
    move: 'Établir la niche (Establishing a Niche)',
    function: 'Identifier ce qui manque dans la littérature existante — le research gap.',
    linguisticMarkers: [
      'Toutefois, peu d\'études ont porté sur…',
      'À ce jour, aucun travail n\'a examiné…',
      'Si les recherches précédentes ont montré X, elles n\'ont pas encore abordé Y.',
      'Une lacune persiste dans la littérature concernant…',
      'Ces résultats nécessitent une investigation plus approfondie de…',
    ],
    example: 'Si ces travaux ont largement documenté l\'impact des outils numériques sur la productivité individuelle, peu d\'études ont examiné leurs effets sur la dynamique collective au sein des équipes.',
    sourceIds: ['paltridge-starfield'],
  },
  {
    id: 'move-intro-3',
    section: 'Introduction',
    icon: 'Bullseye',
    move: 'Occuper la niche (Occupying the Niche)',
    function: 'Annoncer la recherche que vous allez mener pour combler le gap.',
    linguisticMarkers: [
      'Cette thèse vise à…',
      'L\'objectif de cette recherche est de…',
      'Pour combler cette lacune, nous proposons d\'examiner…',
      'La présente étude se propose de…',
      'Nous cherchons à déterminer dans quelle mesure…',
    ],
    example: 'Pour combler cette lacune, la présente thèse vise à analyser l\'impact des outils collaboratifs numériques sur la cohésion d\'équipe dans les PME de moins de 50 employés.',
    sourceIds: ['paltridge-starfield'],
  },
  {
    id: 'move-method-1',
    section: 'Méthodologie',
    icon: 'ListChecks',
    move: 'Décrire et justifier le design',
    function: 'Expliquer le choix méthodologique et pourquoi il est adapté à la question de recherche.',
    linguisticMarkers: [
      'Nous avons adopté une approche…',
      'Cette méthode a été retenue car…',
      'Le design de recherche s\'appuie sur…',
      'Afin de répondre à notre question, nous avons…',
      'Cette technique est particulièrement adaptée pour…',
    ],
    example: 'Nous avons adopté une approche mixte combinant une analyse quantitative (enquête par questionnaire, n=200) et une analyse qualitative (entretiens semi-directifs, n=15). Ce design mixte a été retenu car il permet de trianguler les résultats et de saisir à la fois les tendances statistiques et les significations subjectives.',
    sourceIds: ['paltridge-starfield', 'turabian'],
  },
  {
    id: 'move-results-1',
    section: 'Résultats',
    icon: 'BarChart3',
    move: 'Rapporter les résultats factuels',
    function: 'Présenter les données de manière neutre et séquentielle, sans interprétation.',
    linguisticMarkers: [
      'Les résultats montrent que…',
      'L\'analyse révèle que…',
      'Comme l\'illustre la Figure X…',
      'Les données présentées dans le Tableau Y indiquent…',
      'Une corrélation significative a été observée entre…',
    ],
    example: 'Les résultats montrent que 67 % des participants (n=134) ont adopté l\'outil dans les trois premiers mois (voir Tableau 3). L\'analyse de régression logistique révèle que la taille de l\'équipe (OR=1.4, p<0.01) est le principal facteur prédictif.',
    sourceIds: ['paltridge-starfield', 'turabian'],
  },
  {
    id: 'move-discussion-1',
    section: 'Discussion',
    icon: 'MessageSquareText',
    move: 'Interpréter et mettre en perspective',
    function: 'Donner du sens aux résultats en les comparant à la littérature et en les interprétant.',
    linguisticMarkers: [
      'Ces résultats suggèrent que…',
      'Notre interprétation est que…',
      'Ce résultat est cohérent avec les travaux de X, qui…',
      'Contrairement à Y (2019), nous observons…',
      'Cette différence pourrait s\'expliquer par…',
    ],
    example: 'Ces résultats suggèrent que la taille de l\'équipe joue un rôle modérateur dans l\'adoption technologique, ce qui est cohérent avec les travaux de Lee (2020) sur les organisations de petite taille. Toutefois, contrairement à Martin (2018), nous n\'observons pas d\'effet significatif du secteur d\'activité.',
    sourceIds: ['paltridge-starfield', 'turabian'],
  },
  {
    id: 'move-discussion-2',
    section: 'Discussion',
    icon: 'ShieldQuestion',
    move: 'Annoncer les limites',
    function: 'Demontrer l\'honnêteté intellectuelle en identifiant les faiblesses de l\'étude.',
    linguisticMarkers: [
      'Cette étude présente certaines limites…',
      'Il convient de noter que…',
      'Ces résultats doivent être interprétés avec prudence car…',
      'Notre échantillon ne permet pas de généraliser à…',
      'Une limite supplémentaire concerne…',
    ],
    example: 'Cette étude présente certaines limites. Premièrement, la taille de l\'échantillon (n=200) restreint la puissance statistique pour détecter des effets de petite taille. Deuxièmement, le caractère transversal de l\'enquête ne permet pas d\'établir de relations causales.',
    sourceIds: ['paltridge-starfield', 'turabian'],
  },
  {
    id: 'move-conclusion-1',
    section: 'Conclusion',
    icon: 'Target',
    move: 'Rappel de la problématique et réponse',
    function: 'Refermer la boucle ouverte dans l\'introduction en répondant explicitement à la question de recherche.',
    linguisticMarkers: [
      'Cette thèse avait pour objectif de…',
      'En réponse à notre question de recherche…',
      'Les résultats de cette recherche montrent que…',
      'La contribution principale de ce travail est…',
      'En définitive, cette étude démontre que…',
    ],
    example: 'Cette thèse avait pour objectif d\'analyser les facteurs d\'adoption des outils collaboratifs dans les PME. En réponse à notre question de recherche, les résultats montrent que la taille de l\'équipe, le soutien managérial et la culture numérique sont les trois déterminants principaux. La contribution principale de ce travail est un modèle prédictif de l\'adoption expliquant 72 % de la variance.',
    sourceIds: ['paltridge-starfield', 'turabian'],
  },
]

// ─── Conseils de présentation visuelle ────────────────────────────
export const presentationTips: PresentationTip[] = [
  {
    id: 'pres-formatting',
    topic: 'Mise en page et format',
    icon: 'Ruler',
    principle: 'La forme reflète le professionnalisme — une mise en page soignée facilite la lecture et signale le soin apporté au travail.',
    rules: [
      'Respectez les normes de votre institution (marges, police, interligne, pagination) dès le premier jour — pas à la fin',
      'Police recommandée : Times New Roman 12, Garamond 12 ou Arial 11 — conformément aux exigences doctorales',
      'Interligne : 1.5 minimum pour le corps du texte, simple pour les notes de bas de page et la bibliographie',
      'Marges : 2.5 cm (ou 1 inch) de chaque côté sauf indication contraire',
      'Titres hiérarchisés clairement (taille/gras/italique différents pour chaque niveau)',
      'Numéroter les pages en continu — y compris les annexes (mais avec une numérotation distincte)',
    ],
    sourceIds: ['turabian'],
  },
  {
    id: 'pres-headings',
    topic: 'Système de titres',
    icon: 'Heading1',
    principle: 'Le système de titres doit permettre au lecteur de naviguer intuitivement dans le manuscrit.',
    rules: [
      'Utilisez au maximum 3-4 niveaux hiérarchiques : Chapitre → Section (1.1) → Sous-section (1.1.1) → Sous-sous-section (1.1.1.1)',
      'Chaque titre doit être informatif : « Présentation de l\'échantillon » plutôt que « Présentation »',
      'Évitez les titres interrogatifs (sauf dans certains domaines) — préférez les titres déclaratifs',
      'Assurez-vous qu\'au moins deux titres existent à chaque niveau (pas de « 1.1 » sans « 1.2 »)',
      'Générez automatiquement la table des matières à partir des styles de titre — ne la tapez jamais manuellement',
    ],
    sourceIds: ['turabian', 'graustein'],
  },
  {
    id: 'pres-consistency',
    topic: 'Cohérence visuelle',
    icon: 'Palette',
    principle: 'Un document cohérent dans ses choix visuels projette une image professionnelle et facilite la lecture.',
    rules: [
      'Choisissez UN style de citation et tenez-vous-y sur tout le manuscrit — pas d\'alternance APA/Vancouver',
      'Normalisez les abréviations : définissez chaque abréviation à sa première occurrence et utilisez-la ensuite uniformément',
      'Standardisez les formats de nombres : « cinq » pour 0-10 en début de phrase, « 15 » pour les chiffres au-delà',
      'Utilisez un seul type de guillemets (« » en français, "" en anglais) — pas de mélange',
      'Vérifiez la cohérence de la ponctuation avant et après les citations : en français, la ponctuation précède la parenthèse de citation',
      'Uniformisez le vocabulaire : choisissez un terme et tenez-vous-y (ex. : « participants » ou « sujets » — pas les deux)',
    ],
    sourceIds: ['turabian'],
  },
  {
    id: 'pres-front-back',
    topic: 'Pages préliminaires et annexes',
    icon: 'BookCover',
    principle: 'Les pages préliminaires (front matter) et les annexes (back matter) encadrent votre travail et doivent être impeccables.',
    rules: [
      'Page de titre : titre de la thèse, votre nom, institution, année, nom du directeur — conformément au modèle officiel',
      'Remerciements : personnels mais professionnels — remerciez votre directeur, les membres du jury, les collaborateurs',
      'Résumé (abstract) : 200-300 mots en français + 200-300 mots en anglais (si requis) — contenu identique, pas traduction littérale',
      'Table des matières : générée automatiquement avec les numéros de page corrects',
      'Liste des figures et tableaux : générée automatiquement avec les légendes et numéros de page',
      'Annexes : numérotées (Annexe A, Annexe B…) avec des titres clairs et un renvoi dans le corps du texte',
    ],
    sourceIds: ['turabian'],
  },
]

// ─── Helper : récupérer les conseils par source ────────────────────
export function getTipsBySource(sourceId: string): {
  phases: WritingPhase[]
  structure: StructureTip[]
  argumentation: ArgumentationTip[]
  style: StyleTip[]
  revision: RevisionTip[]
  productivity: ProductivityTip[]
  pitfalls: PitfallEntry[]
  literature: LiteratureTip[]
  moves: RhetoricalMove[]
  presentation: PresentationTip[]
} {
  return {
    phases: writingPhases.filter(p => p.sourceIds.includes(sourceId)),
    structure: structureTips.filter(s => s.sourceIds.includes(sourceId)),
    argumentation: argumentationTips.filter(a => a.sourceIds.includes(sourceId)),
    style: styleTips.filter(s => s.sourceIds.includes(sourceId)),
    revision: revisionTips.filter(r => r.sourceIds.includes(sourceId)),
    productivity: productivityTips.filter(p => p.sourceIds.includes(sourceId)),
    pitfalls: commonPitfalls.filter(p => p.sourceIds.includes(sourceId)),
    literature: literatureTips.filter(l => l.sourceIds.includes(sourceId)),
    moves: rhetoricalMoves.filter(m => m.sourceIds.includes(sourceId)),
    presentation: presentationTips.filter(p => p.sourceIds.includes(sourceId)),
  }
}

// ─── Helper : récupérer les noms des sources ───────────────────────
export function getSourceLabel(sourceId: string): string {
  const source = writingSources.find(s => s.id === sourceId)
  if (!source) return sourceId
  const shortTitle = source.title.split(':')[0].split('(')[0].trim()
  return `${source.author} (${source.year})`
}
