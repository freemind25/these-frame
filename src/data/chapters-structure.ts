export interface ChapterStructure {
  order: number
  number: string
  title: string
  shortTitle: string
  icon: string
  color: string
  description: string
  expectations: string[]
  structure: string[]
}

export const CHAPTERS: ChapterStructure[] = [
  {
    order: 1,
    number: 'I',
    title: 'Introduction générale',
    shortTitle: 'Introduction',
    icon: 'FileText',
    color: 'emerald',
    description: 'Contexte, problématique, objectifs et plan de la thèse.',
    expectations: [
      'Amener le sujet par un contexte large (domaine disciplinaire)',
      'Faire émerger une problématique de recherche claire',
      'Formuler les objectifs principaux de la recherche',
      'Présenter les hypothèses de recherche',
      'Annoncer le plan du manuscrit (chapitre par chapitre)',
    ],
    structure: [
      '1.1 Contexte général du domaine',
      '1.2 Problématique de recherche',
      '1.3 Questions et hypothèses de recherche',
      '1.4 Objectifs de la recherche',
      '1.5 Apports et intérêt scientifique',
      '1.6 Organisation du manuscrit',
    ],
  },
  {
    order: 2,
    number: 'II',
    title: 'Données bibliographiques et cadre théorique',
    shortTitle: 'Bibliographie',
    icon: 'BookOpen',
    color: 'sky',
    description: 'Revue de littérature, cadre conceptuel et positionnement théorique.',
    expectations: [
      'Couvrir les principaux courants théoriques du domaine',
      'Identifier les lacunes de la recherche (research gaps)',
      'Construire un cadre conceptuel cohérent',
      'Positionner votre travail par rapport aux études antérieures',
      'Définir les concepts clés avec précision',
    ],
    structure: [
      '2.1 Revue de littérature thématique',
      '2.2 Cadre conceptuel et théorique',
      '2.3 Positionnement par rapport aux travaux existants',
      '2.4 Définition des concepts opérationnels',
    ],
  },
  {
    order: 3,
    number: 'III',
    title: 'Cadre méthodologique',
    shortTitle: 'Méthodologie',
    icon: 'FlaskConical',
    color: 'amber',
    description: 'Design de recherche, outils de collecte et techniques d\'analyse.',
    expectations: [
      'Justifier le choix du design de recherche',
      'Décrire la population et l\'échantillon',
      'Présenter les instruments de collecte de données',
      'Expliquer les techniques d\'analyse',
      'Aborder les considérations éthiques',
    ],
    structure: [
      '3.1 Approche épistémologique et design de recherche',
      '3.2 Population et stratégie d\'échantillonnage',
      '3.3 Instruments et procédures de collecte des données',
      '3.4 Techniques d\'analyse des données',
      '3.5 Considérations éthiques',
    ],
  },
  {
    order: 4,
    number: 'IV',
    title: 'Résultats',
    shortTitle: 'Résultats',
    icon: 'BarChart3',
    color: 'violet',
    description: 'Présentation des analyses et des principaux résultats de la recherche.',
    expectations: [
      'Présenter les résultats de manière organisée',
      'Utiliser tableaux, figures et graphiques',
      'Rapporter les analyses statistiques ou qualitatives',
      'Restituer les résultats par objectif / hypothèse',
    ],
    structure: [
      '4.1 Résultats de l\'analyse descriptive',
      '4.2 Résultats de l\'analyse inférentielle / qualitative',
      '4.3 Synthèse des résultats par hypothèse',
    ],
  },
  {
    order: 5,
    number: 'V',
    title: 'Discussion',
    shortTitle: 'Discussion',
    icon: 'MessageSquare',
    color: 'rose',
    description: 'Interprétation des résultats, mise en perspective et limites.',
    expectations: [
      'Interpréter les résultats à la lumière de la littérature',
      'Confronter les résultats aux hypothèses initiales',
      'Discuter les implications théoriques et pratiques',
      'Identifier les limites de l\'étude',
      'Proposer des perspectives de recherche future',
    ],
    structure: [
      '5.1 Interprétation et mise en perspective',
      '5.2 Confrontation aux hypothèses et à la littérature',
      '5.3 Implications théoriques et pratiques',
      '5.4 Limites de l\'étude',
      '5.5 Perspectives de recherche',
    ],
  },
  {
    order: 6,
    number: 'VI',
    title: 'Conclusion générale',
    shortTitle: 'Conclusion',
    icon: 'GraduationCap',
    color: 'teal',
    description: 'Synthèse globale, réponse à la problématique et contribution.',
    expectations: [
      'Rappeler la problématique et les objectifs',
      'Synthétiser les principaux résultats',
      'Répondre explicitement à la problématique',
      'Dégager la contribution scientifique',
      'Ouvrir sur des perspectives',
    ],
    structure: [
      '6.1 Rappel de la problématique et des objectifs',
      '6.2 Synthèse des principaux résultats',
      '6.3 Réponse à la problématique de recherche',
      '6.4 Contribution scientifique',
      '6.5 Perspectives et ouverture',
    ],
  },
]

export const CHAPTER_COLORS: Record<string, { bg: string; text: string; border: string; accent: string; light: string }> = {
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', accent: 'bg-emerald-100', light: 'bg-emerald-50' },
  sky:     { bg: 'bg-sky-500',     text: 'text-sky-600',     border: 'border-sky-200',     accent: 'bg-sky-100',     light: 'bg-sky-50' },
  amber:   { bg: 'bg-amber-500',   text: 'text-amber-600',   border: 'border-amber-200', accent: 'bg-amber-100', light: 'bg-amber-50' },
  violet:  { bg: 'bg-violet-500',  text: 'text-violet-600',  border: 'border-violet-200', accent: 'bg-violet-100', light: 'bg-violet-50' },
  rose:    { bg: 'bg-rose-500',    text: 'text-rose-600',    border: 'border-rose-200', accent: 'bg-rose-100', light: 'bg-rose-50' },
  teal:    { bg: 'bg-teal-500',    text: 'text-teal-600',    border: 'border-teal-200', accent: 'bg-teal-100', light: 'bg-teal-50' },
}
