/**
 * Guide de méthodologie de recherche
 * Basé sur le cours IGTU-Cne3 — Gestion Des Techniques Urbaines
 * Université Constantine 3
 */

export interface MethodoStep {
  id: string
  title: string
  description: string
  details: string[]
}

export interface ResearchType {
  id: string
  title: string
  description: string
  characteristics: string[]
  icon: string
  color: string
}

export interface ProblématiqueItem {
  id: string
  question: string
  description: string
  example: string
}

export interface OperalisationExample {
  concept: string
  dimensions: { label: string; indicateurs: string[] }[]
}

export interface CollectTool {
  id: string
  title: string
  description: string
  avantages: string[]
  limites: string[]
  conseils: string[]
  icon: string
}

export interface DocumentSource {
  id: string
  name: string
  type: string
  url?: string
  description: string
}

// ─── Cycle de la recherche ────────────────────────────────────────
export const researchCycle: MethodoStep[] = [
  {
    id: 'question',
    title: 'Formulation de la question de recherche',
    description: 'Question claire et précise, justification de l\'importance, identification des lacunes dans les connaissances existantes.',
    details: [
      'Identifier un sujet pertinent et original',
      'Délimiter le cadre spatial et temporel',
      'Montrer l\'intérêt scientifique et pratique',
      'Obtenir l\'aval du directeur de recherche',
    ],
  },
  {
    id: 'hypotheses',
    title: 'Formulation d\'hypothèses testables',
    description: 'Propositions testables déduites à partir de théories ou d\'observations préalables.',
    details: [
      'L\'hypothèse doit partir d\'une observation empirique',
      'Elle doit être vérifiable dans la réalité',
      'Elle doit être cohérente avec les connaissances existantes',
    ],
  },
  {
    id: 'bibliography',
    title: 'Recherche approfondie des travaux existants',
    description: 'Synthèse des connaissances actuelles et identification des théories et concepts.',
    details: [
      'Consultation des bases de données (ScienceDirect, JSTOR, HAL, Persée…)',
      'Recherche dans les catalogues (SUDOC, WorldCat, BNF, SNDL)',
      'Utilisation de Google Scholar et Theses.fr',
      'Constitution du corpus d\'étude',
    ],
  },
  {
    id: 'methodology',
    title: 'Choix de la méthodologie',
    description: 'Définition de l\'échantillon, choix des outils d\'analyse, sélection des méthodes de collecte.',
    details: [
      'Définir la population étudiée et l\'échantillon',
      'Choisir entre approche quantitative, qualitative ou mixte',
      'Sélectionner les outils de collecte (questionnaire, entretien, observation…)',
      'Assurer la fiabilité et la validité des données',
    ],
  },
  {
    id: 'collect',
    title: 'Collecte des données',
    description: 'Mise en œuvre des méthodes de collecte sur le terrain.',
    details: [
      'Préparer les instruments de collecte',
      'Réaliser les entretiens ou administrer les questionnaires',
      'Effectuer les observations de terrain',
      'Organiser et stocker les données collectées',
    ],
  },
  {
    id: 'analyse',
    title: 'Analyse des données',
    description: 'Traitement et organisation des données, utilisation d\'outils statistiques ou autres techniques d\'analyse.',
    details: [
      'Coder et nettoyer les données',
      'Appliquer les outils d\'analyse appropriés',
      'Interpréter les résultats',
      'Comparer les résultats avec les hypothèses',
    ],
  },
  {
    id: 'discussion',
    title: 'Discussion et interprétation',
    description: 'Discussion des implications des résultats, identification des limites de l\'étude.',
    details: [
      'Mettre en relation les résultats avec la littérature',
      'Discuter des implications théoriques et pratiques',
      'Identifier les limites de l\'étude',
      'Proposer des recommandations',
    ],
  },
  {
    id: 'publication',
    title: 'Publication des résultats',
    description: 'Rédaction, présentation lors de conférences, synthèse des principaux résultats.',
    details: [
      'Rédiger selon les normes scientifiques (IMRaD)',
      'Présenter lors de conférences ou séminaires',
      'Formuler des conclusions claires et concises',
      'Suggérer des pistes pour de futures recherches',
    ],
  },
]

// ─── Types de recherche ──────────────────────────────────────────
export const researchTypes: ResearchType[] = [
  {
    id: 'quantitative',
    title: 'Recherche quantitative',
    description: 'Mesure et quantification des phénomènes à l\'aide d\'outils statistiques. Vise l\'objectivité et la reproductibilité.',
    characteristics: [
      'Données chiffrées et mesurables',
      'Échantillons représentatifs de grande taille',
      'Questionnaires à questions fermées',
      'Analyses statistiques (descriptive, inférentielle)',
      'Hypothèses testées par des méthodes formelles',
      'Objectivité et reproductibilité',
    ],
    icon: 'BarChart3',
    color: 'sky',
  },
  {
    id: 'qualitative',
    title: 'Recherche qualitative',
    description: 'Compréhension en profondeur des phénomènes à travers les expériences vécues et les significations.',
    characteristics: [
      'Données textuelles, narratives ou visuelles',
      'Échantillons restreints et ciblés',
      'Entretiens semi-directifs, observations participantes',
      'Analyses thématiques et de contenu',
      'Émergence de catégories et de théories',
      'Subjectivité assumée comme richesse',
    ],
    icon: 'MessageSquare',
    color: 'amber',
  },
  {
    id: 'mixte',
    title: 'Recherche mixte (mixte)',
    description: 'Combinaison des approches quantitative et qualitative pour une compréhension complète du phénomène.',
    characteristics: [
      'Triangulation des données (quantitatives + qualitatives)',
      'Design séquentiel ou concurrent',
      'Complémentarité des résultats',
      'Validation croisée des findings',
      'Richesse et profondeur de l\'analyse',
      'Adaptée aux problématiques complexes',
    ],
    icon: 'FlaskConical',
    color: 'emerald',
  },
]

// ─── Démarches inductive / déductive ──────────────────────────────
export const reasoningApproaches = {
  inductive: {
    title: 'Démarche inductive',
    subtitle: 'Du particulier au général',
    description: 'À partir d\'observations empiriques répétées, le chercheur formule une règle générale ou une théorie.',
    example: 'Adam est mortel + Socrate est mortel + … = Tous les hommes sont mortels.',
    steps: ['Observation de cas particuliers', 'Identification de régularités', 'Formulation d\'une généralisation', 'Élaboration d\'une théorie'],
  },
  deductive: {
    title: 'Démarche déductive',
    subtitle: 'Du général au particulier',
    description: 'À partir d\'une théorie ou d\'un énoncé général, le chercheur déduit des conséquences applicables à des cas spécifiques.',
    example: 'SI condition (théorie) ALORS conclusion (prédiction testable)',
    steps: ['Partir d\'une théorie établie', 'Formuler une hypothèse dérivable', 'Observer ou expérimenter', 'Confirmer ou infirmer la prédiction'],
  },
}

// ─── Types de disciplinarité ──────────────────────────────────────
export const disciplinarities = [
  { term: 'Pluridisciplinarité', definition: 'Juxtaposition de disciplines sans intégration.', color: 'slate' },
  { term: 'Multidisciplinarité', definition: 'Utilisation de plusieurs disciplines en parallèle.', color: 'slate' },
  { term: 'Interdisciplinarité', definition: 'Mettre en relation des disciplines pour créer des représentations originales.', color: 'sky' },
  { term: 'Transdisciplinarité', definition: 'Application d\'une méthode commune à travers les disciplines.', color: 'emerald' },
]

// ─── Problématique ────────────────────────────────────────────────
export const problematiqueGuide: ProblématiqueItem[] = [
  {
    id: 'quoi',
    question: 'QUOI ?',
    description: 'Définition de l\'objet — De quoi s\'agit-il exactement ? Quels sont les concepts clés ?',
    example: 'Identifier et définir les variables X et Y du sujet de recherche.',
  },
  {
    id: 'comment',
    question: 'COMMENT ?',
    description: 'Explication du processus — Par quels mécanismes X influence-t-il Y ?',
    example: 'Décrire les liens causaux et les relations entre les variables étudiées.',
  },
  {
    id: 'pourquoi',
    question: 'POURQUOI ?',
    description: 'Exposé de la finalité — Quel est l\'intérêt scientifique et pratique de cette recherche ?',
    example: 'Justifier la pertinence et l\'originalité de la démarche dans le contexte actuel.',
  },
]

export const problematiqueConseils = [
  'La problématique doit être centrale par rapport au sujet — pas un point secondaire.',
  'Elle doit tenir compte du facteur TEMPS, ESPACE et de la nature des INTERVENANTS.',
  'Elle doit annoncer une idée directrice pour la suite du travail.',
  'Elle doit esquisser une démarche démonstrative suivie tout au long de la rédaction.',
  'Elle doit recevoir l\'aval du directeur de recherche.',
  'Le titre de recherche prend généralement la forme d\'une AFFIRMATION (X influence Y chez Z), et non d\'une question.',
]

// ─── Opérationnalisation ──────────────────────────────────────────
export const operationalisationConcept: {
  title: string
  description: string
  steps: string[]
} = {
  title: 'L\'opérationnalisation',
  description: 'Processus de transformation de concepts abstraits en observations mesurables. Définir comment un concept peut être mesuré, observé ou manipulé.',
  steps: [
    'Identifier les CONCEPTS clés de la recherche (ex : "utilisation des médias sociaux", "dépression")',
    'Définir les VARIABLES : variable indépendante (X = cause) et variable dépendante (Y = effet)',
    'Sélectionner les DIMENSIONS de chaque concept (ex : fréquence, type, durée…)',
    'Choisir des INDICATEURS mesurables pour chaque dimension (ex : nombre de connexions/jour)',
    'Construire les instruments de mesure adaptés',
  ],
}

export const operationalisationExample: OperalisationExample = {
  concept: 'Ressources d\'une ville',
  dimensions: [
    { label: 'Ressources financières', indicateurs: ['Budget communal', 'Dotations de l\'État', 'Recettes fiscales', 'Investissements privés'] },
    { label: 'Ressources patrimoniales', indicateurs: ['Patrimoine immobilier', 'Patrimoine mobilier', 'Espaces publics', 'Infrastructures'] },
    { label: 'Ressources sociales', indicateurs: ['Niveau d\'emploi', 'Taux d\'activité', 'Diplômés supérieurs', 'Associations'] },
    { label: 'Ressources d\'équipement', indicateurs: ['Services publics', 'Équipements sportifs', 'Établissements scolaires', 'Infrastructures de transport'] },
  ],
}

// ─── Hypothèses ───────────────────────────────────────────────────
export const hypothesesConditions = [
  'L\'hypothèse doit se faire à partir d\'une observation empirique ou d\'une étude préalable.',
  'L\'hypothèse doit pouvoir être vérifiable dans la réalité.',
  'L\'hypothèse doit être cohérente avec les connaissances existantes.',
]

export const hypothesesVerification = [
  'Par l\'expérience : vérification empirique directe sur le terrain.',
  'Par l\'enquête : collecte de données auprès de la population étudiée.',
  'Par la contre-épreuve : apporter un exemple ou fait qui contredise l\'hypothèse (un seul contre-exemple suffit à invalider).',
  'Par la variation de la preuve : vérifier l\'hypothèse sur des parties différentes d\'un même ensemble.',
]

// ─── Outils de collecte ───────────────────────────────────────────
export const collectTools: CollectTool[] = [
  {
    id: 'entretien',
    title: 'L\'entretien de recherche (semi-directif)',
    description: 'Technique d\'investigation scientifique utilisée auprès d\'individus, permettant de les interroger de façon semi-directive pour connaître en profondeur les informations.',
    avantages: [
      'Permet d\'explorer en profondeur les représentations et les expériences',
      'Flexibilité : adaptation aux réponses de l\'interviewé',
      'Fait émerger des éléments imprévus et de nouvelles hypothèses',
      'Recueil de données riches et nuancées',
    ],
    limites: [
      'Temps de réalisation long',
      'Difficulté d\'analyse et de codage',
      'Subjectivité de l\'enquêteur',
      'Échantillons restreints (≤ 100)',
    ],
    conseils: [
      'Préparer les questions, thèmes et hypothèses en amont',
      'Poser des questions courtes, directes et ciblées',
      'Se focaliser sur la compréhension d\'un phénomène précis, sans divaguer',
      'Poser de nouvelles questions pour faire émerger de nouvelles hypothèses',
      'Entretiens à réponses libres : questions générales sur le sujet au sens large',
      'Entretiens centrés/ciblés : interrogations sur un aspect spécifique',
    ],
    icon: 'MessageSquare',
  },
  {
    id: 'questionnaire',
    title: 'Le questionnaire',
    description: 'Outil de collecte structuré touchant plusieurs sujets, administré à une population restreinte (≤ 100 personnes). Peut comporter des questions fermées ou ouvertes.',
    avantages: [
      'Processus rapide de passation',
      'Facilité de traitement et d\'analyse statistique',
      'Standardisation des réponses',
      'Possibilité de questions fermées et ouvertes',
    ],
    limites: [
      'Profondeur limitée des réponses',
      'Risque de réponses peu réfléchies',
      'Difficulté à capter les nuances',
      'Taux de non-réponse possible',
    ],
    conseils: [
      'Prévoir des questions fermées (gamme de réponses préétablies) ET ouvertes',
      'Tester le questionnaire au préalable (pré-enquête)',
      'Limiter le nombre de questions pour éviter la fatigue',
      'Assurer l\'anonymat pour encourager la sincérité',
    ],
    icon: 'ClipboardList',
  },
  {
    id: 'sondage',
    title: 'Le sondage',
    description: 'Enquête d\'opinion menée sur une large population (des milliers). Processus plus prenant de temps que le questionnaire.',
    avantages: [
      'Représentativité statistique',
      'Généralisation des résultats',
      'Mesure quantitative fiable',
      'Comparaison possible entre groupes',
    ],
    limites: [
      'Mise en œuvre lourde et coûteuse',
      'Réduit la complexité à des chiffres',
      'Ne capte pas les explications profondes',
      'Processus prenant du temps',
    ],
    conseils: [
      'Définir un échantillon représentatif',
      'Utiliser des méthodes d\'échantillonnage rigoureuses',
      'Privilégier les questions fermées à réponse unique',
      'Assurer la fiabilité statistique des résultats',
    ],
    icon: 'BarChart3',
  },
  {
    id: 'observation',
    title: 'L\'observation de terrain',
    description: 'Observation systématique et structurée d\'un phénomène dans son contexte naturel. Utilise une grille d\'observation avec thèmes, sous-thèmes et notes.',
    avantages: [
      'Accès direct au contexte réel',
      'Capture de comportements spontanés',
      'Complémentarité avec les autres outils',
      'Richesse des données contextuelles',
    ],
    limites: [
      'Subjectivité de l\'observateur',
      'Effet d\'observation (modification du comportement)',
      'Difficulté de reproduction',
      'Temps d\'immersion important',
    ],
    conseils: [
      'Préparer une grille d\'observation structurée (thèmes, sous-thèmes, notes)',
      'Observer l\'ambiance, les éléments temporels, l\'architecture, le mobilier',
      'Notez les horaires, la météo, les conditions d\'observation',
      'Répéter les observations à différents moments pour valider',
    ],
    icon: 'Eye',
  },
]

// ─── Recherche documentaire ───────────────────────────────────────
export const documentTypes = [
  { type: 'Dictionnaires & Encyclopédies', usage: 'Comprendre le sujet et le préciser, surtout pour les concepts nouveaux' },
  { type: 'Livres / Monographies', usage: 'Approfondir la recherche sur un thème donné' },
  { type: 'Manuels', usage: 'Faire le point sur une question' },
  { type: 'Mémentos', usage: 'Se faire une idée rapide sur un sujet' },
  { type: 'Précis', usage: 'Approfondir un aspect spécifique de la question' },
  { type: 'Actes de colloques', usage: 'Comptes-rendus de congrès et de journées scientifiques' },
  { type: 'Périodiques', usage: 'Articles de revues scientifiques récents' },
  { type: 'Thèses & Mémoires', usage: 'Littérature grise, travaux de recherche universitaires' },
  { type: 'Documents spécifiques', usage: 'Cartes, brevets, images, données statistiques' },
  { type: 'Documentation officielle', usage: 'Lois, règlements, plans, rapports institutionnels' },
]

export const databases: DocumentSource[] = [
  { id: 'sd', name: 'ScienceDirect', type: 'Base pluridisciplinaire', url: 'https://www.sciencedirect.com', description: 'Accès à des milliers de revues scientifiques et d\'articles en texte intégral.' },
  { id: 'jstor', name: 'JSTOR', type: 'Base pluridisciplinaire', url: 'https://www.jstor.org', description: 'Archives de revues académiques, livres et sources primaires.' },
  { id: 'hal', name: 'HAL', type: 'Archive ouverte française', url: 'https://hal.science', description: 'Archive ouverte pluridisciplinaire française — accès gratuit aux publications.' },
  { id: 'persee', name: 'Persée', type: 'Base francophone', url: 'https://www.persee.fr', description: 'Portail de revues scientifiques en sciences humaines et sociales.' },
  { id: 'doaj', name: 'DOAJ', type: 'Base pluridisciplinaire', url: 'https://doaj.org', description: 'Directory of Open Access Journals — revues en accès libre.' },
  { id: 'wok', name: 'Web of Knowledge', type: 'Base pluridisciplinaire', url: 'https://www.webofknowledge.com', description: 'Indexation et citation des publications scientifiques mondiales.' },
  { id: 'cairn', name: 'Cairn', type: 'Bouquet de revues', url: 'https://www.cairn.info', description: 'Revues et ouvrages en sciences humaines et sociales en français.' },
]

export const catalogs: DocumentSource[] = [
  { id: 'sudoc', name: 'SUDOC', type: 'Catalogue collectif', url: 'http://www.sudoc.abes.fr', description: 'Catalogue collectif des universités françaises.' },
  { id: 'worldcat', name: 'WorldCat', type: 'Catalogue mondial', url: 'http://www.worldcat.org', description: 'Catalogue mondial des bibliothèques — trouver des ouvrages partout.' },
  { id: 'bnf', name: 'BnF', type: 'Catalogue national', url: 'http://catalogue.bnf.fr', description: 'Catalogue de la Bibliothèque nationale de France.' },
  { id: 'sndl', name: 'SNDL', type: 'Documentation algérienne', url: 'https://www.sndl.cerist.dz', description: 'Système National de Documentation en Ligne — Algérie.' },
]

export const webResources: DocumentSource[] = [
  { id: 'scholar', name: 'Google Scholar', type: 'Moteur de recherche', url: 'http://scholar.google.fr', description: 'Moteur de recherche spécialisé en littérature académique.' },
  { id: 'books', name: 'Google Books', type: 'Moteur de recherche', url: 'http://books.google.fr', description: 'Recherche dans le contenu des livres numérisés.' },
  { id: 'theses', name: 'Theses.fr', type: 'Portail', url: 'http://www.theses.fr', description: 'Annuaire des thèses soutenues en France.' },
  { id: 'worldwidescience', name: 'WorldWideScience', type: 'Portail scientifique', url: 'http://worldwidescience.org', description: 'Portail mondial de la science ouverte.' },
  { id: 'cirs', name: 'CIRS', type: 'Centre de recherche', url: 'http://www.cirs.fr', description: 'Centre international de recherche scientifique.' },
]

// ─── Structure de l'introduction ──────────────────────────────────
export const introductionStructure = [
  { step: 'Amener le sujet (Y)', detail: 'Présenter le contexte général, amener progressivement le lecteur vers le sujet.' },
  { step: 'Poser le sujet (X → Y : Z)', detail: 'Formuler la relation entre les variables : X (cause) influence Y (effet) chez Z (population/territoire).' },
  { step: 'Diviser le sujet', detail: 'Délimiter le cadre de l\'étude et l\'optique dans laquelle sera traitée la question.' },
  { step: 'Problématique', detail: 'Reformulation interrogative de l\'intitulé initial (QUOI ? COMMENT ? POURQUOI ?).' },
  { step: 'État de la question', detail: 'Synthétiser "ce que l\'on sait" sur le sujet ou la question choisie.' },
  { step: 'Corpus d\'étude', detail: 'Présenter le support de l\'étude et justifier son choix.' },
  { step: 'Objectifs & Hypothèses', detail: 'Annoncer les grandes lignes du travail et les axes d\'analyse retenus.' },
]

// ─── Le titre ─────────────────────────────────────────────────────
export const titreConseils = [
  'Un bon titre doit contenir la ou les variable(s) à l\'étude (X et Y) ou CONCEPTS.',
  'Il doit indiquer la nature de la relation qui unit ces variables (effet, incidence, influence de X sur Y).',
  'Il doit mentionner le territoire et/ou la population Z à l\'étude (X influence Y chez Z).',
  'Le titre doit être à la fois BREF et PRÉCIS.',
  'Il prend généralement la forme d\'une AFFIRMATION, et non d\'une QUESTION.',
  'La variable Y = thème/sujet étudié ; la variable X = cause possible = problème de recherche.',
]