export interface Resource {
  id: string
  title: string
  author: string
  year: number
  description: string
  fileUrl: string
  fileType: 'pdf' | 'epub'
  fileSize: string
  category: 'redaction' | 'methodologie' | 'ia' | 'encadrement'
  coverColor: string
}

export const RESOURCES: Resource[] = [
  {
    id: 'belleville-assieds-toi',
    title: 'Assieds-toi et écris ta thèse',
    author: 'Geneviève Belleville',
    year: 2019,
    description: 'Conseils motivationnels et stratégies pratiques pour vaincre la procrastination et rédiger sa thèse de manière efficace.',
    fileUrl: '/resources/belleville-assieds-toi.epub',
    fileType: 'epub',
    fileSize: '6.4 MB',
    category: 'redaction',
    coverColor: 'from-rose-500 to-pink-600',
  },
  {
    id: 'belleville-trucs-pratiques',
    title: 'Trucs pratiques et motivationnels pour la rédaction scientifique',
    author: 'Geneviève Belleville',
    year: 2021,
    description: 'Guide pratique avec des exercices concrets et des astuces motivationnelles pour la rédaction de travaux scientifiques.',
    fileUrl: '/resources/belleville-trucs-pratiques.pdf',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    category: 'redaction',
    coverColor: 'from-pink-500 to-rose-600',
  },
  {
    id: 'belleville-extraire-these',
    title: 'Extraire une thèse d\'un cerveau étudiant sans gâchis',
    author: 'Geneviève Belleville, Philip L. Jackson',
    year: 2021,
    description: 'Favoriser la rédaction et la persévérance aux cycles supérieurs par des techniques d\'écriture fluide.',
    fileUrl: '/resources/belleville-extraire-these.epub',
    fileType: 'epub',
    fileSize: '2.6 MB',
    category: 'redaction',
    coverColor: 'from-fuchsia-500 to-purple-600',
  },
  {
    id: 'begin-encadrer',
    title: 'Encadrer aux cycles supérieurs',
    author: 'Christian Bégin',
    year: 2017,
    description: 'Étapes, problèmes et interventions pour l\'encadrement de mémoires et thèses. Guide du directeur de recherche.',
    fileUrl: '/resources/begin-encadrer-cycles.pdf',
    fileType: 'pdf',
    fileSize: '2.3 MB',
    category: 'encadrement',
    coverColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'aventure-recherche-qualitative',
    title: 'L\'aventure de la Recherche Qualitative',
    author: 'Collectif',
    year: 2020,
    description: 'Du questionnement à la rédaction scientifique : guide complet sur les méthodologies de recherche qualitative.',
    fileUrl: '/resources/aventure-recherche-qualitative.pdf',
    fileType: 'pdf',
    fileSize: '19.9 MB',
    category: 'methodologie',
    coverColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'kothari-research-methodology',
    title: 'Research Methodology — Methods and Techniques',
    author: 'C.R. Kothari',
    year: 2004,
    description: 'Ouvrage de référence sur les méthodes et techniques de recherche : échantillonnage, collecte de données, analyse statistique.',
    fileUrl: '/resources/kothari-research-methodology.pdf',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    category: 'methodologie',
    coverColor: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'effective-academic-writing',
    title: 'Effective Academic Writing — The Researched Essay',
    author: 'Rhonda Liss, Alice Savage, Jason Davis',
    year: 2014,
    description: 'Techniques avancées de rédaction académique centrées sur l\'essai argumenté et la recherche documentaire.',
    fileUrl: '/resources/effective-academic-writing.pdf',
    fileType: 'pdf',
    fileSize: '4.5 MB',
    category: 'redaction',
    coverColor: 'from-sky-500 to-blue-600',
  },
  {
    id: 'longman-academic-writing',
    title: 'Longman Academic Writing — Essays to Research Papers',
    author: 'Alan Meyers',
    year: 2015,
    description: 'Série complète de rédaction académique, de l\'essai au papier de recherche. Structure, cohésion et style.',
    fileUrl: '/resources/longman-academic-writing.pdf',
    fileType: 'pdf',
    fileSize: '19 MB',
    category: 'redaction',
    coverColor: 'from-indigo-500 to-violet-600',
  },
  {
    id: 'evaluating-research',
    title: 'Evaluating Research in Academic Journals',
    author: 'Fred Pyrczak, Maria Tcherni-Buzzeo',
    year: 2018,
    description: 'Guide pratique pour évaluer de manière critique les articles de revues académiques. Lecture évaluative et analyse.',
    fileUrl: '/resources/evaluating-research.pdf',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    category: 'methodologie',
    coverColor: 'from-violet-500 to-purple-600',
  },
  {
    id: 'ai-powered-academic',
    title: 'The AI-Powered Academic',
    author: 'Dr. Mehdi Bagheri',
    year: 2024,
    description: '100+ outils IA et stratégies de prompts pour révolutionner la recherche, la rédaction et l\'enseignement académique.',
    fileUrl: '/resources/ai-powered-academic.epub',
    fileType: 'epub',
    fileSize: '2.9 MB',
    category: 'ia',
    coverColor: 'from-emerald-400 to-green-600',
  },
  {
    id: 'thesis-with-chatgpt',
    title: 'Writing Your Thesis With ChatGPT',
    author: 'Paul Johannesson',
    year: 2024,
    description: 'Recherche, scholarship et rédaction académique à l\'ère de l\'IA générative. Utilisation responsable de ChatGPT.',
    fileUrl: '/resources/thesis-with-chatgpt.pdf',
    fileType: 'pdf',
    fileSize: '1.6 MB',
    category: 'ia',
    coverColor: 'from-green-500 to-emerald-600',
  },
]

export const CATEGORY_LABELS: Record<Resource['category'], string> = {
  redaction: 'Rédaction scientifique',
  methodologie: 'Méthodologie de recherche',
  ia: 'IA & Académie',
  encadrement: 'Encadrement',
}

export const CATEGORY_COLORS: Record<Resource['category'], string> = {
  redaction: 'bg-rose-100 text-rose-700 border-rose-200',
  methodologie: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ia: 'bg-amber-100 text-amber-700 border-amber-200',
  encadrement: 'bg-sky-100 text-sky-700 border-sky-200',
}
