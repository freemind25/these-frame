# Recadrage — ThisFrame n'est pas un guide, c'est un éditeur de rédaction

Ce que tu as conçu est un **guide de rédaction** : un contenu de référence que le doctorant consulte. Ce n'est pas ce qui a été demandé, et ce n'est pas ce dont l'utilisateur a besoin. Voici précisément ce que l'application doit être.

## Le malentendu, en une phrase

Un guide se **lit**. L'outil qu'on construit se **remplit** : le doctorant écrit sa thèse, chapitre par chapitre, directement dans l'application, jusqu'au document final complet.

## Ce que l'application doit permettre concrètement

1. **Un espace de rédaction réel par chapitre.** Chaque chapitre du plan (I. Introduction générale, II. Données bibliographiques, III. Cadre méthodologique, IV. Résultats, V. Discussion, VI. Conclusion) a une zone d'édition où le texte que le doctorant tape EST le texte de sa thèse — pas un exemple, pas une explication de ce qu'il faudrait écrire. Le doctorant avance chapitre par chapitre jusqu'à avoir un document complet.

2. **Les onglets/sections ne sont PAS des pages de contenu séparées.** Ce sont des balises d'aide contextuelles, rattachées à l'endroit où le doctorant rédige : un rappel de ce qu'attend ce chapitre, un repère méthodologique, un exemple de structure — affichés à côté ou au-dessus de la zone d'écriture, jamais à la place. Le doctorant ne quitte jamais son texte pour "aller lire une page d'aide" : l'aide vient à lui, contextuellement, pendant qu'il écrit.

3. **Le directeur de thèse (IA) supervise, il ne remplace pas la rédaction ni l'aide contextuelle.** Il intervient à la soumission d'un chapitre (bouton "soumettre à l'avis"), évalue ce qui a été réellement écrit par le doctorant, et rend un avis structuré (points solides / points à consolider / question exigeante). Il ne génère jamais de texte à insérer dans le chapitre.

## Ce qui doit disparaître de la conception actuelle

- Toute page qui se contente d'expliquer "comment rédiger un chapitre X" sans zone d'écriture attachée
- Toute navigation qui traite les chapitres comme des articles à consulter plutôt que des sections à compléter
- Toute confusion entre "afficher de la documentation" et "fournir un outil de production"

## Check rapide pour valider qu'on est alignés

Avant de continuer le développement, réponds à cette question précise : **si le doctorant utilise l'application du premier jour jusqu'à la soutenance, obtient-il à la fin un document de thèse complet rédigé À L'INTÉRIEUR de l'application ?** Si la réponse n'est pas un "oui" évident et immédiat, la conception n'est pas encore bonne.

## Prochaine étape attendue

Un rapport (unique, selon le protocole habituel) décrivant : (1) ce qui doit être repris dans l'implémentation actuelle, (2) la structure de l'écran de rédaction par chapitre, (3) comment les balises d'aide s'articulent visuellement avec la zone d'écriture, avant toute reprise de code.
