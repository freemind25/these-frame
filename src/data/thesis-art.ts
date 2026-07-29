/**
 * Conseils et données extraits de l'ouvrage classique de Michel Beaud et Magali Gravier.
 *
 * Référence : Beaud, M. & Gravier, M. (2019). L'art de la thèse (7e éd.). La Découverte.
 *
 * Convention : tout le contenu textuel est en français ; les identifiants
 * de code (interfaces, variables, exports) sont en anglais.
 */

// ─── Interfaces ──────────────────────────────────────────────────────

/** Phase principale de la rédaction d'une thèse selon Beaud & Gravier */
export interface ThesisArtPhase {
  id: string
  title: string
  description: string
  keyActions: string[]
  pitfalls: string[]
  duration: string
}

/** Conseil pratique tiré de L'art de la thèse */
export interface ThesisArtTip {
  id: string
  category: string
  tip: string
  explanation: string
  example?: string
}

/** Structure recommandée pour un type de thèse */
export interface ThesisArtStructure {
  id: string
  type: string
  description: string
  parts: {
    title: string
    sections: string[]
  }[]
}

/** Piège fréquent dans la rédaction d'une thèse */
export interface CommonPitfall {
  id: string
  pitfall: string
  consequence: string
  solution: string
  phase: string
}

// ─── Phases de la rédaction ─────────────────────────────────────────

export const thesisArtPhases: ThesisArtPhase[] = [
  {
    id: 'choix-sujet',
    title: 'Le choix du sujet',
    description:
      'Le choix du sujet est l\'étape fondatrice de toute recherche universitaire. Un bon sujet doit se situer à l\'intersection de votre passion intellectuelle, de votre expertise naissante et de la faisabilité du projet. Beaud insiste sur le fait qu\'il ne sert à rien de choisir un sujet ambitieux si les sources sont inaccessibles ou si le cadre temporel ne permet pas un traitement approfondi. Le sujet doit être suffisamment délimité pour pouvoir être traité de manière exhaustive tout en laissant place à une véritable réflexion originale. Il convient également de s\'assurer que le sujet s\'inscrit dans un domaine où un encadrement compétent est disponible au sein de votre institution.',
    keyActions: [
      'Explorer les domaines qui suscitent votre curiosité intellectuelle et votre engagement',
      'Consulter les publications récentes pour identifier les lacunes et les questions non résolues',
      'Délimiter le sujet en termes de période, d\'espace, de population ou de phénomène étudié',
      'Vérifier la disponibilité des sources primaires et secondaires nécessaires',
      'Valider le sujet avec votre directeur de thèse en présentant un argumentaire solide',
      'S\'assurer que le sujet correspond aux attentes institutionnelles et aux délais impartis',
    ],
    pitfalls: [
      'Choisir un sujet trop vaste qui ne pourra pas être traité de manière approfondie',
      'S\'engager sur un sujet par conformisme ou par opportunisme sans véritable motivation',
      'Négliger la vérification préalable de l\'accessibilité des sources documentaires',
      'Ignorer l\'avis du directeur et s\'obstiner sur un sujet non validé par l\'institution',
    ],
    duration: '2-4 mois',
  },
  {
    id: 'problematique',
    title: 'La problématique',
    description:
      'La problématique est le cœur intellectuel de la thèse : c\'est la question centrale autour de laquelle s\'articule toute la démonstration. Beaud souligne que formuler une bonne problématique est souvent plus difficile et plus important que la réponse elle-même. La problématique doit être claire, précise et susceptible d\'engendrer un questionnement fécond. Elle se distingue du simple thème en ce qu\'elle implique une tension, un problème à résoudre ou un paradoxe à éclaircir. Les hypothèses de recherche qui en découlent doivent être formulées de manière testable et cohérente avec le cadre théorique adopté.',
    keyActions: [
      'Formuler une question de recherche principale claire et précise',
      'Définir des sous-questions ou hypothèses de recherche dérivées de la question principale',
      'Situer la problématique dans le débat scientifique existant et identifier les controverses',
      'Articuler clairement les hypothèses avec les concepts théoriques mobilisés',
      'Tester la pertinence de la problématique par une lecture exploratoire ciblée',
    ],
    pitfalls: [
      'Confondre le thème général avec la problématique spécifique',
      'Formuler une question trop vague ou trop évidente qui n\'appelle pas de véritable recherche',
      'Poser une question dont la réponse est déjà connue ou trivialement accessible',
      'Multipliser les questions de recherche au point de perdre la cohérence du projet',
    ],
    duration: '1-3 mois',
  },
  {
    id: 'exploration-documentaire',
    title: 'L\'exploration documentaire',
    description:
      'La constitution d\'une bibliographie solide et la lecture méthodique des sources constituent le socle sur lequel repose toute la démarche scientifique. Beaud recommande une approche systématique de la recherche documentaire, en commençant par les ouvrages de synthèse et les revues de littérature avant de plonger dans les articles spécialisés et les sources primaires. La prise de notes structurée est essentielle : il faut noter les références complètes, les idées principales, les arguments clés et les citations éventuelles dès la première lecture. Un système de classement efficace (par thème, par auteur, par chronologie) permet de retrouver rapidement l\'information lors de la rédaction.',
    keyActions: [
      'Constituer une bibliographie exhaustive en utilisant les catalogues, bases de données et moteurs de recherche académiques',
      'Lire en trois temps : survol rapide pour identifier la pertinence, lecture attentive pour comprendre l\'argumentation, lecture critique pour évaluer la portée',
      'Prendre des notes structurées avec références complètes, résumés et citations exactes',
      'Organiser les notes selon un système de classement cohérent (thématique, chronologique, conceptuel)',
      'Identifier les auteurs centraux et les controverses dans le champ étudié',
    ],
    pitfalls: [
      'Se contenter de sources secondaires sans consulter les sources primaires originales',
      'Prendre des notes désorganisées qui deviennent inexploitables lors de la rédaction',
      'Négliger de noter les références complètes dès la première lecture et perdre ensuite des heures à les retrouver',
      'Lire passivement sans adopter une posture critique face aux arguments des auteurs',
    ],
    duration: '3-6 mois',
  },
  {
    id: 'plan-these',
    title: 'Le plan de la thèse',
    description:
      'Le plan est l\'architecture intellectuelle de la thèse. Beaud distingue nettement le plan thématique, qui organise les contenus par thèmes successifs, du plan problème, qui articule la démonstration autour d\'un questionnement progressif. Dans les sciences humaines et sociales, le plan en trois parties (ou deux en thèse d\'exercice) reste la norme, chaque partie étant subdivisée en chapitres cohérents. L\'articulation entre les parties doit obéir à une logique démonstrative claire : progression du plus général au plus spécifique, ou du constat à l\'analyse puis à la proposition. Un bon plan est souple : il évoluera au fil de la recherche, mais il fournit un cadre indispensable pour maintenir la cohérence de l\'ensemble.',
    keyActions: [
      'Organiser la thèse en grandes parties correspondant aux étapes de la démonstration',
      'Définir les chapitres de chaque partie avec des titres explicites et des contenus précis',
      'Articuler les sections de manière logique et progressive, en évitant les redondances',
      'Établir un plan détaillé avec les principales idées et références pour chaque section',
      'Valider le plan avec le directeur et le faire évoluer en fonction des découvertes de la recherche',
      'Assurer une progression cohérente entre introduction, développement et conclusion',
    ],
    pitfalls: [
      'Élaborer un plan trop rigide qui ne s\'adapte pas aux réalités de la recherche',
      'Tomber dans la simple juxtaposition thématique sans logique démonstrative sous-jacente',
      'Répéter les mêmes arguments dans plusieurs chapitres au lieu de les articuler',
      'Négliger l\'équilibrage entre les parties, certaines étant disproportionnellement longues',
    ],
    duration: '1-2 mois',
  },
  {
    id: 'redaction',
    title: 'La rédaction',
    description:
      'La rédaction est un travail quotidien qui exige régularité et discipline. Beaud insiste sur l\'importance d\'écrire même quand on ne se sent pas inspiré : l\'écriture est elle-même une forme de pensée. Il recommande de commencer par les chapitiers les plus faciles ou les mieux documentés, plutôt que par l\'introduction qui nécessite une vue d\'ensemble. Le style académique doit allier clarté, précision et rigueur : chaque terme doit être employé avec exactitude, chaque affirmation doit être étayée par une preuve ou une référence. Les citations doivent être soigneusement intégrées au texte et correctement référencées. La gestion des citations et des notes de bas de page doit être impeccable dès le départ pour éviter un travail de mise en forme fastidieux à la fin.',
    keyActions: [
      'Écrire régulièrement, en fixant un rythme quotidien ou hebdomadaire réaliste et tenable',
      'Commencer par les sections les mieux maîtrisées pour prendre confiance et de la vitesse',
      'Rédiger dans un style académique clair, précis et rigoureux, en évitant le jargon superflu',
      'Intégrer les citations et les références au fil de la rédaction, et non a posteriori',
      'Utiliser des transitions explicites entre les paragraphes, sections et chapitres',
      'Respecter les conventions de présentation de l\'institution (marges, police, notes, bibliographie)',
    ],
    pitfalls: [
      'Remettre la rédaction à plus tard en attendant d\'avoir « tout compris »',
      'Viser la perfection dès le premier jet, ce qui bloque l\'écriture et ralentit la production',
      'Copier-coller des passages sans les reformuler, risquant ainsi le plagiat involontaire',
      'Négliger les transitions entre sections, rendant la lecture hachée et la démonstration incohérente',
    ],
    duration: '6-18 mois',
  },
  {
    id: 'revision',
    title: 'La révision',
    description:
      'La révision est une phase essentielle et souvent sous-estimée de la rédaction académique. Beaud rappelle qu\'un texte n\'est jamais parfait du premier coup et que la qualité finale résulte d\'itérations successives. La révision doit se faire à plusieurs niveaux : d\'abord la structure globale (logique du plan, équilibre entre les parties), puis l\'argumentation (cohérence des démonstrations, pertinence des preuves), enfin le style (clarté des phrases, correction de la syntaxe et de l\'orthographe). Le retour du directeur et des pairs est précieux : il faut accepter la critique constructive comme un levier d\'amélioration, et non comme une remise en question personnelle. Beaud recommande de laisser reposer le manuscrit quelques jours entre deux relectures pour retrouver un regard frais.',
    keyActions: [
      'Relire le manuscrit en premier lieu pour en vérifier la structure globale et la progression logique',
      'Vérifier la cohérence de l\'argumentation et la pertinence des preuves avancées',
      'Corriger le style : clarté des phrases, précision du vocabulaire, correction syntaxique et orthographique',
      'Faire relire le texte par le directeur et par des pairs pour obtenir un retour critique objectif',
      'Laisser reposer le texte quelques jours entre deux sessions de révision pour retrouver un regard neuf',
      'Vérifier scrupuleusement la conformité des références bibliographiques et des notes de bas de page',
    ],
    pitfalls: [
      'Considérer la révision comme une simple correction orthographique et négliger la structure',
      'Refuser les critiques du directeur ou des pairs par attachement au texte produit',
      'Procrastiner la révision jusqu\'au dernier moment et se retrouver avec un travail bâclé',
      'Modifier constamment le texte sans jamais considérer une version comme suffisamment aboutie',
    ],
    duration: '2-4 mois',
  },
  {
    id: 'soutenance',
    title: 'La soutenance',
    description:
      'La soutenance est le moment culminant de la thèse, celui où vous présentez et défendez publiquement votre travail devant un jury composé d\'experts. Beaud souligne que la préparation de la soutenance est un travail à part entière qui nécessite une attention spécifique. La présentation orale doit être claire, structurée et concise : elle ne résume pas la thèse page par page, mais met en évidence la problématique, la méthodologie, les résultats principaux et l\'apport original de la recherche. Il est crucial d\'anticiper les questions probables du jury et de préparer des réponses argumentées. La gestion du stress passe par une préparation minutieuse, des répétitions à voix haute et une connaissance approfondie de chaque aspect de la thèse, y compris ses limites.',
    keyActions: [
      'Préparer une présentation orale structurée mettant en valeur la problématique, la méthode, les résultats et l\'originalité',
      'Anticiper les questions probables du jury en vous mettant à leur place de manière critique',
      'Répéter la présentation à voix haute plusieurs fois, idéalement devant un public test',
      'Préparer des supports visuels clairs (diapositives) qui complètent sans surcharger le discours',
      'Connaître chaque aspect de la thèse, y compris ses limites et les pistes de recherche future',
      'Gérer le stress par une préparation rigoureuse et une attitude sincère et humble face au jury',
    ],
    pitfalls: [
      'Se contenter de lire le texte de la thèse sans adapter le discours à l\'oral et au temps imparti',
      'Méconnaître les limites de sa propre recherche et se laisser déstabiliser par les questions du jury',
      'Négliger la préparation de la présentation orale en se concentrant uniquement sur le manuscrit écrit',
      'Adopter une attitude défensive ou arrogante face aux critiques du jury au lieu de les considérer constructivement',
    ],
    duration: '1-2 mois',
  },
]

// ─── Conseils pratiques ─────────────────────────────────────────────

export const thesisArtTips: ThesisArtTip[] = [
  // ── Sujet ──
  {
    id: 'tip-sujet-passion',
    category: 'sujet',
    tip: 'Un bon sujet est un sujet qui vous passionne et qui est faisable',
    explanation:
      'Beaud rappelle que la motivation personnelle est le moteur essentiel d\'un travail de recherche qui s\'étend sur plusieurs années. Sans passion, l\'énergie viendra à manquer face aux difficultés inévitables. Toutefois, cette passion doit être tempérée par une évaluation réaliste de la faisabilité : disponibilité des sources, compétences requises, temps disponible.',
    example:
      'Si vous êtes passionné par l\'histoire des migrations mais que les archives sont inaccessibles, il vaut mieux décaler le sujet vers une période ou une région mieux documentée plutôt que de vous engager dans un projet sans issue.',
  },
  {
    id: 'tip-sujet-delimitation',
    category: 'sujet',
    tip: 'Délimitez votre sujet en croisant deux ou trois critères',
    explanation:
      'Un sujet bien délimité est un sujet traitable. Beaud recommande de croiser des critères de délimitation : temporalité, espace, population, discipline. Plus le croisement est précis, plus le sujet devient original et gérable.',
    example:
      'Au lieu de « Les politiques migratoires en Europe » (trop vaste), optez pour « L\'impact de la directive européenne de 2003 sur les politiques d\'asile en France et en Allemagne entre 2003 et 2015 ».',
  },
  {
    id: 'tip-sujet-originalite',
    category: 'sujet',
    tip: 'L\'originalité ne signifie pas nécessairement l\'inédit absolu',
    explanation:
      'Beaud rassure les jeunes chercheurs : une thèse n\'a pas besoin de révolutionner son champ pour être originale. L\'originalité peut résider dans un angle d\'approche nouveau, une comparaison inédite, l\'application d\'une méthode à un objet nouveau, ou la confrontation de sources jusqu\'alors séparées.',
  },
  // ── Problématique ──
  {
    id: 'tip-prob-question',
    category: 'problematique',
    tip: 'Formulez votre problématique sous forme d\'une question unique et claire',
    explanation:
      'La force d\'une thèse réside dans la clarté de sa question de recherche. Beaud insiste sur le fait que si vous ne pouvez pas formuler votre problématique en une seule phrase compréhensible, c\'est qu\'elle n\'est pas encore suffisamment mûrie. Cette question doit guider chaque chapitre de la thèse.',
    example:
      '« Dans quelle mesure la décentralisation fiscale en France a-t-elle modifié les inégalités territoriales entre 1982 et 2015 ? » est une problématique claire. « Les inégalités territoriales en France » n\'est qu\'un thème.',
  },
  {
    id: 'tip-prob-hypotheses',
    category: 'problematique',
    tip: 'Formulez des hypothèses testables et cohérentes avec votre cadre théorique',
    explanation:
      'Les hypothèses sont des réponses anticipées à votre question de recherche. Elles doivent être formulées de manière précise et pouvoir être confirmées ou infirmées par les données que vous collecterez. Beaud rappelle qu\'une hypothèse réfutée apporte autant à la connaissance qu\'une hypothèse confirmée.',
  },
  {
    id: 'tip-prob-debat',
    category: 'problematique',
    tip: 'Situez votre problématique dans un débat scientifique existant',
    explanation:
      'Une bonne problématique ne tombe pas du ciel : elle s\'ancre dans un champ de recherche et un débat existant. Beaud conseille de bien identifier les positions des différents auteurs et de situer votre propre questionnement par rapport à ces débats. Cela donne immédiatement de la profondeur et de la légitimité à votre recherche.',
  },
  // ── Bibliographie ──
  {
    id: 'tip-bib-systematique',
    category: 'bibliographie',
    tip: 'Constituez votre bibliographie de manière systématique et organisée dès le départ',
    explanation:
      'La bibliographie n\'est pas un exercice final de mise en forme : c\'un outil de travail permanent. Beaud recommande d\'adopter un logiciel de gestion bibliographique (Zotero, Mendeley, EndNote) dès le premier jour et de consigner systématiquement chaque référence consultée avec tous les métadonnées nécessaires.',
  },
  {
    id: 'tip-bib-lecture-trois-passes',
    category: 'bibliographie',
    tip: 'Lisez en trois passes : survol, lecture attentive, lecture critique',
    explanation:
      'Beaud propose une méthode de lecture en trois temps pour optimiser l\'efficacité. La première passe est un survol rapide (titre, résumé, introduction, conclusion) pour évaluer la pertinence. La seconde est une lecture attentive pour comprendre l\'argumentation complète. La troisième est une lecture critique où l\'on évalue les forces, les faiblesses et la place de l\'ouvrage dans le débat scientifique.',
    example:
      'Première passe (15 min) : lire le titre, l\'abstract, l\'introduction et la conclusion d\'un article. Deuxième passe (1 h) : lire l\'intégralité en notant les arguments clés. Troisième passe : analyser la méthodologie et évaluer la portée des résultats.',
  },
  {
    id: 'tip-bib-sources-primaires',
    category: 'bibliographie',
    tip: 'Ne vous contentez pas de sources secondaires : consultez les sources primaires',
    explanation:
      'Beaud met en garde contre la tentation de s\'en tenir aux synthèses et manuels. Une véritable recherche exige de consulter les sources primaires (archives, données originales, textes fondateurs) et de ne pas dépendre uniquement de l\'interprétation qu\'en font d\'autres auteurs.',
  },
  // ── Plan ──
  {
    id: 'tip-plan-thematique-vs-probleme',
    category: 'plan',
    tip: 'Préférez le plan problème au plan thématique quand c\'est possible',
    explanation:
      'Le plan thématique juxtapose des thèmes successifs sans logique démonstrative forte. Le plan problème, au contraire, organise la démonstration autour d\'un questionnement progressif qui donne une dynamique à la lecture. Beaud recommande ce dernier car il produit une thèse plus cohérente et plus convaincante.',
    example:
      'Plan thématique : I. Les causes du phénomène / II. Les manifestations du phénomène / III. Les conséquences du phénomène. Plan problème : I. Le phénomène existe-t-il réellement ? / II. Quelles en sont les causes profondes ? / III. Comment y remédier ?',
  },
  {
    id: 'tip-plan-equilibre',
    category: 'plan',
    tip: 'Veillez à l\'équilibre entre les parties et les chapitres',
    explanation:
      'Un plan déséquilibré donne l\'impression d\'un travail inachevé ou d\'une réflexion partielle. Beaud recommande de s\'assurer que chaque partie et chaque chapitre contribue de manière significative à la démonstration globale et qu\'aucune section ne soit disproportionnellement longue ou courte par rapport aux autres.',
  },
  {
    id: 'tip-plan-flexibilite',
    category: 'plan',
    tip: 'Le plan est un guide, pas une cage : faites-le évoluer',
    explanation:
      'Beaud rappelle que le plan initial est un outil de travail qui doit s\'adapter aux réalités de la recherche. Si vos découvertes remettent en question l\'organisation initiale, il faut modifier le plan. L\'important est de toujours conserver une logique d\'ensemble et d\'informer le directeur des modifications significatives.',
  },
  // ── Rédaction ──
  {
    id: 'tip-redac-regularite',
    category: 'redaction',
    tip: 'Écrivez tous les jours, même quelques lignes, même imparfaitement',
    explanation:
      'C\'est sans doute le conseil le plus répété par Beaud : la régularité de l\'écriture est plus importante que la quantité produite en une session. Écrire chaque jour, même pour trente minutes, crée une habitude, maintient le fil de la pensée et évite l\'angoisse de la page blanche. Le premier jet n\'a pas besoin d\'être parfait : il sert de matière première pour la révision.',
  },
  {
    id: 'tip-redac-introduction-entonnoir',
    category: 'redaction',
    tip: 'Utilisez la méthode de l\'entonnoir pour rédiger vos introductions',
    explanation:
      'Beaud recommande de structurer chaque introduction selon un mouvement allant du plus général au plus spécifique : partir du contexte large, restreindre progressivement au thème, puis à la problématique, et annoncer clairement le plan. Ce mouvement en entonnoir donne au lecteur les repères nécessaires pour comprendre la suite.',
    example:
      'Amorce générale sur le contexte → Présentation du thème → Formulation de la problématique → Annonce du plan détaillé.',
  },
  {
    id: 'tip-redac-transitions',
    category: 'redaction',
    tip: 'Soignez les transitions entre chapitres et entre sections',
    explanation:
      'Les transitions assurent la continuité logique de la démonstration. Beaud insiste sur le fait qu\'un chapitre ne doit jamais commencer abruptement ni se terminer sans préparer le suivant. Chaque conclusion partielle doit ouvrir sur la section suivante, créant ainsi un effet de chaîne qui maintient l\'attention du lecteur et renforce la cohérence de l\'ensemble.',
  },
  {
    id: 'tip-redac-citations',
    category: 'redaction',
    tip: 'Intégrez les citations au texte et ne les utilisez qu\'à bon escient',
    explanation:
      'Les citations doivent servir votre argumentation, pas la remplacer. Beaud rappelle qu\'une citation introduite sans contexte ni commentaire perd une grande partie de sa force. Il faut toujours expliquer au lecteur pourquoi cette citation est pertinente et ce qu\'elle apporte à votre démonstration. Les citations trop longues ou trop fréquentes donnent l\'impression que l\'auteur s\'cache derrière d\'autres voix.',
  },
  // ── Style ──
  {
    id: 'tip-style-clarte',
    category: 'style',
    tip: 'Privilégiez la clarté et la simplicité dans votre écriture académique',
    explanation:
      'Beaud dénonce le style ampoulé et obscure que certains associent à tort à la profondeur intellectuelle. Un texte académique de qualité est un texte clair, où chaque phrase est compréhensible dès la première lecture. La complexité de la pensée ne justifie pas la complexité de l\'expression : au contraire, plus la pensée est fine, plus elle mérite une expression transparente.',
  },
  {
    id: 'tip-style-jargon',
    category: 'style',
    tip: 'Évitez le jargon inutile et les mots-valises',
    explanation:
      'Le vocabulaire technique est nécessaire dans toute recherche, mais Beaud rappelle qu\'il doit être employé à bon escient et défini quand il est susceptible de ne pas être connu du lecteur. Les mots-valises et les néologismes à la mode masquent souvent une pensée floue. Chaque terme doit avoir un sens précis et être utilisé de manière constante tout au long de la thèse.',
  },
  {
    id: 'tip-style-hedging',
    category: 'style',
    tip: 'Nuancez vos affirmations et évitez les certitudes excessives',
    explanation:
      'Dans la recherche académique, il est rare qu\'un résultat soit absolu et définitif. Beaud recommande d\'utiliser des expressions de nuance (il semble que, les données suggèrent, il est probable que) pour rendre compte de la complexité et des limites de vos conclusions. Cette prudence n\'est pas une faiblesse : c\'est une marque de rigueur scientifique.',
    example:
      'Au lieu de « Cette politique a échoué », écrivez : « Les données disponibles suggèrent que cette politique n\'a pas produit les résultats escomptés dans les contextes étudiés ».',
  },
  {
    id: 'tip-style-phrases-courtes',
    category: 'style',
    tip: 'Favorisez les phrases courtes et limitez les subordonnées multiples',
    explanation:
      'Les phrases interminables avec de multiples subordonnées sont difficiles à lire et à comprendre. Beaud conseille de découper les phrases longues en unités plus courtes, quitte à utiliser des connecteurs logiques pour maintenir le lien entre les idées. La ponctuation est un outil puissant pour structurer la pensée : utilisez-la à bon escient.',
  },
  // ── Révision ──
  {
    id: 'tip-rev-multiple',
    category: 'revision',
    tip: 'Révisez à plusieurs niveaux : structure, argumentation, style',
    explanation:
      'La révision efficace procède par étapes. Beaud recommande de commencer par la structure globale (logique du plan, équilibre des parties), puis de passer à l\'argumentation (cohérence, pertinence des preuves), et enfin d\'examiner le style (phrases, mots, orthographe). Corriger simultanément tous les niveaux est contre-productif car l\'attention se disperse.',
  },
  {
    id: 'tip-rev-retour',
    category: 'revision',
    tip: 'Laissez reposer le texte avant de le relire',
    explanation:
      'Quand vous venez de rédiger un passage, votre cerveau voit ce que vous vouliez écrire, pas ce que vous avez réellement écrit. Beaud recommande de laisser reposer le manuscrit au moins quelques jours avant de le relire. Ce temps de pause permet de retrouver un regard neuf et de repérer les faiblesses, les répétitions et les incohérences qui échappent à la relecture immédiate.',
  },
  {
    id: 'tip-rev-pairs',
    category: 'revision',
    tip: 'Faites relire votre texte par des pairs et acceptez la critique',
    explanation:
      'Le regard extérieur est irremplaçable pour identifier les problèmes que vous ne voyez plus. Beaud insiste sur l\'importance de solliciter des retours de collègues, de doctorants plus avancés et naturellement du directeur. Il faut accueillir ces critiques avec gratitude et discernement : chaque remarque mérite d\'être examinée, même si vous décidez in fine de ne pas la suivre.',
  },
  // ── Soutenance ──
  {
    id: 'tip-sout-preparation',
    category: 'soutenance',
    tip: 'Connaissez votre thèse par cœur, y compris ses limites',
    explanation:
      'Le jury s\'attend à ce que vous soyez le meilleur connaisseur de votre propre travail. Beaud rappelle que vous devez être capable de répondre à toute question sur votre méthodologie, vos résultats, vos choix théoriques et vos limites. Connaître les limites de votre recherche et les reconnaître sincèrement est un signe de maturité scientifique, pas de faiblesse.',
  },
  {
    id: 'tip-sout-anticipation',
    category: 'soutenance',
    tip: 'Anticipez les questions du jury en relisant votre travail avec un regard critique',
    explanation:
      'Beaud conseille de se mettre à la place de chaque membre du jury et d\'imaginer les questions qu\'ils pourraient poser. Les questions typiques portent sur les choix méthodologiques, la justification de la problématique, la portée des résultats et les liens avec la littérature existante. Préparez des réponses structurées pour les questions les plus probables.',
  },
  {
    id: 'tip-sout-temps',
    category: 'soutenance',
    tip: 'Respectez strictement le temps imparti pour votre présentation',
    explanation:
      'Dépasser le temps de parole est un signe de mauvaise préparation et irrite le jury. Beaud recommande de chronométrer sa présentation à plusieurs reprises et de prévoir une version raccourcie au cas où. L\'idéal est de terminer légèrement en avance, ce qui donne l\'impression d\'une maîtrise parfaite du sujet.',
  },
  // ── Gestion du temps ──
  {
    id: 'tip-temps-delais',
    category: 'gestion_temps',
    tip: 'Fixez-vous des échéances intermédiaires réalistes',
    explanation:
      'Une thèse est un projet de longue durée qui peut facilement s\'étirer indéfiniment. Beaud recommande de vous fixer des échéances intermédiaires pour chaque chapitre ou section, et de les communiquer à votre directeur. Ces deadlines internes créent une pression salutaire qui empêche la procrastination et donne un rythme de travail régulier.',
  },
  {
    id: 'tip-temps-blocs',
    category: 'gestion_temps',
    tip: 'Découpez le travail en blocs de temps gérables',
    explanation:
      'La perspective « il faut écrire une thèse de 300 pages » est paralysante. Beaud conseille de décomposer le travail en tâches élémentaires : rédiger une section, relire un chapitre, mettre à jour la bibliographie. Chaque tâche devient alors un objectif atteignable dans une session de travail, ce qui maintient la motivation et le sentiment de progression.',
  },
  {
    id: 'tip-temps-dosage',
    category: 'gestion_temps',
    tip: 'Ne vous épuisez pas : alternez travail intense et moments de repos',
    explanation:
      'Beaud observe que de nombreux doctorants s\'épuisent en travaillant sans relâche pendant des mois puis s\'effondrent. Il recommande de maintenir un rythme de travail soutenable sur la durée, en intégrant des moments de repos réguliers. La thèse est un marathon, pas un sprint : la constance sur la durée est plus importante que les efforts sporadiques.',
  },
  // ── Directeur ──
  {
    id: 'tip-dir-communication',
    category: 'directeur',
    tip: 'Maintenez une communication régulière et honnête avec votre directeur',
    explanation:
      'Le directeur de thèse est votre premier allié. Beaud insiste sur l\'importance de maintenir un contact régulier, même lorsque les choses vont bien. Informez-le de vos avancées, de vos difficultés, de vos doutes. Ne cachez pas vos retards : le directeur ne peut vous aider que s\'il connaît la situation réelle. La transparence est la base d\'une relation de confiance productive.',
  },
  {
    id: 'tip-dir-critique',
    category: 'directeur',
    tip: 'Acceptez les critiques de votre directeur comme un bienfait',
    explanation:
      'Les retours du directeur sont souvent difficiles à entendre, mais Beaud rappelle qu\'ils sont toujours motivés par le souci d\'améliorer votre travail. Il ne faut pas prendre les critiques personnellement ni les interpréter comme un manque de confiance. Un directeur exigeant est généralement un directeur impliqué qui croit en votre potentiel.',
  },
  {
    id: 'tip-dir-initiative',
    category: 'directeur',
    tip: 'Ne vous reposez pas sur votre directeur : prenez l\'initiative',
    explanation:
      'Le directeur encadre et guide, mais la thèse est votre travail. Beaud souligne que c\'est à vous de proposer les rendez-vous, de soumettre des textes, de poser des questions. Un doctorant passif qui attend d\'être piloté à chaque étape ne progresse pas. L\'autonomie et la proactivité sont des qualités indispensables pour mener à bien une recherche.',
  },
]

// ─── Structures recommandées ─────────────────────────────────────────

export const thesisArtStructures: ThesisArtStructure[] = [
  {
    id: 'these-shs',
    type: 'these_sciences_humaines',
    description:
      'Structure classique d\'une thèse en sciences humaines et sociales, organisée en trois parties selon la logique dialectique ou progressive. Ce modèle est le plus courant en histoire, sociologie, science politique, géographie et disciplines connexes. Chaque partie comprend deux à trois chapitres, eux-mêmes subdivisés en sections cohérentes. L\'ensemble suit un mouvement démonstratif qui mène le lecteur du constat à l\'analyse et à la synthèse ou proposition.',
    parts: [
      {
        title: 'Introduction générale',
        sections: [
          'Amorce et contextualisation du sujet',
          'Définition des concepts clés et délimitation du champ d\'étude',
          'Formulation de la problématique et des hypothèses de recherche',
          'Présentation du cadre théorique et de l\'état de l\'art',
          'Exposé de la méthodologie et des sources utilisées',
          'Annonce du plan détaillé de la thèse',
        ],
      },
      {
        title: 'Première partie : Constat et cadre',
        sections: [
          'Chapitre 1 : Contexte historique et institutionnel du phénomène étudié',
          'Chapitre 2 : État des connaissances et revue de littérature systématique',
          'Chapitre 3 : Cadre conceptuel et définitions opérationnelles',
        ],
      },
      {
        title: 'Deuxième partie : Analyse et démonstration',
        sections: [
          'Chapitre 4 : Présentation et analyse des données recueillies',
          'Chapitre 5 : Mise à l\'épreuve des hypothèses et discussion des résultats',
          'Chapitre 6 : Confrontation avec les travaux existants et apports originaux',
        ],
      },
      {
        title: 'Troisième partie : Synthèse et ouverture',
        sections: [
          'Chapitre 7 : Synthèse des principaux résultats et réponse à la problématique',
          'Chapitre 8 : Limites de la recherche et pistes pour de futurs travaux',
        ],
      },
      {
        title: 'Conclusion générale',
        sections: [
          'Rappel de la problématique et de la démarche suivie',
          'Synthèse des principaux apports de la thèse',
          'Réponse argumentée à la question de recherche',
          'Ouverture vers de nouvelles perspectives de recherche',
        ],
      },
    ],
  },
  {
    id: 'these-sciences-exactes',
    type: 'these_sciences_exactes',
    description:
      'Structure d\'une thèse en sciences exactes et expérimentales, centrée sur la démarche hypothético-déductive et la présentation des résultats expérimentaux. Ce modèle privilégie la clarté de la méthodologie et la reproductibilité des expériences. Les chapitres sont souvent organisés autour des expériences ou des séries de mesures, avec une forte articulation entre hypothèses, protocoles et résultats. Les sciences de la vie, la chimie, la physique et les disciplines de l\'ingénierie suivent généralement ce schéma.',
    parts: [
      {
        title: 'Introduction générale',
        sections: [
          'Présentation du domaine de recherche et enjeux scientifiques',
          'Bilan des connaissances existantes et lacunes identifiées',
          'Formulation des objectifs et des hypothèses de recherche',
          'Aperçu général de la démarche expérimentale',
          'Organisation du manuscrit',
        ],
      },
      {
        title: 'Première partie : Fondements théoriques et méthodologiques',
        sections: [
          'Chapitre 1 : Revue de littérature détaillée et cadre théorique',
          'Chapitre 2 : Description des méthodes, protocoles expérimentaux et instruments',
          'Chapitre 3 : Validation des méthodes et conditions expérimentales',
        ],
      },
      {
        title: 'Deuxième partie : Résultats expérimentaux',
        sections: [
          'Chapitre 4 : Première série d\'expériences – présentation et analyse des résultats',
          'Chapitre 5 : Deuxième série d\'expériences – résultats complémentaires et variations',
          'Chapitre 6 : Troisième série d\'expériences – vérification et robustesse des résultats',
        ],
      },
      {
        title: 'Troisième partie : Discussion et perspectives',
        sections: [
          'Chapitre 7 : Discussion critique des résultats et interprétation théorique',
          'Chapitre 8 : Comparaison avec les travaux antérieurs et contribution originale',
          'Chapitre 9 : Limites, implications et ouvertures pour la recherche future',
        ],
      },
      {
        title: 'Conclusion générale et appendices',
        sections: [
          'Synthèse des découvertes principales',
          'Réponse aux hypothèses initiales',
          'Perspectives de recherche et applications potentielles',
          'Bibliographie complète et annexes techniques',
        ],
      },
    ],
  },
  {
    id: 'memoire-master',
    type: 'memoire_master',
    description:
      'Structure d\'un mémoire de master recherche ou professionnel, plus court qu\'une thèse mais suivant une logique similaire. Le mémoire doit démontrer la capacité du candidat à conduire une recherche autonome et à présenter ses résultats avec rigueur. La structure est souvent condensée en deux parties principales, avec une introduction et une conclusion plus brèves. Le cadre temporel (6 à 9 mois) impose une délimitation plus stricte du sujet et une sélection rigoureuse des sources.',
    parts: [
      {
        title: 'Introduction',
        sections: [
          'Contextualisation du sujet et justification du choix',
          'Formulation de la problématique et des questions de recherche',
          'Présentation succincte du cadre théorique et de la méthodologie',
          'Annonce du plan',
        ],
      },
      {
        title: 'Première partie : Cadre théorique et état de l\'art',
        sections: [
          'Chapitre 1 : Revue de littérature et positionnement dans le débat scientifique',
          'Chapitre 2 : Cadre conceptuel et méthodologie retenue',
        ],
      },
      {
        title: 'Deuxième partie : Résultats et analyse',
        sections: [
          'Chapitre 3 : Présentation des résultats de la recherche (données, analyses, interprétations)',
          'Chapitre 4 : Discussion des résultats, mise en perspective et apports de la recherche',
        ],
      },
      {
        title: 'Conclusion',
        sections: [
          'Synthèse des principaux résultats et réponse à la problématique',
          'Limites de l\'étude et perspectives de recherche',
        ],
      },
    ],
  },
]

// ─── Pièges courants ────────────────────────────────────────────────

export const commonPitfalls: CommonPitfall[] = [
  {
    id: 'pit-01',
    pitfall: 'Choisir un sujet trop vaste ou trop vague',
    consequence:
      'La délimitation insuffisante du sujet conduit à un travail superficiel qui ne peut pas être traité en profondeur. Le risque est de produire une thèse qui effleure de nombreux aspects sans en maîtriser aucun véritablement, ce qui déçoit le jury et affaiblit la crédibilité du chercheur.',
    solution:
      'Croisez au moins deux critères de délimitation (espace, temps, population, concept) et validez la faisabilité du sujet avec votre directeur dès le départ en évaluant les sources disponibles et le temps nécessaire.',
    phase: 'choix-sujet',
  },
  {
    id: 'pit-02',
    pitfall: 'Procrastiner la rédaction en attendant de « tout savoir »',
    consequence:
      'Reporter indéfiniment le début de la rédaction crée un blocage psychologique croissant. Plus on attend, plus la page blanche devient intimidante, et le risque de se retrouver avec un délai insuffisant pour rédiger augmente considérablement. La thèse risque d\'être bâclée ou incomplète.',
    solution:
      'Commencez à rédiger dès que vous avez une structure de base, même de manière imparfaite. Le premier jet est un outil de travail, pas un produit fini. Écrivez régulièrement pour maintenir le flux et le momentum.',
    phase: 'redaction',
  },
  {
    id: 'pit-03',
    pitfall: 'Confondre le thème et la problématique',
    consequence:
      'Un thème n\'est pas une question de recherche. Sans problématique claire, la thèse manque de direction intellectuelle et se réduit à une compilation d\'informations sans fil conducteur. Le jury aura du mal à identifier l\'originalité et l\'apport du travail.',
    solution:
      'Formulez votre problématique sous forme d\'une question unique et précise qui traduit une tension, un paradoxe ou une lacune dans les connaissances existantes. Testez cette formulation avec votre directeur.',
    phase: 'problematique',
  },
  {
    id: 'pit-04',
    pitfall: 'Ignorer les sources primaires',
    consequence:
      'Se fier exclusivement aux synthèses et aux travaux secondaires limite la profondeur de l\'analyse et expose au risque de reproduire les biais et les interprétations d\'autres auteurs sans esprit critique. La thèse manque alors d\'originalité et de rigueur.',
    solution:
      'Identifiez les sources primaires pertinentes dès la phase d\'exploration documentaire et accordez-leur une place centrale dans votre travail. Confrontez-les systématiquement aux interprétations secondaires.',
    phase: 'exploration-documentaire',
  },
  {
    id: 'pit-05',
    pitfall: 'Prendre des notes désorganisées',
    consequence:
      'Des notes dispersées ou mal classées deviennent inexploitables au moment de la rédaction. On perd un temps considérable à retrouver une référence, une citation ou une idée. Le risque de plagiat involontaire augmente également quand on ne sait plus ce qui vient de sa lecture et ce qui vient de sa propre réflexion.',
    solution:
      'Adoptez un système de prise de notes structuré dès le premier jour (thématique, chronologique ou conceptuel) avec des références complètes pour chaque note. Utilisez un logiciel de gestion de notes ou un classement physique rigoureux.',
    phase: 'exploration-documentaire',
  },
  {
    id: 'pit-06',
    pitfall: 'Adopter un plan thématique juxtapositif',
    consequence:
      'Le plan thématique juxtapose des blocs de contenu sans logique démonstrative sous-jacente. La thèse donne l\'impression d\'un catalogue sans progression intellectuelle. Le lecteur perd le fil conducteur et le jury critique le manque de problématisation.',
    solution:
      'Optez pour un plan problème qui organise la démonstration autour d\'un questionnement progressif. Chaque partie doit répondre à une étape de la résolution du problème posé et préparer logiquement la suivante.',
    phase: 'plan-these',
  },
  {
    id: 'pit-07',
    pitfall: 'Rédiger l\'introduction en premier',
    consequence:
      'L\'introduction nécessite une vue d\'ensemble de la thèse qu\'on ne possède pas au début de la rédaction. La rédiger en premier conduit souvent à une introduction vague ou déconnectée du contenu réel, qui devra être entièrement réécrite à la fin.',
    solution:
      'Rédigez l\'introduction en dernier, une fois que tous les chapitres sont terminés et que vous avez une vue synthétique de votre travail. Vous pouvez toutefois noter les éléments clés qui devront figurer dans l\'introduction dès le départ.',
    phase: 'redaction',
  },
  {
    id: 'pit-08',
    pitfall: 'Viser la perfection dès le premier jet',
    consequence:
      'Le perfectionnisme paralyse l\'écriture et ralentit considérablement la production. Chaque phrase est réécrite dix fois avant de passer à la suivante, ce qui consume une énergie démesurée et peut conduire à l\'abandon ou à un retard majeur dans la remise du manuscrit.',
    solution:
      'Acceptez que le premier soit imparfait et serve de brouillon de travail. Séparez clairement les phases de rédaction et de révision. La perfection est l\'ennemi du fait accompli : écrivez d\'abord, perfectionnez ensuite.',
    phase: 'redaction',
  },
  {
    id: 'pit-09',
    pitfall: 'Négliger les transitions entre sections et chapitres',
    consequence:
      'L\'absence de transitions rend la lecture hachée et la démonstration incohérente. Chaque chapitre donne l\'impression d\'être un texte autonome juxtaposé aux autres. Le jury critique le manque d\'unité et de logique d\'ensemble du manuscrit.',
    solution:
      'Rédigez systématiquement des phrases ou des paragraphes de transition à la fin de chaque section et au début de la suivante. La dernière phrase d\'un chapitre doit annoncer le suivant, créant ainsi un effet de chaîne continu.',
    phase: 'redaction',
  },
  {
    id: 'pit-10',
    pitfall: 'Utiliser un style ampoulé et obscur',
    consequence:
      'Un style prétentieux ou excessivement complexe masque souvent une pensée floue et décourage le lecteur, y compris les membres du jury. La thèse ne sera pas lue attentivement, ce qui compromet la réception de vos idées et de vos résultats.',
    solution:
      'Privilégiez la clarté et la simplicité. Rédigez des phrases courtes et précises. Faites relire votre texte par un non-spécialiste pour vérifier qu\'il est compréhensible. Définissez chaque terme technique la première fois que vous l\'employez.',
    phase: 'redaction',
  },
  {
    id: 'pit-11',
    pitfall: 'Copier-coller sans reformuler',
    consequence:
      'Le copier-coller sans paraphrase est une forme de plagiat, même involontaire. Les logiciels anti-plagiat utilisés par les universités le détectent facilement. Les conséquences peuvent aller de la demande de révision jusqu\'au rejet de la thèse, avec des sanctions disciplinaires possibles.',
    solution:
      'Toujours reformuler les idées empruntées dans vos propres mots et citer systématiquement la source. Si vous devez utiliser une citation exacte, mettez-la entre guillemets et indiquez la référence précise (page, paragraphe).',
    phase: 'redaction',
  },
  {
    id: 'pit-12',
    pitfall: 'Accumuler des références sans les intégrer au texte',
    consequence:
      'Aligner les citations et les références sans les commenter donne l\'impression que l\'auteur se cache derrière d\'autres voix et n\'apporte pas de réflexion personnelle. Le jury percevra un manque d\'assimilation et de maîtrise de la littérature.',
    solution:
      'Chaque référence citée doit être accompagnée d\'un commentaire qui explicite son apport à votre démonstration. Positionnez-vous par rapport aux auteurs cités : approuvez, nuancez ou opposez-vous à leurs arguments.',
    phase: 'redaction',
  },
  {
    id: 'pit-13',
    pitfall: 'Ne pas faire relire le manuscrit',
    consequence:
      'Un texte qui n\'a pas été relu par d\'autres contient inévitablement des erreurs, des incohérences et des passages obscurs que l\'auteur ne perçoit plus. Le jury trouvera ces défauts et doutera de la rigueur du chercheur, même si le contenu est solide.',
    solution:
      'Sollicitez des relectures de la part de votre directeur, de collègues et de proches. Acceptez les critiques avec ouverture et utilisez-les pour améliorer le manuscrit. Laissez reposer le texte entre deux relectures pour retrouver un regard neuf.',
    phase: 'revision',
  },
  {
    id: 'pit-14',
    pitfall: 'Considérer la révision comme une simple correction orthographique',
    consequence:
      'Se limiter à corriger les fautes d\'orthographe et de typographie sans revoir la structure et l\'argumentation laisse intact les défauts profonds du manuscrit. Le jury évaluera avant tout la logique d\'ensemble, la pertinence de la démonstration et la qualité de l\'argumentation.',
    solution:
      'Procédez par niveaux successifs : d\'abord la structure globale et la logique du plan, ensuite la cohérence de l\'argumentation et la pertinence des preuves, enfin le style et la correction formelle.',
    phase: 'revision',
  },
  {
    id: 'pit-15',
    pitfall: 'Lire sa soutenance au lieu de la présenter',
    consequence:
      'Lire un texte préparé donne une impression de rigidité et de manque de maîtrise. Le jury perçoit que le candidat ne maîtrise pas son sujet et se réfugie derrière un texte sécurisant. L\'interaction avec le jury en pâtit et la note globale est impactée négativement.',
    solution:
      'Préparez des fiches ou des diapositives et apprenez à parler de votre travail sans lire. Répétez la présentation à voix haute plusieurs fois jusqu\'à ce que vous vous sentiez à l\'aise avec le contenu.',
    phase: 'soutenance',
  },
  {
    id: 'pit-16',
    pitfall: 'Méconnaître les limites de sa propre recherche',
    consequence:
      'Prétendre à une exhaustivité ou à une perfection que votre travail ne possède pas expose à des critiques sévères du jury. Un candidat qui ne reconnaît pas les limites de sa recherche est perçu comme immature sur le plan scientifique.',
    solution:
      'Identifiez et assumez ouvertement les limites de votre travail dans la conclusion : limites méthodologiques, biais éventuels, champ d\'investigation restreint. Le jury appréciera cette honnêteté intellectuelle.',
    phase: 'soutenance',
  },
  {
    id: 'pit-17',
    pitfall: 'Ne pas respecter les conventions de présentation',
    consequence:
      'Le non-respect des normes de présentation (marges, police, notes de bas de page, bibliographie) donne une impression de négligence qui ternit la perception du travail, même si le contenu est de qualité. Certaines universités peuvent refuser un manuscrit qui ne respecte pas les normes.',
    solution:
      'Renseignez-vous dès le départ sur les normes de présentation exigées par votre institution et appliquez-les scrupuleusement dès la première page. Utilisez les styles et modèles prédéfinis de votre logiciel de traitement de texte.',
    phase: 'redaction',
  },
  {
    id: 'pit-18',
    pitfall: 'Travailler de manière isolée sans chercher de retours',
    consequence:
      'L\'isolement prolongé conduit à une perte de perspective et à une crispation sur le texte qui nuit à la qualité. Sans retour extérieur, les biais, les répétitions et les failles argumentatives s\'accumulent sans être corrigés.',
    solution:
      'Participez à des séminaires, des ateliers d\'écriture, des groupes de lecture. Présentez vos travaux en cours à des collègues et sollicitez leurs commentaires. La recherche est une activité collective, même si la rédaction est solitaire.',
    phase: 'redaction',
  },
  {
    id: 'pit-19',
    pitfall: 'Négliger la relation avec le directeur de thèse',
    consequence:
      'Un manque de communication avec le directeur conduit à un désalignement progressif entre vos attentes et les siennes. Le jour de la soutenance, le directeur peut être surpris par des choix qu\'il n\'a jamais validés, ce qui affaiblit considérablement votre position face au jury.',
    solution:
      'Maintenez un contact régulier avec votre directeur : rendez-vous périodiques, envoi des chapitres au fur et à mesure, discussion des difficultés rencontrées. Ne lui cachez ni vos retards ni vos doutes.',
    phase: 'choix-sujet',
  },
  {
    id: 'pit-20',
    pitfall: 'Ne pas anticiper les questions du jury',
    consequence:
      'Arriver à la soutenance sans avoir réfléchi aux questions probables du jury conduit à des réponses hésitantes, contradictoires ou évasives. Le jury percevra un manque de recul sur votre propre travail et doutera de la solidité de la recherche.',
    solution:
      'Relisez votre thèse avec un regard critique, en vous mettant à la place de chaque membre du jury. Préparez des réponses argumentées pour les questions les plus probables sur la méthodologie, les résultats, les limites et les perspectives.',
    phase: 'soutenance',
  },
  {
    id: 'pit-21',
    pitfall: 'Modifier sans cesse le plan en cours de rédaction',
    consequence:
      'Trop de modifications structurelles en cours de route désorganisent le manuscrit et créent des contradictions entre les sections rédigées selon des plans différents. Le temps perdu à réécrire des chapitres entiers retarde considérablement la remise du manuscrit.',
    solution:
      'Faites évoluer le plan quand c\'est nécessaire, mais validez chaque modification importante avec votre directeur. Gardez une trace des différentes versions du plan pour assurer la cohérence des sections déjà rédigées.',
    phase: 'plan-these',
  },
  {
    id: 'pit-22',
    pitfall: 'Surdosser les citations et sous-représenter sa propre voix',
    consequence:
      'Une thèse qui ne fait que citer d\'autres auteurs sans proposer de réflexion personnelle ressemble à une compilation plutôt qu\'à un travail de recherche original. Le jury s\'attend à trouver l\'empreinte intellectuelle du candidat à chaque page.',
    solution:
      'Utilisez les citations pour étayer votre argumentation, pas pour la remplacer. Chaque citation doit être accompagnée d\'un commentaire qui montre votre positionnement et votre contribution au débat.',
    phase: 'redaction',
  },
]

// ─── Source bibliographique ─────────────────────────────────────────

export const beaudSource: {
  id: string
  author: string
  year: number
  title: string
  publisher: string
  focusAreas: string[]
} = {
  id: 'beaud-2019',
  author: 'Beaud, M. & Gravier, M.',
  year: 2019,
  title: 'L\'art de la thèse',
  publisher: 'La Découverte',
  focusAreas: [
    'choix-du-sujet',
    'problématique',
    'exploration-documentaire',
    'plan-et-structure',
    'rédaction-académique',
    'style-et-clarté',
    'révision-et-relecture',
    'préparation-de-la-soutenance',
    'gestion-du-temps',
    'relation-avec-le-directeur',
  ],
}
