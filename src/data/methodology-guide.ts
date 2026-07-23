/**
 * Guide de méthodologie de recherche
 * Guide général de méthodologie scientifique
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
      'Observer l\'ambiance, les éléments temporels, l\'espace, le mobilier',
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

// ─── Types de variables en recherche ─────────────────────────────────────
export interface VariableType {
  name: string
  definition: string
  example: string
  category: 'cause-effet' | 'contrôle' | 'relation' | 'mesure' | 'modèle'
  color: string
}

export const researchVariables: VariableType[] = [
  {
    name: 'Variable Indépendante (VI)',
    definition: 'La variable manipulée ou modifiée par le chercheur pour observer son effet sur la variable dépendante.',
    example: 'Méthode d\'enseignement (Conventionnelle, En ligne, Hybride)',
    category: 'cause-effet',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    name: 'Variable Dépendante (VD)',
    definition: 'La variable mesurée ou observée pour déterminer l\'effet de la variable indépendante.',
    example: 'Performance des étudiants (Score à l\'examen)',
    category: 'cause-effet',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    name: 'Variable de Contrôle',
    definition: 'Variables maintenues constantes pour empêcher qu\'elles n\'affectent les résultats.',
    example: 'Durée du cours, Même enseignant, Température de la salle',
    category: 'contrôle',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  {
    name: 'Variable Parasite',
    definition: 'Variables autres que la VI qui peuvent influencer la VD. Il faut les identifier et les contrôler.',
    example: 'Motivation de l\'étudiant, Environnement familial',
    category: 'contrôle',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  {
    name: 'Variable Confondante',
    definition: 'Variable parasite corrélée à la fois avec la VI et la VD, créant une fausse relation de causalité.',
    example: "L'intelligence affectant à la fois le temps d'étude et la performance à l'examen",
    category: 'contrôle',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    name: 'Variable Modératrice',
    definition: "Variable qui affecte la force ou la direction de la relation entre la VI et la VD.",
    example: "Le genre modérant l'effet de la méthode d'enseignement sur la performance",
    category: 'relation',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    name: 'Variable Médiatrice',
    definition: "Variable qui explique le mécanisme par lequel la VI affecte la VD. C'est le « pourquoi » de la relation.",
    example: "La motivation médiatisant l'effet de la méthode d'enseignement sur la performance",
    category: 'relation',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    name: 'Variable Intermédiaire',
    definition: "Variable qui se situe entre la VI et la VD mais n'est pas sur le chemin causal direct.",
    example: "Le stress entre la pression au travail (VI) et la satisfaction au travail (VD)",
    category: 'relation',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    name: 'Variable Dichotomique',
    definition: 'Variable avec seulement deux catégories ou résultats possibles.',
    example: 'Genre (Homme/Femme), Réussite (Oui/Non)',
    category: 'mesure',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    name: 'Variable Polythomique',
    definition: 'Variable avec plus de deux catégories sans ordre inhérent.',
    example: 'Groupe sanguin (A, B, AB, O), Statut marital (Célibataire, Marié, Divorcé)',
    category: 'mesure',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    name: 'Variable Continue',
    definition: 'Variable quantitative pouvant prendre toute valeur dans un intervalle (y compris les décimales).',
    example: 'Taille, Poids, Temps, Température',
    category: 'mesure',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    name: 'Variable Discrète',
    definition: 'Variable quantitative prenant des valeurs dénombrables, séparées (généralement des entiers).',
    example: "Nombre d'étudiants, Nombre d'erreurs, Nombre de visites",
    category: 'mesure',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    name: 'Variable Observée',
    definition: 'Variable pouvant être mesurée ou observée directement.',
    example: 'Âge, Salaire, Score au test',
    category: 'mesure',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    name: 'Variable Latente',
    definition: 'Variable non observable directement, déduite à partir d\'autres variables indicatrices.',
    example: 'Intelligence, Attitude, Satisfaction, Image de marque',
    category: 'mesure',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    name: 'Variable Exogène',
    definition: 'Variable qui n\'est influencée par aucune autre variable dans le modèle. Elle agit comme cause.',
    example: "Méthode d'enseignement dans un modèle prédisant la performance",
    category: 'modèle',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  {
    name: 'Variable Endogène',
    definition: "Variable qui est expliquée ou influencée par une ou plusieurs autres variables du modèle.",
    example: "Performance de l'étudiant influencée par la motivation, le temps d'étude, la méthode",
    category: 'modèle',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
]

export const variableCategories = [
  { id: 'cause-effet', label: 'Cause & Effet', color: 'text-blue-700' },
  { id: 'contrôle', label: 'Contrôle & Biais', color: 'text-gray-700' },
  { id: 'relation', label: 'Relations', color: 'text-purple-700' },
  { id: 'mesure', label: 'Types de mesure', color: 'text-green-700' },
  { id: 'modèle', label: 'Modèle causal', color: 'text-orange-700' },
]

// ─── Analyse bibliométrique ─────────────────────────────────────────────
export interface BiblioMethod {
  name: string
  description: string
}

export interface BiblioMetric {
  name: string
  description: string
}

export interface BiblioTool {
  name: string
  description: string
  color: string
}

export const biblioFeatures = [
  'Approche quantitative et statistique',
  'Utilise les données de publications et de citations',
  'Identifie les motifs et les relations',
  'Soutient la prise de décision et la stratégie',
  'Visualise la structure des connaissances',
]

export const biblioPurposes = [
  'Comprendre la croissance et le développement d\'un champ de recherche',
  'Identifier les auteurs, articles, revues et institutions influents',
  'Découvrir les lacunes de recherche et les tendances émergentes',
  'Évaluer la performance et l\'impact de la recherche',
  'Soutenir les revues de littérature et la planification de recherche',
]

export const biblioMethods: BiblioMethod[] = [
  { name: 'Analyse de performance', description: 'Auteurs, revues, pays, institutions' },
  { name: 'Cartographie scientifique (Science Mapping)', description: 'Co-citation, couplage bibliographique, co-auteur' },
  { name: 'Analyse de citations', description: 'Nombre de citations, h-index, facteur d\'impact' },
  { name: 'Analyse de co-mots', description: 'Co-occurrence de mots-clés, cartographie thématique' },
]

export const biblioMetrics: BiblioMetric[] = [
  { name: 'Publications totales', description: 'Nombre total de publications dans un champ ou par un auteur/institution.' },
  { name: 'Citations totales', description: 'Nombre total de fois que les publications ont été citées.' },
  { name: 'h-index', description: 'Métrique qui mesure à la fois la productivité et l\'impact des citations.' },
  { name: 'Citations par article', description: 'Nombre moyen de citations reçues par publication.' },
  { name: 'Facteur d\'impact (Impact Factor)', description: 'Mesure les citations moyennes des articles d\'une revue.' },
  { name: 'Co-auteur', description: 'Indique les motifs de collaboration entre auteurs/pays.' },
  { name: 'Co-citation', description: 'Mesure la fréquence à laquelle deux documents sont cités ensemble.' },
]

export const biblioTools: BiblioTool[] = [
  { name: 'VOSviewer', description: 'Création et visualisation de réseaux bibliométriques', color: 'bg-blue-100 text-blue-800' },
  { name: 'Bibliometrix (R)', description: 'Analyse bibliométrique complète en R', color: 'bg-cyan-100 text-cyan-800' },
  { name: 'CiteSpace', description: 'Détection des tendances émergentes et des sujets en éruption', color: 'bg-amber-100 text-amber-800' },
  { name: 'Scopus / Web of Science', description: 'Extraction de données bibliographiques de haute qualité', color: 'bg-emerald-100 text-emerald-800' },
]

export const biblioProcess = [
  { step: 1, title: 'Collecte des données', detail: 'Récupérer les données depuis les bases (Scopus, Web of Science, Dimensions, etc.)' },
  { step: 2, title: 'Traitement des données', detail: 'Nettoyer et exporter les données dans des formats adaptés (CSV, RIS, BibTeX)' },
  { step: 3, title: 'Analyse', detail: 'Appliquer les méthodes et métriques bibliométriques pour analyser les données.' },
  { step: 4, title: 'Visualisation', detail: 'Créer des cartes, graphiques et réseaux pour visualiser les motifs et tendances.' },
  { step: 5, title: 'Interprétation', detail: 'Interpréter les résultats, tirer des enseignements et identifier les implications.' },
]
// ─── Ressources PDF (pages 1-6) ──────────────────────────────────

export interface LitReviewStage {
  id: string
  stage: string
  question: string
  func: string
  proceduralDifferences: string[]
  sourcesOfInvalidity: string[]
}

export const literatureReviewStages: LitReviewStage[] = [
  {
    id: 'formation',
    stage: 'Formation du problème',
    question: 'Quelles preuves doivent être incluses dans la revue ?',
    func: 'Construire des définitions qui distinguent les études pertinentes des non pertinentes.',
    proceduralDifferences: [
      'Différences dans les définitions opérationnelles incluses.',
      'Différences dans le détail opérationnel.',
    ],
    sourcesOfInvalidity: [
      'Des concepts étroits peuvent rendre les conclusions moins définitives et robustes.',
      'Un détail opérationnel superficiel peut masquer les variables d\'interaction.',
    ],
  },
  {
    id: 'collection',
    stage: 'Collecte des données',
    question: 'Quelles procédures doivent être utilisées pour trouver les preuves pertinentes ?',
    func: 'Déterminer quelles sources de preuves potentiellement pertinentes examiner.',
    proceduralDifferences: [
      'Différences dans la recherche contenue dans les sources d\'information.',
    ],
    sourcesOfInvalidity: [
      'Les études accessibles peuvent être qualitativement différentes de la population cible.',
      'Les personnes échantillonnées dans les études accessibles peuvent différer de la population cible.',
    ],
  },
  {
    id: 'evaluation',
    stage: 'Évaluation des données',
    question: 'Quelles preuves récupérées doivent être incluses dans la revue ?',
    func: 'Appliquer des critères pour séparer les études « valides » des « invalides ».',
    proceduralDifferences: [
      'Différences dans les critères de qualité.',
      'Différences dans l\'influence des critères non-qualitatifs.',
    ],
    sourcesOfInvalidity: [
      'Des facteurs non-qualitatifs peuvent causer une pondération inappropriée.',
      'Des omissions dans les rapports d\'étude peuvent rendre les conclusions non fiables.',
    ],
  },
  {
    id: 'analysis',
    stage: 'Analyse et interprétation',
    question: 'Quelles procédures pour faire des inférences sur la littérature dans son ensemble ?',
    func: 'Synthétiser les études valides récupérées.',
    proceduralDifferences: [
      'Différences dans les règles d\'inférence.',
    ],
    sourcesOfInvalidity: [
      'Les règles pour distinguer les motifs du bruit peuvent être inappropriées.',
      'Les preuves basées sur la revue peuvent être utilisées pour inférer la causalité.',
    ],
  },
  {
    id: 'presentation',
    stage: 'Présentation publique',
    question: 'Quelles informations doivent être incluses dans le rapport de revue ?',
    func: 'Appliquer des critères éditoriaux pour séparer les informations importantes des non importantes.',
    proceduralDifferences: [
      'Différences dans les lignes directrices pour le jugement éditorial.',
    ],
    sourcesOfInvalidity: [
      'L\'omission des procédures de revue peut rendre les conclusions non reproductibles.',
      'L\'omission des résultats de revue et des procédures d\'étude peut rendre les conclusions obsolètes.',
    ],
  },
]

export const literatureReviewSource = 'Randolph, J. (2009). A Guide to Writing the Dissertation Literature Review. Practical Assessment, Research & Evaluation, 14(13), 1-13.'

export interface ResearchGap {
  id: string
  name: string
  nameEn: string
  description: string
  strategies: string[]
  color: string
}

export const researchGaps: ResearchGap[] = [
  { id: 'methodological', name: 'Lacune méthodologique', nameEn: 'Methodological Gap', description: 'Inadéquation ou absence de méthodes de recherche adaptées.', strategies: ['Développer de nouvelles méthodologies', 'Adapter des méthodes d\'autres champs disciplinaires', 'Combiner des méthodes existantes de manière innovante'], color: 'border-red-200 bg-red-50/50' },
  { id: 'data', name: 'Lacune de données', nameEn: 'Data Gap', description: 'Données insuffisantes pour répondre à la question de recherche.', strategies: ['Mener une collecte de données primaires', 'Accéder à des bases de données existantes', 'Collaborer avec d\'autres chercheurs ou institutions'], color: 'border-amber-200 bg-amber-50/50' },
  { id: 'empirical', name: 'Lacune empirique', nameEn: 'Empirical Gap', description: 'Absence de données ou d\'études sur un sujet particulier.', strategies: ['Mener des études exploratoires', 'Effectuer des revues de littérature systématiques', 'Identifier les aspects sous-étudiés du sujet'], color: 'border-orange-200 bg-orange-50/50' },
  { id: 'contextual', name: 'Lacune contextuelle', nameEn: 'Contextual Gap', description: 'Impossibilité de généraliser les résultats en raison de différences de contextes.', strategies: ['Mener des études comparatives', 'Explorer les implications interculturelles', 'Identifier les facteurs contextuels influençant les résultats'], color: 'border-sky-200 bg-sky-50/50' },
  { id: 'implementation', name: 'Lacune de mise en œuvre', nameEn: 'Implementation Gap', description: 'Déconnexion entre les résultats de recherche et l\'application pratique.', strategies: ['S\'engager avec les praticiens', 'Développer des projets de recherche-action', 'Créer des lignes directrices ou cadres pratiques'], color: 'border-emerald-200 bg-emerald-50/50' },
  { id: 'population', name: 'Lacune populationnelle', nameEn: 'Population Gap', description: 'Sous-représentation ou exclusion de certains groupes dans la recherche.', strategies: ['Diversifier les échantillons d\'étude', 'Mener des recherches ciblées sur les groupes sous-représentés', 'Analyser les données existantes en ciblant les populations exclues'], color: 'border-violet-200 bg-violet-50/50' },
  { id: 'practical', name: 'Lacune de connaissance pratique', nameEn: 'Practical Knowledge Gap', description: 'Incapacité à appliquer les connaissances théoriques aux problèmes réels.', strategies: ['Mener des études de cas', 'Développer des projets de recherche appliquée', 'Collaborer avec des partenaires industriels'], color: 'border-pink-200 bg-pink-50/50' },
  { id: 'evidence', name: 'Lacune de preuves', nameEn: 'Evidence Gap', description: 'Preuves insuffisantes ou contradictoires pour étayer une conclusion.', strategies: ['Mener des méta-analyses', 'Effectuer des études de réplication', 'Concevoir des études avec une puissance statistique accrue'], color: 'border-gray-200 bg-gray-50/50' },
  { id: 'knowledge', name: 'Lacune de connaissances', nameEn: 'Knowledge Gap', description: 'Manque de compréhension ou d\'information sur un sujet spécifique.', strategies: ['Mener des revues de littérature approfondies', 'Identifier les questions de recherche clés', 'Développer des cadres conceptuels'], color: 'border-cyan-200 bg-cyan-50/50' },
  { id: 'theoretical', name: 'Lacune théorique', nameEn: 'Theoretical Gap', description: 'Cadres théoriques insuffisants pour expliquer un phénomène.', strategies: ['Développer de nouvelles théories', 'Intégrer des théories existantes', 'Appliquer des théories d\'autres disciplines'], color: 'border-indigo-200 bg-indigo-50/50' },
]

export const researchGapsSource = 'Miles, D. A. (2017). A taxonomy of research gaps. Doctoral student workshop, Dallas, Texas. Mindmap par Lennart Nacke.'

export const problemStatementQuestions = [
  { question: 'Quoi ?', detail: 'Quel est le problème ?' },
  { question: 'Où ?', detail: 'Où se situe le problème ?' },
  { question: 'Comment ?', detail: 'Comment le problème peut-il être résolu ?' },
  { question: 'Pourquoi ?', detail: 'Pourquoi voulez-vous résoudre le problème ?' },
  { question: 'Actualité ?', detail: 'Le problème est-il un enjeu actuel ?' },
  { question: 'Persistance ?', detail: 'Le problème persistera-t-il s\'il n\'est pas résolu ?' },
  { question: 'Qui ?', detail: 'Qui est affecté négativement par le problème ?' },
  { question: 'Contribution ?', detail: 'Ce problème prouvera-t-il ou infirmera-t-il les connaissances existantes ?' },
]

export const problemStatementSource = 'Faryadi, Q. (2018). PhD Thesis Writing Process: A Systematic Approach. Creative Education, 9, 2534-2545.'

export const introductionWritingTips = [
  'Énoncez le problème ou le phénomène à étudier.',
  'Identifiez la partie affectée par le problème.',
  'Expliquez comment vous comptez résoudre le problème.',
  'Convainquez le lecteur que vous êtes qualifié et équipé des bonnes méthodes.',
  'Mettez en évidence les bénéfices de la résolution du problème.',
  'Indiquez au lecteur les résultats que vous anticipez.',
]

export const introductionWritingAdvice = [
  'Commencez par des déclarations générales pertinentes avant de resserrer progressivement vers les questions de recherche.',
  'Votre introduction est préparée pour des lecteurs ayant des connaissances adéquates de votre discipline.',
  'Si c\'est votre propre découverte scientifique, expliquez clairement comment les résultats s\'ajouteront aux connaissances existantes.',
  'Discutez les obstacles rencontrés et les limites de votre recherche, le cas échéant.',
  'L\'introduction doit être motivante et captivante pour donner envie au lecteur de continuer.',
]

export interface AbstractStructureStep {
  id: string
  label: string
  labelEn: string
  description: string
  example: string
  color: string
}

export const abstractStructure: AbstractStructureStep[] = [
  { id: 'background', label: 'Contexte général', labelEn: 'General background', description: 'Présentez le domaine de recherche de manière large et accessible.', example: 'Le transfert horizontal de gènes (HGT), l\'acquisition de matériel génétique de lignées non parentales, est connu pour être important dans l\'évolution bactérienne.', color: 'bg-sky-100 text-sky-800' },
  { id: 'specific-bg', label: 'Contexte spécifique', labelEn: 'Specific background', description: 'Resserrez vers votre domaine précis en citant les travaux clés.', example: 'En particulier, le HGT fournit un accès rapide aux innovations génétiques, permettant à des traits tels que la virulence, la résistance aux antibiotiques et le métabolisme des xénobiotiques de se propager.', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'gap', label: 'Lacune de connaissances', labelEn: 'Knowledge gap', description: 'Identifiez ce qui manque dans la littérature existante.', example: 'Il est nécessaire de déterminer la fréquence de tels transferts récents et les forces qui régissent ces événements.', color: 'bg-amber-100 text-amber-800' },
  { id: 'here-we-show', label: 'Notre contribution', labelEn: 'Here we show...', description: 'Annoncez clairement ce que votre étude apporte.', example: 'Nous rapportons la découverte et la caractérisation d\'un vaste réseau humain d\'échange de gènes.', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'results', label: 'Résultats clés', labelEn: 'Results with key values', description: 'Présentez vos résultats avec des valeurs concrètes et statistiquement significatives.', example: 'Ce réseau de 10 770 gènes uniques récemment transférés dans 2 235 génomes bactériens complets est façonné principalement par l\'écologie plutôt que par la géographie ou la phylogénie.', color: 'bg-violet-100 text-violet-800' },
  { id: 'meaning', label: 'Signification des résultats', labelEn: 'Meaning of results', description: 'Expliquez l\'impact et les implications de vos résultats.', example: 'Cette structure offre une fenêtre sur les traits moléculaires qui définissent les niches écologiques, insight que nous utilisons pour uncover les sources de résistance aux antibiotiques.', color: 'bg-rose-100 text-rose-800' },
]

export const abstractSource = 'Abstract annoté d\'un article de microbiologie publié dans Nature. Reproduit à des fins éducatives uniquement.'

export interface ThesisWebsite {
  id: string
  name: string
  url: string
  description: string
  type: string
}

export const thesisWebsites: ThesisWebsite[] = [
  { id: 'oatd', name: 'Open Access Theses and Dissertations', url: 'https://oatd.org/', description: 'Le plus grand index mondial de thèses en accès libre.', type: 'Multidisciplinaire' },
  { id: 'openthesis', name: 'Open Thesis', url: 'http://www.openthesis.org/', description: 'Base collaborative de thèses et mémoires en libre accès.', type: 'Multidisciplinaire' },
  { id: 'dart-europe', name: 'DART-Europe E-theses Portal', url: 'https://www.dart-europe.org/', description: 'Portail européen de thèses électroniques.', type: 'Europe' },
  { id: 'proquest', name: 'ProQuest Dissertations & Theses', url: 'https://www.proquest.com/', description: 'Plus grande base de thèses au monde (accès partiel gratuit).', type: 'Multidisciplinaire' },
  { id: 'mit', name: 'MIT Theses', url: 'https://dspace.mit.edu/handle/1721.1/7582', description: 'Toutes les thèses du MIT en accès libre.', type: 'Sciences & Ingénierie' },
  { id: 'ndltd', name: 'NDLTD', url: 'http://www.ndltd.org/', description: 'Réseau international de bibliothèques numériques de thèses.', type: 'Multidisciplinaire' },
  { id: 'caltech', name: 'Caltech Thesis', url: 'https://thesis.library.caltech.edu/', description: 'Thèses du California Institute of Technology.', type: 'Sciences & Ingénierie' },
  { id: 'ethos', name: 'British Library EThOS', url: 'https://www.bl.uk/', description: 'Service de thèses de la British Library (Royaume-Uni).', type: 'Europe' },
  { id: 'harvard', name: 'Harvard DASH', url: 'https://dash.harvard.edu/', description: 'Dépôt d\'accès scholarique de Harvard.', type: 'Multidisciplinaire' },
  { id: 'canada', name: 'Theses Canada Portal', url: 'https://canadagtd.ca/', description: 'Portail des thèses canadiennes.', type: 'Amérique du Nord' },
  { id: 'repec', name: 'RePEc', url: 'https://repec.org/', description: 'Papiers de recherche en économie.', type: 'Économie' },
  { id: 'ssrn', name: 'SSRN eLibrary', url: 'https://www.ssrn.com/', description: 'Réseau de recherche en sciences sociales.', type: 'Sciences Sociales' },
  { id: 'europe-pmc', name: 'Europe PMC', url: 'https://europepmc.org/', description: 'Archive ouverte de biomedical et sciences de la vie.', type: 'Biomedical' },
  { id: 'worldcat', name: 'WorldCat Dissertations & Theses', url: 'https://www.worldcat.org/', description: 'Catalogue mondial des bibliothèques, incluant les thèses.', type: 'Multidisciplinaire' },
  { id: 'etd', name: 'Electronic Theses & Dissertation Centre', url: 'https://etd.ohiolink.edu/', description: 'Centre de thèses électroniques (OhioLink).', type: 'Amérique du Nord' },
]

// ─── Opérationnalisation (Baripedia) ──────────────────────────────

export interface LazarsfeldStep {
  id: string
  title: string
  description: string
  details: string[]
  examples?: string[]
  warning?: string
}

export const operationalisationBaripedia = {
  definition: 'L\'opérationnalisation consiste à rendre les concepts mesurables. Il s\'agit de passer d\'un haut niveau d\'abstraction conceptuelle à des indicateurs concrets adaptés à la recherche empirique. Cette étape constitue le point de relais entre la théorie et l\'empirie.',
  keyIdea: 'Dans les méthodes quantitatives, il faut toujours faire passer les concepts du statut de mots au statut de chiffres. Les concepts théoriques n\'existent pas dans la réalité sociale — ils doivent être concrétisés pour être mesurés.',
  quote: {
    text: 'Les sociologues utilisent souvent des concepts qui sont formulés à un niveau plutôt haut d\'abstraction. Le problème lié au fossé entre la théorie et la recherche est celui de l\'erreur de mesure.',
    author: 'Blalock',
  },
  stakes: [
    'L\'opérationnalisation doit permettre de tester les hypothèses en descendant dans l\'échelle de l\'abstraction.',
    'Les choix effectués tout au long de la recherche visent à conférer une validité interne.',
    'Aucun résultat n\'est accepté unanimement, à cause des choix potentiellement discutables.',
    'Les données secondaires doivent être utilisées avec précaution — l\'indicateur doit parfaitement convenir à l\'item étudié.',
  ],
  lazarsfeldSteps: [
    {
      id: 'conceptual',
      title: '1. Étape conceptuelle',
      description: 'Partir d\'un concept abstrait, non directement mesurable. Souvent polysémique, le concept doit être défini précisément et de manière univoque.',
      details: [
        'S\'aider de la littérature pour combler les lacunes théoriques',
        'Vérifier qu\'un travail similaire n\'a pas déjà été effectué',
        'La définition du concept de base est cruciale pour obtenir des mesures fiables',
      ],
      examples: [
        'Compétence politique (Dahl) : autonomie du citoyen autour de la connaissance du champ politique et de la verbalisation de préférences claires',
        'Compétence politique (Kriessi) : intérêt subjectif et objectif porté à la politique',
        'Compétence politique (Gaxie) : capacité à se situer dans l\'univers politique',
      ],
    },
    {
      id: 'dimensions',
      title: '2. Spécifier les dimensions et sous-dimensions',
      description: 'Un concept est toujours multidimensionnel. Il s\'agit d\'identifier chaque facette et d\'en extraire le sens. Chaque composante doit être définie de manière univoque.',
      details: [
        'Pour les concepts simples : décomposer en dimensions (âge, sexe, lieu de résidence…)',
        'Pour les concepts complexes : décomposer en dimensions ET sous-dimensions',
        'Cette étape permet de descendre sur l\'échelle de l\'abstraction',
      ],
    },
    {
      id: 'indicators',
      title: '3. Sélection des indicateurs pertinents',
      description: 'Chaque dimension peut être représentée par un ou plusieurs indicateurs. Un indicateur = une variable = une mesure = une question.',
      details: [
        'Un indicateur mesure directement une dimension ou sous-dimension d\'un concept abstrait',
        'Mesurer un concept avec PLUSIEURS indicateurs pour minimiser les risques d\'erreur',
        'L\'agencement des indicateurs doit ensemble reconstruire le concept',
        'Le nombre d\'indicateurs ne doit pas être trop petit pour couvrir tout effet discriminant',
      ],
      warning: 'Le chercheur doit sélectionner des indicateurs présentant une bonne discrimination, validité et cohérence interne.',
    },
    {
      id: 'indices',
      title: '4. Formation des indices (après collecte)',
      description: 'Reconstruire les dimensions des concepts après la récolte des données. Cette étape fait le chemin inverse des trois précédentes.',
      details: [
        'Se déroule APRÈS la récolte des données, au moment de l\'analyse',
        'Construire une mesure unique à partir de plusieurs informations numériques',
        'Permet de tester les relations causales entre concepts',
        'Techniques possibles : additionneur, échelles d\'indices, analyse factorielle',
      ],
      warning: 'Si les indicateurs mesurent exactement la même chose, on peut en prendre un seul. Cette étape n\'est pas toujours nécessaire.',
    },
  ] as LazarsfeldStep[],
  indicatorSelection: {
    title: 'Sélection des indicateurs',
    rules: [
      'Processus circulaire (et non linéaire) avec des allers-retours entre étapes',
      'Si le sens d\'une dimension reste ambigu → retourner à l\'étape 2',
      'Deux voies : utiliser son inventivité OU reprendre des mesures élaborées par d\'autres chercheurs',
      'Règle de base : plus d\'indicateurs c\'est mieux, mais pas trop',
      'Moins il y a d\'indicateurs, plus on a d\'effet discriminant',
    ],
    simpleVsComplex: {
      simple: { label: 'Concepts simples/périphériques', rule: 'Un indicateur suffit', example: 'L\'âge (si ce n\'est pas le concept clé)' },
      complex: { label: 'Concepts complexes/centraux', rule: 'Plusieurs indicateurs nécessaires', example: 'La compétence politique, l\'islamophobie' },
    },
    vdWarning: 'Attention à la variable dépendante ! On prend rarement le risque d\'avoir un seul indicateur pour la VD.',
    examples: [
      { concept: 'Islamophobie', indicators: ['Autoriser les pratiques religieuses en Suisse', 'Le port du voile'], problem: 'Concept très complexe saisi par seulement 2 indicateurs. La 2e question tend à graduer l\'influence du répondant masculin.' },
      { concept: 'Participation conventionnelle', indicators: ['Fréquence de participation aux votations', 'Fréquence de participation aux élections'], problem: 'Bon exemple de mesure valide.' },
      { concept: 'Bien-être individuel', indicators: ['Salaire de l\'individu'], problem: 'Mauvais exemple : le salaire ne mesure pas le bien-être.' },
    ],
  },
  measurementErrors: {
    title: 'Validité et fiabilité : deux erreurs de mesure',
    validity: {
      title: 'Validité',
      definition: 'Juge l\'opérationnalisation d\'un point de vue théorique. Une mesure non valide ne mesure pas le concept qu\'on voulait mesurer.',
      location: 'Au niveau de l\'opérationnalisation (processus qui lie les concepts aux indicateurs)',
      causes: [
        'Concepts mal définis',
        'Indicateurs non pertinents',
        'Concepts complexes mesurés par trop peu d\'indicateurs',
      ],
    },
    reliability: {
      title: 'Fiabilité',
      definition: 'Liée à la formulation et l\'élaboration des questions. Regarde le lien entre les indicateurs et la question.',
      location: 'Au niveau empirique (formulation des questions, reproductibilité)',
      causes: [
        'Double stimuli (inputs) — questions ambiguës',
        'Imprécision — jamais de question avec un « ou »',
        'Supposer les pratiques au lieu de les demander directement',
      ],
    },
    relationship: 'Pour avoir une mesure valide, elle doit être fiable. Mais le contraire n\'est pas forcément le cas. La fiabilité est une condition nécessaire mais non suffisante.',
    biases: 'Les biais systématiques ont une structure et ne sont pas distribués au hasard. Ils ne sont pas intégrés dans les analyses en termes d\'erreur et impliquent souvent un problème de validité.',
  },
  source: 'Baripedia — Des concepts aux mesures, un travail d\'opérationnalisation. Consulté le 20/11/2021.',
}

// ─── Guide du jeune chercheur (Mathieu Guidère) ─────────────────────

export const guidereGuide = {
  title: 'Méthodologie de la recherche — Guide du jeune chercheur',
  author: 'Mathieu Guidère',
  source: 'Guidère, M. Méthodologie de la recherche — Guide du jeune chercheur.',
  definition: 'La méthode désigne l\'ensemble des démarches que suit l\'esprit humain pour découvrir et démontrer la vérité.',
  keyQuote: 'La recherche ne peut être une simple compilation d\'informations, une synthèse de l\'existant. Elle se doit d\'être une investigation…',
  projectPhases: [
    { title: 'Phase préparatoire', details: ['Circonscrire l\'objet (domaine, sujet, époque)', 'Évaluer la faisabilité', 'Trouver un directeur de recherche'] },
    { title: 'Phase de réalisation', details: ['Élaboration d\'un plan détaillé', 'Collecte de données', 'Rédaction progressive'] },
    { title: 'Phase finale', details: ['Relecture et correction', 'Préparation de la soutenance', 'Soutenance devant le jury'] },
  ],
  planning: {
    master: { duration: '6-12 mois', steps: ['Choix du directeur (juin)', 'Recherche documentaire', 'Rédaction du mémoire (50-100 pages)', 'Soutenance (fin juin / septembre)'] },
    doctorat: { duration: '3-4 ans', steps: ['Choix du sujet / Inscription en 1ère année', 'Réalisation de la recherche en 2ème année', 'Rédaction et finition en 3ème/4ème année', 'Soutenance'] },
  },
  researchSteps: [
    { step: '1. Investigation', desc: 'Recherche documentaire objective', tools: ['Manuels', 'Encyclopédies', 'Ouvrages de référence'] },
    { step: '2. Exploration', desc: 'Bibliographie générale et spécialisée, définition du champ', tools: ['Bases de données', 'Catalogues', 'Réseaux scientifiques'] },
    { step: '3. Documentation', desc: 'Collecte et classement des éléments utiles', tools: ['Fiches de lecture', 'Fiches bibliographiques', 'Fiches méthodologiques'] },
    { step: '4. Rédaction', desc: 'Mise en forme logique et démonstrative', tools: ['Plan détaillé', 'Rédaction progressive', 'Relecture'] },
  ],
  researchWeb: {
    physical: ['Encyclopédies', 'Catalogue général de la BnF', 'Francis', 'Electre', 'MLA Bibliography', 'Historical Abstracts'],
    digital: ['Google Scholar', 'Persee', 'Erudit', 'Cairn', 'HAL'],
    goldenRule: 'Toujours recouper les sources web avec des sources papier fiables.',
  },
  fiches: [
    { type: 'Fiche bibliographique', content: ['Référence complète', 'Auteur, Titre, Ville, Éditeur, Date, Pages', 'Format A5 recommandé'] },
    { type: 'Fiche de lecture', content: ['Résumé de l\'ouvrage', 'Idées clés', 'Citation exacte (avec page)', 'Commentaire critique personnel'] },
    { type: 'Fiche méthodologique', content: ['Statistiques', 'Définitions', 'Concepts clés', 'Cadres théoriques'] },
  ],
  corpus: {
    definition: 'Ensemble des documents étudiés (textes, images, statistiques).',
    criteria: ['Pertinent : en lien direct avec le sujet', 'Cohérent : logique interne entre les documents', 'Consistant : taille gérable pour l\'analyse'],
  },
  problematique: {
    definition: 'Question centrale qui oriente tout le travail. Elle transforme un sujet général en une interrogation précise.',
    formulation: 'Dans quelle mesure / Comment / Pourquoi [Sujet] [Verbe d\'action] [Objet] ?',
    warning: 'Ne pas confondre le thème (général) avec la problématique (spécifique).',
    quote: 'C\'est l\'axe autour duquel s\'articule toute la démonstration… C\'est poser une question centrale concernant le sujet traité.',
  },
  planTypes: [
    { type: 'Thématique', desc: 'Parties = thèmes distincts', note: 'Le plus courant en sciences humaines' },
    { type: 'Chronologique', desc: 'Parties = périodes', note: 'Souvent trop descriptif, déconseillé en SHS pures' },
    { type: 'Critique / Dialectique', desc: 'Thèse / Antithèse / Synthèse', note: 'Idéal pour montrer une opposition' },
    { type: 'Progressif', desc: 'Observation → Analyse → Interprétation', note: 'Démarche scientifique classique' },
  ],
  titleRules: ['Doivent être accrocheurs', 'Précis et informatifs', 'Annoncer l\'idée directrice de la partie/chapitre'],
  redaction: {
    intro: { proportion: '10% du texte', mustInclude: ['Présenter le sujet', 'La problématique', 'L\'état de l\'art', 'Le plan annoncé', 'Les limites de l\'étude'] },
    conclusion: { mustInclude: ['Synthèse (pas répétition)', 'Réponse à la problématique', 'Ouverture vers d\'autres perspectives'] },
    citations: [
      { rule: 'Courtes (< 3 lignes)', format: 'Entre guillemets dans le texte' },
      { rule: 'Longues (> 3 lignes)', format: 'Alinéa décalé (retrait), sans guillemets, police plus petite possible' },
    ],
    citationRule: 'Toujours citer la source (Auteur, Titre, Page).',
    footnotes: 'Pour les références, les développements secondaires ou les commentaires personnels qui alourdiraient le texte.',
  },
  aspectsTechniques: {
    typo: ['Police : Times New Roman ou Arial', 'Corps : taille 12', 'Notes : taille 10', 'Interligne : 1,5'],
    ponctuation: ['Espaces insécables avant : ; ? !', 'Espaces normales après . ,'],
    outils: ['Table des matières automatisée', 'Index alphabétique des noms propres et concepts (optionnel mais valorisant)'],
  },
  approaches: [
    { name: 'Empirique (Inductive)', desc: 'Particulier → Général (observation → loi)', icon: 'TrendingUp' },
    { name: 'Déductive', desc: 'Général → Particulier (Théorie → Vérification)', icon: 'ArrowDown' },
    { name: 'Analytique', desc: 'Décomposer le sujet en éléments constitutifs', icon: 'ScanSearch' },
    { name: 'Synthétique', desc: 'Recomposer les éléments analysés en un tout cohérent', icon: 'Layers' },
  ],
  procedures: [
    { name: 'Déduction', desc: 'Raisonnement du général au particulier' },
    { name: 'Induction', desc: 'Raisonnement du particulier au général' },
    { name: 'Analogie', desc: 'Comparer deux faits différents pour expliquer l\'un par l\'autre' },
    { name: 'Classification', desc: 'Regrouper les faits par catégories (typologie)' },
  ],
  methods: [
    { name: 'Méthode expérimentale', desc: 'Vérifier une hypothèse par l\'expérience ou l\'observation rigoureuse. Nécessite des variables clairement définies (VI vs VD).' },
    { name: 'Méthode historique', desc: 'Critique des sources (authenticité, localisation). Critique externe (support matériel) et critique interne (contenu, style, intention). Objectif : reconstruire le passé.' },
    { name: 'Méthode sociologique', desc: 'Étude des faits sociaux comme des « choses » (Durkheim). Statistiques, enquêtes de terrain, objectivation du chercheur.' },
  ],
  institutionnel: {
    doctorat: { duree: '3 ans après Master (inscription renouvelable)', encadrement: 'Direction par un professeur HDR', convention: 'Charte des thèses (droits/devoirs du doctorant et du directeur)', soutenance: 'Devant un jury. Manuscrit remis au moins 1 mois avant.' },
    master: { finalite: 'Formation à la recherche', volume: '300h de formation + stage/mémoire', memoire: '50-100 pages généralement' },
  },
  evaluationCriteria: [
    { category: 'Forme', items: ['Présentation générale', 'Orthographe et grammaire', 'Clarté du style', 'Qualité des outils (bibliographie, index)'] },
    { category: 'Fond', items: ['Originalité du sujet', 'Maîtrise de la littérature (state of the art)', 'Pertinence de la méthode', 'Solidité de l\'argumentation', 'Rigueur scientifique'] },
    { category: 'Valeur ajoutée', items: ['Apport nouveau à la discipline', 'Qualités pédagogiques (clarté)'] },
  ],
  quotes: [
    { text: 'La méthode désigne l\'ensemble des démarches que suit l\'esprit humain pour découvrir et démontrer la vérité.', page: 'p. 5' },
    { text: 'La recherche ne peut être une simple compilation d\'informations, une synthèse de l\'existant. Elle se doit d\'être une investigation…', page: 'p. 9' },
    { text: 'C\'est l\'axe autour duquel s\'articule toute la démonstration… C\'est poser une question centrale concernant le sujet traité.', page: 'p. 19' },
    { text: 'Il faut avoir préparé intelligemment un certain nombre de fiches qui vont servir de base à la rédaction.', page: 'p. 25' },
  ],
}

