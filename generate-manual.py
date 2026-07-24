#!/usr/bin/env python3
"""
ThesisFrame — Notice d'utilisation (User Manual)
Generates a professional PDF manual in French using ReportLab.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, ListFlowable, ListItem,
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ─── Constants ──────────────────────────────────────────────────
OUTPUT_PATH = "/home/z/my-project/public/notice-utilisation-thesisframe.pdf"
EMERALD = HexColor("#059669")
EMERALD_LIGHT = HexColor("#05966920")
EMERALD_MID = HexColor("#34D399")
DARK = HexColor("#1E293B")
SLATE = HexColor("#475569")
LIGHT_BG = HexColor("#F8FAFC")
ACCENT_BG = HexColor("#ECFDF5")
PAGE_W, PAGE_H = A4
MARGIN = 2 * cm

# ─── Custom Flowables ─────────────────────────────────────────
class EmeraldBar(Flowable):
    """A colored horizontal bar for decoration."""
    def __init__(self, width, height=3, color=EMERALD):
        Flowable.__init__(self)
        self.width = width
        self.height = height
        self.color = color
    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, self.width, self.height, 1.5, fill=1, stroke=0)


class AccentBox(Flowable):
    """A box with left emerald border containing a paragraph."""
    def __init__(self, text, width, style):
        Flowable.__init__(self)
        self._text = text
        self._width = width
        self._style = style
        self._para = Paragraph(text, style)
        self._para_w, self._para_h = self._para.wrap(width - 18*mm, 1000)
        self.width = width
        self.height = self._para_h + 8*mm

    def draw(self):
        self.canv.setFillColor(ACCENT_BG)
        self.canv.roundRect(0, 0, self._width, self.height, 3*mm, fill=1, stroke=0)
        self.canv.setFillColor(EMERALD)
        self.canv.roundRect(0, 0, 4*mm, self.height, 2*mm, fill=1, stroke=0)
        self._para.drawOn(self.canv, 8*mm, 4*mm)


# ─── Styles ────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def make_styles():
    s = {}
    s['cover_title'] = ParagraphStyle(
        'CoverTitle', parent=styles['Title'],
        fontName='Helvetica-Bold', fontSize=32, leading=38,
        textColor=EMERALD, alignment=TA_CENTER, spaceAfter=6*mm,
    )
    s['cover_subtitle'] = ParagraphStyle(
        'CoverSubtitle', parent=styles['Normal'],
        fontName='Helvetica', fontSize=14, leading=18,
        textColor=SLATE, alignment=TA_CENTER, spaceAfter=4*mm,
    )
    s['cover_version'] = ParagraphStyle(
        'CoverVersion', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, leading=14,
        textColor=SLATE, alignment=TA_CENTER,
    )
    s['toc_title'] = ParagraphStyle(
        'TOCTitle', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=22, leading=26,
        textColor=DARK, spaceAfter=8*mm, spaceBefore=0,
    )
    s['section_title'] = ParagraphStyle(
        'SectionTitle', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=18, leading=24,
        textColor=DARK, spaceBefore=10*mm, spaceAfter=4*mm,
    )
    s['subsection'] = ParagraphStyle(
        'SubSection', parent=styles['Heading2'],
        fontName='Helvetica-Bold', fontSize=12, leading=16,
        textColor=EMERALD, spaceBefore=5*mm, spaceAfter=2*mm,
    )
    s['body'] = ParagraphStyle(
        'Body', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, leading=15,
        textColor=DARK, alignment=TA_JUSTIFY, spaceAfter=3*mm,
    )
    s['body_bold'] = ParagraphStyle(
        'BodyBold', parent=s['body'],
        fontName='Helvetica-Bold',
    )
    s['bullet'] = ParagraphStyle(
        'Bullet', parent=s['body'],
        leftIndent=10*mm, bulletIndent=4*mm, spaceAfter=1.5*mm,
        bulletFontName='Helvetica', bulletFontSize=10,
    )
    s['footer'] = ParagraphStyle(
        'Footer', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8, textColor=SLATE,
        alignment=TA_CENTER,
    )
    s['toc_entry'] = ParagraphStyle(
        'TOCEntry', parent=styles['Normal'],
        fontName='Helvetica', fontSize=11, leading=20,
        textColor=DARK, leftIndent=2*mm,
    )
    s['toc_sub'] = ParagraphStyle(
        'TOCSub', parent=s['toc_entry'],
        fontName='Helvetica', fontSize=10, leading=18,
        leftIndent=8*mm, textColor=SLATE,
    )
    s['tip'] = ParagraphStyle(
        'Tip', parent=s['body'],
        fontName='Helvetica-Oblique', fontSize=9, leading=14,
        textColor=SLATE, leftIndent=4*mm,
    )
    return s

S = make_styles()

# ─── Content ───────────────────────────────────────────────────
SECTIONS = [
    {
        "num": "1",
        "title": "Introduction",
        "content": [
            ("body", """<b>ThesisFrame</b> est un outil de rédaction académique intelligent conçu pour accompagner les doctorants 
            tout au long de la rédaction de leur thèse. L'application offre un environnement structuré, un assistant IA intégré 
            et des outils d'analyse pour faciliter chaque étape du processus de recherche."""),
            ("body", """Cette notice vous guide à travers toutes les fonctionnalités de ThesisFrame, depuis la prise en main 
            initiale jusqu'aux fonctionnalités avancées comme l'export PDF, la recherche documentaire et la sauvegarde cloud."""),
            ("subsection", "Aperçu général des fonctionnalités"),
            ("bullet", "Éditeur de texte intégré avec sauvegarde automatique"),
            ("bullet", "Structure de thèse en 6 chapitres (Introduction, Bibliographie, Méthodologie, Résultats, Discussion, Conclusion)"),
            ("bullet", "Assistant IA avec 10 modes de rédaction spécialisés"),
            ("bullet", "Support de 7 fournisseurs IA (Z.ai, Mistral, OpenAI, Anthropic, Groq, Ollama, Custom)"),
            ("bullet", "Simulateur de directeur de thèse avec évaluation structurée"),
            ("bullet", "Analyse d'équilibre des chapitres en temps réel"),
            ("bullet", "Recherche documentaire multi-sources (OpenAlex, Crossref, arXiv, PubMed, Semantic Scholar)"),
            ("bullet", "Gestion des références bibliographiques avec import BibTeX"),
            ("bullet", "Guide méthodologique interactif"),
            ("bullet", "Export PDF professionnel"),
            ("bullet", "Sauvegarde cloud Google Drive"),
        ]
    },
    {
        "num": "2",
        "title": "Prise en main",
        "content": [
            ("body", """L'interface de ThesisFrame est composée de trois zones principales : la barre latérale gauche pour la navigation 
            entre les chapitres et les outils, la zone centrale pour la rédaction, et le panneau droit pour l'aide et l'assistant IA."""),
            ("subsection", "Navigation dans la barre latérale"),
            ("body", """La barre latérale gauche affiche la liste des 6 chapitres de votre thèse. Chaque chapitre est représenté par 
            une carte avec son numéro romain, son titre et un indicateur de progression (nombre de mots et statut). Cliquez sur un chapitre 
            pour basculer la zone de rédaction vers celui-ci."""),
            ("subsection", "Indicateur de progression"),
            ("body", """En haut de la barre latérale, une barre de progression verte indique l'avancement global de votre thèse par rapport 
            à un objectif de 80 000 mots. Le compteur de mots total se met à jour automatiquement à chaque sauvegarde."""),
            ("subsection", "Statuts des chapitres"),
            ("body", """Chaque chapitre possède un statut visuel :<br/>
            <b>\u25cf Gris</b> = Brouillon (aucun contenu)<br/>
            <b>\u25cf Ambre</b> = En cours de rédaction<br/>
            <b>\u25cf Bleu</b> = Soumis pour évaluation<br/>
            <b>\u25cf Vert</b> = Révisé et validé"""),
        ]
    },
    {
        "num": "3",
        "title": "Structure de la thèse",
        "content": [
            ("body", """ThesisFrame organise votre manuscrit selon la structure académique standard en 6 chapitres. Chaque chapitre 
            est préconfiguré avec des attentes spécifiques et une structure suggérée accessibles depuis le panneau Guide."""),
            ("subsection", "Les six chapitres"),
            ("bullet", "<b>I. Introduction générale</b> — Contexte, problématique, objectifs et plan de la thèse"),
            ("bullet", "<b>II. Données bibliographiques et cadre théorique</b> — Revue de littérature, cadre conceptuel et positionnement théorique"),
            ("bullet", "<b>III. Cadre méthodologique</b> — Design de recherche, outils de collecte et techniques d'analyse"),
            ("bullet", "<b>IV. Résultats</b> — Présentation des analyses et des principaux résultats"),
            ("bullet", "<b>V. Discussion</b> — Interprétation, mise en perspective et limites"),
            ("bullet", "<b>VI. Conclusion générale</b> — Synthèse globale, réponse à la problématique et contributions"),
            ("subsection", "Accéder au guide par chapitre"),
            ("body", """Dans le panneau droit, l'onglet <b>Guide</b> affiche en temps réel les attentes et la structure suggérée 
            du chapitre actif. Utilisez ces indications pour structurer votre rédaction de manière cohérente."""),
        ]
    },
    {
        "num": "4",
        "title": "Éditeur de texte",
        "content": [
            ("body", """L'éditeur de texte est la zone centrale de l'application. Il s'agit d'un éditeur plein écran où vous rédigez 
            directement le contenu de chaque chapitre. L'éditeur prend en charge la correction orthographique automatique du navigateur."""),
            ("subsection", "Sauvegarde automatique"),
            ("body", """ThesisFrame enregistre automatiquement votre travail toutes les 2 secondes après une modification. Un indicateur 
            visuel dans la barre supérieure vous informe du statut de sauvegarde :<br/>
            <b>Animation rotative</b> = Sauvegarde en cours<br/>
            <b>Coche verte</b> = Sauvegarde effectuée<br/>
            <b>Mode inactif</b> = Aucune modification en attente"""),
            ("subsection", "Compteur de mots"),
            ("body", """Le nombre de mots du chapitre actif est affiché en temps réel dans la barre supérieure et dans la barre latérale. 
            Le compteur global (somme de tous les chapitres) apparaît également dans la barre latérale et dans le pied de page."""),
            ("tip", "Astuce : le compteur de mots se met à jour automatiquement après chaque sauvegarde. Vous n'avez pas besoin de l'actualiser manuellement."),
        ]
    },
    {
        "num": "5",
        "title": "Assistant IA — Modes de rédaction",
        "content": [
            ("body", """L'assistant IA intégré dans le panneau droit (onglet <b>IA</b>) vous accompagne dans la rédaction avec 10 modes 
            spécialisés. Sélectionnez le mode adapté à votre besoin dans le menu déroulant, puis posez votre question."""),
            ("subsection", "Les 10 modes disponibles"),
            ("bullet", "<b>Rédaction scientifique</b> — Aide à la rédaction académique formelle et structurée"),
            ("bullet", "<b>Revue de littérature</b> — Synthèse et analyse critique de travaux existants"),
            ("bullet", "<b>Paraphrase</b> — Reformulation pour éviter le plagiat et améliorer le style"),
            ("bullet", "<b>Relecture critique</b> — Évaluation de la qualité, cohérence et rigueur du texte"),
            ("bullet", "<b>Résumé et Abstract</b> — Génération de résumés structurés (250-300 mots)"),
            ("bullet", "<b>Génération d'hypothèses</b> — Formulation d'hypothèses de recherche testables"),
            ("bullet", "<b>Positionnement méthodo.</b> — Aide au positionnement épistémologique et méthodologique"),
            ("bullet", "<b>Construction théorique</b> — Développement du cadre théorique et conceptuel"),
            ("bullet", "<b>Doc. de supervision</b> — Préparation de documents de suivi doctoral"),
            ("bullet", "<b>Présentation conf.</b> — Préparation de présentations de conférence et soutenances"),
            ("subsection", "Utilisation"),
            ("body", """Entrez votre question dans la zone de texte en bas du panneau IA et appuyez sur <b>Entrée</b> (ou cliquez sur 
            le bouton d'envoi). La réponse de l'IA s'affiche dans le fil de conversation. Vous pouvez poser plusieurs questions 
            successives dans le même contexte."""),
        ]
    },
    {
        "num": "6",
        "title": "Fournisseurs IA",
        "content": [
            ("body", """ThesisFrame supporte 7 fournisseurs d'intelligence artificielle. Vous pouvez configurer votre fournisseur préféré 
            via la boîte de dialogue accessible depuis le bouton paramètres (icône engrenage) à côté du sélecteur de mode."""),
            ("subsection", "Fournisseurs disponibles"),
            ("bullet", "<b>Z.ai</b> — Fournisseur par défaut, intégré nativement, aucune configuration requise"),
            ("bullet", "<b>Mistral AI</b> — Modèles Mistral (mistral-large, mistral-medium, etc.)"),
            ("bullet", "<b>OpenAI</b> — Modèles GPT-4, GPT-3.5 et variants"),
            ("bullet", "<b>Anthropic (Claude)</b> — Modèles Claude 3.5, Claude 3 Opus, etc."),
            ("bullet", "<b>Groq</b> — Inférence rapide (Llama, Mixtral)"),
            ("bullet", "<b>Ollama</b> — Modèles locaux (Llama 3, Mistral, etc.) pour utilisation hors ligne"),
            ("bullet", "<b>Custom</b> — Tout fournisseur compatible OpenAI API"),
            ("subsection", "Configuration"),
            ("body", """Cliquez sur l'icône engrenage pour ouvrir la boîte de paramètres. Sélectionnez votre fournisseur, entrez 
            votre clé API (stockée uniquement dans votre navigateur via localStorage) et le modèle souhaité. 
            Les URLs de base sont pré-remplies automatiquement pour chaque fournisseur connu."""),
            ("tip", "Sécurité : vos clés API sont stockées exclusivement dans le localStorage de votre navigateur. Elles ne sont jamais transmises à nos serveurs."),
        ]
    },
    {
        "num": "7",
        "title": "Feedback du directeur de thèse",
        "content": [
            ("body", """L'onglet <b>Dir.</b> dans le panneau droit simule un directeur de thèse exigeant. Cet outil n'écrit jamais 
            à votre place : il évalue, questionne et pousse à améliorer votre rédaction, exactement comme un vrai directeur 
            le ferait en réunion de suivi."""),
            ("subsection", "Soumission pour évaluation"),
            ("body", """Rédigez votre chapitre dans l'éditeur, puis cliquez sur <b>Soumettre ce chapitre</b> dans l'onglet Dir. 
            Le simulateur analysera votre texte selon 5 critères rigoureux et retournera un avis structuré comprenant :"""),
            ("bullet", "<b>Points solides</b> (2 maximum, concrets et spécifiés)"),
            ("bullet", "<b>Points à consolider</b> (faiblesses détectées avec passages cités)"),
            ("bullet", "<b>Question exigeante</b> — une question critique qui, sans réponse, ferait échouer une soutenance"),
            ("subsection", "Critères d'évaluation"),
            ("body", """Le directeur évalue systématiquement : la cohérence de la problématique, la validité de l'hypothèse, 
            le lien entre le chapitre et la question de recherche, le respect de l'étape du cycle de recherche, et les contraintes 
            institutionnelles (volume, structure IMRaD)."""),
        ]
    },
    {
        "num": "8",
        "title": "Analyse d'équilibre des chapitres",
        "content": [
            ("body", """L'analyse d'équilibre des chapitres est un outil de diagnostic intégré dans l'onglet Dir. qui calcule 
            en temps réel la répartition du volume entre vos chapitres et vous alerte sur les déséquilibres."""),
            ("subsection", "Règles d'analyse"),
            ("body", """L'outil applique les règles académiques suivantes :<br/>
            <b>Introduction</b> : environ 10 % du volume total<br/>
            <b>Chapitres du corps (II à V)</b> : tolérance de +/- 20 % entre eux (vert), 20-35 % (ambre), &gt; 35 % (rouge)<br/>
            <b>Conclusion</b> : environ 5 % du volume total"""),
            ("subsection", "Recommandations automatiques"),
            ("body", """L'outil génère des recommandations contextuelles selon les anomalies détectées : scinder un chapitre trop 
            volumineux, fusionner deux chapitres trop courts, ou approfondir un chapitre insuffisant. Les barres horizontales 
            colorées avec marqueur de moyenne vous donnent une vue d'ensemble instantanée."""),
            ("subsection", "Verdict global"),
            ("body", """Un verdict synthétique est affiché en bas de l'analyse : <b>Satisfaisant</b> (vert), <b>À corriger</b> (ambre) 
            ou <b>Critique</b> (rouge). L'estimation en pages est basée sur 250 mots par page."""),
        ]
    },
    {
        "num": "9",
        "title": "Guide méthodologique",
        "content": [
            ("body", """Le guide méthodologique est accessible via le bouton <b>Guide rédaction</b> dans la barre latérale des outils. 
            Il offre un parcours interactif à travers les étapes de la recherche scientifique."""),
            ("subsection", "Contenu du guide"),
            ("bullet", "<b>Cycle de la recherche</b> — 8 étapes de la question de recherche à la conclusion"),
            ("bullet", "<b>Types de recherche</b> — Quantitative, qualitative, mixte, documentaire, expérimentale, action"),
            ("bullet", "<b>Formulation de la problématique</b> — Questions QUOI/COMMENT/POURQUOI"),
            ("bullet", "<b>Opérationnalisation des concepts</b> — Dimensions et indicateurs de mesure"),
            ("bullet", "<b>Outils de collecte</b> — Questionnaires, entretiens, observation, analyse de contenu"),
            ("bullet", "<b>Sources documentaires</b> — Guides et liens vers les bases de données"),
            ("body", """Chaque section inclut des explications détaillées, des exemples concrets et des conseils pratiques. 
            Le guide est entièrement en français et adapté aux normes académiques francophones."""),
        ]
    },
    {
        "num": "10",
        "title": "Recherche documentaire",
        "content": [
            ("body", """L'outil de recherche documentaire (bouton <b>Recherche litt.</b> dans la barre latérale) effectue des recherches 
            parallèles dans 5 sources académiques gratuites, sans nécessité de clé API ni de compte."""),
            ("subsection", "Sources disponibles"),
            ("bullet", "<b>OpenAlex</b> — Catalogue ouvert de métadonnées académiques (plus de 250 millions de travaux)"),
            ("bullet", "<b>Crossref</b> — Base de données de DOI et métadonnées de publications"),
            ("bullet", "<b>arXiv</b> — Preprints en sciences exactes, mathématiques et informatique"),
            ("bullet", "<b>PubMed</b> — Littérature biomédicale et sciences de la santé"),
            ("bullet", "<b>Semantic Scholar</b> — Recherche sémantique avec citations et références"),
            ("subsection", "Fonctionnalités"),
            ("body", """Pour chaque résultat, vous pouvez consulter le résumé (abstract), copier la référence BibTeX en un clic, 
            accéder au DOI, et voir le nombre de citations. Les résultats de toutes les sources sont fusionnés et triés par pertinence. 
            Vous pouvez sélectionner ou désélectionner les sources selon votre domaine de recherche."""),
        ]
    },
    {
        "num": "11",
        "title": "Références bibliographiques",
        "content": [
            ("body", """Le gestionnaire de références (bouton <b>Références biblio.</b>) vous permet de constituer votre 
            bibliographie directement dans ThesisFrame."""),
            ("subsection", "Ajout de références"),
            ("body", """Vous pouvez ajouter des références manuellement ou importer un fichier BibTeX existant. Chaque référence 
            est stockée avec ses métadonnées complètes : auteur(s), titre, année, journal, DOI, et mots-clés."""),
            ("subsection", "Import BibTeX"),
            ("body", """L'import BibTeX supporte les entrées standard (@article, @book, @inproceedings, @phdthesis, etc.). 
            Collez votre contenu BibTeX ou uploadez un fichier .bib pour importer automatiquement toutes les références."""),
            ("subsection", "Organisation"),
            ("body", """Les références sont taguées avec des mots-clés personnalisables. Vous pouvez les filtrer, les modifier 
            ou les supprimer individuellement. Les références servent de base pour la génération automatique de la bibliographie 
            lors de l'export PDF."""),
        ]
    },
    {
        "num": "12",
        "title": "Export PDF",
        "content": [
            ("body", """L'export PDF (bouton <b>Export PDF</b> dans la barre latérale) génère un document professionnel contenant 
            l'intégralité de votre thèse, formatée selon les standards académiques."""),
            ("subsection", "Paramètres d'export"),
            ("body", """Avant l'export, vous pouvez configurer :<br/>
            <b>Université</b> — Nom de votre établissement<br/>
            <b>Faculté / Département</b> — Votre unité de recherche<br/>
            <b>Mots-clés</b> — Termes de recherche de la thèse<br/>
            <b>Auteur</b> — Votre nom (prénom et nom)"""),
            ("subsection", "Format du document"),
            ("body", """Le PDF généré comprend une page de couverture avec les métadonnées, la table des matières, et les 6 chapitres 
            formatés avec une typographie serif académique. Les pages sont numérotées et le document respecte les marges standard 
            pour impression ou dépôt numérique."""),
            ("tip", "Conseil : vérifiez les métadonnées (université, auteur, mots-clés) avant chaque export pour garantir un document conforme aux exigences de votre établissement."),
        ]
    },
    {
        "num": "13",
        "title": "Sauvegarde cloud Google Drive",
        "content": [
            ("body", """ThesisFrame intègre une sauvegarde cloud via Google Drive (bouton <b>Sauvegarde cloud</b> dans la barre latérale). 
            Cette fonctionnalité vous permet de sauvegarder des instantanés de votre thèse directement dans votre Google Drive."""),
            ("subsection", "Connexion"),
            ("body", """Cliquez sur le bouton de connexion pour autoriser ThesisFrame à accéder à votre Google Drive via OAuth 2.0. 
            Les tokens d'accès sont stockés de manière sécurisée dans la base de données de l'application et rafraîchis automatiquement."""),
            ("subsection", "Sauvegarde"),
            ("body", """Une fois connecté, cliquez sur <b>Sauvegarder maintenant</b> pour créer un instantané de votre thèse dans 
            un dossier dédié sur votre Google Drive. Chaque sauvegarde est horodatée pour un suivi chronologique."""),
            ("subsection", "Restauration"),
            ("body", """Vous pouvez consulter la liste de vos sauvegardes et télécharger un instantané antérieur pour restaurer 
            votre travail. La déconnexion est possible à tout moment depuis l'interface."""),
        ]
    },
    {
        "num": "14",
        "title": "Conseils et FAQ",
        "content": [
            ("subsection", "Bonnes pratiques"),
            ("bullet", "Rédigez régulièrement, même de petites sections, plutôt que de tout écrire en une seule fois"),
            ("bullet", "Utilisez l'assistant IA pour surmonter le syndrome de la page blanche, puis retravaillez le texte"),
            ("bullet", "Soumettez régulièrement vos chapitres au directeur simulé pour identifier les faiblesses tôt"),
            ("bullet", "Consultez l'analyse d'équilibre après chaque chapitre pour maintenir un volume homogène"),
            ("bullet", "Sauvegardez régulièrement sur Google Drive pour ne jamais perdre votre travail"),
            ("subsection", "Questions fréquentes"),
            ("body", """<b>Q : Mes données sont-elles sécurisées ?</b><br/>
            R : Oui. Le texte de votre thèse est sauvegardé dans une base de données locale. Les clés API sont stockées 
            uniquement dans votre navigateur (localStorage) et ne sont jamais envoyées à nos serveurs.<br/><br/>
            <b>Q : Puis-je utiliser ThesisFrame hors ligne ?</b><br/>
            R : L'éditeur de texte fonctionne hors ligne, mais les fonctionnalités IA, la recherche documentaire et 
            la sauvegarde cloud nécessitent une connexion internet.<br/><br/>
            <b>Q : Puis-je changer de fournisseur IA en cours de rédaction ?</b><br/>
            R : Oui. Les paramètres du fournisseur sont modifiés instantanément depuis le menu des paramètres. 
            Vos conversations IA antérieures restent dans le fil de discussion.<br/><br/>
            <b>Q : Comment réinitialiser ma thèse ?</b><br/>
            R : Vous pouvez réinitialiser chaque chapitre individuellement via le menu contextuel ou le panneau de configuration. 
            Il est recommandé d'exporter un PDF de sauvegarde avant toute réinitialisation."""),
        ]
    },
]

# ─── Build PDF ──────────────────────────────────────────────────

def add_header_footer(canvas, doc):
    """Add footer with page number on every page except cover."""
    page_num = doc.page
    if page_num <= 1:
        return
    canvas.saveState()
    # Footer line
    canvas.setStrokeColor(EMERALD_MID)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 1.2*cm, PAGE_W - MARGIN, 1.2*cm)
    # Footer text
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(SLATE)
    canvas.drawString(MARGIN, 0.6*cm, "ThesisFrame \u00a9 2025 \u2014 Notice d'utilisation")
    canvas.drawRightString(PAGE_W - MARGIN, 0.6*cm, f"Page {page_num - 1}")
    # Thin emerald accent at top
    canvas.setStrokeColor(EMERALD)
    canvas.setLineWidth(2)
    canvas.line(MARGIN, PAGE_H - 1*cm, PAGE_W - MARGIN, PAGE_H - 1*cm)
    canvas.restoreState()


def build_cover():
    """Build the cover page elements."""
    elements = []
    usable = PAGE_W - 2 * MARGIN

    elements.append(Spacer(1, 40*mm))

    # Decorative top bar
    elements.append(EmeraldBar(usable, height=4*mm, color=EMERALD))
    elements.append(Spacer(1, 15*mm))

    # Title
    elements.append(Paragraph("ThesisFrame", S['cover_title']))
    elements.append(Spacer(1, 3*mm))

    # Thin separator
    elements.append(EmeraldBar(60*mm, height=1.5*mm, color=EMERALD_MID))
    elements.append(Spacer(1, 10*mm))

    # Subtitle
    elements.append(Paragraph("Notice d'utilisation", S['cover_subtitle']))
    elements.append(Spacer(1, 5*mm))

    # Description
    desc_style = ParagraphStyle(
        'CoverDesc', parent=S['body'],
        fontSize=11, leading=17, alignment=TA_CENTER, textColor=SLATE,
        leftIndent=15*mm, rightIndent=15*mm,
    )
    elements.append(Paragraph(
        "Guide complet de l'assistant de rédaction académique pour thèses de doctorat",
        desc_style
    ))
    elements.append(Spacer(1, 30*mm))

    # Version box
    version_data = [
        ["Version 1.0"],
        ["2025"],
    ]
    version_table = Table(version_data, colWidths=[50*mm])
    version_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (0,0), 11),
        ('FONTSIZE', (0,1), (0,1), 10),
        ('TEXTCOLOR', (0,0), (-1,-1), EMERALD),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('BOX', (0,0), (-1,-1), 1, EMERALD_MID),
        ('BACKGROUND', (0,0), (-1,-1), ACCENT_BG),
        ('ROUNDEDCORNERS', [3, 3, 3, 3]),
    ]))
    elements.append(version_table)

    elements.append(Spacer(1, 30*mm))

    # Bottom decorative bar
    elements.append(EmeraldBar(usable, height=2*mm, color=EMERALD_MID))

    elements.append(PageBreak())
    return elements


def build_toc():
    """Build the table of contents."""
    elements = []
    usable = PAGE_W - 2 * MARGIN

    elements.append(Paragraph("Table des matières", S['toc_title']))
    elements.append(EmeraldBar(usable, height=2*mm, color=EMERALD))
    elements.append(Spacer(1, 6*mm))

    for sec in SECTIONS:
        line = f"<b>{sec['num']}.</b>&nbsp;&nbsp;&nbsp;{sec['title']}"
        elements.append(Paragraph(line, S['toc_entry']))

    elements.append(Spacer(1, 10*mm))
    elements.append(PageBreak())
    return elements


def build_section(sec):
    """Build section content elements."""
    elements = []
    usable = PAGE_W - 2 * MARGIN

    # Section header with number
    elements.append(Paragraph(
        f"<font color='#059669'>{sec['num']}.</font>&nbsp;&nbsp;{sec['title']}",
        S['section_title']
    ))
    elements.append(EmeraldBar(usable, height=2*mm, color=EMERALD_MID))
    elements.append(Spacer(1, 3*mm))

    for item in sec['content']:
        kind, text = item
        if kind == "body":
            elements.append(Paragraph(text, S['body']))
        elif kind == "body_bold":
            elements.append(Paragraph(text, S['body_bold']))
        elif kind == "subsection":
            elements.append(Paragraph(text, S['subsection']))
        elif kind == "bullet":
            elements.append(Paragraph(
                f"\u25b8&nbsp;&nbsp;{text}",
                S['bullet']
            ))
        elif kind == "tip":
            elements.append(AccentBox(
                text,
                usable,
                S['tip']
            ))
            elements.append(Spacer(1, 2*mm))

    return elements


def main():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=1.5*cm,
        bottomMargin=1.8*cm,
    )

    elements = []

    # 1. Cover page
    elements.extend(build_cover())

    # 2. Table of contents
    elements.extend(build_toc())

    # 3. Sections
    for sec in SECTIONS:
        section_elements = build_section(sec)
        elements.extend(section_elements)

    # Build PDF
    doc.build(elements, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    print(f"PDF generated: {OUTPUT_PATH}")
    size = os.path.getsize(OUTPUT_PATH)
    print(f"File size: {size:,} bytes ({size/1024:.1f} KB)")


if __name__ == "__main__":
    main()
