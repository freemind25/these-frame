// Bailey, S. (2015). Academic Writing: A Handbook for International Students (4th ed.). Routledge.
// Données de référence pour la rédaction académique en français, adaptées de cette source.

export interface WritingProcessStep {
  id: string;
  title: string;
  description: string;
  detailedSteps: string[];
  commonMistakes: string[];
  tips: string[];
}

export interface WritingElement {
  id: string;
  title: string;
  category: string;
  description: string;
  examples: string[];
  languageMarkers: string[];
}

export interface VocabularyItem {
  id: string;
  category: string;
  word: string;
  definition: string;
  example: string;
  synonyms: string[];
}

export interface WritingModel {
  id: string;
  type: string;
  title: string;
  description: string;
  structure: string[];
  keyFeatures: string[];
}

export interface WritingSource {
  id: string;
  author: string;
  year: number;
  title: string;
  publisher: string;
  focusAreas: string[];
}

export const baileySource: WritingSource = {
  id: 'bailey-2015',
  author: 'Bailey, S.',
  year: 2015,
  title: 'Academic Writing: A Handbook for International Students',
  publisher: 'Routledge',
  focusAreas: [
    'Processus de rédaction académique',
    'Éléments de rédaction (argumentation, cohésion, style)',
    'Vocabulaire académique',
    'Modèles de textes (essai, rapport, étude de cas)',
    'Sources et références',
    'Paraphrase et résumé',
  ],
};

export const writingProcessSteps: WritingProcessStep[] = [
  {
    id: 'wp-background',
    title: 'Contexte de la rédaction académique',
    description:
      'La rédaction académique constitue un genre textuel spécifique qui se distingue de l\'écriture ordinaire par sa rigueur, son objectivité et sa structure argumentative. Elle implique un positionnement clair de l\'auteur face au savoir existant et une maîtrise des conventions propres à chaque discipline. Comprendre ce contexte permet d\'adopter le ton et le registre adaptés dès les premières étapes de la rédaction. Cette étape fondamentale conditionne la qualité de l\'ensemble du travail de recherche.',
    detailedSteps: [
      'Identifier le public cible et le niveau d\'expertise attendu',
      'Analyser les conventions de rédaction de la discipline concernée',
      'Définir le rôle de l\'auteur : rapporteur, critique ou contributeur',
      'Distinguer les différents types de textes académiques et leurs exigences',
      'Prendre conscience des normes de formalité et d\'objectivité requises',
    ],
    commonMistakes: [
      'Utiliser un ton trop informel ou familier dans un travail académique',
      'Confondre opinion personnelle et argument étayé par des preuves',
      'Ignorer les conventions spécifiques de sa discipline',
      'Ne pas adapter le niveau de langage au public visé',
    ],
    tips: [
      'Lire des articles publiés dans votre domaine pour absorber le style attendu',
      'Maintenir une distance critique entre votre voix et les sources citées',
      'Privilégier des phrases claires et précises plutôt que des formulations ambiguës',
      'Consulter les guides de style de votre institution pour les normes locales',
    ],
  },
  {
    id: 'wp-reading-sources',
    title: 'Lecture - Trouver des sources fiables',
    description:
      'La recherche de sources fiables est le fondement de tout travail académique de qualité. Il est essentiel de savoir évaluer la crédibilité, la pertinence et l\'actualité des documents consultés. Les bases de données académiques, les revues à comité de lecture et les ouvrages publiés par des maisons d\'édition reconnues constituent les sources les plus fiables. Une sélection rigoureuse des sources garantit la solidité de l\'argumentation développée.',
    detailedSteps: [
      'Utiliser les bases de données académiques (Google Scholar, JSTOR, CAIRN)',
      'Vérifier la réputation de l\'éditeur et le processus de révision par les pairs',
      'Évaluer la pertinence de la source par rapport à la problématique',
      'Consulter la bibliographie des articles pertinents pour élargir la recherche',
      'Classer les sources par thème et par niveau de pertinence',
      'Distinguer les sources primaires des sources secondaires',
    ],
    commonMistakes: [
      'Se limiter aux résultats de la première page d\'un moteur de recherche',
      'Utiliser des sources non vérifiées comme des blogs ou des sites grand public',
      'Ignorer la date de publication et utiliser des sources obsolètes',
      'Ne pas diversifier les types de sources (articles, livres, rapports)',
    ],
    tips: [
      'Commencer par les articles de revue (review articles) pour avoir une vue d\'ensemble',
      'Utiliser les mots-clés en français et en anglais pour élargir la recherche',
      'Garder une trace systématique de toutes les références consultées',
      'Privilégier les sources récentes (moins de 10 ans) sauf pour les textes fondateurs',
    ],
  },
  {
    id: 'wp-critical-reading',
    title: 'Lecture - Approche critique',
    description:
      'L\'approche critique de la lecture va au-delà de la simple compréhension du texte : elle implique d\'évaluer les arguments, d\'identifier les biais et de juger la validité des preuves présentées. Cette compétence est indispensable pour construire une argumentation solide et originale. Le lecteur critique ne se contente pas d\'accepter les affirmations d\'un auteur, il les soumet à un examen rigoureux. Cette démarche intellectuelle nourrit la réflexion personnelle et évite la reproduction passive des idées d\'autrui.',
    detailedSteps: [
      'Identifier la thèse principale et les arguments secondaires du texte',
      'Évaluer la qualité des preuves et des données présentées',
      'Repérer les biais potentiels et les limites de l\'étude',
      'Comparer les points de vue de différents auteurs sur le même sujet',
      'Formuler des questions critiques sur les affirmations non étayées',
    ],
    commonMistakes: [
      'Accepter sans examen les conclusions d\'un auteur reconnu',
      'Confondre description et analyse dans la lecture d\'un texte',
      'Ignorer les limites méthodologiques d\'une étude',
      'Ne pas distinguer fait et opinion dans les sources consultées',
    ],
    tips: [
      'Poser systématiquement les questions : qui ? quoi ? pourquoi ? comment ?',
      'Rédiger un bref résumé critique après chaque lecture importante',
      'Confronter les sources entre elles pour identifier les convergences et divergences',
      'Annoter directement le texte avec des remarques critiques personnelles',
    ],
  },
  {
    id: 'wp-plagiarism',
    title: 'Éviter le plagiat',
    description:
      'Le plagiat constitue une faute académique grave qui consiste à présenter les idées ou les mots d\'autrui comme siens, sans attribution appropriée. Il peut être intentionnel ou résulter d\'une méconnaissance des règles de citation. Les conséquences du plagiat vont de la note zéro à l\'exclusion définitive de l\'institution. Comprendre les différentes formes de plagiat est donc essentiel pour tout étudiant et chercheur.',
    detailedSteps: [
      'Comprendre les différentes formes de plagiat : direct, mosaicque, auto-plagiat',
      'Toujours citer la source lorsqu\'on utilise les idées ou les mots d\'un autre auteur',
      'Apprendre à paraphraser correctement sans déformer le sens original',
      'Utiliser un logiciel de détection de plagiat pour vérifier son travail',
      'Connaître les sanctions encourues en cas de plagiat dans son institution',
      'Développer une pratique systématique de prise de notes avec références complètes',
    ],
    commonMistakes: [
      'Penser que paraphraser sans citer n\'est pas du plagiat',
      'Réutiliser son propre travail précédent sans le mentionner (auto-plagiat)',
      'Citer la source dans la bibliographie mais pas dans le corps du texte',
      'Changer quelques mots d\'un texte et le présenter comme une paraphrase',
    ],
    tips: [
      'Rédiger toujours ses notes avec la référence complète de la source',
      'Utiliser des guillemets pour toute citation textuelle, même courte',
      'Vérifier systématiquement que chaque affirmation étayée est accompagnée de sa source',
      'Consulter les directives officielles de votre institution sur le plagiat',
    ],
  },
  {
    id: 'wp-titles-to-plan',
    title: 'Des titres au plan',
    description:
      'L\'élaboration d\'un plan structuré est une étape cruciale qui guide l\'ensemble du processus de rédaction. Un bon titre doit être à la fois précis, informatif et engageant, annonçant clairement le contenu du texte. Le plan, quant à lui, organise les idées de manière logique et hiérarchique, facilitant tant la rédaction que la lecture. Cette étape de planification permet d\'éviter les répétitions et les incohérences dans le développement.',
    detailedSteps: [
      'Formuler un titre provisoire qui reflète la problématique centrale',
      'Définir les grandes parties (introduction, développement, conclusion)',
      'Décomposer chaque partie en sections et sous-sections thématiques',
      'Vérifier la progression logique et la cohérence entre les sections',
      'Prévoir un équilibre approximatif entre les différentes parties',
      'Revenir sur le titre après avoir finalisé le plan pour plus de précision',
    ],
    commonMistakes: [
      'Rédiger sans plan et se perdre dans les idées au fil du texte',
      'Choisir un titre trop vague ou trop large qui ne reflète pas le contenu',
      'Créer un plan trop détaillé qui rigidifie la rédaction',
      'Négliger l\'équilibrage des sections, certaines étant disproportionnées',
    ],
    tips: [
      'Utiliser des titres de sections qui sont des phrases complètes ou des questions',
      'Prévoir une certaine flexibilité dans le plan pour l\'adapter pendant la rédaction',
      'Partager votre plan avec un pair ou un directeur pour obtenir des retours',
      'Numéroter les sections pour faciliter les renvois internes pendant la rédaction',
    ],
  },
  {
    id: 'wp-notes',
    title: 'Points clés et prise de notes',
    description:
      'La prise de notes efficace est une compétence qui transforme la lecture passive en outil de travail actif. Des notes bien structurées facilitent grandement la rédaction ultérieure en permettant de retrouver rapidement les informations essentielles. Il est important de développer un système de notation personnel et cohérent qui distingue clairement les idées de l\'auteur des commentaires personnels. Cette pratique rigoureuse constitue la base matérielle de tout travail académique.',
    detailedSteps: [
      'Élaborer un système de notation cohérent (codes couleur, symboles, abréviations)',
      'Séparer clairement les idées de l\'auteur de ses propres commentaires',
      'Noter systématiquement les références bibliographiques complètes',
      'Identifier les concepts clés, les définitions et les arguments principaux',
      'Utiliser des schémas et des cartes mentales pour organiser les idées complexes',
    ],
    commonMistakes: [
      'Copier intégralement des passages sans les paraphraser dans ses notes',
      'Prendre des notes sans noter les références de source correspondantes',
      'Omettre de dater les notes et d\'indiquer le contexte de la lecture',
      'Accumuler des notes désorganisées qui deviennent inexploitables',
    ],
    tips: [
      'Utiliser un tableau à double colonne : résumé d\'un côté, commentaire de l\'autre',
      'Relire et réorganiser ses notes dans les 24 heures suivant la lecture',
      'Numéroter les pages des sources pour pouvoir les retrouver facilement',
      'Digitaliser les notes pour faciliter la recherche et le classement ultérieurs',
    ],
  },
  {
    id: 'wp-summarizing',
    title: 'Résumer et paraphraser',
    description:
      'Le résumé et la paraphrase sont deux compétences complémentaires essentielles à la rédaction académique. Le résumé condense les idées principales d\'un texte en un nombre réduit de mots, tandis que la paraphrase reformule les idées d\'un auteur dans ses propres mots tout en conservant le sens original. Ces techniques permettent d\'intégrer les sources de manière fluide et originale dans son propre texte. Maîtriser ces compétences est indispensable pour éviter le plagiat et démontrer sa compréhension des sources.',
    detailedSteps: [
      'Lire le texte source plusieurs fois pour en saisir l\'essentiel',
      'Identifier les idées principales et les arguments clés à retenir',
      'Reformuler les idées en utilisant un vocabulaire et une structure différents',
      'Conserver le sens original sans ajouter d\'interprétation personnelle dans le résumé',
      'Toujours citer la source même lorsqu\'on paraphrase',
    ],
    commonMistakes: [
      'Confondre résumé (condensation) et commentaire (interprétation personnelle)',
      'Paraphraser en changeant seulement quelques mots, ce qui équivaut à un plagiat',
      'Oublier de citer la source lors d\'une paraphrase ou d\'un résumé',
      'Résumer de manière trop détaillée, au point de reproduire le texte original',
    ],
    tips: [
      'Fermer le texte source avant de rédiger le résumé pour éviter la copie',
      'Utiliser des verbes de signal (selon X, Y affirme que) pour introduire les paraphrases',
      'Comparer sa paraphrase avec le texte original pour vérifier qu\'elle est suffisamment différente',
      'Garder le même ordre des idées que le texte original pour ne pas déformer le sens',
    ],
  },
  {
    id: 'wp-references',
    title: 'Références et citations',
    description:
      'Les références et les citations sont les piliers de l\'intégrité académique. Elles permettent de situer son travail dans le contexte de la recherche existante et de reconnaître la contribution des autres chercheurs. Différents styles de citation existent (APA, MLA, Chicago, Vancouver), chacun avec ses règles spécifiques de formatage. Une maîtrise rigoureuse de ces normes est indispensable pour tout travail académique sérieux.',
    detailedSteps: [
      'Choisir le style de citation requis par votre institution ou votre discipline',
      'Apprendre les règles de formatage pour chaque type de source (livre, article, site web)',
      'Utiliser un gestionnaire de références bibliographiques (Zotero, Mendeley, EndNote)',
      'Intégrer les citations dans le texte selon les normes (auteur-date, numérique)',
      'Compiler la bibliographie finale en vérifiant la cohérence avec les citations in-texte',
    ],
    commonMistakes: [
      'Mélanger différents styles de citation dans un même document',
      'Oublier des références citées dans le texte dans la bibliographie finale',
      'Ne pas respecter les règles de ponctuation spécifiques au style de citation choisi',
      'Citer indirectement une source sans avoir consulté le texte original',
    ],
    tips: [
      'Configurer votre gestionnaire de références dès le début de votre recherche',
      'Vérifier systématiquement que chaque citation in-texte a une entrée correspondante dans la bibliographie',
      'Conserver les DOIs et URLs des sources numériques pour faciliter la vérification',
      'Relire la bibliographie séparément pour repérer les erreurs de formatage',
    ],
  },
  {
    id: 'wp-combining',
    title: 'Combiner les sources',
    description:
      'La capacité à combiner habilement plusieurs sources est ce qui distingue la véritable rédaction académique de la simple compilation de citations. Il s\'agit de créer un dialogue entre les auteurs, de mettre en lumière les convergences et les divergences, et de construire une synthèse originale. Cette compétence nécessite une compréhension approfondie de chaque source et une réflexion personnelle sur leurs relations mutuelles. Le résultat doit être un texte fluide où les différentes voix s\'intègrent naturellement.',
    detailedSteps: [
      'Identifier les points de convergence et de divergence entre les sources',
      'Organiser les sources thématiquement plutôt qu\'auteur par auteur',
      'Utiliser des connecteurs logiques pour lier les différentes perspectives',
      'Positionner sa propre voix par rapport aux sources combinées',
      'Équilibrer les différentes sources pour éviter de privilégier excessivement l\'une d\'elles',
    ],
    commonMistakes: [
      'Présenter les sources les unes après les autres sans les mettre en relation',
      'Laisser les sources parler sans apporter de synthèse ou d\'analyse personnelle',
      'Surcharger le texte de citations au détriment de l\'argumentation propre',
      'Ignorer les contradictions entre sources au lieu de les analyser',
    ],
    tips: [
      'Utiliser des verbes de comparaison (en revanche, parallèlement, de même que)',
      'Créer des tableaux comparatifs pour visualiser les positions des différents auteurs',
      'Commencer chaque paragraphe par une idée directrice avant d\'introduire les sources',
      'Utiliser le système de citation multiple (Auteur A, 2020 ; Auteur B, 2021) pour les convergences',
    ],
  },
  {
    id: 'wp-paragraphs',
    title: 'Organiser les paragraphes',
    description:
      'Le paragraphe est l\'unité fondamentale de l\'organisation textuelle dans la rédaction académique. Chaque paragraphe doit développer une seule idée principale, exprimée dans une phrase topic claire, suivie de phrases de soutien et d\'une phrase de transition. La longueur des paragraphes doit être variée mais raisonnable, généralement entre cinq et dix phrases. Une bonne organisation paragraphaire rend le texte lisible, logique et convaincant.',
    detailedSteps: [
      'Rédiger une phrase topic qui annonce clairement l\'idée principale du paragraphe',
      'Développer l\'idée principale avec des explications, des exemples et des preuves',
      'Utiliser des mots de transition pour assurer la fluidité entre les phrases',
      'Conclure le paragraphe par une phrase de synthèse ou de transition vers le suivant',
      'Vérifier que chaque phrase contribue à l\'idée principale du paragraphe',
    ],
    commonMistakes: [
      'Rédiger des paragraphes d\'une seule phrase qui n\'ont pas suffisamment de substance',
      'Oublier la phrase topic, rendant le paragraphe confus et sans direction',
      'Mélanger plusieurs idées dans un même paragraphe sans cohérence',
      'Enchaîner les paragraphes sans transitions logiques entre eux',
    ],
    tips: [
      'Commencer chaque paragraphe par un argument, pas par une citation',
      'Lire uniquement les premières phrases de chaque paragraphe pour vérifier la progression logique',
      'Varier la longueur des paragraphes pour maintenir le rythme de lecture',
      'Supprimer les phrases qui ne contribuent pas directement à l\'idée principale',
    ],
  },
  {
    id: 'wp-intros',
    title: 'Introductions et conclusions',
    description:
      'L\'introduction et la conclusion sont les deux parties les plus lues de tout travail académique et méritent une attention particulière. L\'introduction doit capter l\'attention, situer le contexte, présenter la problématique et annoncer le plan. La conclusion doit synthétiser les résultats, répondre à la problématique et ouvrir de nouvelles perspectives. Ces deux sections encadrent le développement et lui donnent sa pleine signification.',
    detailedSteps: [
      'Rédiger l\'introduction en entonnoir : du contexte général à la problématique spécifique',
      'Annoncer clairement la thèse ou l\'objectif du travail dans l\'introduction',
      'Présenter le plan de développement de manière concise et explicite',
      'Synthétiser les principaux résultats sans introduire de nouvelles informations dans la conclusion',
      'Ouvrir des perspectives de recherche ou de réflexion dans la partie finale',
    ],
    commonMistakes: [
      'Commencer l\'introduction par une définition de dictionnaire trop générale',
      'Annoncer un plan dans l\'introduction qui ne correspond pas au développement réel',
      'Introduire de nouvelles idées ou de nouvelles sources dans la conclusion',
      'Répéter mot pour mot l\'introduction dans la conclusion',
    ],
    tips: [
      'Rédiger l\'introduction et la conclusion en dernier, une fois le développement finalisé',
      'Utiliser la technique de l\'entonnoir pour aller du général au particulier dans l\'introduction',
      'La conclusion doit répondre explicitement à la question de recherche posée',
      'Éviter les formules vides comme « nous avons vu que » dans la conclusion',
    ],
  },
  {
    id: 'wp-rewriting',
    title: 'Réécriture et relecture',
    description:
      'La réécriture et la relecture sont des étapes indispensables qui transforment un premier brouillon en un texte académique abouti. La réécriture porte sur le fond : structure, argumentation, clarté des idées. La relecture porte sur la forme : grammaire, orthographe, ponctuation, cohérence stylistique. Ces étapes itératives permettent d\'affiner progressivement la qualité du texte. Un texte académique de qualité est toujours le résultat de plusieurs révisions.',
    detailedSteps: [
      'Laisser reposer le texte quelques jours avant de le relire avec un regard neuf',
      'Procéder d\'abord à une révision du fond (structure, argumentation, logique)',
      'Ensuite, effectuer une relecture de la forme (grammaire, orthographe, style)',
      'Faire relire le texte par un pair pour obtenir un retour extérieur objectif',
      'Utiliser les outils de correction automatique comme complément, pas comme substitut',
    ],
    commonMistakes: [
      'Considérer que le premier brouillon est suffisamment bon pour être soumis',
      'Corriger uniquement l\'orthographe sans revoir la structure et l\'argumentation',
      'Relire immédiatement après la rédaction, sans prise de distance',
      'Ignorer les retours des relecteurs par fierté ou manque de temps',
    ],
    tips: [
      'Lire le texte à voix haute pour détecter les formulations maladroites',
      'Vérifier que chaque paragraphe contribue à l\'argument principal',
      'Supprimer le superflu : adverbs inutiles, répétitions, phrases trop longues',
      'Prévoir au moins deux sessions de révision avant la soumission finale',
    ],
  },
];

export const writingElements: WritingElement[] = [
  {
    id: 'el-argument',
    title: 'Argumentation',
    category: 'argumentation',
    description:
      'L\'argumentation académique repose sur la présentation systématique de raisons étayées par des preuves pour soutenir une thèse. Chaque argument doit être clairement énoncé, illustré par des exemples concrets et relié à la problématique générale. La force d\'un argument dépend de la qualité des preuves mobilisées et de la rigueur du raisonnement logique qui les relie à la conclusion. Un bon argumentateur anticipe également les objections possibles et y répond de manière convaincante.',
    examples: [
      'Les données épidémiologiques récentes démontrent que les politiques de vaccination de masse ont réduit la mortalité infantile de 40 % dans les pays en développement.',
      'Plusieurs études longitudinales (Martin, 2018 ; Dubois, 2020) confirment que l\'apprentissage bilingue améliore les fonctions exécutives chez les enfants.',
      'Bien que certains critiques soutiennent que les réseaux sociaux isolent les individus, les recherches de Leclerc (2022) montrent au contraire qu\'ils favorisent les liens sociaux faibles, essentiels à l\'innovation.',
    ],
    languageMarkers: [
      'Il est indéniable que',
      'Les preuves suggèrent que',
      'Comme le souligne X',
      'En revanche, il convient de noter que',
      'Cette affirmation est étayée par',
      'De plus, les données montrent que',
    ],
  },
  {
    id: 'el-cause-effect',
    title: 'Cause et effet',
    category: 'argumentation',
    description:
      'La relation de cause à effet est un mode de raisonnement fondamental en rédaction académique. Elle permet d\'expliquer pourquoi un phénomène se produit et quelles en sont les conséquences. Il est crucial de distinguer la corrélation de la causalité et de ne pas tirer de conclusions hâtives. L\'analyse causale rigoureuse nécessite la prise en compte de facteurs multiples et de variables confondantes potentielles.',
    examples: [
      'La hausse des températures moyennes entraîne une accélération de la fonte des glaciers polaires, ce qui provoque à son tour l\'élévation du niveau des mers.',
      'L\'augmentation du chômage des jeunes est due à un ensemble de facteurs convergents : automatisation croissante, inadéquation des formations et stagnation économique.',
      'Les politiques d\'austérité mises en place après 2010 ont eu pour effet de réduire les dépenses publiques, mais ont également accru les inégalités sociales.',
    ],
    languageMarkers: [
      'En conséquence',
      'Cela s\'explique par',
      'Les données révèlent un lien entre',
      'Cette situation résulte de',
      'Il en découle que',
      'Ce phénomène est attribuable à',
    ],
  },
  {
    id: 'el-cohesion',
    title: 'Cohésion textuelle',
    category: 'cohesion',
    description:
      'La cohésion textuelle désigne l\'ensemble des moyens linguistiques qui assurent la continuité et l\'unité d\'un texte. Elle repose sur l\'utilisation de connecteurs logiques, de reprises pronominales et de marqueurs de progression thématique. Un texte cohérent guide le lecteur de manière fluide d\'une idée à l\'autre sans rupture logique. La maîtrise de la cohésion est ce qui différencie un texte professionnel d\'un texte amateur.',
    examples: [
      'Les résultats de cette étude confirment les hypothèses initiales. En outre, ils suggèrent de nouvelles pistes de recherche.',
      'Bien que cette approche présente des avantages indéniables, elle n\'est cependant pas exempte de limites.',
      'La première section a examiné les causes du phénomène. La section suivante s\'intéressera à ses conséquences.',
    ],
    languageMarkers: [
      'En outre',
      'Par conséquent',
      'Il convient de souligner que',
      'Dans cette perspective',
      'S\'agissant de',
      'Au regard de ces éléments',
    ],
  },
  {
    id: 'el-comparison',
    title: 'Comparaison et contraste',
    category: 'argumentation',
    description:
      'La comparaison et le contraste permettent de mettre en relation deux ou plusieurs éléments afin de souligner leurs similitudes et leurs différences. Cette technique est particulièrement utile dans les revues de littérature et les analyses comparatives. Elle nécessite une sélection rigoureuse des critères de comparaison pour être pertinente et équitable. Les comparaisons bien conduites révèlent des nuances que l\'examen isolé de chaque élément ne permet pas de percevoir.',
    examples: [
      'Contrairement au modèle behavioriste qui considère l\'apprenant comme un récepteur passif, le constructivisme le définit comme un acteur actif de ses apprentissages.',
      'Tout comme Durkheim insistait sur la cohésion sociale, Bourdieu met en avant les mécanismes de reproduction des inégalités.',
      'Les deux méthodes présentent des similitudes dans leur approche qualitative, mais divergent quant au traitement des données.',
    ],
    languageMarkers: [
      'En revanche',
      'De même que',
      'À l\'instar de',
      'Contrairement à',
      'Parallèlement',
      'Tandis que',
    ],
  },
  {
    id: 'el-definition',
    title: 'Définition',
    category: 'structure',
    description:
      'La définition est un élément essentiel de la rédaction académique qui permet d\'établir le sens précis des termes clés utilisés dans un travail. Elle évite les malentendus et situe le cadre conceptuel de la recherche. Une bonne définition académique va au-delà du dictionnaire : elle contextualise le terme dans le champ disciplinaire et parfois propose une définition opérationnelle adaptée à l\'étude. Définir les concepts clés dès l\'introduction donne au lecteur les repères nécessaires pour suivre l\'argumentation.',
    examples: [
      'On entend par « capital social » l\'ensemble des ressources actualisables que possède un individu ou un groupe en vertu de son appartenance à un réseau durable de relations.',
      'Dans le cadre de cette étude, la « résilience urbaine » désigne la capacité d\'une ville à absorber, s\'adapter et se remettre d\'un choc ou d\'un stress urbain.',
      'Le terme « littératie numérique » fait référence ici à l\'aptitude à utiliser, comprendre et créer des informations à l\'aide des technologies numériques.',
    ],
    languageMarkers: [
      'On entend par',
      'Dans le cadre de cette étude',
      'Le terme X désigne',
      'Par Y, il faut comprendre',
      'Selon la définition proposée par',
      'Il convient de distinguer X de Y',
    ],
  },
  {
    id: 'el-examples',
    title: 'Illustration par des exemples',
    category: 'argumentation',
    description:
      'L\'illustration par des exemples concrets est un procédé fondamental qui donne du poids et de la crédibilité à l\'argumentation. Un exemple bien choisi rend une idée abstraite tangible et accessible au lecteur. Les exemples peuvent provenir de la recherche empirique, de cas historiques, de données statistiques ou de situations observées. Il est important de sélectionner des exemples représentatifs et pertinents, et de les intégrer de manière fluide dans le texte.',
    examples: [
      'Ce phénomène est particulièrement visible dans le secteur de l\'éducation, où l\'utilisation des plateformes en ligne a augmenté de 300 % entre 2019 et 2022.',
      'À titre d\'illustration, l\'expérience menée par Moreau et coll. (2021) a démontré que les participants exposés à un environnement bilingue dès la petite enfance présentaient une meilleure flexibilité cognitive.',
      'Le cas de la transition énergétique allemande (Energiewende) offre un exemple pertinent des défis liés à la sortie progressive des énergies fossiles.',
    ],
    languageMarkers: [
      'À titre d\'illustration',
      'Par exemple',
      'Un cas emblematic est celui de',
      'Pour illustrer ce propos',
      'Comme en témoigne',
      'Il suffit de mentionner',
    ],
  },
  {
    id: 'el-generalisation',
    title: 'Généralisation et nuance',
    category: 'argumentation',
    description:
      'La généralisation permet d\'étendre une conclusion tirée d\'observations spécifiques à un ensemble plus large. En rédaction académique, toute généralisation doit être formulée avec prudence et accompagnée de nuances appropriées. Il est essentiel d\'indiquer le degré de certitude et les limites de la généralisation. Les marqueurs de modalité (probablement, semble, tend à) permettent d\'exprimer ces nuances avec précision.',
    examples: [
      'Les résultats de cette méta-analyse suggèrent que, dans l\'ensemble, les approches pédagogiques actives tendent à améliorer les résultats d\'apprentissage par rapport aux méthodes traditionnelles.',
      'Il semble probable que les changements climatiques aient un impact significatif sur la biodiversité, bien que les mécanismes exacts restent partiellement incompris.',
      'Dans une large mesure, les politiques de décentralisation ont permis d\'améliorer la gouvernance locale, quoique les résultats varient considérablement d\'une région à l\'autre.',
    ],
    languageMarkers: [
      'Dans l\'ensemble',
      'Il semble que',
      'Tend à',
      'Dans une large mesure',
      'Il est probable que',
      'En règle générale',
    ],
  },
  {
    id: 'el-passive',
    title: 'Voix passive et impersonnalité',
    category: 'style',
    description:
      'La voix passive est largement utilisée en rédaction académique car elle permet de mettre l\'accent sur l\'action ou le résultat plutôt que sur l\'agent. Elle contribue à l\'impersonnalité exigée par le style académique, où l\'objectivité prime sur la subjectivité de l\'auteur. Cependant, un usage excessif de la voix passive peut alourdir le texte et le rendre moins lisible. Il convient de trouver un équilibre entre voix active et passive selon le contexte et l\'effet souhaité.',
    examples: [
      'Les données ont été collectées auprès de 500 participants répartis dans trois régions distinctes.',
      'Une analyse thématique a été conduite selon la méthode préconisée par Braun et Clarke (2006).',
      'Il a été démontré que la motivation intrinsèque constitue un facteur déterminant de la persévérance scolaire.',
    ],
    languageMarkers: [
      'Il a été démontré que',
      'Les résultats ont été obtenus',
      'Il convient de noter que',
      'Il est généralement admis que',
      'Une attention particulière a été portée à',
      'Les données ont été analysées',
    ],
  },
  {
    id: 'el-problem-solution',
    title: 'Problème et solution',
    category: 'structure',
    description:
      'La structure problème-solution est un schéma argumentatif particulièrement efficace en rédaction académique. Elle consiste à identifier clairement un problème, à en analyser les causes et les enjeux, puis à proposer et évaluer des solutions possibles. Ce schéma est adapté à de nombreux types de textes : mémoires, rapports, articles de recherche appliquée. La force de cette approche réside dans sa logique convaincante et son orientation vers l\'action.',
    examples: [
      'Le principal défi auquel fait face le système de santé réside dans la pénurie de personnels soignants. Pour remédier à cette situation, plusieurs mesures ont été proposées, dont la revalorisation salariale et l\'aménagement des conditions de travail.',
      'La question de la gestion des déchets électroniques constitue un enjeu environnemental majeur. Parmi les solutions envisagées, l\'économie circulaire et la responsabilité élargie du producteur semblent les plus prometteuses.',
      'Face à la désaffection des filières scientifiques, les universités ont mis en place des programmes d\'orientation précoce et des partenariats avec les établissements secondaires.',
    ],
    languageMarkers: [
      'Le problème réside dans',
      'Pour remédier à cette situation',
      'Face à ce défi',
      'Parmi les solutions envisagées',
      'Une approche possible consisterait à',
      'Il est impératif de trouver des réponses à',
    ],
  },
  {
    id: 'el-punctuation',
    title: 'Ponctuation académique',
    category: 'style',
    description:
      'La ponctuation académique suit des règles précises qui contribuent à la clarté et à la rigueur du texte. Chaque signe de ponctuation a une fonction spécifique : le point-virgule sépare des propositions liées, les deux-points introduisent une explication, les tirets encadrent des exemples. Une mauvaise ponctuation peut altérer le sens du texte et nuire à sa compréhension. La maîtrise de la ponctuation est donc indissociable de la maîtrise de la rédaction académique.',
    examples: [
      'Les résultats confirment l\'hypothèse principale : les étudiants qui suivent un tutorat personnalisé obtiennent de meilleurs résultats.',
      'Plusieurs facteurs expliquent cette tendance ; toutefois, le rôle déterminant revient à la politique gouvernementale.',
      'L\'échantillon — composé de 200 participants — a été sélectionné selon la méthode d\'échantillonnage stratifié.',
    ],
    languageMarkers: [
      'Le point-virgule (;) sépare des propositions indépendantes mais liées',
      'Les deux-points (:) introduisent une explication, une énumération ou une citation',
      'Les tirets (—) isolent une parenthèse ou un exemple dans la phrase',
      'La virgule (,) délimite les incises et les éléments d\'une énumération',
      'Le point d\'interrogation (?) marque une question rhétorique',
      'Les points de suspension (...) indiquent une omission dans une citation',
    ],
  },
  {
    id: 'el-style',
    title: 'Style académique',
    category: 'style',
    description:
      'Le style académique se caractérise par sa clarté, sa précision et son objectivité. Il évite le langage familier, les expressions idiomatiques et les formulations vagues ou excessivement émotionnelles. Le style académique privilégie les phrases bien construites, le vocabulaire technique approprié et une syntaxe complexe mais limpide. L\'objectif est de communiquer des idées complexes de manière accessible sans sacrifier la rigueur scientifique.',
    examples: [
      'Au lieu de « beaucoup de gens pensent que », écrire : « un nombre significatif de chercheurs soutiennent que ».',
      'Au lieu de « cette chose montre bien que », écrire : « ces résultats mettent en évidence le fait que ».',
      'Au lieu de « c\'est super important », écrire : « cette question revêt une importance capitale pour la compréhension du phénomène ».',
    ],
    languageMarkers: [
      'Il convient de',
      'Il importe de souligner',
      'Dans cette optique',
      'S\'il est vrai que',
      'Il n\'en demeure pas moins que',
      'Force est de constater que',
    ],
  },
  {
    id: 'el-visual',
    title: 'Éléments visuels',
    category: 'structure',
    description:
      'Les éléments visuels — tableaux, graphiques, diagrammes, figures — jouent un rôle essentiel dans la communication académique. Ils permettent de présenter des données complexes de manière synthétique et immédiatement compréhensible. Chaque élément visuel doit être numéroté, titré et accompagné d\'une légende explicative. Il doit également être référencé dans le corps du texte et commenté, jamais inséré sans explication. Un bon élément visuel complète le texte sans le dupliquer.',
    examples: [
      'Le tableau 1 présente l\'évolution des indicateurs de performance entre 2018 et 2023, mettant en évidence une tendance à la hausse de 15 %.',
      'La figure 2 illustre la répartition géographique des répondants, répartis en quatre zones principales.',
      'Comme le montre le graphique 3, la corrélation entre les deux variables est positive et statistiquement significative (r = 0,78, p < 0,01).',
    ],
    languageMarkers: [
      'Le tableau X présente',
      'La figure Y illustre',
      'Comme le montre le graphique Z',
      'Il ressort du tableau ci-dessus que',
      'Ce diagramme met en évidence',
      'Les données du tableau X révèlent que',
    ],
  },
];

export const academicVocabulary: VocabularyItem[] = [
  // --- NOMS (15) ---
  {
    id: 'vocab-n1',
    category: 'nom',
    word: 'hypothèse',
    definition: 'Supposition fondée sur des observations préliminaires, destinée à être vérifiée par la recherche.',
    example: 'L\'hypothèse principale de cette étude postule que la formation continue améliore la performance des enseignants.',
    synonyms: ['conjecture', 'supposition', 'postulat'],
  },
  {
    id: 'vocab-n2',
    category: 'nom',
    word: 'problématique',
    definition: 'Question centrale autour de laquelle s\'articule l\'ensemble de la recherche ou de la réflexion.',
    example: 'La problématique de cette thèse porte sur les déterminants de l\'adoption des technologies éducatives en milieu rural.',
    synonyms: ['question de recherche', 'enjeu', 'question centrale'],
  },
  {
    id: 'vocab-n3',
    category: 'nom',
    word: 'cadre théorique',
    definition: 'Ensemble de concepts, de théories et de modèles qui servent de fondement conceptuel à la recherche.',
    example: 'Le cadre théorique de cette étude s\'appuie sur la théorie sociocognitive de Bandura et les travaux de Vygotski.',
    synonyms: ['fondement théorique', 'socle conceptuel', 'référentiel théorique'],
  },
  {
    id: 'vocab-n4',
    category: 'nom',
    word: 'méthodologie',
    definition: 'Ensemble des méthodes et des techniques employées pour mener à bien une recherche.',
    example: 'La méthodologie adoptée combine une approche qualitative (entretiens semi-directifs) et une approche quantitative (questionnaire en ligne).',
    synonyms: ['démarche méthodologique', 'approche', 'protocole de recherche'],
  },
  {
    id: 'vocab-n5',
    category: 'nom',
    word: 'échantillon',
    definition: 'Sous-ensemble d\'une population sélectionné pour être étudié et représentatif de l\'ensemble.',
    example: 'L\'échantillon est composé de 350 étudiants inscrits en master dans trois universités francophones.',
    synonyms: ['cohorte', 'groupe étudié', 'panel'],
  },
  {
    id: 'vocab-n6',
    category: 'nom',
    word: 'variable',
    definition: 'Élément mesurable ou observable qui peut prendre différentes valeurs et dont on étudie l\'effet.',
    example: 'La variable indépendante est le type de pédagogie utilisée, tandis que la variable dépendante est le score obtenu à l\'évaluation.',
    synonyms: ['facteur', 'paramètre', 'indicateur'],
  },
  {
    id: 'vocab-n7',
    category: 'nom',
    word: 'corrélation',
    definition: 'Mesure statistique de la relation entre deux variables, indiquant si elles varient conjointement.',
    example: 'L\'analyse révèle une corrélation positive forte (r = 0,85) entre la motivation intrinsèque et la persévérance scolaire.',
    synonyms: ['association', 'lien', 'relation statistique'],
  },
  {
    id: 'vocab-n8',
    category: 'nom',
    word: 'synthèse',
    definition: 'Mise en perspective globale de plusieurs sources ou résultats, mettant en évidence les convergences et les divergences.',
    example: 'La synthèse de la littérature existante fait ressortir trois grands courants théoriques sur la question.',
    synonyms: ['récapitulation', 'vue d\'ensemble', 'compilation'],
  },
  {
    id: 'vocab-n9',
    category: 'nom',
    word: 'paradigme',
    definition: 'Modèle de pensée ou cadre épistémologique qui structure la manière d\'envisager un domaine de recherche.',
    example: 'Le paradigme constructiviste s\'oppose au paradigme behavioriste dans sa conception de l\'apprentissage.',
    synonyms: ['modèle théorique', 'cadre épistémologique', 'approche conceptuelle'],
  },
  {
    id: 'vocab-n10',
    category: 'nom',
    word: 'limite',
    definition: 'Contrainte ou faiblesse inhérente à l\'étude qui restreint la portée ou la généralisabilité des résultats.',
    example: 'Les principales limites de cette étude résident dans la taille réduite de l\'échantillon et le caractère transversal des données.',
    synonyms: ['contrainte', 'restriction', 'faiblesse méthodologique'],
  },
  {
    id: 'vocab-n11',
    category: 'nom',
    word: 'perspective',
    definition: 'Point de vue ou angle d\'analyse adopté pour aborder un sujet de recherche.',
    example: 'Cette recherche adopte une perspective interdisciplinaire combinant la sociologie de l\'éducation et la psychologie cognitive.',
    synonyms: ['angle d\'approche', 'point de vue', 'optique'],
  },
  {
    id: 'vocab-n12',
    category: 'nom',
    word: 'concept',
    definition: 'Idée abstraite et générale qui forme un élément de base de la théorie dans un domaine donné.',
    example: 'Le concept de « communauté de pratique » élaboré par Wenger (1998) offre un cadre pertinent pour analyser les interactions professionnelles.',
    synonyms: ['notion', 'idée théorique', 'construction mentale'],
  },
  {
    id: 'vocab-n13',
    category: 'nom',
    word: 'discours',
    definition: 'Ensemble organisé d\'énoncés produits dans un contexte donné, porteur d\'un sens et d\'une intention communicative.',
    example: 'L\'analyse du discours politique révèle une rhétorique de l\'urgence qui légitime des mesures exceptionnelles.',
    synonyms: ['énoncé', 'texte', 'production langagière'],
  },
  {
    id: 'vocab-n14',
    category: 'nom',
    word: 'enjeu',
    definition: 'Ce qui est en jeu dans une situation, ce qui rend une question importante et digne d\'attention.',
    example: 'Les enjeux de la transition écologique dépassent le cadre strictement environnemental pour embrasser des dimensions sociales et économiques.',
    synonyms: ['importance', 'dimension cruciale', 'stake'],
  },
  {
    id: 'vocab-n15',
    category: 'nom',
    word: 'valide',
    definition: 'Propriété d\'un instrument de mesure ou d\'une étude qui mesure effectivement ce qu\'il prétend mesurer.',
    example: 'La validité de l\'échelle de mesure a été vérifiée par une analyse factorielle confirmatoire.',
    synonyms: ['pertinence', 'exactitude', 'fiabilité'],
  },

  // --- ADJECTIFS (8) ---
  {
    id: 'vocab-adj1',
    category: 'adjectif',
    word: 'pertinent',
    definition: 'Qui est en rapport direct et précis avec le sujet traité, qui apporte une contribution utile.',
    example: 'Les résultats obtenus sont particulièrement pertinents pour comprendre les mécanismes d\'exclusion sociale en milieu urbain.',
    synonyms: ['approprié', 'adéquat', 'relié'],
  },
  {
    id: 'vocab-adj2',
    category: 'adjectif',
    word: 'significatif',
    definition: 'Qui est suffisamment important ou suffisamment grand pour avoir un sens ou une portée réelle.',
    example: 'La différence entre les deux groupes est statistiquement significative (p < 0,05), ce qui confirme notre hypothèse.',
    synonyms: ['important', 'notable', 'considérable'],
  },
  {
    id: 'vocab-adj3',
    category: 'adjectif',
    word: 'empirique',
    definition: 'Fondé sur l\'observation et l\'expérience plutôt que sur la théorie ou la spéculation.',
    example: 'Cette étude empirique s\'appuie sur un terrain de recherche mené auprès de 12 entreprises du secteur technologique.',
    synonyms: ['expérimental', 'basé sur les données', 'observationnel'],
  },
  {
    id: 'vocab-adj4',
    category: 'adjectif',
    word: 'cohérent',
    definition: 'Dont les éléments s\'accordent entre eux de manière logique et harmonieuse.',
    example: 'L\'argumentation développée dans le troisième chapitre est cohérente avec le cadre théorique présenté en introduction.',
    synonyms: ['logique', 'consistant', 'harmonieux'],
  },
  {
    id: 'vocab-adj5',
    category: 'adjectif',
    word: 'exhaustif',
    definition: 'Qui traite un sujet de manière complète, sans omettre aucun aspect important.',
    example: 'Bien que notre revue de littérature vise à être exhaustive, certaines publications récentes ont pu échapper à notre attention.',
    synonyms: ['complet', 'approfondi', 'compréhensif'],
  },
  {
    id: 'vocab-adj6',
    category: 'adjectif',
    word: 'ambigu',
    definition: 'Qui peut être interprété de plusieurs façons, manquant ainsi de clarté ou de précision.',
    example: 'La formulation de cette question reste ambiguë et pourrait prêter à confusion lors de l\'analyse des réponses.',
    synonyms: ['obscure', 'équivoque', 'incertain'],
  },
  {
    id: 'vocab-adj7',
    category: 'adjectif',
    word: 'innovant',
    definition: 'Qui introduit des idées nouvelles, des approches originales ou des méthodes inédites.',
    example: 'La démarche méthodologique proposée est innovante en ce qu\'elle combine l\'analyse de réseau et l\'ethnographie numérique.',
    synonyms: ['novateur', 'original', 'créatif'],
  },
  {
    id: 'vocab-adj8',
    category: 'adjectif',
    word: 'approfondi',
    definition: 'Qui est traité avec une grande profondeur et un niveau de détail élevé.',
    example: 'Une analyse approfondie des données qualitatives a permis de faire émerger trois thèmes principaux.',
    synonyms: ['approfondi', 'détaillé', 'en profondeur'],
  },

  // --- ADVERBES (8) ---
  {
    id: 'vocab-adv1',
    category: 'adverbe',
    word: 'néanmoins',
    definition: 'Malgré cela, toutefois ; exprime une opposition ou une réserve par rapport à ce qui précède.',
    example: 'Les résultats préliminaires sont encourageants ; néanmoins, il convient de rester prudent compte tenu de la taille limitée de l\'échantillon.',
    synonyms: ['cependant', 'toutefois', 'pourtant'],
  },
  {
    id: 'vocab-adv2',
    category: 'adverbe',
    word: 'notamment',
    definition: 'En particulier, surtout ; sert à introduire un exemple saillant parmi d\'autres possibles.',
    example: 'Plusieurs facteurs expliquent cette évolution, notamment la mondialisation des échanges et la digitalisation de l\'économie.',
    synonyms: ['en particulier', 'surtout', 'entre autres'],
  },
  {
    id: 'vocab-adv3',
    category: 'adverbe',
    word: 'substantiellement',
    definition: 'De manière importante, considérable, en quantité ou en degré significatif.',
    example: 'Les performances des étudiants ont augmenté substantiellement après l\'introduction du dispositif de tutorat entre pairs.',
    synonyms: ['considérablement', 'sensiblement', 'de manière significative'],
  },
  {
    id: 'vocab-adv4',
    category: 'adverbe',
    word: 'a priori',
    definition: 'D\'emblée, avant toute analyse ou vérification ; indique un jugement préliminaire.',
    example: 'A priori, aucune corrélation n\'est attendue entre ces deux variables, mais l\'analyse statistique révèlera le cas échéant.',
    synonyms: ['a priori', 'en première approche', 'de prime abord'],
  },
  {
    id: 'vocab-adv5',
    category: 'adverbe',
    word: 'in fine',
    definition: 'En fin de compte, finalement ; exprime la conclusion ou le résultat ultime d\'un processus.',
    example: 'In fine, cette recherche contribuera à enrichir les connaissances sur les pratiques collaboratives en ligne.',
    synonyms: ['finalement', 'en définitive', 'en dernière analyse'],
  },
  {
    id: 'vocab-adv6',
    category: 'adverbe',
    word: 'mutatis mutandis',
    definition: 'En apportant les modifications nécessaires ; utilisé pour indiquer qu\'un raisonnement s\'applique à un autre cas avec les adaptations requises.',
    example: 'Le modèle d\'analyse proposé par Durkheim peut, mutatis mutandis, être appliqué aux sociétés contemporaines.',
    synonyms: ['avec les adaptations nécessaires', 'sauf les adaptations requises', 'par analogie'],
  },
  {
    id: 'vocab-adv7',
    category: 'adverbe',
    word: 'concrètement',
    definition: 'De manière pratique et tangible, par opposition à la théorie ou à l\'abstraction.',
    example: 'Concrètement, cette politique se traduit par la création de 500 postes supplémentaires dans le secteur public.',
    synonyms: ['en pratique', 'matériellement', 'effectivement'],
  },
  {
    id: 'vocab-adv8',
    category: 'adverbe',
    word: 'progressivement',
    definition: 'De manière graduelle, par étapes successives, sans brusquerie.',
    example: 'Les participants ont été familiarisés progressivement avec l\'outil numérique au cours de quatre séances d\'entraînement.',
    synonyms: ['graduellement', 'par étapes', 'de façon incrémentale'],
  },

  // --- VERBES (10) ---
  {
    id: 'vocab-v1',
    category: 'verbe',
    word: 'postuler',
    definition: 'Avancer une hypothèse ou une proposition comme base de raisonnement ou de recherche.',
    example: 'Nous postulons que la qualité de la relation enseignant-élève constitue un facteur déterminant de la réussite scolaire.',
    synonyms: ['avancer', 'supposer', 'émettre l\'hypothèse que'],
  },
  {
    id: 'vocab-v2',
    category: 'verbe',
    word: 'souligner',
    definition: 'Mettre en relief, attirer l\'attention sur un point particulièrement important.',
    example: 'Il convient de souligner que ces résultats ne sont généralisables qu\'au contexte français métropolitain.',
    synonyms: ['mettre en évidence', 'insister sur', 'rappeler'],
  },
  {
    id: 'vocab-v3',
    category: 'verbe',
    word: 'corroborer',
    definition: 'Confirmer ou appuyer une affirmation, un résultat ou une hypothèse par des preuves supplémentaires.',
    example: 'Ces observations corroborent les findings de l\'étude précédente menée par Lambert et coll. (2019).',
    synonyms: ['confirmer', 'valider', 'étayer'],
  },
  {
    id: 'vocab-v4',
    category: 'verbe',
    word: 'nuancer',
    definition: 'Atténuer, préciser ou relativiser une affirmation pour en restituer la complexité.',
    example: 'Il importe de nuancer cette conclusion en rappelant que les conditions expérimentales diffèrent sensiblement d\'une étude à l\'autre.',
    synonyms: ['relativiser', 'préciser', 'modérer'],
  },
  {
    id: 'vocab-v5',
    category: 'verbe',
    word: 'examiner',
    definition: 'Étudier attentivement un sujet, un objet ou un problème pour en comprendre les dimensions.',
    example: 'Cette section examine les implications méthodologiques de l\'utilisation des big data en sciences sociales.',
    synonyms: ['analyser', 'étudier', 'explorer'],
  },
  {
    id: 'vocab-v6',
    category: 'verbe',
    word: 'recenser',
    definition: 'Faire l\'inventaire systématique des travaux, publications ou données existants sur un sujet.',
    example: 'Nous avons recensé 47 articles publiés entre 2015 et 2023 traitant de cette question spécifique.',
    synonyms: ['inventorier', 'répertorier', 'dénombrer'],
  },
  {
    id: 'vocab-v7',
    category: 'verbe',
    word: 'concevoir',
    definition: 'Élaborer mentalement ou formellement un plan, un dispositif ou un cadre conceptuel.',
    example: 'Le protocole expérimental a été conçu pour minimiser les biais de sélection et de confusion.',
    synonyms: ['élaborer', 'concevoir', 'formuler'],
  },
  {
    id: 'vocab-v8',
    category: 'verbe',
    word: 'mettre en évidence',
    definition: 'Faire apparaître clairement un fait, un résultat ou une relation par l\'analyse.',
    example: 'L\'analyse de régression met en évidence un effet significatif de la variable indépendante sur la variable dépendante.',
    synonyms: ['révéler', 'faire ressortir', 'montrer clairement'],
  },
  {
    id: 'vocab-v9',
    category: 'verbe',
    word: 'interroger',
    definition: 'Poser des questions systématiques dans le cadre d\'une recherche ou d\'une réflexion critique.',
    example: 'Cette recherche interroge les conditions dans lesquelles les politiques publiques parviennent à réduire les inégalités.',
    synonyms: ['questionner', 'examiner de manière critique', 's\'interroger sur'],
  },
  {
    id: 'vocab-v10',
    category: 'verbe',
    word: 'évaluer',
    definition: 'Déterminer la valeur, l\'importance ou la qualité de quelque chose par une analyse rigoureuse.',
    example: 'Il est nécessaire d\'évaluer l\'efficacité du programme à l\'aide d\'indicateurs quantitatifs et qualitatifs.',
    synonyms: ['apprécier', 'mesurer', 'juger'],
  },

  // --- CONJONCTIONS (8) ---
  {
    id: 'vocab-c1',
    category: 'conjonction',
    word: 'bien que',
    definition: 'Concession : introduit un fait qui s\'oppose à l\'idée principale mais ne l\'annule pas.',
    example: 'Bien que les résultats soient statistiquement significatifs, il convient de considérer les limites méthodologiques de l\'étude.',
    synonyms: ['même si', 'quoique', 'malgré le fait que'],
  },
  {
    id: 'vocab-c2',
    category: 'conjonction',
    word: 'dans la mesure où',
    definition: 'Exprime une condition ou une limitation, indiquant dans quelle mesure une affirmation est valable.',
    example: 'Cette conclusion est valable dans la mesure où les données recueillies reflètent fidèlement la réalité du terrain.',
    synonyms: ['dans la mesure où', 'pour autant que', 'étant donné que'],
  },
  {
    id: 'vocab-c3',
    category: 'conjonction',
    word: 'tandis que',
    definition: 'Opposition ou simultanéité : établit un contraste entre deux situations ou deux idées.',
    example: 'Tandis que le modèle classique privilégie l\'enseignement magistral, l\'approche inversée met l\'étudiant au centre du processus d\'apprentissage.',
    synonyms: ['alors que', 'alors que', 'pendant que'],
  },
  {
    id: 'vocab-c4',
    category: 'conjonction',
    word: 'd\'autant plus que',
    definition: 'Ajoute un argument supplémentaire qui renforce ce qui vient d\'être dit.',
    example: 'Cette réforme est nécessaire, d\'autant plus que les données comparatives internationales placent la France en retrait sur cet indicateur.',
    synonyms: ['surtout que', 'd\'autant plus que', 'compte tenu du fait que'],
  },
  {
    id: 'vocab-c5',
    category: 'conjonction',
    word: 'en effet',
    definition: 'Confirmation ou justification : introduit un argument qui vient appuyer l\'affirmation précédente.',
    example: 'La formation continue est un facteur clé de l\'employabilité. En effet, les données de l\'OCDE montrent que les travailleurs formés régulièrement s\'adaptent mieux aux mutations du marché.',
    synonyms: ['car', 'parce que', 'effectivement'],
  },
  {
    id: 'vocab-c6',
    category: 'conjonction',
    word: 'par conséquent',
    definition: 'Conséquence : introduit un effet logique découlant de ce qui précède.',
    example: 'Les conditions expérimentales n\'ont pas été contrôlées de manière rigoureuse ; par conséquent, les résultats doivent être interprétés avec prudence.',
    synonyms: ['par conséquent', 'donc', 'de ce fait'],
  },
  {
    id: 'vocab-c7',
    category: 'conjonction',
    word: 'néanmoins',
    definition: 'Opposition tempérée : marque une réserve sans invalider totalement l\'affirmation précédente.',
    example: 'L\'effet observé est robuste ; néanmoins, la taille de l\'échantillon limite la portée des conclusions.',
    synonyms: ['cependant', 'toutefois', 'malgré cela'],
  },
  {
    id: 'vocab-c8',
    category: 'conjonction',
    word: 'soit... soit...',
    definition: 'Alternative : présente deux ou plusieurs possibilités exclusives ou complémentaires.',
    example: 'Les répondants ont été sélectionnés soit par échantillonnage aléatoire, soit par échantillonnage volontaire, selon la disponibilité.',
    synonyms: ['ou bien... ou bien...', 'soit... soit...', 'alternativement'],
  },

  // --- ABRÉVIATIONS (6) ---
  {
    id: 'vocab-abr1',
    category: 'abréviation',
    word: 'cf.',
    definition: 'Abréviation latine de « confer », signifiant « se reporter à », « comparer avec ».',
    example: 'Pour une présentation détaillée de cette théorie, cf. Piaget (1972), pp. 45-67.',
    synonyms: ['voir', 'se reporter à', 'consulter'],
  },
  {
    id: 'vocab-abr2',
    category: 'abréviation',
    word: 'i.e.',
    definition: 'Abréviation latine de « id est », signifiant « c\'est-à-dire », utilisée pour préciser ou reformuler.',
    example: 'Les étudiants de cycle doctoral (i.e. les doctorants et les post-doctorants) sont concernés par cette mesure.',
    synonyms: ['c\'est-à-dire', 'en d\'autres termes', 'à savoir'],
  },
  {
    id: 'vocab-abr3',
    category: 'abréviation',
    word: 'e.g.',
    definition: 'Abréviation latine de « exempli gratia », signifiant « par exemple », utilisée pour illustrer.',
    example: 'Plusieurs méthodes d\'échantillonnage peuvent être envisagées (e.g. échantillonnage aléatoire simple, échantillonnage stratifié).',
    synonyms: ['par exemple', 'notamment', 'entre autres'],
  },
  {
    id: 'vocab-abr4',
    category: 'abréviation',
    word: 'et al.',
    definition: 'Abréviation latine de « et alii », signifiant « et autres », utilisée pour citer un travail à plusieurs auteurs.',
    example: 'Selon Martin et al. (2021), les pratiques collaboratives en ligne favorisent l\'apprentissage autorégulé.',
    synonyms: ['et collègues', 'et autres', 'et ses collaborateurs'],
  },
  {
    id: 'vocab-abr5',
    category: 'abréviation',
    word: 'ibid.',
    definition: 'Abréviation latine de « ibidem », signifiant « au même endroit », utilisée pour renvoyer à la source immédiatement précédente.',
    example: 'Bourdieu (1986, p. 248) définit le capital culturel comme... Ibid., p. 252, il précise que...',
    synonyms: ['même source', 'même ouvrage', 'même auteur, même ouvrage'],
  },
  {
    id: 'vocab-abr6',
    category: 'abréviation',
    word: 'op. cit.',
    definition: 'Abréviation latine de « opus citatum », signifiant « ouvrage cité », utilisée pour renvoyer à un ouvrage déjà cité.',
    example: 'Comme le souligne Durkheim (op. cit., p. 67), le fait social possède une réalité propre.',
    synonyms: ['ouvrage déjà cité', 'ouvrage cité précédemment', 'voir supra'],
  },

  // --- PRÉFIXES (5) ---
  {
    id: 'vocab-pref1',
    category: 'préfixe',
    word: 'anti-',
    definition: 'Préfixe exprimant l\'opposition, la prévention ou la destruction de ce qui suit.',
    example: 'Le mouvement anti-spéciste remet en question la hiérarchie entre les espèces et ses implications éthiques.',
    synonyms: ['contra-', 'opposé à', 'contre'],
  },
  {
    id: 'vocab-pref2',
    category: 'préfixe',
    word: 'méta-',
    definition: 'Préfixe indiquant un niveau supérieur d\'analyse, une réflexion sur la réflexion elle-même ou un dépassement.',
    example: 'La méta-analyse de 23 études confirmente l\'efficacité des interventions cognitivo-comportementales dans le traitement de l\'anxiété.',
    synonyms: ['au-delà de', 'réflexion sur', 'supra-'],
  },
  {
    id: 'vocab-pref3',
    category: 'préfixe',
    word: 'inter-',
    definition: 'Préfixe exprimant la relation, l\'interaction ou la réciproque entre plusieurs éléments.',
    example: 'L\'approche interdisciplinaire combine les méthodes et les théories de plusieurs disciplines pour enrichir l\'analyse.',
    synonyms: ['entre', 'réciproque', 'mutuel'],
  },
  {
    id: 'vocab-pref4',
    category: 'préfixe',
    word: 'post-',
    definition: 'Préfixe indiquant ce qui vient après, succède à ou fait suite à un événement ou un concept.',
    example: 'La période post-pandémique a été marquée par une accélération de la transformation numérique des organisations.',
    synonyms: ['après', 'qui succède à', 'qui fait suite à'],
  },
  {
    id: 'vocab-pref5',
    category: 'préfixe',
    word: 'trans-',
    definition: 'Préfixe exprimant le passage d\'un état à un autre, le dépassement ou l\'action à travers.',
    example: 'La transdisciplinarité dépasse le cadre des disciplines individuelles pour créer un nouveau cadre de connaissances intégré.',
    synonyms: ['à travers', 'au-delà', 'par-delà'],
  },
];

export const writingModels: WritingModel[] = [
  {
    id: 'model-essay',
    type: 'essay',
    title: 'Essai académique',
    description:
      'L\'essai académique est un texte argumentatif structuré qui développe une thèse personnelle étayée par des preuves et des sources. Il suit une organisation classique en introduction, développement et conclusion, avec des paragraphes thématiques clairement articulés. L\'essai requiert une argumentation équilibrée qui prend en compte les perspectives opposées. C\'est le format le plus courant dans l\'enseignement supérieur pour évaluer la capacité de réflexion critique des étudiants.',
    structure: [
      'Introduction : accroche, contexte, problématique et annonce du plan',
      'Développement - Partie 1 : premier argument principal avec preuves',
      'Développement - Partie 2 : deuxième argument avec analyse critique des sources',
      'Développement - Partie 3 : prise en compte des objections et réponses',
      'Conclusion : synthèse des arguments, réponse à la problématique et ouverture',
    ],
    keyFeatures: [
      'Thèse clairement énoncée dans l\'introduction',
      'Argumentation étayée par des preuves issues de sources fiables',
      'Paragraphes thématiques avec phrase topic et phrases de soutien',
      'Prise en compte des contre-arguments',
      'Style formel et objectif tout en affirmant une position personnelle',
    ],
  },
  {
    id: 'model-report',
    type: 'report',
    title: 'Rapport de recherche',
    description:
      'Le rapport de recherche présente les résultats d\'une investigation empirique de manière structurée et reproductible. Il suit généralement le format IMRAD (Introduction, Méthodologie, Résultats, Analyse et Discussion). Ce modèle est utilisé dans les sciences expérimentales et les sciences sociales pour communiquer les findings d\'une étude. Le rapport de recherche se distingue de l\'essai par son objectivité et sa rigueur méthodologique.',
    structure: [
      'Page de titre et résumé (abstract)',
      'Introduction : contexte, revue de littérature et questions de recherche',
      'Méthodologie : participants, instruments, procédure et analyse',
      'Résultats : présentation des données avec tableaux et graphiques',
      'Discussion : interprétation, comparaison avec la littérature et limites',
      'Conclusion et recommandations',
      'Références bibliographiques',
      'Annexes : instruments, données brutes, tableaux complémentaires',
    ],
    keyFeatures: [
      'Format IMRAD standardisé et reconnu internationalement',
      'Description détaillée et reproductible de la méthodologie',
      'Présentation objective des résultats sans interprétation prématurée',
      'Discussion qui replace les résultats dans le contexte de la littérature existante',
      'Présentation explicite des limites et des perspectives de recherche',
    ],
  },
  {
    id: 'model-case-study',
    type: 'case_study',
    title: 'Étude de cas',
    description:
      'L\'étude de cas est une méthode de recherche qui examine en profondeur un phénomène dans son contexte réel. Elle est particulièrement adaptée aux situations où les frontières entre le phénomène étudié et son contexte ne sont pas clairement définies. L\'étude de cas combine des données multiples (entretiens, observations, documents) pour construire une analyse riche et nuancée. Elle est largement utilisée en sciences de gestion, en éducation et en sciences politiques.',
    structure: [
      'Introduction : présentation du cas et justification du choix',
      'Contexte : cadre général et historique du cas étudié',
      'Revue de la littérature : cadres théoriques pertinents',
      'Méthodologie : collecte et analyse des données (triangulation)',
      'Présentation des résultats : description détaillée et mise en évidence des patterns',
      'Discussion : interprétation à la lumière des cadres théoriques',
      'Conclusion : implications théoriques et pratiques',
    ],
    keyFeatures: [
      'Description riche et contextualisée d\'un cas spécifique',
      'Triangulation des sources de données pour renforcer la validité',
      'Articulation constante entre données empiriques et cadre théorique',
      'Analyse en profondeur plutôt que généralisation statistique',
      'Implications pratiques clairement formulées pour les professionnels du domaine',
    ],
  },
  {
    id: 'model-literature-review',
    type: 'literature_review',
    title: 'Revue de littérature',
    description:
      'La revue de littérature est un texte académique qui synthétise de manière critique et organisée les publications existantes sur un thème de recherche donné. Elle ne se contente pas de résumer les sources les unes après les autres, mais les organise thématiquement pour faire émerger les convergences, les divergences et les lacunes de la recherche. La revue de littérature justifie la pertinence et l\'originalité de la recherche proposée en situant sa contribution dans le champ existant.',
    structure: [
      'Introduction : délimitation du thème, critères de sélection des sources et plan',
      'Corpus de la revue : organisation thématique ou chronologique des sources',
      'Analyse critique : identification des convergences, divergences et lacunes',
      'Synthèse : mise en perspective globale et identification des questions ouvertes',
      'Conclusion : justification de la recherche proposée et formulation de la problématique',
    ],
    keyFeatures: [
      'Organisation thématique plutôt qu\'auteur par auteur',
      'Analyse critique des sources et non simple compilation de résumés',
      'Identification explicite des lacunes dans la littérature existante',
      'Argumentation justifiant la nécessité de la recherche proposée',
      'Utilisation systématique de verbes de signal pour introduire chaque source',
    ],
  },
  {
    id: 'model-research-proposal',
    type: 'research_proposal',
    title: 'Proposition de recherche',
    description:
      'La proposition de recherche (ou protocole de recherche) présente de manière détaillée un projet de recherche avant sa réalisation. Elle doit convaincre le lecteur (directeur de thèse, comité d\'éthique, organisme de financement) de la pertinence, de la faisabilité et de l\'originalité du projet. Elle inclut une revue de littérature ciblée, les questions de recherche, la méthodologie prévue et le calendrier de réalisation. La proposition de recherche est un exercice de planification académique qui démontre la capacité du chercheur à concevoir une étude rigoureuse.',
    structure: [
      'Titre provisoire et résumé du projet',
      'Introduction et justification : contexte, pertinence et objectifs généraux',
      'Revue de littérature ciblée : état de l\'art et lacunes identifiées',
      'Questions de recherche et hypothèses',
      'Cadre théorique et conceptualisation des variables',
      'Méthodologie : design de recherche, population, instruments et techniques d\'analyse',
      'Considérations éthiques et limites anticipées',
      'Calendrier prévisionnel et budget (si applicable)',
      'Bibliographie préliminaire',
    ],
    keyFeatures: [
      'Argumentation convaincante sur la pertinence et l\'originalité du projet',
      'Description détaillée et réaliste de la méthodologie prévue',
      'Prise en compte explicite des considérations éthiques',
      'Calendrier réaliste avec des étapes clairement définies',
      'Bibliographie préliminaire démontrant une connaissance approfondie du domaine',
    ],
  },
];
