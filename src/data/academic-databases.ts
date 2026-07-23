/**
 * Bases de données académiques gratuites
 * Configuration pour les sources de recherche intégrées dans ThesisFrame
 */

export interface AcademicDB {
  id: string
  label: string
  description: string
  url: string
  color: string
  homepage?: string
  searchUrl?: string // URL pattern for searching (with {query} placeholder)
  searchMethod?: 'url' | 'api' // 'url' = append query to URL, 'api' = use a POST endpoint apiBaseUrl + endpoint
}

export const academicDatabases: AcademicDB[] = [
  {
    id: 'zlibrary',
    label: 'Z-Library',
    description:
      "La plus grande bibliothèque numérique au monde avec plus de 14 millions de livres et 84 millions d'articles. Permet de télécharger des livres, articles scientifiques et ouvrages académiques en PDF/EPUB.",
    url: 'https://z-lib.org/',
    color: '#16A34A',
    searchUrl: 'https://z-lib.org/s/{query}',
    searchMethod: 'url',
    homepage: 'https://z-lib.org/',
  },
  {
    id: 'annas-archive',
    label: "Anna's Archive",
    description:
      "Méta-moteur de recherche qui agrège Z-Library, LibGen et d'autres sources. Plus de 18 millions de livres et 100 millions d'articles. Interface simple et recherche rapide.",
    url: 'https://annas-archive.org/',
    color: '#8B4513',
    searchUrl: 'https://annas-archive.org/search?q={query}',
    searchMethod: 'url',
    homepage: 'https://annas-archive.org/',
  },
  {
    id: 'welib-st',
    label: 'Welib',
    description:
      "Bibliothèque numérique avec plus de 700 000 livres numérisés. Interface claire et rapide pour rechercher des ouvrages et accéder aux textes complets.",
    url: 'https://welib.st/',
    color: '#2563EB',
    searchUrl: 'https://welib.st/search?q={query}',
    searchMethod: 'url',
    homepage: 'https://welib.st/',
  },
  {
    id: 'libgen-im',
    label: 'Library Genesis',
    description:
      "Base de données massive de livres et articles scientifiques en accès libre. Plus de 2,7 millions de livres et 58 millions d'articles. Particulièrement utile pour les ouvrages académiques.",
    url: 'https://libgen.im/',
    color: '#7C3AED',
    searchUrl: 'https://libgen.im/search.php?req={query}',
    searchMethod: 'url',
    homepage: 'https://libgen.im/',
  },
  {
    id: 'hal-science',
    label: 'HAL (HAL Science)',
    description:
      "Archive ouverte de publications scientifiques françaises. Accès libre aux textes complets de millions d'articles, thèses et rapports. Ressource majeure pour la recherche francophone.",
    url: 'https://hal.science/',
    color: '#DC2626',
    searchUrl: 'https://hal.science/search/?q={query}',
    searchMethod: 'url',
    homepage: 'https://hal.science/',
  },
  {
    id: 'libguides',
    label: 'LibGuides (Rechercheurs IA)',
    description:
      "Répertoire de chercheurs d'IA avec des liens vers des outils et ressources. Inclut des outils de recherche, des frameworks et des guides pratiques.",
    url: 'https://libguides.library.arizona.edu/ai-researchers/scispace/',
    color: '#9333EA',
    searchUrl: 'https://libguides.library.arizona.edu/ai-researchers/scispace/',
    searchMethod: 'url',
    homepage: 'https://libguides.library.arizona.edu/ai-researchers/scispace/',
  },
  {
    id: 'shadowlibs',
    label: 'ShadowLibraries',
    description:
      "Collection de bibliothèques numériques et ressources open source. Utile pour découvrir des alternatives d'accès aux publications scientifiques.",
    url: 'https://shadowlibraries.github.io/',
    color: '#4F46E5',
    searchUrl: 'https://shadowlibraries.github.io/',
    searchMethod: 'url',
    homepage: 'https://shadowlibraries.github.io/',
  },
];
