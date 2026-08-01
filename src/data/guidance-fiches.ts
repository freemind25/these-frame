// Guidance Knowledge Base — 7 fiches for the Directeur IA
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
// FICHE 6: Études bibliométriques
// ─────────────────────────────────────────────
export const FICHE_BIBLIOMETRIE = {
  id: 'fiche-bibliometrie',
  title: 'Études bibliométriques : conduire et interpréter',
  content: `# Études bibliométriques : conduire et interpréter

Guide pratique pour concevoir, mener et interpréter une étude bibliométrique dans le cadre doctoral.

## Quand l'utiliser

Quand le doctorant doit : positionner son champ de recherche quantitativement, analyser la production scientifique d'un domaine, identifier les auteurs/institutions/pays clés, ou évaluer l'impact de revues.

## Étapes d'une étude bibliométrique

1. **Définir la question de recherche bibliométrique** : que mesure-t-on et pourquoi ? (productivité, collaboration, impact, thématiques émergentes)
2. **Choisir la/les base(s) de données** : WoS, Scopus, Google Scholar — chacune a sa couverture, ses forces et ses limites. Le choix dépend de la discipline et du type d'analyse.
3. **Construire la requête documentaire** : mots-clés, opérateurs booléens, troncature, champs. Documenter la requête pour reproductibilité.
4. **Exporter et nettoyer les données** : éliminer les doublons, vérifier les affiliations, normaliser les noms d'auteurs.
5. **Analyser** : choisir les indicateurs pertinents (pas tous) selon la question.
6. **Interpréter avec nuance** : un indicateur seul ne suffit jamais — le croisement est nécessaire.

## Indicateurs clés et quand les utiliser

- **Productivité temporelle** : nombre de publications par an → tendance d'un champ, point de bascule
- **Productivité par auteur/institution/pays** : qui publie le plus → identification des acteurs clés
- **Indice de collaboration** : proportion de publications co-écrites → densité du réseau collaboratif
- **Réseaux de co-auteurs** : cartographie des collaborations → structure communautaire
- **Facteur d'impact (JCR)** : citations reçues / articles publiés (2 ans) → visibilité d'une revue. Attention : ne pas comparer facteurs d'impact entre disciplines
- **Facteur d'impact à 5 ans** : même calcul sur 5 ans → plus stable pour les domaines à citation lente
- **Indice h** : nombre d'articles avec h citations chacun → productivité + impact combinés d'un chercheur
- **Publication Efficiency Index (PEI)** : (citations du pays / citations totales) / (publications du pays / publications totales) → l'impact correspond-il à l'effort ?
- **Half-life des citations** : durée médiane pour qu'un article soit cité → vitesse de diffusion

## Pièges courants

- Comparer des indicateurs entre disciplines (le facteur d'impact en mathématiques ≠ en biomédecine)
- Utiliser un seul indicateur pour tirer une conclusion
- Ignorer les biais de base de données (couverture disciplinaire, langue, zone géographique)
- Ne pas documenter la requête de recherche (perte de reproductibilité)
- Confondre nombre de citations et qualité intrinsèque

## Comment utiliser avec un étudiant

1. Toujours commencer par la question : qu'est-ce qu'on veut mesurer et pourquoi ?
2. Choisir max 3-4 indicateurs pertinents, pas tout le catalogue
3. Rappeler qu'une étude bibliométrique ne remplace pas une revue de littérature qualitative — elle la complète`,
}

// ─────────────────────────────────────────────
// FICHE 7: Stratégies de recherche documentaire
// ─────────────────────────────────────────────
export const FICHE_RECHERCHE_DOCUMENTAIRE = {
  id: 'fiche-recherche-documentaire',
  title: 'Stratégies de recherche documentaire',
  content: `# Stratégies de recherche documentaire

Méthodes systématiques pour chercher, sélectionner et suivre la littérature scientifique.

## Quand l'utiliser

Quand le doctorant débute sa revue de littérature, a du mal à trouver des sources pertinentes, ou doit mettre en place une veille documentaire.

## Développer une requête de recherche efficace

1. **Identifier les aspects principaux** du sujet (décomposer en 2-4 concepts)
2. **Lister les synonymes et termes alternatifs** pour chaque concept (anglais/français, abréviations, termes voisins)
3. **Appliquer les techniques de recherche** :
    - **Recherche de phrase** : guillemets doubles pour chercher une expression exacte ("climate change")
    - **Troncature** : astérisque pour les variantes d'un mot (environment* → environment, environments, environmental)
    - **Caractère générique** : point d'interrogation pour une lettre (colo?r → color, colour)
    - **Opérateurs booléens** : AND (restreindre), OR (élargir), NOT (exclure — utiliser avec prudence)
4. **Combiner** : (concept1 OR synonyme1) AND (concept2 OR synonyme2)

## Bases de données : choisir la bonne

- **Google Scholar** : bon point de départ, couverture large mais inégale, pas de contrôle de qualité. Permet les alertes et les profils auteurs
- **WoS / Scopus** : bases de données disciplinaires avec métadonnées structurées, indicateurs de citation, filtrage avancé. Essentielles pour une revue systématique
- **Bases de données spécialisées** : chaque discipline a ses bases (PubMed, PsycINFO, IEEE Xplore, etc.) — consulter les guides de la bibliothèque
- **Google avancé** : utile pour la littérature grise, rapports institutionnels, données gouvernementales

## Citer ses sources dès le départ

- Utiliser un gestionnaire de références (Zotero, Mendeley, EndNote) DÈS les premières recherches
- Exporter systématiquement les résultats de recherche vers le gestionnaire
- Les métadonnées exportées incluent généralement : auteur, titre, journal, année, DOI — vérifier leur exactitude

## Revue systématique : les exigences supplémentaires

- Protocole écrit AVANT la recherche (question PICO/PCC, critères d'inclusion/exclusion)
- Recherche documentée et reproductible dans au moins 2 bases de données
- Tamisage en deux étapes : titre/résumé puis texte intégral
- Évaluation critique des articles retenus (grilles validées)
- Synthèse : qualitative (thématique) ou quantitative (méta-analyse)

## Veille documentaire

- Configurer des **alertes de recherche** dans Google Scholar, WoS, Scopus — recevoir les nouveaux articles par email
- Créer un **profil ORCID** : identifiant pérenne, suivi des publications, liaison avec les systèmes institutionnels
- Suivre les **revues clés** du domaine (abonnement aux tables des matières)

## Comment utiliser avec un étudiant

1. Faire décomposer le sujet en concepts AVANT de lancer la moindre recherche
2. Vérifier que la requête booléenne est correcte : trop de résultats = élargir les synonymes ; trop peu = vérifier les termes
3. Insister sur le gestionnaire de références dès le départ — la reconstruction de bibliographie en fin de parcours est un cauchemar`,
}

// ─────────────────────────────────────────────
// FICHE 8: Les 10 composantes du protocole de recherche
// ─────────────────────────────────────────────
export const FICHE_COMPOSANTES_RECHERCHE = {
  id: 'fiche-composantes-recherche',
  title: 'Les 10 composantes du protocole de recherche',
  content: `# Les 10 composantes du protocole de recherche

Référentiel structuré pour évaluer la complétude et la cohérence d'un protocole ou d'une proposition de recherche.

## 1. Titre de recherche

Le titre est le premier contact avec le lecteur — il doit refléter le contenu avec précision.

**Composantes obligatoires :**
- Variable indépendante (VI)
- Variable dépendante (VD)
- Relation entre les deux (si applicable)
- Contexte/population d'étude (optionnel mais recommandé)

**Critères de qualité :**
- Clair, spécifique, exprime l'objectif
- 10–20 mots maximum
- Éviter les formules vagues : « étude sur », « recherche en », « analyse de »
- Exemples de bonnes formulations :
  - « L'impact du leadership transformationnel sur la performance au travail : le rôle médiateur de la satisfaction professionnelle »

## 2. Problème de recherche

Le problème est le cœur de l'étude — la lacune cognitive que le chercheur cherche à combler.

**Définition :** une situation, un phénomène ou un ensemble de questions non résolus dans la réalité ou dans les études antérieures.

**Critères de formulation :**
- Il doit être **clair et spécifique** — pas une question vague
- Il doit exprimer une **lacune réelle** dans la littérature ou la pratique
- Il est le fondement sur lequel sont construits les objectifs, hypothèses et méthodologie
- Il doit refléter un **besoin scientifique légitime** de mener l'étude

**Vérification :** demander au doctorant « pourquoi cette question n'a-t-elle pas encore été résolue ? » — s'il ne peut pas répondre, le problème est mal formulé.

## 3. Objectifs de recherche

Les objectifs sont les résultats spécifiques que le chercheur vise à atteindre.

**Caractéristiques :**
- Clairs et vérifiables
- Mesurables et testables
- Réalisables avec les ressources disponibles
- En lien direct avec le problème de recherche

**Types :**
- **Objectif général** : l'ambition globale de l'étude
- **Objectifs spécifiques** : les sous-résultats qui composent l'objectif général (répondre aux sous-questions)

**Erreur fréquente :** confondre objectif (ce qu'on veut atteindre) et activité (ce qu'on va faire).

## 4. Questions de recherche

Les questions décomposent le problème en interrogations auxquelles l'étude doit répondre.

**Types :**
1. **Questions descriptives** : décrire un phénomène ou un sujet
2. **Questions explicatives** : expliquer les relations entre variables
3. **Questions comparatives** : comparer des groupes ou des individus
4. **Questions exploratoires** : explorer un domaine peu documenté

**Critères de qualité :**
- Chaque question doit être directement liée à un objectif
- Formulées de manière ouverte (pas de yes/no)
- Nombre limité (3–5 questions principales)

## 5. Hypothèses de recherche

Une hypothèse est une réponse provisoire à une question de recherche, testable statistiquement.

**Caractéristiques :**
- Claires et spécifiques
- Testables empiriquement
- Mesurables via les données collectées
- Formulent une relation entre deux variables ou plus
- Dérivées de la théorie et des études antérieures

**Types :**
- H1 (hypothèse principale) : relation directe entre VI et VD
- H2, H3… (sous-hypothèses) : relations spécifiques ou médiations
- H0 (hypothèse nulle) : absence de relation

## 6. Signification/Importance de la recherche

La valeur scientifique et pratique que la recherche ajoute.

**4 dimensions :**
1. **Scientifique (académique)** : contribution au développement de la connaissance
2. **Pratique (appliquée)** : solutions ou recommandations applicables
3. **Sociale** : amélioration de l'environnement ou des pratiques
4. **Économique** : amélioration de l'efficience ou réduction des coûts

## 7. Limites de la recherche

Les limites définissent le périmètre de l'étude et protègent contre les critiques hors-sujet.

**2 catégories :**
- **Limites subjectives** : le sujet, la population, les variables, les hypothèses, les outils — ce que le chercheur a choisi d'inclure
- **Limites objectives** : le temps, le lieu, l'échantillon — les contraintes réelles

**Piège :** ne pas confondre limites (ce qu'on ne fait pas) et faiblesses (ce qu'on aurait dû faire).

## 8. Méthodologie de recherche

La méthodologie est le plan d'action pour atteindre les objectifs.

**Composantes :**
1. **Type de recherche** : descriptive, analytique, expérimentale, quasi-expérimentale, corrélationnelle, qualitative, mixte
2. **Population d'étude** : l'ensemble des individus ou unités concernés
3. **Échantillon** : la partie représentative de la population (taille, méthode d'échantillonnage)
4. **Outil de collecte** : questionnaire, entretien, observation, analyse de contenu, tests
5. **Méthode d'analyse** : statistiques descriptives, inférentielles, analyse thématique, analyse de contenu

**Règle d'or :** chaque choix méthodologique doit être justifié par une citation méthodologique — pas seulement décrit.

## 9. Variables et cadre conceptuel

**Types de variables :**
1. **Variable indépendante (VI)** : celle qui varie de manière autonome, dont l'effet est étudié
2. **Variable dépendante (VD)** : celle qui change en conséquence de la VI
3. **Variable médiatrice** : transmet l'effet de la VI vers la VD
4. **Variable modératrice** : modifie la force ou la direction de la relation VI→VD

**Cadre conceptuel :** schéma qui visualise les relations hypothétisées entre toutes les variables. Il doit être :
- Ancré dans la théorie existante
- Explicitement connecté à chaque hypothèse
- Distinguant clairement antécédents, médiateurs, modérateurs et résultats

## 10. Résultats, discussion, conclusions et recommandations

**Présentation des résultats :**
- Utiliser les outils statistiques appropriés
- Présenter via tableaux et graphiques clairs
- Ne pas interpréter dans cette section — seulement rapporter

**Discussion :**
- Interpréter les résultats en lien avec les objectifs et la littérature
- Comparer avec les études antérieures (convergence ou divergence)
- Évaluer l'originalité et la contribution
- Discuter les implications théoriques et pratiques

**Conclusions :**
- Répondre à chaque question de recherche
- Synthétiser sans introduire de nouvelles informations

**Recommandations :**
- Pour la pratique professionnelle
- Pour les futures recherches (ouvrir vers les lacunes identifiées)`,
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
  FICHE_BIBLIOMETRIE,
  FICHE_RECHERCHE_DOCUMENTAIRE,
  FICHE_COMPOSANTES_RECHERCHE,
] as const

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface GuidanceContext {
  chapterTitle?: string
  userMessage?: string
  signal?: 'new-project' | 'writing-block' | 'chapter-structure' | 'institutional' | 'formatting' | 'bibliometrie' | 'recherche-doc' | 'methodologie' | 'auto'
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
  'bibliometrie': [FICHE_BIBLIOMETRIE],
  'recherche-doc': [FICHE_RECHERCHE_DOCUMENTAIRE],
  'methodologie': [FICHE_COMPOSANTES_RECHERCHE],
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
    patterns: [/problémat/i, /problématique/i, /hypothèse/i, /hypothese/i, /variable/i, /protocole/i, /objectif/i, /échantill/i],
    fiche: FICHE_COMPOSANTES_RECHERCHE,
  },
  {
    patterns: [/méthod/i, /methodo/i, /methodolog/i],
    fiche: FICHE_COMPOSANTES_RECHERCHE,
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
  {
    patterns: [/variable\s+(indep|dépen|médiat|modérat)/i, /cadre\s+conceptuel/i, /hypoth[eè]s/i, /probl[eè]me\s+de\s+recherche/i, /objectif\s+de\s+recherche/i, /question\s+de\s+recherche/i, /signification\s+de\s+la\s+recherche/i, /limite\s+de\s+la\s+recherche/i, /échantill/i, /protocole\s+de\s+recherche/i, /méthodolog/i, /méthode\s+d['\x27]analyse/i, /population\s+d['\x27][ée]tude/i],
    fiche: FICHE_COMPOSANTES_RECHERCHE,
    reason: 'Mots-clés de méthodologie et composantes de recherche détectés',
  },
  {
    patterns: [/bibliomé/i, /bibliometric/i, /facteur\s+d['\x27]impact/i, /impact\s+factor/i, /indice\s+h/i, /h\-index/i, /productivité\s+scientifique/i],
    fiche: FICHE_BIBLIOMETRIE,
    reason: 'Mots-clés bibliométriques détectés dans le message',
  },
  {
    patterns: [/recherche\s+documentaire/i, /littérature/i, /litterature/i, /bases\s+de\s+données/i, /google\s+scholar/i, /scopus/i, /web\s+of\s+science/i, /revue\s+systématique/i, /veille/i, /gestionnaire\s+de\s+référence/i, /zotero/i, /endnote/i, /mendeley/i, /orcid/i],
    fiche: FICHE_RECHERCHE_DOCUMENTAIRE,
    reason: 'Mots-clés de recherche documentaire détectés dans le message',
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
